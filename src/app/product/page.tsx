import type { Metadata } from "next";
import { getPublishedProducts } from "@/lib/data.server";
import { ProductView } from "@/components/product-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Suku Cadang Mesin Kapal & Flow Meter Batam | Pelican",
  },
  description:
    "Katalog suku cadang mesin kapal Cummins resmi, differential flow meter Technoton, sensor bahan bakar kapal, dan peralatan industri maritim di Batam.",
  alternates: {
    canonical: "https://pelican-ms.com/product",
    languages: {
      "id": "https://pelican-ms.com/product",
      "en": "https://pelican-ms.com/product",
      "x-default": "https://pelican-ms.com/product",
    },
  },
  openGraph: {
    title: "Suku Cadang Mesin Kapal & Flow Meter Batam | Pelican",
    description:
      "Katalog suku cadang mesin kapal Cummins resmi, differential flow meter Technoton, sensor bahan bakar kapal, dan peralatan industri maritim di Batam.",
    url: "https://pelican-ms.com/product",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Suku Cadang Mesin Kapal & Flow Meter Batam | Pelican",
    description:
      "Katalog suku cadang mesin kapal Cummins resmi, differential flow meter Technoton, sensor bahan bakar kapal, dan peralatan industri maritim di Batam.",
    images: ["/og-image.png"],
  },
};

export default async function ProductPage() {
  const allProducts = await getPublishedProducts();
  const products = allProducts.filter((p) => !p.categories.includes("Genset"));

  return <ProductView products={products} />;
}
