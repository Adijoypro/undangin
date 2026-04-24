"use client";

import { useState } from "react";
import AIQuoteAssistant from "./AIQuoteAssistant";

interface QuoteSectionProps {
  initialQuote: string;
  initialBrideName: string;
  initialGroomName: string;
}

export default function QuoteSection({ initialQuote, initialBrideName, initialGroomName }: QuoteSectionProps) {
  const [quote, setQuote] = useState(initialQuote);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-xs font-bold text-gray-500">Quote / Kutipan</label>
        <AIQuoteAssistant 
          brideName={initialBrideName} 
          groomName={initialGroomName} 
          onGenerated={(text) => setQuote(text)} 
        />
      </div>
      <textarea 
        name="quote" 
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        rows={3} 
        className="w-full p-4 border border-gray-200 rounded-xl focus:border-wedding-gold outline-none text-sm leading-relaxed"
      ></textarea>
      <p className="text-[10px] text-gray-400 mt-2 italic">Gunakan tombol AI untuk membuat kutipan otomatis berdasarkan nama mempelai.</p>
    </div>
  );
}
