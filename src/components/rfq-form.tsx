"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { FileText, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function RfqForm() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    vesselOrProject: "",
    phone: "",
    category: "Marine Mechanical & Engine Overhaul",
    scope: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setSubmitted(true);
      setIsLoading(false);

      // Open prefilled WhatsApp in a new tab/window as requested by user
      if (data.waUrl) {
        window.open(data.waUrl, "_blank");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-200">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">RFQ Successfully Logged</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
            Your technical request has been securely recorded in our commercial dispatch database.
            A WhatsApp chat with prefilled specifications has been initiated with our Batam duty engineer.
          </p>
        </div>
        <div className="pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: "",
                company: "",
                vesselOrProject: "",
                phone: "",
                category: "Marine Mechanical & Engine Overhaul",
                scope: "",
              });
            }}
            className="text-xs"
          >
            Submit Another RFQ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-pelican-red" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Direct RFQ & Technical Estimation Form
          </h3>
        </div>
        <p className="text-xs text-slate-500 font-normal">
          Receive a formal commercial proposal within 1–2 hours. Logged to our engineering queue and forwarded directly to WhatsApp Dispatch.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Contact Person and Title <span className="text-pelican-red">*</span>
            </label>
            <Input
              required
              type="text"
              placeholder="e.g. Capt. James Tan (Chief Engineer)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Company or Shipyard Name
            </label>
            <Input
              type="text"
              placeholder="e.g. PaxOcean or Citra Shipyard"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Vessel, Rig, or Project Name
            </label>
            <Input
              type="text"
              placeholder="e.g. AHTS Pelican One or Drydock #2"
              value={formData.vesselOrProject}
              onChange={(e) => setFormData({ ...formData, vesselOrProject: e.target.value })}
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Phone or WhatsApp Number <span className="text-pelican-red">*</span>
            </label>
            <Input
              required
              type="tel"
              placeholder="+62 812-xxxx-xxxx or +65 xxxx xxxx"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="text-xs"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Engineering Service Requirement
          </label>
          <Select
            value={formData.category}
            onValueChange={(val) => {
              if (val) setFormData({ ...formData, category: val });
            }}
          >
            <SelectTrigger className="w-full h-10 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Marine Mechanical & Engine Overhaul">Marine Mechanical & Diesel Overhaul (Cummins, CAT, and Yanmar)</SelectItem>
                <SelectItem value="ODME & 15 ppm Bilge Alarm Calibration">ODME & 15 ppm Bilge Alarm (OWS) Calibration</SelectItem>
                <SelectItem value="Generator & Load Bank Rental (25 - 1250 kVA)">Generator & Load Bank Rental (25 to 1250 kVA)</SelectItem>
                <SelectItem value="Main Switchboard & Automation Diagnostic">Main Switchboard (MSB) & Vessel Automation</SelectItem>
                <SelectItem value="PCB Board Component-Level Repair">PCB Board Component-Level Repair</SelectItem>
                <SelectItem value="Genuine Marine Spare Parts Sourcing">Genuine Marine Spare Parts Sourcing</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Scope of Work & Technical Details <span className="text-pelican-red">*</span>
          </label>
          <Textarea
            required
            rows={4}
            placeholder="Please specify engine serial number, kVA capacity required, diagnostic symptoms, port location, or mobilization schedule in Batam..."
            value={formData.scope}
            onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
            className="text-xs"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-pelican-red hover:bg-pelican-red-hover text-white text-xs font-semibold h-11 shadow-xs transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing & Recording RFQ...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Official RFQ & Connect to WhatsApp Dispatch
            </>
          )}
        </Button>

        <p className="text-[11px] text-slate-400 text-center font-normal pt-1">
          Submission data is encrypted, logged to database, and instantly forwarded to Batam Duty Engineer (+62 811-7019-338).
        </p>
      </form>
    </div>
  );
}
