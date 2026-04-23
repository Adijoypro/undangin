"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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

  const bridePhotoFile = formData.get("bride_photo") as File;
  const groomPhotoFile = formData.get("groom_photo") as File;
  const couplePhotoFile = formData.get("couple_photo") as File;
  const musicFile = formData.get("music_file") as File;

  // Fetch current data to preserve existing photo URLs if no new files are uploaded
  const { data: currentData } = await supabase
    .from("invitations")
    .select("bride_photo, groom_photo, couple_photo, music_url")
    .eq("id", id)
    .single();

  let bridePhotoUrl = currentData?.bride_photo;
  let groomPhotoUrl = currentData?.groom_photo;
  let couplePhotoUrl = currentData?.couple_photo;
  let musicUrl = currentData?.music_url;

  try {
    if (bridePhotoFile && bridePhotoFile.size > 0) {
      const fileName = `${Date.now()}_bride_${bridePhotoFile.name.replace(/\s+/g, "_")}`;
      const { data, error } = await supabase.storage.from("invitations-media").upload(fileName, bridePhotoFile);
      if (error) {
        console.error("Bride Photo Upload Error:", error.message);
      } else if (data) {
        bridePhotoUrl = supabase.storage.from("invitations-media").getPublicUrl(data.path).data.publicUrl;
      }
    }

    if (groomPhotoFile && groomPhotoFile.size > 0) {
      const fileName = `${Date.now()}_groom_${groomPhotoFile.name.replace(/\s+/g, "_")}`;
      const { data, error } = await supabase.storage.from("invitations-media").upload(fileName, groomPhotoFile);
      if (error) {
        console.error("Groom Photo Upload Error:", error.message);
      } else if (data) {
        groomPhotoUrl = supabase.storage.from("invitations-media").getPublicUrl(data.path).data.publicUrl;
      }
    }

    if (couplePhotoFile && couplePhotoFile.size > 0) {
      const fileName = `${Date.now()}_couple_${couplePhotoFile.name.replace(/\s+/g, "_")}`;
      const { data, error } = await supabase.storage.from("invitations-media").upload(fileName, couplePhotoFile);
      if (error) {
        console.error("Couple Photo Upload Error:", error.message);
      } else if (data) {
        couplePhotoUrl = supabase.storage.from("invitations-media").getPublicUrl(data.path).data.publicUrl;
      }
    }

    if (musicFile && musicFile.size > 0) {
      const fileName = `${Date.now()}_music_${musicFile.name.replace(/\s+/g, "_")}`;
      const { data, error } = await supabase.storage.from("invitations-media").upload(fileName, musicFile);
      if (error) {
        console.error("Music Upload Error:", error.message);
      } else if (data) {
        musicUrl = supabase.storage.from("invitations-media").getPublicUrl(data.path).data.publicUrl;
      }
    }
  } catch (err: any) {
    console.error("Critical Storage Error:", err.message);
  }

  const updateData: any = {
    slug: slug.toLowerCase().replace(/\s+/g, '-'),
    theme: theme,
    bride_name: brideName,
    bride_fullname: brideFullName,
    bride_father: brideFather,
    bride_mother: brideMother,
    groom_name: groomName,
    groom_fullname: groomFullName,
    groom_father: groomFather,
    groom_mother: groomMother,
    event_date: eventDate,
    event_time: eventTime,
    event_location: eventLocation,
    event_address: eventAddress,
    maps_link: mapsLink,
    quote: quote,
    bank_name: bankName,
    account_number: accountNumber,
    account_name: accountName,
    turut_mengundang: turutMengundang
  };

  if (bridePhotoUrl) updateData.bride_photo = bridePhotoUrl;
  if (groomPhotoUrl) updateData.groom_photo = groomPhotoUrl;
  if (couplePhotoUrl) updateData.couple_photo = couplePhotoUrl;
  if (musicUrl) updateData.music_url = musicUrl;

  const { error } = await supabase
    .from("invitations")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Database Update Error:", error.message);
    // You might want to handle unique constraint violation for slug here
  }

  revalidatePath("/dashboard");
  revalidatePath(`/${slug}`);
  redirect("/dashboard");
}

export async function publishInvitation(invitationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "Silakan login terlebih dahulu." };

  // 1. Get User Profile (Credits)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) return { success: false, message: "Profil tidak ditemukan." };
  if (profile.credits < 1) return { success: false, message: "Kredit Anda tidak cukup. Silakan top up." };

  // 2. Deduct Credit (ONLY IF NOT ALREADY PUBLISHED AND NOT UNLIMITED)
  // Get current invitation status first
  const { data: currentInv } = await supabase
    .from("invitations")
    .select("status")
    .eq("id", invitationId)
    .single();

  if (currentInv?.status === 'published') {
    // Already published, just return success
    return { success: true, message: "Undangan sudah aktif!" };
  }

  // Check for Unlimited Bypass (If credits > 1000, don't deduct)
  if (profile.credits < 1000) {
    const { error: deductError } = await supabase
      .from("profiles")
      .update({ credits: profile.credits - 1 })
      .eq("id", user.id);

    if (deductError) return { success: false, message: "Gagal memotong kredit." };
  }

  // 3. Update Invitation Status
  const { error: publishError } = await supabase
    .from("invitations")
    .update({ status: 'published' })
    .eq("id", invitationId)
    .eq("user_id", user.id);

  if (publishError) {
    // Rollback credit if possible (optional but good)
    await supabase.from("profiles").update({ credits: profile.credits }).eq("id", user.id);
    return { success: false, message: "Gagal mempublikasikan undangan." };
  }

  return { success: true, message: "Undangan berhasil dipublikasikan!" };
}
