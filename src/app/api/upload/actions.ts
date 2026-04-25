"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadInstant(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Silakan login dulu bro." };
  }

  const file = formData.get("file") as File;
  if (!file) return { success: false, message: "File nggak ada." };

  try {
    const fileName = `${user.id}/${Date.now()}_temp_${file.name.replace(/\s+/g, "_")}`;
    const { data, error } = await supabase.storage
      .from("invitations-media")
      .upload(fileName, file);

    if (error) throw error;

    const publicUrl = supabase.storage
      .from("invitations-media")
      .getPublicUrl(data.path).data.publicUrl;

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error("Instant Upload Error:", error);
    return { success: false, message: error.message };
  }
}
