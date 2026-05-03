"use client";

import Link from "next/link";
import UserProfile from "./UserProfile";
import { Sparkles, Zap } from "lucide-react";

interface DashboardNavbarProps {
  user: any;
  credits: number;
}

export default function DashboardNavbar({ user, credits }: DashboardNavbarProps) {
  return (
    <header className="bg-white/40 dark:bg-wedding-base/40 border-b border-white/50 dark:border-wedding-gold/20 backdrop-blur-2xl sticky top-0 z-50 transition-colors duration-500 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.webp" alt="Logo" className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform" />
            <span className="font-serif font-bold text-lg md:text-xl text-wedding-text group-hover:text-wedding-gold transition-colors truncate max-w-[100px] md:max-w-none">Undangin</span>
          </Link>

          {/* MAIN NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/dashboard/ai-studio" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-wedding-text/60 hover:text-wedding-gold transition-all group/nav">
              AI Studio
              <Sparkles className="w-3.5 h-3.5 text-wedding-gold group-hover/nav:animate-bounce" />
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {/* MOBILE AI LINK */}
          <Link href="/dashboard/ai-studio" className="lg:hidden w-10 h-10 rounded-full bg-wedding-gold/10 flex items-center justify-center text-wedding-gold border border-wedding-gold/20 active:scale-90 transition-all">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </Link>

          <div className="bg-wedding-gold/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-wedding-gold/30 flex items-center gap-1.5 md:gap-2">
            <div className="w-4 h-4 md:w-5 md:h-5 bg-wedding-gold rounded-full flex items-center justify-center text-black text-[8px] md:text-[10px] font-bold italic">B</div>
            <span className="font-serif font-bold text-wedding-gold text-xs md:text-sm whitespace-nowrap">{credits} <span className="hidden xs:inline">Kredit</span></span>
          </div>
          
          <Link href="/dashboard/topup" className="hidden sm:flex bg-wedding-text text-wedding-base hover:bg-wedding-gold hover:text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] px-3 py-1.5 md:px-6 md:py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-500 ease-out whitespace-nowrap active:scale-95">
            Top Up
          </Link>
          
          <UserProfile user={user} />
        </div>
      </div>
    </header>
  );
}
