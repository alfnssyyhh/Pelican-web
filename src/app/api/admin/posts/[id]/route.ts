import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readPostsLive, writePostsLive } from "@/lib/admin-store";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteProps) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Session invalid or expired." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const postId = parseInt(id, 10);
  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid article ID." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const posts = await readPostsLive();
    const index = posts.findIndex((p) => p.id === postId);
    if (index === -1) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    const current = posts[index];
    const nextTitle = body.title !== undefined ? String(body.title).trim() : current.title;
    if (!nextTitle) {
      return NextResponse.json({ error: "Article title is required." }, { status: 400 });
    }

    const nextSlug =
      body.slug !== undefined
        ? String(body.slug)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
        : current.slug;

    if (posts.some((p, i) => i !== index && p.slug === nextSlug)) {
      return NextResponse.json(
        { error: "Article slug already exists on another article." },
        { status: 400 }
      );
    }

    const nowIso = new Date().toISOString().slice(0, 19).replace("T", " ");
    const nextExcerpt =
      body.excerpt !== undefined ? String(body.excerpt).trim() : current.excerpt;
    const nextContent =
      body.content !== undefined ? String(body.content).trim() : current.content;

    const updated = {
      ...current,
      title: nextTitle,
      title_id: nextTitle,
      title_en: nextTitle,
      slug: nextSlug,
      status: body.status !== undefined ? body.status : current.status,
      modified: nowIso,
      excerpt: nextExcerpt,
      excerpt_id: nextExcerpt,
      excerpt_en: nextExcerpt,
      content: nextContent,
      content_id: nextContent,
      content_en: nextContent,
      categories:
        body.category !== undefined
          ? [String(body.category).trim()]
          : body.categories !== undefined
            ? body.categories
            : current.categories,
      tags:
        body.tags !== undefined
          ? (Array.isArray(body.tags)
              ? body.tags.map((t: string) => String(t).trim()).filter(Boolean)
              : current.tags || [])
          : current.tags || [],
      thumbnail_url:
        body.thumbnail_url !== undefined ? body.thumbnail_url : current.thumbnail_url,
    };

    posts[index] = updated;
    await writePostsLive(posts);

    return NextResponse.json({
      success: true,
      post: updated,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update article." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Session invalid or expired." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const postId = parseInt(id, 10);
  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid article ID." }, { status: 400 });
  }

  try {
    const posts = await readPostsLive();
    const index = posts.findIndex((p) => p.id === postId);
    if (index === -1) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    posts.splice(index, 1);
    await writePostsLive(posts);

    return NextResponse.json({
      success: true,
      message: `Article #${postId} successfully deleted.`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete article." },
      { status: 500 }
    );
  }
}
