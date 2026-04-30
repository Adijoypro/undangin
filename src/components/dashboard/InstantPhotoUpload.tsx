"use client";

import { useState } from "react";
import PreweddingGenerator from "./PreweddingGenerator";
import { uploadInstant } from "@/app/api/upload/actions";

interface InstantPhotoUploadProps {
  label: string;
  name: string; // nama field di database (bride_photo, groom_photo, couple_photo)
  initialPhotoUrl?: string;
  isAiEnabled?: boolean;
  showAiStudio?: boolean;
  accentColor?: "gold" | "sage";
  onUpload?: (url: string) => void;
  variant?: "default" | "minimal";
}

export default function InstantPhotoUpload({ 
  label, 
  name, 
  initialPhotoUrl, 
  isAiEnabled = false, 
  showAiStudio = false,
  accentColor = "gold",
  onUpload,
  variant = "default"
}: InstantPhotoUploadProps) {
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl || "");
  const [uploading, setUploading] = useState(false);

  const colors = {
    gold: {
      bg: "bg-wedding-gold/10",
      text: "text-wedding-gold",
      border: "border-wedding-gold/30",
      hover: "hover:file:bg-wedding-gold/20",
      gradient: "from-[#D4AF37] to-[#B8962E]"
    },
    sage: {
      bg: "bg-wedding-sage/10",
      text: "text-wedding-sage",
      border: "border-wedding-sage/30",
      hover: "hover:file:bg-wedding-sage/20",
      gradient: "from-wedding-sage to-[#6A7F6E]"
    }
  };

  const currentTheme = colors[accentColor];

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
        onUpload?.(result.url);
      } else {
        alert(result.message || "Gagal upload foto.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Terjadi kesalahan saat upload.");
    } finally {
      setUploading(false);
    }
  };

  if (variant === "minimal") {
    return (
      <div className="absolute inset-0 cursor-pointer">
        <input 
          type="file" 
          accept="image/*,.heic,.heif" 
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" 
        />
        {uploading && (
          <div className="absolute inset-0 bg-wedding-base/80 flex items-center justify-center backdrop-blur-sm z-40">
            <div className={`w-5 h-5 border-2 border-wedding-gold/30 border-t-wedding-gold rounded-full animate-spin`} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-wedding-text/40 uppercase tracking-wider">{label}</label>
      
      <div className={`flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-dashed ${currentTheme.border} bg-wedding-text/[0.03] transition-colors duration-500`}>
        {/* Preview Square */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-wedding-text/[0.05] rounded-xl border border-wedding-gold/10 flex items-center justify-center overflow-hidden shadow-inner relative transition-colors duration-500">
          {photoUrl ? (
            <img src={photoUrl} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <div className="text-center p-2">
              <svg className="w-8 h-8 text-wedding-text/20 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-[8px] text-wedding-text/40">Belum ada foto</p>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-wedding-base/80 flex items-center justify-center backdrop-blur-sm">
              <div className={`w-6 h-6 border-2 ${currentTheme.border} border-t-current ${currentTheme.text} rounded-full animate-spin`} />
            </div>
          )}
        </div>

        {/* Upload Actions */}
        <div className="flex-1 flex flex-col justify-center gap-3">
          <input 
            type="file" 
            accept="image/*,.heic,.heif" 
            onChange={handleFileChange}
            className={`w-full text-xs text-wedding-text/40 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold ${currentTheme.bg} ${currentTheme.text} ${currentTheme.hover} cursor-pointer transition-all`} 
          />
          
          {showAiStudio && (
            <div className="pt-2 border-t border-wedding-gold/10">
              <PreweddingGenerator 
                currentPhotoUrl={photoUrl} 
                isAiEnabled={isAiEnabled}
                onGenerated={(url) => {
                  setPhotoUrl(url);
                  onUpload?.(url);
                }} 
              />
            </div>
          )}
          
          {/* Hidden input to pass the URL to the main form action */}
          <input type="hidden" name={name} value={photoUrl} />
        </div>
      </div>
    </div>
  );
}
