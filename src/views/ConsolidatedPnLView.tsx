import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Building,
  Filter,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface ConsolidatedPnLProps {
  mode?: 'consolidated' | 'brand' | 'outlet';
}

export const ConsolidatedPnLView: React.FC<ConsolidatedPnLProps> = ({ mode }) => {
  const { tenant, brand, outlets, expenses, dateFilter, activeModule, addToast } = useApp();

  const getInitialTab = (): 'statement' | 'brand-pnl' | 'outlet-breakdown' | 'accounting-policy' => {
    if (mode === 'brand' || activeModule === 'pnl-brand') return 'brand-pnl';
    if (mode === 'outlet' || activeModule === 'pnl-outlet') return 'outlet-breakdown';
    return 'statement';
  };

  const [accountingPeriod, setAccountingPeriod] = useState('Month to Date (October 2026)');
  const [selectedOutletScope, setSelectedOutletScope] = useState('all');
  const [includeCentralKitchen, setIncludeCentralKitchen] = useState(true);
  const [comparisonPeriod, setComparisonPeriod] = useState('Previous Month (Sep 2026)');
  const [activeTab, setActiveTab] = useState<'statement' | 'brand-pnl' | 'outlet-breakdown' | 'accounting-policy'>(getInitialTab());

  // Filter outlets by selection
  const relevantOutlets =
    selectedOutletScope === 'all'
      ? outlets
      : outlets.filter((o) => o.id === selectedOutletScope);

  // Financial figures calculation
  const grossSales = relevantOutlets.reduce((sum, o) => sum + o.grossSalesToday, 0) * 30; // MTD projection factor
  const discountsAndRefunds = grossSales * 0.058; // 5.8% discounts & platform refunds
  const netSales = grossSales - discountsAndRefunds;

  // COGS / Food Cost (Consumption basis, not raw purchase totals)
  const weightedFoodCostRatio = 0.298; // 29.8% consumption ratio
  const costOfGoodsSold = netSales * weightedFoodCostRatio;
  const grossProfit = netSales - costOfGoodsSold;
  const grossMarginPct = ((grossProfit / netSales) * 100).toFixed(1);

  // Operating Expenses Breakdown
  const employeeWagesExpense = netSales * 0.165; // 16.5% of net sales (accrued monthly wages & daily wages)
  const rentAndAccommodationExpense = 345000; // Fixed outlet rent & staff accommodation
  const utilitiesAndGasExpense = netSales * 0.052; // 5.2% commercial BESCOM & LPG
  const transportAndOtherExpenses = includeCentralKitchen ? 142000 : 75000; // Refrigerated logistics + petty
  const totalOperatingExpenses =
    employeeWagesExpense +
    rentAndAccommodationExpense +
    utilitiesAndGasExpense +
    transportAndOtherExpenses;

  // EBITDA = Operating Revenue (Net Sales) - COGS - Operating Expenses
  const ebitda = grossProfit - totalOperatingExpenses;
  const ebitdaMarginPct = ((ebitda / netSales) * 100).toFixed(1);

  // Prior period comparison benchmarks
  const priorNetSales = netSales * 0.92;
  const priorGrossProfit = priorNetSales * 0.695;
  const priorEbitda = ebitda * 0.88;

  const handleExport = (type: string) => {
    addToast('success', 'Report Exported', `Generated ${type} export for Consolidated Profit & Loss.`);
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 p-4 rounded-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
              <span className="font-semibold text-slate-800">{tenant.name}</span>
              <span>·</span>
              <span>{brand.name}</span>
              <span>·</span>
              <span className="font-mono text-slate-600">Statutory MIS Format</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-teal-700" />
              Consolidated Profit &amp; Loss Statement
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('CSV')}
              className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print Statement
            </button>
          </div>
        </div>

        {/* Filter Bar Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Accounting Period</label>
            <select
              value={accountingPeriod}
              onChange={(e) => setAccountingPeriod(e.target.value)}
              className="w-full border border-slate-200 rounded p-1.5 bg-white text-slate-800 focus:outline-hidden"
            >
              <option value="Month to Date (October 2026)">Month to Date (October 2026)</option>
              <option value="Q3 FY 2026-27">Q3 FY 2026-27</option>
              <option value="Today (Daily Run-rate)">Today (Daily Run-rate)</option>
              <option value="Last Month (September 2026)">Last Month (September 2026)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Outlet Scope</label>
            <select
              value={selectedOutletScope}
              onChange={(e) => setSelectedOutletScope(e.target.value)}
              className="w-full border border-slate-200 rounded p-1.5 bg-white text-slate-800 focus:outline-hidden"
            >
              <option value="all">All 9 Operating Outlets (Consolidated)</option>
              {outlets.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Comparison Baseline</label>
            <select
              value={comparisonPeriod}
              onChange={(e) => setComparisonPeriod(e.target.value)}
              className="w-full border border-slate-200 rounded p-1.5 bg-white text-slate-800 focus:outline-hidden"
            >
              <option value="Previous Month (Sep 2026)">Previous Month (Sep 2026)</option>
              <option value="Same Period Last Year">Same Period Last Year</option>
              <option value="Budget Baseline (Q3)">Budget Baseline (Q3)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeCentralKitchen}
                onChange={(e) => setIncludeCentralKitchen(e.target.checked)}
                className="rounded border-slate-300 text-teal-700 focus:ring-teal-500"
              />
              <span className="text-xs text-slate-700 font-medium">Include Central Kitchen Costs</span>
            </label>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-md text-xs">
        <button
          onClick={() => setActiveTab('statement')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'statement' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          1. Consolidated P&amp;L Statement
        </button>
        <button
          onClick={() => setActiveTab('brand-pnl')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'brand-pnl' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          2. Brand-Wise Profit &amp; Loss
        </button>
        <button
          onClick={() => setActiveTab('outlet-breakdown')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'outlet-breakdown' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          3. Outlet-Wise Contribution Breakdown
        </button>
        <button
          onClick={() => setActiveTab('accounting-policy')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'accounting-policy' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          4. Accounting Rules &amp; Policies
        </button>
      </div>

      {/* TAB: Consolidated Financial Statement */}
      {activeTab === 'statement' && (
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Financial Line Item</th>
                <th className="px-4 py-3 text-right">Current Period (₹)</th>
                <th className="px-4 py-3 text-right">% of Net Sales</th>
                <th className="px-4 py-3 text-right">Prior Period (₹)</th>
                <th className="px-4 py-3 text-right">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {/* 1. Gross Sales */}
              <tr className="bg-slate-50/50 font-bold text-slate-900">
                <td className="px-4 py-2.5 font-sans">1. Gross Revenue (Dine-in, Counter &amp; Online)</td>
                <td className="px-4 py-2.5 text-right font-bold">₹{Math.round(grossSales).toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right">106.1%</td>
                <td className="px-4 py-2.5 text-right text-slate-500">₹{Math.round(grossSales * 0.91).toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-emerald-700">+9.9%</td>
              </tr>

              {/* 2. Less Discounts & Refunds */}
              <tr className="text-slate-600">
                <td className="px-4 py-2 font-sans pl-8">2. Less: Channel Discounts, Aggregator Subsidies &amp; Refunds</td>
                <td className="px-4 py-2 text-right text-rose-700">-₹{Math.round(discountsAndRefunds).toLocaleString()}</td>
                <td className="px-4 py-2 text-right">6.1%</td>
                <td className="px-4 py-2 text-right text-slate-500">-₹{Math.round(discountsAndRefunds * 0.94).toLocaleString()}</td>
                <td className="px-4 py-2 text-right text-slate-600">+6.4%</td>
              </tr>

              {/* 3. Net Sales */}
              <tr className="bg-slate-100/80 font-bold text-slate-900 text-sm">
                <td className="px-4 py-3 font-sans">3. Net Sales (Operating Turnover)</td>
                <td className="px-4 py-3 text-right font-bold">₹{Math.round(netSales).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">100.0%</td>
                <td className="px-4 py-3 text-right text-slate-700">₹{Math.round(priorNetSales).toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-emerald-700 font-semibold">+8.7%</td>
              </tr>

              {/* 4. Cost of Goods Sold */}
              <tr className="text-slate-700">
                <td className="px-4 py-2.5 font-sans pl-8">4. Cost of Goods Sold / Food Cost (Consumption basis)</td>
                <td className="px-4 py-2.5 text-right text-rose-700 font-semibold">-₹{Math.round(costOfGoodsSold).toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right">29.8%</td>
                <td className="px-4 py-2.5 text-right text-slate-500">-₹{Math.round(costOfGoodsSold * 0.93).toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-slate-600">+7.5%</td>
              </tr>

              {/* 5. Gross Profit */}
              <tr className="bg-emerald-50/60 font-bold text-emerald-950 text-sm">
                <td className="px-4 py-3 font-sans">5. Gross Profit (Operating Contribution)</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-900">₹{Math.round(grossProfit).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">{grossMarginPct}%</td>
                <td className="px-4 py-3 text-right text-slate-700">₹{Math.round(priorGrossProfit).toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-emerald-700">+9.2%</td>
              </tr>

              {/* 6. Gross Margin % */}
              <tr className="text-slate-600">
                <td className="px-4 py-2 font-sans pl-8">6. Gross Margin Percentage</td>
                <td className="px-4 py-2 text-right font-semibold text-slate-800">{grossMarginPct}%</td>
                <td className="px-4 py-2 text-right">-</td>
                <td className="px-4 py-2 text-right text-slate-500">69.5%</td>
                <td className="px-4 py-2 text-right text-emerald-700">+0.7% pts</td>
              </tr>

              {/* 7. Operating Expenses Header */}
              <tr className="bg-slate-50 font-semibold text-slate-800">
                <td colSpan={5} className="px-4 py-2 font-sans uppercase text-[10px] tracking-wider text-slate-500">
                  7. Operating Expenses (OPEX)
                </td>
              </tr>

              {/* 8. Employee and Wage Expenses */}
              <tr className="text-slate-600">
                <td className="px-4 py-2 font-sans pl-8">8. Employee Salaries, Daily Wages &amp; Overtime Accruals</td>
                <td className="px-4 py-2 text-right text-rose-700">-₹{Math.round(employeeWagesExpense).toLocaleString()}</td>
                <td className="px-4 py-2 text-right">16.5%</td>
                <td className="px-4 py-2 text-right text-slate-500">-₹{Math.round(employeeWagesExpense * 0.95).toLocaleString()}</td>
                <td className="px-4 py-2 text-right text-slate-600">+5.3%</td>
              </tr>

              {/* 9. Rent and Accommodation */}
              <tr className="text-slate-600">
                <td className="px-4 py-2 font-sans pl-8">9. Outlet Rent &amp; Staff Quarters Accommodation</td>
                <td className="px-4 py-2 text-right text-rose-700">-₹{rentAndAccommodationExpense.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{((rentAndAccommodationExpense / netSales) * 100).toFixed(1)}%</td>
                <td className="px-4 py-2 text-right text-slate-500">-₹340,000</td>
                <td className="px-4 py-2 text-right text-slate-600">+1.5%</td>
              </tr>

              {/* 10. Utilities and Maintenance */}
              <tr className="text-slate-600">
                <td className="px-4 py-2 font-sans pl-8">10. Utilities (Electricity BESCOM, Commercial Gas LPG, Water)</td>
                <td className="px-4 py-2 text-right text-rose-700">-₹{Math.round(utilitiesAndGasExpense).toLocaleString()}</td>
                <td className="px-4 py-2 text-right">5.2%</td>
                <td className="px-4 py-2 text-right text-slate-500">-₹{Math.round(utilitiesAndGasExpense * 0.96).toLocaleString()}</td>
                <td className="px-4 py-2 text-right text-slate-600">+4.2%</td>
              </tr>

              {/* 11. Transport and Other */}
              <tr className="text-slate-600">
                <td className="px-4 py-2 font-sans pl-8">11. Central Kitchen Inward Transport &amp; Other Operational Costs</td>
                <td className="px-4 py-2 text-right text-rose-700">-₹{transportAndOtherExpenses.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{((transportAndOtherExpenses / netSales) * 100).toFixed(1)}%</td>
                <td className="px-4 py-2 text-right text-slate-500">-₹135,000</td>
                <td className="px-4 py-2 text-right text-slate-600">+5.2%</td>
              </tr>

              {/* 12. EBITDA */}
              <tr className="bg-slate-900 text-white font-bold text-sm">
                <td className="px-4 py-3.5 font-sans">12. Operating EBITDA</td>
                <td className="px-4 py-3.5 text-right font-bold text-teal-300">₹{Math.round(ebitda).toLocaleString()}</td>
                <td className="px-4 py-3.5 text-right font-mono">{ebitdaMarginPct}%</td>
                <td className="px-4 py-3.5 text-right text-slate-300 font-mono">₹{Math.round(priorEbitda).toLocaleString()}</td>
                <td className="px-4 py-3.5 text-right text-emerald-400 font-mono">+13.6%</td>
              </tr>

              {/* 13. EBITDA Margin % */}
              <tr className="bg-slate-950 text-slate-300 text-xs font-medium">
                <td className="px-4 py-2.5 font-sans pl-8">13. EBITDA Margin % (Turnover Ratio)</td>
                <td className="px-4 py-2.5 text-right font-bold text-white">{ebitdaMarginPct}%</td>
                <td className="px-4 py-2.5 text-right">-</td>
                <td className="px-4 py-2.5 text-right text-slate-400">18.2%</td>
                <td className="px-4 py-2.5 text-right text-emerald-400">+1.5% pts</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: Brand-Wise Profit & Loss Statement */}
      {activeTab === 'brand-pnl' && (
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden space-y-4 p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-200 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-100 text-slate-800">
                  {brand.id}
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {brand.name} — Brand-Wise Profit &amp; Loss Statement
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Cuisine: {brand.cuisine} · {brand.activeOutletsCount} Operating Locations across Bengaluru
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Brand Royalty / Mgmt Fee:</span>
              <div className="font-mono font-bold text-teal-800 text-sm">5.0% of Net Revenue</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[11px] text-slate-500 block">Brand Gross Sales</span>
              <span className="font-mono text-base font-bold text-slate-900">₹{Math.round(grossSales).toLocaleString()}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[11px] text-slate-500 block">Brand Net Revenue</span>
              <span className="font-mono text-base font-bold text-slate-900">₹{Math.round(netSales).toLocaleString()}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[11px] text-slate-500 block">Brand Food Cost</span>
              <span className="font-mono text-base font-bold text-rose-700">29.8% (COGS)</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[11px] text-slate-500 block">Brand EBITDA</span>
              <span className="font-mono text-base font-bold text-emerald-800">₹{Math.round(ebitda).toLocaleString()}</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="p-3">Brand Financial Schedule Item</th>
                  <th className="p-3 text-right">Brand Amount (₹)</th>
                  <th className="p-3 text-right">% of Net Sales</th>
                  <th className="p-3">Accounting Description &amp; Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr className="bg-slate-50/50 font-bold">
                  <td className="p-3 font-sans">Brand Gross Revenue</td>
                  <td className="p-3 text-right font-bold">₹{Math.round(grossSales).toLocaleString()}</td>
                  <td className="p-3 text-right">106.1%</td>
                  <td className="p-3 font-sans text-slate-500 font-normal">All 9 outlets mapped to {brand.name}</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans pl-8 text-slate-600">Less: Platform Discounts &amp; Customer Subsidies</td>
                  <td className="p-3 text-right text-rose-700">-₹{Math.round(discountsAndRefunds).toLocaleString()}</td>
                  <td className="p-3 text-right">6.1%</td>
                  <td className="p-3 font-sans text-slate-500">Brand promotional discounts</td>
                </tr>
                <tr className="bg-slate-100/70 font-bold text-slate-900">
                  <td className="p-3 font-sans">Brand Net Sales (Turnover)</td>
                  <td className="p-3 text-right font-bold">₹{Math.round(netSales).toLocaleString()}</td>
                  <td className="p-3 text-right">100.0%</td>
                  <td className="p-3 font-sans text-slate-700">Net operating revenue recognized</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans pl-8 text-slate-700">Less: Recipe Ingredients &amp; Raw Material COGS</td>
                  <td className="p-3 text-right text-rose-700">-₹{Math.round(costOfGoodsSold).toLocaleString()}</td>
                  <td className="p-3 text-right">29.8%</td>
                  <td className="p-3 font-sans text-slate-500">Central Kitchen standard recipes consumption</td>
                </tr>
                <tr className="bg-emerald-50/50 font-bold text-emerald-950">
                  <td className="p-3 font-sans">Brand Gross Contribution Margin</td>
                  <td className="p-3 text-right text-emerald-900 font-bold">₹{Math.round(grossProfit).toLocaleString()}</td>
                  <td className="p-3 text-right">{grossMarginPct}%</td>
                  <td className="p-3 font-sans text-emerald-800">Product margin before store operations</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans pl-8 text-slate-600">Less: Brand Management &amp; Central Kitchen Overhead</td>
                  <td className="p-3 text-right text-rose-700">-₹{transportAndOtherExpenses.toLocaleString()}</td>
                  <td className="p-3 text-right">{((transportAndOtherExpenses / netSales) * 100).toFixed(1)}%</td>
                  <td className="p-3 font-sans text-slate-500">Peenya central base shared cost attribution</td>
                </tr>
                <tr className="bg-slate-900 text-white font-bold text-sm">
                  <td className="p-3.5 font-sans">Brand Operating EBITDA</td>
                  <td className="p-3.5 text-right font-bold text-teal-300">₹{Math.round(ebitda).toLocaleString()}</td>
                  <td className="p-3.5 text-right font-mono">{ebitdaMarginPct}%</td>
                  <td className="p-3.5 font-sans text-slate-300 text-xs font-normal">Consolidated brand cash profitability</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Branch Contribution Breakdown */}
      {activeTab === 'outlet-breakdown' && (
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Branch-wise Revenue, Food Cost, OPEX &amp; EBITDA Contribution</h3>
            <p className="text-xs text-slate-500">Breakdown across all 9 operating outlets (Month to Date)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="p-3">Outlet</th>
                  <th className="p-3 text-right">Net Sales</th>
                  <th className="p-3 text-right">Food Cost (COGS)</th>
                  <th className="p-3 text-right">Gross Margin %</th>
                  <th className="p-3 text-right">Direct Expenses</th>
                  <th className="p-3 text-right">EBITDA Contribution</th>
                  <th className="p-3 text-right">Contribution %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {outlets.map((o) => {
                  const oNet = o.netSalesToday * 30;
                  const oFC = oNet * (o.foodCostPct / 100);
                  const oGM = oNet - oFC;
                  const oExp = (o.expensesToday * 30) + 38000; // Direct rent & wage share
                  const oEbitda = oGM - oExp;
                  const oPct = ((oEbitda / oNet) * 100).toFixed(1);

                  return (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-3 font-sans">
                        <span className="font-semibold text-slate-900">{o.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono ml-1">({o.id})</span>
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900">₹{Math.round(oNet).toLocaleString()}</td>
                      <td className="p-3 text-right text-rose-700">-₹{Math.round(oFC).toLocaleString()}</td>
                      <td className="p-3 text-right font-semibold text-slate-800">{o.grossMarginPct}%</td>
                      <td className="p-3 text-right text-slate-600">-₹{Math.round(oExp).toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-teal-800">₹{Math.round(oEbitda).toLocaleString()}</td>
                      <td className="p-3 text-right font-semibold text-slate-900">{oPct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Accounting Rules & Policies */}
      {activeTab === 'accounting-policy' && (
        <div className="bg-white border border-slate-200 rounded-md p-5 text-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-teal-700" />
            BIT Hospitality Accounting &amp; Statement Classification Rules
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 leading-relaxed">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1.5">
              <strong className="text-slate-900 text-xs block">1. Inventory Purchases vs. Consumption-based Food Cost:</strong>
              <p className="text-[11px] text-slate-600">
                Bulk raw-material purchases recorded for the Central Kitchen (e.g. 500kg Sona Masoori Rice) are capitalized as Inventory Assets upon inwarding. Only physical stock consumed in production recipes or branch kitchens is recognized as Cost of Goods Sold (COGS) in the P&amp;L statement.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1.5">
              <strong className="text-slate-900 text-xs block">2. Salary Advances vs. Accrued Salary Expense:</strong>
              <p className="text-[11px] text-slate-600">
                Staff salary advances are booked as balance sheet receivables against future wages. Monthly payroll expense is recognized strictly upon attendance accrual, preventing any double-counting of wage expenditures.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1.5">
              <strong className="text-slate-900 text-xs block">3. Aggregator Platform Fees &amp; Card Charges:</strong>
              <p className="text-[11px] text-slate-600">
                Swiggy, Zomato, and Ownly platform commissions along with 2.5% premium card processing fees are accounted as deductions to arrive at Net Settlement Receivable, separated from base operating expenses.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1.5">
              <strong className="text-slate-900 text-xs block">4. Central Kitchen Transport Attribution:</strong>
              <p className="text-[11px] text-slate-600">
                Dedicated refrigerated transport van costs operating between Peenya Central Kitchen and operating branches are classified under Logistics &amp; Transport OPEX, distinct from direct raw material costs.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
