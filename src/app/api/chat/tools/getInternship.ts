import { tool } from 'ai';
import { z } from 'zod';

export const getInternship = tool({
  description:
    "Shows a summary of the kind of full-time engineering role I'm looking for, my availability, tech stack, and contact info. Use this tool when the user asks about my job search, whether I'm open to opportunities, or how to hire or contact me.",
  inputSchema: z.object({}),
  execute: async () => {
    return `Here's what I'm looking for 👇

- 💼 **Role**: GenAI Engineer / LLM Engineer / Full Stack AI Developer (Full-Time)
- 📅 **Availability**: Open to new opportunities
- 🌍 **Location**: India · Remote-friendly
- 🧑‍💻 **Focus**: LLM Applications, RAG Pipelines, Multi-Agent Workflows, Full-Stack AI Products
- 🛠️ **Stack**: Python, FastAPI, LangChain, LangGraph, React.js, Next.js, OpenAI API, PostgreSQL, pgvector, Pinecone, Docker, AWS
- ✅ **What I bring**: 3 years of production experience building GenAI systems — RAG pipelines, agentic workflows, and full-stack AI products that businesses run on every day.
- 🔥 I move fast, learn faster, and I'm HUNGRYYYYY for big challenges

📬 **Reach me at**:
- Email: omprakashpattjoshi123@gmail.com
- LinkedIn: [linkedin.com/in/om-prakash-pattjoshi](https://linkedin.com/in/om-prakash-pattjoshi)
- GitHub: [github.com/pattjoshi](https://github.com/pattjoshi)

Let's build cool shit together ✌️
    `;
  },
});
