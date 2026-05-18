"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

interface EnvelopeCoverProps {
  bride: string;
  groom: string;
  date: string;
  onOpen: () => void;
  guestName?: string;
  variant?: 'dark' | 'renaissance' | 'modern-blue' | 'premium';
}

export default function EnvelopeCover({ bride, groom, date, onOpen, guestName, variant = 'dark' }: EnvelopeCoverProps) {
  const [step, setStep] = useState(0);
  const [cardInFront, setCardInFront] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isAnimating = useRef(false);

  // Theme configuration
  const isRenaissance = variant === 'renaissance';
  const isModernBlue = variant === 'modern-blue';
  const isPremium = variant === 'premium';
  
  const colors = {
    screenBg: isPremium ? "#FAF8F5" : (isModernBlue ? "#1A1A2E" : (isRenaissance ? "#F5EFE6" : "#020202")),
    envBg: isPremium ? "#7A8B7C" : (isModernBlue ? "#F8F9FB" : (isRenaissance ? "#EAE0D5" : "#0c0c0c")),
    envSide: isPremium ? "#6E7E70" : (isModernBlue ? "#F0F2F5" : (isRenaissance ? "#DCD0C0" : "#0e0e0e")),
    envBottom: isPremium ? "#637165" : (isModernBlue ? "#E1E5EA" : (isRenaissance ? "#D0C0B0" : "#111")),
    envTop: isPremium ? "linear-gradient(to bottom, #FAF8F5, #7A8B7C)" : (isModernBlue ? "linear-gradient(to bottom, #FFFFFF, #F8F9FB)" : (isRenaissance ? "linear-gradient(to bottom, #F5EFE6, #EAE0D5)" : "linear-gradient(to bottom, #141414, #0a0a0a)")),
    waxBase: isPremium ? "from-[#FAF8F5] via-[#C9A96E] to-[#B39358]" : (isModernBlue ? "from-[#5B7B9D] via-[#8AADCF] to-[#5B7B9D]" : "from-[#D4AF37] via-[#B38728] to-[#8a6d1f]"),
    waxInner: isPremium ? "from-[#C9A96E] to-[#B39358]" : (isModernBlue ? "from-[#8AADCF] to-[#5B7B9D]" : "from-[#FFDF70] to-[#B38728]"),
    waxText: isPremium ? "#FAF8F5" : (isModernBlue ? "#FFFFFF" : "#2C2C2C"),
    guestText: isPremium ? "#FAF8F5" : (isModernBlue ? "#1A1A2E" : (isRenaissance ? "#3D3229" : "white")),
    guestLabel: isPremium ? "#C9A96E" : (isModernBlue ? "#5B7B9D" : (isRenaissance ? "#8B7355" : "#D4AF37")),
    cardBg: isPremium ? "#FAF8F5" : "#FFFFFF",
    cardLine: isPremium ? "rgba(122, 139, 124, 0.3)" : (isModernBlue ? "rgba(91, 123, 157, 0.3)" : "rgba(212, 175, 55, 0.3)"),
    cardAccent: isPremium ? "#7A8B7C" : (isModernBlue ? "#5B7B9D" : "#D4AF37"),
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
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    
    if (window.innerWidth >= 1024) {
      const move = (e: MouseEvent) => {
        rawX.set((e.clientX / window.innerWidth - 0.5) * 40);
        rawY.set(-(e.clientY / window.innerHeight - 0.5) * 20);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener('resize', checkMobile);
      return () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener('resize', checkMobile);
      };
    }
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [rawX, rawY]);

  const tap = () => {
    if (isAnimating.current || step >= 4) return;
    isAnimating.current = true;
    
    // Step 1: Break the wax seal
    setStep(1);
    
    // Step 2: Open the envelope flap
    setTimeout(() => {
      setStep(2);
    }, 600);

    // Step 3: Pull the card completely out of the envelope
    setTimeout(() => {
      setStep(3);
    }, 1400);

    // Step 4: Drop the envelope down & bring the card to center screen
    setTimeout(() => {
      setStep(4);
    }, 2400);

    // Step 5: Fade to the actual invitation
    setTimeout(() => {
      isAnimating.current = false;
      onOpen();
    }, 4000);
  };

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.15, filter: "blur(20px)" }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[60] flex items-center justify-center cursor-pointer select-none overflow-hidden"
      style={{ backgroundColor: colors.screenBg }}
      onClick={tap}
    >
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_60%)]" />
      
      {isModernBlue && (
        <>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#5B7B9D]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#8AADCF]/10 rounded-full blur-[120px]" />
          </div>
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
            backgroundImage: "linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}></div>
        </>
      )}

      {isPremium && (
        <>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#7A8B7C]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#C9A96E]/5 rounded-full blur-[120px]" />
          </div>
          <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none bg-[url('/assets/noise.png')]" />
        </>
      )}
      
      <motion.div
        style={!isMobile ? { rotateY: tiltX, rotateX: tiltY, transformPerspective: 1200, transformStyle: "preserve-3d" } : {}}
        className="relative w-[300px] md:w-[380px] aspect-[4/3] drop-shadow-[0_35px_50px_rgba(0,0,0,0.5)]"
      >
        {/* ENVELOPE BACK */}
        <motion.div 
          animate={step >= 4 ? { y: "100vh", opacity: 0, rotateZ: 10 } : { y: 0, opacity: 1, rotateZ: 0 }}
          transition={{ duration: 1.2, ease: [0.45, 0, 0.55, 1] }}
          className="absolute inset-0 rounded-xl shadow-inner z-0" 
          style={{ backgroundColor: colors.envBg }} 
        />

        {/* THE CARD */}
        <motion.div
          animate={
            step === 3 ? { y: -300, scale: 1, zIndex: 10 } :
            step >= 4 ? { y: 0, scale: 1.2, zIndex: 50, boxShadow: "0 40px 100px rgba(0,0,0,0.8)" } : 
            { y: 0, scale: 1, zIndex: 10 }
          }
          transition={{ duration: 0.9, ease: [0.33, 1, 0.68, 1] }}
          className="absolute left-[8%] right-[8%] top-[8%] bottom-[8%] rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center text-center p-6"
          style={{ backgroundColor: colors.cardBg }}
        >
          <div className="w-10 h-px mb-5" style={{ backgroundColor: colors.cardLine }} />
          <p className="text-[8px] uppercase tracking-[0.5em] text-gray-400 font-black mb-3">The Wedding of</p>
          <h1 className="font-serif text-3xl text-gray-900 mb-2">{bride} <span style={{ color: colors.cardAccent }}>&</span> {groom}</h1>
          <p className="text-[8px] font-black uppercase tracking-[0.3em]" style={{ color: colors.cardAccent }}>{date}</p>
          <div className="w-10 h-px mt-5" style={{ backgroundColor: colors.cardLine }} />
        </motion.div>

        {/* ENVELOPE FRONT (Flaps) */}
        <motion.div 
          animate={step >= 4 ? { y: "100vh", opacity: 0, rotateZ: -5 } : { y: 0, opacity: 1, rotateZ: 0 }}
          transition={{ duration: 1.2, ease: [0.45, 0, 0.55, 1] }}
          className="absolute inset-0 z-20 pointer-events-none"
        >
          <div className="absolute inset-y-0 left-0 w-[52%] [clip-path:polygon(0%_0%,100%_50%,0%_100%)] shadow-inner" style={{ backgroundColor: colors.envSide, filter: 'brightness(0.95)' }} />
          <div className="absolute inset-y-0 right-0 w-[52%] [clip-path:polygon(100%_0%,0%_50%,100%_100%)] shadow-inner" style={{ backgroundColor: colors.envSide, filter: 'brightness(0.95)' }} />
          <div className="absolute inset-x-0 bottom-0 h-[75%] [clip-path:polygon(0%_100%,50%_0%,100%_100%)] shadow-2xl" style={{ backgroundColor: colors.envBottom }}>
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center w-full px-4">
               <p className="text-[7px] uppercase tracking-[0.3em] font-black mb-1" style={{ color: colors.guestLabel }}>Undangan Spesial Untuk</p>
               <p className="font-serif text-lg italic tracking-tight opacity-80 line-clamp-1" style={{ color: colors.guestText }}>{guestName || "Tamu Undangan"}</p>
             </motion.div>
          </div>
        </motion.div>

        {/* ENVELOPE TOP FLAP */}
        <motion.div 
          animate={step >= 4 ? { y: "100vh", opacity: 0, rotateZ: 5 } : { y: 0, opacity: 1, rotateZ: 0 }}
          transition={{ duration: 1.2, ease: [0.45, 0, 0.55, 1] }}
          className={`absolute inset-x-0 top-0 h-[52%] pointer-events-none rounded-t-xl z-30`}
          style={{
            clipPath: step >= 2 ? "polygon(0% 0%, 100% 0%, 50% 0%)" : "polygon(0% 0%, 100% 0%, 50% 100%)",
            transition: "clip-path 0.8s cubic-bezier(0.33, 1, 0.68, 1)",
            background: colors.envTop,
            filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))'
          }}
        />

        {/* WAX SEAL */}
        <AnimatePresence>
          {step < 1 && (
            <motion.div exit={{ scale: 2.2, opacity: 0, filter: "blur(25px)", rotate: 15 }} transition={{ duration: 0.6, ease: "easeIn" }} className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-[200]">
              <div className={`w-[72px] h-[72px] rounded-full bg-gradient-to-br ${colors.waxBase} shadow-[0_15px_40px_rgba(0,0,0,0.6),inset_0_-4px_8px_rgba(0,0,0,0.3),inset_0_4px_8px_rgba(255,255,255,0.4)] flex items-center justify-center border border-white/10`}>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[54px] h-[54px] bg-gradient-to-br ${colors.waxInner} rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.4),0_2px_4px_rgba(255,255,255,0.3)] z-[30] flex items-center justify-center border border-[#D4AF37]/40 overflow-hidden`}>
                  <motion.div 
                    animate={{ x: ["-100%", "100%"] }} 
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                  />
                  <span className="relative z-10 text-[10px] font-black uppercase tracking-widest drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]" style={{ color: colors.waxText }}>{bride[0]} & {groom[0]}</span>
                </div>
                <div className="absolute -inset-1 rounded-full border-[3px] border-[#D4AF37]/20 blur-[1px]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* TAP INSTRUCTION */}
      <AnimatePresence>
        {step === 0 && (
          <motion.div animate={{ y: [0, 8, 0], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 3, repeat: Infinity }} className="absolute bottom-20 flex flex-col items-center pointer-events-none">
            <p className="text-[7px] font-black uppercase tracking-[1.2em]" style={{ color: colors.waxText }}>Tap to Open</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
