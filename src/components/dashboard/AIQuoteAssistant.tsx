"use client";

import { useState } from "react";
import { generateRomanticQuote } from "@/app/api/ai/actions";
import { toast } from "sonner";

interface AIQuoteAssistantProps {
  brideName: string;
  groomName: string;
  isAiEnabled?: boolean;
  onGenerated: (text: string) => void;
}

export default function AIQuoteAssistant({ brideName, groomName, isAiEnabled = false, onGenerated }: AIQuoteAssistantProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!brideName || !groomName) {
      toast.error("Isi nama mempelai terlebih dahulu agar kutipan lebih personal.");
      return;
    }

    setIsLoading(true);
    const res = await generateRomanticQuote(brideName, groomName);
    setIsLoading(false);

    if (res.success && res.text) {
      onGenerated(res.text);
      toast.success("Kutipan romantis berhasil dibuat!");
    } else {
      toast.error(res.message || "Gagal membuat kutipan.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={isLoading}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-wedding-gold/10 text-wedding-gold hover:bg-wedding-gold hover:text-white transition-all disabled:opacity-50 text-[10px] font-bold uppercase tracking-widest"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Menulis...
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          AI Bantu Tulis ✨
        </>
      )}
    </button>
  );
}
