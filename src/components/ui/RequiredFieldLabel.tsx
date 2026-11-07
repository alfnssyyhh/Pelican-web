import * as React from "react";
import { FieldLabel } from "@/components/ui/field";

export function RequiredFieldLabel({
  children,
  ...props
}: React.ComponentProps<typeof FieldLabel>) {
  return (
    <FieldLabel {...props}>
      {children}
      <span className="text-destructive font-semibold" aria-hidden="true">
        {" "}*
      </span>
    </FieldLabel>
  );
}
