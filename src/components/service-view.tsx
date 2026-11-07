"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export function ServiceView() {
  const { locale } = useLanguage();
  const isId = locale === "id";

  const divisions = [
    {
      icon: "/icons/services/electrical-automation-badge.png",
      title: isId ? "Kelistrikan & Otomasi Maritim" : "Marine Electrical & Automation",
      subtitle: isId ? "Kontrol Kapal, Pembangkitan & Distribusi Daya" : "Vessel Control, Power Generation & Distribution",
      desc: isId
        ? "Layanan siklus rekayasa lengkap untuk sistem otomasi maritim, pemecahan masalah main switchboard (MSB), sinkronisasi generator, power management system (PMS), alarm monitoring system (AMS), dan konsol kontrol mesin utama terotomasi."
        : "Complete lifecycle engineering for marine automation systems, main switchboard (MSB) troubleshooting, generator synchronization, power management systems (PMS), alarm monitoring systems (AMS), and automated main engine control consoles.",
      capabilities: isId
        ? [
            "Alarm Monitoring Systems (AMS) & konsol mesin jarak jauh",
            "Pemeliharaan pemutus arus main switchboard & sinkronisasi generator",
            "Kontrol boiler & pemecahan masalah otomasi",
            "Layanan darurat kelistrikan & dukungan dok galangan kapal",
          ]
        : [
            "Alarm Monitoring Systems (AMS) & remote engine consoles",
            "Main switchboard breaker maintenance & generator synchronization",
            "Boiler control & automation troubleshooting",
            "Emergency electrical call-out & shipyard dry-dock support",
          ],
    },
    {
      icon: "/icons/services/calibration-instrumentation-badge.png",
      title: isId ? "Instrumentasi Lingkungan & Kalibrasi" : "Environmental Instrumentation & Calibration",
      subtitle: isId ? "Kepatuhan MARPOL, ODME & Alarm Got 15 ppm" : "MARPOL Compliance, ODME & 15 ppm Bilge Alarms",
      desc: isId
        ? "Kalibrasi tersertifikasi, survei tahunan, dan perbaikan peralatan pemantauan lingkungan maritim sesuai kepatuhan regulasi IMO MARPOL Annex I & Annex VI."
        : "Certified calibration, annual survey, and repair services for maritime environmental monitoring equipment adhering strictly to IMO MARPOL Annex I & Annex VI regulations.",
      capabilities: isId
        ? [
            "Kalibrasi & pengujian Oil Discharge Monitoring Equipment (ODME)",
            "Verifikasi & rekondisi 15 ppm Bilge Alarm (OWS)",
            "Kalibrasi marine tank gauging & transmitter tekanan",
            "Sertifikasi deteksi gas tetap & sensor uap beracun",
          ]
        : [
            "Oil Discharge Monitoring Equipment (ODME) calibration & testing",
            "15 ppm Bilge Alarm (OWS) verification & reconditioning",
            "Marine tank gauging & pressure transmitter calibration",
            "Fixed gas detection & toxic vapor sensor certification",
          ],
    },
    {
      icon: "/icons/services/genset-rental-badge.png",
      title: isId ? "Sistem Rental Daya & Genset" : "Rental Power & Generator Systems",
      subtitle: isId ? "Armada Industri & Maritim 25 kVA hingga 1250 kVA" : "25 kVA to 1250 kVA Industrial & Marine Fleet",
      desc: isId
        ? "Armada genset tugas berat tipe silent canopy dan kontainer yang siap dimobilisasi untuk kapal maritim, fabrikasi galangan, pengeboran lepas pantai, dan kontinuitas pabrik di Kepulauan Riau."
        : "Deployable heavy-duty silent and containerized generator sets designed for marine vessels, shipyard fabrications, offshore drilling, and continuous factory operations across Riau Islands.",
      capabilities: isId
        ? [
            "Unit genset silent canopy & tipe kontainer",
            "Pengujian load bank hingga 2000 kW untuk survei kepatuhan kelas",
            "Panel sinkronisasi otomatis multi-generator",
            "Teknisi mekanik & kelistrikan bersertifikat dengan dukungan operasional penuh di lokasi",
          ]
        : [
            "Silent canopy & containerized genset units",
            "Load bank testing up to 2000 kW for marine survey compliance",
            "Multi-generator automatic synchronization panels",
            "Certified on-site mechanical & electrical technicians with full operational support",
          ],
    },
    {
      icon: "/icons/services/mechanical-gears-badge.png",
      title: isId ? "Overhaul & Pemeliharaan Mesin Diesel" : "Diesel Engine Overhaul & Maintenance",
      subtitle: isId ? "Spesialis Mesin Penggerak & Generator Bantu" : "Propulsion & Auxiliary Engine Specialists",
      desc: isId
        ? "Layanan mekanik presisi mencakup top dan major overhaul, rekondisi cylinder head, servis turbocharger, dan diagnostik terkomputerisasi untuk mesin diesel maritim terkemuka."
        : "Precision mechanical services including top and major engine overhauls, cylinder head reconditioning, turbocharger servicing, and computerized diagnostics for leading marine diesel engines.",
      capabilities: isId
        ? [
            "Cummins (seri KTA19, KTA38, KTA50, 6BT, 6CT)",
            "Mesin penggerak utama & genset bantu Caterpillar",
            "Mesin diesel industri & maritim Yanmar serta Perkins",
            "Kalibrasi pompa injeksi bahan bakar & governor elektronik",
          ]
        : [
            "Cummins (KTA19, KTA38, KTA50, 6BT, 6CT series)",
            "Caterpillar marine propulsion & auxiliary engines",
            "Yanmar & Perkins industrial diesel engines",
            "Fuel injection pump & governor calibration",
          ],
    },
    {
      icon: "/icons/services/spare-parts-supply-badge.png",
      title: isId ? "Sistem Hidrolik & Perpipaan Maritim" : "Hydraulic Systems & Marine Piping",
      subtitle: isId ? "Tenaga Fluida Tekanan Tinggi & Pengelasan Tersertifikasi" : "High-Pressure Fluid Power & Certified Welding",
      desc: isId
        ? "Overhaul sistem kemudi hidrolik (steering gear), pemeliharaan mesin geladak (winch, crane, windlass), rekondisi katup, dan fabrikasi pipa baja karbon serta stainless steel tekanan tinggi."
        : "Hydraulic steering gear overhaul, deck machinery maintenance (winches, cranes, windlasses), valve reconditioning, and high-pressure carbon and stainless steel pipe fabrication.",
      capabilities: isId
        ? [
            "Perbaikan & pengujian sistem kontrol steering gear hidrolik",
            "Peralatan geladak: windlass, crane kapal, dan towing winch",
            "Flushing hidrolik tekanan tinggi & uji tekanan hidrostatik",
            "Instalasi perpipaan kapal oleh juru las bersertifikat 6G",
          ]
        : [
            "Hydraulic steering gear control system repair & testing",
            "Deck machinery: windlasses, cranes, and towing winches",
            "High-pressure hydraulic flushing & hydrostatic pressure tests",
            "Certified 6G welder piping installation for marine vessels",
          ],
    },
    {
      icon: "/icons/services/electronics-diagnostics-badge.png",
      title: isId ? "Navigasi & Komunikasi Radio" : "Navigation & Radio Communication",
      subtitle: isId ? "Elektronik Jembatan & Peralatan Keselamatan" : "Bridge Electronics & Safety Equipment",
      desc: isId
        ? "Inspeksi survei radio tahunan resmi, pemecahan masalah radar, overhaul gyro compass, echo sounder, dan pemeliharaan komunikasi satelit maritim."
        : "Authorized annual radio survey inspections, radar troubleshooting, gyro compass overhaul, echo sounders, and marine satellite communication maintenance.",
      capabilities: isId
        ? [
            "Survei radio tahunan GMDSS & pengujian EPIRB dan SART",
            "Perbaikan radar maritim X-Band & S-Band serta penggantian magnetron",
            "Penyesuaian gyro compass, autopilot, dan magnetic compass",
            "Automatic Identification System (AIS) & navigator GPS maritim",
          ]
        : [
            "GMDSS annual radio survey & EPIRB and SART testing",
            "Marine X-Band & S-Band radar repairs & magnetron replacement",
            "Gyro compass, autopilot, and magnetic compass adjustment",
            "Automatic Identification System (AIS) & GPS navigators",
          ],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Page Header (Single H1) */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            {isId
              ? "Divisi Rekayasa Maritim, Lepas Pantai & Industri"
              : "Marine, Offshore & Industrial Engineering Divisions"}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            {isId
              ? "Dengan pengalaman lapangan bertahun-tahun, PT Pelican Mitra Sejati menghadirkan layanan rekayasa tersertifikasi bagi pemilik kapal, galangan kapal, dan operator lepas pantai di Batam, Selat Singapura, dan perairan regional."
              : "With decades of combined field experience, PT Pelican Mitra Sejati offers certified engineering services to vessel owners, shipyards, and offshore operators across Batam, Singapore Strait, and regional Indonesian waters."}
          </p>
        </div>

        {/* Divisions Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {divisions.map((div, idx) => {
            return (
              <Card
                key={div.title}
                className="bg-white border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden"
              >
                <CardContent className="p-6 sm:p-8 space-y-4">
                  <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                    <Image
                      src={div.icon}
                      alt={div.title}
                      width={64}
                      height={64}
                      priority={idx < 2}
                      className="w-16 h-16 object-contain"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                      {div.title}
                    </h2>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">
                      {div.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                    {div.desc}
                  </p>

                  <div className="pt-2">
                    <span className="text-xs font-semibold text-slate-900 block mb-2">
                      {isId ? "Kemampuan Rekayasa Utama:" : "Key Engineering Capabilities:"}
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {div.capabilities.map((cap) => (
                        <li key={cap} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <div className="p-6 pt-0 mt-3 flex items-center justify-start">
                  <Button
                    asChild
                    size="sm"
                    className="w-auto bg-pelican-red hover:bg-pelican-red-hover text-white text-xs font-semibold px-5 h-9"
                  >
                    <Link href={`/contact?type=service&item=${encodeURIComponent(div.title)}`}>
                      {isId ? "Ajukan Layanan Ini" : "Inquire This Service"}
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* B2B Callout */}
        <div className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isId
                ? "Butuh Solusi Rekayasa Khusus untuk Kapal Anda?"
                : "Need a Custom Engineering Solution for Your Vessel?"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              {isId
                ? "Tim teknis kami siap meninjau gambar kapal, riwayat diagnostik, dan kebutuhan survei kelas untuk merancang rencana perbaikan yang komprehensif."
                : "Our technical teams can review your vessel blueprints, diagnostic logs, and class survey requirements to propose a comprehensive service plan."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-pelican-red hover:bg-pelican-red-hover text-white font-semibold text-xs px-6 h-12"
            >
              <Link href="/contact">
                {isId ? "Hubungi Tim Teknisi" : "Contact Engineering Team"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
