
import { tool } from "ai";
import { z } from "zod";


export const getCrazy = tool({
  description:
    "This tool will tell the craziest thing I've ever done. Use it when the user asks something like: 'What's the craziest thing you've ever done?'",
  parameters: z.object({}),
  execute: async () => {
    return "Rebuilt my entire portfolio as an AI-native experience that answers questions better than I do 🤖. Recruiters didn't know whether to hire me or the bot. 😅";
  },
});