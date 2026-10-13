import React from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import {
  TrendingUp,
  AlertTriangle,
  Store,
  ArrowRight,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  Clock,
  Coins
} from 'lucide-react';

export const MainDashboardView: React.FC = () => {
  const {
    tenant,
    brand,
    outlets,
    expenses,
    settlements,
    priceHikeAlerts,
    setActiveScope,
    setActiveModule,
    dateFilter
  } = useApp();

  // Consolidated derived financials
  const totalNetSales = outlets.reduce((sum, o) => sum + o.netSalesToday, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const weightedFoodCostPct = (
    outlets.reduce((sum, o) => sum + (o.netSalesToday * (o.foodCostPct / 100)), 0) / totalNetSales * 100
  ).toFixed(1);
  const totalFoodCost = totalNetSales * (parseFloat(weightedFoodCostPct) / 100);
  const totalGrossMargin = totalNetSales - totalFoodCost;
  const grossMarginPct = ((totalGrossMargin / totalNetSales) * 100).toFixed(1);
  
  // Formula: EBITDA = Operating Revenue (Net Sales) - Food Cost - Operating Expenses
  const consolidatedEbitda = totalGrossMargin - totalExpenses;
  const ebitdaMarginPct = ((consolidatedEbitda / totalNetSales) * 100).toFixed(1);

  const pendingSettlementTotal = settlements
    .filter((s) => s.reconciliationStatus !== 'Reconciled')
    .reduce((sum, s) => sum + s.netExpected, 0);

  const branchesNeedingAttention = outlets.filter((o) => o.attentionRequired);
  const activeHikes = priceHikeAlerts.filter((p) => p.status === 'Needs Approval');

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
            <span className="font-semibold text-slate-800">{tenant.name}</span>
            <span>·</span>
            <span>{brand.name}</span>
            <span>·</span>
            <span className="font-mono text-slate-600">{dateFilter}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Management Overview
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('pnl-consolidated')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Open Consolidated P&L →
          </button>
        </div>
      </div>

      {/* Primary Financial Summary - Exactly 6 prominent metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <MetricCard
          label="Net Sales"
          value={`₹${totalNetSales.toLocaleString()}`}
          subValue="Consolidated"
          trend="up"
          trendValue="+11.8% WoW"
        />
        <MetricCard
          label="Total Expenses"
          value={`₹${totalExpenses.toLocaleString()}`}
          subValue="Direct & CK"
          auxiliaryNote="All 9 Outlets + Peenya"
        />
        <MetricCard
          label="Food Cost %"
          value={`${weightedFoodCostPct}%`}
          subValue="Target: <30.0%"
          trend={parseFloat(weightedFoodCostPct) > 30 ? 'down' : 'up'}
          trendValue="On Target"
        />
        <MetricCard
          label="Gross Margin"
          value={`₹${Math.round(totalGrossMargin).toLocaleString()}`}
          subValue={`${grossMarginPct}%`}
          trend="up"
          trendValue="Healthy Margin"
        />
        <MetricCard
          label="EBITDA"
          value={`₹${Math.round(consolidatedEbitda).toLocaleString()}`}
          subValue={`${ebitdaMarginPct}% margin`}
          trend="up"
          trendValue="Operating Cash"
        />
        <MetricCard
          label="Settlement Pending"
          value={`₹${pendingSettlementTotal.toLocaleString()}`}
          subValue="Across Channels"
          auxiliaryNote="T+1 to Weekly Cycles"
        />
      </div>

      {/* Main Outlet Table - All Nine BIT Outlets in Clean Format */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Operating Outlets Performance
            </h2>
            <p className="text-xs text-slate-500">
              Financial and operational cutoff status across all 9 locations in Bengaluru
            </p>
          </div>
          <button
            onClick={() => setActiveModule('outlets')}
            className="text-xs text-slate-700 hover:text-slate-900 font-medium hover:underline flex items-center gap-1 cursor-pointer"
          >
            View Outlet Directory <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-3.5 py-2.5">Outlet ID</th>
                <th className="px-3 py-2.5">Outlet Name</th>
                <th className="px-3 py-2.5 text-right">Net Sales</th>
                <th className="px-3 py-2.5 text-right">Expenses</th>
                <th className="px-3 py-2.5 text-right">Food Cost %</th>
                <th className="px-3 py-2.5 text-right">Gross Margin</th>
                <th className="px-3 py-2.5 text-right">EBITDA / Contrib.</th>
                <th className="px-3 py-2.5 text-center">Day-End Cutoff</th>
                <th className="px-3.5 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {outlets.map((outlet) => {
                const outletFoodCost = outlet.netSalesToday * (outlet.foodCostPct / 100);
                const outletGrossMargin = outlet.netSalesToday - outletFoodCost;
                const outletContribution = outletGrossMargin - outletExpensesEstimated(outlet);

                return (
                  <tr key={outlet.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="px-3.5 py-3 text-slate-500 font-semibold whitespace-nowrap">
                      {outlet.id}
                    </td>
                    <td className="px-3 py-3 font-sans font-medium text-slate-900">
                      <div>{outlet.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{outlet.type}</div>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      ₹{outlet.netSalesToday.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right text-slate-600 tabular-nums whitespace-nowrap">
                      ₹{outlet.expensesToday.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right text-slate-700 tabular-nums">
                      {outlet.foodCostPct}%
                    </td>
                    <td className="px-3 py-3 text-right text-slate-800 tabular-nums">
                      {outlet.grossMarginPct}%
                    </td>
                    <td className="px-3 py-3 text-right font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      ₹{Math.round(outletContribution).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-center font-sans">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium font-mono ${
                          outlet.dayEndStatus === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : outlet.dayEndStatus === 'Pending Cutoff'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {outlet.dayEndStatus === 'Completed'
                          ? '✓ Audited'
                          : outlet.dayEndStatus === 'Pending Cutoff'
                          ? 'Pending (1 PM)'
                          : 'Delayed'}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-center font-sans">
                      <button
                        onClick={() => {
                          setActiveScope(outlet.id);
                          setActiveModule('outlet-overview');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-medium text-[11px] transition-colors cursor-pointer"
                      >
                        View <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secondary Information - At most TWO concise sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
        {/* Section 1: Concise Sales & Performance Trend */}
        <div className="bg-white border border-slate-200 rounded-md p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-teal-700" />
              Sales & Channel Mix Trend
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Week 41 Run-Rate</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Overall revenue grew <strong>+11.8%</strong> week-on-week, led by strong lunch-hour counter sales at Flagship Indiranagar and rapid delivery order volume through Swiggy, Zomato, and Ownly (delivery fulfilled by Rapido).
          </p>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 font-sans block">Counter Cash & UPI</span>
              <span className="text-sm font-bold text-slate-900">48.2%</span>
              <span className="text-[10px] text-slate-400 block font-sans">₹4,41,200</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 font-sans block">Swiggy & Zomato</span>
              <span className="text-sm font-bold text-slate-900">38.4%</span>
              <span className="text-[10px] text-slate-400 block font-sans">₹3,51,600</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 font-sans block">Ownly (by Rapido) + Tipplr</span>
              <span className="text-sm font-bold text-slate-900">13.4%</span>
              <span className="text-[10px] text-slate-400 block font-sans">₹1,22,800</span>
            </div>
          </div>
        </div>

        {/* Section 2: Concise High-Priority Exceptions Summary */}
        <div className="bg-white border border-slate-200 rounded-md p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Operational Exceptions Requiring Attention
            </h3>
            <span className="text-[11px] text-amber-800 font-semibold font-mono">
              {branchesNeedingAttention.length + activeHikes.length} Pending
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {branchesNeedingAttention.map((b) => (
              <div
                key={b.id}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-start justify-between gap-2"
              >
                <div>
                  <div className="font-semibold text-slate-900">
                    {b.name} ({b.id})
                  </div>
                  <div className="text-slate-600 text-[11px] mt-0.5">
                    {b.attentionReason || 'Day-end audit pending review'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveScope(b.id);
                    setActiveModule('outlet-overview');
                  }}
                  className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-700 shrink-0"
                >
                  Inspect →
                </button>
              </div>
            ))}

            {activeHikes.slice(0, 1).map((hike) => (
              <div
                key={hike.id}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-start justify-between gap-2"
              >
                <div>
                  <div className="font-semibold text-slate-900">
                    {hike.ingredientName} (+{hike.percentIncrease}% Price Hike)
                  </div>
                  <div className="text-slate-600 text-[11px] mt-0.5">
                    Vendor: {hike.vendorName} · ₹{hike.previousUnitPrice} → ₹{hike.currentUnitPrice}/{hike.unit}
                  </div>
                </div>
                <button
                  onClick={() => setActiveModule('ck-purchases')}
                  className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-700 shrink-0"
                >
                  Review →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for calculated contribution
function outletExpensesEstimated(outlet: any): number {
  return outlet.expensesToday || 0;
}
