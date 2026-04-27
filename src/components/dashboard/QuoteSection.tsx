"use client";

import { useState } from "react";
import AIQuoteAssistant from "./AIQuoteAssistant";

interface QuoteSectionProps {
  initialQuote: string;
  initialBrideName: string;
  initialGroomName: string;
  isAiEnabled?: boolean;
  onChange?: (val: string) => void;
}

export default function QuoteSection({ initialQuote, initialBrideName, initialGroomName, isAiEnabled = false, onChange }: QuoteSectionProps) {
  const [quote, setQuote] = useState(initialQuote);

  const handleQuoteChange = (val: string) => {
    setQuote(val);
    onChange?.(val);
  };

  return (
    <div className="transition-colors duration-500">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest">Quote / Kutipan</label>
        <AIQuoteAssistant 
          brideName={initialBrideName} 
          groomName={initialGroomName} 
          isAiEnabled={isAiEnabled}
          onGenerated={(text) => handleQuoteChange(text)} 
        />
      </div>
      <textarea 
        name="quote_input" 
        value={quote}
        onChange={(e) => handleQuoteChange(e.target.value)}
        rows={4} 
        className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-xl focus:border-wedding-gold outline-none text-sm leading-relaxed text-wedding-text transition-all"
      ></textarea>
      <p className="text-[10px] text-wedding-text/40 mt-2 italic">Gunakan tombol AI untuk membuat kutipan otomatis berdasarkan nama mempelai.</p>
    </div>
  );
}
