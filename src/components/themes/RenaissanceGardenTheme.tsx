"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, Variants, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { InvitationData } from "@/data/invitations";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { submitRSVP } from "@/app/[slug]/actions";

export default function RenaissanceGardenTheme({ data }: { data: InvitationData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });
  const heroY = useTransform(smoothProgress, [0, 0.3], ["0%", "30%"]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.25], [1, 0]);


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
      <path d="M0 20 Q50 0 100 20 Q150 40 200 20" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="100" cy="20" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="60" cy="12" r="2" fill="currentColor" opacity="0.2" />
      <circle cx="140" cy="28" r="2" fill="currentColor" opacity="0.2" />
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

      {/* ═══ MAIN CONTENT ═══ */}
      <div ref={containerRef} className={`min-h-screen overflow-hidden font-serif`}
        style={{ backgroundColor: palette.bg, color: palette.text }}>


        {/* ═══ HERO ═══ */}
        <motion.section style={{ y: heroY, opacity: heroOpacity }}
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image 
              src={data.couplePhoto || "/assets/renaissance/garden-bg.jpg"} 
              fill
              className="object-cover opacity-50"
              alt="Garden Background"
              priority
            />
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
          <div className="absolute top-0 right-0 w-48 h-48 opacity-30 -scale-x-100">
            <Image src="/assets/renaissance/botanical-corner.png" fill className="object-contain" alt="Botanical" />
          </div>
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
                  <div className="absolute inset-0 z-20 pointer-events-none">
                    <Image src="/assets/renaissance/oval-frame.png" fill className="object-contain" alt="Frame" />
                  </div>
                  <div className="absolute inset-[10%] overflow-hidden rounded-[50%] z-10">
                    <Image src={data.bride.photo} fill className="object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" alt="Bride" />
                  </div>
                </div>
                <h3 className="text-3xl italic mb-2">{data.bride.fullName}</h3>
                <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: palette.accent }}>Putri Dari</p>
                <p className="text-sm italic" style={{ color: palette.textMuted }}>
                  {data.bride_father && data.bride_mother
                    ? `Bpk. ${data.bride_father} & Ibu ${data.bride_mother}`
                    : data.bride.parents
                  }
                </p>
              </motion.div>
              {/* Groom */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
                <div className="relative w-64 h-72 md:w-72 md:h-80 mx-auto mb-8">
                  <div className="absolute inset-0 z-20 pointer-events-none">
                    <Image src="/assets/renaissance/oval-frame.png" fill className="object-contain" alt="Frame" />
                  </div>
                  <div className="absolute inset-[10%] overflow-hidden rounded-[50%] z-10">
                    <Image src={data.groom.photo} fill className="object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" alt="Groom" />
                  </div>
                </div>
                <h3 className="text-3xl italic mb-2">{data.groom.fullName}</h3>
                <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: palette.accent }}>Putra Dari</p>
                <p className="text-sm italic" style={{ color: palette.textMuted }}>
                  {data.groom_father && data.groom_mother
                    ? `Bpk. ${data.groom_father} & Ibu ${data.groom_mother}`
                    : data.groom.parents
                  }
                </p>
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
          <div className="absolute bottom-0 left-0 w-48 h-48 opacity-20 -scale-y-100">
            <Image src="/assets/renaissance/botanical-corner.png" fill className="object-contain" alt="Botanical" />
          </div>
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

        {/* ═══ TURUT MENGUNDANG ═══ */}
        {data.turut_mengundang && (
          <section className="py-24 px-4 bg-white" style={{ backgroundColor: palette.card }}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl italic mb-4">Turut Mengundang</h2>
              <Ornament className="mx-auto mb-10" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {data.turut_mengundang.split(',').map((name, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-sm italic"
                    style={{ color: palette.textMuted }}
                  >
                    {name.trim()}
                  </motion.p>
                ))}
              </div>
            </div>
          </section>
        )}

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
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] tracking-widest px-3 py-1 ${guest.attendance === 'Hadir' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
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
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 opacity-10 -scale-y-100">
            <Image src="/assets/renaissance/botanical-corner.png" fill className="object-contain" alt="Botanical" />
          </div>
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
