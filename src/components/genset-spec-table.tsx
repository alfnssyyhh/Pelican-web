"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, ShieldCheck, ArrowRight, PhoneCall } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

interface GensetSpec {
  id: string;
  kva: string;
  kw: string;
  engine: string;
  canopy: string;
  voltage: string;
  fuelRate: string;
  noiseLevel: string;
  status: string;
}

const FLEET_DATA: GensetSpec[] = [
  {
    id: "g-25",
    kva: "25 kVA",
    kw: "20 kW",
    engine: "Yanmar 4TNV88 & Perkins 404D",
    canopy: "Soundproof Silent Canopy",
    voltage: "380V & 220V (3-Phase)",
    fuelRate: "5.2 L/h @ 75% load",
    noiseLevel: "68 dB(A) @ 7m",
    status: "Ready for Dispatch",
  },
  {
    id: "g-60",
    kva: "60 kVA",
    kw: "48 kW",
    engine: "Perkins 1103A & Cummins 4BT",
    canopy: "Heavy Duty Silent Canopy",
    voltage: "380V & 220V (3-Phase)",
    fuelRate: "11.4 L/h @ 75% load",
    noiseLevel: "70 dB(A) @ 7m",
    status: "Ready for Dispatch",
  },
  {
    id: "g-100",
    kva: "100 kVA",
    kw: "80 kW",
    engine: "Cummins 6BT5.9 & Perkins 1104A",
    canopy: "Heavy Duty Weatherproof Silent",
    voltage: "380V & 440V (50-60 Hz)",
    fuelRate: "18.5 L/h @ 75% load",
    noiseLevel: "72 dB(A) @ 7m",
    status: "Ready for Dispatch",
  },
  {
    id: "g-250",
    kva: "250 kVA",
    kw: "200 kW",
    engine: "Cummins 6CTA8.3 & CAT 3306",
    canopy: "Acoustic Silent Canopy",
    voltage: "380V & 440V (50-60 Hz)",
    fuelRate: "42.0 L/h @ 75% load",
    noiseLevel: "74 dB(A) @ 7m",
    status: "Ready for Dispatch",
  },
  {
    id: "g-500",
    kva: "500 kVA",
    kw: "400 kW",
    engine: "Cummins KTA19-G4 & CAT 3412",
    canopy: "Industrial Heavy Silent Canopy",
    voltage: "380V & 440V Sync Ready",
    fuelRate: "85.0 L/h @ 75% load",
    noiseLevel: "75 dB(A) @ 7m",
    status: "Ready for Dispatch",
  },
  {
    id: "g-1000",
    kva: "1000 kVA",
    kw: "800 kW",
    engine: "Cummins KTA38-G5 & Mitsubishi S12R",
    canopy: "20ft ISO Marine Containerized",
    voltage: "380V & 440V Auto-Sync",
    fuelRate: "165.0 L/h @ 75% load",
    noiseLevel: "78 dB(A) @ 7m",
    status: "Schedule Mobilization",
  },
  {
    id: "g-1250",
    kva: "1250 kVA",
    kw: "1000 kW",
    engine: "Cummins KTA50-G3 & CAT 3512",
    canopy: "20ft ISO Marine Containerized",
    voltage: "380V & 440V Auto-Sync",
    fuelRate: "210.0 L/h @ 75% load",
    noiseLevel: "78 dB(A) @ 7m",
    status: "Schedule Mobilization",
  },
];

export function GensetSpecTable() {
  const { locale } = useLanguage();
  const isId = locale === "id";
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredFleet = FLEET_DATA.filter((item) => {
    if (selectedFilter === "small") return parseInt(item.kva) <= 100;
    if (selectedFilter === "medium") return parseInt(item.kva) > 100 && parseInt(item.kva) <= 500;
    if (selectedFilter === "large") return parseInt(item.kva) >= 1000;
    return true;
  });

  return (
    <div className="w-full space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-700 mr-2">
            {isId ? "Filter Kapasitas:" : "Filter Capacity:"}
          </span>
          {[
            { id: "all", label: isId ? "Semua Armada (25 sampai 1250 kVA)" : "All Fleet (25 to 1250 kVA)" },
            { id: "small", label: "25 sampai 100 kVA" },
            { id: "medium", label: "250 sampai 500 kVA" },
            { id: "large", label: isId ? "1000 sampai 1250 kVA (Kontainer)" : "1000 to 1250 kVA (Container)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedFilter === tab.id
                  ? "bg-zinc-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-normal">
          {isId ? `Menampilkan ${filteredFleet.length} unit siap di Batam` : `Showing ${filteredFleet.length} units available in Batam`}
        </div>
      </div>

      {/* Desktop Technical Table */}
      <div className="hidden md:block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 border-b border-slate-200">
              <TableHead className="w-[140px]">{isId ? "Peringkat Daya" : "Power Rating"}</TableHead>
              <TableHead>{isId ? "Model Mesin" : "Engine Model"}</TableHead>
              <TableHead>{isId ? "Enclosure & Kanopi" : "Enclosure & Canopy"}</TableHead>
              <TableHead>{isId ? "Konsumsi Bahan Bakar" : "Fuel Consumption"}</TableHead>
              <TableHead>{isId ? "Tingkat Kebisingan" : "Sound Rating"}</TableHead>
              <TableHead>{isId ? "Kesiapan Pelabuhan" : "Port Readiness"}</TableHead>
              <TableHead className="text-right">{isId ? "Tindakan" : "Action"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFleet.map((row) => (
              <TableRow key={row.id} className="hover:bg-slate-50/80 transition-colors">
                <TableCell className="font-semibold text-slate-900">
                  <div className="text-sm font-bold text-slate-900">{row.kva}</div>
                  <div className="text-[11px] text-slate-500 font-normal">{row.kw}</div>
                </TableCell>
                <TableCell className="font-medium text-slate-800">{row.engine}</TableCell>
                <TableCell>
                  <span className="text-xs text-slate-700 block">{row.canopy}</span>
                  <span className="text-[11px] text-slate-400 block">{row.voltage}</span>
                </TableCell>
                <TableCell className="text-xs text-slate-600 font-mono">{row.fuelRate}</TableCell>
                <TableCell className="text-xs text-slate-600">{row.noiseLevel}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    {isId && row.status === "Ready for Dispatch"
                      ? "Siap Mobilisasi"
                      : isId && row.status === "Schedule Mobilization"
                      ? "Jadwalkan Mobilisasi"
                      : row.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    asChild
                    size="sm"
                    className="bg-pelican-red hover:bg-pelican-red-hover text-white text-xs h-8 px-3 font-medium shadow-xs"
                  >
                    <Link href="/contact">
                      {isId ? `Tanya ${row.kva}` : "Inquire kVA"}
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Responsive Card List (Adapts wide table on mobile) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredFleet.map((row) => (
          <div key={row.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <span className="text-base font-bold text-slate-900">{row.kva}</span>
                <span className="text-xs text-slate-500 ml-1.5">({row.kw})</span>
              </div>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                {isId && row.status === "Ready for Dispatch"
                  ? "Siap Mobilisasi"
                  : isId && row.status === "Schedule Mobilization"
                  ? "Jadwalkan Mobilisasi"
                  : row.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">{isId ? "Mesin:" : "Engine:"}</span>
                <span className="font-medium text-slate-800">{row.engine}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">{isId ? "Kanopi:" : "Canopy:"}</span>
                <span className="text-slate-700">{row.canopy}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">{isId ? "Konsumsi BBM:" : "Fuel Rate:"}</span>
                <span className="text-slate-700 font-mono">{row.fuelRate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">{isId ? "Kebisingan:" : "Noise:"}</span>
                <span className="text-slate-700">{row.noiseLevel}</span>
              </div>
            </div>

            <Button
              asChild
              size="sm"
              className="w-full bg-pelican-red hover:bg-pelican-red-hover text-white text-xs h-9 font-medium"
            >
              <Link href="/contact">
                {isId ? `Tanya Armada ${row.kva}` : `Inquire ${row.kva} Fleet`}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
