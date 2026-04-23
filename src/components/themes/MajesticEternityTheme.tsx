"use client";

import { motion, useScroll, useTransform, AnimatePresence, Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";


import { InvitationData } from "@/data/invitations";
import { submitRSVP } from "@/app/[slug]/actions";


export default function MajesticEternityTheme({ data }: { data: InvitationData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Scroll animations
  const { scrollYProgress } = useScroll({ target: containerRef });
  const storyProgress = useTransform(scrollYProgress, [0.3, 0.6], ["0%", "100%"]);

  useEffect(() => {
    if (data.musicUrl) {
      audioRef.current = new Audio(data.musicUrl);
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [data.musicUrl]);

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

  const handleOpen = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const createCalendarLink = () => {
    const text = encodeURIComponent(`Pernikahan ${data.bride.name} & ${data.groom.name}`);
    const details = encodeURIComponent(`Acara pernikahan ${data.bride.fullName} dan ${data.groom.fullName}.`);
    const location = encodeURIComponent(data.event.locationAddress);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
  };

  const colors = {
    bg: "#0A1C14", // Deep Emerald
    gold: "#D4AF37",
    text: "#FFFFFF"
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#D4AF37] selection:text-black bg-[#0A1C14] text-white overflow-hidden relative" ref={containerRef}>

      {/* 1. THE 3D GATE / ENVELOPE OPENING (WOW FACTOR 1) */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#0A1C14]"
            exit={{ opacity: 0, transition: { duration: 1.5, delay: 1 } }}
          >
            {/* Left Gate */}
            <motion.div
              exit={{ x: "-100%" }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#06120C] border-r border-[#D4AF37]/30 flex items-center justify-end pr-2 overflow-hidden shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-20"
            >
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23D4AF37\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
            </motion.div>

            {/* Right Gate */}
            <motion.div
              exit={{ x: "100%" }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#06120C] border-l border-[#D4AF37]/30 flex items-center justify-start pl-2 overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20"
            >
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23D4AF37\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
            </motion.div>

            {/* Center Seal */}
            <motion.div
              exit={{ scale: 0, opacity: 0, rotate: 180 }}
              transition={{ duration: 0.8, ease: "backIn" }}
              className="relative z-30 flex flex-col items-center cursor-pointer group"
              onClick={handleOpen}
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)] border-4 border-[#06120C] transform group-hover:scale-110 transition-transform duration-500">
                <div className="text-[#06120C] font-serif text-4xl font-bold">
                  {data.bride.name[0]}&{data.groom.name[0]}
                </div>
              </div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-8 text-[#D4AF37] text-xs font-bold uppercase tracking-[0.3em] bg-[#0A1C14] px-6 py-2 rounded-full border border-[#D4AF37]/50"
              >
                Ketuk Untuk Membuka
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content (Revealed after opening) */}
      <div className={`transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>

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
            animate={isOpened ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1.5, delay: 1.5 }}
            className="relative z-10 w-full max-w-2xl"
          >
            <p className="font-serif text-[#D4AF37] text-sm uppercase tracking-[0.4em] mb-8">The Wedding Of</p>
            <h1 className="font-script text-7xl md:text-9xl text-white drop-shadow-[0_0_20px_rgba(212,175,55,0.3)] mb-4">{data.bride.name}</h1>
            <p className="font-serif text-2xl md:text-3xl text-[#D4AF37] italic my-2">&</p>
            <h1 className="font-script text-7xl md:text-9xl text-white drop-shadow-[0_0_20px_rgba(212,175,55,0.3)] mb-12">{data.groom.name}</h1>

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
              {/* Point 1 */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group">
                <div className="md:w-1/2 md:text-right pl-16 md:pl-0 md:pr-12">
                  <span className="text-[#D4AF37] font-serif text-xl italic block mb-2">The Beginning</span>
                  <p className="text-gray-300 text-sm font-light leading-relaxed">Berawal dari pertemuan sederhana yang mengubah segalanya. Sebuah tatapan yang menjadi awal dari selamanya.</p>
                </div>
                <div className="absolute left-[15px] md:left-1/2 w-3 h-3 rounded-full bg-[#0A1C14] border-2 border-[#D4AF37] transform md:-translate-x-1/2 mt-1.5 md:mt-0 transition-all duration-500 group-hover:scale-150 group-hover:bg-[#D4AF37] shadow-[0_0_20px_#D4AF37]"></div>
                <div className="hidden md:block md:w-1/2"></div>
              </div>

              {/* Point 2 */}
              <div className="flex flex-col md:flex-row-reverse items-start md:items-center justify-between gap-8 group">
                <div className="md:w-1/2 md:text-left pl-16 md:pl-12">
                  <span className="text-[#D4AF37] font-serif text-xl italic block mb-2">The Proposal</span>
                  <p className="text-gray-300 text-sm font-light leading-relaxed">Dengan restu semesta dan keluarga, kami memutuskan untuk mengikat janji suci dan menyatukan dua hati.</p>
                </div>
                <div className="absolute left-[15px] md:left-1/2 w-3 h-3 rounded-full bg-[#0A1C14] border-2 border-[#D4AF37] transform md:-translate-x-1/2 mt-1.5 md:mt-0 transition-all duration-500 group-hover:scale-150 group-hover:bg-[#D4AF37] shadow-[0_0_20px_#D4AF37]"></div>
                <div className="hidden md:block md:w-1/2"></div>
              </div>
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
                    <img
                      src={data.bride.photo}
                      className="w-full h-full object-cover rounded-t-full grayscale hover:grayscale-0 transition-all duration-1000"
                      alt={data.bride.name}
                    />
                  </div>
                </div>
                <h3 className="text-4xl md:text-5xl mb-4 font-script text-white drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">{data.bride.name}</h3>
                <p className="font-serif text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] mb-6">Mempelai Wanita</p>
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
                    <img
                      src={data.groom.photo}
                      className="w-full h-full object-cover rounded-t-full grayscale hover:grayscale-0 transition-all duration-1000"
                      alt={data.groom.name}
                    />
                  </div>
                </div>
                <h3 className="text-4xl md:text-5xl mb-4 font-script text-white drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">{data.groom.name}</h3>
                <p className="font-serif text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] mb-6">Mempelai Pria</p>
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
              className="bg-white/5 border border-[#D4AF37]/30 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(212,175,55,0.05)] mb-20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-[50px]"></div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="text-left flex-1">
                  <div className="inline-block bg-[#D4AF37] text-black px-4 py-1 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6">VIP Invitation Pass</div>
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

                {/* Mock QR Code */}
                <div className="w-40 h-40 bg-white p-2 rounded-xl flex-shrink-0 flex items-center justify-center relative group">
                  <div className="absolute inset-0 border-2 border-[#D4AF37] rounded-xl scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"></div>
                  {/* Fake QR using pure CSS squares for demo */}
                  <div className="grid grid-cols-5 gap-1 w-full h-full p-2 bg-white">
                    {[...Array(25)].map((_, i) => (
                      <div key={i} className={`bg-black ${i % 3 === 0 || i % 7 === 0 ? 'opacity-100' : 'opacity-0'}`}></div>
                    ))}
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

      </div>

      {/* FLOATING CONTROLS */}
      <AnimatePresence>
        {isOpened && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 items-end"
          >
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBuka undangan digital: https://undangin.com/${data.slug}`)}`}
              target="_blank"
              className="w-12 h-12 rounded-full bg-[#06120C] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:bg-[#D4AF37] hover:text-black hover:scale-110 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>
            {data.musicUrl && (
              <button
                className="w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-110 transition-transform duration-300"
                onClick={() => {
                  if (isPlaying) audioRef.current?.pause();
                  else audioRef.current?.play();
                  setIsPlaying(!isPlaying);
                }}
              >
                {isPlaying ? (
                  <div className="flex gap-1 items-end h-4">
                    <motion.div animate={{ height: ["20%", "100%", "40%", "80%"] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-black rounded-full" />
                    <motion.div animate={{ height: ["60%", "30%", "100%", "50%"] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-black rounded-full" />
                    <motion.div animate={{ height: ["100%", "50%", "20%", "90%"] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-black rounded-full" />
                  </div>
                ) : (
                  <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                )}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
