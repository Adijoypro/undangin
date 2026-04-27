"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/app/login/actions";
import Link from "next/link";

interface UserProfileProps {
  user: any;
}

export default function UserProfile({ user }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const metadata = user?.user_metadata;
  const avatarUrl = metadata?.avatar_url || metadata?.picture;
  const fullName = metadata?.full_name || metadata?.name || user?.email?.split('@')[0];
  const email = user?.email;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-wedding-text/5 transition-all group"
      >
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-wedding-base shadow-sm group-hover:border-wedding-gold transition-all">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-wedding-gold flex items-center justify-center text-black font-bold text-sm">
              {fullName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest leading-none mb-1">Akun Saya</p>
          <p className="text-xs font-serif font-bold text-wedding-text leading-none truncate max-w-[100px]">
            {fullName}
          </p>
        </div>
        <svg 
          className={`w-4 h-4 text-wedding-text/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-64 bg-wedding-base rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-wedding-gold/10 overflow-hidden z-[60] transition-colors duration-500"
          >
            <div className="p-5 border-b border-wedding-gold/10 bg-wedding-text/[0.03]">
              <p className="text-[10px] font-bold text-wedding-gold uppercase tracking-[0.2em] mb-3">Profil Pengguna</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-wedding-base shadow-sm">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-wedding-gold flex items-center justify-center text-black font-bold text-lg">
                      {fullName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-serif font-bold text-wedding-text truncate">{fullName}</p>
                  <p className="text-[10px] text-wedding-text/40 truncate">{email}</p>
                </div>
              </div>
            </div>

            <div className="p-2 space-y-1">
              <Link
                href="/dashboard/topup"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-wedding-gold hover:bg-wedding-gold/10 rounded-xl transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-wedding-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-bold uppercase tracking-widest text-[10px]">Isi Kredit (Top Up)</span>
              </Link>

              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="font-bold uppercase tracking-widest text-[10px]">Keluar Aplikasi</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
