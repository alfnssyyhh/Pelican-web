import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readSettingsLive } from "@/lib/admin-store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let displayName = "Principal Administrator";
  let department = "Operations Management";
  let roleLabel = session.role === "admin" ? "Super Admin" : "Operations Officer";

  try {
    const settings = await readSettingsLive();
    const matched = (settings.users || []).find(
      (u) => u.username.toLowerCase() === session.username.toLowerCase()
    );
    if (matched) {
      displayName = matched.display_name;
      department = matched.department;
      roleLabel = matched.role;
    } else if (session.username.toLowerCase() === "admin") {
      displayName = "Principal Administrator";
      roleLabel = "Administrator";
    }
  } catch {}

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "PA";

  return NextResponse.json({
    username: session.username,
    role: session.role,
    roleLabel,
    displayName,
    department,
    initials,
  });
}
