'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Bot, Cloud, Code, Cpu, Database, PenTool, Sparkles, Users } from 'lucide-react';

const Skills = () => {
  const skillsData = [
    {
      category: 'LLMs & GenAI APIs',
      icon: <Sparkles className="h-5 w-5" />,
      skills: [
        'OpenAI API (GPT-4o, GPT-4)',
        'Anthropic Claude',
        'Google Gemini',
        'Mistral AI API',
        'Prompt Engineering',
        'Embeddings',
        'Function/Tool Calling',
        'Structured Outputs',
      ],
      color: 'bg-blue-50 text-blue-600 border border-blue-200',
    },
    {
      category: 'Agentic AI & Multi-Agent Systems',
      icon: <Bot className="h-5 w-5" />,
      skills: [
        'LangGraph',
        'AI Agents',
        'Agentic Workflows',
        'Multi-Agent Orchestration',
        'PydanticAI',
        'Model Context Protocol (MCP)',
        'ReAct Pattern',
        'Agent Memory & State',
        'Human-in-the-Loop',
      ],
      color: 'bg-purple-50 text-purple-600 border border-purple-200',
    },
    {
      category: 'RAG, Retrieval & LLMOps',
      icon: <Cpu className="h-5 w-5" />,
      skills: [
        'RAG',
        'LangChain',
        'LlamaIndex',
        'Hybrid Search',
        'Reranking',
        'Semantic Search',
        'Chunking Strategies',
        'Hugging Face Transformers',
        'Langfuse',
        'LangSmith',
        'RAGAS',
        'LLM Evaluation',
        'Guardrails',
        'Observability',
      ],
      color: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    },
    {
      category: 'Databases & Vector Stores',
      icon: <Database className="h-5 w-5" />,
      skills: [
        'PostgreSQL',
        'pgvector',
        'Redis',
        'Pinecone',
        'Qdrant',
        'FAISS',
        'Chroma',
      ],
      color: 'bg-cyan-50 text-cyan-600 border border-cyan-200',
    },
    {
      category: 'Languages & Backend',
      icon: <Code className="h-5 w-5" />,
      skills: [
        'Python',
        'FastAPI',
        'Pydantic',
        'JavaScript (ES6+)',
        'TypeScript',
        'Node.js',
        'SQL',
        'REST APIs',
        'SSE Streaming',
        'WebSockets',
        'JWT',
        'Async/Await',
      ],
      color: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
    },
    {
      category: 'Frontend',
      icon: <Code className="h-5 w-5" />,
      skills: [
        'React.js',
        'Next.js',
        'Tailwind CSS',
        'HTML5/CSS3',
        'Responsive Design',
      ],
      color: 'bg-pink-50 text-pink-600 border border-pink-200',
    },
    {
      category: 'Cloud & DevOps',
      icon: <Cloud className="h-5 w-5" />,
      skills: [
        'AWS (EC2, S3, Lambda, Bedrock)',
        'Docker',
        'Kubernetes',
        'GitHub Actions',
        'CI/CD',
        'Git',
      ],
      color: 'bg-orange-50 text-orange-600 border border-orange-200',
    },
    {
      category: 'Tools & Platforms',
      icon: <PenTool className="h-5 w-5" />,
      skills: ['GitHub', 'VS Code', 'Postman', 'Jupyter Notebook'],
      color: 'bg-slate-50 text-slate-600 border border-slate-200',
    },
    {
      category: 'Soft Skills',
      icon: <Users className="h-5 w-5" />,
      skills: [
        'Problem-solving',
        'Analytical thinking',
        'Communication',
        'Teamwork',
        'Ownership & Accountability',
        'Fast learner',
      ],
      color: 'bg-amber-50 text-amber-600 border border-amber-200',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="mx-auto w-full max-w-5xl rounded-4xl"
    >
      <Card className="w-full border-none bg-transparent px-0 pb-12 text-black shadow-none dark:text-white">
        <CardHeader className="px-0 pb-1">
          <CardTitle className="text-primary px-0 text-4xl font-bold">
            Skills & Expertise
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          <motion.div
            className="space-y-8 px-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {skillsData.map((section, index) => (
              <motion.div
                key={index}
                className="space-y-3 px-0"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h3 className="text-accent-foreground text-lg font-semibold">
                    {section.category}
                  </h3>
                </div>

                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {section.skills.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      variants={badgeVariants}
                      whileHover={{
                        scale: 1.04,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Badge className={`border px-3 py-1.5 font-normal`}>
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Skills;
