import { NextResponse } from "next/server";
import { verifyCredentials, createSessionToken, SESSION_COOKIE, SESSION_EXPIRY } from "@/lib/auth";

// In-memory rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local";
    const now = Date.now();
    const clientAttempts = loginAttempts.get(ip) || { count: 0, lastAttempt: now };

    // Reset attempt counter after 15 minutes of inactivity
    if (now - clientAttempts.lastAttempt > 15 * 60 * 1000) {
      clientAttempts.count = 0;
    }

    // Block if more than 5 failed attempts within 15 minutes
    if (clientAttempts.count >= 5) {
      const waitTime = Math.ceil((15 * 60 * 1000 - (now - clientAttempts.lastAttempt)) / 1000 / 60);
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please wait ${waitTime} minute(s) before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const authResult = await verifyCredentials(username, password);

    if (!authResult.isValid) {
      clientAttempts.count += 1;
      clientAttempts.lastAttempt = now;
      loginAttempts.set(ip, clientAttempts);

      // Artificial sleep 500ms to neutralize timing attacks
      await new Promise((r) => setTimeout(r, 500));

      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Reset counter on successful login
    loginAttempts.delete(ip);

    const token = await createSessionToken(authResult.username, authResult.role);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
      user: {
        username: authResult.username,
        role: authResult.role,
        display_name: authResult.display_name,
      },
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY,
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error occurred during authentication." },
      { status: 500 }
    );
  }
}
