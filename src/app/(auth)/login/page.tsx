'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserRole } from '@/types';
import { Card, CardContent, Button, Input, Badge } from '@/design-system';
import { APP_CONFIG } from '@/constants';
import { ShieldCheck, UserCheck, HeartPulse, ShieldAlert, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('dr.sharma@medverify.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email);
    setIsLoading(false);
    router.push('/');
  };

  const handleQuickDemoLogin = async (demoEmail: string, role: UserRole) => {
    setIsLoading(true);
    await login(demoEmail, role);
    setIsLoading(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center mx-auto text-white shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center justify-center gap-1">
            MedVerify <span className="text-brand-600">AI</span>
          </h1>
          <p className="text-xs text-slate-500">{APP_CONFIG.tagline}</p>
        </div>

        {/* Login Card */}
        <Card className="border border-slate-200 bg-white shadow-subtle p-6 space-y-5">
          <form onSubmit={handleLogin} className="space-y-3.5">
            <Input
              label="Professional Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@hospital.org"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full font-semibold"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Workspace
            </Button>
          </form>

          {/* Quick Demo Personas */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Quick Demo Personas
            </span>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('dr.sharma@medverify.ai', 'CLINICIAN')}
                className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100/70 text-left transition-colors flex items-center justify-between group text-xs"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-slate-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block leading-tight">Dr. Vivek Sharma, MD</span>
                    <span className="text-[10px] text-slate-500">Clinician / Reviewer</span>
                  </div>
                </div>
                <Badge variant="normal" size="sm">
                  Clinician
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('aarav.sharma@patient.medverify.ai', 'PATIENT')}
                className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100/70 text-left transition-colors flex items-center justify-between group text-xs"
              >
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-slate-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block leading-tight">Aarav Sharma</span>
                    <span className="text-[10px] text-slate-500">Patient View</span>
                  </div>
                </div>
                <Badge variant="info" size="sm">
                  Patient
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@medverify.ai', 'ADMIN')}
                className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100/70 text-left transition-colors flex items-center justify-between group text-xs"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-slate-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 block leading-tight">Pooja Nair</span>
                    <span className="text-[10px] text-slate-500">Hospital Compliance & Audit</span>
                  </div>
                </div>
                <Badge variant="outline" size="sm">
                  Admin
                </Badge>
              </button>
            </div>
          </div>
        </Card>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          MedVerify AI is a clinical decision-support tool. Final medical decisions remain with qualified healthcare professionals.
        </p>
      </div>
    </div>
  );
}
