import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { StatusPill } from '../components/ui/StatusPill.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { InputField, SelectField } from '../components/ui/FormField.jsx';
import { formatCurrency } from '../utils/formatters.js';

export function CustomersPage({
  customers,
  searchFilter,
  onAddCustomer,
  onDeleteCustomer,
}) {
  const [planFilter, setPlanFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('Growth');
  const [totalSpend, setTotalSpend] = useState('15000');

  const filtered = customers.filter((c) => {
    const matchesPlan = planFilter === 'All' || c.plan === planFilter;
    const q = searchFilter.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.company.toLowerCase().includes(q) ||
      c.contactName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q);
    return matchesPlan && matchesSearch;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim() || !contactName.trim() || !email.trim()) return;
    onAddCustomer({
      company: company.trim(),
      contactName: contactName.trim(),
      email: email.trim(),
      plan,
      totalSpend: Math.max(0, Number(totalSpend) || 0),
      status: 'Active',
    });
    setCompany('');
    setContactName('');
    setEmail('');
    setTotalSpend('15000');
    setModalOpen(false);
  };

  const columns = [
    {
      key: 'id',
      header: 'Customer #',
      render: (row) => (
        <span className="font-semibold text-[#145E96] tabular-nums">{row.id}</span>
      ),
    },
    {
      key: 'company',
      header: 'Business Name',
      sortable: true,
      sortValue: (row) => row.company,
      render: (row) => (
        <div>
          <p className="font-medium text-[#1F2937]">{row.company}</p>
          <p className="text-[13px] text-[#5B6B7C]">{row.contactName}</p>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (row) => <span className="text-[#5B6B7C]">{row.email}</span>,
    },
    {
      key: 'plan',
      header: 'Plan',
      render: (row) => <StatusPill label={row.plan} variant="info" />,
    },
    {
      key: 'totalSpend',
      header: 'Total Billing',
      align: 'right',
      sortable: true,
      sortValue: (row) => row.totalSpend,
      render: (row) => <span className="font-semibold">{formatCurrency(row.totalSpend)}</span>,
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
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDeleteCustomer(row.id)}
          aria-label={`Remove ${row.company}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Enterprise', 'Growth', 'Standard'].map((tier) => {
            const active = planFilter === tier;
            return (
              <button
                key={tier}
                type="button"
                onClick={() => setPlanFilter(tier)}
                className={`px-3.5 py-2 rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#1C7AC0] text-[#FFFFFF]'
                    : 'bg-[#FFFFFF] text-[#5B6B7C] border border-[#D6E6F2] hover:bg-[#E6F2FB] hover:text-[#145E96]'
                }`}
              >
                {tier}
              </button>
            );
          })}
        </div>

        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        emptyTitle="No customers found"
        emptyDescription="Add a customer or change the plan filter."
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Customer"
        subtitle="Enter business and contact details."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="cust-company"
            label="Business Name"
            required
            placeholder="e.g. Crestline Traders"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              id="cust-contact"
              label="Contact Person"
              required
              placeholder="e.g. Sarah Jenkins"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
            <InputField
              id="cust-email"
              label="Email Address"
              type="email"
              required
              placeholder="sarah@crestline.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              id="cust-plan"
              label="Plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              options={[
                { value: 'Enterprise', label: 'Enterprise' },
                { value: 'Growth', label: 'Growth' },
                { value: 'Standard', label: 'Standard' },
              ]}
            />
            <InputField
              id="cust-spend"
              label="Total Billing (USD)"
              type="number"
              min="0"
              required
              value={totalSpend}
              onChange={(e) => setTotalSpend(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D6E6F2]">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Customer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
