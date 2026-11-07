"use client";

import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartPoint {
  date: string;
  value: number;
}

interface OverviewRevenueChartProps {
  periodLabel?: string;
  totalAmount?: string;
  subtitle?: string;
  points?: ChartPoint[];
  onViewReport?: () => void;
}

const DEFAULT_POINTS: ChartPoint[] = [
  { date: "01 Nov", value: 1200 },
  { date: "05 Nov", value: 4500 },
  { date: "10 Nov", value: 2800 },
  { date: "15 Nov", value: 8900 },
  { date: "20 Nov", value: 6400 },
  { date: "25 Nov", value: 11200 },
  { date: "30 Nov", value: 14500 },
];

export function OverviewRevenueChart({
  periodLabel = "This Month",
  totalAmount = "$28,500",
  subtitle = "8 active maritime project contracts",
  points = DEFAULT_POINTS,
  onViewReport,
}: OverviewRevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const plotWidth = 450;
  const plotHeight = 140;
  const xStart = 45;
  const yStart = 20;

  const maxVal = Math.max(...points.map((p) => p.value), 1000);
  const totalPts = points.length;

  const coords = points.map((p, i) => {
    const x = xStart + (i / Math.max(1, totalPts - 1)) * plotWidth;
    const y = yStart + plotHeight - (p.value / maxVal) * plotHeight;
    return { x: Math.round(x), y: Math.round(y), ...p };
  });

  const linePath = coords.length > 1 ? "M " + coords.map((c) => `${c.x} ${c.y}`).join(" L ") : "";
  const fillPath =
    coords.length > 1
      ? `${linePath} L ${xStart + plotWidth} ${yStart + plotHeight} L ${xStart} ${yStart + plotHeight} Z`
      : "";

  const activePt = hoveredIndex !== null && coords[hoveredIndex] ? coords[hoveredIndex] : coords[coords.length - 1];

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
              <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2.2} />
              Revenue & Quotations ({periodLabel})
            </CardTitle>
            <div className="mt-1 text-2xl font-bold text-foreground tracking-tight">
              {totalAmount}
            </div>
            <div className="mt-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {subtitle}
            </div>
          </div>
          {onViewReport && (
            <Button variant="outline" size="xs" onClick={onViewReport}>
              View Report
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative h-[200px] w-full pt-2">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 520 200"
            preserveAspectRatio="xMidYMid meet"
            className="overflow-visible"
          >
            <defs>
              <linearGradient id="pelican-chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Horizontal guideline */}
            {[0, 0.5, 1].map((ratio, idx) => {
              const yVal = yStart + idx * (plotHeight / 2);
              const label = idx === 0 ? `$${Math.round(maxVal / 1000)}K` : idx === 1 ? `$${Math.round((maxVal / 2) / 1000)}K` : "$0";
              return (
                <g key={idx}>
                  <text x="35" y={yVal + 4} textAnchor="end" fontSize="10px" fill="#9ca3af" fontWeight="500">
                    {label}
                  </text>
                  <line
                    x1={xStart}
                    y1={yVal}
                    x2={xStart + plotWidth}
                    y2={yVal}
                    stroke="currentColor"
                    className="text-border"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                </g>
              );
            })}

            {/* Fill & Line */}
            {fillPath && <path d={fillPath} fill="url(#pelican-chart-grad)" />}
            {linePath && <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />}

            {/* X Axis Date Labels */}
            {coords.map((c, idx) => (
              <text key={idx} x={c.x} y={yStart + plotHeight + 18} textAnchor="middle" fontSize="10px" fill="#9ca3af" fontWeight="500">
                {c.date}
              </text>
            ))}

            {/* Active Hover Tooltip */}
            {activePt && (
              <g>
                <line
                  x1={activePt.x}
                  y1={yStart}
                  x2={activePt.x}
                  y2={yStart + plotHeight}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                <circle cx={activePt.x} cy={activePt.y} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <g transform={`translate(${Math.min(plotWidth - 30, Math.max(50, activePt.x))}, ${activePt.y - 45 < 10 ? activePt.y + 15 : activePt.y - 45})`}>
                  <rect
                    x="-45"
                    y="0"
                    width="90"
                    height="36"
                    rx="6"
                    className="fill-card stroke-border"
                    strokeWidth="1"
                    filter="drop-shadow(0 2px 6px rgba(0,0,0,0.12))"
                  />
                  <text x="0" y="15" textAnchor="middle" fontSize="10px" fill="#9ca3af" fontWeight="500">
                    {activePt.date}
                  </text>
                  <text x="0" y="28" textAnchor="middle" fontSize="12px" fill="#10b981" fontWeight="700">
                    ${activePt.value.toLocaleString()}
                  </text>
                </g>
              </g>
            )}

            {/* Interactive Hover Trigger Bars */}
            {coords.map((c, idx) => {
              const barWidth = plotWidth / coords.length;
              return (
                <rect
                  key={idx}
                  x={c.x - barWidth / 2}
                  y={yStart}
                  width={barWidth}
                  height={plotHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
