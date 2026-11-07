import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readNotificationsLive, writeNotificationsLive } from "@/lib/admin-store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notifications = await readNotificationsLive();
  return NextResponse.json(notifications);
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const notifications = await readNotificationsLive();

    // Mark all as read
    if (body.mark_all_read) {
      const updated = notifications.map((n) => ({ ...n, is_read: true }));
      await writeNotificationsLive(updated);
      return NextResponse.json({ success: true, notifications: updated });
    }

    // Mark specific as read
    if (body.id) {
      const updated = notifications.map((n) =>
        n.id === body.id ? { ...n, is_read: true } : n
      );
      await writeNotificationsLive(updated);
      return NextResponse.json({ success: true, notifications: updated });
    }

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
