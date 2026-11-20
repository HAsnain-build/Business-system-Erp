import React, { useState } from 'react';
import { Check, Download, Plus, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { StatusPill } from '../components/ui/StatusPill.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { InputField, SelectField } from '../components/ui/FormField.jsx';
import { exportToCsv, formatCurrency } from '../utils/formatters.js';

export function InvoicesPage({
  invoices,
  searchFilter,
  onAddInvoice,
  onMarkPaid,
  onDeleteInvoice,
}) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const [customer, setCustomer] = useState('');
  const [issueDate, setIssueDate] = useState('2026-11-20');
  const [dueDate, setDueDate] = useState('2026-12-20');
  const [amount, setAmount] = useState('4200');
  const [status, setStatus] = useState('Pending');

  const filtered = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    const q = searchFilter.trim().toLowerCase();
    const matchesSearch =
      !q ||
      inv.id.toLowerCase().includes(q) ||
      inv.customer.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const paidTotal = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + i.amount, 0);
  const pendingTotal = invoices
    .filter((i) => i.status === 'Pending')
    .reduce((sum, i) => sum + i.amount, 0);
  const unpaidTotal = invoices
    .filter((i) => i.status === 'Unpaid')
    .reduce((sum, i) => sum + i.amount, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customer.trim()) return;
    onAddInvoice({
      customer: customer.trim(),
      issueDate,
      dueDate,
      amount: Math.max(0, Number(amount) || 0),
      status,
    });
    setCustomer('');
    setAmount('4200');
    setStatus('Pending');
    setModalOpen(false);
  };

  const columns = [
    {
      key: 'id',
      header: 'Invoice #',
      sortable: true,
      sortValue: (row) => row.id,
      render: (row) => (
        <span className="font-semibold text-[#145E96] tabular-nums">{row.id}</span>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      sortValue: (row) => row.customer,
      render: (row) => <span className="font-medium text-[#1F2937]">{row.customer}</span>,
    },
    {
      key: 'issueDate',
      header: 'Date',
      render: (row) => <span className="text-[#5B6B7C] tabular-nums">{row.issueDate}</span>,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      sortValue: (row) => row.dueDate,
      render: (row) => <span className="text-[#5B6B7C] tabular-nums">{row.dueDate}</span>,
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
              aria-label={`Mark ${row.id} as paid`}
            >
              <Check className="w-4 h-4" />
              <span>Mark Paid</span>
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDeleteInvoice(row.id)}
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
        <Card padding="md" className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-medium text-[#5B6B7C]">Paid Amount</p>
            <p className="mt-1 text-[22px] font-bold text-[#1F2937] tabular-nums">
              {formatCurrency(paidTotal)}
            </p>
          </div>
          <StatusPill label="Paid" variant="success" />
        </Card>
        <Card padding="md" className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-medium text-[#5B6B7C]">Pending Bills</p>
            <p className="mt-1 text-[22px] font-bold text-[#1F2937] tabular-nums">
              {formatCurrency(pendingTotal)}
            </p>
          </div>
          <StatusPill label="Pending" variant="info" />
        </Card>
        <Card padding="md" className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-medium text-[#5B6B7C]">Unpaid Bills</p>
            <p className="mt-1 text-[22px] font-bold text-[#1F2937] tabular-nums">
              {formatCurrency(unpaidTotal)}
            </p>
          </div>
          <StatusPill label="Unpaid" variant="danger" />
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Paid', 'Pending', 'Unpaid'].map((tab) => {
            const active = statusFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-2 rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#1C7AC0] text-[#FFFFFF]'
                    : 'bg-[#FFFFFF] text-[#5B6B7C] border border-[#D6E6F2] hover:bg-[#E6F2FB] hover:text-[#145E96]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => exportToCsv('clearline-invoices.csv', filtered)}
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </Button>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" />
            <span>New Invoice</span>
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        emptyTitle="No invoices found"
        emptyDescription="Create a new invoice or change the status filter."
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Customer Invoice"
        subtitle="Create a bill and set its due date."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="inv-customer"
            label="Customer Name"
            required
            placeholder="e.g. Summit Wholesale"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              id="inv-issue"
              label="Invoice Date"
              type="date"
              required
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
            <InputField
              id="inv-due"
              label="Due Date"
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              id="inv-amount"
              label="Amount (USD)"
              type="number"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <SelectField
              id="inv-status"
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
              Save Invoice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
