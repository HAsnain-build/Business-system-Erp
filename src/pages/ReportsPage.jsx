import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { StatusPill } from '../components/ui/StatusPill.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { RevenueBarChart } from '../components/charts/RevenueBarChart.jsx';
import { exportToCsv, formatCurrency } from '../utils/formatters.js';

export function ReportsPage({ metrics }) {
  const [showTarget, setShowTarget] = useState(true);

  const totalSales = metrics.reduce((sum, m) => sum + m.sales, 0);
  const totalProfit = metrics.reduce((sum, m) => sum + m.profit, 0);
  const profitPct = ((totalProfit / Math.max(totalSales, 1)) * 100).toFixed(1);
  const avgMonthlySales = Math.round(totalSales / Math.max(metrics.length, 1));

  const columns = [
    {
      key: 'month',
      header: 'Month',
      sortable: true,
      sortValue: (row) => row.month,
      render: (row) => <span className="font-semibold text-[#1F2937]">{row.month} 2026</span>,
    },
    {
      key: 'sales',
      header: 'Total Sales',
      align: 'right',
      sortable: true,
      sortValue: (row) => row.sales,
      render: (row) => <span className="font-medium">{formatCurrency(row.sales)}</span>,
    },
    {
      key: 'profit',
      header: 'Net Profit',
      align: 'right',
      sortable: true,
      sortValue: (row) => row.profit,
      render: (row) => <span className="text-[#0D7F72] font-medium">{formatCurrency(row.profit)}</span>,
    },
    {
      key: 'target',
      header: 'Sales Goal',
      align: 'right',
      sortable: true,
      sortValue: (row) => row.target,
      render: (row) => <span className="text-[#5B6B7C]">{formatCurrency(row.target)}</span>,
    },
    {
      key: 'status',
      header: 'Result',
      render: (row) =>
        row.sales >= row.target ? (
          <StatusPill label="Goal Met" variant="success" />
        ) : (
          <StatusPill label="Near Goal" variant="info" />
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md" className="space-y-1.5">
          <p className="text-[13px] font-medium text-[#5B6B7C]">Total Yearly Sales</p>
          <p className="text-[24px] font-bold text-[#1F2937] tabular-nums">
            {formatCurrency(totalSales)}
          </p>
          <p className="text-[13px] text-[#0D7F72]">+16% compared to last year</p>
        </Card>
        <Card padding="md" className="space-y-1.5">
          <p className="text-[13px] font-medium text-[#5B6B7C]">Profit Margin</p>
          <p className="text-[24px] font-bold text-[#1F2937] tabular-nums">{profitPct}%</p>
          <p className="text-[13px] text-[#145E96]">Total net profit: {formatCurrency(totalProfit)}</p>
        </Card>
        <Card padding="md" className="space-y-1.5">
          <p className="text-[13px] font-medium text-[#5B6B7C]">Monthly Average</p>
          <p className="text-[24px] font-bold text-[#1F2937] tabular-nums">
            {formatCurrency(avgMonthlySales)}
          </p>
          <p className="text-[13px] text-[#5B6B7C]">Average sales per month</p>
        </Card>
      </div>

      <Card padding="md" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1F2937]">
              Sales &amp; Profit Chart
            </h2>
            <p className="text-[13px] text-[#5B6B7C]">
              Month-by-month sales, net profit, and monthly goal
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTarget((prev) => !prev)}
            >
              {showTarget ? 'Hide Goal' : 'Show Goal'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => exportToCsv('clearline-sales-report.csv', metrics)}
            >
              <Download className="w-4 h-4" />
              <span>Download CSV</span>
            </Button>
          </div>
        </div>
        <RevenueBarChart data={metrics} showTarget={showTarget} />
      </Card>

      <div className="space-y-3">
        <h2 className="text-[16px] font-semibold text-[#1F2937]">
          Monthly Sales Table
        </h2>
        <DataTable columns={columns} data={metrics} rowKey={(row) => row.month} />
      </div>
    </div>
  );
}
