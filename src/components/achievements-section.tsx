"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/language-context";

interface CounterItem {
  target: number;
  suffix: string;
  label_en: string;
  label_id: string;
}

const ACHIEVEMENTS: CounterItem[] = [
  { target: 500, suffix: "+", label_en: "Projects Completed", label_id: "Proyek Terselesaikan" },
  { target: 200, suffix: "+", label_en: "Satisfied Clients", label_id: "Klien Terpercaya" },
  { target: 50, suffix: "+", label_en: "Skilled Professionals", label_id: "Tenaga Ahli Bersertifikat" },
  { target: 10, suffix: "+", label_en: "Years of Experience", label_id: "Tahun Pengalaman" },
  {
    target: 100,
    suffix: "+",
    label_en: "Industrial & Marine Equipment Supported",
    label_id: "Peralatan Industri & Maritim Didukung",
  },
];

function CounterNumber({ target, suffix, isVisible }: { target: number; suffix: string; isVisible: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function (easeOutQuad)
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const currentVal = Math.floor(easeProgress * target);

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCount(target);
      }
    }

    requestAnimationFrame(update);
  }, [isVisible, target]);

  return (
    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-pelican-red tracking-tight font-sans">
      {count}
      {suffix}
    </span>
  );
}

export function AchievementsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const { locale } = useLanguage();
  const isId = locale === "id";

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Matching Image 2 */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            {isId ? "Pencapaian Kami" : "Our Achievements"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            {isId
              ? "Cerminan kepercayaan dan kepuasan klien atas standar mutu rekayasa kami."
              : "A reflection of our clients' trust and satisfaction in the quality of our services."}
          </p>
        </div>

        {/* 5 Stats Columns Matching Image 2 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 text-center">
          {ACHIEVEMENTS.map((item) => (
            <div key={item.label_en} className="space-y-2">
              <div>
                <CounterNumber target={item.target} suffix={item.suffix} isVisible={isVisible} />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-normal leading-snug max-w-[160px] mx-auto">
                {isId ? item.label_id : item.label_en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
