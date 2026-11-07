"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-h-[300px] w-full items-center justify-center p-8", className)}>
      <div className="flex flex-col items-center gap-2.5">
        <Loader2 className="size-7 animate-spin text-primary" />
        <span className="text-xs font-medium text-muted-foreground">Loading data...</span>
      </div>
    </div>
  );
}
