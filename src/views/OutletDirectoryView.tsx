import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { Store, Search, Filter, ArrowRight, MapPin, Phone, Users } from 'lucide-react';

export const OutletDirectoryView: React.FC = () => {
  const { outlets, setActiveScope, setActiveModule } = useApp();
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const outletTypes = ['All', 'Dine-In & Delivery', 'High Volume Delivery', 'Express Counter', 'Cloud Kitchen', 'Food Court'];

  const filteredOutlets = outlets.filter((o) => {
    const matchesType = filterType === 'All' || o.type === filterType;
    const matchesSearch =
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.managerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Store className="w-5 h-5 text-slate-700" />
            BIT Outlet Directory ({outlets.length} Operating Branches)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of all active store formats, branch managers, and operational compliance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search branch name or ID..."
              className="pl-8 pr-3 py-1.5 border border-slate-200 rounded text-xs focus:outline-hidden focus:border-slate-400 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
        <span className="text-slate-500 font-medium mr-1 text-[11px]">Filter Format:</span>
        {outletTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filterType === type
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Outlets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOutlets.map((outlet) => (
          <div
            key={outlet.id}
            className="bg-white border border-slate-200 rounded-md p-4 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-mono text-[11px] font-semibold text-slate-500">
                    {outlet.id}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{outlet.name}</h3>
                </div>
                <StatusBadge status={outlet.dayEndStatus} />
              </div>

              <div className="text-xs text-slate-600 space-y-1 mb-3">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{outlet.address}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Users className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Manager: <strong>{outlet.managerName}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{outlet.phone}</span>
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded border border-slate-200 text-xs font-mono mb-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-sans block">Today Sales</span>
                  <span className="font-bold text-slate-900">₹{outlet.grossSalesToday.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-sans block">Expenses</span>
                  <span className="text-slate-700">₹{outlet.expensesToday.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-sans block">Margin %</span>
                  <span className="text-emerald-700 font-bold">{outlet.grossMarginPct}%</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                {outlet.type}
              </span>
              <button
                onClick={() => {
                  setActiveScope(outlet.id);
                  setActiveModule('outlet-detail');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
              >
                Open Dashboard <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
