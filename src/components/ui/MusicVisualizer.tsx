"use client";

import { motion } from "framer-motion";

interface MusicVisualizerProps {
  isPlaying: boolean;
}

export default function MusicVisualizer({ isPlaying }: MusicVisualizerProps) {
  return (
    <div className="flex items-end gap-[2px] h-4">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          animate={isPlaying ? {
            height: [4, 16, 8, 14, 6],
          } : { height: 4 }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          className="w-1 bg-wedding-gold rounded-full"
        />
      ))}
    </div>
  );
}
