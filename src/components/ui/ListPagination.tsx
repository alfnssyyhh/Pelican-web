"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface ListPaginationProps {
  page: number;
  pageSize: number;
  count: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  disabled?: boolean;
  className?: string;
}

type PageItem = number | "gap";

function buildPages(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const start = Math.max(1, Math.min(current - 2, total - 4));
  const end = Math.min(total, start + 4);
  const items: PageItem[] = [];

  if (start > 1) {
    items.push(1);
    if (start > 2) items.push("gap");
  }
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total) {
    if (end < total - 1) items.push("gap");
    items.push(total);
  }
  return items;
}

export function ListPagination({
  page,
  pageSize,
  count,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  disabled = false,
  className,
}: ListPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const from = count === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, count);
  const pages = buildPages(page, totalPages);

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-x-4 gap-y-2 select-none", className)}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-xs text-muted-foreground">
          Showing {from} to {to} of {count} entries
        </p>
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Show</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(val) => val && onPageSizeChange(Number(val))}
            >
              <SelectTrigger size="sm" className="h-7 w-[68px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-[68px] min-w-0">
                <SelectGroup>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <span>entries</span>
          </div>
        )}
      </div>

      <nav className="flex flex-wrap items-center gap-1" aria-label="Pagination">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1 || disabled}
          className="h-7 px-2.5 text-xs"
        >
          Previous
        </Button>
        {pages.map((item, index) =>
          item === "gap" ? (
            <span key={`gap-${index}`} className="px-1 text-xs text-muted-foreground">
              &hellip;
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={item === page ? "default" : "outline"}
              aria-current={item === page ? "page" : undefined}
              disabled={disabled}
              onClick={() => onPageChange(item)}
              className={cn("size-7 p-0 text-xs", item === page && "font-bold")}
            >
              {item}
            </Button>
          )
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages || disabled}
          className="h-7 px-2.5 text-xs"
        >
          Next
        </Button>
      </nav>
    </div>
  );
}
