"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, Variants, AnimatePresence } from "framer-motion";
import { InvitationData } from "@/data/invitations";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { submitRSVP } from "@/app/[slug]/actions";

export default function UltraLuxuryTheme({ data }: { data: InvitationData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const createCalendarLink = () => {
    const text = encodeURIComponent(`Pernikahan ${data.bride.name} & ${data.groom.name}`);
    const details = encodeURIComponent(`Acara pernikahan ${data.bride.fullName} dan ${data.groom.fullName}.`);
    const location = encodeURIComponent(data.event.locationAddress);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
  };

  // Smooth scroll
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { damping: 15, stiffness: 80 });

  // Parallax
  const heroY = useTransform(smoothProgress, [0, 0.3], ["0%", "50%"]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);


  const handleRSVP = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.append("invitation_id", data.id);
    formData.append("slug", data.slug);
    const result = await submitRSVP(formData);
    setIsSubmitting(false);
    if (result.success) {
      alert("Doa dan kehadiran Anda sangat berarti bagi kami.");
      (document.getElementById("rsvp-form") as HTMLFormElement).reset();
    } else {
      alert("Gagal mengirim, silakan coba lagi.");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Nomor rekening tersalin.");
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 60, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
  };

  const drawPath: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 3, ease: "easeInOut" } }
  };

  // Floating Petals / Gold Dust effect
  const FloatingDust = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D4AF37] rounded-full blur-[1px]"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0 
            }}
            animate={{ 
              y: ["-10%", "110%"],
              x: ["0%", (Math.random() - 0.5) * 20 + "%"],
              opacity: [0, 1, 1, 0],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 10 + Math.random() * 20, 
              repeat: Infinity, 
              delay: Math.random() * 10,
              ease: "linear"
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* CUSTOM CURSOR */}
      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 border border-[#D4AF37] rounded-full pointer-events-none z-[999] hidden md:block mix-blend-difference"
        animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
        transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
      />


      <div ref={containerRef} className={`bg-[#050505] text-white min-h-screen selection:bg-[#D4AF37]/30 selection:text-white font-serif overflow-hidden`}>
        


        {/* 1. HERO */}
        <motion.section 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative h-screen flex flex-col items-center justify-center pt-20 overflow-hidden"
        >
          {/* VVIP Background Asset */}
          <div className="absolute inset-0 z-0">
            <img src="/assets/marble-bg.png" className="w-full h-full object-cover opacity-25 mix-blend-overlay" />
            {data.couplePhoto && (
              <img src={data.couplePhoto} className="absolute inset-0 w-full h-full object-cover opacity-[0.15] mix-blend-luminosity grayscale" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
          </div>

          <FloatingDust />

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2, delay: 0.5 }} className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <h1 className="text-[35vw] font-script whitespace-nowrap text-white/5">{data.bride.name[0]}&{data.groom.name[0]}</h1>
          </motion.div>
          
          <div className="z-10 text-center px-4">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }} className="font-sans text-[10px] uppercase tracking-[0.8em] text-[#D4AF37]/80 mb-12">The Union of Two Souls</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 1.2 }} className="text-7xl md:text-[8rem] tracking-tight mb-4 font-serif leading-none">{data.bride.name}</motion.h1>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 1.8 }} className="block text-5xl md:text-6xl text-[#D4AF37]/60 font-script my-4">and</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 1.4 }} className="text-7xl md:text-[8rem] tracking-tight font-serif leading-none">{data.groom.name}</motion.h1>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 2.5 }} className="mt-20">
              <CountdownTimer targetDate={data.event.date} theme="cinematic" />
            </motion.div>
          </div>

          <img src="/assets/gold-frame.png" className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 opacity-40 mix-blend-screen rotate-180" />
        </motion.section>

        {/* 2. PROFILES */}
        <section className="relative bg-[#050505] py-40 overflow-hidden">
          {/* Subtle silk texture in background */}
          <img src="/assets/silk-bg.png" className="absolute inset-0 w-full h-full object-cover opacity-[0.03] pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-32">
              <div className="w-12 h-px bg-[#D4AF37]/50 mx-auto mb-8"></div>
              <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] mb-4">A Celebration of Love</p>
              <h2 className="text-4xl md:text-6xl font-light font-serif tracking-wide italic text-white/90">Our Journey Together.</h2>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-24 lg:gap-40 items-center justify-center">
              {/* Bride */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="w-full md:w-1/2 flex flex-col items-center text-center">
                <div className="relative mb-12">
                  <div className="w-72 h-96 md:w-[380px] md:h-[500px] overflow-hidden rounded-t-full border border-[#D4AF37]/20 p-2 relative z-10">
                    <img src={data.bride.photo} className="w-full h-full object-cover rounded-t-full grayscale hover:grayscale-0 transition-all duration-1000" />
                  </div>
                  {/* Ornament with Screen Blend */}
                  <img src="/assets/gold-frame.png" className="absolute -top-12 -left-12 w-48 opacity-30 mix-blend-screen -rotate-12 pointer-events-none" />
                </div>
                <h3 className="text-4xl mb-4 font-serif text-[#D4AF37]/90">{data.bride.fullName}</h3>
                <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-gray-500 mb-2">Putri Dari</p>
                <p className="text-base text-gray-400 italic font-light max-w-xs">
                  {data.bride_father && data.bride_mother 
                    ? `Bpk. ${data.bride_father} & Ibu ${data.bride_mother}`
                    : data.bride.parents
                  }
                </p>
              </motion.div>
              
              {/* Groom */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="w-full md:w-1/2 flex flex-col items-center text-center md:mt-56">
                <div className="relative mb-12">
                  <div className="w-72 h-96 md:w-[380px] md:h-[500px] overflow-hidden rounded-t-full border border-[#D4AF37]/20 p-2 relative z-10">
                    <img src={data.groom.photo} className="w-full h-full object-cover rounded-t-full grayscale hover:grayscale-0 transition-all duration-1000" />
                  </div>
                  {/* Ornament with Screen Blend */}
                  <img src="/assets/gold-frame.png" className="absolute -bottom-12 -right-12 w-48 opacity-30 mix-blend-screen rotate-[168deg] pointer-events-none" />
                </div>
                <h3 className="text-4xl mb-4 font-serif text-[#D4AF37]/90">{data.groom.fullName}</h3>
                <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-gray-500 mb-2">Putra Dari</p>
                <p className="text-base text-gray-400 italic font-light max-w-xs">
                  {data.groom_father && data.groom_mother 
                    ? `Bpk. ${data.groom_father} & Ibu ${data.groom_mother}`
                    : data.groom.parents
                  }
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TURUT MENGUNDANG */}
        {data.turut_mengundang && (
          <section className="py-24 px-6 bg-[#050505] relative border-y border-white/5">
            <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
              <h2 className="font-serif text-[#D4AF37] text-2xl uppercase tracking-[0.4em] mb-12">Turut Mengundang</h2>
              <div className="text-gray-400 font-light whitespace-pre-line leading-loose italic tracking-widest">
                {data.turut_mengundang}
              </div>
            </div>
          </section>
        )}

        {/* 3. EVENT */}
        <section className="relative py-48 bg-[#030303] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
             <img src="/assets/marble-bg.png" className="w-full h-full object-cover opacity-15" />
             <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 max-w-4xl w-full mx-4 bg-black/80 backdrop-blur-3xl border border-[#D4AF37]/10 p-12 md:p-32 text-center">
            {/* Ornament at center top */}
            <img src="/assets/gold-frame.png" className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 opacity-20 mix-blend-screen" />
            
            <h2 className="text-4xl md:text-6xl mb-16 tracking-[0.2em] font-serif text-white/90">The Celebration</h2>
            
            <div className="space-y-8 mb-16">
              <p className="font-sans text-xl md:text-2xl tracking-[0.5em] text-[#D4AF37] uppercase font-light">{data.event.dateFormatted.day}, {data.event.dateFormatted.date} {data.event.dateFormatted.monthYear}</p>
              <div className="w-12 h-px bg-white/10 mx-auto"></div>
              <p className="text-2xl font-light tracking-[0.3em]">{data.event.time}</p>
            </div>

            <div className="space-y-8">
              <h3 className="text-3xl text-[#D4AF37]/80 font-serif italic tracking-wide">{data.event.locationName}</h3>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-md mx-auto font-light tracking-wide">{data.event.locationAddress}</p>
              <div className="pt-16 flex flex-col sm:flex-row items-center justify-center gap-10">
                <a href={data.event.mapsLink} target="_blank" className="group relative px-12 py-5 overflow-hidden border border-[#D4AF37]/40 text-[#D4AF37] font-sans text-[10px] uppercase tracking-[0.4em] w-full sm:w-auto text-center transition-all duration-700">
                  <span className="absolute inset-0 bg-[#D4AF37] w-0 group-hover:w-full transition-all duration-700 ease-out"></span>
                  <span className="relative z-10 group-hover:text-black">Petunjuk Lokasi</span>
                </a>
                <a href={createCalendarLink()} target="_blank" className="group relative px-12 py-5 overflow-hidden bg-[#D4AF37]/90 text-black font-sans text-[10px] uppercase tracking-[0.4em] w-full sm:w-auto text-center transition-all duration-700">
                  <span className="absolute inset-0 bg-white w-0 group-hover:w-full transition-all duration-700 ease-out"></span>
                  <span className="relative z-10">Simpan Tanggal</span>
                </a>
              </div>
            </div>

            {/* Ornament at center bottom */}
            <img src="/assets/gold-frame.png" className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-40 opacity-20 mix-blend-screen rotate-180" />
          </motion.div>
        </section>

        {/* 4. GIFT & RSVP */}
        <section className="py-48 px-4 bg-[#050505] relative overflow-hidden">
          {/* Subtle silk texture backdrop */}
          <div className="absolute inset-0 opacity-[0.02]">
            <img src="/assets/silk-bg.png" className="w-full h-full object-cover" />
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-32 lg:gap-48 relative z-10">
            
            {/* GIFT */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h3 className="text-3xl md:text-4xl mb-10 font-serif text-white/90 tracking-wide">Tanda Kasih</h3>
              <p className="text-base text-gray-500 mb-16 leading-relaxed font-light tracking-wide max-w-md">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih lainnya, dapat melalui:</p>
              
              <div className="bg-black/60 backdrop-blur-xl p-12 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4">
                  <img src="/assets/gold-frame.png" className="w-20 opacity-10 mix-blend-screen group-hover:opacity-20 transition-opacity" />
                </div>
                <p className="font-sans text-[11px] uppercase tracking-[0.5em] text-[#D4AF37] mb-6">{data.gift.bankName}</p>
                <p className="text-3xl md:text-4xl tracking-[0.2em] mb-4 font-serif text-white/80">{data.gift.accountNumber}</p>
                <p className="text-xs text-gray-500 uppercase tracking-[0.3em] font-light mb-16">A/N {data.gift.accountName}</p>
                <button onClick={() => handleCopy(data.gift.accountNumber)} className="w-full py-5 bg-[#D4AF37]/5 text-[#D4AF37] border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-black transition-all duration-700 font-sans text-[10px] uppercase tracking-[0.4em] font-bold">
                  Salin Nomor Rekening
                </button>
              </div>
            </motion.div>

            {/* RSVP */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h3 className="text-3xl md:text-4xl mb-10 font-serif text-white/90 tracking-wide">Reservation</h3>
              <p className="text-base text-gray-500 mb-16 leading-relaxed font-light tracking-wide max-w-md">Mohon konfirmasi kehadiran Anda untuk membantu kami menyambut Anda dengan persiapan terbaik.</p>
              
              <form id="rsvp-form" action={handleRSVP} className="space-y-12">
                <div className="relative group">
                  <input type="text" name="name" required placeholder="NAMA LENGKAP" className="w-full bg-transparent border-b border-white/10 py-5 font-sans text-[11px] uppercase tracking-[0.3em] text-white focus:border-[#D4AF37] focus:outline-none transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 h-px bg-[#D4AF37] w-0 group-focus-within:w-full transition-all duration-700"></div>
                </div>
                <div className="relative group">
                  <select name="attendance" className="w-full bg-transparent border-b border-white/10 py-5 font-sans text-[11px] uppercase tracking-[0.3em] text-white focus:border-[#D4AF37] focus:outline-none transition-all duration-500 cursor-pointer appearance-none">
                    <option value="Hadir" className="bg-[#050505]">MENYATAKAN HADIR</option>
                    <option value="Tidak Hadir" className="bg-[#050505]">TIDAK BISA HADIR</option>
                  </select>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
                <div className="relative group">
                  <textarea name="message" rows={4} required placeholder="UCAPAN & DOA TULUS" className="w-full bg-transparent border-b border-white/10 py-5 font-sans text-[11px] uppercase tracking-[0.3em] text-white focus:border-[#D4AF37] focus:outline-none transition-all duration-500 resize-none"></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="group relative w-full py-6 overflow-hidden bg-white/5 border border-white/10 text-white font-sans text-[10px] font-bold uppercase tracking-[0.5em] transition-all duration-700 hover:border-[#D4AF37] disabled:opacity-50">
                  <span className="absolute inset-0 bg-[#D4AF37] w-0 group-hover:w-full transition-all duration-700 ease-out"></span>
                  <span className="relative z-10 group-hover:text-black">{isSubmitting ? "MENGIRIM..." : "KIRIM KONFIRMASI"}</span>
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* 5. GUESTBOOK */}
        <section className="py-48 px-4 bg-[#030303] border-t border-white/5 relative overflow-hidden">
          {/* Decorative frame bg */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl opacity-[0.03] pointer-events-none mix-blend-screen">
            <img src="/assets/gold-frame.png" className="w-full h-full object-contain" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-24">
              <p className="font-sans text-[10px] uppercase tracking-[0.6em] text-[#D4AF37] mb-6">Wishes</p>
              <h3 className="text-4xl md:text-5xl text-white/90 font-serif tracking-widest italic">Untaian Doa.</h3>
            </motion.div>

            <div className="max-h-[800px] overflow-y-auto pr-8 space-y-12 scrollbar-thin scrollbar-thumb-[#D4AF37]/10 scrollbar-track-transparent">
              <AnimatePresence mode="popLayout">
                {data.guestbook && data.guestbook.length > 0 ? (
                  data.guestbook.map((guest, idx) => (
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} key={idx} className="bg-white/[0.02] p-12 border border-white/5 group hover:border-[#D4AF37]/20 transition-all duration-1000">
                      <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
                        <span className="font-sans font-bold uppercase tracking-[0.4em] text-[11px] text-[#D4AF37]/90">{guest.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-sans text-[9px] uppercase tracking-[0.4em] px-4 py-2 border ${guest.attendance === 'Hadir' ? 'border-green-500/10 text-green-500/60' : 'border-red-500/10 text-red-500/60'} bg-black/40`}>
                            {guest.attendance}
                          </span>
                          {/* Hidden Delete Button (Visible via ThemeWrapper for Owner) */}
                          <button 
                            onClick={() => (window as any).handleDeleteEntry?.(guest.id)}
                            className="guest-entry-delete hidden p-1 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-400 text-lg leading-relaxed italic font-light tracking-wide">"{guest.message}"</p>
                      <p className="font-sans text-[10px] text-gray-600 mt-10 tracking-[0.3em] uppercase font-medium">
                        {new Date(guest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 text-lg italic font-light tracking-widest py-20">Jadilah yang pertama mengirimkan untaian doa.</p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <footer className="py-60 text-center border-t border-white/5 relative overflow-hidden bg-[#050505]">
          <img src="/assets/marble-bg.png" className="absolute inset-0 w-full h-full object-cover opacity-10" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 px-4">
            <h2 className="text-7xl md:text-[10rem] text-white/[0.03] font-serif mb-12 select-none tracking-tighter">{data.bride.name} & {data.groom.name}</h2>
            <div className="w-12 h-px bg-[#D4AF37]/30 mx-auto mb-12"></div>
            <p className="font-sans text-[11px] uppercase tracking-[1em] text-[#D4AF37]/60 ml-[1em]">UNDANGIN PREMIUM</p>
          </motion.div>
        </footer>
      </div>
    </>
  );
}
