import productsFallback from "@/data/products.json";
import postsFallback from "@/data/posts.json";

export interface Product {
  id: number;
  name: string;
  slug: string;
  status: "publish" | "draft" | string;
  sku: string;
  price: string;
  regular_price: string;
  stock_status: "instock" | "outofstock" | string;
  categories: string[];
  tags: string[];
  description: string;
  short_description: string;
  thumbnail_url: string | null;
  name_en?: string;
  name_id?: string;
  description_en?: string;
  description_id?: string;
  short_description_en?: string;
  short_description_id?: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  status: "publish" | "draft" | string;
  date: string;
  modified: string;
  excerpt: string;
  content: string;
  categories: string[];
  tags: string[];
  thumbnail_url: string | null;
  title_en?: string;
  title_id?: string;
  excerpt_en?: string;
  excerpt_id?: string;
  content_en?: string;
  content_id?: string;
  categories_en?: string[];
  categories_id?: string[];
}

export function localizePost(post: Post, locale: "en" | "id" = "en"): Post {
  return {
    ...post,
    title: locale === "id" && post.title_id ? post.title_id : post.title_en || post.title,
    excerpt: locale === "id" && post.excerpt_id ? post.excerpt_id : post.excerpt_en || post.excerpt,
    content: locale === "id" && post.content_id ? post.content_id : post.content_en || post.content,
    categories:
      locale === "id" && post.categories_id && post.categories_id.length > 0
        ? post.categories_id
        : post.categories_en && post.categories_en.length > 0
        ? post.categories_en
        : post.categories,
  };
}

export function localizePosts(posts: Post[], locale: "en" | "id" = "en"): Post[] {
  return posts.map((p) => localizePost(p, locale));
}
