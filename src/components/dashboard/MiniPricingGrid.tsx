"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function MiniPricingGrid() {
  const packages = [
    { 
      id: "pkg_1", 
      name: "Premium", 
      credits: "1 Kredit", 
      price: "89rb", 
      originalPrice: "150rb",
      desc: "Satu undangan premium.", 
      icon: "✨",
      color: "from-amber-500/20 via-wedding-gold/10 to-transparent",
      border: "border-wedding-gold",
      accent: "text-wedding-gold",
      isPopular: true,
      badge: "BEST SELLER",
      save: null
    },
    { 
      id: "pkg_5", 
      name: "Agensi", 
      credits: "5 Kredit", 
      price: "349rb", 
      originalPrice: "445rb",
      desc: "Hemat untuk bisnis WO.", 
      icon: "💼",
      color: "from-blue-500/10 via-indigo-500/5 to-transparent",
      border: "border-blue-500/30",
      accent: "text-blue-500",
      isPopular: false,
      badge: "HEMAT 20%",
      save: "Hemat Rp 96rb"
    },
    { 
      id: "pkg_10", 
      name: "Enterprise", 
      credits: "10 Kredit", 
      price: "649rb", 
      originalPrice: "890rb",
      desc: "Solusi undangan massal.", 
      icon: "👑",
      color: "from-purple-500/10 via-fuchsia-500/5 to-transparent",
      border: "border-purple-500/30",
      accent: "text-purple-500",
      isPopular: false,
      badge: "BEST VALUE",
      save: "Hemat Rp 241rb"
    }
  ];

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-wedding-text flex items-center gap-2">
            Penawaran Spesial Untukmu 
            <span className="animate-bounce">🎁</span>
          </h2>
          <p className="text-[10px] text-wedding-text/40 uppercase tracking-widest mt-1">Jangan lewatkan harga terbaik hari ini</p>
        </div>
        <Link href="/dashboard/topup" className="text-[10px] font-bold text-wedding-gold uppercase tracking-widest hover:underline">Lihat Semua Paket →</Link>
      </div>
      
      <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-6 md:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              delay: i * 0.1 
            }}
            className="relative"
          >
            <Link href="/dashboard/topup" className="block flex-shrink-0 w-[70vw] sm:w-[280px] md:w-auto snap-center md:snap-align-none">
              <div className={`group relative p-6 rounded-2xl border ${pkg.isPopular ? 'border-wedding-gold shadow-md' : 'border-wedding-gold/10'} bg-wedding-base overflow-hidden transition-all duration-500 h-full flex flex-col justify-between hover:shadow-xl hover:border-wedding-gold/30`}>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-2xl grayscale group-hover:grayscale-0 transition-all">
                      {pkg.icon}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {pkg.badge && (
                        <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${pkg.isPopular ? 'bg-wedding-gold text-black' : 'bg-wedding-text/5 text-wedding-text/40'}`}>
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h4 className="font-serif text-lg font-bold text-wedding-text mb-1">
                    {pkg.name} 
                  </h4>
                  <p className="text-[10px] text-wedding-text/40 font-medium mb-4 uppercase tracking-wider">{pkg.desc}</p>
                </div>

                <div className="relative pt-4 flex items-end justify-between border-t border-wedding-gold/5 mt-4">
                  <div>
                    <p className="text-[10px] text-wedding-text/30 uppercase tracking-widest font-black flex items-center gap-2">
                      {pkg.credits}
                      {pkg.save && <span className="text-wedding-gold lowercase font-bold">({pkg.save})</span>}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-serif font-bold text-wedding-text group-hover:text-wedding-gold transition-colors">Rp {pkg.price}</p>
                      <p className="text-xs text-wedding-text/20 line-through font-medium">Rp {pkg.originalPrice}</p>
                    </div>
                  </div>
                  <div className="bg-wedding-text text-wedding-base p-2 rounded-lg group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                    </svg>
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
