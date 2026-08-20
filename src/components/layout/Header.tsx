'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RoleSwitcher } from './RoleSwitcher';
import { useAppStore } from '@/stores/useAppStore';
import { Search, Bell, HelpCircle, Menu, X, Clock, FileText } from 'lucide-react';
import { Badge } from '@/design-system';

export const Header: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    if (pathname === '/') return 'Clinical Overview';
    if (pathname.startsWith('/patients')) return 'Patients';
    if (pathname.startsWith('/reports')) return 'Laboratory Reports';
    if (pathname.startsWith('/findings')) return 'Findings & Evidence';
    if (pathname.startsWith('/review')) return 'Clinician Review Queue';
    if (pathname.startsWith('/audit')) return 'Audit Trail';
    if (pathname.startsWith('/settings')) return 'Clinical Guidelines';
    return 'MedVerify';
  };

  return (
    <header className="h-15 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4 select-none">
      {/* Mobile Hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-semibold text-slate-900 tracking-tight">{getPageTitle()}</h2>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients, MRN, parameters..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Role switcher */}
        <RoleSwitcher />

        {/* Clinical Guidelines Link */}
        <Link
          href="/settings"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Clinical reference guidelines"
          aria-label="Clinical reference guidelines"
        >
          <HelpCircle className="w-4 h-4" />
        </Link>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full" />
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 shadow-xl z-50 p-3 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Clinical Alerts</span>
                  <Badge variant="low" size="sm">
                    2 Pending
                  </Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <Link
                    href="/findings/find-001"
                    onClick={() => setShowNotifications(false)}
                    className="block p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 block">Low Hemoglobin (8.4 g/dL)</span>
                    <span className="text-[11px] text-slate-500">Aarav Sharma • Microcytic Anemia pattern</span>
                  </Link>
                  <Link
                    href="/findings/find-002"
                    onClick={() => setShowNotifications(false)}
                    className="block p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 block">Elevated HbA1c (8.6%)</span>
                    <span className="text-[11px] text-slate-500">Aarav Sharma • Glycemic elevation</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
