import React, { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, LogOut, Search, User, X } from 'lucide-react';
import { getInitials } from '../../utils/formatters.js';
import { StatusPill } from '../ui/StatusPill.jsx';

export function Topbar({
  pageTitle,
  pageSubtitle,
  searchQuery,
  onSearchChange,
  searchResults,
  onSelectSearchResult,
  notifications,
  onMarkAllRead,
  onSelectNotification,
  user,
  onOpenProfile,
  onLogout,
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 min-h-[64px] py-2.5 bg-[#FFFFFF] border-b border-[#D6E6F2] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Clear Page Title & Subtitle */}
      <div className="min-w-0 shrink-0">
        <h1 className="text-[18px] sm:text-[20px] font-semibold text-[#1F2937] leading-tight truncate">
          {pageTitle}
        </h1>
        {pageSubtitle && (
          <p className="hidden xl:block text-[13px] text-[#5B6B7C] truncate">
            {pageSubtitle}
          </p>
        )}
      </div>

      {/* Middle: Search */}
      <div ref={searchRef} className="relative flex-1 max-w-md hidden sm:block">
        <label htmlFor="global-search" className="sr-only">
          Search orders, invoices, stock, staff, or customers
        </label>
        <div className="relative flex items-center">
          <Search
            className="w-4 h-4 text-[#5B6B7C] absolute left-3 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="global-search"
            type="search"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setSearchFocused(true);
            }}
            placeholder="Search orders, stock, staff, invoices..."
            className="w-full h-10 pl-9 pr-9 text-[14px] text-[#1F2937] bg-[#F2F8FD] border border-[#D6E6F2] rounded-[8px] placeholder:text-[#5B6B7C] focus:bg-[#FFFFFF] focus:border-[#1C7AC0] focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 text-[#5B6B7C] hover:text-[#145E96] p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {searchFocused && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-[#FFFFFF] border border-[#D6E6F2] rounded-[12px] shadow-[0_8px_24px_rgba(20,94,150,0.12)] overflow-hidden z-40">
            {searchResults.length === 0 ? (
              <div className="px-4 py-4 text-[13px] text-[#5B6B7C]">
                No matches for &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              <ul className="divide-y divide-[#D6E6F2] max-h-72 overflow-y-auto">
                {searchResults.slice(0, 6).map((item) => (
                  <li key={`${item.targetPage}-${item.id}`}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSearchResult(item);
                        setSearchFocused(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-[#E6F2FB] flex items-center justify-between gap-3 transition-colors cursor-pointer"
                    >
                      <span className="min-w-0">
                        <span className="block text-[14px] font-medium text-[#1F2937] truncate">
                          {item.label}
                        </span>
                        <span className="block text-[13px] text-[#5B6B7C] truncate">
                          {item.sublabel}
                        </span>
                      </span>
                      {/* ✅ Slash hataya — sirf "orders", "invoices" dikhega */}
                      <span className="text-[13px] font-medium text-[#145E96] capitalize shrink-0">
                        {item.targetPage.replace('/', '')}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Right: Notification Bell + Logged-in User */}
      <div className="flex items-center gap-3 shrink-0">
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setUserMenuOpen(false);
            }}
            aria-label={`Notifications (${unreadCount} unread)`}
            aria-expanded={notifOpen}
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#D6E6F2] bg-[#FFFFFF] text-[#1C7AC0] hover:bg-[#E6F2FB] transition-colors cursor-pointer"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-[#12A594] text-[#FFFFFF] text-[13px] font-semibold flex items-center justify-center tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              role="region"
              aria-label="Notifications panel"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFFFF] border border-[#D6E6F2] rounded-[12px] shadow-[0_8px_24px_rgba(20,94,150,0.12)] overflow-hidden z-40"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#D6E6F2]">
                <span className="text-[14px] font-semibold text-[#1F2937]">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllRead}
                    className="text-[13px] font-medium text-[#1C7AC0] hover:text-[#145E96] cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <ul className="divide-y divide-[#D6E6F2] max-h-80 overflow-y-auto">
                {notifications.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectNotification(item);
                        setNotifOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left transition-colors cursor-pointer ${
                        item.read ? 'bg-[#FFFFFF]' : 'bg-[#E6F2FB]/60'
                      } hover:bg-[#E6F2FB]`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[14px] font-medium text-[#1F2937]">
                          {item.title}
                        </span>
                        {!item.read && <StatusPill label="New" variant={item.severity} />}
                      </div>
                      <p className="mt-1 text-[13px] text-[#5B6B7C]">{item.detail}</p>
                      <p className="mt-1 text-[13px] text-[#5B6B7C]">{item.timestamp}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div ref={userMenuRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setUserMenuOpen((prev) => !prev);
              setNotifOpen(false);
            }}
            aria-expanded={userMenuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full border border-[#D6E6F2] bg-[#FFFFFF] hover:bg-[#E6F2FB] transition-colors cursor-pointer"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1C7AC0] text-[#FFFFFF] text-[13px] font-semibold shrink-0">
              {getInitials(user.name)}
            </span>
            <span className="hidden md:block text-left leading-tight">
              <span className="block text-[14px] font-medium text-[#1F2937] whitespace-nowrap">
                {user.name}
              </span>
              <span className="block text-[13px] text-[#5B6B7C] whitespace-nowrap">
                {user.role}
              </span>
            </span>
            <ChevronDown className="w-4 h-4 text-[#5B6B7C] shrink-0" />
          </button>

          {userMenuOpen && (
            <div
              role="menu"
              aria-label="User account menu"
              className="absolute right-0 mt-2 w-60 bg-[#FFFFFF] border border-[#D6E6F2] rounded-[12px] shadow-[0_8px_24px_rgba(20,94,150,0.12)] py-2 z-40"
            >
              <div className="px-4 py-2.5 border-b border-[#D6E6F2]">
                <p className="text-[14px] font-semibold text-[#1F2937] truncate">
                  {user.name}
                </p>
                <p className="text-[13px] text-[#5B6B7C] truncate">{user.email}</p>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onOpenProfile();
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#1F2937] hover:bg-[#E6F2FB] hover:text-[#145E96] transition-colors cursor-pointer text-left"
                >
                  <User className="w-4 h-4 text-[#1C7AC0]" />
                  <span>Profile</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onLogout();
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#D9534F] hover:bg-[#FDECEA] transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-[#D9534F]" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}