"use client";

import { useEffect, useRef, useState, useContext } from "react";
import { ThemeContext } from "./ThemeWrapper";
import ModernBlueCover from "../covers/ModernBlueCover";
import { ScrollIndicator } from "./InvitationCover";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { InvitationData } from "@/data/invitations";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { submitRSVP } from "@/app/[slug]/actions";
import { toast } from "sonner";
import MapSimulation from "@/components/ui/MapSimulation";
import { QRCodeSVG } from "qrcode.react";
import BottomSheet from "@/components/ui/BottomSheet";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function PremiumTheme({ data }: { data: InvitationData }) {
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

  useEffect(() => {
    if (isOpened) {
      gsap.registerPlugin(ScrollTrigger);
      
      // Hero Image Parallax
      gsap.to(".hero-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // General Fade-In Up animations
      const fadeUps = document.querySelectorAll(".gsap-fade-up");
      fadeUps.forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      });
    }
  }, [isOpened]);

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
      localStorage.setItem(`rsvp_${data.slug}`, "true");
      setHasSubmitted(true);
      setIsRSVPOpen(false);
    } else {
      toast.error("Gagal mengirim pesan, silakan coba lagi.");
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpened && (
          <ModernBlueCover 
            guestName={data.guestName} 
            onOpen={onOpen}
            bride={data.bride.name}
            groom={data.groom.name}
            date={data.event.date}
          />
        )}
      </AnimatePresence>

      <div className={`transition-opacity duration-1000 w-full min-h-screen bg-[#FAF8F5] text-[#2C1810] selection:bg-[#7A8B7C]/20 ${isOpened ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        {isOpened && <ScrollIndicator color="#7A8B7C" />}
        <div className="paper-texture opacity-[0.04]"></div>

        <main ref={containerRef} className="relative">
          
          {/* HERO SECTION */}
          <section className="hero-section min-h-[100svh] flex flex-col items-center justify-center relative px-6 overflow-hidden">
            <div className="absolute inset-0 z-0 hero-bg">
              <Image 
                src={data.couplePhoto || data.bride.photo} 
                fill
                className="object-cover opacity-[0.15] grayscale" 
                alt="Hero"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5] via-transparent to-[#FAF8F5]"></div>
            </div>
            
            <div className="text-center relative z-10 max-w-4xl">
              <p className="font-sans uppercase tracking-[0.6em] text-[#7A8B7C] mb-8 text-[10px] font-bold">The Wedding of</p>
              <h1 className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
                <span className="font-serif text-6xl md:text-8xl lg:text-9xl text-[#2C1810] tracking-tighter">{data.bride.name}</span>
                <span className="font-script text-4xl md:text-6xl text-[#C9A96E]">&</span>
                <span className="font-serif text-6xl md:text-8xl lg:text-9xl text-[#2C1810] tracking-tighter">{data.groom.name}</span>
              </h1>
              <div className="inline-block border-y border-[#7A8B7C]/20 py-4 px-12 mb-12">
                <p className="font-serif italic text-[#7A8B7C] text-lg md:text-2xl">{data.event.date}</p>
              </div>
              <div className="w-full flex justify-center">
                <CountdownTimer targetDate={data.event.date} theme="premium" />
              </div>
            </div>
          </section>

          {/* QUOTE SECTION */}
          <section className="py-40 px-6 bg-[#7A8B7C] text-[#FAF8F5] text-center">
            <div className="max-w-3xl mx-auto gsap-fade-up">
              <div className="w-12 h-px bg-[#FAF8F5]/30 mx-auto mb-10"></div>
              <p className="font-serif italic text-xl md:text-3xl leading-relaxed opacity-90 tracking-wide">
                "{data.quote || "And among His signs is this, that He created for you mates from among yourselves, that ye may dwell in tranquillity with them."}"
              </p>
              <div className="w-12 h-px bg-[#FAF8F5]/30 mx-auto mt-10"></div>
            </div>
          </section>

          {/* QS AR-RUM 21 */}
          <section className="py-32 px-6 text-center bg-white relative z-10">
            <div className="max-w-4xl mx-auto gsap-fade-up">
              <h3 className="font-serif text-2xl md:text-3xl mb-8 text-[#7A8B7C]">QS. Ar-Rum: 21</h3>
              <p className="font-serif text-xl md:text-2xl leading-relaxed text-[#2C1810] mb-8 italic">
                "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
              </p>
              <div className="w-12 h-px bg-[#7A8B7C]/30 mx-auto"></div>
            </div>
          </section>

          {/* PROFILES SECTION */}
          <section className="py-40 px-6 relative bg-[#FAF8F5]">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-32 items-center">
                {/* Bride */}
                <div className="flex flex-col items-center gsap-fade-up">
                  <div className="relative w-full max-w-[300px] mb-12">
                    {/* Arch Frame */}
                    <div className="aspect-[2/3] rounded-t-full border border-[#C9A96E] p-3 relative z-10 overflow-hidden">
                      <div className="w-full h-full rounded-t-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                        <Image src={data.bride.photo} fill className="object-cover" alt="Bride" />
                      </div>
                    </div>
                    {/* Decorative Arch Behind */}
                    <div className="absolute inset-0 translate-x-4 translate-y-4 border border-[#7A8B7C]/20 rounded-t-full z-0"></div>
                  </div>
                  <h2 className="font-serif text-4xl text-[#2C1810] mb-2">{data.bride.fullName}</h2>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-[#7A8B7C] mb-4 font-bold">Putri dari</p>
                  <p className="font-serif italic text-[#6B5E55]">{data.bride.parents}</p>
                </div>

                {/* Groom */}
                <div className="flex flex-col items-center gsap-fade-up">
                  <div className="relative w-full max-w-[300px] mb-12">
                    {/* Arch Frame */}
                    <div className="aspect-[2/3] rounded-t-full border border-[#C9A96E] p-3 relative z-10 overflow-hidden">
                      <div className="w-full h-full rounded-t-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                        <Image src={data.groom.photo} fill className="object-cover" alt="Groom" />
                      </div>
                    </div>
                    {/* Decorative Arch Behind */}
                    <div className="absolute inset-0 -translate-x-4 translate-y-4 border border-[#7A8B7C]/20 rounded-t-full z-0"></div>
                  </div>
                  <h2 className="font-serif text-4xl text-[#2C1810] mb-2">{data.groom.fullName}</h2>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-[#7A8B7C] mb-4 font-bold">Putra dari</p>
                  <p className="font-serif italic text-[#6B5E55]">{data.groom.parents}</p>
                </div>
              </div>
            </div>
          </section>

          {/* STORY SECTION */}
          <section className="py-40 px-6 bg-white relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-24 gsap-fade-up">
                <p className="font-sans uppercase tracking-[0.5em] text-[#7A8B7C] text-[10px] mb-4 font-bold">Our Journey</p>
                <h3 className="font-serif text-5xl md:text-7xl text-[#2C1810]">Love Story</h3>
              </div>
              
              <div className="space-y-20">
                {data.loveStory.map((item: any, i: number) => (
                  <div key={i} className="gsap-fade-up flex flex-col md:flex-row gap-12 items-start">
                    <div className="w-full md:w-1/3">
                      <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#C9A96E] font-bold mb-2">{typeof item === 'object' ? item.date : `Phase ${i+1}`}</p>
                      <h4 className="font-serif text-2xl text-[#2C1810]">{typeof item === 'object' ? item.title : "Cerita Kami"}</h4>
                    </div>
                    <div className="w-full md:w-2/3 border-l border-[#7A8B7C]/20 pl-8 md:pl-12 py-2">
                      <p className="font-serif italic text-[#6B5E55] text-lg leading-relaxed">{typeof item === 'object' ? item.story : item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* EVENT SECTION (WAKTU & TEMPAT) */}
          <section className="py-40 px-6 bg-white border-y border-[#7A8B7C]/10 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none rotate-90">
               <svg width="400" height="400" viewBox="0 0 100 100" className="fill-[#7A8B7C]">
                  <path d="M10 90 Q30 50 80 10 M10 90 Q50 30 90 20" stroke="currentColor" fill="none" strokeWidth="0.5" />
               </svg>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
              <div className="text-center mb-32 gsap-fade-up">
                <p className="font-sans uppercase tracking-[0.5em] text-[#7A8B7C] text-[10px] mb-6 font-bold">Save the Date</p>
                <h3 className="font-serif text-5xl md:text-7xl text-[#2C1810]">Waktu & Tempat</h3>
                <div className="w-12 h-px bg-[#C9A96E] mx-auto mt-8"></div>
              </div>

              <div className="grid lg:grid-cols-2 gap-24">
                {(data.events && data.events.length > 0 ? data.events : [data.event]).map((event: any, i: number) => (
                  <div key={i} className="gsap-fade-up flex flex-col items-center">
                    {/* Venue Image Arch */}
                    <div className="relative w-full max-w-[400px] aspect-[4/5] mb-12 group overflow-hidden rounded-t-full border border-[#C9A96E]/30 p-2">
                       <div className="w-full h-full rounded-t-full overflow-hidden relative">
                          <Image 
                            src={event.photo || `https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000`} 
                            fill 
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" 
                            alt="Venue" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent opacity-60"></div>
                       </div>
                    </div>

                    {/* Event Details Card */}
                    <div className="text-center max-w-sm">
                      <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#C9A96E] font-bold mb-8 italic">
                        {event.title || (i === 0 ? "Akad Nikah" : "Resepsi")}
                      </p>
                      
                      <div className="mb-10">
                        <h4 className="font-serif text-4xl md:text-5xl text-[#2C1810] mb-3">{event.date}</h4>
                        <p className="font-sans text-[11px] tracking-[0.4em] text-[#7A8B7C] uppercase font-bold">{event.time}</p>
                      </div>

                      <div className="w-8 h-px bg-[#7A8B7C]/20 mx-auto mb-10"></div>
                      
                      <div className="mb-12">
                        <h5 className="font-serif text-2xl text-[#2C1810] mb-4">{event.location || event.locationName}</h5>
                        <p className="font-sans text-[10px] text-[#6B5E55] uppercase tracking-[0.2em] leading-relaxed mb-12">{event.address || event.locationAddress}</p>
                        
                        <button 
                          onClick={() => window.open(event.maps_link || event.mapsLink, '_blank')}
                          className="group relative inline-flex items-center gap-4 px-10 py-5 bg-[#7A8B7C] text-white overflow-hidden transition-all duration-500"
                        >
                          <span className="relative z-10 font-sans text-[9px] font-bold uppercase tracking-[0.5em]">Petunjuk Lokasi</span>
                          <div className="absolute inset-0 bg-[#C9A96E] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                          <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* GUESTBOOK LIST SECTION */}
          <section className="py-40 px-6 bg-white">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-20 gsap-fade-up">
                <p className="font-sans uppercase tracking-[0.4em] text-[#7A8B7C] text-[10px] mb-4 font-bold">Wishes</p>
                <h3 className="font-serif text-5xl text-[#2C1810]">Guestbook</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8 gsap-fade-up">
                {data.guestbook && data.guestbook.length > 0 ? (
                  data.guestbook.slice(0, 6).map((guest, idx) => (
                    <div key={idx} className="p-8 border border-[#7A8B7C]/10 bg-[#FAF8F5] rounded-sm">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="font-serif text-xl text-[#2C1810]">{guest.name}</p>
                          <span className="text-[9px] uppercase tracking-widest text-[#7A8B7C] font-bold">{guest.attendance}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#C9A96E] font-sans tracking-widest">
                            {new Date(guest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
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
                      <p className="font-serif italic text-[#6B5E55] leading-relaxed">"{guest.message}"</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-20 border border-dashed border-[#7A8B7C]/20 rounded-sm">
                    <p className="font-serif italic text-[#6B5E55]/50">Belum ada ucapan dari para tamu...</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RSVP & GIFT SECTION */}
          <section className="py-40 px-6 relative">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-32">
              {/* RSVP */}
              <div className="gsap-fade-up">
                <p className="font-sans uppercase tracking-[0.4em] text-[#7A8B7C] text-[10px] mb-8 font-bold">Reservation</p>
                <h3 className="font-serif text-4xl md:text-6xl text-[#2C1810] mb-8">RSVP</h3>
                <p className="font-serif italic text-[#6B5E55] mb-12 text-lg">Mohon konfirmasi kehadiran Anda untuk menyempurnakan hari bahagia kami.</p>
                {hasSubmitted ? (
                  <div className="py-12 bg-white border border-[#7A8B7C]/10 text-center">
                    <div className="w-12 h-12 border border-[#7A8B7C]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-6 h-6 text-[#7A8B7C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="font-serif text-2xl mb-1 text-[#2C1810] italic">Terima Kasih</h4>
                    <p className="text-[#6B5E55] text-[9px] uppercase tracking-widest font-bold">Kehadiran Anda Telah Terkonfirmasi</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsRSVPOpen(true)}
                    className="w-full py-6 bg-[#7A8B7C] text-white font-sans text-[10px] font-bold uppercase tracking-[0.5em] shadow-xl hover:bg-[#6A7B6C] transition-all"
                  >
                    Confirm Attendance
                  </button>
                )}
              </div>

              {/* Gift */}
              <div className="gsap-fade-up">
                <p className="font-sans uppercase tracking-[0.4em] text-[#7A8B7C] text-[10px] mb-8 font-bold">Wedding Gift</p>
                <h3 className="font-serif text-4xl md:text-6xl text-[#2C1810] mb-8">Tanda Kasih</h3>
                <div className="p-10 border border-[#7A8B7C]/10 bg-white">
                  <p className="font-sans text-[10px] uppercase tracking-widest text-[#C9A96E] mb-4 font-bold">{data.gift.bankName}</p>
                  <p className="font-serif text-3xl text-[#2C1810] mb-2 tracking-widest">{data.gift.accountNumber}</p>
                  <p className="font-sans text-[10px] text-[#6B5E55] uppercase tracking-widest mb-10">A/N {data.gift.accountName}</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => handleCopy(data.gift.accountNumber)}
                      className="flex-1 py-4 border border-[#7A8B7C]/30 text-[#7A8B7C] font-sans text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#7A8B7C] hover:text-white transition-all"
                    >
                      Copy Account
                    </button>
                    {data.gift.qrUrl && (
                      <button 
                        onClick={() => setIsQRISOpen(true)}
                        className="flex-1 py-4 bg-[#7A8B7C]/5 border border-[#7A8B7C]/30 text-[#7A8B7C] font-sans text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#7A8B7C] hover:text-white transition-all"
                      >
                        View QRIS
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-40 text-center bg-[#FAF8F5] border-t border-[#7A8B7C]/10">
            <div className="gsap-fade-up">
              <p className="font-sans uppercase tracking-[0.6em] text-[#7A8B7C] text-[10px] mb-10 font-bold">Thank You</p>
              <h2 className="font-serif text-6xl md:text-8xl text-[#2C1810] tracking-tighter mb-4">{data.bride.name} & {data.groom.name}</h2>
              <div className="w-12 h-px bg-[#7A8B7C]/20 mx-auto mt-8"></div>
            </div>
          </footer>

        </main>

        {/* BOTTOM SHEETS */}
        <BottomSheet isOpen={isRSVPOpen} onClose={() => setIsRSVPOpen(false)} title="RESERVASI">
          <form action={handleRSVP} className="space-y-8 py-8">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] text-[#7A8B7C] font-bold">Nama Lengkap</label>
              <input name="name" required className="w-full bg-transparent border-b border-[#7A8B7C]/30 py-4 font-serif text-lg focus:border-[#7A8B7C] focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] text-[#7A8B7C] font-bold">Kehadiran</label>
              <select name="attendance" className="w-full bg-transparent border-b border-[#7A8B7C]/30 py-4 font-serif text-lg focus:border-[#7A8B7C] focus:outline-none appearance-none">
                <option value="Hadir">Insya Allah, Hadir</option>
                <option value="Tidak Hadir">Maaf, Tidak Bisa Hadir</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] text-[#7A8B7C] font-bold">Doa & Pesan</label>
              <textarea name="message" rows={4} required className="w-full bg-transparent border-b border-[#7A8B7C]/30 py-4 font-serif text-lg focus:border-[#7A8B7C] focus:outline-none resize-none" />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-[#7A8B7C] text-white font-sans font-bold uppercase tracking-[0.4em] text-[10px] transition-all disabled:opacity-50">
              {isSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}
            </button>
          </form>
        </BottomSheet>

        <BottomSheet isOpen={isQRISOpen} onClose={() => setIsQRISOpen(false)} title="QRIS GIFT">
          <div className="p-8 text-center space-y-8">
            <div className="relative w-full aspect-square max-w-[280px] mx-auto border border-[#7A8B7C]/10 p-4 grayscale">
              {data.gift.qrUrl && <Image src={data.gift.qrUrl} alt="QRIS" fill className="object-contain" />}
            </div>
            <p className="font-serif italic text-[#6B5E55]">Terima kasih atas tanda kasih Anda.</p>
          </div>
        </BottomSheet>

      </div>
    </>
  );
}
