"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DateFilterState {
  preset: string;
  startDate: string;
  endDate: string;
}

interface ReportDateFilterProps {
  filter: DateFilterState;
  onChange: (newFilter: DateFilterState) => void;
  className?: string;
}

export function getPresetDateRange(preset: string): { startDate: string; endDate: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const toISO = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  switch (preset) {
    case "this_month": {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0);
      return { startDate: toISO(start), endDate: toISO(end) };
    }
    case "last_month": {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      return { startDate: toISO(start), endDate: toISO(end) };
    }
    case "last_3m": {
      const start = new Date(now);
      start.setDate(start.getDate() - 90);
      return { startDate: toISO(start), endDate: toISO(now) };
    }
    case "last_6m": {
      const start = new Date(now);
      start.setDate(start.getDate() - 180);
      return { startDate: toISO(start), endDate: toISO(now) };
    }
    case "this_year": {
      const start = new Date(year, 0, 1);
      return { startDate: toISO(start), endDate: toISO(now) };
    }
    case "last_year": {
      const start = new Date(year - 1, 0, 1);
      const end = new Date(year - 1, 11, 31);
      return { startDate: toISO(start), endDate: toISO(end) };
    }
    case "all": {
      return { startDate: "", endDate: "" };
    }
    default:
      return { startDate: "", endDate: "" };
  }
}

const PRESETS = [
  { id: "this_month", label: "This Month" },
  { id: "last_month", label: "Last Month" },
  { id: "last_3m", label: "Last 3 Months" },
  { id: "last_6m", label: "Last 6 Months" },
  { id: "this_year", label: "This Year" },
  { id: "last_year", label: "Last Year" },
  { id: "all", label: "All Time" },
];

function formatDateDisplay(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function ReportDateFilter({ filter, onChange, className }: ReportDateFilterProps) {
  const [open, setOpen] = useState(false);
  const [customStart, setCustomStart] = useState(filter.startDate);
  const [customEnd, setCustomEnd] = useState(filter.endDate);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomStart(filter.startDate);
    setCustomEnd(filter.endDate);
  }, [filter]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const handleSelectPreset = (presetId: string) => {
    const range = getPresetDateRange(presetId);
    onChange({
      preset: presetId,
      startDate: range.startDate,
      endDate: range.endDate,
    });
    setOpen(false);
  };

  const handleApplyCustom = () => {
    if (customStart && customEnd) {
      onChange({
        preset: "custom",
        startDate: customStart,
        endDate: customEnd,
      });
      setOpen(false);
    }
  };

  const displayText =
    filter.startDate && filter.endDate
      ? `${formatDateDisplay(filter.startDate)} → ${formatDateDisplay(filter.endDate)}`
      : "All Dates";

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-xs hover:bg-muted"
      >
        <Calendar className="size-3.5 text-muted-foreground" />
        <span>{displayText}</span>
        <ChevronDown className="size-3 text-muted-foreground" />
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-1.5 w-80 isolate rounded-xl border border-border bg-card p-3.5 shadow-2xl ring-1 ring-foreground/10">
          <div className="mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Date Range Preset
          </div>
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {PRESETS.map((p) => {
              const active = filter.preset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p.id)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer text-left",
                    active
                      ? "bg-primary text-white font-medium"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <span>{p.label}</span>
                  {active && <Check className="size-3 text-white" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-border pt-3">
            <div className="mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Custom Range
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-2.5 py-1 text-xs text-foreground outline-none transition-colors focus:border-ring"
                />
                <span className="text-xs text-muted-foreground font-medium shrink-0">to</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-2.5 py-1 text-xs text-foreground outline-none transition-colors focus:border-ring"
                />
              </div>
              <Button
                type="button"
                size="sm"
                onClick={handleApplyCustom}
                disabled={!customStart || !customEnd}
                className="w-full h-8 text-xs font-medium mt-1"
              >
                Apply Range
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
