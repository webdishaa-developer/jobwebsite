import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  if (currency === 'INR') {
    if (amount >= 100000) {
      const lakhs = amount / 100000;
      return `₹${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);
}

export function formatSalaryRange(min?: number | null, max?: number | null): string {
  if (!min && !max) return 'Competitive';
  if (min && max) return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  if (min) return `From ${formatCurrency(min)}`;
  if (max) return `Up to ${formatCurrency(max)}`;
  return 'Competitive';
}

export function formatExperience(min: number, max: number): string {
  if (min === 0 && max === 0) return 'Fresher';
  if (min === max) return `${min} years`;
  return `${min}-${max} years`;
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(date));
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function getJobTypeBadgeColor(type: string): string {
  const map: Record<string, string> = {
    FULL_TIME: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    PART_TIME: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    CONTRACT: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    INTERNSHIP: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    FREELANCE: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };
  return map[type] || 'bg-gray-100 text-gray-700';
}

export function getWorkModeBadgeColor(mode: string): string {
  const map: Record<string, string> = {
    REMOTE: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    HYBRID: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    ON_SITE: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  };
  return map[mode] || 'bg-gray-100 text-gray-700';
}

export function getApplicationStatusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    REVIEWING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    SHORTLISTED: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    INTERVIEW_SCHEDULED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    OFFERED: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    HIRED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    WITHDRAWN: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
}

export function formatJobType(type: string): string {
  const map: Record<string, string> = {
    FULL_TIME: 'Full Time', PART_TIME: 'Part Time', CONTRACT: 'Contract',
    INTERNSHIP: 'Internship', FREELANCE: 'Freelance',
  };
  return map[type] || type;
}

export function formatWorkMode(mode: string): string {
  const map: Record<string, string> = {
    ON_SITE: 'On-site', REMOTE: 'Remote', HYBRID: 'Hybrid',
  };
  return map[mode] || mode;
}

export function formatApplicationStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
