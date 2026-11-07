import type { Metadata } from "next";
import { RentView } from "@/components/rent-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Rental Genset Batam 25-1250 kVA Silent | Pelican",
  },
  description:
    "Rental genset diesel industri dan maritim 25-1250 kVA di Batam. Unit silent dan kontainer siap uji load bank dan mobilisasi cepat ke galangan kapal.",
  alternates: {
    canonical: "https://pelican-ms.com/rent",
    languages: {
      "id": "https://pelican-ms.com/rent",
      "en": "https://pelican-ms.com/rent",
      "x-default": "https://pelican-ms.com/rent",
    },
  },
  openGraph: {
    title: "Rental Genset Batam 25-1250 kVA Silent | Pelican",
    description:
      "Rental genset diesel industri dan maritim 25-1250 kVA di Batam. Unit silent dan kontainer siap uji load bank dan mobilisasi cepat ke galangan kapal.",
    url: "https://pelican-ms.com/rent",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rental Genset Batam 25-1250 kVA Silent | Pelican",
    description:
      "Rental genset diesel industri dan maritim 25-1250 kVA di Batam. Unit silent dan kontainer siap uji load bank dan mobilisasi cepat ke galangan kapal.",
    images: ["/og-image.png"],
  },
};

export default function RentPage() {
  const rentServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Industrial and Marine Generator Rental Service",
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
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Berapa kapasitas genset rental yang tersedia di Batam?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PT Pelican Mitra Sejati menyediakan armada rental genset diesel dengan kapasitas mulai dari 25 kVA hingga 1250 kVA dalam tipe silent kanopi dan tipe kontainer siap sinkronisasi daya besar.",
        },
      },
      {
        "@type": "Question",
        name: "Apakah unit genset rental sudah teruji load bank?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Seluruh unit genset diuji dengan alat resistive load bank sebelum dimobilisasi ke galangan kapal atau lokasi proyek untuk menjamin kestabilan frekuensi dan output daya saat beroperasi di bawah beban penuh.",
        },
      },
      {
        "@type": "Question",
        name: "Berapa lama estimasi waktu mobilisasi genset ke galangan kapal di Batam?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Untuk kebutuhan darurat galangan kapal atau perbaikan kapal sandar di Batam, armada genset dan kabel distribusi dapat dikirimkan pada hari yang sama (same-day delivery) setelah konfirmasi penawaran.",
        },
      },
      {
        "@type": "Question",
        name: "Apakah sewa genset sudah termasuk kabel daya dan tangki solar harian?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Kami menyediakan paket catu daya terpadu mencakup kabel tembaga standar industri (4x16 mm² hingga 4x240 mm²), panel distribusi (distribution board), tangki bahan bakar solar harian (1000 - 5000 liter), serta operator mekanik bersertifikat jika dibutuhkan.",
        },
      },
      {
        "@type": "Question",
        name: "Bagaimana cara mengajukan permintaan penawaran harga resmi (RFQ) sewa genset?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Anda dapat mengirimkan spesifikasi daya, durasi pemakaian, dan lokasi proyek melalui formulir RFQ di website atau menghubungi WhatsApp teknis kami di +62 811 7789 902 untuk respon penawaran cepat.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rentServiceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <RentView />
    </>
  );
}
