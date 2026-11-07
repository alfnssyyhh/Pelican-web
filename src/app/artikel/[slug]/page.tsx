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
      title: "Article Not Found | PT Pelican Mitra Sejati",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || `Technical insights and engineering solutions for ${post.title} by PT Pelican Mitra Sejati in Batam.`,
    keywords: post.tags && post.tags.length > 0 ? post.tags : ["maritime", "marine engineering", "Batam shipyard", "spare parts"],
    alternates: {
      canonical: `https://pelican-ms.com/artikel/${post.slug}`,
      languages: {
        "id": `https://pelican-ms.com/artikel/${post.slug}`,
        "en": `https://pelican-ms.com/artikel/${post.slug}`,
        "x-default": `https://pelican-ms.com/artikel/${post.slug}`,
      },
    },
    openGraph: {
      title: `${post.title} | PT Pelican Mitra Sejati Batam`,
      description: post.excerpt || `Solusi dan wawasan teknik maritim: ${post.title} oleh PT Pelican Mitra Sejati di Batam.`,
      url: `https://pelican-ms.com/artikel/${post.slug}`,
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
      title: `${post.title} | PT Pelican Mitra Sejati Batam`,
      description: post.excerpt || `Solusi dan wawasan teknik maritim: ${post.title} oleh PT Pelican Mitra Sejati di Batam.`,
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
    keywords: post.tags && post.tags.length > 0 ? post.tags.join(", ") : undefined,
    about: (post.categories || []).map((cat) => ({ "@type": "Thing", name: cat })),
    url: `https://pelican-ms.com/artikel/${post.slug}`,
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
      "@id": `https://pelican-ms.com/artikel/${post.slug}`,
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
        item: `https://pelican-ms.com/artikel/${post.slug}`,
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
