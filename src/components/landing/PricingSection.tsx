"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Sparkles, Gem, Crown, Zap } from "lucide-react";

const plans = [
  {
    name: "Uji Coba",
    desc: "Sempurnakan ide Anda",
    price: "0",
    unit: "",
    icon: <Zap className="w-6 h-6" />,
    features: ["Akses Tema Dasar", "Draft Tak Terbatas", "Tanpa Masa Aktif", "E-Invitation Standard"],
    cta: "Mulai Sekarang",
    premium: false
  },
  {
    name: "Premium",
    desc: "Pilihan favorit mempelai",
    price: "89",
    unit: "rb",
    icon: <Gem className="w-6 h-6" />,
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
    icon: <Sparkles className="w-6 h-6" />,
    features: ["5 Slot Premium", "Dashboard Agensi", "Tanpa Logo Undangin", "Prioritas Support"],
    cta: "Hubungi Kami",
    premium: false
  },
  {
    name: "Royal",
    desc: "Kasta tertinggi kemewahan",
    price: "649",
    unit: "rb",
    icon: <Crown className="w-6 h-6" />,
    features: ["15 Slot Premium", "Custom Domain", "Analitik Tamu VVIP", "Dedicated Manager"],
    cta: "Cek Detail",
    premium: false
  }
];

export default function PricingSection({ user }: { user: any }) {
  return (
    <section id="harga" className="py-24 md:py-40 px-4 relative overflow-hidden bg-white/50 dark:bg-black/50">
      {/* Decorative Blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-wedding-gold/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-4">
        <div className="text-center mb-16 md:mb-24">
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
            className="font-serif text-4xl md:text-7xl mb-6 md:mb-8 text-wedding-text"
          >
            Investasi <span className="text-wedding-gold italic">Kebahagiaan</span>
          </motion.h2>
          <p className="text-wedding-text/50 text-base md:text-xl font-light max-w-2xl mx-auto px-4">Pilih paket yang sesuai dengan kemegahan hari istimewa Anda.</p>
        </div>

        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 overflow-x-auto md:overflow-visible pb-12 md:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-8 md:p-10 rounded-[2.5rem] border transition-all duration-500 group flex-shrink-0 w-[85vw] sm:w-[320px] md:w-auto snap-center md:snap-align-none ${
                plan.premium 
                  ? "bg-white/80 dark:bg-wedding-base/80 border-wedding-gold shadow-2xl shadow-wedding-gold/20 md:scale-105 z-20" 
                  : "bg-white/40 dark:bg-wedding-base/40 border-wedding-gold/10 hover:border-wedding-gold/30"
              } backdrop-blur-xl`}
            >
              {/* Shine Container with overflow-hidden */}
              <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
                {/* Golden Aura Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-tr from-wedding-gold/10 via-transparent to-wedding-gold/10" />
                  <motion.div 
                    initial={{ x: "-100%", y: "-100%" }}
                    whileHover={{ x: "100%", y: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-br from-transparent via-wedding-gold/20 to-transparent"
                  />
                </div>
              </div>

              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-wedding-gold to-[#B8962E] text-white px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg z-30">
                  Most Preferred
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${
                plan.premium ? "bg-wedding-gold text-white shadow-lg" : "bg-wedding-gold/10 text-wedding-gold"
              }`}>
                {plan.icon}
              </div>

              <h3 className={`font-serif text-3xl font-bold mb-2 ${plan.premium ? "text-wedding-gold" : "text-wedding-text"}`}>
                {plan.name}
              </h3>
              <p className="text-xs text-wedding-text/50 uppercase tracking-widest mb-10 font-bold">{plan.desc}</p>
              
              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-sm text-wedding-text/40 font-bold uppercase tracking-tighter">IDR</span>
                <span className={`text-6xl font-serif font-bold ${plan.premium ? "text-wedding-gold" : "text-wedding-text"}`}>
                  {plan.price}
                </span>
                <span className="text-wedding-text/40 font-serif text-2xl">{plan.unit}</span>
              </div>

              <div className="space-y-4 mb-12">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.premium ? "bg-wedding-gold/20 text-wedding-gold" : "bg-wedding-text/5 text-wedding-text/30"
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-wedding-text/70 font-light">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href={user ? (plan.price === "0" ? "/dashboard" : "/dashboard/topup") : "/login"}>
                <button className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-lg ${
                  plan.premium 
                    ? "bg-gradient-to-r from-wedding-gold to-[#B8962E] text-white hover:scale-105 active:scale-95 shadow-wedding-gold/30" 
                    : "bg-wedding-text text-wedding-base hover:bg-wedding-gold hover:text-white"
                }`}>
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
