import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  CreditCard,
  Zap,
  ExternalLink,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Coins,
  ShieldCheck,
  Calendar,
  Lock,
  Truck,
  MonitorCheck,
  Layers,
  Info
} from 'lucide-react';
import { PaymentIntegration } from '../types';

export const PaymentIntegrationsView: React.FC = () => {
  const { integrations, settlements, addToast, setActiveModule } = useApp();
  const [activeCategory, setActiveCategory] = useState<'All' | 'Payment & POS' | 'Food Delivery' | 'Delivery Logistics'>('All');
  const [testingId, setTestingId] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<PaymentIntegration | null>(null);

  const filteredIntegrations = integrations.filter((item) => {
    if (activeCategory === 'Payment & POS') {
      return item.type === 'Payment Aggregator' || item.type === 'POS System';
    }
    if (activeCategory === 'Food Delivery') {
      return item.type === 'Food Delivery' || item.type === 'Dine-in Partner';
    }
    if (activeCategory === 'Delivery Logistics') {
      return item.type === 'Delivery Logistics Provider';
    }
    return true;
  });

  const handleTestConnection = (int: PaymentIntegration) => {
    setTestingId(int.id);
    setTimeout(() => {
      setTestingId(null);
      addToast(
        'info',
        'Demo Sync Test',
        `Simulated health check for ${int.provider}. Webhook endpoint pinged successfully.`
      );
    }, 900);
  };

  const handleLaunchPortal = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      addToast('info', 'Merchant Portal', 'Provider portal configured. Opening merchant session in new window...');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-slate-700" />
            Integrations Hub — Payment Gateways, Order Sources &amp; Delivery
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configured payment processors, order source platforms (Swiggy, Zomato, Tipplr, Ownly), and Rapido delivery integration
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('settlements')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors shadow-xs"
          >
            <Coins className="w-3.5 h-3.5" />
            View Settlement Ledger &amp; Variance →
          </button>
        </div>
      </div>

      {/* Clear Demarcation & Architecture Disclaimer Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Info className="w-4 h-4 text-teal-700" />
          Integration Architecture &amp; Provider Roles:
        </div>
        <p className="text-slate-600 text-[11px] leading-relaxed">
          <strong>Order Platforms vs Delivery Providers:</strong> <em>Ownly</em> is an online order platform; <em>Rapido</em> is its associated third-party delivery provider. 
          <em>MobiKwik</em> and <em>Quick UPI</em> are digital payment collection processors.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-slate-500">
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            DEMO SIMULATION — Mock Webhooks &amp; Credentials
          </span>
          <span>·</span>
          <span>No live driver GPS tracking (excluded per business rules)</span>
          <span>·</span>
          <span>Production APIs deploy in Antigravity IDE</span>
        </div>
      </div>

      {/* Settlement Cadence Info Strip */}
      <div className="bg-teal-50/70 border border-teal-200 rounded p-3 text-xs">
        <div className="font-bold text-teal-900 mb-1 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-teal-700" />
          Configured Partner Settlement Cadences (BIT Financial Rules):
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-teal-900 text-[11px] font-mono mt-1">
          <div>• <strong>MobiKwik:</strong> Every other day (T+2)</div>
          <div>• <strong>Swiggy:</strong> Wednesday weekly cycle</div>
          <div>• <strong>Zomato:</strong> Thursday weekly cycle</div>
          <div>• <strong>Ownly:</strong> T+2 Direct (Rapido Delivery)</div>
          <div>• <strong>Tipplr:</strong> T+1 Next business day</div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 text-xs">
        {(['All', 'Payment & POS', 'Food Delivery', 'Delivery Logistics'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-md p-4 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors shadow-2xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    {item.provider}
                  </h3>
                  <div className="text-slate-500 text-[11px] font-mono">
                    {item.type}
                    {item.deliveryPartner && (
                      <span className="text-teal-700 font-semibold ml-1">
                        (Delivery by {item.deliveryPartner})
                      </span>
                    )}
                  </div>
                </div>
                <StatusBadge status={item.connectionStatus} />
              </div>

              {/* Scope & Details */}
              <div className="mt-3 space-y-2 text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-200 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Cadence:</span>
                    <span className="font-semibold text-slate-800">{item.settlementCadence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Next Settlement:</span>
                    <span className="text-slate-900 font-bold">{item.expectedNextSettlement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Outlets Mapped:</span>
                    <span className="text-slate-700">{item.outletsMappedCount} of 9 Branches</span>
                  </div>
                </div>

                <div className="space-y-1 font-mono text-[11px] pt-1">
                  <div className="flex justify-between text-slate-600">
                    <span className="font-sans">MTD Gross Volume:</span>
                    <span className="font-bold text-slate-900">₹{item.grossVolumeMTD.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-rose-700">
                    <span className="font-sans">Deductions / Fees:</span>
                    <span>-₹{item.commissionFeesMTD.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-semibold pt-1 border-t border-slate-100">
                    <span className="font-sans">Net Payout Expected:</span>
                    <span>₹{item.netPayableMTD.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 pt-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  Credentials (Mock): <span className="text-slate-600">{item.apiKeyMasked}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                disabled={testingId === item.id}
                onClick={() => handleTestConnection(item)}
                className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${testingId === item.id ? 'animate-spin' : ''}`} />
                {testingId === item.id ? 'Pinging...' : 'Test Sync'}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSelectedConfig(item)}
                  className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded text-xs font-medium cursor-pointer"
                >
                  Configure
                </button>
                {item.providerPortalUrl && (
                  <button
                    onClick={() => handleLaunchPortal(item.providerPortalUrl)}
                    className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100"
                    title="Launch Merchant Portal"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Drawer / Modal */}
      {selectedConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Configure {selectedConfig.provider}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  Provider ID: {selectedConfig.id} · {selectedConfig.type}
                </p>
              </div>
              <button
                onClick={() => setSelectedConfig(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs">
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900">
                <strong>Simulated Configuration Interface:</strong> Actual API secrets and webhooks are managed securely via server environment variables.
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">API Key / Token (Masked)</label>
                <input
                  type="text"
                  readOnly
                  value={selectedConfig.apiKeyMasked}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-slate-600 bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Settlement Cadence</label>
                <input
                  type="text"
                  readOnly
                  value={selectedConfig.settlementCadence}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-700 bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Branch Mapping</label>
                <div className="p-2 border border-slate-200 rounded max-h-32 overflow-y-auto space-y-1 font-mono text-[11px]">
                  <div>✓ BIT-OUT-001 (Indiranagar Flagship)</div>
                  <div>✓ BIT-OUT-002 (Koramangala 5th Block)</div>
                  <div>✓ BIT-OUT-003 (HSR Layout Sector 4)</div>
                  <div>✓ BIT-OUT-004 (Whitefield ITPL Road)</div>
                  <div>✓ BIT-OUT-005 (Bellandur ORR Cloud)</div>
                  <div>✓ BIT-OUT-006 (JP Nagar 6th Phase)</div>
                  <div>✓ BIT-OUT-007 (Electronic City Phase 1)</div>
                  <div>✓ BIT-OUT-008 (Malleshwaram 8th Cross)</div>
                  <div>✓ BIT-OUT-009 (MG Road Metro)</div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedConfig(null)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium cursor-pointer"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
