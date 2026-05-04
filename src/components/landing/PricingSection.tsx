"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Uji Coba",
    desc: "Sempurnakan ide Anda",
    price: "0",
    unit: "",
    asset: "/assets/branding/final/nusantara_angklung_solid_white_bg_1777350011138.webp",
    features: ["Akses Tema Dasar", "Draft Tak Terbatas", "Tanpa Masa Aktif", "E-Invitation Standard"],
    cta: "Mulai Sekarang",
    premium: false
  },
  {
    name: "Premium",
    desc: "Pilihan favorit mempelai",
    price: "89",
    unit: "rb",
    asset: "/assets/branding/final/nusantara_keris_solid_white_bg_1777349884812.webp",
    features: ["Semua Tema Premium", "Musik Eksklusif", "RSVP & Guestbook", "Navigasi Google Maps"],
    cta: "Pilih Paket",
    premium: true,
    popular: true
  },
  {
    name: "Agensi",
    desc: "Partner Wedding Organizer",
    price: "349",
    unit: "rb",
    asset: "/assets/branding/final/nusantara_rumah_gadang_solid_white_bg_1777350046759.webp",
    features: ["5 Slot Premium", "Dashboard Agensi", "Tanpa Logo Undangin", "Prioritas Support"],
    cta: "Hubungi Kami",
    premium: false
  },
  {
    name: "Royal",
    desc: "Kasta tertinggi kemewahan",
    price: "649",
    unit: "rb",
    asset: "/assets/branding/final/nusantara_barong_solid_white_bg_1777349993913.webp",
    features: ["10 Slot Premium", "Custom Domain", "Analitik Tamu VVIP", "Dedicated Manager"],
    cta: "Cek Detail",
    premium: false
  }
];

function PriceCard({ plan, i, user }: { plan: typeof plans[0], i: number, user: any }) {
  const [showAll, setShowAll] = useState(false);
  const visibleFeatures = showAll ? plan.features : plan.features.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
      viewport={{ once: true }}
      className={`relative p-6 md:p-10 rounded-[2.5rem] border transition-all duration-700 group flex-shrink-0 w-[85vw] sm:w-[320px] md:w-auto snap-center md:snap-align-none ${
        plan.premium 
          ? "bg-white/90 dark:bg-wedding-base/90 border-wedding-gold shadow-2xl shadow-wedding-gold/20 md:scale-105 z-20" 
          : "bg-white/40 dark:bg-wedding-base/40 border-wedding-gold/10 hover:border-wedding-gold/30"
      } backdrop-blur-2xl`}
    >
      {/* Shine Container */}
      <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-tr from-wedding-gold/10 via-transparent to-wedding-gold/10" />
        </div>
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] grayscale brightness-50" 
             style={{ backgroundImage: 'url(/assets/branding/batik_pattern.webp)', backgroundSize: '150px' }} />
      </div>

      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-wedding-gold to-[#B8962E] text-white px-5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-lg z-30 border border-white/20">
          Most Preferred
        </div>
      )}

      <div className="relative w-28 h-28 md:w-36 md:h-36 mb-6 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 bg-wedding-gold/20 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <motion.div
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 3, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
          style={{ transform: "translateZ(0)", willChange: "transform" }}
          className="relative z-10 w-full h-full"
        >
          <Image 
            src={plan.asset}
            alt={plan.name}
            fill
            sizes="(max-width: 768px) 112px, 144px"
            priority={i === 1}
            style={{ willChange: "transform" }}
            className="object-contain drop-shadow-[0_15px_30px_rgba(180,140,80,0.3)] group-hover:scale-110 transition-transform duration-700"
          />
        </motion.div>
      </div>

      <div className="text-center md:text-left">
        <h3 className={`font-serif text-2xl md:text-3xl font-bold mb-1 ${plan.premium ? "text-wedding-gold" : "text-wedding-text"}`}>
          {plan.name}
        </h3>
        <p className="text-[10px] text-wedding-text/50 uppercase tracking-widest mb-6 font-bold">{plan.desc}</p>
        
        <div className="mb-6 flex items-baseline justify-center md:justify-start gap-1">
          <span className="text-[10px] text-wedding-text/40 font-bold uppercase tracking-tighter">IDR</span>
          <span className={`text-4xl md:text-5xl font-serif font-bold ${plan.premium ? "text-wedding-gold" : "text-wedding-text"}`}>
            {plan.price}
          </span>
          <span className="text-wedding-text/40 font-serif text-xl">{plan.unit}</span>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {visibleFeatures.map((feature, j) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            key={j} 
            className="flex items-center gap-3"
          >
            <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
              plan.premium ? "bg-wedding-gold/20 text-wedding-gold" : "bg-wedding-text/5 text-wedding-text/30"
            }`}>
              <Check className="w-2.5 h-2.5" />
            </div>
            <span className="text-xs text-wedding-text/70 font-light">{feature}</span>
          </motion.div>
        ))}
        
        {plan.features.length > 3 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-[10px] text-wedding-gold font-bold uppercase tracking-widest hover:underline pt-2"
          >
            {showAll ? "Lihat Lebih Sedikit" : `+ ${plan.features.length - 3} Fitur Lainnya`}
          </button>
        )}
      </div>

      <Link href={user ? (plan.price === "0" ? "/dashboard" : "/dashboard/topup") : "/login"}>
        <button className={`w-full py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-300 shadow-lg ${
          plan.premium 
            ? "bg-gradient-to-r from-wedding-gold to-[#B8962E] text-white hover:scale-105 active:scale-95 shadow-wedding-gold/30" 
            : "bg-wedding-text text-wedding-base hover:bg-wedding-gold hover:text-white"
        }`}>
          {plan.cta}
        </button>
      </Link>
    </motion.div>
  );
}

export default function PricingSection({ user }: { user: any }) {
  return (
    <section id="harga" className="py-12 md:py-32 px-4 relative overflow-hidden bg-white/50 dark:bg-black/50">
      {/* Decorative Blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-wedding-gold/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-4">
        <div className="text-center mb-12 md:mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-wedding-gold font-serif italic tracking-[0.3em] text-[10px] md:text-sm mb-4 block"
          >
            Transparent Investment
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-6xl mb-4 md:mb-6 text-wedding-text"
          >
            Investasi <span className="text-wedding-gold italic">Kebahagiaan</span>
          </motion.h2>
          <p className="text-wedding-text/50 text-sm md:text-lg font-light max-w-2xl mx-auto px-4">Pilih paket yang sesuai dengan kemegahan hari istimewa Anda.</p>
        </div>

        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 overflow-x-auto md:overflow-visible pt-4 md:pt-0 pb-12 md:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {plans.map((plan, i) => (
            <PriceCard key={i} plan={plan} i={i} user={user} />
          ))}
        </div>
      </div>
    </section>
  );
}
