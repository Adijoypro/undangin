"use client";

import { useState } from "react";
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
        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-wedding-gold/10 text-wedding-gold hover:bg-wedding-gold hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-wedding-gold/20 shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        AI Music Composer ✨
        <span className="bg-wedding-gold text-white px-1.5 py-0.5 rounded text-[7px] font-black border border-wedding-gold animate-pulse">COMING SOON</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-wedding-text/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl p-8 border border-wedding-gold/20"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-wedding-gold/10 text-wedding-gold rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner border border-wedding-gold/20">
                  🎼
                </div>
                <h3 className="font-serif text-2xl text-wedding-text dark:text-white mb-2">AI Music Composer</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Gubah musik unik untuk hari spesialmu</p>
              </div>

              <div className="p-6 bg-wedding-gold/5 dark:bg-wedding-gold/10 rounded-2xl border-2 border-dashed border-wedding-gold/30 text-center mb-8">
                <p className="text-sm font-bold text-wedding-gold mb-2 uppercase tracking-widest">Fitur Sedang Digubah! ✨</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed italic">
                  Kami sedang menyempurnakan algoritma AI untuk menghasilkan melodi pernikahan yang paling menyentuh hati. Nantikan segera!
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 bg-wedding-gold text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-wedding-gold/20"
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
