import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactView } from "@/components/contact-view";

export const metadata: Metadata = {
  title: {
    absolute: "Kontak Workshop Batam & Permintaan RFQ | Pelican",
  },
  description:
    "Kontak resmi workshop PT Pelican Mitra Sejati di Sukajadi Batam. Layanan darurat maritim 24/7 dan formulir permintaan penawaran harga (RFQ).",
  alternates: {
    canonical: "https://pelican-ms.com/contact",
    languages: {
      "id": "https://pelican-ms.com/contact",
      "en": "https://pelican-ms.com/contact",
      "x-default": "https://pelican-ms.com/contact",
    },
  },
  openGraph: {
    title: "Kontak Workshop Batam & Permintaan RFQ | Pelican",
    description:
      "Kontak resmi workshop PT Pelican Mitra Sejati di Sukajadi Batam. Layanan darurat maritim 24/7 dan formulir permintaan penawaran harga (RFQ).",
    url: "https://pelican-ms.com/contact",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kontak Workshop Batam & Permintaan RFQ | Pelican",
    description:
      "Kontak resmi workshop PT Pelican Mitra Sejati di Sukajadi Batam. Layanan darurat maritim 24/7 dan formulir permintaan penawaran harga (RFQ).",
    images: ["/og-image.png"],
  },
};

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ContactView />
    </Suspense>
  );
}
