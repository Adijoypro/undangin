import type { Metadata } from "next";
import { Cinzel, Great_Vibes, Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({ subsets: ["latin"], variable: '--font-serif' });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: '--font-script' });
const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-sans' });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: '--font-display' });

export const metadata: Metadata = {
  title: "Undangin - Digital Invitation Platform",
  description: "Premium and Elegant Wedding Invitations",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`scroll-smooth ${cinzel.variable} ${greatVibes.variable} ${montserrat.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased bg-wedding-base text-wedding-text">
        {children}
      </body>
    </html>
  );
}
