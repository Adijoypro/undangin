"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { RESERVED_SLUGS } from "@/lib/constants";

export async function updateInvitation(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const id = formData.get("id") as string;
  const slug = formData.get("slug") as string;
  const theme = formData.get("theme") as string;
  
  const brideName = formData.get("bride_name") as string;
  const brideFullName = formData.get("bride_fullname") as string;
  const brideFather = formData.get("bride_father") as string;
  const brideMother = formData.get("bride_mother") as string;
  
  const groomName = formData.get("groom_name") as string;
  const groomFullName = formData.get("groom_fullname") as string;
  const groomFather = formData.get("groom_father") as string;
  const groomMother = formData.get("groom_mother") as string;

  const eventDate = formData.get("event_date") as string;
  const eventTime = formData.get("event_time") as string;
  const eventLocation = formData.get("event_location") as string;
  const eventAddress = formData.get("event_address") as string;
  const mapsLink = formData.get("maps_link") as string;

  const quote = formData.get("quote") as string;
  const bankName = formData.get("bank_name") as string;
  const accountNumber = formData.get("account_number") as string;
  const accountName = formData.get("account_name") as string;
  const turutMengundang = formData.get("turut_mengundang") as string;

  const selectedMusicUrl = formData.get("selected_music_url") as string;

  const { data: currentData } = await supabase.from("invitations").select("*").eq("id", id).single();

  const getPhotoUrl = async (fieldName: string, currentUrl: string) => {
    const data = formData.get(fieldName);
    if (typeof data === "string" && data.startsWith("http")) return data;
    if (data instanceof File && data.size > 0) {
      const fileName = `${user.id}/${Date.now()}_edit_${fieldName}_${data.name.replace(/\s+/g, "_")}`;
      const { data: uploadData, error } = await supabase.storage.from("invitations-media").upload(fileName, data);
      if (!error && uploadData) {
        return supabase.storage.from("invitations-media").getPublicUrl(uploadData.path).data.publicUrl;
      }
    }
    return currentUrl || "";
  };

  const bridePhotoUrl = await getPhotoUrl("bride_photo", currentData?.bride_photo);
  const groomPhotoUrl = await getPhotoUrl("groom_photo", currentData?.groom_photo);
  const couplePhotoUrl = await getPhotoUrl("couple_photo", currentData?.couple_photo);

  let musicUrl = selectedMusicUrl || currentData?.music_url;
  const musicFile = formData.get("music_file") as File;
  if (musicFile && musicFile.size > 0) {
    const fileName = `${user.id}/${Date.now()}_music_edit_${musicFile.name.replace(/\s+/g, "_")}`;
    const { data, error } = await supabase.storage.from("invitations-media").upload(fileName, musicFile);
    if (!error && data) {
      musicUrl = supabase.storage.from("invitations-media").getPublicUrl(data.path).data.publicUrl;
    }
  }

  const cleanSlug = slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const updateData = {
    slug: cleanSlug,
    theme: theme,
    bride_name: brideName,
    bride_fullname: brideFullName,
    bride_father: brideFather,
    bride_mother: brideMother,
    bride_photo: bridePhotoUrl,
    groom_name: groomName,
    groom_fullname: groomFullName,
    groom_father: groomFather,
    groom_mother: groomMother,
    groom_photo: groomPhotoUrl,
    couple_photo: couplePhotoUrl,
    event_date: eventDate,
    event_time: eventTime,
    event_location: eventLocation,
    event_address: eventAddress,
    maps_link: mapsLink,
    quote: quote,
    bank_name: bankName,
    account_number: accountNumber,
    account_name: accountName,
    music_url: musicUrl,
    turut_mengundang: turutMengundang
  };

  await supabase.from("invitations").update(updateData).eq("id", id).eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath(`/${cleanSlug}`);
  revalidatePath(`/dashboard/edit/${id}`);
  redirect(`/dashboard/edit/${id}`);
}

export async function publishInvitation(invitationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };

  const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
  if (!profile || profile.credits < 1) return { success: false };

  const { error: publishError } = await supabase.from("invitations").update({ status: 'published' }).eq("id", invitationId);
  if (!publishError) {
    await supabase.rpc('deduct_invitation_credit', { user_id_param: user.id });
    return { success: true, message: "Undangan berhasil dipublikasikan! 🎉" };
  }
  return { success: false, message: "Gagal mempublikasikan undangan." };
}
