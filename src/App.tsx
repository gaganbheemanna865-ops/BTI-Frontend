import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { DocumentUploadModal } from './components/common/DocumentUploadModal';
import { ToastContainer } from './components/common/Toast';

// Views
import { MainDashboardView } from './views/MainDashboardView';
import { OutletDirectoryView } from './views/OutletDirectoryView';
import { OutletDetailView } from './views/OutletDetailView';
import { CentralKitchenView } from './views/CentralKitchenView';
import { ExpensesView } from './views/ExpensesView';
import { PurchasesView } from './views/PurchasesView';
import { SalesView } from './views/SalesView';
import { KdsView } from './views/KdsView';
import { PaymentIntegrationsView } from './views/PaymentIntegrationsView';
import { SettlementsView } from './views/SettlementsView';
import { EmployeesView } from './views/EmployeesView';
import { ReportsView } from './views/ReportsView';
import { ConsolidatedPnLView } from './views/ConsolidatedPnLView';
import { EbitdaMarginView } from './views/EbitdaMarginView';
import { KpisStrategyView } from './views/KpisStrategyView';
import { RolesPermissionsView } from './views/RolesPermissionsView';
import { AuditLogView } from './views/AuditLogView';
import { SettingsView } from './views/SettingsView';

const MainContent: React.FC = () => {
  const { activeModule, activeScope } = useApp();

  // If a specific outlet is picked in top scope selector and module is generic dashboard,
  // route seamlessly to that outlet's dedicated dashboard view!
  if (activeScope !== 'consolidated' && activeScope !== 'ck' && activeModule === 'dashboard') {
    return <OutletDetailView />;
  }

  // If Central Kitchen is picked in top scope selector and module is generic dashboard,
  // route seamlessly to Central Kitchen dashboard!
  if (activeScope === 'ck' && activeModule === 'dashboard') {
    return <CentralKitchenView />;
  }

  switch (activeModule) {
    // A. PLATFORM AND MANAGEMENT
    case 'dashboard':
      return <MainDashboardView />;
    case 'groups':
    case 'brands':
      return <SettingsView />;
    case 'outlets':
      return <OutletDirectoryView />;
    case 'outlet-detail':
      return <OutletDetailView />;
    case 'central-kitchen':
      return <CentralKitchenView />;
    case 'reports-pnl':
      return <ConsolidatedPnLView />;
    case 'roles-permissions':
      return <RolesPermissionsView />;

    // B. CENTRAL KITCHEN
    case 'ck-overview':
    case 'ck-expenses':
    case 'ck-sales':
    case 'ck-reports':
    case 'ck-kpis':
    case 'ck-day-end':
    case 'inventory':
    case 'production':
    case 'cookhouse-orders':
    case 'submit-orders':
    case 'only-orders':
    case 'stock-transfers':
    case 'ck-performance':
      return <CentralKitchenView />;
    case 'ck-purchases':
      return <PurchasesView />;
    case 'ck-settlements':
      return <SettlementsView />;
    case 'ck-integrations':
      return <PaymentIntegrationsView />;

    // C. OUTLET OPERATIONS
    case 'outlet-overview':
    case 'outlet-stock':
    case 'outlet-day-end':
      return <OutletDetailView />;
    case 'outlet-sales':
    case 'outlet-orders':
      return <SalesView />;
    case 'outlet-expenses':
    case 'outlet-petty':
      return <ExpensesView />;
    case 'outlet-attendance':
    case 'outlet-wages':
    case 'outlet-advances':
    case 'outlet-rent':
      return <EmployeesView />;
    case 'outlet-kds':
    case 'outlet-kds-aggregators':
    case 'outlet-kds-only':
      return <KdsView />;
    case 'outlet-settlements':
      return <SettlementsView />;
    case 'outlet-reports':
      return <ReportsView />;

    // D. FINANCE AND REPORTING
    case 'pnl-consolidated':
      return <ConsolidatedPnLView mode="consolidated" />;
    case 'pnl-brand':
      return <ConsolidatedPnLView mode="brand" />;
    case 'pnl-outlet':
      return <ConsolidatedPnLView mode="outlet" />;
    case 'ck-financial-report':
    case 'daily-summary':
    case 'day-end':
    case 'tally-export':
      return <ReportsView />;
    case 'ebitda-margin-analysis':
      return <EbitdaMarginView />;
    case 'purchases':
    case 'purchase-register':
      return <PurchasesView />;
    case 'expenses':
    case 'expense-register':
      return <ExpensesView />;
    case 'sales':
    case 'sales-register':
    case 'reconciliation':
      return <SalesView />;
    case 'settlements':
    case 'settlement-reconciliation':
      return <SettlementsView />;

    // E. INTEGRATIONS
    case 'payment-integrations':
    case 'billing-pos':
    case 'pos-billing':
    case 'mobikwik':
    case 'quick-upi':
    case 'swiggy':
    case 'zomato':
    case 'ownly':
    case 'tipplr':
    case 'rapido-delivery':
      return <PaymentIntegrationsView />;
    case 'kds':
    case 'order-sources-kds':
      return <KdsView />;

    // F. PERFORMANCE
    case 'kpis':
    case 'dish-performance':
    case 'branch-performance':
    case 'forecast':
    case 'weekly-strategy':
      return <KpisStrategyView />;

    case 'audit-log':
      return <AuditLogView />;
    case 'settings':
      return <SettingsView />;
    default:
      return <MainDashboardView />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Area with Persistent Top Navigation */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav />

          <main className="flex-1 p-4 md:p-6 max-w-[1600px] w-full mx-auto">
            <MainContent />
          </main>
        </div>

        {/* Global Modals & Interactive Overlays */}
        <GlobalSearchModal />
        <NotificationsDrawer />
        <DocumentUploadModal />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
