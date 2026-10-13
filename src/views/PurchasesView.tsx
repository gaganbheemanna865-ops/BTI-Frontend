import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  Building2,
  Users,
  FileText,
  DollarSign,
  ArrowRight,
  Eye,
  Check
} from 'lucide-react';
import { PriceHikeAlert, PurchaseInvoice } from '../types';

export const PurchasesView: React.FC = () => {
  const {
    purchases,
    vendors,
    priceHikeAlerts,
    approvePurchase,
    approvePriceHike,
    setUploadModalOpen,
    setUploadContext
  } = useApp();

  const [activeTab, setActiveTab] = useState<'invoices' | 'price-hikes' | 'vendors' | 'ocr-intake'>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);
  const [selectedHike, setSelectedHike] = useState<PriceHikeAlert | null>(null);
  const [hikeOverrideNote, setHikeOverrideNote] = useState('');

  // OCR state inside Purchases
  const [ocrSampleType, setOcrSampleType] = useState<'Kannada Handwritten' | 'English Handwritten' | 'English Typed'>('Kannada Handwritten');
  const [ocrVendorName, setOcrVendorName] = useState('Bengaluru Wholesale Veg Mandi Syndicate');
  const [ocrBillNumber, setOcrBillNumber] = useState('V-MANDI-710');
  const [ocrItemName, setOcrItemName] = useState('Nashik Big Red Onion (Grade A)');
  const [ocrQty, setOcrQty] = useState('400');
  const [ocrPrice, setOcrPrice] = useState('38.00');
  const [ocrConfidence, setOcrConfidence] = useState(0.86);

  const totalPurchaseValue = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const pendingPurchases = purchases.filter((p) => p.status !== 'Approved').length;
  const activeHikesCount = priceHikeAlerts.filter((p) => p.status === 'Needs Approval').length;

  const handleApproveHike = (hikeId: string) => {
    approvePriceHike(hikeId, hikeOverrideNote || 'Management authorized temporary market adjustment');
    setSelectedHike(null);
    setHikeOverrideNote('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-slate-700" />
            Purchases, Bulk Groceries & Vendor Price Governance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central Kitchen raw material procurement with Kannada & English OCR Bill Intake
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setUploadContext('purchase');
              setUploadModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Scan Bill (Kannada/English OCR)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Total Purchases (MTD)"
          value={`₹${totalPurchaseValue.toLocaleString()}`}
          subValue={`${purchases.length} invoices registered`}
        />
        <MetricCard
          label="Price Hike Exceptions"
          value={activeHikesCount}
          subValue="Increases >5% threshold"
          trend={activeHikesCount > 0 ? 'down' : 'up'}
          trendValue={activeHikesCount > 0 ? 'Action Required' : 'Stable'}
        />
        <MetricCard
          label="Registered Vendors"
          value={vendors.length}
          subValue="APMC & Direct Mills"
        />
        <MetricCard
          label="Pending Approvals"
          value={pendingPurchases}
          subValue="Awaiting purchase manager"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-md text-xs">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'invoices' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Purchase Invoices ({purchases.length})
        </button>
        <button
          onClick={() => setActiveTab('price-hikes')}
          className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'price-hikes' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Price Hike Alerts ({priceHikeAlerts.length})
          {activeHikesCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'vendors' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Vendor Directory ({vendors.length})
        </button>
        <button
          onClick={() => setActiveTab('ocr-intake')}
          className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'ocr-intake' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Purchase OCR Review (Kannada / English Bills)
        </button>
      </div>

      {/* TAB: Invoices */}
      {activeTab === 'invoices' && (
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="px-3.5 py-2.5">Invoice #</th>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Vendor Name</th>
                  <th className="px-3 py-2.5">Destination</th>
                  <th className="px-3 py-2.5">Items Summary</th>
                  <th className="px-3 py-2.5 text-right">Subtotal</th>
                  <th className="px-3 py-2.5 text-right">Total Amount</th>
                  <th className="px-3 py-2.5 text-center">OCR Mode</th>
                  <th className="px-3 py-2.5 text-center">Status</th>
                  <th className="px-3 py-2.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {purchases.map((pur) => (
                  <tr key={pur.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="px-3.5 py-2.5 font-bold text-slate-900">
                      {pur.invoiceNumber}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">
                      {pur.date}
                    </td>
                    <td className="px-3 py-2.5 font-sans font-medium text-slate-800">
                      {pur.vendorName}
                    </td>
                    <td className="px-3 py-2.5 font-sans text-slate-600">
                      {pur.destination}
                    </td>
                    <td className="px-3 py-2.5 font-sans text-slate-600 max-w-xs truncate">
                      {pur.items.map((i) => `${i.quantity}${i.unit} ${i.ingredientName}`).join(', ')}
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-600 tabular-nums">
                      ₹{pur.subtotal.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold text-slate-900 tabular-nums">
                      ₹{pur.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-center font-sans">
                      <span className="text-[11px] px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                        {pur.ocrLanguage || 'English Typed'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center font-sans">
                      <StatusBadge status={pur.status} />
                    </td>
                    <td className="px-3 py-2.5 text-center font-sans">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedInvoice(pur)}
                          className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                          title="View Invoice Items"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {pur.status !== 'Approved' && (
                          <button
                            onClick={() => approvePurchase(pur.id)}
                            className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                            title="Approve for Payment"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Price Hike Alerts */}
      {activeTab === 'price-hikes' && (
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
            <div className="text-rose-900 leading-relaxed">
              <strong>Price Hike Detection Policy:</strong> Any bulk ingredient unit price increasing by more than <strong>5.0%</strong> compared to previous procurement requires formal management exception review, hypothesis validation, and alternate APMC price comparison.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priceHikeAlerts.map((hike) => (
              <div
                key={hike.id}
                className="bg-white border border-slate-200 rounded-md p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono text-[11px] text-slate-500 font-semibold">{hike.id}</span>
                    <span className="px-2 py-0.5 text-xs font-bold font-mono rounded bg-rose-100 text-rose-800">
                      +{hike.percentIncrease}% Hike
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{hike.ingredientName}</h3>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Vendor: <strong className="text-slate-800">{hike.vendorName}</strong>
                  </div>

                  {/* Price Comparison Block */}
                  <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 border border-slate-200 rounded text-xs font-mono mt-3">
                    <div>
                      <span className="text-[10px] text-slate-500 font-sans block">Previous Unit Price</span>
                      <span className="text-slate-700 font-semibold">₹{hike.previousUnitPrice} / {hike.unit}</span>
                      <span className="text-[10px] text-slate-400 block font-sans">{hike.previousDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-sans block">Current Invoiced Price</span>
                      <span className="text-rose-700 font-bold">₹{hike.currentUnitPrice} / {hike.unit}</span>
                      <span className="text-[10px] text-slate-400 block font-sans">{hike.currentDate}</span>
                    </div>
                  </div>

                  {/* Market Benchmark & Alternate */}
                  <div className="text-[11px] text-slate-600 space-y-1 mt-3">
                    {hike.alternativeVendorBestPrice && (
                      <div className="p-1.5 bg-emerald-50/70 border border-emerald-200 rounded text-emerald-900">
                        <strong>Alternate Available:</strong> ₹{hike.alternativeVendorBestPrice}/{hike.unit} via {hike.alternativeVendorName}
                      </div>
                    )}
                    {hike.marketBenchmarkNote && (
                      <div className="text-slate-500 italic">
                        &quot;{hike.marketBenchmarkNote}&quot;
                      </div>
                    )}
                    <div className="pt-1 text-slate-700">
                      <strong>Investigation Hypothesis:</strong> {hike.investigationHypothesis}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <StatusBadge status={hike.status} />
                  {hike.status === 'Needs Approval' ? (
                    <button
                      onClick={() => setSelectedHike(hike)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
                    >
                      Review & Approve Exception
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500">Resolved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Vendors */}
      {activeTab === 'vendors' && (
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-3.5 py-2.5">Vendor ID & Name</th>
                <th className="px-3 py-2.5">Category Supplied</th>
                <th className="px-3 py-2.5">Contact Person</th>
                <th className="px-3 py-2.5">Phone</th>
                <th className="px-3 py-2.5">GSTIN</th>
                <th className="px-3 py-2.5">Payment Terms</th>
                <th className="px-3 py-2.5 text-center">Quality Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-3.5 py-2.5">
                    <div className="font-bold text-slate-900">{v.name}</div>
                    <div className="font-mono text-[11px] text-slate-500">{v.id}</div>
                  </td>
                  <td className="px-3 py-2.5 text-slate-700">{v.category}</td>
                  <td className="px-3 py-2.5 text-slate-700">{v.contactPerson}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-600">{v.phone}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-600">{v.gstNumber}</td>
                  <td className="px-3 py-2.5 text-slate-700">{v.paymentTerms}</td>
                  <td className="px-3 py-2.5 text-center font-bold text-teal-800">★ {v.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: Dedicated Purchase OCR Review */}
      {activeTab === 'ocr-intake' && (
        <div className="bg-white border border-slate-200 rounded-md p-5 text-xs space-y-4">
          <div className="flex justify-between items-start pb-3 border-b border-slate-200">
            <div>
              <span className="text-teal-700 font-bold uppercase tracking-wider text-[10px]">
                Central Kitchen Inward Procurement · Staged Sarvam OCR Adapter
              </span>
              <h2 className="text-sm font-bold text-slate-900 mt-0.5">
                Vendor Invoice &amp; Mandi Bill OCR Extraction Review Queue
              </h2>
              <p className="text-slate-500 text-[11px]">
                Specialized parser for Kannada handwritten mandi receipts, English handwritten chits, and computer tax bills
              </p>
            </div>
            <span className="font-mono text-slate-500 text-[11px] bg-slate-100 px-2 py-1 rounded">
              CONFIDENCE: {(ocrConfidence * 100).toFixed(0)}%
            </span>
          </div>

          {/* Sample Selectors */}
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded">
            <span className="font-medium text-slate-700 text-[11px]">Test Script Format:</span>
            {(['Kannada Handwritten', 'English Handwritten', 'English Typed'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setOcrSampleType(type);
                  if (type === 'Kannada Handwritten') {
                    setOcrVendorName('Bengaluru Wholesale Veg Mandi Syndicate');
                    setOcrBillNumber('V-MANDI-710');
                    setOcrItemName('Nashik Big Red Onion (Grade A)');
                    setOcrQty('400');
                    setOcrPrice('38.00');
                    setOcrConfidence(0.86);
                  } else if (type === 'English Handwritten') {
                    setOcrVendorName('Krishna Dairy & Paneer Works');
                    setOcrBillNumber('KD-MANUAL-112');
                    setOcrItemName('Malai Fresh Paneer Blocks');
                    setOcrQty('120');
                    setOcrPrice('340.00');
                    setOcrConfidence(0.81);
                  } else {
                    setOcrVendorName('Sri Venkateshwara Agro Traders');
                    setOcrBillNumber('INV-SVA-8821');
                    setOcrItemName('Sona Masoori Rice Premium Aged');
                    setOcrQty('500');
                    setOcrPrice('58.00');
                    setOcrConfidence(0.97);
                  }
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  ocrSampleType === type ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Extracted Fields Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Extracted Vendor Name</label>
              <input
                type="text"
                value={ocrVendorName}
                onChange={(e) => setOcrVendorName(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs bg-white font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Invoiced Bill / Mandi Slip #</label>
              <input
                type="text"
                value={ocrBillNumber}
                onChange={(e) => setOcrBillNumber(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Ingredient / Item Description</label>
              <input
                type="text"
                value={ocrItemName}
                onChange={(e) => setOcrItemName(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-xs bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Quantity (kg)</label>
                <input
                  type="number"
                  value={ocrQty}
                  onChange={(e) => setOcrQty(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-xs bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Unit Rate (₹/kg)</label>
                <input
                  type="number"
                  value={ocrPrice}
                  onChange={(e) => setOcrPrice(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-xs bg-white font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Price Warning if hike */}
          {parseFloat(ocrPrice) > 35 && ocrItemName.includes('Onion') && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-900 space-y-1">
              <strong className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                Price Hike Alert Detected (+18.75% increase over prior purchase @ ₹32/kg):
              </strong>
              <p>
                Inward rate of ₹{ocrPrice}/kg triggers a procurement exception. Alternate vendor Kalaspalyam Mandi Benchmark is ₹35/kg.
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              DESTINATION: BIT CENTRAL KITCHEN (PEENYA)
            </span>
            <button
              onClick={() => {
                setActiveTab('invoices');
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
            >
              Verify &amp; Post Bill to Purchase Register
            </button>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-2xl p-5 text-xs space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <div>
                <span className="font-mono text-slate-500 font-semibold">{selectedInvoice.invoiceNumber}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedInvoice.vendorName}</h3>
                <span className="text-slate-500">Date: {selectedInvoice.date} · Destination: {selectedInvoice.destination}</span>
              </div>
              <StatusBadge status={selectedInvoice.status} />
            </div>

            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-2">Item Description</th>
                    <th className="p-2 text-right">Quantity</th>
                    <th className="p-2 text-right">Unit Price</th>
                    <th className="p-2 text-right">GST %</th>
                    <th className="p-2 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {selectedInvoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2 font-sans font-medium text-slate-900">{item.ingredientName}</td>
                      <td className="p-2 text-right">{item.quantity} {item.unit}</td>
                      <td className="p-2 text-right">₹{item.unitPrice.toFixed(2)}</td>
                      <td className="p-2 text-right">{item.taxRatePct}%</td>
                      <td className="p-2 text-right font-bold">₹{item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-200 font-mono">
              <span className="font-sans text-slate-600">Total Invoiced Amount (with Tax)</span>
              <span className="text-base font-bold text-slate-900">₹{selectedInvoice.totalAmount.toLocaleString()}</span>
            </div>

            {selectedInvoice.notes && (
              <p className="text-slate-600 italic text-[11px]">Note: {selectedInvoice.notes}</p>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-3 py-1.5 border border-slate-200 rounded text-xs font-medium"
              >
                Close
              </button>
              {selectedInvoice.status !== 'Approved' && (
                <button
                  onClick={() => {
                    approvePurchase(selectedInvoice.id);
                    setSelectedInvoice(null);
                  }}
                  className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-medium"
                >
                  Approve Purchase Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Price Hike Approval Dialog */}
      {selectedHike && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-lg p-5 text-xs space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <span className="text-rose-600 font-bold uppercase tracking-wider text-[10px]">
                Management Price Hike Override
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Authorize +{selectedHike.percentIncrease}% Increase for {selectedHike.ingredientName}
              </h3>
            </div>

            <div className="space-y-2 text-slate-700">
              <p>
                Previous price: <strong>₹{selectedHike.previousUnitPrice}/{selectedHike.unit}</strong> → Current: <strong>₹{selectedHike.currentUnitPrice}/{selectedHike.unit}</strong>
              </p>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px]">
                <strong>Vendor Justification:</strong> {selectedHike.vendorReasonSupplied || 'Crop shortage reported'}
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Management Audit Justification Note:
                </label>
                <textarea
                  value={hikeOverrideNote}
                  onChange={(e) => setHikeOverrideNote(e.target.value)}
                  placeholder="e.g. Sourced as temporary buffer stock while secondary vendor contract is finalized"
                  rows={3}
                  className="w-full border border-slate-300 rounded p-2 text-xs focus:outline-hidden focus:border-slate-500 bg-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedHike(null)}
                className="px-3 py-1.5 border border-slate-200 rounded text-xs font-medium text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApproveHike(selectedHike.id)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-medium"
              >
                Confirm Exception Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
