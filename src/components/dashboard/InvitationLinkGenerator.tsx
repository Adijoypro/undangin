"use client";

import { useState } from "react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

interface Guest {
  name: string;
  code: string;
  link: string;
}

export default function InvitationLinkGenerator({ 
  slug, 
  isPublished, 
  credits 
}: { 
  slug: string; 
  isPublished: boolean;
  credits: number;
}) {
  const [names, setNames] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const invitationUrl = `${baseUrl}/${slug}`;

  // Auto-generate guest objects with unique codes
  const guestList: Guest[] = names
    .split(/[\n,]+/)
    .map(n => n.trim())
    .filter(n => n !== "")
    .map((name, index) => {
      const code = `INV-${slug.slice(0, 3).toUpperCase()}-${(index + 1).toString().padStart(3, '0')}`;
      return {
        name,
        code,
        link: `${invitationUrl}?to=${encodeURIComponent(name)}&code=${code}`
      };
    });

  const handleCopyLink = async (guest: Guest) => {
    if (!isPublished) {
      if (credits < 1) {
        toast.error("Kredit tidak cukup untuk membagikan link draft.");
        return;
      }
      
      const confirm = window.confirm("Gunakan 1 kredit untuk menyalin link personal ini?");
      if (!confirm) return;
      
      setIsProcessing(true);
      // await deductCredit(1); 
      setTimeout(() => {
        setIsProcessing(false);
        copyToClipboard(guest.link);
      }, 800);
    } else {
      copyToClipboard(guest.link);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link berhasil disalin ke clipboard!");
  };

  const handleShareWA = async (guest: Guest) => {
    if (!isPublished) {
      if (credits < 1) {
        toast.error("Kredit tidak cukup. Silakan top up dulu!");
        return;
      }
      
      const confirm = window.confirm("Undangan belum di-publish. Gunakan 1 kredit untuk membagikan link ini?");
      if (!confirm) return;
      
      setIsProcessing(true);
      // await deductCredit(1); 
      setTimeout(() => {
        setIsProcessing(false);
        openWA(guest);
      }, 1000);
    } else {
      openWA(guest);
    }
  };

  const openWA = (guest: Guest) => {
    const message = encodeURIComponent(`Halo ${guest.name},\nKami mengundang Anda ke acara pernikahan kami.\nBuka undangan di sini: ${guest.link}`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 mb-8 max-w-4xl relative group">
      {/* Decorative Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-transparent pointer-events-none"></div>

      {/* Header Section - Premium Branding */}
      <div className="p-6 md:p-8 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2 py-1 bg-wedding-gold/10 border border-wedding-gold/20 rounded-full mb-1">
             <div className="w-1.5 h-1.5 bg-wedding-gold rounded-full animate-pulse"></div>
             <span className="text-[8px] font-black text-wedding-gold uppercase tracking-[0.2em]">Jalur VIP & Orang Penting</span>
          </div>
          <h3 className="text-xl font-serif text-white tracking-tight">Kirim ke Tamu Spesial</h3>
          <p className="text-zinc-500 text-[10px] max-w-md leading-relaxed">
            Gunakan jalur ini khusus untuk keluarga, sahabat, atau orang terdekat agar nama mereka tampil eksklusif di dalam undangan.
          </p>
        </div>

        <div className="flex-1 w-full md:w-auto">
          <textarea 
            value={names}
            onChange={(e) => setNames(e.target.value)}
            placeholder="Ketik Nama Orang Penting / Keluarga (Pisahkan koma atau enter)..."
            rows={2}
            className="w-full px-5 py-4 bg-black/40 border border-zinc-800 rounded-2xl focus:border-wedding-gold outline-none transition-all text-xs font-medium text-white resize-none shadow-inner placeholder:text-zinc-700"
          />
        </div>
      </div>

      {/* Results Section - List of Special Guests */}
      <div className="p-6 md:p-8 max-h-[450px] overflow-y-auto relative z-10 bg-zinc-900/50">
        {guestList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guestList.map((guest, i) => (
              <div key={i} className="group relative bg-zinc-950 border border-zinc-800/50 rounded-2xl p-4 hover:border-wedding-gold/30 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <p className="text-[8px] font-bold text-wedding-gold/60 uppercase mb-1 tracking-widest">{guest.code}</p>
                    <h4 className="text-sm font-bold text-zinc-100 truncate pr-2">{guest.name}</h4>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg scale-75 origin-top-right shadow-lg">
                    <QRCodeSVG value={guest.link} size={32} />
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button 
                    onClick={() => handleCopyLink(guest)}
                    disabled={isProcessing}
                    className="flex-1 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl text-[9px] font-bold uppercase tracking-wider hover:bg-zinc-700 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? "Wait..." : `Copy Link ${!isPublished ? '(1 Cred)' : ''}`}
                  </button>
                  <button 
                    onClick={() => handleShareWA(guest)}
                    disabled={isProcessing}
                    className="flex-1 py-2.5 bg-green-600/10 text-green-500 border border-green-600/20 rounded-xl text-[9px] font-bold uppercase tracking-wider hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? "..." : (
                      <>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WA {!isPublished && "(1 Cred)"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center text-zinc-700 border border-zinc-800 shadow-inner">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"></path></svg>
             </div>
             <div>
               <p className="text-zinc-400 text-sm font-medium">Belum ada tamu spesial.</p>
               <p className="text-zinc-600 text-[10px] mt-1 max-w-[200px] leading-relaxed uppercase tracking-widest font-bold">Ketik nama orang penting di kotak atas untuk otomatis membuat jalur VIP.</p>
             </div>
          </div>
        )}
      </div>

      {/* Footer - Branding */}
      <div className="bg-black/40 p-4 border-t border-zinc-800 text-center relative z-10">
         <p className="text-[8px] text-zinc-700 uppercase tracking-[0.3em] font-black">
           Undangin Exclusive Guest System
         </p>
      </div>
    </div>
  );
}
