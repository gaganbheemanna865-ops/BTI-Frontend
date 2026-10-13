import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Store,
  Phone,
  MapPin,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  Banknote,
  Receipt,
  Users,
  MonitorCheck,
  Truck,
  Layers,
  ArrowLeft,
  FileText
} from 'lucide-react';

export const OutletDetailView: React.FC = () => {
  const {
    outlets,
    activeScope,
    setActiveScope,
    setActiveModule,
    expenses,
    orders,
    employees,
    cashReconciliations,
    triggerDayEndSubmit,
    setUploadModalOpen,
    setUploadContext,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('overview');

  // Fallback to first outlet if activeScope is not an outlet ID
  const outlet = outlets.find((o) => o.id === activeScope) || outlets[0];

  // Scoped records
  const outletExpenses = expenses.filter((e) => e.outletId === outlet.id);
  const outletOrders = orders.filter((o) => o.outletId === outlet.id);
  const outletEmployees = employees.filter((e) => e.outletId === outlet.id);
  const outletCashRec = cashReconciliations.find((c) => c.outletId === outlet.id);

  const totalOutletExpenses = outletExpenses.reduce((sum, e) => sum + e.amount, 0);

  const tabs = [
    { id: 'overview', label: '1. Overview' },
    { id: 'sales-orders', label: '2. Sales & Orders' },
    { id: 'cash-upi', label: '3. Cash & UPI Drawer' },
    { id: 'expenses-petty', label: '4. Expenses & Petty Cash' },
    { id: 'workforce', label: '5. Employees & Wages' },
    { id: 'stock', label: '6. Stock Received & Waste' },
    { id: 'kds', label: '7. Outlet KDS' },
    { id: 'day-end', label: '8. Day-End Audit (1 PM)' },
    { id: 'kpis', label: '9. Outlet KPIs' }
  ];

  return (
    <div className="space-y-5">
      {/* Outlet Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => {
                  setActiveScope('consolidated');
                  setActiveModule('dashboard');
                }}
                className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Consolidated
              </button>
              <span className="text-slate-300">·</span>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-100 text-slate-700">
                {outlet.id}
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-medium bg-teal-50 text-teal-800 border border-teal-200">
                {outlet.type}
              </span>
            </div>

            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              {outlet.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {outlet.address}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                Branch Manager: <strong className="text-slate-700">{outlet.managerName}</strong> ({outlet.phone})
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {outlet.dayEndStatus === 'Pending Cutoff' && (
              <button
                onClick={() => triggerDayEndSubmit(outlet.id)}
                className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <CalendarCheck className="w-3.5 h-3.5" /> Submit Day-End (1 PM Cutoff)
              </button>
            )}

            <button
              onClick={() => {
                setUploadContext('expense');
                setUploadModalOpen(true);
              }}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> Add Petty Expense
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Today's Gross Sales"
          value={`₹${outlet.grossSalesToday.toLocaleString()}`}
          subValue="Counter + Online"
          trend="up"
          trendValue="+8.2%"
        />
        <MetricCard
          label="Net Sales"
          value={`₹${outlet.netSalesToday.toLocaleString()}`}
          subValue="After discounts & GST"
        />
        <MetricCard
          label="Today's Expenses"
          value={`₹${outlet.expensesToday.toLocaleString()}`}
          subValue="Petty + Disposables"
        />
        <MetricCard
          label="Food Cost %"
          value={`${outlet.foodCostPct}%`}
          subValue="Target: <30%"
          trend={outlet.foodCostPct > 30 ? 'down' : 'up'}
          trendValue="Healthy"
        />
        <MetricCard
          label="Cash Variance"
          value={`₹${outlet.cashVariance}`}
          subValue="Drawer count"
          trend={outlet.cashVariance < 0 ? 'down' : 'neutral'}
          trendValue={outlet.cashVariance < 0 ? 'Shortage!' : 'Balanced'}
        />
        <MetricCard
          label="1:00 PM Day-End"
          value={outlet.dayEndStatus}
          subValue={outlet.cutoffTime}
          trend={outlet.dayEndStatus === 'Completed' ? 'up' : 'down'}
          trendValue={outlet.dayEndStatus === 'Completed' ? 'Compliant' : 'Due 1 PM'}
        />
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-md p-1.5 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max text-xs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap font-medium ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recent Orders in this outlet */}
          <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Active Live Orders at {outlet.name}
              </h3>
              <button
                onClick={() => setActiveTab('kds')}
                className="text-xs text-teal-800 hover:underline font-medium"
              >
                Launch KDS →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {outletOrders.length > 0 ? (
                outletOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between font-mono"
                  >
                    <div>
                      <div className="font-bold text-slate-900 font-sans">
                        #{ord.orderNumber} · {ord.channel}
                      </div>
                      <div className="text-[11px] text-slate-500 font-sans">
                        {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">₹{ord.totalAmount}</div>
                      <StatusBadge status={ord.status} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400 text-xs">
                  No active orders in preparation queue right now.
                </div>
              )}
            </div>
          </div>

          {/* Cash Drawer Status */}
          <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Counter Cash Reconciliation Status
              </h3>
              <StatusBadge status={outletCashRec?.status || 'Balanced'} />
            </div>

            {outletCashRec ? (
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between p-2 bg-slate-50 rounded">
                  <span className="font-sans text-slate-600">Opening Cash Float</span>
                  <span className="font-bold text-slate-900">₹{outletCashRec.openingCash}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 rounded">
                  <span className="font-sans text-slate-600">Recorded Cash Sales</span>
                  <span className="font-bold text-slate-900">₹{outletCashRec.recordedCashSales}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 rounded">
                  <span className="font-sans text-slate-600">Expected in Drawer</span>
                  <span className="font-bold text-slate-900">₹{outletCashRec.expectedCashInDrawer}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 rounded">
                  <span className="font-sans text-slate-600">Actual Physically Counted</span>
                  <span className="font-bold text-slate-900">₹{outletCashRec.actualCountedCash}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-100 rounded font-sans">
                  <span className="font-semibold text-slate-700">Cash Variance</span>
                  <span className={`font-mono font-bold ${outletCashRec.varianceAmount < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                    ₹{outletCashRec.varianceAmount}
                  </span>
                </div>
                {outletCashRec.explanation && (
                  <p className="text-[11px] text-slate-500 font-sans italic pt-1">
                    Note: &quot;{outletCashRec.explanation}&quot;
                  </p>
                )}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded text-xs text-slate-500">
                Opening cash float of ₹5,000 verified for today shift. Counter cash balanced.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Sales & Orders */}
      {activeTab === 'sales-orders' && (
        <div className="bg-white border border-slate-200 rounded p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Individual Orders at {outlet.name}</h3>
              <p className="text-xs text-slate-500">Breakdown across Counter Cash, UPI, Swiggy, and Zomato</p>
            </div>
            <button
              onClick={() => setActiveModule('sales')}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded text-xs font-medium text-slate-700"
            >
              Open Full Sales Register →
            </button>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-3 py-2">Order #</th>
                <th className="px-3 py-2">Channel</th>
                <th className="px-3 py-2">Items</th>
                <th className="px-3 py-2 text-right">Gross Total</th>
                <th className="px-3 py-2 text-right">Fee / Card Deduct</th>
                <th className="px-3 py-2 text-right">Net Expected</th>
                <th className="px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {outletOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-bold text-slate-900">#{ord.orderNumber}</td>
                  <td className="px-3 py-2.5 font-sans font-medium text-slate-800">{ord.channel}</td>
                  <td className="px-3 py-2.5 font-sans text-slate-600">
                    {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold">₹{ord.totalAmount}</td>
                  <td className="px-3 py-2.5 text-right text-slate-500">₹{ord.channelFeeDeducted}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-slate-900">₹{ord.netSettlementExpected}</td>
                  <td className="px-3 py-2.5 text-center font-sans">
                    <StatusBadge status={ord.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Expenses & Petty Cash */}
      {activeTab === 'expenses-petty' && (
        <div className="bg-white border border-slate-200 rounded p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Branch Expenses & Petty Vouchers</h3>
              <p className="text-xs text-slate-500">Vouchers attributable strictly to {outlet.id}</p>
            </div>
            <button
              onClick={() => {
                setUploadContext('expense');
                setUploadModalOpen(true);
              }}
              className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium"
            >
              + Log New Voucher (OCR)
            </button>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-3 py-2">Voucher #</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {outletExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-bold text-slate-900">{exp.voucherNumber}</td>
                  <td className="px-3 py-2.5 text-slate-600">{exp.date}</td>
                  <td className="px-3 py-2.5 font-sans font-medium text-slate-800">{exp.category}</td>
                  <td className="px-3 py-2.5 font-sans text-slate-600">{exp.description}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-slate-900">₹{exp.amount.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-center font-sans">
                    <StatusBadge status={exp.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Remaining Tabs */}
      {['cash-upi', 'workforce', 'stock', 'kds', 'day-end', 'kpis'].includes(activeTab) && (
        <div className="bg-white border border-slate-200 rounded p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 capitalize">
                {outlet.name}: {activeTab.replace('-', ' ')}
              </h3>
              <p className="text-xs text-slate-500">
                Operational records scoped to {outlet.id}
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-100 text-slate-700">
              {outlet.id} SCOPE
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-3">
            <p className="text-slate-700">
              Viewing dedicated branch operations for <strong>{outlet.name}</strong>. Data filtered strictly to outlet ID <code>{outlet.id}</code>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="text-slate-500 text-[11px]">Assigned Staff</span>
                <div className="text-sm font-bold text-slate-900 font-mono mt-1">
                  {outletEmployees.length > 0 ? `${outletEmployees.length} active staff` : '6 rostered staff'}
                </div>
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="text-slate-500 text-[11px]">1:00 PM Reporting Cutoff</span>
                <div className="text-sm font-bold text-slate-900 font-mono mt-1">
                  {outlet.dayEndStatus} ({outlet.cutoffTime})
                </div>
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="text-slate-500 text-[11px]">Central Kitchen Link</span>
                <div className="text-sm font-bold text-teal-800 font-mono mt-1">
                  Connected (Route B)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
