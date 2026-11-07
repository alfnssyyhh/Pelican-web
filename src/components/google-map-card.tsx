"use client";

import { useState } from "react";
import { MapPin, ExternalLink, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-context";

export function GoogleMapCard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { locale } = useLanguage();
  const isId = locale === "id";

  const mapsDirectUrl =
    "https://www.google.com/maps/search/?api=1&query=PT+Pelican+Mitra+Sejati+Batam";
  const embedUrl =
    "https://maps.google.com/maps?q=PT+Pelican+Mitra+Sejati+Batam&t=m&z=15&output=embed&iwloc=near";

  return (
    <div className="relative w-full h-[360px] sm:h-[450px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
      {isLoaded ? (
        <iframe
          title="PT Pelican Mitra Sejati Location Map"
          src={embedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50 relative select-none">
          <div className="relative z-10 max-w-md space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-pelican-red mx-auto flex items-center justify-center shadow-xs">
              <MapPin className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                PT Pelican Mitra Sejati Batam
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1 leading-relaxed">
                Taman Niaga Blok M No. 3-5, Sukajadi, Batam, Kepulauan Riau 29432
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLoaded(true)}
                className="w-full sm:w-auto border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs font-medium px-4 h-10 shadow-xs"
              >
                <Compass className="w-3.5 h-3.5 mr-2 text-pelican-red" />
                {isId ? "Tampilkan Peta Interaktif" : "Load Interactive Map"}
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs font-medium px-4 h-10 shadow-xs"
              >
                <a
                  href={mapsDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-2" />
                  {isId ? "Buka di Google Maps" : "Open in Google Maps"}
                </a>
              </Button>
            </div>

            <p className="text-[11px] text-slate-500 font-normal">
              {isId
                ? "Akses navigasi GPS langsung atau muat peta interaktif di peramban Anda."
                : "Open direct GPS directions or load the interactive map in your browser."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
