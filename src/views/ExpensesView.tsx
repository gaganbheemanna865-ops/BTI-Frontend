import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Receipt,
  UploadCloud,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  FileText,
  AlertTriangle,
  Eye,
  Check
} from 'lucide-react';
import { ExpenseRecord, ExpenseCategory, CostCenterType } from '../types';

export const ExpensesView: React.FC = () => {
  const {
    expenses,
    outlets,
    approveExpense,
    rejectExpense,
    addExpense,
    setUploadModalOpen,
    setUploadContext,
    activeScope
  } = useApp();

  const [costCenterFilter, setCostCenterFilter] = useState<string>('All');
  const [outletFilter, setOutletFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [manualEntryOpen, setManualEntryOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<ExpenseRecord | null>(null);

  // Manual entry state
  const [manualDate, setManualDate] = useState('2026-10-09');
  const [manualCostCenter, setManualCostCenter] = useState<CostCenterType>('Branch Outlet Expenses');
  const [manualOutletId, setManualOutletId] = useState(outlets[0].id);
  const [manualCategory, setManualCategory] = useState<ExpenseCategory>('Outlet grocery needs and petty expenses');
  const [manualAmount, setManualAmount] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualPaidTo, setManualPaidTo] = useState('');
  const [manualMethod, setManualMethod] = useState<'Cash' | 'Bank Transfer' | 'UPI' | 'Petty Cash'>('Petty Cash');

  // Filtered expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesCostCenter =
      costCenterFilter === 'All' || e.costCenter === costCenterFilter;
    const matchesOutlet =
      outletFilter === 'All' || e.outletId === outletFilter;
    const matchesCategory =
      categoryFilter === 'All' || e.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'All' || e.status === statusFilter;
    return matchesCostCenter && matchesOutlet && matchesCategory && matchesStatus;
  });

  const totalExpenseAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingApprovalsCount = expenses.filter((e) => e.status === 'Pending Approval').length;

  const handleCreateManualExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAmount || !manualDescription) return;

    addExpense({
      date: manualDate,
      costCenter: manualCostCenter,
      outletId: manualCostCenter === 'Branch Outlet Expenses' ? manualOutletId : undefined,
      centralKitchenId: manualCostCenter === 'Central Kitchen Expenses' ? 'BIT-CK-001' : undefined,
      category: manualCategory,
      description: manualDescription,
      amount: parseFloat(manualAmount),
      paymentMethod: manualMethod,
      paidTo: manualPaidTo || 'Counter Vendor',
      status: 'Pending Approval'
    });

    setManualEntryOpen(false);
    setManualAmount('');
    setManualDescription('');
    setManualPaidTo('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-slate-700" />
            Expense Management & Petty Cash Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Classified under Central Kitchen Expenses vs Branch Outlet Expenses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setUploadContext('expense');
              setUploadModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload PDF / Bill (OCR Inbox)
          </button>
          <button
            onClick={() => setManualEntryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Manual Entry
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Total Filtered Expenses"
          value={`₹${totalExpenseAmount.toLocaleString()}`}
          subValue={`${filteredExpenses.length} vouchers`}
        />
        <MetricCard
          label="Pending Approvals"
          value={pendingApprovalsCount}
          subValue="Requires Manager/Accountant signoff"
          trend={pendingApprovalsCount > 0 ? 'down' : 'up'}
          trendValue={pendingApprovalsCount > 0 ? 'Action Queue' : 'All Cleared'}
        />
        <MetricCard
          label="Cost Center Breakdown"
          value="2 Cost Centers"
          subValue="CK Logistics + 9 Branches"
        />
        <MetricCard
          label="1:00 PM Reporting Cutoff"
          value="Enforced"
          subValue="Previous day ledger audited"
          trend="up"
          trendValue="Compliant"
        />
      </div>

      {/* 1:00 PM Reporting Cutoff Notice Banner */}
      <div className="bg-amber-50/70 border border-amber-200 rounded p-3 text-xs flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-900">
              Operational Reporting Cutoff Policy: 1:00 PM on T+1
            </span>
            <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
              All branch outlet grocery petty vouchers, maintenance bills, and delivery receipts for the previous business day must be uploaded and approved before 1:00 PM. Missing submissions flag an operational warning on the management dashboard.
            </p>
          </div>
        </div>
        <span className="font-mono text-[11px] font-semibold text-amber-900 shrink-0">
          CUTOFF: 13:00 HRS
        </span>
      </div>

      {/* Filters Strip */}
      <div className="bg-white border border-slate-200 rounded-md p-3 flex flex-wrap items-center gap-3 text-xs">
        {/* Cost Center Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Cost Center:</span>
          <select
            value={costCenterFilter}
            onChange={(e) => setCostCenterFilter(e.target.value)}
            className="border border-slate-200 rounded px-2 py-1 bg-white text-slate-800 focus:outline-hidden"
          >
            <option value="All">All Cost Centers</option>
            <option value="Central Kitchen Expenses">Central Kitchen Expenses</option>
            <option value="Branch Outlet Expenses">Branch Outlet Expenses</option>
          </select>
        </div>

        {/* Branch Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Outlet:</span>
          <select
            value={outletFilter}
            onChange={(e) => setOutletFilter(e.target.value)}
            className="border border-slate-200 rounded px-2 py-1 bg-white text-slate-800 focus:outline-hidden"
          >
            <option value="All">All Outlets</option>
            {outlets.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id} - {o.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Approval Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded px-2 py-1 bg-white text-slate-800 focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button
          onClick={() => {
            setCostCenterFilter('All');
            setOutletFilter('All');
            setCategoryFilter('All');
            setStatusFilter('All');
          }}
          className="text-slate-500 hover:text-slate-800 text-[11px] underline ml-auto"
        >
          Reset Filters
        </button>
      </div>

      {/* Expenses Table */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-3.5 py-2.5">Voucher #</th>
                <th className="px-3 py-2.5">Date</th>
                <th className="px-3 py-2.5">Cost Center & Outlet</th>
                <th className="px-3 py-2.5">Category</th>
                <th className="px-3 py-2.5">Description</th>
                <th className="px-3 py-2.5 text-right">Amount</th>
                <th className="px-3 py-2.5 text-center">Source Doc / OCR</th>
                <th className="px-3 py-2.5 text-center">Status</th>
                <th className="px-3 py-2.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredExpenses.map((expense) => {
                const outletInfo = outlets.find((o) => o.id === expense.outletId);

                return (
                  <tr key={expense.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="px-3.5 py-2.5 font-bold text-slate-900">
                      {expense.voucherNumber}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">
                      {expense.date}
                    </td>
                    <td className="px-3 py-2.5 font-sans">
                      <div className="font-semibold text-slate-900 text-xs">
                        {expense.costCenter === 'Central Kitchen Expenses'
                          ? 'Central Kitchen (BIT-CK-001)'
                          : `${outletInfo?.name || expense.outletId}`}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {expense.costCenter}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-sans font-medium text-slate-800">
                      {expense.category}
                    </td>
                    <td className="px-3 py-2.5 font-sans text-slate-600 max-w-xs truncate">
                      {expense.description}
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold text-slate-900 tabular-nums">
                      ₹{expense.amount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-center font-sans">
                      {expense.sourceDocument ? (
                        <button
                          onClick={() => setSelectedVoucher(expense)}
                          className="inline-flex items-center gap-1 text-[11px] text-teal-800 hover:underline"
                        >
                          <FileText className="w-3 h-3 text-teal-600" />
                          <span>{expense.sourceDocument.ocrType}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Manual Entry</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center font-sans">
                      <StatusBadge status={expense.status} />
                    </td>
                    <td className="px-3 py-2.5 text-center font-sans">
                      <div className="flex items-center justify-center gap-1">
                        {expense.status === 'Pending Approval' ? (
                          <>
                            <button
                              onClick={() => approveExpense(expense.id)}
                              className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                              title="Approve Voucher"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => rejectExpense(expense.id)}
                              className="p-1 text-rose-700 hover:bg-rose-50 rounded"
                              title="Reject Voucher"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setSelectedVoucher(expense)}
                            className="p-1 text-slate-500 hover:bg-slate-100 rounded"
                            title="View Voucher Particulars"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {manualEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Record Manual Expense Voucher</h3>
              <button
                onClick={() => setManualEntryOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualExpense} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Expense Date</label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono font-semibold bg-white focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Cost Center</label>
                <select
                  value={manualCostCenter}
                  onChange={(e) => setManualCostCenter(e.target.value as CostCenterType)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden"
                >
                  <option value="Branch Outlet Expenses">Branch Outlet Expenses</option>
                  <option value="Central Kitchen Expenses">Central Kitchen Expenses</option>
                </select>
              </div>

              {manualCostCenter === 'Branch Outlet Expenses' && (
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Outlet Assignment</label>
                  <select
                    value={manualOutletId}
                    onChange={(e) => setManualOutletId(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden"
                  >
                    {outlets.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id} - {o.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-600 font-medium mb-1">Category</label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as ExpenseCategory)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden"
                >
                  <option value="Outlet grocery needs and petty expenses">Outlet grocery needs and petty expenses</option>
                  <option value="Transport">Transport</option>
                  <option value="Water">Water</option>
                  <option value="Worker convenience">Worker convenience</option>
                  <option value="Repairs and maintenance">Repairs and maintenance</option>
                  <option value="Parcels and disposables">Parcels and disposables</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Outlet rent">Outlet rent</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Description / Particulars</label>
                <input
                  type="text"
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  placeholder="e.g. Emergency ice blocks and ginger purchase"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Paid To</label>
                  <input
                    type="text"
                    value={manualPaidTo}
                    onChange={(e) => setManualPaidTo(e.target.value)}
                    placeholder="Merchant or Vendor name"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Payment Method</label>
                  <select
                    value={manualMethod}
                    onChange={(e) => setManualMethod(e.target.value as any)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden"
                  >
                    <option value="Petty Cash">Petty Cash</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setManualEntryOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium"
                >
                  Save Voucher to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Voucher Detail Drawer */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-lg p-5 text-xs space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <div>
                <span className="font-mono text-slate-500 font-semibold">{selectedVoucher.voucherNumber}</span>
                <h3 className="text-sm font-bold text-slate-900">{selectedVoucher.category}</h3>
              </div>
              <StatusBadge status={selectedVoucher.status} />
            </div>

            <div className="space-y-2 font-mono">
              <div className="flex justify-between p-2 bg-slate-50 rounded">
                <span className="font-sans text-slate-600">Amount</span>
                <span className="font-bold text-slate-900 text-sm">₹{selectedVoucher.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded font-sans">
                <span className="text-slate-600">Cost Center</span>
                <span className="font-semibold text-slate-900">{selectedVoucher.costCenter}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded font-sans">
                <span className="text-slate-600">Paid To</span>
                <span className="text-slate-800">{selectedVoucher.paidTo}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded font-sans">
                <span className="text-slate-600">Payment Mode</span>
                <span className="text-slate-800">{selectedVoucher.paymentMethod}</span>
              </div>
              {selectedVoucher.sourceDocument && (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded text-teal-900 font-sans space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Source Document OCR Verified
                  </div>
                  <div className="text-[11px] text-teal-800">
                    File: {selectedVoucher.sourceDocument.fileName} ({selectedVoucher.sourceDocument.fileSize})
                  </div>
                  <div className="text-[11px] text-teal-800">
                    OCR Mode: {selectedVoucher.sourceDocument.ocrType} · Confidence: {(selectedVoucher.sourceDocument.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedVoucher(null)}
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
