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
  const honeypot = formData.get("website") as string; // Honeypot field

  // 1. Honeypot check (Bots often fill all fields)
  if (honeypot) {
    return { error: "Bot detected" };
  }

  if (!invitationId || !name || !message) {
    return { error: "Data tidak lengkap" };
  }

  // 2. Simple XSS protection: More robust cleaning
  const cleanName = name.replace(/<[^>]*>?/gm, '').substring(0, 50);
  const cleanMessage = message.replace(/<[^>]*>?/gm, '').substring(0, 500);

  // 3. Prevent excessive message length
  if (message.length > 1000) {
    return { error: "Pesan terlalu panjang (Maks 1000 karakter)" };
  }

  const { error } = await supabase
    .from("guestbook")
    .insert([
      {
        invitation_id: invitationId,
        name: cleanName,
        attendance,
        message: cleanMessage
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
