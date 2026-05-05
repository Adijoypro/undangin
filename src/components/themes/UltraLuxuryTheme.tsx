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
import { toast } from "sonner";
import MapSimulation from "@/components/ui/MapSimulation";
import { QRCodeSVG } from "qrcode.react";
import BottomSheet from "@/components/ui/BottomSheet";

export default function UltraLuxuryTheme({ data }: { data: InvitationData }) {
  const { isOpened, onOpen } = useContext(ThemeContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isQRISOpen, setIsQRISOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const submitted = localStorage.getItem(`rsvp_${data.slug}`);
    if (submitted) setHasSubmitted(true);
  }, [data.slug]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const palette = {
    bg: "#FAF7F2", // Ivory Paper
    bgSecondary: "#F0EBE3", // Linen Texture
    text: "#2C1810", // Espresso Dark
    textMuted: "#6B5E55", // Taupe/Muted
    accent: "#C9A96E", // Champagne Gold
    card: "#FFFFFF",
    border: "rgba(201, 169, 110, 0.2)",
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } }
  };

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
      toast.success("Doa dan kehadiran Anda sangat berarti bagi kami.");
      localStorage.setItem(`rsvp_${data.slug}`, "true");
      setHasSubmitted(true);
      setIsRSVPOpen(false);
    } else {
      toast.error("Gagal mengirim, silakan coba lagi.");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Nomor rekening tersalin.");
  };

  // Floating Petals / Gold Dust effect
  const FloatingDust = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted || window.innerWidth < 1024) return null;

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#C9A96E] rounded-full blur-[1px]"
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
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#C9A96E]/0 via-[#C9A96E]/30 to-[#C9A96E]/0"></div>
          
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
              <div className="z-10 bg-white p-1 rounded-full border border-[#C9A96E]/40 shadow-sm">
                <div className="w-2 h-2 bg-[#C9A96E] rounded-full"></div>
              </div>
              <div className={`w-5/12 ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#C9A96E] mb-4">{item.date}</p>
                <h4 className="text-3xl font-serif italic mb-6 text-[#2C1810] opacity-90">{item.title}</h4>
                <p className="text-sm text-[#6B5E55] font-light leading-relaxed tracking-wide italic">"{item.story}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto text-center">
        {data.loveStory.map((paragraph, idx) => (
          <p key={idx} className="text-lg text-[#6B5E55] font-light leading-[2] mb-8 italic tracking-wide">"{paragraph}"</p>
        ))}
      </div>
    );
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isOpened && (
          <GoldenGateCover
            bride={data.bride.name}
            groom={data.groom.name}
            date={data.event.date}
            onOpen={onOpen}
            guestName={data.guestName}
            bridePhoto={data.bride.photo}
            groomPhoto={data.groom.photo}
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


      <div ref={containerRef} className="min-h-screen selection:bg-[#C9A96E]/20 selection:text-[#2C1810] font-serif overflow-x-hidden" style={{ backgroundColor: palette.bg, color: palette.text }}>
        
        {/* 1. HERO */}
        <motion.section 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative min-h-screen flex items-center justify-center pt-20 pb-32"
        >
          {/* Ivory Paper Texture Overlay */}
          <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none z-0">
            <Image src="/assets/ultra-luxury/paper.webp" fill className="object-cover" alt="Paper Texture" priority />
          </div>

          <div className="z-10 text-center px-4 w-full flex justify-center flex-col items-center">
            {/* Monogram Crest */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative w-32 h-32 md:w-48 md:h-48 mb-12 mix-blend-multiply opacity-80"
            >
              <Image src="/assets/ultra-luxury/crest.webp" fill className="object-contain" alt="Crest" />
              <div className="absolute inset-0 flex items-center justify-center pt-2">
                <span className="text-xl md:text-3xl text-[#2C1810] font-serif opacity-60 tracking-widest">
                  {data.bride.name[0]}{data.groom.name[0]}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="relative space-y-4 md:space-y-8"
            >
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="font-sans text-[10px] md:text-xs tracking-[0.8em] uppercase mb-12 text-[#6B5E55]">The Wedding of</motion.p>
              
              <h1 className="text-7xl md:text-[11rem] tracking-tighter uppercase leading-none font-serif text-[#2C1810] opacity-90">
                {data.bride.nickname || data.bride.name}
              </h1>
              
              <div className="flex items-center justify-center gap-6 my-12">
                <span className="text-3xl md:text-6xl text-[#C9A96E] font-script italic">and</span>
              </div>

              <h1 className="text-7xl md:text-[11rem] tracking-tighter uppercase leading-none font-serif text-[#2C1810] opacity-90">
                {data.groom.nickname || data.groom.name}
              </h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-16"
              >
                <CountdownTimer targetDate={data.event.date} />
              </motion.div>

              {/* Minimal Divider */}
              <div className="mt-16 w-32 h-8 mx-auto relative mix-blend-multiply opacity-40">
                <Image src="/assets/ultra-luxury/divider.webp" fill className="object-contain" alt="Divider" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 2 }}
              className="mt-20 flex flex-col items-center gap-4"
            >
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#6B5E55]">Scroll to Explore</p>
              <div className="w-px h-12 bg-gradient-to-b from-[#C9A96E] to-transparent"></div>
            </motion.div>
          </div>
        </motion.section>

        {/* 2. PROFILES */}
        <section className="relative py-40 overflow-hidden" style={{ backgroundColor: palette.bg }}>
          {/* Subtle Linen texture in background */}
          <div className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none">
            <Image src="/assets/ultra-luxury/linen.webp" fill className="object-cover" alt="Linen" />
          </div>
          
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-32">
              <div className="w-12 h-px bg-[#C9A96E]/50 mx-auto mb-8"></div>
              <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-[#C9A96E] mb-4">A Celebration of Love</p>
              <h2 className="text-4xl md:text-6xl font-light font-serif tracking-wide italic text-[#2C1810]">Our Journey Together.</h2>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-24 lg:gap-40 items-center justify-center">
              {/* Bride */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="w-full md:w-1/2 flex flex-col items-center text-center">
                <div className="relative mb-12">
                  <div className="w-72 h-96 md:w-[380px] md:h-[500px] overflow-hidden rounded-full border border-[#C9A96E]/20 p-2 relative z-10 shadow-2xl">
                    <Image src={data.bride.photo} fill className="object-cover rounded-full transition-all duration-1000" alt="Bride" />
                  </div>
                  {/* Minimal Ornament */}
                  <div className="absolute -top-12 -left-12 w-48 h-24 opacity-30 mix-blend-multiply -rotate-12 pointer-events-none">
                    <Image src="/assets/ultra-luxury/divider.webp" fill className="object-contain" alt="Ornament" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-4xl mb-4 font-serif text-[#2C1810]">{data.bride.fullName}</h3>
                <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-[#6B5E55] mb-2">Putri Dari</p>
                <p className="text-base text-[#6B5E55] italic font-light max-w-xs">
                  {data.bride_father && data.bride_mother 
                    ? `Bpk. ${data.bride_father} & Ibu ${data.bride_mother}`
                    : data.bride.parents
                  }
                </p>
              </motion.div>
              
              {/* Groom */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="w-full md:w-1/2 flex flex-col items-center text-center md:mt-56">
                <div className="relative mb-12">
                  <div className="w-72 h-96 md:w-[380px] md:h-[500px] overflow-hidden rounded-full border border-[#C9A96E]/20 p-2 relative z-10 shadow-2xl">
                    <Image src={data.groom.photo} fill className="object-cover rounded-full transition-all duration-1000" alt="Groom" />
                  </div>
                  {/* Minimal Ornament */}
                  <div className="absolute -bottom-12 -right-12 w-48 h-24 opacity-30 mix-blend-multiply rotate-[168deg] pointer-events-none">
                    <Image src="/assets/ultra-luxury/divider.webp" fill className="object-contain" alt="Ornament" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-4xl mb-4 font-serif text-[#2C1810]">{data.groom.fullName}</h3>
                <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-[#6B5E55] mb-2">Putra Dari</p>
                <p className="text-base text-[#6B5E55] italic font-light max-w-xs">
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
        <section className="relative py-48 bg-[#FAF7F2] overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-32">
              <div className="w-12 h-px bg-[#C9A96E]/50 mx-auto mb-8"></div>
              <p className="font-sans text-[10px] uppercase tracking-[0.6em] text-[#C9A96E] mb-6">Our Journey</p>
              <h2 className="text-4xl md:text-5xl font-serif text-[#2C1810] italic">The Story of Us.</h2>
            </motion.div>
            
            <div className="text-[#6B5E55]">
              {renderLoveStory()}
            </div>
          </div>
        </section>

        {/* 4. GALLERY EXHIBITION */}
        {data.gallery && data.gallery.length > 0 && (
          <section className="relative py-48 overflow-hidden" style={{ backgroundColor: palette.bgSecondary }}>
            <div className="absolute inset-0 z-0 opacity-10 mix-blend-multiply">
              <Image src="/assets/ultra-luxury/paper.webp" fill className="object-cover" alt="Texture" />
            </div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-32">
                <div className="w-12 h-px bg-[#C9A96E]/50 mx-auto mb-8"></div>
                <p className="font-sans text-[10px] uppercase tracking-[0.6em] text-[#C9A96E] mb-6">Visual Journey</p>
                <h2 className="text-4xl md:text-7xl font-serif text-[#2C1810] uppercase tracking-tighter">The Gallery.</h2>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {data.gallery.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className="relative group overflow-hidden border border-[#C9A96E]/10"
                  >
                    <div className="relative aspect-square md:aspect-auto md:h-full min-h-[300px] overflow-hidden">
                      <Image 
                        src={img} 
                        alt={`Gallery ${idx}`} 
                        fill 
                        className="object-cover transition-all duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-[#FAF7F2]/20 group-hover:bg-transparent transition-all duration-700"></div>
                      
                      {/* Frame Accent on Hover */}
                      <div className="absolute inset-0 border border-[#C9A96E]/0 group-hover:border-[#C9A96E]/20 transition-all duration-700 m-4"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TURUT MENGUNDANG */}
        {data.turut_mengundang && (
          <section className="py-24 px-6 relative border-y border-[#C9A96E]/10" style={{ backgroundColor: palette.bg }}>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-[#C9A96E] text-2xl uppercase tracking-[0.4em] mb-12">Turut Mengundang</h2>
              <div className="text-[#6B5E55] font-light whitespace-pre-line leading-loose italic tracking-widest">
                {data.turut_mengundang}
              </div>
            </div>
          </section>
        )}

        {/* 4. EVENT (Multi-Event) */}
        <section className="relative py-48 overflow-hidden space-y-32" style={{ backgroundColor: palette.bg }}>
          <div className="absolute inset-0 opacity-10 mix-blend-multiply">
             <Image src="/assets/ultra-luxury/linen.webp" fill className="object-cover" alt="Texture" />
          </div>
          
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-24">
              <CountdownTimer targetDate={data.event.date} theme="cinematic" />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-24">
              <p className="font-sans text-[10px] uppercase tracking-[0.6em] text-[#C9A96E] mb-6">The Celebration</p>
              <h2 className="text-4xl md:text-6xl text-[#2C1810] font-serif uppercase tracking-[0.2em]">The Event.</h2>
            </motion.div>

            {(data.events && data.events.length > 0 ? data.events : [data.event]).map((event: any, index: number) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-20 items-center mb-32 last:mb-0 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Event Details Card */}
                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className={`bg-white border border-[#C9A96E]/20 p-6 md:p-20 text-center relative shadow-xl rounded-2xl ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-8 opacity-40 mix-blend-multiply">
                    <Image src="/assets/ultra-luxury/divider.webp" fill className="object-contain" alt="Ornament" />
                  </div>

                  <p className="font-sans text-xl tracking-[0.5em] text-[#C9A96E] uppercase font-light mb-8">{event.date}</p>
                  <div className="w-12 h-px bg-[#C9A96E]/20 mx-auto mb-8"></div>
                  <p className="text-2xl text-[#2C1810] font-light tracking-[0.3em] mb-12">{event.time}</p>
                  
                  <h3 className="text-xl md:text-3xl text-[#2C1810] font-serif italic tracking-wide mb-6">{event.location || event.locationName}</h3>
                  <p className="text-[#6B5E55] text-base leading-relaxed mb-16 font-light tracking-wide">{event.address || event.locationAddress}</p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a 
                      href={event.maps_link || event.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((event.location || event.locationName || "") + " " + (event.address || event.locationAddress || ""))}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative px-10 py-5 overflow-hidden border border-[#C9A96E] text-[#2C1810] font-sans text-[10px] uppercase tracking-[0.4em] w-full text-center transition-all duration-700"
                    >
                      <span className="absolute inset-0 bg-[#C9A96E] w-0 group-hover:w-full transition-all duration-700 ease-out"></span>
                      <span className="relative z-10 group-hover:text-white font-bold">Buka Google Maps</span>
                    </a>
                    <a href={createCalendarLink()} target="_blank" className="group relative px-10 py-5 overflow-hidden bg-[#2C1810] text-white font-sans text-[10px] uppercase tracking-[0.4em] w-full text-center transition-all duration-700">
                      <span className="absolute inset-0 bg-[#C9A96E] w-0 group-hover:w-full transition-all duration-700 ease-out"></span>
                      <span className="relative z-10 font-bold">Simpan Kalender</span>
                    </a>
                  </div>
                </motion.div>

                {/* Map & QR Simulation */}
                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className={`space-y-8 ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                >
                  <div className="p-2 border border-[#C9A96E]/20 rounded-[2rem] overflow-hidden bg-white shadow-lg">
                    <MapSimulation 
                      lat={event.latitude ?? -6.2088} 
                      lng={event.longitude ?? 106.8456} 
                      locationName={event.location || event.locationName} 
                    />
                  </div>

                  <div className="bg-white/80 backdrop-blur-xl border border-[#C9A96E]/10 p-6 rounded-[2rem] flex items-center gap-10 shadow-md">
                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-[#C9A96E]/10">
                      <QRCodeSVG 
                        value={event.maps_link || event.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((event.location || event.locationName || "") + " " + (event.address || event.locationAddress || ""))}`} 
                        size={100} 
                        level="H"
                        fgColor="#2C1810"
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-sans text-[10px] font-bold text-[#C9A96E] uppercase tracking-[0.3em] mb-2">Instant Navigation</p>
                      <p className="text-[11px] leading-relaxed text-[#6B5E55] italic font-light">Scan code ini untuk panduan navigasi langsung ke lokasi acara di ponsel Anda.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. GIFT & RSVP */}
        <section className="py-48 px-4 relative overflow-hidden" style={{ backgroundColor: palette.bgSecondary }}>
          {/* Subtle linen texture backdrop */}
          <div className="absolute inset-0 opacity-10 mix-blend-multiply">
            <Image src="/assets/ultra-luxury/linen.webp" fill className="object-cover" alt="Linen" />
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-32 lg:gap-48 relative z-10">
            
            {/* GIFT */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h3 className="text-xl md:text-4xl mb-10 font-serif text-[#2C1810] tracking-wide uppercase tracking-[0.2em]">Tanda Kasih</h3>
              <p className="text-base text-[#6B5E55] mb-16 leading-relaxed font-light tracking-wide max-w-md">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih lainnya, dapat melalui:</p>
              
              <div className="bg-white p-5 md:p-12 border border-[#C9A96E]/20 relative overflow-hidden group shadow-xl rounded-3xl">
                <div className="absolute top-0 right-0 p-4 w-12 h-6 opacity-40 mix-blend-multiply group-hover:opacity-60 transition-opacity">
                  <Image src="/assets/ultra-luxury/divider.webp" fill className="object-contain" alt="Ornament" />
                </div>
                <p className="font-sans text-[9px] md:text-[11px] uppercase tracking-[0.5em] text-[#C9A96E] mb-4">{data.gift.bankName}</p>
                <p className="text-[10px] sm:text-2xl md:text-4xl tracking-[0.1em] md:tracking-[0.2em] mb-4 font-serif text-[#2C1810]">{data.gift.accountNumber}</p>
                <p className="text-[10px] text-[#6B5E55] uppercase tracking-[0.3em] font-light mb-12">A/N {data.gift.accountName}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => handleCopy(data.gift.accountNumber)} 
                    className="flex-1 py-4 bg-[#C9A96E]/10 text-[#2C1810] border border-[#C9A96E]/20 hover:bg-[#C9A96E] hover:text-white transition-all duration-700 font-sans text-[8px] uppercase tracking-[0.3em] font-bold"
                  >
                    Salin Nomor
                  </button>
                  {data.gift.qrUrl && (
                    <button 
                      onClick={() => setIsQRISOpen(true)} 
                      className="flex-1 py-4 bg-[#2C1810]/5 text-[#2C1810] border border-[#2C1810]/10 hover:border-[#C9A96E]/40 transition-all duration-700 font-sans text-[8px] uppercase tracking-[0.3em] font-bold"
                    >
                      Lihat QRIS
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* RSVP SECTION */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h3 className="text-xl md:text-4xl mb-10 font-serif text-[#2C1810] tracking-wide uppercase tracking-[0.2em]">Reservation</h3>
              <p className="text-base text-[#6B5E55] mb-16 leading-relaxed font-light tracking-wide max-w-md">Mohon konfirmasi kehadiran Anda untuk membantu kami menyambut Anda dengan persiapan terbaik.</p>
              
              <div className="flex flex-col items-center">
                {hasSubmitted ? (
                  <div className="py-12 px-10 bg-white/50 backdrop-blur-sm border border-[#C9A96E]/20 rounded-full text-center">
                    <div className="w-16 h-16 bg-[#C9A96E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-[#2C1810] font-serif text-2xl mb-2 italic">Terima Kasih</h4>
                    <p className="text-[#6B5E55] text-[10px] uppercase tracking-[0.4em] font-bold">Kehadiran Anda Telah Terkonfirmasi</p>
                  </div>
                ) : (
                  <>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        // Trigger crack animation logic here or just open
                        setIsRSVPOpen(true);
                      }}
                      className="relative w-32 h-32 md:w-40 md:h-40 group cursor-pointer"
                    >
                      <AnimatePresence>
                        {!isRSVPOpen && (
                          <motion.div
                            exit={{ 
                              scale: 1.2, 
                              opacity: 0,
                              filter: "blur(10px)",
                              transition: { duration: 0.4 }
                            }}
                            className="relative w-full h-full"
                          >
                            {/* Realistic Organic Wax Shape */}
                            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_20px_rgba(139,35,35,0.4)] fill-[#8B2323]">
                              <path d="M50 8 Q75 5 90 25 Q100 50 85 75 Q70 95 45 92 Q15 88 8 55 Q5 20 50 8" />
                              <circle cx="50" cy="50" r="35" fill="#7A1F1F" opacity="0.4" />
                              
                              {/* Engraved Design */}
                              <g opacity="0.6">
                                <circle cx="50" cy="50" r="32" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="1 2" />
                                <text x="50" y="62" textAnchor="middle" className="fill-white font-serif italic text-4xl" style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.8))' }}>
                                  {data.bride.name[0]}
                                </text>
                              </g>

                              {/* Crack Lines (Invisible initially) */}
                              <motion.path 
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileTap={{ pathLength: 1, opacity: 0.8 }}
                                d="M50 20 L45 40 L55 60 L50 80 M20 50 L40 55 L60 45 L80 50" 
                                stroke="black" strokeWidth="2" fill="none" 
                              />
                            </svg>

                            {/* Wax Shine */}
                            <div className="absolute top-[15%] left-[25%] w-[30%] h-[15%] bg-white/20 rounded-full blur-md rotate-[-30deg]"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <p className="mt-8 font-sans text-[10px] font-bold text-[#C9A96E] uppercase tracking-[0.8em]">RSVP Now</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* BOTTOM SHEET RSVP FORM (ULTRA LUXURY STYLE) */}
        <BottomSheet 
          isOpen={isRSVPOpen} 
          onClose={() => setIsRSVPOpen(false)} 
          title="RESERVATION"
        >
          <form action={handleRSVP} className="space-y-12 py-8 px-4">
            <div className="hidden">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            
            <div className="relative group">
              <label className="text-[9px] uppercase tracking-[0.4em] text-[#C9A96E] ml-1 font-bold">Your Distinguished Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="PLEASE ENTER YOUR FULL NAME" 
                className="w-full bg-transparent border-b border-[#2C1810]/10 py-5 font-sans text-[11px] uppercase tracking-[0.3em] text-[#2C1810] focus:border-[#C9A96E] focus:outline-none transition-all duration-500" 
              />
            </div>

            <div className="relative group">
              <label className="text-[9px] uppercase tracking-[0.4em] text-[#C9A96E] ml-1 font-bold">Attendance Status</label>
              <select 
                name="attendance" 
                className="w-full bg-transparent border-b border-[#2C1810]/10 py-5 font-sans text-[11px] uppercase tracking-[0.3em] text-[#2C1810] focus:border-[#C9A96E] focus:outline-none transition-all duration-500 cursor-pointer appearance-none"
              >
                <option value="Hadir">I WILL ATTEND THE CELEBRATION</option>
                <option value="Tidak Hadir">UNFORTUNATELY UNABLE TO ATTEND</option>
              </select>
            </div>

            <div className="relative group">
              <label className="text-[9px] uppercase tracking-[0.4em] text-[#C9A96E] ml-1 font-bold">Sacred Message</label>
              <textarea 
                name="message" 
                rows={5} 
                required 
                placeholder="YOUR SINCERE WISHES & PRAYERS" 
                className="w-full bg-transparent border-b border-[#2C1810]/10 py-5 font-sans text-[11px] uppercase tracking-[0.3em] text-[#2C1810] focus:border-[#C9A96E] focus:outline-none transition-all duration-500 resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="group relative w-full py-6 overflow-hidden bg-[#2C1810] text-white font-sans text-[10px] font-bold uppercase tracking-[0.5em] transition-all duration-700 hover:bg-[#C9A96E] disabled:opacity-50 shadow-xl rounded-xl"
            >
              <span className="relative z-10">{isSubmitting ? "SENDING..." : "CONFIRM NOW"}</span>
            </button>
          </form>
        </BottomSheet>
        
        {/* ULTRA LUXURY QRIS */}
        <BottomSheet 
          isOpen={isQRISOpen} 
          onClose={() => setIsQRISOpen(false)} 
          title="WEDDING GIFT"
        >
          <div className="p-8 text-center space-y-12">
            <div className="relative w-full aspect-square max-w-[320px] mx-auto bg-white p-6 rounded-[2rem] shadow-2xl overflow-hidden border border-[#C9A96E]/20">
              {data.gift.qrUrl && (
                <Image src={data.gift.qrUrl} alt="QRIS" fill className="object-contain p-6" />
              )}
            </div>
            <div className="space-y-4">
              <p className="text-[#C9A96E] font-sans text-[10px] uppercase tracking-[0.6em] font-bold">{data.gift.bankName}</p>
              <div className="bg-[#FAF7F2] border border-[#C9A96E]/10 p-6 rounded-[1.5rem]">
                <p className="text-[#2C1810] text-2xl font-sans tracking-[0.2em] font-light">{data.gift.accountNumber}</p>
                <p className="text-[#6B5E55] text-[9px] uppercase tracking-[0.4em] mt-2 font-bold">A/N {data.gift.accountName}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsQRISOpen(false)}
              className="w-full py-6 bg-[#2C1810] text-white text-[9px] font-bold uppercase tracking-[0.5em] rounded-xl hover:bg-[#C9A96E] transition-all duration-500"
            >
              Close Gift Portal
            </button>
          </div>
        </BottomSheet>

        {/* 6. GUESTBOOK */}
        <section className="py-48 px-4 border-t border-[#C9A96E]/10 relative overflow-hidden" style={{ backgroundColor: palette.bg }}>
          {/* Subtle paper texture */}
          <div className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none">
            <Image src="/assets/ultra-luxury/paper.webp" fill className="object-cover" alt="Texture" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-24">
              <p className="font-sans text-[10px] uppercase tracking-[0.6em] text-[#C9A96E] mb-6">Wishes</p>
              <h3 className="text-2xl md:text-5xl text-[#2C1810] font-serif tracking-widest italic">Untaian Doa.</h3>
            </motion.div>

            <div className="max-h-[800px] overflow-y-auto pr-8 space-y-12 scrollbar-thin scrollbar-thumb-[#C9A96E]/10 scrollbar-track-transparent">
              <AnimatePresence mode="popLayout">
                {data.guestbook && data.guestbook.length > 0 ? (
                  data.guestbook.map((guest, idx) => (
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} key={idx} className="bg-white p-12 border border-[#C9A96E]/10 group hover:border-[#C9A96E]/30 transition-all duration-1000 shadow-md rounded-2xl">
                      <div className="flex justify-between items-center mb-10 border-b border-[#2C1810]/5 pb-8">
                        <span className="font-sans font-bold uppercase tracking-[0.4em] text-[11px] text-[#2C1810]">{guest.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-sans text-[9px] uppercase tracking-[0.4em] px-4 py-2 border ${guest.attendance === 'Hadir' ? 'border-green-500/10 text-green-600/80' : 'border-red-500/10 text-red-600/80'} bg-[#FAF7F2]`}>
                            {guest.attendance}
                          </span>
                          <button 
                            onClick={() => (window as any).handleDeleteEntry?.(guest.id)}
                            className="guest-entry-delete hidden p-1 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-[#6B5E55] text-lg leading-relaxed italic font-light tracking-wide">"{guest.message}"</p>
                      <p className="font-sans text-[10px] text-gray-400 mt-10 tracking-[0.3em] uppercase font-medium">
                        {new Date(guest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-[#6B5E55] text-lg italic font-light tracking-widest py-20">Jadilah yang pertama mengirimkan untaian doa.</p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

      {/* CLOSING STATEMENT */}
      <section className="py-32 px-4 relative z-10" style={{ backgroundColor: palette.bg }}>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-16 h-px bg-[#C9A96E]/30 mx-auto mb-10"></div>
          <p className="font-serif italic text-xl md:text-2xl text-[#6B5E55] leading-relaxed tracking-wide">
            {data.closing_statement || "Kehadiran serta doa restu Anda adalah kado terindah yang melengkapi perjalanan cinta kami."}
          </p>
          <div className="w-16 h-px bg-[#C9A96E]/30 mx-auto mt-10"></div>
        </motion.div>
      </section>

      <footer className="py-60 text-center relative overflow-hidden" style={{ backgroundColor: palette.bg }}>
          {/* Paper texture overlay for the footer */}
          <div className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none">
            <Image src="/assets/ultra-luxury/paper.webp" fill className="object-cover" alt="Paper" />
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="text-4xl sm:text-6xl md:text-8xl lg:text-[12rem] font-serif text-[#2C1810] mb-2 leading-none tracking-tighter break-words px-4 uppercase opacity-90"
            >
              {data.bride.name}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="text-2xl md:text-5xl lg:text-7xl text-[#C9A96E] font-script italic my-8"
            >
              and
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1.2 }}
              className="text-4xl sm:text-6xl md:text-8xl lg:text-[12rem] font-serif text-[#2C1810] mt-2 leading-none tracking-tighter break-words px-4 uppercase opacity-90"
            >
              {data.groom.name}
            </motion.h1>
            
            <div className="mt-20 w-32 h-px bg-[#C9A96E]/30 mx-auto"></div>
            <p className="mt-8 font-sans text-[10px] uppercase tracking-[0.5em] text-[#6B5E55]">Membangun Keabadian</p>
          </motion.div>
        </footer>
      </div>
      </div>
    </>
  );
}
