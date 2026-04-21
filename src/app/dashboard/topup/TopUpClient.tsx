"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

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
          window.location.href = "/dashboard";
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
      {/* Midtrans Snap Script (Sandbox) - Change to production URL later */}
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <div className="grid md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col relative group hover:border-wedding-gold hover:shadow-xl transition-all duration-300">
            {pkg.id === "pkg_5" && (
              <div className="absolute top-0 inset-x-0 bg-wedding-gold text-white text-[10px] font-bold uppercase tracking-widest text-center py-1">
                Paling Populer
              </div>
            )}
            
            <div className="p-8 text-center border-b border-gray-100">
              <h3 className="font-serif text-2xl text-wedding-text mb-2">{pkg.name}</h3>
              <p className="text-gray-500 text-sm mb-6">{pkg.description}</p>
              
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-xl font-bold text-gray-400">Rp</span>
                <span className="text-4xl font-black text-gray-800">{pkg.price.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between bg-gray-50/50">
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-sm font-bold">{pkg.credits} Undangan Digital</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-sm text-gray-600">Akses Semua Tema Premium</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-sm text-gray-600">Fitur Custom Musik & Foto</span>
                </li>
              </ul>

              <button 
                onClick={() => handlePay(pkg)}
                disabled={loading === pkg.id}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors ${
                  pkg.id === "pkg_5" 
                    ? "bg-wedding-gold text-white hover:bg-yellow-600" 
                    : "bg-wedding-text text-white hover:bg-gray-800"
                } disabled:opacity-50`}
              >
                {loading === pkg.id ? "Memproses..." : "Beli Sekarang"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
