"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LoginButtons from "./LoginButtons";
import { motion } from "framer-motion";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A0A0A] px-4 py-20">
      
      {/* LUXURY AMBIANCE */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,#000_100%)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[120px] rounded-full opacity-50"></div>
        
        {/* Subtle Silk Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('/assets/silk-bg.png')] bg-repeat"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full relative z-10"
      >
        <div className="relative">
          {/* ORNAMENTAL FRAME */}
          <div className="absolute -inset-[1px] bg-gradient-to-b from-[#D4AF37]/50 via-[#D4AF37]/10 to-[#D4AF37]/40 rounded-[2.5rem] pointer-events-none"></div>
          
          <div className="bg-[#111111] p-10 md:p-14 rounded-[2.5rem] relative shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5">
            
            {/* TOP ORNAMENT */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-20">
              <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
              <div className="w-1.5 h-1.5 rotate-45 border border-[#D4AF37]"></div>
              <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
            </div>

            <div className="text-center mb-12 pt-4">
              <Link href="/" className="inline-block mb-8 relative group">
                <div className="absolute -inset-4 bg-[#D4AF37]/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img src="/logo.png" alt="Undangin" className="w-20 h-20 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
              </Link>
              
              <h1 className="font-serif text-4xl md:text-5xl text-white mb-4 tracking-tighter font-bold uppercase">
                Selamat <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#F3E5AB] to-[#D4AF37]">Datang</span>
              </h1>
              <p className="text-[#D4AF37]/50 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
                Exclusive Access
              </p>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent mx-auto"></div>
            </div>

            {message && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-10 p-4 bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] uppercase tracking-widest rounded-xl text-center font-bold"
              >
                {message === "Could not authenticate user" ? "Email atau password salah." : message}
              </motion.div>
            )}

            <form className="space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#D4AF37]/60 ml-2">
                  Identity / Email
                </label>
                <div className="relative group">
                  <div className="absolute -inset-px bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/20 to-[#D4AF37]/0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                  <input 
                    name="email"
                    type="email" 
                    placeholder="your@email.com" 
                    className="w-full bg-black/40 px-6 py-5 rounded-2xl border border-white/5 focus:border-[#D4AF37]/50 outline-none transition-all duration-500 text-white placeholder:text-white/10 text-sm relative z-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#D4AF37]/60">
                    Secure Code
                  </label>
                  <Link href="#" className="text-[8px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] hover:text-white transition-colors">
                    Reset?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-px bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/20 to-[#D4AF37]/0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                  <input 
                    name="password"
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-black/40 px-6 py-5 rounded-2xl border border-white/5 focus:border-[#D4AF37]/50 outline-none transition-all duration-500 text-white placeholder:text-white/10 text-sm relative z-10"
                    required
                  />
                </div>
              </div>
              
              <div className="pt-6 relative">
                <div className="absolute -top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                <LoginButtons />
              </div>
            </form>

            <div className="mt-12 text-center">
              <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-medium">
                Experiencing issues? <Link href="https://wa.me/628123456789" className="text-[#D4AF37] font-bold hover:underline">Private Support</Link>
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER DETAIL */}
        <div className="mt-12 flex items-center justify-center gap-6 opacity-30">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
          <p className="text-[9px] text-[#D4AF37] font-black uppercase tracking-[0.5em]">
            Undangin Elite
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
        </div>
      </motion.div>
    </div>
  );
}
