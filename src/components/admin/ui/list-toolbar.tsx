"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ListToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  className?: string;
}

export function ListToolbar({
  search,
  onSearchChange,
  placeholder = "Ketik kata kunci pencarian...",
  children,
  className,
}: ListToolbarProps) {
  const inputId = React.useId();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5">{children}</div>
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <label
          htmlFor={inputId}
          className="shrink-0 text-xs font-normal text-slate-500 dark:text-zinc-400"
        >
          Cari:
        </label>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
          <Input
            id={inputId}
            type="search"
            value={search}
            placeholder={placeholder}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
