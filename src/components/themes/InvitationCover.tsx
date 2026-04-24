"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InvitationCoverProps {
  bride: string;
  groom: string;
  onOpen: () => void;
  forcedOpen?: boolean;
}

export default function InvitationCover({ bride, groom, onOpen, forcedOpen = false }: InvitationCoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    onOpen(); // Trigger music playback in parent
  };

  const isActuallyOpen = isOpen || forcedOpen;

  return (
    <AnimatePresence>
      {!isActuallyOpen && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-wedding-text overflow-hidden"
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 border-l-2 border-t-2 border-wedding-gold m-8 rounded-tl-[100px]"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 border-r-2 border-b-2 border-wedding-gold m-8 rounded-br-[100px]"></div>
          </div>

          <div className="relative text-center px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8"
            >
              <p className="text-wedding-gold uppercase tracking-[0.3em] text-[10px] mb-4 font-bold">The Wedding of</p>
              <h1 className="font-serif text-4xl md:text-6xl text-white mb-2 italic">
                {groom} <span className="text-wedding-gold">&</span> {bride}
              </h1>
              <div className="w-12 h-[1px] bg-wedding-gold mx-auto mt-6"></div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="bg-wedding-gold text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-2xl hover:bg-yellow-600 transition-colors flex items-center gap-3 mx-auto"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
              Buka Undangan
            </motion.button>
            
            <p className="text-gray-400 text-[10px] mt-8 uppercase tracking-widest font-bold">Kepada Bapak/Ibu/Saudara/i</p>
            <p className="text-white text-sm mt-2 font-serif italic">Tamu Undangan</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
