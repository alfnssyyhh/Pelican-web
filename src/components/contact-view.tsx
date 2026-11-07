"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { GoogleMapCard } from "@/components/google-map-card";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

const SERVICE_CATEGORIES = [
  {
    value: "Marine Electrical & Automation",
    labelEn: "Marine Electrical & Automation",
    labelId: "Kelistrikan & Otomasi Maritim",
  },
  {
    value: "ODME & 15 ppm OWS Calibration",
    labelEn: "ODME & 15 ppm OWS Calibration",
    labelId: "Kalibrasi ODME & OWS 15 ppm",
  },
  {
    value: "Generator Rental (25 to 1250 kVA)",
    labelEn: "Generator Rental (25 to 1250 kVA)",
    labelId: "Rental Genset (25 hingga 1250 kVA)",
  },
  {
    value: "Diesel Engine Overhaul (Cummins & Cat)",
    labelEn: "Diesel Engine Overhaul (Cummins & Cat)",
    labelId: "Overhaul & Servis Mesin Diesel (Cummins & CAT)",
  },
  {
    value: "Hydraulic Steering & Marine Piping",
    labelEn: "Hydraulic Steering & Marine Piping",
    labelId: "Sistem Kemudi Hidrolik & Perpipaan",
  },
  {
    value: "Genuine Spare Parts (Cummins & Technoton)",
    labelEn: "Genuine Spare Parts (Cummins & Technoton)",
    labelId: "Suku Cadang Asli (Cummins & Technoton)",
  },
  {
    value: "Other Engineering Inquiries",
    labelEn: "Other Engineering Inquiries",
    labelId: "Konsultasi Rekayasa Lainnya",
  },
];

export function ContactView() {
  const { locale } = useLanguage();
  const isId = locale === "id";
  const searchParams = useSearchParams();
  const queryType = searchParams.get("type");
  const queryItem = searchParams.get("item");

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    category: "Marine Electrical & Automation",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedRfqId, setSubmittedRfqId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!queryItem && !queryType) return;

    let defaultCat = "Marine Electrical & Automation";
    let defaultMsg = "";

    const itemName = queryItem || (isId ? "layanan rekayasa" : "engineering services");

    if (queryType === "rental") {
      defaultCat = "Generator Rental (25 to 1250 kVA)";
      defaultMsg = isId
        ? `Yth. Tim PT Pelican Mitra Sejati,\n\nSaya ingin mengajukan permohonan penawaran harga resmi dan konsultasi teknis terkait rental ${itemName}.\n\nMohon informasikan rincian biaya komersial, ketersediaan unit, dan estimasi waktu pelaksanaan untuk kami tinjau.\n\nTerima kasih.`
        : `Dear PT Pelican Mitra Sejati Team,\n\nI would like to request an official quotation and technical consultation regarding the rental of ${itemName}.\n\nPlease provide detailed commercial pricing, availability, and execution lead time for our review.\n\nThank you.`;
    } else if (queryType === "product") {
      defaultCat = "Genuine Spare Parts (Cummins & Technoton)";
      defaultMsg = isId
        ? `Yth. Tim PT Pelican Mitra Sejati,\n\nSaya ingin mengajukan permohonan penawaran harga resmi dan konsultasi teknis terkait pengadaan ${itemName}.\n\nMohon informasikan rincian biaya komersial, ketersediaan unit, dan estimasi waktu pelaksanaan untuk kami tinjau.\n\nTerima kasih.`
        : `Dear PT Pelican Mitra Sejati Team,\n\nI would like to request an official quotation and technical consultation regarding the procurement of ${itemName}.\n\nPlease provide detailed commercial pricing, availability, and execution lead time for our review.\n\nThank you.`;
    } else if (queryType === "service") {
      const lowerItem = itemName.toLowerCase();
      if (lowerItem.includes("odme") || lowerItem.includes("kalibrasi") || lowerItem.includes("calibration") || lowerItem.includes("ows") || lowerItem.includes("instrument")) {
        defaultCat = "ODME & 15 ppm OWS Calibration";
      } else if (lowerItem.includes("diesel") || lowerItem.includes("mesin") || lowerItem.includes("mechanical") || lowerItem.includes("engine") || lowerItem.includes("overhaul")) {
        defaultCat = "Diesel Engine Overhaul (Cummins & Cat)";
      } else if (lowerItem.includes("hidrolik") || lowerItem.includes("hydraulic") || lowerItem.includes("piping") || lowerItem.includes("kemudi") || lowerItem.includes("steering")) {
        defaultCat = "Hydraulic Steering & Marine Piping";
      } else if (lowerItem.includes("rental") || lowerItem.includes("generator") || lowerItem.includes("genset")) {
        defaultCat = "Generator Rental (25 to 1250 kVA)";
      } else {
        defaultCat = "Marine Electrical & Automation";
      }

      defaultMsg = isId
        ? `Yth. Tim PT Pelican Mitra Sejati,\n\nSaya ingin mengajukan permohonan penawaran harga resmi dan konsultasi teknis terkait layanan ${itemName}.\n\nMohon informasikan rincian biaya komersial, ketersediaan unit, dan estimasi waktu pelaksanaan untuk kami tinjau.\n\nTerima kasih.`
        : `Dear PT Pelican Mitra Sejati Team,\n\nI would like to request an official quotation and technical consultation regarding ${itemName}.\n\nPlease provide detailed commercial pricing, availability, and execution lead time for our review.\n\nThank you.`;
    }

    setFormData((prev) => ({
      ...prev,
      category: defaultCat,
      message: defaultMsg,
    }));
  }, [queryType, queryItem, isId]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-hug vertical sizing: default minimum 130px (matching right card height), hugs content up to 260px, then becomes scrollable
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const clampedHeight = Math.min(Math.max(scrollHeight, 130), 260);
      textareaRef.current.style.height = `${clampedHeight}px`;
    }
  }, [formData.message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          vesselOrProject: formData.company || "Maritime Vessel / Project",
          phone: formData.phone,
          category: formData.category,
          scope: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirimkan pengajuan penawaran.");
      }

      setSubmittedRfqId(data.rfqId);
      setSubmitSuccess(true);
      setIsSubmitting(false);

      // Open prefilled WhatsApp in a new tab if available
      if (data.waUrl) {
        window.open(data.waUrl, "_blank");
      }
    } catch (err: any) {
      setSubmitError(err.message || (isId ? "Terjadi kesalahan saat mengirim formulir." : "An error occurred while submitting."));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Page Header (Single H1) */}
        <div className="mb-10 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            {isId
              ? "Hubungi Bengkel Kerja Batam & Ajukan Penawaran"
              : "Contact Batam Workshop & Request a Quote"}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            {isId
              ? "Hubungi langsung teknisi maritim kami, spesialis estimasi komersial, dan tim logistik untuk panggilan darurat kapal, sewa genset, atau pengadaan suku cadang asli di Batam."
              : "Connect directly with our marine engineers, commercial estimation specialists, and logistics personnel for emergency vessel call-outs, generator rentals, or genuine spare parts procurement."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">
          {/* Left Column: RFQ Form (Matches right card height by default, expands when text is elongated) */}
          <div className="lg:col-span-7">
            <Card className="bg-white border-slate-200 shadow-sm lg:min-h-[560px] flex flex-col overflow-visible">
              <CardContent className="p-6 sm:p-8 flex-1 flex flex-col justify-between overflow-visible">
                <div className="mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">
                    {isId ? "Formulir Permintaan Penawaran Harga (RFQ)" : "Submit Request for Quotation (RFQ)"}
                  </h2>
                  <p className="text-xs text-slate-500 font-normal">
                    {isId
                      ? "Lengkapi formulir di bawah ini untuk menerima proposal teknis dan penawaran komersial resmi dalam 1-2 jam kerja."
                      : "Complete the form below to receive a formal technical proposal and commercial quote within 1-2 business hours."}
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 text-center space-y-4 my-auto">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 mx-auto border border-emerald-200">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900">
                        {isId ? "Permintaan Penawaran Berhasil Dicatat" : "RFQ Successfully Logged"}
                      </h3>
                      <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                        {isId
                          ? "Permintaan teknis Anda telah tersimpan ke sistem operasional kami dan diteruskan ke WhatsApp teknisi piket Batam."
                          : "Your technical inquiry has been recorded in our commercial dispatch database and forwarded to our Batam duty engineer."}
                      </p>
                      {submittedRfqId && (
                        <div className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-mono text-slate-700 mt-2">
                          Ref ID: <span className="font-bold text-slate-900">{submittedRfqId}</span>
                        </div>
                      )}
                    </div>
                    <div className="pt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSubmitSuccess(false);
                          setSubmittedRfqId(null);
                          setFormData({
                            name: "",
                            company: "",
                            phone: "",
                            category: "Marine Electrical & Automation",
                            message: "",
                          });
                        }}
                        className="text-xs border-slate-300 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                        {isId ? "Kirim Permintaan Lain" : "Submit Another RFQ"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between overflow-visible">
                    <div className="space-y-4 overflow-visible">
                      {submitError && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                          <span>{submitError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-slate-700 block mb-1">
                            {isId ? "Nama Lengkap" : "Full Name"} <span className="text-pelican-red">*</span>
                          </label>
                          <Input
                            required
                            type="text"
                            placeholder={isId ? "Contoh: Bpk. Budi Santoso" : "e.g. Capt. James Tan"}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="h-10 text-xs sm:text-sm bg-white border border-slate-200 rounded-md shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-700 block mb-1">
                            {isId ? "Perusahaan atau Nama Galangan" : "Company or Shipyard Name"}
                          </label>
                          <Input
                            type="text"
                            placeholder={isId ? "Contoh: PT Samudera Batam Marine" : "e.g. Pacific Marine Offshore Pte Ltd"}
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="h-10 text-xs sm:text-sm bg-white border border-slate-200 rounded-md shadow-2xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-visible">
                        <div className="relative overflow-visible z-30">
                          <label className="text-xs font-medium text-slate-700 block mb-1">
                            {isId ? "Nomor WhatsApp atau Telepon" : "WhatsApp or Phone Number"}{" "}
                            <span className="text-pelican-red">*</span>
                          </label>
                          <PhoneInput
                            required
                            value={formData.phone}
                            onChange={(val) => setFormData({ ...formData, phone: val })}
                            className="h-10 text-xs sm:text-sm"
                          />
                        </div>
                        <div className="relative z-20">
                          <label className="text-xs font-medium text-slate-700 block mb-1">
                            {isId ? "Kategori Layanan" : "Service Category"}
                          </label>
                          <Select
                            value={formData.category}
                            onValueChange={(val) => setFormData({ ...formData, category: val || "" })}
                          >
                            <SelectTrigger className="w-full h-10 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-md text-slate-800 shadow-2xs focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:border-slate-900">
                              <SelectValue placeholder={isId ? "Pilih Kategori Layanan" : "Select Service Category"} />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200 shadow-md rounded-md max-h-72">
                              <SelectGroup>
                                {SERVICE_CATEGORIES.map((cat) => (
                                  <SelectItem key={cat.value} value={cat.value} className="text-xs sm:text-sm py-2">
                                    {isId ? cat.labelId : cat.labelEn}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-slate-700 block mb-1">
                          {isId ? "Deskripsi Kebutuhan & Spesifikasi Kapal" : "Project Scope & Vessel Specifications"}{" "}
                          <span className="text-pelican-red">*</span>
                        </label>
                        <textarea
                          ref={textareaRef}
                          required
                          rows={4}
                          placeholder={
                            isId
                              ? "Sebutkan lokasi kapal di Batam, kebutuhan kVA genset, rincian kendala mesin atau instrumen, atau ruang lingkup yang dibutuhkan..."
                              : "Specify your vessel location in Batam, required generator kVA rating, equipment fault descriptions, or required scope..."
                          }
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          style={{ minHeight: "130px", maxHeight: "260px" }}
                          className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-md shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 leading-relaxed font-normal overflow-y-auto"
                        />
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        size="lg"
                        className="w-full bg-pelican-red hover:bg-pelican-red-hover text-white font-semibold text-xs sm:text-sm h-11 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {isId ? "Mengirimkan RFQ..." : "Submitting RFQ..."}
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            {isId ? "Kirim Permintaan Penawaran (RFQ)" : "Submit RFQ"}
                          </>
                        )}
                      </Button>
                      <p className="text-[11px] text-slate-500 text-center font-normal">
                        {isId
                          ? "Terhubung langsung dengan tim operasional teknis PT Pelican Mitra Sejati."
                          : "Directly connected to PT Pelican Mitra Sejati's technical operations desk."}
                      </p>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Contact Details (Fixed natural size of 560px, will NOT elongate when left card expands) */}
          <div className="lg:col-span-5">
            <Card className="bg-white border-slate-200 shadow-sm lg:h-[560px] flex flex-col">
              <CardContent className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">
                      {isId ? "Saluran Komunikasi Resmi" : "Official Communication Channels"}
                    </h2>
                    <p className="text-xs text-slate-600 font-normal leading-relaxed">
                      {isId
                        ? "Hubungi langsung kantor pusat dan bengkel kerja kami di Batam. Tim manajemen operasional siap melayani konsultasi teknis, penawaran komersial resmi, serta dukungan inspeksi dan servis kapal ke seluruh galangan maritim."
                        : "Connect directly with our headquarters and technical workshop in Batam. Our operations management team is on standby to assist with technical inquiries, commercial RFQs, and marine service mobilization across all shipyards."}
                    </p>
                  </div>

                  <div className="space-y-5 text-xs sm:text-sm">
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-50 text-pelican-red border border-red-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="font-semibold text-slate-900 block mb-0.5">
                          {isId ? "Lokasi Kantor & Bengkel Kerja" : "Headquarters & Workshop Location"}
                        </strong>
                        <p className="text-slate-600 font-normal leading-relaxed text-xs">
                          Taman Niaga Blok M No. 3, Sukajadi, Batam, Kepulauan Riau 29432, Indonesia
                        </p>
                      </div>
                    </div>

                    {/* Phone & WhatsApp */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-50 text-pelican-red border border-red-100 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="font-semibold text-slate-900 block mb-0.5">
                          {isId ? "Pusat Panggilan Kantor" : "Office Call Center"}
                        </strong>
                        <div className="flex flex-col space-y-1 text-xs text-slate-600 font-normal pt-0.5">
                          <a
                            href="tel:+6287787806333"
                            className="text-slate-700 hover:text-pelican-red hover:underline transition-colors block leading-tight"
                          >
                            +62 877-8780-6333
                          </a>
                          <a
                            href="https://wa.me/6287787806333"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-700 hover:text-pelican-red hover:underline transition-colors block leading-tight"
                          >
                            WhatsApp: +62 877-8780-6333
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-50 text-pelican-red border border-red-100 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="font-semibold text-slate-900 block mb-0.5">
                          {isId ? "Korespondensi Perusahaan" : "Corporate Correspondence"}
                        </strong>
                        <div className="text-xs text-slate-600 font-normal pt-0.5">
                          <a
                            href="mailto:cmo@pelican-ms.com"
                            className="text-slate-700 hover:text-pelican-red hover:underline transition-colors block leading-tight"
                          >
                            cmo@pelican-ms.com
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-50 text-pelican-red border border-red-100 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="font-semibold text-slate-900 block mb-0.5">
                          {isId ? "Jam Operasional" : "Working Hours"}
                        </strong>
                        <div className="text-xs text-slate-600 font-normal space-y-0.5">
                          <p>{isId ? "Kantor: Senin sampai Jumat, 08:00 sampai 17:00 WIB" : "Office: Monday to Friday, 08:00 to 17:00 WIB"}</p>
                          <p className="text-slate-600 font-normal">
                            {isId ? "Panggilan Darurat Pelabuhan Maritim: Dukungan operasional penuh" : "Emergency Marine Port Call-Out: Full operational support"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                {/* Bottom Card Note (Consistent with Left Card Under-Button Text) */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500 text-center font-normal">
                    {isId
                      ? "Terhubung langsung dengan kantor pusat dan saluran komunikasi resmi PT Pelican Mitra Sejati."
                      : "Directly connected to PT Pelican Mitra Sejati's main office and official communication desk."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Width Google Maps Component */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {isId ? "Peta Lokasi Fasilitas Batam" : "Batam Facility Map Location"}
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              {isId
                ? "Terletak di kawasan komersial Sukajadi dengan akses jalan raya cepat ke seluruh pelabuhan di Batam."
                : "Located within the Sukajadi commercial hub with fast highway access to all Batam ports."}
            </p>
          </div>
          <GoogleMapCard />
        </div>
      </div>
    </div>
  );
}
