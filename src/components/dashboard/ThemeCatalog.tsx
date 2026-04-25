"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const themes = [
  { id: "ultra-luxury", name: "ULTRA LUXURY", color: "bg-black", text: "text-white" },
  { id: "cinematic-dark", name: "CINEMATIC DARK", color: "bg-[#0f172a]", text: "text-white" },
  { id: "premium", name: "PREMIUM SAGE", color: "bg-[#7C8C77]", text: "text-white" },
  { id: "renaissance-garden", name: "RENAISSANCE", color: "bg-[#F9F6F0]", text: "text-white" },
  { id: "majestic-eternity", name: "MAJESTIC ETERNITY", color: "bg-[#0A1C14]", text: "text-white" }
];

const ThemeCatalog = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(320);

  // Update card width for dynamic iframe scaling
  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth < 640) setCardWidth(200);
      else if (window.innerWidth < 768) setCardWidth(280);
      else setCardWidth(320);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-20 border-t border-gray-100 dark:border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-serif font-black text-wedding-text tracking-tight">Katalog Tema Premium</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-8 h-[2px] bg-wedding-gold"></div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] font-bold">Mahakarya Desain Digital</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-[#4B5563]/10 p-1.5 rounded-full">
          <p className="hidden sm:block text-[9px] font-black text-[#4B5563] uppercase tracking-widest pl-4">Geser untuk melihat</p>
          <div className="flex gap-1">
            <button 
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full bg-[#374151] hover:bg-black text-white transition-all flex items-center justify-center active:scale-90"
              aria-label="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full bg-[#374151] hover:bg-black text-white transition-all flex items-center justify-center active:scale-90"
              aria-label="Next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="relative group">
        <div 
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-10 px-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {themes.map((theme) => (
            <div 
              key={theme.id} 
              className="w-[220px] sm:w-[280px] lg:w-[calc((100%-4.5rem)/4)] flex-shrink-0 snap-start"
            >
              <motion.div 
                whileHover={{ y: -8 }}
                className="relative aspect-[9/16] rounded-3xl overflow-hidden shadow-xl cursor-pointer group/item border border-gray-100 bg-white"
              >
                <a href={`/demo/${theme.id}`} target="_blank" className="block w-full h-full">
                  {/* Background Color/Placeholder */}
                  <div className={`absolute inset-0 ${theme.color} transition-transform duration-700 group-hover/item:scale-110`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60"></div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-wedding-gold/90 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg border border-white/20 uppercase tracking-tighter">
                      Premium
                    </span>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between items-center py-16 px-6 text-center z-10">
                    <div className="mt-auto">
                      <h3 className={`text-xl font-serif font-bold tracking-wider ${theme.text}`}>
                        {theme.name}
                      </h3>
                    </div>
                    
                    <div className="mt-auto">
                      <p className="text-wedding-gold text-[9px] font-black uppercase tracking-[0.3em]">
                        KETUK UNTUK DEMO
                      </p>
                    </div>
                  </div>
                </a>

                {/* Luxury Border hover */}
                <div className="absolute inset-0 border-[3px] border-transparent group-hover:border-wedding-gold/30 rounded-3xl transition-all duration-500 pointer-events-none z-40"></div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeCatalog;
