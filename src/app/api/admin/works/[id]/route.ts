import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readWorksLive, writeWorksLive } from "@/lib/admin-store";

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
  const workId = parseInt(id, 10);
  if (isNaN(workId)) {
    return NextResponse.json({ error: "Invalid project ID." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const works = await readWorksLive();
    const index = works.findIndex((w) => w.id === workId);
    if (index === -1) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const current = works[index];
    const updated = {
      ...current,
      client: body.client !== undefined ? String(body.client).trim() : current.client,
      vessel: body.vessel !== undefined ? String(body.vessel).trim() : current.vessel,
      location: body.location !== undefined ? String(body.location).trim() : current.location,
      year: body.year !== undefined ? String(body.year).trim() : current.year,
      category: body.category !== undefined ? String(body.category).trim() : current.category,
      status: body.status !== undefined ? body.status : current.status,
      banner: body.banner !== undefined ? String(body.banner).trim() : current.banner,
      scope: body.scope !== undefined ? String(body.scope).trim() : current.scope,
      milestones:
        body.milestones !== undefined
          ? Array.isArray(body.milestones)
            ? body.milestones
            : String(body.milestones)
                .split("\n")
                .map((m) => m.trim())
                .filter(Boolean)
          : current.milestones,
    };

    works[index] = updated;
    await writeWorksLive(works);

    return NextResponse.json({
      success: true,
      work: updated,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update project." },
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
  const workId = parseInt(id, 10);
  if (isNaN(workId)) {
    return NextResponse.json({ error: "Invalid project ID." }, { status: 400 });
  }

  try {
    const works = await readWorksLive();
    const index = works.findIndex((w) => w.id === workId);
    if (index === -1) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    works.splice(index, 1);
    await writeWorksLive(works);

    return NextResponse.json({
      success: true,
      message: `Project #${workId} successfully deleted.`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete project." },
      { status: 500 }
    );
  }
}
