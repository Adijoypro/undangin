"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, Variants } from "framer-motion";
import { InvitationData } from "@/data/invitations";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { submitRSVP } from "@/app/[slug]/actions";

export default function CinematicDarkTheme({ data }: { data: InvitationData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Smooth scroll progress
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

  const createCalendarLink = () => {
    const text = encodeURIComponent(`Pernikahan ${data.bride.name} & ${data.groom.name}`);
    const details = encodeURIComponent(`Acara pernikahan ${data.bride.fullName} dan ${data.groom.fullName}.`);
    const location = encodeURIComponent(data.event.locationAddress);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
  };

  // Parallax transforms for Hero
  const heroY = useTransform(smoothProgress, [0, 0.2], ["0%", "40%"]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 1.1]);

  // Parallax for Profile Photos
  const leftPhotoY = useTransform(smoothProgress, [0.1, 0.4], ["100px", "-50px"]);
  const rightPhotoY = useTransform(smoothProgress, [0.1, 0.4], ["200px", "0px"]);

  // Mouse position for Spotlight effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showToast, setShowToast] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Audio setup
  useEffect(() => {
    const audio = document.getElementById("cinematic-audio") as HTMLAudioElement;
    if (audio) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, []);

  const toggleMusic = () => {
    const audio = document.getElementById("cinematic-audio") as HTMLAudioElement;
    if (audio) {
      if (audio.paused) {
        audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRSVP = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.append("invitation_id", data.id);
    formData.append("slug", data.slug);
    
    const result = await submitRSVP(formData);
    
    setIsSubmitting(false);
    if (result.success) {
      alert("Terima kasih atas doa dan kehadiran Anda!");
      (document.getElementById("rsvp-form") as HTMLFormElement).reset();
    } else {
      alert("Gagal mengirim pesan, silakan coba lagi.");
    }
  };

  // Fade Up Animation Variant
  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] } }
  };

  return (
    <div 
      ref={containerRef} 
      className="bg-[#050505] text-white min-h-screen font-sans selection:bg-white/30 overflow-x-hidden relative pb-32"
    >
      {/* Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {data.couplePhoto && (
          <img src={data.couplePhoto} className="w-full h-full object-cover opacity-[0.15] grayscale mix-blend-luminosity" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
      </div>
      {/* Dynamic Spotlight Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.04), transparent 80%)`
        }}
      />

      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      {/* Audio Element */}
      <audio id="cinematic-audio" loop preload="auto">
          <source src={data.musicUrl} type="audio/mpeg" />
      </audio>

      {/* Floating Controls */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 items-end">
        <a 
          href={`https://wa.me/?text=${encodeURIComponent(`Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBuka undangan digital: https://undangin.com/${data.slug}`)}`}
          target="_blank"
          className="bg-black/50 backdrop-blur-md border border-white/20 p-4 rounded-full text-white hover:bg-white hover:text-black transition-all duration-500 overflow-hidden group flex items-center justify-center w-[54px] h-[54px] hover:w-auto"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span className="font-sans text-[10px] uppercase tracking-widest font-bold max-w-0 overflow-hidden opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-500 whitespace-nowrap">
              RSVP WA
            </span>
          </div>
        </a>
        <button onClick={toggleMusic} className="bg-black/50 backdrop-blur-md border border-white/20 p-4 rounded-full text-white hover:bg-white hover:text-black transition-all duration-500 overflow-hidden group flex items-center justify-center w-[54px] h-[54px] hover:w-auto">
            <div className="flex items-center gap-2">
              <svg className={`w-5 h-5 shrink-0 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span className="font-sans text-[10px] uppercase tracking-widest font-bold max-w-0 overflow-hidden opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-500 whitespace-nowrap">
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </span>
            </div>
        </button>
      </div>

      {/* 1. HERO SECTION */}
      <motion.section 
        className="h-screen flex flex-col items-center justify-center relative z-10"
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      >
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-sans uppercase tracking-[0.6em] text-xs text-gray-400 mb-8"
        >
          The Wedding Celebration
        </motion.p>
        
        <div className="overflow-hidden">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.8 }}
            className="font-serif text-7xl md:text-9xl font-bold tracking-tighter"
          >
            {data.bride.name}
          </motion.h1>
        </div>
        
        <motion.span 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="font-script text-5xl md:text-7xl text-gray-500 my-4"
        >
          &
        </motion.span>
        
        <div className="overflow-hidden">
          <motion.h1 
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.8 }}
            className="font-serif text-7xl md:text-9xl font-bold tracking-tighter"
          >
            {data.groom.name}
          </motion.h1>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="absolute bottom-12 flex flex-col items-center"
        >
          <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">Scroll to Explore</span>
          <div className="w-px h-16 bg-gradient-to-b from-gray-500 to-transparent animate-pulse"></div>
        </motion.div>
      </motion.section>

      {/* 2. QUOTE SECTION */}
      <section className="py-32 px-4 relative z-10 flex items-center justify-center min-h-[50vh]">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="font-serif italic text-2xl md:text-4xl text-gray-300 leading-relaxed tracking-wide">
            "{data.quote}"
          </p>
        </motion.div>
      </section>

      {/* 3. PROFILES */}
      <section className="min-h-screen relative z-10 flex items-center px-4 py-32 max-w-6xl mx-auto">
        <div className="w-full grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          
          {/* BRIDE */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="relative"
          >
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto group">
              {/* Decorative Arch Frame */}
              <div className="absolute -inset-4 border border-white/10 rounded-t-full pointer-events-none group-hover:border-white/30 transition-colors duration-700"></div>
              <div className="w-full h-full overflow-hidden rounded-t-full border border-white/20">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 1.5 }}
                  src={data.bride.photo} 
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000" 
                  alt={data.bride.name} 
                />
              </div>
              <div className="mt-8 text-center">
                <h3 className="font-serif text-3xl md:text-5xl mb-2 tracking-tight text-white">{data.bride.name}</h3>
                <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-4 font-bold">Mempelai Wanita</p>
                <div className="w-10 h-px bg-white/20 mx-auto mb-4"></div>
                <p className="font-serif italic text-gray-400 text-sm leading-relaxed">{data.bride.parents}</p>
              </div>
            </div>
          </motion.div>

          {/* GROOM */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="relative md:mt-32"
          >
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto group">
              {/* Decorative Arch Frame */}
              <div className="absolute -inset-4 border border-white/10 rounded-t-full pointer-events-none group-hover:border-white/30 transition-colors duration-700"></div>
              <div className="w-full h-full overflow-hidden rounded-t-full border border-white/20">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 1.5 }}
                  src={data.groom.photo} 
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000" 
                  alt={data.groom.name} 
                />
              </div>
              <div className="mt-8 text-center">
                <h3 className="font-serif text-3xl md:text-5xl mb-2 tracking-tight text-white">{data.groom.name}</h3>
                <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-4 font-bold">Mempelai Pria</p>
                <div className="w-10 h-px bg-white/20 mx-auto mb-4"></div>
                <p className="font-serif italic text-gray-400 text-sm leading-relaxed">{data.groom.parents}</p>
              </div>
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* 4. LOVE STORY (Timeline) */}
      <section className="py-32 px-4 relative z-10 border-t border-white/5 bg-[#080808]">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
            className="text-center mb-24"
          >
            <h3 className="font-serif text-5xl md:text-6xl text-white mb-4">Our Story</h3>
            <div className="w-20 h-px bg-white/20 mx-auto"></div>
          </motion.div>

          <div className="space-y-16 font-sans font-light text-gray-400 leading-relaxed relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block"></div>
            
            {data.loveStory.map((story, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="relative flex flex-col md:flex-row md:justify-between items-center w-full group"
              >
                <div className={`md:w-[45%] ${i % 2 === 0 ? 'md:text-right pr-0 md:pr-12' : 'order-last pl-0 md:pl-12 md:text-left'} mb-4 md:mb-0`}>
                  {i % 2 !== 0 && <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-white/40 rounded-full -translate-x-1.5 shadow-[0_0_15px_rgba(255,255,255,0.5)] hidden md:block group-hover:bg-white transition-colors duration-500"></div>}
                  <p className="group-hover:text-white transition-colors duration-500">{story}</p>
                </div>
                {i % 2 === 0 && <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-white/40 rounded-full -translate-x-1.5 shadow-[0_0_15px_rgba(255,255,255,0.5)] hidden md:block group-hover:bg-white transition-colors duration-500"></div>}
                <div className={`md:w-[45%] ${i % 2 === 0 ? 'pl-0 md:pl-12' : 'pr-0 md:pr-12'}`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EVENT DETAILS */}
      <section className="min-h-[80vh] relative z-10 flex items-center justify-center px-4 py-32 border-t border-white/5">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
          className="text-center max-w-2xl bg-white/5 backdrop-blur-md p-16 rounded-3xl border border-white/10"
        >
          <h2 className="font-serif text-4xl md:text-5xl mb-8 tracking-tight">The Celebration</h2>
          <div className="w-12 h-px bg-white/30 mx-auto mb-12"></div>
          
          <div className="space-y-6 text-gray-300">
            <p className="font-sans text-xl uppercase tracking-[0.3em] font-light text-white">{data.event.date}</p>
            <p className="font-serif text-3xl">{data.event.time}</p>
            
            <div className="pt-8 pb-4 w-full flex justify-center">
              <CountdownTimer targetDate={data.event.date} theme="cinematic" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl text-white/90">{data.event.locationName}</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">{data.event.locationAddress}</p>
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={data.event.mapsLink} target="_blank" className="inline-block px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors w-full sm:w-auto text-center">
                  Google Maps
                </a>
                <a href={createCalendarLink()} target="_blank" className="inline-block px-8 py-3 bg-transparent border border-white text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors w-full sm:w-auto text-center">
                  Simpan Kalender
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 6. WEDDING GIFT */}
      <section className="py-32 px-4 relative z-10 bg-[#080808] border-t border-white/5">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
          className="max-w-2xl mx-auto text-center"
        >
          <h3 className="font-serif text-5xl mb-6">Wedding Gift</h3>
          <p className="font-sans font-light text-gray-400 mb-12 leading-relaxed text-sm max-w-md mx-auto">
            Kehadiran Anda adalah anugerah terbesar. Namun, apabila Anda ingin memberikan tanda kasih, Anda dapat mengirimkannya melalui rekening berikut:
          </p>
          
          <div className="bg-[#0f0f0f] p-10 rounded-xl border border-white/10 max-w-sm mx-auto group hover:border-white/30 transition-colors duration-500">
            <p className="font-sans font-bold uppercase tracking-widest text-gray-500 text-xs mb-4">{data.gift.bankName}</p>
            <p className="font-serif text-4xl mb-2 tracking-widest text-white">{data.gift.accountNumber}</p>
            <p className="text-sm font-sans font-light text-gray-400 mb-8">{data.gift.accountName}</p>
            
            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => handleCopy(data.gift.accountNumber)} 
              className="px-6 py-3 border border-white/20 text-white rounded-sm hover:bg-white hover:text-black transition-colors text-xs font-bold uppercase tracking-widest w-full"
            >
              Salin Rekening
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* 7. RSVP FORM & GUESTBOOK */}
      <section className="py-32 px-4 relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
            className="text-center md:text-left"
          >
            <h3 className="font-serif text-4xl mb-4 uppercase tracking-widest">RSVP</h3>
            <p className="font-sans font-light text-gray-400 mb-12 text-sm">Berikan doa dan konfirmasi kehadiran Anda.</p>
            
            <form id="rsvp-form" action={handleRSVP} className="space-y-6 text-left">
                <div>
                    <input type="text" name="name" required placeholder="NAMA LENGKAP" className="w-full bg-transparent border-b border-white/20 py-4 font-sans text-xs uppercase tracking-widest focus:border-white focus:outline-none transition-colors text-white placeholder:text-gray-600"/>
                </div>
                <div>
                    <select name="attendance" className="w-full bg-transparent border-b border-white/20 py-4 font-sans text-xs uppercase tracking-widest focus:border-white focus:outline-none transition-colors text-gray-300 appearance-none">
                        <option value="Hadir" className="bg-[#050505] text-white">AKAN HADIR</option>
                        <option value="Tidak Hadir" className="bg-[#050505] text-white">MAAF, TIDAK BISA HADIR</option>
                    </select>
                </div>
                <div>
                    <textarea name="message" rows={4} required placeholder="UCAPAN & DOA" className="w-full bg-transparent border-b border-white/20 py-4 font-sans text-xs uppercase tracking-widest focus:border-white focus:outline-none transition-colors text-white placeholder:text-gray-600 resize-none"></textarea>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-5 mt-4 bg-white text-black font-sans font-bold uppercase tracking-[0.3em] text-xs disabled:opacity-50"
                >
                    {isSubmitting ? "MENGIRIM..." : "KIRIM PESAN"}
                </motion.button>
            </form>
          </motion.div>

          {/* GUESTBOOK DISPLAY */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
            className="border-t md:border-t-0 md:border-l border-white/10 pt-16 md:pt-0 md:pl-16 flex flex-col h-full"
          >
            <h3 className="font-serif text-3xl mb-8 uppercase tracking-widest">Buku Tamu ({data.guestbook?.length || 0})</h3>
            <div className="flex-1 max-h-[500px] overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {data.guestbook && data.guestbook.length > 0 ? (
                data.guestbook.map((guest, idx) => (
                  <div key={idx} className="bg-white/5 p-6 rounded-sm border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-sans font-bold uppercase tracking-widest text-xs">{guest.name}</span>
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm ${guest.attendance === 'Hadir' ? 'bg-green-900/30 text-green-400 border border-green-500/20' : 'bg-red-900/30 text-red-400 border border-red-500/20'}`}>
                        {guest.attendance}
                      </span>
                    </div>
                    <p className="font-sans font-light text-gray-400 text-sm leading-relaxed">{guest.message}</p>
                    <p className="font-sans text-[10px] text-gray-600 mt-4 uppercase tracking-widest">
                      {new Date(guest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic font-light">Belum ada pesan. Jadilah yang pertama memberikan doa restu.</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-32 text-center text-white relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}>
            <h2 className="font-script text-6xl md:text-8xl mb-8 text-white/80">{data.bride.name} & {data.groom.name}</h2>
            <p className="font-sans text-[10px] uppercase tracking-widest text-gray-600 border-t border-white/10 pt-8 inline-block">Theme by Undangin Platform</p>
          </motion.div>
      </footer>

      {/* TOAST */}
      <div className={`fixed z-[9999] top-10 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
          <span>Tersalin ke clipboard</span>
      </div>

    </div>
  );
}
