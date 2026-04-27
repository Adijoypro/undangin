"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lock, ArrowRight } from 'lucide-react';

const themes = [
  { 
    id: "ultra-luxury", 
    name: "ULTRA LUXURY", 
    desc: "Kasta tertinggi kemewahan digital dengan mawar emas animasi dan latar onyx onyx gelap yang eksklusif.",
    color: "bg-black", 
    text: "text-white",
    status: "Premium"
  },
  { 
    id: "majestic-eternity", 
    name: "MAJESTIC ETERNITY", 
    desc: "Perpaduan warna emerald royal dan emas megah, memberikan kesan agung bak pernikahan kerajaan.",
    color: "bg-[#0A1C14]", 
    text: "text-white",
    status: "Premium"
  },
  { 
    id: "cinematic-dark", 
    name: "CINEMATIC DARK", 
    desc: "Nuansa monokromatik yang dramatis dengan tipografi besar, cocok untuk pasangan modern yang elegan.",
    color: "bg-[#0f172a]", 
    text: "text-white",
    status: "Premium"
  },
  { 
    id: "renaissance-garden", 
    name: "RENAISSANCE", 
    desc: "Gaya klasik Eropa dengan ornamen bunga vintage dan tekstur kertas tua yang artistik serta abadi.",
    color: "bg-[#F9F6F0]", 
    text: "text-black",
    status: "Premium"
  },
  { 
    id: "premium", 
    name: "PREMIUM SAGE", 
    desc: "Minimalisme yang menenangkan dengan paduan warna hijau sage dan aksen emas tipis yang sangat estetik.",
    color: "bg-[#7C8C77]", 
    text: "text-white",
    status: "Premium"
  },
  { 
    id: "classic-royal", 
    name: "CLASSIC ROYAL", 
    desc: "Koleksi mendatang dengan fokus pada kemegahan arsitektur klasik dan detail emas emboss.",
    color: "bg-[#4B3621]", 
    text: "text-white",
    status: "Coming Soon"
  },
  { 
    id: "modern-minimalist", 
    name: "MODERN CLEAN", 
    desc: "Konsep bersih tanpa batas dengan penggunaan white space yang berani dan layout yang sangat responsif.",
    color: "bg-[#F5F5F5]", 
    text: "text-black",
    status: "Coming Soon"
  }
];

const ThemeCatalog = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-20 border-t border-wedding-gold/10 transition-colors duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-serif font-black text-wedding-text tracking-tight">Katalog Tema Premium</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-8 h-[2px] bg-wedding-gold"></div>
            <p className="text-[10px] text-wedding-text/40 uppercase tracking-[0.3em] font-bold">Mahakarya Desain Digital</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-wedding-text/5 p-1.5 rounded-full">
          <p className="hidden sm:block text-[9px] font-black text-wedding-text/40 uppercase tracking-widest pl-4">Geser untuk melihat</p>
          <div className="flex gap-1">
            <button 
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-white/40 dark:bg-wedding-text/10 backdrop-blur-md hover:bg-wedding-gold text-wedding-text hover:text-white transition-all flex items-center justify-center active:scale-90 border border-wedding-gold/20"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-white/40 dark:bg-wedding-text/10 backdrop-blur-md hover:bg-wedding-gold text-wedding-text hover:text-white transition-all flex items-center justify-center active:scale-90 border border-wedding-gold/20"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative group">
        <div 
          ref={scrollRef}
          className="flex gap-4 md:gap-8 overflow-x-auto pb-10 px-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {themes.map((theme) => (
            <div 
              key={theme.id} 
              className="w-[260px] sm:w-[320px] flex-shrink-0 snap-start"
            >
              <motion.div 
                whileHover={{ y: -10 }}
                className="relative aspect-[9/16] rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer group/item border border-wedding-gold/10 bg-wedding-base transition-all duration-500"
              >
                {theme.status === "Premium" ? (
                  <a href={`/demo/${theme.id}`} target="_blank" className="block w-full h-full">
                    {/* Background Color/Placeholder */}
                    <div className={`absolute inset-0 ${theme.color} transition-transform duration-700 group-hover/item:scale-110`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80"></div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-6 right-6 z-10">
                      <span className="bg-wedding-gold text-black text-[8px] font-black px-4 py-1.5 rounded-full shadow-lg border border-white/20 uppercase tracking-widest">
                        {theme.status}
                      </span>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                      <h3 className={`text-2xl font-serif font-black tracking-wider mb-2 ${theme.text}`}>
                        {theme.name}
                      </h3>
                      <p className={`text-[10px] leading-relaxed mb-6 line-clamp-3 ${theme.text === 'text-white' ? 'text-white/60' : 'text-black/60'}`}>
                        {theme.desc}
                      </p>
                      
                      <div className="flex items-center gap-2 group/btn">
                        <span className="text-wedding-gold text-[9px] font-black uppercase tracking-[0.3em] group-hover/btn:tracking-[0.4em] transition-all">
                          KETUK UNTUK DEMO
                        </span>
                        <ArrowRight className="w-3 h-3 text-wedding-gold group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="w-full h-full relative">
                    <div className={`absolute inset-0 ${theme.color} opacity-40 grayscale`}></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/40 backdrop-blur-sm">
                      <div className="w-14 h-14 rounded-full border border-dashed border-white/30 flex items-center justify-center mb-4 bg-white/5">
                        <Lock className="w-5 h-5 text-white/60" />
                      </div>
                      <span className="bg-white/10 text-white border border-white/20 text-[7px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Locked</span>
                      <h3 className="text-xl font-serif font-bold text-white mb-2">{theme.name}</h3>
                      <p className="text-[9px] text-white/50 uppercase tracking-widest font-black">COMING SOON</p>
                    </div>
                  </div>
                )}

                {/* Luxury Border hover */}
                <div className="absolute inset-0 border-[4px] border-transparent group-hover:border-wedding-gold/20 rounded-[2.5rem] transition-all duration-500 pointer-events-none z-40"></div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeCatalog;
