"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Zap,
  ShieldCheck,
  Clock,
  Wrench,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export function RentView() {
  const { locale } = useLanguage();
  const isId = locale === "id";

  const getRentalStatus = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s === "rented") {
      return {
        label: "Rented",
        className: "bg-rose-100 text-rose-800 border-rose-300",
      };
    }
    if (s === "maintenance") {
      return {
        label: "Maintenance",
        className: "bg-amber-100 text-amber-900 border-amber-300",
      };
    }
    if (s === "unavailable" || s === "outofstock") {
      return {
        label: "Stock Unavailable",
        className: "bg-slate-100 text-slate-700 border-slate-300",
      };
    }
    return {
      label: "Stock Available",
      className: "bg-emerald-100 text-emerald-800 border-emerald-300",
    };
  };

  const rentalProducts = [
    {
      id: 891,
      status: "available",
      name: isId
        ? "Solusi Rental Genset Maritim & Lepas Pantai"
        : "Marine & Offshore Power Rental Solution",
      description: isId
        ? "Solusi daya sewa yang dirancang khusus untuk memenuhi standar ketat operasional maritim dan perairan lepas pantai, menghadirkan keandalan tinggi pada kondisi lingkungan laut yang menantang."
        : "This power rental solution is developed to meet the unique demands of marine and offshore operations, offering reliable performance in harsh environments with high operational standards.",
      image: "/uploads/2026/01/genset4.jpg",
      specs: isId
        ? "Genset bantu maritim tonase tinggi & daya lepas pantai"
        : "High-tonnage marine auxiliary & offshore power",
      stock: isId ? "Stok tersedia" : "Stock available",
      price: isId ? "Hubungi kami" : "Contact for quote",
    },
    {
      id: 889,
      status: "available",
      name: isId
        ? "Rental Daya Sementara untuk Proyek Konstruksi & Galangan"
        : "Temporary Power Rental for Construction Projects",
      description: isId
        ? "Solusi rental genset siap pakai untuk mendukung pasokan daya sementara selama aktivitas konstruksi dan proyek galangan kapal guna memastikan alur kerja tanpa henti di lokasi."
        : "This rental solution is specifically prepared to support temporary power requirements during construction and project-based activities, ensuring uninterrupted workflow on-site.",
      image: "/uploads/2026/01/genset1.jpg",
      specs: isId
        ? "Mobilisasi cepat ke lokasi & kanopi silent kontainer"
        : "Rapid site deployment & containerized silent canopy",
      stock: isId ? "Stok tersedia" : "Stock available",
      price: isId ? "Hubungi kami" : "Contact for quote",
    },
    {
      id: 887,
      status: "available",
      name: isId
        ? "Rental Genset Industri 1000 kVA (Tipe Terbuka)"
        : "Industrial Genset Rental 1000 kVA (Open Type)",
      description: isId
        ? "Genset tipe terbuka 1000 kVA dirancang untuk operasional industri skala besar yang membutuhkan daya listrik kontinu dan berkapasitas tinggi dengan stabilitas beban penuh."
        : "This 1000 kVA open-type generator is designed to support large-scale industrial operations requiring high and continuous power output. Built for durability, this unit delivers stable performance under heavy load conditions.",
      image: "/uploads/2026/01/genset2.jpg",
      specs: isId
        ? "Daya kontinu 1000 kVA tugas berat tipe terbuka"
        : "1000 kVA open-type continuous duty power",
      stock: isId ? "Stok tersedia" : "Stock available",
      price: isId ? "Hubungi kami" : "Contact for quote",
    },
    {
      id: 885,
      status: "available",
      name: isId
        ? "Catu Daya Darurat Genset Diesel Yanmar"
        : "Emergency Backup Power by Yanmar Diesel Generator",
      description: isId
        ? "Genset diesel berbasis mesin Yanmar yang menghadirkan solusi daya cadangan darurat terpercaya, menjaga kelangsungan operasional saat terjadi pemadaman listrik tidak terduga."
        : "This Yanmar-based diesel generator provides a reliable emergency backup power solution, ensuring business continuity during power outages or unexpected electrical disruptions.",
      image: "/uploads/2026/01/genset3.jpg",
      specs: isId
        ? "Mesin diesel maritim Yanmar · Auto-start instan darurat"
        : "Yanmar marine diesel engine · Instant emergency auto-start",
      stock: isId ? "Stok tersedia" : "Stock available",
      price: isId ? "Hubungi kami" : "Contact for quote",
    },
    {
      id: 883,
      status: "available",
      name: isId
        ? "Rental Genset Maritim Tipe Terbuka E1 Cat 500 kVA"
        : "Marine Open Genset Rental E1 Cat 500 kVA",
      description: isId
        ? "Generator tipe terbuka 500 kVA ditenagai mesin Caterpillar CAT E1 dirancang untuk aplikasi maritim dan industri berat, hemat bahan bakar dan tangguh di lingkungan ekstrem."
        : "This 500 kVA open-type generator powered by a CAT E1 engine is engineered for marine and heavy-duty applications, delivering strong performance, fuel efficiency, and operational reliability in demanding environments.",
      image: "/uploads/2026/01/genset5.jpg",
      specs: isId
        ? "Mesin diesel tugas berat maritim 500 kVA CAT E1"
        : "500 kVA CAT E1 marine heavy-duty engine",
      stock: isId ? "Stok tersedia" : "Stock available",
      price: isId ? "Hubungi kami" : "Contact for quote",
    },
    {
      id: 871,
      status: "available",
      name: isId
        ? "Rental Genset Industri 350 kVA Tipe Silent"
        : "Industrial Genset Rental 350 kVA Silent Type",
      description: isId
        ? "Genset silent 350 kVA dirancang untuk kebutuhan daya industri dengan tingkat kebisingan rendah, sangat cocok untuk lingkungan kerja dengan batasan regulasi suara ketat."
        : "This 350 kVA silent generator is designed to meet industrial power demands while maintaining low noise levels, making it suitable for environments with strict operational and environmental standards.",
      image: "/uploads/2026/01/genset6.jpg",
      specs: isId
        ? "Kanopi akustik kedap suara 350 kVA · Emisi kebisingan rendah"
        : "350 kVA acoustic silent canopy · Low noise emission",
      stock: isId ? "Stok tersedia" : "Stock available",
      price: isId ? "Hubungi kami" : "Contact for quote",
    },
  ];

  const gensetSpecs = [
    {
      capacity: "25 - 60 kVA",
      engine: "Perkins & Yanmar",
      canopy: isId ? "Kanopi Silent" : "Silent Canopy",
      fuel: isId ? "Diesel Industri (Solar)" : "HSD Diesel",
      idealFor: isId
        ? "Penerangan darurat, gedung komersial, kantor proyek, dan event."
        : "Emergency lighting, commercial buildings, site offices, events.",
      availability: isId ? "Siap kirim dari Batam" : "Immediate Dispatch from Batam",
    },
    {
      capacity: "100 - 250 kVA",
      engine: "Cummins & Perkins",
      canopy: isId ? "Silent Tugas Berat" : "Silent Heavy Duty",
      fuel: isId ? "Diesel Industri (Solar)" : "Industrial Diesel",
      idealFor: isId
        ? "Bengkel galangan kapal, gudang pendingin (cold storage), dan cadangan pabrik."
        : "Shipyard workshops, cold storage, fabrication, factory backup.",
      availability: isId ? "Siap kirim dari Batam" : "Immediate Dispatch from Batam",
    },
    {
      capacity: "350 - 500 kVA",
      engine: "Cummins KTA19 & Caterpillar",
      canopy: isId ? "Silent Tugas Berat" : "Silent Heavy Duty",
      fuel: isId ? "Diesel Industri (Solar)" : "Industrial Diesel",
      idealFor: isId
        ? "Galangan dok kering kapal, pabrik manufaktur, batching plant, armada lepas pantai."
        : "Dry dock shipyards, manufacturing plants, batching plants, offshore support.",
      availability: isId ? "Siap kirim dari Batam" : "Immediate Dispatch from Batam",
    },
    {
      capacity: "750 - 1250 kVA",
      engine: "Cummins KTA38 & KTA50",
      canopy: isId ? "Kontainer & Siap Sinkronisasi" : "Containerized & Sync Ready",
      fuel: isId ? "Diesel Industri (Solar)" : "Industrial Diesel",
      idealFor: isId
        ? "Jaringan daya utama industri, dok galangan kapal besar, dan rig pengeboran lepas pantai."
        : "Main industrial power grids, large shipyard docks, offshore drilling rigs.",
      availability: isId ? "Mobilisasi terjadwal" : "Mobilization on Schedule",
    },
  ];

  const advantages = [
    {
      icon: ShieldCheck,
      title: isId ? "100% Teruji Load Bank" : "100% Load-Bank Tested",
      desc: isId
        ? "Setiap unit generator diesel melalui pengujian ketat load bank sebelum dikirim, menjamin stabilitas beban 100% tanpa risiko trip mendadak."
        : "Every diesel generator undergoes rigorous load bank testing prior to mobilization, guaranteeing 100% load stability without unexpected tripping.",
    },
    {
      icon: Clock,
      title: isId ? "Tim Teknisi Siaga & Dukungan Operasional Penuh" : "On-Site Support Team & Full Operational Support",
      desc: isId
        ? "Teknisi berpengalaman di Batam siap menangani pemeliharaan berkala, pengawasan operasi, dan penanganan darurat di lapangan dengan dukungan operasional penuh."
        : "Dedicated Batam technicians provide regular maintenance, operational supervision, and rapid on-site troubleshooting with full operational support.",
    },
    {
      icon: Zap,
      title: isId ? "Sinkronisasi Otomatis Multi-Unit" : "Multi-Unit Auto Synchronization",
      desc: isId
        ? "Panel sinkronisasi otomatis terintegrasi untuk kebutuhan daya besar melebihi 1000 kVA dan sistem redundansi N+1 yang aman."
        : "Integrated automatic synchronization control panels for high-capacity power needs exceeding 1000 kVA and N+1 redundancy architectures.",
    },
    {
      icon: Wrench,
      title: isId ? "Paket Solusi Catu Daya Lengkap" : "Complete Power Package",
      desc: isId
        ? "Pilihan sewa fleksibel harian, mingguan, bulanan, dan tahunan, lengkap dengan tangki bahan bakar eksternal, kabel tembaga, dan operator bersertifikat."
        : "Flexible daily, weekly, monthly, and yearly rental options including external fuel tanks, heavy copper cables, and certified K3 operators.",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Page Header (Single H1) */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            {isId
              ? "Rental Genset Batam: Solusi Daya Andal untuk Industri & Maritim"
              : "Reliable Genset Rental for Industrial & Marine Needs"}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            {isId
              ? "Solusi sewa fleksibel didukung teknisi bersertifikat, kapasitas 25 kVA hingga 1250 kVA, dan peralatan 100% teruji load bank untuk galangan kapal, platform lepas pantai, serta manufaktur di Batam."
              : "Flexible rental solutions supported by certified technicians, 25 kVA to 1250 kVA capacity, and 100% load-bank tested equipment for shipyards, offshore platforms, and manufacturing plants in Batam."}
          </p>
        </div>

        {/* Rental Products Grid */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {isId ? "Daftar Unit Armada Generator Rental" : "Rental Generator Fleet Units"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1">
                {isId
                  ? "Genset diesel teruji lapangan yang siap dimobilisasi cepat ke seluruh galangan kapal dan kawasan industri di Batam."
                  : "Field-tested diesel generators ready for immediate mobilization across Batam shipyards and industrial zones."}
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shrink-0 self-start sm:self-auto">
              {isId ? "6 Kategori Rental Aktif" : "6 Active Rental Categories"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentalProducts.map((prod, idx) => (
              <div
                key={prod.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <Link
                  href={`/contact?type=rental&item=${encodeURIComponent(prod.name)}`}
                  className="block cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      priority={idx < 2}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    <span className="text-[11px] text-slate-500 font-normal block">
                      {prod.specs}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug group-hover:text-pelican-red transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-3">
                      {prod.description}
                    </p>
                  </div>
                </Link>

                {/* Footer with Status and Action */}
                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  {(() => {
                    const st = getRentalStatus(prod.status);
                    return (
                      <div
                        className={`h-9 px-3.5 rounded-md text-xs font-semibold border inline-flex items-center justify-center ${st.className}`}
                      >
                        {st.label}
                      </div>
                    );
                  })()}

                  <Button
                    asChild
                    size="sm"
                    className="bg-pelican-red hover:bg-pelican-red-hover text-white text-xs font-semibold px-4 h-9 shadow-2xs"
                  >
                    <Link
                      href={`/contact?type=rental&item=${encodeURIComponent(prod.name)}`}
                      className="inline-flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {isId ? "Hubungi Kami" : "Contact Us"}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Advantages */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
              {isId ? "Keandalan Armada & Standar Rekayasa" : "Fleet Reliability & Engineering Standards"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              {isId
                ? "Setiap generator dirawat sesuai regulasi keselamatan lepas pantai dan maritim internasional."
                : "Every generator is maintained to strict international offshore and maritime safety regulations."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv) => {
              const Icon = adv.icon;
              return (
                <div key={adv.title} className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-pelican-red border border-red-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-pelican-red" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm">{adv.title}</h3>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">{adv.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Capacity Specifications Table (Desktop & Mobile) */}
        <section className="mb-16">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
              {isId ? "Pilihan Kapasitas Generator" : "Generator Capacity Options"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              {isId
                ? "Pilih kapasitas daya yang sesuai dengan profil beban kebutuhan proyek Anda."
                : "Select your required power rating based on your project load profile."}
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-800 font-semibold">
                  <th className="py-3.5 px-4">{isId ? "Kapasitas (kVA)" : "Capacity (kVA)"}</th>
                  <th className="py-3.5 px-4">{isId ? "Mesin Diesel" : "Diesel Engine"}</th>
                  <th className="py-3.5 px-4">{isId ? "Tipe Kanopi" : "Canopy Type"}</th>
                  <th className="py-3.5 px-4">{isId ? "Aplikasi Utama" : "Primary Application"}</th>
                  <th className="py-3.5 px-4">{isId ? "Ketersediaan" : "Availability"}</th>
                  <th className="py-3.5 px-4 text-right">{isId ? "Konsultasi" : "Inquiry"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gensetSpecs.map((spec) => (
                  <tr key={spec.capacity} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 text-sm">{spec.capacity}</td>
                    <td className="py-4 px-4 text-slate-700">{spec.engine}</td>
                    <td className="py-4 px-4 text-slate-700">{spec.canopy}</td>
                    <td className="py-4 px-4 text-slate-600 max-w-xs leading-relaxed">{spec.idealFor}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {spec.availability}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button asChild size="sm" className="bg-pelican-red hover:bg-pelican-red-hover text-white text-xs font-medium">
                        <Link href="/contact">
                          {isId ? "Tanya Unit" : "Inquire Unit"}
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="lg:hidden space-y-4">
            {gensetSpecs.map((spec) => (
              <div key={spec.capacity} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                    {isId ? "Kapasitas" : "Capacity"}
                  </span>
                  <span className="text-base font-bold text-slate-900">{spec.capacity}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">{isId ? "Mesin:" : "Engine:"}</span>
                    <span className="font-medium text-slate-800">{spec.engine}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{isId ? "Kanopi:" : "Canopy:"}</span>
                    <span className="font-medium text-slate-800">{spec.canopy}</span>
                  </div>
                </div>
                <div className="text-xs">
                  <span className="text-slate-500 block">{isId ? "Aplikasi:" : "Application:"}</span>
                  <p className="text-slate-700 font-normal mt-0.5">{spec.idealFor}</p>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {spec.availability}
                  </span>
                  <Button asChild size="sm" className="bg-pelican-red hover:bg-pelican-red-hover text-white text-xs font-medium">
                    <Link href="/contact">
                      {isId ? "Hubungi Kami" : "Contact Us"}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Supporting Equipment */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-16 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-4">
            {isId ? "Peralatan Pendukung & Solusi Catu Daya Siap Pakai" : "Ancillary Equipment & Turnkey Solutions"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600">
            <div className="border-l-2 border-transparent hover:border-pelican-red pl-4 space-y-1 transition-colors duration-200 cursor-default">
              <h3 className="font-semibold text-slate-900">
                {isId ? "Kabel Daya & Panel Distribusi" : "Power Cables & Distribution"}
              </h3>
              <p className="font-normal leading-relaxed">
                {isId
                  ? "Kabel tembaga standar industri 4x16 mm² hingga 4x240 mm² lengkap dengan panel distribusi dan pemutus sirkuit pengaman."
                  : "Industrial grade 4x16 mm² to 4x240 mm² copper cables complete with distribution panels and circuit breakers."}
              </p>
            </div>
            <div className="border-l-2 border-transparent hover:border-pelican-red pl-4 space-y-1 transition-colors duration-200 cursor-default">
              <h3 className="font-semibold text-slate-900">
                {isId ? "Layanan Uji Beban (Load Bank Test)" : "Load Bank Testing Service"}
              </h3>
              <p className="font-normal leading-relaxed">
                {isId
                  ? "Load bank resistif dan reaktif hingga 2000 kW untuk verifikasi survei maritim dan pengujian sistem catu daya kritis."
                  : "Resistive and reactive load banks up to 2000 kW for marine survey verification and critical power testing."}
              </p>
            </div>
            <div className="border-l-2 border-transparent hover:border-pelican-red pl-4 space-y-1 transition-colors duration-200 cursor-default">
              <h3 className="font-semibold text-slate-900">
                {isId ? "Tangki Bahan Bakar Harian & Operator" : "External Fuel Tanks & Crew"}
              </h3>
              <p className="font-normal leading-relaxed">
                {isId
                  ? "Tangki penyimpanan solar 1000 hingga 5000 liter beserta operator mekanik bersertifikat K3 untuk operasional kontinu tanpa henti."
                  : "1000 to 5000 liter daily fuel storage tanks and certified mechanical operators for uninterrupted continuous operations."}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section: Structured for Rich Snippets & User Guidance */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-16 shadow-xs">
          <div className="max-w-2xl mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {isId ? "Pertanyaan Umum Seputar Rental Genset di Batam" : "Frequently Asked Questions About Generator Rental"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1">
              {isId
                ? "Informasi teknis dan prosedur pengadaan catu daya darurat untuk galangan kapal dan industri."
                : "Technical specifications and procurement procedures for shipyard emergency power in Batam."}
            </p>
          </div>

          <Accordion type="single" collapsible defaultValue="faq-1" className="w-full">
            <AccordionItem value="faq-1">
              <AccordionTrigger>
                {isId
                  ? "Berapa kapasitas genset yang tersedia untuk disewa?"
                  : "What generator capacities are available for rental?"}
              </AccordionTrigger>
              <AccordionContent>
                {isId
                  ? "PT Pelican Mitra Sejati menyediakan unit generator diesel berkapasitas 25 kVA hingga 1250 kVA dalam tipe silent kanopi dan kontainer yang siap disinkronisasi untuk kebutuhan daya besar."
                  : "PT Pelican Mitra Sejati maintains a diesel fleet ranging from 25 kVA to 1250 kVA in silent canopy and containerized units capable of power synchronization."}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2">
              <AccordionTrigger>
                {isId
                  ? "Apakah seluruh armada genset sudah teruji load bank?"
                  : "Is the rental fleet load bank tested prior to deployment?"}
              </AccordionTrigger>
              <AccordionContent>
                {isId
                  ? "Ya, setiap unit melalui pengujian beban penuh dengan resistive load bank sebelum dikirimkan ke lokasi galangan kapal atau fasilitas klien guna memastikan keandalan operasional 100% tanpa risiko trip."
                  : "Yes, every generator undergoes full resistive load bank testing before dispatch to guarantee 100% operational reliability under continuous working loads."}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3">
              <AccordionTrigger>
                {isId
                  ? "Berapa lama waktu mobilisasi genset ke galangan kapal di Batam?"
                  : "How fast can a generator be mobilized to a Batam shipyard?"}
              </AccordionTrigger>
              <AccordionContent>
                {isId
                  ? "Untuk kebutuhan perbaikan darurat kapal sandar di Batam, unit genset dan kabel distribusi dapat dikirimkan pada hari yang sama (same-day delivery) setelah verifikasi RFQ."
                  : "For urgent dry-dock and vessel repair emergencies in Batam, generator units and cabling can be mobilized same-day upon confirmation."}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4">
              <AccordionTrigger>
                {isId
                  ? "Apakah rental sudah termasuk perlengkapan kabel daya dan tangki solar?"
                  : "Does the rental include power cables and daily fuel tanks?"}
              </AccordionTrigger>
              <AccordionContent>
                {isId
                  ? "Kami menyediakan paket catu daya terpadu lengkap dengan kabel tembaga industri (4x16 mm² hingga 4x240 mm²), panel distribusi, tangki solar harian (1000 - 5000 liter), serta operator bersertifikat."
                  : "We provide turnkey power setups complete with industrial copper cabling (4x16 mm² to 4x240 mm²), distribution panels, external fuel tanks, and certified operators."}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5">
              <AccordionTrigger>
                {isId
                  ? "Bagaimana mekanisme pengajuan penawaran resmi (RFQ)?"
                  : "How to request an official quotation (RFQ)?"}
              </AccordionTrigger>
              <AccordionContent>
                {isId
                  ? "Silakan isi formulir kontak atau kirimkan rincian kebutuhan daya dan durasi sewa langsung ke WhatsApp resmi kami di +62 877 8780 6333 untuk menerima penawaran harga resmi."
                  : "Submit your power requirements and rental duration through our RFQ form or contact our official technical WhatsApp at +62 877 8780 6333 for a prompt quote."}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Bottom Callout */}
        <div className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isId
                ? "Butuh Pengadaan Genset Darurat di Batam?"
                : "Urgent Power Generation Required in Batam?"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              {isId
                ? "Tim logistik dan teknisi kami siap mengirimkan unit generator dan instalasi kabel listrik langsung ke dok galangan kapal atau lokasi proyek Anda dalam hitungan jam."
                : "Our logistics and technical staff can deploy generator units and electrical cabling directly to your shipyard dock or industrial worksite within hours."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-pelican-red hover:bg-pelican-red-hover text-white font-semibold text-xs px-6 h-11"
            >
              <Link href="/contact">
                {isId ? "Hubungi Kami" : "Contact Us"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
