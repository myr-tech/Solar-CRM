import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  IndianRupee,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  MapPin,
  FileCheck,
  UserCheck,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { Project, ProjectStage } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface ProjectsListViewProps {
  onSelectProject: (projectId: string) => void;
  onNavigateToTab: (tabId: string, projectId?: string) => void;
}

export const ProjectsListView: React.FC<ProjectsListViewProps> = ({
  onSelectProject,
  onNavigateToTab,
}) => {
  const db = storage.getDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'KANBAN'>('TABLE');

  const allStages: ProjectStage[] = [
    'Lead / Inquiry',
    'Appointment Fixed',
    'Site Survey Done',
    'Quotation Sent',
    'Pre-Agreement Signed',
    'Document Collection',
    'National Portal Registration',
    'MSEDCL PV Application',
    'Advance Payment',
    'Loan Processing',
    'Material Allocation',
    'Dispatched',
    'Installation',
    'QC Inspection',
    'RTS Documentation',
    'Release Letter',
    'Net Meter Installation',
    'Discom Inspection',
    'Subsidy Claim',
    'Bank 2nd Disbursement',
    'Final Payment',
    'Completed & Handover',
    'AMC & Warranty',
  ];

  const filteredProjects = db.projects.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.consumerNumber.includes(searchTerm) ||
      p.mobile.includes(searchTerm) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = stageFilter === 'ALL' || p.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <FolderKanban className="w-6 h-6 text-amber-400" /> Master Solar Projects
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              FCSS-2026-XXXX
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Single Project & Consumer ID Lifecycle: Survey → Quotation → Docs → MSEDCL → Net Meter → Subsidy
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setViewMode('TABLE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'TABLE' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('KANBAN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'KANBAN' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300'
            }`}
          >
            Stage Pipeline
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Master ID (FCSS-2026-0001), Customer, MSEDCL Consumer No, Address..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 max-w-xs"
          >
            <option value="ALL">All Lifecycle Stages ({db.projects.length})</option>
            {allStages.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {viewMode === 'TABLE' ? (
        /* Projects Table */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-850 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Master Project ID</th>
                  <th className="py-3 px-4">Customer & Connection</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Docs Status</th>
                  <th className="py-3 px-4">Financials</th>
                  <th className="py-3 px-4">Jan Samarth Loan</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-500">
                      No matching projects found.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((p) => {
                    const docRatio = `${p.documentsCompleteCount}/${p.documentsTotalCount}`;
                    const docsComplete = p.documentsCompleteCount === p.documentsTotalCount;

                    return (
                      <tr
                        key={p.id}
                        onClick={() => onSelectProject(p.id)}
                        className="hover:bg-slate-850/60 transition-colors cursor-pointer group"
                      >
                        {/* Single Master ID */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-extrabold text-amber-400 group-hover:underline text-xs">
                            {p.id}
                          </span>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Started: {formatDate(p.startDate)}
                          </div>
                        </td>

                        {/* Customer & Consumer Number */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-xs">{p.customerName}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-slate-300">{p.consumerNumber}</span>
                            <span>•</span>
                            <span className="truncate max-w-[140px]">{p.address}</span>
                          </div>
                        </td>

                        {/* Capacity */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[11px]">
                            {p.systemCapacityKw} kW
                          </span>
                        </td>

                        {/* Stage */}
                        <td className="py-3.5 px-4">
                          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-sky-400 border border-slate-700">
                            {p.stage}
                          </span>
                        </td>

                        {/* Documents 8/10 Complete Badge */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                                docsComplete
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-amber-950 text-amber-400 border border-amber-800'
                              }`}
                            >
                              {docRatio}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {docsComplete ? 'All Ready' : 'Pending Docs'}
                            </span>
                          </div>
                        </td>

                        {/* Financials: Value & Balance Due */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">
                            {formatCurrency(p.totalProjectValue)}
                          </div>
                          <div className="text-[10px] text-rose-400 font-mono mt-0.5">
                            Bal: {formatCurrency(p.balanceDue)}
                          </div>
                        </td>

                        {/* Jan Samarth Loan Status */}
                        <td className="py-3.5 px-4">
                          {p.loanRequired ? (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                              {p.loanStatus}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">Self Financed</span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToTab('consumer-360', p.id);
                              }}
                              className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-400 rounded-lg transition-colors border border-amber-500/30 text-[10px] font-bold flex items-center gap-1"
                              title="Open Consumer 360° Page"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>360°</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectProject(p.id);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
                              title="Open Master Project ERP Hub"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Pipeline View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { title: 'Surveys & Quotation', stages: ['Site Survey Done', 'Quotation Sent', 'Pre-Agreement Signed'] },
            { title: 'Docs & MSEDCL Feasibility', stages: ['Document Collection', 'National Portal Registration', 'MSEDCL PV Application', 'Advance Payment'] },
            { title: 'Material & Installation', stages: ['Material Allocation', 'Dispatched', 'Installation', 'QC Inspection'] },
            { title: 'Net Meter, Subsidy & Disb.', stages: ['RTS Documentation', 'Release Letter', 'Net Meter Installation', 'Discom Inspection', 'Subsidy Claim', 'Bank 2nd Disbursement', 'Completed & Handover'] },
          ].map((column) => {
            const projectsInCol = filteredProjects.filter((p) =>
              column.stages.includes(p.stage)
            );
            return (
              <div key={column.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {column.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-bold font-mono">
                    {projectsInCol.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {projectsInCol.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => onSelectProject(proj.id)}
                      className="p-3 bg-slate-850 hover:bg-slate-800 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-amber-400">{proj.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 border border-slate-700">
                          {proj.stage}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white">{proj.customerName}</div>
                      <div className="text-[11px] text-slate-400">{proj.systemCapacityKw} kW • {proj.address}</div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                        <span className="text-slate-400">Docs: {proj.documentsCompleteCount}/{proj.documentsTotalCount}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToTab('consumer-360', proj.id);
                            }}
                            className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-400 rounded text-[9px] font-bold border border-amber-500/30"
                          >
                            360°
                          </button>
                          <span className="text-amber-400 font-mono font-bold">Bal: {formatCurrency(proj.balanceDue)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
