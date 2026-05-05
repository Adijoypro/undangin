"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface DigitalEnvelopeProps {
  guestName?: string;
  onOpen: () => void;
}

export default function DigitalEnvelope({ guestName, onOpen }: DigitalEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(onOpen, 1500); // Tunggu animasi selesai baru pindah
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[70] bg-[#FAF7F2] flex items-center justify-center overflow-hidden"
    >
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <Image src="/assets/ultra-luxury/paper.webp" fill className="object-cover" alt="Texture" />
      </div>

      <div className="relative w-full max-w-[500px] aspect-[4/3] px-4 group">
        {/* Envelope Body */}
        <motion.div 
          animate={isOpen ? { y: 200, opacity: 0 } : { y: 0 }}
          className="relative w-full h-full"
        >
          {/* Main Envelope (Back) */}
          <div className="absolute inset-0 bg-[#F5F0E8] shadow-2xl rounded-sm border border-[#C9A96E]/10 overflow-hidden">
             <div className="absolute inset-0 opacity-10">
               <Image src="/assets/ultra-luxury/linen.webp" fill className="object-cover" alt="Linen" />
             </div>
          </div>

          {/* Flap (Animated) */}
          <motion.div 
            initial={{ rotateX: 0 }}
            animate={isOpen ? { rotateX: -160, zIndex: 0 } : { rotateX: 0, zIndex: 20 }}
            style={{ transformOrigin: "top", transformStyle: "preserve-3d" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-[#EDE7DB] border border-[#C9A96E]/20 shadow-sm rounded-t-sm"
          >
             <div className="absolute inset-0 opacity-5">
               <Image src="/assets/ultra-luxury/linen.webp" fill className="object-cover" alt="Linen" />
             </div>
             {/* Flap Point */}
             <div 
               className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[250px] border-l-transparent border-r-[250px] border-r-transparent border-t-[100px] border-t-[#EDE7DB]"
               style={{ width: 'calc(100% + 2px)', marginLeft: '-1px' }}
             ></div>
          </motion.div>

          {/* Front Fold (Left) */}
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[#F5F0E8] z-10 clip-path-envelope-left border-r border-white/20"></div>
          {/* Front Fold (Right) */}
          <div className="absolute bottom-0 right-0 w-1/2 h-full bg-[#F5F0E8] z-10 clip-path-envelope-right border-l border-white/20"></div>
          {/* Front Fold (Bottom) */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#F0EBE3] z-10 clip-path-envelope-bottom shadow-inner"></div>

          {/* Recipient Box (The Aesthetic Label) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-2/3">
             <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#C9A96E]/30 shadow-lg rounded-sm transform rotate-[-1deg]">
                <p className="text-[8px] uppercase tracking-[0.4em] text-[#C9A96E] mb-2 font-bold">Special Invitation For</p>
                <div className="w-8 h-px bg-[#C9A96E]/40 mx-auto mb-3"></div>
                <h3 className="font-serif italic text-xl text-[#2C1810]">{guestName || "Tamu Undangan"}</h3>
             </div>
          </div>

          {/* WAX SEAL BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="absolute bottom-[20%] left-1/2 -translate-x-1/2 z-30 cursor-pointer"
          >
             {/* The Wax Seal SVG */}
             <div className="relative w-16 h-16 drop-shadow-xl group-hover:rotate-12 transition-transform duration-500">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-[#8B2323]">
                   <circle cx="50" cy="50" r="45" />
                   <path d="M50 10 Q60 5 70 10 Q90 20 90 40 Q90 60 70 80 Q50 95 30 80 Q10 60 10 40 Q10 20 30 10 Q40 5 50 10" opacity="0.3" fill="black" />
                   <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
                   <text x="50" y="58" textAnchor="middle" className="fill-white/80 font-serif text-3xl italic tracking-tighter">W</text>
                </svg>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-[#8B2323]/20 rounded-full blur-md animate-pulse"></div>
             </div>
             <p className="mt-4 text-[7px] uppercase tracking-[0.8em] text-[#2C1810] font-bold">Tap to Open</p>
          </motion.button>
        </motion.div>

        {/* The Card Sliding Out (Hidden Initially) */}
        <motion.div
          animate={isOpen ? { y: -100, opacity: 1 } : { y: 50, opacity: 0 }}
          className="absolute inset-x-8 top-8 bottom-8 z-[5] bg-white shadow-lg border border-[#C9A96E]/20 flex items-center justify-center p-8"
        >
          <div className="text-center">
             <div className="w-12 h-12 relative mx-auto mb-4 opacity-40">
                <Image src="/assets/ultra-luxury/crest.webp" fill className="object-contain" alt="Crest" />
             </div>
             <p className="text-[6px] tracking-[1em] uppercase text-[#C9A96E]">Undangin</p>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .clip-path-envelope-left {
          clip-path: polygon(0 0, 100% 50%, 0 100%);
        }
        .clip-path-envelope-right {
          clip-path: polygon(100% 0, 0 50%, 100% 100%);
        }
        .clip-path-envelope-bottom {
          clip-path: polygon(0 100%, 50% 0, 100% 100%);
        }
      `}</style>
    </motion.div>
  );
}
