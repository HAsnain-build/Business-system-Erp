import React, { useState } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { InputField, SelectField } from '../components/ui/FormField.jsx';
import { StatusPill } from '../components/ui/StatusPill.jsx';
import { getInitials } from '../utils/formatters.js';

export function ProfilePage({ user, onSaveUser, onLogout }) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [email, setEmail] = useState(user.email);
  const [department, setDepartment] = useState(user.department);
  const [timezone, setTimezone] = useState(user.timezone);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSaveUser({
      name: name.trim(),
      role: role.trim() || 'Manager',
      email: email.trim(),
      department,
      timezone,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Card padding="md" className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#1C7AC0] text-[#FFFFFF] text-[18px] font-bold shrink-0">
            {getInitials(user.name)}
          </span>
          <div>
            <h2 className="text-[18px] font-semibold text-[#1F2937]">{user.name}</h2>
            <p className="text-[14px] text-[#5B6B7C]">
              {user.role} &middot; {user.department}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill label="Active" variant="success" />
          <Button variant="danger" size="sm" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </Card>

      <Card padding="md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-[#D6E6F2] pb-4">
            <h3 className="text-[16px] font-semibold text-[#1F2937]">
              Profile Settings
            </h3>
            <p className="text-[13px] text-[#5B6B7C]">
              Update your name, job role, email, and department.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              id="profile-name"
              label="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputField
              id="profile-role"
              label="Job Role"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <InputField
              id="profile-email"
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <SelectField
              id="profile-dept"
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: 'Operations', label: 'Operations' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Customer Care', label: 'Customer Care' },
              ]}
            />
            <SelectField
              id="profile-tz"
              label="Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              options={[
                { value: 'UTC+05:00', label: 'UTC+05:00 (PKT)' },
                { value: 'UTC+00:00', label: 'UTC+00:00 (GMT)' },
                { value: 'UTC-05:00', label: 'UTC-05:00 (EST)' },
                { value: 'UTC-08:00', label: 'UTC-08:00 (PST)' },
              ]}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#D6E6F2]">
            <div>
              {savedNotice && <StatusPill label="Profile saved" variant="success" />}
            </div>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
