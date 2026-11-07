"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client/server error
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-16 px-4 sm:px-6 font-sans">
      <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xs space-y-6">
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-pelican-red">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          {/* Single H1 on error state */}
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Terjadi Kendala Teknis Sementara
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Sistem kami mendeteksi anomali pada pemuatan data halaman. Silakan coba memuat ulang halaman ini atau kembali ke beranda utama.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => reset()}
            className="bg-pelican-red hover:bg-pelican-red-hover text-white text-xs font-semibold px-5 h-10 shadow-xs"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Coba Muat Ulang
          </Button>

          <Button asChild variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium px-5 h-10">
            <Link href="/" className="inline-flex items-center gap-2">
              <Home className="w-4 h-4" />
              Beranda Utama
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
