"use client";

import { useLanguage } from "@/lib/i18n/language-context";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  mobile?: boolean;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  return (
    <div className={cn("flex items-center border border-slate-200 rounded-md p-1 bg-slate-50 text-xs", className)}>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`px-3 py-1.5 rounded transition-colors font-medium ${
          locale === "en"
            ? "bg-white text-slate-900 shadow-2xs font-semibold"
            : "text-slate-700 hover:text-slate-900"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("id")}
        className={`px-3 py-1.5 rounded transition-colors font-medium ${
          locale === "id"
            ? "bg-white text-slate-900 shadow-2xs font-semibold"
            : "text-slate-700 hover:text-slate-900"
        }`}
        aria-label="Ganti ke Bahasa Indonesia"
      >
        ID
      </button>
    </div>
  );
}