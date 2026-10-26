import { tool } from 'ai';
import { z } from 'zod';

export const getPresentation = tool({
  description:
    'This tool returns a concise personal introduction of Om Prakash Pattjoshi. It is used to answer the question "Who are you?" or "Tell me about yourself"',
  inputSchema: z.object({}),
  execute: async () => {
    return {
      presentation:
        "Here is a little bit about me, you can see it above!",
    };
  },
});