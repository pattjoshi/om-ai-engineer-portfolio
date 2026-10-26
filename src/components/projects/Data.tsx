// File: data.tsx

import Image from 'next/image';
import { ChevronRight, Link } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// --- PROJECT DATABASE ---
// This array holds the detailed information for each project.
const PROJECT_CONTENT: {
  title: string;
  tagline: string;
  description: string;
  techStack: string[];
  date: string;
  links: { name: string; url: string }[];
  images: { src: string; alt: string }[];
}[] = [
  {
    title: 'LMS GenAI Assistant',
    tagline: 'A RAG-powered AI tutor that learns alongside the course.',
    description:
      'Developed an AI-powered Learning Management System (LMS) featuring role-based access for administrators, teachers, and students. The platform supports course management, assignments, attendance tracking, grading, announcements, and student progress monitoring. Integrated an intelligent chatbot powered by LangGraph and Groq, enabling users to interact with the system through natural language. Implemented 26 database tools for role-specific operations, JWT-based authentication, and protected routes. Built a responsive React and TypeScript frontend with interactive dashboards, smooth animations, notifications, and modern UI components. Developed the backend using Python, Flask, SQLAlchemy, and MySQL, with structured APIs and role-based authorization.',
    techStack: [
      'Python',
      'FastAPI',
      'LangChain',
      'LangGraph',
      'OpenAI API',
      'Pinecone',
      'RAG',
      'Vector Databases',
      'Next.js',
      'Postgress',
      'Neo4j',
      'Next.js',
    ],
    date: '2024 – 2026',
    links: [
      {
        name: 'GitHub Repository',
        url: 'https://github.com/pattjoshi/lms-genAI',
      },
    ],
    images: [
      { src: '/projects/lmsadmin.webp', alt: 'LMS GenAI Assistant ADMIN potal' },
      { src: '/projects/lmssupport.webp', alt: 'LMS GenAI Assistant support' },
      { src: '/projects/lmsteacher.webp', alt: 'LMS GenAI Assistant teacher' },
      { src: '/projects/lmsstudent.webp', alt: 'LMS GenAI Assistant student' },
    ],
  },
  {
    title: 'FresherAI',
    tagline: 'Multi-agent AI career growth platform.',
    description:
      'An AI-powered career platform for resume optimization, mock interviews, and personalized career roadmaps, backed by a 6-service microservices architecture. Engineered multi-agent workflows using LangChain and LangGraph for interview question generation and answer scoring.',
    techStack: [
      'LangChain',
      'LangGraph',
      'React',
      'Node.js',
      'Docker',
      'AWS',
      'Multi-Agent Systems',
    ],
    date: '2025',
    links: [
      {
        name: 'GitHub Repository',
        url: 'https://github.com/pattjoshi/Fresher-Multi-Agent-AI-',
      },
    ],
    images: [
      { src: '/projects/fresherai-1.webp', alt: 'FresherAI screenshot 1' },
      { src: '/projects/fresherai-2.webp', alt: 'FresherAI screenshot 2' },
      { src: '/projects/fresherai-3.webp', alt: 'FresherAI screenshot 3' },
      { src: '/projects/fresherai-4.webp', alt: 'FresherAI screenshot 4' },
    ],
  },
  {
    title: 'AI Job Search Agent',
    tagline: 'Upload your resume once. Let AI find and rank the right jobs.',
    description:
      'Upload your resume once, and the agent checks LinkedIn, Naukri, and Indeed for fresh openings, then uses AI to rank every job by how well it fits your skills and experience — automated end to end with Playwright.',
    techStack: ['Python', 'Playwright','Next.js', 'Web Automation', 'AI Ranking'],
    date: '2025',
    links: [
      {
        name: 'GitHub Repository',
        url: 'https://github.com/pattjoshi/playwright-python-job-search',
      },
    ],
    images: [
      { src: '/projects/deshbord.webp', alt: 'AI Job Search deshbord overview' },
      { src: '/projects/searchjob.webp', alt: 'AI Job Search search job overview' },
      { src: '/projects/application.webp', alt: 'AI Job Search Application tracker overview' },
      { src: '/projects/Notes.webp', alt: 'AI Job Search Notes section overview' },
    ],
  },
  {
    title: 'LinkedIn Job Post & Email Extractor',
    tagline: 'Turn LinkedIn hiring posts into qualified leads automatically.',
    description:
      'A Chrome extension that scans LinkedIn hiring posts, matches them against your resume, extracts recruiter details, and saves qualified leads directly to Google Sheets — turning manual lead-hunting into a one-click workflow.',
    techStack: ['JavaScript', 'Chrome Extension APIs', 'Google Sheets API'],
    date: '2025',
    links: [
      {
        name: 'GitHub Repository',
        url: 'https://github.com/pattjoshi/linkedin-job-post-email-extracto',
      },
    ],
    images: [
      { src: '/projects/linkedin-extractor-1.webp', alt: 'LinkedIn Extractor screenshot 1' },
      { src: '/projects/linkedin-extractor-2.webp', alt: 'LinkedIn Extractor screenshot 2' },
      { src: '/projects/linkedin-extractor-3.webp', alt: 'LinkedIn Extractor popup 1' },
      { src: '/projects/linkedin-extractor-4.webp', alt: 'LinkedIn Extractor popup 2' },
      { src: '/projects/linkedin-extractor-5.webp', alt: 'LinkedIn Extractor popup 3' },
    ],
  },
  {
    title: 'Multi-Vendor E-Shop',
    tagline: 'A full-featured multi-vendor marketplace, Amazon-style.',
    description:
      'A fully functional multi-vendor e-commerce website built with the MERN stack, supporting multiple sellers, product listings, cart management, and order flows in a single marketplace.',
    techStack: ['MongoDB', 'Express.js', 'React', 'Node.js'],
    date: '2023',
    links: [
      {
        name: 'GitHub Repository',
        url: 'https://github.com/pattjoshi/Multi_vondor_E_shop',
      },
    ],
    images: [
    
      { src: '/projects/multi-vendor-eshop-1.webp', alt: 'Multi-Vendor E-Shop screenshot 1' },
      { src: '/projects/multi-vendor-eshop-2.webp', alt: 'Multi-Vendor E-Shop screenshot 2' },
      { src: '/projects/multi-vendor-eshop-3.webp', alt: 'Multi-Vendor E-Shop screenshot 3' },
      { src: '/projects/multi-vendor-eshop-4.webp', alt: 'Multi-Vendor E-Shop screenshot 4' },
      { src: '/projects/multi-vendor-eshop-5.webp', alt: 'Multi-Vendor E-Shop screenshot 5' },
      { src: '/projects/multi-vendor-eshop-6.webp', alt: 'Multi-Vendor E-Shop screenshot 6' },
    ],
  },
  {
    title: 'MERN Restaurant App',
    tagline: 'Browse, order, and pay — a complete restaurant experience.',
    description:
      'A responsive restaurant application built with a complete MERN stack implementation, allowing users to view and filter products, add them to their cart, make secure payments, and enjoy an intuitive ordering experience.',
    techStack: ['MongoDB', 'Express.js', 'React', 'Node.js'],
    date: '2023',
    links: [
      {
        name: 'GitHub Repository',
        url: 'https://github.com/pattjoshi/MERN_restaurant',
      },
    ],
    images: [
      { src: '/projects/mern-restaurant-1.webp', alt: 'MERN Restaurant screenshot 1' },
      { src: '/projects/mern-restaurant-2.webp', alt: 'MERN Restaurant screenshot 2' },
      { src: '/projects/mern-restaurant-3.webp', alt: 'MERN Restaurant screenshot 3' },
      { src: '/projects/mern-restaurant-4.webp', alt: 'MERN Restaurant screenshot 4' },
      { src: '/projects/mern-restaurant-5.webp', alt: 'MERN Restaurant screenshot 5' },
      { src: '/projects/mern-restaurant-6.webp', alt: 'MERN Restaurant screenshot 6' },
    ],
  },
];

// --- COMPONENT & INTERFACE DEFINITIONS ---
// Define interface for project prop
interface ProjectProps {
  title: string;
}

// This component dynamically renders the project details
const ProjectContent = ({ project }: { project: ProjectProps }) => {
  // Find the matching project data from the database
  const projectData = PROJECT_CONTENT.find((p) => p.title === project.title);

  if (!projectData) {
    return <div>Project details not available</div>;
  }

  return (
    <div className="space-y-10">
      {/* Tagline — shown only when available */}
      {projectData.tagline && (
        <p className="font-sans text-base font-medium tracking-wide text-neutral-500 dark:text-neutral-400 italic">
          {projectData.tagline}
        </p>
      )}

      {/* Header section with description */}
      <div className="rounded-3xl bg-[#F5F5F7] p-8 dark:bg-[#1D1D1F]">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span>{projectData.date}</span>
          </div>

          <p className="text-secondary-foreground font-sans text-base leading-relaxed md:text-lg">
            {projectData.description}
          </p>

          {/* Tech stack */}
          <div className="pt-4">
            <h3 className="mb-3 text-sm tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {projectData.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-neutral-200 px-3 py-1 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Links section */}
      {projectData.links && projectData.links.length > 0 && (
        <div className="mb-24">
          <div className="px-6 mb-4 flex items-center gap-2">
            <h3 className="text-sm tracking-wide text-neutral-500 dark:text-neutral-400">
              Links
            </h3>
            <Link className="text-muted-foreground w-4" />
          </div>
          <Separator className="my-4" />
          <div className="space-y-3">
            {projectData.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#F5F5F7] flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-[#E5E5E7] dark:bg-neutral-800 dark:hover:bg-neutral-700"
              >
                <span className="font-light capitalize">{link.name}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Images gallery */}
      {projectData.images && projectData.images.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {projectData.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-video overflow-hidden rounded-2xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 900px"
                  className="bg-neutral-100 object-contain dark:bg-neutral-900"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN DATA EXPORT ---
// This is the data used by your main portfolio page.
export const data = [
  // 1. LMS GenAI Assistant
  {
    category: 'RAG & Agentic Learning Platform',
    title: 'LMS GenAI Assistant',
    shortTitle: 'LMS GenAI',
    src: '/projects/lms-genai-banner.webp',
    content: (
      <ProjectContent project={{ title: 'LMS GenAI Assistant' }} />
    ),
  },
  // 2. FresherAI
  {
    category: 'Multi-Agent AI Career Platform',
    title: 'FresherAI',
    src: '/projects/fresherai-banner.webp',
    content: (
      <ProjectContent project={{ title: 'FresherAI' }} />
    ),
  },
  // 3. AI Job Search Agent
  {
    category: 'AI Job Search Automation',
    title: 'AI Job Search Agent',
    src: '/projects/job-search-banner.webp',
    content: (
      <ProjectContent project={{ title: 'AI Job Search Agent' }} />
    ),
  },
  // 4. LinkedIn Job Post & Email Extractor
  {
    category: 'Chrome Extension / Lead Gen',
    title: 'LinkedIn Job Post & Email Extractor',
    shortTitle: 'LinkedIn Extractor',
    src: '/projects/linkedin-extractor-banner.webp',
    content: (
      <ProjectContent project={{ title: 'LinkedIn Job Post & Email Extractor' }} />
    ),
  },
  // 5. Multi-Vendor E-Shop
  {
    category: 'MERN E-Commerce Platform',
    title: 'Multi-Vendor E-Shop',
    src: '/projects/multi-vendor-eshop-banner.webp',
    content: (
      <ProjectContent project={{ title: 'Multi-Vendor E-Shop' }} />
    ),
  },
  // 6. MERN Restaurant App
  {
    category: 'Full-Stack MERN Platform',
    title: 'MERN Restaurant App',
    src: '/projects/mern-restaurant-banner.webp',
    content: (
      <ProjectContent project={{ title: 'MERN Restaurant App' }} />
    ),
  },
];
