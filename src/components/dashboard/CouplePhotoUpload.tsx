"use client";

import { useState } from "react";
import PreweddingGenerator from "./PreweddingGenerator";
import { uploadInstant } from "@/app/api/upload/actions";

interface CouplePhotoUploadProps {
  initialPhotoUrl?: string;
  isAiEnabled?: boolean;
}

export default function CouplePhotoUpload({ initialPhotoUrl, isAiEnabled = false }: CouplePhotoUploadProps) {
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl || "");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadInstant(formData);
      if (result.success && result.url) {
        setPhotoUrl(result.url);
      } else {
        alert(result.message || "Gagal upload foto sementara.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Terjadi kesalahan saat upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="md:col-span-2 pt-4">
      <label className="block text-sm font-bold text-gray-700 mb-2">Foto Berdua (Hero/Halaman Utama)</label>
      <div className="flex flex-col md:flex-row gap-6 bg-gray-50 p-6 rounded-2xl border border-dashed border-[#D4AF37]/30">
        <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-2xl border-2 border-gray-100 flex items-center justify-center overflow-hidden shadow-inner relative">
          {photoUrl ? (
            <img src={photoUrl} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <div className="text-center p-4">
              <svg className="w-12 h-12 text-gray-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-[10px] text-gray-400">Belum ada foto</p>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2">Pilih Foto dari Galeri</p>
            <input 
              type="file" 
              name="couple_photo_file"
              accept="image/*" 
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#D4AF37]/10 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/20 cursor-pointer transition-all" 
            />
            <p className="text-[10px] text-gray-400 mt-2 italic">Format: JPG, PNG. Maksimal 5MB.</p>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <PreweddingGenerator 
              currentPhotoUrl={photoUrl} 
              isAiEnabled={isAiEnabled}
              onGenerated={(url) => setPhotoUrl(url)} 
            />
          </div>
          
          <input type="hidden" name="couple_photo" value={photoUrl} />
        </div>
      </div>
    </div>
  );
}
