"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";

export default function EnvelopeTestPage() {
  const [step, setStep] = useState(0);
  const [cardInFront, setCardInFront] = useState(false);
  // 0: Sealed → tap → 1: Seal dissolve → tap → 2: Flap opens → tap → 3: Card rises → tap → 4: Reveal
  const isAnimating = useRef(false);

  // Delayed z-index: card starts behind envelope, then comes to front after 0.8s
  useEffect(() => {
    if (step === 3) {
      setCardInFront(false);
      const timer = setTimeout(() => setCardInFront(true), 800);
      return () => clearTimeout(timer);
    } else {
      setCardInFront(false);
    }
  }, [step]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tiltX = useSpring(rawX, { stiffness: 80, damping: 20 });
  const tiltY = useSpring(rawY, { stiffness: 80, damping: 20 });

  // Each tap advances one step (with a lock to prevent spam)
  const handleTap = () => {
    if (isAnimating.current) return;
    if (step >= 4) return;

    isAnimating.current = true;
    setStep((prev) => prev + 1);

    // Lock duration matches the animation of each step
    const lockDurations: Record<number, number> = {
      0: 1000,  // seal dissolve takes ~0.9s
      1: 2000,  // flap open takes ~1.8s
      2: 2600,  // card rise takes ~2.5s
      3: 1500,  // exit transition
    };
    setTimeout(() => {
      isAnimating.current = false;
    }, lockDurations[step] || 1000);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 50);
      rawY.set(-(e.clientY / window.innerHeight - 0.5) * 30);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [rawX, rawY]);

  return (
    <div
      className="min-h-screen bg-[#020202] flex items-center justify-center p-4 overflow-hidden font-sans select-none cursor-pointer"
      onClick={handleTap}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(184,134,11,0.04),transparent_60%)]" />

      <AnimatePresence mode="wait">
        {step < 4 ? (
          <motion.div
            key="envelope-stage"
            exit={{ opacity: 0, scale: 1.15, filter: "blur(60px)" }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center"
          >
            {/* ═══ 3D TILT WRAPPER ═══ */}
            <motion.div
              style={{
                rotateY: tiltX,
                rotateX: tiltY,
                transformPerspective: 1200,
                transformStyle: "preserve-3d",
              }}
              className="relative w-[300px] md:w-[380px] aspect-[4/3]"
            >
              {/* ═══ FLAT STACKING CONTEXT ═══
                  Breaks preserve-3d chain so z-index works normally */}
              <div className="absolute inset-0" style={{ transformStyle: "flat" }}>

                {/* ── LAYER 1: ENVELOPE BODY ── */}
                <div className={`absolute inset-0 rounded-xl z-10 ${step >= 3 ? "" : "overflow-hidden"}`}>
                  {/* Back wall */}
                  <div className="absolute inset-0 bg-[#0c0c0c] rounded-xl">
                    <div
                      className="absolute inset-0 opacity-[0.03]"
                      style={{ backgroundImage: "url(/assets/branding/batik_pattern.webp)", backgroundSize: "130px" }}
                    />
                  </div>

                  {/* LAYER 2: THE CARD
                      Starts rising at z-15 (behind flaps), then after 0.8s
                      switches to z-50 (in front of everything) */}
                  <motion.div
                    initial={{ y: 0 }}
                    animate={step >= 3 ? { y: "-70%" } : { y: 0 }}
                    transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                    className={`absolute left-[8%] right-[8%] top-[8%] bottom-[8%] bg-white rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-center p-6 ${cardInFront ? "z-[50]" : "z-[15]"}`}
                  >
                    <div className="w-10 h-px bg-wedding-gold/30 mb-5" />
                    <p className="text-[8px] uppercase tracking-[0.5em] text-gray-400 font-black mb-3">
                      The Wedding of
                    </p>
                    <h1 className="font-serif text-3xl text-gray-900 mb-2 tracking-tight">
                      Adji <span className="text-wedding-gold">&</span> Putri
                    </h1>
                    <p className="text-[8px] text-wedding-gold font-black uppercase tracking-[0.3em]">
                      12 · 12 · 2026
                    </p>
                    <div className="w-10 h-px bg-wedding-gold/30 mt-5" />
                  </motion.div>

                  {/* LAYER 3 & 4: Side flaps */}
                  <div className="absolute inset-y-0 left-0 w-[52%] bg-[#0e0e0e] [clip-path:polygon(0%_0%,100%_50%,0%_100%)] z-[20]" />
                  <div className="absolute inset-y-0 right-0 w-[52%] bg-[#0e0e0e] [clip-path:polygon(100%_0%,0%_50%,100%_100%)] z-[20]" />
                  {/* LAYER 5: Bottom pocket */}
                  <div className="absolute inset-x-0 bottom-0 h-[75%] bg-[#111] [clip-path:polygon(0%_100%,50%_0%,100%_100%)] z-[20]" />
                  {/* Edge lines */}
                  <div className="absolute inset-y-0 left-0 w-[52%] [clip-path:polygon(0%_0%,100%_50%,0%_100%)] border-r border-white/[0.03] z-[21] pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-[52%] [clip-path:polygon(100%_0%,0%_50%,100%_100%)] border-l border-white/[0.03] z-[21] pointer-events-none" />
                </div>

                {/* ── LAYER 6: TOP FLAP ──
                    Uses CSS clip-path transition for smooth "lift up" animation.
                    Full triangle → thin strip = flap opens upward like a box lid.
                    CSS transition handles the smooth interpolation. */}
                <div
                  className={`absolute inset-x-0 top-0 h-[52%] pointer-events-none rounded-t-xl ${step >= 2 ? "z-[1]" : "z-[30]"}`}
                  style={{
                    clipPath: step >= 2
                      ? "polygon(0% 0%, 100% 0%, 50% 12%)"
                      : "polygon(0% 0%, 100% 0%, 50% 100%)",
                    transition: "clip-path 1.8s cubic-bezier(0.33, 1, 0.68, 1)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#141414] to-[#0a0a0a]">
                    <div
                      className="absolute inset-0 opacity-[0.02]"
                      style={{ backgroundImage: "url(/assets/branding/batik_pattern.webp)", backgroundSize: "100px" }}
                    />
                  </div>
                  {/* Fold line (visible edge of opened flap) */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.08]" />
                </div>

                {/* ── LAYER 7: WAX SEAL ── */}
                <AnimatePresence>
                  {step < 1 && (
                    <motion.div
                      exit={{ scale: 2.2, opacity: 0, filter: "blur(25px)", rotate: 15 }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-[200] pointer-events-none"
                    >
                      <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-[#8b0000] via-[#6a0000] to-[#350000] shadow-[0_8px_30px_rgba(100,0,0,0.8),0_0_60px_rgba(139,0,0,0.2)] flex items-center justify-center relative">
                        <div className="absolute -top-1 -left-1.5 w-5 h-4 bg-[#7a0000] rounded-full blur-[2px] opacity-70" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#520000] rounded-full blur-[2px] opacity-60" />
                        <div className="absolute top-0.5 right-1.5 w-3 h-3 bg-[#6a0000] rounded-full blur-[1px] opacity-40" />
                        <div className="w-[46px] h-[46px] rounded-full border-2 border-wedding-gold/25 flex items-center justify-center bg-[#350000]/60 backdrop-blur-sm overflow-hidden p-1">
                          <Image
                            src="/logo.webp"
                            alt="Undangin"
                            width={32}
                            height={32}
                            className="w-full h-full object-contain brightness-[2.5] contrast-125 opacity-90"
                          />
                        </div>
                        <div className="absolute top-1.5 left-2.5 w-[55%] h-[30%] bg-gradient-to-b from-white/15 to-transparent rounded-full blur-[1px]" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* SEAL BREAK PARTICLES (appear when step becomes 1) */}
                <AnimatePresence>
                  {step === 1 && (
                    <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-[210] pointer-events-none">
                      {[...Array(24)].map((_, i) => {
                        const angle = (i / 24) * Math.PI * 2;
                        const dist = 60 + Math.random() * 140;
                        return (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                            animate={{
                              scale: [0, 1.2, 0],
                              x: Math.cos(angle) * dist,
                              y: Math.sin(angle) * dist,
                              opacity: [1, 0.8, 0],
                            }}
                            transition={{ duration: 0.7 + Math.random() * 0.5, ease: "easeOut" }}
                            className="absolute rounded-full"
                            style={{
                              width: Math.random() * 4 + 2 + "px",
                              height: Math.random() * 4 + 2 + "px",
                              background:
                                i % 4 === 0 ? "#D4AF37" : i % 4 === 1 ? "#8b0000" : i % 4 === 2 ? "#F9E498" : "#cc3333",
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </AnimatePresence>

              </div>{/* end flat stacking wrapper */}

              {/* Shadow */}
              <div className="absolute -bottom-6 left-[12%] right-[12%] h-6 bg-black/50 blur-xl rounded-full z-0" />
            </motion.div>

            {/* TAP INDICATOR */}
            {step === 0 && (
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [0.25, 0.6, 0.25] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="mt-14 flex flex-col items-center"
              >
                <p className="text-wedding-gold text-[7px] font-black uppercase tracking-[1.2em] ml-[1.2em]">
                  Tap to Open
                </p>
                <div className="mt-3 w-px h-8 bg-gradient-to-b from-wedding-gold/30 to-transparent" />
              </motion.div>
            )}

            {/* CONTINUE INDICATOR (between steps) */}
            {step >= 1 && step <= 3 && (
              <motion.div
                key={`hint-${step}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: step === 1 ? 1 : step === 2 ? 2 : 2.5 }}
                className="mt-10"
              >
                <p className="text-wedding-gold/40 text-[7px] font-black uppercase tracking-[0.8em]">
                  {step === 1 ? "Tap to Open" : step === 2 ? "Tap to Reveal" : "Tap to Continue"}
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* ═══ STEP 4: FULL REVEAL ═══ */
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-white p-6"
          >
            <motion.div
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/[0.04] backdrop-blur-3xl p-14 md:p-20 rounded-[3rem] border border-white/10 shadow-[0_40px_150px_rgba(0,0,0,0.8)] flex flex-col items-center"
            >
              <Image src="/logo.webp" alt="Logo" width={48} height={48} className="w-12 h-12 object-contain mb-10" />
              <h2 className="font-serif text-4xl md:text-6xl mb-3 tracking-tighter">Mahakarya</h2>
              <p className="text-wedding-gold/40 uppercase tracking-[0.5em] text-[9px] font-black ml-[0.5em]">
                Undangan Digital Premium
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); setStep(0); }}
                className="mt-14 px-12 py-4 border border-wedding-gold/20 text-wedding-gold text-[8px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-wedding-gold hover:text-black transition-all duration-500"
              >
                Ulangi
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
