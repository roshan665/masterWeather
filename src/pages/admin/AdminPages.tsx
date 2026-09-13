import React from 'react';
import { Link } from 'react-router-dom';
import { useMockData } from '../../context/MockDataContext';
import { PANCHAYATS } from '../../data/panchayats';
import {
  Layers,
  Sliders,
  Database,
  FileSpreadsheet,
  CheckCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { auditLogs, advisoryRules } = useMockData();
  const publishedRulesCount = advisoryRules.filter((r) => r.approvalStatus === 'published').length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          PanchayatMausam AI — System Administration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage system boundaries, advisory rule engines, user permissions, telemetry feeds, and audit logs.
        </p>
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Panchayats & Stations */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Layers size={16} className="text-emerald-700" />
              <span>Panchayats & AWS Nodes</span>
            </h3>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
              5 Active
            </span>
          </div>
          <p className="text-xs text-slate-500">
            5 Gram Panchayats in Phanda Block mapped with geographic centroids and AWS node IDs.
          </p>
          <div className="space-y-1 text-xs pt-1">
            {PANCHAYATS.map((gp) => (
              <div key={gp.id} className="flex justify-between py-1 border-b border-slate-100 last:border-0">
                <span className="font-semibold">{gp.nameEn} ({gp.nameHi})</span>
                <span className="font-mono text-slate-500">{gp.weatherStationId}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Advisory Rules Engine */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Sliders size={16} className="text-blue-700" />
                <span>Parametric Advisory Rules</span>
              </h3>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                {publishedRulesCount} / {advisoryRules.length} Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Rules engine triggers automated draft advisories based on ICAR/KVK threshold algorithms.
            </p>
            <div className="space-y-1.5 text-xs pt-1">
              {advisoryRules.slice(0, 2).map((rule) => (
                <div key={rule.id} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-800 block">{rule.ruleCode}: {rule.cropNameEn} ({rule.stageNameEn})</span>
                  <span className="text-[11px] text-slate-600 line-clamp-1">{rule.weatherTriggerEn}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/admin/rules"
              className="w-full py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <BookOpen size={14} />
              <span>Manage Rules Knowledge Base</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Data Source Status */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Database size={16} className="text-purple-700" />
              <span>Telemetry Data Ingestion</span>
            </h3>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-bold rounded">
              Healthy
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time sensor telemetry, IMD radar feeds, and 5km gridded model fallbacks.
          </p>
          <div className="space-y-1 text-xs pt-1">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Bhopal Doppler Radar Feed</span>
              <span className="text-emerald-700 font-bold">🟢 Live</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>NCMRWF 4km Unified Model</span>
              <span className="text-emerald-700 font-bold">🟢 Synced</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Phanda AWS Sensors (4/5)</span>
              <span className="text-amber-700 font-bold">🟠 1 Backup</span>
            </div>
          </div>
        </div>

      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <FileSpreadsheet size={18} className="text-emerald-700" />
          <span>System Audit Logs & Security Trails</span>
        </h2>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User & Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Entity & Target</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp.slice(0, 19).replace('T', ' ')}
                  </td>
                  <td className="py-2 px-3 font-semibold text-slate-900">
                    {log.userName}
                    <span className="block text-[10px] text-slate-400 capitalize">{log.userRole}</span>
                  </td>
                  <td className="py-2 px-3 font-mono text-[11px] text-slate-800">
                    {log.action}
                  </td>
                  <td className="py-2 px-3 text-slate-600">
                    {log.targetEntity} ({log.targetId})
                  </td>
                  <td className="py-2 px-3 text-slate-600 max-w-[240px] truncate">
                    {log.details}
                  </td>
                  <td className="py-2 px-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      <CheckCircle size={10} />
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
