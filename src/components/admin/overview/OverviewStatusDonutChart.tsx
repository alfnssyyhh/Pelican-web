"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PieChart, CheckCircle2, Clock, Wrench, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StatusSegment {
  label: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

interface OverviewStatusDonutChartProps {
  totalCount?: number;
  availableCount?: number;
  rentedCount?: number;
  maintenanceCount?: number;
  reservedCount?: number;
}

export function OverviewStatusDonutChart({
  totalCount = 18,
  availableCount = 9,
  rentedCount = 5,
  maintenanceCount = 2,
  reservedCount = 2,
}: OverviewStatusDonutChartProps) {
  const router = useRouter();

  const segments: StatusSegment[] = [
    {
      label: "In Stock / Available",
      count: availableCount,
      color: "#10b981", // emerald
      icon: <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      label: "On Hire / Active",
      count: rentedCount,
      color: "#dc2626", // pelican red
      icon: <Clock className="size-3.5 text-primary" />,
    },
    {
      label: "Under Maintenance",
      count: maintenanceCount,
      color: "#f59e0b", // amber
      icon: <Wrench className="size-3.5 text-amber-600 dark:text-amber-400" />,
    },
    {
      label: "Reserved / Quoted",
      count: reservedCount,
      color: "#8b5cf6", // purple
      icon: <ShieldAlert className="size-3.5 text-purple-600 dark:text-purple-400" />,
    },
  ];

  const total = totalCount || segments.reduce((sum, s) => sum + s.count, 0) || 1;
  const radius = 65;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;
  const slices = segments.map((seg) => {
    const sliceLen = (seg.count / total) * circumference;
    const drawLen = Math.max(0, sliceLen - 3);
    const offset = (cumulative / total) * circumference;
    cumulative += seg.count;
    return { ...seg, drawLen, offset };
  });

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
            <PieChart className="size-4 text-purple-600 dark:text-purple-400" strokeWidth={2.2} />
            Fleet & Catalog Status
          </CardTitle>
          <Button
            variant="outline"
            size="xs"
            onClick={() => router.push("/admin/products")}
          >
            View Catalog
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-1">
        {/* SVG Donut */}
        <div className="mx-auto flex aspect-square w-[180px] max-w-full items-center justify-center">
          <svg width="180" height="180" viewBox="0 0 180 180" className="max-w-full">
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="16"
              className="text-muted/60"
            />
            {slices.map((slice, idx) => (
              <circle
                key={idx}
                cx="90"
                cy="90"
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth="16"
                strokeDasharray={`${slice.drawLen} ${circumference}`}
                strokeDashoffset={-slice.offset}
                transform="rotate(-90 90 90)"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            ))}
            <text
              x="90"
              y="86"
              textAnchor="middle"
              className="fill-foreground text-2xl font-bold tracking-tight"
            >
              {total}
            </text>
            <text
              x="90"
              y="104"
              textAnchor="middle"
              className="fill-muted-foreground text-[11px] font-medium"
            >
              Total Assets
            </text>
          </svg>
        </div>

        {/* 2x2 Legend Cards */}
        <div className="grid grid-cols-2 gap-2">
          {segments.map((seg, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-xl border border-border bg-card p-2.5 transition-colors hover:bg-muted/40"
            >
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                {seg.icon}
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="text-sm font-semibold text-foreground">{seg.count}</div>
                <div className="text-[10px] text-muted-foreground truncate">{seg.label}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
