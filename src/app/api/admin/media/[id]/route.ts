import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readMediaLive, writeMediaLive } from "@/lib/admin-store";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteProps) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Akses ditolak. Sesi tidak sah atau telah kedaluwarsa." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const mediaId = parseInt(id, 10);
  if (isNaN(mediaId)) {
    return NextResponse.json({ error: "ID media tidak valid." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const mediaList = await readMediaLive();
    const index = mediaList.findIndex((m) => m.id === mediaId);
    if (index === -1) {
      return NextResponse.json({ error: "Berkas media tidak ditemukan." }, { status: 404 });
    }

    const current = mediaList[index];
    const updated = {
      ...current,
      title: body.title !== undefined ? String(body.title).trim() : current.title,
      category: body.category !== undefined ? String(body.category).trim() : current.category,
      alt_text: body.alt_text !== undefined ? String(body.alt_text).trim() : current.alt_text,
    };

    mediaList[index] = updated;
    await writeMediaLive(mediaList);

    return NextResponse.json({
      success: true,
      media: updated,
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui informasi media." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Akses ditolak. Sesi tidak sah atau telah kedaluwarsa." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const mediaId = parseInt(id, 10);
  if (isNaN(mediaId)) {
    return NextResponse.json({ error: "ID media tidak valid." }, { status: 400 });
  }

  try {
    const mediaList = await readMediaLive();
    const index = mediaList.findIndex((m) => m.id === mediaId);
    if (index === -1) {
      return NextResponse.json({ error: "Berkas media tidak ditemukan." }, { status: 404 });
    }

    mediaList.splice(index, 1);
    await writeMediaLive(mediaList);

    return NextResponse.json({
      success: true,
      message: "Berkas media berhasil dihapus dari pustaka.",
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus berkas media." },
      { status: 500 }
    );
  }
}
