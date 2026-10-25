// Canned replies for trivial messages that don't need an LLM call at all —
// greetings, thanks, goodbyes. Saves a Mistral/Groq request for the most
// common "just saying hi" case. Deliberately conservative: only matches when
// the WHOLE message is small talk (optionally with punctuation/emoji), never
// a substring, so "hi, what are your skills?" still goes to the LLM.

type Rule = { pattern: RegExp; replies: string[] };

const PUNCT = `[!.,?~\\s'"🙂😊👋🤖✨]*`;

const RULES: Rule[] = [
  {
    pattern: new RegExp(
      `^${PUNCT}(hi+|hello+|hey+|heya|yo|sup|greetings|good\\s?(morning|afternoon|evening))${PUNCT}$`,
      'i',
    ),
    replies: [
      "Hey! 👋 Ask me anything about my projects, skills, or experience.",
      "Hello! Good to see you. What do you want to know about me?",
      "Hey there! Ask away — projects, skills, or how to reach me, I've got it all.",
    ],
  },
  {
    pattern: new RegExp(
      `^${PUNCT}(thanks+|thank\\s?you+|thx|ty|appreciate\\s?it)${PUNCT}$`,
      'i',
    ),
    replies: [
      "Anytime! 🙌 Let me know if you want to dig into anything else.",
      "You're welcome! Feel free to ask more.",
    ],
  },
  {
    pattern: new RegExp(
      `^${PUNCT}(bye+|goodbye|see\\s?ya|cya|take\\s?care|later)${PUNCT}$`,
      'i',
    ),
    replies: [
      "Take care! 👋 Feel free to come back anytime.",
      "See you around — good luck out there!",
    ],
  },
  {
    pattern: new RegExp(
      `^${PUNCT}(how\\s?(are|r)\\s?(you|u)\\??|how'?s\\s?it\\s?going\\??)${PUNCT}$`,
      'i',
    ),
    replies: [
      "Doing great, thanks for asking! Building cool AI stuff as usual 😄. What about you — want to know more about my work?",
    ],
  },
];

export function matchSmallTalk(query: string): string | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  for (const rule of RULES) {
    if (rule.pattern.test(trimmed)) {
      return rule.replies[Math.floor(Math.random() * rule.replies.length)];
    }
  }
  return null;
}
