"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-context";

interface WorkPhoto {
  src: string;
  caption: string;
  aspect?: string;
}

interface ProjectItem {
  slug: string;
  client: string;
  vessel: string;
  location: string;
  banner: string;
  workPhotos: WorkPhoto[];
  scope: string;
  milestones: string[];
}

export function WorksView() {
  const { locale } = useLanguage();
  const isId = locale === "id";
  const searchParams = useSearchParams();
  const projectParam = searchParams.get("project");

  const allProjects: ProjectItem[] = [
    {
      slug: "bourbon-offshore-asia",
      client: "Bourbon Offshore Asia",
      vessel: isId ? "Kapal Anchor Handling Tug Supply (AHTS)" : "Anchor Handling Tug Supply (AHTS)",
      location: isId ? "Galangan Kapal & Perairan Batam" : "Batam Shipyard & Anchorage",
      banner: "/projects/bourbon-vessel.jpg",
      workPhotos: [
        {
          src: "/projects/bourbon-work-1.jpg",
          caption: isId ? "Rigging Poros Engkol & Blok Mesin" : "Crankshaft & Engine Block Rigging",
        },
        {
          src: "/projects/bourbon-work-2.jpg",
          caption: isId ? "Komisioning Pemutus Arus Switchboard" : "Switchboard Breaker Commissioning",
        },
        {
          src: "/projects/bourbon-work-3.jpg",
          caption: isId ? "Pemeliharaan & Overhaul Cylinder Head" : "Cylinder Head Maintenance & Overhaul",
        },
      ],
      scope: isId
        ? "Overhaul menyeluruh dan aktivasi kelistrikan untuk pembangkit daya bantu tonase tinggi di atas kapal tunda penanganan jangkar laut dalam."
        : "Comprehensive overhaul and electrical activation for high-tonnage auxiliary power generation on board deep-water anchor handling tugs.",
      milestones: isId
        ? [
            "Major overhaul generator diesel tugas berat Cummins QSK60",
            "Aktivasi sistem otomasi generator diesel dan kalibrasi distribusi beban",
            "Overhaul total Emergency Diesel Generator (EDG) Cummins 6CT & uji coba laut pelabuhan",
          ]
        : [
            "Major overhaul of heavy diesel generator Cummins QSK60",
            "Diesel generator automation system activation and load distribution tuning",
            "Emergency Diesel Generator (EDG) Cummins 6CT system complete overhaul & harbor sea trial",
          ],
    },
    {
      slug: "bakamla-ri",
      client: "Bakamla RI (Indonesian Coast Guard)",
      vessel: isId ? "Kapal Patroli KN Pulau Dana 323" : "Patrol Vessel KN Pulau Dana 323",
      location: isId ? "Pangkalan Maritim Batam" : "Batam Naval Base Facility",
      banner: "/projects/bakamla-vessel.jpg",
      workPhotos: [
        {
          src: "/projects/bakamla-work-1.jpg",
          caption: isId ? "Rigging Gearbox & Penyejajaran Poros" : "Gearbox Rigging & Shaft Alignment",
        },
        {
          src: "/projects/bakamla-work-2.jpg",
          caption: isId ? "Pengaturan Konsol Otomasi Viking 35" : "Viking 35 Automation Console Setup",
        },
        {
          src: "/projects/bakamla-work-3.jpg",
          caption: isId ? "Inspeksi Sistem Penggerak Mesin Utama" : "Main Engine Propulsion Inspection",
        },
      ],
      scope: isId
        ? "Pemasangan transmisi penggerak dan komisioning kontrol otomasi untuk kesiapan patroli pertahanan maritim nasional."
        : "Propulsion transmission re-engineering and automation control commissioning for national maritime defense patrol readiness.",
      milestones: isId
        ? [
            "Pemasangan gearbox maritim presisi dan penyejajaran laser ke Mesin Diesel MAN",
            "Instalasi lengkap sistem kelistrikan, instrumentasi & survei fungsional",
            "Penyetelan, kalibrasi, dan komisioning sistem kontrol propulsi VIKING 35 sesuai standar internasional",
          ]
        : [
            "Precision marine gearbox installation and laser alignment to MAN Diesel Engine",
            "Complete electrical and instrumentation system installation & functional survey",
            "Setting, calibration, and commissioning of VIKING 35 propulsion control system to international standards",
          ],
    },
    {
      slug: "dta-maritime-dubai",
      client: "DTA Maritime Dubai",
      vessel: isId ? "Kapal Lepas Pantai Komersial Crest Spartan 1" : "Commercial Offshore Vessel Crest Spartan 1",
      location: isId ? "Fasilitas Dok Kering Batam" : "Batam Drydock Facilities",
      banner: "/projects/dta-vessel.jpg",
      workPhotos: [
        {
          src: "/projects/dta-work-1.jpg",
          caption: isId ? "Inspeksi Cylinder Liner CAT 3516" : "CAT 3516 Cylinder Liner Inspection",
        },
        {
          src: "/projects/dta-work-2.jpg",
          caption: isId ? "Kalibrasi Presisi Jalur Bahan Bakar & Torsi" : "Precision Fuel Line & Torque Calibration",
        },
        {
          src: "/projects/dta-work-3.jpg",
          caption: isId ? "Servis Switchboard Distribusi Utama" : "Main Distribution Switchboard Service",
        },
      ],
      scope: isId
        ? "Overhaul generator bantu turnkey dan komisioning menyeluruh otomasi dari jembatan navigasi hingga kamar mesin di bawah pengawasan biro klasifikasi."
        : "Turnkey auxiliary generator overhaul and complete navigation-to-engine room automation commissioning executed under class supervision.",
      milestones: isId
        ? [
            "Major overhaul generator diesel maritim tugas berat Caterpillar CAT 3516",
            "Aktivasi lengkap sistem kelistrikan, instrumen, dan navigasi jembatan",
            "Penyetelan parameter mesin akhir, uji beban ketahanan panas (heat-run), dan sea trial",
          ]
        : [
            "Major overhaul of Caterpillar CAT 3516 heavy marine diesel generator",
            "Complete electrical, instrument, and bridge navigation systems activation",
            "Final engine parameter tuning, heat-run load testing, and post-overhaul sea trials",
          ],
    },
    {
      slug: "m-pallonji-shipping",
      client: "M Pallonji Shipping",
      vessel: isId ? "Kapal Pendukung Lepas Pantai Sea Halibut (UT 755L)" : "Offshore Vessel Sea Halibut (UT 755L)",
      location: isId ? "Selat Singapura dan Pelabuhan Batam" : "Singapore Strait & Batam Port",
      banner: "/projects/pallonji-vessel.jpg",
      workPhotos: [
        {
          src: "/projects/pallonji-work-1.jpg",
          caption: isId ? "Overhaul Silinder Mesin Bergen Rolls-Royce" : "Rolls-Royce Bergen Cylinder Overhaul",
        },
        {
          src: "/projects/pallonji-work-2.jpg",
          caption: isId ? "Pengujian & Komisioning Daya Bantu" : "Auxiliary Power Testing & Commissioning",
        },
        {
          src: "/projects/pallonji-work-3.jpg",
          caption: isId ? "Konsol Otomasi Jembatan Terintegrasi" : "Integrated Bridge Automation Console",
        },
      ],
      scope: isId
        ? "Reaktivasi mekanik menyeluruh dan modernisasi otomasi untuk kapal pendukung multi-fungsi bersertifikasi Dynamic Positioning (DP)."
        : "Full mechanical reactivation and automation modernization for offshore DP-rated multi-purpose support vessel.",
      milestones: isId
        ? [
            "Major overhaul mesin diesel maritim Bergen Rolls-Royce",
            "Reaktivasi seluruh sistem kelistrikan, instrumentasi, dan navigasi anjungan",
            "Komisioning otomasi mesin utama, Dynamic Positioning (DP), Vessel Monitoring System (VMS), dan UMAS",
          ]
        : [
            "Major overhaul of Bergen Rolls-Royce marine diesel engine",
            "All electrical, instrument, and bridge navigation systems reactivation",
            "Main engine, Dynamic Positioning (DP), Vessel Monitoring System (VMS), and UMAS automation commissioning",
          ],
    },
    {
      slug: "baby-pegasus",
      client: isId ? "Kapal Pesiar Motor Baby Pegasus" : "Motor Yacht Baby Pegasus",
      vessel: isId ? "Kapal Pesiar Mewah Kecepatan Tinggi" : "Luxury High-Speed Motor Yacht",
      location: isId ? "Fasilitas Marina Batam" : "Batam Marina Facilities",
      banner: "/projects/pegasus-vessel.jpg",
      workPhotos: [
        {
          src: "/projects/pegasus-work-1.jpg",
          caption: isId ? "Diagnostik Telemetri Kamar Mesin" : "Engine Room Telemetry Diagnostics",
        },
        {
          src: "/projects/pegasus-work-2.jpg",
          caption: isId ? "Verifikasi Tampilan Kontrol Jembatan" : "Bridge Control Display Verification",
        },
        {
          src: "/projects/pegasus-work-3.jpg",
          caption: isId ? "Pemasangan Modul Kontrol ECU MDEC C1" : "ECU MDEC C1 Control Unit Installation",
        },
      ],
      scope: isId
        ? "Troubleshooting elektronik presisi dan penggantian modul manajemen mesin pada mesin kapal cepat performa tinggi MAN."
        : "Precision electronic troubleshooting and engine management module replacement on high-performance MAN marine engines.",
      milestones: isId
        ? [
            "Troubleshooting elektronik, diagnostik CAN bus, dan pelacakan kesalahan ECU di atas kapal",
            "Instalasi, penulisan parameter, dan kalibrasi ECU MDEC C1 pada mesin kapal MAN",
            "Uji coba mesin, pencatatan data telemetri sea trial, dan serah terima operasional penuh",
          ]
        : [
            "Electronic troubleshooting, CAN bus diagnostics, and ECU fault tracing on board",
            "Installation, parameter flashing, and calibration of ECU MDEC C1 to MAN marine engine",
            "Engine test runs, sea trial telemetry logging, and full operational handover",
          ],
    },
    {
      slug: "mv-xintian",
      client: "MV Xintian",
      vessel: isId ? "Kapal Pengangkut Curah (Bulk Carrier)" : "Bulk Cargo Carrier",
      location: isId ? "Perairan Labuh Jangkar Batam" : "Batam Anchorage",
      banner: "/projects/xintian-crack-test.jpg",
      workPhotos: [
        {
          src: "/projects/xintian-crack-test.jpg",
          caption: isId ? "Pengujian Keretakan Non-Destruktif (NDT) Poros Engkol" : "Crankshaft Non-Destructive Penetrant Crack Testing",
          aspect: "aspect-16/9",
        },
        {
          src: "/projects/xintian-grinding.jpg",
          caption: isId ? "Permesinan Presisi In-Situ & Pemolesan Poros Engkol" : "In-Situ Precision Crankshaft Machining & Polishing",
          aspect: "aspect-16/9",
        },
      ],
      scope: isId
        ? "Diagnosa khusus keretakan poros engkol dan permesinan presisi in-situ langsung di dalam ruang engkol kapal di labuh jangkar tanpa mencopot poros."
        : "Specialized in-situ crankshaft crack diagnosis and precision machining executed inside the engine crankcase at anchorage without removing the shaft.",
      milestones: isId
        ? [
            "Pengujian keretakan Dye Penetrant Non-Destruktif (NDT) pada crankpin poros engkol",
            "Penggerindaan orbital presisi in-situ di lokasi untuk mengembalikan geometri journal poros",
            "Verifikasi toleransi mikron dan pengesahan surveyor biro klasifikasi",
          ]
        : [
            "Non-Destructive Dye Penetrant Crack Testing (NDT) on crankshaft crankpins",
            "On-site precision in-situ crankshaft orbital grinding to restore journal geometry",
            "Micron tolerance verification and final class surveyor sign-off",
          ],
    },
    {
      slug: "pos-logistic-1",
      client: "POS Logistic 1",
      vessel: isId ? "Kapal Logistik Peti Kemas & Kargo" : "Container & Cargo Logistics Vessel",
      location: isId ? "Pelabuhan Komersial Batam" : "Batam Commercial Port",
      banner: "/projects/pos-logistic-vessel.jpg",
      workPhotos: [
        {
          src: "/projects/bourbon-work-2.jpg",
          caption: isId ? "Retrofit Kontrol PLC Steering Gear & Modifikasi Panel" : "Steering Gear PLC Control Retrofit & Panel Modification",
          aspect: "aspect-3/4",
        },
      ],
      scope: isId
        ? "Peningkatan darurat sistem otomasi PLC steering gear kapal dan retrofit panel sakelar putar untuk memulihkan daya manuver kapal."
        : "Emergency marine steering gear PLC upgrade and rotary switchboard panel retrofit to restore vessel maneuverability.",
      milestones: isId
        ? [
            "Troubleshooting dan instalasi otomasi steering gear berbasis PLC industri",
            "Modifikasi & retrofit panel switchboard putar dengan konfigurasi PLC kustom",
            "Troubleshooting dan kalibrasi ulang telemetri flow meter bahan bakar minyak (FO) mesin bantu",
          ]
        : [
            "Troubleshooting and installation of industrial PLC steering gear automation",
            "Modification & retrofit of rotary switchboard panel with custom PLC configuration",
            "Troubleshooting and recalibration of auxiliary engine fuel oil (FO) flow telemetry",
          ],
    },
  ];

  const activeProject = projectParam
    ? allProjects.find((p) => p.slug === projectParam)
    : null;

  const displayedProjects = activeProject ? [activeProject] : allProjects;

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Page Header (Single H1) */}
        <div className="mb-10 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            {isId
              ? "Rekam Jejak Resmi Rekayasa Lapangan & Studi Kasus Proyek"
              : "Official Field Engineering Track Record & Project Case Studies"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            {isId
              ? "Setiap proyek di bawah ini merupakan pekerjaan rekayasa nyata terverifikasi yang dilakukan oleh tim teknisi PT Pelican Mitra Sejati di galangan kapal, labuh jangkar, dan dok kering di Batam. Dokumentasi foto diambil langsung dari operasional di atas kapal."
              : "Every project below represents verified engineering work performed by PT Pelican Mitra Sejati field crews across shipyards, anchorages, and drydocks in Batam. Photographic records are captured directly from on-board operations."}
          </p>
        </div>

        {/* Filtered State Banner (Option A: Focused Project View with Clear Button) */}
        {activeProject && (
          <div className="mb-8 p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 font-medium block">
                {isId ? "Menampilkan proyek pilihan:" : "Displaying selected project case study:"}
              </span>
              <span className="text-base font-bold text-slate-900">{activeProject.client}</span>
            </div>
            <Button asChild variant="outline" size="sm" className="border-slate-300 text-xs">
              <Link href="/works" className="inline-flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5 text-pelican-red" />
                {isId ? "Tampilkan Semua Proyek" : "Show All Projects"}
              </Link>
            </Button>
          </div>
        )}

        {/* Consistent Card Layout with Border and Elevating Shadows */}
        <div className="space-y-12">
          {displayedProjects.map((proj, idx) => (
            <article
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6"
            >
              {/* Project Meta and Title */}
              <div className="space-y-2 border-b border-slate-100 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-pelican-red" />
                      {proj.location}
                    </span>
                    <span>·</span>
                    <span className="text-slate-600">{proj.vessel}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 font-normal">
                    {isId ? "Standar:" : "Standards:"}{" "}
                    <span className="text-slate-800 font-medium">
                      {isId ? "Survei ABS, BV, BKI, dan Lloyd's" : "ABS, BV, BKI, and Lloyd's Survey"}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {proj.client}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-3xl">
                  {proj.scope}
                </p>
              </div>

              {/* Vessel Banner (Clean without overlay badges) */}
              <div className="relative aspect-21/9 w-full bg-slate-100 rounded-lg overflow-hidden">
                <Image
                  src={proj.banner}
                  alt={proj.client}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-cover"
                />
              </div>

              {/* Engineering Execution Photos */}
              {proj.workPhotos.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-800 block mb-3">
                    {isId ? "Dokumentasi eksekusi rekayasa:" : "Engineering execution photography:"}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {proj.workPhotos.map((photo, pIdx) => (
                      <div key={pIdx} className="space-y-2 group">
                        <div
                          className={`relative ${
                            photo.aspect || "aspect-3/4"
                          } w-full bg-slate-100 rounded-lg overflow-hidden`}
                        >
                          <Image
                            src={photo.src}
                            alt={photo.caption}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <p className="text-xs text-slate-600 font-normal leading-tight">
                          {photo.caption}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Executed Engineering Milestones */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-800 block mb-3">
                  {isId ? "Tahapan rekayasa yang dieksekusi:" : "Executed engineering milestones:"}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {proj.milestones.map((ms, mIdx) => (
                    <div
                      key={mIdx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-normal leading-relaxed">{ms}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
