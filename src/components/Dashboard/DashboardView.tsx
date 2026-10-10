import React from 'react';
import {
  Users,
  FolderKanban,
  Compass,
  FileSpreadsheet,
  Trophy,
  Files,
  Globe2,
  Zap,
  IndianRupee,
  Landmark,
  Truck,
  Wrench,
  FileCheck2,
  MailCheck,
  Gauge,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Sun,
  Activity,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface DashboardViewProps {
  onNavigateToTab: (tabId: string, projectId?: string) => void;
  onOpenNewLead: () => void;
  onSelectProject: (projectId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToTab,
  onOpenNewLead,
  onSelectProject,
}) => {
  const db = storage.getDatabase();

  // Metrics Calculations for all 20 KPI cards
  const totalLeads = db.leads.length;
  const activeProjects = db.projects.length;
  const surveysPending = db.appointments.filter(
    (a) => a.type === 'Site Survey' && a.status === 'Scheduled'
  ).length;
  const quotationsPending = db.quotations.filter((q) => q.status === 'Draft' || q.status === 'Sent').length;
  const dealsWon = db.leads.filter((l) => l.status === 'Won').length;
  const documentsPending = db.projects.filter(
    (p) => p.documentsCompleteCount < p.documentsTotalCount
  ).length;
  const nationalPortalPending = db.portalApps.filter((p) => p.status !== 'Approved').length;
  const msedclPending = db.msedclApps.filter(
    (m) => m.feasibilityStatus === 'Pending' || m.status === 'Submitted'
  ).length;
  const advancePending = db.projects.filter((p) => p.totalReceived < 25000).length;
  const loanPending = db.loans.filter(
    (l) => l.loanRequired && (l.status === 'Applied' || l.status === 'Under Review')
  ).length;
  const materialDispatchPending = db.projects.filter(
    (p) => p.stage === 'Material Allocation' || p.stage === 'Advance Payment'
  ).length;
  const installationPending = db.installations.filter((i) => i.status !== 'Completed').length;
  const rtsSubmissionPending = db.rtsSubmissions.filter((r) => r.status !== 'Approved').length;
  const releaseLetterPending = db.releaseLetters.filter((r) => r.status === 'Pending').length;
  const netMeterPending = db.netMeters.filter((n) => n.status !== 'Active').length;
  const inspectionPending = db.inspections.filter((i) => i.status !== 'Certified').length;
  const subsidyPendingCount = db.subsidies.filter((s) => s.status !== 'Disbursed to Customer').length;
  const secondDisbPending = db.loans.filter(
    (l) => l.status === 'Second Disbursement Requested' && !l.secondDisbursementReceivedDate
  ).length;
  const finalPaymentPending = db.projects.filter((p) => p.balanceDue > 0).length;
  const completedProjects = db.projects.filter(
    (p) => p.stage === 'Completed & Handover' || p.stage === 'AMC & Warranty'
  ).length;

  // Financial Cards
  const totalQuotationValue = db.quotations.reduce((sum, q) => sum + (q.totalSystemPrice || 0), 0);
  const totalAdvanceReceived = db.payments
    .filter((p) => p.paymentType === 'Booking' || p.paymentType === 'Advance')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalCustomerReceivable = db.projects.reduce((sum, p) => sum + p.balanceDue, 0);
  const totalLoanAmount = db.loans.reduce((sum, l) => sum + l.loanAmount, 0);
  const loanDisbursed = db.loans.reduce(
    (sum, l) => sum + (l.firstDisbursementAmount || 0) + (l.secondDisbursementAmount || 0),
    0
  );
  const totalBalanceDue = db.projects.reduce((sum, p) => sum + p.balanceDue, 0);
  const totalSubsidyPendingAmount = db.subsidies
    .filter((s) => s.status !== 'Disbursed to Customer')
    .reduce((sum, s) => sum + s.subsidyAmount, 0);

  // Top 20 KPI array
  const kpiCards = [
    { label: 'Total Leads', value: totalLeads, tab: 'leads', icon: Users, color: 'text-sky-400 bg-sky-950/40 border-sky-800' },
    { label: 'Active Projects', value: activeProjects, tab: 'projects', icon: FolderKanban, color: 'text-amber-400 bg-amber-950/40 border-amber-800' },
    { label: 'Site Surveys Pending', value: surveysPending, tab: 'surveys', icon: Compass, color: 'text-indigo-400 bg-indigo-950/40 border-indigo-800' },
    { label: 'Quotations Pending', value: quotationsPending, tab: 'quotations', icon: FileSpreadsheet, color: 'text-violet-400 bg-violet-950/40 border-violet-800' },
    { label: 'Deals Won', value: dealsWon, tab: 'leads', icon: Trophy, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' },
    { label: 'Documents Pending', value: documentsPending, tab: 'documents', icon: Files, color: 'text-rose-400 bg-rose-950/40 border-rose-800' },
    { label: 'National Portal Pending', value: nationalPortalPending, tab: 'national-portal', icon: Globe2, color: 'text-orange-400 bg-orange-950/40 border-orange-800' },
    { label: 'MSEDCL Pending', value: msedclPending, tab: 'msedcl-pv', icon: Zap, color: 'text-yellow-400 bg-yellow-950/40 border-yellow-800' },
    { label: 'Advance Pending', value: advancePending, tab: 'accounts', icon: IndianRupee, color: 'text-pink-400 bg-pink-950/40 border-pink-800' },
    { label: 'Loan Pending', value: loanPending, tab: 'loans', icon: Landmark, color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800' },
    { label: 'Material Dispatch Pending', value: materialDispatchPending, tab: 'dispatch', icon: Truck, color: 'text-blue-400 bg-blue-950/40 border-blue-800' },
    { label: 'Installation Pending', value: installationPending, tab: 'installation', icon: Wrench, color: 'text-amber-400 bg-amber-950/40 border-amber-800' },
    { label: 'RTS Submission Pending', value: rtsSubmissionPending, tab: 'rts-release', icon: FileCheck2, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' },
    { label: 'Release Letter Pending', value: releaseLetterPending, tab: 'rts-release', icon: MailCheck, color: 'text-purple-400 bg-purple-950/40 border-purple-800' },
    { label: 'Net Meter Pending', value: netMeterPending, tab: 'net-meter', icon: Gauge, color: 'text-teal-400 bg-teal-950/40 border-teal-800' },
    { label: 'Inspection Pending', value: inspectionPending, tab: 'net-meter', icon: ShieldCheck, color: 'text-orange-400 bg-orange-950/40 border-orange-800' },
    { label: 'Subsidy Pending', value: subsidyPendingCount, tab: 'subsidy', icon: IndianRupee, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' },
    { label: 'Bank 2nd Disb. Pending', value: secondDisbPending, tab: 'loans', icon: Landmark, color: 'text-rose-400 bg-rose-950/40 border-rose-800' },
    { label: 'Final Payment Pending', value: finalPaymentPending, tab: 'accounts', icon: IndianRupee, color: 'text-yellow-400 bg-yellow-950/40 border-yellow-800' },
    { label: 'Completed Projects', value: completedProjects, tab: 'projects', icon: CheckCircle2, color: 'text-green-400 bg-green-950/40 border-green-800' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
              Nagpur Vidarbha Hub
            </span>
            <span className="text-slate-400 text-xs">PM Surya Ghar Muft Bijli Yojana Operations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            FRONTIER COMPLETE SOLAR SOLUTIONS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            End-to-End Vendor ERP • Master Consumer ID Pipeline FCSS-2026-XXXX
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenNewLead}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Lead</span>
          </button>
          <button
            onClick={() => onNavigateToTab('quotations')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span>New Quotation</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards (Requirement 3) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-amber-400" /> Financial Health & Receivables
          </h2>
          <span className="text-[11px] text-slate-500">Live Accounts Snapshot</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-400">Total Quotation Value</div>
            <div className="text-sm sm:text-base font-bold text-white mt-1">
              {formatCurrency(totalQuotationValue)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">{db.quotations.length} Quotes</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-400">Total Advance Received</div>
            <div className="text-sm sm:text-base font-bold text-emerald-400 mt-1">
              {formatCurrency(totalAdvanceReceived)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Booking & Advances</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-400">Customer Receivable</div>
            <div className="text-sm sm:text-base font-bold text-amber-400 mt-1">
              {formatCurrency(totalCustomerReceivable)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Pending collection</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-400">Total Loan Amount</div>
            <div className="text-sm sm:text-base font-bold text-sky-400 mt-1">
              {formatCurrency(totalLoanAmount)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Jan Samarth / Banks</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-400">Loan Disbursed</div>
            <div className="text-sm sm:text-base font-bold text-indigo-400 mt-1">
              {formatCurrency(loanDisbursed)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Phase 1 & 2 Received</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-400">Total Balance Due</div>
            <div className="text-sm sm:text-base font-bold text-rose-400 mt-1">
              {formatCurrency(totalBalanceDue)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Net outstanding</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] text-slate-400">Subsidy Pending</div>
            <div className="text-sm sm:text-base font-bold text-emerald-400 mt-1">
              {formatCurrency(totalSubsidyPendingAmount)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">PM Surya Ghar CFA</div>
          </div>
        </div>
      </div>

      {/* Top 20 Operational KPI Cards (Requirement 3) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" /> 20-Point Operational Lifecycle Pipeline
          </h2>
          <span className="text-[11px] text-slate-500">Click any card to inspect module</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {kpiCards.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigateToTab(kpi.tab)}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-left transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`p-1.5 rounded-lg border ${kpi.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 transition-colors" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-white">{kpi.value}</div>
                  <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                    {kpi.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Analytical Charts & Stage Pipeline Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Project Stages Visual Pipeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-amber-400" /> Active Projects by Lifecycle Stage
              </h3>
              <p className="text-[11px] text-slate-400">
                Single ID tracking from survey to net meter & subsidy
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('projects')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              View All Projects <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {db.projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                className="p-3 bg-slate-850 hover:bg-slate-800 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded">
                      {proj.id}
                    </span>
                    <span className="text-xs font-bold text-white truncate">
                      {proj.customerName}
                    </span>
                    <span className="text-[11px] text-slate-400">({proj.systemCapacityKw} kW)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                    <span>MSEDCL No: {proj.consumerNumber}</span>
                    <span>•</span>
                    <span>{proj.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-slate-800 text-sky-400 border border-slate-700">
                      {proj.stage}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      Balance: {formatCurrency(proj.balanceDue)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToTab('consumer-360', proj.id);
                    }}
                    className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-400 rounded-lg text-[10px] font-bold border border-amber-500/30 transition-colors"
                    title="Open Consumer 360° Master Profile"
                  >
                    360°
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Sources & Conversion Stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Lead Sources in Nagpur
            </h3>
            <div className="space-y-2.5">
              {[
                { source: 'Customer Reference', count: 3, percent: 50, color: 'bg-emerald-500' },
                { source: 'WhatsApp Marketing', count: 1, percent: 17, color: 'bg-sky-500' },
                { source: 'Google / Web Search', count: 1, percent: 17, color: 'bg-amber-500' },
                { source: 'Walk-in & Other', count: 1, percent: 16, color: 'bg-purple-500' },
              ].map((item) => (
                <div key={item.source} className="text-xs">
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span>{item.source}</span>
                    <span className="font-semibold text-white">
                      {item.count} leads ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick PM Surya Ghar Subsidy Rate Reference */}
          <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-800">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-1.5">
              <Sun className="w-4 h-4" /> PM Surya Ghar Central Assistance Rules
            </div>
            <div className="text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>1 kW Rooftop:</span>
                <span className="font-bold text-white">₹30,000</span>
              </div>
              <div className="flex justify-between">
                <span>2 kW Rooftop:</span>
                <span className="font-bold text-white">₹60,000</span>
              </div>
              <div className="flex justify-between">
                <span>3 kW and above:</span>
                <span className="font-bold text-white">₹78,000 (Max Cap)</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 mt-2">
              Credited directly to Aadhaar-seeded bank account post MSEDCL joint inspection.
            </div>
          </div>
        </div>
      </div>

      {/* Live Recent Chronological Activity Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" /> Recent Chronological Timeline Entries
          </h3>
          <span className="text-[11px] text-slate-400">Auto-recorded from lifecycle activities</span>
        </div>
        <div className="space-y-3">
          {db.activities.slice(0, 5).map((act) => (
            <div
              key={act.id}
              onClick={() => onSelectProject(act.projectId)}
              className="p-3 bg-slate-850/60 hover:bg-slate-800 rounded-xl border border-slate-800/80 cursor-pointer transition-colors flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-400 font-bold">{act.projectId}</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {act.category}
                  </span>
                </div>
                <div className="text-slate-200">{act.action}</div>
                <div className="text-[10px] text-slate-500">By {act.performedBy}</div>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0">{act.displayDate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
