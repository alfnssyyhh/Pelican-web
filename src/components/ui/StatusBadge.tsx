"use client";

import { cn } from "@/lib/utils";

export type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral";

export interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

export function getStatusVariant(status: string): StatusVariant {
  const s = (status || "").toLowerCase().trim();
  if (["publish", "published", "active", "available", "stock available", "paid", "completed", "instock", "sukses", "selesai"].includes(s)) {
    return "success";
  }
  if (["maintenance", "under maintenance", "pending", "waiting", "in_progress", "scheduled", "baru", "draft", "proses", "contacted"].includes(s)) {
    return "warning";
  }
  if (["rented", "on rental", "overdue", "cancelled", "rusak", "rejected"].includes(s)) {
    return "danger";
  }
  if (["outofstock", "stock unavailable", "unavailable", "habis"].includes(s)) {
    return "neutral";
  }
  if (["quote_sent", "quoted", "review"].includes(s)) {
    return "info";
  }
  return "neutral";
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const v = variant || getStatusVariant(status);

  const variantStyles: Record<StatusVariant, string> = {
    success:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    warning:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    danger:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
    info:
      "bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-muted dark:text-zinc-200 dark:border-border",
    neutral:
      "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-muted dark:text-zinc-300 dark:border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium tracking-wide whitespace-nowrap capitalize",
        variantStyles[v],
        className
      )}
    >
      {status}
    </span>
  );
}
