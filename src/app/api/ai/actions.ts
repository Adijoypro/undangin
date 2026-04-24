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
