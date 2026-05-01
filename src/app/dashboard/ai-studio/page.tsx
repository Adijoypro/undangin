"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Sparkles, Camera, MapPin, Shirt, Send, Zap, Brain } from "lucide-react";
import { toast } from "sonner";

export default function AIStudioPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Berhasil terdaftar! Kamu akan jadi yang pertama mencoba keajaiban ini. ✨");
      setIsSubmitting(false);
      setEmail("");
    }, 1500);
  };

  const features = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Pose & Lighting AI",
      desc: "Ubah pencahayaan kusam jadi golden hour yang cinematic."
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Virtual Destination",
      desc: "Pindah ke Bali, Paris, atau Cappadocia dalam sekejap."
    },
    {
      icon: <Shirt className="w-6 h-6" />,
      title: "Digital Outfits",
      desc: "Ganti kaos harianmu dengan Jas & Gaun pengantin mewah."
    }
  ];

  return (
    <DashboardShell>
      <header className="bg-white/40 dark:bg-wedding-base/40 border-b border-white/50 dark:border-wedding-gold/20 backdrop-blur-2xl sticky top-0 z-50 transition-colors duration-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white/40 dark:bg-wedding-text/10 backdrop-blur-md hover:bg-wedding-gold text-wedding-text hover:text-white transition-all flex items-center justify-center active:scale-90 border border-wedding-gold/20">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-serif text-xl font-bold text-wedding-text">AI Prewedding Studio</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Copy & CTA */}
          <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wedding-gold/10 border border-wedding-gold/20 text-wedding-gold text-[10px] font-black uppercase tracking-[0.3em]"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Next Generation Feature
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-serif text-wedding-text leading-tight"
              >
                Punya Foto Biasa? <br/>
                <span className="text-wedding-gold">Jadikan Luar Biasa.</span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-wedding-text/50 font-light leading-relaxed max-w-lg"
              >
                Lupakan biaya sewa fotografer dan lokasi mahal. AI Studio kami akan menyulap foto selfie harianmu menjadi potret prewedding profesional kelas dunia.
              </motion.p>
            </div>

            {/* Neural Progress */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-wedding-gold uppercase tracking-[0.2em]">Neural Network Training</span>
                <span className="text-xl font-serif text-wedding-text">89%</span>
              </div>
              <div className="h-2 bg-wedding-text/5 rounded-full overflow-hidden border border-wedding-text/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "89%" }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-wedding-gold to-white shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                />
              </div>
              <p className="text-[10px] text-wedding-text/40 italic">Mengoptimalkan tekstur kain dan pencahayaan sinematik...</p>
            </div>

            {/* CTA Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/40 dark:bg-wedding-base/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/50 dark:border-wedding-gold/20 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-wedding-gold/5 rounded-full blur-3xl pointer-events-none" />
              <h3 className="text-xl font-serif text-wedding-text mb-2">Ingin jadi yang pertama? ⚡</h3>
              <p className="text-xs text-wedding-text/40 mb-6 uppercase tracking-widest font-bold">Daftar waitlist untuk akses prioritas</p>
              
              <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email kamu..." 
                  required
                  className="flex-1 px-6 py-4 bg-wedding-base border border-wedding-gold/10 rounded-2xl outline-none focus:border-wedding-gold text-wedding-text transition-all shadow-inner"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-wedding-text text-wedding-base rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Mendaftar..." : "Join Waitlist"}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>

          {/* Right Side: Visual Comparison */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative order-1 lg:order-2 px-4 lg:px-0"
          >
            {/* Main Comparison Image - Compact on Mobile */}
            <div className="relative rounded-[2rem] lg:rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] aspect-[4/5] md:aspect-[4/5] group max-w-sm mx-auto lg:max-w-none">
              <Image 
                src="/assets/branding/final/ai_prewedding_comparison.webp"
                alt="AI Transformation Comparison"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Before/After Labels Overlay - More prominent for studio page */}
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute top-6 left-6 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/70">Casual Photo</span>
                </div>
                <div className="absolute top-6 right-6 px-3 py-1 bg-wedding-gold/60 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-[8px] font-black uppercase tracking-widest text-black font-bold">AI Wedding Render</span>
                </div>
              </div>

              {/* Labels - Smaller on Mobile */}
              <div className="absolute inset-x-0 bottom-0 p-4 lg:p-8 flex justify-between items-end">
                <div className="px-3 py-1.5 lg:px-4 lg:py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                  <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-white/40">Before</p>
                  <p className="text-xs lg:text-sm font-serif text-white">Daily Photo</p>
                </div>
                <div className="px-3 py-1.5 lg:px-4 lg:py-2 bg-wedding-gold/80 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl">
                  <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-black/40">After</p>
                  <p className="text-xs lg:text-sm font-serif text-black font-bold">AI Rendered</p>
                </div>
              </div>
            </div>

            {/* Floating Assets - Shrunk to be more subtle */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -right-8 -top-16 lg:-right-20 lg:-top-32 w-32 h-32 lg:w-64 lg:h-64 pointer-events-none z-20"
            >
              <Image 
                src="/assets/branding/final/ai_magic_wand_v2_white_bg_1777347671021.webp"
                alt="AI Magic Wand"
                width={400}
                height={400}
                className="object-contain rotate-[145deg] drop-shadow-[0_20px_40px_rgba(212,175,55,0.4)]"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <section className="mt-32 grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white/40 dark:bg-wedding-base/40 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-wedding-gold/10 hover:border-wedding-gold/40 transition-all group"
            >
              <div className="w-12 h-12 bg-wedding-gold/10 rounded-xl flex items-center justify-center text-wedding-gold mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h4 className="text-xl font-serif text-wedding-text mb-2">{f.title}</h4>
              <p className="text-sm text-wedding-text/40 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Footer Teaser - Compact on Mobile */}
        <div className="mt-16 lg:mt-32 text-center py-12 border-t border-wedding-gold/10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-wedding-gold fill-wedding-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-wedding-gold">Exclusive for Premium Users</p>
          </div>
          <p className="text-wedding-text/30 text-[10px] lg:text-xs italic">Akan segera hadir di dashboard utama kamu. Siapkan kenangan terbaikmu.</p>
        </div>
      </main>
    </DashboardShell>
  );
}
