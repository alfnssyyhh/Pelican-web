"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/language-context";

interface BrandItem {
  name: string;
  file: string;
  sizeClass: string;
}

const BRAND_LOGOS: BrandItem[] = [
  // Row 1
  { name: "Cummins", file: "cummins.svg", sizeClass: "h-9 sm:h-11 max-w-[105px]" },
  { name: "Yanmar", file: "yanmar.svg", sizeClass: "h-9 sm:h-11 max-w-[125px]" },
  { name: "Schneider Electric", file: "schneider.svg", sizeClass: "h-7 sm:h-8 max-w-[145px]" },
  { name: "ABB", file: "abb.svg", sizeClass: "h-7 sm:h-8 max-w-[130px]" },
  { name: "Caterpillar", file: "cat.svg", sizeClass: "h-6 sm:h-7 max-w-[155px]" },
  { name: "MAN Energy Solutions", file: "man.svg", sizeClass: "h-9 sm:h-11 max-w-[125px]" },

  // Row 2
  { name: "Siemens", file: "siemens.svg", sizeClass: "h-5 sm:h-6 max-w-[150px]" },
  { name: "Allen-Bradley", file: "allen-bradley.svg", sizeClass: "h-6 sm:h-7 max-w-[150px]" },
  { name: "MTU Detroit Diesel", file: "mtu-detroit.svg", sizeClass: "h-7 sm:h-8 max-w-[135px]" },
  { name: "Mitsubishi Diesel Engine", file: "mitsubishi.svg", sizeClass: "h-14 sm:h-16 max-w-[120px]" },
  { name: "Mitsubishi Electric", file: "mitsubishi-electric.svg", sizeClass: "h-8 sm:h-9 max-w-[160px]" },
  { name: "OMRON", file: "omron.svg", sizeClass: "h-6 sm:h-7 max-w-[150px]" },

  // Row 3
  { name: "BOSCH", file: "bosch.svg", sizeClass: "h-6 sm:h-7 max-w-[145px]" },
  { name: "Stanadyne", file: "stanadyne.svg", sizeClass: "h-6 sm:h-7 max-w-[145px]" },
  { name: "SMC", file: "smc.svg", sizeClass: "h-7 sm:h-8 max-w-[130px]" },
  { name: "Rexroth (Bosch)", file: "rexroth.svg", sizeClass: "h-7 sm:h-8 max-w-[140px]" },
  { name: "DENSO", file: "denso.svg", sizeClass: "h-6 sm:h-7 max-w-[150px]" },
  { name: "Delphi Technologies", file: "delphi.svg", sizeClass: "h-6 sm:h-7 max-w-[150px]" },

  // Row 4
  { name: "Danfoss", file: "danfoss.svg", sizeClass: "h-7 sm:h-8 max-w-[140px]" },
  { name: "Honeywell", file: "honeywell.svg", sizeClass: "h-5 sm:h-6 max-w-[150px]" },
  { name: "KOMATSU", file: "komatsu.svg", sizeClass: "h-6 sm:h-7 max-w-[150px]" },
  { name: "Holset Turbochargers", file: "holset.svg", sizeClass: "h-7 sm:h-8 max-w-[140px]" },
  { name: "VDO", file: "vdo.svg", sizeClass: "h-5 sm:h-6 max-w-[140px]" },
  { name: "Parker", file: "parker.svg", sizeClass: "h-6 sm:h-7 max-w-[145px]" },
];

export function BrandPartners() {
  const { locale } = useLanguage();
  const isId = locale === "id";

  return (
    <section className="py-14 sm:py-18 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isId ? "Merek Peralatan & Suku Cadang Asli yang Didukung" : "Supported Equipment Brands & Genuine Spares"}
          </h2>
        </div>

        {/* 24 Brands Grid (4 rows x 6 cols on desktop) - Perfectly Centered, No Clipping */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 items-center">
          {BRAND_LOGOS.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center justify-center h-16 sm:h-20 px-3 py-2 transition-all group"
            >
              <div
                className={`relative w-full flex items-center justify-center grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 transition-all duration-200 ${brand.sizeClass}`}
              >
                <Image
                  src={`/brands/${brand.file}`}
                  alt={brand.name}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 640px) 140px, 180px"
                  className="object-contain object-center"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
