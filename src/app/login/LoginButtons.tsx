"use client";

import { useFormStatus } from "react-dom";
import { login, signup } from "./actions";

export default function LoginButtons() {
  const { pending, action } = useFormStatus();

  const isLogin = pending && action?.toString().includes("login");
  const isSignup = pending && action?.toString().includes("signup");

  return (
    <div className="flex flex-col gap-3">
      <button 
        formAction={login} 
        disabled={pending}
        className={`w-full py-4 rounded-xl font-bold transition-all uppercase tracking-widest text-xs shadow-md flex items-center justify-center gap-2 ${
          pending 
            ? "bg-gray-400 cursor-not-allowed text-white" 
            : "bg-[#D4AF37] text-white hover:bg-[#B8962E] active:scale-[0.98]"
        }`}
      >
        {isLogin ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Memverifikasi...</span>
          </div>
        ) : (
          "Masuk Ke Dasbor"
        )}
      </button>

      <button 
        formAction={signup} 
        disabled={pending}
        className={`w-full py-4 border-2 rounded-xl font-bold transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${
          pending
            ? "border-gray-100 text-gray-300 cursor-not-allowed"
            : "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/5 active:scale-[0.98]"
        }`}
      >
        {isSignup ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-[#D4AF37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Mendaftar...</span>
          </div>
        ) : (
          "Daftar Akun Baru"
        )}
      </button>
    </div>
  );
}
