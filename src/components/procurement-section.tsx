"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Clock, ExternalLink, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const BRANDS = [
  { name: "Cummins Genuine Parts", category: "KTA19, KTA38, KTA50, 6BT, 6CT Marine Engine Components", stock: "Warehouse Batam Stock" },
  { name: "Technoton Telematics", category: "Differential Flow Meters (DFM) & DUT-E Capacitive Fuel Sensors", stock: "Authorized Batam Partner" },
  { name: "Perkins Power Parts", category: "Piston Kits, Liner Assemblies, Injector Nozzles & Gasket Sets", stock: "Immediate Dispatch" },
  { name: "Fleetguard Marine Filtration", category: "Heavy-Duty Fuel-Water Separators, Lube Oil & Air Filters", stock: "Full Range in Stock" },
];

export function ProcurementSection() {
  return (
    <div className="w-full space-y-8">
      {/* Top Banner: Corporate Supply Mission */}
      <div className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Genuine Certified Marine Components
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Authorized Marine Spare Parts & Instrumentation Procurement
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Eliminating vessel downtime through immediate warehouse stock in Batam. We supply genuine overhaul kits, differential flow meters, and fuel telemetry backed by manufacturer technical warranty.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
          <Button
            asChild
            className="bg-pelican-red hover:bg-pelican-red-hover text-white text-xs font-semibold h-11 px-6 shadow-xs"
          >
            <a
              href="https://wa.me/628117789902?text=Hello%20Pelican%20Supply%20Division,%20I%20would%20like%20to%20request%20an%20RFQ%20for%20genuine%20marine%20spare%20parts."
              target="_blank"
              rel="noopener noreferrer"
            >
              Request Parts Quotation (RFQ)
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs h-11 px-5"
          >
            <a
              href="https://www.tokopedia.com/pelican-diesel-parts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              Official Tokopedia Store
              <ExternalLink className="w-3.5 h-3.5 ml-1 text-slate-400" />
            </a>
          </Button>
        </div>
      </div>

      {/* Structured Technical Procurement Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BRANDS.map((brand, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:border-slate-400 transition-colors shadow-xs"
          >
            <div className="space-y-2">
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block">
                {brand.stock}
              </span>
              <h4 className="font-bold text-sm text-slate-900 tracking-tight">{brand.name}</h4>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">{brand.category}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <Link
                href={`/contact?type=product&item=${encodeURIComponent(brand.name)}`}
                className="inline-flex items-center text-xs font-semibold text-pelican-red hover:text-pelican-red-hover transition-colors"
              >
                Inquire Part Availability
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
