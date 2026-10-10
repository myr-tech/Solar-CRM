import React, { useState } from 'react';
import {
  ShieldCheck,
  HeadphonesIcon,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Wrench,
  ExternalLink,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { ServiceTicket, WarrantyRecord, TicketPriority, TicketStatus } from '../../types';
import { formatDate } from '../../utils/formatters';

interface WarrantyAndServiceViewProps {
  onSelectProject: (projectId: string) => void;
  onOpenWhatsApp: (phone: string, name: string, projectId?: string) => void;
}

export const WarrantyAndServiceView: React.FC<WarrantyAndServiceViewProps> = ({
  onSelectProject,
  onOpenWhatsApp,
}) => {
  const db = storage.getDatabase();
  const [activeTab, setActiveTab] = useState<'WARRANTIES' | 'TICKETS'>('WARRANTIES');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // New Ticket State
  const [targetProjectId, setTargetProjectId] = useState(db.projects[0]?.id || 'FCSS-2026-0001');
  const [problemCategory, setProblemCategory] = useState<ServiceTicket['problemCategory']>('Wi-Fi Offline');
  const [problemDescription, setProblemDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('Medium');

  const filteredTickets = db.serviceTickets.filter((t) => {
    return (
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.mobile.includes(searchTerm) ||
      t.consumerNumber.includes(searchTerm)
    );
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = db.projects.find((p) => p.id === targetProjectId);
    if (!proj) return;

    storage.addServiceTicket({
      projectId: targetProjectId,
      customerName: proj.customerName,
      mobile: proj.mobile,
      consumerNumber: proj.consumerNumber,
      inverterSerialNumber: proj.inverterSerial,
      complaintDate: new Date().toISOString().slice(0, 10),
      problemCategory,
      problemDescription,
      assignedTechnician: 'Vikram Joshi (Service AMC)',
      priority,
      status: 'Open',
    });

    setShowNewTicketModal(false);
    setProblemDescription('');
  };

  const handleCloseTicket = (tktId: string) => {
    storage.updateServiceTicket(tktId, {
      status: 'Closed',
      closingDate: new Date().toISOString().slice(0, 10),
      resolution: 'Diagnosed and resolved on site by Vikram Joshi.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-amber-400" /> Warranty Management & Service Helpdesk
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            25-Year performance warranty tracking, 5-Year comprehensive AMC & solar complaint ticket dispatch
          </p>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Service Ticket</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('WARRANTIES')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'WARRANTIES'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          Active Plant Warranties ({db.warranties.length})
        </button>
        <button
          onClick={() => setActiveTab('TICKETS')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'TICKETS'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          Service Complaints Desk ({db.serviceTickets.length})
        </button>
      </div>

      {activeTab === 'WARRANTIES' ? (
        /* Warranties Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {db.warranties.map((w) => (
            <div
              key={w.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <button
                    onClick={() => onSelectProject(w.projectId)}
                    className="font-mono text-amber-400 font-bold hover:underline"
                  >
                    {w.projectId}
                  </button>
                  <h3 className="text-base font-bold text-white mt-0.5">{w.customerName}</h3>
                </div>
                <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full font-bold text-[10px]">
                  AMC ACTIVE (5 YRS)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300">
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Solar Modules:</div>
                  <div className="font-bold text-white text-xs mt-0.5">{w.panelBrand}</div>
                  <div className="text-amber-400 font-bold mt-1">25 Years Linear</div>
                  <div className="text-[10px] text-slate-500">Till {w.panelWarrantyEndDate}</div>
                </div>

                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Inverter:</div>
                  <div className="font-bold text-white text-xs mt-0.5">{w.inverterBrand}</div>
                  <div className="text-sky-400 font-bold mt-1">{w.inverterWarrantyYears} Years Standard</div>
                  <div className="text-[10px] text-slate-500">Till {w.inverterWarrantyEndDate}</div>
                </div>

                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Frontier Workmanship:</div>
                  <div className="font-bold text-white text-xs mt-0.5">Comprehensive</div>
                  <div className="text-emerald-400 font-bold mt-1">5 Years Free AMC</div>
                  <div className="text-[10px] text-slate-500">Till {w.workmanshipWarrantyEndDate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Service Tickets Desk */
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ticket by Consumer ID, Mobile, Consumer Number, Serial Number..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredTickets.map((tkt) => {
              const isClosed = tkt.status === 'Closed';
              return (
                <div
                  key={tkt.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-400 font-bold">{tkt.ticketNumber}</span>
                      <span className="font-bold text-white">{tkt.customerName}</span>
                      <span className="text-slate-400">({tkt.mobile})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          tkt.priority === 'Urgent'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {tkt.priority}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isClosed
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : 'bg-sky-950 text-sky-400 border-sky-800'
                        }`}
                      >
                        {tkt.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-slate-300">
                    <div>
                      Category: <strong className="text-white">{tkt.problemCategory}</strong>
                    </div>
                    <div className="text-slate-400 leading-relaxed">"{tkt.problemDescription}"</div>
                    {tkt.resolution && (
                      <div className="p-2.5 bg-slate-850 rounded-lg border border-slate-800 text-emerald-300 text-[11px] mt-2">
                        <strong>Resolution:</strong> {tkt.resolution}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-400">
                      Assigned: {tkt.assignedTechnician || 'Vikram Joshi'}
                    </span>
                    {!isClosed && (
                      <button
                        onClick={() => handleCloseTicket(tkt.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
                      >
                        Mark Complaint Resolved
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <HeadphonesIcon className="w-5 h-5 text-amber-400" /> Register Solar Service Complaint
            </h3>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Customer / Project *</label>
                <select
                  value={targetProjectId}
                  onChange={(e) => setTargetProjectId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                >
                  {db.projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.customerName} ({p.address})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Issue Category *</label>
                  <select
                    value={problemCategory}
                    onChange={(e) => setProblemCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Wi-Fi Offline">Wi-Fi App Disconnected</option>
                    <option value="Low Generation">Low Daily Generation</option>
                    <option value="Tripping">MCB / SPD Tripping</option>
                    <option value="Inverter Fault">Inverter Red Error Light</option>
                    <option value="Net Meter Issue">Net Meter Reading Mismatch</option>
                    <option value="Routine AMC">Routine 6-Month AMC Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Low">Low (AMC / Inquiries)</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent (Grid Outage / Tripping)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Problem Description *</label>
                <textarea
                  rows={3}
                  required
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Details of complaint, error code displayed on inverter..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
