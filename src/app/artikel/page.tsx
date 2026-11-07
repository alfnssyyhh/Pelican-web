import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/data.server";
import { ArticlesCatalog } from "@/components/articles-catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Artikel Rekayasa Maritim & Lapangan Batam | Pelican",
  },
  description:
    "Wawasan teknik seputar kalibrasi ODME, perbaikan alarm 15 ppm OWS, diagnostik sistem otomasi kapal, dan genset industri di galangan Batam.",
  alternates: {
    canonical: "https://pelican-ms.com/artikel",
    languages: {
      "id": "https://pelican-ms.com/artikel",
      "en": "https://pelican-ms.com/artikel",
      "x-default": "https://pelican-ms.com/artikel",
    },
  },
  openGraph: {
    title: "Artikel Rekayasa Maritim & Lapangan Batam | Pelican",
    description:
      "Wawasan teknik seputar kalibrasi ODME, perbaikan alarm 15 ppm OWS, diagnostik sistem otomasi kapal, dan genset industri di galangan Batam.",
    url: "https://pelican-ms.com/artikel",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artikel Rekayasa Maritim & Lapangan Batam | Pelican",
    description:
      "Wawasan teknik seputar kalibrasi ODME, perbaikan alarm 15 ppm OWS, diagnostik sistem otomasi kapal, dan genset industri di galangan Batam.",
    images: ["/og-image.png"],
  },
};

export default async function ArtikelPage() {
  const posts = await getPublishedPosts();

  return <ArticlesCatalog initialPosts={posts} />;
}
