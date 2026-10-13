import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserCheck, Lock, Check, X, Shield } from 'lucide-react';
import { Role } from '../types';

export const RolesPermissionsView: React.FC = () => {
  const { activeRole, setActiveRole, addToast } = useApp();

  const allRoles: Role[] = [
    'Platform Administrator',
    'Restaurant Group Administrator',
    'Brand/Management User',
    'Central Kitchen Manager',
    'Outlet Manager',
    'Accountant',
    'Purchase Manager',
    'HR/Salary Administrator',
    'Cashier',
    'Kitchen Staff',
    'Read-Only Auditor'
  ];

  const permissionsMatrix: { name: string; category: string; allowed: Role[] }[] = [
    {
      name: 'View Consolidated Management P&L & EBITDA',
      category: 'Finance & Executive',
      allowed: ['Platform Administrator', 'Restaurant Group Administrator', 'Brand/Management User', 'Accountant', 'Read-Only Auditor']
    },
    {
      name: 'Approve Operating Vouchers & Expenses',
      category: 'Finance & Executive',
      allowed: ['Platform Administrator', 'Restaurant Group Administrator', 'Brand/Management User', 'Outlet Manager', 'Accountant']
    },
    {
      name: 'Authorize Vendor Price Hike Exceptions (>5%)',
      category: 'Procurement',
      allowed: ['Platform Administrator', 'Restaurant Group Administrator', 'Purchase Manager']
    },
    {
      name: 'Scan & Post Invoices via OCR (Kannada/English)',
      category: 'Procurement',
      allowed: ['Platform Administrator', 'Purchase Manager', 'Central Kitchen Manager', 'Accountant']
    },
    {
      name: 'Dispatch Central Kitchen Production Batches',
      category: 'Central Kitchen',
      allowed: ['Platform Administrator', 'Central Kitchen Manager']
    },
    {
      name: 'Record Counter Cash Reconciliation & Shortages',
      category: 'Branch Operations',
      allowed: ['Platform Administrator', 'Outlet Manager', 'Cashier', 'Accountant']
    },
    {
      name: 'Submit 1:00 PM Day-End Audit',
      category: 'Branch Operations',
      allowed: ['Platform Administrator', 'Outlet Manager']
    },
    {
      name: 'Update Live KDS Preparation Status',
      category: 'Kitchen & KDS',
      allowed: ['Platform Administrator', 'Outlet Manager', 'Kitchen Staff', 'Cashier']
    },
    {
      name: 'Approve Salary Advances & Edit Payroll',
      category: 'Workforce & HR',
      allowed: ['Platform Administrator', 'Restaurant Group Administrator', 'HR/Salary Administrator']
    },
    {
      name: 'Switch Branch Outlet Context (Multi-Store)',
      category: 'System Governance',
      allowed: ['Platform Administrator', 'Restaurant Group Administrator', 'Brand/Management User', 'Accountant', 'Purchase Manager', 'Read-Only Auditor']
    }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-slate-700" />
            Roles, Access Control & Permission Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-Based Access Control (RBAC) modeled independently of display titles for backend Supabase RLS mapping
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Currently Simulating:</span>
          <span className="px-2.5 py-1 rounded font-semibold bg-slate-900 text-white font-mono">
            {activeRole}
          </span>
        </div>
      </div>

      {/* Role Simulator Selector Strip */}
      <div className="bg-white border border-slate-200 rounded p-3 text-xs space-y-2">
        <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
          Quickly Switch Simulated Demo Role:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {allRoles.map((role) => (
            <button
              key={role}
              onClick={() => {
                setActiveRole(role);
                addToast('info', 'Role Context Updated', `Now viewing console in ${role} security scope.`);
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeRole === role
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3">Operational Permission & Capability</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-center">Active Role Status ({activeRole})</th>
                <th className="p-3">Permitted Roles Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((perm) => {
                const isPermitted = perm.allowed.includes(activeRole);

                return (
                  <tr key={perm.name} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">{perm.name}</td>
                    <td className="p-3 text-slate-600">{perm.category}</td>
                    <td className="p-3 text-center font-mono">
                      {isPermitted ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <Check className="w-3.5 h-3.5" /> Allowed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-semibold text-[11px]">
                          <X className="w-3.5 h-3.5" /> Restricted
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">
                      {perm.allowed.join(', ')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
