"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aditya & Sarah",
    role: "Modern Minimalist Couple",
    quote: "Undangin benar-benar merubah cara kami berbagi kebahagiaan. Desainnya sangat eksklusif, bahkan tamu-tamu kami dari luar negeri terpukau dengan animasinya.",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Bagas & Dinda",
    role: "Traditional Heritage Wedding",
    quote: "Meskipun tema kami tradisional, sentuhan digital dari Undangin memberikan kesan megah yang tetap sakral. Sangat mudah digunakan dan sangat premium.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Kevin & Monica",
    role: "International Destination Wedding",
    quote: "Fitur RSVP-nya sangat membantu koordinasi tamu kami. Semua terasa sangat teratur dan profesional. Truly the best in the industry.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-32 px-4 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-20 gap-6 md:gap-8 px-4 md:px-0">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-wedding-gold font-serif italic tracking-[0.3em] text-[10px] md:text-sm mb-4 block"
            >
              Voices of Elegance
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl md:text-6xl text-wedding-text leading-tight"
            >
              Kisah Bahagia <br /> Bersama <span className="text-wedding-gold">Undangin</span>
            </motion.h2>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
            <Quote className="w-16 h-16 md:w-20 md:h-20 text-wedding-gold/10" />
          </motion.div>
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-12 overflow-x-auto md:overflow-visible pb-12 md:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col group flex-shrink-0 w-[80vw] sm:w-[350px] md:w-auto snap-center md:snap-align-none"
            >
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 md:mb-8 shadow-2xl">
                <Image 
                  src={item.image} 
                  fill 
                  alt={item.name} 
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                  <h4 className="text-white font-serif text-xl md:text-2xl mb-1">{item.name}</h4>
                  <p className="text-white/60 text-[10px] md:text-xs uppercase tracking-widest">{item.role}</p>
                </div>
              </div>
              <div className="relative px-2">
                <Quote className="w-6 h-6 md:w-8 md:h-8 text-wedding-gold/20 absolute -top-3 -left-2 md:-top-4 md:-left-4 -z-10" />
                <p className="text-base md:text-lg text-wedding-text/70 italic leading-relaxed font-light">
                  "{item.quote}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
