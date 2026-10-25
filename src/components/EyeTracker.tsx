'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

// Calibrated against /avatar-om-face-v2.webp: eye centers as a percentage
// of the avatar's own container, found visually via a percentage-grid overlay.
const EYES = [
  { left: '36%', top: '58%' },
  { left: '65%', top: '58%' },
];

const MAX_OFFSET = 4; // px a pupil may drift from its resting center

function Pupil({ left, top }: { left: string; top: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const clamped = Math.min(dist, MAX_OFFSET * 12) / (MAX_OFFSET * 12);

      x.set((dx / dist) * clamped * MAX_OFFSET);
      y.set((dy / dist) * clamped * MAX_OFFSET);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [x, y]);

  return (
    <div
      ref={ref}
      className="absolute h-1 w-1"
      style={{ left, top }}
    >
      <motion.div
        className="absolute h-2.5 w-2.5 rounded-full bg-[#2a1a12] sm:h-3 sm:w-3"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      />
    </div>
  );
}

export default function EyeTracker() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {EYES.map((eye, i) => (
        <Pupil key={i} left={eye.left} top={eye.top} />
      ))}
    </div>
  );
}
