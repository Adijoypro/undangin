"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  user: any;
  isDark: boolean;
}

export default function HeroSection({ user, isDark }: HeroSectionProps) {
  const [showShimmer, setShowShimmer] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowShimmer(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Explicitly typing as Variants to resolve strict TS errors in Vercel/IDE
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    }
  };

  return (
    <section className="relative pt-40 pb-32 px-4 min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Blurs */}
      <div className={`absolute top-1/4 -left-1/4 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full ${isDark ? 'bg-[#D4AF37]/5' : 'bg-[#D4AF37]/10'} blur-[80px] pointer-events-none transform-gpu`} />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            show: { transition: { staggerChildren: 0.1 } }
          }}
        >
          <motion.div variants={fadeInUp} className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#D4AF37]/30 ${isDark ? 'bg-[#D4AF37]/5' : 'bg-white'} text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-10 backdrop-blur-md shadow-lg`}>
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
            Platform SaaS Undangan Premium
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-6xl md:text-9xl font-serif font-bold tracking-tighter mb-8 leading-[0.9]">
            Undangan Digital <br />
            <span className={`transition-all duration-1000 italic ${showShimmer ? 'animate-text-shimmer' : 'text-[#D4AF37]'}`}>
              Mahakarya
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className={`text-lg md:text-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-12 max-w-3xl mx-auto font-light leading-relaxed`}>
            Standar baru industri pernikahan. Desain sinematik eksklusif, animasi <span className={isDark ? 'text-white' : 'text-black'}>jaw-dropping</span>, dan manajemen tamu cerdas.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href={user ? "/dashboard" : "/login"} className="w-full sm:w-auto">
              <button className="w-full px-10 py-5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-white rounded-full font-bold text-lg shadow-xl shadow-[#D4AF37]/20 hover:scale-105 active:scale-95 transition-all">
                Buat Undangan Gratis
              </button>
            </Link>
            
            <a href="#template" className="w-full sm:w-auto">
              <button className={`w-full px-10 py-5 backdrop-blur-md border rounded-full font-bold text-lg transition-all ${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-black/5 border-black/10 text-black'} hover:bg-opacity-20`}>
                Lihat Koleksi Tema
              </button>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
