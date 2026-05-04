"use client";

import { motion, useScroll, useTransform, AnimatePresence, Variants } from "framer-motion";
import { useRef, useState, useEffect, useContext } from "react";
import { ThemeContext } from "./ThemeWrapper";
import InvitationCover, { ScrollIndicator } from "./InvitationCover";
import Image from "next/image";
import MapSimulation from "@/components/ui/MapSimulation";
import { QRCodeSVG } from "qrcode.react";
import { 
  QrCode, 
  Copy, 
  MapPin, 
  Calendar, 
  Heart, 
  Gift, 
  Info,
  ChevronDown,
  Navigation,
  Quote
} from "lucide-react";


import { InvitationData } from "@/data/invitations";
import { submitRSVP } from "@/app/[slug]/actions";
import { toast } from "sonner";
import BottomSheet from "@/components/ui/BottomSheet";


export default function MajesticEternityTheme({ data }: { data: InvitationData }) {
  const { isOpened, onOpen } = useContext(ThemeContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isQRISOpen, setIsQRISOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Scroll animations
  const { scrollYProgress } = useScroll({ target: containerRef });
  const storyProgress = useTransform(scrollYProgress, [0.3, 0.6], ["0%", "100%"]);


  const handleRSVP = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.append("invitation_id", data.id);
    formData.append("slug", data.slug);
    const result = await submitRSVP(formData);
    setIsSubmitting(false);
    if (result.success) {
      toast.success("Terima kasih atas doa dan konfirmasi Anda.");
      setIsRSVPOpen(false);
    } else {
      toast.error("Gagal mengirim, silakan coba lagi.");
    }
  };


  const createCalendarLink = () => {
    const text = encodeURIComponent(`Pernikahan ${data.bride.name} & ${data.groom.name}`);
    const details = encodeURIComponent(`Acara pernikahan ${data.bride.fullName} dan ${data.groom.fullName}.`);
    const location = encodeURIComponent(data.event.locationAddress);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
  };

  const colors = {
    bg: "#0A1C14", // Deep Emerald
    gold: "#D4AF37",
    text: "#FFFFFF"
  };

  const Divider = () => (
    <div className="flex items-center justify-center py-16 opacity-60">
      <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
      <div className="relative w-32 h-12 mx-4 mix-blend-screen">
        <Image 
          src="/assets/nusantara_divider.webp" 
          alt="Divider" 
          fill 
          className="object-contain"
        />
      </div>
      <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
    </div>
  );

  return (
    <>
      <InvitationCover 
        bride={data.bride.name} 
        groom={data.groom.name} 
        onOpen={onOpen} 
        forcedOpen={isOpened}
        variant="majestic"
      />
      <div className={`transition-opacity duration-1000 w-full min-h-screen ${isOpened ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        {isOpened && <ScrollIndicator color="#D4AF37" />}
        <div className="min-h-screen font-sans selection:bg-[#D4AF37] selection:text-black bg-[#0A1C14] text-white overflow-x-hidden relative" ref={containerRef}>

      {/* Main Content */}
      <div className="relative z-10 pb-32">

        {/* HERO */}
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          {/* Nusantara Corner Ornaments - Framing the Entrance */}
          <div className="absolute top-0 left-0 w-28 h-28 md:w-56 md:h-56 opacity-60 pointer-events-none z-20 mix-blend-screen">
            <Image 
              src="/assets/branding/final/nusantara_corner_ornament_luxury_gold_3d_final_v1_1777373271596.webp" 
              alt="Ornament" 
              fill 
              className="object-contain"
            />
          </div>
          <div className="absolute top-0 right-0 w-28 h-28 md:w-56 md:h-56 opacity-60 pointer-events-none z-20 mix-blend-screen -scale-x-100">
            <Image 
              src="/assets/branding/final/nusantara_corner_ornament_luxury_gold_3d_final_v1_1777373271596.webp" 
              alt="Ornament" 
              fill 
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-0 left-0 w-28 h-28 md:w-56 md:h-56 opacity-60 pointer-events-none z-20 mix-blend-screen -scale-y-100">
            <Image 
              src="/assets/branding/final/nusantara_corner_ornament_luxury_gold_3d_final_v1_1777373271596.webp" 
              alt="Ornament" 
              fill 
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-28 h-28 md:w-56 md:h-56 opacity-60 pointer-events-none z-20 mix-blend-screen rotate-180">
            <Image 
              src="/assets/branding/final/nusantara_corner_ornament_luxury_gold_3d_final_v1_1777373271596.webp" 
              alt="Ornament" 
              fill 
              className="object-contain"
            />
          </div>

          <div className="absolute inset-0 bg-[#0A1C14]">
            {(data.couplePhoto || data.bride.photo) ? (
              <Image src={data.couplePhoto || data.bride.photo} alt="Hero" fill className="object-cover opacity-30 mix-blend-luminosity" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-[#0A1C14] to-black"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1C14] via-transparent to-[#0A1C14]/50"></div>
          </div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="relative z-10 w-full max-w-2xl"
          >
            <p className="font-serif text-[#D4AF37] text-sm uppercase tracking-[0.4em] mb-8 ml-[0.4em]">The Wedding Of</p>
            <h1 className="font-script text-2xl sm:text-6xl md:text-9xl text-white drop-shadow-[0_0_20px_rgba(212,175,55,0.3)] mb-4">{data.bride.name}</h1>
            <p className="font-serif text-2xl md:text-3xl text-[#D4AF37] italic my-2">&</p>
            <h1 className="font-script text-2xl sm:text-6xl md:text-9xl text-white drop-shadow-[0_0_20px_rgba(212,175,55,0.3)] mb-12">{data.groom.name}</h1>

            <div className="inline-block border-y border-[#D4AF37]/50 py-4 px-12">
              <p className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-gray-300">{data.event.date}</p>
            </div>
          </motion.div>
        </section>
        
        {/* QUOTE SECTION */}
        <section className="py-24 px-6 relative overflow-hidden bg-[#0A1C14]">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-4xl mx-auto text-center relative z-10"
          >
            <div className="w-16 h-px bg-[#D4AF37]/30 mx-auto mb-10"></div>
            <p className="font-serif italic text-xl md:text-2xl text-gray-300 leading-relaxed mb-10">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
            </p>
            <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">QS. Ar-Rum: 21</p>
            <div className="w-16 h-px bg-[#D4AF37]/30 mx-auto mt-10"></div>
          </motion.div>
        </section>


        {/* DRAW ON SCROLL LOVE STORY (WOW FACTOR 2) */}
        <section className="py-32 px-6 relative bg-[#0A1C14]">
          <div className="max-w-4xl mx-auto text-center mb-20 relative z-10">
            <h2 className="font-serif text-2xl sm:text-4xl text-[#D4AF37] mb-4">A Journey to Eternity</h2>
            <p className="text-gray-400 font-light max-w-xl mx-auto">Setiap langkah membawa kami lebih dekat kepada takdir.</p>
          </div>

          <div className="relative max-w-2xl mx-auto py-10">
            {/* The SVG Line that draws itself */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 transform md:-translate-x-1/2"></div>
            <motion.div
              style={{ height: storyProgress }}
              className="absolute left-[20px] md:left-1/2 top-0 w-[2px] bg-gradient-to-b from-[#D4AF37] to-[#F3E5AB] transform md:-translate-x-1/2 origin-top shadow-[0_0_15px_#D4AF37]"
            />

            {/* Timeline Items */}
            <div className="space-y-32 relative z-10">
              {data.loveStory.map((item: any, i: number) => {
                const isStructured = typeof item === 'object' && item !== null;
                const title = isStructured ? item.title : `Chapter ${i + 1}`;
                const date = isStructured ? item.date : "";
                const story = isStructured ? item.story : item;

                return (
                  <div key={i} className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} pl-16`}>
                      <span className="text-[#D4AF37] font-serif text-sm uppercase tracking-widest block mb-1">{date}</span>
                      <span className="text-white font-serif text-2xl italic block mb-2">{title}</span>
                      <p className="text-gray-300 text-sm font-light leading-relaxed italic">"{story}"</p>
                    </div>
                    <div className="absolute left-[15px] md:left-1/2 w-3 h-3 rounded-full bg-[#0A1C14] border-2 border-[#D4AF37] transform md:-translate-x-1/2 mt-1.5 md:mt-0 transition-all duration-500 group-hover:scale-150 group-hover:bg-[#D4AF37] shadow-[0_0_20px_#D4AF37]"></div>
                    <div className="hidden md:block md:w-1/2"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <Divider />


        {/* BRIDE & GROOM */}
        <section className="py-24 px-6 bg-[#06120C]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">

              {/* Bride */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="w-full md:w-1/2 flex flex-col items-center text-center"
              >
                <div className="relative mb-12 group">
                  <div className="absolute -inset-4 border border-[#D4AF37]/20 rounded-t-full pointer-events-none group-hover:border-[#D4AF37]/40 transition-colors duration-700"></div>
                  <div className="w-72 h-96 md:w-[350px] md:h-[480px] overflow-hidden rounded-t-full border border-[#D4AF37]/20 p-2 relative z-10">
                    <Image
                      src={data.bride.photo}
                      fill
                      className="object-cover rounded-t-full transition-all duration-1000"
                      alt={data.bride.name}
                    />
                  </div>
                </div>
                <h3 className="text-xl md:text-5xl mb-4 font-script text-white drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">{data.bride.name}</h3>
                <p className="font-serif text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] mb-6 ml-[0.4em]">Mempelai Wanita</p>
                <div className="w-12 h-px bg-[#D4AF37]/30 mb-6"></div>
                <p className="text-base text-gray-400 italic font-light max-w-xs leading-relaxed">
                  {data.bride_father && data.bride_mother
                    ? `Putri dari Bpk. ${data.bride_father} & Ibu ${data.bride_mother}`
                    : data.bride.parents
                  }
                </p>
              </motion.div>

              <div className="hidden md:block font-script text-6xl text-[#D4AF37] opacity-30 self-center mt-[-100px]">&</div>

              {/* Groom */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="w-full md:w-1/2 flex flex-col items-center text-center md:mt-48"
              >
                <div className="relative mb-12 group">
                  <div className="absolute -inset-4 border border-[#D4AF37]/20 rounded-t-full pointer-events-none group-hover:border-[#D4AF37]/40 transition-colors duration-700"></div>
                  <div className="w-72 h-96 md:w-[350px] md:h-[480px] overflow-hidden rounded-t-full border border-[#D4AF37]/20 p-2 relative z-10">
                    <Image
                      src={data.groom.photo}
                      fill
                      className="object-cover rounded-t-full transition-all duration-1000"
                      alt={data.groom.name}
                    />
                  </div>
                </div>
                <h3 className="text-xl md:text-5xl mb-4 font-script text-white drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">{data.groom.name}</h3>
                <p className="font-serif text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] mb-6 ml-[0.4em]">Mempelai Pria</p>
                <div className="w-12 h-px bg-[#D4AF37]/30 mb-6"></div>
                <p className="text-base text-gray-400 italic font-light max-w-xs leading-relaxed">
                  {data.groom_father && data.groom_mother
                    ? `Putra dari Bpk. ${data.groom_father} & Ibu ${data.groom_mother}`
                    : data.groom.parents
                  }
                </p>
              </motion.div>
            </div>
          </div>
          <Divider />
        </section>

        {/* GALLERY */}
        {data.gallery && data.gallery.length > 0 && (
          <section className="py-32 px-4 bg-[#06120C] relative overflow-hidden">
            {/* Background Decorative Gold Petals */}
            <div className="absolute inset-0 pointer-events-none">
              {isMounted && [...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -150, 0],
                    x: [0, Math.sin(i) * 50, 0],
                    rotate: [0, 360],
                    opacity: [0, 0.2, 0],
                  }}
                  transition={{
                    duration: 15 + i * 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute"
                  style={{
                    left: `${(i * 15) % 100}%`,
                    top: `${(i * 20) % 100}%`,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#D4AF37]/40">
                    <path d="M12 2L14.5 9H21L15.5 13L18 21L12 16L6 21L8.5 13L3 9H9.5L12 2Z" fill="currentColor" />
                  </svg>
                </motion.div>
              ))}
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-20">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-[10px] text-[#D4AF37] uppercase tracking-[0.6em] font-black mb-4"
                >
                  Galeri Momen
                </motion.p>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="font-serif text-4xl md:text-6xl text-white mb-8 italic"
                >
                  Our Captured Love
                </motion.h2>
                <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[350px]">
                {data.gallery.map((img: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ 
                      scale: 1.02,
                      rotateY: i % 2 === 0 ? 5 : -5,
                      rotateX: i % 3 === 0 ? 5 : -5,
                    }}
                    className={`relative overflow-hidden rounded-[2rem] group border border-[#D4AF37]/20 shadow-2xl transition-all duration-700 cursor-pointer ${
                      i === 0 ? 'md:col-span-2 md:row-span-2' : 
                      i === 3 ? 'md:row-span-2' : ''
                    }`}
                  >
                    {/* Floating Light Effect inside card */}
                    <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-[#D4AF37]/20 via-transparent to-transparent pointer-events-none"></div>
                    
                    <Image 
                      src={img} 
                      alt={`Gallery ${i}`} 
                      fill 
                      className="object-cover transition-all duration-1000 group-hover:scale-110 filter group-hover:brightness-110"
                    />
                    
                    {/* Ornamental Border on Hover */}
                    <div className="absolute inset-0 border-2 border-[#D4AF37]/0 group-hover:border-[#D4AF37]/30 rounded-[2rem] transition-all duration-700 m-2"></div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06120C]/90 via-[#06120C]/20 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-700"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        <Divider />

        {/* EVENT DETAILS & VIP TICKET (Multi-Event) */}
        <section className="py-32 px-6 relative bg-gradient-to-b from-[#06120C] to-[#0A1C14] space-y-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-5xl text-[#D4AF37] mb-12 uppercase tracking-widest">Waktu & Tempat</h2>
            
            {(data.events && data.events.length > 0 ? data.events : [data.event]).map((event: any, index: number) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-[#D4AF37]/30 backdrop-blur-xl rounded-3xl p-6 md:p-12 shadow-[0_0_50px_rgba(212,175,55,0.05)] mb-12 last:mb-0 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-[50px]"></div>

                <div className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-between gap-12`}>
                  <div className="text-left flex-1">
                    <div className="inline-block bg-[#D4AF37] text-black px-4 pl-[0.3em] py-1 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6">
                      {event.title || (index === 0 ? "Akad Nikah" : "Resepsi")}
                    </div>
                    <h3 className="font-serif text-xl sm:text-4xl text-white mb-2">{event.location || event.locationName}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8">{event.address || event.locationAddress}</p>

                    <div className="flex gap-8 border-t border-white/10 pt-6">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Date</p>
                        <p className="font-serif text-white">{event.date}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Time</p>
                        <p className="font-serif text-white">{event.time}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
                      <a href={event.maps_link || event.mapsLink} target="_blank" className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.2em] text-[9px] md:text-[10px] hover:bg-white transition-colors duration-500 text-center">
                        Direction
                      </a>
                      <a href={createCalendarLink()} target="_blank" className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-3 border border-[#D4AF37] text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-[9px] md:text-[10px] hover:bg-[#D4AF37] hover:text-black transition-colors duration-500 text-center">
                        Calendar
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-[350px] space-y-6">
                    <MapSimulation 
                      lat={event.latitude ?? -6.2088} 
                      lng={event.longitude ?? 106.8456} 
                      locationName={event.location || event.locationName} 
                    />
                    
                    <div className="bg-white p-6 rounded-2xl flex items-center justify-between gap-4">
                      <div className="text-left">
                        <p className="text-black font-bold text-xs uppercase tracking-widest">Digital Pass</p>
                        <p className="text-gray-400 text-[10px] italic">Scan for navigation</p>
                      </div>
                      <div className="bg-gray-50 p-1 rounded-lg">
                        <QRCodeSVG value={event.maps_link || event.mapsLink} size={80} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TURUT MENGUNDANG (HONORARY LIST) */}
        {data.turut_mengundang && (
          <section className="py-24 px-6 bg-[#06120C]">
            <div className="max-w-4xl mx-auto text-center border border-[#D4AF37]/20 p-12 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-[#D4AF37]/40 m-2"></div>
               <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-[#D4AF37]/40 m-2"></div>
               
              <h2 className="font-serif text-3xl text-[#D4AF37] mb-12 uppercase tracking-widest italic">Turut Mengundang</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {data.turut_mengundang.split(',').map((name, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-2 h-px bg-[#D4AF37]/20 group-hover:w-8 transition-all duration-500"></div>
                    <span className="text-gray-300 font-light tracking-wide italic text-sm md:text-base">
                      {name.trim()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}


        <Divider />


        {/* GIFT / TANDA KASIH */}
        <section className="py-24 px-6 bg-[#0A1C14]">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.5em] font-black mb-4">Tanda Kasih</p>
              <h2 className="font-serif text-3xl text-white mb-6 italic">Wedding Gift</h2>
              <p className="text-gray-400 text-sm italic font-light leading-relaxed">
                Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun, apabila Anda ingin memberikan tanda kasih, Anda dapat memberikannya melalui:
              </p>
            </div>

            <div className="space-y-8">
              {/* Premium Bank Card with 3D Tilt Effect */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative group perspective-1000"
              >
                <motion.div 
                  initial={{ rotateY: 0 }}
                  whileHover={{ rotateY: 15, rotateX: -5 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="relative w-full aspect-[1.6/1] bg-gradient-to-br from-[#0D251B] via-[#0A1C14] to-[#050D0A] rounded-[1.5rem] border border-[#D4AF37]/20 p-5 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500"
                >
                  {/* Texture & Light */}
                  <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-4">
                      {/* Card Chip */}
                      <div className="w-10 h-7 md:w-12 md:h-9 bg-gradient-to-br from-[#FBF5B7] via-[#D4AF37] to-[#B38728] rounded-md relative overflow-hidden shadow-lg">
                        <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,black_1px,black_2px)]" />
                        <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_1px,black_1px,black_2px)]" />
                      </div>
                      <p className="text-[10px] md:text-xs text-[#D4AF37] font-black uppercase tracking-[0.3em]">{data.gift.bankName}</p>
                    </div>
                    

                  </div>

                  {/* Account Number */}
                  <div className="relative z-10">
                    <p className="text-lg md:text-2xl font-mono tracking-[0.15em] text-white/90 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                      {data.gift.accountNumber.replace(/(\d{4})/g, '$1 ').trim()}
                    </p>
                  </div>

                  <div className="flex justify-between items-end relative z-10">
                    <div className="space-y-1 text-left">
                      <p className="text-[8px] text-white/30 uppercase tracking-widest">Account Holder</p>
                      <p className="text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">{data.gift.accountName}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[7px] text-[#D4AF37]/40 uppercase font-black tracking-widest">Majestic Member</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(data.gift.accountNumber);
                    toast.success("Nomor rekening berhasil disalin!");
                  }}
                  className="flex-1 py-4 bg-white/5 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-2"
                >
                  <Copy size={14} />
                  Salin Rekening
                </button>
                {data.gift.qrUrl && (
                  <button 
                    onClick={() => setIsQRISOpen(true)}
                    className="flex-1 py-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-2"
                  >
                    <QrCode size={14} />
                    Lihat QRIS
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-[#0A1C14] border-t border-[#D4AF37]/10">
          <div className="max-w-xl mx-auto text-center">
            <div className="mb-12">
              <h2 className="font-serif text-2xl sm:text-3xl text-white mb-4">Konfirmasi Kehadiran</h2>
              <p className="text-gray-400 text-sm italic">Merupakan suatu kehormatan jika Anda dapat hadir memberikan doa restu.</p>
            </div>

            <button 
              onClick={() => setIsRSVPOpen(true)}
              className="group relative w-full py-8 overflow-hidden bg-white/5 border border-[#D4AF37]/20 text-white font-serif italic text-xl transition-all duration-700 hover:border-[#D4AF37]"
            >
              <div className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-10 transition-opacity" />
              <span className="relative z-10">Reservasi Kehadiran</span>
            </button>
          </div>
        </section>

        {/* MAJESTIC BOTTOM SHEET */}
        <BottomSheet 
          isOpen={isRSVPOpen} 
          onClose={() => setIsRSVPOpen(false)} 
          title="MAJESTIC RESERVATION"
        >
          <form action={handleRSVP} className="space-y-8 py-10">
            <div className="hidden">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] ml-1 font-bold">Nama Terhormat</label>
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="NAMA LENGKAP ANDA" 
                className="w-full bg-[#06120C] border border-[#D4AF37]/30 text-white px-6 py-5 focus:outline-none focus:border-[#D4AF37] transition-all font-serif text-lg" 
              />
            </div>

            <div className="space-y-3 text-left">
              <label className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] ml-1 font-bold">Status Kehadiran</label>
              <div className="relative">
                <select 
                  name="attendance" 
                  required 
                  className="w-full bg-[#06120C] border border-[#D4AF37]/30 text-white px-6 py-5 focus:outline-none focus:border-[#D4AF37] transition-all appearance-none cursor-pointer font-serif"
                >
                  <option value="Hadir" className="bg-[#0A1C14]">Menyatakan Hadir</option>
                  <option value="Tidak Hadir" className="bg-[#0A1C14]">Maaf, Tidak Bisa Hadir</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-left">
              <label className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] ml-1 font-bold">Pesan Tulus & Doa</label>
              <textarea 
                name="message" 
                rows={5} 
                required 
                placeholder="TULISKAN DOA RESTU ANDA..." 
                className="w-full bg-[#06120C] border border-[#D4AF37]/30 text-white px-6 py-5 focus:outline-none focus:border-[#D4AF37] transition-all font-serif resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.3em] text-[11px] shadow-2xl active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "MENGIRIM..." : "KONFIRMASI KEHADIRAN"}
            </button>
          </form>
        </BottomSheet>
        
        {/* QRIS BottomSheet */}
        <BottomSheet 
          isOpen={isQRISOpen} 
          onClose={() => setIsQRISOpen(false)} 
          title="MAJESTIC GIFT"
        >
          <div className="p-8 text-center space-y-8">
            <div className="relative w-full aspect-square max-w-[300px] mx-auto bg-white p-4 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.2)] overflow-hidden border-4 border-[#D4AF37]/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 to-transparent pointer-events-none" />
              {data.gift.qrUrl && (
                <Image src={data.gift.qrUrl} alt="QRIS" fill className="object-contain p-4" />
              )}
            </div>
            <div className="space-y-3">
              <p className="text-[#D4AF37] font-serif text-2xl tracking-wide">{data.gift.bankName}</p>
              <div className="bg-[#06120C] border border-[#D4AF37]/20 p-5 rounded-2xl">
                <p className="text-white text-xl font-mono tracking-widest">{data.gift.accountNumber}</p>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">A/N {data.gift.accountName}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsQRISOpen(false)}
              className="w-full py-5 bg-[#D4AF37] text-black text-[11px] font-bold uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
            >
              TUTUP
            </button>
          </div>
        </BottomSheet>

        {/* 6. GUESTBOOK DISPLAY */}
        <section className="py-24 px-6 bg-[#06120C]">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-serif text-3xl text-center text-[#D4AF37] mb-12 italic">Untaian Doa & Harapan</h3>
            <div className="grid md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#D4AF37]/20">
              {data.guestbook && data.guestbook.length > 0 ? (
                data.guestbook.map((guest, idx) => (
                  <div key={idx} className="bg-[#0A1C14] p-6 border border-[#D4AF37]/10 rounded-2xl relative group/entry">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-bold text-[#D4AF37] text-sm uppercase tracking-widest">{guest.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-1 rounded-full border ${guest.attendance === 'Hadir' ? 'border-green-500/20 text-green-400 bg-green-500/5' : 'border-red-500/20 text-red-400 bg-red-500/5'}`}>
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
                    <p className="text-gray-300 text-sm italic font-light">"{guest.message}"</p>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-center text-gray-500 italic">Belum ada doa tertulis.</p>
              )}
            </div>
          </div>
        </section>

        {/* CLOSING STATEMENT */}
        <section className="py-32 px-6 relative overflow-hidden bg-[#06120C]">
          {/* Nusantara Corner Ornaments - Framing the Closing (4 Corners) */}
          <div className="absolute top-0 left-0 w-28 h-28 md:w-56 md:h-56 opacity-60 pointer-events-none z-10 mix-blend-screen">
            <Image 
              src="/assets/branding/final/nusantara_corner_ornament_luxury_gold_3d_final_v1_1777373271596.webp" 
              alt="Ornament" 
              fill 
              className="object-contain"
            />
          </div>
          <div className="absolute top-0 right-0 w-28 h-28 md:w-56 md:h-56 opacity-60 pointer-events-none z-10 mix-blend-screen -scale-x-100">
            <Image 
              src="/assets/branding/final/nusantara_corner_ornament_luxury_gold_3d_final_v1_1777373271596.webp" 
              alt="Ornament" 
              fill 
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-0 left-0 w-28 h-28 md:w-56 md:h-56 opacity-60 pointer-events-none z-10 mix-blend-screen -scale-y-100">
            <Image 
              src="/assets/branding/final/nusantara_corner_ornament_luxury_gold_3d_final_v1_1777373271596.webp" 
              alt="Ornament" 
              fill 
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-28 h-28 md:w-56 md:h-56 opacity-60 pointer-events-none z-10 rotate-180 mix-blend-screen">
            <Image 
              src="/assets/branding/final/nusantara_corner_ornament_luxury_gold_3d_final_v1_1777373271596.webp" 
              alt="Ornament" 
              fill 
              className="object-contain"
            />
          </div>

          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <Image src="/assets/gold-pattern.webp" fill className="object-cover" alt="Pattern" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            <div className="w-16 h-px bg-[#D4AF37]/30 mx-auto mb-12"></div>
            <p className="font-serif italic text-xl md:text-2xl text-gray-300 leading-relaxed mb-12">
              "{data.closing_statement || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai."}"
            </p>
            <div className="space-y-4 mb-16">
              <p className="text-[#D4AF37] font-sans text-[10px] uppercase tracking-[0.5em] font-black">Kami yang berbahagia,</p>
              <h2 className="font-serif text-3xl md:text-5xl text-white italic">{data.bride.name} & {data.groom.name}</h2>
              <p className="text-gray-500 font-sans text-[9px] uppercase tracking-[0.3em] mt-4">Beserta Seluruh Keluarga Besar</p>
            </div>
            <div className="w-16 h-px bg-[#D4AF37]/30 mx-auto"></div>
          </motion.div>
        </section>
      </div>


    </div>
    </div>
    </>
  );
}

// Sub-component for Elegant Section Dividers
MajesticEternityTheme.Divider = () => (
  <div className="flex items-center justify-center gap-4 py-20 opacity-30">
    <div className="h-[1px] w-12 bg-gradient-to-l from-[#D4AF37] to-transparent"></div>
    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
    <div className="h-[1px] w-12 bg-gradient-to-r from-[#D4AF37] to-transparent"></div>
  </div>
);
