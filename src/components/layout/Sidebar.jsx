import React from 'react';
import {
  BarChart3,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  Package,
  UserCheck,
  Users,
} from 'lucide-react';
import { getInitials } from '../../utils/formatters.js';

const NAV_GROUPS = [
  {
    group: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
    ],
  },
  {
    group: 'Operations',
    items: [
      { id: 'orders', label: 'Orders', icon: ClipboardList },
      { id: 'stock', label: 'Stock', icon: Package },
    ],
  },
  {
    group: 'People',
    items: [
      { id: 'staff', label: 'Staff', icon: Users },
      { id: 'customers', label: 'Customers', icon: UserCheck },
    ],
  },
  {
    group: 'Finance',
    items: [
      { id: 'invoices', label: 'Invoices', icon: FileText },
      { id: 'cost', label: 'Total Cost', icon: CreditCard },
    ],
  },
];

export function Sidebar({ activePage, onNavigate, user }) {
  return (
    <aside
      aria-label="Sidebar navigation"
      className="flex flex-col w-[220px] sm:w-[240px] shrink-0 h-screen sticky top-0 bg-[#1C7AC0] text-[#FFFFFF] select-none"
    >
      {/* Brand Logo */}
      <div className="flex items-center h-16 px-4 shrink-0 border-b border-[#FFFFFF]/15">
        <a
          href="/dashboard"                    /* ✅ hash hataya */
          onClick={(e) => {
            e.preventDefault();
            onNavigate('dashboard');
          }}
          className="flex items-center gap-3 rounded-[8px] py-1 px-1.5 hover:bg-[#2A89D1] transition-colors"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-[8px] bg-[#FFFFFF] text-[#145E96] shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 13.5L9.5 18L19 7"
                stroke="#145E96"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-[17px] font-bold tracking-tight text-[#FFFFFF] whitespace-nowrap">
            Clearline
          </span>
        </a>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_GROUPS.map((section) => (
          <div key={section.group} className="space-y-1.5">
            <p className="px-3 text-[13px] font-semibold text-[#FFFFFF]/80">
              {section.group}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`/${item.id}`}              /* ✅ hash hataya */
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(item.id);
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full flex items-center gap-3 min-h-[40px] px-3 py-2 rounded-[999px] text-[14px] font-medium transition-colors duration-150 ${
                        isActive
                          ? 'bg-[#FFFFFF] text-[#145E96]'
                          : 'text-[#FFFFFF] hover:bg-[#2A89D1]'
                      }`}
                    >
                      <Icon
                        className={`w-[18px] h-[18px] shrink-0 ${
                          isActive ? 'text-[#145E96]' : 'text-[#FFFFFF]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom User Chip */}
      <div className="p-3 border-t border-[#FFFFFF]/15 shrink-0">
        <a
          href="/profile"                         /* ✅ hash hataya */
          onClick={(e) => {
            e.preventDefault();
            onNavigate('profile');
          }}
          className="w-full flex items-center gap-3 p-2 rounded-[10px] hover:bg-[#2A89D1] transition-colors text-left"
        >
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#FFFFFF] text-[#145E96] text-[13px] font-bold shrink-0">
            {getInitials(user.name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-semibold text-[#FFFFFF] truncate">
              {user.name}
            </span>
            <span className="block text-[13px] text-[#FFFFFF]/85 truncate">
              {user.role}
            </span>
          </span>
        </a>
      </div>
    </aside>
  );
}