"use client";

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
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-wedding-gold/10 text-wedding-gold rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner border border-wedding-gold/20">
                  ✍️
                </div>
                <h3 className="font-serif text-2xl text-wedding-text dark:text-white mb-2">AI Quote Assistant</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Susun kata-kata mutiara romantis secara otomatis</p>
              </div>

              <div className="p-6 bg-wedding-gold/5 dark:bg-wedding-gold/10 rounded-2xl border-2 border-dashed border-wedding-gold/30 text-center mb-8">
                <p className="text-sm font-bold text-wedding-gold mb-2 uppercase tracking-widest">Lagi Cari Inspirasi! ✨</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed italic">
                  Asisten penulis AI kami sedang "bertapa" untuk mencari ribuan kutipan cinta yang paling puitis untukmu. Segera hadir!
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 bg-wedding-gold text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-wedding-gold/20"
                >
                  Okey, Ditunggu Kabarnya! ❤️
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
