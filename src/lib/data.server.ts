import {
  readProductsLive,
  readPostsLive,
  readRentalsLive,
  readWorksLive,
  type RentalUnit,
  type WorkProject,
} from "@/lib/admin-store";
import type { Product, Post } from "@/lib/data";
import productsFallback from "@/data/products.json";
import postsFallback from "@/data/posts.json";

export async function getProducts(): Promise<Product[]> {
  try {
    const prods = await readProductsLive();
    if (prods && prods.length > 0) return prods;
  } catch {
    // fallback
  }
  return productsFallback as Product[];
}

export async function getPublishedProducts(): Promise<Product[]> {
  const prods = await getProducts();
  return prods.filter((p) => p.status === "publish");
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const prods = await getProducts();
  return prods.find((p) => p.slug === slug);
}

export async function getPosts(): Promise<Post[]> {
  try {
    const posts = await readPostsLive();
    if (posts && posts.length > 0) return posts;
  } catch {
    // fallback
  }
  return postsFallback as Post[];
}

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((p) => p.status === "publish");
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getRentals(): Promise<RentalUnit[]> {
  try {
    const rentals = await readRentalsLive();
    if (rentals && rentals.length > 0) return rentals;
  } catch {
    // fallback
  }
  return [];
}

export async function getWorks(): Promise<WorkProject[]> {
  try {
    const works = await readWorksLive();
    if (works && works.length > 0) return works;
  } catch {
    // fallback
  }
  return [];
}

export async function getCategories(): Promise<string[]> {
  const prods = await getProducts();
  const posts = await getPosts();
  const cats = new Set<string>();
  prods.forEach((p) => p.categories.forEach((c) => cats.add(c)));
  posts.forEach((p) => p.categories.forEach((c) => cats.add(c)));
  return Array.from(cats).sort();
}
