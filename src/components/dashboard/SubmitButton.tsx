"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ label, loadingLabel }: { label: string; loadingLabel?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-5 font-bold rounded-xl transition-all uppercase tracking-widest text-sm shadow-xl mt-12 flex items-center justify-center gap-3 ${
        pending 
          ? "bg-gray-400 cursor-not-allowed text-white" 
          : "bg-wedding-text text-white hover:bg-wedding-gold"
      }`}
    >
      {pending ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{loadingLabel || "Sedang Memproses..."}</span>
        </>
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
}
