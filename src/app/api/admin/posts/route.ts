import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readPostsLive, writePostsLive } from "@/lib/admin-store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Session invalid or expired." },
      { status: 401 }
    );
  }
  const posts = await readPostsLive();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Session invalid or expired." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      title,
      slug,
      category,
      status,
      content,
      excerpt,
      thumbnail_url,
      tags,
    } = body;

    if (!title || !String(title).trim()) {
      return NextResponse.json({ error: "Article title is required." }, { status: 400 });
    }

    const cleanSlug = String(slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const posts = await readPostsLive();

    if (posts.some((p) => p.slug === cleanSlug)) {
      return NextResponse.json(
        { error: "Article slug already exists. Please choose a unique title or slug." },
        { status: 400 }
      );
    }

    const newId = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1;
    const nowIso = new Date().toISOString().slice(0, 19).replace("T", " ");

    const newPost = {
      id: newId,
      title: String(title).trim(),
      title_id: String(title).trim(),
      title_en: String(title).trim(),
      slug: cleanSlug,
      status: status || "publish",
      date: nowIso,
      modified: nowIso,
      excerpt: String(excerpt || "").trim(),
      excerpt_id: String(excerpt || "").trim(),
      excerpt_en: String(excerpt || "").trim(),
      content: String(content || "").trim(),
      content_id: String(content || "").trim(),
      content_en: String(content || "").trim(),
      categories: category ? [String(category).trim()] : ["Electrical & marine automation"],
      tags: Array.isArray(tags) ? tags.map((t: string) => String(t).trim()).filter(Boolean) : [],
      thumbnail_url: thumbnail_url ? String(thumbnail_url).trim() : "/uploads/2025/11/GG.jpeg",
    };

    posts.unshift(newPost);
    await writePostsLive(posts);

    return NextResponse.json({
      success: true,
      post: newPost,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create article." },
      { status: 500 }
    );
  }
}
