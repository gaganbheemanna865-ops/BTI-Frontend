import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant, className = '' }) => {
  let inferredVariant = variant;
  if (!inferredVariant) {
    const s = status.toLowerCase();
    if (s.includes('approved') || s.includes('completed') || s.includes('settled') || s.includes('reconciled') || s.includes('active') || s.includes('balanced') || s.includes('high') || s.includes('connected') || s.includes('ready')) {
      inferredVariant = 'success';
    } else if (s.includes('pending') || s.includes('review') || s.includes('scheduled') || s.includes('delayed') || s.includes('preparing') || s.includes('medium')) {
      inferredVariant = 'warning';
    } else if (s.includes('rejected') || s.includes('discrepancy') || s.includes('missing') || s.includes('flagged') || s.includes('shortage') || s.includes('hike') || s.includes('cancelled') || s.includes('error')) {
      inferredVariant = 'error';
    } else {
      inferredVariant = 'neutral';
    }
  }

  const styles = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-rose-50 text-rose-800 border-rose-200',
    info: 'bg-sky-50 text-sky-800 border-sky-200'
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded whitespace-nowrap ${styles[inferredVariant]} ${className}`}
    >
      {status}
    </span>
  );
};
