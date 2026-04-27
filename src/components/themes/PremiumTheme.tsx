"use client";

import { useEffect, useState } from "react";
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

export default function PremiumTheme({ data }: { data: InvitationData }) {


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

  const handleRSVP = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.append("invitation_id", data.id);
    formData.append("slug", data.slug);
    
    const result = await submitRSVP(formData);
    
    setIsSubmitting(false);
    if (result.success) {
      toast.success("Terima kasih atas doa dan kehadiran Anda!");
      (document.getElementById("rsvp-form") as HTMLFormElement).reset();
    } else {
      toast.error(result.error || "Gagal mengirim pesan, silakan coba lagi.");
    }
  };

  return (
    <>
      <div className="paper-texture"></div>

      {/* MAIN */}
      <main className={`relative h-full overflow-y-auto`}>
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

        {/* EVENT */}
        <section className="py-32 px-4 relative z-10 bg-wedding-sage text-white text-center">
            <div className="max-w-5xl mx-auto">
                <h3 className="font-serif text-3xl md:text-4xl mb-6 tracking-widest uppercase" data-aos="fade-up">Akad Nikah</h3>
                <div className="w-16 h-1 bg-wedding-gold mx-auto mb-12" data-aos="fade-up"></div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="bg-white/10 backdrop-blur-md p-10 border border-wedding-gold/30 rounded-t-full rounded-b-[40px] shadow-2xl" data-aos="zoom-in">
                      <p className="font-serif text-3xl mb-2 text-wedding-gold">{data.event.dateFormatted.day}</p>
                      <p className="font-serif text-6xl font-bold text-white mb-2">{data.event.dateFormatted.date}</p>
                      <p className="font-serif text-2xl text-wedding-gold mb-6">{data.event.dateFormatted.monthYear}</p>
                      <div className="w-12 h-px bg-white/30 mx-auto my-6"></div>
                      <p className="font-sans text-sm font-bold tracking-widest uppercase mb-6">{data.event.time}</p>
                      <h3 className="font-serif text-2xl text-wedding-gold mb-2">{data.event.locationName}</h3>
                      <p className="text-white/80 mb-6">{data.event.locationAddress}</p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                          <a href={data.event.mapsLink} target="_blank" className="bg-wedding-gold text-white px-8 py-3 rounded-full hover:bg-white hover:text-wedding-text transition-colors font-sans text-xs uppercase tracking-widest font-bold">
                              Buka Google Maps
                          </a>
                          <a href={createCalendarLink()} target="_blank" className="bg-white text-wedding-gold border border-white px-8 py-3 rounded-full hover:bg-wedding-gold hover:text-white transition-colors font-sans text-xs uppercase tracking-widest font-bold">
                              Simpan Kalender
                          </a>
                      </div>
                  </div>

                  <div className="space-y-8" data-aos="fade-left">
                    <MapSimulation 
                      lat={data.event.latitude ?? -6.2088} 
                      lng={data.event.longitude ?? 106.8456} 
                      locationName={data.event.locationName} 
                    />
                    
                    <div className="bg-white p-8 rounded-[40px] flex flex-col items-center gap-4 shadow-xl border-4 border-wedding-gold/20">
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <QRCodeSVG value={data.event.mapsLink} size={150} />
                      </div>
                      <div className="text-center">
                        <p className="text-wedding-text font-bold text-sm mb-1 uppercase tracking-widest">Scan Navigasi</p>
                        <p className="text-gray-400 text-[10px] italic">Scan untuk petunjuk arah langsung</p>
                      </div>
                    </div>
                  </div>
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
                    <button onClick={() => handleCopy(data.gift.accountNumber)} className="px-6 py-3 border border-wedding-gold text-wedding-text rounded-full hover:bg-wedding-gold hover:text-white transition-colors text-xs font-bold uppercase tracking-widest w-full">
                        Salin Rekening
                    </button>
                </div>
            </div>
        </section>
        
        {/* GUESTBOOK & RSVP */}
      <section className="py-32 px-4 bg-white relative z-10 border-t border-wedding-gold/20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          <div data-aos="fade-right">
            <h3 className="font-script text-6xl text-wedding-gold mb-4">RSVP</h3>
            <p className="font-sans text-sm text-gray-500 mb-8 leading-relaxed">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.</p>
            
            <form id="rsvp-form" action={handleRSVP} className="space-y-6">
              {/* Honeypot field for spam protection */}
              <div className="hidden">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              
              <div>
                <input type="text" name="name" required placeholder="Nama Lengkap" className="w-full p-4 border border-gray-200 rounded-xl focus:border-wedding-gold outline-none bg-gray-50 font-sans text-sm" />
              </div>
              <div>
                <select name="attendance" className="w-full p-4 border border-gray-200 rounded-xl focus:border-wedding-gold outline-none bg-gray-50 font-sans text-sm appearance-none">
                  <option value="Hadir">Ya, Saya akan hadir</option>
                  <option value="Tidak Hadir">Maaf, saya tidak bisa hadir</option>
                </select>
              </div>
              <div>
                <textarea name="message" rows={4} required placeholder="Berikan ucapan dan doa restu..." className="w-full p-4 border border-gray-200 rounded-xl focus:border-wedding-gold outline-none bg-gray-50 font-sans text-sm resize-none"></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-wedding-gold text-white rounded-xl hover:bg-[#B8982D] transition-colors font-sans text-xs font-bold uppercase tracking-widest disabled:opacity-50 shadow-lg"
              >
                {isSubmitting ? "Mengirim..." : "Kirim RSVP"}
              </button>
            </form>
          </div>

          <div data-aos="fade-left" className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex flex-col h-full">
            <h3 className="font-serif text-2xl text-wedding-text mb-6">Buku Tamu ({data.guestbook?.length || 0})</h3>
            <div className="flex-1 max-h-[500px] overflow-y-auto pr-4 space-y-4 scrollbar-thin scrollbar-thumb-wedding-gold/20 scrollbar-track-transparent">
              {data.guestbook && data.guestbook.length > 0 ? (
                data.guestbook.map((guest, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative group/entry">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-sans font-bold text-wedding-text text-sm">{guest.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-md ${guest.attendance === 'Hadir' ? 'bg-wedding-sage/10 text-wedding-sage font-bold' : 'bg-red-50 text-red-500 font-bold'}`}>
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
                    <p className="font-serif text-sm text-gray-600 leading-relaxed italic">"{guest.message}"</p>
                    <p className="font-sans text-[10px] text-gray-400 mt-3">
                      {new Date(guest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic">Belum ada ucapan.</p>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* FOOTER */}
        <footer className="py-24 text-center bg-wedding-sage text-white relative">
            <h2 className="font-script text-7xl mb-2 gold-foil py-4" data-aos="fade-up">{data.bride.name}</h2>
            <h2 className="font-script text-5xl mb-2 text-wedding-gold" data-aos="fade-in">&amp;</h2>
            <h2 className="font-script text-7xl mb-10 gold-foil py-4" data-aos="fade-up">{data.groom.name}</h2>
            <p className="font-sans text-[10px] uppercase tracking-widest opacity-30 border-t border-white/20 pt-8 inline-block">Powered by Undangin</p>
        </footer>
      </main>

    </>
  );
}
