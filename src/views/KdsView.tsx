import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  MonitorCheck,
  Clock,
  AlertCircle,
  Filter,
  CheckCircle2,
  ChevronRight,
  Flame,
  ChefHat,
  Zap,
  ShoppingBag,
  Volume2,
  VolumeX,
  Store
} from 'lucide-react';
import { OrderRecord } from '../types';

export const KdsView: React.FC = () => {
  const {
    orders,
    outlets,
    updateOrderStatus,
    activeScope,
    addToast
  } = useApp();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterChannel, setFilterChannel] = useState<'All' | 'Aggregators' | 'Counter' | 'Only Orders'>('All');
  const [outletFilter, setOutletFilter] = useState<string>(activeScope !== 'consolidated' && activeScope !== 'ck' ? activeScope : 'All');

  const statusColumns: OrderRecord['status'][] = [
    'New',
    'Accepted',
    'Preparing',
    'Ready',
    'Completed'
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesOutlet = outletFilter === 'All' || o.outletId === outletFilter;
    if (filterChannel === 'Aggregators') return matchesOutlet && (o.channel === 'Swiggy' || o.channel === 'Zomato' || o.channel === 'Tipplr');
    if (filterChannel === 'Counter') return matchesOutlet && !o.isOnline;
    return matchesOutlet;
  });

  const handleAdvanceStatus = (orderId: string, currentStatus: OrderRecord['status']) => {
    const nextMap: Record<OrderRecord['status'], OrderRecord['status']> = {
      New: 'Accepted',
      Accepted: 'Preparing',
      Preparing: 'Ready',
      Ready: 'Completed',
      Completed: 'Completed',
      Cancelled: 'Cancelled'
    };
    const nextStatus = nextMap[currentStatus];
    updateOrderStatus(orderId, nextStatus);
  };

  return (
    <div className="space-y-4">
      {/* KDS Header & Controls */}
      <div className="bg-slate-900 text-white p-3.5 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-teal-500 text-white flex items-center justify-center font-bold">
            <MonitorCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight flex items-center gap-2">
              Kitchen Display System (KDS) & Order Expeditor Console
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-teal-800 text-teal-200 rounded">
                LIVE DEMO QUEUE
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Kitchen preparation dispatch across Dine-in, Takeaway, Swiggy, and Zomato
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* Sound toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              addToast('info', 'Sound Settings', soundEnabled ? 'KDS chimes muted' : 'KDS chime audio alerts enabled');
            }}
            className={`p-1.5 rounded transition-colors ${
              soundEnabled ? 'bg-slate-800 text-teal-400' : 'bg-slate-800 text-slate-500'
            }`}
            title="Toggle Kitchen Order Chime"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Filter Channel */}
          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-hidden"
          >
            <option value="All">All Channels</option>
            <option value="Aggregators">Swiggy & Zomato Only</option>
            <option value="Counter">Counter & POS Only</option>
          </select>

          {/* Filter Outlet */}
          <select
            value={outletFilter}
            onChange={(e) => setOutletFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-hidden"
          >
            <option value="All">All 9 Outlets</option>
            {outlets.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KDS Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {statusColumns.map((colStatus) => {
          const colOrders = filteredOrders.filter((o) => o.status === colStatus);

          const colHeaderStyles: Record<OrderRecord['status'], string> = {
            New: 'border-blue-400 bg-blue-50/50 text-blue-900',
            Accepted: 'border-amber-400 bg-amber-50/50 text-amber-900',
            Preparing: 'border-orange-400 bg-orange-50/50 text-orange-900',
            Ready: 'border-emerald-400 bg-emerald-50/50 text-emerald-900',
            Completed: 'border-slate-300 bg-slate-50 text-slate-700',
            Cancelled: 'border-rose-300 bg-rose-50 text-rose-700'
          };

          return (
            <div
              key={colStatus}
              className="bg-white border border-slate-200 rounded-md flex flex-col h-[calc(100vh-250px)] min-h-[500px]"
            >
              {/* Column Header */}
              <div
                className={`p-2.5 border-b font-semibold text-xs flex items-center justify-between ${colHeaderStyles[colStatus]}`}
              >
                <div className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <span>{colStatus}</span>
                  {colStatus === 'Preparing' && <Flame className="w-3.5 h-3.5 text-orange-600 animate-pulse" />}
                </div>
                <span className="font-mono text-xs px-1.5 py-0.2 rounded bg-white/80 font-bold">
                  {colOrders.length}
                </span>
              </div>

              {/* Order Cards Container */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2.5">
                {colOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className={`border rounded p-2.5 shadow-2xs transition-all text-xs flex flex-col justify-between ${
                      ord.priority === 'Rush'
                        ? 'border-rose-300 bg-rose-50/30 ring-1 ring-rose-200'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {/* Card Top: Number, Timer, Priority */}
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <div>
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            #{ord.orderNumber}
                          </span>
                          <div className="text-[10px] text-slate-500 font-medium">
                            {ord.outletName.replace('BIT ', '')}
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                              ord.channel === 'Swiggy'
                                ? 'bg-orange-100 text-orange-800'
                                : ord.channel === 'Zomato'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {ord.channel}
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {ord.timestamp}
                          </div>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="border-t border-b border-slate-100 py-1.5 my-1.5 space-y-1">
                        {ord.items.map((item) => (
                          <div key={item.id} className="flex justify-between font-medium text-slate-800">
                            <span>
                              <strong className="text-teal-800 font-mono mr-1">{item.quantity}x</strong>
                              {item.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Customer / Table Notes */}
                      {ord.customerName && (
                        <div className="text-[11px] text-slate-500 italic mb-2">
                          {ord.customerName}
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-slate-500 font-semibold">
                        ₹{ord.totalAmount}
                      </span>

                      {colStatus !== 'Completed' && (
                        <button
                          onClick={() => handleAdvanceStatus(ord.id, ord.status)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                        >
                          <span>Advance</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {colOrders.length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No orders {colStatus.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
