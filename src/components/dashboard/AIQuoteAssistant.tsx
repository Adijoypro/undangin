"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AIQuoteAssistantProps {
  brideName: string;
  groomName: string;
  isAiEnabled?: boolean;
  onGenerated: (text: string) => void;
}

export default function AIQuoteAssistant({ brideName, groomName, isAiEnabled = false, onGenerated }: AIQuoteAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-wedding-gold/10 text-wedding-gold hover:bg-wedding-gold hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest border border-wedding-gold/20"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        AI Bantu Tulis ✨
        <span className="bg-wedding-gold text-white px-1 py-0.5 rounded-[4px] text-[6px] font-black animate-pulse">COMING SOON</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
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
                <div className="relative w-32 h-32 mx-auto mb-6">
                  {/* Glowing background for the brain */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-wedding-gold/20 blur-3xl rounded-full"
                  />
                  
                  {/* The 3D Brain Asset (Optimized WebP) */}
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [-10, 10, -10] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative z-10 w-full h-full"
                  >
                    <Image
                      src="/assets/branding/final/ai_brain_solid_gold_white_bg_1777347957531.webp"
                      alt="AI Brain"
                      fill
                      className="object-contain drop-shadow-[0_10px_20px_rgba(180,140,80,0.3)]"
                      priority
                    />
                  </motion.div>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <h3 className="font-serif text-3xl text-wedding-text dark:text-white mb-2 tracking-tight">AI Quote Assistant</h3>
                  <p className="text-[10px] text-wedding-gold font-bold uppercase tracking-[0.2em] opacity-70 mb-10">Powered by Neural Core AI Series 8</p>

                  <div className="relative w-full p-8 bg-wedding-gold/[0.03] dark:bg-wedding-gold/[0.05] rounded-[32px] border border-wedding-gold/20 text-center mb-10 overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3">
                      <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wedding-gold opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-wedding-gold"></span>
                      </span>
                    </div>
                    
                    <p className="text-[10px] font-black text-wedding-gold mb-3 uppercase tracking-[0.3em]">Sedang Bertapa! ✨</p>
                    <div className="max-w-[280px] mx-auto text-center">
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed italic text-center">
                        "Asisten penulis AI kami sedang meracik ribuan kutipan cinta paling puitis dari seluruh penjuru Nusantara khusus untukmu."
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full max-w-[300px] mx-auto">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-4 bg-wedding-gold text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-wedding-gold/20 hover:scale-[1.02] transition-all"
                    >
                      Okey, Ditunggu Kabarnya! ❤️
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
        )}
      </AnimatePresence>
    </>
  );
}
