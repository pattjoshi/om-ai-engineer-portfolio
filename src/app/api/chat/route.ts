import { createGroq } from '@ai-sdk/groq';
import { createMistral } from '@ai-sdk/mistral';
import { streamText, type LanguageModel, type StreamTextResult } from 'ai';
import { SYSTEM_PROMPT } from './prompt';
import {
  getProviderStatusCode,
  logProviderError,
  SAFE_CHAT_ERROR,
  shouldUseFallback,
} from './provider-fallback';
import { checkGlobalLimit, checkRateLimit, getClientKey } from './rate-limit';
import { getContact } from './tools/getContact';
import { getCrazy } from './tools/getCrazy';
import { getInternship } from './tools/getInternship';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';

export const maxDuration = 30;

// Input limits: the client fully controls the request body, so cap what we
// forward to the (paid) model. Older turns are dropped — they add tokens on
// every request but rarely change the answer for a portfolio chat.
const MAX_BODY_BYTES = 64 * 1024;
const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 2000;
const MAX_OUTPUT_TOKENS = 800;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

// Only plain user/assistant text survives. A client-supplied "system"
// message (prompt injection to override the persona) or tool payloads are
// discarded; the server prepends its own SYSTEM_PROMPT.
function sanitizeMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null;
  const cleaned: ChatMessage[] = [];
  for (const m of raw) {
    if (!m || typeof m !== 'object') continue;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') {
      continue;
    }
    const text = content.trim().slice(0, MAX_MESSAGE_CHARS);
    if (text) cleaned.push({ role, content: text });
  }
  const recent = cleaned.slice(-MAX_HISTORY_MESSAGES);
  if (recent.length === 0 || recent[recent.length - 1].role !== 'user') {
    return null;
  }
  return recent;
}

const MISTRAL_MODEL = process.env.MISTRAL_MODEL ?? 'mistral-small-latest';
// Primary Groq model first, then backups with their own separate quotas.
const GROQ_MODELS = [
  process.env.GROQ_MODEL ?? 'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
].filter((m, i, all) => all.indexOf(m) === i);

// Per warm instance: models that returned 429 are skipped for a while so
// requests don't pay a failed round-trip to an exhausted model every time.
const MODEL_COOLDOWN_MS = 5 * 60_000;
const rateLimitedUntil = new Map<string, number>();

const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const tools = {
  getProjects,
  getPresentation,
  getResume,
  getContact,
  getSkills,
  getCrazy,
  getInternship,
};

function startChat(
  model: LanguageModel,
  messages: Parameters<typeof streamText>[0]['messages'],
) {
  return streamText({
    model,
    messages,
    tools,
    toolCallStreaming: true,
    maxSteps: 2,
    maxTokens: MAX_OUTPUT_TOKENS,
    // Fail over instead of retrying the same provider.
    maxRetries: 0,
  });
}

/**
 * Continue a stream after the first chunk has already been read from `reader`.
 * A second `fullStream` access would tee() and replay the first chunk
 * (AI SDK 4 StreamTextResult.teeStream).
 */
function continueFromPeekedChunk(
  result: StreamTextResult<typeof tools, never>,
  reader: ReadableStreamDefaultReader<unknown>,
  first: ReadableStreamReadResult<unknown>,
): StreamTextResult<typeof tools, never> {
  const reconstructed = new ReadableStream({
    async start(controller) {
      if (!first.done && first.value !== undefined) {
        controller.enqueue(first.value);
      }
    },
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      controller.enqueue(value);
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });

  Object.defineProperty(result, 'fullStream', {
    get: () => reconstructed,
    configurable: true,
  });

  return result;
}

export async function POST(req: Request) {
  let rateLimit = checkRateLimit(getClientKey(req));
  if (!rateLimit.limited) rateLimit = checkGlobalLimit();
  if (rateLimit.limited) {
    return new Response(
      'Too many messages — please slow down and try again shortly.',
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  try {
    const declared = Number(req.headers.get('content-length') ?? 0);
    if (declared > MAX_BODY_BYTES) {
      return new Response('Request too large.', { status: 413 });
    }
    // content-length can be absent or wrong (chunked), so check the real size.
    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return new Response('Request too large.', { status: 413 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      return new Response('Invalid request.', { status: 400 });
    }

    const userMessages = sanitizeMessages(
      (parsed as { messages?: unknown } | null)?.messages,
    );
    if (!userMessages) {
      return new Response('Invalid request.', { status: 400 });
    }
    const messages = [SYSTEM_PROMPT, ...userMessages] as Parameters<
      typeof streamText
    >[0]['messages'];

    // Ordered candidates: Mistral only when a key is configured, then each
    // Groq model. Groq quotas (incl. tokens-per-day) are per model, so when
    // one model is exhausted the next one usually still has headroom.
    const candidates: { provider: string; modelId: string; model: LanguageModel }[] = [];
    if (process.env.MISTRAL_API_KEY) {
      candidates.push({ provider: 'mistral', modelId: MISTRAL_MODEL, model: mistral(MISTRAL_MODEL) });
    }
    if (process.env.GROQ_API_KEY) {
      for (const id of GROQ_MODELS) {
        candidates.push({ provider: 'groq', modelId: id, model: groq(id) });
      }
    }
    if (candidates.length === 0) {
      console.error('[CHAT-API] No AI provider key configured');
      return new Response(SAFE_CHAT_ERROR, { status: 503 });
    }

    // Skip models that recently hit their quota (keep at least one to try).
    const now = Date.now();
    const available = candidates.filter(
      (c) => (rateLimitedUntil.get(c.modelId) ?? 0) <= now,
    );
    const ordered = available.length > 0 ? available : candidates;

    for (let i = 0; i < ordered.length; i++) {
      const { provider, modelId, model } = ordered[i];
      const isLast = i === ordered.length - 1;

      const result = startChat(model, messages);
      const reader = result.fullStream.getReader();
      const first = await reader.read();

      const error =
        !first.done &&
        first.value != null &&
        typeof first.value === 'object' &&
        'type' in first.value &&
        first.value.type === 'error'
          ? (first.value as { type: 'error'; error: unknown }).error
          : undefined;

      // 404 = model retired/unavailable for this account: skip to the next.
      const modelMissing = getProviderStatusCode(error) === 404;
      if (error !== undefined && !isLast && (shouldUseFallback(error) || modelMissing)) {
        await reader.cancel();
        if (getProviderStatusCode(error) === 429) {
          rateLimitedUntil.set(modelId, Date.now() + MODEL_COOLDOWN_MS);
        }
        logProviderError(provider, modelId, error, { fallbackAttempted: true });
        continue;
      }

      if (error !== undefined) {
        logProviderError(provider, modelId, error, { fallbackAttempted: false });
      } else {
        console.log('[CHAT-API] Serving with', provider, modelId);
      }

      return continueFromPeekedChunk(result, reader, first).toDataStreamResponse({
        getErrorMessage: () => SAFE_CHAT_ERROR,
      });
    }

    return new Response(SAFE_CHAT_ERROR, { status: 503 });
  } catch (err) {
    console.error(
      '[CHAT-API] Global error:',
      err instanceof Error ? err.message : 'unknown',
    );
    return new Response(SAFE_CHAT_ERROR, { status: 500 });
  }
}
