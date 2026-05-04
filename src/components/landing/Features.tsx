"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  { 
    title: "Animasi Sinematik", 
    icon: "/assets/branding/final/nusantara_topeng_gold.webp", 
    desc: "Parallax scrolling halus dan transisi premium yang memanjakan mata tamu Anda." 
  },
  { 
    title: "RSVP Cerdas", 
    icon: "/assets/branding/final/ai_rsvp_sphere_solid_white_bg_1777347973006.webp", 
    desc: "Sistem pendataan kehadiran real-time terintegrasi untuk manajemen tamu yang efisien." 
  },
  { 
    title: "Mahakarya Musik", 
    icon: "/assets/branding/final/nusantara_gong_solid_white_bg_1777350027916.webp", 
    desc: "Personalisasi iringan melodi eksklusif yang menemani setiap detik perjalanan cinta Anda." 
  }
];

const subFeatures = [
  { icon: "/assets/branding/final/nusantara_mobile_optimized_3d.webp", title: "Mobile Optimized", desc: "Tampilan sempurna di semua perangkat." },
  { icon: "/assets/branding/final/nusantara_digital_checkin_3d.webp", title: "Digital Check-in", desc: "Sistem QR Code untuk tamu undangan." },
  { icon: "/assets/branding/final/ai_notifications_solid_white_bg_1777348251055.webp", title: "Real-time Notification", desc: "Notifikasi instan setiap ada tamu RSVP." }
];

export default function Features() {
  return (
    <>
      {/* MAIN FEATURES */}
      <section id="fitur" className="py-12 md:py-32 px-4 relative border-t border-wedding-gold/10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-wedding-gold/5 rounded-full blur-[80px] md:blur-[150px] -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24 px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl md:text-6xl mb-6 text-wedding-text leading-tight"
            >
              Kemewahan dalam <span className="text-wedding-gold">Setiap Detail</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-wedding-text/60 text-base md:text-lg max-w-2xl mx-auto font-light"
            >
              Setiap fitur dirancang dengan presisi tinggi untuk memberikan pengalaman tak terlupakan bagi tamu undangan Anda.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 px-2 md:px-0">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 md:p-10 rounded-[1.2rem] md:rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-wedding-gold/10 hover:border-wedding-gold/30 transition-all duration-500 group relative ${i === 2 ? 'col-span-2 md:col-span-1' : ''}`}
              >
                {/* Shine Container with overflow-hidden */}
                <div className="absolute inset-0 overflow-hidden rounded-[1.2rem] md:rounded-[2.5rem] pointer-events-none">
                  {/* Golden Aura Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-tr from-wedding-gold/10 via-transparent to-wedding-gold/10" />
                    <motion.div 
                      initial={{ x: "-100%", y: "-100%" }}
                      whileHover={{ x: "100%", y: "100%" }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-br from-transparent via-wedding-gold/20 to-transparent"
                    />
                  </div>
                  
                  <div className="absolute top-0 right-0 w-12 h-12 md:w-24 md:h-24 bg-wedding-gold/5 rounded-bl-[2rem] md:rounded-bl-[5rem] -z-10 group-hover:scale-150 transition-transform duration-700" />
                </div>                
                <div className="w-12 h-12 md:w-20 md:h-20 rounded-lg md:rounded-2xl bg-wedding-gold/5 text-wedding-gold flex items-center justify-center mb-3 md:mb-8 group-hover:scale-110 transition-all duration-500 overflow-hidden relative">
                  <Image 
                    src={feat.icon} 
                    alt={feat.title}
                    width={80}
                    height={80}
                    className="object-contain mix-blend-multiply"
                  />
                </div>
                
                <h3 className="font-serif text-sm md:text-2xl text-wedding-text mb-1 md:mb-4 group-hover:text-wedding-gold transition-colors line-clamp-1">{feat.title}</h3>
                <p className="text-[10px] md:text-base text-wedding-text/60 leading-tight md:leading-relaxed font-light line-clamp-2 md:line-clamp-none">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWCASE SECTION - WHY US */}
      <section className="py-12 md:py-32 px-4 bg-wedding-text/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10 md:space-y-12"
            >
              <div>
                <span className="text-wedding-gold font-serif italic tracking-[0.3em] text-[10px] md:text-sm mb-4 block">Crafted with Perfection</span>
                <h2 className="font-serif text-4xl md:text-6xl mb-6 md:mb-8 text-wedding-text leading-tight">Lebih dari Sekadar <br />Undangan Digital.</h2>
                <p className="text-lg md:text-xl text-wedding-text/60 font-light max-w-lg leading-relaxed">
                  Kami menghadirkan ekosistem digital yang menyatukan keindahan seni tradisional dengan teknologi masa depan.
                </p>
              </div>
              
              <div className="grid gap-6 md:gap-8">
                {subFeatures.map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 md:gap-6 items-start group"
                  >
                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl bg-wedding-gold/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all overflow-hidden p-1.5">
                      <Image 
                        src={item.icon} 
                        alt={item.title} 
                        width={64} 
                        height={64} 
                        className="object-contain mix-blend-multiply"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg md:text-xl text-wedding-text mb-1">{item.title}</h4>
                      <p className="text-sm md:text-base text-wedding-text/50 font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-wedding-gold/10 blur-2xl rounded-3xl -z-10" />
              <div className="relative aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                <Image 
                  src="/luxury_kutai_dayak_wedding_final.webp" 
                  fill
                  style={{ willChange: "transform" }}
                  className="object-cover hover:scale-105 transition-transform duration-1000" 
                  alt="Premium Experience"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 text-white">
                  <p className="font-serif italic text-lg md:text-2xl">"Kualitas yang melampaui ekspektasi."</p>
                  <p className="text-[10px] md:text-sm uppercase tracking-widest mt-2 opacity-70">- Adji & Putri</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
