"use client";

import React, { useState } from "react";
import { Anchor, Shield, CheckCircle2, ChevronRight, Building2, MapPin } from "lucide-react";

interface CaseStudy {
  client: string;
  location: string;
  vesselOrAsset: string;
  scopeSummary: string;
  milestones: string[];
}

const PROJECTS: CaseStudy[] = [
  {
    client: "Bourbon Offshore Asia",
    location: "Batam Anchorage & Shipyard",
    vesselOrAsset: "Anchor Handling Tug Supply (AHTS) Fleet",
    scopeSummary:
      "Comprehensive mechanical overhaul of heavy-duty auxiliary power systems and emergency power generation ensuring unimpeded offshore mobilization.",
    milestones: [
      "Major overhaul of Cummins QSK60 heavy diesel generator",
      "Emergency Diesel Generator Cummins 6CT system complete overhaul & load-testing",
      "Vessel power distribution synchronizing and sea-trial certification",
    ],
  },
  {
    client: "Indonesian Coast Guard (Bakamla RI)",
    location: "Batam Naval Facility",
    vesselOrAsset: "Patrol Vessel KN Pulau Dana",
    scopeSummary:
      "Propulsion transmission re-engineering and automation control commissioning under strict national maritime defense readiness standards.",
    milestones: [
      "Precision marine gearbox installation and laser alignment to MAN Diesel Engine",
      "Complete electrical and instrumentation system verification",
      "Commissioning Viking 35 automation control system to international standards",
    ],
  },
  {
    client: "DTA Maritime Dubai",
    location: "International Offshore Operations",
    vesselOrAsset: "Offshore Commercial Vessel",
    scopeSummary:
      "Turnkey power plant reconditioning and navigation instrumentation activation executed to Lloyd's Register survey standards.",
    milestones: [
      "Full major overhaul of Caterpillar CAT 3516 diesel generator",
      "Complete electrical, instrument, and navigation bridge system commissioning",
      "Load bank heat-run testing and post-overhaul sea trial verification",
    ],
  },
  {
    client: "M Pallonji Shipping",
    location: "Singapore Strait & Batam",
    vesselOrAsset: "Offshore Support Vessel",
    scopeSummary:
      "Specialized propulsion engineering and high-tier Dynamic Positioning (DP) automation tuning.",
    milestones: [
      "Overhaul of Bergen Rolls-Royce marine diesel engine",
      "Dynamic Positioning (DP) and Vessel Monitoring System (VMS) calibration",
      "UMAS vessel control automation setting and harbor acceptance trials",
    ],
  },
  {
    client: "POS Logistic 1",
    location: "Batam Port Facilities",
    vesselOrAsset: "Commercial Cargo Logistics Vessel",
    scopeSummary:
      "Emergency troubleshooting and PLC modernizing for critical vessel maneuvering and fuel monitoring equipment.",
    milestones: [
      "Troubleshooting and installation of modern PLC steering gear controls",
      "Retrofit & modification of rotary switchboard panel with custom PLC logic",
      "Troubleshooting and calibration of auxiliary engine fuel oil flow telemetry",
    ],
  },
  {
    client: "Motor Yacht Baby Pegasus",
    location: "Marina Port Batam",
    vesselOrAsset: "Luxury Marine Motor Yacht",
    scopeSummary:
      "Precision electronic control unit diagnostics and engine management module replacement.",
    milestones: [
      "ECU diagnostic troubleshooting and fault rectification on board",
      "Installation and parameter flashing of ECU MDEC C1 to MAN marine engine",
      "Engine test run, performance telemetry logging, and full sea trial",
    ],
  },
];

export function CaseStudiesSection() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeProject = PROJECTS[selectedIdx];

  return (
    <div className="w-full space-y-6">
      {/* Client Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {PROJECTS.map((proj, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`p-3 rounded-lg text-left transition-all border ${
                isSelected
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className="block text-[11px] font-medium text-slate-400 truncate">
                Client {idx + 1}
              </span>
              <span className="block text-xs font-bold truncate mt-0.5">{proj.client}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Project Technical Detail Sheet */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-pelican-red font-semibold">
              <Anchor className="w-4 h-4" />
              <span>Project Field Case Study</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {activeProject.client}
            </h3>
            <p className="text-xs text-slate-500 font-normal flex items-center gap-2">
              <span className="font-medium text-slate-700">{activeProject.vesselOrAsset}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {activeProject.location}
              </span>
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg text-xs text-slate-700 shrink-0">
            <span className="text-[11px] text-slate-400 block font-normal">Classification Benchmark:</span>
            <span className="font-semibold text-slate-900">ABS, BV, and BKI Maritime Standards</span>
          </div>
        </div>

        <div className="py-5 space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-900 block mb-1">
              Engineering Mission Scope:
            </span>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              {activeProject.scopeSummary}
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <span className="text-xs font-semibold text-slate-900 block">
              Executed Engineering Milestones:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeProject.milestones.map((ms, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-normal leading-relaxed">{ms}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
