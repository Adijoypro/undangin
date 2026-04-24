"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { updateInvitationMusic } from "@/app/api/invitation/music/actions";
import { toast } from "sonner";

interface MusicSelectorProps {
  id: string;
  slug: string;
  currentMusicUrl: string;
  onClose: () => void;
}

const PRESET_MUSIC = [
  { name: "Beautiful in White", artist: "Shane Filan", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { name: "A Thousand Years", artist: "Christina Perri", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { name: "Perfect", artist: "Ed Sheeran", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { name: "Can't Help Falling in Love", artist: "Kina Grannis", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { name: "Marry Your Daughter", artist: "Brian McKnight", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
];

export default function MusicSelector({ id, slug, currentMusicUrl, onClose }: MusicSelectorProps) {
  const [selectedUrl] = useState(currentMusicUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePreview = (url: string) => {
    if (previewUrl === url) {
      audioPreviewRef.current?.pause();
      setPreviewUrl(null);
    } else {
      setPreviewUrl(url);
      if (audioPreviewRef.current) {
        audioPreviewRef.current.src = url;
        audioPreviewRef.current.play();
      }
    }
  };

  const handleSave = async (url: string, file?: File) => {
    setIsUploading(true);
    const res = await updateInvitationMusic(id, slug, url, file);
    setIsUploading(false);
    if (res.success) {
      toast.success("Musik berhasil diperbarui!");
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast.error("Gagal memperbarui musik: " + res.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File terlalu besar (Maks 10MB)");
        return;
      }
      handleSave("", file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <audio ref={audioPreviewRef} />
      
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-wedding-gold/10 to-transparent">
          <div>
            <h3 className="font-serif text-xl text-wedding-text">Pilih Musik Undangan</h3>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Premium Soundtrack</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin">
          {PRESET_MUSIC.map((music, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedUrl === music.url ? 'border-wedding-gold bg-wedding-gold/5 shadow-sm' : 'border-gray-100 hover:border-wedding-gold/30'}`}
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handlePreview(music.url)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${previewUrl === music.url ? 'bg-wedding-gold text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
                >
                  {previewUrl === music.url ? (
                    <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  ) : (
                    <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>
                <div>
                  <p className="text-sm font-bold text-wedding-text">{music.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{music.artist}</p>
                </div>
              </div>
              <button 
                onClick={() => handleSave(music.url)}
                disabled={isUploading}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${selectedUrl === music.url ? 'bg-wedding-gold text-white' : 'bg-gray-100 text-gray-500 hover:bg-wedding-gold hover:text-white'}`}
              >
                Pilih
              </button>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="audio/mpeg" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-wedding-gold/30 rounded-2xl text-wedding-gold font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-wedding-gold/5 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            {isUploading ? "Mengupload..." : "Upload Musik Sendiri (MP3)"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
