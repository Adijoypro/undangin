"use server";

export async function generatePreweddingAI(imageUrl: string, theme: string) {
  const hfToken = process.env.HF_TOKEN || process.env.FAL_KEY;
  
  if (!hfToken) {
    return { success: false, message: "HF_TOKEN belum dikonfigurasi bro! Ambil gratis di huggingface.co" };
  }

  const themes: Record<string, string> = {
    beach: "Cinematic prewedding photography of a couple on a tropical beach, sunset, elegant wedding attire, highly detailed.",
    garden: "Romantic prewedding photography of a couple in a blooming garden, rustic wedding clothes, soft lighting.",
    luxury: "High-end luxury prewedding photography of a couple in a grand palace, designer wedding gown, chandeliers."
  };

  try {
    console.log("Starting Hugging Face AI Generation...");

    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
          "x-wait-for-model": "true", // PENTING: Nunggu model loading dulu
        },
        method: "POST",
        body: JSON.stringify({
          inputs: themes[theme] || themes.garden,
        }),
      }
    );

    // Cek apakah response-nya beneran JSON
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        return { success: false, message: "HF Error: " + (errorData.error || "Gagal memproses") };
      } else {
        const errorText = await response.text();
        console.error("HF Non-JSON Error:", errorText);
        return { success: false, message: "Server AI sedang sibuk (503). Coba klik lagi dalam 10 detik ya bro!" };
      }
    }

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    const base64Image = buffer.toString("base64");
    
    return { success: true, url: `data:image/webp;base64,${base64Image}` };

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { success: false, message: "Terjadi kesalahan: " + error.message };
  }
}
