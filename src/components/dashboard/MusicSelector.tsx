"use client";

import { useState, useRef, useEffect } from "react";
import { PRESET_MUSIC } from "@/data/music";
import AIMusicGenerator from "./AIMusicGenerator";

interface MusicSelectorProps {
  currentMusicUrl?: string;
  onChange?: (url: string) => void;
}

export default function MusicSelector({ currentMusicUrl, onChange }: MusicSelectorProps) {
  const [selectedMusic, setSelectedMusic] = useState<string>(currentMusicUrl || "");
  const [playing, setPlaying] = useState<string | null>(null);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync with parent props
  useEffect(() => {
    if (currentMusicUrl) {
      setSelectedMusic(currentMusicUrl);
    }
  }, [currentMusicUrl]);

  const togglePreview = async (url: string) => {
    if (playing === url) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.src = url;
          audioRef.current.load(); // Penting biar AbortError hilang
          
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            setPlaying(url);
            await playPromise;
          }
        } catch (error: any) {
          if (error.name !== "AbortError") {
            console.error("Playback error:", error);
            setPlaying(null);
          }
        }
      }
    }
  };

  const isCustomSelected = selectedMusic && !PRESET_MUSIC.some(m => m.url === selectedMusic);

  return (
    <div className="space-y-6 transition-colors duration-500">
      <audio ref={audioRef} onEnded={() => setPlaying(null)} />
      
      {/* 1. Grid Katalog Standar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PRESET_MUSIC.map((music) => (
          <div 
            key={music.id}
            className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-2 relative group ${
              selectedMusic === music.url ? 'border-wedding-gold bg-wedding-gold/5 shadow-md' : 'border-wedding-gold/5 bg-wedding-text/[0.03] hover:border-wedding-gold/20'
            }`}
            onClick={() => {
              setSelectedMusic(music.url);
              onChange?.(music.url);
            }}
          >
            <div 
              onClick={(e) => { e.stopPropagation(); togglePreview(music.url); }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                playing === music.url ? 'bg-wedding-gold text-white scale-110' : 'bg-wedding-base text-wedding-text/40 group-hover:text-wedding-gold'
              }`}
            >
              {playing === music.url ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </div>
            <div className="overflow-hidden w-full">
              <p className="text-[10px] font-bold text-wedding-text line-clamp-1">{music.name}</p>
              <p className="text-[8px] text-wedding-text/40 uppercase tracking-widest font-black">{music.artist}</p>
            </div>
            {selectedMusic === music.url && (
              <div className="absolute top-1 right-1 w-3 h-3 bg-wedding-gold rounded-full flex items-center justify-center text-black shadow-sm">
                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 2. Opsi Canggih (AI & Custom) */}
      <div className="relative pt-4">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-wedding-gold/10"></span></div>
        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-wedding-text/40 bg-wedding-base px-4 transition-colors duration-500 italic">Opsi Canggih</div>
      </div>

      <div className="flex flex-col items-center gap-6 py-8 bg-wedding-text/[0.03] rounded-3xl border border-wedding-gold/10 transition-all duration-500 shadow-inner">
        {/* Tombol Generator */}
        <div className="text-center">
          <AIMusicGenerator onGenerated={(result: any) => {
            setSelectedMusic(result.url);
            setIsAiGenerated(result.isAiGenerated);
            setAiMessage(result.message || "");
            onChange?.(result.url);
            togglePreview(result.url);
          }} />
          <p className="text-[10px] text-wedding-text/40 mt-3 font-medium italic">Bikin instrumen unik khusus untukmu ✨</p>
        </div>

        {/* Slot Preview Hasil AI / Custom */}
        {isCustomSelected && (
          <div 
            className={`w-full max-w-xs p-5 rounded-2xl border-2 bg-wedding-base shadow-2xl flex items-center justify-between animate-in fade-in zoom-in duration-500 ${
              isAiGenerated ? 'border-wedding-gold shadow-wedding-gold/10' : 'border-wedding-sage/50 shadow-wedding-sage/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <div 
                onClick={() => togglePreview(selectedMusic)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer ${
                  playing === selectedMusic ? 'bg-wedding-gold text-black rotate-12 scale-110' : 'bg-wedding-gold/10 text-wedding-gold hover:bg-wedding-gold/20'
                }`}
              >
                {playing === selectedMusic ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </div>
              <div>
                <p className="text-xs font-black text-wedding-text uppercase tracking-tight">
                  {isAiGenerated ? "Musik Hasil Sulap AI ✨" : "Rekomendasi AI Terbaik ✨"}
                </p>
                <p className={`text-[9px] font-black uppercase tracking-widest ${isAiGenerated ? 'text-wedding-gold animate-pulse' : 'text-wedding-sage'}`}>
                  {isAiGenerated ? "Murni Gubahan AI" : "Kurasi Suasana AI"}
                </p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-black shadow-lg ${isAiGenerated ? 'bg-wedding-gold' : 'bg-wedding-sage'}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
          </div>
        )}

        {aiMessage && (
          <div className="px-6 text-center">
            <p className="text-[9px] text-wedding-text/60 leading-relaxed max-w-[200px] mx-auto italic font-medium">
              "{aiMessage}"
            </p>
          </div>
        )}

        {/* Upload Custom */}
        <div className="w-full max-w-xs px-4">
          <div className="relative flex justify-center text-[9px] uppercase font-black tracking-widest text-wedding-text/20 mb-4 italic">Atau Upload MP3 Sendiri</div>
          <div className="bg-wedding-base p-4 rounded-2xl border border-wedding-gold/10 shadow-sm transition-colors duration-500">
            <input 
              type="file" 
              accept="audio/mpeg,audio/mp3" 
              name="music_file" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setSelectedMusic(url);
                  setIsAiGenerated(false);
                  setAiMessage("Musik kustom berhasil diunggah! ✨");
                  onChange?.(url);
                  togglePreview(url);
                }
              }}
              className="w-full text-[9px] text-wedding-text/40 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-wedding-text/10 file:text-wedding-text hover:file:bg-wedding-text/20 cursor-pointer transition-all" 
            />
          </div>
          <div className="flex items-start gap-2 mt-4 text-[9px] text-wedding-text/40 italic">
            <svg className="w-3 h-3 text-wedding-gold shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
            <p>File yang diunggah akan otomatis menggantikan pilihan lagu di atas saat undangan disimpan.</p>
          </div>
        </div>
      </div>

      <input type="hidden" name="selected_music_url" value={selectedMusic || ""} />
    </div>
  );
}
