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
  title: "Undangin - Platform Undangan Digital Pernikahan Premium & Eksklusif",
  description: "Bikin undangan digital pernikahan mewah dengan animasi sinematik, manajemen RSVP cerdas, dan desain eksklusif. Platform SaaS undangan online terbaik untuk hari bahagia Anda.",
  keywords: ["undangan digital", "undangan pernikahan online", "undangan web mewah", "saas undangan", "rsvp online", "undangan digital premium", "undangan pernikahan digital"],
  authors: [{ name: "Undangin Team" }],
  creator: "Undangin",
  publisher: "Undangin",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://undanginaja.vercel.app",
    title: "Undangin - Mahakarya Undangan Digital Pernikahan",
    description: "Miliki undangan pernikahan mewah dengan desain sinematik dan fitur manajemen tamu cerdas. Gratis coba sekarang!",
    siteName: "Undangin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Undangin Premium Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Undangin - Mahakarya Undangan Digital Pernikahan",
    description: "Miliki undangan pernikahan mewah dengan desain sinematik dan fitur manajemen tamu cerdas.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Undangin",
  "operatingSystem": "Web",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "89000",
    "priceCurrency": "IDR"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "ratingCount": "1250"
  }
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
