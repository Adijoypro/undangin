"use client";

import { useState, useEffect } from "react";

interface SlugInputProps {
  defaultValue?: string;
  brideInputName?: string;
  groomInputName?: string;
}

export default function SlugInput({ 
  defaultValue = "", 
  brideInputName = "bride_name", 
  groomInputName = "groom_name" 
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
  };

  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-1">Custom Link (URL)</label>
      <div className="flex items-center">
        <span className="bg-gray-100 p-3 rounded-l-xl border border-r-0 text-gray-500 text-sm">undangin.com/</span>
        <input 
          type="text" 
          name="slug" 
          required 
          value={slug}
          onChange={handleManualChange}
          placeholder="nama-mempelai" 
          className="w-full p-3 border rounded-r-xl focus:border-wedding-gold outline-none" 
        />
      </div>
      <p className="text-[10px] text-gray-400 mt-1 flex justify-between">
        <span>Hanya huruf kecil dan strip (-).</span>
        {!isManual && <span className="text-wedding-gold animate-pulse">Otomatis Terisi ✨</span>}
      </p>
    </div>
  );
}
