import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench, Zap, PackageCheck, BookOpen, ArrowLeft, PhoneCall } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 py-16 px-4 sm:px-6">
      <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-xs space-y-8">
        {/* Error Badge */}
        <div className="space-y-3">
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-red-50 text-pelican-red border border-red-200">
            Error 404 · Halaman Tidak Ditemukan
          </span>
          {/* Single H1 on Page */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Halaman yang Anda Cari Tidak Tersedia
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Tautan yang Anda tuju mungkin telah diperbarui, dipindahkan, atau alamat URL yang dimasukkan kurang tepat. Silakan gunakan tautan navigasi di bawah ini untuk mengakses layanan resmi PT Pelican Mitra Sejati.
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <Link
            href="/service"
            className="p-3.5 border border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 group-hover:text-pelican-red transition-colors">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 block">Layanan Rekayasa</span>
              <span className="text-slate-500 font-normal">Kalibrasi &amp; otomasi kapal</span>
            </div>
          </Link>

          <Link
            href="/rent"
            className="p-3.5 border border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 group-hover:text-pelican-red transition-colors">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 block">Rental Armada Genset</span>
              <span className="text-slate-500 font-normal">Kapasitas 25 - 1250 kVA</span>
            </div>
          </Link>

          <Link
            href="/product"
            className="p-3.5 border border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 group-hover:text-pelican-red transition-colors">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 block">Katalog Suku Cadang</span>
              <span className="text-slate-500 font-normal">Suku cadang Cummins &amp; flow meter</span>
            </div>
          </Link>

          <Link
            href="/artikel"
            className="p-3.5 border border-slate-200 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 group-hover:text-pelican-red transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 block">Artikel Teknis</span>
              <span className="text-slate-500 font-normal">Wawasan lapangan maritim</span>
            </div>
          </Link>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <Button asChild className="bg-pelican-red hover:bg-pelican-red-hover text-white text-xs font-semibold px-5 h-10 shadow-xs">
            <Link href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
          </Button>

          <Button asChild variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium px-5 h-10">
            <Link href="/contact" className="inline-flex items-center gap-2">
              <PhoneCall className="w-4 h-4" />
              Hubungi Workshop Batam
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
