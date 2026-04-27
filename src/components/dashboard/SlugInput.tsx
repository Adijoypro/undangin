"use client";

import { useState, useEffect } from "react";

interface SlugInputProps {
  defaultValue?: string;
  brideInputName?: string;
  groomInputName?: string;
  onChange?: (value: string) => void;
}

export default function SlugInput({ 
  defaultValue = "", 
  brideInputName = "bride_name", 
  groomInputName = "groom_name",
  onChange
}: SlugInputProps) {
  const [slug, setSlug] = useState(defaultValue);
  const [isManual, setIsManual] = useState(!!defaultValue);

  useEffect(() => {
    if (isManual) return;

    const handleNameChange = () => {
      const brideInput = document.querySelector(`input[name="${brideInputName}"]`) as HTMLInputElement;
      const groomInput = document.querySelector(`input[name="${groomInputName}"]`) as HTMLInputElement;
      
      if (brideInput && groomInput) {
        const bride = brideInput.value.trim().toLowerCase();
        const groom = groomInput.value.trim().toLowerCase();
        
        if (bride || groom) {
          const generatedSlug = `${bride}${bride && groom ? "-" : ""}${groom}`
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          setSlug(generatedSlug);
          onChange?.(generatedSlug);
        }
      }
    };

    const brideInput = document.querySelector(`input[name="${brideInputName}"]`);
    const groomInput = document.querySelector(`input[name="${groomInputName}"]`);

    brideInput?.addEventListener("input", handleNameChange);
    groomInput?.addEventListener("input", handleNameChange);

    return () => {
      brideInput?.removeEventListener("input", handleNameChange);
      groomInput?.removeEventListener("input", handleNameChange);
    };
  }, [isManual, brideInputName, groomInputName]);

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setSlug(value);
    setIsManual(true);
    onChange?.(value);
  };

  return (
    <div className="transition-colors duration-500">
      <label className="block text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest mb-2">Custom Link (URL)</label>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center group">
        <div className="bg-wedding-text/5 p-3 sm:px-4 rounded-t-xl sm:rounded-t-none sm:rounded-l-xl border border-wedding-gold/10 sm:border-r-0 text-wedding-text/40 text-xs font-bold transition-all duration-500 flex items-center justify-center sm:justify-start">
          undangin.com/
        </div>
        <input 
          type="text" 
          name="slug" 
          required 
          value={slug}
          onChange={handleManualChange}
          placeholder="nama-mempelai" 
          className="w-full p-3 sm:p-3 bg-wedding-base border border-wedding-gold/10 rounded-b-xl sm:rounded-b-none sm:rounded-r-xl focus:border-wedding-gold outline-none text-wedding-text text-sm font-bold transition-all" 
        />
      </div>
      <div className="text-[9px] text-wedding-text/40 mt-2 flex justify-between italic">
        <span>Hanya huruf kecil dan strip (-).</span>
        {!isManual && <span className="text-wedding-gold animate-pulse font-bold not-italic">Otomatis Terisi ✨</span>}
      </div>
    </div>
  );
}
