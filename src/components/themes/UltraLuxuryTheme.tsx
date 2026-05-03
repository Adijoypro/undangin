"use client";

import { useEffect, useRef, useState, useContext } from "react";
import { motion, useScroll, useTransform, useSpring, Variants, AnimatePresence } from "framer-motion";
import { ThemeContext } from "./ThemeWrapper";
import { GoldenGateCover } from "@/components/covers";
import { ScrollIndicator } from "./InvitationCover";
import Image from "next/image";
import { InvitationData } from "@/data/invitations";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { submitRSVP } from "@/app/[slug]/actions";
import MapSimulation from "@/components/ui/MapSimulation";
import { QRCodeSVG } from "qrcode.react";

export default function UltraLuxuryTheme({ data }: { data: InvitationData }) {
  const { isOpened, onOpen } = useContext(ThemeContext);
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
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
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

  const renderLoveStory = () => {
    if (!data.loveStory || data.loveStory.length === 0) return null;

    const isStructured = typeof data.loveStory[0] === 'object' && data.loveStory[0] !== null;

    if (isStructured) {
      return (
        <div className="space-y-32 relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37]/0 via-[#D4AF37]/30 to-[#D4AF37]/0"></div>
          
          {data.loveStory.map((item: any, idx: number) => (
            <motion.div 
              key={idx} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeUp}
              className={`flex items-center justify-between w-full ${idx % 2 === 0 ? 'flex-row-reverse' : ''}`}
            >
              <div className="w-5/12"></div>
              <div className="z-10 bg-black p-1 rounded-full border border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
              </div>
              <div className={`w-5/12 ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] mb-4">{item.date}</p>
                <h4 className="text-3xl font-serif italic mb-6 text-white/90">{item.title}</h4>
                <p className="text-sm text-gray-500 font-light leading-relaxed tracking-wide italic">"{item.story}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto text-center">
        {data.loveStory.map((paragraph, idx) => (
          <p key={idx} className="text-lg text-gray-400 font-light leading-[2] mb-8 italic italic tracking-wide">"{paragraph}"</p>
        ))}
      </div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {!isOpened && (
          <GoldenGateCover
            bride={data.bride.name}
            groom={data.groom.name}
            date={data.event.date}
            onOpen={onOpen}
            guestName={data.guestName}
          />
        )}
      </AnimatePresence>
      <div className={`transition-opacity duration-1000 w-full min-h-screen ${isOpened ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        {isOpened && <ScrollIndicator color="#D4AF37" />}
        {/* CUSTOM CURSOR */}
      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 border border-[#D4AF37] rounded-full pointer-events-none z-[999] hidden md:block mix-blend-difference"
        animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
        transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
      />


      <div ref={containerRef} className={`bg-[#050505] text-white min-h-screen selection:bg-[#D4AF37]/30 selection:text-white font-serif overflow-x-hidden`}>
        


        {/* 1. HERO */}
        <motion.section 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative h-screen flex flex-col items-center justify-center pt-20 overflow-hidden"
        >
          {/* VVIP Background Asset */}
          <div className="absolute inset-0 z-0">
            <Image src="/assets/marble-bg.webp" fill className="object-cover opacity-25 mix-blend-overlay" alt="Marble" priority />
            {data.couplePhoto && (
              <Image src={data.couplePhoto} fill className="object-cover opacity-[0.15] mix-blend-luminosity grayscale" alt="Couple" priority />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
          </div>

          <FloatingDust />

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2, delay: 0.5 }} className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <h1 className="text-[35vw] font-script whitespace-nowrap text-white/5">{data.bride.name[0]}&{data.groom.name[0]}</h1>
          </motion.div>
          
          <div className="z-10 text-center px-4">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }} className="font-sans text-[10px] uppercase tracking-[0.8em] text-[#D4AF37]/80 mb-12">The Union of Two Souls</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 1.2 }} className="text-2xl sm:text-4xl md:text-[8rem] tracking-tighter mb-2 font-serif leading-none">{data.bride.name}</motion.h1>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 1.8 }} className="block text-xl md:text-6xl text-[#D4AF37]/60 font-script my-2">and</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 1.4 }} className="text-2xl sm:text-4xl md:text-[8rem] tracking-tighter font-serif leading-none">{data.groom.name}</motion.h1>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 2.5 }} className="mt-20">
              <CountdownTimer targetDate={data.event.date} theme="cinematic" />
            </motion.div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-24 opacity-40 mix-blend-screen rotate-180">
            <Image src="/assets/gold-frame.webp" fill className="object-contain" alt="Frame" />
          </div>
        </motion.section>

        {/* 2. PROFILES */}
        <section className="relative bg-[#050505] py-40 overflow-hidden">
          {/* Subtle silk texture in background */}
          <Image src="/assets/silk-bg.webp" fill className="object-cover opacity-[0.03] pointer-events-none" alt="Silk" />
          
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
                    <Image src={data.bride.photo} fill className="object-cover rounded-t-full grayscale hover:grayscale-0 transition-all duration-1000" alt="Bride" />
                  </div>
                  {/* Ornament with Screen Blend */}
                  <div className="absolute -top-12 -left-12 w-48 h-48 opacity-30 mix-blend-screen -rotate-12 pointer-events-none">
                    <Image src="/assets/gold-frame.webp" fill className="object-contain" alt="Ornament" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-4xl mb-4 font-serif text-[#D4AF37]/90">{data.bride.fullName}</h3>
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
                    <Image src={data.groom.photo} fill className="object-cover rounded-t-full grayscale hover:grayscale-0 transition-all duration-1000" alt="Groom" />
                  </div>
                  {/* Ornament with Screen Blend */}
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 opacity-30 mix-blend-screen rotate-[168deg] pointer-events-none">
                    <Image src="/assets/gold-frame.webp" fill className="object-contain" alt="Ornament" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-4xl mb-4 font-serif text-[#D4AF37]/90">{data.groom.fullName}</h3>
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

        {/* 3. LOVE STORY (STRUCTURED) */}
        <section className="relative py-48 bg-[#030303] overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-32">
              <p className="font-sans text-[10px] uppercase tracking-[0.6em] text-[#D4AF37] mb-6">Our Journey</p>
              <h2 className="text-4xl md:text-5xl font-serif text-white/90 italic">The Story of Us.</h2>
            </motion.div>
            
            {renderLoveStory()}
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

        {/* 4. EVENT (Multi-Event) */}
        <section className="relative py-48 bg-[#030303] overflow-hidden space-y-32">
          <div className="absolute inset-0">
             <Image src="/assets/marble-bg.webp" fill className="object-cover opacity-15" alt="Marble" />
             <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-24">
              <p className="font-sans text-[10px] uppercase tracking-[0.6em] text-[#D4AF37] mb-6">The Celebration</p>
              <h2 className="text-4xl md:text-6xl text-white/90 font-serif uppercase tracking-[0.2em]">The Event.</h2>
            </motion.div>

            {(data.events && data.events.length > 0 ? data.events : [data.event]).map((event: any, index: number) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-20 items-center mb-32 last:mb-0 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Event Details Card */}
                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className={`bg-black/60 backdrop-blur-3xl border border-[#D4AF37]/10 p-6 md:p-20 text-center relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 opacity-20 mix-blend-screen">
                    <Image src="/assets/gold-frame.webp" fill className="object-contain" alt="Ornament" />
                  </div>

                  <p className="font-sans text-xl tracking-[0.5em] text-[#D4AF37] uppercase font-light mb-8">{event.date}</p>
                  <div className="w-12 h-px bg-white/10 mx-auto mb-8"></div>
                  <p className="text-2xl font-light tracking-[0.3em] mb-12">{event.time}</p>
                  
                  <h3 className="text-xl md:text-3xl text-[#D4AF37]/80 font-serif italic tracking-wide mb-6">{event.location || event.locationName}</h3>
                  <p className="text-gray-400 text-base leading-relaxed mb-16 font-light tracking-wide">{event.address || event.locationAddress}</p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a href={event.maps_link || event.mapsLink} target="_blank" className="group relative px-10 py-5 overflow-hidden border border-[#D4AF37]/40 text-[#D4AF37] font-sans text-[10px] uppercase tracking-[0.4em] w-full text-center transition-all duration-700">
                      <span className="absolute inset-0 bg-[#D4AF37] w-0 group-hover:w-full transition-all duration-700 ease-out"></span>
                      <span className="relative z-10 group-hover:text-black">Google Maps</span>
                    </a>
                    <a href={createCalendarLink()} target="_blank" className="group relative px-10 py-5 overflow-hidden bg-[#D4AF37]/90 text-black font-sans text-[10px] uppercase tracking-[0.4em] w-full text-center transition-all duration-700">
                      <span className="absolute inset-0 bg-white w-0 group-hover:w-full transition-all duration-700 ease-out"></span>
                      <span className="relative z-10">Calendar</span>
                    </a>
                  </div>
                </motion.div>

                {/* Map & QR Simulation */}
                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className={`space-y-8 ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                >
                  <div className="p-2 border border-[#D4AF37]/20 rounded-[2rem] overflow-hidden bg-[#050505]">
                    <MapSimulation 
                      lat={event.latitude ?? -6.2088} 
                      lng={event.longitude ?? 106.8456} 
                      locationName={event.location || event.locationName} 
                    />
                  </div>

                  <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] flex items-center gap-10">
                    <div className="bg-white p-2 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                      <QRCodeSVG 
                        value={event.maps_link || event.mapsLink} 
                        size={100} 
                        level="H"
                        fgColor="#050505"
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-sans text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] mb-2">Instant Navigation</p>
                      <p className="text-[11px] leading-relaxed text-gray-500 italic font-light">Scan code ini untuk panduan navigasi langsung ke lokasi acara di ponsel Anda.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. GIFT & RSVP */}
        <section className="py-48 px-4 bg-[#050505] relative overflow-hidden">
          {/* Subtle silk texture backdrop */}
          <div className="absolute inset-0 opacity-[0.02]">
            <Image src="/assets/silk-bg.webp" fill className="object-cover" alt="Silk" />
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-32 lg:gap-48 relative z-10">
            
            {/* GIFT */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h3 className="text-xl md:text-4xl mb-10 font-serif text-white/90 tracking-wide uppercase tracking-[0.2em]">Tanda Kasih</h3>
              <p className="text-base text-gray-500 mb-16 leading-relaxed font-light tracking-wide max-w-md">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih lainnya, dapat melalui:</p>
              
              <div className="bg-black/60 backdrop-blur-xl p-5 md:p-12 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 w-20 h-20 opacity-10 mix-blend-screen group-hover:opacity-20 transition-opacity">
                  <Image src="/assets/gold-frame.webp" fill className="object-contain" alt="Ornament" />
                </div>
                <p className="font-sans text-[9px] md:text-[11px] uppercase tracking-[0.5em] text-[#D4AF37] mb-4">{data.gift.bankName}</p>
                <p className="text-[10px] sm:text-2xl md:text-4xl tracking-[0.1em] md:tracking-[0.2em] mb-4 font-serif text-white/80">{data.gift.accountNumber}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-light mb-12">A/N {data.gift.accountName}</p>
                <button onClick={() => handleCopy(data.gift.accountNumber)} className="w-full py-4 bg-[#D4AF37]/5 text-[#D4AF37] border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-black transition-all duration-700 font-sans text-[8px] uppercase tracking-[0.3em] font-bold">
                  Salin Nomor
                </button>
              </div>
            </motion.div>

            {/* RSVP */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h3 className="text-xl md:text-4xl mb-10 font-serif text-white/90 tracking-wide uppercase tracking-[0.2em]">Reservation</h3>
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
                <button type="submit" disabled={isSubmitting} className="group relative w-full py-3 md:py-6 overflow-hidden bg-white/5 border border-white/10 text-white font-sans text-[8px] md:text-[10px] font-bold uppercase tracking-[0.5em] transition-all duration-700 hover:border-[#D4AF37] disabled:opacity-50">
                  <span className="absolute inset-0 bg-[#D4AF37] w-0 group-hover:w-full transition-all duration-700 ease-out"></span>
                  <span className="relative z-10 group-hover:text-black">{isSubmitting ? "MENGIRIM..." : "KIRIM"}</span>
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* 6. GUESTBOOK */}
        <section className="py-48 px-4 bg-[#030303] border-t border-white/5 relative overflow-hidden">
          {/* Decorative frame bg */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] opacity-[0.03] pointer-events-none mix-blend-screen">
            <Image src="/assets/gold-frame.webp" fill className="object-contain" alt="Ornament" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-24">
              <p className="font-sans text-[10px] uppercase tracking-[0.6em] text-[#D4AF37] mb-6">Wishes</p>
              <h3 className="text-2xl md:text-5xl text-white/90 font-serif tracking-widest italic">Untaian Doa.</h3>
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

      {/* CLOSING STATEMENT */}
      <section className="py-32 px-4 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-16 h-px bg-[#D4AF37]/30 mx-auto mb-10"></div>
          <p className="font-serif italic text-xl md:text-2xl text-gray-300 leading-relaxed tracking-wide">
            {data.closing_statement || "Kehadiran serta doa restu Anda adalah kado terindah yang melengkapi perjalanan cinta kami."}
          </p>
          <div className="w-16 h-px bg-[#D4AF37]/30 mx-auto mt-10"></div>
        </motion.div>
      </section>

      <footer className="py-60 text-center border-t border-white/5 relative overflow-hidden bg-[#050505]">
          <Image src="/assets/marble-bg.webp" fill className="object-cover opacity-10" alt="Marble" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="text-3xl sm:text-5xl md:text-8xl lg:text-9xl font-serif text-[#D4AF37] mb-2 leading-none tracking-tighter break-words px-4"
            >
              {data.bride.name}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="text-2xl md:text-5xl lg:text-6xl text-[#D4AF37]/50 my-2"
            >
              &
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1.2 }}
              className="text-3xl sm:text-5xl md:text-8xl lg:text-9xl font-serif text-[#D4AF37] mt-2 leading-none tracking-tighter break-words px-4"
            >
              {data.groom.name}
            </motion.h1>
            <div className="w-12 h-px bg-[#D4AF37]/30 mx-auto mb-12 mt-12"></div>
            <p className="font-sans text-[11px] uppercase tracking-[1em] text-[#D4AF37]/60 ml-[1em]">UNDANGIN PREMIUM</p>
          </motion.div>
        </footer>
      </div>
      </div>
    </>
  );
}
