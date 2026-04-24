"use client";

import { useFormStatus } from "react-dom";
import { login, signup } from "./actions";

export default function LoginButtons() {
  const { pending, action } = useFormStatus();

  // Check which action is pending
  const isLogin = pending && action?.toString().includes("login");
  const isSignup = pending && action?.toString().includes("signup");

  return (
    <div className="flex flex-col gap-3">
      <button 
        formAction={login} 
        disabled={pending}
        className={`w-full py-4 rounded-xl font-bold transition-all uppercase tracking-widest text-sm shadow-lg flex items-center justify-center gap-2 ${
          pending 
            ? "bg-gray-400 cursor-not-allowed text-white" 
            : "bg-wedding-text text-white hover:bg-wedding-gold hover:shadow-wedding-gold/30"
        }`}
      >
        {isLogin ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Memverifikasi...</span>
          </>
        ) : (
          "Masuk"
        )}
      </button>

      <button 
        formAction={signup} 
        disabled={pending}
        className={`w-full py-4 border rounded-xl font-bold transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 ${
          pending
            ? "border-gray-200 text-gray-400 cursor-not-allowed"
            : "border-wedding-gold text-wedding-gold hover:bg-wedding-gold/10"
        }`}
      >
        {isSignup ? (
          <>
            <svg className="animate-spin h-5 w-5 text-wedding-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Mendaftar...</span>
          </>
        ) : (
          "Daftar Baru"
        )}
      </button>
    </div>
  );
}
