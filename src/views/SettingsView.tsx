import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, Save, Database, Shield, Clock, AlertTriangle, CreditCard, Building } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { tenant, brand, addToast } = useApp();
  const [cutoffHour, setCutoffHour] = useState('13:00');
  const [priceHikePct, setPriceHikePct] = useState('5.0');
  const [cardFeePct, setCardFeePct] = useState('2.5');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Configuration Updated', 'Enterprise operational thresholds updated across all 9 outlets.');
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-md">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Sliders className="w-5 h-5 text-slate-700" />
          Enterprise Platform Settings & Operational Business Rules
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tenant configurations, reporting cutoffs, price variance sensitivity, and database integration adapters
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-4">
        {/* Tenant Information Card */}
        <div className="bg-white border border-slate-200 rounded p-4 text-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-2">
            <Building className="w-4 h-4 text-slate-600" />
            <span>Multi-Tenant Company Entity Profile</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Company / Tenant Name</label>
              <input
                type="text"
                value={tenant.name}
                readOnly
                className="w-full border border-slate-200 bg-slate-50 rounded p-2 text-xs font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Legal Registered Entity</label>
              <input
                type="text"
                value={tenant.legalEntity}
                readOnly
                className="w-full border border-slate-200 bg-slate-50 rounded p-2 text-xs font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Tenant ID & Tax GSTIN</label>
              <input
                type="text"
                value={`${tenant.id} (${tenant.taxNumber})`}
                readOnly
                className="w-full border border-slate-200 bg-slate-50 rounded p-2 text-xs font-mono text-slate-700"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Active Brand</label>
              <input
                type="text"
                value={`${brand.name} (${brand.cuisine})`}
                readOnly
                className="w-full border border-slate-200 bg-slate-50 rounded p-2 text-xs font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Operational Business Rules */}
        <div className="bg-white border border-slate-200 rounded p-4 text-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-2">
            <Clock className="w-4 h-4 text-slate-600" />
            <span>Operational Cutoffs & Threshold Parameters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Day-End Submission Cutoff
              </label>
              <input
                type="time"
                value={cutoffHour}
                onChange={(e) => setCutoffHour(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs font-mono font-bold bg-white"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Rule: Previous business day due by 1:00 PM on T+1
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Vendor Price Hike Alert Threshold (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={priceHikePct}
                onChange={(e) => setPriceHikePct(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs font-mono font-bold bg-white"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Flags price increase above this % for review
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Premium Card Fee Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={cardFeePct}
                onChange={(e) => setCardFeePct(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs font-mono font-bold bg-white"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Configurable business assumption (2.5% standard)
              </span>
            </div>
          </div>
        </div>

        {/* Supabase Architecture Note */}
        <div className="bg-teal-50 border border-teal-200 rounded p-4 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-teal-950">
            <Database className="w-4 h-4 text-teal-700" />
            <span>Antigravity IDE & Supabase PostgreSQL Migration Readiness</span>
          </div>
          <p className="text-teal-900 text-[11px] leading-relaxed">
            All data entities, identifiers, and repositories are typed with stable identifiers (<code>Tenant</code>, <code>Brand</code>, <code>CentralKitchen</code>, <code>Outlet</code>, <code>ExpenseRecord</code>, <code>OrderRecord</code>, <code>PurchaseInvoice</code>, <code>AttendanceRecord</code>). These will seamlessly map to PostgreSQL schemas with Row Level Security (RLS) when connected to Supabase in Antigravity IDE.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" /> Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};
