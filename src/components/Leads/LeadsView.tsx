import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  Phone,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  CalendarPlus,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { Lead, LeadStatus, LeadSource } from '../../types';
import { generateWhatsAppLink, formatDate } from '../../utils/formatters';

interface LeadsViewProps {
  onOpenNewLead: () => void;
  onOpenWhatsApp: (phone: string, name: string, projectId?: string) => void;
  onScheduleAppointment: (lead: Lead) => void;
  onGenerateQuotation: (lead: Lead) => void;
  onSelectProject: (projectId: string) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  onOpenNewLead,
  onOpenWhatsApp,
  onScheduleAppointment,
  onGenerateQuotation,
  onSelectProject,
}) => {
  const db = storage.getDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');

  const leadStatuses: LeadStatus[] = [
    'New',
    'Contacted',
    'Appointment Fixed',
    'Survey Done',
    'Quotation Sent',
    'Negotiation',
    'Won',
    'Lost',
    'On Hold',
  ];

  const leadSources: LeadSource[] = [
    'Customer Reference',
    'WhatsApp Marketing',
    'Existing Customer',
    'Facebook',
    'Instagram',
    'Google',
    'Website',
    'Walk-in',
    'Dealer/Partner',
    'Other',
  ];

  const filteredLeads = db.leads.filter((lead) => {
    const matchesSearch =
      lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.mobile.includes(searchTerm) ||
      lead.consumerNumber.includes(searchTerm) ||
      lead.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'ALL' || lead.leadSource === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    storage.updateLead(leadId, { status: newStatus });
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'Won':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'Lost':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      case 'Quotation Sent':
        return 'bg-purple-950 text-purple-400 border-purple-800';
      case 'Survey Done':
        return 'bg-sky-950 text-sky-400 border-sky-800';
      case 'Appointment Fixed':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'Negotiation':
        return 'bg-indigo-950 text-indigo-400 border-indigo-800';
      case 'Contacted':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      case 'New':
        return 'bg-teal-950 text-teal-400 border-teal-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-amber-400" /> Lead Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Track inquiries from initial contact through site survey, quote and PM Surya Ghar conversion
          </p>
        </div>

        <button
          onClick={onOpenNewLead}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-md shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Lead ID, Customer Name, Mobile, Electricity Consumer No..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Statuses ({db.leads.length})</option>
            {leadStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Sources</option>
            {leadSources.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Lead ID & Date</th>
                <th className="py-3 px-4">Customer & Connection</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Source & Salesperson</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Next Follow-up</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No leads matching criteria found.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-850/60 transition-colors">
                    {/* Lead ID & Date */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-amber-400">{lead.id}</div>
                      <div className="text-[10px] text-slate-500">{formatDate(lead.date)}</div>
                      {lead.projectId && (
                        <button
                          onClick={() => onSelectProject(lead.projectId!)}
                          className="mt-1 text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                        >
                          Project: {lead.projectId} <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      )}
                      {(() => {
                        const linkedQuote = db.quotations.find((q) => q.leadId === lead.id);
                        if (!linkedQuote) return null;
                        return (
                          <button
                            onClick={() => onGenerateQuotation(lead)}
                            className="mt-1 text-[10px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-mono bg-amber-500/15 hover:bg-amber-500/25 px-1.5 py-0.5 rounded border border-amber-500/30 transition-colors"
                            title="Open & Edit Quotation"
                          >
                            <FileSpreadsheet className="w-2.5 h-2.5 text-amber-400" />
                            <span>{linkedQuote.quotationNumber}</span>
                          </button>
                        );
                      })()}
                    </td>

                    {/* Customer & Consumer Number */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{lead.customerName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-slate-300">{lead.mobile}</span>
                        <span>•</span>
                        <span className="text-slate-400 truncate max-w-[140px]">{lead.address}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Consumer No: {lead.consumerNumber || 'Not provided'}
                      </div>
                    </td>

                    {/* Solar Capacity */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded text-[11px]">
                        {lead.interestedCapacityKw} kW
                      </span>
                    </td>

                    {/* Source & Salesperson */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{lead.leadSource}</div>
                      {lead.referredBy && (
                        <div className="text-[10px] text-slate-500 truncate">Ref: {lead.referredBy}</div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-0.5">Rep: {lead.salesperson}</div>
                    </td>

                    {/* Status dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className={`text-[11px] font-semibold rounded-lg px-2 py-1 border focus:outline-none cursor-pointer ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        {leadStatuses.map((st) => (
                          <option key={st} value={st} className="bg-slate-900 text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Next follow up */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDate(lead.nextFollowUpDate)}</span>
                      </div>
                      {lead.remarks && (
                        <div className="text-[10px] text-slate-500 truncate max-w-[160px] mt-0.5" title={lead.remarks}>
                          {lead.remarks}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp button */}
                        <button
                          onClick={() => onOpenWhatsApp(lead.mobile, lead.customerName, lead.projectId)}
                          className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 transition-colors"
                          title="Send WhatsApp message"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        {/* Schedule Appointment */}
                        <button
                          onClick={() => onScheduleAppointment(lead)}
                          className="p-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 text-sky-400 border border-sky-800 transition-colors"
                          title="Schedule Site Survey or Meeting"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" />
                        </button>

                        {/* Generate / Open Quotation */}
                        <button
                          onClick={() => {
                            let quote = db.quotations.find((q) => q.leadId === lead.id);
                            if (!quote) {
                              quote = storage.createQuotationForLead(lead.id);
                            }
                            onGenerateQuotation(lead);
                          }}
                          className="px-2 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/40 transition-colors flex items-center gap-1 text-[11px] font-bold"
                          title="Open & Edit Solar Quotation in Quotation Builder"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>Quote</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
