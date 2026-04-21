"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
  const groomName = formData.get("groom_name") as string;
  const groomFullName = formData.get("groom_fullname") as string;
  const eventDate = formData.get("event_date") as string;
  const eventTime = formData.get("event_time") as string;
  const eventLocation = formData.get("event_location") as string;
  const eventAddress = formData.get("event_address") as string;
  const mapsLink = formData.get("maps_link") as string;
  const quote = formData.get("quote") as string;
  const bankName = formData.get("bank_name") as string;
  const accountNumber = formData.get("account_number") as string;
  const accountName = formData.get("account_name") as string;

  const bridePhotoFile = formData.get("bride_photo") as File;
  const groomPhotoFile = formData.get("groom_photo") as File;
  const musicFile = formData.get("music_file") as File;

  // Prepare update payload
  const payload: any = {
    slug: slug.toLowerCase().replace(/\s+/g, '-'),
    theme: theme,
    bride_name: brideName,
    bride_fullname: brideFullName,
    groom_name: groomName,
    groom_fullname: groomFullName,
    event_date: eventDate,
    event_time: eventTime,
    event_location: eventLocation,
    event_address: eventAddress,
    maps_link: mapsLink,
    quote: quote,
    bank_name: bankName,
    account_number: accountNumber,
    account_name: accountName
  };

  // Upload new photos/music if provided
  if (bridePhotoFile && bridePhotoFile.size > 0) {
    const fileName = `${Date.now()}_bride_${bridePhotoFile.name.replace(/\s+/g, "_")}`;
    const { data, error } = await supabase.storage.from("invitations-media").upload(fileName, bridePhotoFile);
    if (!error && data) {
      payload.bride_photo = supabase.storage.from("invitations-media").getPublicUrl(data.path).data.publicUrl;
    }
  }

  if (groomPhotoFile && groomPhotoFile.size > 0) {
    const fileName = `${Date.now()}_groom_${groomPhotoFile.name.replace(/\s+/g, "_")}`;
    const { data, error } = await supabase.storage.from("invitations-media").upload(fileName, groomPhotoFile);
    if (!error && data) {
      payload.groom_photo = supabase.storage.from("invitations-media").getPublicUrl(data.path).data.publicUrl;
    }
  }

  if (musicFile && musicFile.size > 0) {
    const fileName = `${Date.now()}_music_${musicFile.name.replace(/\s+/g, "_")}`;
    const { data, error } = await supabase.storage.from("invitations-media").upload(fileName, musicFile);
    if (!error && data) {
      payload.music_url = supabase.storage.from("invitations-media").getPublicUrl(data.path).data.publicUrl;
    }
  }

  const { error } = await supabase
    .from("invitations")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating invitation:", error);
    // You could redirect to an error page or return an error state
  }

  redirect("/dashboard");
}
