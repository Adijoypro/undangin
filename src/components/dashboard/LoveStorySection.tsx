"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StoryItem {
  id: string;
  title: string;
  date: string;
  story: string;
}

interface LoveStorySectionProps {
  initialStories?: any;
  onChange?: (stories: any) => void;
}

export default function LoveStorySection({ initialStories = [], onChange }: LoveStorySectionProps) {
  // Parse initial stories if they come as string/json
  const parsedInitial = Array.isArray(initialStories) ? initialStories : [];
  const [stories, setStories] = useState<StoryItem[]>(
    parsedInitial.length > 0 
      ? parsedInitial.map((s: any, i: number) => ({ ...s, id: s.id || Math.random().toString(36).substr(2, 9) }))
      : []
  );

  const addStory = () => {
    const newStory = { id: Math.random().toString(36).substr(2, 9), title: "", date: "", story: "" };
    const newStories = [...stories, newStory];
    setStories(newStories);
    onChange?.(newStories);
  };

  const updateStory = (id: string, field: keyof StoryItem, value: string) => {
    const newStories = stories.map(s => s.id === id ? { ...s, [field]: value } : s);
    setStories(newStories);
    onChange?.(newStories);
  };

  const removeStory = (id: string) => {
    const newStories = stories.filter(s => s.id !== id);
    setStories(newStories);
    onChange?.(newStories);
  };

  return (
    <div className="space-y-6 transition-colors duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-wedding-text">Our Love Story</h3>
          <p className="text-[10px] text-wedding-text/40 italic">Ceritakan perjalanan cinta kalian dari awal bertemu.</p>
        </div>
        <button 
          type="button" 
          onClick={addStory}
          className="px-4 py-2 bg-wedding-gold/10 text-wedding-gold rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-wedding-gold/20 transition-all border border-wedding-gold/20 shadow-sm"
        >
          + Tambah Momen
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {stories.map((story, index) => (
            <motion.div 
              key={story.id}
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 20 }}
              className="p-6 bg-wedding-text/[0.03] rounded-2xl border border-wedding-gold/10 relative group overflow-hidden transition-all duration-500"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-wedding-gold/30"></div>
              
              <button 
                type="button" 
                onClick={() => removeStory(story.id)}
                className="absolute top-4 right-4 text-wedding-text/20 hover:text-red-500 transition-colors z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <div className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest mb-1">Judul Momen</label>
                    <input 
                      type="text" 
                      value={story.title}
                      onChange={(e) => updateStory(story.id, "title", e.target.value)}
                      placeholder="Misal: Pertama Bertemu" 
                      className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text text-sm font-bold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest mb-1">Kapan? (Bulan/Tahun)</label>
                    <input 
                      type="text" 
                      value={story.date}
                      onChange={(e) => updateStory(story.id, "date", e.target.value)}
                      placeholder="Misal: Januari 2020" 
                      className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text text-sm font-bold transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest mb-1">Cerita Singkat</label>
                  <textarea 
                    value={story.story}
                    onChange={(e) => updateStory(story.id, "story", e.target.value)}
                    rows={2} 
                    placeholder="Tuliskan sedikit kenangan di momen ini..." 
                    className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text text-sm leading-relaxed transition-all"
                  ></textarea>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {stories.length === 0 && (
          <div className="text-center py-16 bg-wedding-text/[0.02] rounded-3xl border border-dashed border-wedding-gold/20 transition-all duration-500">
            <svg className="w-12 h-12 text-wedding-text/10 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-sm text-wedding-text/40 italic">Belum ada cerita. Tambahkan momen spesial kalian!</p>
          </div>
        )}
      </div>
    </div>
  );
}
