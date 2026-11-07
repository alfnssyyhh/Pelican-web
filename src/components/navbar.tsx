"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const isHome = pathname === "/";
  const isServices = pathname === "/service" || pathname.startsWith("/service/");
  const isRent = pathname === "/rent" || pathname.startsWith("/rent/");
  const isProduct = pathname === "/product" || pathname.startsWith("/product/");
  const isWorks = pathname === "/works" || pathname.startsWith("/works/");
  const isInsights =
    pathname === "/artikel" ||
    pathname.startsWith("/artikel/") ||
    (!isHome &&
      !isServices &&
      !isRent &&
      !isProduct &&
      !isWorks &&
      !pathname.startsWith("/contact") &&
      !pathname.startsWith("/admin"));

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official Pelican Brand Logo (Aligned Left) */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="relative h-9 w-36 sm:h-12 sm:w-56">
              <Image
                src="/logo/Pelican-Mitra-Sejati-logo-HD-transparent.png"
                alt="PT Pelican Mitra Sejati"
                fill
                priority
                sizes="(max-width: 640px) 144px, 224px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation Cluster: Nav links grouped closer to Contact Us with consistent spacing */}
          <div className="hidden lg:flex items-center gap-7">
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  isHome ? "text-pelican-red font-semibold" : "text-slate-700 hover:text-pelican-red"
                }`}
              >
                {t.nav.home}
              </Link>

              <Link
                href="/service"
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  isServices ? "text-pelican-red font-semibold" : "text-slate-700 hover:text-pelican-red"
                }`}
              >
                {t.nav.services}
              </Link>

              <Link
                href="/rent"
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  isRent ? "text-pelican-red font-semibold" : "text-slate-700 hover:text-pelican-red"
                }`}
              >
                {t.nav.rents}
              </Link>

              <Link
                href="/product"
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  isProduct ? "text-pelican-red font-semibold" : "text-slate-700 hover:text-pelican-red"
                }`}
              >
                {t.nav.products}
              </Link>

              <Link
                href="/works"
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  isWorks ? "text-pelican-red font-semibold" : "text-slate-700 hover:text-pelican-red"
                }`}
              >
                {t.nav.works}
              </Link>

              <Link
                href="/artikel"
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  isInsights ? "text-pelican-red font-semibold" : "text-slate-700 hover:text-pelican-red"
                }`}
              >
                {t.nav.insights}
              </Link>
            </nav>

            {/* Actions: Contact Us + Language Switcher placed to the right of Contact Us */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <Button
                asChild
                className="bg-pelican-red hover:bg-pelican-red-hover text-white text-xs font-semibold px-4 h-9 rounded-md shadow-xs transition-colors"
              >
                <Link href="/contact">{t.nav.contact}</Link>
              </Button>

              {/* Language Switcher Button on the Right of Contact Us */}
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Actions: Language Switcher + Hamburger Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher className="scale-90" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4 space-y-3 bg-white">
            <nav className="flex flex-col space-y-1">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-md text-xs font-medium ${
                  isHome ? "text-pelican-red font-semibold bg-slate-50" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t.nav.home}
              </Link>
              <Link
                href="/service"
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-md text-xs font-medium ${
                  isServices ? "text-pelican-red font-semibold bg-slate-50" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t.nav.services}
              </Link>
              <Link
                href="/rent"
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-md text-xs font-medium ${
                  isRent ? "text-pelican-red font-semibold bg-slate-50" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t.nav.rents}
              </Link>
              <Link
                href="/product"
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-md text-xs font-medium ${
                  isProduct ? "text-pelican-red font-semibold bg-slate-50" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t.nav.products}
              </Link>
              <Link
                href="/works"
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-md text-xs font-medium ${
                  isWorks ? "text-pelican-red font-semibold bg-slate-50" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t.nav.works}
              </Link>
              <Link
                href="/artikel"
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-md text-xs font-medium ${
                  isInsights ? "text-pelican-red font-semibold bg-slate-50" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t.nav.insights}
              </Link>
            </nav>

            <div className="pt-2 border-t border-slate-100 px-3">
              <Button
                asChild
                className="w-full bg-pelican-red hover:bg-pelican-red-hover text-white text-xs font-semibold h-10 rounded-md"
              >
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  {t.nav.contact}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
