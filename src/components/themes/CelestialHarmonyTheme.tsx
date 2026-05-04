"use client";

import { useContext, useState, useRef, useEffect } from "react";
import { ThemeContext } from "./ThemeWrapper";
import { motion, useScroll, useTransform, AnimatePresence, MotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { InvitationData } from "@/data/invitations";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { submitRSVP } from "@/app/[slug]/actions";
import { toast } from "sonner";
import MapSimulation from "@/components/ui/MapSimulation";
import { GoldenGateCover } from "@/components/covers";
import BottomSheet from "@/components/ui/BottomSheet";

/* ── SCROLL SECTION HOOK ── */
function useSec(p: MotionValue<number>, range: [number, number, number, number]) {
  return {
    opacity: useTransform(p, range, [0, 1, 1, 0]),
    scale: useTransform(p, range, [0.85, 1, 1, 1.05]),
    y: useTransform(p, range, [60, 0, 0, -60]),
  };
}

export default function CelestialHarmonyTheme({ data }: { data: InvitationData }) {
  const { isOpened, onOpen } = useContext(ThemeContext);

  return (
    <>
      <AnimatePresence>{!isOpened && <GoldenGateCover bride={data.bride.name} groom={data.groom.name} date={data.event.date} onOpen={onOpen} guestName={data.guestName} />}</AnimatePresence>
      {isOpened && <CelestialHarmonyContent data={data} />}
    </>
  );
}

function CelestialHarmonyContent({ data }: { data: InvitationData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 30, restDelta: 0.001 });

  const photoScale = useTransform(smoothProgress, [0, 1], [1, 1.2]);
  const overlayOpacity = useTransform(smoothProgress, [0, 0.4, 0.8], [0.3, 0.6, 0.9]);

  const s1 = useSec(smoothProgress, [0.00, 0.03, 0.07, 0.10]);
  const s2 = useSec(smoothProgress, [0.10, 0.13, 0.18, 0.22]);
  const s3 = useSec(smoothProgress, [0.22, 0.25, 0.30, 0.34]);
  const s4 = useSec(smoothProgress, [0.34, 0.37, 0.44, 0.48]);
  const s5 = useSec(smoothProgress, [0.48, 0.51, 0.58, 0.62]);
  const s6 = useSec(smoothProgress, [0.62, 0.65, 0.72, 0.76]);
  const s7 = useSec(smoothProgress, [0.76, 0.79, 0.84, 0.88]);
  const s8 = useSec(smoothProgress, [0.88, 0.91, 0.93, 0.95]);
  const s9 = useSec(smoothProgress, [0.95, 0.96, 0.97, 0.98]);
  const s10 = {
    opacity: useTransform(smoothProgress, [0.98, 0.99, 1], [0, 1, 0]),
    scale: useTransform(smoothProgress, [0.98, 0.99, 1], [0.9, 1, 1.1]),
    y: useTransform(smoothProgress, [0.98, 0.99, 1], [20, 0, -20]),
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const submitted = localStorage.getItem(`rsvp_${data.slug}`);
    if (submitted) setHasSubmitted(true);
  }, [data.slug]);

  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isQRISOpen, setIsQRISOpen] = useState(false);

  const handleRSVP = async (fd: FormData) => {
    setIsSubmitting(true);
    fd.append("invitation_id", data.id);
    fd.append("slug", data.slug);
    const r = await submitRSVP(fd);
    setIsSubmitting(false);
    if (r.success) { 
      toast.success("Terima kasih!"); 
      localStorage.setItem(`rsvp_${data.slug}`, "true");
      setHasSubmitted(true);
      setIsRSVPOpen(false);
    } else {
      toast.error(r.error || "Gagal mengirim.");
    }
  };

  const handleCopy = (t: string) => { 
    navigator.clipboard.writeText(t); 
    toast.success("Tersalin!"); 
  };

  const allBgs = Array.from(new Set([data.couplePhoto, ...(data.gallery || []).slice(0, 4)].filter(Boolean))) as string[];
  const bgOpacities = allBgs.map((_, i) => {
    const start = i / allBgs.length;
    const end = (i + 1) / allBgs.length;
    return useTransform(smoothProgress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
  });

  const Card = ({ children, id, className = "" }: { children: React.ReactNode; id?: string; className?: string }) => (
    <div id={id} className={`bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl will-change-transform ${className}`} style={{ transform: "translateZ(0)" }}>
      {children}
    </div>
  );

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <p className="text-center text-[10px] text-[#D4AF37] uppercase tracking-[0.6em] font-black mb-8">{children}</p>
  );

  const Sec = ({ s, children, className = "" }: { s: { opacity: MotionValue<number>; scale: MotionValue<number>; y: MotionValue<number> }; children: React.ReactNode; className?: string }) => (
    <motion.div 
      style={{ 
        opacity: s.opacity, scale: s.scale, y: s.y,
        pointerEvents: useTransform(s.opacity, (o) => o <= 0.1 ? "none" : "auto"),
        visibility: useTransform(s.opacity, (o) => o <= 0 ? "hidden" : "visible")
      }} 
      className={`fixed inset-0 z-20 flex items-center justify-center p-4 will-change-[transform,opacity] ${className}`}
    >
      <div className="max-w-xl w-full" style={{ transform: "translateZ(0)" }}>{children}</div>
    </motion.div>
  );

  const StaticView = () => (
    <div className="relative z-30 bg-[#020202] pt-32 pb-48 px-6 space-y-32 border-t border-[#D4AF37]/20 overflow-hidden" style={{ transform: "translateZ(0)" }}>
      
      <div className="relative z-10 max-w-2xl mx-auto space-y-32">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }} className="space-y-12">
          <SectionTitle>Mempelai</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Wanita", n: data.bride, parents: data.bride.parents, photo: data.bride.photo },
              { label: "Pria", n: data.groom, parents: data.groom.parents, photo: data.groom.photo },
            ].map((m, i) => (
              <Card key={i} className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#D4AF37]/40 mb-4 relative">
                  {m.photo && <Image src={m.photo} alt={m.n.name} fill className="object-cover" />}
                </div>
                <h3 className="font-serif text-xl md:text-3xl text-white [text-shadow:0_4px_12px_rgba(0,0,0,0.3)]">{m.n.fullName}</h3>
                <p className="text-xs text-[#D4AF37]/60 font-bold uppercase tracking-widest mt-3">{m.parents}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, delay: 0.2 }} className="space-y-10">
          <SectionTitle>Waktu & Lokasi</SectionTitle>
          <Card className="space-y-8">
            <CountdownTimer targetDate={data.event.date} />
            <div className="space-y-10">
              {(data.events || []).map((ev: any, i: number) => (
                <div key={i} className={`relative ${i > 0 ? "border-t border-white/10 pt-10" : ""}`}>
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-4">
                      <h4 className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.4em]">{ev.title}</h4>
                      <p className="text-white text-2xl font-serif">{ev.date} • {ev.time}</p>
                      <p className="text-white/50 text-sm leading-relaxed">{ev.location}<br/>{ev.address}</p>
                      <a 
                        href={ev.maps_link} 
                        target="_blank" 
                        className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[#D4AF37] text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                        Petunjuk Lokasi
                      </a>
                    </div>
                    {ev.maps_link && (
                      <div className="w-24 h-24 bg-white p-1.5 rounded-xl flex-shrink-0 shadow-2xl">
                        <Image 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ev.maps_link)}`} 
                          alt="Nav QR" 
                          width={150} 
                          height={150} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-[2rem] overflow-hidden border border-white/10 h-72 shadow-2xl relative">
              <MapSimulation lat={data.event.latitude || -6.2} lng={data.event.longitude || 106.8} locationName={data.event.locationName} />
              <div className="absolute inset-0 pointer-events-none border-[12px] border-black/10 rounded-[2rem]" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }} className="space-y-10">
          <SectionTitle>Galeri Kebahagiaan</SectionTitle>
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {(data.gallery || []).map((url: string, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="break-inside-avoid rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-transform hover:scale-[1.02] will-change-transform">
                <Image src={url} alt={`Gallery ${i}`} width={400} height={400} className="w-full h-auto object-cover" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }} className="space-y-10">
          <SectionTitle>Tanda Kasih</SectionTitle>
          <Card className="text-center space-y-8">
            <div className="relative group perspective-1000 max-w-sm mx-auto">
              <div className="relative w-full aspect-[1.6/1] bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-[#050505] rounded-[1.5rem] border border-white/10 p-5 flex flex-col justify-between overflow-hidden shadow-2xl transition-transform duration-500 group-hover:rotate-y-12">
                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 to-transparent pointer-events-none" />
                
                {/* Top Section: Chip & QR */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-4">
                    <div className="w-12 h-9 bg-gradient-to-br from-[#FBF5B7] via-[#D4AF37] to-[#B38728] rounded-md relative overflow-hidden shadow-lg">
                      <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,black_2px,black_4px)]" />
                      <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,black_2px,black_4px)]" />
                    </div>
                    <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.3em]">{data.gift.bankName}</p>
                  </div>
                  

                </div>

                {/* Account Number - Scaled for mockup precision */}
                <div className="relative z-10 py-1">
                  <p className="text-[10px] md:text-2xl font-mono tracking-[0.15em] md:tracking-[0.2em] [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                    {data.gift.accountNumber.replace(/(\d{4})/g, '$1 ').trim()}
                  </p>
                </div>

                {/* Account Name */}
                <div className="flex justify-between items-end relative z-10">
                  <div className="space-y-1 text-left">
                    <p className="text-[7px] text-white/30 uppercase tracking-widest">Account Holder</p>
                    <p className="text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">{data.gift.accountName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                     <p className="text-[6px] text-[#D4AF37]/40 uppercase font-black tracking-widest">Celestial Member</p>
                     <div className="flex gap-1">
                        <div className="w-6 h-4 rounded-sm bg-white/5 border border-white/10" />
                        <div className="w-6 h-4 rounded-sm bg-[#D4AF37]/20 border border-[#D4AF37]/30" />
                     </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => handleCopy(data.gift.accountNumber)} 
                className="flex-1 py-3 md:py-5 bg-white/5 border border-white/10 text-[#D4AF37] text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all shadow-xl active:scale-95"
              >
                Salin Rekening
              </button>
              {data.gift.qrUrl && (
                <button 
                  onClick={() => setIsQRISOpen(true)} 
                  className="flex-1 py-3 md:py-5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all shadow-xl active:scale-95"
                >
                  Lihat QRIS
                </button>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }} className="space-y-10">
          <SectionTitle>Buku Tamu</SectionTitle>
          <Card id="rsvp-section-static" className="space-y-8 bg-black/40 backdrop-blur-3xl border-white/5 text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h4 className="text-white font-serif text-2xl mb-4">Berikan Doa Restu</h4>
            <p className="text-white/40 text-sm max-w-sm mx-auto mb-10 leading-relaxed italic">Kehadiran serta doa restu Anda adalah kado terindah bagi kami.</p>
            <button 
              onClick={() => setIsRSVPOpen(true)} 
              className="px-12 py-5 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(212,175,87,0.3)] active:scale-95 transition-all"
            >
              Isi RSVP & Ucapan
            </button>
            {/* Live Wishes Wall (Limited to 10 latest) */}
            {(data.guestbook || []).length > 0 && (
              <div className="pt-10 border-t border-white/5 space-y-6">
                <p className="text-center text-[8px] text-white/20 uppercase tracking-[0.5em] font-black">Wishes from Friends</p>
                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {(data.guestbook || []).slice(0, 10).map((rsvp: any, i: number) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="bg-white/5 rounded-xl p-4 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-wider">{rsvp.name}</p>
                        <span className="text-[8px] text-white/20 uppercase font-bold">{rsvp.attendance}</span>
                      </div>
                      <p className="text-white/60 text-xs italic leading-relaxed">"{rsvp.message}"</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        <div className="pt-32 pb-16 text-center space-y-10 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-[#D4AF37] to-transparent" />
          
          <div className="max-w-md mx-auto px-6 space-y-6">
            <p className="font-serif text-xl text-white/80 leading-relaxed italic">
              "{data.closing_statement || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai."}"
            </p>
            <p className="text-[10px] text-[#D4AF37]/60 uppercase tracking-[0.4em] font-black">Terima Kasih</p>
          </div>

          <div className="space-y-4 pt-10">
            <p className="text-white/30 text-[10px] uppercase tracking-[0.5em] font-black">Kami yang berbahagia</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tighter">{data.bride.name} <span className="text-[#D4AF37]">&</span> {data.groom.name}</h2>
          </div>

          <div className="pt-20">
             <div className="w-12 h-px bg-white/10 mx-auto mb-4" />
             <p className="text-[9px] text-white/20 uppercase tracking-[0.3em]">© Undangin • Celestial Harmony Collection</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative bg-[#020202] selection:bg-[#D4AF37]/30 selection:text-white overflow-x-hidden">
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.08] bg-[url('https://www.transparenttextures.com/patterns/subtle-dots.png')] bg-repeat" style={{ transform: "translateZ(0)" }} />
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.04] mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/french-stucco.png')] bg-repeat" style={{ transform: "translateZ(0)" }} />

      <div className="relative" style={{ height: "1600vh" }}>
        {/* Initial Scroll Hint (Disappears on first scroll) */}
        <motion.div 
          style={{ 
            opacity: useTransform(smoothProgress, [0, 0.015], [1, 0]),
            display: useTransform(smoothProgress, (v) => v > 0.02 ? "none" : "flex")
          }}
          className="fixed inset-0 z-[40] flex items-center justify-center pointer-events-none"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="w-[1px] h-24 bg-gradient-to-b from-[#D4AF37] to-transparent relative overflow-hidden">
              <motion.div 
                animate={{ y: ["-100%", "100%"] }} 
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} 
                className="absolute inset-0 w-full h-full bg-white/30 blur-[1px]" 
              />
            </div>
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-[1.2em] font-black animate-pulse ml-[1.2em]">Scroll</p>
          </div>
        </motion.div>

        <div className="fixed inset-0 z-0">
          {allBgs.map((url, i) => (
            <motion.div key={url} className="absolute inset-0 will-change-[transform,opacity]" style={{ opacity: bgOpacities[i], scale: photoScale, transform: "translateZ(0)" }}>
              <Image src={url} alt={`Background ${i}`} fill className="object-cover" priority={i === 0} />
              <motion.div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
            </motion.div>
          ))}
        </div>

        <Sec s={s1}>
          <div className="text-center space-y-10 relative">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.8em] font-black">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
            <h1 className="font-serif text-xl sm:text-4xl md:text-[9rem] text-white tracking-tighter leading-none [text-shadow:0_10px_30_rgba(0,0,0,0.5)]">{data.bride.name} <span className="text-[#D4AF37] block md:inline">&</span> {data.groom.name}</h1>
            <p className="text-[11px] text-[#D4AF37] uppercase tracking-[0.4em] font-black">{data.event.date}</p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 2.5, duration: 1 }} 
              className="absolute -bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
              <div className="w-[1px] h-16 bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/20 to-transparent relative overflow-hidden">
                <motion.div 
                  animate={{ y: ["-100%", "100%"] }} 
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
                  className="absolute inset-0 w-full h-full bg-white/40 blur-[1px]" 
                />
              </div>
              <p className="text-[8px] text-[#D4AF37]/40 uppercase tracking-[0.8em] font-black animate-pulse">Scroll to Explore</p>
            </motion.div>
          </div>
        </Sec>

        <Sec s={s2}>
          <Card className="text-center space-y-10 py-16">
            <p className="font-serif text-xl md:text-2xl text-white/90 leading-relaxed italic px-4">"{data.quote}"</p>
            <p className="text-[9px] text-[#D4AF37]/60 uppercase tracking-[0.5em] font-black">QS. Ar-Rum: 21</p>
          </Card>
        </Sec>

        <Sec s={s3}>
          <div className="space-y-8">
            <SectionTitle>Mempelai</SectionTitle>
            {[
              { label: "Wanita", n: data.bride, parents: data.bride.parents, photo: data.bride.photo },
              { label: "Pria", n: data.groom, parents: data.groom.parents, photo: data.groom.photo },
            ].map((m, i) => (
              <Card key={i} className="flex items-center gap-6 p-4 md:p-6 group">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-[#D4AF37]/30 flex-shrink-0 relative">
                  {m.photo && <Image src={m.photo} alt={m.n.name} fill className="object-cover transition-transform group-hover:scale-110 duration-700" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg md:text-4xl text-white mb-2 leading-none [text-shadow:0_4px_12px_rgba(0,0,0,0.3)]">{m.n.fullName}</h3>
                  <p className="text-[11px] md:text-xs text-white/60 leading-relaxed font-medium uppercase tracking-widest">{m.parents}</p>
                </div>
              </Card>
            ))}
          </div>
        </Sec>

        <Sec s={s4}>
          <div className="space-y-8">
            <SectionTitle>Waktu & Lokasi</SectionTitle>
            <Card className="space-y-8">
              <CountdownTimer targetDate={data.event.date} />
              <div className="space-y-6">
                {(data.events || []).slice(0, 2).map((ev: any, i: number) => (
                  <div key={i} className="flex justify-between items-center gap-4">
                    <div className="flex-1">
                      <h4 className="text-[8px] text-[#D4AF37] font-black uppercase tracking-widest">{ev.title}</h4>
                      <p className="text-white text-sm font-serif">{ev.date}</p>
                    </div>
                    <a href={ev.maps_link} target="_blank" className="p-3 bg-white/5 rounded-full text-[#D4AF37] border border-white/10 active:scale-90 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </a>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl overflow-hidden h-48 border border-white/10 shadow-lg">
                <MapSimulation lat={data.event.latitude || -6.2} lng={data.event.longitude || 106.8} locationName={data.event.locationName} />
              </div>
            </Card>
          </div>
        </Sec>

        <Sec s={s5}>
          <div className="space-y-12 relative pb-20 w-full max-w-md">
            <SectionTitle>Our Journey</SectionTitle>
            <div className="relative px-4">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/20 to-transparent" />
              <div className="space-y-12">
                {(data.loveStory || []).map((story: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: "-50px" }}
                    className="relative pl-10"
                  >
                    <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" />
                    <div className="space-y-2">
                      <p className="text-[8px] text-[#D4AF37] font-black uppercase tracking-[0.4em]">Chapter {i + 1}</p>
                      <p className="text-white/80 text-sm leading-relaxed italic font-serif">"{typeof story === "string" ? story : story.text}"</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Sec>

        <Sec s={s6}>
          <div className="space-y-10 w-full">
            <SectionTitle>Galeri Kebahagiaan</SectionTitle>
            <div className="grid grid-cols-6 grid-rows-2 gap-3 h-[450px]">
              {(data.gallery || []).slice(0, 5).map((img: string, i: number) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl
                    ${i === 0 ? 'col-span-4 row-span-1' : ''}
                    ${i === 1 ? 'col-span-2 row-span-1' : ''}
                    ${i === 2 ? 'col-span-2 row-span-1' : ''}
                    ${i === 3 ? 'col-span-2 row-span-1' : ''}
                    ${i === 4 ? 'col-span-2 row-span-1' : ''}
                  `}
                >
                  <Image src={img} alt="Gallery" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        </Sec>

        <Sec s={s7}>
          <div className="text-center space-y-8">
            <SectionTitle>Turut Mengundang</SectionTitle>
            <Card className="py-12 italic text-white/60">{data.turut_mengundang || "Keluarga Besar Kedua Mempelai"}</Card>
          </div>
        </Sec>

        <Sec s={s8}>
          <div className="text-center space-y-8">
            <SectionTitle>Wedding Gift</SectionTitle>
            <Card className="space-y-8 py-10">
              {data.gift.qrUrl && (
                <div className="relative w-40 h-40 mx-auto p-2 bg-white rounded-xl shadow-2xl border-2 border-[#D4AF37]/20">
                  <Image src={data.gift.qrUrl} alt="QR Code" fill className="object-contain p-1" />
                </div>
              )}
              <div>
                <p className="text-sm md:text-3xl font-mono mb-2">{data.gift.accountNumber}</p>
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-black">a.n. {data.gift.accountName}</p>
              </div>
              <button onClick={() => handleCopy(data.gift.accountNumber)} className="px-10 py-3 md:py-4 bg-[#D4AF37] text-black text-[8px] md:text-[11px] font-black uppercase tracking-widest rounded-2xl">Salin Rekening</button>
            </Card>
          </div>
        </Sec>

        <Sec s={s9}>
          <div className="space-y-8 w-full max-w-sm mx-auto">
            <SectionTitle>RSVP & Wish</SectionTitle>
            <Card className="bg-black/40 backdrop-blur-3xl border-white/5 text-center py-12">
              <p className="text-white/60 text-sm italic font-serif mb-8">Konfirmasikan kehadiran Anda untuk melengkapi kebahagiaan kami.</p>
              <button 
                onClick={() => setIsRSVPOpen(true)}
                className="w-full py-5 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(212,175,87,0.3)] active:scale-95 transition-all"
              >
                Confirm Now
              </button>
            </Card>
          </div>
        </Sec>

        <motion.div style={{ opacity: s10.opacity, scale: s10.scale, y: s10.y }} className="fixed inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center space-y-10 px-8 pointer-events-auto w-full max-w-lg mb-20">
            <h2 className="font-serif text-4xl text-white">{data.bride.name} & {data.groom.name}</h2>
            <p className="text-[11px] text-[#D4AF37]/50 uppercase tracking-[0.6em]">Kami yang berbahagia</p>
          </div>
        </motion.div>
      </div>

      <StaticView />

      <motion.div 
        style={{ 
          opacity: useTransform(smoothProgress, [0, 0.05, 0.95, 0.98], [0, 1, 1, 0]), 
          pointerEvents: useTransform(smoothProgress, (v) => v < 0.05 || v > 0.98 ? "none" : "auto") 
        }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]"
      >
        <button 
          onClick={() => setIsRSVPOpen(true)} 
          className="group relative flex items-center gap-3 md:gap-4 px-6 md:px-8 py-3 md:py-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95 transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 w-full h-full rounded-full bg-[#D4AF37]/20 animate-ping opacity-30" />
          <div className="relative w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_10px_#D4AF37]" />
          <span className="text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">RSVP Now</span>
          <div className="absolute inset-0 border border-[#D4AF37]/20 rounded-full group-hover:border-[#D4AF37]/50 transition-colors" />
        </button>
      </motion.div>

      {/* CELESTIAL BOTTOM SHEET */}
      <BottomSheet 
        isOpen={isRSVPOpen} 
        onClose={() => setIsRSVPOpen(false)} 
        title="CELESTIAL RESERVATION"
      >
        <form action={handleRSVP} className="space-y-8 py-10">
          <div className="hidden">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          
          <div className="space-y-3 text-left">
            <label className="text-[9px] text-[#D4AF37] uppercase tracking-[0.4em] font-black ml-1">Nama Lengkap</label>
            <input name="name" required placeholder="Masukkan nama Anda..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/20 outline-none focus:border-[#D4AF37]/50 focus:bg-white/[0.08] transition-all text-sm" />
          </div>
          
          <div className="space-y-3 text-left">
            <label className="text-[9px] text-[#D4AF37] uppercase tracking-[0.4em] font-black ml-1">Konfirmasi Kehadiran</label>
            <select name="attendance" required className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-[#D4AF37]/50 focus:bg-white/[0.08] transition-all text-sm appearance-none">
              <option value="Hadir" className="bg-[#1a1a1a]">Saya Akan Hadir</option>
              <option value="Tidak Hadir" className="bg-[#1a1a1a]">Maaf, Saya Tidak Bisa Hadir</option>
            </select>
          </div>
          
          <div className="space-y-3 text-left">
            <label className="text-[9px] text-[#D4AF37] uppercase tracking-[0.4em] font-black ml-1">Pesan & Doa</label>
            <textarea name="message" placeholder="Tuliskan ucapan selamat..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/20 outline-none focus:border-[#D4AF37]/50 focus:bg-white/[0.08] transition-all text-sm resize-none" />
          </div>
          
          <button type="submit" disabled={isSubmitting} className="relative w-full py-5 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-[0_10px_30px_rgba(212,175,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,175,87,0.5)] active:scale-[0.98] transition-all overflow-hidden">
            <span className="relative z-10">{isSubmitting ? "MENGIRIM..." : "KIRIM SEKARANG"}</span>
          </button>
        </form>
      </BottomSheet>
      
      {/* QRIS BottomSheet */}
      <BottomSheet 
        isOpen={isQRISOpen} 
        onClose={() => setIsQRISOpen(false)} 
        title="QRIS Pembayaran"
      >
        <div className="p-8 text-center space-y-8">
          <div className="relative w-full aspect-square max-w-[300px] mx-auto bg-white p-4 rounded-3xl shadow-2xl overflow-hidden border-4 border-[#D4AF37]/20">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 to-transparent pointer-events-none" />
            {data.gift.qrUrl && (
              <Image src={data.gift.qrUrl} alt="QRIS" fill className="object-contain p-4" />
            )}
          </div>
          <div className="space-y-3">
            <p className="text-white/80 font-serif text-xl tracking-wide">{data.gift.bankName}</p>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <p className="text-[#D4AF37] text-lg font-mono tracking-widest">{data.gift.accountNumber}</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">A/N {data.gift.accountName}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsQRISOpen(false)}
            className="w-full py-5 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl active:scale-95 transition-all"
          >
            Tutup
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
