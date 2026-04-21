"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const theme = {
    bg: isDark ? "bg-[#050505]" : "bg-[#FDFBF7]",
    navBg: isDark ? "bg-[#050505]/70" : "bg-[#FDFBF7]/70",
    text: isDark ? "text-white" : "text-[#111111]",
    textMuted: isDark ? "text-gray-400" : "text-gray-600",
    border: isDark ? "border-white/10" : "border-black/10",
    cardBg: isDark ? "bg-white/[0.02]" : "bg-black/[0.02]",
    cardHover: isDark ? "hover:bg-white/[0.05]" : "hover:bg-black/[0.05]",
    footerBg: isDark ? "bg-black" : "bg-[#F5F4EE]",
    buttonInverse: isDark ? "bg-white text-black hover:bg-gray-200" : "bg-[#111111] text-white hover:bg-black",
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans selection:bg-[#D4AF37] selection:text-black overflow-hidden transition-colors duration-1000`} ref={containerRef}>
      
      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed w-full z-50 ${theme.navBg} backdrop-blur-xl border-b ${theme.border} transition-colors duration-1000`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] rounded-full flex items-center justify-center text-black font-bold font-serif shadow-[0_0_15px_rgba(212,175,55,0.4)]">U</div>
              <span className="font-serif text-2xl font-bold tracking-widest">Undangin</span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#fitur" className={`text-xs font-bold uppercase tracking-widest ${theme.textMuted} hover:text-[#D4AF37] transition-colors`}>Fitur</a>
              <a href="#template" className={`text-xs font-bold uppercase tracking-widest ${theme.textMuted} hover:text-[#D4AF37] transition-colors`}>Tema</a>
              <Link href="/dashboard" className={`text-xs font-bold uppercase tracking-widest ${theme.textMuted} hover:text-[#D4AF37] transition-colors`}>Dasbor</Link>
              
              {/* Animated Dark/Light Mode Toggle */}
              <motion.button 
                onClick={() => setIsDark(!isDark)}
                className={`w-10 h-10 rounded-full flex items-center justify-center border ${theme.border} ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'} transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle Theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isDark ? "dark" : "light"}
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isDark ? (
                      <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                    ) : (
                      <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              <Link href="/login" className="bg-[#D4AF37] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#F3E5AB] transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]">Mulai</Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-32 px-4 min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full ${isDark ? 'bg-[#D4AF37]/10' : 'bg-[#D4AF37]/20'} blur-[80px] pointer-events-none transition-colors duration-1000 will-change-transform`}
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full ${isDark ? 'bg-white/5' : 'bg-[#D4AF37]/10'} blur-[60px] pointer-events-none transition-colors duration-1000 will-change-transform`}
        />
        
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <motion.div variants={fadeInUp} className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#D4AF37]/30 ${isDark ? 'bg-[#D4AF37]/5' : 'bg-white'} text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-10 backdrop-blur-md shadow-lg`}>
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_10px_#D4AF37]"></span>
            Platform SaaS Undangan Premium
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-8xl font-serif font-bold tracking-tight mb-8 leading-[1.1]">
            Undangan Digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] italic">Mahakarya</span>.
          </motion.h1>
          
          <motion.p variants={fadeInUp} className={`text-lg md:text-2xl ${theme.textMuted} mb-12 max-w-3xl mx-auto font-light leading-relaxed transition-colors duration-1000`}>
            Standar baru industri pernikahan. Desain sinematik eksklusif, animasi <span className={theme.text}>jaw-dropping</span>, dan manajemen tamu cerdas untuk menyempurnakan hari bahagia Anda.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-[#D4AF37] text-black font-bold hover:bg-[#F3E5AB] transition-all duration-500 text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              Buat Mahakarya
            </Link>
            <a href="#template" className={`w-full sm:w-auto px-10 py-5 border ${theme.border} font-bold hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-500 text-sm uppercase tracking-[0.2em] ${isDark ? 'bg-white/5' : 'bg-black/5'} backdrop-blur-sm`}>
              Lihat Demo
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* LUXURY FEATURES */}
      <section id="fitur" className={`py-32 px-4 relative border-t ${theme.border} transition-colors duration-1000`}>
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h2 className="font-serif text-5xl md:text-6xl mb-6">Kemewahan dalam Detail</h2>
            <p className={`${theme.textMuted} text-lg max-w-2xl mx-auto transition-colors duration-1000`}>Dirancang khusus untuk klien VVIP. Setiap piksel dipikirkan dengan presisi untuk memukau tamu undangan Anda.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Animasi Sinematik",
                desc: "Parallax scrolling halus, efek partikel cahaya, dan transisi Framer Motion setara produksi film layar lebar.",
                icon: "✨"
              },
              {
                title: "Manajemen RSVP Cerdas",
                desc: "Sistem pendataan kehadiran real-time yang terhubung langsung ke Dasbor pintar. Bebas repot merekap tamu.",
                icon: "📊"
              },
              {
                title: "Personalisasi Eksklusif",
                desc: "Unggah musik latar pilihan, foto galeri tanpa batas, dan buat undangan unik untuk setiap nama tamu.",
                icon: "🎵"
              }
            ].map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className={`p-10 rounded-2xl ${theme.cardBg} border ${theme.border} ${theme.cardHover} transition-all duration-500 group`}
              >
                <div className="text-4xl mb-8 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">{feat.icon}</div>
                <h3 className="font-serif text-2xl text-[#D4AF37] mb-4">{feat.title}</h3>
                <p className={`${theme.textMuted} leading-relaxed font-light transition-colors duration-1000`}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATES DEMO */}
      <section id="template" className={`py-32 px-4 border-t ${theme.border} relative overflow-hidden transition-colors duration-1000`}>
        <div className={`absolute inset-0 ${isDark ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]'} bg-[size:100px_100px] pointer-events-none [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]`}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6"
          >
            <div>
              <h2 className="font-serif text-5xl mb-4">Koleksi Eksklusif</h2>
              <p className={`${theme.textMuted} max-w-xl text-lg transition-colors duration-1000`}>Pilih dari mahakarya desain yang dibuat oleh seniman digital kelas atas.</p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* The VVIP Series */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group cursor-pointer block"
            >
              <div className="rounded-2xl overflow-hidden aspect-[9/16] bg-[#0A0A0A] relative border border-white/10 group-hover:border-[#D4AF37]/50 transition-all duration-700">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-20">
                    <p className="font-serif text-[#D4AF37] mb-4 text-sm italic tracking-widest">The VVIP Series</p>
                    <h3 className="font-script text-6xl text-white mb-8 drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-700">Ultra Luxury</h3>
                    <div className="px-8 py-3 bg-[#D4AF37] text-black rounded-full text-xs uppercase tracking-[0.2em] font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">Live Demo</div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <h4 className="font-serif text-2xl font-bold mb-2">Onyx & Rose Gold</h4>
                <p className={`text-sm ${theme.textMuted}`}>Mawar emas animasi, gelap yang megah.</p>
              </div>
            </motion.div>
            
            {/* The Dark Series */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group cursor-pointer block"
            >
              <div className="rounded-2xl overflow-hidden aspect-[9/16] bg-[#111] relative border border-white/10 group-hover:border-white/50 transition-all duration-700">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80 z-10"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-20">
                    <p className="font-serif text-gray-300 mb-4 text-sm italic tracking-widest">The Dark Series</p>
                    <h3 className="font-serif text-5xl text-white mb-8 font-light uppercase tracking-widest transform group-hover:scale-105 transition-transform duration-700">Cinematic</h3>
                    <div className="px-8 py-3 bg-white text-black rounded-full text-xs uppercase tracking-[0.2em] font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">Live Demo</div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <h4 className="font-serif text-2xl font-bold mb-2">Midnight Elegance</h4>
                <p className={`text-sm ${theme.textMuted}`}>Tipografi kuat dengan transisi mulus.</p>
              </div>
            </motion.div>

            {/* The Premium Series */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="group cursor-pointer block"
            >
              <div className="rounded-2xl overflow-hidden aspect-[9/16] bg-[#f5f5f0] relative border border-white/10 group-hover:border-[#9baca0] transition-all duration-700 shadow-[inset_0_0_50px_rgba(0,0,0,0.05)]">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-20">
                    <p className="font-serif text-[#9baca0] mb-4 text-sm italic tracking-widest">The Premium Series</p>
                    <h3 className="font-script text-6xl text-[#2c332e] mb-8 transform group-hover:scale-105 transition-transform duration-700">Ayu & Phinisi</h3>
                    <div className="px-8 py-3 bg-[#9baca0] text-white rounded-full text-xs uppercase tracking-[0.2em] font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">Live Demo</div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <h4 className="font-serif text-2xl font-bold mb-2">Sage Splendor</h4>
                <p className={`text-sm ${theme.textMuted}`}>Desain bersih dengan sentuhan warna alam.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="harga" className={`py-32 px-4 relative border-t ${theme.border} transition-colors duration-1000`}>
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="font-serif text-5xl md:text-6xl mb-6">Investasi Berkelas</h2>
            <p className={`${theme.textMuted} text-lg transition-colors duration-1000`}>Sistem kredit transparan tanpa biaya tersembunyi. Khusus untuk Anda yang menghargai kualitas.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`p-10 rounded-2xl border ${theme.border} ${theme.cardBg} ${theme.cardHover} transition-all duration-500`}
            >
              <h3 className="font-serif text-3xl mb-2">Starter</h3>
              <p className={`text-sm ${theme.textMuted} mb-10 transition-colors duration-1000`}>Sempurna untuk satu perayaan istimewa.</p>
              <div className="mb-10 flex items-baseline gap-2">
                <span className={`text-sm ${theme.textMuted} font-bold uppercase tracking-widest transition-colors duration-1000`}>Rp</span>
                <span className="text-5xl font-serif">150</span>
                <span className={theme.textMuted}>rb</span>
              </div>
              <ul className={`space-y-5 mb-10 text-sm ${theme.textMuted} transition-colors duration-1000`}>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> 1 Kredit Undangan</li>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> Semua Tema Premium</li>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> Custom Musik Latar</li>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> RSVP & Guestbook</li>
              </ul>
              <Link href="/login" className={`block text-center w-full py-4 border ${theme.border} font-bold text-xs uppercase tracking-[0.2em] ${theme.buttonInverse} transition-colors duration-500`}>Pilih Starter</Link>
            </motion.div>

            {/* WO PRO */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`p-10 rounded-2xl border border-[#D4AF37] ${isDark ? 'bg-gradient-to-b from-[#1a1500] to-black' : 'bg-gradient-to-b from-[#FFFDF5] to-white'} relative shadow-[0_0_50px_rgba(212,175,55,0.1)] transform md:-translate-y-4 transition-colors duration-1000`}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D4AF37] text-black px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em]">Rekomendasi</div>
              <h3 className="font-serif text-3xl mb-2 text-[#D4AF37]">WO Pro</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-10 transition-colors duration-1000`}>Lebih hemat untuk Wedding Organizer.</p>
              <div className="mb-10 flex items-baseline gap-2">
                <span className="text-sm text-[#D4AF37] font-bold uppercase tracking-widest">Rp</span>
                <span className="text-5xl font-serif text-[#D4AF37]">500</span>
                <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>rb</span>
              </div>
              <ul className={`space-y-5 mb-10 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-1000`}>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> 5 Kredit Undangan</li>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> Akses Tema Ultra Luxury</li>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> Analitik Dashboard</li>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> Prioritas Server (Cepat)</li>
              </ul>
              <Link href="/login" className={`block text-center w-full py-4 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-[0.2em] hover:opacity-80 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all`}>Mulai Pro</Link>
            </motion.div>

            {/* ENTERPRISE */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`p-10 rounded-2xl border ${theme.border} ${theme.cardBg} ${theme.cardHover} transition-all duration-500`}
            >
              <h3 className="font-serif text-3xl mb-2">Enterprise</h3>
              <p className={`text-sm ${theme.textMuted} mb-10 transition-colors duration-1000`}>Biro jodoh atau agensi besar.</p>
              <div className="mb-10 flex items-baseline gap-2">
                <span className={`text-sm ${theme.textMuted} font-bold uppercase tracking-widest transition-colors duration-1000`}>Rp</span>
                <span className="text-5xl font-serif">1.5</span>
                <span className={theme.textMuted}>Juta</span>
              </div>
              <ul className={`space-y-5 mb-10 text-sm ${theme.textMuted} transition-colors duration-1000`}>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> 20 Kredit Undangan</li>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> Harga Termurah</li>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> Request Tema Eksklusif</li>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> VIP Support 24/7</li>
              </ul>
              <Link href="/login" className={`block text-center w-full py-4 border ${theme.border} font-bold text-xs uppercase tracking-[0.2em] ${theme.buttonInverse} transition-colors duration-500`}>Hubungi Sales</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#D4AF37] opacity-10"></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] ${isDark ? 'bg-[#D4AF37]/20' : 'bg-[#D4AF37]/40'} blur-[150px] rounded-full pointer-events-none transition-colors duration-1000`}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl mb-8"
          >
            Siap Mengukir Sejarah?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-800'} mb-12 font-light transition-colors duration-1000`}
          >
            Buat mahakarya undangan digital Anda hari ini dan tinggalkan kesan mendalam bagi tamu undangan tercinta.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/login" className="inline-block px-12 py-6 bg-[#D4AF37] text-black font-bold hover:bg-white hover:text-black transition-all duration-500 text-sm uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(212,175,55,0.4)] hover:shadow-[0_0_80px_rgba(212,175,55,0.6)]">
              Mulai Eksplorasi
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER LUXURY */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className={`${theme.footerBg} pt-24 pb-12 px-4 border-t ${theme.border} transition-colors duration-1000 relative overflow-hidden`}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] rounded-full flex items-center justify-center text-black font-bold font-serif">U</div>
                <span className={`font-serif text-3xl font-bold tracking-widest ${isDark ? 'text-white' : 'text-black'}`}>Undangin</span>
              </div>
              <p className={`${theme.textMuted} max-w-sm font-light leading-relaxed mb-8`}>
                Kami percaya setiap kisah cinta layak diceritakan dengan cara yang paling elegan dan tidak terlupakan.
              </p>
            </div>
            
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-black'} mb-6`}>Platform</h4>
              <ul className={`space-y-4 text-sm ${theme.textMuted}`}>
                <li><a href="#fitur" className="hover:text-[#D4AF37] transition-colors">Fitur Premium</a></li>
                <li><a href="#template" className="hover:text-[#D4AF37] transition-colors">Koleksi Tema</a></li>
                <li><a href="#harga" className="hover:text-[#D4AF37] transition-colors">Sistem Kredit</a></li>
                <li><Link href="/login" className="hover:text-[#D4AF37] transition-colors">Sign In</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-black'} mb-6`}>Eksklusif</h4>
              <ul className={`space-y-4 text-sm ${theme.textMuted}`}>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Wedding Organizer Partner</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Custom Desain VIP</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Bantuan 24/7</a></li>
              </ul>
            </div>
          </div>
          
          {/* Huge Animated Marquee / Title */}
          <div className="py-12 border-y border-white/5 mb-12 overflow-hidden flex whitespace-nowrap">
            <motion.div 
              animate={{ x: [0, -1035] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
              className={`font-serif text-[10vw] font-bold opacity-10 tracking-widest ${isDark ? 'text-white' : 'text-black'} uppercase`}
            >
              Undangin • Premium SaaS • Undangin • Premium SaaS • 
            </motion.div>
          </div>

          <div className={`flex flex-col md:flex-row justify-between items-center gap-6 text-xs uppercase tracking-[0.2em] font-bold ${theme.textMuted}`}>
            <p>© 2026 Crafted for Elegance.</p>
            <div className="flex gap-8">
              <motion.a whileHover={{ y: -3, color: '#D4AF37' }} href="#" className="transition-colors">Instagram</motion.a>
              <motion.a whileHover={{ y: -3, color: '#D4AF37' }} href="#" className="transition-colors">TikTok</motion.a>
              <motion.a whileHover={{ y: -3, color: '#D4AF37' }} href="#" className="transition-colors">WhatsApp</motion.a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
