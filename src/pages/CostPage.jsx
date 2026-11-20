import React, { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { StatusPill } from '../components/ui/StatusPill.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { InputField, SelectField } from '../components/ui/FormField.jsx';
import { CategoryDonutChart } from '../components/charts/CategoryDonutChart.jsx';
import { formatCurrency } from '../utils/formatters.js';

export function CostPage({
  costs,
  searchFilter,
  onAddCost,
  onMarkPaid,
  onDeleteCost,
}) {
  const [catFilter, setCatFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState('Delivery');
  const [date, setDate] = useState('2026-11-20');
  const [amount, setAmount] = useState('1200');
  const [status, setStatus] = useState('Pending');

  const filtered = costs.filter((exp) => {
    const matchesCat = catFilter === 'All' || exp.category === catFilter;
    const q = searchFilter.trim().toLowerCase();
    const matchesSearch =
      !q ||
      exp.id.toLowerCase().includes(q) ||
      exp.vendor.toLowerCase().includes(q) ||
      exp.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const totalCostAmount = costs.reduce((sum, c) => sum + c.amount, 0);
  const paidCostAmount = costs
    .filter((c) => c.status === 'Paid')
    .reduce((sum, c) => sum + c.amount, 0);
  const unpaidCostAmount = costs
    .filter((c) => c.status !== 'Paid')
    .reduce((sum, c) => sum + c.amount, 0);

  const segments = [
    {
      label: 'Staff Salaries',
      value: costs
        .filter((e) => e.category === 'Salaries')
        .reduce((sum, e) => sum + e.amount, 0),
      color: '#1C7AC0',
    },
    {
      label: 'Delivery & Transport',
      value: costs
        .filter((e) => e.category === 'Delivery')
        .reduce((sum, e) => sum + e.amount, 0),
      color: '#12A594',
    },
    {
      label: 'Office & Software',
      value: costs
        .filter((e) => e.category === 'Office')
        .reduce((sum, e) => sum + e.amount, 0),
      color: '#8EC5EC',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vendor.trim()) return;
    onAddCost({
      vendor: vendor.trim(),
      category,
      date,
      amount: Math.max(0, Number(amount) || 0),
      status,
    });
    setVendor('');
    setAmount('1200');
    setModalOpen(false);
  };

  const columns = [
    {
      key: 'id',
      header: 'Cost #',
      render: (row) => (
        <span className="font-semibold text-[#145E96] tabular-nums">{row.id}</span>
      ),
    },
    {
      key: 'vendor',
      header: 'Cost Description',
      sortable: true,
      sortValue: (row) => row.vendor,
      render: (row) => <span className="font-medium text-[#1F2937]">{row.vendor}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => <span className="text-[#5B6B7C]">{row.category}</span>,
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      sortValue: (row) => row.date,
      render: (row) => <span className="text-[#5B6B7C] tabular-nums">{row.date}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      sortable: true,
      sortValue: (row) => row.amount,
      render: (row) => <span className="font-semibold">{formatCurrency(row.amount)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusPill label={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="inline-flex items-center justify-end gap-2">
          {row.status !== 'Paid' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onMarkPaid(row.id)}
              aria-label={`Mark ${row.id} paid`}
            >
              <Check className="w-4 h-4" />
              <span>Pay</span>
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDeleteCost(row.id)}
            aria-label={`Delete ${row.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md" className="space-y-1">
          <p className="text-[13px] font-medium text-[#5B6B7C]">Total Business Cost</p>
          <p className="text-[24px] font-bold text-[#1F2937] tabular-nums">
            {formatCurrency(totalCostAmount)}
          </p>
        </Card>
        <Card padding="md" className="space-y-1">
          <p className="text-[13px] font-medium text-[#5B6B7C]">Already Paid</p>
          <p className="text-[24px] font-bold text-[#0D7F72] tabular-nums">
            {formatCurrency(paidCostAmount)}
          </p>
        </Card>
        <Card padding="md" className="space-y-1">
          <p className="text-[13px] font-medium text-[#5B6B7C]">Remaining to Pay</p>
          <p className="text-[24px] font-bold text-[#D9534F] tabular-nums">
            {formatCurrency(unpaidCostAmount)}
          </p>
        </Card>
      </div>

      <Card padding="md" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1F2937]">
              Total Cost by Category
            </h2>
            <p className="text-[13px] text-[#5B6B7C]">
              Salaries, delivery, and office bills
            </p>
          </div>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" />
            <span>Add Cost</span>
          </Button>
        </div>
        <CategoryDonutChart segments={segments} centerLabel="Total Cost" />
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Salaries', 'Delivery', 'Office'].map((cat) => {
          const active = catFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCatFilter(cat)}
              className={`px-3.5 py-2 rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer ${
                active
                  ? 'bg-[#1C7AC0] text-[#FFFFFF]'
                  : 'bg-[#FFFFFF] text-[#5B6B7C] border border-[#D6E6F2] hover:bg-[#E6F2FB] hover:text-[#145E96]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        emptyTitle="No cost entries found"
        emptyDescription="Add a cost entry or select another category."
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Cost Entry"
        subtitle="Record a business bill, salary, or delivery cost."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="exp-vendor"
            label="Cost Description"
            required
            placeholder="e.g. City Courier Delivery"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              id="exp-category"
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'Delivery', label: 'Delivery' },
                { value: 'Salaries', label: 'Salaries' },
                { value: 'Office', label: 'Office' },
              ]}
            />
            <InputField
              id="exp-date"
              label="Date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              id="exp-amount"
              label="Amount (USD)"
              type="number"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <SelectField
              id="exp-status"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'Paid', label: 'Paid' },
                { value: 'Unpaid', label: 'Unpaid' },
              ]}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D6E6F2]">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Cost
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
