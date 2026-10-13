import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Building2,
  Coins,
  FileCode2,
  Table,
  CheckCircle2
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    tenant,
    brand,
    outlets,
    expenses,
    purchases,
    settlements,
    addToast
  } = useApp();

  const [activeReport, setActiveReport] = useState<
    'pnl-consolidated' | 'pnl-outlet' | 'ck-cost' | 'day-end-summary' | 'tally-export'
  >('pnl-consolidated');

  // Aggregated financials
  const grossSales = outlets.reduce((sum, o) => sum + o.grossSalesToday, 0);
  const netSales = outlets.reduce((sum, o) => sum + o.netSalesToday, 0);
  const discountsAndTaxes = grossSales - netSales;
  const foodCostEstimate = netSales * 0.298; // ~29.8% weighted food cost
  const grossMargin = netSales - foodCostEstimate;
  const operatingExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const ebitda = grossMargin - operatingExpenses;

  const handleExportTally = (format: 'xml' | 'csv') => {
    addToast(
      'success',
      'Tally File Generated',
      `Generated Tally ERP compliant ${format.toUpperCase()} transaction voucher stream for export.`
    );
  };

  const reportsList = [
    { id: 'pnl-consolidated', label: '1. Consolidated P&L' },
    { id: 'pnl-outlet', label: '2. Outlet-Wise P&L' },
    { id: 'ck-cost', label: '3. Central Kitchen Cost Report' },
    { id: 'day-end-summary', label: '4. Day-End 1 PM Summary' },
    { id: 'tally-export', label: '5. Accounting / Tally Support' }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-slate-700" />
            Financial Reporting & Management Information System (MIS)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Accredited revenue schedules, Gross Margin, Operating Expenses, EBITDA, and Tally ERP integrations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportTally('csv')}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => handleExportTally('xml')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors shadow-xs"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            Generate Tally XML
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-md p-1.5 flex items-center gap-1 text-xs overflow-x-auto">
        {reportsList.map((rep) => (
          <button
            key={rep.id}
            onClick={() => setActiveReport(rep.id as any)}
            className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap ${
              activeReport === rep.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {rep.label}
          </button>
        ))}
      </div>

      {/* REPORT: Consolidated P&L */}
      {activeReport === 'pnl-consolidated' && (
        <div className="bg-white border border-slate-200 rounded-md p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Consolidated Profit & Loss Statement (Today: 09-Oct-2026)
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Entity: {tenant.legalEntity} · Currency: INR (₹)
              </span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-100 text-slate-700">
              AUDITED ESTIMATE
            </span>
          </div>

          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-2.5">Financial Line Item</th>
                  <th className="px-4 py-2.5 text-right">Amount (₹)</th>
                  <th className="px-4 py-2.5 text-right">% of Net Revenue</th>
                  <th className="px-4 py-2.5">Accounting Classification & Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr className="bg-slate-50/50 font-bold text-slate-900">
                  <td className="px-4 py-2 font-sans">A. Gross Sales (Counter + Aggregators)</td>
                  <td className="px-4 py-2 text-right">₹{grossSales.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">106.8%</td>
                  <td className="px-4 py-2 font-sans text-slate-500 font-normal">All 9 outlets POS gross volume</td>
                </tr>
                <tr className="text-slate-600">
                  <td className="px-4 py-2 font-sans pl-8">Less: Channel Discounts & Platform Markdowns</td>
                  <td className="px-4 py-2 text-right text-rose-700">-₹{Math.round(discountsAndTaxes * 0.45).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">3.1%</td>
                  <td className="px-4 py-2 font-sans text-slate-500">Merchant funded promotional subsidies</td>
                </tr>
                <tr className="text-slate-600">
                  <td className="px-4 py-2 font-sans pl-8">Less: Output GST Payable (5%)</td>
                  <td className="px-4 py-2 text-right text-rose-700">-₹{Math.round(discountsAndTaxes * 0.55).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">3.7%</td>
                  <td className="px-4 py-2 font-sans text-slate-500">GST liability reserve</td>
                </tr>
                <tr className="bg-slate-100 font-bold text-slate-900 text-sm">
                  <td className="px-4 py-2.5 font-sans">B. Net Operational Sales</td>
                  <td className="px-4 py-2.5 text-right">₹{netSales.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right">100.0%</td>
                  <td className="px-4 py-2.5 font-sans text-slate-700 font-medium">Core Top-line Revenue</td>
                </tr>
                <tr className="text-slate-700 font-medium">
                  <td className="px-4 py-2 font-sans">C. Cost of Goods Sold (COGS / Food Cost)</td>
                  <td className="px-4 py-2 text-right text-rose-700">-₹{Math.round(foodCostEstimate).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">29.8%</td>
                  <td className="px-4 py-2 font-sans text-slate-500 font-normal">Raw groceries, dairy, batter, packaging</td>
                </tr>
                <tr className="bg-emerald-50/60 font-bold text-emerald-950 text-sm">
                  <td className="px-4 py-2.5 font-sans">D. Gross Margin Contribution</td>
                  <td className="px-4 py-2.5 text-right">₹{Math.round(grossMargin).toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right">70.2%</td>
                  <td className="px-4 py-2.5 font-sans text-emerald-900 font-medium">Operating Contribution Margin</td>
                </tr>
                <tr className="text-slate-600">
                  <td className="px-4 py-2 font-sans pl-8">Refrigerated Logistics & Van Diesel</td>
                  <td className="px-4 py-2 text-right text-rose-700">-₹4,200</td>
                  <td className="px-4 py-2 text-right">0.5%</td>
                  <td className="px-4 py-2 font-sans text-slate-500">Central Kitchen transport cost</td>
                </tr>
                <tr className="text-slate-600">
                  <td className="px-4 py-2 font-sans pl-8">Staff Wages, Daily Overtime & Staff Meals</td>
                  <td className="px-4 py-2 text-right text-rose-700">-₹28,500</td>
                  <td className="px-4 py-2 text-right">3.5%</td>
                  <td className="px-4 py-2 font-sans text-slate-500">Operational staff daily labor</td>
                </tr>
                <tr className="text-slate-600">
                  <td className="px-4 py-2 font-sans pl-8">Utilities (Commercial BESCOM Electricity & Gas)</td>
                  <td className="px-4 py-2 text-right text-rose-700">-₹18,700</td>
                  <td className="px-4 py-2 text-right">2.3%</td>
                  <td className="px-4 py-2 font-sans text-slate-500">LPG cylinders & commercial power</td>
                </tr>
                <tr className="text-slate-600">
                  <td className="px-4 py-2 font-sans pl-8">Disposables, Bags & Parcels</td>
                  <td className="px-4 py-2 text-right text-rose-700">-₹8,400</td>
                  <td className="px-4 py-2 text-right">1.0%</td>
                  <td className="px-4 py-2 font-sans text-slate-500">Takeaway delivery packaging</td>
                </tr>
                <tr className="bg-slate-900 text-white font-bold text-sm">
                  <td className="px-4 py-3 font-sans">E. Estimated Operational EBITDA</td>
                  <td className="px-4 py-3 text-right text-emerald-400">₹{Math.round(ebitda).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    {((ebitda / netSales) * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 font-sans text-slate-300 font-normal">
                    Pre-tax operating cash flow
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT: Outlet-Wise P&L */}
      {activeReport === 'pnl-outlet' && (
        <div className="bg-white border border-slate-200 rounded-md p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Branch-by-Branch P&L and Profitability Matrix
            </h3>
            <span className="text-xs text-slate-500 font-mono">9 Outlets Audited</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="p-2.5">Outlet ID & Branch</th>
                  <th className="p-2.5 text-right">Gross Sales</th>
                  <th className="p-2.5 text-right">Net Sales</th>
                  <th className="p-2.5 text-right">Food Cost (COGS)</th>
                  <th className="p-2.5 text-right">Gross Margin %</th>
                  <th className="p-2.5 text-right">Direct Expenses</th>
                  <th className="p-2.5 text-right">Est. Branch Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {outlets.map((o) => {
                  const fc = o.netSalesToday * (o.foodCostPct / 100);
                  const gm = o.netSalesToday - fc;
                  const contrib = gm - o.expensesToday;

                  return (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-2.5">
                        <span className="font-sans font-semibold text-slate-900">{o.name}</span>
                        <div className="text-[11px] text-slate-500">{o.id}</div>
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-900">₹{o.grossSalesToday.toLocaleString()}</td>
                      <td className="p-2.5 text-right">₹{o.netSalesToday.toLocaleString()}</td>
                      <td className="p-2.5 text-right text-rose-700">-₹{Math.round(fc).toLocaleString()}</td>
                      <td className="p-2.5 text-right font-bold text-emerald-800">{o.grossMarginPct}%</td>
                      <td className="p-2.5 text-right text-slate-600">₹{o.expensesToday.toLocaleString()}</td>
                      <td className="p-2.5 text-right font-bold text-slate-900">₹{Math.round(contrib).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT: Tally Support */}
      {activeReport === 'tally-export' && (
        <div className="bg-white border border-slate-200 rounded-md p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-teal-700" />
                Tally Prime & ERP 9 XML Export Module
              </h3>
              <p className="text-xs text-slate-500">
                Automated voucher ledger export for statutory chartered accountant synchronization
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExportTally('xml')}
                className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium"
              >
                Download Master XML
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-slate-300 font-mono text-[11px] rounded overflow-x-auto leading-relaxed max-h-72">
            <pre>{`<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
        <STATICVARIABLES>
          <SVCURRENTCOMPANY>BIT Hospitality Group Pvt Ltd</SVCURRENTCOMPANY>
        </STATICVARIABLES>
      </REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER VCHTYPE="Sales" ACTION="Create">
            <DATE>20261009</DATE>
            <VOUCHERNUMBER>BIT-POS-2026-091</VOUCHERNUMBER>
            <PARTYLEDGERNAME>Counter Cash Indiranagar</PARTYLEDGERNAME>
            <AMOUNT>142850.00</AMOUNT>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Gross Restaurant Sales</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>-134280.00</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>CGST Output 2.5%</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>-4285.00</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>SGST Output 2.5%</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>-4285.00</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
          </VOUCHER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`}</pre>
          </div>
        </div>
      )}

      {/* REPORT: Other views */}
      {['ck-cost', 'day-end-summary'].includes(activeReport) && (
        <div className="bg-white border border-slate-200 rounded-md p-6 text-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 capitalize">
            {activeReport.replace('-', ' ')}
          </h3>
          <p className="text-slate-600">
            Reconciles audited daily logs across raw material inwarding, production batches, and branch stock acknowledgements.
          </p>
        </div>
      )}
    </div>
  );
};
