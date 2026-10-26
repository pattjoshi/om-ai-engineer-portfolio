'use client';

import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import { getMessageText, getToolParts } from '@/lib/chatParts';
import type { UIMessage } from 'ai';
import { motion } from 'framer-motion';
import ChatMessageContent from './chat-message-content';
import ToolRenderer from './tool-renderer';

interface SimplifiedChatViewProps {
  message: UIMessage;
}

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: 'easeOut',
  },
};

export function SimplifiedChatView({ message }: SimplifiedChatViewProps) {
  if (message.role !== 'assistant') return null;

  // Only display the first completed tool (if any)
  const currentTool = getToolParts(message)
    .filter((t) => t.done)
    .slice(0, 1);

  const hasTools = currentTool.length > 0;
  // The model stops after a tool call, so the tool's own reply is the text.
  const fallbackText = !getMessageText(message) ? currentTool[0]?.outputText : undefined;
  const textMessage: UIMessage = fallbackText
    ? { id: message.id, role: 'assistant', parts: [{ type: 'text', text: fallbackText }] }
    : message;
  const hasTextContent = getMessageText(textMessage).length > 0;

  return (
    <motion.div {...MOTION_CONFIG} className="flex h-full w-full flex-col px-4">
      {/* Single scrollable container for both tool and text content */}
      <div className="custom-scrollbar flex h-full w-full flex-col overflow-y-auto">
        {/* Tool invocation result - displayed at the top */}
        {hasTools && (
          <div className="mb-4 w-full">
            <ToolRenderer
              toolInvocations={currentTool}
              messageId={message.id || 'current-msg'}
            />
          </div>
        )}

        {/* Text content */}
        {hasTextContent && (
          <div className="w-full">
            <ChatBubble variant="received" className="w-full">
              <ChatBubbleMessage className="w-full">
                <ChatMessageContent message={textMessage} />
              </ChatBubbleMessage>
            </ChatBubble>
          </div>
        )}

        {/* Add some padding at the bottom for better scrolling experience */}
        <div className="pb-4"></div>
      </div>
    </motion.div>
  );
}
