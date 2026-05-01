"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RESERVED_SLUGS } from "@/lib/constants";

export async function createInvitation(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const slug = formData.get("slug") as string;
  const theme = formData.get("theme") as string;

  const cleanSlug = slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (RESERVED_SLUGS.includes(cleanSlug)) {
    return redirect("/dashboard/create?error=slug_reserved");
  }

  // CHECK IF SLUG EXISTS
  const { data: existingSlug } = await supabase
    .from("invitations")
    .select("id")
    .eq("slug", cleanSlug)
    .single();

  if (existingSlug) {
    return redirect("/dashboard/create?error=slug_taken");
  }

  // ENFORCE DRAFT LIMIT ON SERVER SIDE
  const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
  const { count } = await supabase.from("invitations").select("*", { count: "exact", head: true }).eq("user_id", user.id);
  
  const credits = profile?.credits || 0;
  let maxDrafts = 2;
  if (credits >= 10) maxDrafts = 30;
  else if (credits >= 5) maxDrafts = 15;
  else if (credits >= 1) maxDrafts = 5;

  if ((count || 0) >= maxDrafts) {
    return redirect("/dashboard?error=limit_reached");
  }
  
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
  const eventsRaw = formData.get("events") as string;
  let loveStory = [];
  let gallery = [];
  let events = [];
  
  try {
    loveStory = JSON.parse(loveStoryRaw || "[]");
    gallery = JSON.parse(galleryRaw || "[]");
    events = JSON.parse(eventsRaw || "[]");
  } catch (e) {
    console.error("Error parsing JSON data:", e);
  }

  const quote = formData.get("quote") as string;
  const bankName = formData.get("bank_name") as string;
  const accountNumber = formData.get("account_number") as string;
  const accountName = formData.get("account_name") as string;
  const turutMengundang = formData.get("turut_mengundang") as string;
  const closingStatement = formData.get("closing_statement") as string;

  const selectedMusicUrl = formData.get("selected_music_url") as string;

  const getPhotoUrl = async (fieldName: string) => {
    const data = formData.get(fieldName);
    if (typeof data === "string" && data.startsWith("http")) return data;
    if (data instanceof File && data.size > 0) {
      const fileName = `${user.id}/${Date.now()}_${fieldName}_${data.name.replace(/\s+/g, "_")}`;
      const { data: uploadData, error } = await supabase.storage.from("invitations-media").upload(fileName, data);
      if (!error && uploadData) {
        return supabase.storage.from("invitations-media").getPublicUrl(uploadData.path).data.publicUrl;
      }
    }
    return ""; 
  };

  const bridePhotoUrl = await getPhotoUrl("bride_photo");
  const groomPhotoUrl = await getPhotoUrl("groom_photo");
  const couplePhotoUrl = await getPhotoUrl("couple_photo");
  const giftQrUrl = await getPhotoUrl("gift_qr_url");

  let musicUrl = selectedMusicUrl || "";
  const musicFile = formData.get("music_file") as File;
  if (musicFile && musicFile.size > 0) {
    const fileName = `${user.id}/${Date.now()}_music_${musicFile.name.replace(/\s+/g, "_")}`;
    const { data, error } = await supabase.storage.from("invitations-media").upload(fileName, musicFile);
    if (!error && data) {
      musicUrl = supabase.storage.from("invitations-media").getPublicUrl(data.path).data.publicUrl;
    }
  }

  const { data: newInvitation, error } = await supabase
    .from("invitations")
    .insert([
      {
        user_id: user.id,
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
        events: events,
        quote: quote,
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName,
        music_url: musicUrl,
        turut_mengundang: turutMengundang,
        closing_statement: closingStatement,
        gift_qr_url: giftQrUrl
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating invitation:", error);
    return redirect("/dashboard/create?error=db_error");
  }

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/dashboard");
  redirect(`/dashboard?success=created`);
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
      await supabase.from("invitations").update({ status: 'draft' }).eq("id", invitationId);
      return { success: false, message: "Gagal memotong kredit. Publikasi dibatalkan." };
    }
    
    return { success: true, message: "Undangan berhasil dipublikasikan! 🎉" };
  }
  return { success: false, message: "Gagal mempublikasikan undangan." };
}

export async function deductCredit(amount: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
  if (!profile || profile.credits < amount) {
    return { success: false, error: "Kredit tidak cukup." };
  }

  const newCredits = profile.credits - amount;
  const { error } = await supabase.from("profiles").update({ credits: newCredits }).eq("id", user.id);

  if (error) {
    return { success: false, error: "Gagal memproses kredit." };
  }

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/dashboard");
  return { success: true };
}
