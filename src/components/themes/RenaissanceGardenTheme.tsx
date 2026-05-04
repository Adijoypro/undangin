"use client";

import { useEffect, useRef, useState, useContext } from "react";
import { motion, useScroll, useTransform, useSpring, Variants, AnimatePresence } from "framer-motion";
import { ThemeContext } from "./ThemeWrapper";
import { ScrollIndicator } from "./InvitationCover";
import EnvelopeCover from "@/components/covers/EnvelopeCover";
import Image from "next/image";
import { InvitationData } from "@/data/invitations";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { submitRSVP } from "@/app/[slug]/actions";
import { toast } from "sonner";
import BottomSheet from "@/components/ui/BottomSheet";
import MapSimulation from "@/components/ui/MapSimulation";
import { QRCodeSVG } from "qrcode.react";

export default function RenaissanceGardenTheme({ data }: { data: InvitationData }) {
  const { isOpened, onOpen } = useContext(ThemeContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isQRISOpen, setIsQRISOpen] = useState(false);

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
      toast.success("Terima kasih atas konfirmasi Anda.");
      setIsRSVPOpen(false);
    } else { toast.error("Gagal mengirim, silakan coba lagi."); }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Nomor rekening tersalin.");
  };

  const createCalendarLink = () => {
    const text = encodeURIComponent(`Pernikahan ${data.bride.name} & ${data.groom.name}`);
    const details = encodeURIComponent(`Acara pernikahan ${data.bride.fullName} dan ${data.groom.fullName}.`);
    const location = encodeURIComponent(data.event.locationAddress);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
  };


  // Small subtle ornament
  const Ornament = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="w-8 h-px bg-wedding-gold/30"></div>
      <div className="w-1 h-1 rounded-full bg-wedding-gold/40"></div>
      <div className="w-8 h-px bg-wedding-gold/30"></div>
    </div>
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

  const renderLoveStory = () => {
    if (!data.loveStory || data.loveStory.length === 0) return null;

    // Check if it's the new structured format or old string array
    const isStructured = typeof data.loveStory[0] === 'object' && data.loveStory[0] !== null;

    if (isStructured) {
      return (
        <div className="space-y-12 relative max-w-2xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-wedding-gold/20"></div>
          
          {data.loveStory.map((item, idx) => (
            <motion.div 
              key={idx} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeUp}
              className={`flex items-center justify-between w-full ${idx % 2 === 0 ? 'flex-row-reverse' : ''}`}
            >
              <div className="w-5/12"></div>
              <div className="z-10 bg-white p-2 rounded-full border border-wedding-gold/30">
                <div className="w-3 h-3 bg-wedding-gold rounded-full shadow-sm"></div>
              </div>
              <div className={`w-5/12 p-6 bg-white border border-wedding-gold/10 rounded-2xl shadow-sm ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                <p className="text-[10px] font-bold text-wedding-gold uppercase tracking-[0.2em] mb-1">{item.date}</p>
                <h4 className="text-xl italic mb-3">{item.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: palette.textMuted }}>{item.story}</p>
              </div>
            </motion.div>
          ))}
        </div>
      );
    }

    return data.loveStory.map((paragraph, idx) => (
      <p key={idx} className="text-base leading-[2] mb-6" style={{ color: palette.textMuted }}>{paragraph}</p>
    ));
  };

  return (
    <>
      <AnimatePresence>
        {!isOpened && (
          <EnvelopeCover 
            bride={data.bride.name} 
            groom={data.groom.name} 
            date={data.event.date}
            onOpen={onOpen} 
            variant="renaissance"
          />
        )}
      </AnimatePresence>
      <div className={`transition-opacity duration-1000 w-full min-h-screen ${isOpened ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        {isOpened && <ScrollIndicator color="#8B7355" />}

      {/* ═══ MAIN CONTENT ═══ */}
      <div ref={containerRef} className={`min-h-screen overflow-x-hidden font-serif`}
        style={{ backgroundColor: palette.bg, color: palette.text }}>


        {/* ═══ HERO ═══ */}
        <motion.section style={{ y: heroY, opacity: heroOpacity }}
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image 
              src={data.couplePhoto || "/assets/renaissance/garden-bg.webp"} 
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
            <h1 className="text-2xl sm:text-6xl md:text-8xl italic mb-6 leading-tight tracking-tighter">{data.bride.name} <span className="text-xl md:text-5xl" style={{ color: palette.gold }}>&</span> {data.groom.name}</h1>
            <Ornament className="mx-auto mt-4 mb-12" />
            <CountdownTimer targetDate={data.event.date} theme="premium" />
            <div className="mt-10">
                <a href={createCalendarLink()} target="_blank"
                  className="inline-block px-6 py-3 md:px-8 md:py-3 text-[10px] md:text-xs tracking-[0.3em] uppercase border transition-all duration-500 hover:text-white"
                  style={{ borderColor: palette.accent, color: palette.accent }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = palette.accent;
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.backgroundColor = 'transparent'; 
                    e.currentTarget.style.color = palette.accent; 
                  }}>
                  Save the Date
                </a>
            </div>
          </motion.div>
        </motion.section>

        {/* ═══ COUPLE ═══ */}
        <section className="py-24 md:py-40 px-4 relative overflow-hidden" style={{ backgroundColor: palette.card }}>
          <div className="absolute top-0 right-0 w-48 h-48 opacity-30 -scale-x-100">
            <Image src="/assets/renaissance/botanical-corner.webp" fill className="object-contain" alt="Botanical" />
          </div>
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
              <Ornament className="mx-auto mb-6" />
              <p className="text-sm italic leading-[2] max-w-2xl mx-auto px-4" style={{ color: palette.textMuted }}>
                "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir."
                <br />
                <span className="block mt-4 font-bold tracking-widest text-[10px] uppercase">— QS. Ar-Rum: 21</span>
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-16 md:gap-24">
              {/* Bride */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
                <div className="relative w-64 h-72 md:w-72 md:h-80 mx-auto mb-8">
                  <div className="absolute inset-0 z-20 pointer-events-none">
                    <Image src="/assets/renaissance/oval-frame.webp" fill className="object-contain" alt="Frame" />
                  </div>
                  <div className="absolute inset-[10%] overflow-hidden rounded-[50%] z-10">
                    <Image src={data.bride.photo} fill className="object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" alt="Bride" />
                  </div>
                </div>
                <h3 className="text-xl md:text-3xl italic mb-2">{data.bride.fullName}</h3>
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
                    <Image src="/assets/renaissance/oval-frame.webp" fill className="object-contain" alt="Frame" />
                  </div>
                  <div className="absolute inset-[10%] overflow-hidden rounded-[50%] z-10">
                    <Image src={data.groom.photo} fill className="object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" alt="Groom" />
                  </div>
                </div>
                <h3 className="text-xl md:text-3xl italic mb-2">{data.groom.fullName}</h3>
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


        {/* ═══ GALLERY ═══ */}
        {data.gallery && data.gallery.length > 0 && (
          <section className="py-24 md:py-40 px-4 relative overflow-hidden" style={{ backgroundColor: palette.bg }}>
            {/* Botanical Corner Ornaments */}
            <div className="absolute top-0 left-0 w-48 h-48 md:w-80 md:h-80 opacity-20 pointer-events-none z-0">
              <Image src="/assets/renaissance/botanical-corner.webp" fill className="object-contain" alt="Botanical" />
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 md:w-80 md:h-80 opacity-20 pointer-events-none z-0 rotate-180">
              <Image src="/assets/renaissance/botanical-corner.webp" fill className="object-contain" alt="Botanical" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl italic mb-4">Momen Indah</h2>
                <Ornament className="mx-auto" />
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[300px]">
                {data.gallery.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative group overflow-hidden bg-white p-2 shadow-xl border border-wedding-gold/10 cursor-pointer ${
                      idx === 0 ? 'col-span-2 row-span-2' : 
                      idx === 3 ? 'row-span-2' : ''
                    }`}
                  >
                    <div className="relative w-full h-full overflow-hidden">
                      <Image 
                        src={img} 
                        alt={`Gallery ${idx}`} 
                        fill 
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      {/* Soft Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}


        {/* ═══ LOVE STORY ═══ */}
        <section className="py-24 md:py-40 px-4 relative overflow-hidden" style={{ backgroundColor: palette.bg }}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-3xl md:text-5xl italic mb-4">Kisah Cinta Kami</h2>
              <Ornament className="mx-auto mb-16" />
              {renderLoveStory()}
            </motion.div>
          </div>
        </section>

        {/* ═══ EVENT (Multi-Event) ═══ */}
        <section className="py-24 md:py-40 px-4 relative overflow-hidden" style={{ backgroundColor: palette.card }}>
          <div className="absolute bottom-0 left-0 w-48 h-48 opacity-20 -scale-y-100">
            <Image src="/assets/renaissance/botanical-corner.webp" fill className="object-contain" alt="Botanical" />
          </div>
          <div className="max-w-5xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-3xl md:text-5xl italic mb-4">Waktu & Tempat</h2>
              <Ornament className="mx-auto mb-20" />
            </motion.div>

            <div className="space-y-24">
              {(data.events && data.events.length > 0 ? data.events : [data.event]).map((event: any, index: number) => (
                <div key={index} className="grid lg:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={`${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="space-y-6">
                      <MapSimulation 
                        lat={event.latitude ?? -6.2088} 
                        lng={event.longitude ?? 106.8456} 
                        locationName={event.location || event.locationName} 
                      />
                      
                      <div className="p-6 bg-wedding-gold/5 border border-wedding-gold/10 rounded-3xl flex items-center gap-6">
                        <div className="bg-white p-2 rounded-xl shadow-sm border border-wedding-gold/10">
                          <QRCodeSVG 
                            value={event.maps_link || event.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((event.location || event.locationName || "") + " " + (event.address || event.locationAddress || ""))}`} 
                            size={80} 
                            level="H"
                            fgColor={palette.accent}
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-black text-wedding-gold uppercase tracking-widest mb-1">Scan untuk Navigasi</p>
                          <p className="text-[9px] leading-relaxed text-gray-500 italic">Scan barcode ini untuk membuka lokasi di Google Maps ponsel Anda.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                    className={`p-10 md:p-14 border ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`} style={{ borderColor: palette.gold + '30', backgroundColor: palette.bg }}>
                    <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: palette.accent }}>{event.title || (index === 0 ? "Akad Nikah" : "Resepsi")}</p>
                    <h3 className="text-xl md:text-4xl italic mb-6">{event.date}</h3>
                    <div className="w-12 h-px mx-auto mb-6" style={{ backgroundColor: palette.gold + '40' }}></div>
                    <p className="text-base mb-2">{event.time}</p>
                    <h4 className="text-lg italic mb-2" style={{ color: palette.gold }}>{event.location || event.locationName}</h4>
                    <p className="text-xs mb-10 leading-relaxed" style={{ color: palette.textMuted }}>{event.address || event.locationAddress}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a 
                        href={event.maps_link || event.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((event.location || event.locationName || "") + " " + (event.address || event.locationAddress || ""))}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-4 md:px-8 md:py-4 text-[10px] md:text-xs tracking-[0.3em] uppercase text-white shadow-xl active:scale-95 transition-all duration-300"
                        style={{ backgroundColor: palette.accent }}>
                        Buka Maps
                      </a>
                      <a href={createCalendarLink()} target="_blank"
                        className="px-6 py-3 md:px-8 md:py-3 text-[10px] md:text-xs tracking-[0.2em] uppercase border transition-all duration-500"
                        style={{ borderColor: palette.accent, color: palette.accent }}>
                        Simpan Kalender
                      </a>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
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
        <section className="py-24 md:py-32 px-4" style={{ backgroundColor: palette.bg }}>
          <div className="max-w-xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12">
              <h2 className="text-3xl md:text-5xl italic mb-4">Konfirmasi Kehadiran</h2>
              <Ornament className="mx-auto" />
              <p className="mt-8 text-sm italic" style={{ color: palette.textMuted }}>Sampaikan konfirmasi kehadiran Anda untuk merayakan hari bahagia ini bersama kami.</p>
            </motion.div>

            <button 
              onClick={() => setIsRSVPOpen(true)}
              className="group relative w-full py-10 border transition-all duration-700 hover:border-opacity-100"
              style={{ borderColor: palette.accent + '30', backgroundColor: palette.card }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity" style={{ backgroundColor: palette.accent }} />
              <span className="relative z-10 text-[10px] md:text-xs tracking-[0.5em] uppercase font-bold" style={{ color: palette.accent }}>Kirim Konfirmasi Kehadiran</span>
            </button>
          </div>
        </section>

        {/* RENAISSANCE BOTTOM SHEET */}
        <BottomSheet 
          isOpen={isRSVPOpen} 
          onClose={() => setIsRSVPOpen(false)} 
          title="KONFIRMASI KEHADIRAN"
          className="!bg-[#FFFDF8] dark:!bg-[#FFFDF8]"
          titleClassName="!text-[#3D3229] font-bold text-2xl tracking-widest"
        >
          <form action={handleRSVP} className="space-y-10 py-10">
            <div className="hidden">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] font-bold" style={{ color: palette.text }}>Nama Lengkap</label>
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="NAMA ANDA" 
                className="w-full bg-transparent border-b py-4 text-sm tracking-widest focus:outline-none transition-all placeholder:opacity-20" 
                style={{ borderColor: palette.accent + '30', color: palette.text }}
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="text-xs uppercase tracking-[0.2em] font-bold" style={{ color: palette.text }}>Status Kehadiran</label>
              <div className="relative">
                <select 
                  name="attendance" 
                  required 
                  className="w-full bg-transparent border-b py-4 text-sm tracking-widest focus:outline-none appearance-none cursor-pointer"
                  style={{ borderColor: palette.accent + '30', color: palette.text }}
                >
                  <option value="Hadir" style={{ backgroundColor: palette.card, color: palette.text }}>Saya Akan Hadir</option>
                  <option value="Tidak Hadir" style={{ backgroundColor: palette.card, color: palette.text }}>Maaf, Saya Tidak Bisa Hadir</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-xs uppercase tracking-[0.2em] font-bold" style={{ color: palette.text }}>Ucapan & Doa Restu</label>
              <textarea 
                name="message" 
                rows={5} 
                required 
                placeholder="TULISKAN DOA & HARAPAN ANDA" 
                className="w-full bg-transparent border-b py-4 text-sm tracking-widest focus:outline-none resize-none placeholder:opacity-20"
                style={{ borderColor: palette.accent + '30', color: palette.text }}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-6 text-white font-bold uppercase tracking-[0.3em] text-xs shadow-xl active:scale-95 transition-all disabled:opacity-50"
              style={{ backgroundColor: palette.accent }}
            >
              {isSubmitting ? "MENGIRIM..." : "KONFIRMASI KEHADIRAN"}
            </button>
          </form>
        </BottomSheet>
        
        {/* RENAISSANCE QRIS */}
        <BottomSheet 
          isOpen={isQRISOpen} 
          onClose={() => setIsQRISOpen(false)} 
          title="HADIAH PERNIKAHAN"
          className="!bg-[#FFFDF8] dark:!bg-[#FFFDF8]"
          titleClassName="!text-[#3D3229] font-bold text-2xl tracking-widest"
        >
          <div className="p-8 text-center space-y-8">
            <div className="relative w-full aspect-square max-w-[300px] mx-auto bg-white p-4 rounded-3xl shadow-xl overflow-hidden border-2" style={{ borderColor: palette.gold + '30' }}>
              {data.gift.qrUrl && (
                <Image src={data.gift.qrUrl} alt="QRIS" fill className="object-contain p-4" />
              )}
            </div>
            <div className="space-y-3">
              <p className="text-xl italic tracking-wide" style={{ color: palette.accent }}>{data.gift.bankName}</p>
              <div className="p-5 rounded-2xl border" style={{ borderColor: palette.gold + '20', backgroundColor: palette.card }}>
                <p className="text-lg font-serif tracking-widest">{data.gift.accountNumber}</p>
                <p className="text-[10px] uppercase tracking-widest mt-1 opacity-50">A/N {data.gift.accountName}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsQRISOpen(false)}
              className="w-full py-5 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-xl shadow-lg active:scale-95 transition-all"
              style={{ backgroundColor: palette.accent }}
            >
              TUTUP JENDELA HADIAH
            </button>
          </div>
        </BottomSheet>


        {/* ═══ GUESTBOOK ═══ */}
        <section className="py-24 px-4" style={{ backgroundColor: palette.card }}>
          <div className="max-w-3xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl italic mb-4">Ucapan & Doa</h2>
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
              <div className="max-w-md mx-auto relative group">
                {/* Luxury Card Mockup */}
                <div className="relative aspect-[1.6/1] w-full bg-gradient-to-br from-[#3D3229] to-[#1A1612] rounded-2xl p-6 md:p-8 text-left overflow-hidden shadow-2xl border border-white/10 mb-8">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#B8963E]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C4867A]/5 rounded-full blur-2xl -ml-16 -mb-16"></div>
                  
                  {/* Card Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-10 bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] rounded-md shadow-inner flex items-center justify-center">
                        <div className="w-8 h-px bg-black/20 my-1"></div>
                      </div>
                      <p className="text-[10px] md:text-xs tracking-[0.3em] font-bold text-[#D4AF37] uppercase">{data.gift.bankName}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs md:text-sm tracking-[0.2em] text-white/40 uppercase font-light">Nomor Rekening</p>
                      <p className="text-lg md:text-3xl font-serif tracking-[0.15em] text-white drop-shadow-lg">{data.gift.accountNumber}</p>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[8px] md:text-[10px] tracking-[0.2em] text-white/40 uppercase mb-1">Pemilik Rekening</p>
                        <p className="text-xs md:text-sm tracking-widest text-[#D4AF37] font-bold uppercase">{data.gift.accountName}</p>
                      </div>
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/5 backdrop-blur-sm"></div>
                        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/10 backdrop-blur-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => handleCopy(data.gift.accountNumber)}
                    className="flex-1 px-6 py-4 text-[9px] md:text-xs tracking-[0.2em] uppercase border transition-all duration-500 hover:text-white"
                    style={{ borderColor: palette.accent, color: palette.accent }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = palette.accent;
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.backgroundColor = 'transparent'; 
                      e.currentTarget.style.color = palette.accent; 
                    }}>
                    Salin Rekening
                  </button>
                  {data.gift.qrUrl && (
                    <button onClick={() => setIsQRISOpen(true)}
                      className="flex-1 px-6 py-4 text-[9px] md:text-xs tracking-[0.2em] uppercase border transition-all duration-500"
                      style={{ borderColor: palette.gold, color: palette.gold }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = palette.gold;
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => { 
                        e.currentTarget.style.backgroundColor = 'transparent'; 
                        e.currentTarget.style.color = palette.gold; 
                      }}>
                      Lihat QRIS
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ CLOSING ═══ */}
        <section className="py-32 px-4 relative z-10 text-center" style={{ backgroundColor: palette.bg }}>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-2xl mx-auto"
          >
            <div className="w-12 h-px mx-auto mb-10" style={{ backgroundColor: palette.accent + '30' }}></div>
            <p className="font-serif italic text-xl md:text-2xl leading-relaxed" style={{ color: palette.text }}>
              {data.closing_statement || "Kehadiran serta doa restu Anda adalah kado terindah yang melengkapi perjalanan cinta kami."}
            </p>
            <div className="w-12 h-px mx-auto mt-10" style={{ backgroundColor: palette.accent + '30' }}></div>
          </motion.div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="py-24 text-center px-4 relative overflow-hidden" style={{ backgroundColor: palette.card }}>
          {/* Floral Pattern Border */}
          <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 mix-blend-multiply">
            <div className="flex w-[200%] animate-scroll-linear">
              <div className="w-full h-full relative">
                <Image src="/assets/renaissance/floral-divider.webp" fill className="object-contain" alt="Pattern" />
              </div>
              <div className="w-full h-full relative">
                <Image src="/assets/renaissance/floral-divider.webp" fill className="object-contain" alt="Pattern" />
              </div>
            </div>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10">
            <Ornament className="mx-auto mb-8" />
            <p className="text-sm italic mb-2" style={{ color: palette.textMuted }}>Terima Kasih</p>
            <h2 className="text-2xl md:text-5xl italic mb-6 tracking-tighter">{data.bride.nickname || data.bride.name} & {data.groom.nickname || data.groom.name}</h2>
          </motion.div>
        </footer>
      </div>
      </div>
    </>
  );
}
