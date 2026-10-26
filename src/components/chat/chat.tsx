'use client';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

// Component imports
import ChatBottombar from '@/components/chat/chat-bottombar';
import ChatLanding from '@/components/chat/chat-landing';
import ChatMessageContent from '@/components/chat/chat-message-content';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import WelcomeModal from '@/components/welcome-modal';
import { Info } from 'lucide-react';
import { matchSmallTalk } from '@/lib/smallTalk';
import { matchStaticAnswer } from '@/lib/staticAnswers';
import { getToolParts } from '@/lib/chatParts';
import HelperBoost from './HelperBoost';

// ClientOnly component for client-side rendering
//@ts-ignore
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

// Define Avatar component props interface
interface AvatarProps {
  hasActiveTool: boolean;
  isTalking: boolean;
}

// Dynamic import of Avatar component
const Avatar = dynamic<AvatarProps>(
  () =>
    Promise.resolve(({ hasActiveTool, isTalking }: AvatarProps) => {
      return (
        <div
          className={`flex items-center justify-center transition-all duration-300 ${hasActiveTool ? 'h-20 w-20' : 'h-28 w-28'}`}
        >
          <div
            className="relative h-full w-full cursor-pointer"
            onClick={() => (window.location.href = '/')}
          >
            <Image
              src="/avatar-om-face-v2.webp"
              alt="Om avatar"
              width={112}
              height={120}
              priority
              className={`h-full w-full object-contain transition-transform duration-300 ${isTalking ? 'scale-105' : 'scale-100'}`}
            />
          </div>
        </div>
      );
    }),
  { ssr: false }
);

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: 'easeOut',
  },
};

const Chat = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query');
  // A ref (not state) because React 19's StrictMode double-invokes effects
  // in dev: a state-based guard commits too late to stop the second
  // invocation from also firing submitQuery, which would send two live LLM
  // requests for a single `?query=` navigation. A ref is synchronous.
  const autoSubmittedRef = useRef(false);
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    onError: (error) => {
      console.error('Chat error:', error.message);
      const msg = error.message ?? '';
      if (/too many|slow down|429/i.test(msg)) {
        toast.warning("You're sending messages a bit fast", {
          description: 'Give it a few seconds, then try again.',
        });
      } else if (/failed to fetch|network/i.test(msg)) {
        toast.error("Can't reach the server", {
          description: 'Check your internet connection and try again.',
        });
      } else {
        toast.error('My AI brain is taking a short break', {
          description:
            'Try again in a moment — or use the quick buttons below (Me, Projects, Skills, Contact), they always work.',
        });
      }
    },
  });

  // v5 exposes a single status instead of isLoading/onResponse callbacks.
  const isLoading = status === 'submitted' || status === 'streaming';
  const loadingSubmit = status === 'submitted';
  const isTalking = status === 'streaming';

  const { currentAIMessage, latestUserMessage, hasActiveTool } = useMemo(() => {
    const latestAIMessageIndex = messages.findLastIndex(
      (m) => m.role === 'assistant'
    );
    const latestUserMessageIndex = messages.findLastIndex(
      (m) => m.role === 'user'
    );

    const currentAIMessage =
      latestAIMessageIndex !== -1 && latestAIMessageIndex > latestUserMessageIndex
        ? messages[latestAIMessageIndex]
        : null;

    return {
      currentAIMessage,
      latestUserMessage:
        latestUserMessageIndex !== -1 ? messages[latestUserMessageIndex] : null,
      hasActiveTool: currentAIMessage
        ? getToolParts(currentAIMessage).some((t) => t.done)
        : false,
    };
  }, [messages]);

  const isToolInProgress = messages.some(
    (m) => m.role === 'assistant' && getToolParts(m).some((t) => !t.done)
  );

  const submitQuery = (query: string) => {
    if (!query.trim() || isToolInProgress || isLoading) return;

    // Answer locally when the reply is already known: small talk gets a
    // canned line, and quick questions (projects, skills, contact…) render
    // their static card. No Mistral/Groq call, no latency, no rate limit.
    const smallTalk = matchSmallTalk(query);
    const staticAnswer = smallTalk ? null : matchStaticAnswer(query);
    if (smallTalk || staticAnswer) {
      const now = Date.now();
      const text = smallTalk ?? staticAnswer!.text;
      const assistantParts: UIMessage['parts'] = staticAnswer
        ? [
            {
              type: `tool-${staticAnswer.toolName}`,
              toolCallId: `local-${now}`,
              state: 'output-available',
              input: {},
              output: text,
            } as UIMessage['parts'][number],
            { type: 'text', text },
          ]
        : [{ type: 'text', text }];

      setMessages([
        ...messages,
        { id: `local-${now}`, role: 'user', parts: [{ type: 'text', text: query }] },
        { id: `local-${now + 1}`, role: 'assistant', parts: assistantParts },
      ]);
      return;
    }

    sendMessage({ text: query });
  };

  useEffect(() => {
    if (initialQuery && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true;
      submitQuery(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isToolInProgress) return;
    submitQuery(input);
    setInput('');
  };

  const handleStop = () => {
    stop();
  };

  // Check if this is the initial empty state (no messages)
  const isEmptyState =
    !currentAIMessage && !latestUserMessage && !loadingSubmit;

  // Calculate header height based on hasActiveTool
  const headerHeight = hasActiveTool ? 100 : 180;

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute top-6 right-8 z-51 flex flex-col-reverse items-center justify-center gap-1 md:flex-row">
        <WelcomeModal
          trigger={
            <div className="hover:bg-accent cursor-pointer rounded-2xl px-3 py-1.5">
              <Info className="text-accent-foreground h-8" />
            </div>
          }
        />
      </div>

      {/* Fixed Avatar Header with Gradient */}
      <div
        className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-b from-white via-white/95 via-50% to-transparent dark:from-black dark:via-black/95 dark:via-50% dark:to-transparent"
      >
        <div
          className={`transition-all duration-300 ease-in-out ${hasActiveTool ? 'pt-6 pb-0' : 'py-6'}`}
        >
          <div className="flex justify-center">
            <ClientOnly>
              <Avatar
                hasActiveTool={hasActiveTool}
                isTalking={isTalking}
              />
            </ClientOnly>
          </div>

          <AnimatePresence>
            {latestUserMessage && !currentAIMessage && (
              <motion.div
                {...MOTION_CONFIG}
                className="mx-auto flex max-w-3xl px-4"
              >
                <ChatBubble variant="sent">
                  <ChatBubbleMessage>
                    <ChatMessageContent message={latestUserMessage} />
                  </ChatBubbleMessage>
                </ChatBubble>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto flex h-full max-w-3xl flex-col">
        {/* Scrollable Chat Content */}
        <div
          className="flex-1 overflow-y-auto px-2"
          style={{ paddingTop: `${headerHeight}px` }}
        >
          <AnimatePresence mode="wait">
            {isEmptyState ? (
              <motion.div
                key="landing"
                className="flex min-h-full items-center justify-center"
                {...MOTION_CONFIG}
              >
                <ChatLanding submitQuery={submitQuery} />
              </motion.div>
            ) : currentAIMessage ? (
              <div className="pb-4">
                <SimplifiedChatView message={currentAIMessage} />
              </div>
            ) : (
              loadingSubmit && (
                <motion.div
                  key="loading"
                  {...MOTION_CONFIG}
                  className="px-4 pt-18"
                >
                  <ChatBubble variant="received">
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

{/* Fixed Bottom Bar */}
<div
  className="sticky bottom-0 px-2 pt-3 md:px-0 md:pb-4 transition-colors duration-300 bg-white dark:bg-black"
>
  <div className="relative flex flex-col items-center gap-3">
    <HelperBoost submitQuery={submitQuery} setInput={setInput} />
    <ChatBottombar
      input={input}
      handleInputChange={(e) => setInput(e.target.value)}
      handleSubmit={onSubmit}
      isLoading={isLoading}
      stop={handleStop}
      isToolInProgress={isToolInProgress}
    />
  </div>
</div>

        <a
          href="https://linkedin.com/in/om-prakash-pattjoshi"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed right-3 bottom-0 z-10 mb-4 hidden cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm hover:underline md:block"
        >
          @om-prakash-pattjoshi
        </a>
      </div>
    </div>
  );
};

export default Chat;
