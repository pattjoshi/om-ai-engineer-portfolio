'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import React, { useRef } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

// Wraps any element and gently pulls it toward the cursor when nearby,
// snapping back with a spring once the cursor leaves. Pure CSS-transform
// based, so it never interferes with the wrapped element's own click handlers.
export default function MagneticButton({
  children,
  className,
  strength = 0.35,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 14, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 14, mass: 0.4 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
