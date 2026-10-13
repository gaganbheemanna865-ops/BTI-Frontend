import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  Store,
  ChefHat,
  Receipt,
  ShoppingCart,
  Boxes,
  Truck,
  Layers,
  Banknote,
  Scale,
  FileSpreadsheet,
  CalendarCheck,
  FileCode2,
  UtensilsCrossed,
  LineChart,
  Activity,
  Sparkles,
  Zap,
  CreditCard,
  MonitorCheck,
  Users,
  ShieldCheck,
  Coins,
  Home,
  ChevronDown,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeType?: 'warning' | 'error' | 'info';
  rolesAllowed?: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    activeRole,
    priceHikeAlerts,
    outlets,
    orders
  } = useApp();

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'D. Staff & Payroll': false,
    'F. Integrations': false,
    'G. Performance': false
  });

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const pendingCutoffs = outlets.filter((o) => o.dayEndStatus === 'Pending Cutoff').length;
  const activeHikes = priceHikeAlerts.filter((p) => p.status === 'Needs Approval').length;
  const newOrdersCount = orders.filter((o) => o.status === 'New').length;

  const sections: NavSection[] = [
    {
      title: 'A. Management Overview',
      items: [
        { id: 'dashboard', label: 'Management Overview', icon: LayoutDashboard },
        { id: 'groups', label: 'Restaurant Groups', icon: Building2 },
        { id: 'brands', label: 'Brands', icon: Layers },
        { id: 'outlets', label: 'Outlet Directory', icon: Store, badge: outlets.length },
        { id: 'roles-permissions', label: 'User & Role Management', icon: ShieldCheck }
      ]
    },
    {
      title: 'B. Central Kitchen',
      items: [
        { id: 'central-kitchen', label: 'Overview & Capacity', icon: ChefHat },
        {
          id: 'ck-purchases',
          label: 'Purchases (OCR)',
          icon: ShoppingCart,
          badge: activeHikes > 0 ? `${activeHikes} hike` : undefined,
          badgeType: 'error'
        },
        { id: 'production', label: 'Recipes & Production', icon: UtensilsCrossed },
        { id: 'inventory', label: 'Raw Materials & Inventory', icon: Boxes },
        { id: 'stock-transfers', label: 'Branch Allocations', icon: Truck },
        { id: 'ck-expenses', label: 'CK Direct Expenses', icon: Receipt },
        { id: 'ck-day-end', label: 'Day-End Summary', icon: CalendarCheck }
      ]
    },
    {
      title: 'C. Outlet Operations',
      items: [
        { id: 'outlet-overview', label: 'Outlet Overview', icon: Store },
        { id: 'outlet-sales', label: 'Sales & Orders', icon: Banknote },
        {
          id: 'outlet-kds',
          label: 'Order KDS',
          icon: MonitorCheck,
          badge: newOrdersCount > 0 ? `${newOrdersCount} new` : undefined,
          badgeType: 'info'
        },
        { id: 'outlet-expenses', label: 'Petty Expenses', icon: Receipt },
        { id: 'outlet-stock', label: 'Stock & Consumption', icon: Truck },
        {
          id: 'outlet-day-end',
          label: 'Day-End Audit (1 PM)',
          icon: CalendarCheck,
          badge: pendingCutoffs > 0 ? `${pendingCutoffs} pending` : undefined,
          badgeType: 'warning'
        }
      ]
    },
    {
      title: 'D. Staff & Payroll',
      items: [
        { id: 'outlet-attendance', label: 'Employee Directory', icon: Users },
        { id: 'outlet-wages', label: 'Daily Wages & Overtime', icon: Coins },
        { id: 'outlet-advances', label: 'Salary & Advances', icon: Banknote },
        { id: 'outlet-rent', label: 'Rent & Accommodation', icon: Home }
      ]
    },
    {
      title: 'E. Finance & Reporting',
      items: [
        { id: 'pnl-consolidated', label: 'Consolidated Profit & Loss', icon: FileSpreadsheet },
        { id: 'pnl-brand', label: 'Brand-Wise P&L', icon: FileSpreadsheet },
        { id: 'pnl-outlet', label: 'Outlet-Wise P&L', icon: FileSpreadsheet },
        { id: 'ebitda-margin-analysis', label: 'EBITDA & Margin Analysis', icon: TrendingUp },
        { id: 'purchases', label: 'Purchase Register', icon: ShoppingCart },
        { id: 'expenses', label: 'Expense Register', icon: Receipt },
        { id: 'sales', label: 'Sales & Cash Register', icon: Banknote },
        { id: 'settlements', label: 'Settlement Reconciliation', icon: Scale },
        { id: 'daily-summary', label: 'Daily MIS Summary', icon: CalendarCheck },
        { id: 'tally-export', label: 'Tally / Accounting Support', icon: FileCode2 }
      ]
    },
    {
      title: 'F. Integrations',
      items: [
        { id: 'payment-integrations', label: 'Payment Gateways & In-Store POS', icon: CreditCard },
        { id: 'ownly', label: 'Online Channels & Rapido Delivery', icon: Zap }
      ]
    },
    {
      title: 'G. Performance',
      items: [
        { id: 'dish-performance', label: 'Dish Performance', icon: UtensilsCrossed },
        { id: 'branch-performance', label: 'Outlet Performance', icon: LineChart },
        { id: 'weekly-strategy', label: 'Next-Week Forecast & Strategy', icon: Sparkles }
      ]
    }
  ];

  // Role visibility restriction check helper
  const isItemVisible = (item: NavItem) => {
    if (activeRole === 'Kitchen Staff') {
      return ['dashboard', 'outlet-kds', 'production', 'inventory', 'stock-transfers', 'outlet-attendance'].includes(item.id);
    }
    if (activeRole === 'Cashier') {
      return ['dashboard', 'outlet-sales', 'outlet-kds', 'outlet-day-end', 'outlet-expenses', 'sales'].includes(item.id);
    }
    if (activeRole === 'Purchase Manager') {
      return ['dashboard', 'purchases', 'inventory', 'central-kitchen', 'ck-purchases', 'pnl-consolidated'].includes(item.id);
    }
    return true; // Admin, Management, Accountant, GM can access all
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 h-screen sticky top-0 overflow-hidden select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-teal-600 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            BIT
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
              BIT Operations
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">
              POS &amp; MIS ENTERPRISE
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4 text-xs font-medium">
        {sections.map((section) => {
          const visibleItems = section.items.filter(isItemVisible);
          if (visibleItems.length === 0) return null;

          const isCollapsed = collapsedSections[section.title];

          return (
            <div key={section.title} className="space-y-1">
              {/* Section Header */}
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors cursor-pointer"
              >
                <span>{section.title}</span>
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Items */}
              {!isCollapsed && (
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeModule === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveModule(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left cursor-pointer ${
                          isActive
                            ? 'bg-teal-700 text-white font-medium shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium shrink-0 ml-1.5 ${
                              item.badgeType === 'error'
                                ? 'bg-rose-900/80 text-rose-200 border border-rose-700/60'
                                : item.badgeType === 'warning'
                                ? 'bg-amber-900/80 text-amber-200 border border-amber-700/60'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200">Tenant: BIT-GRP</span>
          <span className="font-mono text-emerald-400 text-[10px]">● Online</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          1 Central Kitchen · 9 Outlets
        </div>
      </div>
    </aside>
  );
};
