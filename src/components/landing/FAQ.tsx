"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Apakah desain undangan bisa dikustomisasi sepenuhnya?",
    answer: "Tentu. Setiap elemen dalam tema premium kami dapat disesuaikan mulai dari tipografi, palet warna, hingga aransemen musik untuk mencerminkan kepribadian unik Anda."
  },
  {
    question: "Bagaimana sistem RSVP bekerja untuk tamu saya?",
    answer: "Tamu Anda dapat memberikan konfirmasi kehadiran langsung melalui undangan digital. Anda akan menerima notifikasi real-time dan dapat memantau daftar tamu melalui dasbor eksklusif."
  },
  {
    question: "Apakah ada batasan jumlah tamu yang bisa diundang?",
    answer: "Untuk paket Premium dan Royal, tidak ada batasan jumlah tamu (Unlimited). Anda bebas menyebarkan kebahagiaan ke sebanyak mungkin relasi Anda."
  },
  {
    question: "Berapa lama masa aktif undangan digital saya?",
    answer: "Undangan Anda akan tetap aktif selama 1 tahun penuh setelah hari pernikahan, memungkinkan Anda dan tamu untuk tetap mengenang momen indah tersebut."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);

  // Diet Scroll Logic: Limit to 2 on mobile unless 'showAll' is true
  const displayedFaqs = showAll ? faqs : faqs.slice(0, 2);

  return (
    <section className="py-12 md:py-32 px-4 bg-wedding-base border-t border-wedding-gold/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16 px-4">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-wedding-gold font-serif italic tracking-widest text-[10px] md:text-sm mb-4 block"
          >
            Inquiries & Support
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-5xl text-wedding-text"
          >
            Pertanyaan <span className="text-wedding-gold">Umum</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 md:gap-y-0 px-4 transition-all duration-500">
          <AnimatePresence mode="popLayout">
            {displayedFaqs.map((faq, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border-b border-wedding-gold/10"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full py-5 md:py-6 flex justify-between items-center text-left group"
                >
                  <span className={`text-base md:text-lg font-serif transition-colors duration-300 pr-4 ${openIndex === i ? 'text-wedding-gold' : 'text-wedding-text group-hover:text-wedding-gold'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border border-wedding-gold/20 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${openIndex === i ? 'bg-wedding-gold border-wedding-gold text-white rotate-0' : 'text-wedding-gold rotate-90'}`}>
                    {openIndex === i ? <Minus className="w-3 h-3 md:w-4 md:h-4" /> : <Plus className="w-3 h-3 md:w-4 md:h-4" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 md:pb-6 text-wedding-text/60 leading-relaxed font-light text-sm md:text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {faqs.length > 2 && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 rounded-full border border-wedding-gold/30 text-wedding-gold font-serif italic text-sm hover:bg-wedding-gold hover:text-white transition-all duration-500"
            >
              {showAll ? "Tampilkan Lebih Sedikit" : "Lihat Semua Pertanyaan"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
