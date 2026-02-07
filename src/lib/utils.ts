import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number | null): string {
  if (score === null || score === undefined) return '-';
  return score.toFixed(3);
}

export function isValidScore(score: string): boolean {
  const num = parseFloat(score);
  return !isNaN(num) && num >= 0 && num <= 20;
}

export function clampScore(score: number): number {
  return Math.max(0, Math.min(20, score));
}

export function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return 'text-gold';
    case 2:
      return 'text-gray-300';
    case 3:
      return 'text-amber-600';
    default:
      return 'text-on-surface-variant';
  }
}

export function getRankBg(rank: number): string {
  switch (rank) {
    case 1:
      return 'rank-1';
    case 2:
      return 'rank-2';
    case 3:
      return 'rank-3';
    default:
      return '';
  }
}
