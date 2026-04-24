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

  // --- VALIDASI SLUG (SECURITY FIX: Blacklist) ---
  const cleanSlug = slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (RESERVED_SLUGS.includes(cleanSlug)) {
    return redirect("/dashboard/create?error=slug_reserved");
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

  const quote = formData.get("quote") as string;
  const bankName = formData.get("bank_name") as string;
  const accountNumber = formData.get("account_number") as string;
  const accountName = formData.get("account_name") as string;
  const turutMengundang = formData.get("turut_mengundang") as string;

  const bridePhotoFile = formData.get("bride_photo") as File;
  const groomPhotoFile = formData.get("groom_photo") as File;
  const couplePhotoFile = formData.get("couple_photo") as File;
  const musicFile = formData.get("music_file") as File;
  const selectedMusicUrl = formData.get("selected_music_url") as string;

  // Upload Photos to Supabase Storage
  let bridePhotoUrl = "";
  let groomPhotoUrl = "";
  let couplePhotoUrl = "";
  let musicUrl = "";

  try {
    if (bridePhotoFile && bridePhotoFile.size > 0) {
      const fileName = `${Date.now()}_bride_${bridePhotoFile.name.replace(/\s+/g, "_")}`;
      const { data, error } = await supabase.storage.from("invitations-media").upload(fileName, bridePhotoFile);
      if (!error && data) {
        bridePhotoUrl = supabase.storage.from("invitations-media").getPublicUrl(data.path).data.publicUrl;
      }
    }

    if (groomPhotoFile && groomPhotoFile.size > 0) {
      const fileName = `${Date.now()}_groom_${groomPhotoFile.name.replace(/\s+/g, "_")}`;
      const { data, error } = await supabase.storage.from("invitations-media").upload(fileName, groomPhotoFile);
      if (!error && data) {
        groomPhotoUrl = supabase.storage.from("invitations-media").getPublicUrl(data.path).data.publicUrl;
      }
    }

    if (couplePhotoFile && couplePhotoFile.size > 0) {
      const fileName = `${Date.now()}_couple_${couplePhotoFile.name.replace(/\s+/g, "_")}`;
      const { data, error } = await supabase.storage.from("invitations-media").upload(fileName, couplePhotoFile);
      if (!error && data) {
        couplePhotoUrl = supabase.storage.from("invitations-media").getPublicUrl(data.path).data.publicUrl;
      }
    }

    if (musicFile && musicFile.size > 0) {
      const fileName = `${Date.now()}_music_${musicFile.name.replace(/\s+/g, "_")}`;
      const { data, error } = await supabase.storage.from("invitations-media").upload(fileName, musicFile);
      if (!error && data) {
        musicUrl = supabase.storage.from("invitations-media").getPublicUrl(data.path).data.publicUrl;
      }
    } else if (selectedMusicUrl) {
      musicUrl = selectedMusicUrl;
    }
  } catch (err) {
    console.error("Critical Storage Error:", err);
  }

  const { error } = await supabase
    .from("invitations")
    .insert([
      {
        user_id: user.id,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        theme: theme,
        bride_name: brideName,
        bride_fullname: brideFullName,
        bride_father: brideFather,
        bride_mother: brideMother,
        bride_photo: bridePhotoUrl || "https://images.unsplash.com/photo-1546804784-81647414ee00?q=80&w=800&auto=format&fit=crop",
        groom_name: groomName,
        groom_fullname: groomFullName,
        groom_father: groomFather,
        groom_mother: groomMother,
        groom_photo: groomPhotoUrl || "https://images.unsplash.com/photo-1550005809-91ad75fb315f?q=80&w=800&auto=format&fit=crop",
        couple_photo: couplePhotoUrl || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
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
      }
    ]);

  if (error) {
    console.error("Database Insert Error:", error.message);
  }

  redirect("/dashboard");
}
