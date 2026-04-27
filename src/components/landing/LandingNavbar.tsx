"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function LandingNavbar({ user }: { user: any }) {
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
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Undangin Logo" width={40} height={40} priority className="w-10 h-10 object-contain" />
            <span className="font-serif text-2xl font-bold tracking-widest text-wedding-text">Undangin</span>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#fitur" className="text-xs font-bold uppercase tracking-widest text-wedding-text/60 hover:text-wedding-gold transition-colors">Fitur</a>
            <a href="#template" className="text-xs font-bold uppercase tracking-widest text-wedding-text/60 hover:text-wedding-gold transition-colors">Tema</a>
            <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-wedding-text/60 hover:text-wedding-gold transition-colors">Dasbor</Link>
 
            <Link 
              href={user ? "/dashboard" : "/login"}
              className="px-10 py-4 bg-wedding-gold text-black rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#F3E5AB] transition-all shadow-lg"
            >
              {user ? "Lanjut ke Dasbor" : "Mulai Sekarang"}
            </Link>
          </div>

          <div className="md:hidden">
            <Link href={user ? "/dashboard" : "/login"} className="px-5 py-2 bg-wedding-gold text-black rounded-full font-bold text-[10px] uppercase tracking-widest">
              {user ? "Dasbor" : "Mulai"}
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
