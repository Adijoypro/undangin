import { formatWeddingDate } from "@/lib/formatters";
import PremiumTheme from "@/components/themes/PremiumTheme";
import CinematicDarkTheme from "@/components/themes/CinematicDarkTheme";
import UltraLuxuryTheme from "@/components/themes/UltraLuxuryTheme";
import MajesticEternityTheme from "@/components/themes/MajesticEternityTheme";
import RenaissanceGardenTheme from "@/components/themes/RenaissanceGardenTheme";
import CelestialHarmonyTheme from "@/components/themes/CelestialHarmonyTheme";
import ThemeWrapper from "@/components/themes/ThemeWrapper";
import DraftMarketingPage from "@/components/themes/DraftMarketingPage";
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
  const origin = "https://undanginaja.vercel.app";
  const image = data.couple_photo || `${origin}/og-image.png`; 

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${origin}/${resolvedParams.slug}`,
      siteName: "Undangin",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
      locale: "id_ID",
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

export default async function InvitationPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>, 
  searchParams: Promise<{ to?: string }> 
}) {
  const resolvedParams = await params;
  const { to: guestName } = await searchParams;
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
  const isGuest = !!guestName;

  // Security: Only owner can see non-published invitations,
  // OR guests who have a special link (with 'to' parameter)
  if (dbData.status !== 'published' && !isOwner && !isGuest) {
    return <DraftMarketingPage />;
  }

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
      photo: dbData.bride_photo || "/assets/branding/final/ai_prewedding_comparison.webp",
    },
    groom: {
      name: dbData.groom_name,
      fullName: dbData.groom_fullname,
      parents: (dbData.groom_father && dbData.groom_mother) 
        ? `Putra dari Bapak ${dbData.groom_father} & Ibu ${dbData.groom_mother}` 
        : (dbData.groom_parents || "Bapak Joko & Ibu Sri"),
      photo: dbData.groom_photo || "/assets/branding/final/ai_prewedding_comparison.webp",
    },
    bride_father: dbData.bride_father,
    bride_mother: dbData.bride_mother,
    groom_father: dbData.groom_father,
    groom_mother: dbData.groom_mother,
    couplePhoto: dbData.couple_photo,
    event: {
      date: dbData.event_date || "14 Februari 2027",
      dateFormatted: formatWeddingDate(dbData.event_date),
      time: dbData.event_time || "08:00 - Selesai",
      locationName: dbData.event_location || "Gedung Serbaguna",
      locationAddress: dbData.event_address || "Jakarta",
      mapsLink: dbData.maps_link || "https://maps.google.com",
      latitude: dbData.latitude ?? -6.2088,
      longitude: dbData.longitude ?? 106.8456
    },
    events: typeof dbData.events === 'string' 
      ? JSON.parse(dbData.events) 
      : (dbData.events || []),
    loveStory: dbData.love_story || [],
    quote: dbData.quote || "Dan di antara tanda-tanda kebesaran-Nya...",
    gift: {
      bankName: dbData.bank_name || "BCA",
      accountNumber: dbData.account_number || "1234567890",
      accountName: dbData.account_name || (dbData.bride_name + " & " + dbData.groom_name),
      qrUrl: dbData.gift_qr_url
    },
    musicUrl: dbData.music_url || "https://cdn.pixabay.com/download/audio/2022/05/16/audio_18dc903e1e.mp3?filename=wedding-piano-111166.mp3",
    guestbook: guestbookData || [],
    gallery: dbData.gallery || [],
    turut_mengundang: dbData.turut_mengundang || "",
    closing_statement: dbData.closing_statement,
    guestName: guestName || ""
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
      case "celestial-harmony":
        return <CelestialHarmonyTheme data={mappedData} />;
      case "premium":
      default:
        console.warn(`Unknown theme: ${mappedData.theme}, falling back to premium.`);
        return <PremiumTheme data={mappedData} />;
    }
  };

  return (
    <ThemeWrapper data={mappedData} isOwner={isOwner}>
      {renderTheme()}
    </ThemeWrapper>
  );
}
