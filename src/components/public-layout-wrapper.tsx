"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { Locale } from "@/lib/i18n/types";
import { Toaster } from "@/components/ui/toast";

export function PublicLayoutWrapper({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    // Ensure page always starts at top on route changes (prevent sticky header cutting off content)
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <LanguageProvider initialLocale={initialLocale}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster />
    </LanguageProvider>
  );
}
