import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Users,
  Clock,
  Coins,
  Banknote,
  Home,
  CheckCircle2,
  Plus,
  Phone,
  Building,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Employee, AttendanceRecord, SalaryAdvanceRecord } from '../types';

export const EmployeesView: React.FC = () => {
  const {
    employees,
    attendance,
    salaryAdvances,
    outlets,
    approveAdvance,
    addAdvanceRequest,
    markAttendance,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'directory' | 'attendance' | 'daily-wages' | 'overtime' | 'advances' | 'payroll' | 'accommodation'
  >('directory');

  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0].id);
  const [advanceAmount, setAdvanceAmount] = useState('3000');
  const [advanceReason, setAdvanceReason] = useState('Family medical requirement');

  const totalMonthlyPayroll = employees
    .filter((e) => e.monthlyBaseSalary)
    .reduce((sum, e) => sum + (e.monthlyBaseSalary || 0), 0);

  const totalOutstandingAdvances = salaryAdvances
    .filter((a) => a.status === 'Approved')
    .reduce((sum, a) => sum + a.currentOutstanding, 0);

  const dailyWageWorkersCount = employees.filter((e) => e.employmentType === 'Daily Wage').length;

  const handleCreateAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === selectedEmpId) || employees[0];
    const amt = parseFloat(advanceAmount) || 0;

    addAdvanceRequest({
      employeeId: emp.id,
      employeeName: emp.name,
      outletId: emp.outletId,
      requestDate: new Date().toISOString().substring(0, 10),
      amount: amt,
      approvedAmount: amt,
      reason: advanceReason,
      repaymentPlan: '₹1,500 deducted over 2 wage cycles',
      approvedBy: 'HR / Outlet Manager',
      status: 'Pending',
      currentOutstanding: amt
    });

    setAdvanceModalOpen(false);
    setAdvanceReason('');
  };

  const tabs = [
    { id: 'directory', label: '1. Employee Directory' },
    { id: 'attendance', label: '2. Attendance Register' },
    { id: 'daily-wages', label: '3. Daily Wage Sheet' },
    { id: 'overtime', label: '4. Overtime Report' },
    { id: 'advances', label: '5. Salary Advances' },
    { id: 'payroll', label: '6. Monthly Payroll Accrual' },
    { id: 'accommodation', label: '7. Accommodation & Rent' }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-700" />
            Workforce, Daily Wages, Overtime & Payroll Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central Kitchen masters, branch outlet managers, daily wage cooks, cashiers, and utility staff
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdvanceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors shadow-xs"
          >
            <Banknote className="w-3.5 h-3.5" />
            Request Salary Advance
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Total Active Staff"
          value={employees.length}
          subValue={`${dailyWageWorkersCount} Daily Wage · ${employees.length - dailyWageWorkersCount} Salaried`}
        />
        <MetricCard
          label="Monthly Base Payroll"
          value={`₹${totalMonthlyPayroll.toLocaleString()}`}
          subValue="Accrued monthly expense"
        />
        <MetricCard
          label="Outstanding Advances"
          value={`₹${totalOutstandingAdvances.toLocaleString()}`}
          subValue="Tracked against future wages"
          trend="neutral"
          trendValue="No double-counting"
        />
        <MetricCard
          label="Staff in Accommodation"
          value={employees.filter((e) => e.hasAccommodation).length}
          subValue="Rent attributed to branch cost center"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-md p-1.5 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max text-xs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap font-medium ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB: Employee Directory */}
      {activeTab === 'directory' && (
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-3.5 py-2.5">Code & Name</th>
                <th className="px-3 py-2.5">Role</th>
                <th className="px-3 py-2.5">Assignment Scope</th>
                <th className="px-3 py-2.5">Employment Type</th>
                <th className="px-3 py-2.5 text-right">Wage Rate / Salary</th>
                <th className="px-3 py-2.5 text-right">Advance Balance</th>
                <th className="px-3 py-2.5 text-center">Accommodation</th>
                <th className="px-3 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="px-3.5 py-2.5">
                    <div className="font-bold text-slate-900">{emp.name}</div>
                    <div className="font-mono text-[11px] text-slate-500">{emp.employeeCode} · {emp.phone}</div>
                  </td>
                  <td className="px-3 py-2.5 text-slate-800 font-medium">{emp.role}</td>
                  <td className="px-3 py-2.5 text-slate-600 font-mono text-[11px]">
                    {emp.assignmentType === 'Central Kitchen' ? 'BIT-CK-001 (Peenya Base)' : `${emp.outletId}`}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[11px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                      {emp.employmentType}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-semibold text-slate-900">
                    {emp.dailyWageRate ? `₹${emp.dailyWageRate}/day` : `₹${emp.monthlyBaseSalary?.toLocaleString()}/mo`}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono">
                    <span className={emp.currentAdvanceBalance > 0 ? 'text-amber-800 font-semibold' : 'text-slate-500'}>
                      ₹{emp.currentAdvanceBalance}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono text-[11px]">
                    {emp.hasAccommodation ? (
                      <span className="text-teal-800 font-medium">Room: {emp.accommodationRoomId} (₹{emp.accommodationRentAttribution})</span>
                    ) : (
                      <span className="text-slate-400">None</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <StatusBadge status={emp.activeStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: Attendance Register */}
      {activeTab === 'attendance' && (
        <div className="bg-white border border-slate-200 rounded p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daily Attendance Log & Shift Register</h3>
              <p className="text-xs text-slate-500">Tracked for daily wage computations and biometric check-ins</p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-700">Date: 2026-10-09</span>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-3 py-2">Staff Name</th>
                <th className="px-3 py-2">Shift</th>
                <th className="px-3 py-2 text-right">Hours Worked</th>
                <th className="px-3 py-2 text-right">OT Hours</th>
                <th className="px-3 py-2 text-right">Base Daily Wage</th>
                <th className="px-3 py-2 text-right">OT Pay</th>
                <th className="px-3 py-2 text-right">Total Earnings Today</th>
                <th className="px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {attendance.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-sans font-semibold text-slate-900">{att.employeeName}</td>
                  <td className="px-3 py-2.5 font-sans">{att.shift}</td>
                  <td className="px-3 py-2.5 text-right">{att.hoursWorked} hrs</td>
                  <td className="px-3 py-2.5 text-right">{att.overtimeHours} hrs</td>
                  <td className="px-3 py-2.5 text-right">₹{att.calculatedDailyWage}</td>
                  <td className="px-3 py-2.5 text-right">₹{att.overtimePay}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-slate-900">₹{att.totalDayEarnings}</td>
                  <td className="px-3 py-2.5 text-center font-sans">
                    <StatusBadge status={att.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: Salary Advances */}
      {activeTab === 'advances' && (
        <div className="bg-white border border-slate-200 rounded p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Salary Advances & Loan Recovery Ledger</h3>
              <p className="text-xs text-slate-500">
                Business Rule: Salary advances are recorded as balance sheet assets, not double-counted as monthly salary expense
              </p>
            </div>
            <button
              onClick={() => setAdvanceModalOpen(true)}
              className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium"
            >
              + New Advance Request
            </button>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-3 py-2">Advance ID</th>
                <th className="px-3 py-2">Employee Name</th>
                <th className="px-3 py-2">Request Date</th>
                <th className="px-3 py-2 text-right">Approved Amount</th>
                <th className="px-3 py-2 text-right">Current Outstanding</th>
                <th className="px-3 py-2">Repayment Plan</th>
                <th className="px-3 py-2 text-center">Status</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {salaryAdvances.map((adv) => (
                <tr key={adv.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-bold text-slate-900">{adv.id}</td>
                  <td className="px-3 py-2.5 font-sans font-semibold text-slate-800">{adv.employeeName}</td>
                  <td className="px-3 py-2.5 text-slate-600">{adv.requestDate}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-slate-900">₹{adv.approvedAmount.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right text-amber-800 font-bold">₹{adv.currentOutstanding.toLocaleString()}</td>
                  <td className="px-3 py-2.5 font-sans text-slate-600">{adv.repaymentPlan}</td>
                  <td className="px-3 py-2.5 text-center font-sans">
                    <StatusBadge status={adv.status} />
                  </td>
                  <td className="px-3 py-2.5 text-center font-sans">
                    {adv.status === 'Pending' ? (
                      <button
                        onClick={() => approveAdvance(adv.id)}
                        className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-medium"
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500">Active Ledger</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: Other workforce tabs */}
      {['daily-wages', 'overtime', 'payroll', 'accommodation'].includes(activeTab) && (
        <div className="bg-white border border-slate-200 rounded p-6 text-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 capitalize">
              {activeTab.replace('-', ' ')} Operational Policy & Audit View
            </h3>
            <span className="font-mono text-slate-500 text-[11px]">BIT HR STATUTORY FRAMEWORK</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3 leading-relaxed">
            <p className="text-slate-700">
              <strong>Operational Accounting Principle:</strong> Daily wages are calculated strictly from attendance shift hours. Overtime is paid at 1.5× the base hourly rate. Accommodation rent for staff quarters is attributed to the respective outlet cost center.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="text-slate-500 font-sans text-[11px]">Monthly Salary Accrual</span>
                <div className="font-bold text-slate-900 mt-1">₹1,96,000 / month</div>
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="text-slate-500 font-sans text-[11px]">Accommodation Rent Billed</span>
                <div className="font-bold text-slate-900 mt-1">₹8,900 / month</div>
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <span className="text-slate-500 font-sans text-[11px]">Overtime Multiplier</span>
                <div className="font-bold text-teal-800 mt-1">1.5× Approved Standard</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Salary Advance Request Modal */}
      {advanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-md p-5 text-xs space-y-4">
            <div className="pb-3 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Request Staff Salary Advance</h3>
              <button onClick={() => setAdvanceModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateAdvance} className="space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Employee</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full border border-slate-300 rounded p-1.5 text-xs bg-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role} · {emp.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Requested Amount (₹)</label>
                <input
                  type="number"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(e.target.value)}
                  className="w-full border border-slate-300 rounded p-1.5 text-xs font-mono font-bold bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Reason for Advance</label>
                <input
                  type="text"
                  value={advanceReason}
                  onChange={(e) => setAdvanceReason(e.target.value)}
                  placeholder="e.g. Festival travel or emergency repair"
                  className="w-full border border-slate-300 rounded p-1.5 text-xs bg-white"
                  required
                />
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600">
                Advances are deducted automatically in monthly payroll runs or daily wage payouts.
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdvanceModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded text-xs text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-medium"
                >
                  Submit Advance Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
