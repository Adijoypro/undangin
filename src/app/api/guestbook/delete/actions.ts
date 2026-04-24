"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteGuestbookEntry(id: string, invitationSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "Silakan login." };

  // CRITICAL SECURITY FIX: Verify ownership before deleting
  // Check if the guestbook entry's invitation belongs to the current user
  const { data: entry, error: fetchError } = await supabase
    .from("guestbook")
    .select(`
      invitation_id,
      invitations!inner(user_id)
    `)
    .eq("id", id)
    .single();

  if (fetchError || !entry) {
    return { success: false, message: "Ucapan tidak ditemukan." };
  }

  // Cast entry for type safety with inner join
  const guestEntry = entry as any;
  if (guestEntry.invitations.user_id !== user.id) {
    return { success: false, message: "Anda tidak memiliki akses untuk menghapus ucapan ini." };
  }

  const { error: deleteError } = await supabase
    .from("guestbook")
    .delete()
    .eq("id", id);

  if (deleteError) return { success: false, message: deleteError.message };

  revalidatePath(`/${invitationSlug}`);
  return { success: true };
}
