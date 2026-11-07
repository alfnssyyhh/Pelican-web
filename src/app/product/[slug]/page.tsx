import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedProducts, getProductBySlug } from "@/lib/data.server";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  FileText,
  PhoneCall,
  PackageCheck,
  ChevronRight,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: { absolute: "Produk Tidak Ditemukan | Pelican Batam" },
    };
  }

  // Title budget: 60 characters max
  // Suffix: " | Pelican" (10 chars) -> Available: 48 chars
  let rawName = product.name.trim();
  if (rawName.length > 47) {
    const cut = rawName.slice(0, 45).trim();
    const lastSp = cut.lastIndexOf(" ");
    rawName = (lastSp > 25 ? cut.slice(0, lastSp) : cut) + "...";
  }
  const pageTitle = `${rawName} | Pelican`;

  // Description budget: 70 - 160 characters
  let pageDesc = (product.short_description || "").trim();
  if (pageDesc.length < 70) {
    pageDesc = `Distribusi suku cadang resmi ${rawName} di Batam. Kualitas teruji untuk armada maritim dan kebutuhan mesin industri galangan kapal.`;
  }
  if (pageDesc.length > 155) {
    const cut = pageDesc.slice(0, 150).trim();
    const lastSp = cut.lastIndexOf(" ");
    pageDesc = (lastSp > 110 ? cut.slice(0, lastSp) : cut) + "...";
  }

  return {
    title: { absolute: pageTitle },
    description: pageDesc,
    alternates: {
      canonical: `https://pelican-ms.com/product/${product.slug}`,
      languages: {
        "id": `https://pelican-ms.com/product/${product.slug}`,
        "en": `https://pelican-ms.com/product/${product.slug}`,
        "x-default": `https://pelican-ms.com/product/${product.slug}`,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: `https://pelican-ms.com/product/${product.slug}`,
      type: "website",
      images: [
        {
          url: product.thumbnail_url || "/og-image.png",
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
      images: [product.thumbnail_url || "/og-image.png"],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getPublishedProducts();
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        p.categories.some((c) => product.categories.includes(c))
    )
    .slice(0, 3);

  const waMessage = `Halo PT Pelican Mitra Sejati, saya ingin meminta penawaran harga resmi (RFQ) untuk:\nProduk: ${
    product.name
  }${product.sku ? `\nSKU: ${product.sku}` : ""}\nMohon informasi harga dan ketersediaan stok di Batam. Terima kasih.`;
  const waUrl = `https://wa.me/628117789902?text=${encodeURIComponent(waMessage)}`;

  const brandName = product.categories.includes("Cummins")
    ? "Cummins"
    : product.categories.includes("Technoton")
    ? "Technoton"
    : "PT Pelican Mitra Sejati";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.thumbnail_url
      ? `https://pelican-ms.com${product.thumbnail_url}`
      : "https://pelican-ms.com/og-image.png",
    description:
      product.short_description ||
      `Distributor resmi dan suku cadang presisi ${product.name} di Batam.`,
    sku: product.sku || `PMS-${product.id}`,
    mpn: product.sku || undefined,
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    offers: {
      "@type": "Offer",
      url: `https://pelican-ms.com/product/${product.slug}`,
      priceCurrency: "IDR",
      price: "0",
      priceValidUntil: "2027-12-31",
      availability:
        product.stock_status === "instock"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Corporation",
        name: "PT Pelican Mitra Sejati",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: "https://pelican-ms.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Katalog Suku Cadang",
        item: "https://pelican-ms.com/product",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://pelican-ms.com/product/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="bg-slate-50 min-h-screen py-10 md:py-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/product" className="hover:text-slate-900 transition-colors">
              Katalog Suku Cadang
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-medium truncate max-w-xs sm:max-w-md">
              {product.name}
            </span>
          </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex items-center justify-center sticky top-24 shadow-sm">
              <div className="relative aspect-square w-full max-w-md overflow-hidden flex items-center justify-center">
                {product.thumbnail_url ? (
                  <Image
                    src={product.thumbnail_url}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-contain"
                  />
                ) : (
                  <div className="text-slate-400 text-sm flex flex-col items-center">
                    <PackageCheck className="w-16 h-16 mb-2" />
                    <span>No Image Available</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Specs & RFQ */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Category & Stock Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {product.categories.map((c) => (
                  <Badge key={c} variant="outline" className="border-slate-300 text-slate-700 bg-slate-50 font-medium text-xs">
                    {c}
                  </Badge>
                ))}
                {product.stock_status === "instock" ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Stock Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300">
                    Stock Unavailable
                  </span>
                )}
              </div>

              {/* Single H1 on Page */}
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* SKU */}
              {product.sku && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-md text-xs font-mono text-slate-700">
                  <span className="text-slate-500 font-sans">Manufacturer Part or SKU:</span>
                  <strong className="font-semibold">{product.sku}</strong>
                </div>
              )}

              {/* Description */}
              <div className="border-t border-b border-slate-100 py-4 space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Technical Specifications & Overview
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed">
                  {product.short_description ||
                    "Certified industrial marine component engineered for severe offshore operational environments, extreme temperature variations, and continuous duty cycles."}
                </p>
                {product.description && (
                  <div
                    className="text-xs sm:text-sm text-slate-600 space-y-2 mt-3 font-normal"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}
              </div>

              {/* RFQ Action Box */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-900 block">
                    Pricing on Request for Quotation (RFQ)
                  </span>
                  <p className="text-xs text-slate-600 font-normal mt-0.5">
                    Official pricing tailored to your procurement volume, delivery schedule, and class certification.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button asChild size="lg" className="w-full sm:w-auto bg-pelican-red hover:bg-pelican-red-hover text-white font-semibold text-xs px-6 h-11 shadow-xs">
                    <Link href={`/contact?type=product&item=${encodeURIComponent(product.name)}`}>
                      <FileText className="w-4 h-4 mr-2" />
                      Request Official Quotation (RFQ)
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Trust Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs text-slate-600 font-normal">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Genuine manufacturer verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Same-day shipyard delivery in Batam</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Related Equipment & Spare Parts
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Card key={rel.id} className="bg-white border-slate-200 hover:border-slate-400 transition-colors shadow-sm overflow-hidden">
                  <div className="relative aspect-4/3 w-full bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4">
                    {rel.thumbnail_url ? (
                      <Image
                        src={rel.thumbnail_url}
                        alt={rel.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-contain p-4"
                      />
                    ) : (
                      <PackageCheck className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {rel.categories[0]}
                    </span>
                    <h3 className="font-semibold text-sm text-slate-900 line-clamp-2">
                      <Link href={`/product/${rel.slug}`} className="hover:text-pelican-red">
                        {rel.name}
                      </Link>
                    </h3>
                    <div className="pt-2">
                      <Button asChild variant="outline" size="sm" className="w-full text-xs">
                        <Link
                          href={`/product/${rel.slug}`}
                          aria-label={`Lihat rincian spesifikasi suku cadang ${rel.name}`}
                        >
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
