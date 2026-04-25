"use client";

import { useState } from "react";
import { toast } from "sonner";

interface UpgradeAiButtonProps {
  invitationId: string;
  userEmail: string;
  userId: string;
}

declare global {
  interface Window {
    snap: any;
  }
}

export default function UpgradeAiButton({ invitationId, userEmail, userId }: UpgradeAiButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBypass = async () => {
    setIsLoading(true);
    toast.info("Menjalankan aktivasi kilat...");
    try {
      await fetch("/api/midtrans/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_status: "settlement",
          custom_field3: invitationId,
          is_local_test: true
        })
      });
      toast.success("Fitur AI Berhasil Diaktifkan!");
      window.location.reload();
    } catch (e) {
      toast.error("Gagal aktivasi bypass");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/midtrans/tokenize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: "upgrade_ai",
          price: 89000,
          userId: userId,
          userEmail: userEmail,
          invitationId: invitationId,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Gagal mendapatkan token pembayaran");

      window.snap.pay(data.token, {
        onSuccess: async function (result: any) {
          toast.success("Pembayaran berhasil! Mengaktifkan fitur AI...");
          await handleBypass();
        },
        onPending: function (result: any) {
          toast.info("Menunggu pembayaran Anda...");
        },
        onError: function (result: any) {
          toast.error("Pembayaran gagal, silakan coba lagi.");
        },
        onClose: function () {
          toast.info("Pembayaran dibatalkan.");
        },
      });
    } catch (error: any) {
      console.error("Upgrade Error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center text-white text-2xl shadow-inner">
          ✨
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-serif text-lg font-bold text-gray-700">Fitur Premium AI</h4>
            <span className="px-2 py-0.5 bg-wedding-gold text-white text-[8px] font-black rounded-full uppercase tracking-tighter animate-pulse">Coming Soon</span>
          </div>
          <p className="text-xs text-gray-500 max-w-sm">
            Kami sedang menyiapkan **AI Prewedding Studio** & **AI Quote Assistant** untuk membuat undanganmu semakin istimewa. Nantikan kehadirannya segera!
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full md:w-auto">
        <button
          disabled={true}
          className="px-8 py-3 bg-gray-300 text-white rounded-xl font-bold text-sm shadow-sm cursor-not-allowed transition-all"
        >
          Tersedia Segera
        </button>
      </div>
    </div>
  );
}
