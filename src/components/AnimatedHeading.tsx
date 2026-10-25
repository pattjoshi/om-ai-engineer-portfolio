'use client';

import { motion } from 'framer-motion';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  delay?: number;
}

const container = (delay: number) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045, delayChildren: delay },
  },
});

const letter = {
  hidden: { opacity: 0, y: 24, rotateX: -60 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
  },
};

// Splits text into per-letter spans and staggers them in on mount, giving a
// bold, cinematic title reveal without any extra dependency.
export default function AnimatedHeading({
  text,
  className,
  delay = 0,
}: AnimatedHeadingProps) {
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={container(delay)}
      className={className}
      style={{ display: 'inline-block', perspective: 400 }}
      aria-label={text}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={letter}
          style={{ display: 'inline-block' }}
          aria-hidden="true"
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
