"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BellRing, ChevronRight, TriangleAlert, Wrench, Clock, FileWarning } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AttentionItem {
  id: string;
  text: string;
  count: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  link: string;
}

export function OverviewNeedAttentionCard({
  pendingRfqCount = 2,
  maintenanceCount = 1,
  lowStockCount = 1,
}: {
  pendingRfqCount?: number;
  maintenanceCount?: number;
  lowStockCount?: number;
}) {
  const router = useRouter();

  const items: AttentionItem[] = [
    {
      id: "rfq",
      text: `${pendingRfqCount} New Quotation Inquiries Awaiting Review`,
      count: pendingRfqCount,
      icon: TriangleAlert,
      iconBg: "bg-red-50 dark:bg-muted",
      iconColor: "text-primary",
      link: "/admin/rfq",
    },
    {
      id: "maintenance",
      text: `${maintenanceCount} Generator Fleet Unit in Scheduled Maintenance`,
      count: maintenanceCount,
      icon: Wrench,
      iconBg: "bg-amber-50 dark:bg-muted",
      iconColor: "text-amber-600 dark:text-amber-400",
      link: "/admin/rentals",
    },
    {
      id: "stock",
      text: `${lowStockCount} Marine Spare Part Catalog Item Needs Review`,
      count: lowStockCount,
      icon: FileWarning,
      iconBg: "bg-slate-100 dark:bg-muted",
      iconColor: "text-slate-700 dark:text-slate-300",
      link: "/admin/products",
    },
  ].filter((item) => item.count > 0);

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2.5 text-[15px] font-semibold text-foreground">
          <BellRing className="size-4 text-orange-500" strokeWidth={2.2} />
          Need Attention
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {items.length} item{items.length > 1 ? "s" : ""} require your action
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => router.push(item.link)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-all duration-150 cursor-pointer",
                "hover:-translate-y-0.5 hover:bg-muted/40 hover:shadow-xs"
              )}
            >
              <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", item.iconBg, item.iconColor)}>
                <Icon className="size-4" strokeWidth={2.2} />
              </span>
              <span className="flex-1 text-xs font-medium text-foreground leading-snug">
                {item.text}
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
