import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readRentalsLive, writeRentalsLive } from "@/lib/admin-store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Session invalid or expired." },
      { status: 401 }
    );
  }
  const rentals = await readRentalsLive();
  return NextResponse.json(rentals);
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
      code,
      name,
      kva,
      kw,
      engine,
      canopy,
      voltage,
      fuel_rate,
      noise_level,
      status,
      location,
      thumbnail_url,
      description,
    } = body;

    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: "Generator unit name is required." }, { status: 400 });
    }

    const rentals = await readRentalsLive();
    const newId = rentals.length > 0 ? Math.max(...rentals.map((r) => r.id)) + 1 : 101;

    const newUnit = {
      id: newId,
      code: String(code || `GEN-${newId}`).trim(),
      name: String(name).trim(),
      kva: String(kva || "100 kVA").trim(),
      kw: String(kw || "80 kW").trim(),
      engine: String(engine || "Cummins Marine Series").trim(),
      canopy: String(canopy || "Soundproof Canopy").trim(),
      voltage: String(voltage || "380V / 220V 3-Phase").trim(),
      fuel_rate: String(fuel_rate || "18.5 L/hr").trim(),
      noise_level: String(noise_level || "72 dBA @ 7m").trim(),
      status: status || "available",
      location: String(location || "Batam Workshop Yard").trim(),
      thumbnail_url: thumbnail_url ? String(thumbnail_url).trim() : "/uploads/2026/01/genset1.jpg",
      description: String(description || "").trim(),
    };

    rentals.unshift(newUnit);
    await writeRentalsLive(rentals);

    return NextResponse.json({
      success: true,
      rental: newUnit,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create rental fleet unit." },
      { status: 500 }
    );
  }
}
