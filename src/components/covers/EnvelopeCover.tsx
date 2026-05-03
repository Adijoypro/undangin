"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

interface EnvelopeCoverProps {
  bride: string;
  groom: string;
  date: string;
  onOpen: () => void;
  guestName?: string;
  variant?: 'dark' | 'renaissance';
}

export default function EnvelopeCover({ bride, groom, date, onOpen, guestName, variant = 'dark' }: EnvelopeCoverProps) {
  const [step, setStep] = useState(0);
  const [cardInFront, setCardInFront] = useState(false);
  const isAnimating = useRef(false);

  // Theme configuration
  const isRenaissance = variant === 'renaissance';
  const colors = {
    screenBg: isRenaissance ? "#F5EFE6" : "#020202",
    envBg: isRenaissance ? "#EAE0D5" : "#0c0c0c",
    envSide: isRenaissance ? "#DCD0C0" : "#0e0e0e",
    envBottom: isRenaissance ? "#D0C0B0" : "#111",
    envTop: isRenaissance ? "linear-gradient(to bottom, #F5EFE6, #EAE0D5)" : "linear-gradient(to bottom, #141414, #0a0a0a)",
    waxBase: isRenaissance ? "from-[#D4AF37] via-[#B38728] to-[#8a6d1f]" : "from-[#D4AF37] via-[#B38728] to-[#8a6d1f]",
    waxInner: isRenaissance ? "from-[#FFDF70] to-[#B38728]" : "from-[#FFDF70] to-[#B38728]",
    waxText: "#2C2C2C", // Dark text on gold looks more 3D/engraved
    guestText: isRenaissance ? "#3D3229" : "white",
    guestLabel: isRenaissance ? "#8B7355" : "#D4AF37"
  };

  useEffect(() => {
    if (step === 3) {
      setCardInFront(false);
      const t = setTimeout(() => setCardInFront(true), 800);
      return () => clearTimeout(t);
    } else setCardInFront(false);
  }, [step]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tiltX = useSpring(rawX, { stiffness: 80, damping: 20 });
  const tiltY = useSpring(rawY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 40);
      rawY.set(-(e.clientY / window.innerHeight - 0.5) * 20);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [rawX, rawY]);

  const tap = () => {
    if (isAnimating.current || step >= 4) return;
    isAnimating.current = true;
    
    // Step 0 -> 1: Peel Wax
    setStep(1);
    
    // Step 1 -> 2: Open Flap (After 1s)
    setTimeout(() => {
      setStep(2);
    }, 1000);

    // Step 2 -> 3: Pull Card (After 2.8s total)
    setTimeout(() => {
      setStep(3);
    }, 2800);

    // Step 3 -> 4: Finalize & Reveal (After 5s total)
    setTimeout(() => {
      setStep(4);
      isAnimating.current = false;
    }, 5000);
  };

  useEffect(() => {
    if (step === 4) setTimeout(onOpen, 500);
  }, [step, onOpen]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.15, filter: "blur(60px)" }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[60] flex items-center justify-center cursor-pointer select-none overflow-hidden"
      style={{ backgroundColor: colors.screenBg }}
      onClick={tap}
    >
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_60%)]" />
      
      <motion.div
        style={{ rotateY: tiltX, rotateX: tiltY, transformPerspective: 1200, transformStyle: "preserve-3d" }}
        className="relative w-[300px] md:w-[380px] aspect-[4/3] drop-shadow-[0_35px_50px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute inset-0" style={{ transformStyle: "flat" }}>
          <div className={`absolute inset-0 rounded-xl z-10 ${step >= 3 ? "" : "overflow-hidden"}`}>
            <div className="absolute inset-0 rounded-xl shadow-inner" style={{ backgroundColor: colors.envBg }} />
            
            <motion.div
              animate={step >= 3 ? { y: "-70%" } : { y: 0 }}
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute left-[8%] right-[8%] top-[8%] bottom-[8%] bg-white rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-center p-6 ${cardInFront ? "z-[50]" : "z-[15]"}`}
            >
              <div className="w-10 h-px bg-[#D4AF37]/30 mb-5" />
              <p className="text-[8px] uppercase tracking-[0.5em] text-gray-400 font-black mb-3">The Wedding of</p>
              <h1 className="font-serif text-3xl text-gray-900 mb-2">{bride} <span className="text-[#D4AF37]">&</span> {groom}</h1>
              <p className="text-[8px] text-[#D4AF37] font-black uppercase tracking-[0.3em]">{date}</p>
              <div className="w-10 h-px bg-[#D4AF37]/30 mt-5" />
            </motion.div>

            <div className="absolute inset-y-0 left-0 w-[52%] [clip-path:polygon(0%_0%,100%_50%,0%_100%)] z-[20] shadow-inner" style={{ backgroundColor: colors.envSide, filter: 'brightness(0.9)' }} />
            <div className="absolute inset-y-0 right-0 w-[52%] [clip-path:polygon(100%_0%,0%_50%,100%_100%)] z-[20] shadow-inner" style={{ backgroundColor: colors.envSide, filter: 'brightness(0.9)' }} />
            <div className="absolute inset-x-0 bottom-0 h-[75%] [clip-path:polygon(0%_100%,50%_0%,100%_100%)] z-[20] shadow-2xl" style={{ backgroundColor: colors.envBottom }}>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center w-full px-4">
                 <p className="text-[7px] uppercase tracking-[0.3em] font-black mb-1" style={{ color: colors.guestLabel }}>Undangan Spesial Untuk</p>
                 <p className="font-serif text-lg italic tracking-tight opacity-80 line-clamp-1" style={{ color: colors.guestText }}>{guestName || "Tamu Undangan"}</p>
               </motion.div>
            </div>
          </div>
          
          <div
            className={`absolute inset-x-0 top-0 h-[52%] pointer-events-none rounded-t-xl ${step >= 2 ? "z-[1]" : "z-[30]"}`}
            style={{
              clipPath: step >= 2 ? "polygon(0% 0%, 100% 0%, 50% 12%)" : "polygon(0% 0%, 100% 0%, 50% 100%)",
              transition: "clip-path 1.8s cubic-bezier(0.33, 1, 0.68, 1)",
              background: colors.envTop,
              filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))'
            }}
          />

          <AnimatePresence>
            {step < 1 && (
              <motion.div exit={{ scale: 2.2, opacity: 0, filter: "blur(25px)", rotate: 15 }} transition={{ duration: 0.9 }} className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-[200]">
                {/* 3D GOLD WAX SEAL */}
                <div className={`w-[72px] h-[72px] rounded-full bg-gradient-to-br ${colors.waxBase} shadow-[0_15px_40px_rgba(0,0,0,0.6),inset_0_-4px_8px_rgba(0,0,0,0.3),inset_0_4px_8px_rgba(255,255,255,0.4)] flex items-center justify-center border border-white/10`}>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[54px] h-[54px] bg-gradient-to-br ${colors.waxInner} rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.4),0_2px_4px_rgba(255,255,255,0.3)] z-[30] flex items-center justify-center border border-[#D4AF37]/40 overflow-hidden`}>
                    {/* Metal Shine Effect */}
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }} 
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                    />
                    <span className="relative z-10 text-[10px] font-black uppercase tracking-widest drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]" style={{ color: colors.waxText }}>{bride[0]} & {groom[0]}</span>
                  </div>
                  {/* Uneven Molten Edges Effect */}
                  <div className="absolute -inset-1 rounded-full border-[3px] border-[#D4AF37]/20 blur-[1px]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <AnimatePresence>
        {step === 0 && (
          <motion.div animate={{ y: [0, 8, 0], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 3, repeat: Infinity }} className="absolute bottom-20 flex flex-col items-center">
            <p className="text-[7px] font-black uppercase tracking-[1.2em]" style={{ color: colors.waxText }}>Tap to Open</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
