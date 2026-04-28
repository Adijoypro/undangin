"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import CornerOrnaments from "@/components/ui/CornerOrnaments";

interface HeroSectionProps {
  user: any;
}

export default function HeroSection({ user }: HeroSectionProps) {
  const [showShimmer, setShowShimmer] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowShimmer(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1]
      } 
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-1/4 -left-1/4 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full bg-wedding-gold/10 dark:bg-wedding-gold/5 blur-[80px] pointer-events-none transform-gpu" />
      
      <CornerOrnaments opacity={0.6} size={200} />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            show: { transition: { staggerChildren: 0.1 } }
          }}
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-wedding-gold/30 bg-wedding-base text-wedding-gold text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 md:mb-10 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-wedding-gold animate-pulse"></span>
            Platform SaaS Undangan Premium
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-5xl md:text-9xl font-serif font-bold tracking-tighter mb-6 md:mb-8 leading-[0.95] md:leading-[0.9] text-wedding-text">
            Undangan Digital <br />
            <span className={`transition-all duration-1000 italic ${showShimmer ? 'animate-text-shimmer' : 'text-wedding-gold'}`}>
              Mahakarya
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-base md:text-2xl text-wedding-text/70 mb-10 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed px-4">
            Standar baru industri pernikahan. Desain sinematik eksklusif, animasi <span className="text-wedding-text font-medium">jaw-dropping</span>, dan manajemen tamu cerdas.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href={user ? "/dashboard" : "/login"} className="w-full sm:w-auto">
              <button className="w-full px-10 py-5 bg-gradient-to-r from-wedding-gold to-[#B8962E] text-white rounded-full font-bold text-lg shadow-xl shadow-wedding-gold/20 hover:scale-105 active:scale-95 transition-all">
                Buat Undangan Gratis
              </button>
            </Link>
            
            <a href="#template" className="w-full sm:w-auto">
              <button className="w-full px-10 py-5 backdrop-blur-md border border-wedding-gold/20 rounded-full font-bold text-lg transition-all bg-wedding-text/5 text-wedding-text hover:bg-wedding-text/10">
                Lihat Koleksi Tema
              </button>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
