"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateRomanticQuote(brideName: string, groomName: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return { success: false, message: "AI API Key belum dikonfigurasi." };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      }
    });

    const prompt = `Buatkan 1 kutipan (quote) pernikahan yang sangat romantis, puitis, dan menyentuh hati dalam Bahasa Indonesia. 
    Mempelai Pria: ${groomName || 'Mempelai Pria'}
    Mempelai Wanita: ${brideName || 'Mempelai Wanita'}
    
    Aturan:
    - Hanya berikan teks kutipannya saja, tanpa penjelasan apapun.
    - Jangan gunakan tanda kutip di awal dan akhir.
    - Maksimal 3 kalimat.
    - Jika nama mempelai tersedia, selipkan secara natural dalam doa atau harapan di kutipan tersebut.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("AI memberikan respon kosong.");

    return { success: true, text: text.trim() };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { success: false, message: error.message || "Gagal membuat kutipan otomatis." };
  }
}
