import { NextResponse } from "next/server";
import { getAdminSession, hashPassword, generateSalt } from "@/lib/auth";
import { readSettingsLive, writeSettingsLive } from "@/lib/admin-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Invalid or expired session." },
      { status: 401 }
    );
  }

  try {
    const settings = await readSettingsLive();
    const users = settings.users || [];
    const matched = users.find(
      (u) => u.username.toLowerCase() === session.username.toLowerCase()
    );

    const displayName =
      matched?.display_name ||
      (session.username === "admin" ? "Principal Administrator" : session.username);
    const email =
      matched?.email ||
      (session.username === "admin" ? settings.general?.email || "admin@pelican-ms.com" : "");
    const phone =
      (matched as any)?.phone ||
      settings.general?.phone ||
      "+62 811-7019-338";
    const role =
      matched?.role || (session.role === "admin" ? "Super Admin" : "Operations Officer");
    const department =
      matched?.department || (session.role === "admin" ? "Operations & Engineering Division" : "Operations Management");
    const position =
      (matched as any)?.position ||
      (session.role === "admin" ? "Chief Systems Administrator" : "Operations Specialist");
    const employment_type = (matched as any)?.employment_type || "Full-time";
    const location = (matched as any)?.location || "Tiban Baru, Sekupang, Batam";
    const hire_date = (matched as any)?.hire_date || "2021-03-15";
    const emergency_contact_name =
      (matched as any)?.emergency_contact_name || "Pelican Operational Command Center";
    const emergency_contact_phone =
      (matched as any)?.emergency_contact_phone || "+62 811-7019-338";

    const initials =
      displayName
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "PA";

    return NextResponse.json({
      username: session.username,
      display_name: displayName,
      email,
      phone,
      role,
      department,
      position,
      employment_type,
      location,
      hire_date,
      emergency_contact_name,
      emergency_contact_phone,
      initials,
    });
  } catch (error) {
    console.error("[profile-get] Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to load profile." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Invalid or expired session." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const settings = await readSettingsLive();
    const users = settings.users || [];
    const index = users.findIndex(
      (u) => u.username.toLowerCase() === session.username.toLowerCase()
    );

    const isSuperAdmin = session.username.toLowerCase() === "admin";
    const matched = index !== -1 ? users[index] : null;

    // Handle password change if requested
    if (body.newPassword) {
      const newPass = String(body.newPassword).trim();
      const currentPass = String(body.currentPassword || "").trim();

      if (newPass.length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters long." },
          { status: 400 }
        );
      }

      if (!currentPass) {
        return NextResponse.json(
          { error: "Current password is required to set a new password." },
          { status: 400 }
        );
      }

      // Verify current password
      let isValidCurrent = false;
      if (isSuperAdmin) {
        const adminPassEnv = process.env.ADMIN_PASSWORD || "admin123";
        isValidCurrent = currentPass === adminPassEnv;
      } else if (matched && matched.password_hash && matched.salt) {
        const computed = await hashPassword(currentPass, matched.salt);
        isValidCurrent = computed === matched.password_hash;
      }

      if (!isValidCurrent) {
        return NextResponse.json(
          { error: "Current password does not match. Please verify and try again." },
          { status: 400 }
        );
      }

      // Hash and apply new password
      const newSalt = generateSalt();
      const newHash = await hashPassword(newPass, newSalt);

      if (matched) {
        matched.password_hash = newHash;
        matched.salt = newSalt;
      }
    }

    // Update profile info
    if (matched) {
      if (body.display_name) matched.display_name = String(body.display_name).trim();
      if (body.email) matched.email = String(body.email).trim();
      if (body.department) matched.department = String(body.department).trim();
      if (body.phone) (matched as any).phone = String(body.phone).trim();
      if (body.position) (matched as any).position = String(body.position).trim();
      if (body.location) (matched as any).location = String(body.location).trim();
      if (body.emergency_contact_name)
        (matched as any).emergency_contact_name = String(body.emergency_contact_name).trim();
      if (body.emergency_contact_phone)
        (matched as any).emergency_contact_phone = String(body.emergency_contact_phone).trim();

      users[index] = matched;
    }

    if (isSuperAdmin && settings.general) {
      if (body.email) settings.general.email = String(body.email).trim();
      if (body.phone) settings.general.phone = String(body.phone).trim();
    }

    settings.users = users;
    await writeSettingsLive(settings);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error("[profile-put] Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
