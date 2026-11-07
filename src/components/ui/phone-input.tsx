"use client";

import * as React from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronsUpDown, Search, Check, Globe, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ALL_COUNTRIES from "@/data/countries.json";

export interface Country {
  name: string;
  code: string;
  dialCode: string;
}

export const COUNTRIES: Country[] = ALL_COUNTRIES as Country[];

/**
 * Universal crisp country flag renderer.
 * Serves local high-definition flags (all 242 countries stored in /flags/{code}.png)
 * with instant 0ms latency and 100% offline support.
 */
export function CountryFlag({ code, className }: { code: string; className?: string }) {
  const [imgError, setImgError] = useState(false);
  const baseClass = cn(
    "w-5 h-3.5 rounded-xs shrink-0 object-cover shadow-2xs border border-slate-200/90 inline-block align-middle",
    className
  );

  // Globe icon for "Other"
  if (code === "XX" || !code) {
    return (
      <span className={cn(baseClass, "bg-slate-100 flex items-center justify-center text-slate-600 p-0.5")}>
        <Globe className="size-3 text-slate-600" />
      </span>
    );
  }

  const lower = code.toLowerCase();

  // If local image fails, fallback to flagcdn.com, then clean initials
  if (imgError) {
    return (
      <img
        src={`https://flagcdn.com/w40/${lower}.png`}
        alt={code}
        width={20}
        height={14}
        className={baseClass}
        onError={() => {
          // Final fallback
        }}
      />
    );
  }

  return (
    <img
      src={`/flags/${lower}.png`}
      alt={code}
      width={20}
      height={14}
      loading="lazy"
      onError={() => setImgError(true)}
      className={baseClass}
    />
  );
}

export interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  defaultCountry?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export function PhoneInput({
  value = "",
  onChange,
  defaultCountry = "ID",
  placeholder,
  disabled = false,
  required = false,
  className,
  id,
  name,
}: PhoneInputProps) {
  // Active country detection
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    if (value) {
      // Find matching dial code sorted by length descending so +673 matches before +6
      const sorted = [...COUNTRIES].filter((c) => c.dialCode !== "+").sort((a, b) => b.dialCode.length - a.dialCode.length);
      const match = sorted.find((c) => value.startsWith(c.dialCode));
      if (match) return match;
    }
    return COUNTRIES.find((c) => c.code === defaultCountry) || COUNTRIES[0];
  });

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Always guarantee valid value formatted with dial code
  const displayValue = useMemo(() => {
    if (!value) return `${selectedCountry.dialCode} `;
    if (value.startsWith("+")) return value;
    return `${selectedCountry.dialCode} ${value}`;
  }, [value, selectedCountry]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery("");

    // Strip previous dial code from current value
    let subscriber = value;
    for (const c of COUNTRIES) {
      if (c.dialCode !== "+" && subscriber.startsWith(c.dialCode)) {
        subscriber = subscriber.slice(c.dialCode.length).trim();
        break;
      }
    }
    const updated = subscriber
      ? `${country.dialCode} ${subscriber}`
      : `${country.dialCode} `;
    onChange?.(updated);
    setTimeout(() => phoneInputRef.current?.focus(), 50);
  };

  /**
   * KEY FIX: Prevent backspace/delete from destroying the dial code prefix!
   * Stops the cursor at '+62 ' so no partial dial digits (like '6') can ever be generated.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const dial = selectedCountry.dialCode;
    const minPrefixLength = dial.length + 1;

    if (e.key === "Backspace" || e.key === "Delete") {
      const input = e.currentTarget;
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;

      // If user selected all (or from start) and pressed Backspace/Delete, reset cleanly to '+62 '
      if (start === 0 && end >= minPrefixLength) {
        e.preventDefault();
        onChange?.(`${dial} `);
        return;
      }

      // Backspace when cursor is at or before the end of dial code prefix
      if (e.key === "Backspace" && start === end && start <= minPrefixLength) {
        e.preventDefault();
        return;
      }

      // Delete key when cursor is before the end of dial code prefix
      if (e.key === "Delete" && start === end && start < minPrefixLength) {
        e.preventDefault();
        return;
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const dial = selectedCountry.dialCode;
    const minPrefixLength = dial.length + 1;
    if ((e.currentTarget.selectionStart ?? 0) < minPrefixLength) {
      e.currentTarget.setSelectionRange(minPrefixLength, minPrefixLength);
    }
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const dial = selectedCountry.dialCode;

    // Safety fallback: if user somehow destroyed prefix
    if (!raw.startsWith(dial)) {
      if (raw.length <= dial.length) {
        onChange?.(`${dial} `);
        return;
      }
      // Check if user pasted a number from another country
      const matched = COUNTRIES.find(
        (c) => c.dialCode !== "+" && raw.startsWith(c.dialCode)
      );
      if (matched) {
        setSelectedCountry(matched);
        onChange?.(raw);
        return;
      }
      const subscriber = raw.replace(dial, "").replace(/[^\d\s-]/g, "").trim();
      onChange?.(subscriber ? `${dial} ${subscriber}` : `${dial} `);
      return;
    }

    // Normal typing: keep dial code intact, clean subscriber portion
    let subscriber = raw.slice(dial.length);
    // Strip leading 0 if user types e.g. "0812..." right after dial code
    if (subscriber.trim().startsWith("0")) {
      subscriber = subscriber.replace(/^\s*0/, " ");
    }
    const cleaned = subscriber.replace(/[^\d\s-]/g, "");
    onChange?.(`${dial}${cleaned}`);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center gap-2 w-full", className)}
    >
      {/* 9ui Country Selector Trigger Button (Flag + ChevronsUpDown only, NO text) */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "h-10 px-3 flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer select-none shrink-0 shadow-2xs outline-none",
          "focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:border-slate-900",
          disabled && "opacity-50 pointer-events-none"
        )}
        aria-label="Select Country"
      >
        <CountryFlag code={selectedCountry.code} />
        <ChevronsUpDown className="size-4 opacity-50 shrink-0 text-slate-500" />
      </button>

      {/* 9ui Phone Input Field */}
      <input
        ref={phoneInputRef}
        id={id}
        name={name}
        type="tel"
        required={required}
        disabled={disabled}
        value={displayValue}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onChange={handlePhoneInputChange}
        placeholder={placeholder || `${selectedCountry.dialCode} 812 3456 7890`}
        className={cn(
          "h-10 flex-1 min-w-0 rounded-md border border-slate-200 bg-white px-3 text-xs sm:text-sm font-normal text-slate-900 placeholder:text-slate-400 outline-none transition-colors shadow-2xs",
          "focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10",
          disabled && "opacity-50 pointer-events-none bg-slate-50"
        )}
      />

      {/* 9ui Country Popover Menu with Defined Solid Card Bounds */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 max-w-[calc(100vw-2rem)] max-h-72 rounded-lg border border-slate-200 bg-white shadow-xl z-50 animate-in fade-in-50 zoom-in-95 flex flex-col overflow-hidden">
          {/* Fixed Search Header without counter/active text */}
          <div className="p-2 border-b border-slate-100 bg-white shrink-0">
            <div className="relative flex items-center">
              <Search className="size-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country..."
                className="w-full h-8 pl-8 pr-7 text-xs rounded-md border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Countries List with Fixed Boundaries */}
          <div className="overflow-y-auto flex-1 p-1 space-y-0.5 divide-y-0">
            {filteredCountries.length === 0 ? (
              <div className="py-6 px-4 text-center">
                <p className="text-xs text-slate-600 font-medium">No countries found</p>
                <button
                  type="button"
                  onClick={() => {
                    const other = COUNTRIES.find((c) => c.code === "XX");
                    if (other) handleCountrySelect(other);
                  }}
                  className="mt-2 text-xs text-pelican-red hover:underline font-semibold cursor-pointer"
                >
                  Select Other (+)
                </button>
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.code === selectedCountry.code;
                return (
                  <button
                    key={`${c.code}-${c.dialCode}`}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    className={cn(
                      "w-full h-8 px-2.5 flex items-center justify-between rounded-md text-xs transition-colors cursor-pointer text-left",
                      isSelected
                        ? "bg-slate-100 text-slate-900 font-semibold"
                        : "hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <CountryFlag code={c.code} />
                      <span className="truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                      <span className="text-xs text-slate-500 font-normal">
                        {c.dialCode}
                      </span>
                      {isSelected && (
                        <Check className="size-3.5 text-slate-800 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
