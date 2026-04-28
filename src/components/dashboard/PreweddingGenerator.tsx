"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { generatePreweddingAI } from "@/app/api/ai-photo/actions";

interface PreweddingGeneratorProps {
  currentPhotoUrl?: string;
  isAiEnabled?: boolean;
  onGenerated: (newUrl: string) => void;
}

export default function PreweddingGenerator({ currentPhotoUrl, isAiEnabled = false, onGenerated }: PreweddingGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4">
      <div className="relative group">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full px-6 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-3 bg-wedding-gold/5 text-wedding-gold border-2 border-dashed border-wedding-gold/20 hover:bg-wedding-gold/10 transition-all group-hover:border-wedding-gold/40 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="tracking-widest uppercase">Sulap Prewed AI</span>
            <span className="bg-wedding-gold text-white px-2 py-0.5 rounded text-[8px] font-black border border-wedding-gold animate-pulse">COMING SOON</span>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
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
                    y: [0, -10, 0],
                    rotate: [0, 15, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10 w-40 h-40 flex items-center justify-center"
                >
                  <div className="absolute inset-8 bg-wedding-gold/20 blur-3xl rounded-full" />
                  <Image 
                    src="/assets/branding/final/ai_magic_wand_solid_white_bg_1777348322448.webp"
                    alt="Magic Wand"
                    width={160}
                    height={160}
                    className="object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(180,140,80,0.4)]"
                  />
                </motion.div>
              </div>

              <div className="mb-8">
                <h3 className="font-serif text-3xl text-wedding-text mb-2 tracking-tight">Sulap Prewed AI</h3>
                <p className="text-[10px] text-wedding-gold font-black uppercase tracking-[0.4em]">Powered by Vision Studio AI</p>
              </div>

              <div className="p-6 bg-wedding-gold/5 dark:bg-wedding-gold/10 rounded-2xl border-2 border-dashed border-wedding-gold/30 text-center mb-8">
                <p className="text-sm font-bold text-wedding-gold mb-2 uppercase tracking-widest">Lagi Fitting Baju! 🤵‍♂️👰‍♀️</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed italic">
                  AI kami sedang belajar cara memakaikan gaun dan jas terbaik untukmu. Kamu bakal kaget liat hasilnya nanti!
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 bg-wedding-gold text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-wedding-gold/20"
                >
                  Asik, Saya Tungguin Ya! ✨
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
