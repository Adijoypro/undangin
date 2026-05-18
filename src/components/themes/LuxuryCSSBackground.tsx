"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface InteractiveSparkle {
  id: number;
  x: number;
  y: number;
  tx: number; // target relative X translation
  ty: number; // target relative Y translation
  size: number;
}

export default function LuxuryCSSBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [sparkles, setSparkles] = useState<InteractiveSparkle[]>([]);
  const sparkleIdRef = useRef(0);

  // Generate static floating gold particles on mount
  useEffect(() => {
    const particleCount = 25;
    const generated: Particle[] = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage width
      y: Math.random() * 100, // percentage height
      size: Math.random() * 4 + 2, // 2px to 6px
      duration: Math.random() * 15 + 15, // 15s to 30s slow drift
      delay: Math.random() * -30, // negative delay so they start immediately at different positions
    }));
    setParticles(generated);
  }, []);

  // Track pointer movements and spawn sparkles
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Throttle sparkle spawning slightly to prevent excessive React state updates
    if (Math.random() > 0.12) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Spawn 2 tiny premium sparkles per event
    const newSparkles = Array.from({ length: 2 }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 80 + 30;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 40; // float upward slightly to simulate magical wind
      const size = Math.random() * 12 + 6; // 6px to 18px cross star

      sparkleIdRef.current += 1;
      return {
        id: sparkleIdRef.current,
        x,
        y,
        tx,
        ty,
        size,
      };
    });

    setSparkles((prev) => [...prev, ...newSparkles].slice(-50)); // Cap max sparkles for absolute safety
  };

  // Periodically clean up old sparkles
  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles((prev) => prev.slice(-30));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-auto select-none z-0 bg-[#020202]"
      onPointerMove={handlePointerMove}
    >
      {/* 1. LAYER ONE: DEEP LUXURY GRADIENT & AMBIENT PULSING GLOWS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,16,10,1)_0%,rgba(2,2,2,1)_100%)] pointer-events-none" />
      
      {/* Golden Dust / Radial Ambient Glow Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.12, 0.22, 0.12],
          x: ["-5%", "5%", "-5%"],
          y: ["-5%", "5%", "-5%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] blur-[80px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.18, 0.08],
          x: ["5%", "-5%", "5%"],
          y: ["5%", "-5%", "5%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(183,135,39,0.08)_0%,transparent_70%)] blur-[80px] pointer-events-none"
      />

      {/* Elegant Golden Marble Background Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.025] mix-blend-color-dodge bg-[url('/assets/marble-bg.webp')] bg-cover pointer-events-none" />

      {/* 2. LAYER TWO: FLOATING COLD DUST (CONSTANT DRIFT) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: "105vh", x: `${p.x}vw`, opacity: 0 }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.7, 0.7, 0],
              x: [`${p.x}vw`, `${p.x + (Math.random() * 8 - 4)}vw`],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
            className="absolute rounded-full bg-gradient-to-tr from-[#FFDF70] to-[#B38728] shadow-[0_0_8px_#D4AF37]"
            style={{
              width: p.size,
              height: p.size,
            }}
          />
        ))}
      </div>

      {/* 3. LAYER THREE: INTERACTIVE STAR TRAILS ON MOUSE/TOUCH MOVE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        <AnimatePresence>
          {sparkles.map((s) => (
            <motion.div
              key={s.id}
              initial={{ 
                x: s.x - s.size / 2, 
                y: s.y - s.size / 2, 
                scale: 0.1, 
                opacity: 1,
                rotate: 0 
              }}
              animate={{ 
                x: s.x + s.tx - s.size / 2, 
                y: s.y + s.ty - s.size / 2, 
                scale: [1, 1.4, 0], 
                opacity: [1, 1, 0],
                rotate: [0, 180, 360]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.1, 0.8, 0.2, 1] 
              }}
              className="absolute bg-gradient-to-br from-[#FFF5D6] via-[#D4AF37] to-[#B38728] shadow-[0_0_15px_rgba(212,175,55,0.9)]"
              style={{
                width: s.size,
                height: s.size,
                clipPath: "polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%)",
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
