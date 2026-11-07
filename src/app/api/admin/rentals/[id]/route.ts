import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readRentalsLive, writeRentalsLive } from "@/lib/admin-store";

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
  const rentalId = parseInt(id, 10);
  if (isNaN(rentalId)) {
    return NextResponse.json({ error: "Invalid unit ID." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const rentals = await readRentalsLive();
    const index = rentals.findIndex((r) => r.id === rentalId);
    if (index === -1) {
      return NextResponse.json({ error: "Rental unit not found." }, { status: 404 });
    }

    const current = rentals[index];
    const updated = {
      ...current,
      code: body.code !== undefined ? String(body.code).trim() : current.code,
      name: body.name !== undefined ? String(body.name).trim() : current.name,
      kva: body.kva !== undefined ? String(body.kva).trim() : current.kva,
      kw: body.kw !== undefined ? String(body.kw).trim() : current.kw,
      engine: body.engine !== undefined ? String(body.engine).trim() : current.engine,
      canopy: body.canopy !== undefined ? String(body.canopy).trim() : current.canopy,
      voltage: body.voltage !== undefined ? String(body.voltage).trim() : current.voltage,
      fuel_rate: body.fuel_rate !== undefined ? String(body.fuel_rate).trim() : current.fuel_rate,
      noise_level:
        body.noise_level !== undefined ? String(body.noise_level).trim() : current.noise_level,
      status: body.status !== undefined ? body.status : current.status,
      location: body.location !== undefined ? String(body.location).trim() : current.location,
      thumbnail_url:
        body.thumbnail_url !== undefined ? body.thumbnail_url : current.thumbnail_url,
      description:
        body.description !== undefined ? String(body.description).trim() : current.description,
    };

    rentals[index] = updated;
    await writeRentalsLive(rentals);

    return NextResponse.json({
      success: true,
      rental: updated,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update rental fleet unit." },
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
  const rentalId = parseInt(id, 10);
  if (isNaN(rentalId)) {
    return NextResponse.json({ error: "Invalid unit ID." }, { status: 400 });
  }

  try {
    const rentals = await readRentalsLive();
    const index = rentals.findIndex((r) => r.id === rentalId);
    if (index === -1) {
      return NextResponse.json({ error: "Rental unit not found." }, { status: 404 });
    }

    rentals.splice(index, 1);
    await writeRentalsLive(rentals);

    return NextResponse.json({
      success: true,
      message: `Rental unit #${rentalId} successfully deleted.`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete rental unit." },
      { status: 500 }
    );
  }
}
