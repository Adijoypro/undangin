import PremiumTheme from "@/components/themes/PremiumTheme";
import CinematicDarkTheme from "@/components/themes/CinematicDarkTheme";
import UltraLuxuryTheme from "@/components/themes/UltraLuxuryTheme";
import MajesticEternityTheme from "@/components/themes/MajesticEternityTheme";
import RenaissanceGardenTheme from "@/components/themes/RenaissanceGardenTheme";
import ThemeWrapper from "@/components/themes/ThemeWrapper";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("invitations")
    .select("bride_name, groom_name, couple_photo, quote")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!data) return { title: "Undangan Digital | Undangin" };

  const title = `The Wedding of ${data.bride_name} & ${data.groom_name}`;
  const description = data.quote || "Kami mengundang Anda untuk hadir dan memberikan doa restu di hari bahagia kami.";
  const image = data.couple_photo || "/og-image.png"; // Fallback image

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: dbData } = await supabase
    .from("invitations")
    .select("*, guestbook(*)")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!dbData) {
    notFound();
  }

  const isOwner = user?.id === dbData.user_id;

  // Fetch Guestbook entries
  const { data: guestbookData } = await supabase
    .from("guestbook")
    .select("*")
    .eq("invitation_id", dbData.id)
    .order("created_at", { ascending: false });

  // Map Supabase data to our component structure
  const mappedData = {
    id: dbData.id,
    slug: dbData.slug,
    theme: dbData.theme,
    bride: {
      name: dbData.bride_name,
      fullName: dbData.bride_fullname,
      parents: (dbData.bride_father && dbData.bride_mother) 
        ? `Putri dari Bapak ${dbData.bride_father} & Ibu ${dbData.bride_mother}` 
        : (dbData.bride_parents || "Bapak Budi & Ibu Siti"),
      photo: dbData.bride_photo || "https://images.unsplash.com/photo-1546804784-81647414ee00?q=80&w=800&auto=format&fit=crop",
    },
    groom: {
      name: dbData.groom_name,
      fullName: dbData.groom_fullname,
      parents: (dbData.groom_father && dbData.groom_mother) 
        ? `Putra dari Bapak ${dbData.groom_father} & Ibu ${dbData.groom_mother}` 
        : (dbData.groom_parents || "Bapak Joko & Ibu Sri"),
      photo: dbData.groom_photo || "https://images.unsplash.com/photo-1550005809-91ad75fb315f?q=80&w=800&auto=format&fit=crop",
    },
    bride_father: dbData.bride_father,
    bride_mother: dbData.bride_mother,
    groom_father: dbData.groom_father,
    groom_mother: dbData.groom_mother,
    couplePhoto: dbData.couple_photo,
    event: {
      date: dbData.event_date || "14 Februari 2027",
      dateFormatted: { day: "Minggu", date: "14", monthYear: "Februari 2027" }, 
      time: dbData.event_time || "08:00 - Selesai",
      locationName: dbData.event_location || "Gedung Serbaguna",
      locationAddress: dbData.event_address || "Jakarta",
      mapsLink: dbData.maps_link || "https://maps.google.com"
    },
    loveStory: dbData.love_story || [
      "Pertama kali bertemu di sebuah cafe kecil di sudut kota. Tidak ada yang spesial hari itu, namun takdir punya rencananya sendiri.",
      "Setelah bertahun-tahun saling mengenal, kami memutuskan untuk melangkah ke jenjang yang lebih serius."
    ],
    quote: dbData.quote || "Dan di antara tanda-tanda kebesaran-Nya...",
    gift: {
      bankName: dbData.bank_name || "BCA",
      accountNumber: dbData.account_number || "1234567890",
      accountName: dbData.account_name || (dbData.bride_name + " & " + dbData.groom_name)
    },
    musicUrl: dbData.music_url || "https://cdn.pixabay.com/download/audio/2022/05/16/audio_18dc903e1e.mp3?filename=wedding-piano-111166.mp3",
    guestbook: guestbookData || [],
    turut_mengundang: dbData.turut_mengundang || ""
  };

  const renderTheme = () => {
    switch (mappedData.theme) {
      case "cinematic":
      case "cinematic-dark":
        return <CinematicDarkTheme data={mappedData} />;
      case "ultra-luxury":
        return <UltraLuxuryTheme data={mappedData} />;
      case "majestic-eternity":
        return <MajesticEternityTheme data={mappedData} />;
      case "renaissance-garden":
        return <RenaissanceGardenTheme data={mappedData} />;
      case "premium":
      default:
        return <PremiumTheme data={mappedData} />;
    }
  };

  return (
    <ThemeWrapper data={mappedData} isOwner={isOwner}>
      {renderTheme()}
    </ThemeWrapper>
  );
}
