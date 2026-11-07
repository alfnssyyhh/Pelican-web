"use client";

import { Product } from "@/lib/data";
import { ProductCatalog } from "@/components/product-catalog";
import { useLanguage } from "@/lib/i18n/language-context";

interface ProductViewProps {
  products: Product[];
}

export function ProductView({ products }: ProductViewProps) {
  const { locale } = useLanguage();
  const isId = locale === "id";

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Header (Single H1) */}
        <div className="mb-8 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            {isId
              ? "Suku Cadang Maritim & Instrumentasi Industri"
              : "Marine Spare Parts & Industrial Instrumentation"}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            {isId
              ? "Dapatkan suku cadang asli mesin diesel Cummins, differential fuel flow meter presisi tinggi Technoton, dan aksesori generator industri dengan dukungan teknis pabrikan langsung dari gudang di Batam."
              : "Source genuine Cummins diesel engine replacement parts, Technoton high-precision fuel flow meters, and industrial generator accessories with full manufacturer technical support and direct warehouse dispatch in Batam."}
          </p>
        </div>

        {/* Interactive Catalog Component */}
        <ProductCatalog initialProducts={products} />
      </div>
    </div>
  );
}
