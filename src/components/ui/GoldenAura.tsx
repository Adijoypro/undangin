"use client";

import { motion } from "framer-motion";

export default function GoldenAura() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Primary Ambient Aura - Optimized for Mobile */}
      <motion.div 
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] md:w-[60%] md:h-[60%] bg-wedding-gold/5 dark:bg-wedding-gold/[0.03] rounded-full blur-[60px] md:blur-[120px]"
      />

      {/* Secondary Ambient Aura - Optimized for Mobile */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -20, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          delay: 2
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] md:w-[50%] md:h-[50%] bg-wedding-gold/5 dark:bg-wedding-gold/[0.02] rounded-full blur-[50px] md:blur-[100px]"
      />

      {/* Center Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-wedding-gold/[0.02] to-transparent opacity-50" />
      
      {/* Subtle Noise Texture for Organic Feel */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
