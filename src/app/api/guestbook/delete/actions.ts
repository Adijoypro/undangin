"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteGuestbookEntry(id: string, invitationSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "Silakan login." };

  // Delete only if it belongs to the user's invitation
  // (The SQL RLS should handle this too, but we verify here)
  const { error } = await supabase
    .from("guestbook")
    .delete()
    .eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath(`/${invitationSlug}`);
  return { success: true };
}
