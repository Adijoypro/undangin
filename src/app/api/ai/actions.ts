"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateRomanticQuote(brideName: string, groomName: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return { success: false, message: "AI API Key belum dikonfigurasi." };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Buatkan 1 kutipan (quote) pernikahan yang romantis, puitis, dan menyentuh hati dalam Bahasa Indonesia untuk mempelai bernama ${brideName || 'Mempelai Wanita'} dan ${groomName || 'Mempelai Pria'}. Hanya berikan teks kutipannya saja (maksimal 3 kalimat) tanpa penjelasan apapun.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (!text) throw new Error("Respon AI kosong");

    return { success: true, text: text.trim() };
  } catch (error: any) {
    console.error("AI Error:", error);
    return { success: false, message: "Server AI sedang sibuk, coba lagi ya bro!" };
  }
}
