"use client";

import { useState } from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, Briefcase, Crown, Check, Lock, Zap, Gem, MessageCircle } from "lucide-react";

interface Package {
  id: string;
  name: string;
  credits: number;
  price: number;
  originalPrice?: number;
  description: string;
}

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
                <div className="absolute -inset-1 bg-gradient-to-r from-wedding-gold via-amber-300 to-wedding-gold rounded-3xl blur opacity-25 animate-pulse"></div>
              )}

                <div className={`h-full bg-white/40 dark:bg-wedding-base/40 backdrop-blur-xl rounded-[2.5rem] shadow-xl border-2 ${pkg.id === "pkg_5" ? 'border-wedding-gold shadow-wedding-gold/20' : 'border-wedding-gold/10'} overflow-hidden flex flex-col relative group transition-all duration-500 hover:shadow-2xl hover:border-wedding-gold/30`}>
                
                {pkg.id === "pkg_5" && (
                  <div className="absolute top-6 right-6 z-10">
                    <span className="bg-gradient-to-r from-wedding-gold to-amber-600 text-white text-[8px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                      BEST SELLER
                    </span>
                  </div>
                )}
                
                <div className="p-10 text-center relative z-10">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg ${
                    pkg.id === "pkg_5" ? "bg-wedding-gold text-white" : "bg-wedding-gold/10 text-wedding-gold"
                  }`}>
                    {pkg.id === "pkg_1" ? <Gem className="w-8 h-8" /> : pkg.id === "pkg_5" ? <Sparkles className="w-8 h-8" /> : <Crown className="w-8 h-8" />}
                  </div>
                  
                  <h3 className="font-serif text-2xl text-wedding-text font-bold mb-1">{pkg.name}</h3>
                  <p className="text-wedding-text/40 text-[10px] font-bold uppercase tracking-widest">{pkg.description}</p>
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
