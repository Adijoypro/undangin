"use server";

import { createClient } from "@/lib/supabase/server";
import sharp from "sharp";

export async function uploadInstant(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Silakan login dulu bro." };
  }

  const file = formData.get("file") as File;
  if (!file) return { success: false, message: "File nggak ada." };

  try {
    // 1. Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Process with Sharp (Optimasi!)
    // - Resize max width 1200px (tinggi menyesuaikan)
    // - Convert to WebP
    // - Quality 80% (Sweet spot antara tajam & enteng)
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // 3. Nama file baru dengan ekstensi .webp
    const originalName = file.name.split('.')[0].replace(/\s+/g, "_");
    const fileName = `${user.id}/${Date.now()}_opt_${originalName}.webp`;

    // 4. Upload optimized buffer ke Supabase
    const { data, error } = await supabase.storage
      .from("invitations-media")
      .upload(fileName, optimizedBuffer, {
        contentType: "image/webp",
        upsert: true
      });

    if (error) throw error;

    const publicUrl = supabase.storage
      .from("invitations-media")
      .getPublicUrl(data.path).data.publicUrl;

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error("Instant Optimized Upload Error:", error);
    return { success: false, message: error.message };
  }
}
