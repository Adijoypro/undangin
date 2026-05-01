"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function DraftMarketingPage() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const lightX = useSpring(mouseX, springConfig);
  const lightY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {/* SPOTLIGHT EFFECT */}
      <motion.div 
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: `radial-gradient(600px circle at ${lightX}px ${lightY}px, rgba(212, 175, 55, 0.08), transparent 80%)`,
        }}
      />

      <div className="max-w-md space-y-8 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-wedding-gold/10 border border-wedding-gold/20 rounded-full">
            <div className="w-2 h-2 bg-wedding-gold rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-wedding-gold uppercase tracking-[0.2em]">Undangan Sedang Disiapkan</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight">Momen Bahagia <br/> Segera Hadir</h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Halaman ini masih dalam tahap penyelarasan oleh pasangan berbahagia. Silakan kembali lagi nanti untuk melihat detail lengkapnya.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-8 border-t border-zinc-800 space-y-6"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">Powered by Undangin</p>
          <div className="bg-gradient-to-br from-zinc-900/50 to-black p-6 rounded-[2.5rem] border border-wedding-gold/20 shadow-2xl backdrop-blur-sm relative group overflow-hidden">
            {/* INNER GLOW ON HOVER */}
            <div className="absolute inset-0 bg-wedding-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <h3 className="text-white font-serif text-lg mb-2 relative z-10">Ingin Buat Undangan Semewah Ini?</h3>
            <p className="text-zinc-400 text-xs mb-6 relative z-10">Mulai dari tema klasik hingga ultra-luxury, buat hari bahagiamu makin berkesan.</p>
            <a 
              href="/" 
              className="inline-block w-full py-4 bg-wedding-gold text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] relative z-10"
            >
              Cek Katalog Tema
            </a>
          </div>
        </motion.div>
      </div>

      {/* BACKGROUND DECORATION */}
      <div className="fixed top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-wedding-gold/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-wedding-gold/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
