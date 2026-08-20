import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AbnormalityStatus, FindingPriority, ReportStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatConfidence(score: number): string {
  return `${(score * 100).toFixed(0)}%`;
}

export function getAbnormalityColor(status: AbnormalityStatus) {
  switch (status) {
    case 'NORMAL':
      return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case 'LOW':
      return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
    case 'HIGH':
      return { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' };
    case 'CRITICAL_LOW':
    case 'CRITICAL_HIGH':
      return { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
    case 'INCONCLUSIVE':
    default:
      return { text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' };
  }
}
