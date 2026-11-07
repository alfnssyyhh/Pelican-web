import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Geist } from "next/font/google";
import "./globals.css";
import { PublicLayoutWrapper } from "@/components/public-layout-wrapper";
import { Locale } from "@/lib/i18n/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#dc2626",
};

export const metadata: Metadata = {
  title: {
    default: "PT Pelican Mitra Sejati: Rekayasa Maritim & Genset Batam",
    template: "%s | Pelican Batam",
  },
  description:
    "Solusi rekayasa kapal, rental genset 25-1250 kVA, kalibrasi MARPOL ODME/OWS 15 ppm, dan otomasi maritim terpercaya di Batam sejak 2014.",
  keywords: [
    "marine automation batam",
    "kalibrasi ODME batam",
    "kalibrasi OWS batam",
    "rental genset batam",
    "diesel engine service batam",
    "PT Pelican Mitra Sejati",
    "spare part cummins batam",
  ],
  authors: [{ name: "PT Pelican Mitra Sejati" }],
  creator: "PT Pelican Mitra Sejati",
  publisher: "PT Pelican Mitra Sejati",
  metadataBase: new URL("https://pelican-ms.com"),
  alternates: {
    canonical: "https://pelican-ms.com",
    languages: {
      "id": "https://pelican-ms.com",
      "en": "https://pelican-ms.com",
      "x-default": "https://pelican-ms.com",
    },
  },
  openGraph: {
    title: "PT Pelican Mitra Sejati | Rekayasa Teknik Maritim & Rental Genset Batam",
    description:
      "Solusi rekayasa teknik maritim, otomasi industri, kalibrasi instrumen, dan rental genset siap operasi di Batam.",
    url: "https://pelican-ms.com",
    siteName: "PT Pelican Mitra Sejati",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PT Pelican Mitra Sejati Batam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PT Pelican Mitra Sejati | Marine & Industrial Engineering Batam",
    description:
      "Pusat layanan rekayasa teknik maritim, otomasi kapal, kalibrasi ODME/OWS, dan rental genset 25-1250 kVA di Batam.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value as Locale | undefined;
  const headerStore = await headers();
  const acceptLang = headerStore.get("accept-language") || "";

  let initialLocale: Locale = "en";
  if (localeCookie === "id" || localeCookie === "en") {
    initialLocale = localeCookie;
  } else if (acceptLang.toLowerCase().includes("id")) {
    initialLocale = "id";
  }

  // Schema Markup JSON-LD for LocalBusiness & Corporation
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Corporation",
    name: "PT Pelican Mitra Sejati",
    alternateName: "Pelican Marine & Industrial Engineering",
    "@id": "https://pelican-ms.com/#corporation",
    url: "https://pelican-ms.com",
    logo: "https://pelican-ms.com/logo.png",
    image: "https://pelican-ms.com/og-image.png",
    knowsAbout: [
      "Marine Engineering",
      "Diesel Engine Overhaul",
      "Generator Rental Batam",
      "ODME Calibration",
      "OWS Calibration",
      "Vessel Automation",
      "MARPOL Compliance",
    ],
    sameAs: [
      "https://www.youtube.com/@Pelicanms",
      "https://www.tiktok.com/@pelicanms",
      "https://www.instagram.com/pelicanmitrasejati/",
      "https://www.linkedin.com/in/pelican-mitra-sejati-0b217b389/",
      "https://web.facebook.com/p/PT-Pelican-Mitra-Sejati-100077047002223/",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+62-778-7372079",
        contactType: "customer service",
        areaServed: "ID",
        availableLanguage: ["Indonesian", "English"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+62-877-8780-6333",
        contactType: "technical support",
        areaServed: "ID",
        availableLanguage: ["Indonesian", "English"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Ahmad Yani, Komplek Taman Niaga Blok M Nomor 5, Sukajadi",
      addressLocality: "Batam",
      addressRegion: "Kepulauan Riau",
      postalCode: "29432",
      addressCountry: "ID",
    },
  };

  return (
    <html
      lang={initialLocale}
      className={`${geistSans.variable} h-full antialiased scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900">
        <PublicLayoutWrapper initialLocale={initialLocale}>{children}</PublicLayoutWrapper>
      </body>
    </html>
  );
}
