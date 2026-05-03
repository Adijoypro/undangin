"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

const EXPERIENCES = [
  {
    id: "royal-gate",
    title: "The Royal Entrance",
    series: "Celestial Harmony",
    desc: "Gerbang emas 3D yang terbuka secara megah, menyambut tamu Anda ke dalam istana cinta.",
    color: "#D4AF37",
    tag: "Ultra Luxury",
    demoUrl: "/demo/celestial-harmony?mode=demo",
    image: "/assets/branding/final/celestial_harmony_preview.webp",
    icon: "/assets/icons/palace.webp"
  },
  {
    id: "theater-curtain",
    title: "The Grand Premiere",
    series: "Cinematic Dark",
    desc: "Tirai beludru yang tersingkap perlahan dengan sorotan lampu panggung yang dramatis.",
    color: "#800020",
    tag: "Dramatic",
    demoUrl: "/demo/cinematic-dark?mode=demo",
    image: "/assets/branding/final/cinematic_dark_preview.webp",
    icon: "/assets/icons/mask.webp"
  },
  {
    id: "silk-envelope",
    title: "The Luxury Envelope",
    series: "Renaissance Garden",
    desc: "Amplop eksklusif dengan segel lilin yang pecah saat dibuka. Klasik, elegan, dan timeless.",
    color: "#111111",
    tag: "Timeless",
    demoUrl: "/demo/renaissance-garden?mode=demo",
    image: "/assets/branding/final/renaissance_garden_preview.webp",
    icon: "/assets/icons/envelope.webp"
  }
];

export default function ExperienceShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 md:py-32 bg-wedding-base relative overflow-hidden border-t border-wedding-gold/10">
      {/* Background Decorative Text - Infinite Marquee */}
      <div className="absolute top-0 md:top-10 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] select-none flex">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          <h2 className="text-[12rem] md:text-[18rem] font-serif font-black leading-none pr-12">
            THE ART OF OPENING • THE ART OF OPENING • THE ART OF OPENING • THE ART OF OPENING • 
          </h2>
          <h2 className="text-[12rem] md:text-[18rem] font-serif font-black leading-none pr-12">
            THE ART OF OPENING • THE ART OF OPENING • THE ART OF OPENING • THE ART OF OPENING • 
          </h2>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-wedding-gold text-xs uppercase tracking-[0.5em] font-black mb-4"
          >
            Luxury Experience
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl text-wedding-text"
          >
            Seni Membuka Pesan
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-wedding-text/50 max-w-2xl mx-auto mt-6 font-light text-lg"
          >
            Kami bukan sekadar undangan digital. Kami adalah gerbang menuju cerita cinta Anda yang dikemas dengan teknologi animasi kelas dunia.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left: Interactive Mockup Display */}
          <div className="relative order-2 lg:order-1 flex justify-center">
            <div className="relative aspect-[4/3] flex items-center justify-center">
              {/* Decorative Rings */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-[80%] h-[80%] border border-wedding-gold/10 rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute w-[60%] h-[60%] border border-wedding-gold/5 rounded-full"
              />

              {/* Smartphone Mockup */}
              <motion.div
                key={`mockup-${EXPERIENCES[activeIndex].id}`}
                initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-20 w-[300px] h-[600px] md:w-[380px] md:h-[760px] bg-black rounded-[3rem] md:rounded-[4rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border-[8px] border-[#1a1a1a]"
              >
                {/* Screen Content */}
                <div className="w-full h-full rounded-[2.2rem] md:rounded-[3.2rem] overflow-hidden bg-[#050103] relative group">
                   <iframe 
                      src={EXPERIENCES[activeIndex].demoUrl} 
                      className="w-full h-full border-none scale-[1.01]"
                      title="Experience Preview"
                   />
                </div>
                
                {/* Hardware Details */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-[30]" />
              </motion.div>
              
              {/* Floating Decorative Elements - 3D Rendered Icons */}
              <motion.div 
                key={`icon-${EXPERIENCES[activeIndex].id}`}
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1, y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ 
                  opacity: { duration: 0.5 },
                  x: { duration: 0.5 },
                  y: { duration: 5, repeat: Infinity },
                  rotate: { duration: 5, repeat: Infinity }
                }}
                className="absolute -top-10 -left-10 md:-top-20 md:-left-20 p-2 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] z-[25] w-24 h-24 md:w-32 md:h-32 flex items-center justify-center overflow-hidden"
              >
                <Image 
                  src={EXPERIENCES[activeIndex].icon} 
                  alt="Icon" 
                  width={120} 
                  height={120} 
                  className="object-contain drop-shadow-2xl"
                />
              </motion.div>
            </div>
          </div>

          {/* Right: Selection Details */}
          <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
            {EXPERIENCES.map((exp, index) => (
              <motion.div
                key={exp.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => window.open(exp.demoUrl, '_blank')}
                className={`group cursor-pointer p-6 rounded-3xl transition-all duration-500 border ${
                  activeIndex === index 
                    ? 'bg-[#1a1a1a] text-white border-[#D4AF37] shadow-2xl scale-[1.02]' 
                    : 'bg-transparent border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${activeIndex === index ? 'text-[#D4AF37]' : 'text-white/20'}`}>
                    {exp.series}
                  </span>
                  <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter ${activeIndex === index ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-white/40'}`}>
                    {exp.tag}
                  </span>
                </div>
                <h3 className={`font-serif text-2xl md:text-3xl mb-3 ${activeIndex === index ? 'text-white' : 'text-white/40'}`}>
                  {exp.title}
                </h3>
                <p className={`text-sm leading-relaxed ${activeIndex === index ? 'text-white/60' : 'text-white/20'}`}>
                  {exp.desc}
                </p>
                
                {activeIndex === index && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="h-px bg-wedding-gold/30 mt-6"
                  />
                )}
                
                <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore Experience</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
