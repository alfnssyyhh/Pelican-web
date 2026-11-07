import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconClassName?: string;
  subtext?: string;
  subtextClassName?: string;
  onClick?: () => void;
}

function renderSubtextWithNumbers(text: string, className?: string) {
  const parts = text.split(/(\d+(?:\.\d+)?)/g);
  return (
    <span className={cn("text-xs font-normal inline-flex items-center gap-1 text-slate-500 dark:text-zinc-400", className)}>
      {parts.map((part, i) =>
        /^\d+(?:\.\d+)?$/.test(part) ? (
          <strong key={i} className="font-semibold text-slate-800 dark:text-zinc-200">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export function KpiCard({
  title,
  value,
  icon,
  iconClassName,
  subtext,
  subtextClassName,
  onClick,
}: KpiCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-4 transition-colors dark:border-zinc-800 dark:bg-zinc-900",
        onClick && "cursor-pointer hover:border-slate-300 dark:hover:border-zinc-700"
      )}
    >
      <CardContent className="flex items-center gap-4 p-0">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
            iconClassName
          )}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-slate-500 dark:text-zinc-400">
            {title}
          </div>
          <div className="mt-0.5 text-2xl font-semibold leading-tight text-slate-900 dark:text-zinc-50">
            {value}
          </div>
          {subtext && (
            <div className="mt-1">
              {renderSubtextWithNumbers(subtext, subtextClassName)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
