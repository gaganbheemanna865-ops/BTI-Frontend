import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { Coins, Scale, CheckCircle2, AlertTriangle, FileText, ArrowRight, X, Check } from 'lucide-react';
import { SettlementLedgerItem } from '../types';

export const SettlementsView: React.FC = () => {
  const { settlements, disputeSettlement, addToast } = useApp();
  const [providerFilter, setProviderFilter] = useState('All');
  
  // Interactive Dispute Modal state
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [activeDisputeItem, setActiveDisputeItem] = useState<SettlementLedgerItem | null>(null);
  const [ticketId, setTicketId] = useState('');
  const [discrepancyCategory, setDiscrepancyCategory] = useState('Commission Overcharge');
  const [disputeNotes, setDisputeNotes] = useState('');

  const filteredSettlements = settlements.filter(
    (s) => providerFilter === 'All' || s.provider === providerFilter
  );

  const totalGrossSettled = settlements.reduce((sum, s) => sum + s.grossSales, 0);
  const totalCommissions = settlements.reduce((sum, s) => sum + s.commissionDeducted, 0);
  const totalNetExpected = settlements.reduce((sum, s) => sum + s.netExpected, 0);
  const totalActualReceived = settlements.reduce((sum, s) => sum + s.actualBankCredit, 0);
  const totalVariance = totalActualReceived - totalNetExpected;

  const handleOpenDispute = (item: SettlementLedgerItem) => {
    setActiveDisputeItem(item);
    setTicketId(`${item.provider.toUpperCase().slice(0, 4)}-CLAIM-${Math.floor(1000 + Math.random() * 9000)}`);
    setDisputeNotes(`Variance of ₹${Math.abs(item.variance)} noted against merchant bank credit. Payout reference: ${item.bankReferenceNumber}`);
    setDisputeModalOpen(true);
  };

  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDisputeItem || !ticketId) return;

    disputeSettlement(
      activeDisputeItem.id,
      ticketId,
      `${discrepancyCategory} — ${disputeNotes}`
    );

    setDisputeModalOpen(false);
    setActiveDisputeItem(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Coins className="w-5 h-5 text-slate-700" />
            Partner Settlements &amp; Payout Reconciliation Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit aggregator statements (Swiggy, Zomato, Tipplr, Ownly + Rapido, MobiKwik) against bank credits and deductions
          </p>
        </div>

        <span className="text-xs px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded font-medium">
          Reconciliation Cadence: Automated T+1 to Weekly
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Gross Payout Volume"
          value={`₹${totalGrossSettled.toLocaleString()}`}
          subValue="Consolidated statements"
        />
        <MetricCard
          label="Total Aggregator Commission"
          value={`₹${totalCommissions.toLocaleString()}`}
          subValue="~22% avg delivery rate"
        />
        <MetricCard
          label="Actual Bank Credits"
          value={`₹${totalActualReceived.toLocaleString()}`}
          subValue="Received in commercial bank"
        />
        <MetricCard
          label="Settlement Variance"
          value={`₹${totalVariance}`}
          subValue={totalVariance < 0 ? 'Under-credited' : 'Reconciled'}
          trend={totalVariance < 0 ? 'down' : 'up'}
          trendValue={totalVariance < 0 ? 'Shortfall Flagged' : 'Balanced'}
        />
      </div>

      {/* Filter Strip */}
      <div className="bg-white border border-slate-200 rounded p-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium mr-1">Filter Provider / Channel:</span>
        {['All', 'Swiggy', 'Zomato', 'MobiKwik', 'Tipplr', 'Ownly'].map((prov) => (
          <button
            key={prov}
            onClick={() => setProviderFilter(prov)}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              providerFilter === prov
                ? 'bg-slate-900 text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {prov === 'Ownly' ? 'Ownly (by Rapido)' : prov}
          </button>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-3.5 py-2.5">Settlement ID</th>
                <th className="px-3 py-2.5">Provider</th>
                <th className="px-3 py-2.5">Cycle &amp; Payout Date</th>
                <th className="px-3 py-2.5">Outlet</th>
                <th className="px-3 py-2.5 text-right">Gross Sales</th>
                <th className="px-3 py-2.5 text-right">Commission &amp; Fees</th>
                <th className="px-3 py-2.5 text-right">Net Expected</th>
                <th className="px-3 py-2.5 text-right">Bank Credit</th>
                <th className="px-3 py-2.5 text-right">Variance</th>
                <th className="px-3 py-2.5 text-center">Status</th>
                <th className="px-3 py-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredSettlements.map((set) => (
                <tr key={set.id} className="hover:bg-slate-50/75 transition-colors">
                  <td className="px-3.5 py-2.5 font-bold text-slate-900">{set.id}</td>
                  <td className="px-3 py-2.5 font-sans font-semibold text-slate-800">
                    <div>{set.provider}</div>
                    {set.provider === 'Ownly' && (
                      <span className="text-[10px] text-teal-700 font-mono">Fulfilled by Rapido</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600">
                    <div>{set.payoutDate}</div>
                    <div className="text-[10px] text-slate-400 font-sans">{set.settlementCycleDate}</div>
                  </td>
                  <td className="px-3 py-2.5 font-sans font-medium text-slate-800">{set.outletName}</td>
                  <td className="px-3 py-2.5 text-right">₹{set.grossSales.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right text-rose-700">-₹{set.commissionDeducted.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-slate-900">₹{set.netExpected.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-emerald-800">₹{set.actualBankCredit.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right font-bold">
                    <span className={set.variance < 0 ? 'text-rose-600' : 'text-slate-900'}>
                      ₹{set.variance}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center font-sans">
                    <StatusBadge status={set.reconciliationStatus} />
                    {set.disputeTicketId && (
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Ref: {set.disputeTicketId}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center font-sans">
                    {set.variance !== 0 && set.reconciliationStatus !== 'Dispute Lodged' ? (
                      <button
                        onClick={() => handleOpenDispute(set)}
                        className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Raise Dispute
                      </button>
                    ) : set.reconciliationStatus === 'Dispute Lodged' ? (
                      <span className="text-[11px] text-amber-700 font-semibold px-2 py-0.5 bg-amber-50 rounded border border-amber-200">
                        Claim Pending
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-medium">Reconciled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Dispute Modal */}
      {disputeModalOpen && activeDisputeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Raise Settlement Variance Dispute
                </h3>
                <p className="text-[11px] text-slate-500">
                  {activeDisputeItem.provider} · Settlement ID: {activeDisputeItem.id}
                </p>
              </div>
              <button
                onClick={() => setDisputeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitDispute} className="p-4 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 grid grid-cols-3 gap-2 font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block font-sans">Net Expected</span>
                  <span className="font-bold text-slate-900">₹{activeDisputeItem.netExpected.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-sans">Actual Bank Credit</span>
                  <span className="font-bold text-emerald-800">₹{activeDisputeItem.actualBankCredit.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-sans">Variance Amount</span>
                  <span className="font-bold text-rose-700">₹{activeDisputeItem.variance}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Aggregator Merchant Claim / Ticket ID
                </label>
                <input
                  type="text"
                  required
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono bg-white focus:outline-hidden focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Discrepancy Category
                </label>
                <select
                  value={discrepancyCategory}
                  onChange={(e) => setDiscrepancyCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden focus:border-slate-500"
                >
                  <option value="Commission Overcharge">Commission Overcharge (&gt; Contracted Rate)</option>
                  <option value="Uncredited Order Payout">Uncredited Order Payouts</option>
                  <option value="TDS / GST Mismatch">TDS / TCS Tax Withholding Mismatch</option>
                  <option value="Excess Promo Markdown Deduction">Excess Merchant Promo Markdown Deduction</option>
                  <option value="Delayed Bank Credit">Delayed Bank Credit vs Scheduled Cadence</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Dispute Notes &amp; Audit Explanation
                </label>
                <textarea
                  rows={3}
                  required
                  value={disputeNotes}
                  onChange={(e) => setDisputeNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden focus:border-slate-500"
                  placeholder="Provide supporting statement details..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setDisputeModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  Submit Dispute Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
