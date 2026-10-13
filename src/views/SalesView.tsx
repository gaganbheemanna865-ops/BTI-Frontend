import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Banknote,
  Scale,
  CreditCard,
  Zap,
  ShoppingBag,
  Store,
  Filter,
  DollarSign,
  ArrowRight,
  Eye,
  Plus,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { OrderRecord, SalesChannel } from '../types';

export const SalesView: React.FC = () => {
  const {
    orders,
    outlets,
    cashReconciliations,
    reconcileCash,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'consolidated' | 'cash-reconciliation' | 'offline' | 'online' | 'catering'>('consolidated');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [outletFilter, setOutletFilter] = useState<string>('All');
  const [channelFilter, setChannelFilter] = useState<string>('All');
  
  // New Cash Reconciliation Modal state
  const [reconcileModalOpen, setReconcileModalOpen] = useState(false);
  const [recOutletId, setRecOutletId] = useState(outlets[0].id);
  const [recDate, setRecDate] = useState('2026-10-09');
  const [recOpening, setRecOpening] = useState('5000');
  const [recCashSales, setRecCashSales] = useState('42000');
  const [recNonCash, setRecNonCash] = useState('85000');
  const [recRefunds, setRecRefunds] = useState('0');
  const [recActualCash, setRecActualCash] = useState('47000');
  const [recBankDeposit, setRecBankDeposit] = useState('42000');
  const [recSlipNumber, setRecSlipNumber] = useState('HDFC-DEP-99120');
  const [recExplanation, setRecExplanation] = useState('Daily register closed, balanced with shift slip');

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesOutlet = outletFilter === 'All' || o.outletId === outletFilter;
    const matchesChannel = channelFilter === 'All' || o.channel === channelFilter;
    if (activeTab === 'offline') return matchesOutlet && !o.isOnline && o.orderType !== 'Catering';
    if (activeTab === 'online') return matchesOutlet && o.isOnline;
    if (activeTab === 'catering') return matchesOutlet && o.orderType === 'Catering';
    return matchesOutlet && matchesChannel;
  });

  const totalGrossSales = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalDeductions = filteredOrders.reduce((sum, o) => sum + o.channelFeeDeducted, 0);
  const totalNetExpected = filteredOrders.reduce((sum, o) => sum + o.netSettlementExpected, 0);

  const handleSaveReconciliation = (e: React.FormEvent) => {
    e.preventDefault();
    const opening = parseFloat(recOpening) || 0;
    const cashSales = parseFloat(recCashSales) || 0;
    const refunds = parseFloat(recRefunds) || 0;
    const actual = parseFloat(recActualCash) || 0;
    const nonCash = parseFloat(recNonCash) || 0;
    const deposited = parseFloat(recBankDeposit) || 0;

    const expectedInDrawer = opening + cashSales - refunds;
    const variance = actual - expectedInDrawer;

    const selectedOut = outlets.find((o) => o.id === recOutletId) || outlets[0];

    reconcileCash({
      date: recDate,
      outletId: selectedOut.id,
      outletName: selectedOut.name,
      openingCash: opening,
      recordedCashSales: cashSales,
      verifiedNonCashSales: nonCash,
      refundsAndAdjustments: refunds,
      expectedCashInDrawer: expectedInDrawer,
      actualCountedCash: actual,
      varianceAmount: variance,
      cashDepositedToBank: deposited,
      bankDepositSlipNumber: recSlipNumber,
      explanation: recExplanation,
      verifiedBy: `${selectedOut.managerName} (Manager)`,
      status: variance === 0 ? 'Balanced' : 'Variance Approved'
    });

    setReconcileModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Banknote className="w-5 h-5 text-slate-700" />
            Consolidated Sales, Channels & Cash Reconciliation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Offline counter (Cash, UPI, Builder POS, MobiKwik) and Online (Swiggy, Zomato, Tipplr, Ownly with Rapido delivery, Catering)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setReconcileModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors shadow-xs"
          >
            <Scale className="w-3.5 h-3.5" />
            Reconcile Cash Drawer
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Gross Filtered Sales"
          value={`₹${totalGrossSales.toLocaleString()}`}
          subValue={`${filteredOrders.length} active orders`}
          trend="up"
          trendValue="+9.4%"
        />
        <MetricCard
          label="Aggregator & Card Fees"
          value={`₹${totalDeductions.toLocaleString()}`}
          subValue="Commissions & 2.5% card"
          trend="down"
          trendValue="Reconciled"
        />
        <MetricCard
          label="Net Settlement Expected"
          value={`₹${totalNetExpected.toLocaleString()}`}
          subValue="After platform deductions"
          trend="up"
          trendValue="Payable"
        />
        <MetricCard
          label="Cash Shortage Flagged"
          value="₹-350"
          subValue="Koramangala 5th Block"
          trend="down"
          trendValue="Shortage note verified"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-md p-1.5 flex items-center gap-1 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('consolidated')}
          className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap ${
            activeTab === 'consolidated' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Consolidated Sales & Orders
        </button>
        <button
          onClick={() => setActiveTab('cash-reconciliation')}
          className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'cash-reconciliation' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          Cash Drawer Reconciliation ({cashReconciliations.length})
        </button>
        <button
          onClick={() => setActiveTab('offline')}
          className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap ${
            activeTab === 'offline' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Offline (Counter, UPI, POS, Card)
        </button>
        <button
          onClick={() => setActiveTab('online')}
          className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap ${
            activeTab === 'online' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Online (Swiggy, Zomato, Tipplr, Ownly + Rapido)
        </button>
        <button
          onClick={() => setActiveTab('catering')}
          className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap ${
            activeTab === 'catering' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Catering Sales (Future Capable)
        </button>
      </div>

      {/* TAB: Consolidated Orders Table */}
      {['consolidated', 'offline', 'online', 'catering'].includes(activeTab) && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded p-3 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Outlet:</span>
              <select
                value={outletFilter}
                onChange={(e) => setOutletFilter(e.target.value)}
                className="border border-slate-200 rounded px-2 py-1 bg-white text-slate-800 focus:outline-hidden"
              >
                <option value="All">All 9 Outlets</option>
                {outlets.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} - {o.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Channel:</span>
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="border border-slate-200 rounded px-2 py-1 bg-white text-slate-800 focus:outline-hidden"
              >
                <option value="All">All Channels</option>
                <option value="Counter Cash">Counter Cash</option>
                <option value="Quick UPI">Quick UPI</option>
                <option value="Builder POS">Builder POS</option>
                <option value="MobiKwik">MobiKwik</option>
                <option value="Swiggy">Swiggy</option>
                <option value="Zomato">Zomato</option>
                <option value="Ownly">Ownly (Delivery by Rapido)</option>
                <option value="Tipplr">Tipplr</option>
              </select>
            </div>

            <button
              onClick={() => {
                setOutletFilter('All');
                setChannelFilter('All');
              }}
              className="text-slate-500 hover:text-slate-800 text-[11px] underline ml-auto"
            >
              Reset Filters
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="px-3.5 py-2.5">Order ID</th>
                    <th className="px-3 py-2.5">Outlet</th>
                    <th className="px-3 py-2.5">Channel</th>
                    <th className="px-3 py-2.5">Type</th>
                    <th className="px-3 py-2.5">Items Particulars</th>
                    <th className="px-3 py-2.5 text-right">Gross Total</th>
                    <th className="px-3 py-2.5 text-right">Channel Fee Deduct</th>
                    <th className="px-3 py-2.5 text-right">Net Settlement</th>
                    <th className="px-3 py-2.5 text-center">Status</th>
                    <th className="px-3 py-2.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/75 transition-colors">
                      <td className="px-3.5 py-2.5 font-bold text-slate-900">
                        #{ord.orderNumber}
                      </td>
                      <td className="px-3 py-2.5 font-sans font-medium text-slate-800">
                        {ord.outletName}
                      </td>
                      <td className="px-3 py-2.5 font-sans">
                        <span className="font-medium text-slate-900">{ord.channel}</span>
                        {ord.paymentMethod.includes('2.5%') && (
                          <span className="block text-[10px] text-amber-700">2.5% card fee applied</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 font-sans text-slate-600">
                        {ord.orderType}
                      </td>
                      <td className="px-3 py-2.5 font-sans text-slate-600 max-w-xs truncate">
                        {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-slate-900 tabular-nums">
                        ₹{ord.totalAmount}
                      </td>
                      <td className="px-3 py-2.5 text-right text-slate-500 tabular-nums">
                        ₹{ord.channelFeeDeducted}
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-emerald-800 tabular-nums">
                        ₹{ord.netSettlementExpected}
                      </td>
                      <td className="px-3 py-2.5 text-center font-sans">
                        <StatusBadge status={ord.status} />
                      </td>
                      <td className="px-3 py-2.5 text-center font-sans">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Dedicated Cash Reconciliation Screen */}
      {activeTab === 'cash-reconciliation' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded p-4 text-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Cash In Drawer vs Bank Deposit Reconciliation Audit
            </h3>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Distinguishes point-of-sale cash collected at the counter from subsequent physical cash deposits into the commercial bank account. Ensures zero unaccounted cash leakages.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="px-3.5 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Outlet Name</th>
                  <th className="px-3 py-2.5 text-right">Opening Cash</th>
                  <th className="px-3 py-2.5 text-right">Counter Cash Sales</th>
                  <th className="px-3 py-2.5 text-right">Expected in Drawer</th>
                  <th className="px-3 py-2.5 text-right">Counted Cash</th>
                  <th className="px-3 py-2.5 text-right">Variance</th>
                  <th className="px-3 py-2.5 text-right">Bank Deposit Slip</th>
                  <th className="px-3 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {cashReconciliations.map((cr) => (
                  <tr key={cr.id} className="hover:bg-slate-50">
                    <td className="px-3.5 py-2.5 text-slate-600">{cr.date}</td>
                    <td className="px-3 py-2.5 font-sans font-semibold text-slate-900">{cr.outletName}</td>
                    <td className="px-3 py-2.5 text-right">₹{cr.openingCash.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-slate-900">₹{cr.recordedCashSales.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right text-slate-600">₹{cr.expectedCashInDrawer.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-slate-900">₹{cr.actualCountedCash.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={`font-bold ${cr.varianceAmount < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                        ₹{cr.varianceAmount}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-600">
                      ₹{cr.cashDepositedToBank.toLocaleString()} ({cr.bankDepositSlipNumber || 'Pending'})
                    </td>
                    <td className="px-3 py-2.5 text-center font-sans">
                      <StatusBadge status={cr.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cash Reconciliation Entry Modal */}
      {reconcileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-lg p-5 text-xs space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Submit Outlet Cash Drawer Audit
              </h3>
              <p className="text-slate-500 text-xs">Verify cash count against POS day-end summary</p>
            </div>

            <form onSubmit={handleSaveReconciliation} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Audit Date</label>
                  <input
                    type="date"
                    value={recDate}
                    onChange={(e) => setRecDate(e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Outlet</label>
                  <select
                    value={recOutletId}
                    onChange={(e) => setRecOutletId(e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 text-xs bg-white"
                  >
                    {outlets.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id} - {o.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Opening Cash Float (₹)</label>
                  <input
                    type="number"
                    value={recOpening}
                    onChange={(e) => setRecOpening(e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 text-xs font-mono bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Recorded Counter Cash (₹)</label>
                  <input
                    type="number"
                    value={recCashSales}
                    onChange={(e) => setRecCashSales(e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 text-xs font-mono bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Verified Non-Cash Sales (₹)</label>
                  <input
                    type="number"
                    value={recNonCash}
                    onChange={(e) => setRecNonCash(e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 text-xs font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Physically Counted Cash (₹)</label>
                  <input
                    type="number"
                    value={recActualCash}
                    onChange={(e) => setRecActualCash(e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 text-xs font-mono font-bold bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Cash Deposited to Bank (₹)</label>
                  <input
                    type="number"
                    value={recBankDeposit}
                    onChange={(e) => setRecBankDeposit(e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 text-xs font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Bank Deposit Slip #</label>
                  <input
                    type="text"
                    value={recSlipNumber}
                    onChange={(e) => setRecSlipNumber(e.target.value)}
                    placeholder="e.g. ICICI-DEP-892"
                    className="w-full border border-slate-300 rounded p-1.5 text-xs font-mono bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Shift Explanation / Notes</label>
                <textarea
                  value={recExplanation}
                  onChange={(e) => setRecExplanation(e.target.value)}
                  rows={2}
                  className="w-full border border-slate-300 rounded p-1.5 text-xs bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReconcileModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded text-xs text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-medium"
                >
                  Submit Cash Reconciliation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-md p-5 text-xs space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <div>
                <span className="font-mono text-slate-500 font-semibold">#{selectedOrder.orderNumber}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedOrder.outletName}</h3>
                <span className="text-slate-500">{selectedOrder.channel} · {selectedOrder.timestamp}</span>
              </div>
              <StatusBadge status={selectedOrder.status} />
            </div>

            <div className="space-y-2 border border-slate-200 rounded p-3 bg-slate-50">
              <span className="font-semibold text-slate-800">Order Items:</span>
              <div className="divide-y divide-slate-200 font-mono">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="py-1.5 flex justify-between">
                    <span className="font-sans text-slate-800">{item.quantity}x {item.name}</span>
                    <span className="font-bold">₹{item.quantity * item.unitPrice}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="font-sans text-slate-600">Subtotal:</span>
                <span>₹{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-600">Taxes:</span>
                <span>₹{selectedOrder.tax}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-600">Gross Amount:</span>
                <span className="font-bold text-slate-900">₹{selectedOrder.totalAmount}</span>
              </div>
              <div className="flex justify-between text-rose-700">
                <span className="font-sans">Channel / Card Fee Deducted:</span>
                <span>-₹{selectedOrder.channelFeeDeducted}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900 text-sm">
                <span className="font-sans">Net Payout Expected:</span>
                <span>₹{selectedOrder.netSettlementExpected}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
