"use client";

import dynamic from "next/dynamic";
import { InvitationData } from "@/data/invitations";

// Dynamic Imports with ssr: false are allowed in Client Components
const PremiumTheme = dynamic(() => import("./PremiumTheme"), { ssr: false });
const CinematicDarkTheme = dynamic(() => import("./CinematicDarkTheme"), { ssr: false });
const UltraLuxuryTheme = dynamic(() => import("./UltraLuxuryTheme"), { ssr: false });
const MajesticEternityTheme = dynamic(() => import("./MajesticEternityTheme"), { ssr: false });
const RenaissanceGardenTheme = dynamic(() => import("./RenaissanceGardenTheme"), { ssr: false });
const CelestialHarmonyTheme = dynamic(() => import("./CelestialHarmonyTheme"), { ssr: false });
const ModernBlueTheme = dynamic(() => import("./ModernBlueTheme"), { ssr: false });

interface ThemeRouterProps {
  data: InvitationData;
}

export default function ThemeRouter({ data }: ThemeRouterProps) {
  switch (data.theme) {
    case "cinematic":
    case "cinematic-dark":
      return <CinematicDarkTheme data={data} />;
    case "ultra-luxury":
      return <UltraLuxuryTheme data={data} />;
    case "majestic-eternity":
      return <MajesticEternityTheme data={data} />;
    case "renaissance-garden":
      return <RenaissanceGardenTheme data={data} />;
    case "celestial-harmony":
      return <CelestialHarmonyTheme data={data} />;
    case "modern-blue":
    case "sage":
      return <ModernBlueTheme data={data} />;
    case "premium":
    default:
      console.warn(`Unknown theme: ${data.theme}, falling back to premium.`);
      return <PremiumTheme data={data} />;
  }
}
