import React, { useCallback, useMemo, useState } from 'react';
import { formatCurrency } from '../../utils/formatters.js';

function RevenueBarChartComponent({ data, showTarget = true }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // ✅ useMemo — hover par dobara calculate nahi
  const { niceMax, ticks } = useMemo(() => {
    const maxVal = Math.max(
      ...data.flatMap((d) => [d.sales, d.profit, showTarget ? d.target : 0]),
      1000
    );
    const computedNiceMax = Math.ceil(maxVal / 20000) * 20000;
    return {
      niceMax: computedNiceMax,
      ticks: [
        0,
        computedNiceMax * 0.25,
        computedNiceMax * 0.5,
        computedNiceMax * 0.75,
        computedNiceMax,
      ],
    };
  }, [data, showTarget]);

  const chartHeight = 220;
  const chartWidth = 680;
  const padLeft = 58;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 34;
  const plotWidth = chartWidth - padLeft - padRight;
  const plotHeight = chartHeight - padTop - padBottom;
  const groupWidth = plotWidth / Math.max(data.length, 1);
  const barWidth = showTarget
    ? Math.min(14, groupWidth * 0.22)
    : Math.min(18, groupWidth * 0.3);
  const barGap = 4;

  // ✅ useCallback — stable handlers
  const handleEnter = useCallback((idx) => setHoveredIdx(idx), []);
  const handleLeave = useCallback(() => setHoveredIdx(null), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6 text-[13px] text-[#5B6B7C]">
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-[3px] bg-[#1C7AC0]" aria-hidden="true" />
            <span className="text-[#1F2937] font-medium">Total Sales</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-[3px] bg-[#12A594]" aria-hidden="true" />
            <span className="text-[#1F2937] font-medium">Net Profit</span>
          </span>
          {showTarget && (
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-[3px] bg-[#8EC5EC]" aria-hidden="true" />
              <span className="text-[#1F2937] font-medium">Sales Goal</span>
            </span>
          )}
        </div>

        {hoveredIdx !== null && data[hoveredIdx] && (
          <div className="flex items-center gap-4 px-3 py-1.5 rounded-[8px] bg-[#E6F2FB] text-[13px] text-[#145E96] tabular-nums">
            <span className="font-semibold">{data[hoveredIdx].month}:</span>
            <span>Sales {formatCurrency(data[hoveredIdx].sales)}</span>
            <span>Profit {formatCurrency(data[hoveredIdx].profit)}</span>
            {showTarget && (
              <span>Goal {formatCurrency(data[hoveredIdx].target)}</span>
            )}
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full min-w-[500px] h-auto select-none"
          role="img"
          aria-label="Monthly sales, profit, and goal bar chart"
        >
          {ticks.map((tick) => {
            const y = padTop + plotHeight - (tick / niceMax) * plotHeight;
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={chartWidth - padRight}
                  y2={y}
                  stroke="#D6E6F2"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#5B6B7C"
                  fontSize="13"
                  className="tabular-nums"
                >
                  ${Math.round(tick / 1000)}k
                </text>
              </g>
            );
          })}

          {data.map((item, idx) => {
            const centerX = padLeft + idx * groupWidth + groupWidth / 2;
            const totalBars = showTarget ? 3 : 2;
            const clusterWidth = totalBars * barWidth + (totalBars - 1) * barGap;
            const startX = centerX - clusterWidth / 2;

            const salesH = (item.sales / niceMax) * plotHeight;
            const profitH = (item.profit / niceMax) * plotHeight;
            const goalH = (item.target / niceMax) * plotHeight;
            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={item.month}
                onMouseEnter={() => handleEnter(idx)}
                onMouseLeave={handleLeave}
                className="cursor-pointer"
              >
                <rect
                  x={padLeft + idx * groupWidth + 2}
                  y={padTop}
                  width={Math.max(groupWidth - 4, 1)}
                  height={plotHeight}
                  rx="6"
                  fill={isHovered ? '#E6F2FB' : 'transparent'}
                />

                <rect
                  x={startX}
                  y={padTop + plotHeight - salesH}
                  width={barWidth}
                  height={Math.max(salesH, 2)}
                  rx="3"
                  fill="#1C7AC0"
                />

                <rect
                  x={startX + barWidth + barGap}
                  y={padTop + plotHeight - profitH}
                  width={barWidth}
                  height={Math.max(profitH, 2)}
                  rx="3"
                  fill="#12A594"
                />

                {showTarget && (
                  <rect
                    x={startX + (barWidth + barGap) * 2}
                    y={padTop + plotHeight - goalH}
                    width={barWidth}
                    height={Math.max(goalH, 2)}
                    rx="3"
                    fill="#8EC5EC"
                  />
                )}

                <text
                  x={centerX}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fill={isHovered ? '#145E96' : '#5B6B7C'}
                  fontWeight={isHovered ? 600 : 400}
                  fontSize="13"
                >
                  {item.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ✅ React.memo — parent re-render par chart dobara render nahi
export const RevenueBarChart = React.memo(RevenueBarChartComponent);
RevenueBarChart.displayName = 'RevenueBarChart';