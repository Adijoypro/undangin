"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/landing/Footer";
import CornerOrnaments from "@/components/ui/CornerOrnaments";

const KATALOG_THEMES = [
  {
    id: "celestial-harmony",
    series: "The Cinematic Series",
    title: "Celestial Harmony",
    desc: "Scrollytelling sinematik dengan transisi 3D yang megah dan entrance animasi gerbang emas.",
    tag: "ULTRA LUXURY",
    color: "#D4AF37",
    image: "/assets/branding/final/celestial_harmony_preview.webp"
  },
  {
    id: "cinematic-dark",
    series: "The Dramatic Series",
    title: "Cinematic Dark",
    desc: "Tirai beludru yang tersingkap perlahan dengan sorotan lampu panggung yang dramatis.",
    tag: "DRAMATIC",
    color: "#800020",
    image: "/assets/branding/final/cinematic_dark_preview.webp"
  },
  {
    id: "renaissance-garden",
    series: "The Heritage Series",
    title: "Renaissance Garden",
    desc: "Klasik Eropa dengan ornamen bunga vintage dan entrance amplop eksklusif dengan segel lilin.",
    tag: "TIMELESS",
    color: "#7C8C77",
    image: "/assets/branding/final/renaissance_garden_preview.webp"
  },
  {
    id: "premium",
    series: "The Premium Series",
    title: "Premium Sage",
    desc: "Desain bersih dengan sentuhan warna alam yang memberikan kesan tenang dan elegan.",
    tag: "PREMIUM",
    color: "#9baca0",
    image: "/assets/branding/final/premium_sage_preview.webp"
  },
  {
    id: "ultra-luxury",
    series: "The VVIP Series",
    title: "Onyx & Rose Gold",
    desc: "Mawar emas animasi, tekstur marble gelap yang memberikan kesan VVIP eksklusif.",
    tag: "VVIP",
    color: "#D4AF37",
    image: "/assets/branding/final/onyx_rose_gold_preview.webp"
  },
  {
    id: "majestic-eternity",
    series: "The Royal Series",
    title: "Majestic Eternity",
    desc: "Kemegahan abadi dengan palet emerald & gold, fokus pada tipografi kerajaan yang elegan.",
    tag: "ROYAL",
    color: "#0A1C14",
    image: "/assets/branding/final/majestic_eternity_preview.webp"
  }
];

export default function KatalogClient({ user }: { user: any }) {
  return (
    <div className="min-h-screen bg-wedding-base text-wedding-text font-sans overflow-x-hidden">
      <LandingNavbar user={user} />
      
      <main className="pt-32 pb-24 relative">
        <CornerOrnaments opacity={0.4} size={200} topOffset="top-12" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-wedding-gold text-xs uppercase tracking-[0.5em] font-black mb-4"
            >
              Exclusive Collection
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl text-wedding-text mb-6"
            >
              Katalog Tema
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-wedding-text/50 max-w-2xl mx-auto text-lg font-light leading-relaxed"
            >
              Pilih mahakarya desain yang dirancang khusus untuk mengabadikan momen terindah dalam hidup Anda. Setiap tema memiliki jiwa dan cerita yang unik.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {KATALOG_THEMES.map((theme, index) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/5 bg-[#0a0a0a] transition-all duration-700 lg:group-hover:border-wedding-gold/50 lg:group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transform-gpu">
                  {/* Background Image */}
                  <Image 
                    src={theme.image}
                    alt={theme.title}
                    fill
                    priority={index < 3}
                    className="object-cover opacity-60 transition-transform duration-1000 lg:group-hover:scale-110 transform-gpu"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-wedding-gold text-black text-[9px] font-black uppercase tracking-widest rounded-full">
                        {theme.tag}
                      </span>
                    </div>
                    <p className="text-wedding-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
                      {theme.series}
                    </p>
                    <h3 className="font-serif text-3xl text-white mb-4">
                      {theme.title}
                    </h3>
                    <p className="text-white/60 text-xs leading-relaxed mb-8 line-clamp-2">
                      {theme.desc}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <a 
                        href={`/demo/${theme.id}?mode=demo`}
                        target="_blank"
                        className="flex-1 px-6 py-3 bg-white/10 lg:backdrop-blur-md border border-white/20 text-white rounded-full text-[10px] font-bold uppercase tracking-widest text-center hover:bg-white hover:text-black transition-all"
                      >
                        Lihat Demo
                      </a>
                      <a 
                        href="/dashboard"
                        className="flex-1 px-6 py-3 bg-wedding-gold text-white rounded-full text-[10px] font-bold uppercase tracking-widest text-center lg:hover:scale-105 transition-all shadow-lg"
                      >
                        Pilih Tema
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
