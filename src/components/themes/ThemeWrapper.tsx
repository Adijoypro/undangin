"use client";

import { useState, useRef, useEffect } from "react";
import InvitationCover from "./InvitationCover";
import { deleteGuestbookEntry } from "@/app/api/guestbook/delete/actions";
import MusicSelector from "../ui/MusicSelector";
import { AnimatePresence } from "framer-motion";

interface ThemeWrapperProps {
  data: any;
  isOwner: boolean;
  children: React.ReactNode;
}

export default function ThemeWrapper({ data, isOwner, children }: ThemeWrapperProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMusicSelector, setShowMusicSelector] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Analytics Calculation
  const totalRSVP = data.guestbook?.length || 0;
  const totalAttending = data.guestbook?.filter((g: any) => g.attendance === 'Hadir').length || 0;

  useEffect(() => {
    (window as any).handleDeleteEntry = async (id: string) => {
      if (confirm("Hapus ucapan ini?")) {
        const res = await deleteGuestbookEntry(id, data.slug);
        if (res.success) {
          alert("Ucapan berhasil dihapus.");
          window.location.reload(); 
        }
      }
    };
  }, [data.slug]);

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
      <audio ref={audioRef} loop src={data.musicUrl} />

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
        <button 
          onClick={toggleMusic}
          className="fixed bottom-6 left-6 z-[99] w-12 h-12 bg-white/50 backdrop-blur-md rounded-full border border-wedding-gold/30 flex items-center justify-center shadow-lg hover:scale-110 transition-all text-wedding-gold"
        >
          {isPlaying ? (
            <svg className="w-6 h-6 animate-spin-slow" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" opacity=".3"/><path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.17l5.32 5.32 1.27-1.27L4.27 3zM14 7h4V3h-6v4.61l2 2V7z"/></svg>
          )}
        </button>
      )}

      {/* INVITATION COVER */}
      <InvitationCover 
        bride={data.bride.name} 
        groom={data.groom.name} 
        onOpen={handleOpen} 
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
    </div>
  );
}
