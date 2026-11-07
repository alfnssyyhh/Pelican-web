import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readRfqsLive, writeRfqsLive } from "@/lib/admin-store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Access denied. Session invalid or expired." },
      { status: 401 }
    );
  }
  const rfqs = await readRfqsLive();
  return NextResponse.json(rfqs);
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
    const { name, company, vesselOrProject, phone, category, scope, status, notes } = body;

    if (!name || !String(name).trim() || !phone || !String(phone).trim()) {
      return NextResponse.json(
        { error: "Client name and contact phone are required." },
        { status: 400 }
      );
    }

    const rfqs = await readRfqsLive();
    const newRfq = {
      id: `RFQ-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      name: String(name).trim(),
      company: String(company || "General Commercial").trim(),
      vesselOrProject: String(vesselOrProject || "Marine Vessel / Project").trim(),
      phone: String(phone).trim(),
      category: String(category || "General Marine Engineering").trim(),
      scope: String(scope || "").trim(),
      status: status || "New",
      notes: String(notes || "").trim(),
    };

    rfqs.unshift(newRfq);
    await writeRfqsLive(rfqs);

    return NextResponse.json({
      success: true,
      rfq: newRfq,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to record quotation inquiry." },
      { status: 500 }
    );
  }
}
