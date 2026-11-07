import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readPostsLive, writePostsLive } from "@/lib/admin-store";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Invalid or expired session." },
      { status: 401 }
    );
  }

  try {
    const { oldTag, newTag } = await request.json();
    if (!oldTag || !newTag || !String(newTag).trim()) {
      return NextResponse.json(
        { error: "Both previous and new tag names are required." },
        { status: 400 }
      );
    }

    const trimmedOld = String(oldTag).trim();
    const trimmedNew = String(newTag).trim();

    if (trimmedOld === trimmedNew) {
      return NextResponse.json({ success: true, count: 0 });
    }

    const posts = await readPostsLive();
    let modifiedCount = 0;

    const updatedPosts = posts.map((post) => {
      if (!post.tags || !post.tags.includes(trimmedOld)) {
        return post;
      }
      modifiedCount++;
      const newTagsSet = new Set(
        post.tags.map((t) => (t === trimmedOld ? trimmedNew : t))
      );
      return {
        ...post,
        tags: Array.from(newTagsSet),
      };
    });

    if (modifiedCount > 0) {
      await writePostsLive(updatedPosts);
    }

    return NextResponse.json({
      success: true,
      message: `Tag "${trimmedOld}" successfully renamed to "${trimmedNew}" across ${modifiedCount} article(s).`,
      count: modifiedCount,
    });
  } catch (error) {
    console.error("[tags-put] Error renaming tag:", error);
    return NextResponse.json({ error: "Failed to update tag." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Invalid or expired session." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const tagToDelete = searchParams.get("tag")?.trim();

    if (!tagToDelete) {
      return NextResponse.json(
        { error: "Tag parameter is required." },
        { status: 400 }
      );
    }

    const posts = await readPostsLive();
    let modifiedCount = 0;

    const updatedPosts = posts.map((post) => {
      if (!post.tags || !post.tags.includes(tagToDelete)) {
        return post;
      }
      modifiedCount++;
      return {
        ...post,
        tags: post.tags.filter((t) => t !== tagToDelete),
      };
    });

    if (modifiedCount > 0) {
      await writePostsLive(updatedPosts);
    }

    return NextResponse.json({
      success: true,
      message: `Tag "${tagToDelete}" successfully removed from ${modifiedCount} article(s).`,
      count: modifiedCount,
    });
  } catch (error) {
    console.error("[tags-delete] Error deleting tag:", error);
    return NextResponse.json({ error: "Failed to delete tag." }, { status: 500 });
  }
}
