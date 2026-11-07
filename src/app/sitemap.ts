import { MetadataRoute } from "next";
import { getPublishedProducts, getPublishedPosts } from "@/lib/data.server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pelican-ms.com";
  // Stable release baseline date to prevent unnecessary crawl churn
  const stableReleaseDate = new Date("2026-11-01T00:00:00.000Z");

  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: stableReleaseDate,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/service`,
      lastModified: stableReleaseDate,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/rent`,
      lastModified: stableReleaseDate,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/product`,
      lastModified: stableReleaseDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/artikel`,
      lastModified: stableReleaseDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/works`,
      lastModified: stableReleaseDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: stableReleaseDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  const products = await getPublishedProducts();
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: stableReleaseDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const posts = await getPublishedPosts();
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: new Date(post.modified || post.date || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes, ...postRoutes];
}
