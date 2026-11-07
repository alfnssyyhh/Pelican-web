"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wrench, Zap, ShieldCheck, ChevronDown, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScopeStep {
  title: string;
  desc: string;
  deliverable: string;
}

interface PillarData {
  id: string;
  name: string;
  subtitle: string;
  icon: any;
  overview: string;
  capabilities: string[];
  scopeOfWork: ScopeStep[];
}

const PILLARS: PillarData[] = [
  {
    id: "mechanical",
    name: "Marine & Mechanical Engineering",
    subtitle: "Main Propulsion Overhaul, Auxiliary Engines & Gearbox Laser Alignment",
    icon: Wrench,
    overview:
      "PT Pelican Mitra Sejati provides precision mechanical engineering for commercial vessels, tugboats, anchor handling tugs (AHTS), and offshore platforms. Our senior marine engineers specialize in Cummins, Caterpillar, Yanmar, and Perkins diesel engines with Class-standard tolerances.",
    capabilities: [
      "Major & Top Engine Overhauls (Cummins KTA19, KTA38, KTA50, CAT 3500 series, Yanmar 6EY and 8EY)",
      "Reverse Gearbox Inspection, Laser Shaft Alignment, and Chockfast Pouring",
      "High-Voltage & Low-Voltage Electric Motor Overhaul and Alternator Rewinding",
      "Industrial PCB Board Repair & Component-Level Electronic Restoration",
    ],
    scopeOfWork: [
      {
        title: "Stage 1: Pre-Inspection & Diagnostic Testing",
        desc: "Borescope cylinder inspection, crankcase pressure logging, vibration spectrum analysis, and lube oil particulate sampling to pinpoint mechanical wear before disassembly.",
        deliverable: "Preliminary Diagnostic & Defect Assessment Report",
      },
      {
        title: "Stage 2: Precision Disassembly & Metrology",
        desc: "Complete teardown in accordance with OEM service manuals. Precision micrometer measurements of crankshaft journal run-out, liner wear, piston clearance, and valve guides.",
        deliverable: "Dimension & Clearance Tolerance Data Sheet",
      },
      {
        title: "Stage 3: Component Reconditioning & Genuine Assembly",
        desc: "Cylinder head pressure testing, fuel pump reconditioning, turbocharger dynamic balancing, and assembly with genuine OEM gasket kits and torque angle specifications.",
        deliverable: "Torque Log & Quality Inspection Checklists",
      },
      {
        title: "Stage 4: Commissioning, Load Bank Testing & Sea Trial",
        desc: "Static alignment verification, full-power load bank testing at 25%, 50%, 75%, 100%, and 110% overload, followed by comprehensive harbor and sea trials with class surveyor attendance.",
        deliverable: "Official Class Survey Completion Certificate",
      },
    ],
  },
  {
    id: "automation",
    name: "Automation & Calibration",
    subtitle: "MARPOL Environmental Systems, Main Switchboards & Vessel Control",
    icon: Zap,
    overview:
      "Specialized maritime automation and certified calibration ensuring complete compliance with IMO MARPOL regulations and international classification societies. We maintain active calibration benches in Sukajadi Batam for rapid turnarounds.",
    capabilities: [
      "MARPOL Annex I ODME (Oil Discharge Monitoring Equipment) Calibration & Certification",
      "15 ppm Bilge Alarm (OWS) Annual Verification & Sensor Reconditioning",
      "Main Switchboard (MSB) Breaker Testing & Auto-Synchronization Setup",
      "PLC Steering Gear Control, Rotary Switch Retrofitting & Vessel Monitoring Systems (VMS)",
    ],
    scopeOfWork: [
      {
        title: "Stage 1: Sensor Calibration Bench Verification",
        desc: "Zero-point and span calibration for 15 ppm optical sensors, turbidity cells, and pressure transmitters against certified reference standards.",
        deliverable: "Bench Calibration Benchmark Data",
      },
      {
        title: "Stage 2: Automatic Overboard 3-Way Valve Function Test",
        desc: "Verification of rapid shut-off valves, automatic recirculation triggers, sample pump discharge rates, and electronic fail-safe interlocks.",
        deliverable: "Interlock Safety Verification Record",
      },
      {
        title: "Stage 3: Switchboard Synchronization & Load Sharing",
        desc: "Generator synchronizing panel tuning, reverse power relay calibration, frequency stabilization, and automatic load-dependent start and stop logic programming.",
        deliverable: "PMS & Generator Integration Report",
      },
      {
        title: "Stage 4: Survey Endorsement & Annual Calibration Certificate",
        desc: "Final on-board simulation with classification surveyors (BKI, ABS, BV, Lloyd's) and issuance of the official annual calibration certificate valid for international port state control.",
        deliverable: "MARPOL Annual Calibration Certificate",
      },
    ],
  },
  {
    id: "rental",
    name: "Power Rental & Load Bank Fleet",
    subtitle: "25 kVA to 1250 kVA Industrial Units & Resistive Load Bank Testing",
    icon: ShieldCheck,
    overview:
      "Batam's dedicated power rental fleet designed specifically for high-humidity marine and fabrication environments. We supply silent canopy and containerized units with dedicated technical crews and automatic synchronizing panels.",
    capabilities: [
      "25 kVA to 1250 kVA Silent Canopy & ISO Containerized Diesel Generators",
      "Resistive & Reactive Load Bank Rental up to 2000 kW for Shipyard Sea Trials",
      "High-Capacity External Fuel Tanks (1,000L to 10,000L) & Marine Grade Copper Cables",
      "Certified K3 Operating Technicians with Full Operational Support at Batam Ports",
    ],
    scopeOfWork: [
      {
        title: "Stage 1: Electrical Load Audit & Sizing Calculation",
        desc: "Engineering review of motor starting currents, peak fabrication loads, power factor, and redundancy requirements to select optimal unit capacity.",
        deliverable: "Load Calculation & Fuel Consumption Forecast",
      },
      {
        title: "Stage 2: Rapid 2-Hour Port & Yard Mobilization",
        desc: "Transport, crane positioning, grounding, and heavy-duty cable termination at Batu Ampar, Kabil, Sekupang, or Tanjung Uncang.",
        deliverable: "Installation & Earth Resistance Inspection Report",
      },
      {
        title: "Stage 3: Full Load-Bank Pre-Commissioning",
        desc: "Step-load testing at 100% continuous rating to verify voltage stability, frequency regulation, and thermal limits before facility connection.",
        deliverable: "Pre-Mobilization Load Bank Test Record",
      },
      {
        title: "Stage 4: Operational Supervision & Continuous Maintenance",
        desc: "Daily lube oil analysis, scheduled filter changes, fuel replenishment management, and full on-site mechanical and electrical standby support.",
        deliverable: "Weekly Power Generation & Reliability Log",
      },
    ],
  },
];

export function EngineeringTabs() {
  const [activeTab, setActiveTab] = useState<string>("mechanical");
  const [openStep, setOpenStep] = useState<number | null>(0);

  const currentPillar = PILLARS.find((p) => p.id === activeTab) || PILLARS[0];

  return (
    <div className="w-full space-y-8">
      {/* 3 Main Pillar Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          const isActive = activeTab === pillar.id;
          return (
            <button
              key={pillar.id}
              onClick={() => {
                setActiveTab(pillar.id);
                setOpenStep(0); // Reset accordion to first step on tab change
              }}
              className={`flex items-center justify-center md:justify-start gap-3 px-4 py-3.5 rounded-lg text-left transition-all ${
                isActive
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                  isActive ? "bg-pelican-red text-white" : "bg-slate-200 text-slate-600"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs sm:text-sm tracking-tight">{pillar.name}</span>
                <span className="hidden lg:block text-[11px] text-slate-400 font-normal truncate max-w-[220px]">
                  {pillar.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Overview & Capabilities */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {currentPillar.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">{currentPillar.subtitle}</p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            {currentPillar.overview}
          </p>

          <div className="space-y-2.5 pt-2">
            <span className="text-xs font-semibold text-slate-900 block">Key Technical Capabilities:</span>
            <div className="space-y-2">
              {currentPillar.capabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-normal">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3">
            <Button
              asChild
              className="bg-pelican-red hover:bg-pelican-red-hover text-white text-xs font-medium px-5 h-10 shadow-xs"
            >
              <Link href={`/contact?type=service&item=${encodeURIComponent(currentPillar.name)}`}>
                Consult Engineering Division
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Column: Scope of Work (SOW) Vertical Accordion */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-tight block">
              Standard Operating Scope of Work (SOW)
            </span>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Systematic 4-stage engineering procedure certified to international classification standards.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {currentPillar.scopeOfWork.map((step, idx) => {
              const isOpen = openStep === idx;
              return (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setOpenStep(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                          isOpen ? "bg-zinc-900 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-pelican-red transition-colors">
                        {step.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-slate-900" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pl-9 pr-2 pt-2.5 space-y-2 text-xs text-slate-600 font-normal leading-relaxed animate-in fade-in duration-200">
                      <p>{step.desc}</p>
                      <div className="p-2.5 bg-slate-50 rounded-md border border-slate-100 text-[11px] text-slate-700">
                        <strong className="text-slate-900 font-medium">Official Deliverable: </strong>
                        <span>{step.deliverable}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
