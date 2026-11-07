"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Gauge, ShieldCheck, Flame, Volume2 } from "lucide-react";
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
import type { RentalUnit } from "@/lib/admin-store";

interface OverviewScheduleCardProps {
  rentals: RentalUnit[];
}

export function OverviewScheduleCard({ rentals }: OverviewScheduleCardProps) {
  const router = useRouter();
  const [selectedRental, setSelectedRental] = useState<RentalUnit | null>(null);

  const activeRentals = rentals.slice(0, 4);

  return (
    <>
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="flex items-center gap-2.5 text-[15px] font-semibold text-foreground">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                <CalendarDays className="size-4" strokeWidth={2} />
              </span>
              Active Rental Deployments
            </CardTitle>
            <Button
              variant="outline"
              size="xs"
              onClick={() => router.push("/admin/rentals")}
            >
              View All
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-2.5">
          {activeRentals.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No active rental units deployed.
            </div>
          ) : (
            activeRentals.map((unit, idx) => {
              const isRented = unit.status === "rented";
              return (
                <div
                  key={unit.id || idx}
                  onClick={() => setSelectedRental(unit)}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <div className="min-w-0 flex-1 truncate flex items-center gap-2">
                    <span className="font-bold text-xs text-[#dc2626] shrink-0">
                      {unit.code}
                    </span>
                    <span className="text-xs font-normal text-foreground group-hover:underline truncate">
                      {unit.name}
                    </span>
                  </div>

                  <div className="shrink-0 text-right">
                    <StatusBadge
                      status={isRented ? "Rented" : unit.status === "available" ? "Available" : "Maintenance"}
                      className="text-[10px]"
                    />
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Rental Deployment Detail Dialog */}
      <Dialog open={!!selectedRental} onOpenChange={(open) => !open && setSelectedRental(null)}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="text-[#dc2626] font-bold text-sm">{selectedRental?.code}</span>
              <StatusBadge
                status={
                  selectedRental?.status === "rented"
                    ? "Rented"
                    : selectedRental?.status === "available"
                    ? "Available"
                    : "Maintenance"
                }
                className="text-[10px]"
              />
            </div>
            <DialogTitle className="text-lg">
              Rental Generator Fleet Details
            </DialogTitle>
            <DialogDescription>
              Technical specifications and deployment readiness status for this unit.
            </DialogDescription>
          </DialogHeader>

          {selectedRental && (
            <div className="flex flex-col gap-4 py-2">
              <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-xs flex flex-col gap-2">
                <span className="text-muted-foreground font-medium">Unit Name:</span>
                <p className="font-semibold text-foreground text-sm">{selectedRental.name}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-border bg-card p-3.5 text-xs">
                <div className="flex items-start gap-2">
                  <Gauge className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground font-medium">Power Rating:</span>
                    <p className="font-semibold text-foreground mt-0.5">
                      {selectedRental.kva} ({selectedRental.kw})
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <ShieldCheck className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground font-medium">Engine Model:</span>
                    <p className="font-semibold text-foreground mt-0.5">{selectedRental.engine || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground font-medium">Yard Location:</span>
                    <p className="font-semibold text-foreground mt-0.5">{selectedRental.location || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <ShieldCheck className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground font-medium">Canopy & Enclosure:</span>
                    <p className="font-semibold text-foreground mt-0.5">{selectedRental.canopy || "-"}</p>
                  </div>
                </div>

                {selectedRental.fuel_rate && (
                  <div className="flex items-start gap-2">
                    <Flame className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <span className="text-muted-foreground font-medium">Fuel Consumption:</span>
                      <p className="font-semibold text-foreground mt-0.5">{selectedRental.fuel_rate}</p>
                    </div>
                  </div>
                )}

                {selectedRental.voltage && (
                  <div className="flex items-start gap-2">
                    <Gauge className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <span className="text-muted-foreground font-medium">Operating Voltage:</span>
                      <p className="font-semibold text-foreground mt-0.5">{selectedRental.voltage}</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedRental.description && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-foreground">Fleet Description & Scope</label>
                  <div className="rounded-lg border border-border bg-card p-3 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                    {selectedRental.description}
                  </div>
                </div>
              )}

              <DialogFooter className="flex items-center justify-between gap-2 sm:justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/admin/rentals")}
                >
                  Manage in Rentals Fleet
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setSelectedRental(null)}
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
