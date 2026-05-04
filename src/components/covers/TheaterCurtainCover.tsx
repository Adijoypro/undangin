"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

interface TheaterCurtainCoverProps {
  bride: string;
  groom: string;
  date: string;
  onOpen: () => void;
  guestName?: string;
}

/* ── VELVET CURTAIN FOLD PATTERN (SVG) ── */
const CurtainFolds = ({ side }: { side: "left" | "right" }) => (
  <svg
    viewBox="0 0 100 600"
    preserveAspectRatio="none"
    className="absolute inset-0 w-full h-full"
    style={{ transform: side === "right" ? "scaleX(-1)" : undefined }}
  >
    <defs>
      {/* Simplified Velvet Gradient */}
      <linearGradient id={`velvet-${side}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#12050b" />
        <stop offset="15%" stopColor="#4a0820" />
        <stop offset="35%" stopColor="#1a040d" />
        <stop offset="50%" stopColor="#630d2d" />
        <stop offset="65%" stopColor="#2d0615" />
        <stop offset="85%" stopColor="#4a0820" />
        <stop offset="100%" stopColor="#0a0206" />
      </linearGradient>
    </defs>
    {/* Base Velvet */}
    <rect width="100" height="600" fill={`url(#velvet-${side})`} />
    {/* Light Vertical Lustre (Replacement for heavy grain) */}
    <rect width="100" height="600" fill="white" opacity="0.02" style={{ mixBlendMode: 'soft-light' }} />
    
    {/* Deep Vertical Fold Shadows */}
    {[20, 45, 75].map((x, i) => (
      <rect key={i} x={x} y="0" width="12" height="600" fill="black" opacity="0.3" filter="blur(8px)" />
    ))}
    
    {/* Light catching edges on folds */}
    {[18, 43, 73].map((x, i) => (
      <line key={`l-${i}`} x1={x} y1="0" x2={x} y2="600" stroke="rgba(212,175,55,0.08)" strokeWidth="1" />
    ))}
  </svg>
);

/* ── SWAG / VALANCE (Top Draping) ── */
const Valance = () => (
  <svg viewBox="0 0 800 100" preserveAspectRatio="none" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="valanceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3a0c20" />
        <stop offset="60%" stopColor="#1a0a12" />
        <stop offset="100%" stopColor="#0a0206" />
      </linearGradient>
    </defs>
    <path
      d="M0 0 L800 0 L800 45 Q700 90 600 50 Q500 10 400 55 Q300 100 200 50 Q100 0 0 45 Z"
      fill="url(#valanceGrad)"
    />
    {/* Gold fringe on valance */}
    <path
      d="M0 45 Q100 0 200 50 Q300 100 400 55 Q500 10 600 50 Q700 90 800 45"
      fill="none"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeDasharray="1 3"
      opacity="0.6"
    />
  </svg>
);

/* ── TASSEL COMPONENT ── */
const Tassel = ({ x, delay }: { x: string; delay: number }) => (
  <motion.div
    initial={{ y: 0, rotate: 0 }}
    animate={{ y: [0, 5, 0], rotate: [-2, 2, -2] }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
    className="absolute"
    style={{ left: x, top: "65px" }}
  >
    <div className="flex flex-col items-center">
      <div className="w-[2px] h-10 bg-gradient-to-b from-[#D4AF37]/80 to-[#D4AF37]/40" />
      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#B38728] to-[#8a6d1f] shadow-lg border border-white/10" />
      <div className="flex gap-[1px] mt-[-2px]">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-[1.5px] h-6 bg-gradient-to-b from-[#D4AF37]/60 via-[#B38728]/40 to-transparent" />
        ))}
      </div>
    </div>
  </motion.div>
);

/* ── MAIN THEATER CURTAIN COVER ── */
export default function TheaterCurtainCover({ bride, groom, date, onOpen, guestName }: TheaterCurtainCoverProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [spotlightActive, setSpotlightActive] = useState(false);
  const hasTriggered = useRef(false);

  const handleOpen = () => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;
    setSpotlightActive(true);
    setTimeout(() => setIsOpening(true), 600);
    setTimeout(() => onOpen(), 4500);
  };

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.1, filter: "blur(40px)" }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[60] bg-[#050103] flex items-center justify-center cursor-pointer select-none overflow-hidden"
      onClick={handleOpen}
    >
      {/* ── STAGE FLOOR WITH REFLECTION ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-black via-[#1a0a12]/30 to-transparent z-[2]">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent blur-[1px]" />
      </div>

      {/* ── ATMOSPHERIC HAZE (Replacement for external stardust) ── */}
      <div className="absolute inset-0 pointer-events-none z-[6] opacity-[0.4] bg-[radial-gradient(circle_at_center,rgba(180,140,80,0.03)_0%,transparent_70%)]" />

      {/* ── SPOTLIGHTS ── */}
      <motion.div
        animate={spotlightActive ? { opacity: 0.8, scale: 1.2 } : { opacity: 0.2, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[800px] pointer-events-none z-[5]"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(255,250,200,0.2) 0%, rgba(212,175,55,0.05) 50%, transparent 80%)",
        }}
      />

      {/* ── CONTENT (Visible before and during opening) ── */}
      <motion.div
        animate={isOpening ? { opacity: 0, scale: 1.2, filter: "blur(20px)" } : { opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-[40] pointer-events-none"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="space-y-6"
        >
          <div className="w-16 h-px bg-[#D4AF37]/40 mx-auto" />
          <p className="text-[8px] uppercase tracking-[0.5em] text-[#D4AF37]/80 font-black">The Wedding of</p>
          <h1 className="font-serif text-5xl md:text-7xl text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            {bride} <span className="text-[#D4AF37]">&</span> {groom}
          </h1>
          <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.4em]">{date}</p>
          <div className="w-16 h-px bg-[#D4AF37]/40 mx-auto" />
        </motion.div>
      </motion.div>

      {/* ── CONTENT BEHIND CURTAINS (The Reveal) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isOpening ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 2, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[10] text-center"
      >
        <p className="text-[#D4AF37] font-serif text-2xl italic">Welcome to our Story</p>
      </motion.div>

      {/* ── LEFT CURTAIN ── */}
      <motion.div
        initial={{ x: "0%" }}
        animate={isOpening ? { x: "-95%", skewX: -2, scaleX: 0.9 } : {}}
        transition={{ duration: 3, ease: [0.45, 0, 0.55, 1] }}
        className="absolute left-0 top-0 bottom-0 w-[55%] z-[20] shadow-[30px_0_60px_rgba(0,0,0,0.8)]"
      >
        <div className="relative w-full h-full">
          <CurtainFolds side="left" />
          {/* Heavy Gold Fringe Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-[repeating-linear-gradient(90deg,#D4AF37,#D4AF37_2px,#B38728_2px,#B38728_4px)] opacity-80" />
        </div>
      </motion.div>

      {/* ── RIGHT CURTAIN ── */}
      <motion.div
        initial={{ x: "0%" }}
        animate={isOpening ? { x: "95%", skewX: 2, scaleX: 0.9 } : {}}
        transition={{ duration: 3, ease: [0.45, 0, 0.55, 1] }}
        className="absolute right-0 top-0 bottom-0 w-[55%] z-[20] shadow-[-30px_0_60px_rgba(0,0,0,0.8)]"
      >
        <div className="relative w-full h-full">
          <CurtainFolds side="right" />
          {/* Heavy Gold Fringe Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-[repeating-linear-gradient(90deg,#D4AF37,#D4AF37_2px,#B38728_2px,#B38728_4px)] opacity-80" />
        </div>
      </motion.div>

      {/* ── TOP VALANCE ── */}
      <div className="absolute top-0 left-0 right-0 h-[100px] z-[35]">
        <Valance />
      </div>

      {/* ── TASSELS ── */}
      <div className="absolute inset-0 z-[36] pointer-events-none">
        <Tassel x="20%" delay={0} />
        <Tassel x="80%" delay={1} />
      </div>

      {/* ── GUEST NAME & CTA ── */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-center z-[40] space-y-6">
        <AnimatePresence>
          {!isOpening && (
            <motion.div exit={{ opacity: 0, y: 20 }} className="space-y-4">
              <div className="space-y-2">
                <p className="text-[8px] text-[#D4AF37]/60 uppercase tracking-[0.5em] font-black">Special Guest</p>
                <p className="text-white font-serif text-3xl md:text-4xl italic tracking-tight drop-shadow-lg">{guestName || "Tamu Undangan"}</p>
              </div>
              <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.8, 0.4] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="pt-4"
              >
                <p className="text-[#D4AF37] text-[9px] font-black uppercase tracking-[1.5em] border-y border-[#D4AF37]/20 py-2 px-4">Tap to Reveal</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
