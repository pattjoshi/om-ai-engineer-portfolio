// Questions whose answer is a fixed UI card (projects, skills, contact…) don't
// need an LLM round-trip: the card renders from local data either way. Serving
// them locally makes the quick-question buttons instant, free, and immune to
// the chat API's rate limit.

export type StaticAnswer = { toolName: string; text: string };

const ANSWERS: Record<string, StaticAnswer> = {
  presentation: {
    toolName: 'getPresentation',
    text: "That's me! GenAI Engineer building RAG pipelines, multi-agent workflows and full-stack AI products. Ask me anything about my work 🚀",
  },
  projects: {
    toolName: 'getProjects',
    text: 'Here are my projects — tap any card for details. Want me to go deeper on one of them?',
  },
  skills: {
    toolName: 'getSkills',
    text: 'Here is my stack — from LLMs and agentic AI to full-stack and cloud. Curious about any of them?',
  },
  contact: {
    toolName: 'getContact',
    text: "Here's how to reach me — I'm always happy to chat about GenAI, agents, or a new opportunity!",
  },
  resume: {
    toolName: 'getResume',
    text: 'Here is my resume — it opens on Google Drive.',
  },
  crazy: {
    toolName: 'getCrazy',
    text: 'Fair warning, it gets a little nerdy 😄',
  },
  internship: {
    toolName: 'getInternship',
    text: "Yes, I'm open to new opportunities! Here are the details 👇",
  },
};

// Exact quick-question strings used by the homepage, chat landing and the
// HelperBoost buttons/drawer.
const EXACT: Record<string, keyof typeof ANSWERS> = {
  'who are you? i want to know more about you.': 'presentation',
  'who are you?': 'presentation',
  'what are your projects? what are you working on right now?': 'projects',
  'what projects have you worked on?': 'projects',
  'what projects are you most proud of?': 'projects',
  'what are your skills? give me a list of your soft and hard skills.': 'skills',
  'what are your skills?': 'skills',
  'how can i contact you?': 'contact',
  'how can i reach you?': 'contact',
  'how can i reach you? what kind of project would make you say "yes" immediately?':
    'contact',
  'can i see your resume?': 'resume',
  "what's the craziest thing you've ever done?": 'crazy',
  "what's the craziest thing you've ever done? what are your hobbies?": 'crazy',
  "what the craziest thing you've ever done? (mb?) what are your hobbies?": 'crazy',
  'are you open to new opportunities?': 'internship',
};

// Loose matches, only for SHORT messages — a long question that merely
// mentions "project" deserves a real LLM answer.
const PATTERNS: [RegExp, keyof typeof ANSWERS][] = [
  [/\b(resume|cv)\b/, 'resume'],
  [/\b(contact|reach you|email|phone|linkedin)\b/, 'contact'],
  [/\b(hire|hiring|open to (work|opportunit)|available for)\b/, 'internship'],
  [/\b(skills?|tech stack|stack)\b/, 'skills'],
  [/\b(projects?|portfolio work)\b/, 'projects'],
  [/\b(who are you|about you|introduce yourself)\b/, 'presentation'],
];

const normalize = (s: string) =>
  s.trim().toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ');

export function matchStaticAnswer(query: string): StaticAnswer | null {
  const q = normalize(query);
  if (!q) return null;

  const exact = EXACT[q];
  if (exact) return ANSWERS[exact];

  if (q.split(' ').length <= 6) {
    for (const [pattern, key] of PATTERNS) {
      if (pattern.test(q)) return ANSWERS[key];
    }
  }
  return null;
}
