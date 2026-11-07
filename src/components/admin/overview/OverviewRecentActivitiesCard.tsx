"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Mail, CheckCircle, Truck, Package, Edit3, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface ActivityItem {
  id: string;
  time: string;
  text: string;
  code?: string;
  link?: string;
  iconType: "mail" | "check" | "truck" | "product" | "edit";
  detail?: {
    entityType: string;
    description: string;
    actor?: string;
    status?: string;
    detailsList?: { label: string; value: string }[];
  };
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    time: "12:54",
    text: "PT Samudera Marine Shipyard",
    code: "RFQ-20261101",
    link: "/admin/rfq",
    iconType: "mail",
    detail: {
      entityType: "Quotation Inquiry (RFQ)",
      description: "Submitted quotation request for Yanmar Diesel Generator 100 kVA rental package.",
      actor: "Budi Santoso (PT Samudera Marine)",
      status: "New",
      detailsList: [
        { label: "Client Name", value: "Budi Santoso" },
        { label: "Company", value: "PT Samudera Marine Shipyard" },
        { label: "Category", value: "Genset Rental" },
        { label: "Contact Phone", value: "+62 812-7788-9900" },
      ],
    },
  },
  {
    id: "act-2",
    time: "11:20",
    text: "PaxOcean Batam Mobilization",
    code: "GEN-100",
    link: "/admin/rentals",
    iconType: "truck",
    detail: {
      entityType: "Active Rental Mobilization",
      description: "Unit GEN-100 mobilised and deployed to PaxOcean Shipyard Batam Tanjung Uncang.",
      actor: "Logistics Team",
      status: "Rented",
      detailsList: [
        { label: "Unit Model", value: "Cummins 100 kVA Silent Genset" },
        { label: "Location", value: "PaxOcean Shipyard Batam" },
        { label: "Duration", value: "3 Months Deployment" },
        { label: "Technician", value: "Ahmad Rivai" },
      ],
    },
  },
  {
    id: "act-3",
    time: "09:45",
    text: "Marine Automation Systems",
    code: "POST-554",
    link: "/admin/posts",
    iconType: "edit",
    detail: {
      entityType: "Technical Article Publication",
      description: "Published technical knowledge-base article on Marine Automation Systems & SCADA telemetry integration.",
      actor: "Pelican Content Editor",
      status: "Published",
      detailsList: [
        { label: "Article Title", value: "Marine Automation Systems Integration" },
        { label: "Author", value: "Technical Team" },
        { label: "Category", value: "Engineering & Automation" },
      ],
    },
  },
  {
    id: "act-4",
    time: "Yesterday",
    text: "Fuel Sensor DUT-E Technoton",
    code: "PROD-493",
    link: "/admin/products",
    iconType: "product",
    detail: {
      entityType: "Spare Part Inventory Update",
      description: "Inventory stock count updated for Fuel Level Sensor DUT-E Technoton (Batam warehouse).",
      actor: "Inventory Admin",
      status: "In Stock",
      detailsList: [
        { label: "SKU / Part Number", value: "DUTE-485-1000" },
        { label: "Brand", value: "Technoton" },
        { label: "Current Stock", value: "2 Units (Low Stock Warning)" },
      ],
    },
  },
  {
    id: "act-5",
    time: "Yesterday",
    text: "MV Meratus Batam Installation",
    code: "WRK-108",
    link: "/admin/works",
    iconType: "check",
    detail: {
      entityType: "Project Portfolio Completion",
      description: "Successfully finalized complete generator synchronization and load bank test on MV Meratus Batam.",
      actor: "Marine Field Service Team",
      status: "Completed",
      detailsList: [
        { label: "Vessel Name", value: "MV Meratus Batam" },
        { label: "Scope of Work", value: "Load Bank Testing & Switchboard Automation" },
        { label: "Location", value: "Batu Ampar Port, Batam" },
      ],
    },
  },
];

export function OverviewRecentActivitiesCard({
  activities = DEFAULT_ACTIVITIES,
}: {
  activities?: ActivityItem[];
}) {
  const router = useRouter();
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const getIcon = (type: ActivityItem["iconType"]) => {
    switch (type) {
      case "mail":
        return <Mail className="size-3.5 text-sky-600 dark:text-sky-400" />;
      case "check":
        return <CheckCircle className="size-3.5 text-emerald-600 dark:text-emerald-400" />;
      case "truck":
        return <Truck className="size-3.5 text-blue-600 dark:text-blue-400" />;
      case "product":
        return <Package className="size-3.5 text-purple-600 dark:text-purple-400" />;
      case "edit":
      default:
        return <Edit3 className="size-3.5 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <>
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="flex items-center gap-2.5 text-[15px] font-semibold text-foreground">
              <Activity className="size-4 text-slate-500" strokeWidth={2.2} />
              Recent Activities
            </CardTitle>
            <Button
              variant="outline"
              size="xs"
              onClick={() => router.push("/admin/rfq")}
            >
              View All
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col divide-y divide-border pt-0">
          {activities.map((act) => (
            <div
              key={act.id}
              onClick={() => setSelectedActivity(act)}
              className="group flex items-center gap-3 py-3 text-xs cursor-pointer hover:bg-muted/40 px-2 -mx-2 rounded-lg transition-colors"
            >
              <span className="w-14 shrink-0 text-right text-[11px] font-normal text-muted-foreground group-hover:text-foreground transition-colors">
                {act.time}
              </span>
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted group-hover:bg-card border border-transparent group-hover:border-border transition-colors">
                {getIcon(act.iconType)}
              </div>
              <div className="min-w-0 flex-1 truncate text-foreground font-normal group-hover:underline">
                {act.text}
              </div>
              {act.code && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedActivity(act);
                  }}
                  className="shrink-0 font-bold text-[11px] text-[#dc2626] hover:underline cursor-pointer"
                >
                  {act.code}
                </button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Detail Dialog for Activity Item */}
      <Dialog open={!!selectedActivity} onOpenChange={(open) => !open && setSelectedActivity(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="text-[#dc2626] font-bold text-sm">
                {selectedActivity?.code || selectedActivity?.id}
              </span>
              {selectedActivity?.detail?.status && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground">
                  {selectedActivity.detail.status}
                </span>
              )}
            </div>
            <DialogTitle className="text-base font-semibold text-foreground mt-1">
              {selectedActivity?.text}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {selectedActivity?.detail?.entityType || "System Activity Log"} · {selectedActivity?.time}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {selectedActivity?.detail?.description && (
              <p className="rounded-lg bg-muted/50 p-3 leading-relaxed text-foreground">
                {selectedActivity.detail.description}
              </p>
            )}

            {selectedActivity?.detail?.detailsList && (
              <div className="rounded-lg border border-border divide-y divide-border">
                {selectedActivity.detail.detailsList.map((item, idx) => (
                  <div key={idx} className="flex justify-between p-2.5">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between border-t border-border pt-3">
            {selectedActivity?.link ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-primary"
                onClick={() => {
                  const target = selectedActivity.link;
                  setSelectedActivity(null);
                  if (target) router.push(target);
                }}
              >
                Go to Module Page
                <ExternalLink className="size-3.5" />
              </Button>
            ) : <div />}
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => setSelectedActivity(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
