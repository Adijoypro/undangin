"use client";

import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, Variants } from "framer-motion";
import { ThemeContext } from "./ThemeWrapper";
import { InvitationData } from "@/data/invitations";
import { submitRSVP } from "@/app/[slug]/actions";
import CountdownTimer from "@/components/ui/CountdownTimer";
import BottomSheet from "@/components/ui/BottomSheet";
import ModernBlueCover from "@/components/covers/ModernBlueCover";
import { toast } from "sonner";

// ═══════════════════════════════════════════════
// MODERN BLUE THEME — Modern Asymmetric · Steel Blue
// Palette: #5B7B9D · #8AADCF · #1A1A2E · #F8F9FB · #C4A87C
// ═══════════════════════════════════════════════

export default function ModernBlueTheme({ data }: { data: InvitationData }) {
  const { isOpened, onOpen } = useContext(ThemeContext);
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isQRISOpen, setIsQRISOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const submitted = localStorage.getItem(`rsvp_${data.slug}`);
    if (submitted) setHasSubmitted(true);
  }, [data.slug]);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

  const heroY = useTransform(smoothProgress, [0, 0.2], ["0%", "30%"]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);

  const handleRSVP = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await submitRSVP(formData);
      if (result?.error) { toast.error(result.error); }
      else { 
        toast.success("Terima kasih! RSVP berhasil dikirim."); 
        localStorage.setItem(`rsvp_${data.slug}`, "true");
        setHasSubmitted(true);
        setIsRSVPOpen(false); 
      }
    } catch { toast.error("Gagal mengirim RSVP."); }
    setIsSubmitting(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Nomor rekening berhasil disalin!");
  };

  if (!isOpened) {
    return <ModernBlueCover guestName={data.guestName} onOpen={onOpen} bride={data.bride.name} groom={data.groom.name} date={data.event.date} />;
  }

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#1A1A2E] selection:bg-[#5B7B9D] selection:text-white overflow-hidden">

      {/* ▸ HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(#5B7B9D 1px, transparent 1px), linear-gradient(90deg, #5B7B9D 1px, transparent 1px)",
          backgroundSize: "100px 100px"
        }}></div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <p className="font-sans text-[10px] uppercase tracking-[0.8em] text-[#5B7B9D] mb-12 font-black">The Wedding Celebration</p>
            <h1 className="font-serif text-7xl md:text-[12rem] text-[#1A1A2E] leading-none tracking-tighter mb-12">
              {data.bride.name} <span className="text-[#5B7B9D] text-4xl md:text-7xl">&</span> {data.groom.name}
            </h1>
            <div className="flex items-center justify-center gap-4 mb-16">
              <div className="w-12 h-[1px] bg-[#5B7B9D]/20"></div>
              <p className="font-serif text-2xl italic text-[#1A1A2E]/40">{data.event.date}</p>
              <div className="w-12 h-[1px] bg-[#5B7B9D]/20"></div>
            </div>

            {/* Countdown */}
            <div className="max-w-md mx-auto mb-16">
              <CountdownTimer targetDate={data.event.date} theme="minimal" />
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#5B7B9D] to-transparent"></div>
          <p className="font-sans text-[8px] uppercase tracking-[0.6em] text-[#5B7B9D]/40 font-bold">Scroll</p>
        </motion.div>
      </section>

      {/* ▸ QUOTE */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
        className="py-48 px-8 md:px-20 text-center bg-[#F8F9FB]">
        <div className="max-w-4xl mx-auto">
          <svg className="w-12 h-12 text-[#5B7B9D]/20 mx-auto mb-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H11.017C10.4647 12 10.017 11.5523 10.017 11V7C10.017 5.89543 10.9124 5 12.017 5H19.017C20.6739 5 22.017 6.34315 22.017 8V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM4.017 21L4.017 18C4.017 16.8954 4.91243 16 6.017 16H9.017C9.56928 16 10.017 15.5523 10.017 15V9C10.017 8.44772 9.56928 8 9.017 8H5.017C4.46472 8 4.017 8.44772 4.017 9V11C4.017 11.5523 3.56928 12 3.017 12H1.017C0.464722 12 0.017 11.5523 0.017 11V7C0.017 5.89543 0.912439 5 2.017 5H9.017C10.6739 5 12.017 6.34315 12.017 8V15C12.017 18.3137 9.33072 21 6.017 21H4.017Z" />
          </svg>
          <p className="font-serif text-2xl md:text-4xl leading-relaxed text-[#1A1A2E]/80 italic">
            "{data.quote || 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.'}"
          </p>
          <div className="w-12 h-[1px] bg-[#5B7B9D]/20 mx-auto mt-16 mb-8" />
          <p className="font-sans text-[10px] uppercase tracking-[0.6em] text-[#5B7B9D] font-black">The Sacred Bond</p>
        </div>
      </motion.section>

      {/* ▸ PROFILES */}
      <section className="bg-white">
        {[
          { person: data.bride, role: "The Bride", align: "left" as const },
          { person: data.groom, role: "The Groom", align: "right" as const },
        ].map((item, i) => (
          <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className={`flex flex-col ${item.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} min-h-[90vh]`}>
            {/* Photo */}
            <div className="w-full md:w-1/2 relative h-[70vh] md:h-auto overflow-hidden">
              <Image src={item.person.photo} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-[2s]" alt={item.role} />
              <div className="absolute inset-0 bg-[#1A1A2E]/10" />
            </div>
            {/* Info */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-12 md:px-24 py-24">
              <p className="font-sans text-[10px] uppercase tracking-[0.8em] text-[#5B7B9D] mb-8 font-black">{item.role}</p>
              <h2 className="font-serif text-6xl md:text-8xl text-[#1A1A2E] tracking-tight mb-8 leading-none">{item.person.fullName}</h2>
              <div className="w-16 h-[2px] bg-[#5B7B9D] mb-12" />
              <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#5B7B9D]/60 mb-3 font-bold">
                {i === 0 ? "Putri Tercinta dari" : "Putra Tercinta dari"}
              </p>
              <p className="font-serif text-2xl text-[#1A1A2E]/70 italic leading-relaxed">{item.person.parents}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ▸ LOVE STORY */}
      <section className="py-48 px-8 md:px-20 bg-[#F8F9FB]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-40">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.8em] text-[#5B7B9D] mb-6 font-black">Our Journey</p>
              <h3 className="font-serif text-7xl md:text-9xl text-[#1A1A2E] tracking-tighter">Love Story</h3>
            </div>
            <div className="w-32 h-[1px] bg-[#5B7B9D]/20 mt-12 md:mt-0 md:mb-6" />
          </div>

          <div className="grid gap-32">
            {data.loveStory.map((item: any, i: number) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
                className="grid grid-cols-12 gap-12 items-center">
                <div className="col-span-12 md:col-span-4">
                  <span className="font-serif text-9xl text-[#5B7B9D]/10 leading-none block mb-4">{String(i + 1).padStart(2, '0')}</span>
                  <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-[#C4A87C] font-black">
                    {typeof item === 'object' ? item.date : `Chapter ${i + 1}`}
                  </p>
                  <h4 className="font-serif text-3xl text-[#1A1A2E] mt-2 font-medium">
                    {typeof item === 'object' ? item.title : "Our Story"}
                  </h4>
                </div>
                <div className="hidden md:block md:col-span-1 h-32 w-[1px] bg-[#5B7B9D]/10 mx-auto" />
                <div className="col-span-12 md:col-span-7">
                  <p className="font-serif text-xl md:text-2xl text-[#1A1A2E]/60 leading-relaxed italic">
                    "{typeof item === 'object' ? item.story : item}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ▸ GALLERY */}
      <section className="py-48 px-8 md:px-20 bg-white">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <p className="font-sans text-[10px] uppercase tracking-[0.8em] text-[#5B7B9D] mb-6 font-black">Moments</p>
            <h3 className="font-serif text-7xl md:text-9xl text-[#1A1A2E] tracking-tighter">Gallery</h3>
          </div>
          
          {data.gallery && data.gallery.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 auto-rows-[250px] md:auto-rows-[350px]">
              {data.gallery.map((img, i) => {
                let spanClass = "col-span-1 row-span-1";
                if (i === 0) spanClass = "col-span-2 row-span-2";
                else if (i === 3) spanClass = "col-span-2 row-span-1";
                else if (i === 4) spanClass = "col-span-1 row-span-2";
                
                return (
                  <motion.div key={i} whileHover={{ scale: 0.985 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
                    className={`relative overflow-hidden bg-[#F8F9FB] shadow-2xl ${spanClass}`}>
                    <Image src={img} fill className="object-cover hover:scale-105 transition-transform duration-[2s]" alt={`Gallery ${i+1}`} />
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </section>

      {/* ▸ EVENTS */}
      <section className="py-48 px-8 md:px-20 bg-[#F8F9FB]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-6xl mx-auto">
          <div className="text-center mb-40">
            <p className="font-sans text-[10px] uppercase tracking-[0.8em] text-[#5B7B9D] mb-8 font-black">Save the Date</p>
            <h3 className="font-serif text-7xl md:text-9xl text-[#1A1A2E] tracking-tighter">The Celebration</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {(data.events && data.events.length > 0 ? data.events : [data.event]).map((event: any, i: number) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-white p-16 md:p-24 relative group border border-[#5B7B9D]/5 shadow-xl hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700">
                <div className="absolute top-0 left-0 w-full h-[4px] bg-[#5B7B9D] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                <p className="font-sans text-[10px] uppercase tracking-[0.6em] text-[#C4A87C] font-black mb-12">
                  {event.title || (i === 0 ? "Akad Nikah" : "Resepsi")}
                </p>
                <h4 className="font-serif text-5xl text-[#1A1A2E] mb-6 tracking-tight">{event.date || data.event.date}</h4>
                <p className="font-sans text-xs tracking-[0.5em] text-[#5B7B9D] uppercase mb-16 font-black">{event.time || data.event.time}</p>

                <div className="w-12 h-[1px] bg-[#5B7B9D]/15 mb-16" />

                <h5 className="font-serif text-3xl text-[#1A1A2E] mb-4">{event.location || event.locationName || data.event.locationName}</h5>
                <p className="font-sans text-[10px] text-[#1A1A2E]/40 uppercase tracking-[0.4em] leading-relaxed mb-20 max-w-sm">
                  {event.address || event.locationAddress || data.event.locationAddress}
                </p>

                <button
                  onClick={() => window.open(event.maps_link || event.mapsLink || data.event.mapsLink, '_blank')}
                  className="w-full py-6 bg-[#5B7B9D] text-white font-sans text-[10px] font-black uppercase tracking-[0.6em] hover:bg-[#1A1A2E] transition-all duration-500 shadow-xl shadow-[#5B7B9D]/20">
                  Google Maps
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ▸ GUESTBOOK */}
      <section className="py-48 px-8 md:px-20 bg-white">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-5xl mx-auto">
          <div className="text-center mb-32">
            <p className="font-sans text-[10px] uppercase tracking-[0.8em] text-[#5B7B9D] mb-6 font-black">Wishes</p>
            <h3 className="font-serif text-7xl text-[#1A1A2E] tracking-tighter">Guestbook</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {data.guestbook && data.guestbook.length > 0 ? (
              data.guestbook.slice(0, 6).map((guest: any, idx: number) => (
                <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="p-12 bg-[#F8F9FB] border-l-[3px] border-[#5B7B9D]/20 hover:border-[#5B7B9D] transition-all duration-500">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="font-serif text-2xl text-[#1A1A2E] mb-1">{guest.name}</p>
                      <span className="text-[9px] uppercase tracking-[0.4em] text-[#5B7B9D] font-black">{guest.attendance}</span>
                    </div>
                    <span className="text-[10px] text-[#C4A87C] font-sans tracking-[0.2em] font-bold">
                      {new Date(guest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="font-serif italic text-[#1A1A2E]/50 text-xl leading-relaxed">"{guest.message}"</p>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 text-center py-40 border border-dashed border-[#5B7B9D]/15 rounded-[2rem]">
                <p className="font-serif italic text-[#1A1A2E]/30 text-2xl">Waiting for your beautiful wishes...</p>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* ▸ RSVP & GIFT */}
      <section className="py-48 px-8 md:px-20 bg-[#F8F9FB]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-32 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="font-sans text-[10px] uppercase tracking-[0.8em] text-[#5B7B9D] mb-8 font-black">Reservation</p>
            <h3 className="font-serif text-7xl text-[#1A1A2E] tracking-tighter mb-10">RSVP</h3>
            <p className="font-serif text-2xl text-[#1A1A2E]/50 italic mb-16 leading-relaxed">
              Konfirmasi kehadiran Anda adalah sebuah kehormatan besar bagi kami.
            </p>
            <button onClick={() => setIsRSVPOpen(true)}
              className="w-full py-8 bg-[#5B7B9D] text-white font-sans text-[11px] font-black uppercase tracking-[0.7em] hover:bg-[#1A1A2E] transition-all shadow-2xl shadow-[#5B7B9D]/20">
              Confirm Presence
            </button>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="font-sans text-[10px] uppercase tracking-[0.8em] text-[#5B7B9D] mb-8 font-black">Wedding Gift</p>
            <h3 className="font-serif text-7xl text-[#1A1A2E] tracking-tighter mb-10">Envelope</h3>
            <div className="p-16 bg-white shadow-2xl border border-[#5B7B9D]/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B7B9D]/5 rounded-full blur-3xl" />
              <p className="font-sans text-[11px] uppercase tracking-[0.5em] text-[#C4A87C] mb-6 font-black">{data.gift.bankName}</p>
              <p className="font-serif text-4xl text-[#1A1A2E] mb-3 tracking-[0.2em]">{data.gift.accountNumber}</p>
              <p className="font-sans text-[11px] text-[#1A1A2E]/40 uppercase tracking-[0.4em] mb-16 font-bold">A/N {data.gift.accountName}</p>
              <div className="flex flex-col sm:flex-row gap-6">
                <button onClick={() => handleCopy(data.gift.accountNumber)}
                  className="flex-1 py-6 border-2 border-[#5B7B9D] text-[#5B7B9D] font-sans text-[10px] font-black uppercase tracking-[0.5em] hover:bg-[#5B7B9D] hover:text-white transition-all">
                  Copy
                </button>
                {data.gift.qrUrl && (
                  <button onClick={() => setIsQRISOpen(true)}
                    className="flex-1 py-6 bg-[#5B7B9D] text-white font-sans text-[10px] font-black uppercase tracking-[0.5em] hover:bg-[#1A1A2E] transition-all">
                    QRIS
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ▸ WISHES / GUESTBOOK */}
      <section className="py-48 px-8 md:px-20 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-24">
            <p className="font-sans text-[10px] uppercase tracking-[1em] text-[#5B7B9D] mb-8 font-black">Guestbook</p>
            <h2 className="font-serif text-5xl md:text-7xl text-[#1A1A2E] tracking-tighter">Wishes & Prayers</h2>
          </motion.div>

          <div className="space-y-12">
            {data.guestbook?.map((entry: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative pb-12 border-b border-[#5B7B9D]/10"
              >
                <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8">
                  <div className="flex-shrink-0">
                    <p className="font-serif text-2xl text-[#1A1A2E]">{entry.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`w-2 h-2 rounded-full ${entry.attendance === 'Hadir' ? 'bg-[#5B7B9D]' : 'bg-gray-300'}`}></span>
                      <p className="font-sans text-[9px] uppercase tracking-widest text-[#5B7B9D]/60 font-bold">{entry.attendance}</p>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="font-serif text-lg md:text-xl text-[#1A1A2E]/70 leading-relaxed italic">"{entry.message}"</p>
                  </div>
                </div>
                
                {/* Admin Delete Button (Only visible if handleGuestbookDelete is injected) */}
                <button 
                  onClick={() => (window as any).handleDeleteEntry?.(entry.id)}
                  className="guest-entry-delete hidden absolute top-0 right-0 p-2 text-red-400 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-24 text-center">
            {hasSubmitted ? (
              <div className="py-12 bg-white/50 backdrop-blur-sm border border-[#5B7B9D]/10 rounded-2xl max-w-sm mx-auto">
                <div className="w-16 h-16 bg-[#5B7B9D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[#5B7B9D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-[#1A1A2E] font-serif text-2xl mb-2">Terima Kasih!</h4>
                <p className="text-[#1A1A2E]/40 text-[9px] uppercase tracking-widest font-black">Konfirmasi Anda telah kami terima.</p>
              </div>
            ) : (
              <button 
                onClick={() => setIsRSVPOpen(true)}
                className="px-16 py-6 border border-[#5B7B9D] text-[#5B7B9D] font-sans text-[10px] font-black uppercase tracking-[0.6em] hover:bg-[#5B7B9D] hover:text-white transition-all duration-500">
                Send Your Wishes
              </button>
            )}
          </motion.div>
        </div>
      </section>

      <footer className="py-48 text-center bg-[#1A1A2E] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(#8AADCF 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10">
          <p className="font-sans text-[10px] uppercase tracking-[1em] text-[#8AADCF] mb-12 font-bold">Thank You</p>
          <h2 className="font-serif text-6xl md:text-9xl text-white tracking-tighter">
            {data.bride.name} <span className="text-[#8AADCF] text-3xl md:text-5xl">&</span> {data.groom.name}
          </h2>
          <div className="w-16 h-[1px] bg-[#8AADCF]/30 mx-auto mt-16" />
        </motion.div>
      </footer>

      {/* ▸ BOTTOM SHEETS */}
      <BottomSheet isOpen={isRSVPOpen} onClose={() => setIsRSVPOpen(false)} title="RSVP">
        <form action={handleRSVP} className="space-y-8 py-8">
          <input type="hidden" name="invitation_id" value={data.id} />
          <input type="hidden" name="slug" value={data.slug} />
          <input type="text" name="website" className="hidden" aria-hidden="true" tabIndex={-1} />

          <div className="space-y-3">
            <label className="text-[9px] uppercase tracking-[0.3em] text-[#5B7B9D] font-bold font-sans">Nama</label>
            <input name="name" required className="w-full bg-transparent border-b border-[#5B7B9D]/20 py-4 font-serif text-lg focus:border-[#5B7B9D] focus:outline-none" />
          </div>
          <div className="space-y-3">
            <label className="text-[9px] uppercase tracking-[0.3em] text-[#5B7B9D] font-bold font-sans">Kehadiran</label>
            <select name="attendance" className="w-full bg-transparent border-b border-[#5B7B9D]/20 py-4 font-serif text-lg focus:border-[#5B7B9D] focus:outline-none appearance-none">
              <option value="Hadir">Insya Allah Hadir</option>
              <option value="Tidak Hadir">Maaf, Tidak Bisa Hadir</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[9px] uppercase tracking-[0.3em] text-[#5B7B9D] font-bold font-sans">Ucapan</label>
            <textarea name="message" rows={3} required className="w-full bg-transparent border-b border-[#5B7B9D]/20 py-4 font-serif text-lg focus:border-[#5B7B9D] focus:outline-none resize-none" />
          </div>
          <button type="submit" disabled={isSubmitting}
            className="w-full py-6 bg-[#5B7B9D] text-white font-sans font-bold uppercase tracking-[0.5em] text-[10px] disabled:opacity-50 shadow-xl">
            {isSubmitting ? "Mengirim..." : "Kirim"}
          </button>
        </form>
      </BottomSheet>

      <BottomSheet isOpen={isQRISOpen} onClose={() => setIsQRISOpen(false)} title="QRIS">
        <div className="p-10 text-center space-y-8">
          <div className="relative w-full aspect-square max-w-[280px] mx-auto border border-[#5B7B9D]/10 p-6">
            {data.gift.qrUrl && <Image src={data.gift.qrUrl} alt="QRIS" fill className="object-contain" />}
          </div>
          <p className="font-serif italic text-[#1A1A2E]/50">Scan to send your gift</p>
        </div>
      </BottomSheet>

    </div>
  );
}
