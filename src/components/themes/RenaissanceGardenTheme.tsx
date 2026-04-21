"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, Variants, AnimatePresence } from "framer-motion";
import { InvitationData } from "@/data/invitations";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { submitRSVP } from "@/app/[slug]/actions";

export default function RenaissanceGardenTheme({ data }: { data: InvitationData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });
  const heroY = useTransform(smoothProgress, [0, 0.3], ["0%", "30%"]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.25], [1, 0]);

  const openInvitation = () => {
    setIsOpened(true);
    const audio = document.getElementById("rg-audio") as HTMLAudioElement;
    if (audio) audio.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const toggleMusic = () => {
    const audio = document.getElementById("rg-audio") as HTMLAudioElement;
    if (audio) {
      if (audio.paused) { audio.play(); setIsPlaying(true); }
      else { audio.pause(); setIsPlaying(false); }
    }
  };

  const handleRSVP = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.append("invitation_id", data.id);
    formData.append("slug", data.slug);
    const result = await submitRSVP(formData);
    setIsSubmitting(false);
    if (result.success) {
      alert("Terima kasih atas konfirmasi Anda.");
      (document.getElementById("rsvp-form-rg") as HTMLFormElement).reset();
    } else { alert("Gagal mengirim, silakan coba lagi."); }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Nomor rekening tersalin.");
  };

  const createCalendarLink = () => {
    const text = encodeURIComponent(`Pernikahan ${data.bride.name} & ${data.groom.name}`);
    const details = encodeURIComponent(`Acara pernikahan ${data.bride.fullName} dan ${data.groom.fullName}.`);
    const location = encodeURIComponent(data.event.locationAddress);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
  };

  // CSS-based ornament as SVG fallback
  const Ornament = ({ className = "" }: { className?: string }) => (
    <svg className={`w-32 h-8 ${className}`} viewBox="0 0 200 40" fill="none">
      <path d="M0 20 Q50 0 100 20 Q150 40 200 20" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4"/>
      <circle cx="100" cy="20" r="3" fill="currentColor" opacity="0.3"/>
      <circle cx="60" cy="12" r="2" fill="currentColor" opacity="0.2"/>
      <circle cx="140" cy="28" r="2" fill="currentColor" opacity="0.2"/>
    </svg>
  );

  const palette = {
    bg: "#F5EFE6",
    card: "#FFFDF8",
    text: "#3D3229",
    textMuted: "#7A6E62",
    accent: "#8B7355",
    gold: "#B8963E",
    rose: "#C4867A",
    sage: "#8FA68A",
  };

  return (
    <>
      <audio id="rg-audio" loop preload="auto">
        <source src={data.musicUrl} type="audio/mpeg" />
      </audio>

      {/* ═══ COVER ═══ */}
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-1000 overflow-hidden ${isOpened ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'}`}
        style={{ backgroundColor: palette.bg }}>
        {/* Garden BG */}
        <div className="absolute inset-0">
          <img src="/assets/renaissance/garden-bg.jpg" className="w-full h-full object-cover opacity-60"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${palette.bg}88, transparent 30%, transparent 70%, ${palette.bg}dd)` }}></div>
        </div>
        {/* Botanical corners */}
        <img src="/assets/renaissance/botanical-corner.png" className="absolute top-0 left-0 w-40 md:w-56 opacity-70"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        <img src="/assets/renaissance/botanical-corner.png" className="absolute top-0 right-0 w-40 md:w-56 opacity-70 -scale-x-100"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        <img src="/assets/renaissance/botanical-corner.png" className="absolute bottom-0 left-0 w-40 md:w-56 opacity-70 -scale-y-100"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        <img src="/assets/renaissance/botanical-corner.png" className="absolute bottom-0 right-0 w-40 md:w-56 opacity-70 -scale-x-100 -scale-y-100"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }} className="text-center relative z-10 px-4">
          {/* Oval Photo Frame */}
          <div className="relative w-48 h-56 md:w-56 md:h-64 mx-auto mb-8">
            <img src="/assets/renaissance/oval-frame.png" className="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="absolute inset-[12%] overflow-hidden rounded-[50%] z-10">
              <img src={data.bride.photo} className="w-full h-full object-cover" />
            </div>
          </div>

          <p className="text-sm tracking-[0.3em] mb-3" style={{ color: palette.textMuted }}>
            We invite you to The Wedding of
          </p>
          <h1 className="font-serif text-4xl md:text-6xl italic mb-8" style={{ color: palette.text }}>
            {data.bride.name} & {data.groom.name}
          </h1>
          <button onClick={openInvitation}
            className="px-10 py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all duration-500 hover:scale-105"
            style={{ backgroundColor: palette.accent, color: '#fff' }}>
            Open the Invitation ✉
          </button>
        </motion.div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div ref={containerRef} className={`min-h-screen overflow-hidden font-serif ${!isOpened ? 'hidden' : ''}`}
        style={{ backgroundColor: palette.bg, color: palette.text }}>

        {/* Floating Controls */}
        <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-4 items-end">
          <a 
            href={`https://wa.me/?text=${encodeURIComponent(`Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBuka undangan digital: https://undangin.com/${data.slug}`)}`}
            target="_blank"
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 hover:scale-110"
            style={{ backgroundColor: palette.bg, color: palette.accent, border: `1px solid ${palette.accent}40` }}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          <button onClick={toggleMusic}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 hover:scale-110"
            style={{ backgroundColor: palette.accent, color: '#fff' }}>
            <svg className={`w-5 h-5 ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </button>
        </div>

        {/* ═══ HERO ═══ */}
        <motion.section style={{ y: heroY, opacity: heroOpacity }}
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img src="/assets/renaissance/garden-bg.jpg" className="w-full h-full object-cover opacity-50"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${palette.bg}66, ${palette.bg}cc)` }}></div>
          </div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10 text-center px-4 py-20">
            <Ornament className="mx-auto mb-8" />
            <p className="text-xs tracking-[0.5em] uppercase mb-6" style={{ color: palette.accent }}>Our Wedding Day</p>
            <h1 className="text-5xl md:text-8xl italic mb-6 leading-tight">{data.bride.name} <span className="text-3xl md:text-5xl" style={{ color: palette.gold }}>&</span> {data.groom.name}</h1>
            <Ornament className="mx-auto mt-4 mb-12" />
            <CountdownTimer targetDate={data.event.date} theme="premium" />
            <div className="mt-10">
              <a href={createCalendarLink()} target="_blank"
                className="inline-block px-8 py-3 text-xs tracking-[0.3em] uppercase border transition-all duration-500 hover:text-white"
                style={{ borderColor: palette.accent, color: palette.accent }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = palette.accent)}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = palette.accent; }}>
                Save the Date
              </a>
            </div>
          </motion.div>
        </motion.section>

        {/* ═══ COUPLE ═══ */}
        <section className="py-24 md:py-40 px-4 relative overflow-hidden" style={{ backgroundColor: palette.card }}>
          <img src="/assets/renaissance/botanical-corner.png" className="absolute top-0 right-0 w-48 opacity-30 -scale-x-100"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
              <Ornament className="mx-auto mb-6" />
              <p className="text-base italic leading-relaxed max-w-2xl mx-auto" style={{ color: palette.textMuted }}>
                {data.loveStory[0] || "Kami adalah sepasang manusia yang sedang berbahagia dan mengundang Anda untuk hadir di hari bahagia kami."}
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-16 md:gap-24">
              {/* Bride */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
                <div className="relative w-64 h-72 md:w-72 md:h-80 mx-auto mb-8">
                  <img src="/assets/renaissance/oval-frame.png" className="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div className="absolute inset-[10%] overflow-hidden rounded-[50%] z-10">
                    <img src={data.bride.photo} className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" />
                  </div>
                </div>
                <h3 className="text-3xl italic mb-2">{data.bride.fullName}</h3>
                <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: palette.accent }}>Putri Dari</p>
                <p className="text-sm italic" style={{ color: palette.textMuted }}>{data.bride.parents}</p>
              </motion.div>
              {/* Groom */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
                <div className="relative w-64 h-72 md:w-72 md:h-80 mx-auto mb-8">
                  <img src="/assets/renaissance/oval-frame.png" className="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div className="absolute inset-[10%] overflow-hidden rounded-[50%] z-10">
                    <img src={data.groom.photo} className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" />
                  </div>
                </div>
                <h3 className="text-3xl italic mb-2">{data.groom.fullName}</h3>
                <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: palette.accent }}>Putra Dari</p>
                <p className="text-sm italic" style={{ color: palette.textMuted }}>{data.groom.parents}</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ LOVE STORY ═══ */}
        <section className="py-24 md:py-40 px-4 relative overflow-hidden" style={{ backgroundColor: palette.bg }}>
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-3xl md:text-5xl italic mb-4">Our Story</h2>
              <Ornament className="mx-auto mb-10" />
              {data.loveStory.map((paragraph, idx) => (
                <p key={idx} className="text-base leading-[2] mb-6" style={{ color: palette.textMuted }}>{paragraph}</p>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ EVENT ═══ */}
        <section className="py-24 md:py-40 px-4 relative overflow-hidden" style={{ backgroundColor: palette.card }}>
          <img src="/assets/renaissance/botanical-corner.png" className="absolute bottom-0 left-0 w-48 opacity-20 -scale-y-100"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-3xl md:text-5xl italic mb-4">Lokasi</h2>
              <Ornament className="mx-auto mb-6" />
              <p className="text-sm mb-12" style={{ color: palette.textMuted }}>
                Dengan penuh rasa hormat kami mengharapkan kehadiran Bapak/Ibu/Saudara sekalian
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="p-10 md:p-16 border max-w-2xl mx-auto" style={{ borderColor: palette.gold + '30', backgroundColor: palette.bg }}>
              <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: palette.accent }}>Acara Pernikahan</p>
              <h3 className="text-2xl md:text-4xl italic mb-6">{data.event.dateFormatted.day}, {data.event.dateFormatted.date} {data.event.dateFormatted.monthYear}</h3>
              <div className="w-12 h-px mx-auto mb-6" style={{ backgroundColor: palette.gold + '40' }}></div>
              <p className="text-lg mb-2">{data.event.time}</p>
              <h4 className="text-xl italic mb-2" style={{ color: palette.gold }}>{data.event.locationName}</h4>
              <p className="text-sm mb-10" style={{ color: palette.textMuted }}>{data.event.locationAddress}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={data.event.mapsLink} target="_blank"
                  className="px-8 py-3 text-xs tracking-[0.2em] uppercase text-white transition-all duration-500 hover:opacity-80"
                  style={{ backgroundColor: palette.accent }}>
                  Lokasi
                </a>
                <a href={createCalendarLink()} target="_blank"
                  className="px-8 py-3 text-xs tracking-[0.2em] uppercase border transition-all duration-500"
                  style={{ borderColor: palette.accent, color: palette.accent }}>
                  Simpan Tanggal
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ RSVP ═══ */}
        <section className="py-24 md:py-40 px-4" style={{ backgroundColor: palette.bg }}>
          <div className="max-w-xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl italic mb-4">RSVP</h2>
              <Ornament className="mx-auto" />
            </motion.div>
            <motion.form id="rsvp-form-rg" action={handleRSVP} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-8">
              <input type="text" name="name" required placeholder="Nama Lengkap"
                className="w-full bg-transparent border-b py-4 text-sm tracking-widest focus:outline-none transition-colors"
                style={{ borderColor: palette.accent + '30', color: palette.text }} />
              <select name="attendance"
                className="w-full bg-transparent border-b py-4 text-sm tracking-widest focus:outline-none appearance-none cursor-pointer"
                style={{ borderColor: palette.accent + '30', color: palette.text }}>
                <option value="Hadir">Saya Akan Hadir</option>
                <option value="Tidak Hadir">Tidak Bisa Hadir</option>
              </select>
              <textarea name="message" rows={3} required placeholder="Ucapan & Doa"
                className="w-full bg-transparent border-b py-4 text-sm tracking-widest focus:outline-none resize-none"
                style={{ borderColor: palette.accent + '30', color: palette.text }}></textarea>
              <button type="submit" disabled={isSubmitting}
                className="w-full py-4 text-xs tracking-[0.3em] uppercase text-white transition-all duration-500 hover:opacity-80 disabled:opacity-50"
                style={{ backgroundColor: palette.accent }}>
                {isSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}
              </button>
            </motion.form>
          </div>
        </section>

        {/* ═══ GUESTBOOK ═══ */}
        <section className="py-24 px-4" style={{ backgroundColor: palette.card }}>
          <div className="max-w-3xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl italic mb-4">Wedding Wishes</h2>
              <Ornament className="mx-auto" />
            </motion.div>
            <div className="space-y-8 max-h-[600px] overflow-y-auto pr-4">
              <AnimatePresence mode="popLayout">
                {data.guestbook && data.guestbook.length > 0 ? (
                  data.guestbook.map((guest, idx) => (
                    <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                      className="p-8 border" style={{ borderColor: palette.gold + '15', backgroundColor: palette.bg }}>
                      <div className="flex justify-between items-center mb-4 pb-4 border-b" style={{ borderColor: palette.gold + '10' }}>
                        <span className="text-sm font-medium tracking-widest" style={{ color: palette.accent }}>{guest.name}</span>
                        <span className={`text-[10px] tracking-widest px-3 py-1 ${guest.attendance === 'Hadir' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                          {guest.attendance}
                        </span>
                      </div>
                      <p className="text-sm italic leading-relaxed" style={{ color: palette.textMuted }}>"{guest.message}"</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center italic text-sm" style={{ color: palette.textMuted }}>Jadilah yang pertama memberikan ucapan.</p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ═══ GIFT ═══ */}
        <section className="py-24 px-4" style={{ backgroundColor: palette.bg }}>
          <div className="max-w-xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-3xl md:text-5xl italic mb-4">E-Angpao</h2>
              <Ornament className="mx-auto mb-6" />
              <p className="text-sm mb-12" style={{ color: palette.textMuted }}>
                Bagi yang ingin memberikan tanda kasih, dapat mengirimkan melalui:
              </p>
              <div className="p-10 border" style={{ borderColor: palette.gold + '20', backgroundColor: palette.card }}>
                <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: palette.accent }}>{data.gift.bankName}</p>
                <p className="text-3xl tracking-[0.15em] mb-2 font-serif">{data.gift.accountNumber}</p>
                <p className="text-xs mb-8" style={{ color: palette.textMuted }}>A/N {data.gift.accountName}</p>
                <button onClick={() => handleCopy(data.gift.accountNumber)}
                  className="px-8 py-3 text-xs tracking-[0.2em] uppercase border transition-all duration-500 hover:text-white"
                  style={{ borderColor: palette.accent, color: palette.accent }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = palette.accent)}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = palette.accent; }}>
                  Salin Rekening
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="py-20 text-center px-4 relative overflow-hidden" style={{ backgroundColor: palette.card }}>
          <img src="/assets/renaissance/botanical-corner.png" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 opacity-10 -scale-y-100"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10">
            <Ornament className="mx-auto mb-8" />
            <p className="text-sm italic mb-2" style={{ color: palette.textMuted }}>Thank you</p>
            <h2 className="text-3xl md:text-5xl italic mb-6">{data.bride.name} & {data.groom.name}</h2>
            <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: palette.textMuted }}>
              Undangin Premium • Saves paper, reduces carbon footprint 🌱
            </p>
          </motion.div>
        </footer>
      </div>
    </>
  );
}
