"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MessageSquare, X, Send, Sparkles, Phone, Check, ArrowRight } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  actions?: Array<{ label: string; action: string; url?: string }>;
}

export default function NusantaraChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: "Sampurasun & Sugeng Rawuh Kak! 🤖\n\nSaya Ki Undang, asisten digital pintar Undangin. Saya di sini untuk membantu Kakak menemukan informasi cepat seputar paket harga, pilihan tema, atau cara membuat undangan digital premium.\n\nAda yang bisa Ki Undang bantu hari ini? Silakan klik tombol di bawah atau ketik langsung pertanyaan Kakak! 🙏✨",
          timestamp: new Date(),
          actions: [
            { label: "💰 Daftar Harga & Paket", action: "harga" },
            { label: "🎨 Pilihan Tema Premium", action: "tema" },
            { label: "📝 Cara Buat Undangan", action: "cara" },
            { label: "📞 Tanya Admin (WhatsApp)", action: "wa" },
          ],
        },
      ]);
    }
  }, [messages]);

  // Scroll to bottom whenever messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Local AI NLP Matching Engine (Superfast & 100% Free!)
  const getAIResponse = (query: string): { text: string; actions?: Message["actions"] } => {
    const q = query.toLowerCase();

    // 1. WhatsApp / Owner direct contact filter
    if (
      q.includes("wa") ||
      q.includes("whatsapp") ||
      q.includes("admin") ||
      q.includes("kontak") ||
      q.includes("tanya owner") ||
      q.includes("pemilik") ||
      q.includes("telfon") ||
      q.includes("telepon") ||
      q.includes("tanya langsung")
    ) {
      return {
        text: "Baik Kak, jika ada hal khusus yang memerlukan bantuan langsung atau ingin memesan undangan kustom premium, Kakak bisa langsung terhubung dengan Kak Admin di WhatsApp.\n\nKlik tombol di bawah ini untuk memulai chat WhatsApp langsung ya! 👇",
        actions: [
          {
            label: "💬 Hubungi Admin via WhatsApp",
            action: "open_url",
            url: "https://wa.me/6281234567890?text=Halo%20Admin%20Undangin,%20saya%20tertarik%20bertanya%20mengenai%20undangan%20premium",
          },
          { label: "🔙 Menu Utama", action: "welcome" },
        ],
      };
    }

    // 2. Pricing & Packages
    if (
      q.includes("harga") ||
      q.includes("paket") ||
      q.includes("biaya") ||
      q.includes("bayar") ||
      q.includes("murah") ||
      q.includes("mahal") ||
      q.includes("promo")
    ) {
      return {
        text: "Tentu Kak! Undangin menyediakan 3 Paket Mahakarya Premium (Sekali Bayar, Aktif Selamanya!): \n\n🔹 **Paket LITE (Rp 99.000)**\n• Fitur Standar Lengkap\n• Galeri 5 Foto\n• Google Maps & RSVP Standar\n\n🌿 **Paket PREMIUM (Rp 199.000) - *Terpopuler!***\n• Tema Exclusive (Sage Splendor, Modern Blue)\n• Galeri Foto & Video Tanpa Batas\n• Musik Latar Premium & RSVP Real-time\n\n👑 **Paket ROYAL (Rp 349.000)**\n• Tema Royal Elegance & Cinematic Dark\n• Fitur VIP Guestbook Moderation\n• Peta Simulasi 3D & Gift Angpao Digital\n\nKakak mau Ki Undang tunjukkan letak paketnya di website agar bisa langsung pesan?",
        actions: [
          { label: "✨ Lihat Paket Sekarang", action: "scroll_pricing" },
          { label: "🎨 Pilihan Tema Premium", action: "tema" },
          { label: "🔙 Menu Utama", action: "welcome" },
        ],
      };
    }

    // 3. Themes & Designs
    if (
      q.includes("tema") ||
      q.includes("desain") ||
      q.includes("sage") ||
      q.includes("gold") ||
      q.includes("blue") ||
      q.includes("contoh") ||
      q.includes("preview") ||
      q.includes("lihat")
    ) {
      return {
        text: "Undangin memiliki pilihan tema paling estetik dan premium yang bisa Kakak sesuaikan warnanya sesuka hati!\n\nBeberapa tema unggulan kami:\n👑 **Royal Elegance**: Desain gelap-emas klasik super mewah.\n🌿 **Sage Splendor**: Hijau sage organik dipadukan dengan aksen emas botani.\n🎬 **Cinematic Dark**: Nuansa film noir hitam berkelas dan romantis.\n💙 **Modern Blue**: Biru modern bergaya minimalis perkotaan.\n\nKakak mau Ki Undang arahkan untuk melihat pratinjau tema di katalog?",
        actions: [
          { label: "✨ Buka Katalog Tema", action: "open_url", url: "/katalog" },
          { label: "💰 Info Paket Harga", action: "harga" },
          { label: "🔙 Menu Utama", action: "welcome" },
        ],
      };
    }

    // 4. How to create
    if (
      q.includes("cara") ||
      q.includes("buat") ||
      q.includes("bikin") ||
      q.includes("mulai") ||
      q.includes("langkah") ||
      q.includes("daftar")
    ) {
      return {
        text: "Membuat undangan di Undangin sangat gampang dan hanya butuh 3 langkah instan Kak:\n\n1️⃣ **Pilih Tema**: Cari tema estetik yang paling menggambarkan kisah cinta kalian.\n2️⃣ **Isi Data Acara**: Masukkan informasi mempelai, akad, resepsi, galeri foto, dan kado digital.\n3️⃣ **Sebarkan!**: Undangan langsung aktif dan siap dibagikan ke seluruh keluarga & teman lewat link kustom.\n\nMau mulai buat undangan Kakak sekarang juga secara gratis?",
        actions: [
          { label: "📝 Mulai Buat Sekarang", action: "open_url", url: "/login" },
          { label: "💰 Daftar Harga", action: "harga" },
          { label: "🔙 Menu Utama", action: "welcome" },
        ],
      };
    }

    // 5. Traditional greetings
    if (
      q.includes("halo") ||
      q.includes("hai") ||
      q.includes("pagi") ||
      q.includes("siang") ||
      q.includes("sore") ||
      q.includes("malam") ||
      q.includes("assalamualaikum") ||
      q.includes("asalamualaikum") ||
      q.includes("sampurasun") ||
      q.includes("sugeng")
    ) {
      return {
        text: "Sugeng Rawuh & Sampurasun Kak! ✨\n\nSemoga hari ini penuh kebahagiaan untuk Kakak. Saya Ki Undang, asisten pernikahan digital paling setia di Undangin.\n\nKira-kira apa yang ingin Kakak ketahui hari ini tentang pembuatan undangan pernikahan premium kita?",
        actions: [
          { label: "💰 Daftar Harga & Paket", action: "harga" },
          { label: "🎨 Pilihan Tema Premium", action: "tema" },
          { label: "📞 Hubungi Admin WA", action: "wa" },
        ],
      };
    }

    // 6. Default Fallback - Smart Filtering!
    return {
      text: "Aduh, mohon maaf sekali Kak, Ki Undang belum terlalu paham mengenai hal tersebut karena pengetahuan saya masih terbatas seputar info pernikahan. 🙏\n\nAgar Kakak tidak bingung dan segera mendapat solusi terbaik, bagaimana jika Ki Undang sambungkan langsung ke WhatsApp Kak Admin untuk bantuan langsung?",
      actions: [
        {
          label: "💬 Hubungi Admin via WhatsApp",
          action: "open_url",
          url: "https://wa.me/6281234567890?text=Halo%20Admin%20Undangin,%20saya%20butuh%20bantuan%20mengenai...",
        },
        { label: "🔙 Menu Utama", action: "welcome" },
      ],
    };
  };

  const handleAction = (action: string, label: string, url?: string) => {
    // Add user click as message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: label,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      if (action === "open_url" && url) {
        window.open(url, "_blank");
        const botMsg: Message = {
          id: Math.random().toString(),
          sender: "bot",
          text: `Ki Undang sudah membukakan tautan "${label}" untuk Kakak di tab baru! Ada hal lain yang bisa Ki Undang bantu?`,
          timestamp: new Date(),
          actions: [
            { label: "💰 Daftar Harga", action: "harga" },
            { label: "🎨 Pilihan Tema", action: "tema" },
            { label: "🔙 Menu Utama", action: "welcome" },
          ],
        };
        setMessages((prev) => [...prev, botMsg]);
        return;
      }

      if (action === "scroll_pricing") {
        const pricingEl = document.getElementById("pricing");
        if (pricingEl) {
          pricingEl.scrollIntoView({ behavior: "smooth" });
          setIsOpen(false);
          return;
        }
      }

      // Handle predefined responses
      let response: { text: string; actions?: Message["actions"] };
      if (action === "welcome") {
        response = {
          text: "Ki Undang kembali! Ada yang bisa Ki Undang bantu lagi untuk membuat undangan pernikahan impian Kakak?",
          actions: [
            { label: "💰 Daftar Harga & Paket", action: "harga" },
            { label: "🎨 Pilihan Tema Premium", action: "tema" },
            { label: "📝 Cara Buat Undangan", action: "cara" },
            { label: "📞 Tanya Admin (WhatsApp)", action: "wa" },
          ],
        };
      } else {
        response = getAIResponse(action);
      }

      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: response.text,
        timestamp: new Date(),
        actions: response.actions,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const userQuery = input;
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const response = getAIResponse(userQuery);
      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: response.text,
        timestamp: new Date(),
        actions: response.actions,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  return (
    <>
      {/* Floating Mascot Button */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end">
        {/* Pulsing Hint Banner - Hidden on mobile to avoid blocking content */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 2, duration: 0.5 }}
              onClick={() => setIsOpen(true)}
              className="hidden md:flex mb-3 px-4 py-2 bg-black/80 backdrop-blur-md border border-[#D4AF37]/30 text-white rounded-xl shadow-xl items-center gap-3 cursor-pointer select-none group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D4AF37]/90 group-hover:text-white transition-colors">
                Tanya Ki Undang 🤖
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Trigger Circle Button - Compact and elegant on mobile */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center relative shadow-2xl overflow-hidden transition-all duration-300 border opacity-90 hover:opacity-100 ${
            isOpen
              ? "bg-black border-[#D4AF37]/30 text-white"
              : "bg-gradient-to-br from-[#0C0F16] to-[#05060A] border-[#D4AF37]/40 text-[#D4AF37]"
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5 md:w-6 md:h-6" />
          ) : (
            <div className="relative w-full h-full p-[2px]">
              <div className="w-full h-full relative rounded-full overflow-hidden border border-[#D4AF37]/20 bg-black/40">
                <Image
                  src="/ki_undang.png"
                  alt="Ki Undang Mascot"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              {/* Online Green Glow Dot */}
              <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-emerald-500 rounded-full border-2 border-[#0C0F16] animate-pulse"></span>
            </div>
          )}
        </motion.button>
      </div>

      {/* Glassmorphic Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 md:bottom-28 md:right-8 z-50 w-[calc(100vw-32px)] sm:w-[380px] h-[65vh] max-h-[500px] md:h-[550px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#0C0F16] to-[#02040A] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full border border-[#D4AF37]/30 overflow-hidden bg-black">
                  <Image
                    src="/ki_undang.png"
                    alt="Ki Undang Mascot"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif text-sm text-[#FDFBF7] tracking-wider">Ki Undang</h3>
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    <span className="text-[9px] font-sans uppercase tracking-widest text-[#FDFBF7]/40">
                      Online & Siap Melayani
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-[#FDFBF7]/40 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div 
              data-lenis-prevent
              className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 p-4 space-y-4 scroll-smooth" 
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-[#D4AF37] text-[#02040A] font-bold rounded-tr-none shadow-lg shadow-[#D4AF37]/10"
                        : "bg-white/5 border border-white/10 text-[#FDFBF7]/90 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Actions / Interactive Buttons */}
                  {msg.sender === "bot" && msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-col gap-2 mt-3 w-full max-w-[85%] pl-2">
                      {msg.actions.map((act, index) => (
                        <button
                          key={index}
                          onClick={() => handleAction(act.action, act.label, act.url)}
                          className="w-full py-2.5 px-4 bg-white/5 hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/50 text-left text-[11px] font-sans uppercase tracking-widest text-[#FDFBF7]/70 hover:text-[#D4AF37] transition-all rounded-xl flex items-center justify-between group"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3 translate-x-[-4px] group-hover:translate-x-0 transition-transform" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Dot Animation */}
              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Form */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-gradient-to-t from-[#02040A] to-transparent border-t border-white/5 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan sesuatu pada Ki Undang..."
                className="flex-1 bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#D4AF37]/50 text-xs px-4 py-3 rounded-xl text-white placeholder-white/30 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="p-3 bg-[#D4AF37] hover:bg-[#c29f32] text-[#02040A] rounded-xl flex items-center justify-center transition-all shadow-lg shadow-[#D4AF37]/20 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
