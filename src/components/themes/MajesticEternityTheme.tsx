"use client";

import { motion, useScroll, useTransform, AnimatePresence, Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import MapSimulation from "@/components/ui/MapSimulation";
import { QRCodeSVG } from "qrcode.react";


import { InvitationData } from "@/data/invitations";
import { submitRSVP } from "@/app/[slug]/actions";


export default function MajesticEternityTheme({ data }: { data: InvitationData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      alert("Terima kasih atas doa dan konfirmasi Anda.");
      (document.getElementById("rsvp-form-majestic") as HTMLFormElement).reset();
    } else {
      alert("Gagal mengirim, silakan coba lagi.");
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

  return (
    <div className="min-h-screen font-sans selection:bg-[#D4AF37] selection:text-black bg-[#0A1C14] text-white overflow-hidden relative" ref={containerRef}>

      {/* Main Content */}
      <div className="relative z-10 pb-32">

        {/* HERO */}
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center">
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
            <h1 className="font-script text-6xl md:text-9xl text-white drop-shadow-[0_0_20px_rgba(212,175,55,0.3)] mb-4">{data.bride.name}</h1>
            <p className="font-serif text-2xl md:text-3xl text-[#D4AF37] italic my-2">&</p>
            <h1 className="font-script text-6xl md:text-9xl text-white drop-shadow-[0_0_20px_rgba(212,175,55,0.3)] mb-12">{data.groom.name}</h1>

            <div className="inline-block border-y border-[#D4AF37]/50 py-4 px-12">
              <p className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-gray-300">{data.event.date}</p>
            </div>
          </motion.div>
        </section>

        {/* DRAW ON SCROLL LOVE STORY (WOW FACTOR 2) */}
        <section className="py-32 px-6 relative bg-[#0A1C14]">
          <div className="max-w-4xl mx-auto text-center mb-20 relative z-10">
            <h2 className="font-serif text-4xl text-[#D4AF37] mb-4">A Journey to Eternity</h2>
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
                      className="object-cover rounded-t-full grayscale hover:grayscale-0 transition-all duration-1000"
                      alt={data.bride.name}
                    />
                  </div>
                </div>
                <h3 className="text-4xl md:text-5xl mb-4 font-script text-white drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">{data.bride.name}</h3>
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
                      className="object-cover rounded-t-full grayscale hover:grayscale-0 transition-all duration-1000"
                      alt={data.groom.name}
                    />
                  </div>
                </div>
                <h3 className="text-4xl md:text-5xl mb-4 font-script text-white drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">{data.groom.name}</h3>
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
        </section>

        {/* EVENT DETAILS & VIP TICKET (WOW FACTOR 3) */}
        <section className="py-32 px-6 relative bg-gradient-to-b from-[#06120C] to-[#0A1C14]">
          <div className="max-w-4xl mx-auto text-center">

            {/* VIP TICKET UI */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-[#D4AF37]/30 backdrop-blur-xl rounded-3xl p-6 md:p-12 shadow-[0_0_50px_rgba(212,175,55,0.05)] mb-20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-[50px]"></div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="text-left flex-1">
                  <div className="inline-block bg-[#D4AF37] text-black px-4 pl-[0.3em] py-1 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6">VIP Invitation Pass</div>
                  <h3 className="font-serif text-4xl text-white mb-2">{data.event.locationName}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8">{data.event.locationAddress}</p>

                  <div className="flex gap-8 border-t border-white/10 pt-6">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Date</p>
                      <p className="font-serif text-white">{data.event.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Time</p>
                      <p className="font-serif text-white">{data.event.time}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-[350px] space-y-6">
                  <MapSimulation 
                    lat={data.event.latitude ?? -6.2088} 
                    lng={data.event.longitude ?? 106.8456} 
                    locationName={data.event.locationName} 
                  />
                  
                  <div className="bg-white p-6 rounded-2xl flex items-center justify-between gap-4">
                    <div className="text-left">
                      <p className="text-black font-bold text-xs uppercase tracking-widest">Digital Pass</p>
                      <p className="text-gray-400 text-[10px] italic">Scan for navigation</p>
                    </div>
                    <div className="bg-gray-50 p-1 rounded-lg">
                      <QRCodeSVG value={data.event.mapsLink} size={80} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href={data.event.mapsLink} target="_blank" className="w-full sm:w-auto px-10 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-colors duration-500">
                Direction to Venue
              </a>
              <a href={createCalendarLink()} target="_blank" className="w-full sm:w-auto px-10 py-4 border border-[#D4AF37] text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#D4AF37] hover:text-black transition-colors duration-500">
                Save to Calendar
              </a>
            </div>
          </div>
        </section>

        {/* TURUT MENGUNDANG */}
        {data.turut_mengundang && (
          <section className="py-24 px-6 bg-[#06120C]">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-serif text-3xl text-[#D4AF37] mb-10">Turut Mengundang</h2>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                {data.turut_mengundang.split(',').map((name, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-gray-300 font-light tracking-wide italic"
                  >
                    {name.trim()}
                  </motion.span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* RSVP FORM */}
        <section className="py-24 px-6 bg-[#0A1C14]">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl text-white mb-4">Kehadiran Anda</h2>
              <p className="text-gray-400 text-sm">Merupakan suatu kehormatan jika Anda dapat hadir.</p>
            </div>

            <form className="space-y-6" id="rsvp-form-majestic" action={handleRSVP}>
              <div>
                <input type="text" name="name" placeholder="Nama Lengkap" className="w-full bg-[#06120C] border border-[#D4AF37]/30 text-white px-6 py-4 focus:outline-none focus:border-[#D4AF37] transition-colors" required />
              </div>
              <div>
                <select name="attendance" className="w-full bg-[#06120C] border border-[#D4AF37]/30 text-white px-6 py-4 focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none" required>
                  <option value="">Konfirmasi Kehadiran</option>
                  <option value="Hadir">Akan Hadir</option>
                  <option value="Tidak Hadir">Maaf, Tidak Bisa Hadir</option>
                </select>
              </div>
              <div>
                <textarea name="message" placeholder="Pesan & Doa (Opsional)" rows={4} className="w-full bg-[#06120C] border border-[#D4AF37]/30 text-white px-6 py-4 focus:outline-none focus:border-[#D4AF37] transition-colors"></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-colors disabled:opacity-50">
                {isSubmitting ? "Mengirim..." : "Kirim RSVP"}
              </button>
            </form>
          </div>
        </section>

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

      </div>


    </div>
  );
}
