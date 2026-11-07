"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MailCheck, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { RfqInquiry } from "@/lib/admin-store";

interface OverviewRecentInquiriesCardProps {
  inquiries: RfqInquiry[];
}

export function OverviewRecentInquiriesCard({ inquiries }: OverviewRecentInquiriesCardProps) {
  const router = useRouter();
  const [selectedRfq, setSelectedRfq] = useState<RfqInquiry | null>(null);

  const openWhatsApp = (rfq: RfqInquiry) => {
    let cleaned = rfq.phone.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.slice(1);
    }
    const message = encodeURIComponent(
      `Halo ${rfq.name}, kami dari PT Pelican Mitra Sejati menindaklanjuti permintaan penawaran (${rfq.id}) untuk kebutuhan: ${rfq.category}.`
    );
    window.open(`https://wa.me/${cleaned}?text=${message}`, "_blank");
  };

  return (
    <>
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2.5 text-[15px] font-semibold text-foreground">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <MailCheck className="size-4" strokeWidth={2.2} />
            </span>
            Recent inquiries (RFQ)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {inquiries.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No inquiries received in this period.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold text-slate-900 dark:text-white">
                    <th className="py-2.5 pr-3 font-semibold">Inquiry #</th>
                    <th className="py-2.5 pr-3 font-semibold">Contact</th>
                    <th className="py-2.5 pr-3 font-semibold">Date</th>
                    <th className="py-2.5 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {inquiries.slice(0, 5).map((rfq) => {
                    const dateStr = rfq.createdAt ? new Date(rfq.createdAt).toLocaleDateString("en-GB") : "-";
                    return (
                      <tr
                        key={rfq.id}
                        onClick={() => setSelectedRfq(rfq)}
                        className="hover:bg-neutral-200/70 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer"
                      >
                        <td className="py-2.5 pr-3 font-bold text-[#dc2626]">
                          <span className="hover:underline text-[#dc2626] font-bold">
                            {rfq.id}
                          </span>
                        </td>
                        <td className="py-2.5 pr-3 max-w-[140px] truncate text-slate-900 dark:text-white font-normal">
                          <span className="truncate">{rfq.name}</span>
                        </td>
                        <td className="py-2.5 pr-3 text-slate-900 dark:text-white whitespace-nowrap font-normal">
                          {dateStr}
                        </td>
                        <td className="py-2.5 text-right">
                          <StatusBadge status={rfq.status || "New"} className="text-[10px]" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-1 text-xs"
            onClick={() => router.push("/admin/rfq")}
          >
            View all inquiries
          </Button>
        </CardContent>
      </Card>

      {/* Inquiry Detail Dialog */}
      <Dialog open={!!selectedRfq} onOpenChange={(open) => !open && setSelectedRfq(null)}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="text-[#dc2626] font-bold text-sm">{selectedRfq?.id}</span>
              <StatusBadge status={selectedRfq?.status || "New"} className="text-[10px]" />
            </div>
            <DialogTitle className="text-lg">
              Quotation Request Details
            </DialogTitle>
            <DialogDescription>
              Client contact and technical scope submitted through the inquiry portal.
            </DialogDescription>
          </DialogHeader>

          {selectedRfq && (
            <div className="flex flex-col gap-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-border bg-muted/30 p-3.5 text-xs">
                <div>
                  <span className="text-muted-foreground font-medium">Client Name:</span>
                  <p className="font-semibold text-foreground text-sm mt-0.5">{selectedRfq.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Company / Yard:</span>
                  <p className="font-semibold text-foreground mt-0.5">{selectedRfq.company || "-"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Vessel / Project:</span>
                  <p className="font-semibold text-foreground mt-0.5">{selectedRfq.vesselOrProject || "-"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium">Contact Phone:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-normal text-foreground">{selectedRfq.phone}</span>
                    <button
                      type="button"
                      onClick={() => openWhatsApp(selectedRfq)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      <MessageCircle className="size-3" /> WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Service Category</label>
                <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground">
                  {selectedRfq.category}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Technical Scope Requested</label>
                <div className="rounded-lg border border-border bg-card p-3 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                  {selectedRfq.scope || "No specific scope provided."}
                </div>
              </div>

              {selectedRfq.notes && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Internal Follow-Up Notes</label>
                  <div className="rounded-lg border border-border bg-card p-3 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                    {selectedRfq.notes}
                  </div>
                </div>
              )}

              <DialogFooter className="flex items-center justify-between gap-2 sm:justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/admin/rfq")}
                >
                  Manage in Inquiries Page
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setSelectedRfq(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
