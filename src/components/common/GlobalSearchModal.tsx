import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, Building2, Receipt, ShoppingBag, Users, Layers } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    outlets,
    expenses,
    purchases,
    orders,
    employees,
    setActiveScope,
    setActiveModule
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(!searchModalOpen);
      }
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  if (!searchModalOpen) return null;

  const q = query.toLowerCase().trim();

  // Matched entities
  const matchedOutlets = q
    ? outlets.filter((o) => o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q))
    : outlets.slice(0, 3);

  const matchedExpenses = q
    ? expenses.filter(
        (e) =>
          e.voucherNumber.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      )
    : expenses.slice(0, 2);

  const matchedPurchases = q
    ? purchases.filter(
        (p) =>
          p.invoiceNumber.toLowerCase().includes(q) ||
          p.vendorName.toLowerCase().includes(q)
      )
    : purchases.slice(0, 2);

  const matchedOrders = q
    ? orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.channel.toLowerCase().includes(q)
      )
    : orders.slice(0, 2);

  const matchedEmployees = q
    ? employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(q) ||
          emp.role.toLowerCase().includes(q) ||
          emp.employeeCode.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search outlets, invoices, vouchers, orders, employees, modules... (e.g., Indiranagar, Sambar, VCH-)"
            className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden bg-transparent"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
          <button
            onClick={() => setSearchModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 p-2 text-xs">
          {/* Outlets */}
          {matchedOutlets.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-2 uppercase tracking-wider text-[11px]">
                <Building2 className="w-3.5 h-3.5" /> Outlets ({matchedOutlets.length})
              </div>
              <div className="space-y-1">
                {matchedOutlets.map((outlet) => (
                  <button
                    key={outlet.id}
                    onClick={() => {
                      setActiveScope(outlet.id);
                      setActiveModule('outlet-detail');
                      setSearchModalOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-100 text-left transition-colors"
                  >
                    <div>
                      <div className="font-medium text-slate-900">{outlet.name}</div>
                      <div className="text-slate-500 text-[11px] font-mono">{outlet.id} · {outlet.type}</div>
                    </div>
                    <span className="text-slate-400 text-[11px]">Open Outlet →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {matchedOrders.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-2 uppercase tracking-wider text-[11px]">
                <ShoppingBag className="w-3.5 h-3.5" /> Orders ({matchedOrders.length})
              </div>
              <div className="space-y-1">
                {matchedOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => {
                      setActiveModule('kds');
                      setSearchModalOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-100 text-left transition-colors"
                  >
                    <div>
                      <span className="font-medium text-slate-900 font-mono">#{ord.orderNumber}</span>
                      <span className="text-slate-500 ml-2 font-mono">₹{ord.totalAmount}</span>
                      <div className="text-slate-500 text-[11px]">{ord.outletName} · {ord.channel}</div>
                    </div>
                    <span className="text-slate-400 text-[11px]">View KDS →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Expenses & Vouchers */}
          {matchedExpenses.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-2 uppercase tracking-wider text-[11px]">
                <Receipt className="w-3.5 h-3.5" /> Expenses & Vouchers ({matchedExpenses.length})
              </div>
              <div className="space-y-1">
                {matchedExpenses.map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => {
                      setActiveModule('expenses');
                      setSearchModalOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-100 text-left transition-colors"
                  >
                    <div>
                      <span className="font-medium text-slate-900 font-mono">{exp.voucherNumber}</span>
                      <span className="text-slate-500 ml-2 font-mono">₹{exp.amount}</span>
                      <div className="text-slate-500 text-[11px] truncate max-w-md">{exp.category} · {exp.description}</div>
                    </div>
                    <span className="text-slate-400 text-[11px]">View Expenses →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Purchases */}
          {matchedPurchases.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-2 uppercase tracking-wider text-[11px]">
                <Receipt className="w-3.5 h-3.5" /> Invoices & Purchases ({matchedPurchases.length})
              </div>
              <div className="space-y-1">
                {matchedPurchases.map((pur) => (
                  <button
                    key={pur.id}
                    onClick={() => {
                      setActiveModule('purchases');
                      setSearchModalOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-100 text-left transition-colors"
                  >
                    <div>
                      <span className="font-medium text-slate-900 font-mono">{pur.invoiceNumber}</span>
                      <span className="text-slate-500 ml-2 font-mono">₹{pur.totalAmount.toLocaleString()}</span>
                      <div className="text-slate-500 text-[11px]">{pur.vendorName}</div>
                    </div>
                    <span className="text-slate-400 text-[11px]">View Purchases →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Employees */}
          {matchedEmployees.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-2 uppercase tracking-wider text-[11px]">
                <Users className="w-3.5 h-3.5" /> Employees ({matchedEmployees.length})
              </div>
              <div className="space-y-1">
                {matchedEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setActiveModule('employees');
                      setSearchModalOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-100 text-left transition-colors"
                  >
                    <div>
                      <div className="font-medium text-slate-900">{emp.name}</div>
                      <div className="text-slate-500 text-[11px]">{emp.role} · {emp.employeeCode}</div>
                    </div>
                    <span className="text-slate-400 text-[11px]">Staff Profile →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Module Jump */}
          <div className="p-2 bg-slate-50/50">
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
              <Layers className="w-3.5 h-3.5" /> Quick Operations Modules
            </div>
            <div className="flex flex-wrap gap-1">
              {[
                { name: 'Consolidated Dashboard', id: 'dashboard' },
                { name: 'Central Kitchen', id: 'central-kitchen' },
                { name: 'Order KDS', id: 'kds' },
                { name: 'Settlement Ledger', id: 'settlements' },
                { name: 'P&L Reports', id: 'reports-pnl' },
                { name: 'Price Hike Alerts', id: 'purchases' },
                { name: 'Daily Wages', id: 'daily-wages' }
              ].map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => {
                    setActiveModule(mod.id);
                    setSearchModalOpen(false);
                  }}
                  className="px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-[11px] transition-colors"
                >
                  {mod.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] flex justify-between items-center">
          <span>Navigate with mouse or keyboard</span>
          <span className="font-mono">DEMO DATABASE SCOPE: BIT</span>
        </div>
      </div>
    </div>
  );
};
