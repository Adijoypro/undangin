"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const SHOWCASE_THEMES = [
  {
    id: "ultra-luxury",
    series: "The VVIP Series",
    title: "Ultra Luxury",
    name: "Onyx & Rose Gold",
    desc: "Mawar emas animasi, gelap yang megah.",
    bgClass: "bg-[#0A0A0A]",
    frameClass: "border-white/10 group-hover:border-[#D4AF37]/50 shadow-xl",
    gradientClass: "bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10",
    seriesColor: "text-[#D4AF37]",
    titleClass: "font-script text-6xl text-white drop-shadow-2xl",
    btnClass: "bg-[#D4AF37] text-black",
    iframeBg: "bg-black"
  },
  {
    id: "cinematic-dark",
    series: "The Dark Series",
    title: "Cinematic",
    name: "Midnight Elegance",
    desc: "Tipografi kuat dengan transisi mulus.",
    bgClass: "bg-[#111]",
    frameClass: "border-white/10 group-hover:border-white/50 shadow-xl",
    gradientClass: "bg-gradient-to-b from-transparent to-black opacity-80 z-10",
    seriesColor: "text-gray-300",
    titleClass: "font-serif text-5xl text-white font-light uppercase tracking-widest",
    btnClass: "bg-white text-black",
    iframeBg: "bg-black"
  },
  {
    id: "premium",
    series: "The Premium Series",
    title: "Green Minimalist",
    name: "Sage Splendor",
    desc: "Desain bersih dengan sentuhan warna alam.",
    bgClass: "bg-[#f5f5f0]",
    frameClass: "border-white/10 group-hover:border-[#9baca0] shadow-[inset_0_0_50px_rgba(0,0,0,0.05)]",
    gradientClass: "",
    seriesColor: "text-[#9baca0]",
    titleClass: "font-script text-6xl text-[#2c332e]",
    btnClass: "bg-[#9baca0] text-white",
    iframeBg: "bg-white"
  },
  {
    id: "renaissance-garden",
    series: "The Heritage Series",
    title: "Renaissance",
    name: "Renaissance Garden",
    desc: "Klasik Eropa dengan ornamen bunga vintage.",
    bgClass: "bg-[#F9F6F0]",
    frameClass: "border-[#D4AF37]/20 group-hover:border-[#D4AF37] shadow-xl",
    gradientClass: "bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-multiply z-0",
    extraGradient: "bg-gradient-to-b from-transparent via-[#F9F6F0]/40 to-[#F9F6F0] z-10",
    seriesColor: "text-[#7C8C77] uppercase",
    titleClass: "font-display text-5xl text-[#2B2B2B] font-bold",
    btnClass: "bg-[#7C8C77] text-white",
    iframeBg: "bg-[#F9F6F0]"
  },
  {
    id: "majestic-eternity",
    series: "The Royal Series",
    title: "Majestic Eternity",
    name: "Majestic Eternity",
    desc: "Kemegahan abadi dengan palet emerald & gold.",
    bgClass: "bg-[#0A1C14]",
    frameClass: "border-[#D4AF37]/20 group-hover:border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.15)]",
    gradientClass: "bg-gradient-to-b from-[#0A1C14] via-transparent to-[#0A1C14] z-10",
    seriesColor: "text-[#D4AF37] uppercase",
    titleClass: "font-script text-5xl text-white font-bold",
    btnClass: "bg-[#06120C] border border-[#D4AF37] text-[#D4AF37]",
    iframeBg: "bg-[#0A1C14]"
  }
];

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

          <div className="overflow-hidden w-full relative">
            <div className="flex gap-8 animate-marquee hover:[animation-play-state:paused] w-max py-8">
              {[...SHOWCASE_THEMES, ...SHOWCASE_THEMES].map((t, i) => (
                <div key={i} className="min-w-[85vw] sm:min-w-[400px] shrink-0 group block">
                  <div className={`rounded-2xl overflow-hidden aspect-[9/16] ${t.bgClass} relative border transition-all duration-700 ${t.frameClass}`}>
                    {t.gradientClass && <div className={`absolute inset-0 ${t.gradientClass}`}></div>}
                    {t.extraGradient && <div className={`absolute inset-0 ${t.extraGradient}`}></div>}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-20 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none">
                      <p className={`font-serif mb-4 text-sm italic tracking-widest ${t.seriesColor}`}>{t.series}</p>
                      <h3 className={`mb-8 transform group-hover:scale-105 transition-transform duration-700 ${t.titleClass}`}>{t.title}</h3>
                      <div className={`px-8 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-bold ${t.btnClass}`}>Arahkan untuk Demo</div>
                    </div>
                    {/* Live Demo Iframe */}
                    <iframe src={`/demo/${t.id}`} loading="lazy" className={`absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-30 border-none ${t.iframeBg}`}></iframe>
                  </div>
                  <div className="mt-8 text-center">
                    <h4 className="font-serif text-2xl font-bold mb-2">{t.name}</h4>
                    <p className={`text-sm ${theme.textMuted}`}>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </section>

      {/* WHY US - SaaS COMPETITIVE SECTION */}
      <section className={`py-32 px-4 transition-colors duration-1000`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Teknologi Mutakhir</span>
              <h2 className="font-serif text-5xl md:text-6xl mb-8 leading-tight">Lebih dari Sekadar Undangan Online.</h2>
              <p className={`text-lg ${theme.textMuted} mb-10 leading-relaxed transition-colors duration-1000`}>
                Kami membangun ekosistem digital untuk hari pernikahan Anda. Dari manajemen tamu hingga pengingat otomatis, semua dirancang untuk mengurangi beban kerja Anda.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "RSVP & Guest Management", desc: "Pantau kehadiran tamu secara real-time dari dashboard eksklusif Anda." },
                  { title: "Smart RSVP via WhatsApp", desc: "Konfirmasi kehadiran otomatis yang terintegrasi langsung dengan WA." },
                  { title: "QR Code Check-in", desc: "Sistem absensi tamu super cepat di lokasi acara. Profesional & modern." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] flex-shrink-0 mt-1">✓</div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className={`text-sm ${theme.textMuted}`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square md:aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" 
                className="w-full h-full object-cover grayscale-[20%] hover:scale-105 transition-transform duration-1000" 
                alt="Dashboard Preview"
              />
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl z-20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-bold">Dashboard Undangan</span>
                  <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">LIVE TRACKING</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "75%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="h-full bg-[#D4AF37]"
                  ></motion.div>
                </div>
                <p className="text-white/60 text-[10px] mt-2 italic">750 dari 1000 Tamu telah konfirmasi hadir</p>
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
            {/* Free Trial */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`p-10 rounded-2xl border ${theme.border} ${theme.cardBg} ${theme.cardHover} transition-all duration-500`}
            >
              <h3 className="font-serif text-3xl mb-2">Uji Coba</h3>
              <p className={`text-sm ${theme.textMuted} mb-10 transition-colors duration-1000`}>Buat draft undangan tanpa biaya.</p>
              <div className="mb-10 flex items-baseline gap-2">
                <span className={`text-sm ${theme.textMuted} font-bold uppercase tracking-widest transition-colors duration-1000`}>Rp</span>
                <span className="text-5xl font-serif">0</span>
              </div>
              <ul className={`space-y-5 mb-10 text-sm ${theme.textMuted} transition-colors duration-1000`}>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> Akses Semua Tema</li>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> Live Preview Editor</li>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> Draft Tidak Terbatas</li>
                <li className="flex items-center gap-4 opacity-50"><span className="text-gray-400">✧</span> Tidak Bisa Dipublikasi/Export</li>
              </ul>
              <Link href="/login" className={`block text-center w-full py-4 border ${theme.border} font-bold text-xs uppercase tracking-[0.2em] ${theme.buttonInverse} transition-colors duration-500`}>Coba Gratis</Link>
            </motion.div>

            {/* PREMIUM */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`p-10 rounded-2xl border border-[#D4AF37] ${isDark ? 'bg-gradient-to-b from-[#1a1500] to-black' : 'bg-gradient-to-b from-[#FFFDF5] to-white'} relative shadow-[0_0_50px_rgba(212,175,55,0.1)] transform md:-translate-y-4 transition-colors duration-1000`}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D4AF37] text-black px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em]">Paling Laris</div>
              <h3 className="font-serif text-3xl mb-2 text-[#D4AF37]">Premium</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-10 transition-colors duration-1000`}>Publikasi undangan & fitur lengkap.</p>
              <div className="mb-10 flex items-baseline gap-2">
                <span className="text-sm text-[#D4AF37] font-bold uppercase tracking-widest">Rp</span>
                <span className="text-5xl font-serif text-[#D4AF37]">99</span>
                <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>rb <span className="line-through text-xs ml-1">Rp 199.000</span></span>
              </div>
              <ul className={`space-y-5 mb-10 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-1000`}>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> 1 Kredit Publikasi / Export</li>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> Tanpa Watermark</li>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> Manajemen Tamu & RSVP</li>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> Custom Musik Latar</li>
              </ul>
              <Link href="/login" className={`block text-center w-full py-4 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-[0.2em] hover:opacity-80 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all`}>Aktifkan Premium</Link>
            </motion.div>

            {/* WO PRO / ENTERPRISE */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`p-10 rounded-2xl border ${theme.border} ${theme.cardBg} ${theme.cardHover} transition-all duration-500`}
            >
              <h3 className="font-serif text-3xl mb-2">WO / Agensi</h3>
              <p className={`text-sm ${theme.textMuted} mb-10 transition-colors duration-1000`}>Paket hemat untuk profesional.</p>
              <div className="mb-10 flex items-baseline gap-2">
                <span className={`text-sm ${theme.textMuted} font-bold uppercase tracking-widest transition-colors duration-1000`}>Rp</span>
                <span className="text-5xl font-serif">450</span>
                <span className={theme.textMuted}>rb</span>
              </div>
              <ul className={`space-y-5 mb-10 text-sm ${theme.textMuted} transition-colors duration-1000`}>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> 10 Kredit Publikasi</li>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> Harga Lebih Murah / Kredit</li>
                <li className="flex items-center gap-4"><span className="text-[#D4AF37]">✦</span> Prioritas Server (Cepat)</li>
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
