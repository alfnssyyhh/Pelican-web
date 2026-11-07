import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readRfqsLive, writeRfqsLive } from "@/lib/admin-store";

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

  try {
    const body = await request.json();
    const rfqs = await readRfqsLive();
    const index = rfqs.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Quotation request not found." }, { status: 404 });
    }

    const current = rfqs[index];
    const updated = {
      ...current,
      name: body.name !== undefined ? String(body.name).trim() : current.name,
      company: body.company !== undefined ? String(body.company).trim() : current.company,
      vesselOrProject:
        body.vesselOrProject !== undefined
          ? String(body.vesselOrProject).trim()
          : current.vesselOrProject,
      phone: body.phone !== undefined ? String(body.phone).trim() : current.phone,
      category: body.category !== undefined ? String(body.category).trim() : current.category,
      scope: body.scope !== undefined ? String(body.scope).trim() : current.scope,
      status: body.status !== undefined ? body.status : current.status,
      notes: body.notes !== undefined ? String(body.notes).trim() : current.notes,
    };

    rfqs[index] = updated;
    await writeRfqsLive(rfqs);

    return NextResponse.json({
      success: true,
      rfq: updated,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update quotation request." },
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

  try {
    const rfqs = await readRfqsLive();
    const index = rfqs.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Quotation request not found." }, { status: 404 });
    }

    rfqs.splice(index, 1);
    await writeRfqsLive(rfqs);

    return NextResponse.json({
      success: true,
      message: "Quotation request successfully deleted.",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete quotation request." },
      { status: 500 }
    );
  }
}
