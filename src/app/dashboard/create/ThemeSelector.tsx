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
  },
  "celestial-harmony": { 
    name: "Celestial Harmony", 
    desc: "Scroll parallax sinematik — foto utama jadi latar, konten mengalir seamless seperti film.",
    color: "bg-black"
  }
};

export default function ThemeSelector({ defaultValue = "premium", onChange }: { defaultValue?: string, onChange?: (val: string) => void }) {
  const [selectedTheme, setSelectedTheme] = useState(defaultValue);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedTheme(val);
    onChange?.(val);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div>
          <label className="block text-xs font-bold text-wedding-text/40 mb-1 uppercase tracking-widest">Pilih Tema</label>
          <div className="relative">
            <select 
              name="theme_input" 
              id="theme" 
              className="w-full bg-wedding-text/[0.03] border border-wedding-gold/10 rounded-lg px-4 py-3 text-wedding-text focus:outline-none focus:ring-2 focus:ring-wedding-gold/30 focus:border-wedding-gold transition-all appearance-none cursor-pointer" 
              required 
              value={selectedTheme}
              onChange={handleThemeChange}
            >
              <option value="premium" className="bg-wedding-base">Premium (Sage & Gold)</option>
              <option value="cinematic-dark" className="bg-wedding-base">Cinematic Dark (Black & White)</option>
              <option value="ultra-luxury" className="bg-wedding-base">The Ultra Luxury (Onyx & Rose Gold)</option>
              <option value="renaissance-garden" className="bg-wedding-base">The Renaissance Garden (Vintage Floral)</option>
              <option value="majestic-eternity" className="bg-wedding-base">Majestic Eternity (Emerald & Gold) - DEWA TIER</option>
              <option value="celestial-harmony" className="bg-wedding-base">Celestial Harmony (Scroll Parallax) - BARU!</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-wedding-gold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          <div className="mt-4 p-5 bg-wedding-text/[0.03] rounded-xl border border-wedding-gold/10 transition-all">
            <h4 className="font-bold text-sm text-wedding-gold">{THEME_PREVIEWS[selectedTheme]?.name || "Premium Theme"}</h4>
            <p className="text-xs text-wedding-text/60 mt-1 leading-relaxed">{THEME_PREVIEWS[selectedTheme]?.desc || "Tema elegan untuk hari bahagia Anda."}</p>
          </div>
        </div>

        {/* Live Preview - Phone Frame Aesthetic */}
        <div className="flex flex-col items-center">
          <label className="block text-xs font-bold text-wedding-text/40 mb-3 w-full text-center uppercase tracking-widest">Preview Tema</label>
          <div className="relative w-[240px] aspect-[9/16] rounded-[2.5rem] border-[8px] border-wedding-text bg-wedding-text shadow-2xl overflow-hidden group transition-all duration-500">
            {/* Speaker hole */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-wedding-text z-50 rounded-b-2xl">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-wedding-text/20 rounded-full"></div>
            </div>
            
            <div className={`absolute inset-0 ${THEME_PREVIEWS[selectedTheme]?.color || 'bg-wedding-base'} opacity-20`}></div>
            
            {/* Precision Mobile Scaling Container */}
            <div 
              className="absolute inset-0 origin-top-left"
              style={{ 
                width: '375px', 
                height: '667px', 
                transform: 'scale(0.64)', /* 240px / 375px = 0.64 */
              }}
            >
              <iframe 
                src={`/demo/${selectedTheme}`} 
                className="w-full h-full border-none"
                title="Theme Preview"
              ></iframe>
            </div>

            {/* Overlay Gradient for Badge */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent z-40"></div>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
              <div className="text-white text-[10px] font-bold uppercase tracking-widest bg-wedding-gold/80 px-4 py-2 rounded-full backdrop-blur-md shadow-lg border border-white/20 whitespace-nowrap">
                Live Preview
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
