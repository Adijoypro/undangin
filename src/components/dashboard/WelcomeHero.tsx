"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus } from "lucide-react";

interface WelcomeHeroProps {
  userEmail: string;
}

export default function WelcomeHero({ userEmail }: WelcomeHeroProps) {
  const userName = userEmail.split('@')[0];

  return (
    <div className="relative mb-8 bg-white/40 dark:bg-wedding-base/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 dark:border-wedding-gold/20 overflow-hidden shadow-lg group">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-wedding-gold/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10 px-8 py-6 md:px-10 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-wedding-gold/10 text-wedding-gold text-[9px] font-black uppercase tracking-[0.3em] mb-3 border border-wedding-gold/20">
              Dashboard Utama
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-wedding-text dark:text-white mb-2 leading-tight">
              Selamat Datang, <span className="text-wedding-gold">{userName}</span>
            </h1>
            <p className="text-xs md:text-sm text-wedding-text/60 dark:text-gray-400 max-w-lg leading-relaxed">
              Kelola mahakarya digital Anda dengan sentuhan kemewahan warisan budaya.
            </p>
            
            <div className="mt-6">
               <Link href="/dashboard/create" className="inline-flex items-center gap-2 px-6 py-3 bg-wedding-gold text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-wedding-gold/20 hover:scale-[1.05] transition-all">
                 Mulai Berkarya <Plus className="w-3 h-3" />
               </Link>
            </div>
          </motion.div>
        </div>

        <div className="relative w-40 h-40 md:w-48 md:h-48 lg:w-64 lg:h-64">
          {/* Background Glow */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-wedding-gold/15 blur-[60px] rounded-full"
          />
          
          {/* Gunungan Asset */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            whileHover={{ y: -5 }}
            className="relative w-full h-full"
          >
            <Image 
              src="/assets/branding/final/nusantara_gunungan_solid_white_bg_1777349869530.webp"
              alt="Golden Gunungan"
              fill
              className="object-contain drop-shadow-[0_15px_30px_rgba(180,140,80,0.3)]"
              priority
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
