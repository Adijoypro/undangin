"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitRSVP(formData: FormData) {
  const supabase = await createClient();
  
  const invitationId = formData.get("invitation_id") as string;
  const name = formData.get("name") as string;
  const attendance = formData.get("attendance") as string;
  const message = formData.get("message") as string;
  const slug = formData.get("slug") as string;

  if (!invitationId || !name || !message) {
    return { error: "Data tidak lengkap" };
  }

  const { error } = await supabase
    .from("guestbook")
    .insert([
      {
        invitation_id: invitationId,
        name,
        attendance,
        message
      }
    ]);

  if (error) {
    console.error("Error submitting RSVP:", error);
    return { error: "Gagal mengirim pesan" };
  }

  // Refresh the page data
  revalidatePath(`/${slug}`);
  return { success: true };
}
