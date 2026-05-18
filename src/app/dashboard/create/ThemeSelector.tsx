"use client";

import { useState } from "react";

const THEME_PREVIEWS: Record<string, { name: string; desc: string; color: string }> = {
  "premium": { 
    name: "Sage Splendor", 
    desc: "Desain minimalis modern yang menenangkan dengan paduan warna hijau sage dan aksen emas tipis yang sangat estetik.",
    color: "bg-[#7C8C77]"
  },
  "royal-elegance": { 
    name: "Royal Elegance", 
    desc: "Kemegahan klasik aristokrat dengan latar beludru hitam pekat, ornamen emas mewah, dan efek sentuhan stardust trail yang ajaib.",
    color: "bg-[#020202]"
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
  },
  "modern-blue": {
    name: "Modern Blue",
    desc: "Desain asimetris Modern dengan Bento Grid gallery dan palet Steel Blue yang premium.",
    color: "bg-[#F8F9FB]"
  }
};

export default function ThemeSelector({ defaultValue = "cinematic-dark", onChange }: { defaultValue?: string, onChange?: (val: string) => void }) {
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
              <optgroup label="🎬 THE AVANT-GARDE SERIES (Modern & Kontemporer)" className="bg-wedding-base text-wedding-gold font-bold">
                <option value="premium" className="bg-wedding-base text-wedding-text font-normal">Sage Splendor</option>
                <option value="modern-blue" className="bg-wedding-base text-wedding-text font-normal">Modern Blue</option>
                <option value="celestial-harmony" className="bg-wedding-base text-wedding-text font-normal">Celestial Harmony</option>
                <option value="cinematic-dark" className="bg-wedding-base text-wedding-text font-normal">Cinematic Dark</option>
              </optgroup>
              
              <optgroup label="👑 THE SOVEREIGN SERIES (Klasik & Aristokrat)" className="bg-wedding-base text-wedding-gold font-bold">
                <option value="royal-elegance" className="bg-wedding-base text-wedding-text font-normal">Royal Elegance</option>
                <option value="majestic-eternity" className="bg-wedding-base text-wedding-text font-normal">Majestic Eternity</option>
                <option value="ultra-luxury" className="bg-wedding-base text-wedding-text font-normal">The Ultra Luxury</option>
                <option value="renaissance-garden" className="bg-wedding-base text-wedding-text font-normal">The Renaissance Garden</option>
              </optgroup>

              <optgroup label="🏺 THE NUSANTARA HERITAGE (Tradisional - Coming Soon)" className="bg-wedding-base text-wedding-text/40 font-bold" disabled>
                <option value="" disabled className="bg-wedding-base text-wedding-text/30 font-normal">Classic Javanese Royal</option>
                <option value="" disabled className="bg-wedding-base text-wedding-text/30 font-normal">Golden Minang Heritage</option>
              </optgroup>
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

        {/* Live Preview - Premium iPhone 15 Pro Mockup */}
        <div className="flex flex-col items-center w-full overflow-hidden">
          <label className="block text-xs font-bold text-wedding-text/40 mb-3 w-full text-center uppercase tracking-widest">Preview Tema</label>
          <div className="relative w-[240px] sm:w-[280px] h-[498px] sm:h-[583px] bg-black rounded-[2.5rem] sm:rounded-[3rem] p-[8px] sm:p-[10px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-[2px] border-[#2a2a2a] group transition-all duration-500">
            {/* Screen Content */}
            <div className="w-[220px] sm:w-[260px] h-[478px] sm:h-[563px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-black relative">
               <div className={`absolute inset-0 ${THEME_PREVIEWS[selectedTheme]?.color || 'bg-wedding-base'} opacity-20 z-10 pointer-events-none`}></div>
               
               {/* 375px virtual viewport scaled down proportionally */}
               <div 
                 className="absolute inset-0 origin-top-left [--scale-factor:0.586667] sm:[--scale-factor:0.693333]"
                 style={{ 
                   width: '375px', 
                   height: '812px', 
                   transform: 'scale(var(--scale-factor))',
                 }}
               >
                 <iframe 
                    src={`/demo/${selectedTheme}`} 
                    className="w-full h-full border-none pointer-events-auto"
                    title="Theme Preview"
                 />
               </div>
            </div>
            
            {/* Dynamic Island */}
            <div className="absolute top-[18px] sm:top-[22px] left-1/2 -translate-x-1/2 w-[72px] sm:w-[85px] h-[22px] sm:h-[26px] bg-black rounded-full z-[30] pointer-events-none" />
            
            {/* Hardware Buttons */}
            <div className="absolute top-[102px] sm:top-[120px] -left-[2px] w-[2px] h-[17px] sm:h-[20px] bg-[#2a2a2a] rounded-l-md" /> {/* Action */}
            <div className="absolute top-[136px] sm:top-[160px] -left-[2px] w-[2px] h-[34px] sm:h-[40px] bg-[#2a2a2a] rounded-l-md" /> {/* Vol Up */}
            <div className="absolute top-[187px] sm:top-[220px] -left-[2px] w-[2px] h-[34px] sm:h-[40px] bg-[#2a2a2a] rounded-l-md" /> {/* Vol Down */}
            <div className="absolute top-[153px] sm:top-[180px] -right-[2px] w-[2px] h-[51px] sm:h-[60px] bg-[#2a2a2a] rounded-r-md" /> {/* Power */}

            {/* Overlay Gradient for Badge */}
            <div className="absolute bottom-[8px] sm:bottom-[10px] left-[8px] sm:left-[10px] right-[8px] sm:right-[10px] h-28 sm:h-32 bg-gradient-to-t from-black/80 to-transparent z-40 rounded-b-[2rem] sm:rounded-b-[2.5rem] pointer-events-none"></div>
            
            <button 
              type="button"
              onClick={() => window.open(`/demo/${selectedTheme}`, '_blank')}
              className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-wedding-gold hover:bg-wedding-gold/90 active:scale-95 transition-all px-4 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-md shadow-lg border border-white/20 whitespace-nowrap cursor-pointer hover:shadow-wedding-gold/20 hover:shadow-xl"
            >
              Live Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
