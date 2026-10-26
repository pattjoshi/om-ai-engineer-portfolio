import type { UIMessage } from 'ai';

export type ToolPart = {
  toolCallId: string;
  toolName: string;
  done: boolean;
  outputText?: string;
};

// AI SDK v5 encodes a tool call as a part typed `tool-<toolName>` whose
// `state` progresses to `output-available` once the tool has returned.
export function getToolParts(message: UIMessage): ToolPart[] {
  const tools: ToolPart[] = [];
  for (const part of message.parts) {
    if (!part.type.startsWith('tool-')) continue;
    const p = part as {
      type: string;
      toolCallId: string;
      state?: string;
      output?: unknown;
    };
    // Tools return either a string or e.g. { presentation: string }.
    const out = p.output;
    const outputText =
      typeof out === 'string'
        ? out
        : out && typeof out === 'object'
          ? Object.values(out).find((v): v is string => typeof v === 'string')
          : undefined;
    tools.push({
      toolCallId: p.toolCallId,
      toolName: p.type.slice('tool-'.length),
      done: p.state === 'output-available',
      outputText,
    });
  }
  return tools;
}

export function getMessageText(message: UIMessage): string {
  return message.parts
    .map((p) => (p.type === 'text' ? p.text : ''))
    .join('')
    .trim();
}
