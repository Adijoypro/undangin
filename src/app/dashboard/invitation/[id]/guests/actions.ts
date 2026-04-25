"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteGuestbookEntry(formData: FormData) {
  const entryId = formData.get("entryId") as string;
  const invitationId = formData.get("invitationId") as string;

  if (!entryId) return;

  const supabase = await createClient();
  
  // Verify ownership before deleting
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: entry } = await supabase
    .from("guestbook")
    .select("invitation_id, invitations(user_id)")
    .eq("id", entryId)
    .single();

  // @ts-ignore
  if (!entry || entry.invitations.user_id !== user.id) {
    console.error("Unauthorized deletion attempt");
    return;
  }

  const { error } = await supabase
    .from("guestbook")
    .delete()
    .eq("id", entryId);

  if (error) {
    console.error("Error deleting guestbook entry:", error);
    return;
  }

  revalidatePath(`/dashboard/invitation/${invitationId}/guests`);
}
