import PremiumTheme from "@/components/themes/PremiumTheme";
import CinematicDarkTheme from "@/components/themes/CinematicDarkTheme";
import UltraLuxuryTheme from "@/components/themes/UltraLuxuryTheme";
import MajesticEternityTheme from "@/components/themes/MajesticEternityTheme";
import RenaissanceGardenTheme from "@/components/themes/RenaissanceGardenTheme";
import { notFound } from "next/navigation";
import { dummyData } from "@/data/invitations";

export default async function DemoPage({ params }: { params: Promise<{ theme: string }> }) {
  const resolvedParams = await params;
  
  // Clone dummy data and assign a generic ID/slug for the demo
  const data: any = {
    ...dummyData,
    id: `demo-${resolvedParams.theme}`,
    slug: `demo-${resolvedParams.theme}`,
    theme: resolvedParams.theme
  };

  switch (resolvedParams.theme) {
    case "premium":
      return <PremiumTheme data={data} />;
    case "cinematic-dark":
      return <CinematicDarkTheme data={data} />;
    case "ultra-luxury":
      return <UltraLuxuryTheme data={data} />;
    case "majestic-eternity":
      return <MajesticEternityTheme data={data} />;
    case "renaissance-garden":
      return <RenaissanceGardenTheme data={data} />;
    default:
      notFound();
  }
}
