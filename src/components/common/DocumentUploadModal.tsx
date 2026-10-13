import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  UploadCloud,
  FileText,
  Check,
  AlertCircle,
  RefreshCw,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { ExpenseCategory } from '../../types';

export const DocumentUploadModal: React.FC = () => {
  const {
    uploadModalOpen,
    setUploadModalOpen,
    uploadContext,
    outlets,
    addExpense,
    addPurchase,
    vendors
  } = useApp();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // OCR Extraction preview data (editable fields)
  const [ocrType, setOcrType] = useState<'Kannada Handwritten' | 'English Handwritten' | 'English Typed' | 'PDF Invoice'>('Kannada Handwritten');
  const [candidateDate, setCandidateDate] = useState('2026-10-09');
  const [candidateDocNumber, setCandidateDocNumber] = useState('MND-KN-882');
  const [candidateCostCenter, setCandidateCostCenter] = useState<'Central Kitchen Expenses' | 'Branch Outlet Expenses'>('Branch Outlet Expenses');
  const [candidateOutletId, setCandidateOutletId] = useState(outlets[0].id);
  const [candidateCategory, setCandidateCategory] = useState<ExpenseCategory>('Outlet grocery needs and petty expenses');
  const [candidateAmount, setCandidateAmount] = useState('1650');
  const [candidateDescription, setCandidateDescription] = useState('Fresh onions, green chillies & local cold ginger (Handwritten Mandi voucher)');
  const [candidateVendorId, setCandidateVendorId] = useState(vendors[0].id);
  const [confidence, setConfidence] = useState(0.88);

  if (!uploadModalOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const simulateProcessing = (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setIsProcessed(false);

    setTimeout(() => {
      setIsProcessing(false);
      setIsProcessed(true);

      const fname = file.name.toLowerCase();
      if (fname.includes('kannada') || fname.includes('mandi')) {
        setOcrType('Kannada Handwritten');
        setConfidence(0.89);
        setCandidateDocNumber('APMC-KN-7102');
        setCandidateAmount('1650');
        setCandidateDescription('Handwritten Mandi Voucher (ತರಕಾರಿ ರಶೀದಿ): Onions, Green Chillies, Ginger');
        setCandidateCategory('Outlet grocery needs and petty expenses');
      } else if (fname.includes('handwritten') || fname.includes('repair')) {
        setOcrType('English Handwritten');
        setConfidence(0.82);
        setCandidateDocNumber('REP-MCH-441');
        setCandidateAmount('3200');
        setCandidateDescription('Technician repair and spare gasket replacement invoice');
        setCandidateCategory('Repairs and maintenance');
      } else {
        setOcrType('PDF Invoice');
        setConfidence(0.96);
        setCandidateDocNumber('TAX-INV-2026-904');
        setCandidateAmount('18500');
        setCandidateDescription('Commercial Food Packaging & Biodegradable Parcels');
        setCandidateCategory('Parcels and disposables');
      }
    }, 850);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateProcessing(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateProcessing(e.target.files[0]);
    }
  };

  const handlePostRecord = () => {
    const numAmount = parseFloat(candidateAmount) || 0;

    if (uploadContext === 'expense') {
      addExpense({
        date: candidateDate,
        costCenter: candidateCostCenter,
        outletId: candidateCostCenter === 'Branch Outlet Expenses' ? candidateOutletId : undefined,
        centralKitchenId: candidateCostCenter === 'Central Kitchen Expenses' ? 'BIT-CK-001' : undefined,
        category: candidateCategory,
        description: candidateDescription,
        amount: numAmount,
        paymentMethod: 'Petty Cash',
        paidTo: 'Local Mandi / Merchant',
        status: 'Pending Approval',
        sourceDocument: {
          fileName: selectedFile?.name || 'uploaded_voucher.pdf',
          fileSize: `${((selectedFile?.size || 450000) / 1024).toFixed(0)} KB`,
          extractedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          confidence,
          ocrType
        }
      });
    } else {
      const selectedVendor = vendors.find((v) => v.id === candidateVendorId) || vendors[0];
      addPurchase({
        invoiceNumber: candidateDocNumber,
        vendorId: selectedVendor.id,
        vendorName: selectedVendor.name,
        date: candidateDate,
        dueDate: '2026-10-24',
        destination: candidateCostCenter === 'Central Kitchen Expenses' ? 'Central Kitchen' : 'Branch Direct',
        outletId: candidateCostCenter === 'Branch Outlet Expenses' ? candidateOutletId : undefined,
        items: [
          {
            id: `item-${Date.now()}`,
            ingredientName: candidateDescription,
            category: 'Raw Grocery',
            quantity: 50,
            unit: 'kg',
            unitPrice: numAmount / 50,
            previousUnitPrice: (numAmount / 50) * 0.95,
            taxRatePct: 5,
            total: numAmount
          }
        ],
        subtotal: numAmount * 0.95,
        taxTotal: numAmount * 0.05,
        totalAmount: numAmount,
        paymentStatus: 'Unpaid',
        ocrStatus: confidence > 0.9 ? 'Auto-Extracted High' : 'Needs Verification',
        ocrLanguage: ocrType === 'Kannada Handwritten' ? 'Kannada Handwritten' : 'English Typed',
        status: 'Pending Review',
        notes: `Simulated OCR posted invoice from ${selectedFile?.name || 'document'}`
      });
    }

    setUploadModalOpen(false);
    setSelectedFile(null);
    setIsProcessed(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">
                {uploadContext === 'expense'
                  ? 'Expense PDF / Mandi Bill Extraction (OCR Review)'
                  : 'Central Kitchen Purchase Bill Intake (Kannada & English OCR)'}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200">
                DEMO / STAGED SARVAM OCR
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Supports Kannada handwritten mandi slips, English handwritten service receipts, and typed PDF tax bills
            </p>
          </div>
          <button
            onClick={() => setUploadModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split Screen View */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5">
          {!selectedFile ? (
            /* Upload Landing State */
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
                }`}
              >
                <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <div className="text-sm font-bold text-slate-800 mb-1">
                  Drag and drop your receipt, mandi slip, or PDF invoice here
                </div>
                <p className="text-slate-500 text-xs mb-4">
                  Accepts scanned images (JPG, PNG) or digital vouchers (PDF up to 15MB)
                </p>
                <label className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium cursor-pointer transition-colors shadow-xs">
                  Choose File from Computer
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              </div>

              {/* Sample Preloads for Immediate Testing */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                <span className="font-semibold text-slate-700 block mb-2">
                  Test immediately with realistic operational sample documents:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      simulateProcessing(new File(['kannada_mandi'], 'mandi_slip_kannada_veggies.jpg', { type: 'image/jpeg' }))
                    }
                    className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-left transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-slate-800 text-xs">1. Kannada Handwritten</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Yeshwanthpur Mandi vegetable slip</div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      simulateProcessing(new File(['repair_bill'], 'technician_repair_voucher.pdf', { type: 'application/pdf' }))
                    }
                    className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-left transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-slate-800 text-xs">2. English Handwritten</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Kitchen burner repair &amp; spare receipt</div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      simulateProcessing(new File(['parcels_bill'], 'packaging_tax_invoice.pdf', { type: 'application/pdf' }))
                    }
                    className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-left transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-slate-800 text-xs">3. English Typed Tax Bill</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Biodegradable parcels with GSTIN</div>
                  </button>
                </div>
              </div>
            </div>
          ) : isProcessing ? (
            /* Processing State */
            <div className="p-16 text-center border border-slate-200 rounded-lg bg-slate-50">
              <RefreshCw className="w-8 h-8 text-teal-700 animate-spin mx-auto mb-3" />
              <div className="font-bold text-slate-900 text-sm">
                Parsing Document via Sarvam Vision OCR (Simulated)...
              </div>
              <p className="text-slate-500 text-xs mt-1 max-w-md mx-auto leading-relaxed">
                Extracting Kannada script, handwritten numerals, line items, dates, and total amount.
              </p>
            </div>
          ) : (
            /* Split Screen Verification Workspace */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Visual Document Preview (5 cols) */}
              <div className="lg:col-span-5 bg-slate-100 border border-slate-300 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="truncate max-w-[150px]">{selectedFile.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                      className="p-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-600"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-slate-600 px-1">{zoomLevel}%</span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                      className="p-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-600"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Simulated Document Canvas */}
                <div
                  className="bg-amber-50/40 border border-amber-200 rounded p-4 font-mono text-xs shadow-inner min-h-[360px] flex flex-col justify-between"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
                >
                  <div className="space-y-3">
                    <div className="border-b border-amber-300 pb-2 text-center">
                      {ocrType === 'Kannada Handwritten' ? (
                        <>
                          <div className="font-bold text-slate-900 text-sm tracking-wide">
                            ಶ್ರೀ ಮಂಜುನಾಥ ತರಕಾರಿ ಮಂಡಿ
                          </div>
                          <div className="text-[10px] text-slate-600 font-sans">
                            ಯಶವಂತಪುರ ಎಪಿಎಂಸಿ ಯಾರ್ಡ್, ಬೆಂಗಳೂರು · ರಶೀದಿ ನಂ: {candidateDocNumber}
                          </div>
                        </>
                      ) : ocrType === 'English Handwritten' ? (
                        <>
                          <div className="font-bold text-slate-900 text-sm">
                            SRI VENKATESHWARA SERVICES
                          </div>
                          <div className="text-[10px] text-slate-600 font-sans">
                            Commercial Kitchen Equipment Works · Slip #{candidateDocNumber}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="font-bold text-slate-900 text-sm">
                            ECO-PACK SOLUTIONS PVT LTD
                          </div>
                          <div className="text-[10px] text-slate-600 font-sans">
                            GSTIN: 29AABCB1234F1Z8 · Tax Invoice #{candidateDocNumber}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-700">
                      <span>ದಿನಾಂಕ / Date: {candidateDate}</span>
                      <span>ಗ್ರಾಹಕ: BIT Kitchens</span>
                    </div>

                    <div className="border border-dashed border-amber-300 rounded p-2 text-[11px] space-y-1 bg-white/70">
                      <div className="font-semibold text-slate-900 border-b border-amber-200 pb-1 flex justify-between">
                        <span>Particulars</span>
                        <span>Amount</span>
                      </div>
                      <div className="flex justify-between text-slate-800">
                        <span>{candidateDescription}</span>
                        <span className="font-bold">₹{candidateAmount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-amber-300 text-[10px] flex justify-between items-end text-slate-600 font-sans">
                    <div>
                      <span>ಸಹಿ / Sign: verified</span>
                      <div className="font-mono text-[9px] text-slate-400 mt-0.5">
                        Extracted via Sarvam Indic OCR v2.1
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-emerald-600 flex items-center justify-center text-[8px] text-emerald-800 font-bold uppercase rotate-12">
                      PAID CASH
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Confidence: <strong className="text-emerald-700 font-mono">{(confidence * 100).toFixed(0)}% Match</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setIsProcessed(false);
                    }}
                    className="text-rose-600 hover:underline"
                  >
                    Change File
                  </button>
                </div>
              </div>

              {/* Right Column: Editable Fields & Ledger Mapping (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-slate-900 text-xs">
                      Verify &amp; Edit Extracted Data
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Target: <strong className="text-slate-800">{candidateCostCenter}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">OCR Document Format</label>
                    <select
                      value={ocrType}
                      onChange={(e) => setOcrType(e.target.value as any)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden focus:border-slate-500"
                    >
                      <option value="Kannada Handwritten">Kannada Handwritten (Mandi / Local Slips)</option>
                      <option value="English Handwritten">English Handwritten (Field Receipt)</option>
                      <option value="English Typed">English Typed (Computer Invoice)</option>
                      <option value="PDF Invoice">PDF Invoice (Digital Tax Bill)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Voucher / Bill Date</label>
                    <input
                      type="date"
                      value={candidateDate}
                      onChange={(e) => setCandidateDate(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden focus:border-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Bill / Voucher Reference Number</label>
                    <input
                      type="text"
                      value={candidateDocNumber}
                      onChange={(e) => setCandidateDocNumber(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono bg-white focus:outline-hidden focus:border-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Verified Net Amount (₹)</label>
                    <input
                      type="number"
                      value={candidateAmount}
                      onChange={(e) => setCandidateAmount(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 bg-white focus:outline-hidden focus:border-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Cost Center Classification</label>
                    <select
                      value={candidateCostCenter}
                      onChange={(e) => setCandidateCostCenter(e.target.value as any)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden focus:border-slate-500"
                    >
                      <option value="Branch Outlet Expenses">Branch Outlet Expenses</option>
                      <option value="Central Kitchen Expenses">Central Kitchen Expenses</option>
                    </select>
                  </div>

                  {candidateCostCenter === 'Branch Outlet Expenses' ? (
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Assign to Outlet ID</label>
                      <select
                        value={candidateOutletId}
                        onChange={(e) => setCandidateOutletId(e.target.value)}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden focus:border-slate-500"
                      >
                        {outlets.map((outlet) => (
                          <option key={outlet.id} value={outlet.id}>
                            {outlet.id} - {outlet.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Central Kitchen Scope</label>
                      <input
                        type="text"
                        readOnly
                        value="BIT-CK-001 (Peenya Base 1)"
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-slate-50 font-mono text-slate-600"
                      />
                    </div>
                  )}

                  {uploadContext === 'expense' ? (
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-medium mb-1">Expense Category (Locked Hierarchy)</label>
                      <select
                        value={candidateCategory}
                        onChange={(e) => setCandidateCategory(e.target.value as any)}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden focus:border-slate-500"
                      >
                        <option value="Outlet grocery needs and petty expenses">Outlet grocery needs and petty expenses</option>
                        <option value="Transport">Transport</option>
                        <option value="Water">Water</option>
                        <option value="Worker convenience">Worker convenience</option>
                        <option value="Repairs and maintenance">Repairs and maintenance</option>
                        <option value="Parcels and disposables">Parcels and disposables</option>
                        <option value="Outlet rent">Outlet rent</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Kitchen gas (LPG)">Kitchen gas (LPG)</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                      </select>
                    </div>
                  ) : (
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-medium mb-1">Matched Vendor (Central Kitchen)</label>
                      <select
                        value={candidateVendorId}
                        onChange={(e) => setCandidateVendorId(e.target.value)}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden focus:border-slate-500"
                      >
                        {vendors.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.category} · Rating: {v.rating}★)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-medium mb-1">Extracted Line Items / Particulars</label>
                    <textarea
                      rows={2}
                      value={candidateDescription}
                      onChange={(e) => setCandidateDescription(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-hidden focus:border-slate-500"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 flex items-start gap-2">
                  <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span>
                    No duplicate entry detected for ₹{candidateAmount} on {candidateDate}. Confirming will record this voucher in the pending audit queue for management approval.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-mono">
            ENGINE: SARVAM OCR INDIC V2 (DEMO STUB)
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-100 rounded text-slate-700 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!isProcessed}
              onClick={handlePostRecord}
              className={`px-4 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isProcessed
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              Confirm &amp; Post to Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
