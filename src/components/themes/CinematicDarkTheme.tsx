"use client";

import { useRef, useState, useEffect, useContext } from "react";
import { motion, useScroll, useTransform, useSpring, Variants } from "framer-motion";
import Image from "next/image";
import { ThemeContext } from "./ThemeWrapper";
import InvitationCover, { ScrollIndicator } from "./InvitationCover";
import { InvitationData } from "@/data/invitations";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { submitRSVP } from "@/app/[slug]/actions";
import MapSimulation from "@/components/ui/MapSimulation";
import { QRCodeSVG } from "qrcode.react";

export default function CinematicDarkTheme({ data }: { data: InvitationData }) {
  const { isOpened, onOpen } = useContext(ThemeContext);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Smooth scroll progress
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const createCalendarLink = () => {
    const text = encodeURIComponent(`Pernikahan ${data.bride.name} & ${data.groom.name}`);
    const details = encodeURIComponent(`Acara pernikahan ${data.bride.fullName} dan ${data.groom.fullName}.`);
    const location = encodeURIComponent(data.event.locationAddress);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
  };

  // Parallax transforms for Hero
  const heroY = useTransform(smoothProgress, [0, 0.2], ["0%", "20%"]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.3], [1, 1.2]);
  const heroBgScale = useTransform(smoothProgress, [0, 0.4], [1.1, 1.4]);

  // Parallax for Profile Photos
  const leftPhotoY = useTransform(smoothProgress, [0.1, 0.4], ["100px", "-50px"]);
  const rightPhotoY = useTransform(smoothProgress, [0.1, 0.4], ["200px", "0px"]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    const timer = setInterval(() => {
      // Use event.date, but fallback to a default if invalid
      const targetDate = new Date(data.event.date).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (!isNaN(targetDate) && difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(timer);
    };
  }, [data.event.date]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

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
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <>
      <InvitationCover 
        bride={data.bride.name} 
        groom={data.groom.name} 
        onOpen={onOpen} 
        forcedOpen={isOpened}
        variant="cinematic"
        guestName={data.guestName}
        imageUrl={data.couplePhoto}
      />
        <style dangerouslySetInnerHTML={{ __html: `
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
        `}} />
      <div 
        ref={containerRef} 
        className={`transition-opacity duration-1000 w-full bg-[#050505] text-white selection:bg-white/30 relative ${isOpened ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}
      >
        {isOpened && <ScrollIndicator color="#FFFFFF" />}
      {/* Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {data.couplePhoto && (
          <motion.div 
            style={{ scale: heroBgScale }}
            className="absolute inset-0"
          >
            <Image 
              src={data.couplePhoto} 
              fill
              className="object-cover opacity-[0.15] grayscale mix-blend-luminosity" 
              alt="Background"
              priority
            />
          </motion.div>
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

      {/* Noise Texture Overlay - Using optimized paper-texture class */}
      <div className="paper-texture opacity-[0.05]"></div>




      <motion.section 
        className="h-screen flex flex-col items-center justify-center text-center px-4 relative z-10"
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.3 } }
          }}
          className="flex flex-col items-center"
        >
          {data.guestName && (
            <motion.div
              variants={fadeUpVariant}
              className="mb-10 text-center"
            >
              <p className="font-sans uppercase tracking-[0.4em] text-[9px] text-gray-500 mb-2">Special Guest</p>
              <h2 className="font-serif italic text-2xl md:text-3xl text-wedding-gold tracking-wide">
                {data.guestName}
              </h2>
            </motion.div>
          )}

          <motion.p 
            variants={fadeUpVariant}
            className="font-sans uppercase tracking-[0.6em] text-xs text-gray-400 mb-8 ml-[0.6em]"
          >
            The Wedding Celebration
          </motion.p>
          
          <div className="overflow-hidden mb-4">
            <motion.h1 
              variants={{
                hidden: { y: "100%", opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="font-serif text-6xl md:text-9xl font-bold tracking-tighter"
            >
              {data.bride.name}
            </motion.h1>
          </div>
          
          <motion.span 
            variants={{
              hidden: { opacity: 0, scale: 0.5 },
              visible: { opacity: 1, scale: 1, transition: { duration: 1 } }
            }}
            className="font-script text-5xl md:text-7xl text-gray-500 my-4"
          >
            &
          </motion.span>
          
          <div className="overflow-hidden">
            <motion.h1 
              variants={{
                hidden: { y: "-100%", opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="font-serif text-6xl md:text-9xl font-bold tracking-tighter"
            >
              {data.groom.name}
            </motion.h1>
          </div>
        </motion.div>

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
      <section className="py-32 px-4 relative z-10 flex items-center justify-center min-h-screen">
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
              <div className="w-full h-full overflow-hidden rounded-t-full border border-white/20 relative">
                <motion.div style={{ y: leftPhotoY }} className="absolute inset-0 scale-125">
                  <Image 
                    src={data.bride.photo} 
                    fill
                    className="object-cover filter grayscale hover:grayscale-0 transition-all duration-1000" 
                    alt={data.bride.name} 
                  />
                </motion.div>
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
              <div className="w-full h-full overflow-hidden rounded-t-full border border-white/20 relative">
                <motion.div style={{ y: rightPhotoY }} className="absolute inset-0 scale-125">
                  <Image 
                    src={data.groom.photo} 
                    fill
                    className="object-cover filter grayscale hover:grayscale-0 transition-all duration-1000" 
                    alt={data.groom.name} 
                  />
                </motion.div>
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

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block"></div>
            
            <div className="space-y-16">
              {data.loveStory.map((item: any, i: number) => {
                const isStructured = typeof item === 'object' && item !== null;
                const title = isStructured ? item.title : `Chapter ${i + 1}`;
                const date = isStructured ? item.date : "";
                const story = isStructured ? item.story : item;

                return (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`relative flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-white/40 rounded-full -translate-x-1.5 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10 hidden md:block"></div>
                    
                    <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="p-8 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all group">
                        {date && <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 block">{date}</span>}
                        <h4 className="font-serif text-2xl text-white mb-3 group-hover:text-white transition-colors">{title}</h4>
                        <p className="font-sans font-light text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">{story}</p>
                      </div>
                    </div>
                    <div className="hidden md:block md:w-1/2"></div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION (Cinematic Parallax Masonry) */}
      <section className="py-32 px-4 relative z-10 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
            className="text-center mb-24"
          >
            <p className="text-[#D4AF37] uppercase tracking-[0.6em] text-[10px] mb-4 font-bold ml-[0.6em]">Captured Moments</p>
            <h2 className="font-serif text-5xl md:text-7xl text-white">Our Gallery</h2>
          </motion.div>

          {/* Masonry Layout with Bokeh Group Hover */}
          <div className="columns-2 md:columns-3 gap-6 space-y-6 group/gallery">
            {data.gallery?.map((photo: string, index: number) => (
              <GalleryItem key={index} photo={photo} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. EVENT DETAILS */}
      <section className="min-h-screen relative z-10 flex items-center justify-center px-4 py-32 border-t border-white/5">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
          className="text-center max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="bg-white/5 backdrop-blur-md p-6 md:p-16 rounded-3xl border border-white/10">
            <h2 className="font-serif text-2xl md:text-5xl mb-8 tracking-tight uppercase">The Celebration</h2>
            <div className="w-12 h-px bg-white/30 mx-auto mb-12"></div>
            
            <div className="space-y-6 text-gray-300">
              <p className="font-sans text-xl uppercase tracking-[0.3em] font-light text-white ml-[0.3em]">{data.event.date}</p>
              <p className="font-serif text-3xl">{data.event.time}</p>
              
              <div className="pt-12 pb-8 w-full flex justify-center border-y border-white/5 my-8">
                <div className="grid grid-cols-4 gap-6 md:gap-10">
                  <CountdownItem value={timeLeft.days} label="Days" />
                  <CountdownItem value={timeLeft.hours} label="Hours" />
                  <CountdownItem value={timeLeft.minutes} label="Mins" />
                  <CountdownItem value={timeLeft.seconds} label="Secs" />
                </div>
              </div>

              <div className="space-y-2 text-center">
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
          </div>

          <div className="space-y-8">
            <MapSimulation 
              lat={data.event.latitude ?? -6.2088} 
              lng={data.event.longitude ?? 106.8456} 
              locationName={data.event.locationName} 
            />
            
            <div className="bg-white/5 p-8 rounded-3xl flex flex-col items-center gap-4 border border-white/10 backdrop-blur-sm">
              <div className="p-4 bg-white rounded-2xl">
                <QRCodeSVG value={data.event.mapsLink} size={150} fgColor="#000000" />
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-sm mb-1 uppercase tracking-widest">Digital Navigation</p>
                <p className="text-gray-500 text-[10px] italic">Scan for instant directions</p>
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
          
          {/* ELITE BANK CARD DESIGN */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative max-w-sm mx-auto group perspective-1000"
          >
            {/* The Card */}
            <div className="relative aspect-[1.586/1] w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-left overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-white/40 group-hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              
              {/* Metallic Shine Animation */}
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none"
              />

              {/* Card Chip */}
              <div className="w-12 h-10 bg-gradient-to-br from-[#D4AF37] via-[#F9E498] to-[#B8860B] rounded-md mb-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 grid grid-cols-3 grid-rows-3 border border-black/20">
                  <div className="border border-black/10"></div><div className="border border-black/10"></div><div className="border border-black/10"></div>
                  <div className="border border-black/10"></div><div className="border border-black/10"></div><div className="border border-black/10"></div>
                </div>
              </div>

              {/* Card Numbers */}
              <p className="font-serif text-2xl md:text-3xl text-white mb-6 tracking-[0.2em] drop-shadow-lg">{data.gift.accountNumber}</p>
              
              {/* Card Holder */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-gray-500 mb-1">Account Holder</p>
                  <p className="text-sm font-sans font-bold uppercase tracking-widest text-white/90">{data.gift.accountName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] uppercase tracking-widest text-gray-500 mb-1">Bank Name</p>
                  <p className="text-xs font-bold tracking-widest text-[#D4AF37]">{data.gift.bankName}</p>
                </div>
              </div>

              {/* NFC Icon Decor */}
              <div className="absolute top-8 right-8 text-white/20">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 20h2v-2H4v2zm0-4h2v-2H4v2zm0-4h2v-2H4v2zm0-4h2V6H4v2zm4 12h2v-2H8v2zm0-4h2v-2H8v2zm0-4h2v-2H8v2zm0-4h2V6H8v2zm4 12h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V6h-2v2zm4 12h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V6h-2v2z"/></svg>
              </div>
            </div>

              {/* Floating Copy Button */}
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
              onClick={() => handleCopy(data.gift.accountNumber)} 
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-10 py-4 bg-white text-black rounded-full shadow-2xl hover:bg-gray-100 transition-all text-[10px] font-black uppercase tracking-[0.3em] z-20 flex items-center gap-3 whitespace-nowrap"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
              Copy Number
            </motion.button>
          </motion.div>

          {/* QRIS SECTION */}
          {data.gift.qrUrl && (
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
              className="mt-20 flex flex-col items-center"
            >
              <div className="p-4 bg-white rounded-3xl shadow-2xl shadow-white/5">
                <div className="p-2 border-2 border-black/5 rounded-2xl">
                   <img src={data.gift.qrUrl} alt="QRIS" className="w-48 h-48 md:w-64 md:h-64 object-contain" />
                </div>
              </div>
              <p className="mt-6 text-[9px] uppercase tracking-[0.4em] text-gray-500 font-bold">Scan to Give a Gift</p>
            </motion.div>
          )}
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
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm ${guest.attendance === 'Hadir' ? 'bg-green-900/30 text-green-400 border border-green-500/20' : 'bg-red-900/30 text-red-400 border border-red-500/20'}`}>
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

      {/* 8. CLOSING STATEMENT (Final Scene) */}
      <section className="py-48 px-4 relative z-10 overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="w-12 h-px bg-white/20 mx-auto mb-12"></div>
          
          <h3 className="font-serif italic text-2xl md:text-4xl text-gray-200 leading-relaxed tracking-wide mb-24">
            {data.closing_statement || "Terima kasih telah menjadi bagian dari perjalanan cinta kami. Doa restu Anda adalah kado terindah bagi kami."}
          </h3>

              {/* COUNTDOWN TIMER */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
                }}
                className="mt-24 grid grid-cols-4 gap-4 md:gap-12 mb-20 relative"
              >
                {/* Decorative Line */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent via-wedding-gold/30 to-transparent"></div>
                
                <CountdownItem value={timeLeft.days} label="Days" />
                <CountdownItem value={timeLeft.hours} label="Hours" />
                <CountdownItem value={timeLeft.minutes} label="Mins" />
                <CountdownItem value={timeLeft.seconds} label="Secs" />

                {/* Decorative Line Bottom */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-wedding-gold/30 via-wedding-gold/10 to-transparent"></div>
              </motion.div>

          <div className="w-12 h-px bg-white/20 mx-auto mb-20 mt-10"></div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="font-sans uppercase tracking-[0.6em] text-[10px] text-gray-500 ml-[0.6em]"
          >
            Until We Meet Again
          </motion.div>
        </motion.div>

        {/* Decorative Background for Closing */}
        <div className="absolute inset-0 z-[-1] opacity-20 pointer-events-none">
          {data.couplePhoto && (
            <Image 
              src={data.couplePhoto} 
              fill
              className="object-cover grayscale blur-sm" 
              alt="Final Scene"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
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
    </>
  );
}

// --- HELPER COMPONENTS ---

function GalleryItem({ photo, index }: { photo: string; index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Each item drifts differently based on index
  const speed = index % 3 === 0 ? 40 : index % 2 === 0 ? -30 : 20;
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50, clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, delay: (index % 3) * 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative break-inside-avoid group/item overflow-hidden rounded-sm cursor-pointer"
    >
      <motion.div style={{ y }} className="relative aspect-auto">
        <Image 
          src={photo} 
          width={600}
          height={800}
          className="w-full object-cover grayscale group-hover/gallery:grayscale-[0.5] group-hover/item:grayscale-0 group-hover/item:blur-0 group-hover/item:scale-110 transition-all duration-1000 ease-out" 
          alt={`Gallery ${index}`} 
        />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover/item:bg-transparent transition-colors duration-700"></div>
      </motion.div>
    </motion.div>
  );
}

function CountdownItem({ value, label }: { value: number, label: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
      }}
      className="flex flex-col items-center group"
    >
      <div className="relative group">
        <div className="text-4xl md:text-6xl font-serif mb-1 bg-gradient-to-b from-white via-wedding-gold to-wedding-gold/70 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-700">
          {value.toString().padStart(2, '0')}
        </div>
        {/* Subtle Shine Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      </div>
      <div className="text-[7px] md:text-[9px] uppercase tracking-[0.4em] text-wedding-gold font-bold mt-3 opacity-80">{label}</div>
    </motion.div>
  );
}

