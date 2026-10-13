import React from 'react';
import { useApp } from '../context/AppContext';
import { History, Shield, Filter, Search } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-slate-700" />
            Immutable Financial & Operational Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full compliance record of price hike approvals, cash shortage submissions, OCR voucher postings, and wage edits
          </p>
        </div>

        <span className="text-xs font-mono px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
          LOG RETENTION: 7 YEARS (COMPLIANT)
        </span>
      </div>

      {/* Log Table */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
            <tr>
              <th className="p-3">Timestamp (IST)</th>
              <th className="p-3">User & Active Role</th>
              <th className="p-3">Action Type</th>
              <th className="p-3">Module</th>
              <th className="p-3">Target Entity</th>
              <th className="p-3">Audit Details & Justification</th>
              <th className="p-3 text-right">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="p-3 text-slate-500">{log.timestamp}</td>
                <td className="p-3 font-sans">
                  <div className="font-semibold text-slate-900">{log.user}</div>
                  <div className="text-[10px] text-slate-500">{log.role}</div>
                </td>
                <td className="p-3 font-bold text-slate-800">{log.action}</td>
                <td className="p-3 font-sans text-slate-600">{log.module}</td>
                <td className="p-3 font-semibold text-teal-800">{log.targetEntityId}</td>
                <td className="p-3 font-sans text-slate-700 max-w-md">{log.details}</td>
                <td className="p-3 text-right text-slate-400">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
