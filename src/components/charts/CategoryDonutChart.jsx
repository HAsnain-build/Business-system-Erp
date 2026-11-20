import React, { useCallback, useMemo, useState } from 'react';
import { formatCurrency } from '../../utils/formatters.js';

function CategoryDonutChartComponent({ segments, centerLabel }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const size = 168;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // ✅ useMemo — total + geometry pre-calculate, hover par dobara nahi
  const { total, geometry } = useMemo(() => {
    const sum = segments.reduce((acc, s) => acc + s.value, 0) || 1;
    let cumulative = 0;
    const geo = segments.map((seg) => {
      const pct = seg.value / sum;
      const dashLength = pct * circumference;
      const dashOffset = -cumulative;
      cumulative += dashLength;
      return {
        ...seg,
        dashLength,
        dashOffset,
        percent: Math.round(pct * 100),
      };
    });
    return { total: sum, geometry: geo };
  }, [segments, circumference]);

  // ✅ useCallback — stable handlers
  const handleEnter = useCallback((idx) => setActiveIndex(idx), []);
  const handleLeave = useCallback(() => setActiveIndex(null), []);
  const handleClick = useCallback(
    (idx) => setActiveIndex((prev) => (prev === idx ? null : idx)),
    []
  );

  const centerValue =
    activeIndex !== null && geometry[activeIndex]
      ? geometry[activeIndex].value
      : total;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative shrink-0">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label="Cost breakdown chart"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E6F2FB"
            strokeWidth={strokeWidth}
          />
          {geometry.map((seg, idx) => {
            const isActive = activeIndex === idx;
            return (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isActive ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${Math.max(seg.dashLength - 2, 0)} ${circumference}`}
                strokeDashoffset={seg.dashOffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                onMouseEnter={() => handleEnter(idx)}
                onMouseLeave={handleLeave}
                className="transition-all duration-150 cursor-pointer"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-[13px] text-[#5B6B7C]">{centerLabel}</span>
          <span className="text-[16px] font-bold text-[#1F2937] tabular-nums">
            {formatCurrency(centerValue)}
          </span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2">
        {geometry.map((seg, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={seg.label}
              type="button"
              onMouseEnter={() => handleEnter(idx)}
              onMouseLeave={handleLeave}
              onClick={() => handleClick(idx)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-[8px] text-[13px] transition-colors cursor-pointer ${
                isActive ? 'bg-[#E6F2FB]' : 'hover:bg-[#F2F8FD]'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-3 h-3 rounded-[3px] shrink-0"
                  style={{ backgroundColor: seg.color }}
                  aria-hidden="true"
                />
                <span className="font-medium text-[#1F2937] truncate">
                  {seg.label}
                </span>
              </span>
              <span className="text-[#5B6B7C] tabular-nums whitespace-nowrap shrink-0">
                {formatCurrency(seg.value)} ({seg.percent}%)
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ✅ React.memo — parent re-render par donut dobara render nahi
export const CategoryDonutChart = React.memo(CategoryDonutChartComponent);
CategoryDonutChart.displayName = 'CategoryDonutChart';