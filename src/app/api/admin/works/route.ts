import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readWorksLive, writeWorksLive } from "@/lib/admin-store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Session invalid or expired." },
      { status: 401 }
    );
  }
  const works = await readWorksLive();
  return NextResponse.json(works);
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
      client,
      vessel,
      location,
      year,
      category,
      status,
      banner,
      scope,
      milestones,
    } = body;

    if (!client || !String(client).trim()) {
      return NextResponse.json({ error: "Project client name is required." }, { status: 400 });
    }

    const cleanSlug = String(body.slug || client)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const works = await readWorksLive();
    const newId = works.length > 0 ? Math.max(...works.map((w) => w.id)) + 1 : 201;

    const newWork = {
      id: newId,
      slug: cleanSlug,
      client: String(client).trim(),
      vessel: String(vessel || "").trim(),
      location: String(location || "Batam Shipyard").trim(),
      year: String(year || "2026").trim(),
      category: String(category || "Diesel Engine Overhaul").trim(),
      status: status || "publish",
      banner: banner ? String(banner).trim() : "/projects/bourbon-vessel.jpg",
      scope: String(scope || "").trim(),
      milestones: Array.isArray(milestones)
        ? milestones.filter(Boolean)
        : typeof milestones === "string"
          ? milestones
              .split("\n")
              .map((m: string) => m.trim())
              .filter(Boolean)
          : [],
    };

    works.unshift(newWork);
    await writeWorksLive(works);

    return NextResponse.json({
      success: true,
      work: newWork,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create project portfolio." },
      { status: 500 }
    );
  }
}
