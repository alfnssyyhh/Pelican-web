"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TrustedOrganizations } from "@/components/trusted-organizations";
import { AchievementsSection } from "@/components/achievements-section";
import { FeaturedWorks } from "@/components/featured-works";
import { BrandPartners } from "@/components/brand-partners";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export function HomeView() {
  const { locale } = useLanguage();
  const isId = locale === "id";

  const pillars = [
    {
      icon: "/icons/services/mechanical-gears-badge.png",
      title: isId ? "Rekayasa Mekanik & Maritim" : "Marine & Mechanical Engineering",
      desc: isId
        ? "Overhaul berkala, rekondisi menyeluruh, dan penyejajaran poros presisi untuk mesin penggerak serta generator Cummins, Caterpillar, Yanmar, dan Perkins."
        : "Overhaul, maintenance, and precision alignment for Cummins, Caterpillar, Yanmar, and Perkins propulsion and auxiliary engines.",
      link: "/service",
    },
    {
      icon: "/icons/services/electrical-automation-badge.png",
      title: isId ? "Otomasi & Kalibrasi Instrumen" : "Automation & Calibration",
      desc: isId
        ? "Kalibrasi tersertifikasi MARPOL ODME dan OWS 15 ppm, sinkronisasi switchboard distribusi utama, dan diagnostik otomasi steering gear kapal."
        : "Certified MARPOL ODME and OWS calibration, switchboard synchronization, and steering gear automation diagnostics.",
      link: "/service",
    },
    {
      icon: "/icons/services/genset-rental-badge.png",
      title: isId ? "Rental Armada Genset & Catu Daya" : "Power Fleet & Equipment Rental",
      desc: isId
        ? "Armada genset diesel tugas berat 25 hingga 1250 kVA tipe silent dan kontainer siap mobilisasi cepat dengan pengujian resistive load bank."
        : "Heavy-duty 25 to 1250 kVA silent and containerized diesel generator fleet with resistive load bank testing.",
      link: "/rent",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 1. Hero Section: Clean, Concise, Single H1, 1 Button */}
      <section className="bg-zinc-900 border-b border-zinc-800 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl space-y-6">
            {/* Single H1 on page */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight break-words">
              {isId
                ? "Layanan Rekayasa Teknik Maritim, Migas, dan Industri Terpadu di Batam"
                : "Integrated Marine, Oil & Gas, and Industrial Engineering in Batam"}
            </h1>

            {/* Short concise overview per user request */}
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              {isId
                ? "Penyedia solusi rekayasa maritim dan industri di Batam yang menghadirkan dukungan teknis terpercaya, pemeliharaan mesin kapal, dan sistem daya sejak 2014."
                : "Batam-based marine and industrial engineering solutions provider delivering trusted technical support, machinery maintenance, and power systems since 2014."}
            </p>

            {/* Exactly 1 Single Button per user request */}
            <div className="pt-2">
              <Button
                asChild
                size="lg"
                className="bg-pelican-red hover:bg-pelican-red-hover text-white font-semibold text-xs sm:text-sm px-8 h-12 rounded-lg shadow-xs transition-colors"
              >
                <Link
                  href="/service"
                  aria-label="Lihat seluruh layanan divisi rekayasa teknik maritim PT Pelican Mitra Sejati"
                  className="inline-flex items-center gap-2"
                >
                  {isId ? "Lihat Seluruh Layanan Rekayasa" : "Explore Engineering Services"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Component 1: Trusted Organizations Marquee */}
      <section className="-mt-8 relative z-20">
        <ScrollReveal>
          <TrustedOrganizations />
        </ScrollReveal>
      </section>

      {/* 3. Core Disciplines Teaser */}
      <section className="py-14 sm:py-18 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isId ? "Divisi Rekayasa Teknik Khusus" : "Specialized Engineering Divisions"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1">
              {isId
                ? "Solusi rekayasa presisi yang dirancang untuk menjamin kesiapan operasional dan kepatuhan klasifikasi maritim."
                : "Engineered solutions tailored to ensure operational readiness and maritime classification compliance."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((item) => {
              return (
                <Link
                  key={item.title}
                  href={item.link}
                  aria-label={`Pelajari selengkapnya tentang layanan ${item.title}`}
                  className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-400 hover:shadow-xs transition-all group cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 shrink-0 flex items-center justify-start">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={56}
                        height={56}
                        className="w-14 h-14 object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug group-hover:text-pelican-red transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-2">
                    <span className="inline-flex items-center text-xs font-semibold text-pelican-red group-hover:translate-x-1 transition-all">
                      {isId ? "Lihat rincian divisi" : "View division details"}
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Component 2: Our Achievements Animated Number Ticker */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <ScrollReveal>
          <AchievementsSection />
        </ScrollReveal>
      </section>

      {/* 5. Featured Works Gallery */}
      <ScrollReveal>
        <FeaturedWorks />
      </ScrollReveal>

      {/* 6. Supported Equipment Brands & Genuine Components */}
      <ScrollReveal>
        <BrandPartners />
      </ScrollReveal>
    </div>
  );
}
