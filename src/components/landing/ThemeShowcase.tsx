"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";
import CornerOrnaments from "@/components/ui/CornerOrnaments";

const SHOWCASE_THEMES = [
  {
    id: "ultra-luxury",
    series: "The VVIP Series",
    title: "Ultra Luxury",
    name: "Onyx & Rose Gold",
    desc: "Mawar emas animasi, gelap yang megah.",
    bgClass: "bg-[#0A0A0A]",
    frameClass: "border-white/10 group-hover:border-[#D4AF37]/50 shadow-xl",
    gradientClass: "bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10",
    seriesColor: "text-[#D4AF37]",
    titleClass: "font-script text-6xl text-white drop-shadow-2xl",
    btnClass: "bg-[#D4AF37] text-black",
    iframeBg: "bg-black"
  },
  {
    id: "cinematic-dark",
    series: "The Dark Series",
    title: "Cinematic",
    name: "Midnight Elegance",
    desc: "Tipografi kuat dengan transisi mulus.",
    bgClass: "bg-[#111]",
    frameClass: "border-white/10 group-hover:border-white/50 shadow-xl",
    gradientClass: "bg-gradient-to-b from-transparent to-black opacity-80 z-10",
    seriesColor: "text-gray-300",
    titleClass: "font-serif text-5xl text-white font-light uppercase tracking-widest",
    btnClass: "bg-white text-black",
    iframeBg: "bg-black"
  },
  {
    id: "premium",
    series: "The Premium Series",
    title: "Premium Sage",
    name: "Sage Splendor",
    desc: "Desain bersih dengan sentuhan warna alam.",
    bgClass: "bg-[#f5f5f0]",
    frameClass: "border-white/10 group-hover:border-[#9baca0] shadow-[inset_0_0_50px_rgba(0,0,0,0.05)]",
    gradientClass: "",
    seriesColor: "text-[#9baca0]",
    titleClass: "font-script text-6xl text-[#2c332e]",
    btnClass: "bg-[#9baca0] text-white",
    iframeBg: "bg-white"
  },
  {
    id: "renaissance-garden",
    series: "The Heritage Series",
    title: "Renaissance",
    name: "Renaissance Garden",
    desc: "Klasik Eropa dengan ornamen bunga vintage.",
    bgClass: "bg-[#F9F6F0]",
    frameClass: "border-[#D4AF37]/20 group-hover:border-[#D4AF37] shadow-xl",
    bgImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    seriesColor: "text-[#7C8C77] uppercase",
    titleClass: "font-display text-5xl text-[#2B2B2B] font-bold",
    btnClass: "bg-[#7C8C77] text-white",
    iframeBg: "bg-[#F9F6F0]"
  },
  {
    id: "majestic-eternity",
    series: "The Royal Series",
    title: "Majestic Eternity",
    name: "Majestic Eternity",
    desc: "Kemegahan abadi dengan palet emerald & gold.",
    bgClass: "bg-[#0A1C14]",
    frameClass: "border-[#D4AF37]/20 group-hover:border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.15)]",
    gradientClass: "bg-gradient-to-b from-[#0A1C14] via-transparent to-[#0A1C14] z-10",
    seriesColor: "text-[#D4AF37] uppercase",
    titleClass: "font-script text-5xl text-white font-bold",
    btnClass: "bg-[#06120C] border border-[#D4AF37] text-[#D4AF37]",
    iframeBg: "bg-[#0A1C14]"
  }
];

function ThemeCard({ t, onHoverChange }: { t: typeof SHOWCASE_THEMES[0], onHoverChange: (hovered: boolean) => void }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = (state: boolean) => {
    setIsHovered(state);
    onHoverChange(state);
  };

  return (
    <div 
      className="w-[280px] md:w-[360px] flex-shrink-0 snap-center group"
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <div className={`w-full aspect-[9/16] rounded-2xl overflow-hidden ${t.bgClass} relative border transition-all duration-700 ${t.frameClass} group-hover:scale-[1.02]`}>
        {t.bgImage && (
          <div className="absolute inset-0 opacity-40 mix-blend-multiply z-0">
            <Image 
              src={t.bgImage}
              alt={t.title}
              fill
              sizes="(max-width: 768px) 280px, 400px"
              className="object-cover"
            />
          </div>
        )}
        {t.gradientClass && <div className={`absolute inset-0 ${t.gradientClass}`}></div>}
        
        <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-20 ${isHovered ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
          <p className={`font-serif mb-4 text-sm italic tracking-widest ${t.seriesColor}`}>{t.series}</p>
          <h3 className={`mb-8 ${t.titleClass}`}>{t.title}</h3>
          <div className={`px-8 py-3 rounded-full text-xs uppercase font-bold ${t.btnClass}`}>
            Lihat Demo
          </div>
        </div>

        <div 
          className={`absolute inset-0 z-30 transition-all duration-1000 ${t.iframeBg} ${isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          {isHovered && (
            <iframe 
              src={`/demo/${t.id}?mode=demo`} 
              className="w-full h-full border-none shadow-2xl" 
              title={t.name}
              allow="autoplay"
              loading="lazy"
            />
          )}
        </div>
      </div>
      <div className="mt-6 text-center h-[100px] flex flex-col justify-start">
        <h4 className="font-serif text-xl md:text-2xl font-bold mb-1 text-wedding-text line-clamp-1">{t.name}</h4>
        <p className="text-xs md:text-sm text-wedding-text/60 line-clamp-2 leading-relaxed">{t.desc}</p>
      </div>
    </div>
  );
}

export default function ThemeShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -392 : 392; // 360 + 32 gap
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="template" className="pt-16 pb-20 md:pt-32 md:pb-24 px-4 border-t border-wedding-gold/10 relative overflow-hidden transition-colors duration-500">
      <CornerOrnaments opacity={0.4} size={150} topOffset="top-2 md:top-8" />
      
      <div className="max-w-7xl mx-auto relative z-10 px-4">
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-center md:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl md:text-5xl mb-4 text-wedding-text"
            >
              Koleksi Eksklusif
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-wedding-text/60 max-w-xl text-base md:text-lg"
            >
              Pilih mahakarya desain dari seniman digital kelas atas.
            </motion.p>
          </div>
          
          {/* Navigation Buttons for Desktop */}
          <div className="hidden md:flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-wedding-gold/30 flex items-center justify-center text-wedding-gold hover:bg-wedding-gold hover:text-white transition-all active:scale-95"
              aria-label="Previous"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-wedding-gold/30 flex items-center justify-center text-wedding-gold hover:bg-wedding-gold hover:text-white transition-all active:scale-95"
              aria-label="Next"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <div className="relative group/showcase">
          
          <div 
            ref={scrollRef}
            className="relative overflow-x-auto md:overflow-hidden pb-10 no-scrollbar snap-x snap-mandatory"
          >
            <div className="flex gap-6 md:gap-8 w-max md:animate-marquee md:hover:[animation-play-state:paused] py-4 md:justify-center">
              {[...SHOWCASE_THEMES, ...SHOWCASE_THEMES].map((t, i) => {
                const uniqueKey = `${t.id}-${i}`;
                const isThisHovered = hoveredId === uniqueKey;
                
                return (
                  <motion.div 
                    key={uniqueKey} 
                    className={`snap-center transition-all duration-700 ${isThisHovered ? 'scale-105 z-30' : 'scale-100 z-10'}`}
                    onMouseEnter={() => setHoveredId(uniqueKey)}
                    onMouseLeave={() => setHoveredId(null)}
                    animate={{
                      y: isThisHovered ? -10 : [0, -5, 0],
                    }}
                    transition={{
                      duration: 4 + (i % 3),
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ThemeCard t={t} onHoverChange={() => {}} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex flex-col items-center gap-6"
          >
            <p className="text-wedding-text/40 text-sm font-serif italic">Siap untuk membuat momen Anda tak terlupakan?</p>
            <a 
              href="/dashboard" 
              className="px-12 py-5 bg-wedding-gold text-white rounded-full font-bold uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-wedding-text hover:-translate-y-1 transition-all duration-300"
            >
              Mulai Buat Undangan Sekarang
            </a>
            <div className="flex items-center gap-2 text-[10px] text-wedding-gold font-bold uppercase tracking-widest mt-2 opacity-60">
              <span className="w-8 h-px bg-wedding-gold/30"></span>
              Tanpa Kartu Kredit &bull; Gratis Coba
              <span className="w-8 h-px bg-wedding-gold/30"></span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
