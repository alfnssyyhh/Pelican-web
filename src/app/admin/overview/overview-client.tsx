"use client";

import React, { useState, useEffect, useRef } from "react";
import Sortable from "sortablejs";
import { ReportDateFilter, type DateFilterState, getPresetDateRange } from "@/components/ui/ReportDateFilter";
import { Button } from "@/components/ui/button";
import { OverviewRecentInquiriesCard } from "@/components/admin/overview/OverviewRecentInquiriesCard";
import { OverviewRevenueChart } from "@/components/admin/overview/OverviewRevenueChart";
import { OverviewScheduleCard } from "@/components/admin/overview/OverviewScheduleCard";
import { OverviewStatusDonutChart } from "@/components/admin/overview/OverviewStatusDonutChart";
import { OverviewNeedAttentionCard } from "@/components/admin/overview/OverviewNeedAttentionCard";
import { OverviewRecentActivitiesCard } from "@/components/admin/overview/OverviewRecentActivitiesCard";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { RfqInquiry, RentalUnit, WorkProject } from "@/lib/admin-store";
import type { Product, Post } from "@/lib/data";

interface OverviewClientProps {
  initialRfqs: RfqInquiry[];
  initialRentals: RentalUnit[];
  initialProducts: Product[];
  initialPosts: Post[];
  initialWorks: WorkProject[];
}

const DEFAULT_CARD_ORDER = [
  "recent_inquiries",
  "revenue_chart",
  "active_rentals",
  "inventory_status",
  "need_attention",
  "recent_activities",
];

const LOCAL_STORAGE_KEY = "pelican_overview_cards_order_v1";

export function OverviewClient({
  initialRfqs,
  initialRentals,
  initialProducts,
  initialPosts,
  initialWorks,
}: OverviewClientProps) {
  const { showToast } = useToast();
  const [dateFilter, setDateFilter] = useState<DateFilterState>(() => {
    const range = getPresetDateRange("this_month");
    return { preset: "this_month", startDate: range.startDate, endDate: range.endDate };
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [cardOrder, setCardOrder] = useState<string[]>(DEFAULT_CARD_ORDER);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load saved order from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = [...new Set([...parsed, ...DEFAULT_CARD_ORDER])].filter((id) =>
            DEFAULT_CARD_ORDER.includes(id)
          );
          setCardOrder(merged);
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  // SortableJS for drag-and-drop: exactly following deliverjob-share implementation
  useEffect(() => {
    if (!isEditMode) return;
    const el = containerRef.current;
    if (!el) return;

    const sortable = Sortable.create(el, {
      animation: 200,
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      draggable: ".card-draggable",
      forceFallback: false,
      swapThreshold: 0.65,
      easing: "cubic-bezier(0.2, 0, 0, 1)",
      dragoverBubble: false,
      onEnd: () => {
        const ids = Array.from(el.querySelectorAll(".card-draggable"))
          .map((n) => (n as HTMLElement).dataset.id!)
          .filter(Boolean);

        if (ids.length > 0) {
          const deduped: string[] = [];
          const seen = new Set<string>();
          for (const id of [...ids, ...DEFAULT_CARD_ORDER]) {
            if (!seen.has(id) && DEFAULT_CARD_ORDER.includes(id)) {
              seen.add(id);
              deduped.push(id);
            }
          }
          setCardOrder(deduped);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(deduped));
          } catch {
            // ignore
          }
        }
      },
    });

    return () => {
      try {
        sortable.destroy();
      } catch {
        // noop
      }
    };
  }, [isEditMode]);

  const handleToggleEditMode = () => {
    if (isEditMode) {
      setIsEditMode(false);
      showToast("Layout saved", {
        type: "success",
      });
    } else {
      setIsEditMode(true);
    }
  };

  // Compute metrics
  const availableRentals = initialRentals.filter((r) => r.status === "available").length;
  const rentedRentals = initialRentals.filter((r) => r.status === "rented").length;
  const maintenanceRentals = initialRentals.filter((r) => r.status === "maintenance").length;
  const reservedRentals = Math.max(0, initialRentals.length - availableRentals - rentedRentals - maintenanceRentals);

  const pendingRfqs = initialRfqs.filter((r) => r.status === "Baru" || r.status === "New").length;

  // Render Card by ID
  const renderCard = (id: string) => {
    switch (id) {
      case "recent_inquiries":
        return <OverviewRecentInquiriesCard inquiries={initialRfqs} />;
      case "revenue_chart":
        return (
          <OverviewRevenueChart
            periodLabel={dateFilter.preset === "this_month" ? "This Month" : "Selected Period"}
            totalAmount="$34,250"
            subtitle={`${initialRfqs.length} quotation inquiries logged`}
          />
        );
      case "active_rentals":
        return <OverviewScheduleCard rentals={initialRentals} />;
      case "inventory_status":
        return (
          <OverviewStatusDonutChart
            totalCount={initialRentals.length + initialProducts.length}
            availableCount={availableRentals + initialProducts.length}
            rentedCount={rentedRentals}
            maintenanceCount={maintenanceRentals}
            reservedCount={reservedRentals}
          />
        );
      case "need_attention":
        return (
          <OverviewNeedAttentionCard
            pendingRfqCount={pendingRfqs || 1}
            maintenanceCount={maintenanceRentals || 1}
            lowStockCount={1}
          />
        );
      case "recent_activities":
        return <OverviewRecentActivitiesCard />;
      default:
        return null;
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 py-8">
      {/* Header & Date Filter Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="m-0 text-3xl font-bold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Operational dashboard and performance metrics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ReportDateFilter filter={dateFilter} onChange={setDateFilter} />

          <Button
            size="sm"
            onClick={handleToggleEditMode}
            className={cn(
              "rounded-lg text-xs cursor-pointer",
              isEditMode
                ? "bg-[#dc2626] text-white hover:bg-[#b91c1c]"
                : "variant-outline"
            )}
            variant={isEditMode ? "default" : "outline"}
          >
            {isEditMode ? "Done" : "Edit layout"}
          </Button>
        </div>
      </div>

      {/* Grid Container matching deliverjob-share columns & cards */}
      <div
        ref={containerRef}
        className="columns-1 md:columns-2 lg:columns-3 gap-6"
      >
        {cardOrder.map((cardId) => (
          <div
            key={cardId}
            data-id={cardId}
            className={cn(
              "card-draggable mb-6 w-full break-inside-avoid",
              isEditMode && "cursor-grab active:cursor-grabbing select-none"
            )}
          >
            <div
              className={cn(
                "w-full transition-all duration-150",
                isEditMode && "cursor-grab active:cursor-grabbing rounded-xl ring-2 ring-[#dc2626]/40"
              )}
            >
              {renderCard(cardId)}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
