import { NextResponse } from "next/server";
import { getAdminSession, generateSalt, hashPassword } from "@/lib/auth";
import { readSettingsLive, writeSettingsLive } from "@/lib/admin-store";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Access denied. Session is invalid or expired." }, { status: 401 });
  }

  // Enforce Super Admin role check
  if (session.role !== "admin") {
    return NextResponse.json(
      { error: "Access denied. Only Super Administrators can update user accounts." },
      { status: 403 }
    );
  }

  try {
    const { id } = await context.params;
    const numId = parseInt(id, 10);
    const body = await request.json();
    const settings = await readSettingsLive();
    const users = settings.users || [];

    const index = users.findIndex((u) => u.id === numId);
    if (index === -1) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    let password_hash = users[index].password_hash;
    let salt = users[index].salt;

    // If new password provided during edit
    if (body.password && typeof body.password === "string" && body.password.trim().length >= 8) {
      salt = generateSalt();
      password_hash = await hashPassword(body.password.trim(), salt);
    }

    const updatedUser = {
      ...users[index],
      username: body.username !== undefined ? body.username.trim() : users[index].username,
      display_name: body.display_name !== undefined ? body.display_name.trim() : users[index].display_name,
      email: body.email !== undefined ? body.email.trim() : users[index].email,
      role: body.role !== undefined ? body.role : users[index].role,
      department: body.department !== undefined ? body.department : users[index].department,
      status: body.status !== undefined ? body.status : users[index].status,
      password_hash,
      salt,
    };

    const newUsers = [...users];
    newUsers[index] = updatedUser;

    await writeSettingsLive({ ...settings, users: newUsers });

    const { password_hash: _h, salt: _s, ...safeUser } = updatedUser;
    return NextResponse.json({ success: true, user: safeUser });
  } catch {
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Access denied. Session is invalid or expired." }, { status: 401 });
  }

  // Enforce Super Admin role check
  if (session.role !== "admin") {
    return NextResponse.json(
      { error: "Access denied. Only Super Administrators can delete user accounts." },
      { status: 403 }
    );
  }

  try {
    const { id } = await context.params;
    const numId = parseInt(id, 10);
    const settings = await readSettingsLive();
    const users = settings.users || [];

    const filtered = users.filter((u) => u.id !== numId);
    if (filtered.length === users.length) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    await writeSettingsLive({ ...settings, users: filtered });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}
