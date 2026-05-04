"use client";

import { useState, useRef, useEffect, createContext } from "react";
import { deleteGuestbookEntry } from "@/app/api/guestbook/delete/actions";
import MusicSelector from "../ui/MusicSelector";
import { InvitationData } from "@/data/invitations";
import PoweredByUndangin from "@/components/ui/PoweredByUndangin";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ConfirmModal from "../ui/ConfirmModal";
import MusicVisualizer from "../ui/MusicVisualizer";

interface ThemeWrapperProps {
  data: any;
  isOwner: boolean;
  children: React.ReactNode;
}

export const ThemeContext = createContext({
  isOpened: false,
  onOpen: () => {},
});

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

  useEffect(() => {
    if (isOpened && audioRef.current) {
      // Tunggu sebentar biar src-nya nempel dulu
      const timer = setTimeout(() => {
        audioRef.current?.play().catch(err => console.log("Playback error:", err));
        setIsPlaying(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpened]);

  useEffect(() => {
    if (audioRef.current && isOpened) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log("Play on URL change error:", err));
      }
    }
  }, [data.musicUrl, isOpened]);

  const handleOpen = () => {
    setIsOpened(true);
  };

  const getSafeMusicUrl = (url?: string) => {
    if (!url) return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    
    // Mapping lagu lama ke nama file baru yang sudah di-rename
    const legacyMap: Record<string, string> = {
      "A Thousand Years – Piano.mp3": "thousand_years_piano.mp3",
      "Akad-Payung-Teduh-Piano.mp3": "akad_piano.mp3",
      "Ed Sheeran - Perfect - Piano.mp3": "perfect_piano.mp3",
      "Karaoke-Glen-Fredly-Kisah-romantis.mp3": "kisah_romantis.mp3",
      "Nothing_s Gonna Change MyLove.mp3": "nothings_gonna_change.mp3",
      "Sempurna-Andra-And-The-Backbone-piano.mp3": "sempurna_piano.mp3",
      "Shane Filan-Beautiful In White-Piano.mp3": "beautiful_in_white_piano.mp3"
    };

    let processedUrl = url;
    Object.keys(legacyMap).forEach(oldName => {
      if (url.includes(oldName)) {
        processedUrl = `/music/${legacyMap[oldName]}`;
      }
    });

    return encodeURI(processedUrl);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(err => console.log("Toggle play error:", err));
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Warna background dasar biar nggak belang sama footer
  const getThemeBg = () => {
    switch (data.theme) {
      case 'majestic-eternity': return 'bg-[#06120C]';
      case 'ultra-luxury': return 'bg-[#0A0A0A]';
      case 'premium': return 'bg-[#111111]';
      case 'renaissance-garden': return 'bg-[#F5EFE6]';
      case 'cinematic-dark': return 'bg-black';
      case 'celestial-harmony': return 'bg-black';
      default: return 'bg-black';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeBg()} text-white selection:bg-wedding-gold selection:text-black`}>
      <audio 
        ref={audioRef} 
        loop 
        src={isOpened ? getSafeMusicUrl(data.musicUrl) : undefined} 
      />

      {/* ADMIN PANEL (Only for Owner) */}
      {isOwner && (
        <div className="fixed top-4 left-4 z-[10000] bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-wedding-gold/20 flex flex-col gap-2 scale-90 origin-top-left transition-all hover:scale-100">
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMusicSelector(true);
            }}
            className="mt-2 w-full py-2 bg-wedding-gold text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-wedding-text transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            Ganti Musik
          </button>
        </div>
      )}

      {/* MUSIC TOGGLE (Always visible after open) */}
      {isOpened && (
        <div className="fixed bottom-6 left-6 z-[10001] flex flex-col items-center gap-3">
          <div className="bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <MusicVisualizer isPlaying={isPlaying} />
          </div>
          <button 
            onClick={toggleMusic}
            className="w-12 h-12 bg-white/50 backdrop-blur-md rounded-full border border-wedding-gold/30 flex items-center justify-center shadow-lg hover:scale-110 transition-all text-wedding-gold pointer-events-auto cursor-pointer z-[10002]"
          >
            {isPlaying ? (
              <svg className="w-6 h-6 animate-spin-slow" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" opacity=".3"/><path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.17l5.32 5.32 1.27-1.27L4.27 3zM14 7h4V3h-6v4.61l2 2V7z"/></svg>
            )}
          </button>
        </div>
      )}



      {/* THEME CONTENT */}
      <ThemeContext.Provider value={{ isOpened, onOpen: handleOpen }}>
        {children}
        {isOpened && <PoweredByUndangin theme={data.theme} />}
      </ThemeContext.Provider>

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
