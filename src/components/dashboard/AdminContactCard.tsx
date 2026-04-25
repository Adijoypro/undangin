"use client";

import { motion } from "framer-motion";

export default function AdminContactCard() {
  const whatsappNumber = "6282114618361"; // GANTI DENGAN NOMOR WA KAMU BRO
  const message = encodeURIComponent("Halo Admin Undangin, saya butuh bantuan untuk buat undangan nih. Bisa bantu jelasin prosesnya?");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden group bg-gradient-to-br from-wedding-gold to-[#B8962E] p-6 rounded-3xl shadow-xl shadow-wedding-gold/20"
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left space-y-2">
          <h3 className="text-white font-serif text-2xl font-bold">Bingung Buat Undangan? 🤔</h3>
          <p className="text-white/80 text-sm max-w-sm">
            Nggak mau ribet input data satu-satu? Tim Admin kami siap bantu buatkan undangan kamu sampai jadi! (Layanan Full Service)
          </p>
        </div>

        <a
          href={`https://wa.me/${whatsappNumber}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-white text-wedding-gold rounded-2xl font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.048a11.827 11.827 0 001.578 5.91L0 24l6.102-1.6c1.863.516 3.827.788 5.792.788h.005c6.632 0 12.042-5.412 12.045-12.048a11.82 11.82 0 00-3.526-8.433" />
          </svg>
          Chat Admin Sekarang
        </a>
      </div>

      {/* Ornamen Latar */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 blur-xl" />
    </motion.div>
  );
}
