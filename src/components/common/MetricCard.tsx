import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  auxiliaryNote?: string;
  badge?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  trend,
  trendValue,
  auxiliaryNote,
  badge,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200 p-4 rounded-md transition-colors h-full flex flex-col justify-between min-h-[105px] ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:bg-slate-50/50' : ''
      }`}
    >
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 gap-1.5">
          <span className="font-medium text-slate-600 truncate">{label}</span>
          {badge && (
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 font-mono shrink-0">
              {badge}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2 flex-wrap min-w-0">
          <span className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums whitespace-nowrap">
            {value}
          </span>
          {subValue && (
            <span className="text-xs text-slate-500 font-mono tabular-nums truncate">
              {subValue}
            </span>
          )}
        </div>
      </div>

      {(trendValue || auxiliaryNote) && (
        <div className="flex items-center gap-1.5 text-xs mt-2.5 pt-2 border-t border-slate-100 text-slate-500 min-w-0">
          {trendValue && (
            <span
              className={`font-medium tabular-nums shrink-0 ${
                trend === 'up'
                  ? 'text-emerald-700'
                  : trend === 'down'
                  ? 'text-rose-700'
                  : 'text-slate-600'
              }`}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </span>
          )}
          {trendValue && auxiliaryNote && <span aria-hidden="true" className="text-slate-300">·</span>}
          {auxiliaryNote && <span className="text-slate-500 truncate text-[11px]">{auxiliaryNote}</span>}
        </div>
      )}
    </div>
  );
};
