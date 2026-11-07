"use client";

import React, { useId, useState, useRef, useEffect, useMemo } from "react";
import { Search, RotateCcw, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ListToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
  suggestions?: string[];
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
}

export function ListToolbar({
  search,
  onSearchChange,
  placeholder = "Cari...",
  className,
  children,
  suggestions = [],
  onResetFilters,
  hasActiveFilters = false,
}: ListToolbarProps) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute matched suggestions starting from 1 character
  const matchedSuggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q || suggestions.length === 0) return [];
    const unique = Array.from(new Set(suggestions));
    return unique
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 6);
  }, [search, suggestions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || matchedSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1 < matchedSuggestions.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : matchedSuggestions.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      onSearchChange(matchedSuggestions[activeIndex]);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleSelect = (item: string) => {
    onSearchChange(item);
    setOpen(false);
  };

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2.5">
        {children}
        {hasActiveFilters && onResetFilters && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onResetFilters}
            className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3" />
            <span>Reset filters</span>
          </Button>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative flex items-center min-w-[220px] max-w-xs w-full sm:w-auto"
      >
        <Search className="absolute left-2.5 size-4 text-muted-foreground pointer-events-none" />
        <Input
          id={inputId}
          type="search"
          value={search}
          placeholder={placeholder}
          onFocus={() => {
            if (matchedSuggestions.length > 0) setOpen(true);
          }}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className="h-8 pl-8 text-xs bg-white dark:bg-card border-border w-full"
        />

        {/* Live Search Recommendations Floating Popover */}
        {open && matchedSuggestions.length > 0 && (
          <div className="absolute left-0 top-full mt-1 w-full min-w-[280px] z-50 rounded-xl border border-border bg-popover p-1.5 shadow-lg ring-1 ring-black/5 dark:ring-white/10 animate-in fade-in-50 zoom-in-95">
            <div className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Search Recommendations
            </div>
            <ul className="space-y-0.5">
              {matchedSuggestions.map((item, idx) => {
                const query = search.trim().toLowerCase();
                const matchIndex = item.toLowerCase().indexOf(query);
                const isActive = idx === activeIndex;

                let renderedText: React.ReactNode = item;
                if (matchIndex !== -1) {
                  const before = item.slice(0, matchIndex);
                  const matched = item.slice(matchIndex, matchIndex + query.length);
                  const after = item.slice(matchIndex + query.length);
                  renderedText = (
                    <>
                      {before}
                      <span className="font-semibold text-primary underline underline-offset-2">
                        {matched}
                      </span>
                      {after}
                    </>
                  );
                }

                return (
                  <li
                    key={item}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => handleSelect(item)}
                    className={cn(
                      "flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs cursor-pointer transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <span className="truncate pr-2">{renderedText}</span>
                    <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
