"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateRomanticQuote(brideName: string, groomName: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return { success: false, message: "AI API Key belum dikonfigurasi." };
  }

  try {
    // Paksa pakai API v1 (versi stabil), bukan v1beta
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" },
      { apiVersion: "v1" }
    );

    const prompt = `Buatkan 1 kutipan (quote) pernikahan yang romantis, puitis, dan menyentuh hati dalam Bahasa Indonesia untuk mempelai bernama ${brideName || 'Mempelai Wanita'} dan ${groomName || 'Mempelai Pria'}. 
    Hanya berikan teks kutipannya saja (maksimal 3 kalimat) tanpa penjelasan apapun.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (!text) throw new Error("Empty response");

    return { success: true, text: text.trim() };
  } catch (error: any) {
    console.error("AI Error:", error);
    
    // Pintu Darurat: Coba model Pro di v1 juga
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel(
        { model: "gemini-pro" },
        { apiVersion: "v1" }
      );
      const result = await model.generateContent(`Kutipan pernikahan romantis Bahasa Indonesia untuk ${brideName} & ${groomName}`);
      return { success: true, text: result.response.text().trim() };
    } catch (innerError: any) {
      return { success: false, message: `Maaf bro, AI lagi lemot. Error: ${innerError.message || error.message}` };
    }
  }
}
