"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function LandingNavbar({ user }: { user: any }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  const navVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="fixed w-full z-50 bg-wedding-base/70 backdrop-blur-xl border-b border-wedding-gold/10 transform-gpu transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02] active:scale-95">
            <Image src="/logo.webp" alt="Undangin Logo" width={40} height={40} priority className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-serif text-2xl font-bold tracking-widest text-wedding-text group-hover:text-wedding-gold transition-colors duration-300">Undangin</span>
          </Link>
          
          <div className="hidden md:flex space-x-6 items-center">
            <a href="#fitur" className="text-xs font-bold uppercase tracking-widest text-wedding-text/60 hover:text-wedding-gold transition-colors">Fitur</a>
            <Link href="/katalog" className="text-xs font-bold uppercase tracking-widest text-wedding-text/60 hover:text-wedding-gold transition-colors">Katalog</Link>
 
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-2.5 rounded-xl border border-wedding-gold/20 hover:border-wedding-gold/50 bg-wedding-base/40 text-wedding-gold transition-all hover:scale-105 active:scale-95"
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            <Link 
              href={user ? "/dashboard" : "/login"}
              className="px-8 py-3.5 bg-wedding-gold text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-wedding-gold/20 hover:scale-[1.05] active:scale-95 transition-all"
            >
              {user ? "Lanjut ke Dasbor" : "Mulai Sekarang"}
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-2 rounded-xl border border-wedding-gold/20 bg-wedding-base/40 text-wedding-gold transition-all"
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            )}

            <Link href={user ? "/dashboard" : "/login"} className="px-6 py-2.5 bg-wedding-gold text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-wedding-gold/20">
              {user ? "Dasbor" : "Mulai"}
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
