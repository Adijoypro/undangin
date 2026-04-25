"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LoginButtons from "./LoginButtons";
import { motion } from "framer-motion";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4 font-sans selection:bg-[#D4AF37] selection:text-black">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-black/5">
          
          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-6">
              <img src="/logo.png" alt="Undangin" className="w-12 h-12 object-contain mx-auto" />
            </Link>
            
            <h1 className="font-serif text-3xl text-[#111111] mb-2 font-bold tracking-tight">
              Masuk ke Dasbor
            </h1>
            <p className="text-gray-500 text-sm font-light">
              Kelola undangan digital Anda dengan mudah.
            </p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl text-center font-bold">
              {message === "Could not authenticate user" ? "Email atau password salah." : message}
            </div>
          )}

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                Email
              </label>
              <input 
                name="email"
                type="email" 
                placeholder="nama@email.com" 
                className="w-full bg-[#F9F9F9] px-5 py-4 rounded-xl border border-gray-100 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none transition-all text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Password
                </label>
                <Link href="#" className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest hover:underline">
                  Lupa?
                </Link>
              </div>
              <input 
                name="password"
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-[#F9F9F9] px-5 py-4 rounded-xl border border-gray-100 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none transition-all text-sm"
                required
              />
            </div>
            
            <div className="pt-4">
              <LoginButtons />
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-xs text-gray-400">
              Butuh bantuan? <Link href="https://wa.me/628123456789" className="text-[#D4AF37] font-bold hover:underline">Hubungi Admin</Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          &copy; 2026 Undangin Digital
        </p>
      </motion.div>
    </div>
  );
}
