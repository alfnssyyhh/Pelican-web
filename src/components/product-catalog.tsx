"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PackageCheck, ArrowRight, Package } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

interface ProductCatalogProps {
  initialProducts: Product[];
}

export function ProductCatalog({ initialProducts }: ProductCatalogProps) {
  const router = useRouter();
  const { locale } = useLanguage();
  const isId = locale === "id";

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openSuggestions, setOpenSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => p.categories.forEach((c) => set.add(c)));
    return ["All", ...Array.from(set).sort()];
  }, [initialProducts]);

  // Compute matched products for recommendations starting from 1 char
  const matchedSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return initialProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          p.categories.some((c) => c.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [initialProducts, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setOpenSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!openSuggestions || matchedSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev + 1 < matchedSuggestions.length ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev - 1 >= 0 ? prev - 1 : matchedSuggestions.length - 1
      );
    } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
      e.preventDefault();
      const selected = matchedSuggestions[activeSuggestionIndex];
      router.push(`/product/${selected.slug}`);
    } else if (e.key === "Escape") {
      setOpenSuggestions(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchCategory =
        selectedCategory === "All" || p.categories.includes(selectedCategory);
      const matchSearch =
        searchQuery.trim() === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.short_description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [initialProducts, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 font-sans">
      {/* Search and Category Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat === "All" ? (isId ? "Semua" : "All") : cat}
              </button>
            ))}
          </div>

          {/* Search Box with Live Autocomplete Popover */}
          <div ref={searchContainerRef} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder={isId ? "Cari nama komponen, SKU, merk..." : "Search part name, SKU, brand..."}
              value={searchQuery}
              onFocus={() => {
                if (matchedSuggestions.length > 0) setOpenSuggestions(true);
              }}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenSuggestions(true);
                setActiveSuggestionIndex(-1);
              }}
              onKeyDown={handleSearchKeyDown}
              autoComplete="off"
              className="pl-9 text-xs sm:text-sm bg-slate-50 border-slate-300"
            />

            {/* Recommendations Dropdown */}
            {openSuggestions && matchedSuggestions.length > 0 && (
              <div className="absolute left-0 top-full mt-1.5 w-full md:w-96 z-50 rounded-xl border border-slate-200 bg-white p-2 shadow-lg animate-in fade-in-50 zoom-in-95">
                <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {isId ? "Rekomendasi Produk" : "Product Suggestions"}
                </div>
                <div className="divide-y divide-slate-100">
                  {matchedSuggestions.map((prod, idx) => {
                    const isActive = idx === activeSuggestionIndex;
                    const q = searchQuery.trim().toLowerCase();
                    const matchIdx = prod.name.toLowerCase().indexOf(q);

                    let highlightedName: React.ReactNode = prod.name;
                    if (matchIdx !== -1) {
                      const before = prod.name.slice(0, matchIdx);
                      const matched = prod.name.slice(matchIdx, matchIdx + q.length);
                      const after = prod.name.slice(matchIdx + q.length);
                      highlightedName = (
                        <>
                          {before}
                          <span className="font-semibold text-pelican-red underline underline-offset-2">
                            {matched}
                          </span>
                          {after}
                        </>
                      );
                    }

                    return (
                      <Link
                        key={prod.id}
                        href={`/product/${prod.slug}`}
                        onClick={() => setOpenSuggestions(false)}
                        onMouseEnter={() => setActiveSuggestionIndex(idx)}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
                          isActive ? "bg-slate-100" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="relative size-10 rounded-md border border-slate-200 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                          {prod.thumbnail_url ? (
                            <Image
                              src={prod.thumbnail_url}
                              alt={prod.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <Package className="size-5 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-800 truncate">
                            {highlightedName}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {prod.sku && (
                              <span className="text-[10px] text-slate-500 font-mono">
                                SKU: {prod.sku}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">·</span>
                            <span className="text-[10px] text-slate-500">
                              {prod.categories[0] || "Component"}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="size-3.5 text-slate-400 shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Counter & Active Filter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            {isId ? `Menampilkan ${filteredProducts.length} komponen & peralatan maritim` : `Showing ${filteredProducts.length} marine components & equipment`}
          </span>
          {selectedCategory !== "All" && (
            <button
              onClick={() => setSelectedCategory("All")}
              className="text-pelican-red hover:underline font-medium"
            >
              {isId ? "Reset filter kategori" : "Reset category filter"}
            </button>
          )}
        </div>
      </div>

      {/* Accessible H2 Heading for Sequential Structure */}
      <h2 className="sr-only">
        {isId ? "Daftar Katalog Suku Cadang dan Peralatan" : "Spare Parts and Equipment Catalog List"}
      </h2>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <PackageCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            {isId ? "Produk tidak ditemukan" : "No products found"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-4 max-w-md mx-auto">
            {isId
              ? `Kami tidak menemukan komponen yang cocok dengan "${searchQuery}". Silakan hubungi tim penjualan teknis kami untuk pengecekan inventaris gudang manual.`
              : `We could not find any component matching "${searchQuery}". Please contact our technical sales team for manual warehouse inventory check.`}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="text-xs"
          >
            {isId ? "Tampilkan Semua Produk" : "Show All Products"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="bg-white border-slate-200 hover:border-slate-400 transition-colors flex flex-col justify-between overflow-hidden shadow-sm group"
            >
              <Link href={`/product/${product.slug}`} className="block cursor-pointer">
                {/* Product Image */}
                <div className="relative aspect-4/3 w-full bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4">
                  {product.thumbnail_url ? (
                    <Image
                      src={product.thumbnail_url}
                      alt={product.name}
                      fill
                      priority={index < 2}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-slate-600 text-xs flex flex-col items-center">
                      <PackageCheck className="w-8 h-8 mb-1" />
                      <span>{isId ? "Gambar Segera Hadir" : "Image Coming Soon"}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <CardContent className="p-5 space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {product.categories.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300"
                      >
                        {c}
                      </span>
                    ))}
                    {product.sku && (
                      <span className="text-[10px] text-slate-700 font-mono">
                        SKU: {product.sku}
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-base text-slate-900 line-clamp-2 group-hover:text-pelican-red transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-600 font-normal line-clamp-3 leading-relaxed">
                    {(isId
                      ? product.short_description_id || product.short_description
                      : product.short_description_en || product.short_description) ||
                      (isId
                        ? "Suku cadang maritim dan industri asli dari manufaktur tersertifikasi dengan pengiriman langsung dari gudang di Batam."
                        : "Certified genuine manufacturer marine and industrial parts with direct warehouse dispatch in Batam.")}
                  </p>
                </CardContent>
              </Link>

              {/* Action Buttons & Status */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
                <div
                  className={`w-1/2 h-9 text-xs rounded-md font-semibold border inline-flex items-center justify-center ${
                    product.stock_status === "instock"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-slate-100 text-slate-700 border-slate-300"
                  }`}
                >
                  {product.stock_status === "instock" ? "Stock Available" : "Stock Unavailable"}
                </div>
                <Button
                  asChild
                  size="sm"
                  className="w-1/2 h-9 text-xs bg-pelican-red hover:bg-pelican-red-hover text-white font-medium shadow-2xs"
                >
                  <Link href={`/product/${product.slug}`}>
                    {isId ? "Rincian" : "Details"}
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
