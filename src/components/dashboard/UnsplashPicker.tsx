"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { searchUnsplash } from "@/app/api/unsplash/actions";

interface UnsplashPickerProps {
  onSelect: (url: string) => void;
  label: string;
}

export default function UnsplashPicker({ onSelect, label }: UnsplashPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    const result = await searchUnsplash(query);
    if (result.success) {
      setImages(result.images || []);
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:text-[#B8962E] flex items-center gap-2 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Cari di Unsplash
      </button>

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
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b flex items-center justify-between bg-gray-50">
                <h3 className="font-serif text-2xl text-gray-800">Cari Foto {label}</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="p-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Contoh: wedding garden, rustic decor..."
                    className="flex-1 p-4 bg-gray-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-8 py-4 bg-[#D4AF37] text-white rounded-2xl font-bold hover:bg-[#B8962E] transition-all disabled:opacity-50"
                  >
                    {loading ? "Mencari..." : "Cari"}
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.length > 0 ? (
                  images.map((img) => (
                    <motion.div
                      key={img.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedUrl(img.url);
                        onSelect(img.url);
                        setIsOpen(false);
                      }}
                      className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer group border-4 transition-all ${
                        selectedUrl === img.url ? 'border-[#D4AF37]' : 'border-transparent'
                      }`}
                    >
                      <img src={img.thumb} alt={img.user} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <p className="text-[10px] text-white font-medium">By {img.user}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center text-gray-400">
                    <p>Cari foto estetik untuk menyempurnakan undanganmu.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
