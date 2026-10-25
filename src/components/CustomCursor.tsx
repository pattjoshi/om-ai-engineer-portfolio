'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const ringX = useSpring(dotX, { stiffness: 300, damping: 28, mass: 0.5 });
  const ringY = useSpring(dotY, { stiffness: 300, damping: 28, mass: 0.5 });

  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)');
    setEnabled(mql.matches);

    const handleChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest?.(INTERACTIVE_SELECTOR)) setIsHovering(true);
    };

    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest?.(INTERACTIVE_SELECTOR)) setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, [enabled, dotX, dotY]);

  if (!enabled) return null;

  return (
    <>
      {/* Glowing lagging ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 44 : 28,
          height: isHovering ? 44 : 28,
          backgroundColor: isHovering ? 'rgba(1, 113, 227, 0.35)' : 'rgba(255, 255, 255, 0.25)',
          boxShadow: isHovering
            ? '0 0 20px 4px rgba(1, 113, 227, 0.45)'
            : '0 0 14px 2px rgba(255, 255, 255, 0.25)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      />
      {/* Sharp dot that snaps to the real cursor */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
}
