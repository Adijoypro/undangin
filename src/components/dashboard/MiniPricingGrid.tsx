"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function MiniPricingGrid() {
  const packages = [
    { 
      id: "pkg_1", 
      name: "Premium", 
      credits: "1 Kredit", 
      price: "89rb", 
      originalPrice: "150rb",
      desc: "Satu undangan premium.", 
      asset: "/assets/branding/final/nusantara_keris_solid_white_bg_1777349884812.webp",
      isPopular: true,
      badge: "FAVORIT",
      save: null
    },
    { 
      id: "pkg_5", 
      name: "Agensi", 
      credits: "5 Kredit", 
      price: "349rb", 
      originalPrice: "445rb",
      desc: "Hemat untuk WO.", 
      asset: "/assets/branding/final/nusantara_rumah_gadang_solid_white_bg_1777350046759.webp",
      isPopular: false,
      badge: "HEMAT 20%",
      save: "Hemat 96rb"
    },
    { 
      id: "pkg_10", 
      name: "Royal", 
      credits: "10 Kredit", 
      price: "649rb", 
      originalPrice: "890rb",
      desc: "Kasta tertinggi kemewahan.", 
      asset: "/assets/branding/final/nusantara_barong_solid_white_bg_1777349993913.webp",
      isPopular: false,
      badge: "VALUE",
      save: "Hemat 241rb"
    }
  ];

  return (
    <div className="mb-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-wedding-text flex items-center gap-3">
            Eksklusif Untuk Anda 
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-6 h-[1px] bg-wedding-gold" />
            <p className="text-[9px] text-wedding-text/40 font-black uppercase tracking-[0.3em]">Penawaran Terbatas Hari Ini</p>
          </div>
        </div>
        <Link href="/dashboard/topup" className="text-[10px] font-black text-wedding-gold uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all border-b border-wedding-gold/20 pb-1">Lihat Semua →</Link>
      </div>
      
      <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pt-6 pb-8 md:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={typeof window !== 'undefined' && window.innerWidth >= 1024 ? { y: -5 } : {}}
            transition={{ delay: i * 0.1 }}
            className="relative flex-shrink-0 w-[75vw] sm:w-[280px] md:w-auto snap-center md:snap-align-none transform-gpu"
          >
            <Link href="/dashboard/topup" className="block h-full">
              <div className={`group relative p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-700 h-full flex flex-col justify-between overflow-hidden shadow-md md:shadow-xl ${
                pkg.isPopular 
                  ? 'bg-white/90 dark:bg-wedding-base/95 border-wedding-gold shadow-wedding-gold/20 scale-[1.02] z-10' 
                  : 'bg-white/80 dark:bg-wedding-base/90 border-white/50 dark:border-wedding-gold/10 lg:hover:border-wedding-gold/40'
              } lg:backdrop-blur-2xl`}>
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 -mt-4 -ml-4 flex items-center justify-center">
                      {/* Ambient Glow behind asset */}
                      <div className="absolute inset-4 bg-wedding-gold/10 blur-xl rounded-full" />
                      <Image 
                        src={pkg.asset}
                        alt={pkg.name}
                        width={120}
                        height={120}
                        className="object-contain relative z-10 drop-shadow-[0_15px_30px_rgba(180,140,80,0.3)] lg:group-hover:scale-110 lg:group-hover:rotate-6 transition-transform duration-700"
                      />
                    </div>
                    {pkg.badge && (
                      <span className={`text-[7px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm border ${
                        pkg.isPopular ? 'bg-wedding-gold text-white border-white/20' : 'bg-wedding-text/5 text-wedding-text/40 border-wedding-text/5'
                      }`}>
                        {pkg.badge}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-serif text-2xl font-bold text-wedding-text mb-1">
                    {pkg.name} 
                  </h4>
                  <p className="text-[10px] text-wedding-text/40 font-bold uppercase tracking-widest mb-4">{pkg.desc}</p>
                </div>

                <div className="relative pt-6 flex items-end justify-between border-t border-wedding-gold/10 mt-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <p className="text-[11px] text-wedding-text/40 font-black uppercase tracking-tighter">
                        {pkg.credits}
                      </p>
                      {pkg.save && <span className="text-[9px] text-green-500 font-black bg-green-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">{pkg.save}</span>}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl md:text-3xl font-serif font-bold text-wedding-text lg:group-hover:text-wedding-gold transition-colors tracking-tight">Rp {pkg.price}</p>
                      <p className="text-[11px] text-wedding-text/20 line-through font-bold">{pkg.originalPrice}</p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl transition-all shadow-lg ${
                    pkg.isPopular ? 'bg-wedding-gold text-white' : 'bg-wedding-text text-wedding-base'
                  } lg:group-hover:scale-110 lg:group-hover:bg-wedding-gold lg:group-hover:text-white`}>
                    <Plus className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
