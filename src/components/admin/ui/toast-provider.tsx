"use client";

import * as React from "react";
import { toast, Toaster, type ToastType } from "@/components/ui/toast";

export type { ToastType };

export interface ToastMessage {
  id: string;
  title: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (title: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextValue>({
  showToast: () => {},
});

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const showToast = React.useCallback((title: string, type: ToastType = "success") => {
    toast.add({
      title,
      type,
      timeout: 3500,
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}

export function useAdminToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    return {
      showToast: (title: string, type: ToastType = "success") => {
        toast.add({ title, type, timeout: 3500 });
      },
    };
  }
  return ctx;
}
