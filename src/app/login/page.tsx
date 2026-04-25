"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LoginButtons from "./LoginButtons";
import { motion } from "framer-motion";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-wedding-base dark:bg-slate-950 px-4">
      {/* LUXURY BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-wedding-gold/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-wedding-gold/5 blur-[120px] rounded-full"></div>
        <div className="paper-texture"></div>
        <div className="dust-container">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="dust"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`
              }}
            />
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-2xl border border-white/20 dark:border-white/5 relative overflow-hidden">
          
          {/* TOP ORNAMENT */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-wedding-gold/30 to-transparent"></div>

          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-6 group">
              <div className="w-16 h-16 bg-wedding-base dark:bg-slate-800 rounded-2xl shadow-inner border border-wedding-gold/20 flex items-center justify-center text-wedding-gold font-serif text-3xl font-bold group-hover:scale-110 transition-transform duration-500">
                U
              </div>
            </Link>
            <h1 className="font-serif text-4xl text-wedding-text dark:text-white mb-3 tracking-tight">
              Selamat <span className="italic font-normal">Datang</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide">
              Masuk ke dasbor eksklusif Undangin
            </p>
          </div>

          {message && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 p-4 bg-red-50/50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-2xl text-center font-bold"
            >
              {message === "Could not authenticate user" ? "Email atau password salah." : message}
            </motion.div>
          )}

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <input 
                  name="email"
                  type="email" 
                  placeholder="your@email.com" 
                  className="w-full bg-white/50 dark:bg-slate-800/50 px-5 py-4 rounded-2xl border border-gray-100 dark:border-white/5 focus:border-wedding-gold dark:focus:border-wedding-gold focus:ring-4 focus:ring-wedding-gold/10 outline-none transition-all duration-300 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                  Secure Password
                </label>
                <Link href="#" className="text-[9px] font-bold text-wedding-gold uppercase tracking-widest hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <input 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-white/50 dark:bg-slate-800/50 px-5 py-4 rounded-2xl border border-gray-100 dark:border-white/5 focus:border-wedding-gold dark:focus:border-wedding-gold focus:ring-4 focus:ring-wedding-gold/10 outline-none transition-all duration-300 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
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
              Butuh bantuan? <Link href="https://wa.me/628123456789" className="text-wedding-gold font-bold hover:underline">Hubungi Admin</Link>
            </p>
          </div>
        </div>

        {/* BOTTOM DECORATION */}
        <p className="text-center mt-8 text-[10px] text-gray-400 dark:text-gray-600 font-bold uppercase tracking-[0.4em]">
          &copy; 2026 Undangin Premium
        </p>
      </motion.div>
    </div>
  );
}
