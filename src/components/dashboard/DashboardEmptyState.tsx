"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function DashboardEmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white/40 dark:bg-wedding-base/40 backdrop-blur-2xl rounded-[3rem] border-2 border-dashed border-wedding-gold/20 p-12 md:p-24 text-center relative overflow-hidden group"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-wedding-gold/5 to-transparent pointer-events-none" />
      
      {/* Phinisi Asset */}
      <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-10">
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [-1, 1, -1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative z-10 w-full h-full"
        >
          <Image 
            src="/assets/branding/final/nusantara_phinisi_solid_white_bg_1777350115005.webp"
            alt="Phinisi Ship"
            fill
            className="object-contain drop-shadow-[0_20px_50px_rgba(180,140,80,0.4)]"
          />
        </motion.div>
        
        {/* Waves effect */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-wedding-gold/20 blur-xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        <h2 className="font-serif text-3xl md:text-5xl mb-6 text-wedding-text">
          Siap Berlayar Menuju <span className="text-wedding-gold italic font-bold">Hari Bahagia?</span>
        </h2>
        <p className="text-wedding-text/50 text-sm md:text-lg mb-12 font-light leading-relaxed">
          Mahakarya Anda dimulai dari sini. Pilih tema, sesuaikan setiap detail, dan biarkan tradisi Nusantara mengiringi langkah cinta Anda.
        </p>

        <Link href="/dashboard/create">
          <button className="px-10 py-5 bg-gradient-to-r from-wedding-gold to-[#B8962E] text-white rounded-full font-bold text-xs uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-wedding-gold/30 flex items-center gap-4 mx-auto group/btn">
            <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
            Buat Undangan Pertama
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
