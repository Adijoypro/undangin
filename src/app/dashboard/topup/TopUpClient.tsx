"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Package {
  id: string;
  name: string;
  credits: number;
  price: number;
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
      // 1. Request Snap Token from our API
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

      // 2. Trigger Midtrans Snap Popup
      // @ts-ignore
      window.snap.pay(data.token, {
        onSuccess: function (result: any) {
          alert("Pembayaran Berhasil! Kredit Anda akan segera ditambahkan.");
          // Update: Use router for smoother transition
          router.push("/dashboard");
        },
        onPending: function (result: any) {
          alert("Menunggu pembayaran Anda...");
        },
        onError: function (result: any) {
          alert("Pembayaran Gagal. Silakan coba lagi.");
        },
        onClose: function () {
          alert("Anda menutup halaman sebelum menyelesaikan pembayaran.");
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
      {/* Midtrans Snap Script (Sandbox) */}
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-8">
        {packages.map((pkg, i) => (
          <motion.div 
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            {/* AGGRESSIVE GLOW FOR POPULAR ITEM */}
            {pkg.id === "pkg_5" && (
              <div className="absolute -inset-0.5 md:-inset-1 bg-gradient-to-r from-wedding-gold via-amber-300 to-wedding-gold rounded-xl md:rounded-3xl blur opacity-25 animate-pulse"></div>
            )}

            <div className={`h-full bg-white rounded-xl md:rounded-2xl shadow-sm border-2 ${pkg.id === "pkg_5" ? 'border-wedding-gold' : 'border-gray-100'} overflow-hidden flex flex-col relative group transition-all duration-500 hover:shadow-xl`}>
              
              {pkg.id === "pkg_5" && (
                <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
                  <span className="bg-wedding-gold text-white text-[6px] md:text-[8px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] px-1.5 md:px-3 py-0.5 md:py-1 rounded-full shadow-sm">
                    Laris
                  </span>
                </div>
              )}
              
              <div className="p-3 md:p-8 text-center relative z-10">
                <div className={`w-8 h-8 md:w-14 md:h-14 mx-auto mb-2 md:mb-4 rounded-lg md:rounded-xl flex items-center justify-center text-lg md:text-3xl ${
                  pkg.id === "pkg_1" ? "bg-amber-50" : 
                  pkg.id === "pkg_5" ? "bg-wedding-gold/10" : 
                  "bg-blue-50"
                }`}>
                  {pkg.id === "pkg_1" ? "✨" : pkg.id === "pkg_5" ? "💼" : "👑"}
                </div>
                
                <h3 className="font-serif text-sm md:text-2xl text-gray-900 font-bold mb-0.5 md:mb-1 leading-tight">{pkg.name}</h3>
                <p className="hidden md:block text-gray-400 text-[10px] font-bold uppercase tracking-widest">{pkg.description}</p>
              </div>

              <div className="px-3 md:px-8 pb-3 md:pb-8 text-center">
                <div className="flex items-baseline justify-center gap-0.5 md:gap-1">
                  <span className="text-[10px] md:text-lg font-serif font-bold text-gray-400 uppercase">Rp</span>
                  <span className="text-xl md:text-5xl font-serif font-black text-gray-900 tracking-tighter">{(pkg.price / 1000).toFixed(0)}</span>
                  <span className="text-xs md:text-xl font-serif font-bold text-gray-900">rb</span>
                </div>
                <p className="text-[7px] md:text-[10px] text-wedding-gold font-black uppercase tracking-[0.1em] md:tracking-[0.3em] mt-0.5 md:mt-2">
                  {pkg.credits} <span className="hidden sm:inline">KREDIT</span>
                </p>
              </div>

              <div className="p-2 md:p-8 mt-auto bg-gray-50/50 relative border-t border-gray-100">
                <ul className="hidden md:block space-y-3 mb-8">
                  {[
                    "Semua Tema Premium",
                    "Edit Sepuasnya",
                    "Aktif Selamanya",
                    pkg.id === "pkg_5" ? "15 Draft Undangan" : pkg.id === "pkg_10" ? "30 Draft Undangan" : "5 Draft Undangan"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-[11px] font-bold text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handlePay(pkg)}
                  disabled={loading === pkg.id}
                  className={`w-full py-2 md:py-4 rounded-lg md:rounded-xl font-black uppercase tracking-widest text-[7px] md:text-[10px] transition-all shadow-md active:scale-95 ${
                    pkg.id === "pkg_5" 
                      ? "bg-[#111111] text-white hover:bg-black" 
                      : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
                  } disabled:opacity-50`}
                >
                  {loading === pkg.id ? "..." : "Beli"}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
