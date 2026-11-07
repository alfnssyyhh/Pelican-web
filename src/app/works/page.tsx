import type { Metadata } from "next";
import { Suspense } from "react";
import { WorksView } from "@/components/works-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Portofolio Rekayasa Maritim & Kapal Batam | Pelican",
  },
  description:
    "Dokumentasi proyek rekayasa kapal, overhaul mesin diesel, dan otomasi sistem yang dikerjakan oleh PT Pelican Mitra Sejati di galangan kapal Batam.",
  alternates: {
    canonical: "https://pelican-ms.com/works",
    languages: {
      "id": "https://pelican-ms.com/works",
      "en": "https://pelican-ms.com/works",
      "x-default": "https://pelican-ms.com/works",
    },
  },
  openGraph: {
    title: "Portofolio Rekayasa Maritim & Kapal Batam | Pelican",
    description:
      "Dokumentasi proyek rekayasa kapal, overhaul mesin diesel, dan otomasi sistem yang dikerjakan oleh PT Pelican Mitra Sejati di galangan kapal Batam.",
    url: "https://pelican-ms.com/works",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portofolio Rekayasa Maritim & Kapal Batam | Pelican",
    description:
      "Dokumentasi proyek rekayasa kapal, overhaul mesin diesel, dan otomasi sistem yang dikerjakan oleh PT Pelican Mitra Sejati di galangan kapal Batam.",
    images: ["/og-image.png"],
  },
};

export default function WorksPage() {
  return (
    <Suspense fallback={<div className="bg-slate-50 min-h-screen" />}>
      <WorksView />
    </Suspense>
  );
}
