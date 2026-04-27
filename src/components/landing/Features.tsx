"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Features() {
  return (
    <>
      {/* FEATURES */}
      <section id="fitur" className="py-32 px-4 relative border-t border-wedding-gold/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="font-serif text-5xl md:text-6xl mb-6 text-wedding-text">Kemewahan dalam Detail</h2>
            <p className="text-wedding-text/60 text-lg max-w-2xl mx-auto">Dirancang khusus untuk klien VVIP.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Animasi Sinematik", icon: "✨", desc: "Parallax scrolling halus dan transisi premium." },
              { title: "RSVP Cerdas", icon: "📊", desc: "Sistem pendataan kehadiran real-time terintegrasi." },
              { title: "Personalisasi", icon: "🎵", desc: "Unggah musik dan galeri tanpa batas." }
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-2xl bg-wedding-text/[0.03] border border-wedding-gold/10 hover:bg-wedding-gold/5 transition-all group"
              >
                <div className="text-4xl mb-8 group-hover:scale-110 transition-transform">{feat.icon}</div>
                <h3 className="font-serif text-2xl text-wedding-gold mb-4">{feat.title}</h3>
                <p className="text-wedding-text/60 leading-relaxed font-light">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-wedding-gold font-bold uppercase tracking-widest text-xs mb-4 block">Teknologi Mutakhir</span>
              <h2 className="font-serif text-5xl md:text-6xl mb-8 text-wedding-text">Lebih dari Sekadar Undangan.</h2>
              <p className="text-lg text-wedding-text/60 mb-10">Ekosistem digital untuk hari pernikahan Anda.</p>
              
              <div className="space-y-6">
                {["RSVP Management", "WhatsApp Integration", "QR Code Check-in"].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-wedding-gold/20 flex items-center justify-center text-wedding-gold flex-shrink-0 mt-1">✓</div>
                    <h4 className="font-bold text-lg text-wedding-text">{item}</h4>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-wedding-gold/10 bg-slate-900">
              <Image 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200" 
                fill
                className="object-cover grayscale-[20%]" 
                alt="Dashboard"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
