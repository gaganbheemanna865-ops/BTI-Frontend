import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import {
  TrendingUp,
  Percent,
  Layers,
  ArrowRight,
  HelpCircle,
  FileSpreadsheet,
  Download
} from 'lucide-react';

export const EbitdaMarginView: React.FC = () => {
  const { tenant, brand, outlets, expenses, addToast } = useApp();

  const [timeframe, setTimeframe] = useState('Month to Date (October 2026)');

  // Consolidated financial computation
  const grossSales = outlets.reduce((sum, o) => sum + o.grossSalesToday, 0) * 30;
  const netSales = grossSales * 0.942;
  const foodCost = netSales * 0.298;
  const grossProfit = netSales - foodCost;
  const grossMarginPct = ((grossProfit / netSales) * 100).toFixed(1);

  const operatingExpenses = (expenses.reduce((sum, e) => sum + e.amount, 0) * 30) + 420000;
  const ebitda = grossProfit - operatingExpenses;
  const ebitdaMarginPct = ((ebitda / netSales) * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
            <span className="font-semibold text-slate-800">{tenant.name}</span>
            <span>·</span>
            <span>{brand.name}</span>
            <span>·</span>
            <span className="font-mono text-slate-600">Financial Intelligence</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-700" />
            EBITDA &amp; Operating Margin Analysis
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border border-slate-200 bg-white text-slate-700 rounded px-2.5 py-1.5 text-xs focus:outline-hidden"
          >
            <option value="Month to Date (October 2026)">Month to Date (October 2026)</option>
            <option value="Quarter 3 FY27">Quarter 3 FY27</option>
            <option value="Today (Daily Estimate)">Today (Daily Estimate)</option>
          </select>

          <button
            onClick={() => addToast('success', 'Report Exported', 'EBITDA & Margin Analysis spreadsheet exported.')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
          >
            Export Analysis
          </button>
        </div>
      </div>

      {/* Core EBITDA Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <MetricCard
          label="Net Sales"
          value={`₹${Math.round(netSales / 1000).toLocaleString()}k`}
          subValue="Revenue"
        />
        <MetricCard
          label="Food Cost"
          value={`₹${Math.round(foodCost / 1000).toLocaleString()}k`}
          subValue="29.8% COGS"
        />
        <MetricCard
          label="Gross Profit"
          value={`₹${Math.round(grossProfit / 1000).toLocaleString()}k`}
          subValue="Contribution"
        />
        <MetricCard
          label="Gross Margin"
          value={`${grossMarginPct}%`}
          subValue="Healthy target"
          trend="up"
          trendValue="+0.7%"
        />
        <MetricCard
          label="Operating Expenses"
          value={`₹${Math.round(operatingExpenses / 1000).toLocaleString()}k`}
          subValue="Rent, Wages, Utils"
        />
        <MetricCard
          label="EBITDA"
          value={`₹${Math.round(ebitda / 1000).toLocaleString()}k`}
          subValue="Operating profit"
          trend="up"
          trendValue="+13.6%"
        />
        <MetricCard
          label="EBITDA Margin"
          value={`${ebitdaMarginPct}%`}
          subValue="Turnover ratio"
          trend="up"
          trendValue="Target >18%"
        />
      </div>

      {/* Formula & Policy Callout */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <HelpCircle className="w-4 h-4 text-teal-700" />
          <span>Accounting Policy &amp; Formula Definition</span>
        </div>
        <p className="text-slate-700 font-mono text-[11px] bg-white p-2.5 rounded border border-slate-200">
          EBITDA = Operating Revenue (Net Sales) − Cost of Goods Sold (Consumption basis) − Direct Operating Expenses (Wages, Rent, Utilities, Transport)
        </p>
        <p className="text-slate-600 text-[11px] leading-relaxed">
          In accordance with enterprise restaurant accounting standards, interest on bank loans, depreciation on kitchen plant equipment, amortization of brand franchise fees, and corporate income taxes are excluded from EBITDA to evaluate pure operating unit economics.
        </p>
      </div>

      {/* Outlet EBITDA Contribution Matrix */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">
            Outlet-by-Outlet EBITDA Contribution Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Contribution margin ranking across all 9 operating locations
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="p-3">Outlet ID</th>
                <th className="p-3">Branch Location</th>
                <th className="p-3 text-right">Net Sales</th>
                <th className="p-3 text-right">Food Cost %</th>
                <th className="p-3 text-right">Gross Margin %</th>
                <th className="p-3 text-right">Monthly OPEX</th>
                <th className="p-3 text-right">EBITDA (₹)</th>
                <th className="p-3 text-right">EBITDA %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {outlets.map((o) => {
                const oNet = o.netSalesToday * 30;
                const oFC = oNet * (o.foodCostPct / 100);
                const oGM = oNet - oFC;
                const oExp = (o.expensesToday * 30) + 38000;
                const oEbitda = oGM - oExp;
                const oPct = ((oEbitda / oNet) * 100).toFixed(1);

                return (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-500">{o.id}</td>
                    <td className="p-3 font-sans font-medium text-slate-900">{o.name}</td>
                    <td className="p-3 text-right font-bold text-slate-900">₹{Math.round(oNet).toLocaleString()}</td>
                    <td className="p-3 text-right text-rose-700">{o.foodCostPct}%</td>
                    <td className="p-3 text-right font-semibold text-emerald-800">{o.grossMarginPct}%</td>
                    <td className="p-3 text-right text-slate-600">₹{Math.round(oExp).toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-teal-800">₹{Math.round(oEbitda).toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-slate-900">{oPct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
