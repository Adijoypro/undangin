"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gem, Sparkles, Crown, Plus } from "lucide-react";

export default function MiniPricingGrid() {
  const packages = [
    { 
      id: "pkg_1", 
      name: "Premium", 
      credits: "1 Kredit", 
      price: "89rb", 
      originalPrice: "150rb",
      desc: "Satu undangan premium.", 
      icon: <Gem className="w-5 h-5" />,
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
      icon: <Sparkles className="w-5 h-5" />,
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
      desc: "Undangan massal.", 
      icon: <Crown className="w-5 h-5" />,
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
      
      <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ delay: i * 0.1 }}
            className="relative flex-shrink-0 w-[75vw] sm:w-[280px] md:w-auto snap-center md:snap-align-none"
          >
            <Link href="/dashboard/topup" className="block h-full">
              <div className={`group relative p-8 rounded-[2rem] border transition-all duration-500 h-full flex flex-col justify-between overflow-hidden shadow-lg ${
                pkg.isPopular 
                  ? 'bg-white/60 dark:bg-wedding-base/60 border-wedding-gold shadow-wedding-gold/10' 
                  : 'bg-white/30 dark:bg-wedding-base/30 border-white/50 dark:border-wedding-gold/10 hover:border-wedding-gold/30'
              } backdrop-blur-xl`}>
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-8">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      pkg.isPopular ? 'bg-wedding-gold text-white shadow-lg' : 'bg-wedding-gold/10 text-wedding-gold'
                    }`}>
                      {pkg.icon}
                    </div>
                    {pkg.badge && (
                      <span className={`text-[7px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm border ${
                        pkg.isPopular ? 'bg-wedding-gold text-white border-white/20' : 'bg-wedding-text/5 text-wedding-text/40 border-wedding-text/5'
                      }`}>
                        {pkg.badge}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-serif text-xl font-bold text-wedding-text mb-1">
                    {pkg.name} 
                  </h4>
                  <p className="text-[9px] text-wedding-text/40 font-bold uppercase tracking-widest mb-4">{pkg.desc}</p>
                </div>

                <div className="relative pt-6 flex items-end justify-between border-t border-wedding-gold/10 mt-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <p className="text-[10px] text-wedding-text/30 font-black uppercase tracking-tighter">
                        {pkg.credits}
                      </p>
                      {pkg.save && <span className="text-[8px] text-green-500 font-black bg-green-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">{pkg.save}</span>}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-serif font-bold text-wedding-text group-hover:text-wedding-gold transition-colors tracking-tight">Rp {pkg.price}</p>
                      <p className="text-[10px] text-wedding-text/20 line-through font-bold">{pkg.originalPrice}</p>
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-xl transition-all shadow-lg ${
                    pkg.isPopular ? 'bg-wedding-gold text-white' : 'bg-wedding-text text-wedding-base'
                  } group-hover:scale-110`}>
                    <Plus className="w-4 h-4" />
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
