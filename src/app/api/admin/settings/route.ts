import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readSettingsLive, writeSettingsLive } from "@/lib/admin-store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Session is invalid or has expired." },
      { status: 401 }
    );
  }
  const settings = await readSettingsLive();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Session is invalid or has expired." },
      { status: 401 }
    );
  }

  // Enforce Super Admin role check
  if (session.role !== "admin") {
    return NextResponse.json(
      { error: "Access denied. Only Super Administrators can modify system settings." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const current = await readSettingsLive();

    const updated = {
      general: body.general ? { ...current.general, ...body.general } : current.general,
      seo: body.seo ? { ...current.seo, ...body.seo } : current.seo,
      users: Array.isArray(body.users) ? body.users : current.users,
    };

    await writeSettingsLive(updated);

    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to save system settings." },
      { status: 500 }
    );
  }
}
