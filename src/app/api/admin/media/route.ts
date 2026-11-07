import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readMediaLive, writeMediaLive } from "@/lib/admin-store";
import fs from "fs/promises";
import path from "path";

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Akses ditolak. Sesi tidak sah atau telah kedaluwarsa." },
      { status: 401 }
    );
  }
  const media = await readMediaLive();
  return NextResponse.json(media);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Akses ditolak. Sesi tidak sah atau telah kedaluwarsa." },
      { status: 401 }
    );
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    const mediaList = await readMediaLive();
    const newId = mediaList.length > 0 ? Math.max(...mediaList.map((m) => m.id)) + 1 : 301;
    const today = new Date().toISOString().slice(0, 10);

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const title = String(formData.get("title") || "").trim();
      const category = String(formData.get("category") || "Suku cadang").trim();
      const altText = String(formData.get("alt_text") || "").trim();

      if (!file) {
        return NextResponse.json({ error: "Berkas wajib dipilih untuk diunggah." }, { status: 400 });
      }

      if (!ALLOWED_MIMES.has(file.type)) {
        return NextResponse.json(
          { error: "Format berkas tidak didukung. Gunakan PNG, JPG, WebP, SVG, atau PDF." },
          { status: 400 }
        );
      }

      if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Ukuran berkas melebihi batas maksimal 5 MB." },
          { status: 400 }
        );
      }

      const ext = path.extname(file.name).toLowerCase().replace(/[^a-z0-9.]/g, "") || ".png";
      const baseSafe = path
        .basename(file.name, path.extname(file.name))
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40);
      const uniqueFilename = `${baseSafe || "media"}-${Date.now().toString().slice(-6)}${ext}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      // Save to candidate directories (standalone and persistent root public)
      const cwd = process.cwd();
      const targetDirs = [
        path.join(cwd, "public", "uploads", "custom"),
        path.resolve(cwd, "..", "..", "public", "uploads", "custom"),
        path.join(cwd, ".next", "standalone", "public", "uploads", "custom"),
      ];

      for (const dir of targetDirs) {
        try {
          await fs.mkdir(dir, { recursive: true });
          await fs.writeFile(path.join(dir, uniqueFilename), buffer);
        } catch {
          // ignore if candidate path is invalid
        }
      }

      const newMedia = {
        id: newId,
        title: title || baseSafe || uniqueFilename,
        filename: uniqueFilename,
        url: `/uploads/custom/${uniqueFilename}`,
        category,
        mime_type: file.type,
        size_kb: Math.max(1, Math.round(file.size / 1024)),
        alt_text: altText || title || uniqueFilename,
        uploaded_at: today,
      };

      mediaList.unshift(newMedia);
      await writeMediaLive(mediaList);

      return NextResponse.json({
        success: true,
        media: newMedia,
      });
    } else {
      const body = await request.json();
      const { title, url, category, alt_text } = body;

      if (!title || !String(title).trim() || !url || !String(url).trim()) {
        return NextResponse.json(
          { error: "Judul media dan tautan berkas wajib diisi." },
          { status: 400 }
        );
      }

      const cleanUrl = String(url).trim();
      const filename = cleanUrl.split("/").pop() || "aset-media.png";

      const newMedia = {
        id: newId,
        title: String(title).trim(),
        filename,
        url: cleanUrl,
        category: String(category || "Suku cadang").trim(),
        mime_type: filename.endsWith(".webp")
          ? "image/webp"
          : filename.endsWith(".jpg") || filename.endsWith(".jpeg")
            ? "image/jpeg"
            : "image/png",
        size_kb: 120,
        alt_text: String(alt_text || title).trim(),
        uploaded_at: today,
      };

      mediaList.unshift(newMedia);
      await writeMediaLive(mediaList);

      return NextResponse.json({
        success: true,
        media: newMedia,
      });
    }
  } catch {
    return NextResponse.json(
      { error: "Gagal mengunggah atau menyimpan media." },
      { status: 500 }
    );
  }
}
