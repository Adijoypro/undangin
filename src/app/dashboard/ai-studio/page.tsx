"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Sparkles, Camera, MapPin, Shirt, Send, Zap, Brain, Copy, Check, MessageSquare, Quote, Heart } from "lucide-react";
import { toast } from "sonner";
import { aiPrompts, AIPrompt } from "@/data/ai-prompts";

type TabType = "copywriting" | "prewedding";

export default function AIStudioPage() {
  const [activeTab, setActiveTab] = useState<TabType>("prewedding");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // State for AI Copywriting
  const [selectedCategory, setSelectedCategory] = useState<AIPrompt["category"]>("quote");
  const [selectedStyle, setSelectedStyle] = useState<AIPrompt["style"] | "all">("all");

  const filteredPrompts = aiPrompts.filter(p => {
    const categoryMatch = p.category === selectedCategory;
    const styleMatch = selectedStyle === "all" || p.style === selectedStyle;
    return categoryMatch && styleMatch;
  });

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Berhasil terdaftar! Kamu akan jadi yang pertama mencoba keajaiban ini. ✨");
      setIsSubmitting(false);
      setEmail("");
    }, 1500);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Teks berhasil disalin!");
    setTimeout(() => setCopiedId(null), 2000);
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
            <h1 className="font-serif text-xl font-bold text-wedding-text">AI Studio</h1>
          </div>
          
          {/* TAB SELECTOR */}
          <div className="bg-wedding-base/60 p-1 rounded-xl border border-wedding-gold/20 flex items-center">
            <button 
              onClick={() => setActiveTab("copywriting")}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === "copywriting" ? 'bg-wedding-gold text-white shadow-lg' : 'text-wedding-text/40 hover:text-wedding-text'}`}
            >
              AI Copywriting
            </button>
            <button 
              onClick={() => setActiveTab("prewedding")}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === "prewedding" ? 'bg-wedding-gold text-white shadow-lg' : 'text-wedding-text/40 hover:text-wedding-text'}`}
            >
              AI Photo
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {activeTab === "copywriting" ? (
            <motion.div
              key="copywriting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Header Copywriting */}
              <div className="max-w-3xl">
                <span className="inline-block px-3 py-1 rounded-full bg-wedding-gold/10 text-wedding-gold text-[9px] font-black uppercase tracking-[0.3em] mb-4 border border-wedding-gold/20">
                  AI Content Generator
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-wedding-text mb-4">Ubah Ide Jadi <span className="text-wedding-gold">Kata-Kata Indah.</span></h2>
                <p className="text-wedding-text/60 font-light leading-relaxed">Pilih kategori dan gaya bahasa, biarkan AI kami merangkai kalimat terbaik untuk momen istimewa Anda.</p>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Categories & Styles */}
                <div className="w-full md:w-64 space-y-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-wedding-gold uppercase tracking-[0.2em]">Pilih Kategori</p>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => setSelectedCategory("quote")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${selectedCategory === "quote" ? 'bg-wedding-gold text-white border-wedding-gold shadow-lg' : 'bg-white/40 border-wedding-gold/10 text-wedding-text/60'}`}>
                        <Quote className="w-4 h-4" />
                        <span className="text-xs font-bold">Quotes / Ayat</span>
                      </button>
                      <button onClick={() => setSelectedCategory("love-story")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${selectedCategory === "love-story" ? 'bg-wedding-gold text-white border-wedding-gold shadow-lg' : 'bg-white/40 border-wedding-gold/10 text-wedding-text/60'}`}>
                        <Heart className="w-4 h-4" />
                        <span className="text-xs font-bold">Love Story</span>
                      </button>
                      <button onClick={() => setSelectedCategory("closing")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${selectedCategory === "closing" ? 'bg-wedding-gold text-white border-wedding-gold shadow-lg' : 'bg-white/40 border-wedding-gold/10 text-wedding-text/60'}`}>
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs font-bold">Kata Penutup</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-wedding-gold uppercase tracking-[0.2em]">Gaya Bahasa</p>
                    <div className="flex flex-wrap gap-2">
                      {["all", "religious-islam", "religious-kristen", "poetic", "modern", "traditional"].map((style) => (
                        <button 
                          key={style}
                          onClick={() => setSelectedStyle(style as any)}
                          className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${selectedStyle === style ? 'bg-wedding-text text-wedding-base border-wedding-text' : 'bg-white/20 border-wedding-gold/10 text-wedding-text/40'}`}
                        >
                          {style.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results Grid */}
                <div className="flex-1 grid gap-6">
                  {filteredPrompts.length > 0 ? (
                    filteredPrompts.map((prompt) => (
                      <motion.div 
                        key={prompt.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/40 dark:bg-wedding-base/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 dark:border-wedding-gold/20 shadow-xl group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-wedding-gold/5 rounded-full blur-2xl group-hover:bg-wedding-gold/10 transition-colors pointer-events-none" />
                        
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <span className="px-2.5 py-1 rounded-md bg-wedding-gold/10 text-wedding-gold text-[8px] font-black uppercase tracking-widest border border-wedding-gold/20 mb-2 inline-block">
                              {prompt.style.replace('-', ' ')}
                            </span>
                            <h4 className="font-serif text-xl font-bold text-wedding-text">{prompt.title}</h4>
                          </div>
                          <button 
                            onClick={() => handleCopy(prompt.content, prompt.id)}
                            className={`p-3 rounded-xl transition-all ${copiedId === prompt.id ? 'bg-green-500 text-white' : 'bg-wedding-base/60 text-wedding-gold hover:bg-wedding-gold hover:text-white border border-wedding-gold/20 shadow-md'}`}
                          >
                            {copiedId === prompt.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        
                        <blockquote className="text-sm md:text-base text-wedding-text/70 italic font-light leading-relaxed border-l-2 border-wedding-gold/20 pl-6 py-2">
                          "{prompt.content}"
                        </blockquote>

                        <div className="mt-8 flex items-center justify-end">
                           <button className="flex items-center gap-2 text-[9px] font-black text-wedding-gold uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all">
                             Gunakan di Undangan <Zap className="w-3 h-3 fill-wedding-gold" />
                           </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-center opacity-40">
                      <Brain className="w-12 h-12 mb-4" />
                      <p className="text-sm font-bold uppercase tracking-widest">Belum ada hasil untuk filter ini</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="prewedding"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
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
                  
                  <motion.h2 className="text-4xl md:text-6xl font-serif text-wedding-text leading-tight">
                    Punya Foto Biasa? <br/>
                    <span className="text-wedding-gold">Jadikan Luar Biasa.</span>
                  </motion.h2>
                  
                  <motion.p className="text-lg text-wedding-text/50 font-light leading-relaxed max-w-lg">
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
                <div className="bg-white/40 dark:bg-wedding-base/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/50 dark:border-wedding-gold/20 shadow-2xl relative overflow-hidden">
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
                </div>
              </div>

              {/* Right Side: Visual Comparison */}
              <div className="relative order-1 lg:order-2 px-4 lg:px-0">
                <div className="relative rounded-[2rem] lg:rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] aspect-[4/5] md:aspect-[4/5] group max-w-sm mx-auto lg:max-w-none">
                  <Image 
                    src="/assets/branding/final/ai_prewedding_comparison.webp"
                    alt="AI Transformation Comparison"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Universal Features (Optional, only show in prewedding for now) */}
        {activeTab === "prewedding" && (
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
        )}
      </main>
    </DashboardShell>
  );
}
