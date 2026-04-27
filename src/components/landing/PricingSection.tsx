"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PricingSection({ user }: { user: any }) {
  return (
    <section id="harga" className="py-32 px-4 relative border-t border-wedding-gold/10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-serif text-5xl md:text-6xl mb-6 text-wedding-text">Investasi Berkelas</h2>
          <p className="text-wedding-text/60 text-lg">Sistem kredit transparan tanpa biaya tersembunyi.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Uji Coba */}
          <div className="p-10 rounded-2xl border border-wedding-gold/10 bg-wedding-text/[0.03] hover:border-wedding-gold/30 transition-all">
            <h3 className="font-serif text-3xl mb-2 text-wedding-text">Uji Coba</h3>
            <p className="text-sm text-wedding-text/60 mb-10">Buat draft tanpa biaya.</p>
            <div className="mb-10 flex items-baseline gap-2">
              <span className="text-sm text-wedding-text/60 font-bold uppercase">Rp</span>
              <span className="text-5xl font-serif text-wedding-text">0</span>
            </div>
            <Link href={user ? "/dashboard" : "/login"} className="block text-center w-full py-4 border border-wedding-gold/10 font-bold text-xs uppercase tracking-widest bg-wedding-text text-wedding-base hover:opacity-80 transition-all">
              Mulai Gratis
            </Link>
          </div>

          {/* Premium */}
          <div className="p-10 rounded-2xl border border-wedding-gold bg-gradient-to-b from-[#FFFDF5] to-white dark:from-[#1a1500] dark:to-black relative shadow-xl transform md:-translate-y-4 transition-all duration-500">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-wedding-gold text-black px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Paling Laris
            </div>
            <h3 className="font-serif text-3xl mb-2 text-wedding-gold">Premium</h3>
            <p className="text-sm text-wedding-text/60 mb-10">Publikasi & fitur lengkap.</p>
            <div className="mb-10 flex items-baseline gap-2">
              <span className="text-sm text-wedding-gold font-bold uppercase">Rp</span>
              <span className="text-5xl font-serif text-wedding-gold">89</span>
              <span className="text-wedding-text/60">rb</span>
            </div>
            <Link href={user ? "/dashboard/topup" : "/login"} className="block text-center w-full py-4 bg-wedding-gold text-black font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
              Pilih Paket
            </Link>
          </div>

          {/* WO Pro */}
          <div className="p-10 rounded-2xl border border-wedding-gold/10 bg-wedding-text/[0.03]">
            <h3 className="font-serif text-3xl mb-2 text-wedding-text">Agensi</h3>
            <p className="text-sm text-wedding-text/60 mb-10">Paket hemat untuk profesional.</p>
            <div className="mb-10 flex items-baseline gap-2">
              <span className="text-sm text-wedding-text/60 font-bold uppercase">Rp</span>
              <span className="text-5xl font-serif text-wedding-text">349</span>
              <span className="text-wedding-text/60">rb</span>
            </div>
            <Link href={user ? "/dashboard/topup" : "/login"} className="block text-center w-full py-4 border border-wedding-gold/10 font-bold text-xs uppercase tracking-widest bg-wedding-text text-wedding-base hover:opacity-80 transition-all">
              Hubungi Kami
            </Link>
          </div>

          {/* Enterprise */}
          <div className="p-10 rounded-2xl border border-wedding-gold/10 bg-wedding-text/[0.03]">
            <h3 className="font-serif text-3xl mb-2 text-wedding-text">Enterprise</h3>
            <p className="text-sm text-wedding-text/60 mb-10">Skala besar & custom.</p>
            <div className="mb-10 flex items-baseline gap-2">
              <span className="text-sm text-wedding-text/60 font-bold uppercase">Rp</span>
              <span className="text-5xl font-serif text-wedding-text">649</span>
              <span className="text-wedding-text/60">rb</span>
            </div>
            <Link href={user ? "/dashboard/topup" : "/login"} className="block text-center w-full py-4 border border-wedding-gold/10 font-bold text-xs uppercase tracking-widest bg-wedding-text text-wedding-base hover:opacity-80 transition-all">
              Cek Detail
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
