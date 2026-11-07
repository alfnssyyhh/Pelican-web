import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import {
  readRfqsLive,
  writeRfqsLive,
  readNotificationsLive,
  writeNotificationsLive,
  NotificationItem,
} from "@/lib/admin-store";

// In-memory sliding-window rate limiting for public RFQ submissions
// Max 5 submissions per 10 minutes per IP
const submissionAttempts = new Map<string, { count: number; lastAttempt: number }>();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "local";
    const now = Date.now();
    const clientAttempts = submissionAttempts.get(ip) || { count: 0, lastAttempt: now };

    // Reset attempt counter after 10 minutes of inactivity
    if (now - clientAttempts.lastAttempt > 10 * 60 * 1000) {
      clientAttempts.count = 0;
    }

    if (clientAttempts.count >= 5) {
      const waitMinutes = Math.ceil((10 * 60 * 1000 - (now - clientAttempts.lastAttempt)) / 1000 / 60);
      return NextResponse.json(
        {
          error: `Terlalu banyak permintaan penawaran dari perangkat Anda. Silakan tunggu ${waitMinutes} menit sebelum mencoba lagi.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, company, vesselOrProject, phone, category, scope, hp_bot_check } = body;

    // Honeypot spam trap
    if (hp_bot_check && String(hp_bot_check).trim() !== "") {
      return NextResponse.json(
        { error: "Invalid submission detected." },
        { status: 400 }
      );
    }

    if (!name || !phone || !scope) {
      return NextResponse.json(
        { error: "Nama, nomor telepon/WhatsApp, dan ruang lingkup proyek wajib diisi." },
        { status: 400 }
      );
    }

    // Input sanitization and length bounds
    const sanitizedName = String(name).trim().slice(0, 100);
    const sanitizedPhone = String(phone).trim().slice(0, 30);
    const sanitizedCompany = String(company || "Umum").trim().slice(0, 120);
    const sanitizedVessel = String(vesselOrProject || "Kapal atau Proyek").trim().slice(0, 120);
    const sanitizedCategory = String(category || "General Marine Engineering").trim().slice(0, 100);
    const sanitizedScope = String(scope || "").trim().slice(0, 2000);

    const newRfq = {
      id: `RFQ-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      name: sanitizedName,
      company: sanitizedCompany,
      vesselOrProject: sanitizedVessel,
      phone: sanitizedPhone,
      category: sanitizedCategory,
      scope: sanitizedScope,
      status: "Baru",
      notes: "",
    };

    // Save RFQ to live data store
    const existingRfqs = await readRfqsLive();
    existingRfqs.unshift(newRfq);
    await writeRfqsLive(existingRfqs);

    // Auto-create notification in Admin Notifications Center
    try {
      const notifications = await readNotificationsLive();
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: "New RFQ Inquiry",
        message: `Quotation request from ${sanitizedCompany} (${sanitizedName}) for ${sanitizedCategory}.`,
        type: "rfq",
        link: "/admin/rfq",
        is_read: false,
        created_at: new Date().toISOString(),
      };
      notifications.unshift(newNotif);
      await writeNotificationsLive(notifications);
    } catch (notifErr) {
      console.error("Failed to append notification for RFQ:", notifErr);
    }

    // Track submission count for rate limiting
    clientAttempts.count += 1;
    clientAttempts.lastAttempt = now;
    submissionAttempts.set(ip, clientAttempts);

    const waText = [
      `*OFFICIAL RFQ INQUIRY: PT PELICAN MITRA SEJATI*`,
      `*Client Name:* ${newRfq.name}`,
      `*Company / Shipyard:* ${newRfq.company}`,
      `*Vessel / Project:* ${newRfq.vesselOrProject}`,
      `*Contact Phone:* ${newRfq.phone}`,
      `*Service Category:* ${newRfq.category}`,
      `*Technical Scope:*`,
      `${newRfq.scope}`,
      `_Ref: ${newRfq.id}_`,
    ].join("\n");

    const waUrl = `https://wa.me/6287787806333?text=${encodeURIComponent(waText)}`;

    return NextResponse.json({
      success: true,
      rfqId: newRfq.id,
      waUrl,
    });
  } catch (error: any) {
    console.error("RFQ Submission Error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pengajuan penawaran harga." },
      { status: 500 }
    );
  }
}

// SEC-01 Fix: Disallow unauthenticated public data extraction.
// Only authenticated admin session can read RFQ records.
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Akses ditolak. Endpoint ini hanya dapat diakses oleh sesi Admin resmi." },
      { status: 401 }
    );
  }

  try {
    const rfqs = await readRfqsLive();
    return NextResponse.json(rfqs);
  } catch {
    return NextResponse.json([]);
  }
}
