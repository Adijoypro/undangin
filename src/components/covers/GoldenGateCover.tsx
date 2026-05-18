"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";

interface GoldenGateCoverProps {
  bride: string;
  groom: string;
  date: string;
  onOpen: () => void;
  guestName?: string;
  bridePhoto?: string;
  groomPhoto?: string;
}

/* ── SVG ORNAMENT: Refined Wrought Iron with Filigree ── */
const GateOrnament = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 400" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Main Vertical Bar */}
    <rect x="56" y="0" width="8" height="400" rx="4" fill="url(#champagneGrad)" />
    
    {/* Top Spearhead - Fleur de Lis style */}
    <path d="M60 0 L52 20 Q56 15 60 8 Q64 15 68 20 Z" fill="url(#champagneGrad)" />
    <circle cx="60" cy="24" r="3" fill="url(#champagneGrad)" opacity="0.8" />
    
    {/* Elaborate Scrollwork Pairs with Rosettes */}
    {[70, 160, 250, 340].map((y, i) => (
      <g key={i}>
        {/* Left Scroll */}
        <path d={`M56 ${y} Q20 ${y - 18} 22 ${y} Q20 ${y + 18} 56 ${y}`} stroke="url(#champagneGrad)" strokeWidth="1.5" fill="none" />
        <path d={`M56 ${y} Q30 ${y - 10} 32 ${y} Q30 ${y + 10} 56 ${y}`} stroke="url(#champagneGrad)" strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="24" cy={y} r="4" stroke="url(#champagneGrad)" strokeWidth="1" fill="none" />
        <circle cx="24" cy={y} r="1.5" fill="url(#champagneGrad)" />
        
        {/* Right Scroll */}
        <path d={`M64 ${y} Q100 ${y - 18} 98 ${y} Q100 ${y + 18} 64 ${y}`} stroke="url(#champagneGrad)" strokeWidth="1.5" fill="none" />
        <path d={`M64 ${y} Q90 ${y - 10} 88 ${y} Q90 ${y + 10} 64 ${y}`} stroke="url(#champagneGrad)" strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="96" cy={y} r="4" stroke="url(#champagneGrad)" strokeWidth="1" fill="none" />
        <circle cx="96" cy={y} r="1.5" fill="url(#champagneGrad)" />
        
        {/* Center Diamond Accent */}
        <path d={`M57 ${y - 6} L60 ${y - 10} L63 ${y - 6} L60 ${y - 2} Z`} fill="url(#champagneGrad)" opacity="0.4" />
      </g>
    ))}
    
    {/* Horizontal Crossbars with finials */}
    <rect x="8" y="45" width="104" height="3" rx="1.5" fill="url(#champagneGrad)" opacity="0.5" />
    <circle cx="8" cy="46.5" r="3" fill="url(#champagneGrad)" opacity="0.5" />
    <circle cx="112" cy="46.5" r="3" fill="url(#champagneGrad)" opacity="0.5" />
    
    <rect x="8" y="355" width="104" height="3" rx="1.5" fill="url(#champagneGrad)" opacity="0.5" />
    <circle cx="8" cy="356.5" r="3" fill="url(#champagneGrad)" opacity="0.5" />
    <circle cx="112" cy="356.5" r="3" fill="url(#champagneGrad)" opacity="0.5" />
    
    <defs>
      <linearGradient id="champagneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A08754" />
        <stop offset="25%" stopColor="#C9A96E" />
        <stop offset="50%" stopColor="#D4BC85" />
        <stop offset="75%" stopColor="#C9A96E" />
        <stop offset="100%" stopColor="#A08754" />
      </linearGradient>
    </defs>
  </svg>
);

/* ── MAIN COVER COMPONENT ── */
export default function GoldenGateCover({ bride, groom, date, onOpen, guestName, bridePhoto, groomPhoto }: GoldenGateCoverProps) {
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
      className="fixed inset-0 z-[60] flex items-center justify-center cursor-pointer select-none overflow-hidden"
      style={{ backgroundColor: "#FAF7F2" }}
      onClick={handleOpen}
    >
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply"
        style={{ 
          backgroundImage: "url('/assets/ultra-luxury/paper.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      {/* Subtle Warm Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A96E]/[0.06] rounded-full blur-[180px]" />
      </div>

      {/* Floor Reflection Line */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[80%] max-w-[500px] h-px bg-gradient-to-r from-transparent via-[#C9A96E]/20 to-transparent" />

      {/* Light Burst Behind Gates (Warm Ivory) */}
      <AnimatePresence>
        {lightBurst && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.8, 0.5], scale: [0.5, 1.5, 3] }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none z-[5]"
            style={{
              background: "radial-gradient(ellipse at center, rgba(201,169,110,0.2), rgba(250,247,242,0.1), transparent 70%)"
            }}
          />
        )}
      </AnimatePresence>

      {/* 3D Scene Container */}
      <motion.div
        style={{ rotateY: tiltX, rotateX: tiltY, transformPerspective: 1200, transformStyle: "preserve-3d" }}
        className="relative w-[220px] min-[375px]:w-[260px] md:w-[420px] h-[360px] min-[375px]:h-[420px] md:h-[600px]"
      >
        {/* ── STONE PILLARS (Left & Right) ── */}
        <div className="absolute -left-4 md:-left-6 top-[30px] md:top-[40px] bottom-0 w-4 md:w-6 z-[35]" style={{ transform: "translateZ(-10px)" }}>
          <div className="h-full bg-gradient-to-r from-[#D5CCB8] to-[#E0D8C8] rounded-l-sm shadow-[-3px_0_15px_rgba(44,24,16,0.12)]">
            <div className="absolute inset-x-0 top-0 h-6 md:h-8 bg-gradient-to-b from-[#C9A96E]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-12 md:h-16 bg-gradient-to-t from-[#2C1810]/10 to-transparent" />
          </div>
        </div>
        <div className="absolute -right-4 md:-right-6 top-[30px] md:top-[40px] bottom-0 w-4 md:w-6 z-[35]" style={{ transform: "translateZ(-10px)" }}>
          <div className="h-full bg-gradient-to-l from-[#D5CCB8] to-[#E0D8C8] rounded-r-sm shadow-[3px_0_15px_rgba(44,24,16,0.12)]">
            <div className="absolute inset-x-0 top-0 h-6 md:h-8 bg-gradient-to-b from-[#C9A96E]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-12 md:h-16 bg-gradient-to-t from-[#2C1810]/10 to-transparent" />
          </div>
        </div>

        {/* ── GROUND SHADOW (beneath gates) ── */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[120%] h-6 md:h-8 bg-[#2C1810]/[0.08] rounded-[50%] blur-md z-[20]" />
        {/* ── TOP ARCH (Ivory with Champagne Gold Trim) ── */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[110%] z-[40]">
          <svg viewBox="0 0 500 90" fill="none" className="w-full">
            {/* Arch Fill */}
            <path
              d="M0 90 L0 45 Q250 -25 500 45 L500 90 Z"
              fill="#EDE7DB"
              stroke="url(#archChampagne)"
              strokeWidth="2.5"
            />
            {/* Inner Arch Detail */}
            <path
              d="M20 90 L20 55 Q250 -5 480 55 L480 90"
              fill="none"
              stroke="url(#archChampagne)"
              strokeWidth="0.8"
              opacity="0.4"
            />
            {/* Keystone - Ornate Diamond with Rosette */}
            <path d="M240 28 L250 10 L260 28 L250 38 Z" fill="#C9A96E" opacity="0.7" />
            <circle cx="250" cy="24" r="5" fill="none" stroke="#C9A96E" strokeWidth="0.8" opacity="0.5" />
            {/* Arch corner rosettes */}
            <circle cx="60" cy="65" r="4" fill="none" stroke="#C9A96E" strokeWidth="1" opacity="0.3" />
            <circle cx="60" cy="65" r="1.5" fill="#C9A96E" opacity="0.3" />
            <circle cx="440" cy="65" r="4" fill="none" stroke="#C9A96E" strokeWidth="1" opacity="0.3" />
            <circle cx="440" cy="65" r="1.5" fill="#C9A96E" opacity="0.3" />
            <defs>
              <linearGradient id="archChampagne" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A08754" />
                <stop offset="50%" stopColor="#D4BC85" />
                <stop offset="100%" stopColor="#A08754" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ── LEFT GATE (Ivory Panel with Espresso Inlay) ── */}
        <motion.div
          initial={{ rotateY: 0 }}
          animate={isOpening ? { rotateY: -110 } : { rotateY: 0 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
          className="absolute left-0 top-[70px] bottom-0 w-1/2 z-[30]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#E8E0D4] to-[#DED6C8] border-r-2 border-[#C9A96E]/50 rounded-bl-lg overflow-hidden shadow-[6px_0_40px_rgba(44,24,16,0.18),-2px_0_8px_rgba(44,24,16,0.06)]" style={{ transformStyle: "preserve-3d" }}>
            {/* Panel Thickness Edge (3D depth strip) */}
            <div className="absolute right-0 top-0 bottom-0 w-[6px] bg-gradient-to-r from-[#D0C6B4] to-[#C5BB9F] z-[2]" />
            {/* Outer Panel Border */}
            <div className="absolute inset-3 border-2 border-[#C9A96E]/30 rounded-sm" />
            {/* Inner Panel Border (double frame effect) */}
            <div className="absolute inset-7 border border-[#C9A96E]/20 rounded-sm">
              {/* Inner panel raised effect */}
              <div className="absolute inset-0 shadow-[inset_2px_2px_8px_rgba(44,24,16,0.06),inset_-1px_-1px_4px_rgba(255,255,255,0.4)]" />
            </div>
            {/* Ornament Column */}
            <div className="absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-16 opacity-40">
              <GateOrnament className="w-full h-full" />
            </div>
            {/* Gate Handle (Right Side) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[3]">
              <div className="w-3 h-12 bg-gradient-to-b from-[#C9A96E] via-[#D4BC85] to-[#C9A96E] rounded-full shadow-[2px_2px_8px_rgba(44,24,16,0.2),0_0_12px_rgba(201,169,110,0.2)]" />
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/30 rounded-full" />
            </div>
            {/* Directional light from top */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/10 to-[#2C1810]/[0.08]" />
          </div>
        </motion.div>

        {/* ── RIGHT GATE (Mirror of Left) ── */}
        <motion.div
          initial={{ rotateY: 0 }}
          animate={isOpening ? { rotateY: 110 } : { rotateY: 0 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }}
          className="absolute right-0 top-[70px] bottom-0 w-1/2 z-[30]"
        >
          <div className="absolute inset-0 bg-gradient-to-l from-[#E8E0D4] to-[#DED6C8] border-l-2 border-[#C9A96E]/50 rounded-br-lg overflow-hidden shadow-[-6px_0_40px_rgba(44,24,16,0.18),2px_0_8px_rgba(44,24,16,0.06)]" style={{ transformStyle: "preserve-3d" }}>
            {/* Panel Thickness Edge (3D depth strip) */}
            <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-gradient-to-l from-[#D0C6B4] to-[#C5BB9F] z-[2]" />
            {/* Outer Panel Border */}
            <div className="absolute inset-3 border-2 border-[#C9A96E]/30 rounded-sm" />
            {/* Inner Panel Border */}
            <div className="absolute inset-7 border border-[#C9A96E]/20 rounded-sm">
              {/* Inner panel raised effect */}
              <div className="absolute inset-0 shadow-[inset_2px_2px_8px_rgba(44,24,16,0.06),inset_-1px_-1px_4px_rgba(255,255,255,0.4)]" />
            </div>
            {/* Ornament Column */}
            <div className="absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-16 opacity-40">
              <GateOrnament className="w-full h-full" />
            </div>
            {/* Gate Handle (Left Side) */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-[3]">
              <div className="w-3 h-12 bg-gradient-to-b from-[#C9A96E] via-[#D4BC85] to-[#C9A96E] rounded-full shadow-[-2px_2px_8px_rgba(44,24,16,0.2),0_0_12px_rgba(201,169,110,0.2)]" />
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/30 rounded-full" />
            </div>
            {/* Directional light from top */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/10 to-[#2C1810]/[0.08]" />
          </div>
        </motion.div>

        {/* ── CONTENT BEHIND GATES (Visible after open) ── */}
        <div className="absolute inset-0 top-[50px] md:top-[70px] flex flex-col items-center justify-center text-center px-4 md:px-8 z-[10]">
          {/* Couple Photo - Cinematic Zoom In */}
          {(bridePhoto || groomPhoto) && (
            <motion.div
              initial={{ scale: 0.3, opacity: 0, filter: "blur(8px)" }}
              animate={isOpening 
                ? { scale: 1, opacity: 1, filter: "blur(0px)" } 
                : { scale: 0.3, opacity: 0, filter: "blur(8px)" }
              }
              transition={{ duration: 2.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-4 md:mb-6"
            >
              <div className="flex items-center justify-center gap-2 md:gap-3">
                {bridePhoto && (
                  <motion.div 
                    initial={{ x: -20 }}
                    animate={isOpening ? { x: 0 } : { x: -20 }}
                    transition={{ duration: 2, delay: 1.2, ease: "easeOut" }}
                    className="relative w-14 h-14 min-[375px]:w-16 min-[375px]:h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-[#C9A96E]/40 shadow-lg"
                  >
                    <Image src={bridePhoto} fill className="object-cover" alt="Bride" />
                  </motion.div>
                )}
                {bridePhoto && groomPhoto && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={isOpening ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -45 }}
                    transition={{ duration: 1, delay: 1.8 }}
                    className="text-[#C9A96E] text-sm md:text-lg font-script italic z-10 -mx-1 md:-mx-2"
                  >
                    &
                  </motion.div>
                )}
                {groomPhoto && (
                  <motion.div 
                    initial={{ x: 20 }}
                    animate={isOpening ? { x: 0 } : { x: 20 }}
                    transition={{ duration: 2, delay: 1.2, ease: "easeOut" }}
                    className="relative w-14 h-14 min-[375px]:w-16 min-[375px]:h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-[#C9A96E]/40 shadow-lg"
                  >
                    <Image src={groomPhoto} fill className="object-cover" alt="Groom" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isOpening ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1.5, delay: 1.5 }}
            className="space-y-4 md:space-y-6"
          >
            <div className="w-12 md:w-16 h-px bg-[#C9A96E]/40 mx-auto" />
            <p className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-[#C9A96E] font-bold">The Wedding of</p>
            <h1 className="font-serif text-2xl min-[375px]:text-3xl md:text-5xl text-[#2C1810]">
              {bride} <span className="text-[#C9A96E] mx-1 md:mx-2 italic font-script">&</span> {groom}
            </h1>
            <p className="text-[7px] md:text-[9px] text-[#6B5E55] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">{date}</p>
            <div className="w-12 md:w-16 h-px bg-[#C9A96E]/40 mx-auto" />
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
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#F0EBE3] to-[#E4DDD0] border-2 border-[#C9A96E]/50 flex items-center justify-center shadow-[0_4px_30px_rgba(44,24,16,0.15),0_0_0_4px_rgba(201,169,110,0.12)]">
                {/* Inner Crest Circle */}
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#C9A96E]/15 to-[#C9A96E]/5 border border-[#C9A96E]/40 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-[#2C1810] text-[8px] md:text-[11px] font-serif tracking-[0.2em] opacity-80">
                      {bride[0]}<span className="text-[#C9A96E] mx-px">&</span>{groom[0]}
                    </span>
                  </div>
                </div>
              </div>
              {/* Pulsing Glow Ring - Subtle Champagne */}
              <div className="absolute -inset-3 rounded-full border border-[#C9A96E]/10 animate-ping" style={{ animationDuration: "3s" }} />
              <div className="absolute -inset-6 rounded-full border border-[#C9A96E]/5 animate-ping" style={{ animationDuration: "4s" }} />
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
              <p className="text-[7px] text-[#C9A96E] uppercase tracking-[0.4em] font-bold">Undangan Spesial Untuk</p>
              <p className="text-[#2C1810] font-serif text-xl italic tracking-tight opacity-80">{guestName || "Tamu Undangan"}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isOpening && (
            <motion.div
              animate={{ y: [0, 6, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-px h-8 bg-gradient-to-b from-[#C9A96E]/40 to-transparent" />
              <p className="text-[#2C1810] text-[7px] font-bold uppercase tracking-[1em]">Tap to Enter</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
