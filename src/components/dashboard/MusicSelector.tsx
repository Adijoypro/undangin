"use client";

import { useState, useRef } from "react";

const DEFAULT_MUSIC = [
  { id: "marry-your-daughter", name: "Marry Your Daughter (Piano)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: "a-thousand-years", name: "A Thousand Years (Instrumental)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: "perfect-piano", name: "Perfect - Ed Sheeran (Piano)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: "beautiful-in-white", name: "Beautiful in White", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { id: "canon-in-d", name: "Canon in D (Orchestra)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
];

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
    <div className="space-y-4">
      <audio ref={audioRef} onEnded={() => setPlaying(null)} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DEFAULT_MUSIC.map((music) => (
          <div 
            key={music.id}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
              selectedMusic === music.url ? 'border-wedding-gold bg-wedding-gold/5 shadow-md' : 'border-gray-100 hover:border-gray-200'
            }`}
            onClick={() => setSelectedMusic(music.url)}
          >
            <div className="flex items-center gap-3">
              <div 
                onClick={(e) => { e.stopPropagation(); togglePreview(music.url); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  playing === music.url ? 'bg-wedding-gold text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {playing === music.url ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </div>
              <span className="text-xs font-bold text-gray-700">{music.name}</span>
            </div>
            {selectedMusic === music.url && (
              <svg className="w-5 h-5 text-wedding-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            )}
          </div>
        ))}
      </div>

      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
        <div className="relative flex justify-center text-xs uppercase font-bold text-gray-400 bg-white px-2">Atau Upload MP3 Sendiri</div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
        <input 
          type="file" 
          accept="audio/mpeg" 
          name="music_file" 
          className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-wedding-text file:text-white hover:file:bg-gray-800 cursor-pointer" 
        />
        <p className="text-[10px] text-gray-400 mt-2 italic">*Jika upload file, lagu katalog di atas akan diabaikan.</p>
      </div>

      <input type="hidden" name="selected_music_url" value={selectedMusic} />
    </div>
  );
}
