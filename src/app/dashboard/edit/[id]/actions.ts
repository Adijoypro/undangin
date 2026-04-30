"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateInvitation(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Sesi berakhir, silakan login kembali." };
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
    const latitude = parseFloat(formData.get("latitude") as string || "0");
    const longitude = parseFloat(formData.get("longitude") as string || "0");
    
    const loveStoryRaw = formData.get("love_story") as string;
    const galleryRaw = formData.get("gallery") as string;
    let loveStory = [];
    let gallery = [];
    
    try {
      loveStory = JSON.parse(loveStoryRaw || "[]");
      gallery = JSON.parse(galleryRaw || "[]");
    } catch (e) {
      console.error("Error parsing JSON data:", e);
    }

    const quote = formData.get("quote") as string;
    const bankName = formData.get("bank_name") as string;
    const accountNumber = formData.get("account_number") as string;
    const accountName = formData.get("account_name") as string;
    const turutMengundang = formData.get("turut_mengundang") as string;
    const selectedMusicUrl = formData.get("selected_music_url") as string;

    // Foto-foto (diambil dari state string URL)
    const bridePhotoUrl = formData.get("bride_photo") as string;
    const groomPhotoUrl = formData.get("groom_photo") as string;
    const couplePhotoUrl = formData.get("couple_photo") as string;

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
      latitude: latitude,
      longitude: longitude,
      love_story: loveStory,
      gallery: gallery,
      quote: quote,
      bank_name: bankName,
      account_number: accountNumber,
      account_name: accountName,
      music_url: selectedMusicUrl,
      turut_mengundang: turutMengundang
    };

    console.log("=== UPDATING DB ===");
    console.log("Theme:", theme);
    console.log("Slug:", cleanSlug);

    const { error: updateError } = await supabase
      .from("invitations")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("DB Update Error:", updateError);
      return { success: false, error: `Gagal update ke database: ${updateError.message}` };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/${cleanSlug}`);
    revalidatePath(`/dashboard/edit/${id}`);
    
    return { success: true };
  } catch (err: any) {
    console.error("System Error:", err);
    return { success: false, error: `Terjadi kesalahan sistem: ${err.message}` };
  }
}

export async function publishInvitation(invitationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };

  const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
  if (!profile || profile.credits < 1) {
    return { success: false, message: "Kredit tidak cukup. Silakan Top Up terlebih dahulu." };
  }

  const { error: publishError } = await supabase.from("invitations").update({ status: 'published' }).eq("id", invitationId);
  if (!publishError) {
    const newCredits = profile.credits - 1;
    const { error: creditError } = await supabase.from("profiles").update({ credits: newCredits }).eq("id", user.id);
    
    if (creditError) {
      console.error("Gagal memotong kredit:", creditError);
      // Revert status if credit deduction fails to prevent abuse
      await supabase.from("invitations").update({ status: 'draft' }).eq("id", invitationId);
      return { success: false, message: "Gagal memotong kredit. Publikasi dibatalkan." };
    }
    
    return { success: true, message: "Undangan berhasil dipublikasikan! 🎉" };
  }
  return { success: false, message: "Gagal mempublikasikan undangan." };

}
