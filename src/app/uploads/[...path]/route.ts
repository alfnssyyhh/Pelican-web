import { NextResponse } from "next/server";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const MIME_MAP: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
  ".avif": "image/avif",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await params;
    if (!segments || segments.length === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Security check: prevent directory traversal
    for (const seg of segments) {
      if (seg === ".." || seg.includes("/") || seg.includes("\\") || seg.includes("\0")) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }

    const cleanSubpath = path.join(...segments);

    // Candidate directories to locate the uploaded file
    const cwd = process.cwd();
    const candidateDirs = [
      // 1. In standalone public/uploads
      path.join(cwd, "public", "uploads"),
      // 2. In project root public/uploads (if cwd is .next/standalone)
      path.resolve(cwd, "..", "..", "public", "uploads"),
      // 3. Fallback direct workspace path
      path.resolve("R:/Gemini-Workspace/Pelican-web/pelican-app/public/uploads"),
    ];

    let targetFilePath: string | null = null;
    for (const dir of candidateDirs) {
      const full = path.join(dir, cleanSubpath);
      if (existsSync(full)) {
        targetFilePath = full;
        break;
      }
    }

    if (!targetFilePath) {
      return new NextResponse("File Not Found", { status: 404 });
    }

    const ext = path.extname(targetFilePath).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";
    const fileBuffer = await fs.readFile(targetFilePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[uploads-route] Error serving file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
