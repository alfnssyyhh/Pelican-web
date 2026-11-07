import { NextResponse } from "next/server";
import { getAdminSession, generateSalt, hashPassword } from "@/lib/auth";
import { readSettingsLive, writeSettingsLive, type AdminUserItem } from "@/lib/admin-store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Access denied. Session is invalid or expired." }, { status: 401 });
  }

  const settings = await readSettingsLive();
  const users = settings.users || [];
  // Strip sensitive credentials before sending to client (Zero Credential Leakage)
  const safeUsers = users.map(({ password_hash, salt, ...safeUser }) => safeUser);
  return NextResponse.json(safeUsers);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Access denied. Session is invalid or expired." }, { status: 401 });
  }

  // Enforce Super Admin role check
  if (session.role !== "admin") {
    return NextResponse.json(
      { error: "Access denied. Only Super Administrators can create user accounts." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const settings = await readSettingsLive();
    const users = settings.users || [];

    if (!body.username || !body.display_name || !body.email || !body.password) {
      return NextResponse.json(
        { error: "Username, full name, email, and password are required." },
        { status: 400 }
      );
    }

    const trimmedUsername = body.username.trim();
    const passwordStr = String(body.password).trim();

    if (passwordStr.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // Check username uniqueness
    if (users.some((u) => u.username.toLowerCase() === trimmedUsername.toLowerCase())) {
      return NextResponse.json(
        { error: "A user account with this username already exists." },
        { status: 409 }
      );
    }

    // Securely hash password with PBKDF2/SHA-512 and unique salt
    const salt = generateSalt();
    const password_hash = await hashPassword(passwordStr, salt);

    const maxId = users.reduce((max, u) => Math.max(max, u.id || 0), 0);
    const newUser: AdminUserItem = {
      id: maxId + 1,
      username: trimmedUsername,
      display_name: body.display_name.trim(),
      email: body.email.trim(),
      role: body.role || "Operator",
      department: body.department || "Engineering",
      status: body.status || "Active",
      last_active: "Just now",
      password_hash,
      salt,
    };

    const updatedUsers = [newUser, ...users];
    await writeSettingsLive({ ...settings, users: updatedUsers });

    const { password_hash: _h, salt: _s, ...safeCreatedUser } = newUser;
    return NextResponse.json({ success: true, user: safeCreatedUser }, { status: 201 });
  } catch (err) {
    console.error("User creation error:", err);
    return NextResponse.json({ error: "Failed to create user account." }, { status: 500 });
  }
}
