"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

interface GoldenGateCoverProps {
  bride: string;
  groom: string;
  date: string;
  onOpen: () => void;
  guestName?: string;
}

/* ── SVG ORNAMENT PATTERN (Reusable Iron Wrought Detail) ── */
const GateOrnament = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 400" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Vertical Bar */}
    <rect x="55" y="0" width="10" height="400" rx="2" fill="url(#goldGrad)" />
    {/* Top Spear */}
    <path d="M60 0 L48 30 L60 20 L72 30 Z" fill="url(#goldGrad)" />
    {/* Scrollwork Pairs */}
    {[80, 180, 280].map((y, i) => (
      <g key={i}>
        <ellipse cx="38" cy={y} rx="20" ry="12" stroke="url(#goldGrad)" strokeWidth="2" fill="none" />
        <ellipse cx="82" cy={y} rx="20" ry="12" stroke="url(#goldGrad)" strokeWidth="2" fill="none" />
        <circle cx="38" cy={y} r="3" fill="url(#goldGrad)" />
        <circle cx="82" cy={y} r="3" fill="url(#goldGrad)" />
      </g>
    ))}
    {/* Horizontal Crossbars */}
    <rect x="10" y="60" width="100" height="4" rx="2" fill="url(#goldGrad)" opacity="0.6" />
    <rect x="10" y="340" width="100" height="4" rx="2" fill="url(#goldGrad)" opacity="0.6" />
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#B38728" />
        <stop offset="25%" stopColor="#FBF5B7" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="75%" stopColor="#FBF5B7" />
        <stop offset="100%" stopColor="#B38728" />
      </linearGradient>
    </defs>
  </svg>
);

/* ── MAIN COVER COMPONENT ── */
export default function GoldenGateCover({ bride, groom, date, onOpen, guestName }: GoldenGateCoverProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [lightBurst, setLightBurst] = useState(false);
  const hasTriggered = useRef(false);

  // 3D Parallax tilt
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tiltX = useSpring(rawX, { stiffness: 60, damping: 25 });
  const tiltY = useSpring(rawY, { stiffness: 60, damping: 25 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 15);
      rawY.set(-(e.clientY / window.innerHeight - 0.5) * 10);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [rawX, rawY]);

  const handleOpen = () => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;
    setIsOpening(true);

    // Light burst after gates start opening
    setTimeout(() => setLightBurst(true), 1200);

    // Trigger parent onOpen after full animation
    setTimeout(() => onOpen(), 3500);
  };

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.1, filter: "blur(40px)" }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[60] bg-[#020202] flex items-center justify-center cursor-pointer select-none overflow-hidden"
      onClick={handleOpen}
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/[0.03] rounded-full blur-[150px]" />
      </div>

      {/* Floor Reflection Line */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[80%] max-w-[500px] h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

      {/* Light Burst Behind Gates */}
      <AnimatePresence>
        {lightBurst && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0.8], scale: [0.5, 1.5, 3] }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.3),rgba(255,255,255,0.05),transparent_70%)] rounded-full pointer-events-none z-[5]"
          />
        )}
      </AnimatePresence>

      {/* 3D Scene Container */}
      <motion.div
        style={{ rotateY: tiltX, rotateX: tiltY, transformPerspective: 1500 }}
        className="relative w-[340px] md:w-[420px] h-[500px] md:h-[600px]"
      >
        {/* ── TOP ARCH ── */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[110%] z-[40]">
          <svg viewBox="0 0 500 80" fill="none" className="w-full">
            <path
              d="M0 80 L0 40 Q250 -20 500 40 L500 80 Z"
              fill="#0a0a0a"
              stroke="url(#archGold)"
              strokeWidth="2"
            />
            {/* Keystone Diamond */}
            <path d="M240 25 L250 10 L260 25 L250 35 Z" fill="#D4AF37" opacity="0.8" />
            <defs>
              <linearGradient id="archGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B38728" />
                <stop offset="50%" stopColor="#FBF5B7" />
                <stop offset="100%" stopColor="#B38728" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ── LEFT GATE ── */}
        <motion.div
          initial={{ rotateY: 0 }}
          animate={isOpening ? { rotateY: -110 } : { rotateY: 0 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
          className="absolute left-0 top-[60px] bottom-0 w-1/2 z-[30]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e] to-[#080808] border-r border-[#D4AF37]/20 rounded-bl-lg overflow-hidden">
            {/* Inner Panel Border */}
            <div className="absolute inset-4 border border-[#D4AF37]/15 rounded-sm" />
            {/* Ornament Column */}
            <div className="absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-16 opacity-60">
              <GateOrnament className="w-full h-full" />
            </div>
            {/* Gate Handle (Right Side) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-12 bg-gradient-to-b from-[#D4AF37] via-[#B38728] to-[#D4AF37] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
          </div>
        </motion.div>

        {/* ── RIGHT GATE ── */}
        <motion.div
          initial={{ rotateY: 0 }}
          animate={isOpening ? { rotateY: 110 } : { rotateY: 0 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }}
          className="absolute right-0 top-[60px] bottom-0 w-1/2 z-[30]"
        >
          <div className="absolute inset-0 bg-gradient-to-l from-[#0e0e0e] to-[#080808] border-l border-[#D4AF37]/20 rounded-br-lg overflow-hidden">
            {/* Inner Panel Border */}
            <div className="absolute inset-4 border border-[#D4AF37]/15 rounded-sm" />
            {/* Ornament Column */}
            <div className="absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-16 opacity-60">
              <GateOrnament className="w-full h-full" />
            </div>
            {/* Gate Handle (Left Side) */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-12 bg-gradient-to-b from-[#D4AF37] via-[#B38728] to-[#D4AF37] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
          </div>
        </motion.div>

        {/* ── CONTENT BEHIND GATES (Visible after open) ── */}
        <div className="absolute inset-0 top-[60px] flex flex-col items-center justify-center text-center px-8 z-[10]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isOpening ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1.5, delay: 1.5 }}
            className="space-y-6"
          >
            <div className="w-12 h-px bg-[#D4AF37]/40 mx-auto" />
            <p className="text-[8px] uppercase tracking-[0.5em] text-[#D4AF37]/60 font-black">The Wedding of</p>
            <h1 className="font-serif text-4xl md:text-5xl text-white">
              {bride} <span className="text-[#D4AF37] mx-1">&</span> {groom}
            </h1>
            <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.3em]">{date}</p>
            <div className="w-12 h-px bg-[#D4AF37]/40 mx-auto" />
          </motion.div>
        </div>

        {/* ── CENTER LOCK / CREST (Before Opening) ── */}
        <AnimatePresence>
          {!isOpening && (
            <motion.div
              exit={{ scale: 1.5, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.6 }}
              className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-[50]"
            >
              {/* Outer Ring */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#D4AF37]/30 flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.15),0_20px_60px_rgba(0,0,0,0.8)]">
                {/* Inner Crest */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/40 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-[#D4AF37] text-[11px] font-black tracking-widest">
                      {bride[0]}&{groom[0]}
                    </span>
                  </div>
                </div>
              </div>
              {/* Pulsing Glow Ring */}
              <div className="absolute -inset-3 rounded-full border border-[#D4AF37]/10 animate-ping" style={{ animationDuration: "3s" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── GUEST NAME & CTA ── */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-center z-[40] space-y-5">
        <AnimatePresence>
          {!isOpening && (
            <motion.div
              exit={{ opacity: 0, y: 20 }}
              className="space-y-3"
            >
              <p className="text-[7px] text-[#D4AF37]/40 uppercase tracking-[0.4em] font-black">Undangan Spesial Untuk</p>
              <p className="text-white font-serif text-xl italic tracking-tight opacity-80">{guestName || "Tamu Undangan"}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isOpening && (
            <motion.div
              animate={{ y: [0, 6, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <p className="text-[#D4AF37] text-[7px] font-black uppercase tracking-[1.2em]">Tap to Enter</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
