"use client";

import { useState } from "react";
import Script from "next/script";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock, Zap, Gem, MessageCircle, Check } from "lucide-react";

interface Package {
  id: string;
  name: string;
  credits: number;
  price: number;
  originalPrice?: number;
  description: string;
}

const assetMap: Record<string, string> = {
  pkg_1: "/assets/branding/final/nusantara_keris_solid_white_bg_1777349884812.webp",
  pkg_5: "/assets/branding/final/nusantara_rumah_gadang_solid_white_bg_1777350046759.webp",
  pkg_10: "/assets/branding/final/nusantara_barong_solid_white_bg_1777349993913.webp",
};

interface TopUpClientProps {
  packages: Package[];
  user: { id: string; email: string };
}

export default function TopUpClient({ packages, user }: TopUpClientProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handlePay = async (pkg: Package) => {
    setLoading(pkg.id);

    try {
      const response = await fetch("/api/midtrans/tokenize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: pkg.id,
          price: pkg.price,
          credits: pkg.credits,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mendapatkan token pembayaran.");
      }

      // @ts-ignore
      window.snap.pay(data.token, {
        onSuccess: function (result: any) {
          router.push("/dashboard?message=success");
        },
        onPending: function (result: any) {
          console.log("Menunggu pembayaran...");
        },
        onError: function (result: any) {
          alert("Pembayaran Gagal. Silakan coba lagi.");
        },
      });

    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      <div className="flex flex-col items-center justify-center mb-16 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -20, 0]
          }}
          transition={{ 
            opacity: { duration: 1 },
            scale: { duration: 1 },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-48 h-48 md:w-64 md:h-64 pointer-events-none relative z-10"
        >
          <Image 
            src="/assets/branding/final/nusantara_gold_coins_3d.webp"
            alt="Nusantara Gold Coins"
            fill
            className="object-contain drop-shadow-[0_20px_60px_rgba(255,215,0,0.4)]"
          />
        </motion.div>
        
        {/* Decorative Golden Aura behind Borobudur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-wedding-gold/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {packages.map((pkg, i) => {
          const savings = pkg.originalPrice ? pkg.originalPrice - pkg.price : 0;
          return (
            <motion.div 
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative flex-shrink-0 w-[85vw] sm:w-[320px] md:w-auto snap-center md:snap-align-none"
            >
              {pkg.id === "pkg_5" && (
                <div className="absolute -inset-1 bg-gradient-to-r from-wedding-gold via-amber-300 to-wedding-gold rounded-[3rem] blur opacity-25 animate-pulse"></div>
              )}

                <div className={`h-full bg-white/60 dark:bg-wedding-base/60 backdrop-blur-2xl rounded-[3rem] shadow-xl border-2 ${pkg.id === "pkg_5" ? 'border-wedding-gold shadow-wedding-gold/20' : 'border-wedding-gold/10'} overflow-hidden flex flex-col relative group transition-all duration-700 hover:shadow-2xl hover:border-wedding-gold/40`}>
                
                {pkg.id === "pkg_5" && (
                  <div className="absolute top-8 right-8 z-20">
                    <span className="bg-gradient-to-r from-wedding-gold to-amber-600 text-black text-[8px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg border border-white/20">
                      BEST SELLER
                    </span>
                  </div>
                )}
                
                <div className="p-10 text-center relative z-10 flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
                    <div className="absolute inset-4 bg-wedding-gold/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <Image 
                      src={assetMap[pkg.id] || assetMap.pkg_1}
                      alt={pkg.name}
                      width={140}
                      height={140}
                      className="object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(180,140,80,0.3)] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700"
                    />
                  </div>
                  
                  <h3 className="font-serif text-3xl text-wedding-text font-bold mb-1">{pkg.name}</h3>
                  <p className="text-wedding-text/40 text-[10px] font-bold uppercase tracking-[0.3em]">{pkg.description}</p>
                </div>

                <div className="px-8 pb-4 text-center">
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <span className="text-sm text-wedding-text/20 line-through font-medium italic">Rp {(pkg.originalPrice! / 1000).toFixed(0)}rb</span>
                    {savings > 0 && (
                      <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">Hemat Rp {(savings / 1000).toFixed(0)}rb</span>
                    )}
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-lg font-serif font-bold text-wedding-gold uppercase">Rp</span>
                    <span className="text-6xl font-serif font-black text-wedding-text tracking-tighter">{(pkg.price / 1000).toFixed(0)}</span>
                    <span className="text-xl font-serif font-bold text-wedding-text">rb</span>
                  </div>
                  <p className="text-[10px] text-wedding-text/40 font-black uppercase tracking-[0.3em] mt-2">{pkg.credits} KREDIT PUBLIKASI</p>
                </div>

                <div className="p-8 mt-auto bg-wedding-text/[0.03] relative border-t border-wedding-gold/5">
                  <ul className="space-y-4 mb-10">
                    {[
                      "Semua Tema Premium",
                      "Edit Sepuasnya",
                      "Aktif Selamanya",
                      pkg.id === "pkg_10" ? "Prioritas Support VIP" : "Support Standar"
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          pkg.id === "pkg_5" ? "bg-wedding-gold/20 text-wedding-gold" : "bg-wedding-text/5 text-wedding-text/30"
                        }`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-bold text-wedding-text/70">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => handlePay(pkg)}
                    disabled={loading === pkg.id}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl active:scale-95 ${
                      pkg.id === "pkg_5" 
                        ? "bg-gradient-to-r from-wedding-gold to-amber-600 text-black hover:brightness-110" 
                        : "bg-wedding-text text-wedding-base hover:opacity-80"
                    } disabled:opacity-50`}
                  >
                    {loading === pkg.id ? "Processing..." : pkg.id === "pkg_1" ? "Mulai Sekarang" : "Ambil Promo Hemat"}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* TRUST BADGES SECTION */}
      <div className="mt-20 pt-10 border-t border-wedding-gold/10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: "Pembayaran Aman", sub: "Via Midtrans Secure Payment", icon: <Lock className="w-6 h-6" /> },
          { label: "Verifikasi Instan", sub: "Kredit langsung masuk otomatis", icon: <Zap className="w-6 h-6" /> },
          { label: "Aktif Selamanya", sub: "Tanpa biaya langganan bulanan", icon: <Gem className="w-6 h-6" /> },
          { label: "Support 24/7", sub: "Siap bantu via WhatsApp", icon: <MessageCircle className="w-6 h-6" /> }
        ].map((item, idx) => (
          <div key={idx} className="text-center group">
            <div className="w-12 h-12 mx-auto mb-4 bg-wedding-gold/5 rounded-full flex items-center justify-center text-wedding-gold transition-transform group-hover:scale-110">
              {item.icon}
            </div>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-wedding-text mb-1">{item.label}</h4>
            <p className="text-[9px] text-wedding-text/40 font-medium">{item.sub}</p>
          </div>
        ))}
      </div>
    </>
  );
}
