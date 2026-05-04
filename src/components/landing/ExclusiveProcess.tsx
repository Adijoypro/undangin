"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    title: "The Vision",
    description: "Konsultasikan konsep pernikahan impian Anda dengan kurator desain kami.",
    icon: "/assets/branding/final/nusantara_wayang_solid_white_bg_1777349850175.webp",
    detail: "Desain Eksklusif"
  },
  {
    title: "The Craft",
    description: "Teknologi AI kami mengolah setiap detail dengan presisi artistik yang tinggi.",
    icon: "/assets/branding/final/ai_vip_badge_solid_white_bg_1777348235668.webp",
    detail: "Presisi Tinggi"
  },
  {
    title: "The Reveal",
    description: "Undangan mahakarya Anda siap disebarkan ke seluruh penjuru dunia.",
    icon: "/assets/branding/final/ai_global_network_solid_white_bg_1777348154457.webp",
    detail: "Jangkauan Global"
  },
  {
    title: "The Legacy",
    description: "Data dan kenangan Anda tersimpan aman dalam arsip digital premium kami.",
    icon: "/assets/branding/final/ai_data_pillars_solid_white_bg_1777347988743.webp",
    detail: "Keamanan VVIP"
  }
];

export default function ExclusiveProcess() {
  return (
    <section className="py-12 md:py-32 px-4 bg-wedding-base relative overflow-hidden">
      {/* Background Decorative Element - Optimized for Mobile */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-wedding-gold/5 rounded-full blur-[60px] md:blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-wedding-gold/5 rounded-full blur-[60px] md:blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24 px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-wedding-gold font-serif italic tracking-widest text-sm md:text-lg"
          >
            Our Methodology
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif mt-4 text-wedding-text leading-tight"
          >
            The Art of Crafting <br /> <span className="text-wedding-gold">Your Legacy</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 px-2 md:px-0">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative p-5 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-wedding-gold/10 bg-white/50 backdrop-blur-sm hover:bg-white hover:border-wedding-gold/30 transition-all duration-500 hover:shadow-2xl hover:shadow-wedding-gold/5"
            >
              {/* Step Number */}
              <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-8 h-8 md:w-12 md:h-12 bg-wedding-base border border-wedding-gold/20 rounded-full flex items-center justify-center font-serif text-wedding-gold group-hover:bg-wedding-gold group-hover:text-white transition-colors duration-500 shadow-xl text-[10px] md:text-base">
                0{index + 1}
              </div>

              <div className="mb-4 md:mb-8 text-wedding-gold bg-wedding-gold/5 w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 overflow-hidden relative">
                <Image 
                  src={step.icon} 
                  alt={step.title}
                  width={80}
                  height={80}
                  className="object-contain mix-blend-multiply"
                />
              </div>

              <h3 className="text-base md:text-2xl font-serif mb-2 md:mb-4 text-wedding-text">{step.title}</h3>
              <p className="text-[10px] md:text-base text-wedding-text/60 leading-relaxed font-light mb-4 md:mb-6 line-clamp-3 md:line-clamp-none">
                {step.description}
              </p>

              <div className="pt-6 border-t border-wedding-gold/5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-wedding-gold/50 group-hover:text-wedding-gold transition-colors">
                  {step.detail}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
