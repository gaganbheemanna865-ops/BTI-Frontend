import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  Tenant,
  Brand,
  CentralKitchen,
  Outlet,
  Role,
  ExpenseRecord,
  Vendor,
  PurchaseInvoice,
  PriceHikeAlert,
  OrderRecord,
  CashReconciliationRecord,
  Employee,
  AttendanceRecord,
  SalaryAdvanceRecord,
  InventoryItem,
  ProductionPlan,
  PaymentIntegration,
  SettlementLedgerItem,
  WeeklyStrategyCard,
  AuditLogEntry
} from '../types';
import {
  INITIAL_TENANT,
  INITIAL_BRAND,
  INITIAL_CENTRAL_KITCHEN,
  INITIAL_OUTLETS,
  INITIAL_EXPENSES,
  INITIAL_VENDORS,
  INITIAL_PURCHASES,
  INITIAL_PRICE_HIKE_ALERTS,
  INITIAL_ORDERS,
  INITIAL_CASH_RECONCILIATION,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_SALARY_ADVANCES,
  INITIAL_INVENTORY,
  INITIAL_PRODUCTION_PLANS,
  INITIAL_INTEGRATIONS,
  INITIAL_SETTLEMENTS,
  INITIAL_WEEKLY_STRATEGY,
  INITIAL_AUDIT_LOG
} from '../data/mockData';

export type AppScope = 'consolidated' | 'ck' | string; // 'consolidated', 'ck', or outlet ID

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  tenant: Tenant;
  brand: Brand;
  centralKitchen: CentralKitchen;
  outlets: Outlet[];
  activeScope: AppScope;
  setActiveScope: (scope: AppScope) => void;
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
  
  // Data entities
  expenses: ExpenseRecord[];
  vendors: Vendor[];
  purchases: PurchaseInvoice[];
  priceHikeAlerts: PriceHikeAlert[];
  orders: OrderRecord[];
  cashReconciliations: CashReconciliationRecord[];
  employees: Employee[];
  attendance: AttendanceRecord[];
  salaryAdvances: SalaryAdvanceRecord[];
  inventory: InventoryItem[];
  productionPlans: ProductionPlan[];
  integrations: PaymentIntegration[];
  settlements: SettlementLedgerItem[];
  weeklyStrategy: WeeklyStrategyCard[];
  auditLogs: AuditLogEntry[];

  // Mutators & actions
  approveExpense: (id: string) => void;
  rejectExpense: (id: string) => void;
  addExpense: (expense: Omit<ExpenseRecord, 'id' | 'voucherNumber'>) => void;
  approvePurchase: (id: string) => void;
  addPurchase: (purchase: Omit<PurchaseInvoice, 'id'>) => void;
  approvePriceHike: (id: string, notes: string) => void;
  updateOrderStatus: (id: string, status: OrderRecord['status']) => void;
  reconcileCash: (rec: Omit<CashReconciliationRecord, 'id'>) => void;
  addAdvanceRequest: (req: Omit<SalaryAdvanceRecord, 'id'>) => void;
  approveAdvance: (id: string) => void;
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  triggerDayEndSubmit: (outletId: string) => void;
  disputeSettlement: (id: string, ticketId: string, reason: string) => void;
  
  // Modals & UI state
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  uploadModalOpen: boolean;
  setUploadModalOpen: (open: boolean) => void;
  uploadContext: 'expense' | 'purchase' | 'ocr';
  setUploadContext: (ctx: 'expense' | 'purchase' | 'ocr') => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant] = useState<Tenant>(INITIAL_TENANT);
  const [brand] = useState<Brand>(INITIAL_BRAND);
  const [centralKitchen] = useState<CentralKitchen>(INITIAL_CENTRAL_KITCHEN);
  const [outlets, setOutlets] = useState<Outlet[]>(INITIAL_OUTLETS);
  const [activeScope, setActiveScope] = useState<AppScope>('consolidated');
  const [activeRole, setActiveRole] = useState<Role>('Platform Administrator');
  const [dateFilter, setDateFilter] = useState<string>('Today (09 Oct 2026)');
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);
  const [vendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [purchases, setPurchases] = useState<PurchaseInvoice[]>(INITIAL_PURCHASES);
  const [priceHikeAlerts, setPriceHikeAlerts] = useState<PriceHikeAlert[]>(INITIAL_PRICE_HIKE_ALERTS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [cashReconciliations, setCashReconciliations] = useState<CashReconciliationRecord[]>(INITIAL_CASH_RECONCILIATION);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [salaryAdvances, setSalaryAdvances] = useState<SalaryAdvanceRecord[]>(INITIAL_SALARY_ADVANCES);
  const [inventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [productionPlans] = useState<ProductionPlan[]>(INITIAL_PRODUCTION_PLANS);
  const [integrations] = useState<PaymentIntegration[]>(INITIAL_INTEGRATIONS);
  const [settlements, setSettlements] = useState<SettlementLedgerItem[]>(INITIAL_SETTLEMENTS);
  const [weeklyStrategy, setWeeklyStrategy] = useState<WeeklyStrategyCard[]>(INITIAL_WEEKLY_STRATEGY);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadContext, setUploadContext] = useState<'expense' | 'purchase' | 'ocr'>('expense');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAudit = (action: string, module: string, targetId: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: activeRole === 'Outlet Manager' ? 'Prashanth Gowda' : 'System Admin',
      role: activeRole,
      action,
      module,
      targetEntityId: targetId,
      details,
      ipAddress: '192.168.1.1'
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const approveExpense = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Approved', approvedBy: activeRole } : e))
    );
    logAudit('APPROVE_EXPENSE', 'Expenses', id, `Approved voucher ${id} in ${activeRole} scope`);
    addToast('success', 'Expense Approved', `Voucher ${id} has been marked as approved.`);
  };

  const rejectExpense = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Rejected' } : e))
    );
    logAudit('REJECT_EXPENSE', 'Expenses', id, `Rejected voucher ${id}`);
    addToast('warning', 'Expense Rejected', `Voucher ${id} has been rejected.`);
  };

  const addExpense = (expenseData: Omit<ExpenseRecord, 'id' | 'voucherNumber'>) => {
    const newId = `EXP-${Date.now().toString().slice(-4)}`;
    const newVoucher = `VCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRec: ExpenseRecord = {
      ...expenseData,
      id: newId,
      voucherNumber: newVoucher
    };
    setExpenses((prev) => [newRec, ...prev]);
    logAudit('CREATE_EXPENSE', 'Expenses', newId, `Added ${expenseData.category} expense ₹${expenseData.amount}`);
    addToast('success', 'Expense Logged', `Voucher ${newVoucher} recorded successfully.`);
  };

  const approvePurchase = (id: string) => {
    setPurchases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Approved' } : p))
    );
    logAudit('APPROVE_PURCHASE', 'Purchases', id, `Approved purchase invoice ${id}`);
    addToast('success', 'Purchase Invoice Approved', `Invoice ${id} approved for payment processing.`);
  };

  const addPurchase = (purchaseData: Omit<PurchaseInvoice, 'id'>) => {
    const newId = `PUR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRec: PurchaseInvoice = {
      ...purchaseData,
      id: newId
    };
    setPurchases((prev) => [newRec, ...prev]);
    logAudit('CREATE_PURCHASE', 'Purchases', newId, `Registered invoice ${purchaseData.invoiceNumber} from ${purchaseData.vendorName}`);
    addToast('success', 'Purchase Invoice Recorded', `Invoice ${newRec.invoiceNumber} added to registry.`);
  };

  const approvePriceHike = (id: string, notes: string) => {
    setPriceHikeAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Approved Exception', investigationHypothesis: `${a.investigationHypothesis} | Review: ${notes}` } : a))
    );
    logAudit('PRICE_HIKE_OVERRIDE', 'Purchases', id, `Approved price hike exception with justification: ${notes}`);
    addToast('info', 'Price Hike Approved', `Price variation for ${id} recorded as approved exception.`);
  };

  const updateOrderStatus = (id: string, status: OrderRecord['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    addToast('info', 'Order Status Updated', `Order ${id} is now ${status}.`);
  };

  const reconcileCash = (recData: Omit<CashReconciliationRecord, 'id'>) => {
    const newId = `CR-${Date.now().toString().slice(-4)}`;
    const newRec: CashReconciliationRecord = {
      ...recData,
      id: newId
    };
    setCashReconciliations((prev) => [newRec, ...prev]);
    logAudit('CASH_RECONCILIATION', 'Finance', newId, `Submitted cash reconciliation for ${recData.outletName} with variance ₹${recData.varianceAmount}`);
    addToast('success', 'Cash Drawer Reconciled', `Reconciliation for ${recData.outletName} saved successfully.`);
  };

  const addAdvanceRequest = (reqData: Omit<SalaryAdvanceRecord, 'id'>) => {
    const newId = `ADV-${Date.now().toString().slice(-4)}`;
    const newRec: SalaryAdvanceRecord = {
      ...reqData,
      id: newId
    };
    setSalaryAdvances((prev) => [newRec, ...prev]);
    logAudit('SALARY_ADVANCE_REQUEST', 'Employees', newId, `Advance request ₹${reqData.amount} for ${reqData.employeeName}`);
    addToast('info', 'Salary Advance Requested', `Advance request for ${reqData.employeeName} submitted.`);
  };

  const approveAdvance = (id: string) => {
    setSalaryAdvances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Approved', approvedBy: activeRole } : a))
    );
    logAudit('APPROVE_SALARY_ADVANCE', 'Employees', id, `Approved advance ${id}`);
    addToast('success', 'Salary Advance Approved', `Advance payment approved and added to balance ledger.`);
  };

  const markAttendance = (attData: Omit<AttendanceRecord, 'id'>) => {
    const newId = `ATT-${Date.now().toString().slice(-4)}`;
    const newRec: AttendanceRecord = {
      ...attData,
      id: newId
    };
    setAttendance((prev) => [newRec, ...prev]);
    addToast('success', 'Attendance Logged', `Logged attendance for ${attData.employeeName}.`);
  };

  const triggerDayEndSubmit = (outletId: string) => {
    setOutlets((prev) =>
      prev.map((o) =>
        o.id === outletId
          ? { ...o, dayEndStatus: 'Completed', attentionRequired: false }
          : o
      )
    );
    logAudit('DAY_END_SUBMISSION', 'Operations', outletId, `Submitted Day-End reconciliation before 1:00 PM cutoff`);
    addToast('success', 'Day-End Completed', `Outlet ${outletId} day-end audit finalized.`);
  };

  const disputeSettlement = (id: string, ticketId: string, reason: string) => {
    setSettlements((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              reconciliationStatus: 'Dispute Lodged',
              disputeTicketId: ticketId,
              disputeReason: reason,
              disputeFiledAt: new Date().toISOString().substring(0, 10)
            }
          : s
      )
    );
    logAudit('SETTLEMENT_DISPUTE_FILED', 'Finance', id, `Filed dispute ${ticketId}: ${reason}`);
    addToast('warning', 'Dispute Registered', `Claim #${ticketId} submitted for settlement ${id}.`);
  };

  const value = useMemo(
    () => ({
      tenant,
      brand,
      centralKitchen,
      outlets,
      activeScope,
      setActiveScope,
      activeRole,
      setActiveRole,
      dateFilter,
      setDateFilter,
      activeModule,
      setActiveModule,
      expenses,
      vendors,
      purchases,
      priceHikeAlerts,
      orders,
      cashReconciliations,
      employees,
      attendance,
      salaryAdvances,
      inventory,
      productionPlans,
      integrations,
      settlements,
      weeklyStrategy,
      auditLogs,
      approveExpense,
      rejectExpense,
      addExpense,
      approvePurchase,
      addPurchase,
      approvePriceHike,
      updateOrderStatus,
      reconcileCash,
      addAdvanceRequest,
      approveAdvance,
      markAttendance,
      triggerDayEndSubmit,
      disputeSettlement,
      searchModalOpen,
      setSearchModalOpen,
      notificationsOpen,
      setNotificationsOpen,
      uploadModalOpen,
      setUploadModalOpen,
      uploadContext,
      setUploadContext,
      toasts,
      addToast,
      removeToast
    }),
    [
      tenant,
      brand,
      centralKitchen,
      outlets,
      activeScope,
      activeRole,
      dateFilter,
      activeModule,
      expenses,
      vendors,
      purchases,
      priceHikeAlerts,
      orders,
      cashReconciliations,
      employees,
      attendance,
      salaryAdvances,
      inventory,
      productionPlans,
      integrations,
      settlements,
      weeklyStrategy,
      auditLogs,
      searchModalOpen,
      notificationsOpen,
      uploadModalOpen,
      uploadContext,
      toasts
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
