import type { Metadata } from "next";
import { ThemeProvider } from "@/components/admin/theme-provider";
import { AdminToastProvider } from "@/components/admin/ui/toast-provider";

export const metadata: Metadata = {
  title: "Pelican Admin",
  description: "Management Console for PT Pelican Mitra Sejati",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AdminToastProvider>
        <div className="min-h-screen bg-background text-foreground antialiased transition-colors">
          {children}
        </div>
      </AdminToastProvider>
    </ThemeProvider>
  );
}
