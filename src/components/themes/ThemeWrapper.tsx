"use client";

import { useState, useRef, useEffect } from "react";
import InvitationCover from "./InvitationCover";
import { deleteGuestbookEntry } from "@/app/api/guestbook/delete/actions";
import MusicSelector from "../ui/MusicSelector";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ConfirmModal from "../ui/ConfirmModal";
import MusicVisualizer from "../ui/MusicVisualizer";

interface ThemeWrapperProps {
  data: any;
  isOwner: boolean;
  children: React.ReactNode;
}

export default function ThemeWrapper({ data, isOwner, children }: ThemeWrapperProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMusicSelector, setShowMusicSelector] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Analytics Calculation
  const totalRSVP = data.guestbook?.length || 0;
  const totalAttending = data.guestbook?.filter((g: any) => g.attendance === 'Hadir').length || 0;

  useEffect(() => {
    // Auto-open if in iframe (for demo showcase)
    if (typeof window !== 'undefined' && window.self !== window.top) {
      setIsOpened(true);
    }

    (window as any).handleDeleteEntry = (id: string) => {
      setDeletingId(id);
    };
  }, [data.slug]);

  const confirmDelete = async () => {
    if (!deletingId) return;
    
    const res = await deleteGuestbookEntry(deletingId, data.slug);
    if (res.success) {
      toast.success("Ucapan berhasil dihapus");
      setDeletingId(null);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast.error("Gagal menghapus ucapan");
      setDeletingId(null);
    }
  };

  const handleOpen = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Autoplay blocked or error:", err));
      setIsPlaying(true);
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="relative">
      {/* GLOBAL AUDIO TAG */}
      <audio 
        ref={audioRef} 
        loop 
        src={data.musicUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} 
      />

      {/* ADMIN PANEL (Only for Owner) */}
      {isOwner && (
        <div className="fixed top-4 left-4 z-[999] bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-wedding-gold/20 flex flex-col gap-2 scale-90 origin-top-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-wedding-text">Admin Dashboard</span>
          </div>
          <div className="flex gap-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">Total RSVP</p>
              <p className="text-xl font-serif text-wedding-text">{totalRSVP}</p>
            </div>
            <div className="border-l border-gray-100 pl-4">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Hadir</p>
              <p className="text-xl font-serif text-wedding-gold">{totalAttending}</p>
            </div>
          </div>
          <p className="text-[8px] text-gray-400 mt-1 italic">*Tombol hapus aktif di Buku Tamu</p>
          
          <button 
            onClick={() => setShowMusicSelector(true)}
            className="mt-2 w-full py-2 bg-wedding-gold text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-wedding-text transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            Ganti Musik
          </button>
        </div>
      )}

      {/* MUSIC TOGGLE (Always visible after open) */}
      {isOpened && (
        <div className="fixed bottom-6 left-6 z-[99] flex flex-col items-center gap-3">
          <div className="bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <MusicVisualizer isPlaying={isPlaying} />
          </div>
          <button 
            onClick={toggleMusic}
            className="w-12 h-12 bg-white/50 backdrop-blur-md rounded-full border border-wedding-gold/30 flex items-center justify-center shadow-lg hover:scale-110 transition-all text-wedding-gold"
          >
            {isPlaying ? (
              <svg className="w-6 h-6 animate-spin-slow" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" opacity=".3"/><path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.17l5.32 5.32 1.27-1.27L4.27 3zM14 7h4V3h-6v4.61l2 2V7z"/></svg>
            )}
          </button>
        </div>
      )}

      {/* WHATSAPP RSVP (Bottom Right) */}
      {isOpened && (
        <div className="fixed bottom-6 right-6 z-[99]">
          <a 
            href={`https://wa.me/?text=${encodeURIComponent(`Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBuka undangan digital: https://undangin.com/${data.slug}`)}`}
            target="_blank"
            className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
            title="Kirim via WhatsApp"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>
      )}

      {/* INVITATION COVER */}
      <InvitationCover 
        bride={data.bride.name} 
        groom={data.groom.name} 
        onOpen={handleOpen} 
        forcedOpen={isOpened}
      />

      {/* THEME CONTENT */}
      <div className={`transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        {children}
      </div>

      {/* MODERATION OVERLAY (Injecting styles for delete buttons) */}
      {isOwner && (
        <style dangerouslySetInnerHTML={{ __html: `
          .guest-entry-delete { display: block !important; }
        `}} />
      )}

      {/* MUSIC SELECTOR MODAL */}
      <AnimatePresence>
        {showMusicSelector && (
          <MusicSelector 
            id={data.id}
            slug={data.slug}
            currentMusicUrl={data.musicUrl}
            onClose={() => setShowMusicSelector(false)}
          />
        )}
      </AnimatePresence>
      {/* CONFIRM MODAL */}
      <ConfirmModal 
        isOpen={!!deletingId}
        title="Hapus Ucapan?"
        message="Ucapan yang dihapus tidak dapat dikembalikan. Lanjutkan?"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
        confirmLabel="Hapus"
        isDanger
      />
    </div>
  );
}
