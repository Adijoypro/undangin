/**
 * ══════════════════════════════════════════════
 *  UNDANGIN — Cover Library (Envelope Gallery)
 * ══════════════════════════════════════════════
 * 
 * Koleksi cover pembuka undangan digital.
 * Tinggal import & pasangkan ke tema yang cocok.
 * 
 * USAGE:
 *   import { EnvelopeCover, GoldenGateCover, TheaterCurtainCover } from "@/components/covers";
 * 
 * PROPS (Semua cover punya interface yang sama):
 *   - bride: string
 *   - groom: string  
 *   - date: string
 *   - onOpen: () => void
 *   - guestName?: string
 * 
 * COVER CATALOG:
 *   1. EnvelopeCover       — Amplop hitam klasik + segel lilin merah (Celestial/Premium)
 *   2. GoldenGateCover     — Gerbang istana emas 3D (Majestic/Ultra Luxury)
 *   3. TheaterCurtainCover — Tirai beludru teater + spotlight (Cinematic Dark)
 */

export { default as EnvelopeCover } from "./EnvelopeCover";
export { default as GoldenGateCover } from "./GoldenGateCover";
export { default as TheaterCurtainCover } from "./TheaterCurtainCover";

