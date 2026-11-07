import type { Metadata } from "next";
import { HomeView } from "@/components/home-view";

export const metadata: Metadata = {
  title: {
    absolute: "PT Pelican Mitra Sejati: Rekayasa Maritim & Genset Batam",
  },
  description:
    "Solusi rekayasa kapal, rental genset 25-1250 kVA, kalibrasi MARPOL ODME/OWS 15 ppm, dan otomasi maritim terpercaya di Batam sejak 2014.",
  alternates: {
    canonical: "https://pelican-ms.com",
    languages: {
      "id": "https://pelican-ms.com",
      "en": "https://pelican-ms.com",
      "x-default": "https://pelican-ms.com",
    },
  },
  openGraph: {
    title: "PT Pelican Mitra Sejati: Rekayasa Maritim & Genset Batam",
    description:
      "Solusi rekayasa kapal, rental genset 25-1250 kVA, kalibrasi MARPOL ODME/OWS 15 ppm, dan otomasi maritim terpercaya di Batam sejak 2014.",
    url: "https://pelican-ms.com",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PT Pelican Mitra Sejati: Rekayasa Maritim & Genset Batam",
    description:
      "Solusi rekayasa kapal, rental genset 25-1250 kVA, kalibrasi MARPOL ODME/OWS 15 ppm, dan otomasi maritim terpercaya di Batam sejak 2014.",
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  return <HomeView />;
}
