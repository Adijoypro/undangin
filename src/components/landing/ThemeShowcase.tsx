"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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

function ThemeCard({ t }: { t: typeof SHOWCASE_THEMES[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="w-[280px] md:w-[400px] flex-shrink-0 snap-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

        <div className={`absolute inset-0 z-30 transition-opacity duration-700 ${t.iframeBg} ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {isHovered && (
            <iframe 
              src={`/demo/${t.id}`} 
              className="w-full h-full border-none shadow-2xl" 
              title={t.name}
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
  const [sliderPaused, setSliderPaused] = useState(false);

  return (
    <section id="template" className="pt-28 pb-20 md:pt-32 md:pb-24 px-4 border-t border-wedding-gold/10 relative overflow-hidden transition-colors duration-500">
      <CornerOrnaments opacity={0.4} size={150} topOffset="top-0 md:top-6" />
      <div className="max-w-7xl mx-auto relative z-10 px-4">
        <div className="mb-12 md:mb-20">
          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-wedding-text">Koleksi Eksklusif</h2>
          <p className="text-wedding-text/60 max-w-xl text-base md:text-lg">Pilih dari mahakarya desain yang dibuat oleh seniman digital kelas atas.</p>
        </div>

        <div 
          className="relative overflow-x-auto pb-10 no-scrollbar snap-x snap-mandatory" 
          onMouseEnter={() => setSliderPaused(true)} 
          onMouseLeave={() => setSliderPaused(false)}
        >
          <motion.div 
            className="flex gap-6 md:gap-8 w-max"
            {...(typeof window !== 'undefined' && window.innerWidth > 768 ? {
              animate: sliderPaused ? {} : { x: ["0%", "-50%"] },
              transition: { duration: 60, repeat: Infinity, ease: "linear" }
            } : {})}
          >
            {[...SHOWCASE_THEMES, ...SHOWCASE_THEMES].map((t, i) => (
              <div key={`${t.id}-${i}`} className="snap-center">
                <ThemeCard t={t} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
