"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PricingSection({ isDark, user }: { isDark: boolean; user: any }) {
  const border = isDark ? "border-white/10" : "border-black/10";
  const cardBg = isDark ? "bg-white/[0.02]" : "bg-black/[0.02]";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const buttonInverse = isDark ? "bg-white text-black hover:bg-gray-200" : "bg-[#111111] text-white hover:bg-black";

  return (
    <section id="harga" className={`py-32 px-4 relative border-t ${border}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-serif text-5xl md:text-6xl mb-6">Investasi Berkelas</h2>
          <p className={`${textMuted} text-lg`}>Sistem kredit transparan tanpa biaya tersembunyi.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Uji Coba */}
          <div className={`p-10 rounded-2xl border ${border} ${cardBg} hover:border-[#D4AF37]/30 transition-all`}>
            <h3 className="font-serif text-3xl mb-2">Uji Coba</h3>
            <p className={`text-sm ${textMuted} mb-10`}>Buat draft tanpa biaya.</p>
            <div className="mb-10 flex items-baseline gap-2">
              <span className={`text-sm ${textMuted} font-bold uppercase`}>Rp</span>
              <span className="text-5xl font-serif">0</span>
            </div>
            <Link href={user ? "/dashboard" : "/login"} className={`block text-center w-full py-4 border ${border} font-bold text-xs uppercase tracking-widest ${buttonInverse}`}>
              Mulai Gratis
            </Link>
          </div>

          {/* Premium */}
          <div className={`p-10 rounded-2xl border border-[#D4AF37] ${isDark ? 'bg-gradient-to-b from-[#1a1500] to-black' : 'bg-gradient-to-b from-[#FFFDF5] to-white'} relative shadow-xl transform md:-translate-y-4`}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Paling Laris
            </div>
            <h3 className="font-serif text-3xl mb-2 text-[#D4AF37]">Premium</h3>
            <p className={`text-sm ${textMuted} mb-10`}>Publikasi & fitur lengkap.</p>
            <div className="mb-10 flex items-baseline gap-2">
              <span className="text-sm text-[#D4AF37] font-bold uppercase">Rp</span>
              <span className="text-5xl font-serif text-[#D4AF37]">89</span>
              <span className={textMuted}>rb</span>
            </div>
            <Link href={user ? "/dashboard/topup" : "/login"} className="block text-center w-full py-4 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
              Pilih Paket
            </Link>
          </div>

          {/* WO Pro */}
          <div className={`p-10 rounded-2xl border ${border} ${cardBg}`}>
            <h3 className="font-serif text-3xl mb-2">Agensi</h3>
            <p className={`text-sm ${textMuted} mb-10`}>Paket hemat untuk profesional.</p>
            <div className="mb-10 flex items-baseline gap-2">
              <span className={`text-sm ${textMuted} font-bold uppercase`}>Rp</span>
              <span className="text-5xl font-serif">349</span>
              <span className={textMuted}>rb</span>
            </div>
            <Link href={user ? "/dashboard/topup" : "/login"} className={`block text-center w-full py-4 border ${border} font-bold text-xs uppercase tracking-widest ${buttonInverse}`}>
              Hubungi Kami
            </Link>
          </div>

          {/* Enterprise */}
          <div className={`p-10 rounded-2xl border ${border} ${cardBg}`}>
            <h3 className="font-serif text-3xl mb-2">Enterprise</h3>
            <p className={`text-sm ${textMuted} mb-10`}>Skala besar & custom.</p>
            <div className="mb-10 flex items-baseline gap-2">
              <span className={`text-sm ${textMuted} font-bold uppercase`}>Rp</span>
              <span className="text-5xl font-serif">649</span>
              <span className={textMuted}>rb</span>
            </div>
            <Link href={user ? "/dashboard/topup" : "/login"} className={`block text-center w-full py-4 border ${border} font-bold text-xs uppercase tracking-widest ${buttonInverse}`}>
              Cek Detail
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
