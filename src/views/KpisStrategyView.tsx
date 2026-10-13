import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Sparkles,
  BarChart3,
  UtensilsCrossed,
  LineChart,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ChefHat,
  ArrowRight
} from 'lucide-react';

export const KpisStrategyView: React.FC = () => {
  const { weeklyStrategy, outlets, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'strategy' | 'dish-kpis' | 'branch-kpis'>('strategy');

  const dishPerformanceData = [
    {
      name: 'Ghee Podi Idli (4 pcs)',
      qtySoldToday: 820,
      revenueToday: 98400,
      avgSellingPrice: 120,
      foodCostPct: 24.2,
      grossMarginPct: 75.8,
      wastePct: 1.1,
      topOutlet: 'Indiranagar Flagship',
      forecastedQtyNextWeek: 940,
      recommendedProductionKg: 780
    },
    {
      name: 'Benne Dosa Classic',
      qtySoldToday: 640,
      revenueToday: 89600,
      avgSellingPrice: 140,
      foodCostPct: 27.5,
      grossMarginPct: 72.5,
      wastePct: 1.8,
      topOutlet: 'Koramangala 5th Block',
      forecastedQtyNextWeek: 710,
      recommendedProductionKg: 620
    },
    {
      name: 'South Spice Rice Bowl with Paneer',
      qtySoldToday: 510,
      revenueToday: 126990,
      avgSellingPrice: 249,
      foodCostPct: 32.1,
      grossMarginPct: 67.9,
      wastePct: 2.3,
      topOutlet: 'Bellandur ORR Cloud',
      forecastedQtyNextWeek: 580,
      recommendedProductionKg: 520
    },
    {
      name: 'Executive South Meals Box',
      qtySoldToday: 440,
      revenueToday: 87560,
      avgSellingPrice: 199,
      foodCostPct: 30.8,
      grossMarginPct: 69.2,
      wastePct: 1.5,
      topOutlet: 'Whitefield ITPL Road',
      forecastedQtyNextWeek: 490,
      recommendedProductionKg: 450
    },
    {
      name: 'Filter Coffee Tumbler',
      qtySoldToday: 1420,
      revenueToday: 63900,
      avgSellingPrice: 45,
      foodCostPct: 18.5,
      grossMarginPct: 81.5,
      wastePct: 0.8,
      topOutlet: 'Malleshwaram 8th Cross',
      forecastedQtyNextWeek: 1550,
      recommendedProductionKg: 380
    }
  ];

  const handleApplyRecommendation = (title: string) => {
    addToast('success', 'Strategy Acknowledged', `Action plan for "${title}" logged for Central Kitchen shift brief.`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            Next Week Operational Strategy & Dish Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rule-based demand projections, Central Kitchen production recommendations, and risk mitigation
          </p>
        </div>

        <span className="text-xs font-mono font-medium px-2.5 py-1 bg-teal-50 text-teal-900 border border-teal-200 rounded">
          AI INSIGHTS SEPARATED FROM POSTED LEDGERS
        </span>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-md p-1.5 flex items-center gap-1 text-xs">
        <button
          onClick={() => setActiveTab('strategy')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'strategy' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          1. Next Week Operations Strategy ({weeklyStrategy.length})
        </button>
        <button
          onClick={() => setActiveTab('dish-kpis')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'dish-kpis' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          2. Dish-Level Unit Economics ({dishPerformanceData.length})
        </button>
        <button
          onClick={() => setActiveTab('branch-kpis')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'branch-kpis' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          3. Branch KPI Comparison
        </button>
      </div>

      {/* TAB: Next Week Strategy */}
      {activeTab === 'strategy' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 leading-relaxed">
            <strong>Decision Rule Framework:</strong> Recommendations are derived from multi-week POS transaction trends, day-part volumes (breakfast vs lunch vs dinner), APMC vegetable arrival price shifts, and aggregator settlement logs. Recommendations require operational manager sign-off prior to production scheduling.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weeklyStrategy.map((card) => (
              <div
                key={card.id}
                className="bg-white border border-slate-200 rounded-md p-4 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      {card.domain}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        card.actionPriority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : card.actionPriority === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      Priority: {card.actionPriority}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {card.title}
                  </h3>

                  <div className="mt-2 p-2.5 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 space-y-1.5">
                    <div>
                      <strong className="text-slate-900">Historical Signal:</strong> {card.supportingData}
                    </div>
                    <div>
                      <strong className="text-teal-900">Recommended Action:</strong> {card.recommendation}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      <strong>Expected Outcome:</strong> {card.expectedImpact}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-slate-500">
                    Model Confidence: <strong>{card.confidenceScore}%</strong>
                  </span>
                  <button
                    onClick={() => handleApplyRecommendation(card.title)}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
                  >
                    Acknowledge & Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Dish KPIs */}
      {activeTab === 'dish-kpis' && (
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="px-3.5 py-2.5">Menu Item</th>
                  <th className="px-3 py-2.5 text-right">Units Sold Today</th>
                  <th className="px-3 py-2.5 text-right">Revenue</th>
                  <th className="px-3 py-2.5 text-right">Avg Selling Price</th>
                  <th className="px-3 py-2.5 text-right">Food Cost %</th>
                  <th className="px-3 py-2.5 text-right">Gross Margin %</th>
                  <th className="px-3 py-2.5 text-right">Forecasted Next Week</th>
                  <th className="px-3 py-2.5 text-right">CK Batch Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {dishPerformanceData.map((dish) => (
                  <tr key={dish.name} className="hover:bg-slate-50">
                    <td className="px-3.5 py-2.5 font-sans">
                      <div className="font-bold text-slate-900">{dish.name}</div>
                      <div className="text-[10px] text-slate-500">Top Hub: {dish.topOutlet}</div>
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold text-slate-900">{dish.qtySoldToday}</td>
                    <td className="px-3 py-2.5 text-right font-bold">₹{dish.revenueToday.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right text-slate-600">₹{dish.avgSellingPrice}</td>
                    <td className="px-3 py-2.5 text-right text-rose-700">{dish.foodCostPct}%</td>
                    <td className="px-3 py-2.5 text-right font-bold text-emerald-800">{dish.grossMarginPct}%</td>
                    <td className="px-3 py-2.5 text-right text-slate-900">{dish.forecastedQtyNextWeek} units</td>
                    <td className="px-3 py-2.5 text-right font-bold text-teal-800">{dish.recommendedProductionKg} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Branch KPIs */}
      {activeTab === 'branch-kpis' && (
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="p-3">Branch Outlet</th>
                <th className="p-3 text-right">Gross Sales</th>
                <th className="p-3 text-right">Food Cost %</th>
                <th className="p-3 text-right">Gross Margin %</th>
                <th className="p-3 text-right">Cash Variance</th>
                <th className="p-3 text-center">Settlement Status</th>
                <th className="p-3 text-center">1 PM Day-End Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {outlets.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="p-3 font-sans">
                    <span className="font-bold text-slate-900">{o.name}</span>
                    <span className="text-slate-400 font-mono text-[11px] ml-1.5">({o.id})</span>
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900">₹{o.grossSalesToday.toLocaleString()}</td>
                  <td className="p-3 text-right text-rose-700">{o.foodCostPct}%</td>
                  <td className="p-3 text-right font-bold text-emerald-800">{o.grossMarginPct}%</td>
                  <td className="p-3 text-right">
                    <span className={o.cashVariance < 0 ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                      ₹{o.cashVariance}
                    </span>
                  </td>
                  <td className="p-3 text-center font-sans">
                    <StatusBadge status={o.settlementStatus} />
                  </td>
                  <td className="p-3 text-center font-sans">
                    <StatusBadge status={o.dayEndStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
