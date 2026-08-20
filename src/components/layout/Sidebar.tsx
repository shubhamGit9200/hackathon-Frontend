'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { ROLE_CONFIG } from '@/constants';
import {
  Activity,
  Users,
  FileText,
  FileCheck2,
  GitPullRequestDraft,
  ShieldAlert,
  SlidersHorizontal,
  UploadCloud,
  LogOut,
  ShieldCheck,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC<{ isMobileOpen?: boolean; onCloseMobile?: () => void }> = ({
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const { user, activeRole, logout } = useAuthStore();
  const { setUploadModalOpen } = useAppStore();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: Activity,
      roles: ['CLINICIAN', 'ADMIN', 'PATIENT'],
    },
    {
      label: 'Patients',
      href: '/patients',
      icon: Users,
      roles: ['CLINICIAN', 'ADMIN'],
    },
    {
      label: 'Lab Reports',
      href: '/reports',
      icon: FileText,
      roles: ['CLINICIAN', 'ADMIN', 'PATIENT'],
    },
    {
      label: 'Findings & Evidence',
      href: '/findings',
      icon: FileCheck2,
      roles: ['CLINICIAN', 'ADMIN', 'PATIENT'],
    },
    {
      label: 'Clinician Review',
      href: '/review',
      icon: GitPullRequestDraft,
      roles: ['CLINICIAN', 'ADMIN'],
    },
    {
      label: 'Audit Trail',
      href: '/audit',
      icon: ShieldAlert,
      roles: ['CLINICIAN', 'ADMIN'],
    },
    {
      label: 'Clinical Reference',
      href: '/settings',
      icon: SlidersHorizontal,
      roles: ['CLINICIAN', 'ADMIN', 'PATIENT'],
    },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(activeRole));

  // Compute clean user initials
  const initials = user.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'CLINICIAN':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'PATIENT':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed lg:sticky top-0 shrink-0 z-40 select-none transition-transform duration-200 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" onClick={onCloseMobile} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1">
                MedVerify <span className="text-brand-600 font-semibold">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Report Verification</p>
            </div>
          </Link>
        </div>

        {/* Upload Action Button */}
        <div className="p-4 pb-2">
          <button
            onClick={() => {
              setUploadModalOpen(true);
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Paste or Upload Report</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  'relative flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-brand-600' : 'text-slate-400'
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {isActive && (
                  <motion.div
                    layoutId="activeSidebarIndicator"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand-600 rounded-r-full"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section with Clean Reliable Avatar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {/* Dynamic Initials Avatar */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border select-none',
                  getRoleBadgeStyle(activeRole)
                )}
              >
                {initials || <User className="w-4 h-4" />}
              </div>

              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">{user.fullName}</p>
                <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5 font-medium">
                  {ROLE_CONFIG[activeRole].label.split('/')[0]}
                </p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors shrink-0"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
