"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LoginButtons from "./LoginButtons";
import { motion } from "framer-motion";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#FDFBF7] dark:bg-slate-950 px-4 transition-colors duration-1000">
      {/* LUXURY BACKGROUND ELEMENTS - CLEANER VERSION */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-black/5 dark:border-white/5 relative overflow-hidden">
          
          {/* ORNAMENTAL ACCENT */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>

          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-6 group">
              <img src="/logo.png" alt="Undangin Logo" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-500" />
            </Link>
            <h1 className="font-serif text-4xl text-[#111111] dark:text-white mb-3 tracking-tight font-bold">
              Selamat Datang
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide">
              Masuk ke dasbor eksklusif Undangin
            </p>
          </div>

          {message && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-2xl text-center font-bold"
            >
              {message === "Could not authenticate user" ? "Email atau password salah." : message}
            </motion.div>
          )}

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111111]/40 dark:text-gray-500 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <input 
                  name="email"
                  type="email" 
                  placeholder="your@email.com" 
                  className="w-full bg-gray-50 dark:bg-slate-800/50 px-5 py-4 rounded-2xl border border-gray-100 dark:border-white/5 focus:border-[#D4AF37] dark:focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all duration-300 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111111]/40 dark:text-gray-500">
                  Secure Password
                </label>
                <Link href="#" className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest hover:underline">
                  Lupa Password?
                </Link>
              </div>
              <div className="relative group">
                <input 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-gray-50 dark:bg-slate-800/50 px-5 py-4 rounded-2xl border border-gray-100 dark:border-white/5 focus:border-[#D4AF37] dark:focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all duration-300 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  required
                />
              </div>
            </div>
            
            <div className="pt-2">
              <LoginButtons />
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Butuh bantuan? <Link href="https://wa.me/628123456789" className="text-[#D4AF37] font-bold hover:underline">Hubangi Admin</Link>
            </p>
          </div>
        </div>

        {/* BOTTOM DECORATION */}
        <p className="text-center mt-8 text-[10px] text-gray-400 dark:text-gray-600 font-bold uppercase tracking-[0.4em]">
          &copy; 2026 Undangin Premium Platform
        </p>
      </motion.div>
    </div>
  );
}
