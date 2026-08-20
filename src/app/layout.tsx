import React from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ToastContainer } from '@/design-system';
import { UploadModal } from '@/features/upload/UploadModal';
import { APP_CONFIG } from '@/constants';

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
  description:
    'Explainable medical-report verification and clinical decision-support platform. Connects laboratory findings to structured evidence chains, patient context, and clinician review.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-slate-50 font-sans text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900">
        {children}
        <UploadModal />
        <ToastContainer />
      </body>
    </html>
  );
}
