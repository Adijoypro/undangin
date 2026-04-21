"use client";

import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, AnimatePresence } from "framer-motion";
import { InvitationData } from "@/data/invitations";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { submitRSVP } from "@/app/[slug]/actions";

export default function PremiumTheme({ data }: { data: InvitationData }) {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showToast, setShowToast] = useState(false);

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

  const openGate = () => {
    setIsOpened(true);
    setTimeout(() => AOS.refresh(), 500);
    const audio = document.getElementById("bgm") as HTMLAudioElement;
    if (audio) {
      audio.play().catch(e => console.log(e));
      setIsPlaying(true);
    }
  };

  const toggleMusic = () => {
    const audio = document.getElementById("bgm") as HTMLAudioElement;
    if (audio) {
      if (audio.paused) {
        audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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
      alert("Terima kasih atas doa dan kehadiran Anda!");
      (document.getElementById("rsvp-form") as HTMLFormElement).reset();
    } else {
      alert("Gagal mengirim pesan, silakan coba lagi.");
    }
  };

  return (
    <>
      <div className="paper-texture"></div>

      {/* GATE */}
      <div className={`fixed inset-0 z-[100] flex w-full h-full pointer-events-none transition-opacity duration-1000 ${isOpened ? 'opacity-0' : 'opacity-100'}`}>
        <div className={`door relative w-1/2 h-full bg-wedding-sage overflow-hidden pointer-events-auto border-r border-wedding-gold/30 ${isOpened ? 'translate-x-[-100%]' : ''}`}>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 text-wedding-gold opacity-30 spin-slow">
              <svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0 C40 40 10 40 0 50 C10 60 40 60 50 100 C60 60 90 60 100 50 C90 40 60 40 50 0 Z"/></svg>
          </div>
        </div>
        <div className={`door relative w-1/2 h-full bg-wedding-sage overflow-hidden pointer-events-auto ${isOpened ? 'translate-x-[100%]' : ''}`}>
        </div>

        <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-auto z-10 transition-opacity duration-500 ${isOpened ? 'opacity-0 pointer-events-none' : ''}`}>
          <div className="text-center p-8 bg-white/5 backdrop-blur-md border border-wedding-gold/40 shadow-[0_0_50px_rgba(212,175,55,0.2)] flex flex-col items-center max-w-sm w-11/12 rounded-[50px_50px_10px_10px]">
              <p className="font-sans uppercase tracking-[0.4em] text-[10px] text-wedding-gold mb-2">Tasyakuran Pernikahan</p>
              <h1 className="font-script text-6xl text-white drop-shadow-lg leading-none mt-4">{data.bride.name}</h1>
              <span className="font-serif text-2xl text-wedding-gold my-2">&amp;</span>
              <h1 className="font-script text-6xl text-white drop-shadow-lg leading-none mb-6">{data.groom.name}</h1>
              <p className="font-sans text-[10px] uppercase tracking-widest text-white/70 mb-2 border-t border-wedding-gold/30 pt-4 w-full">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="font-serif text-lg text-wedding-gold mb-6 italic">Tamu Undangan</p>
              <button onClick={openGate} className="group relative px-6 py-3 border-2 border-wedding-gold text-wedding-gold rounded-full hover:bg-wedding-gold hover:text-white transition-all duration-500 overflow-hidden w-full max-w-[200px]">
                  <span className="relative z-10 font-sans text-[10px] uppercase tracking-widest font-bold">Buka Undangan</span>
              </button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className={`h-screen overflow-y-auto relative ${!isOpened ? 'hidden' : ''}`}>
        <div className="dust-container" id="dust-particles"></div>

        <button onClick={toggleMusic} className="fixed bottom-8 right-8 z-50 bg-transparent text-wedding-gold hover:scale-110 transition-transform duration-300">
            <svg className={`w-12 h-12 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)] ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="#2B2B2B" stroke="#D4AF37" strokeWidth="2"/>
                <circle cx="50" cy="50" r="12" fill="#D4AF37"/>
                <path d="M48 45 v-10 h8 v3 h-5 v10 a3 3 0 1 1 -3 -3" fill="#FAF8F5"/>
            </svg>
        </button>
        <audio id="bgm" loop preload="auto">
            <source src={data.musicUrl} type="audio/mpeg" />
        </audio>

        {/* HERO */}
        <section className="min-h-[100svh] flex flex-col items-center justify-center relative px-4 z-10">
            <div className="text-center relative z-10 w-full">
                <p className="font-sans uppercase tracking-[0.5em] text-wedding-sage mb-6 text-xs font-bold" data-aos="fade-down">Tasyakuran Pernikahan</p>
                <div className="flex flex-col items-center justify-center">
                    <h2 className="font-script text-8xl md:text-[140px] leading-[0.7] gold-foil py-4" data-aos="zoom-in">{data.bride.name}</h2>
                    <span className="font-script text-6xl md:text-8xl text-wedding-sage/40 -mt-2 mb-2" data-aos="fade-in">&amp;</span>
                    <h2 className="font-script text-8xl md:text-[140px] leading-[0.7] gold-foil py-4 ml-12 md:ml-32" data-aos="zoom-in">{data.groom.name}</h2>
                </div>
                <div className="w-px h-24 bg-gradient-to-b from-wedding-gold to-transparent mx-auto mt-12 mb-8" data-aos="fade-up"></div>
                <p className="text-xl md:text-2xl font-serif text-wedding-text tracking-[0.4em] uppercase" data-aos="fade-up">{data.event.date}</p>
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
                        <div className="w-[280px] h-[380px] rounded-t-full rounded-b-xl p-2 border border-wedding-gold/30">
                            <img src={data.bride.photo} className="w-full h-full object-cover rounded-t-full rounded-b-lg filter sepia-[30%] group-hover:sepia-0 transition-all duration-700" alt="Bride" />
                        </div>
                        <div className="mt-8">
                            <h4 className="font-serif text-3xl font-bold mb-2 text-wedding-text">{data.bride.fullName}</h4>
                            <p className="text-xs text-wedding-text/70 font-sans uppercase tracking-widest leading-relaxed mb-1 font-medium">Anak dari</p>
                            <p className="text-sm font-serif italic text-wedding-text/80">{data.bride.parents}</p>
                        </div>
                    </div>
                    
                    <div className="text-6xl font-script text-wedding-gold/40 my-8 md:my-0">&amp;</div>

                    <div className="relative group" data-aos="fade-left">
                        <div className="w-[280px] h-[380px] rounded-t-full rounded-b-xl p-2 border border-wedding-gold/30">
                            <img src={data.groom.photo} className="w-full h-full object-cover rounded-t-full rounded-b-lg filter sepia-[30%] group-hover:sepia-0 transition-all duration-700" alt="Groom" />
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
                <div className="space-y-12 font-serif text-wedding-text/80 leading-relaxed text-justify relative">
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-wedding-gold/30 hidden md:block"></div>
                    {data.loveStory.map((story, i) => (
                      <div key={i} className="relative flex flex-col md:flex-row md:justify-between items-center w-full" data-aos="fade-up">
                          <div className={`md:w-[45%] ${i % 2 === 0 ? 'md:text-right pr-0 md:pr-8' : 'order-last pl-0 md:pl-8 md:text-left'} mb-4 md:mb-0`}>
                              {i % 2 !== 0 && <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-wedding-gold rounded-full -translate-x-1.5 shadow-[0_0_10px_rgba(212,175,55,0.8)] hidden md:block"></div>}
                              <p>{story}</p>
                          </div>
                          {i % 2 === 0 && <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-wedding-gold rounded-full -translate-x-1.5 shadow-[0_0_10px_rgba(212,175,55,0.8)] hidden md:block"></div>}
                          <div className={`md:w-[45%] ${i % 2 === 0 ? 'pl-0 md:pl-8' : 'pr-0 md:pr-8'}`}></div>
                      </div>
                    ))}
                </div>
            </div>
        </section>

        {/* EVENT */}
        <section className="py-32 px-4 relative z-10 bg-wedding-sage text-white text-center">
            <div className="max-w-3xl mx-auto">
                <h3 className="font-serif text-3xl md:text-4xl mb-6 tracking-widest uppercase" data-aos="fade-up">Akad Nikah</h3>
                <div className="w-16 h-1 bg-wedding-gold mx-auto mb-12" data-aos="fade-up"></div>

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
                            Simpan ke Kalender
                        </a>
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
                  <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-sans font-bold text-wedding-text text-sm">{guest.name}</span>
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-md ${guest.attendance === 'Hadir' ? 'bg-wedding-sage/10 text-wedding-sage font-bold' : 'bg-red-50 text-red-500 font-bold'}`}>
                        {guest.attendance}
                      </span>
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
            <h2 className="font-script text-7xl mb-4 gold-foil">{data.bride.name}</h2>
            <h2 className="font-script text-4xl mb-4 text-wedding-gold">&amp;</h2>
            <h2 className="font-script text-7xl mb-10 gold-foil">{data.groom.name}</h2>
            <p className="font-sans text-[10px] uppercase tracking-widest opacity-30 border-t border-white/20 pt-8 inline-block">Powered by Undangin</p>
        </footer>
      </main>

      {/* TOAST */}
      <div className={`fixed z-[9999] top-10 left-1/2 -translate-x-1/2 bg-white text-wedding-text px-8 py-4 border border-wedding-gold/30 font-sans text-xs font-bold uppercase tracking-widest shadow-2xl flex items-center gap-3 transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
          <span>Tersalin ke clipboard</span>
      </div>
    </>
  );
}
