"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading atau tunggu window load
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 1500); // Beri waktu buat animasi mandala tampil
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-wedding-base flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute w-[500px] h-[500px] bg-wedding-gold/10 rounded-full blur-[120px] animate-pulse" />

          <div className="relative">
            {/* Mandala Animation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative w-32 h-32 md:w-48 md:h-48 opacity-40"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{ rotate: i * 45 }}
                  className="absolute inset-0 border-[1px] border-wedding-gold rounded-[30%] opacity-40"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    borderRadius: ["30%", "50%", "30%"]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "easeInOut" 
                  }}
                />
              ))}
            </motion.div>

            {/* Center Logo/Icon */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img src="/logo.webp" alt="Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
            </motion.div>
          </div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-wedding-gold mb-2">Mempersiapkan Mahakarya</p>
            <div className="flex gap-1 justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1 h-1 bg-wedding-gold rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
