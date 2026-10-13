export type Role =
  | 'Platform Administrator'
  | 'Restaurant Group Administrator'
  | 'Brand/Management User'
  | 'Central Kitchen Manager'
  | 'Outlet Manager'
  | 'Accountant'
  | 'Purchase Manager'
  | 'HR/Salary Administrator'
  | 'Cashier'
  | 'Kitchen Staff'
  | 'Read-Only Auditor';

export interface Tenant {
  id: string;
  name: string;
  code: string;
  legalEntity: string;
  taxNumber: string;
  currency: string;
}

export interface Brand {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  cuisine: string;
  logoUrl?: string;
  activeOutletsCount: number;
}

export interface CentralKitchen {
  id: string;
  tenantId: string;
  brandId: string;
  name: string;
  code: string;
  address: string;
  managerName: string;
  phone: string;
  dailyCapacityKg: number;
  currentUtilizationPct: number;
}

export interface Outlet {
  id: string;
  tenantId: string;
  brandId: string;
  centralKitchenId: string;
  name: string;
  code: string;
  type: 'Dine-In & Delivery' | 'High Volume Delivery' | 'Express Counter' | 'Cloud Kitchen' | 'Food Court';
  address: string;
  managerName: string;
  phone: string;
  tablesCount: number;
  grossSalesToday: number;
  netSalesToday: number;
  expensesToday: number;
  foodCostPct: number;
  grossMarginPct: number;
  cashVariance: number;
  settlementStatus: 'Settled' | 'Pending Review' | 'Discrepancy';
  dayEndStatus: 'Completed' | 'Pending Cutoff' | 'Delayed' | 'Missing';
  cutoffTime: string;
  trend: 'up' | 'down' | 'stable';
  attentionRequired: boolean;
  attentionReason?: string;
}

export type CostCenterType = 'Central Kitchen Expenses' | 'Branch Outlet Expenses';

export type ExpenseCategory =
  | 'Transport'
  | 'Water'
  | 'Worker convenience'
  | 'Outlet grocery needs and petty expenses'
  | 'Repairs and maintenance'
  | 'Miscellaneous'
  | 'Parcels and disposables'
  | 'Outlet rent'
  | 'Staff accommodation rent'
  | 'Salaries'
  | 'Daily wages'
  | 'Overtime'
  | 'Salary advances'
  | 'Electricity'
  | 'Kitchen gas (LPG)'
  | 'Cleaning & hygiene';

export interface ExpenseRecord {
  id: string;
  voucherNumber: string;
  date: string;
  costCenter: CostCenterType;
  outletId?: string; // required if costCenter === 'Branch Outlet Expenses'
  centralKitchenId?: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'UPI' | 'Petty Cash';
  paidTo: string;
  approvedBy?: string;
  status: 'Approved' | 'Pending Approval' | 'Rejected' | 'Needs Review';
  sourceDocument?: {
    fileName: string;
    fileSize: string;
    extractedAt: string;
    confidence: number;
    ocrType: 'PDF Invoice' | 'Kannada Handwritten' | 'English Handwritten' | 'English Typed';
  };
  isDuplicateWarning?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  gstNumber: string;
  rating: number;
  paymentTerms: string;
  activeOrdersCount: number;
}

export interface PurchaseItem {
  id: string;
  ingredientName: string;
  category: string;
  quantity: number;
  unit: 'kg' | 'liters' | 'units' | 'bags' | 'boxes';
  unitPrice: number;
  previousUnitPrice: number;
  taxRatePct: number;
  total: number;
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  date: string;
  dueDate: string;
  destination: 'Central Kitchen' | 'Branch Direct';
  outletId?: string;
  items: PurchaseItem[];
  subtotal: number;
  taxTotal: number;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial';
  ocrStatus: 'Manual Entry' | 'Auto-Extracted High' | 'Auto-Extracted Medium' | 'Needs Verification';
  ocrLanguage?: 'English Typed' | 'English Handwritten' | 'Kannada Handwritten';
  status: 'Approved' | 'Pending Review' | 'Flagged Price Hike';
  notes?: string;
}

export interface PriceHikeAlert {
  id: string;
  ingredientName: string;
  vendorName: string;
  previousUnitPrice: number;
  currentUnitPrice: number;
  unit: string;
  previousDate: string;
  currentDate: string;
  absoluteIncrease: number;
  percentIncrease: number;
  alternativeVendorBestPrice?: number;
  alternativeVendorName?: string;
  marketBenchmarkNote?: string;
  vendorReasonSupplied?: string;
  investigationHypothesis: string;
  status: 'Needs Approval' | 'Approved Exception' | 'Vendor Re-Negotiation' | 'Rejected';
}

export type SalesChannel =
  | 'Counter Cash'
  | 'Quick UPI'
  | 'Builder POS'
  | 'MobiKwik'
  | 'Swiggy'
  | 'Zomato'
  | 'Ownly'
  | 'Tipplr'
  | 'Catering';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface OrderRecord {
  id: string;
  outletId: string;
  outletName: string;
  orderNumber: string;
  timestamp: string;
  channel: SalesChannel;
  isOnline: boolean;
  orderType: 'Dine-In' | 'Takeaway' | 'Delivery' | 'Catering';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  packagingCharge: number;
  totalAmount: number;
  channelFeeDeducted: number; // e.g. aggregator commission or 2.5% premium card fee
  netSettlementExpected: number;
  paymentMethod: string;
  status: 'New' | 'Accepted' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
  customerName?: string;
  prepMinutes: number;
  priority: 'Normal' | 'Rush' | 'VIP';
}

export interface CashReconciliationRecord {
  id: string;
  date: string;
  outletId: string;
  outletName: string;
  openingCash: number;
  recordedCashSales: number;
  verifiedNonCashSales: number;
  refundsAndAdjustments: number;
  expectedCashInDrawer: number;
  actualCountedCash: number;
  varianceAmount: number; // actual - expected
  cashDepositedToBank: number;
  bankDepositSlipNumber?: string;
  explanation: string;
  verifiedBy: string;
  status: 'Balanced' | 'Variance Approved' | 'Unresolved Discrepancy';
}

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  assignmentType: 'Central Kitchen' | 'Branch Outlet';
  outletId?: string;
  outletName?: string;
  role: string;
  employmentType: 'Full-Time' | 'Daily Wage' | 'Part-Time' | 'Contract';
  phone: string;
  dailyWageRate?: number;
  monthlyBaseSalary?: number;
  activeStatus: 'Active' | 'On Leave' | 'Terminated';
  joinedDate: string;
  hasAccommodation: boolean;
  accommodationRoomId?: string;
  accommodationRentAttribution: number;
  currentAdvanceBalance: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  outletId?: string;
  status: 'Present' | 'Absent' | 'Paid Leave' | 'Half Day';
  shift: 'Morning' | 'Evening' | 'Full Day';
  hoursWorked: number;
  overtimeHours: number;
  overtimeRatePerHour: number;
  calculatedDailyWage: number;
  overtimePay: number;
  totalDayEarnings: number;
}

export interface SalaryAdvanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  outletId?: string;
  requestDate: string;
  amount: number;
  approvedAmount: number;
  reason: string;
  repaymentPlan: string;
  approvedBy: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Fully Recovered';
  currentOutstanding: number;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'Raw Grocery' | 'Dairy & Poultry' | 'Spices & Oils' | 'Packaging & Disposables' | 'Prepared Gravies / Bases';
  location: 'Central Kitchen' | 'Outlet';
  outletId?: string;
  quantityOnHand: number;
  unit: string;
  reorderLevel: number;
  unitCost: number;
  totalValue: number;
  lastUpdated: string;
}

export interface ProductionPlan {
  id: string;
  batchNumber: string;
  recipeName: string;
  targetQuantityKg: number;
  preparedQuantityKg: number;
  wasteQuantityKg: number;
  productionCost: number;
  date: string;
  status: 'Scheduled' | 'In Production' | 'Quality Check' | 'Ready for Branch Allocation' | 'Completed';
  chiefCook: string;
  allocations: {
    outletId: string;
    outletName: string;
    allocatedKg: number;
    receiptStatus: 'Dispatched' | 'Acknowledged Received' | 'Variance Reported';
  }[];
}

export interface PaymentIntegration {
  id: string;
  provider: 'MobiKwik' | 'Builder POS / Billing' | 'Quick UPI Provider' | 'Swiggy' | 'Zomato' | 'Ownly' | 'Tipplr' | 'Rapido Delivery Integration';
  type: 'Payment Aggregator' | 'POS System' | 'Food Delivery' | 'Dine-in Partner' | 'Delivery Logistics Provider';
  deliveryPartner?: string;
  connectionStatus: 'Connected' | 'Degraded' | 'Configured' | 'Disconnected';
  lastSync: string;
  settlementCadence: string;
  expectedNextSettlement: string;
  grossVolumeMTD: number;
  commissionFeesMTD: number;
  netPayableMTD: number;
  lastSettlementReceived: number;
  varianceStatus: 'Matched' | 'Under Investigation' | 'Pending Bank Credit';
  providerPortalUrl?: string;
  apiKeyMasked: string;
  outletsMappedCount: number;
}

export interface SettlementLedgerItem {
  id: string;
  provider: string;
  settlementCycleDate: string;
  payoutDate: string;
  outletId: string;
  outletName: string;
  grossSales: number;
  commissionDeducted: number;
  taxesAndTds: number;
  netExpected: number;
  actualBankCredit: number;
  variance: number;
  reconciliationStatus: 'Reconciled' | 'Variance Flagged' | 'Awaiting Settlement Report' | 'Dispute Lodged';
  bankReferenceNumber: string;
  disputeTicketId?: string;
  disputeReason?: string;
  disputeFiledAt?: string;
}

export interface WeeklyStrategyCard {
  id: string;
  domain: 'Demand Forecast' | 'Central Kitchen Production' | 'Price Hike Anomaly' | 'Expense Optimization' | 'Settlement Risk';
  title: string;
  actionPriority: 'High' | 'Medium' | 'Low';
  supportingData: string;
  recommendation: string;
  expectedImpact: string;
  confidenceScore: number;
  status: 'Active' | 'Dismissed' | 'Actioned';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: Role;
  action: string;
  module: string;
  targetEntityId: string;
  details: string;
  ipAddress: string;
}
