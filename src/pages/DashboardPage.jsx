import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { StatusPill } from '../components/ui/StatusPill.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { RevenueBarChart } from '../components/charts/RevenueBarChart.jsx';
import { CategoryDonutChart } from '../components/charts/CategoryDonutChart.jsx';
import { formatCurrency, formatNumber } from '../utils/formatters.js';

export function DashboardPage({ metrics, orders, invoices, costs, staff, onNavigate }) {
  const [range, setRange] = useState('12M');

  const totalSales = metrics.reduce((acc, m) => acc + m.sales, 0);
  const openOrdersCount = orders.filter((o) => o.status !== 'Done').length;
  const totalCost = costs.reduce((acc, c) => acc + c.amount, 0);
  const unpaidBillsTotal = invoices
    .filter((inv) => inv.status === 'Unpaid' || inv.status === 'Pending')
    .reduce((acc, inv) => acc + inv.amount, 0);

  const visibleMetrics = range === '6M' ? metrics.slice(-6) : metrics;

  const costBreakdown = [
    {
      label: 'Staff Salaries',
      value: costs
        .filter((c) => c.category === 'Salaries')
        .reduce((sum, c) => sum + c.amount, 0),
      color: '#1C7AC0',
    },
    {
      label: 'Delivery & Transport',
      value: costs
        .filter((c) => c.category === 'Delivery')
        .reduce((sum, c) => sum + c.amount, 0),
      color: '#12A594',
    },
    {
      label: 'Office & Software',
      value: costs
        .filter((c) => c.category === 'Office')
        .reduce((sum, c) => sum + c.amount, 0),
      color: '#8EC5EC',
    },
  ];

  const orderColumns = [
    {
      key: 'id',
      header: 'Order #',
      render: (row) => (
        <span className="font-semibold text-[#145E96] tabular-nums">{row.id}</span>
      ),
    },
    {
      key: 'title',
      header: 'Order Details',
      render: (row) => (
        <div>
          <p className="font-medium text-[#1F2937]">{row.title}</p>
          <p className="text-[13px] text-[#5B6B7C]">{row.customer}</p>
        </div>
      ),
    },
    {
      key: 'assignee',
      header: 'Staff',
      render: (row) => <span className="text-[#5B6B7C]">{row.assignee}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (row) => <span className="font-semibold">{formatCurrency(row.amount)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusPill label={row.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Simple 4 KPI Cards */}
      <section aria-label="Business summary" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card padding="md" className="space-y-2">
          <p className="text-[13px] font-medium text-[#5B6B7C]">Total Sales (This Year)</p>
          <p className="text-[26px] font-bold text-[#1F2937] tabular-nums">
            {formatCurrency(totalSales)}
          </p>
          <p className="text-[13px] font-medium text-[#0D7F72]">+14% from last year</p>
        </Card>

        <Card padding="md" className="space-y-2">
          <p className="text-[13px] font-medium text-[#5B6B7C]">Total Cost</p>
          <p className="text-[26px] font-bold text-[#1F2937] tabular-nums">
            {formatCurrency(totalCost)}
          </p>
          <p className="text-[13px] text-[#5B6B7C]">Salaries, delivery &amp; office</p>
        </Card>

        <Card padding="md" className="space-y-2">
          <p className="text-[13px] font-medium text-[#5B6B7C]">Open Orders</p>
          <p className="text-[26px] font-bold text-[#1F2937] tabular-nums">
            {formatNumber(openOrdersCount)}
          </p>
          <p className="text-[13px] text-[#145E96]">{staff.filter((s) => s.status === 'Active').length} active staff working</p>
        </Card>

        <Card padding="md" className="space-y-2">
          <p className="text-[13px] font-medium text-[#5B6B7C]">Unpaid &amp; Pending Bills</p>
          <p className="text-[26px] font-bold text-[#1F2937] tabular-nums">
            {formatCurrency(unpaidBillsTotal)}
          </p>
          <p className="text-[13px] font-medium text-[#D9534F]">Needs follow-up</p>
        </Card>
      </section>

      {/* Sales Chart + Total Cost Chart */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card padding="md" className="xl:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-[16px] font-semibold text-[#1F2937]">
                Monthly Sales &amp; Profit
              </h2>
              <p className="text-[13px] text-[#5B6B7C]">
                Compare your monthly sales with profit and goal
              </p>
            </div>
            <div className="inline-flex items-center p-1 rounded-[8px] bg-[#F2F8FD] border border-[#D6E6F2]">
              <button
                type="button"
                onClick={() => setRange('6M')}
                className={`px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer ${
                  range === '6M'
                    ? 'bg-[#1C7AC0] text-[#FFFFFF]'
                    : 'text-[#5B6B7C] hover:text-[#145E96]'
                }`}
              >
                6 Months
              </button>
              <button
                type="button"
                onClick={() => setRange('12M')}
                className={`px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer ${
                  range === '12M'
                    ? 'bg-[#1C7AC0] text-[#FFFFFF]'
                    : 'text-[#5B6B7C] hover:text-[#145E96]'
                }`}
              >
                12 Months
              </button>
            </div>
          </div>
          <RevenueBarChart data={visibleMetrics} />
        </Card>

        <Card padding="md" className="flex flex-col justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1F2937]">
              Total Cost Breakdown
            </h2>
            <p className="text-[13px] text-[#5B6B7C]">
              Where your business money is spent
            </p>
          </div>
          <CategoryDonutChart segments={costBreakdown} centerLabel="Total Cost" />
          <div className="pt-2 border-t border-[#D6E6F2] flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('cost')}>
              <span>Open Total Cost</span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </section>

      {/* Recent Orders */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1F2937]">
              Recent Customer Orders
            </h2>
            <p className="text-[13px] text-[#5B6B7C]">
              Latest orders from your customers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={() => onNavigate('invoices')}>
              View Invoices
            </Button>
            <Button variant="primary" size="sm" onClick={() => onNavigate('orders')}>
              All Orders
            </Button>
          </div>
        </div>

        <DataTable
          columns={orderColumns}
          data={orders.slice(0, 5)}
          rowKey={(row) => row.id}
          onRowClick={() => onNavigate('orders')}
        />
      </section>
    </div>
  );
}
