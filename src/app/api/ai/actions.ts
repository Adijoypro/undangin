"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateRomanticQuote(brideName: string, groomName: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return { success: false, message: "AI API Key belum dikonfigurasi." };
  }

  try {
    // JURUS PAMUNGKAS: Panggil API Google Langsung (Bypass SDK)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Buatkan 1 kutipan (quote) pernikahan yang romantis, puitis, dan menyentuh hati dalam Bahasa Indonesia untuk mempelai bernama ${brideName || 'Mempelai Wanita'} dan ${groomName || 'Mempelai Pria'}. Hanya berikan teks kutipannya saja (maksimal 3 kalimat) tanpa penjelasan.`
          }]
        }]
      })
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("Gagal mengambil respon dari Google");

    return { success: true, text: text.trim() };
  } catch (error: any) {
    console.error("Direct AI Error:", error);
    
    // ALTERNATIF CEPAT: Jika API mati, kasih quote random yang pasti cakep
    const fallbackQuotes = [
      "Mencintai bukan hanya sekadar saling memandang, namun memandang ke arah yang sama bersama-sama.",
      "Cinta kita adalah sebuah perjalanan, yang dimulai selamanya dan berakhir tidak pernah.",
      "Di mata-Mu aku menemukan rumah, dan di hati-Mu aku menemukan kedamaian sejati.",
      "Semesta mempertemukan kita bukan untuk sekadar menyapa, tapi untuk saling menyempurnakan doa."
    ];
    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    
    return { success: true, text: randomQuote, isFallback: true };
  }
}

export async function generateMusicAI(mood: string) {
  const hfToken = process.env.HF_TOKEN;
  
  if (!hfToken) {
    return { success: false, message: "HF_TOKEN belum dikonfigurasi bro!" };
  }

  const moodPrompts: Record<string, string> = {
    romantic: "Soft romantic wedding background music, acoustic piano and strings, emotional, peaceful, cinematic, 85 bpm.",
    piano: "Beautiful solo piano for wedding, elegant, slow, romantic, high quality, classical style.",
    happy: "Upbeat acoustic folk wedding music, happy, cheerful, ukulele and acoustic guitar, festive.",
    cinematic: "Cinematic orchestral wedding background, epic but soft, emotional, grand, strings and horns.",
    traditional: "Indonesian traditional wedding fusion, soft gamelan with modern piano, peaceful, ethnic, romantic."
  };

  // Fallback music catalog (branded as "AI Recommendation")
  const fallbackMusic: Record<string, string> = {
    romantic: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    piano: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    happy: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cinematic: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    traditional: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  };

  const models = [
    "facebook/musicgen-small",
    "facebook/musicgen-medium",
  ];

  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      console.log(`AI Music Attempt ${attempts + 1}...`);
      
      const model = models[attempts % models.length]; // Switch models between attempts
      
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          headers: {
            Authorization: `Bearer ${hfToken}`,
            "Content-Type": "application/json",
            "x-wait-for-model": "true",
            "x-use-cache": "false",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: moodPrompts[mood] || moodPrompts.romantic,
          }),
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const buffer = Buffer.from(await blob.arrayBuffer());
        const base64Audio = buffer.toString("base64");
        return { success: true, url: `data:audio/mpeg;base64,${base64Audio}`, isAiGenerated: true };
      }

      if (response.status === 503) {
        // Model is loading, wait and retry
        console.log("Model loading, waiting 3s...");
        await new Promise(resolve => setTimeout(resolve, 3000));
        attempts++;
        continue;
      }

      throw new Error(`HF Error: ${response.status}`);

    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed:`, error);
      attempts++;
      // Wait a bit before next attempt
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // FINAL FALLBACK: If all AI attempts fail, give the user a "Recommended" track
  console.log("All AI attempts failed, using fallback...");
  return { 
    success: true, 
    url: fallbackMusic[mood] || fallbackMusic.romantic, 
    isAiGenerated: false,
    message: "Server AI sedang penuh sesak bro. Tapi tenang, kami sudah pilihkan lagu instrumen yang paling pas buat suasana ini! ✨"
  };
}
