"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/image";
import { Sparkles, Camera, Zap, ChevronRight } from "lucide-react";

export default function AITeaser() {
  return (
    <section className="py-24 lg:py-32 px-4 relative overflow-hidden bg-white dark:bg-wedding-base transition-colors duration-500">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-wedding-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-wedding-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Visual */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-[3rem] overflow-hidden border border-wedding-gold/20 shadow-2xl aspect-[4/5] md:aspect-square lg:aspect-[4/5] group">
              <Image 
                src="/assets/branding/final/ai_prewedding_comparison.webp"
                alt="AI Prewedding Comparison"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Before/After Labels Overlay */}
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute top-6 left-6 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/70">Before</span>
                </div>
                <div className="absolute top-6 right-6 px-3 py-1 bg-wedding-gold/60 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-[8px] font-black uppercase tracking-widest text-black font-bold">After AI</span>
                </div>
              </div>

              {/* Overlay Text */}
              <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-end">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-wedding-gold uppercase tracking-[0.3em]">AI Comparison</p>
                    <p className="text-xl font-serif text-white">Daily Photo to Luxury Portrait</p>
                 </div>
              </div>
            </div>

            {/* Floating Brain Asset - Shrunk to be more subtle */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 -top-16 lg:-right-12 lg:-top-28 w-32 h-32 lg:w-64 lg:h-64 pointer-events-none drop-shadow-2xl z-20"
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

          {/* Right: Content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wedding-gold/10 border border-wedding-gold/20 text-wedding-gold text-[10px] font-black uppercase tracking-[0.3em]">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Coming Soon
              </div>
              
              <h2 className="text-4xl md:text-6xl font-serif text-wedding-text leading-tight">
                Keajaiban AI dalam <br/>
                <span className="text-wedding-gold">Genggaman Anda.</span>
              </h2>
              
              <p className="text-lg text-wedding-text/60 font-light leading-relaxed">
                Nggak perlu lagi pusing soal biaya Prewedding. Cukup upload foto selfie harian kamu, dan biarkan AI kami mengubahnya menjadi foto pernikahan kelas dunia dengan latar belakang destinasi impian.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-wedding-gold/10 rounded-xl flex items-center justify-center text-wedding-gold shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-wedding-text">Pro Lighting</h4>
                  <p className="text-xs text-wedding-text/40">Pencahayaan cinematic otomatis.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-wedding-gold/10 rounded-xl flex items-center justify-center text-wedding-gold shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-wedding-text">Instant Result</h4>
                  <p className="text-xs text-wedding-text/40">Hasil render kurang dari 30 detik.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a href="/login" className="inline-flex items-center gap-3 px-8 py-4 bg-wedding-text text-wedding-base rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl group">
                Mulai Buat Undangan
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
