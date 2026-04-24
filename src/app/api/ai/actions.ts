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

    const prompt = `Buatkan kutipan romantis yang puitis dan bermakna untuk undangan pernikahan antara ${brideName} dan ${groomName}. 
    Kutipan harus dalam Bahasa Indonesia, elegan, tidak terlalu panjang (maksimal 3 kalimat), dan menyentuh hati. 
    Jangan gunakan kata-kata yang terlalu klise. Langsung berikan teks kutipannya saja tanpa penjelasan.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { success: true, text: text.trim() };
  } catch (error) {
    console.error("AI Generation Error:", error);
    return { success: false, message: "Gagal membuat kutipan otomatis." };
  }
}
