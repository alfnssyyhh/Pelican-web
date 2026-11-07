import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedPosts, getPostBySlug } from "@/lib/data.server";
import { ArticleDetailView } from "@/components/article-detail-view";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: { absolute: "Artikel Tidak Ditemukan | Pelican Batam" },
    };
  }

  // Budget: 60 characters max for Title
  // Suffix: " | Pelican" (10 chars) -> Available: 48 chars
  let cleanTitle = post.title.trim();
  if (cleanTitle.length > 47) {
    const cut = cleanTitle.slice(0, 45).trim();
    const lastSp = cut.lastIndexOf(" ");
    cleanTitle = (lastSp > 25 ? cut.slice(0, lastSp) : cut) + "...";
  }
  const pageTitle = `${cleanTitle} | Pelican`;

  // Budget: 70 - 160 characters for Description
  let pageDesc = (post.excerpt || "").trim();
  if (pageDesc.length < 70) {
    pageDesc = `Panduan teknis dan wawasan lapangan ${cleanTitle} oleh tim rekayasa PT Pelican Mitra Sejati di galangan kapal Batam.`;
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
      canonical: `https://pelican-ms.com/${post.slug}`,
      languages: {
        "id": `https://pelican-ms.com/${post.slug}`,
        "en": `https://pelican-ms.com/${post.slug}`,
        "x-default": `https://pelican-ms.com/${post.slug}`,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: `https://pelican-ms.com/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified || post.date,
      images: [
        {
          url: post.thumbnail_url || "/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
      images: [post.thumbnail_url || "/og-image.png"],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getPublishedPosts();
  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 4);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.excerpt || `Technical engineering insights for ${post.title} in Batam.`,
    url: `https://pelican-ms.com/${post.slug}`,
    image: post.thumbnail_url ? `https://pelican-ms.com${post.thumbnail_url}` : "https://pelican-ms.com/og-image.png",
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: {
      "@type": "Organization",
      name: "Tim Rekayasa Teknik PT Pelican Mitra Sejati",
      url: "https://pelican-ms.com",
    },
    publisher: {
      "@type": "Corporation",
      name: "PT Pelican Mitra Sejati",
      url: "https://pelican-ms.com",
      logo: "https://pelican-ms.com/logo.png",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://pelican-ms.com/${post.slug}`,
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
        name: "Artikel Teknis",
        item: "https://pelican-ms.com/artikel",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://pelican-ms.com/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ArticleDetailView initialPost={post} initialRelated={relatedPosts} />
    </>
  );
}