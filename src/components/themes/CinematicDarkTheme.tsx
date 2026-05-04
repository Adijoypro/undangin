"use client";

import { useRef, useState, useEffect, useContext } from "react";
import { motion, useScroll, useTransform, useSpring, Variants, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ThemeContext } from "./ThemeWrapper";
import { TheaterCurtainCover } from "@/components/covers";
import { ScrollIndicator } from "./InvitationCover";
import { InvitationData } from "@/data/invitations";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { submitRSVP } from "@/app/[slug]/actions";
import MapSimulation from "@/components/ui/MapSimulation";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import BottomSheet from "@/components/ui/BottomSheet";

export default function CinematicDarkTheme({ data }: { data: InvitationData }) {
  const { isOpened, onOpen } = useContext(ThemeContext);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Smooth scroll progress
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isQRISOpen, setIsQRISOpen] = useState(false);

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Nomor rekening tersalin.");
    });
  };

  const handleRSVP = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.append("invitation_id", data.id);
    formData.append("slug", data.slug);
    
    const result = await submitRSVP(formData);
    
    setIsSubmitting(false);
    if (result.success) {
      toast.success("Terima kasih atas doa dan kehadiran Anda!");
      setIsRSVPOpen(false);
    } else {
      toast.error("Gagal mengirim pesan, silakan coba lagi.");
    }
  };

  // Fade Up Animation Variant
  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpened && (
          <TheaterCurtainCover
            bride={data.bride.name}
            groom={data.groom.name}
            date={data.event.date}
            onOpen={onOpen}
            guestName={data.guestName}
          />
        )}
      </AnimatePresence>
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
          <motion.p variants={fadeUpVariant} className="font-sans uppercase tracking-[0.6em] text-[10px] text-gray-500 mb-8 ml-[0.6em]">The Wedding Celebration of</motion.p>
          <motion.h1 variants={fadeUpVariant} className="font-serif text-5xl md:text-8xl lg:text-9xl uppercase tracking-tighter leading-none mb-12">
            {data.bride.name} <span className="text-gray-600">&</span> {data.groom.name}
          </motion.h1>
          <motion.div variants={fadeUpVariant} className="flex items-center gap-6">
            <div className="h-px w-12 bg-white/20"></div>
            <p className="font-sans text-xs uppercase tracking-[0.4em] text-wedding-gold">{new Date(data.event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <div className="h-px w-12 bg-white/20"></div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* 2. PROFILE SECTION (Parallel Scenes) */}
      <section className="py-32 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            {/* Bride */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
              className="flex flex-col items-center md:items-end text-center md:text-right"
            >
              <div className="relative w-full aspect-[4/5] mb-12 overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-1000">
                {data.bride.photo && <Image src={data.bride.photo} fill className="object-cover" alt={data.bride.name} />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
              <h2 className="font-serif text-4xl md:text-6xl uppercase tracking-tighter mb-4">{data.bride.name}</h2>
              <p className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-6">{data.bride.fullName}</p>
              <p className="font-serif italic text-gray-500 text-sm max-w-xs leading-relaxed">
                Putri terkasih dari {data.bride.parents || `Bapak ${data.bride_father} & Ibu ${data.bride_mother}`}
              </p>
            </motion.div>

            {/* Groom */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
              className="flex flex-col items-center md:items-start text-center md:text-left"
            >
              <div className="relative w-full aspect-[4/5] mb-12 overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-1000">
                {data.groom.photo && <Image src={data.groom.photo} fill className="object-cover" alt={data.groom.name} />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
              <h2 className="font-serif text-4xl md:text-6xl uppercase tracking-tighter mb-4">{data.groom.name}</h2>
              <p className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-6">{data.groom.fullName}</p>
              <p className="font-serif italic text-gray-500 text-sm max-w-xs leading-relaxed">
                Putra terkasih dari {data.groom.parents || `Bapak ${data.groom_father} & Ibu ${data.groom_mother}`}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. EVENT DETAILS (The Grand Hall) */}
      <section className="py-48 px-4 relative z-10 bg-black/40 backdrop-blur-sm border-y border-white/5 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}>
              <p className="font-sans uppercase tracking-[0.5em] text-[10px] text-gray-500 mb-12">The Celebration Details</p>
              <h2 className="font-serif text-4xl md:text-7xl uppercase tracking-widest mb-24 italic">Malam Resepsi</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-16 md:gap-px md:bg-white/5">
                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
                  className="bg-black/40 md:bg-transparent p-12 flex flex-col items-center justify-center border border-white/5 md:border-none"
                >
                    <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-6">When</p>
                    <p className="font-serif text-2xl uppercase tracking-widest mb-2">{new Date(data.event.date).toLocaleDateString('id-ID', { weekday: 'long' })}</p>
                    <p className="font-serif text-4xl mb-4 tracking-tighter">{new Date(data.event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</p>
                    <p className="font-sans text-xs tracking-[0.2em]">{data.event.time}</p>
                </motion.div>

                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
                  className="bg-black/40 md:bg-transparent p-12 flex flex-col items-center justify-center border border-white/5 md:border-none"
                >
                    <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-6">Where</p>
                    <p className="font-serif text-2xl uppercase tracking-widest mb-4 italic leading-tight">{data.event.locationName}</p>
                    <p className="font-sans text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed mb-8">{data.event.locationAddress}</p>
                    
                    <button 
                      onClick={() => window.open(data.event.mapsLink, '_blank')}
                      className="px-8 py-3 border border-white/20 font-sans text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500"
                    >
                      View Production Map
                    </button>
                </motion.div>
            </div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
              className="mt-24"
            >
                <a 
                  href={createCalendarLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[10px] uppercase tracking-[0.4em] text-wedding-gold hover:text-white transition-colors flex items-center justify-center gap-4 group"
                >
                  <div className="w-8 h-px bg-wedding-gold/30 group-hover:w-12 transition-all"></div>
                  Add to Master Schedule
                  <div className="w-8 h-px bg-wedding-gold/30 group-hover:w-12 transition-all"></div>
                </a>
            </motion.div>
        </div>
      </section>

      {/* 4. STORY SECTION (The Narrative) */}
      {data.loveStory && data.loveStory.length > 0 && (
        <section className="py-48 px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <p className="font-sans uppercase tracking-[0.5em] text-[10px] text-gray-500 mb-24 text-center">Our Cinematic Journey</p>
            
            <div className="space-y-48">
              {data.loveStory.map((story: any, idx: number) => {
                const isObject = typeof story === 'object' && story !== null;
                return (
                  <motion.div 
                    key={idx}
                    initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
                    className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}
                  >
                    <div className="w-full md:w-1/2 aspect-[3/4] relative overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-1000">
                      <Image src={isObject ? story.image : (data.couplePhoto || '')} fill className="object-cover" alt={isObject ? story.title : 'Our Story'} />
                    </div>
                    <div className="w-full md:w-1/2 text-center md:text-left">
                      <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-wedding-gold mb-6">{isObject ? story.date : ''}</p>
                      <h3 className="font-serif text-3xl md:text-5xl uppercase tracking-tighter mb-8 italic leading-tight">{isObject ? story.title : 'Chapter'}</h3>
                      <p className="font-sans font-light text-gray-400 text-sm leading-relaxed tracking-wide italic">{isObject ? story.content : story}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. GALLERY SECTION (The Montage) */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="py-48 px-4 relative z-10 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {data.gallery.map((photo, idx) => (
                <GalleryItem key={idx} photo={photo} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. GIFT SECTION (Digital Credits) */}
      <section className="py-48 px-4 relative z-10 border-t border-white/5">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="font-sans uppercase tracking-[0.5em] text-[10px] text-gray-500 mb-12">Wedding Gift</p>
          <h2 className="font-serif text-4xl md:text-7xl uppercase tracking-widest italic mb-24">Tanda Kasih</h2>
          
          <div className="max-w-md mx-auto p-12 bg-white/5 border border-white/10 rounded-sm hover:border-white/20 transition-all duration-700">
            <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-8">{data.gift.bankName}</p>
            <p className="font-serif text-3xl md:text-4xl tracking-widest mb-4 selection:bg-wedding-gold selection:text-black">{data.gift.accountNumber}</p>
            <p className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-12">A/N {data.gift.accountName}</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => handleCopy(data.gift.accountNumber)}
                className="flex-1 py-4 border border-white/10 font-sans text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500"
              >
                Copy Credentials
              </button>
              {data.gift.qrUrl && (
                <button 
                  onClick={() => setIsQRISOpen(true)}
                  className="flex-1 py-4 bg-white/5 border border-white/20 font-sans text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500"
                >
                  View QRIS
                </button>
              )}
            </div>
          </div>

        </motion.div>
      </section>

      {/* 7. RSVP FORM & GUESTBOOK */}
      <section className="py-32 px-4 relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
            className="text-center md:text-left flex flex-col justify-center"
          >
            <h3 className="font-serif text-2xl mb-4 uppercase tracking-[0.3em]">RSVP</h3>
            <p className="font-sans font-light text-gray-500 mb-12 text-sm tracking-widest">Sampaikan doa dan konfirmasi kehadiran Anda untuk malam penganugerahan cinta kami.</p>
            
            <button 
              onClick={() => setIsRSVPOpen(true)}
              className="group relative w-full py-8 md:py-12 border border-white/10 overflow-hidden transition-all duration-700 hover:border-white/30"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.03] transition-opacity" />
              <span className="relative z-10 font-sans font-bold uppercase tracking-[0.5em] text-[10px] md:text-xs">Confirm Presence</span>
            </button>
          </motion.div>

          {/* GUESTBOOK DISPLAY */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
            className="border-t md:border-t-0 md:border-l border-white/10 pt-16 md:pt-0 md:pl-16 flex flex-col h-full"
          >
            <h3 className="font-serif text-2xl mb-8 uppercase tracking-widest">Buku Tamu ({data.guestbook?.length || 0})</h3>
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

      {/* CINEMATIC BOTTOM SHEET */}
      <BottomSheet 
        isOpen={isRSVPOpen} 
        onClose={() => setIsRSVPOpen(false)} 
        title="FILM NOIR RESERVATION"
      >
        <form action={handleRSVP} className="space-y-12 py-12">
          <div className="hidden">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          
          <div className="relative group">
            <label className="text-[9px] uppercase tracking-[0.4em] text-gray-500 ml-1 font-bold">Your Name</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="ENTER FULL NAME" 
              className="w-full bg-transparent border-b border-white/20 py-4 font-sans text-xs uppercase tracking-widest focus:border-white focus:outline-none transition-all text-white placeholder:text-gray-800" 
            />
          </div>

          <div className="relative group">
            <label className="text-[9px] uppercase tracking-[0.4em] text-gray-500 ml-1 font-bold">Attendance</label>
            <select 
              name="attendance" 
              className="w-full bg-transparent border-b border-white/20 py-4 font-sans text-xs uppercase tracking-widest focus:border-white focus:outline-none transition-all text-gray-400 appearance-none cursor-pointer"
            >
              <option value="Hadir" className="bg-[#0A0A0A]">I AM COMING</option>
              <option value="Tidak Hadir" className="bg-[#0A0A0A]">I AM SORRY, I CAN'T</option>
            </select>
          </div>

          <div className="relative group">
            <label className="text-[9px] uppercase tracking-[0.4em] text-gray-500 ml-1 font-bold">Message</label>
            <textarea 
              name="message" 
              rows={5} 
              required 
              placeholder="YOUR SINCERE WISHES" 
              className="w-full bg-transparent border-b border-white/20 py-4 font-sans text-xs uppercase tracking-widest focus:border-white focus:outline-none transition-all text-white placeholder:text-gray-800 resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-5 bg-white text-black font-sans font-bold uppercase tracking-[0.4em] text-[10px] active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "TRANSMITTING..." : "SEND CONFIRMATION"}
          </button>
        </form>
      </BottomSheet>
      
      {/* CINEMATIC QRIS */}
      <BottomSheet 
        isOpen={isQRISOpen} 
        onClose={() => setIsQRISOpen(false)} 
        title="DIGITAL GIFT QRIS"
      >
        <div className="p-8 text-center space-y-12 bg-black">
          <div className="relative w-full aspect-square max-w-[320px] mx-auto bg-white p-6 rounded-sm shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent pointer-events-none" />
            {data.gift.qrUrl && (
              <Image src={data.gift.qrUrl} alt="QRIS" fill className="object-contain p-6 grayscale" />
            )}
          </div>
          <div className="space-y-4">
            <p className="text-gray-500 font-sans text-[10px] uppercase tracking-[0.6em] font-bold">{data.gift.bankName}</p>
            <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
              <p className="text-white text-3xl font-serif tracking-[0.2em] font-light italic">{data.gift.accountNumber}</p>
              <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em] mt-4">Recipient: {data.gift.accountName}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsQRISOpen(false)}
            className="w-full py-6 bg-white text-black text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-gray-200 transition-all duration-500"
          >
            End Transaction
          </button>
        </div>
      </BottomSheet>

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
              <div className="mt-24 mb-20 relative">
                {/* Decorative Line */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent via-wedding-gold/30 to-transparent"></div>
                
                <CountdownTimer 
                  targetDate={data.events?.[0]?.date || data.event.date} 
                  theme="cinematic-dark" 
                />

                {/* Decorative Line Bottom */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-wedding-gold/30 via-wedding-gold/10 to-transparent"></div>
              </div>

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
            <h2 className="font-script text-4xl md:text-8xl mb-8 text-white/80">{data.bride.name} & {data.groom.name}</h2>
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
