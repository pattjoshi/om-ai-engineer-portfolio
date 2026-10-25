'use client';

import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { AmbientEngine } from '@/lib/ambientSynth';

export default function MusicPlayer() {
  const engineRef = useRef<AmbientEngine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    engineRef.current = new AmbientEngine();
    return () => engineRef.current?.stop();
  }, []);

  const toggle = () => {
    const engine = engineRef.current;
    if (!engine) return;

    if (isPlaying) {
      engine.stop();
      setIsPlaying(false);
    } else {
      engine.start();
      setIsPlaying(true);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      title={isPlaying ? 'Pause ambient soundtrack' : 'Play ambient soundtrack'}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="fixed bottom-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white/90 shadow-lg backdrop-blur-md transition-colors hover:bg-white dark:border-white/10 dark:bg-neutral-900/90 dark:hover:bg-neutral-900"
    >
      {isPlaying ? (
        <Volume2 className="h-4 w-4 text-neutral-800 dark:text-neutral-200" />
      ) : (
        <VolumeX className="h-4 w-4 text-neutral-800 dark:text-neutral-200" />
      )}
    </motion.button>
  );
}
