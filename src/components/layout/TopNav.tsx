import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Building,
  Store,
  ChevronDown,
  Calendar,
  Shield,
  Layers,
  ChefHat
} from 'lucide-react';
import { Role } from '../../types';

export const TopNav: React.FC = () => {
  const {
    tenant,
    brand,
    outlets,
    activeScope,
    setActiveScope,
    activeRole,
    setActiveRole,
    dateFilter,
    setDateFilter,
    activeModule,
    setSearchModalOpen,
    notificationsOpen,
    setNotificationsOpen,
    priceHikeAlerts
  } = useApp();

  const activeOutlet = outlets.find((o) => o.id === activeScope);
  const pendingExceptionsCount =
    outlets.filter((o) => o.attentionRequired).length +
    priceHikeAlerts.filter((p) => p.status === 'Needs Approval').length;

  const rolesList: Role[] = [
    'Platform Administrator',
    'Restaurant Group Administrator',
    'Brand/Management User',
    'Central Kitchen Manager',
    'Outlet Manager',
    'Accountant',
    'Purchase Manager',
    'HR/Salary Administrator',
    'Cashier',
    'Kitchen Staff',
    'Read-Only Auditor'
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      {/* Top tier: Hierarchy Selectors, Date, Search, Notifications, Role Profile */}
      <div className="flex items-center justify-between px-4 py-2 text-xs gap-3">
        {/* Left: Tenant, Brand, Scope selectors */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Tenant */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
            <Building className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold">{tenant.name.split(' ')[0]}</span>
            <span className="text-slate-400 font-mono text-[10px]">({tenant.code})</span>
          </div>

          <span className="text-slate-300">/</span>

          {/* Brand */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 text-slate-800 border border-slate-200 shrink-0">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium">{brand.name}</span>
          </div>

          <span className="text-slate-300">/</span>

          {/* Scope Selector (Consolidated vs CK vs 9 Outlets) */}
          <div className="relative shrink-0">
            <select
              value={activeScope}
              onChange={(e) => setActiveScope(e.target.value)}
              className="appearance-none bg-slate-900 text-white font-medium pl-7 pr-7 py-1 rounded text-xs focus:outline-hidden hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <option value="consolidated">🌐 Consolidated (All 9 Outlets + Central Kitchen)</option>
              <option value="ck">🍳 Central Kitchen (BIT-CK-001)</option>
              <optgroup label="Operating Outlets">
                {outlets.map((outlet) => (
                  <option key={outlet.id} value={outlet.id}>
                    🏪 {outlet.id} — {outlet.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <div className="absolute left-2 top-1.5 pointer-events-none text-slate-400">
              {activeScope === 'consolidated' ? (
                <Layers className="w-3.5 h-3.5" />
              ) : activeScope === 'ck' ? (
                <ChefHat className="w-3.5 h-3.5" />
              ) : (
                <Store className="w-3.5 h-3.5" />
              )}
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2 pointer-events-none" />
          </div>

          {/* DEMO DATA badge */}
          <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded border border-amber-300 bg-amber-50 text-amber-800 shrink-0">
            DEMO DATA
          </span>
        </div>

        {/* Right: Date filter, Search, Exceptions, Role profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Date Selector */}
          <div className="relative hidden md:block">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 pl-7 pr-6 py-1 rounded text-xs focus:outline-hidden hover:border-slate-300 cursor-pointer"
            >
              <option value="Today (09 Oct 2026)">Today (09 Oct 2026)</option>
              <option value="Yesterday (08 Oct 2026)">Yesterday (08 Oct 2026)</option>
              <option value="This Week (Week 41)">This Week (Week 41)</option>
              <option value="MTD Oct 2026">MTD Oct 2026</option>
              <option value="Custom Range">Custom Date Range...</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1.5 pointer-events-none" />
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
          </div>

          {/* Global Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-600 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline text-slate-500">Search...</span>
            <kbd className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-white px-1 border border-slate-200 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Exceptions Notification Button */}
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
            title="Operational Exceptions & Alerts"
          >
            <Bell className="w-4 h-4" />
            {pendingExceptionsCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                {pendingExceptionsCount}
              </span>
            )}
          </button>

          {/* Active Role Selector / Demo User Profile */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <div className="relative">
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as Role)}
                className="appearance-none bg-slate-100 border border-slate-200 text-slate-800 font-medium pl-6 pr-6 py-1 rounded text-xs focus:outline-hidden hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {rolesList.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <Shield className="w-3.5 h-3.5 text-slate-500 absolute left-1.5 top-1.5 pointer-events-none" />
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb line & active operational context strip */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5 truncate">
          <span>BIT Platform</span>
          <span>/</span>
          <span className="text-slate-700 font-medium capitalize">
            {activeModule.replace('-', ' ')}
          </span>
          {activeScope !== 'consolidated' && (
            <>
              <span>/</span>
              <span className="text-slate-900 font-semibold font-mono">
                {activeScope === 'ck' ? 'BIT-CK-001 (Central Kitchen)' : `${activeOutlet?.id} (${activeOutlet?.name})`}
              </span>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3 text-slate-500 font-mono text-[11px]">
          <span>Reporting Cutoff: <strong className="text-slate-700 font-semibold">1:00 PM Daily</strong></span>
          <span>·</span>
          <span>Base Currency: <strong className="text-slate-700 font-semibold">INR (₹)</strong></span>
          <span>·</span>
          <span>Status: <strong className="text-emerald-700 font-semibold">Live MIS Console</strong></span>
        </div>
      </div>
    </header>
  );
};
