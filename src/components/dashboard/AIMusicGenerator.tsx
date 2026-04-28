"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface AIMusicGeneratorProps {
  onGenerated: (result: { url: string; isAiGenerated: boolean; message?: string }) => void;
}

export default function AIMusicGenerator({ onGenerated }: AIMusicGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-wedding-gold/10 text-wedding-gold hover:bg-wedding-gold hover:text-black transition-all text-[10px] font-black uppercase tracking-widest border border-wedding-gold/20 shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        AI Music Composer ✨
        <span className="bg-wedding-gold text-black px-1.5 py-0.5 rounded text-[7px] font-black border border-wedding-gold animate-pulse">COMING SOON</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-wedding-text/80 backdrop-blur-md transition-colors duration-500"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-wedding-base rounded-[3rem] overflow-hidden shadow-2xl p-10 border border-wedding-gold/20 transition-colors duration-500 flex flex-col items-center text-center"
            >
              <div className="relative mb-8">
                <motion.div 
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10 w-40 h-40 flex items-center justify-center"
                >
                  <div className="absolute inset-6 bg-wedding-gold/20 blur-3xl rounded-full" />
                  <Image 
                    src="/assets/branding/final/nusantara_angklung_solid_white_bg_1777350011138.webp"
                    alt="Angklung"
                    width={160}
                    height={160}
                    className="object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(180,140,80,0.4)]"
                  />
                </motion.div>
              </div>

              <div className="mb-8">
                <h3 className="font-serif text-3xl text-wedding-text mb-2 tracking-tight">AI Music Composer</h3>
                <p className="text-[10px] text-wedding-gold font-black uppercase tracking-[0.4em]">Powered by Neural Orchestra</p>
              </div>

              <div className="p-6 bg-wedding-text/[0.03] rounded-3xl border-2 border-dashed border-wedding-gold/30 text-center mb-8">
                <p className="text-sm font-black text-wedding-gold mb-2 uppercase tracking-[0.2em]">Fitur Sedang Digubah! ✨</p>
                <p className="text-[10px] text-wedding-text/40 leading-relaxed italic">
                  Kami sedang menyempurnakan algoritma AI untuk menghasilkan melodi pernikahan yang paling menyentuh hati. Nantikan segera!
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 bg-wedding-gold text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-wedding-gold/20 hover:opacity-80 transition-all active:scale-95"
                >
                  Siap, Kabari Saya Nanti! 🙌
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
