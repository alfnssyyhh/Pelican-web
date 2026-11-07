"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-context";

const FEATURED_PROJECTS = [
  {
    slug: "bourbon-offshore-asia",
    client: "Bourbon Offshore Asia",
    vessel_en: "Anchor Handling Tug Supply (AHTS)",
    vessel_id: "Kapal Anchor Handling Tug Supply (AHTS)",
    image: "/projects/bourbon-vessel.jpg",
    location_en: "Batam Shipyard & Anchorage",
    location_id: "Galangan Kapal & Perairan Batam",
    scope_en: "Major Overhaul Cummins QSK60 Diesel Generator & EDG Cummins 6CT System Activation",
    scope_id: "Overhaul Total Generator Diesel Cummins QSK60 & Reaktivasi Sistem EDG Cummins 6CT",
  },
  {
    slug: "bakamla-ri",
    client: "Bakamla RI (Indonesian Coast Guard)",
    vessel_en: "Patrol Vessel KN Pulau Dana 323",
    vessel_id: "Kapal Patroli KN Pulau Dana 323",
    image: "/projects/bakamla-vessel.jpg",
    location_en: "Batam Maritime Command Facility",
    location_id: "Pangkalan Maritim Batam",
    scope_en: "Gearbox Installation to MAN Diesel Engine & Viking 35 International Automation Commissioning",
    scope_id: "Pemasangan Gearbox pada Mesin Diesel MAN & Komisioning Otomasi Viking 35 Standar Internasional",
  },
  {
    slug: "dta-maritime-dubai",
    client: "DTA Maritime Dubai",
    vessel_en: "Offshore Vessel Crest Spartan 1",
    vessel_id: "Kapal Lepas Pantai Crest Spartan 1",
    image: "/projects/dta-vessel.jpg",
    location_en: "Batam Drydock Facilities",
    location_id: "Fasilitas Dok Kering Batam",
    scope_en: "Caterpillar CAT 3516 Generator Overhaul, Bridge Navigation & Electrical Commissioning",
    scope_id: "Overhaul Generator Caterpillar CAT 3516, Komisioning Navigasi Jembatan & Sistem Kelistrikan",
  },
  {
    slug: "m-pallonji-shipping",
    client: "M Pallonji Shipping",
    vessel_en: "Offshore Support Vessel Sea Halibut",
    vessel_id: "Kapal Pendukung Lepas Pantai Sea Halibut",
    image: "/projects/pallonji-vessel.jpg",
    location_en: "Singapore Strait & Batam Port",
    location_id: "Selat Singapura dan Pelabuhan Batam",
    scope_en: "Bergen Rolls-Royce Engine Overhaul, Dynamic Positioning (DP) & Vessel Monitoring System",
    scope_id: "Overhaul Mesin Bergen Rolls-Royce, Dynamic Positioning (DP) & Sistem Monitoring Kapal",
  },
];

export function FeaturedWorks() {
  const { locale } = useLanguage();
  const isId = locale === "id";

  return (
    <section className="py-14 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isId ? "Rekam Jejak Proyek & Pekerjaan Pilihan" : "Featured Works & Project Track Record"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1 max-w-2xl">
              {isId
                ? "Pencapaian rekayasa nyata di atas kapal yang dieksekusi oleh teknisi lapangan Pelican di galangan dan perairan labuh jangkar Batam."
                : "Authentic on-board engineering milestones executed by Pelican field engineers across commercial shipyards and anchorages in Batam."}
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="border-slate-300 text-xs shrink-0 h-10 px-4">
            <Link href="/works" className="inline-flex items-center gap-1.5">
              {isId ? "Lihat seluruh proyek" : "Explore all projects"}
              <ArrowRight className="w-3.5 h-3.5 text-pelican-red" />
            </Link>
          </Button>
        </div>

        {/* 4 Featured Projects Grid (Card Boxes with Border, Consistent with Specialized Engineering Divisions) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PROJECTS.map((proj, i) => (
            <article
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-400 hover:shadow-sm transition-all group"
            >
              <Link href={`/works?project=${proj.slug}`} className="block space-y-3 cursor-pointer">
                {/* Authentic Vessel Photo (Clean without badges per user request) */}
                <div className="relative aspect-16/10 w-full bg-slate-100 rounded-lg overflow-hidden">
                  <Image
                    src={proj.image}
                    alt={proj.client}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] text-slate-500 font-normal flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-pelican-red" />
                    {isId ? proj.location_id : proj.location_en}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug group-hover:text-pelican-red transition-colors">
                    {proj.client}
                  </h3>
                  <span className="text-xs font-medium text-slate-700 block">
                    {isId ? proj.vessel_id : proj.vessel_en}
                  </span>
                  <p className="text-xs text-slate-600 font-normal line-clamp-3 leading-relaxed">
                    {isId ? proj.scope_id : proj.scope_en}
                  </p>
                </div>
              </Link>

              <div className="pt-3 mt-2 border-t border-slate-100">
                <Link
                  href={`/works?project=${proj.slug}`}
                  className="inline-flex items-center text-xs font-semibold text-pelican-red group-hover:translate-x-1 transition-all"
                >
                  {isId ? "Lihat rincian kasus" : "View case details"}
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
