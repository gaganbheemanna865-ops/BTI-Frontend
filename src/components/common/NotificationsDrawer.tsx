import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, AlertTriangle, Clock, TrendingUp, DollarSign, CheckCircle2 } from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const {
    notificationsOpen,
    setNotificationsOpen,
    outlets,
    priceHikeAlerts,
    triggerDayEndSubmit,
    setActiveModule,
    setActiveScope
  } = useApp();

  if (!notificationsOpen) return null;

  const pendingCutoffOutlets = outlets.filter((o) => o.dayEndStatus === 'Pending Cutoff' || o.attentionRequired);
  const activePriceHikes = priceHikeAlerts.filter((p) => p.status === 'Needs Approval');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-150">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Operational Exceptions & Cutoffs</h3>
            <p className="text-xs text-slate-500">Active flags requiring branch & management attention</p>
          </div>
          <button
            onClick={() => setNotificationsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* 1:00 PM Cutoff Alert */}
          <div className="border border-amber-200 bg-amber-50/60 rounded p-3">
            <div className="flex items-center gap-2 text-amber-900 font-semibold mb-1">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Reporting Cutoff Protocol (1:00 PM Daily)</span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed mb-2">
              All outlet sales, counter cash reconciliations, and petty vouchers for previous business date must be finalized by 1:00 PM.
            </p>

            {pendingCutoffOutlets.length > 0 ? (
              <div className="space-y-2 mt-2">
                {pendingCutoffOutlets.map((outlet) => (
                  <div key={outlet.id} className="bg-white border border-amber-200 p-2.5 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className="font-semibold text-slate-900">{outlet.name}</span>
                        <span className="text-slate-500 font-mono ml-1 text-[11px]">({outlet.id})</span>
                      </div>
                      <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-medium">
                        {outlet.dayEndStatus}
                      </span>
                    </div>
                    {outlet.attentionReason && (
                      <div className="text-[11px] text-slate-600 mb-2">
                        {outlet.attentionReason}
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-1">
                      {outlet.dayEndStatus === 'Pending Cutoff' && (
                        <button
                          onClick={() => triggerDayEndSubmit(outlet.id)}
                          className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-[11px] font-medium transition-colors"
                        >
                          Submit Day-End Now
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setActiveScope(outlet.id);
                          setActiveModule('outlet-detail');
                          setNotificationsOpen(false);
                        }}
                        className="px-2 py-1 text-slate-700 hover:bg-slate-100 rounded text-[11px] border border-slate-200"
                      >
                        Open Outlet View →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-800 font-medium text-xs pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                All 9 operating outlets have met the 1:00 PM reporting cutoff!
              </div>
            )}
          </div>

          {/* Price Hike Alerts */}
          <div className="border border-rose-200 bg-rose-50/50 rounded p-3">
            <div className="flex items-center gap-2 text-rose-900 font-semibold mb-1">
              <TrendingUp className="w-4 h-4 text-rose-700" />
              <span>Purchase Price Increase Alerts ({activePriceHikes.length})</span>
            </div>
            <p className="text-rose-800 text-[11px] leading-relaxed mb-2">
              Ingredients exceeding the +5.0% threshold benchmark requiring verification.
            </p>

            <div className="space-y-2 mt-2">
              {activePriceHikes.map((hike) => (
                <div key={hike.id} className="bg-white border border-rose-200 p-2.5 rounded">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-slate-900">{hike.ingredientName}</span>
                    <span className="text-[10px] text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded font-mono font-medium">
                      +{hike.percentIncrease}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mb-1">
                    Vendor: <span className="font-medium text-slate-800">{hike.vendorName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mb-2">
                    ₹{hike.previousUnitPrice} → ₹{hike.currentUnitPrice} / {hike.unit}
                  </div>
                  <button
                    onClick={() => {
                      setActiveModule('purchases');
                      setNotificationsOpen(false);
                    }}
                    className="w-full text-center px-2 py-1 bg-slate-900 text-white rounded text-[11px] font-medium hover:bg-slate-800 transition-colors"
                  >
                    Investigate in Purchases Module →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cash & Settlement Risks */}
          <div className="border border-slate-200 bg-slate-50 rounded p-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold mb-1">
              <DollarSign className="w-4 h-4 text-slate-700" />
              <span>Cash & Settlement Status</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600 mt-2">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 mt-0.5">•</span>
                <span><strong>BIT-OUT-002:</strong> ₹350 cash drawer shortage logged for evening shift.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 mt-0.5">•</span>
                <span><strong>Swiggy Bellandur:</strong> Net credit shortfall ₹1,420 vs expected rate.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 mt-0.5">•</span>
                <span><strong>MobiKwik:</strong> Payout scheduled for tomorrow (T+2 cadence).</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] flex justify-between items-center">
          <span>Enterprise MIS Exceptions Engine</span>
          <button
            onClick={() => {
              setActiveModule('audit-log');
              setNotificationsOpen(false);
            }}
            className="text-slate-700 hover:underline font-medium"
          >
            View Full Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
