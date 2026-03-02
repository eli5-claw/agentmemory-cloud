import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getMemoryTypeColor(type: string): string {
  const colors: Record<string, string> = {
    episodic: 'bg-purple-100 text-purple-800',
    semantic: 'bg-blue-100 text-blue-800',
    procedural: 'bg-green-100 text-green-800',
    working: 'bg-yellow-100 text-yellow-800',
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
}

export function getImportanceColor(importance: number): string {
  if (importance >= 8) return 'text-red-600';
  if (importance >= 5) return 'text-yellow-600';
  return 'text-gray-600';
}
