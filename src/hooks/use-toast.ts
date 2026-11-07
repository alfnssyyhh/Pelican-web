import { useCallback } from "react";
import { toast, type ToastType } from "@/components/ui/toast";

export type { ToastType };

export interface ShowToastOptions {
  description?: string;
  type?: ToastType;
  duration?: number;
}

export function useToast(defaultDuration = 3500) {
  const showToast = useCallback(
    (message: string, typeOrOptions: ToastType | ShowToastOptions = "success") => {
      let type: ToastType = "success";
      let description: string | undefined;
      let duration = defaultDuration;

      if (typeof typeOrOptions === "string") {
        type = typeOrOptions;
      } else if (typeOrOptions && typeof typeOrOptions === "object") {
        if (typeOrOptions.type) type = typeOrOptions.type;
        if (typeOrOptions.description) description = typeOrOptions.description;
        if (typeOrOptions.duration) duration = typeOrOptions.duration;
      }

      toast.add({
        title: message,
        description,
        type,
        timeout: duration,
      });
    },
    [defaultDuration]
  );

  return { toast, showToast };
}
