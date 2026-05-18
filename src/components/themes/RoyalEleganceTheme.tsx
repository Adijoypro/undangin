"use client";

import { useContext, useState, useRef, useEffect, useCallback } from "react";
import { ThemeContext } from "./ThemeWrapper";
import { motion, useScroll, useTransform, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { InvitationData } from "@/data/invitations";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { submitRSVP } from "@/app/[slug]/actions";
import { toast } from "sonner";
import MapSimulation from '../ui/MapSimulation';
import dynamic from 'next/dynamic';

import LuxuryCSSBackground from "./LuxuryCSSBackground";
const LiquidPhoto = dynamic(() => import('./LiquidPhoto'), { ssr: false });
const ThreeDRings = dynamic(() => import('./ThreeDRings'), { ssr: false });
import EnvelopeCover from "@/components/covers/EnvelopeCover";
import BottomSheet from "@/components/ui/BottomSheet";
import { 
  Copy, 
  MapPin, 
  Calendar, 
  Heart, 
  Gift, 
  Info,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Shirt
} from "lucide-react";
import ThreeDExperiment from "./ThreeDExperiment";

export default function RoyalEleganceTheme({ data }: { data: InvitationData }) {
  const { isOpened, onOpen } = useContext(ThemeContext);

  return (
    <>
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <EnvelopeCover 
            bride={data.bride.nickname || data.bride.fullName} 
            groom={data.groom.nickname || data.groom.fullName} 
            date={data.event.date}
            guestName={data.guestName}
            variant="dark"
            onOpen={onOpen} 
          />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <RoyalEleganceContent data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function RoyalEleganceContent({ data }: { data: InvitationData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isQRISOpen, setIsQRISOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTransition, setShowTransition] = useState(true);
  const [activeStory, setActiveStory] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const storyScrollRef = useRef<HTMLDivElement>(null);

  // Dresscode color palette — can be customized per invitation or fall back to default
  const defaultColors = [
    { name: 'Ivory', hex: '#FDFBF7', textDark: true },
    { name: 'Champagne', hex: '#D4AF37', textDark: true },
    { name: 'Dusty Rose', hex: '#DCAE96', textDark: true },
    { name: 'Charcoal', hex: '#2C2C2C', textDark: false },
    { name: 'Deep Navy', hex: '#0B1021', textDark: false },
  ];

  const hasCustomDresscode = data.dresscode !== undefined;
  const showDresscode = hasCustomDresscode ? data.dresscode?.show : true;
  const dresscodeDescription = hasCustomDresscode ? data.dresscode?.description : 'We kindly encourage our guests to wear tones from our selected color palette.';
  const dresscodeColors = hasCustomDresscode ? (data.dresscode?.colors || []) : defaultColors;

  // Our Story data — enriched from loveStory
  const storyTimeline = [
    { year: '2020', title: 'First Meeting', description: data.loveStory?.[0] || 'Kisah kami bermula dari sebuah pertemuan yang tak terduga, namun takdir telah merangkai semuanya dengan indah.' },
    { year: '2022', title: 'Growing Together', description: data.loveStory?.[1] || 'Seiring waktu berjalan, kami saling menguatkan, membangun mimpi bersama, dan meyakini bahwa cinta ini nyata.' },
    { year: '2024', title: 'The Proposal', description: 'Dengan penuh keberanian dan cinta, sebuah pertanyaan sederhana diucapkan — dan jawaban "Ya" mengubah segalanya.' },
    { year: '2027', title: 'Forever Begins', description: 'Hari yang kami nantikan akhirnya tiba. Sebuah janji suci untuk selamanya, di hadapan keluarga dan sahabat tercinta.' },
  ];

  const createCalendarLink = useCallback((ev?: any) => {
    const activeEvent = ev || data.event;
    const eventTitle = activeEvent.title || "Acara Pernikahan";
    const text = encodeURIComponent(`${eventTitle} - ${data.bride.nickname} & ${data.groom.nickname}`);
    const details = encodeURIComponent(`Undangan pernikahan ${data.bride.fullName} & ${data.groom.fullName}`);
    const location = encodeURIComponent(activeEvent.address || activeEvent.locationAddress || data.event.locationAddress);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
  }, [data]);

  const scrollStory = (dir: 'left' | 'right') => {
    if (!storyScrollRef.current) return;
    const scrollAmount = storyScrollRef.current.offsetWidth * 0.8;
    storyScrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const submitted = localStorage.getItem(`rsvp_${data.slug}`);
    if (submitted) setHasSubmitted(true);

    return () => window.removeEventListener('resize', checkMobile);
  }, [data.slug]);

  const { scrollYProgress } = useScroll();
  
  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const petalsY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const petalsRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40, filter: isMobile ? "none" : "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "none", 
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const sway: Variants = {
    animate: {
      rotate: [0, 1.5, -1.5, 0],
      scale: [1, 1.02, 1],
      transition: {
        duration: 25,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const float: Variants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 0.5, -0.5, 0],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const handleRSVP = async (fd: FormData) => {
    setIsSubmitting(true);
    fd.append("invitation_id", data.id);
    fd.append("slug", data.slug);
    const r = await submitRSVP(fd);
    setIsSubmitting(false);
    if (r.success) { 
      toast.success("Terima kasih atas doa dan konfirmasi Anda."); 
      localStorage.setItem(`rsvp_${data.slug}`, "true");
      setHasSubmitted(true);
      setIsRSVPOpen(false);
    } else {
      toast.error(r.error || "Gagal mengirim pesan.");
    }
  };

  const handleCopy = (t: string) => { 
    navigator.clipboard.writeText(t); 
    toast.success("Nomor rekening tersalin."); 
  };

  if (!isMounted) return null;

  return (
    <div ref={containerRef} className="royal-elegance-container bg-[#02040A] text-[#FDFBF7] min-h-screen relative overflow-hidden font-serif selection:bg-[#D4AF37]/30 selection:text-white">

      {/* Google Fonts Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Pinyon+Script&display=swap');
        
        .font-royal { font-family: 'Cormorant Garamond', serif; }
        .font-script { font-family: 'Pinyon Script', cursive; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0B1021; }
        ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 10px; }
        
        .gold-text-gradient {
          background: linear-gradient(to right, #B38728, #FBF5B7, #D4AF37, #AA771C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
        }

        .noise-overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          pointer-events: none;
          z-index: 1;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .royal-elegance-container + div {
          margin-top: -100px;
          position: relative;
          z-index: 50;
          pointer-events: none;
        }
        .royal-elegance-container + div * {
          pointer-events: auto;
        }
        @media (min-width: 768px) {
          .royal-elegance-container + div {
            margin-top: -120px;
          }
        }
        @media (min-width: 1024px) {
          .royal-elegance-container + div {
            margin-top: -140px;
          }
        }
      `}} />

      {/* Top corner ornaments */}
      <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 md:-top-6 md:-left-6 lg:-top-8 lg:-left-8 w-20 h-20 sm:w-28 sm:h-28 md:w-48 md:h-48 lg:w-64 lg:h-64 pointer-events-none opacity-40 z-30" style={{ transform: "scale(-1, -1)" }}>
         <Image src="/assets/themes/royal-elegance/ornament.webp" alt="ornament" fill className="object-contain" />
      </div>
      <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 md:-top-6 md:-right-6 lg:-top-8 lg:-right-8 w-20 h-20 sm:w-28 sm:h-28 md:w-48 md:h-48 lg:w-64 lg:h-64 pointer-events-none opacity-40 z-30" style={{ transform: "scaleY(-1)" }}>
         <Image src="/assets/themes/royal-elegance/ornament.webp" alt="ornament" fill className="object-contain" />
      </div>

      {/* Bottom corner ornaments (Frames the absolute bottom of the entire page) */}
      <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 pointer-events-none opacity-40 z-30" style={{ transform: "scaleX(-1)" }}>
         <Image src="/assets/themes/royal-elegance/ornament.webp" alt="footer ornament" fill className="object-contain" />
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 pointer-events-none opacity-40 z-30">
         <Image src="/assets/themes/royal-elegance/ornament.webp" alt="footer ornament" fill className="object-contain" />
      </div>

      {/* Cinematic Film Grain */}
      <div className="noise-overlay" />

      {/* Interactive, lightweight CSS Background (Pulsing Glows, Constant Dust, Star Trails) */}
      <LuxuryCSSBackground />

      {/* Velvet Texture Overlay (Kept very subtle) */}
      <div 
        className="fixed inset-0 pointer-events-none z-10 opacity-10 mix-blend-screen"
        style={{
          backgroundImage: "url('/assets/themes/royal-elegance/velvet.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      />

      <div className="relative z-20">
        {/* HERO SECTION */}
        <motion.section 
          className="min-h-[100dvh] flex flex-col items-center justify-center relative px-6 text-center overflow-hidden"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Cinematic Background Image */}
          <motion.div 
             className="absolute inset-0 -z-10 opacity-30 mix-blend-luminosity"
             initial={{ scale: 1.15 }}
             animate={{ scale: 1 }}
             transition={{ duration: 15, ease: "easeOut" }}
          >
             <Image 
                src={data.couplePhoto || "/assets/demo/couple.webp"}
                alt="Background"
                fill
                className="object-cover object-top grayscale"
                priority
             />
             <div className="absolute inset-0 bg-gradient-to-b from-[#02040A]/30 via-[#02040A]/80 to-[#02040A]" />
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col items-center w-full max-w-4xl mx-auto z-10">
            <motion.p variants={fadeUp} className="text-[9px] md:text-[11px] uppercase tracking-[0.6em] text-[#D4AF37] mb-12 font-royal opacity-90 drop-shadow-md">
              The Honor of Your Presence
            </motion.p>
            
            <motion.h1 variants={fadeUp} className="font-royal text-7xl md:text-9xl lg:text-[11rem] tracking-tighter leading-[0.85] mb-8 font-light text-[#FDFBF7]">
              <span className="block">{data.bride.name}</span>
              <span className="block font-script text-5xl md:text-7xl lg:text-8xl text-[#D4AF37] my-6 opacity-80">&</span>
              <span className="block">{data.groom.name}</span>
            </motion.h1>

            {/* Hairline Divider (Minimalist Luxury) */}
            <motion.div variants={fadeUp} className="w-[1px] h-20 md:h-28 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent my-8 opacity-60" />
            
            <motion.p variants={fadeUp} className="font-royal text-sm md:text-base tracking-[0.4em] text-[#FDFBF7]/70 uppercase">
              {data.event.dateFormatted.date} • {data.event.dateFormatted.monthYear}
            </motion.p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 2 }}
            className="absolute bottom-10 flex flex-col items-center gap-2"
          >
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]/60 font-royal">Scroll to discover</p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 text-[#D4AF37]" strokeWidth={1} />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* QUOTE & STORY SECTION */}
        <section className="py-24 md:py-48 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-16 md:gap-24 items-center"
            >
              <motion.div variants={fadeUp} className="order-2 md:order-1 flex flex-col justify-center pl-0 md:pl-12">
                <p className="text-[9px] md:text-[11px] uppercase tracking-[0.5em] text-[#D4AF37] mb-6 font-royal opacity-80">The Prelude</p>
                <h2 className="font-script text-6xl md:text-8xl text-[#FDFBF7] mb-8 font-light">Two Souls</h2>
                <div className="w-16 h-[1px] bg-[#D4AF37] opacity-50 mb-12" />
                <p className="font-royal text-xl md:text-2xl leading-[1.8] text-[#FDFBF7]/90 italic mb-12 font-light">
                  "{data.quote}"
                </p>
                {data.loveStory?.length > 0 && (
                  <div className="space-y-8">
                    {data.loveStory.map((paragraph, idx) => (
                      <p key={idx} className="font-royal text-sm md:text-base leading-[2] tracking-wide text-[#FDFBF7]/60">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div variants={fadeUp} className="order-1 md:order-2 relative h-[70vh] md:h-[90vh] w-full flex items-center justify-center pt-12 md:pt-0 z-30">
                {/* 3D Liquid Photo & Extruded Gold Frame */}
                <div className="relative w-full h-[600px]">
                  <LiquidPhoto src={data.couplePhoto || "/assets/demo/couple.webp"} />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* THE BRIDE & GROOM PROFILES */}
        <section className="py-24 md:py-32 px-6 relative">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-16 md:gap-24 items-start"
            >
              {/* Groom Profile Card */}
              <motion.div variants={fadeUp} className="flex flex-col items-center text-center">
                {/* Elegant gold frame for profile photo */}
                <div className="relative w-64 h-80 mb-8 p-[1px] bg-gradient-to-b from-[#D4AF37]/50 via-[#D4AF37]/10 to-transparent rounded-t-full overflow-hidden shadow-2xl group cursor-default">
                  <div className="absolute inset-0 bg-[#02040A] rounded-t-full overflow-hidden">
                    <Image 
                      src={data.groom.photo || "/assets/demo/groom.webp"}
                      alt={data.groom.name}
                      fill
                      className="object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.2s] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02040A]/60 via-transparent to-transparent" />
                  </div>
                  {/* Outer delicate gold ring */}
                  <div className="absolute inset-0 border border-[#D4AF37]/20 rounded-t-full pointer-events-none group-hover:border-[#D4AF37]/50 transition-colors duration-700" />
                </div>

                <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] mb-2 font-royal">The Groom</p>
                <h3 className="font-royal text-3xl md:text-4xl text-[#FDFBF7] mb-4 tracking-wide font-light">{data.groom.fullName}</h3>
                
                <div className="w-12 h-[1px] bg-[#D4AF37]/30 my-4" />
                
                <p className="font-royal text-sm text-[#FDFBF7]/60 leading-relaxed max-w-sm">
                  Putra terkasih dari <br />
                  <span className="text-[#FDFBF7]/80 font-medium mt-1 block">
                    {data.groom.parents || (data.groom_father && data.groom_mother ? `Bapak ${data.groom_father} & Ibu ${data.groom_mother}` : '')}
                  </span>
                </p>
              </motion.div>

              {/* Bride Profile Card */}
              <motion.div variants={fadeUp} className="flex flex-col items-center text-center">
                {/* Elegant gold frame for profile photo */}
                <div className="relative w-64 h-80 mb-8 p-[1px] bg-gradient-to-b from-[#D4AF37]/50 via-[#D4AF37]/10 to-transparent rounded-t-full overflow-hidden shadow-2xl group cursor-default">
                  <div className="absolute inset-0 bg-[#02040A] rounded-t-full overflow-hidden">
                    <Image 
                      src={data.bride.photo || "/assets/demo/bride.webp"}
                      alt={data.bride.name}
                      fill
                      className="object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.2s] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02040A]/60 via-transparent to-transparent" />
                  </div>
                  {/* Outer delicate gold ring */}
                  <div className="absolute inset-0 border border-[#D4AF37]/20 rounded-t-full pointer-events-none group-hover:border-[#D4AF37]/50 transition-colors duration-700" />
                </div>

                <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] mb-2 font-royal">The Bride</p>
                <h3 className="font-royal text-3xl md:text-4xl text-[#FDFBF7] mb-4 tracking-wide font-light">{data.bride.fullName}</h3>
                
                <div className="w-12 h-[1px] bg-[#D4AF37]/30 my-4" />
                
                <p className="font-royal text-sm text-[#FDFBF7]/60 leading-relaxed max-w-sm">
                  Putri terkasih dari <br />
                  <span className="text-[#FDFBF7]/80 font-medium mt-1 block">
                    {data.bride.parents || (data.bride_father && data.bride_mother ? `Bapak ${data.bride_father} & Ibu ${data.bride_mother}` : '')}
                  </span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 3D RINGS DIVIDER */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="w-full flex justify-center -my-24 relative z-20 pointer-events-none"
        >
          <ThreeDRings />
        </motion.div>

        {/* EVENT DETAILS SECTION */}
        <section className="py-32 md:py-48 px-6 relative">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.p variants={fadeUp} className="font-royal text-[#D4AF37] tracking-[0.6em] uppercase text-[9px] mb-6 opacity-80">The Grand Celebration</motion.p>
              <motion.h2 variants={fadeUp} className="font-royal text-5xl md:text-7xl text-[#FDFBF7] mb-12 font-light">Symphony of Love</motion.h2>
              <motion.div variants={fadeUp} className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent mx-auto mb-24 opacity-50" />

              <div className="flex flex-col items-center gap-24 w-full">
                {(data.events && data.events.length > 0 ? data.events : [data.event]).map((event: any, index: number) => {
                  const eventTitle = event.title || (index === 0 ? "Akad Nikah" : "Resepsi Pernikahan");
                  const eventDate = event.date || data.event.date;
                  const eventTime = event.time || data.event.time;
                  const eventLocationName = event.location || event.locationName || data.event.locationName;
                  const eventAddress = event.address || event.locationAddress || data.event.locationAddress;
                  const eventMapsLink = event.maps_link || event.mapsLink || data.event.mapsLink;
                  const eventLat = event.latitude || data.event.latitude || -6.2088;
                  const eventLng = event.longitude || data.event.longitude || 106.8456;

                  return (
                    <motion.div key={index} variants={fadeUp} className="w-full flex flex-col items-center space-y-16">
                      <div className="space-y-6">
                        <h3 className="font-script text-5xl md:text-7xl text-[#D4AF37] opacity-90">{eventTitle}</h3>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-[#FDFBF7]/80">
                          <div className="flex items-center gap-3 font-royal text-lg tracking-[0.3em] uppercase">
                             {eventDate}
                          </div>
                          <div className="hidden md:block w-[1px] h-8 bg-[#D4AF37]/30"></div>
                          <div className="font-royal text-lg tracking-[0.3em] uppercase">
                             {eventTime}
                          </div>
                        </div>
                      </div>
                      
                      <div className="inline-block p-[1px] bg-gradient-to-b from-[#D4AF37]/40 to-transparent relative w-full max-w-xl">
                        <div className="bg-[#02040A] p-6 sm:p-10 md:p-16 relative overflow-hidden flex flex-col items-center">
                          
                          <h4 className="font-royal text-xl md:text-2xl text-[#D4AF37] mb-6 uppercase tracking-[0.3em]">{eventLocationName}</h4>
                          <p className="font-royal text-sm md:text-base text-[#FDFBF7]/60 max-w-sm mx-auto mb-12 leading-[2]">
                            {eventAddress}
                          </p>
                          
                          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                            <a 
                              href={eventMapsLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-transparent border border-[#D4AF37] text-[#D4AF37] font-royal tracking-[0.3em] uppercase text-xs overflow-hidden"
                            >
                              <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
                              <MapPin className="w-4 h-4 relative z-10 group-hover:text-[#02040A] transition-colors" /> 
                              <span className="relative z-10 group-hover:text-[#02040A] transition-colors">Navigation</span>
                            </a>
                            <a 
                              href={createCalendarLink(event)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-transparent border border-[#D4AF37]/40 text-[#D4AF37]/80 font-royal tracking-[0.3em] uppercase text-xs overflow-hidden hover:border-[#D4AF37]"
                            >
                              <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
                              <Calendar className="w-4 h-4 relative z-10 group-hover:text-[#02040A] transition-colors" /> 
                              <span className="relative z-10 group-hover:text-[#02040A] transition-colors">Calendar</span>
                            </a>
                          </div>

                          {/* Inline Map Simulation inside each Event Card */}
                          <div className="w-full h-[200px] rounded-lg overflow-hidden relative border border-[#D4AF37]/20">
                            <MapSimulation 
                              lat={eventLat} 
                              lng={eventLng} 
                              locationName={eventLocationName} 
                              className="w-full h-full saturate-50 sepia-[.1]"
                            />
                            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(2,4,10,0.8)] pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* OUR STORY SECTION */}
        <section className="py-32 md:py-48 px-0 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center"
            >
              <motion.p variants={fadeUp} className="font-royal text-[#D4AF37] tracking-[0.6em] uppercase text-[9px] mb-6 opacity-80">Our Journey</motion.p>
              <motion.h2 variants={fadeUp} className="font-script text-6xl md:text-8xl text-[#FDFBF7] mb-8">Love Story</motion.h2>
              <motion.div variants={fadeUp} className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent mx-auto opacity-50" />
            </motion.div>
          </div>

          {/* Horizontal Scroll Timeline */}
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={() => scrollStory('left')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-[#D4AF37]/30 bg-[#02040A]/80 backdrop-blur-sm flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02040A] transition-all duration-300 hidden md:flex"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollStory('right')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-[#D4AF37]/30 bg-[#02040A]/80 backdrop-blur-sm flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#02040A] transition-all duration-300 hidden md:flex"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Timeline Line */}
            <div className="absolute top-[40px] left-0 right-0 h-[1px] bg-[#D4AF37]/20 z-10" />

            <div
              ref={storyScrollRef}
              className="flex gap-8 overflow-x-auto scrollbar-hide px-6 md:px-20 pb-8 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {storyTimeline.map((story, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.15 }}
                  className="flex-shrink-0 w-[85vw] sm:w-[380px] snap-center"
                >
                  {/* Year Marker */}
                  <div className="flex flex-col items-center mb-10">
                    <div className="w-4 h-4 rounded-full bg-[#D4AF37] border-4 border-[#02040A] relative z-20 shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
                    <div className="w-[1px] h-8 bg-gradient-to-b from-[#D4AF37] to-transparent" />
                    <span className="font-royal text-3xl md:text-4xl text-[#D4AF37] mt-2 tracking-wider">{story.year}</span>
                  </div>

                  {/* Story Card */}
                  <div className="group relative p-[1px] bg-gradient-to-b from-[#D4AF37]/40 via-[#D4AF37]/10 to-transparent">
                    <div className="bg-[#02040A] p-8 md:p-10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-[#D4AF37]/20" />
                      <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-[#D4AF37]/20" />
                      
                      <h4 className="font-royal text-xl md:text-2xl text-[#D4AF37] mb-4 uppercase tracking-[0.2em]">{story.title}</h4>
                      <p className="font-royal text-sm md:text-base leading-[2] text-[#FDFBF7]/60">
                        {story.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile swipe hint */}
            <p className="text-center text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]/40 font-royal mt-4 md:hidden">Swipe to read →</p>
          </div>
        </section>

        {/* DRESSCODE SECTION */}
        {showDresscode && dresscodeColors.length > 0 && (
          <section className="py-32 md:py-40 px-6 relative">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.p variants={fadeUp} className="font-royal text-[#D4AF37] tracking-[0.6em] uppercase text-[9px] mb-6 opacity-80">The Attire</motion.p>
                <motion.h2 variants={fadeUp} className="font-royal text-4xl md:text-6xl text-[#FDFBF7] mb-6 font-light uppercase tracking-[0.15em]">Dresscode</motion.h2>
                <motion.div variants={fadeUp} className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent mx-auto mb-12 opacity-50" />
                {dresscodeDescription && (
                  <motion.p variants={fadeUp} className="font-royal text-base md:text-lg text-[#FDFBF7]/60 max-w-md mx-auto mb-16 leading-relaxed">
                    {dresscodeDescription}
                  </motion.p>
                )}

                {/* Color Swatches */}
                <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-6 md:gap-8">
                  {dresscodeColors.map((color, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      whileHover={{ scale: 1.08, y: -5 }}
                      className="group flex flex-col items-center gap-4 cursor-default"
                    >
                      <div
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-[#D4AF37]/30 shadow-lg group-hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all duration-500"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="font-royal text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#FDFBF7]/50 group-hover:text-[#D4AF37] transition-colors">
                        {color.name}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Dress icon accent */}
                <motion.div variants={fadeUp} className="mt-16 flex items-center justify-center gap-4">
                  <div className="w-12 h-[1px] bg-[#D4AF37]/20" />
                  <Shirt className="w-5 h-5 text-[#D4AF37]/40" strokeWidth={1} />
                  <div className="w-12 h-[1px] bg-[#D4AF37]/20" />
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}

        {/* CINEMATIC GALLERY SECTION */}
        {data.gallery && data.gallery.length > 0 && (
          <section className="py-32 md:py-48 px-6 relative">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="text-center mb-20"
              >
                <motion.p variants={fadeUp} className="font-royal text-[#D4AF37] tracking-[0.6em] uppercase text-[9px] mb-6 opacity-80">Captured Moments</motion.p>
                <motion.h2 variants={fadeUp} className="font-script text-6xl md:text-8xl text-[#FDFBF7] mb-8">Gallery</motion.h2>
                <motion.div variants={fadeUp} className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent mx-auto opacity-50" />
              </motion.div>

              {/* Staggered Masonry Grid */}
              <div className="columns-2 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
                {data.gallery.map((photo, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="group relative overflow-hidden cursor-pointer break-inside-avoid"
                    style={{ aspectRatio: idx % 3 === 0 ? '3/4' : idx % 3 === 1 ? '1/1' : '4/5' }}
                    onClick={() => setLightboxIndex(idx)}
                  >
                    {/* Gold border frame */}
                    <div className="absolute inset-0 border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/40 transition-all duration-700 z-10" />
                    
                    {/* Corner accents on hover */}
                    <div className="absolute top-0 left-0 w-0 h-0 border-t-2 border-l-2 border-[#D4AF37]/0 group-hover:w-8 group-hover:h-8 group-hover:border-[#D4AF37]/60 transition-all duration-500 z-10" />
                    <div className="absolute bottom-0 right-0 w-0 h-0 border-b-2 border-r-2 border-[#D4AF37]/0 group-hover:w-8 group-hover:h-8 group-hover:border-[#D4AF37]/60 transition-all duration-500 z-10" />

                    <Image
                      src={photo}
                      alt={`Gallery ${idx + 1}`}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.2s] ease-out"
                    />

                    {/* Cinematic overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02040A]/60 via-transparent to-[#02040A]/20 opacity-100 group-hover:opacity-0 transition-opacity duration-700" />
                    
                    {/* Photo number */}
                    <span className="absolute bottom-3 right-3 font-royal text-[10px] tracking-[0.3em] text-[#D4AF37]/0 group-hover:text-[#D4AF37]/60 transition-all duration-500 z-10">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* GALLERY LIGHTBOX */}
        <AnimatePresence>
          {lightboxIndex !== null && data.gallery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setLightboxIndex(null)}
            >
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev/Next */}
              {lightboxIndex > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {lightboxIndex < data.gallery.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              <motion.div
                key={lightboxIndex}
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                className="relative w-full max-w-3xl aspect-[3/4] md:aspect-[4/3] cursor-grab active:cursor-grabbing"
                onClick={(e) => e.stopPropagation()}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(e, info) => {
                  if (Math.abs(info.offset.y) > 100) {
                    setLightboxIndex(null);
                  }
                }}
              >
                <Image
                  src={data.gallery[lightboxIndex]}
                  alt={`Gallery ${lightboxIndex + 1}`}
                  fill
                  className="object-contain"
                />
                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-royal text-xs tracking-[0.4em] text-[#D4AF37]/60 uppercase">
                  {String(lightboxIndex + 1).padStart(2, '0')} / {String(data.gallery.length).padStart(2, '0')}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RSVP & GIFT SECTION */}
        <section className="py-32 md:py-48 px-6 relative">
          <div className="max-w-5xl mx-auto">
             <div className="flex flex-col items-center text-center mb-24">
                <p className="text-[9px] uppercase tracking-[0.5em] text-[#D4AF37] mb-6 font-royal opacity-80">Cordial Wishes</p>
                <h2 className="font-script text-6xl md:text-8xl text-[#FDFBF7] mb-8">RSVP & Gifts</h2>
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent opacity-50" />
             </div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-12 md:gap-20"
            >
              {/* RSVP Card */}
              <motion.div variants={fadeUp} className="group relative border border-[#D4AF37]/30 p-6 sm:p-12 md:p-20 flex flex-col items-center text-center overflow-hidden bg-[#D4AF37]/5">
                <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                <h3 className="relative z-10 font-royal text-2xl md:text-3xl text-[#D4AF37] mb-6 uppercase tracking-widest">Attendance</h3>
                <p className="relative z-10 font-royal text-lg text-[#FDFBF7]/70 mb-12 leading-relaxed">
                  Join us as we embark on this beautiful journey. Your confirmation brings us immense joy.
                </p>
                
                {hasSubmitted ? (
                  <div className="relative z-10 py-10 px-8 bg-[#D4AF37]/10 border border-[#D4AF37]/40 w-full text-center">
                    <Heart className="w-10 h-10 text-[#D4AF37] mx-auto mb-4 animate-pulse" />
                    <h4 className="font-royal text-2xl text-[#D4AF37] mb-2 uppercase tracking-widest">Confirmed</h4>
                    <p className="font-royal text-xs text-[#FDFBF7]/60 tracking-[0.3em] uppercase">See you there</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsRSVPOpen(true)}
                    className="relative z-10 w-full py-5 bg-[#D4AF37] text-[#02040A] font-royal text-sm font-bold uppercase tracking-[0.4em] hover:bg-white hover:scale-[1.02] transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                  >
                    R.S.V.P
                  </button>
                )}
              </motion.div>

              {/* GIFT Card */}
              <motion.div variants={fadeUp} className="group relative border border-[#D4AF37]/30 p-6 sm:p-12 md:p-20 flex flex-col items-center text-center overflow-hidden bg-[#D4AF37]/5">
                <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                <h3 className="relative z-10 font-royal text-2xl md:text-3xl text-[#D4AF37] mb-6 uppercase tracking-widest">Wedding Gift</h3>
                <p className="relative z-10 font-royal text-lg text-[#FDFBF7]/70 mb-12 leading-relaxed">
                   To celebrate our union, we would be grateful for your prayers and support through this digital envelope.
                </p>
                
                <button 
                  onClick={() => setIsQRISOpen(true)}
                  className="relative z-10 w-full py-5 bg-transparent border border-[#D4AF37] text-[#D4AF37] font-royal text-sm font-bold uppercase tracking-[0.4em] hover:bg-[#D4AF37] hover:text-[#02040A] hover:scale-[1.02] transition-all duration-500"
                >
                  <Gift className="w-4 h-4 inline-block mr-2 -mt-1" /> Digital Envelope
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* WALL OF LOVE (GUESTBOOK) */}
        <section className="py-32 md:py-48 px-6 relative">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-20"
            >
              <motion.p variants={fadeUp} className="font-royal text-[#D4AF37] tracking-[0.6em] uppercase text-[9px] mb-6 opacity-80">Wall of Love</motion.p>
              <motion.h2 variants={fadeUp} className="font-script text-6xl md:text-8xl text-[#FDFBF7] mb-8">Wishes & Prayers</motion.h2>
              <motion.div variants={fadeUp} className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent mx-auto opacity-50" />
            </motion.div>

            <div className="max-h-[70vh] overflow-y-auto pr-2 md:pr-8 space-y-8 scrollbar-thin scrollbar-thumb-[#D4AF37]/30 scrollbar-track-transparent">
              <AnimatePresence mode="popLayout">
                {data.guestbook && data.guestbook.length > 0 ? (
                  data.guestbook.map((guest, idx) => (
                    <motion.div 
                      key={guest.id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-gradient-to-br from-[#0B1021]/80 to-[#02040A] p-8 md:p-12 border border-[#D4AF37]/20 rounded-2xl relative group hover:border-[#D4AF37]/50 transition-all duration-700"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="font-royal text-xl md:text-2xl text-[#FDFBF7] tracking-wider mb-2">{guest.name}</h4>
                          <span className={`font-royal text-[9px] uppercase tracking-[0.3em] px-3 py-1 border ${guest.attendance === 'Hadir' ? 'border-[#D4AF37]/40 text-[#D4AF37]' : 'border-[#FDFBF7]/20 text-[#FDFBF7]/60'} rounded-full`}>
                            {guest.attendance}
                          </span>
                        </div>
                        <button 
                          onClick={() => (window as any).handleDeleteEntry?.(guest.id)}
                          className="guest-entry-delete hidden p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                      <div className="w-12 h-[1px] bg-[#D4AF37]/30 mb-6" />
                      <p className="font-royal text-lg leading-relaxed text-[#FDFBF7]/80 italic font-light">"{guest.message}"</p>
                      
                      <div className="absolute top-0 right-0 p-4 w-16 h-16 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none">
                        <Image src="/assets/themes/royal-elegance/ornament.webp" alt="ornament" fill className="object-contain" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center font-royal text-[#FDFBF7]/50 text-xl italic tracking-widest py-20">Be the first to send a wish.</p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* CLOSING SECTION */}
        <section className="py-48 px-6 flex flex-col items-center justify-center text-center relative overflow-visible">
          {/* Big background flourishes removed as per request */}

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-3xl mx-auto relative z-10"
          >
            <p className="font-royal text-[#D4AF37] tracking-[0.6em] uppercase text-xs mb-16">May our path be blessed</p>
            <h2 className="font-script text-6xl md:text-8xl text-[#D4AF37] mb-12">With Deepest Love,</h2>
            <h3 className="font-royal text-4xl md:text-7xl text-[#FDFBF7] mb-6 uppercase tracking-[0.2em]">
              {data.bride.nickname} & {data.groom.nickname}
            </h3>
            
            <div className="w-full max-w-xs h-16 relative mx-auto my-12">
               <Image src="/assets/themes/royal-elegance/divider.webp" alt="divider" fill className="object-contain" />
            </div>

            <p className="font-royal text-lg text-[#FDFBF7]/50 tracking-[0.4em] uppercase">
              Jakarta • 2027
            </p>
          </motion.div>
         </section>

      </div>

      {/* RSVP BOTTOM SHEET */}
      <BottomSheet isOpen={isRSVPOpen} onClose={() => setIsRSVPOpen(false)} title="Confirmation">
        <form action={handleRSVP} className="space-y-8 font-royal py-6">
          <div className="space-y-2">
            <label className="block text-[#D4AF37] text-xs tracking-[0.3em] uppercase">Full Name</label>
            <input 
              name="name" 
              required 
              defaultValue={data.guestName}
              className="w-full bg-[#D4AF37]/5 border-b border-[#D4AF37]/30 text-[#0B1021] px-0 py-4 focus:outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#0B1021]/30"
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[#D4AF37] text-xs tracking-[0.3em] uppercase">Attendance</label>
            <div className="grid grid-cols-2 gap-4">
               <label className="relative cursor-pointer group">
                  <input type="radio" name="attendance" value="Hadir" defaultChecked className="peer sr-only" />
                  <div className="py-4 border border-[#D4AF37]/20 text-center peer-checked:bg-[#D4AF37] peer-checked:text-[#0B1021] transition-all duration-300 tracking-widest text-sm uppercase">Accept</div>
               </label>
               <label className="relative cursor-pointer group">
                  <input type="radio" name="attendance" value="Tidak Hadir" className="peer sr-only" />
                  <div className="py-4 border border-[#D4AF37]/20 text-center peer-checked:bg-[#D4AF37] peer-checked:text-[#0B1021] transition-all duration-300 tracking-widest text-sm uppercase">Decline</div>
               </label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-[#D4AF37] text-xs tracking-[0.3em] uppercase">Your Wishes</label>
            <textarea 
              name="message" 
              required 
              rows={4}
              className="w-full bg-[#D4AF37]/5 border border-[#D4AF37]/30 text-[#0B1021] px-4 py-4 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none placeholder:text-[#0B1021]/30"
              placeholder="Share your warm thoughts..."
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-5 bg-[#D4AF37] text-[#0B1021] font-bold tracking-[0.4em] uppercase disabled:opacity-50 hover:bg-white transition-all shadow-2xl"
          >
            {isSubmitting ? "Processing..." : "Submit Response"}
          </button>
        </form>
      </BottomSheet>

      {/* GIFT BOTTOM SHEET */}
      <BottomSheet isOpen={isQRISOpen} onClose={() => setIsQRISOpen(false)} title="Wedding Gift">
        <div className="flex flex-col items-center text-center space-y-10 py-10 font-royal">
          <div className="relative p-6 border border-[#D4AF37]/20 rounded-full">
             <Gift className="w-16 h-16 text-[#D4AF37]" strokeWidth={0.5} />
          </div>
          
          <p className="text-[#0B1021]/80 text-xl leading-relaxed italic px-4">
            "Your love and presence are the greatest gifts of all."
          </p>
          
          <div className="w-full p-8 border border-[#D4AF37]/30 bg-[#D4AF37]/5 relative overflow-hidden">
            {/* Ornament removed for clean look */}

            <p className="text-[#D4AF37] uppercase tracking-[0.4em] text-xs mb-4">{data.gift.bankName}</p>
            <p className="text-3xl text-[#0B1021] tracking-[0.2em] mb-4 font-mono">{data.gift.accountNumber}</p>
            <p className="text-[#0B1021]/60 mb-10 tracking-widest uppercase text-sm">A/N {data.gift.accountName}</p>
            
            <button 
              onClick={() => handleCopy(data.gift.accountNumber)}
              className="group relative flex items-center justify-center gap-3 w-full py-5 border border-[#D4AF37] text-[#D4AF37] uppercase tracking-[0.3em] text-xs overflow-hidden transition-all duration-500"
            >
              <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
              <Copy className="w-4 h-4 relative z-10 group-hover:text-[#0B1021] transition-colors" /> 
              <span className="relative z-10 group-hover:text-[#0B1021] transition-colors">Copy Details</span>
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
