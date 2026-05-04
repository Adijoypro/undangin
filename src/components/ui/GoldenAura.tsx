"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function GoldenAura() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Primary Ambient Aura - Animation disabled on mobile */}
      <motion.div 
        animate={isMobile ? {} : {
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] md:w-[60%] md:h-[60%] bg-wedding-gold/5 dark:bg-wedding-gold/[0.03] rounded-full blur-[40px] md:blur-[120px] transform-gpu"
      />

      {/* Secondary Ambient Aura - Animation disabled on mobile */}
      <motion.div 
        animate={isMobile ? {} : {
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
        className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] md:w-[50%] md:h-[50%] bg-wedding-gold/5 dark:bg-wedding-gold/[0.02] rounded-full blur-[40px] md:blur-[100px] transform-gpu"
      />

      {/* Center Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-wedding-gold/[0.01] to-transparent opacity-50 transform-gpu" />
    </div>
  );
}
