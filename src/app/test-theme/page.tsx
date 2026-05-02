"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";

/* ── HELPERS ── */
function useSectionAnim(p: MotionValue<number>, range: [number, number, number]) {
  return {
    opacity: useTransform(p, range, [0, 1, 0]),
    scale: useTransform(p, range, [0.8, 1, 1.1]),
    y: useTransform(p, range, [100, 0, -100]),
  };
}

export default function CinematicThemeTest() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  /* ── CAMERA ANIMATIONS (The Core Request) ── */
  
  // 1. Blur: Start blurry, clear up as we zoom
  const photoBlur = useTransform(scrollYProgress, [0, 0.1, 0.25], ["blur(20px)", "blur(10px)", "blur(0px)"]);
  
  // 2. Scale (Zoom): Far away (0.8) -> Zoom in (1.3)
  const photoScale = useTransform(scrollYProgress, [0, 0.15, 0.4], [0.8, 1, 1.3]);
  
  // 3. Position (Pan): Stay center -> Shift Right (X: 30%) -> Shift more or stay
  const photoX = useTransform(scrollYProgress, [0, 0.5, 0.8], ["0%", "0%", "25%"]);
  
  // 4. Dimming: Darker as we reach text-heavy sections
  const photoOverlay = useTransform(scrollYProgress, [0, 0.3, 0.6, 0.9], [0.4, 0.2, 0.6, 0.8]);

  /* ── SECTION ANIMATIONS ── */
  const s1 = useSectionAnim(scrollYProgress, [0, 0.08, 0.15]); // Opening
  const s2 = useSectionAnim(scrollYProgress, [0.2, 0.3, 0.45]); // Quote / Intro
  const s3 = useSectionAnim(scrollYProgress, [0.45, 0.55, 0.7]); // The Couple
  const s4 = useSectionAnim(scrollYProgress, [0.7, 0.85, 0.95]); // Event Details (Appear while photo is shifted right)

  return (
    <div ref={containerRef} className="relative bg-black" style={{ height: "600vh" }}>
      {/* ── CINEMATIC CAMERA BACKGROUND ── */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <motion.div 
          style={{ 
            scale: photoScale, 
            x: photoX,
            filter: photoBlur,
          }}
          className="relative w-full h-full origin-center"
        >
          {/* Using the generated premium asset */}
          <Image 
            src="/celestial_couple_cinematic_1777702390165.png" 
            alt="Cinematic Background" 
            fill 
            className="object-cover"
            priority
          />
          {/* Dynamic Overlay */}
          <motion.div 
            style={{ opacity: photoOverlay }}
            className="absolute inset-0 bg-black"
          />
        </motion.div>
      </div>

      {/* ── CONTENT OVERLAYS ── */}
      
      {/* SECTION 1: HERO (The Invitation Card) */}
      <motion.div 
        style={s1}
        className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
      >
        <div className="bg-white p-10 md:p-16 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] text-center max-w-sm">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.5em] mb-4">The Wedding of</p>
          <h1 className="font-serif text-4xl text-gray-900 mb-2">Adji <span className="text-wedding-gold">&</span> Putri</h1>
          <div className="w-10 h-px bg-wedding-gold/30 mx-auto my-6" />
          <p className="text-[10px] text-wedding-gold font-black uppercase tracking-[0.3em]">12 · 12 · 2026</p>
        </div>
      </motion.div>

      {/* SECTION 2: QUOTE */}
      <motion.div 
        style={s2}
        className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
      >
        <div className="max-w-xl px-10 text-center">
          <div className="w-12 h-px bg-wedding-gold/30 mx-auto mb-8" />
          <p className="font-serif text-xl md:text-3xl text-white/90 leading-relaxed italic">
            "Love is not about how many days, months, or years you have been together."
          </p>
          <div className="w-12 h-px bg-wedding-gold/30 mx-auto mt-8" />
        </div>
      </motion.div>

      {/* SECTION 3: THE COUPLE */}
      <motion.div 
        style={s3}
        className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
      >
        <div className="text-center space-y-2">
          <p className="text-wedding-gold text-[10px] font-black uppercase tracking-[0.5em] mb-4">Introducing</p>
          <h2 className="font-serif text-5xl md:text-7xl text-white">Adji <span className="text-wedding-gold">&</span> Putri</h2>
        </div>
      </motion.div>

      {/* SECTION 4: EVENT (SHIFTED LEFT because photo is shifted right) */}
      <motion.div 
        style={s4}
        className="fixed inset-0 z-10 flex items-center justify-center md:justify-start md:pl-32 pointer-events-none"
      >
        <div className="max-w-md bg-black/40 backdrop-blur-3xl p-10 rounded-[2rem] border border-white/10 space-y-6">
          <div>
            <p className="text-wedding-gold text-[9px] font-black uppercase tracking-[0.4em] mb-2">Save the Date</p>
            <h3 className="font-serif text-3xl text-white">Saturday, Dec 12</h3>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            We can't wait to share our special day with you. The ceremony will be held at The Glass House.
          </p>
          <div className="pt-4">
            <button className="px-8 py-3 bg-wedding-gold text-black text-[10px] font-black uppercase tracking-widest rounded-full">
              View Map
            </button>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator for testing */}
      <div className="fixed bottom-10 right-10 z-50 text-[10px] text-white/20 font-mono">
        Progress: {(scrollYProgress.get() * 100).toFixed(0)}%
      </div>
    </div>
  );
}
