"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

interface EnvelopeCoverProps {
  bride: string;
  groom: string;
  date: string;
  onOpen: () => void;
  guestName?: string;
}

export default function EnvelopeCover({ bride, groom, date, onOpen, guestName }: EnvelopeCoverProps) {
  const [step, setStep] = useState(0);
  const [cardInFront, setCardInFront] = useState(false);
  const isAnimating = useRef(false);

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
      className="fixed inset-0 z-[60] bg-[#020202] flex items-center justify-center cursor-pointer select-none overflow-hidden"
      onClick={tap}
    >
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_60%)]" />
      
      <motion.div
        style={{ rotateY: tiltX, rotateX: tiltY, transformPerspective: 1200, transformStyle: "preserve-3d" }}
        className="relative w-[300px] md:w-[380px] aspect-[4/3]"
      >
        <div className="absolute inset-0" style={{ transformStyle: "flat" }}>
          <div className={`absolute inset-0 rounded-xl z-10 ${step >= 3 ? "" : "overflow-hidden"}`}>
            <div className="absolute inset-0 bg-[#0c0c0c] rounded-xl" />
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
            <div className="absolute inset-y-0 left-0 w-[52%] bg-[#0e0e0e] [clip-path:polygon(0%_0%,100%_50%,0%_100%)] z-[20]" />
            <div className="absolute inset-y-0 right-0 w-[52%] bg-[#0e0e0e] [clip-path:polygon(100%_0%,0%_50%,100%_100%)] z-[20]" />
            <div className="absolute inset-x-0 bottom-0 h-[75%] bg-[#111] [clip-path:polygon(0%_100%,50%_0%,100%_100%)] z-[20]">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center w-full px-4">
                 <p className="text-[7px] text-[#D4AF37]/40 uppercase tracking-[0.3em] font-black mb-1">Undangan Spesial Untuk</p>
                 <p className="text-white font-serif text-lg italic tracking-tight opacity-80 line-clamp-1">{guestName || "Tamu Undangan"}</p>
               </motion.div>
            </div>
          </div>
          <div
            className={`absolute inset-x-0 top-0 h-[52%] pointer-events-none rounded-t-xl ${step >= 2 ? "z-[1]" : "z-[30]"}`}
            style={{
              clipPath: step >= 2 ? "polygon(0% 0%, 100% 0%, 50% 12%)" : "polygon(0% 0%, 100% 0%, 50% 100%)",
              transition: "clip-path 1.8s cubic-bezier(0.33, 1, 0.68, 1)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#141414] to-[#0a0a0a]" />
          </div>
          <AnimatePresence>
            {step < 1 && (
              <motion.div exit={{ scale: 2.2, opacity: 0, filter: "blur(25px)", rotate: 15 }} transition={{ duration: 0.9 }} className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-[200]">
                <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-[#8b0000] via-[#6a0000] to-[#350000] shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex items-center justify-center border border-white/5">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-[#800] to-[#400] rounded-full shadow-2xl z-[30] flex items-center justify-center border border-[#D4AF37]/30">
                    <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest">{bride[0]} & {groom[0]}</span>
                  </div>
                  <div className="absolute -inset-1 rounded-full border border-[#D4AF37]/10" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <AnimatePresence>
        {step === 0 && (
          <motion.div animate={{ y: [0, 8, 0], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 3, repeat: Infinity }} className="absolute bottom-20 flex flex-col items-center">
            <p className="text-[#D4AF37] text-[7px] font-black uppercase tracking-[1.2em]">Tap to Open</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
