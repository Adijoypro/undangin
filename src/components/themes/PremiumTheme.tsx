"use client";

import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "./ThemeWrapper";
import InvitationCover, { ScrollIndicator } from "./InvitationCover";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { InvitationData } from "@/data/invitations";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { submitRSVP } from "@/app/[slug]/actions";
import { toast } from "sonner";
import MapSimulation from "@/components/ui/MapSimulation";
import { QRCodeSVG } from "qrcode.react";
import BottomSheet from "@/components/ui/BottomSheet";

export default function PremiumTheme({ data }: { data: InvitationData }) {
  const { isOpened, onOpen } = useContext(ThemeContext);

  const createCalendarLink = () => {
    const text = encodeURIComponent(`Pernikahan ${data.bride.name} & ${data.groom.name}`);
    const details = encodeURIComponent(`Acara pernikahan ${data.bride.fullName} dan ${data.groom.fullName}.`);
    const location = encodeURIComponent(data.event.locationAddress);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
  };

  useEffect(() => {
    AOS.init({ once: true, offset: 50, duration: 1000, easing: "ease-out-quart" });
    
    // Generate Dust - Optimized count
    const container = document.getElementById("dust-particles");
    if (container && container.children.length === 0) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        particle.className = "dust";
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
        container.appendChild(particle);
      }
    }
  }, []);



  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Nomor rekening tersalin ke clipboard");
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isQRISOpen, setIsQRISOpen] = useState(false);

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
      toast.error(result.error || "Gagal mengirim pesan, silakan coba lagi.");
    }
  };

  return (
    <>
      <InvitationCover 
        bride={data.bride.name} 
        groom={data.groom.name} 
        onOpen={onOpen} 
        forcedOpen={isOpened}
        variant="premium"
      />
      <div className={`transition-opacity duration-1000 w-full min-h-screen ${isOpened ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        {isOpened && <ScrollIndicator color="#D4AF37" />}
        <div className="paper-texture"></div>

      {/* MAIN */}
      <main className={`relative min-h-screen`}>
        <div className="dust-container" id="dust-particles"></div>

        {/* HERO */}
        <section className="min-h-[100svh] flex flex-col items-center justify-center relative px-4 z-10">
            <div className="absolute inset-0 z-0">
                <Image 
                    src={data.couplePhoto || data.bride.photo} 
                    fill
                    className="object-cover opacity-20 grayscale mix-blend-overlay" 
                    alt="Hero"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5] via-transparent to-[#FAF8F5]"></div>
            </div>
            <div className="text-center relative z-10 w-full">
                <p className="font-sans uppercase tracking-[0.5em] text-wedding-sage mb-6 text-xs font-bold" data-aos="fade-down">Tasyakuran Pernikahan</p>
                <div className="flex flex-col items-center justify-center py-4">
                    <h2 className="font-script text-7xl md:text-[120px] leading-[1.2] gold-foil px-4" data-aos="zoom-in">{data.bride.name}</h2>
                    <span className="font-script text-5xl md:text-7xl text-wedding-sage/40 my-2" data-aos="fade-in">&amp;</span>
                    <h2 className="font-script text-7xl md:text-[120px] leading-[1.2] gold-foil px-4" data-aos="zoom-in" data-aos-delay="200">{data.groom.name}</h2>
                </div>
                <div className="mt-12 inline-block border-y border-wedding-gold/30 py-4 px-12" data-aos="fade-up" data-aos-delay="400">
                    <p className="font-serif italic text-wedding-text text-xl">{data.event.date}</p>
                </div>
                <div className="mt-12 w-full flex justify-center" data-aos="fade-up">
                    <CountdownTimer targetDate={data.event.date} theme="premium" />
                </div>
            </div>
        </section>

        {/* QUOTE */}
        <section className="py-24 px-4 bg-wedding-sage text-white relative z-10 text-center">
            <div className="max-w-3xl mx-auto" data-aos="fade-up">
                <p className="font-serif italic text-xl md:text-2xl leading-relaxed text-wedding-base opacity-90 tracking-wide">
                    "{data.quote}"
                </p>
            </div>
        </section>

        {/* PROFILES */}
        <section className="py-32 px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
                    <div className="relative group" data-aos="fade-right">
                        <div className="w-[280px] h-[380px] rounded-t-full rounded-b-xl p-2 border border-wedding-gold/30 relative overflow-hidden">
                            <Image 
                                src={data.bride.photo} 
                                fill
                                className="object-cover rounded-t-full rounded-b-lg filter sepia-[30%] group-hover:sepia-0 transition-all duration-700" 
                                alt="Bride" 
                            />
                        </div>
                        <div className="mt-8">
                            <h4 className="font-serif text-3xl font-bold mb-2 text-wedding-text">{data.bride.fullName}</h4>
                            <p className="text-xs text-wedding-text/70 font-sans uppercase tracking-widest leading-relaxed mb-1 font-medium">Anak dari</p>
                            <p className="text-sm font-serif italic text-wedding-text/80">{data.bride.parents}</p>
                        </div>
                    </div>
                    
                    <div className="text-6xl font-script text-wedding-gold/40 my-8 md:my-0">&amp;</div>

                    <div className="relative group" data-aos="fade-left">
                        <div className="w-[280px] h-[380px] rounded-t-full rounded-b-xl p-2 border border-wedding-gold/30 relative overflow-hidden">
                            <Image 
                                src={data.groom.photo} 
                                fill
                                className="object-cover rounded-t-full rounded-b-lg filter sepia-[30%] group-hover:sepia-0 transition-all duration-700" 
                                alt="Groom" 
                            />
                        </div>
                        <div className="mt-8">
                            <h4 className="font-serif text-3xl font-bold mb-2 text-wedding-text">{data.groom.fullName}</h4>
                            <p className="text-xs text-wedding-text/70 font-sans uppercase tracking-widest leading-relaxed mb-1 font-medium">Anak dari</p>
                            <p className="text-sm font-serif italic text-wedding-text/80">{data.groom.parents}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* STORY */}
        <section className="py-32 px-4 bg-white relative z-10 border-t border-wedding-gold/20">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16" data-aos="fade-up">
                    <h3 className="font-script text-6xl text-wedding-gold mb-2">Love Story</h3>
                    <div className="w-16 h-px bg-wedding-gold mx-auto mt-4"></div>
                </div>
                
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-wedding-gold/20 hidden md:block"></div>
                  
                  <div className="space-y-16">
                    {data.loveStory.map((item: any, i: number) => {
                      const isStructured = typeof item === 'object' && item !== null;
                      const title = isStructured ? item.title : `Chapter ${i + 1}`;
                      const date = isStructured ? item.date : "";
                      const story = isStructured ? item.story : item;

                      return (
                        <div key={i} className={`relative flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`} data-aos="fade-up">
                          {/* Dot */}
                          <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-wedding-gold rounded-full -translate-x-[7px] border-4 border-white shadow-lg z-10 hidden md:block"></div>
                          
                          <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                            <div className={`p-8 bg-[#FAF8F5] rounded-3xl border border-wedding-gold/10 shadow-sm hover:shadow-md transition-all`}>
                              {date && <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wedding-gold/60 mb-2 block">{date}</span>}
                              <h4 className="font-serif text-2xl text-wedding-text mb-3">{title}</h4>
                              <p className="font-serif italic text-wedding-text/70 leading-relaxed">{story}</p>
                            </div>
                          </div>
                          <div className="hidden md:block md:w-1/2"></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
            </div>
        </section>

        {/* EVENT (Multi-Event) */}
        <section className="py-32 px-4 relative z-10 bg-wedding-sage text-white text-center space-y-24">
            <div className="max-w-5xl mx-auto">
                <h3 className="font-serif text-3xl md:text-5xl mb-6 tracking-widest uppercase" data-aos="fade-up">Waktu & Tempat</h3>
                <div className="w-16 h-1 bg-wedding-gold mx-auto mb-16" data-aos="fade-up"></div>

                <div className="space-y-20">
                  {(data.events && data.events.length > 0 ? data.events : [data.event]).map((event: any, index: number) => (
                    <div key={index} className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                      <div className={`bg-white/10 backdrop-blur-md p-10 border border-wedding-gold/30 rounded-t-full rounded-b-[40px] shadow-2xl ${index % 2 === 1 ? 'md:order-2' : ''}`} data-aos="zoom-in">
                          <p className="font-sans text-[10px] uppercase tracking-widest text-wedding-gold mb-4 font-bold">
                            {event.title || (index === 0 ? "Akad Nikah" : "Resepsi")}
                          </p>
                          <p className="font-serif text-2xl md:text-3xl mb-2 text-white">{event.date}</p>
                          <div className="w-12 h-px bg-white/30 mx-auto my-6"></div>
                          <p className="font-sans text-sm font-bold tracking-widest uppercase mb-6">{event.time}</p>
                          <h3 className="font-serif text-2xl text-wedding-gold mb-2">{event.location || event.locationName}</h3>
                          <p className="text-white/80 mb-8 text-sm leading-relaxed">{event.address || event.locationAddress}</p>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                              <a href={event.maps_link || event.mapsLink} target="_blank" className="bg-wedding-gold text-white px-8 py-3 rounded-full hover:bg-white hover:text-wedding-text transition-colors font-sans text-xs uppercase tracking-widest font-bold w-full sm:w-auto">
                                  Buka Maps
                              </a>
                              <a href={createCalendarLink()} target="_blank" className="bg-white text-wedding-gold border border-white px-8 py-3 rounded-full hover:bg-wedding-gold hover:text-white transition-colors font-sans text-xs uppercase tracking-widest font-bold w-full sm:w-auto">
                                  Kalender
                              </a>
                          </div>
                      </div>

                      <div className={`space-y-8 ${index % 2 === 1 ? 'md:order-1' : ''}`} data-aos="fade-left">
                        <MapSimulation 
                          lat={event.latitude ?? -6.2088} 
                          lng={event.longitude ?? 106.8456} 
                          locationName={event.location || event.locationName} 
                        />
                        
                        <div className="bg-white p-8 rounded-[40px] flex flex-col items-center gap-4 shadow-xl border-4 border-wedding-gold/20">
                          <div className="p-4 bg-gray-50 rounded-2xl">
                            <QRCodeSVG value={event.maps_link || event.mapsLink} size={150} />
                          </div>
                          <div className="text-center">
                            <p className="text-wedding-text font-bold text-sm mb-1 uppercase tracking-widest">Scan Navigasi</p>
                            <p className="text-gray-400 text-[10px] italic">Scan untuk petunjuk arah langsung</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
        </section>

        {/* GIFT */}
        <section className="py-32 px-4 bg-wedding-base relative z-10">
            <div className="max-w-2xl mx-auto text-center" data-aos="fade-up">
                <h3 className="font-script text-6xl mb-4 text-wedding-gold">Wedding Gift</h3>
                <div className="bg-white p-10 rounded-2xl shadow-xl border border-wedding-gold/20 relative overflow-hidden group max-w-sm mx-auto mt-12">
                    <p className="font-serif text-4xl mb-2 tracking-widest text-wedding-sage relative z-10">{data.gift.accountNumber}</p>
                    <p className="text-sm font-sans font-bold uppercase tracking-widest text-wedding-text/60 mb-8 relative z-10">{data.gift.bankName} - {data.gift.accountName}</p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 relative z-10">
                      <button onClick={() => handleCopy(data.gift.accountNumber)} className="flex-1 px-6 py-3 border border-wedding-gold text-wedding-text rounded-full hover:bg-wedding-gold hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                          Salin Rekening
                      </button>
                      {data.gift.qrUrl && (
                        <button onClick={() => setIsQRISOpen(true)} className="flex-1 px-6 py-3 bg-wedding-gold text-white rounded-full hover:bg-wedding-sage transition-colors text-xs font-bold uppercase tracking-widest shadow-lg shadow-wedding-gold/20">
                            Lihat QRIS
                        </button>
                      )}
                    </div>
                </div>
            </div>
        </section>
        
        {/* GUESTBOOK & RSVP SECTION */}
        <section className="py-24 px-4 bg-white relative z-10 border-t border-wedding-gold/20">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="font-script text-6xl text-wedding-gold mb-8" data-aos="fade-up">Guestbook</h3>
            
            {/* CTA Button to Open Bottom Sheet */}
            <div className="mb-16" data-aos="zoom-in">
              <button 
                onClick={() => setIsRSVPOpen(true)}
                className="inline-flex flex-col items-center group transition-all duration-500"
              >
                <div className="w-20 h-20 bg-wedding-gold text-white rounded-full flex items-center justify-center shadow-2xl shadow-wedding-gold/40 group-hover:scale-110 active:scale-95 transition-all duration-500 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span className="font-serif text-xl text-wedding-text group-hover:text-wedding-gold transition-colors">Berikan Ucapan & RSVP</span>
                <p className="text-[10px] uppercase tracking-[0.2em] text-wedding-text/40 mt-2">Klik untuk mengisi kehadiran</p>
              </button>
            </div>

            {/* Guestbook List - Aesthetic Display */}
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {data.guestbook && data.guestbook.length > 0 ? (
                data.guestbook.map((guest, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 4) * 0.1 }}
                    key={idx} 
                    className="bg-[#FAF8F5] p-6 rounded-3xl border border-wedding-gold/5 hover:border-wedding-gold/20 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-wedding-gold/10 rounded-full flex items-center justify-center font-serif text-wedding-gold">
                          {guest.name[0]}
                        </div>
                        <div>
                          <p className="font-serif text-lg text-wedding-text leading-tight">{guest.name}</p>
                          <span className={`text-[9px] uppercase tracking-widest font-bold ${guest.attendance === 'Hadir' ? 'text-wedding-sage' : 'text-red-400'}`}>
                            {guest.attendance}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-wedding-text/30 font-sans italic">
                        {new Date(guest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="font-serif text-sm text-wedding-text/70 italic leading-relaxed">"{guest.message}"</p>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 py-12 border-2 border-dashed border-wedding-gold/10 rounded-[3rem] text-wedding-text/30 italic">
                  Belum ada ucapan dari para tamu...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* BOTTOM SHEET RSVP FORM */}
        <BottomSheet 
          isOpen={isRSVPOpen} 
          onClose={() => setIsRSVPOpen(false)} 
          title="Kirim Doa & RSVP"
        >
          <form action={handleRSVP} className="space-y-6">
            <div className="hidden">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-wedding-text/50 ml-1 font-bold">Nama Lengkap</label>
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="Contoh: Budi & Keluarga" 
                className="w-full p-5 bg-gray-50 dark:bg-white/5 border border-wedding-gold/10 rounded-[1.5rem] focus:border-wedding-gold outline-none font-serif text-lg" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-wedding-text/50 ml-1 font-bold">Kehadiran</label>
              <select 
                name="attendance" 
                className="w-full p-5 bg-gray-50 dark:bg-white/5 border border-wedding-gold/10 rounded-[1.5rem] focus:border-wedding-gold outline-none font-serif text-lg appearance-none cursor-pointer"
              >
                <option value="Hadir">Insya Allah, Saya Hadir</option>
                <option value="Tidak Hadir">Maaf, Berhalangan Hadir</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-wedding-text/50 ml-1 font-bold">Ucapan & Doa</label>
              <textarea 
                name="message" 
                rows={5} 
                required 
                placeholder="Tuliskan doa restu Anda..." 
                className="w-full p-5 bg-gray-50 dark:bg-white/5 border border-wedding-gold/10 rounded-[1.5rem] focus:border-wedding-gold outline-none font-serif text-lg resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-5 bg-gradient-to-r from-wedding-gold to-[#B8962E] text-white rounded-[1.5rem] font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-wedding-gold/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Sedang Mengirim..." : "Kirim Mahakarya Doa"}
            </button>
            <p className="text-center text-[10px] text-wedding-text/30 italic">Pesan Anda akan langsung tampil di Buku Tamu.</p>
          </form>
        </BottomSheet>

        {/* PREMIUM QRIS SHEET */}
        <BottomSheet 
          isOpen={isQRISOpen} 
          onClose={() => setIsQRISOpen(false)} 
          title="Digital Wedding Gift"
        >
          <div className="p-8 text-center space-y-8 bg-white">
            <div className="relative w-full aspect-square max-w-[300px] mx-auto bg-gray-50 p-6 rounded-[2.5rem] shadow-inner border border-wedding-gold/10">
              {data.gift.qrUrl && (
                <Image src={data.gift.qrUrl} alt="QRIS" fill className="object-contain p-6" />
              )}
            </div>
            <div className="space-y-3">
              <p className="text-2xl font-serif text-wedding-text">{data.gift.bankName}</p>
              <div className="p-6 bg-[#FAF8F5] rounded-3xl border border-wedding-gold/10">
                <p className="text-xl font-bold tracking-[0.2em] text-wedding-gold">{data.gift.accountNumber}</p>
                <p className="text-[10px] uppercase tracking-widest text-wedding-text/40 mt-2 font-bold">A/N {data.gift.accountName}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsQRISOpen(false)}
              className="w-full py-5 bg-wedding-sage text-white rounded-[1.5rem] font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
            >
              Tutup Jendela Kado
            </button>
          </div>
        </BottomSheet>
      
      {/* FOOTER */}
        <footer className="py-24 text-center bg-wedding-sage text-white relative">
            <h2 className="font-script text-7xl mb-2 gold-foil py-4" data-aos="fade-up">{data.bride.name}</h2>
            <h2 className="font-script text-5xl mb-2 text-wedding-gold" data-aos="fade-in">&amp;</h2>
            <h2 className="font-script text-7xl mb-10 gold-foil py-4" data-aos="fade-up">{data.groom.name}</h2>
        </footer>
      </main>
      </div>
    </>
  );
}
