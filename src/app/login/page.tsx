"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LoginButtons from "./LoginButtons";
import SocialLogin from "./SocialLogin";
import { motion } from "framer-motion";

import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-wedding-base">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-gold"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen flex items-center justify-center bg-wedding-base text-wedding-text px-4 font-sans selection:bg-wedding-gold selection:text-black overflow-hidden relative transition-colors duration-500">
      
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-wedding-gold/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-wedding-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full relative z-10"
      >
        {/* Luxury Glass Card */}
        <div className="bg-white/40 dark:bg-black/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-wedding-gold/20 dark:border-wedding-gold/20 transition-all duration-500 relative overflow-hidden">
          
          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-6 hover:scale-105 transition-transform duration-300">
              <img src="/logo.png" alt="Undangin" className="w-12 h-12 object-contain mx-auto" />
            </Link>
            
            <h1 className="font-serif text-3xl text-wedding-text dark:text-white mb-2 font-bold tracking-tight">
              Akses <span className="text-wedding-gold">Dasbor</span>
            </h1>
            <p className="text-wedding-text/60 dark:text-white/60 text-sm font-light">
              Lanjutkan untuk merangkai mahakarya Anda.
            </p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-center font-bold">
              {message === "Could not authenticate user" ? "Email atau password salah." : message}
            </div>
          )}

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-wedding-gold/70 dark:text-wedding-gold ml-1">
                Alamat Email
              </label>
              <input 
                name="email"
                type="email" 
                placeholder="nama@email.com" 
                className="w-full bg-white/40 dark:bg-white/5 backdrop-blur-sm px-5 py-4 rounded-xl border border-wedding-gold/20 focus:border-wedding-gold focus:ring-4 focus:ring-wedding-gold/10 outline-none transition-all text-sm text-wedding-text dark:text-white shadow-inner placeholder:text-wedding-text/30"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-wedding-gold/70 dark:text-wedding-gold">
                  Kata Sandi
                </label>
                <Link href="#" className="text-[10px] font-bold text-wedding-gold uppercase tracking-widest hover:underline">
                  Lupa?
                </Link>
              </div>
              <input 
                name="password"
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-white/40 dark:bg-white/5 backdrop-blur-sm px-5 py-4 rounded-xl border border-wedding-gold/20 focus:border-wedding-gold focus:ring-4 focus:ring-wedding-gold/10 outline-none transition-all text-sm text-wedding-text dark:text-white shadow-inner placeholder:text-wedding-text/30"
                required
              />
            </div>
            
            <div className="pt-4">
              <LoginButtons />
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-wedding-gold/10 relative">
            <SocialLogin />
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-wedding-text/50 font-light">
              Butuh bantuan VVIP? <Link href="https://wa.me/628123456789" className="text-wedding-gold font-bold hover:underline">Hubungi Konsultan</Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] text-wedding-text/40 font-bold uppercase tracking-[0.2em]">
          &copy; 2026 Undangin Digital
        </p>
      </motion.div>
    </div>
  );
}
