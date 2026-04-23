"use client";

import { useState } from "react";

const THEME_PREVIEWS: Record<string, { name: string; desc: string; color: string }> = {
  "premium": { 
    name: "Premium Sage & Gold", 
    desc: "Desain minimalis dengan perpaduan warna hijau sage dan aksen emas yang menenangkan.",
    color: "bg-[#7C8C77]"
  },
  "cinematic-dark": { 
    name: "Cinematic Dark", 
    desc: "Nuansa gelap yang dramatis dengan tipografi besar dan animasi yang elegan.",
    color: "bg-gray-900"
  },
  "ultra-luxury": { 
    name: "The Ultra Luxury", 
    desc: "Kemewahan tingkat tinggi dengan mawar emas animasi dan latar belakang onyx gelap.",
    color: "bg-black"
  },
  "renaissance-garden": { 
    name: "The Renaissance Garden", 
    desc: "Gaya klasik Eropa dengan ornamen bunga vintage yang abadi dan artistik.",
    color: "bg-[#F9F6F0]"
  },
  "majestic-eternity": { 
    name: "Majestic Eternity", 
    desc: "Kasta tertinggi dengan perpaduan warna emerald dan emas yang megah bak kerajaan.",
    color: "bg-[#0A1C14]"
  }
};

export default function ThemeSelector() {
  const [selectedTheme, setSelectedTheme] = useState("premium");

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Pilih Tema</label>
          <select 
            name="theme" 
            id="theme" 
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-wedding-gold/50 focus:border-wedding-gold transition-colors appearance-none" 
            required 
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
          >
            <option value="premium">Premium (Sage & Gold)</option>
            <option value="cinematic-dark">Cinematic Dark (Black & White)</option>
            <option value="ultra-luxury">The Ultra Luxury (Onyx & Rose Gold)</option>
            <option value="renaissance-garden">The Renaissance Garden (Vintage Floral)</option>
            <option value="majestic-eternity">Majestic Eternity (Emerald & Gold) - DEWA TIER</option>
          </select>
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h4 className="font-bold text-sm text-wedding-text">{THEME_PREVIEWS[selectedTheme].name}</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{THEME_PREVIEWS[selectedTheme].desc}</p>
          </div>
        </div>

        {/* Live Preview Placeholder/Mini Frame */}
        <div className="hidden md:block">
          <label className="block text-xs font-bold text-gray-500 mb-1">Preview Tema</label>
          <div className={`aspect-video rounded-xl ${THEME_PREVIEWS[selectedTheme].color} border border-gray-200 shadow-inner flex flex-col items-center justify-center relative overflow-hidden group`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <iframe 
              src={`/demo/${selectedTheme}`} 
              className="absolute inset-0 w-full h-full border-none scale-[0.4] origin-top opacity-80"
              style={{ width: '250%', height: '250%' }}
            ></iframe>
            <div className="relative z-10 text-white text-[10px] font-bold uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              Live Preview
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
