import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  ChefHat,
  Boxes,
  Truck,
  TrendingUp,
  Receipt,
  ShoppingCart,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Send,
  FileText
} from 'lucide-react';

export const CentralKitchenView: React.FC = () => {
  const {
    centralKitchen,
    inventory,
    productionPlans,
    expenses,
    purchases,
    priceHikeAlerts,
    outlets,
    activeModule,
    setUploadModalOpen,
    setUploadContext,
    addToast
  } = useApp();

  // Filter CK specific records
  const ckExpenses = expenses.filter(
    (e) => e.costCenter === 'Central Kitchen Expenses' || e.centralKitchenId === centralKitchen.id
  );
  const ckPurchases = purchases.filter((p) => p.destination === 'Central Kitchen');
  const totalCkExpenses = ckExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalCkPurchases = ckPurchases.reduce((sum, p) => sum + p.totalAmount, 0);

  // Categorical groups for clean information architecture
  type CKCategory = 'production' | 'procurement' | 'orders' | 'financials';

  const categoryGroups: Record<CKCategory, { label: string; tabs: { id: string; label: string }[] }> = {
    production: {
      label: 'Production & Formulation',
      tabs: [
        { id: 'overview', label: 'Overview & Active Batches' },
        { id: 'production', label: 'Production Scheduling' },
        { id: 'branch-allocation', label: 'Branch Allocation Sheets' },
        { id: 'recipes', label: 'Standard Recipes & Menu' },
        { id: 'prepared-stock', label: 'Prepared Food Stock' }
      ]
    },
    procurement: {
      label: 'Procurement & Inventory',
      tabs: [
        { id: 'raw-inventory', label: 'Raw Materials & Dry Stores' },
        { id: 'purchases', label: 'Bulk Purchases (OCR)' },
        { id: 'price-analysis', label: 'Price Increase Alerts (>5%)' },
        { id: 'vendor-perf', label: 'Vendor Performance' }
      ]
    },
    orders: {
      label: 'Branch Orders & Cookhouse',
      tabs: [
        { id: 'cookhouse', label: 'Cookhouse Order Board' },
        { id: 'submit-orders', label: 'Branch Requisitions' },
        { id: 'only-orders', label: 'Only Orders Queue' }
      ]
    },
    financials: {
      label: 'Expenses & Day-End',
      tabs: [
        { id: 'expenses', label: 'CK Direct Expenses' },
        { id: 'reports', label: 'Cost & Efficiency Reports' },
        { id: 'day-end', label: 'CK Day-End Summary (1 PM)' }
      ]
    }
  };

  const getInitialCategoryAndTab = () => {
    if (['inventory', 'ck-purchases'].includes(activeModule)) {
      return { cat: 'procurement' as CKCategory, tab: activeModule === 'inventory' ? 'raw-inventory' : 'purchases' };
    }
    if (['cookhouse-orders', 'submit-orders', 'only-orders'].includes(activeModule)) {
      return { cat: 'orders' as CKCategory, tab: activeModule === 'cookhouse-orders' ? 'cookhouse' : activeModule === 'submit-orders' ? 'submit-orders' : 'only-orders' };
    }
    if (['ck-expenses', 'ck-reports', 'ck-day-end'].includes(activeModule)) {
      return { cat: 'financials' as CKCategory, tab: activeModule === 'ck-expenses' ? 'expenses' : activeModule === 'ck-reports' ? 'reports' : 'day-end' };
    }
    if (activeModule === 'stock-transfers') {
      return { cat: 'production' as CKCategory, tab: 'branch-allocation' };
    }
    return { cat: 'production' as CKCategory, tab: 'overview' };
  };

  const initialConfig = getInitialCategoryAndTab();
  const [activeCategory, setActiveCategory] = useState<CKCategory>(initialConfig.cat);
  const [activeTab, setActiveTab] = useState<string>(initialConfig.tab);

  const handleSelectCategory = (cat: CKCategory) => {
    setActiveCategory(cat);
    setActiveTab(categoryGroups[cat].tabs[0].id);
  };

  const handleSimulateAllocation = (planId: string) => {
    addToast('success', 'Allocations Dispatched', `Batch ${planId} physical quantities verified for transport loading.`);
  };

  return (
    <div className="space-y-5">
      {/* CK Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-teal-700" />
              {centralKitchen.name}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-teal-50 text-teal-800 border border-teal-200">
              {centralKitchen.id}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {centralKitchen.address} · Head Chef: <strong>{centralKitchen.managerName}</strong> ({centralKitchen.phone})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setUploadContext('purchase');
              setUploadModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Upload Raw Material Bill (OCR)
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Daily Capacity"
          value={`${centralKitchen.dailyCapacityKg} kg`}
          subValue="Output cap"
        />
        <MetricCard
          label="Current Utilization"
          value={`${centralKitchen.currentUtilizationPct}%`}
          subValue="3,297 kg active"
          trend="up"
          trendValue="Optimal"
        />
        <MetricCard
          label="Total Raw Purchases"
          value={`₹${totalCkPurchases.toLocaleString()}`}
          subValue="MTD Procured"
        />
        <MetricCard
          label="CK Operating Costs"
          value={`₹${totalCkExpenses.toLocaleString()}`}
          subValue="LPG, RO Water, Diesel"
        />
        <MetricCard
          label="Branches Supplied"
          value={`${outlets.length} of 9`}
          subValue="Daily route drops"
        />
        <MetricCard
          label="Price Alerts Active"
          value={`${priceHikeAlerts.length}`}
          subValue="Toor Dal & Onion"
          trend="down"
          trendValue="Action required"
        />
      </div>

      {/* Categorized Sub-Navigation - Clean 2-Tier Architecture */}
      <div className="bg-white border border-slate-200 rounded-md p-2 space-y-2">
        {/* Tier 1: Main Category Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-2">
          {(Object.keys(categoryGroups) as CKCategory[]).map((catKey) => {
            const isCatActive = activeCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => handleSelectCategory(catKey)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isCatActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{categoryGroups[catKey].label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isCatActive ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-500'}`}>
                  {categoryGroups[catKey].tabs.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tier 2: Sub-tabs within Active Category */}
        <div className="flex flex-wrap items-center gap-1 text-xs pt-0.5">
          {categoryGroups[activeCategory].tabs.map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  isTabActive
                    ? 'bg-teal-700 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Active Production Batches */}
          <div className="bg-white border border-slate-200 rounded-md p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Active Production Batches & Today's Output</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Recipe Standard: ISO 22000 Food Safety
              </span>
            </div>

            <div className="space-y-3">
              {productionPlans.map((plan) => (
                <div key={plan.id} className="border border-slate-200 rounded p-3 bg-slate-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <div>
                      <span className="font-mono text-xs font-semibold text-slate-700">{plan.batchNumber}</span>
                      <h4 className="text-sm font-bold text-slate-900">{plan.recipeName}</h4>
                      <p className="text-xs text-slate-500">Cooked by {plan.chiefCook} · Target: {plan.targetQuantityKg} kg</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={plan.status} />
                      <button
                        onClick={() => handleSimulateAllocation(plan.batchNumber)}
                        className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-medium transition-colors"
                      >
                        Verify Allocations
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-500 text-[11px]">Prepared Quantity</span>
                      <div className="font-bold font-mono text-slate-900">{plan.preparedQuantityKg} kg</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-500 text-[11px]">Batch Waste</span>
                      <div className="font-bold font-mono text-slate-600">{plan.wasteQuantityKg} kg</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-500 text-[11px]">Production Cost</span>
                      <div className="font-bold font-mono text-slate-900">₹{plan.productionCost.toLocaleString()}</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-500 text-[11px]">Cost per kg</span>
                      <div className="font-bold font-mono text-slate-900">
                        ₹{(plan.productionCost / plan.preparedQuantityKg).toFixed(2)}/kg
                      </div>
                    </div>
                  </div>

                  {/* Branch Allocations List */}
                  <div className="mt-3 pt-2 border-t border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-700 mb-1.5">
                      Branch Allocations ({plan.allocations.length} Outlets):
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      {plan.allocations.map((alloc) => (
                        <div
                          key={alloc.outletId}
                          className="flex items-center justify-between p-2 bg-white rounded border border-slate-200"
                        >
                          <div>
                            <span className="font-medium text-slate-800">{alloc.outletName}</span>
                            <div className="text-[10px] text-slate-500 font-mono">{alloc.outletId}</div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold font-mono text-slate-900">{alloc.allocatedKg} kg</span>
                            <div className="text-[10px] text-emerald-700 font-medium">{alloc.receiptStatus}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Materials Quick Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded p-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Raw Material Cold Room & Dry Storage Stock
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {inventory.map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-900">{item.name}</span>
                      <div className="text-[11px] text-slate-500 font-mono">{item.code} · {item.category}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-semibold text-slate-900">{item.quantityOnHand} {item.unit}</span>
                      <div className="text-[10px] text-slate-500 font-mono">Val: ₹{item.totalValue.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded p-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Central Kitchen Operational Inward Transport Accounting
              </h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Transport and refrigerated freight costs are accounted per batch delivery run to Whitefield, Bellandur, and Electronic City loops.
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                  <span>Refrigerated Route A (Indiranagar, Koramangala, HSR)</span>
                  <span className="font-mono font-bold text-slate-900">₹1,850/day</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                  <span>Refrigerated Route B (Bellandur, Whitefield, E-City)</span>
                  <span className="font-mono font-bold text-slate-900">₹2,350/day</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                  <span>North Loop (Malleshwaram, MG Road, JP Nagar)</span>
                  <span className="font-mono font-bold text-slate-900">₹1,600/day</span>
                </div>
              </div>
              <div className="mt-3 p-2 bg-slate-100 rounded text-[11px] text-slate-600 font-mono">
                Scope Rule: Quantified transport expenses accounted without live driver GPS tracking.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Production Planning */}
      {activeTab === 'production' && (
        <div className="bg-white border border-slate-200 rounded p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daily Production Schedule & Formulation Logs</h3>
              <p className="text-xs text-slate-500">Plan batches based on 9 outlet aggregated consumption demand</p>
            </div>
            <button
              onClick={() => addToast('info', 'Production Batch Created', 'Scheduled 500kg Dal Makhani formulation for tomorrow')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Schedule New Batch
            </button>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-3 py-2">Batch No</th>
                <th className="px-3 py-2">Formula / Recipe</th>
                <th className="px-3 py-2 text-right">Target (kg)</th>
                <th className="px-3 py-2 text-right">Actual (kg)</th>
                <th className="px-3 py-2 text-right">Batch Cost</th>
                <th className="px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {productionPlans.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-bold text-slate-800">{p.batchNumber}</td>
                  <td className="px-3 py-2.5 font-sans font-medium text-slate-900">{p.recipeName}</td>
                  <td className="px-3 py-2.5 text-right">{p.targetQuantityKg}</td>
                  <td className="px-3 py-2.5 text-right font-semibold">{p.preparedQuantityKg}</td>
                  <td className="px-3 py-2.5 text-right">₹{p.productionCost.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-center font-sans">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Branch Allocation */}
      {activeTab === 'branch-allocation' && (
        <div className="bg-white border border-slate-200 rounded p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Branch Dispatch & Allocation Sheets</h3>
              <p className="text-xs text-slate-500">Master quantity allocations to each operating outlet ID</p>
            </div>
            <button
              onClick={() => addToast('success', 'Manifest Exported', 'Dispatch manifest printed for route vehicles')}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded text-xs font-medium text-slate-700"
            >
              Export Loading Manifest
            </button>
          </div>

          <div className="space-y-3">
            {outlets.map((outlet) => (
              <div key={outlet.id} className="p-3 border border-slate-200 rounded bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-900 font-sans">{outlet.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{outlet.id} · {outlet.type}</div>
                </div>
                <div className="flex items-center gap-6 font-mono">
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px]">Sambar Alloc:</span>
                    <div className="font-bold text-slate-900">95 kg</div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px]">Batter Alloc:</span>
                    <div className="font-bold text-slate-900">130 kg</div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px]">Status:</span>
                    <div className="text-emerald-700 font-semibold font-sans">Acknowledged</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Raw Materials & Inventory */}
      {activeTab === 'raw-inventory' && (
        <div className="bg-white border border-slate-200 rounded p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Central Kitchen Raw Materials & Dry Store Ledger</h3>
              <p className="text-xs text-slate-500">Live quantity-on-hand, reorder thresholds, and inventory valuation</p>
            </div>
            <button
              onClick={() => {
                setUploadContext('purchase');
                setUploadModalOpen(true);
              }}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium"
            >
              Receive Stock Inward
            </button>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-3 py-2">Item Code</th>
                <th className="px-3 py-2">Ingredient Name</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2 text-right">On Hand</th>
                <th className="px-3 py-2 text-right">Reorder Level</th>
                <th className="px-3 py-2 text-right">Unit Cost</th>
                <th className="px-3 py-2 text-right">Total Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-bold text-slate-800">{item.code}</td>
                  <td className="px-3 py-2.5 font-sans font-medium text-slate-900">{item.name}</td>
                  <td className="px-3 py-2.5 font-sans text-slate-600">{item.category}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-slate-900">{item.quantityOnHand} {item.unit}</td>
                  <td className="px-3 py-2.5 text-right text-slate-500">{item.reorderLevel} {item.unit}</td>
                  <td className="px-3 py-2.5 text-right">₹{item.unitCost.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-right font-semibold">₹{item.totalValue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Cookhouse Orders & Other Tabs */}
      {['cookhouse', 'submit-orders', 'only-orders', 'recipes', 'prepared-stock', 'expenses', 'purchases', 'price-analysis', 'vendor-perf', 'reports', 'day-end'].includes(activeTab) && (
        <div className="bg-white border border-slate-200 rounded p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 capitalize">
                Central Kitchen: {activeTab.replace('-', ' ')}
              </h3>
              <p className="text-xs text-slate-500">
                Operational records scoped to Central Kitchen ID: {centralKitchen.id}
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-100 text-slate-700">
              BIT-CK-001 SCOPE
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs leading-relaxed space-y-3">
            <p className="text-slate-700">
              The <strong>{activeTab.replace('-', ' ')}</strong> workspace manages Central Kitchen specific operational queues, batch formulations, and supply requisitions from branch outlets without intermixing retail POS data.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="text-slate-500 text-[11px]">Active Requisitions</span>
                <div className="text-sm font-bold text-slate-900 font-mono mt-1">9 Branch Orders Matched</div>
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="text-slate-500 text-[11px]">Quality Inspection</span>
                <div className="text-sm font-bold text-emerald-700 font-mono mt-1">100% Passes Logged</div>
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="text-slate-500 text-[11px]">Yield Efficiency</span>
                <div className="text-sm font-bold text-slate-900 font-mono mt-1">98.2% Standard Target</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
