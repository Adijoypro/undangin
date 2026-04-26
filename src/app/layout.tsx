import type { Metadata } from "next";
import { Cinzel, Great_Vibes, Montserrat, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const cinzel = Cinzel({ 
  subsets: ["latin"], 
  variable: '--font-serif',
  display: 'swap',
});

const greatVibes = Great_Vibes({ 
  subsets: ["latin"], 
  weight: "400", 
  variable: '--font-script',
  display: 'swap',
});

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "700"], 
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://undanginaja.vercel.app"),
  title: "Undangin - Digital Invitation Platform",
  description: "Premium and Elegant Wedding Invitations",
  icons: {
    icon: "/favicon.png",
  },
};

import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LuxuryThemeToggle } from "@/components/ui/LuxuryThemeToggle";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`scroll-smooth ${cinzel.variable} ${greatVibes.variable} ${montserrat.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LuxuryThemeToggle />
          <Toaster position="top-center" richColors />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
