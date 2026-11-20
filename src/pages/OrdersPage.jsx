import React, { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { StatusPill } from '../components/ui/StatusPill.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { InputField, SelectField } from '../components/ui/FormField.jsx';
import { formatCurrency } from '../utils/formatters.js';

const STATUS_TABS = ['All', 'In Progress', 'Pending', 'Done', 'Unpaid'];

export function OrdersPage({
  orders,
  searchFilter,
  currentUserName,
  onAddOrder,
  onUpdateStatus,
  onDeleteOrder,
}) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [customer, setCustomer] = useState('');
  const [assignee, setAssignee] = useState(currentUserName);
  const [dueDate, setDueDate] = useState('2026-12-05');
  const [amount, setAmount] = useState('2500');
  const [status, setStatus] = useState('Pending');

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const q = searchFilter.trim().toLowerCase();
    const matchesQuery =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.title.toLowerCase().includes(q) ||
      order.customer.toLowerCase().includes(q) ||
      order.assignee.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !customer.trim()) return;
    onAddOrder({
      title: title.trim(),
      customer: customer.trim(),
      assignee: assignee.trim() || currentUserName,
      dueDate,
      amount: Math.max(0, Number(amount) || 0),
      status,
    });
    setTitle('');
    setCustomer('');
    setAmount('2500');
    setStatus('Pending');
    setModalOpen(false);
  };

  const columns = [
    {
      key: 'id',
      header: 'Order #',
      sortable: true,
      sortValue: (row) => row.id,
      render: (row) => (
        <span className="font-semibold text-[#145E96] tabular-nums">{row.id}</span>
      ),
    },
    {
      key: 'title',
      header: 'Order Details',
      sortable: true,
      sortValue: (row) => row.title,
      render: (row) => (
        <div>
          <p className="font-medium text-[#1F2937]">{row.title}</p>
          <p className="text-[13px] text-[#5B6B7C]">{row.customer}</p>
        </div>
      ),
    },
    {
      key: 'assignee',
      header: 'Assigned To',
      render: (row) => <span className="text-[#1F2937]">{row.assignee}</span>,
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
        <div
          className="inline-flex items-center justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {row.status !== 'Done' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onUpdateStatus(row.id, 'Done')}
              aria-label={`Mark ${row.id} as done`}
            >
              <Check className="w-4 h-4" />
              <span>Done</span>
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDeleteOrder(row.id)}
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter orders by status"
          className="flex flex-wrap items-center gap-2"
        >
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
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

        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>Add Order</span>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredOrders}
        rowKey={(row) => row.id}
        selectedId={selectedId}
        onRowClick={(row) => setSelectedId(row.id === selectedId ? null : row.id)}
        emptyTitle="No orders found"
        emptyDescription="Add a new order or change the status filter."
        emptyAction={
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            Add First Order
          </Button>
        }
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Order"
        subtitle="Enter customer order details below."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="order-title"
            label="Order Name"
            required
            placeholder="e.g. Store Shelf Labels"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <InputField
            id="order-customer"
            label="Customer Name"
            required
            placeholder="e.g. Northbridge Traders"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              id="order-assignee"
              label="Assigned Staff"
              required
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            />
            <InputField
              id="order-due"
              label="Due Date"
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              id="order-amount"
              label="Amount (USD)"
              type="number"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <SelectField
              id="order-status"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Done', label: 'Done' },
                { value: 'Unpaid', label: 'Unpaid' },
              ]}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D6E6F2]">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
