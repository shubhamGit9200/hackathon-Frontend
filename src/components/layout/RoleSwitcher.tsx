'use client';

import React from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserRole } from '@/types';
import { ROLE_CONFIG } from '@/constants';
import { UserCheck, ShieldAlert, HeartPulse, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const RoleSwitcher: React.FC = () => {
  const { activeRole, switchRole, user } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const roles: { role: UserRole; icon: React.ReactNode }[] = [
    { role: 'CLINICIAN', icon: <UserCheck className="w-4 h-4 text-emerald-600" /> },
    { role: 'PATIENT', icon: <HeartPulse className="w-4 h-4 text-blue-600" /> },
    { role: 'ADMIN', icon: <ShieldAlert className="w-4 h-4 text-purple-600" /> },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-subtle transition-all"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-slate-400 font-normal">Role:</span>
        <span className="text-slate-900 font-bold">{ROLE_CONFIG[activeRole].label.split('/')[0]}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-xl z-50 p-2 space-y-1">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Switch Perspective
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate role-specific verification workflows & safety boundaries.
              </p>
            </div>

            {roles.map(({ role, icon }) => {
              const isCurrent = activeRole === role;
              const config = ROLE_CONFIG[role];
              return (
                <button
                  key={role}
                  onClick={() => {
                    switchRole(role);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-colors',
                    isCurrent ? 'bg-brand-50/80 border border-brand-200' : 'hover:bg-slate-50'
                  )}
                >
                  <div className="p-1 rounded-md bg-white border border-slate-200 shadow-xs shrink-0 mt-0.5">
                    {icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{config.label}</span>
                      {isCurrent && (
                        <span className="text-[10px] bg-brand-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{config.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
