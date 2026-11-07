import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./separator";

export function Field({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="field"
      className={cn("flex flex-col gap-1.5 w-full", className)}
      {...props}
    />
  );
}

export function FieldLabel({
  className,
  required,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <Label
      data-slot="field-label"
      className={cn("flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-zinc-300", className)}
      {...props}
    >
      {children}
      {required && <span className="text-rose-600 dark:text-rose-400">*</span>}
    </Label>
  );
}

export function FieldDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-xs text-slate-500 font-normal dark:text-zinc-400", className)}
      {...props}
    />
  );
}

export function FieldError({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  if (!children) return null;
  return (
    <p
      data-slot="field-error"
      className={cn("text-xs text-rose-600 font-normal dark:text-rose-400", className)}
      {...props}
    >
      {children}
    </p>
  );
}
