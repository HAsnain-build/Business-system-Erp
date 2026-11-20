import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { StatusPill } from '../components/ui/StatusPill.jsx';
import { DataTable } from '../components/ui/DataTable.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { InputField, SelectField } from '../components/ui/FormField.jsx';
import { getInitials } from '../utils/formatters.js';

export function StaffPage({
  members,
  searchFilter,
  onAddMember,
  onToggleStatus,
  onDeleteMember,
}) {
  const [deptFilter, setDeptFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Operations');

  const filtered = members.filter((m) => {
    const matchesDept = deptFilter === 'All' || m.department === deptFilter;
    const q = searchFilter.trim().toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q);
    return matchesDept && matchesSearch;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !role.trim()) return;
    onAddMember({
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      department,
      activeTasks: 0,
      status: 'Active',
    });
    setName('');
    setEmail('');
    setRole('');
    setModalOpen(false);
  };

  const columns = [
    {
      key: 'name',
      header: 'Staff Name',
      sortable: true,
      sortValue: (row) => row.name,
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#E6F2FB] text-[#145E96] text-[13px] font-semibold shrink-0">
            {getInitials(row.name)}
          </span>
          <div>
            <p className="font-medium text-[#1F2937]">{row.name}</p>
            <p className="text-[13px] text-[#5B6B7C]">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Job Role',
      render: (row) => <span className="text-[#1F2937]">{row.role}</span>,
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      sortValue: (row) => row.department,
      render: (row) => <span className="text-[#5B6B7C]">{row.department}</span>,
    },
    {
      key: 'activeTasks',
      header: 'Tasks',
      align: 'right',
      sortable: true,
      sortValue: (row) => row.activeTasks,
      render: (row) => <span className="font-semibold">{row.activeTasks}</span>,
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
          <Button variant="outline" size="sm" onClick={() => onToggleStatus(row.id)}>
            {row.status === 'Active' ? 'Mark Leave' : 'Mark Active'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDeleteMember(row.id)}
            aria-label={`Remove ${row.name}`}
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
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Operations', 'Finance', 'Customer Care'].map((dept) => {
            const active = deptFilter === dept;
            return (
              <button
                key={dept}
                type="button"
                onClick={() => setDeptFilter(dept)}
                className={`px-3.5 py-2 rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#1C7AC0] text-[#FFFFFF]'
                    : 'bg-[#FFFFFF] text-[#5B6B7C] border border-[#D6E6F2] hover:bg-[#E6F2FB] hover:text-[#145E96]'
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>

        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>Add Staff</span>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        emptyTitle="No staff members found"
        emptyDescription="Select another department or add a new staff member."
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Staff Member"
        subtitle="Add a new employee to your staff list."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="member-name"
            label="Full Name"
            required
            placeholder="e.g. Bilal Ahmed"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputField
            id="member-email"
            label="Email Address"
            type="email"
            required
            placeholder="bilal@clearline.app"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              id="member-role"
              label="Job Role"
              required
              placeholder="e.g. Delivery Supervisor"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <SelectField
              id="member-dept"
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: 'Operations', label: 'Operations' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Customer Care', label: 'Customer Care' },
              ]}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D6E6F2]">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Staff
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
