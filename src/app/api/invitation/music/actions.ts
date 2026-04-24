"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateInvitationMusic(id: string, slug: string, musicUrl: string, musicFile?: File) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  let finalMusicUrl = musicUrl;

  try {
    if (musicFile && musicFile.size > 0) {
      const fileName = `${Date.now()}_music_${musicFile.name.replace(/\s+/g, "_")}`;
      const { data, error } = await supabase.storage.from("invitations-media").upload(fileName, musicFile);
      if (error) {
        return { success: false, message: "Upload failed: " + error.message };
      }
      if (data) {
        finalMusicUrl = supabase.storage.from("invitations-media").getPublicUrl(data.path).data.publicUrl;
      }
    }

    const { error } = await supabase
      .from("invitations")
      .update({ music_url: finalMusicUrl })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, message: "Database error: " + error.message };
    }

    revalidatePath(`/${slug}`);
    return { success: true, musicUrl: finalMusicUrl };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
