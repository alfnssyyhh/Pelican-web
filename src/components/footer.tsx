"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-zinc-900 text-zinc-300 border-t border-zinc-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1: Company Profile & Horizontal Monochrome White Logo */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative h-14 w-60 sm:w-64">
              <Image
                src="/logo/pelican-logo-horizontal-white.png"
                alt="PT Pelican Mitra Sejati"
                fill
                priority
                sizes="(max-width: 640px) 240px, 256px"
                className="object-contain object-left"
              />
            </div>
            <p className="text-xs text-zinc-200 font-normal leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>
            <div className="pt-2 text-xs text-zinc-200 space-y-1">
              <p className="text-white font-medium">{t.footer.address_title}</p>
              <p>{t.footer.address_body}</p>
            </div>
          </div>

          {/* Column 2: Core Engineering Services */}
          <div className="lg:col-span-3 space-y-3">
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase border-b border-zinc-800 pb-2">
              {t.footer.col_divisions}
            </h2>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/service" className="hover:text-white transition-colors block text-zinc-300">
                  {t.footer.div_marine_auto}
                </Link>
              </li>
              <li>
                <Link href="/service" className="hover:text-white transition-colors block text-zinc-300">
                  {t.footer.div_odme_ows}
                </Link>
              </li>
              <li>
                <Link href="/service" className="hover:text-white transition-colors block text-zinc-300">
                  {t.footer.div_diesel_overhaul}
                </Link>
              </li>
              <li>
                <Link href="/service" className="hover:text-white transition-colors block text-zinc-300">
                  {t.footer.div_hydraulic}
                </Link>
              </li>
              <li>
                <Link href="/service" className="hover:text-white transition-colors block text-zinc-300">
                  {t.footer.div_comm_nav}
                </Link>
              </li>
              <li>
                <Link href="/rent" className="hover:text-white transition-colors block text-zinc-300">
                  {t.footer.div_power_rental}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase border-b border-zinc-800 pb-2">
              {t.footer.col_navigation}
            </h2>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/service" className="hover:text-white transition-colors block text-zinc-300">
                  {t.footer.all_services}
                </Link>
              </li>
              <li>
                <Link href="/rent" className="hover:text-white transition-colors block text-zinc-300">
                  {t.footer.generator_rental}
                </Link>
              </li>
              <li>
                <Link href="/product" className="hover:text-white transition-colors block text-zinc-300">
                  {t.footer.parts_catalog}
                </Link>
              </li>
              <li>
                <Link href="/artikel" className="hover:text-white transition-colors block text-zinc-300">
                  {t.footer.technical_insights}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors block text-zinc-300">
                  {t.footer.contact_rfq}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Operational Support Channels */}
          <div className="lg:col-span-3 space-y-3">
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase border-b border-zinc-800 pb-2">
              {t.footer.col_hotline}
            </h2>
            <div className="space-y-3 text-xs text-zinc-200">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-pelican-red shrink-0" />
                <a href="tel:+627787372079" className="hover:text-white font-normal text-zinc-200 transition-colors">
                  (0778) 7372079
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-pelican-red shrink-0" />
                <a href="https://wa.me/628117019338" target="_blank" rel="noopener noreferrer" className="hover:text-white font-normal text-zinc-200 transition-colors">
                  +62 811-7019-338
                </a>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-pelican-red shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <a href="mailto:cmo@pelican-ms.com" className="hover:text-white font-normal block text-zinc-200 transition-colors">
                    cmo@pelican-ms.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-pelican-red shrink-0 mt-0.5" />
                <div>
                  <span className="block">{t.footer.hours_detail}</span>
                </div>
              </div>

              {/* 6 Official Social Media & Store Channels (Icons Only, Red Color, Blends with Footer Background) */}
              <div className="pt-3 border-t border-zinc-800">
                <div className="flex flex-wrap items-center gap-3">
                  {/* YouTube */}
                  <a
                    href="https://www.youtube.com/@Pelicanms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pelican-red hover:text-white hover:scale-110 transition-all duration-200"
                    aria-label="YouTube PT Pelican Mitra Sejati"
                    title="YouTube @Pelicanms"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>

                  {/* TikTok */}
                  <a
                    href="https://www.tiktok.com/@pelicanms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pelican-red hover:text-white hover:scale-110 transition-all duration-200"
                    aria-label="TikTok PT Pelican Mitra Sejati"
                    title="TikTok @pelicanms"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/pelicanmitrasejati/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pelican-red hover:text-white hover:scale-110 transition-all duration-200"
                    aria-label="Instagram PT Pelican Mitra Sejati"
                    title="Instagram @pelicanmitrasejati"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/pelican-mitra-sejati-0b217b389/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pelican-red hover:text-white hover:scale-110 transition-all duration-200"
                    aria-label="LinkedIn PT Pelican Mitra Sejati"
                    title="LinkedIn PT Pelican Mitra Sejati"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://web.facebook.com/p/PT-Pelican-Mitra-Sejati-100077047002223/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pelican-red hover:text-white hover:scale-110 transition-all duration-200"
                    aria-label="Facebook PT Pelican Mitra Sejati"
                    title="Facebook PT Pelican Mitra Sejati"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-800 flex justify-center items-center text-xs text-zinc-300 text-center">
          <p>Copyright © 2026 PT Pelican Mitra Sejati</p>
        </div>
      </div>
    </footer>
  );
}
