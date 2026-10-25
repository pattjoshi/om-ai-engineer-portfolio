'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export function Resume() {
  // Resume details — hosted on Google Drive rather than committed to the
  // repo, since the PDF contains personal contact info (phone, email).
  const resumeDetails = {
    title: "Om's Resume",
    description: 'GenAI Engineer | LLM Engineer | Full Stack AI Developer',
    fileType: 'PDF',
    lastUpdated: 'October 2026',
    driveUrl:
      'https://drive.google.com/drive/folders/1eULWpUOq49Ir2QoVM11gwzudQB0kVSii',
  };

  const handleOpen = () => {
    window.open(resumeDetails.driveUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto w-full py-8 font-sans">
      <motion.div
        onClick={handleOpen}
        className="group relative cursor-pointer overflow-hidden rounded-xl bg-accent p-0 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.0, ease: 'easeOut' }}
        whileHover={{ scale: 1.01 }}
      >
        {/* Details area (bottom part) */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-foreground">
                {resumeDetails.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {resumeDetails.description}
              </p>
              <div className="mt-1 flex text-xs text-muted-foreground">
                <span>{resumeDetails.fileType}</span>
                <span className="mx-2">•</span>
                <span>Updated {resumeDetails.lastUpdated}</span>
                <span className="mx-2">•</span>
                <span>Google Drive</span>
              </div>
            </div>

            {/* Download indicator */}
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-primary-foreground group-hover:bg-black/80"
              initial={{ scale: 1 }}
            >
              <ExternalLink className="h-5 w-5" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Resume;