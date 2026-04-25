"use client";

import { useFormStatus } from "react-dom";
import { login, signup } from "./actions";
import { motion } from "framer-motion";

export default function LoginButtons() {
  const { pending, action } = useFormStatus();

  const isLogin = pending && action?.toString().includes("login");
  const isSignup = pending && action?.toString().includes("signup");

  return (
    <div className="flex flex-col gap-4">
      <motion.button 
        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(212, 175, 55, 0.3)" }}
        whileTap={{ scale: 0.98 }}
        formAction={login} 
        disabled={pending}
        className={`w-full py-5 rounded-2xl font-black transition-all uppercase tracking-[0.3em] text-[10px] relative overflow-hidden group ${
          pending 
            ? "bg-gray-800 cursor-not-allowed text-gray-500" 
            : "bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black shadow-xl"
        }`}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        
        {isLogin ? (
          <div className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Verifying Access</span>
          </div>
        ) : (
          "Authentic Access"
        )}
      </motion.button>

      <motion.button 
        whileHover={{ backgroundColor: "rgba(212, 175, 55, 0.05)" }}
        whileTap={{ scale: 0.98 }}
        formAction={signup} 
        disabled={pending}
        className={`w-full py-5 border rounded-2xl font-black transition-all uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-2 ${
          pending
            ? "border-white/5 text-gray-600 cursor-not-allowed"
            : "border-[#D4AF37]/30 text-[#D4AF37] hover:border-[#D4AF37]"
        }`}
      >
        {isSignup ? (
          <div className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-4 w-4 text-[#D4AF37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Creating Identity</span>
          </div>
        ) : (
          "Register Account"
        )}
      </motion.button>
    </div>
  );
}
