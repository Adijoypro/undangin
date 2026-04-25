"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generatePreweddingAI } from "@/app/api/ai-photo/actions";

interface PreweddingGeneratorProps {
  currentPhotoUrl?: string;
  isAiEnabled?: boolean;
  onGenerated: (newUrl: string) => void;
}

export default function PreweddingGenerator({ currentPhotoUrl, isAiEnabled = false, onGenerated }: PreweddingGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("garden");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const themes = [
    { id: "beach", label: "Beach Romantic", icon: "🏖️" },
    { id: "garden", label: "Rustic Garden", icon: "🌿" },
    { id: "luxury", label: "Luxury Palace", icon: "🏰" },
  ];

  const handleGenerate = async () => {
    if (!currentPhotoUrl) {
      alert("Pilih/upload foto asli kamu dulu ya bro!");
      return;
    }

    setLoading(true);
    const result = await generatePreweddingAI(currentPhotoUrl, selectedTheme);
    
    if (result.success && result.url) {
      setPreviewUrl(result.url);
      onGenerated(result.url);
      setIsOpen(false);
    } else {
      alert(result.message || "Gagal menyulap foto kamu, coba lagi ya!");
    }
    setLoading(false);
  };

  const handleOpen = () => {
    if (!isAiEnabled) {
      const isEditPage = window.location.pathname.includes('/edit/');
      if (isEditPage) {
        alert("🔒 Fitur AI Prewedding Terkunci! \n\nSilakan klik tombol 'Upgrade Sekarang' di bagian paling atas halaman ini untuk membuka fitur premium dan hemat biaya fotografer jutaan rupiah! ✨");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("🔒 Fitur AI Prewedding Terkunci! \n\nSimpan undangan kamu terlebih dahulu, lalu kamu bisa membuka fitur premium ini di halaman Edit. ✨");
      }
      return;
    }
    setIsOpen(true);
  };

  return (
    <div className="mt-4">
      <div className="relative group">
        <button
          type="button"
          disabled
          className="w-full px-6 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-3 bg-gray-100 text-gray-400 border-2 border-dashed border-gray-200 cursor-not-allowed overflow-hidden group-hover:border-wedding-gold/30 transition-all"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="tracking-widest uppercase">Sulap Prewed AI (Coming Soon)</span>
            <span className="bg-wedding-gold/10 text-wedding-gold px-2 py-0.5 rounded text-[8px] font-black border border-wedding-gold/20 animate-pulse">BETA</span>
          </div>
        </button>
        
        {/* Tooltip on hover */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-wedding-text text-white text-[9px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-bold shadow-xl">
          🚀 Sedang Kami Sempurnakan untuk Hasil Lebih Mewah!
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl p-8"
            >
              <div className="text-center mb-8">
                <h3 className="font-serif text-2xl text-gray-800 mb-2">Pilih Tema Prewed AI</h3>
                <p className="text-sm text-gray-500 italic">Kami akan menyulap foto asli kamu jadi lebih mewah!</p>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-8">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                      selectedTheme === theme.id 
                        ? 'border-[#D4AF37] bg-[#D4AF37]/5' 
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <span className="text-2xl">{theme.icon}</span>
                    <span className={`font-bold ${selectedTheme === theme.id ? 'text-[#D4AF37]' : 'text-gray-600'}`}>
                      {theme.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-white rounded-2xl font-bold flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sedang Menyulap...
                    </>
                  ) : (
                    "Proses Sekarang ✨"
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 text-gray-400 font-medium hover:text-gray-600"
                >
                  Batal
                </button>
              </div>

              <p className="mt-6 text-[10px] text-center text-gray-400">
                AI akan merubah background dan pakaian tetap menjaga kemiripan wajah. <br/>
                Proses ini membutuhkan waktu sekitar 10-20 detik.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
