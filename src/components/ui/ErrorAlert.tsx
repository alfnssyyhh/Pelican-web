"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorAlertProps {
  message: string | null | undefined;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorAlert({
  message,
  onRetry,
  retryLabel = "Retry",
  className,
}: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <AlertCircle className="size-4 shrink-0 text-red-600 dark:text-red-400" />
        <span className="font-medium">{message}</span>
      </div>
      {onRetry && (
        <Button
          size="xs"
          variant="outline"
          onClick={onRetry}
          className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/40"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
