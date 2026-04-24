"use client";

import { useState, useRef } from "react";
import { PRESET_MUSIC } from "@/data/music";

interface MusicSelectorProps {
  currentMusicUrl?: string;
}

export default function MusicSelector({ currentMusicUrl }: MusicSelectorProps) {
  const [selectedMusic, setSelectedMusic] = useState<string>(currentMusicUrl || "");
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePreview = (url: string) => {
    if (playing === url) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setPlaying(url);
      }
    }
  };

  return (
    <div className="space-y-6">
      <audio ref={audioRef} onEnded={() => setPlaying(null)} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PRESET_MUSIC.map((music) => (
          <div 
            key={music.id}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
              selectedMusic === music.url ? 'border-wedding-gold bg-wedding-gold/5 shadow-md' : 'border-gray-50 hover:border-wedding-gold/20'
            }`}
            onClick={() => setSelectedMusic(music.url)}
          >
            <div className="flex items-center gap-4">
              <div 
                onClick={(e) => { e.stopPropagation(); togglePreview(music.url); }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${
                  playing === music.url ? 'bg-wedding-gold text-white scale-110' : 'bg-white text-gray-400 group-hover:text-wedding-gold'
                }`}
              >
                {playing === music.url ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">{music.name}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{music.artist}</p>
              </div>
            </div>
            {selectedMusic === music.url && (
              <div className="w-6 h-6 bg-wedding-gold rounded-full flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative pt-4">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-gray-400 bg-white px-4 italic">Atau Upload MP3 Kustom</div>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-wedding-gold/30 transition-colors">
        <input 
          type="file" 
          accept="audio/mpeg,audio/mp3" 
          name="music_file" 
          className="w-full text-xs text-gray-500 file:mr-6 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-wedding-text file:text-white hover:file:bg-gray-800 cursor-pointer" 
        />
        <div className="flex items-center gap-2 mt-4 text-[10px] text-gray-400">
          <svg className="w-3 h-3 text-wedding-gold" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
          <p>Jika Anda mengunggah file, lagu katalog di atas akan otomatis digantikan.</p>
        </div>
      </div>

      <input type="hidden" name="selected_music_url" value={selectedMusic} />
    </div>
  );
}
