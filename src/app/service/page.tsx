import type { Metadata } from "next";
import { ServiceView } from "@/components/service-view";

export const metadata: Metadata = {
  title: {
    absolute: "Rekayasa Maritim, ODME & Otomasi Batam | Pelican",
  },
  description:
    "Layanan rekayasa kapal di Batam: kalibrasi MARPOL ODME dan OWS 15 ppm, overhaul mesin diesel, otomasi switchboard, dan penyejajaran poros presisi.",
  alternates: {
    canonical: "https://pelican-ms.com/service",
    languages: {
      "id": "https://pelican-ms.com/service",
      "en": "https://pelican-ms.com/service",
      "x-default": "https://pelican-ms.com/service",
    },
  },
  openGraph: {
    title: "Rekayasa Maritim, ODME & Otomasi Batam | Pelican",
    description:
      "Layanan rekayasa kapal di Batam: kalibrasi MARPOL ODME dan OWS 15 ppm, overhaul mesin diesel, otomasi switchboard, dan penyejajaran poros presisi.",
    url: "https://pelican-ms.com/service",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rekayasa Maritim, ODME & Otomasi Batam | Pelican",
    description:
      "Layanan rekayasa kapal di Batam: kalibrasi MARPOL ODME dan OWS 15 ppm, overhaul mesin diesel, otomasi switchboard, dan penyejajaran poros presisi.",
    images: ["/og-image.png"],
  },
};

export default function ServicePage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Marine and Industrial Engineering Services",
    provider: {
      "@type": "Corporation",
      name: "PT Pelican Mitra Sejati",
      url: "https://pelican-ms.com",
      logo: "https://pelican-ms.com/logo.png",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Ahmad Yani, Komplek Taman Niaga Blok M Nomor 5, Sukajadi",
        addressLocality: "Batam",
        addressRegion: "Kepulauan Riau",
        postalCode: "29432",
        addressCountry: "ID",
      },
    },
    areaServed: {
      "@type": "City",
      name: "Batam",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Marine Engineering Capabilities",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Kalibrasi Instrumen MARPOL ODME & OWS 15 ppm",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Overhaul & Rekondisi Mesin Diesel Kapal",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Diagnostik & Perbaikan Otomasi Kapal (Switchboard & Steering)",
          },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <ServiceView />
    </>
  );
}
