"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/language-context";

const PARTNER_LOGOS = [
  { name: "S Target Group", src: "/partners/s.png" },
  { name: "MCC Shanghai Baoye", src: "/partners/mcc.png" },
  { name: "LSE Labroy", src: "/partners/labroy.png" },
  { name: "PaxOcean", src: "/partners/paxocean.png" },
  { name: "Bakamla", src: "/partners/bakamla.png" },
  { name: "Bourbon Marine", src: "/partners/bourbon.png" },
  { name: "Citra Shipyard", src: "/partners/Citra.png" },
  { name: "M Pallonji", src: "/partners/Mpallonji.png" },
  { name: "Goodwill", src: "/partners/goodwill.png" },
];

export function TrustedOrganizations() {
  const { locale } = useLanguage();
  const isId = locale === "id";
  // Duplicate array for seamless infinite loop
  const doubleLogos = [...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-7 overflow-hidden space-y-5">
        {/* Top Centered Label */}
        <div className="text-center">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {isId ? "Dipercaya oleh Mitra " : "Trusted by Leading "}
            <span className="text-pelican-red">
              {isId ? "Industri Terkemuka" : "Industry Organizations"}
            </span>
          </h2>
        </div>

        {/* Full-Width Horizontal Infinite Marquee Carousel */}
        <div className="w-full overflow-hidden mask-fade relative">
          <div className="animate-marquee flex items-center gap-10 sm:gap-14">
            {doubleLogos.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="h-10 sm:h-12 w-28 sm:w-32 relative shrink-0 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100"
              >
                <Image
                  src={partner.src}
                  alt={partner.name}
                  fill
                  sizes="130px"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
