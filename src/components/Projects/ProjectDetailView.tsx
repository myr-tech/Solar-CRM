import React, { useState } from 'react';
import {
  FolderKanban,
  ArrowLeft,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Clock,
  IndianRupee,
  FileSpreadsheet,
  Files,
  Globe2,
  Zap,
  Package,
  Truck,
  Wrench,
  CheckCheck,
  FileStack,
  Gauge,
  Landmark,
  ReceiptText,
  FolderArchive,
  HeadphonesIcon,
  Activity,
  ListTodo,
  ExternalLink,
  MessageSquare,
  Navigation,
  Printer,
  AlertTriangle,
  Upload,
  User,
  UserCheck,
  MapPin,
  Phone,
} from 'lucide-react';
import { Consumer360View } from '../Consumer360/Consumer360View';
import { storage } from '../../services/storage';
import {
  Project,
  ProjectStage,
  DocumentItem,
  Payment,
  LoanRecord,
  InstallationRecord,
  QualityControlRecord,
  ServiceTicket,
} from '../../types';
import {
  formatCurrency,
  formatDate,
  generateGoogleMapsLink,
  generateWhatsAppLink,
} from '../../utils/formatters';

interface ProjectDetailViewProps {
  projectId: string;
  onBack: () => void;
  onOpenWhatsApp: (phone: string, name: string, projectId?: string) => void;
  onNavigateToTab: (tabId: string, projectId?: string) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  projectId,
  onBack,
  onOpenWhatsApp,
  onNavigateToTab,
}) => {
  const db = storage.getDatabase();
  const project = db.projects.find((p) => p.id === projectId);
  const [activeSubTab, setActiveSubTab] = useState<string>('OVERVIEW');

  if (!project) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div>Project {projectId} not found.</div>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs"
        >
          Back to Projects List
        </button>
      </div>
    );
  }

  // Linked entities
  const customer = db.customers.find((c) => c.projectId === project.id) || {
    name: project.customerName,
    consumerNumber: project.consumerNumber,
    mobile: project.mobile,
    whatsapp: project.whatsapp,
    address: project.address,
    city: project.city,
    msedclSdn: 'Besa Sub-Dn',
    sanctionedLoadKw: 4.0,
    phase: 'Single Phase',
  };

  const projectDocs = db.documents.filter((d) => d.projectId === project.id);
  const projectPayments = db.payments.filter((p) => p.projectId === project.id);
  const projectLoan = db.loans.find((l) => l.projectId === project.id);
  const projectMaterials = db.projectMaterials.filter((m) => m.projectId === project.id);
  const projectDispatches = db.dispatches.filter((d) => d.projectId === project.id);
  const projectInstallation = db.installations.find((i) => i.projectId === project.id);
  const projectQc = db.qcRecords.find((q) => q.projectId === project.id);
  const projectRts = db.rtsSubmissions.find((r) => r.projectId === project.id);
  const projectRelease = db.releaseLetters.find((r) => r.projectId === project.id);
  const projectNetMeter = db.netMeters.find((n) => n.projectId === project.id);
  const projectInspection = db.inspections.find((i) => i.projectId === project.id);
  const projectSubsidy = db.subsidies.find((s) => s.projectId === project.id);
  const projectTasks = db.tasks.filter((t) => t.projectId === project.id);
  const projectActivities = db.activities.filter((a) => a.projectId === project.id);
  const projectPreAgreement = db.preAgreements.find((a) => a.projectId === project.id);

  const allStages: ProjectStage[] = [
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
  ];

  const handleStageChange = (newStage: ProjectStage) => {
    storage.updateProject(project.id, { stage: newStage });
    storage.logActivity(project.id, `Project stage advanced to: ${newStage}`, 'Agreement');
  };

  const handleDocumentVerify = (docId: string, verified: boolean) => {
    storage.updateDocument(docId, { verified, uploaded: true });
  };

  const subTabs = [
    { id: '360', label: '🌟 Consumer 360° Page (Req 43)', icon: UserCheck },
    { id: 'OVERVIEW', label: '1. Overview & Single ID Hub', icon: FolderKanban },
    { id: 'DOCS', label: `2. Document Checklist (${project.documentsCompleteCount}/${project.documentsTotalCount})`, icon: Files },
    { id: 'MSEDCL', label: '3. National Portal & MSEDCL', icon: Zap },
    { id: 'FINANCIALS', label: '4. Payments & Balance Due', icon: IndianRupee },
    { id: 'LOAN', label: '5. Jan Samarth Bank Loan', icon: Landmark },
    { id: 'DISPATCH', label: '6. Materials & Dispatch', icon: Truck },
    { id: 'INSTALL', label: '7. Installation & Serials', icon: Wrench },
    { id: 'QC', label: '8. Mandatory QC (15-Point)', icon: CheckCheck },
    { id: 'NET_METER', label: '9. RTS, Net Meter & Inspection', icon: Gauge },
    { id: 'SUBSIDY', label: '10. PM Surya Ghar Subsidy', icon: ShieldCheck },
    { id: 'COMPLETION_FILE', label: '11. 24-Folder Digital File', icon: FolderArchive },
    { id: 'TIMELINE', label: '12. Chronological Timeline', icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Master Project ID */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
                title="Back to Projects"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base sm:text-lg font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl">
                  {project.id}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-sky-400 font-bold border border-slate-700">
                  {project.stage}
                </span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white mt-2">
              {project.customerName}
            </h1>
            <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap mt-1">
              <span className="font-mono text-slate-300">Consumer No: {project.consumerNumber}</span>
              <span>•</span>
              <span>{project.systemCapacityKw} kW Rooftop</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> {project.address}
              </span>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveSubTab(activeSubTab === '360' ? 'OVERVIEW' : '360')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                activeSubTab === '360'
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{activeSubTab === '360' ? 'Exit 360°' : '🌟 Consumer 360°'}</span>
            </button>

            <a
              href={generateGoogleMapsLink(project.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-sky-400 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </a>

            <button
              onClick={() => onOpenWhatsApp(project.mobile, project.customerName, project.id)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 rounded-xl text-xs font-semibold border border-emerald-800 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Customer</span>
            </button>

            {/* Stage Selector */}
            <select
              value={project.stage}
              onChange={(e) => handleStageChange(e.target.value as ProjectStage)}
              className="bg-amber-500 text-slate-950 font-bold text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
            >
              {allStages.map((st) => (
                <option key={st} value={st}>
                  Stage: {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Digital Drive Folder link (Requirement 39) */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <FolderArchive className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300 font-mono truncate">
              {project.driveFolderUrl || `Frontier Solar CRM / Projects / ${project.id} - ${project.customerName}`}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 shrink-0">
            Auto-Structured
          </span>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 text-xs select-none">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 0: CONSUMER 360 PAGE (Req 43) */}
      {activeSubTab === '360' && (
        <Consumer360View
          projectId={project.id}
          onBack={onBack}
          onOpenWhatsApp={onOpenWhatsApp}
          onNavigateToTab={onNavigateToTab}
        />
      )}

      {/* TAB 1: OVERVIEW */}
      {activeSubTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Lifecycle Metrics */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" /> Solar Plant & Project Summary
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <div className="text-slate-400">Total Project Value</div>
                  <div className="text-base font-bold text-white mt-1">
                    {formatCurrency(project.totalProjectValue)}
                  </div>
                  <div className="text-[10px] text-slate-500">Turnkey Supply</div>
                </div>

                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <div className="text-slate-400">Total Received</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">
                    {formatCurrency(project.totalReceived)}
                  </div>
                  <div className="text-[10px] text-slate-500">Advance + Loan</div>
                </div>

                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <div className="text-slate-400">Balance Due</div>
                  <div className="text-base font-bold text-rose-400 mt-1">
                    {formatCurrency(project.balanceDue)}
                  </div>
                  <div className="text-[10px] text-slate-500">Customer Balance</div>
                </div>

                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <div className="text-slate-400">Central Subsidy (CFA)</div>
                  <div className="text-base font-bold text-amber-400 mt-1">
                    {formatCurrency(project.subsidyAmount)}
                  </div>
                  <div className="text-[10px] text-slate-500">PM Surya Ghar</div>
                </div>
              </div>

              {/* Technical equipment assigned */}
              <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white">Installed Equipment & Serial Numbers:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                  <div>
                    Inverter Serial:{' '}
                    <strong className="text-amber-400 font-mono">
                      {project.inverterSerial || 'Awaiting Installation Capture'}
                    </strong>
                  </div>
                  <div>
                    Bi-directional Net Meter:{' '}
                    <strong className="text-emerald-400 font-mono">
                      {project.netMeterNumber || 'Pending MSEDCL Installation'}
                    </strong>
                  </div>
                  <div className="sm:col-span-2">
                    Panel Serials:{' '}
                    {project.panelSerials && project.panelSerials.length > 0 ? (
                      <span className="font-mono text-slate-300 text-[11px]">
                        {project.panelSerials.join(', ')}
                      </span>
                    ) : (
                      <span className="text-slate-500">To be recorded by electrician on site</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks linked to this project */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-amber-400" /> Pending Tasks for {project.id}
                </h3>
                <span className="text-[11px] text-slate-400">{projectTasks.length} tasks</span>
              </div>
              <div className="space-y-2">
                {projectTasks.length === 0 ? (
                  <div className="text-xs text-slate-500 py-3">No pending tasks for this stage.</div>
                ) : (
                  projectTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 bg-slate-850 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-white">{t.taskTitle}</div>
                        <div className="text-[11px] text-slate-400">
                          Assigned: {t.assignedEmployeeName} • Due: {formatDate(t.dueDate)}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.priority === 'Urgent'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Customer Info & Team */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-sky-400" /> Customer & Premises
              </h3>
              <div className="space-y-2.5 text-slate-300">
                <div>
                  <div className="text-slate-400 text-[11px]">Customer Name</div>
                  <div className="font-semibold text-white">{customer.name}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Calling & WhatsApp</div>
                  <div className="font-mono text-white">{customer.mobile}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">MSEDCL Consumer Number</div>
                  <div className="font-mono text-amber-400 font-bold">{customer.consumerNumber}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Sub-Division</div>
                  <div>{customer.msedclSdn}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Site Address</div>
                  <div>{customer.address}</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Assigned Frontier Team
              </h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sales Consultant:</span>
                  <span className="font-semibold text-white">{project.assignedSalesperson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Site Surveyor:</span>
                  <span className="font-semibold text-white">{project.assignedSurveyor || 'Nikhil Raut'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lead Electrician:</span>
                  <span className="font-semibold text-white">{project.assignedTechnician || 'Ganesh Patil'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MSEDCL Liaison:</span>
                  <span className="font-semibold text-white">Sneha Patil</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENT CHECKLIST (Requirement 10) */}
      {activeSubTab === 'DOCS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Mandatory Document Collection Checklist
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-xs font-mono ${
                    project.documentsCompleteCount === project.documentsTotalCount
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  DOCUMENTS: {project.documentsCompleteCount} / {project.documentsTotalCount} COMPLETE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                National Portal & MSEDCL registration cannot proceed until mandatory documents are verified.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {projectDocs.map((doc, idx) => (
              <div
                key={doc.id}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors ${
                  doc.verified
                    ? 'bg-slate-850 border-emerald-900/60 text-slate-200'
                    : 'bg-slate-850 border-slate-800 text-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="font-bold text-white">{doc.documentType}</span>
                    {doc.verified ? (
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    ) : doc.uploaded ? (
                      <span className="text-[10px] bg-sky-950 text-sky-400 border border-sky-800 px-2 py-0.5 rounded font-semibold">
                        UPLOADED - AWAITING VERIFICATION
                      </span>
                    ) : (
                      <span className="text-[10px] bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded font-semibold">
                        PENDING UPLOAD
                      </span>
                    )}
                  </div>
                  {doc.fileName && (
                    <div className="text-[11px] text-slate-400 font-mono">File: {doc.fileName}</div>
                  )}
                  {doc.verificationRemarks && (
                    <div className="text-[11px] text-slate-500 italic">"{doc.verificationRemarks}"</div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!doc.verified ? (
                    <button
                      onClick={() => handleDocumentVerify(doc.id, true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow"
                    >
                      Mark Verified
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDocumentVerify(doc.id, false)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                    >
                      Unverify
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NATIONAL PORTAL & MSEDCL */}
      {activeSubTab === 'MSEDCL' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* National Portal */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Globe2 className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-white uppercase tracking-wider">
                  National Portal (PM Surya Ghar)
                </h3>
                <div className="text-[11px] text-slate-400">pmsuryaghar.gov.in tracking</div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-slate-400">Application Reference ID</div>
                <div className="font-mono text-amber-400 font-bold text-sm mt-0.5">
                  PM-SG-2026-MH-{project.id.slice(-4)}
                </div>
              </div>
              <div>
                <div className="text-slate-400">Registration Status</div>
                <div className="font-semibold text-emerald-400 text-sm mt-0.5">
                  {project.documentsCompleteCount === project.documentsTotalCount
                    ? 'Registration Completed & Vendor Frontier Accepted'
                    : 'Documents Incomplete'}
                </div>
              </div>
              <div>
                <div className="text-slate-400">Responsible Liaison Officer</div>
                <div className="text-white font-medium mt-0.5">Sneha Patil (Office Staff)</div>
              </div>
            </div>
          </div>

          {/* MSEDCL PV Application */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-white uppercase tracking-wider">
                  MSEDCL PV Feasibility & SDN
                </h3>
                <div className="text-[11px] text-slate-400">Maharashtra State Electricity Distribution Co.</div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-slate-400">PV Application Number</div>
                <div className="font-mono text-white font-bold text-sm mt-0.5">
                  MSEDCL-PV-2026-98124
                </div>
              </div>
              <div>
                <div className="text-slate-400">MSEDCL Sub-Division (SDN)</div>
                <div className="text-white font-medium mt-0.5">Besa Sub-Division 4402, Nagpur</div>
              </div>
              <div>
                <div className="text-slate-400">Feasibility Status</div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-xs mt-0.5">
                  Feasibility Approved
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENTS & FINANCIALS */}
      {activeSubTab === 'FINANCIALS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Payment Ledger & Balance Due Calculation
              </h2>
              <div className="text-xs text-slate-400">
                Formula: Total Project Value ({formatCurrency(project.totalProjectValue)}) - Total Received ({formatCurrency(project.totalReceived)}) = Balance Due ({formatCurrency(project.balanceDue)})
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-850 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                <tr>
                  <th className="p-3">Receipt No & Date</th>
                  <th className="p-3">Payment Stage Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Mode & Bank</th>
                  <th className="p-3">Txn Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {projectPayments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-500">
                      No payments recorded yet for this project.
                    </td>
                  </tr>
                ) : (
                  projectPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-850/50">
                      <td className="p-3 font-mono">
                        <span className="font-bold text-amber-400">{pay.receiptNumber}</span>
                        <div className="text-[10px] text-slate-500">{formatDate(pay.date)}</div>
                      </td>
                      <td className="p-3 font-semibold text-white">{pay.paymentType}</td>
                      <td className="p-3 font-bold text-emerald-400 font-mono">
                        {formatCurrency(pay.amount)}
                      </td>
                      <td className="p-3">
                        {pay.mode} ({pay.bankName})
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-400">
                        {pay.transactionNumber}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: JAN SAMARTH LOAN */}
      {activeSubTab === 'LOAN' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Landmark className="w-4 h-4 text-amber-400" /> Jan Samarth Portal Bank Loan Tracking
              </h2>
              <div className="text-slate-400">
                Central government rooftop solar collateral-free loan tracking with 1st & 2nd disbursement
              </div>
            </div>
            {projectLoan && (
              <span className="px-3 py-1 rounded-full bg-slate-800 text-sky-400 border border-slate-700 font-bold text-xs">
                {projectLoan.status}
              </span>
            )}
          </div>

          {projectLoan ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                <div className="text-slate-400">Financing Bank</div>
                <div className="font-bold text-white text-sm mt-1">{projectLoan.bankOrNbfc}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  App No: {projectLoan.janSamarthAppNumber}
                </div>
              </div>

              <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                <div className="text-slate-400">1st Disbursement (Post Sanction)</div>
                <div className="font-bold text-emerald-400 text-sm mt-1">
                  {formatCurrency(projectLoan.firstDisbursementAmount || 120000)}
                </div>
                <div className="text-[11px] text-slate-500">Credited to Vendor Account</div>
              </div>

              <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                <div className="text-slate-400">2nd Disbursement (Post Inspection)</div>
                <div className="font-bold text-amber-400 text-sm mt-1">
                  {formatCurrency(projectLoan.secondDisbursementAmount || 30000)}
                </div>
                <div className="text-[11px] text-rose-400 font-semibold">
                  {projectLoan.secondDisbursementReceivedDate
                    ? 'Disbursed'
                    : 'Pending Bank Release (>5 Days)'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-center py-8">Customer opted for direct self-finance.</div>
          )}
        </div>
      )}

      {/* TAB 6: MATERIALS & DISPATCH */}
      {activeSubTab === 'DISPATCH' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Allocated Material BoS & Delivery Challans
              </h2>
              <div className="text-slate-400">Warehoused in MIDC Hingna Depot, Nagpur</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-white text-xs">Reserved Project Materials:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projectMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-3 bg-slate-850 rounded-xl border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-white">{mat.itemName}</div>
                    <div className="text-[11px] text-slate-400">
                      Brand: {mat.brand} ({mat.model})
                    </div>
                  </div>
                  <span className="font-bold text-amber-400 font-mono text-sm">
                    {mat.requiredQuantity} {mat.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: INSTALLATION & SERIALS */}
      {activeSubTab === 'INSTALL' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Rooftop Installation & Serial Number Capture
              </h2>
              <div className="text-slate-400">Lead Electrician: Ganesh Patil (+91 9823011228)</div>
            </div>
          </div>

          <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 space-y-3">
            <div className="font-bold text-white text-xs">Recorded Equipment Serial Numbers:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-[11px]">Inverter Serial Number:</label>
                <input
                  type="text"
                  readOnly
                  value={project.inverterSerial || 'INV-POL-3KW-90214'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-mono font-bold mt-1"
                />
              </div>
              <div>
                <label className="text-slate-400 text-[11px]">Net Meter Serial Number:</label>
                <input
                  type="text"
                  readOnly
                  value={project.netMeterNumber || 'SEC-DL-982142'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 font-mono font-bold mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: MANDATORY QUALITY CONTROL (15-POINT QC) */}
      {activeSubTab === 'QC' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCheck className="w-5 h-5 text-amber-400" /> Mandatory 15-Point Quality Control (QC)
              </h2>
              <div className="text-slate-400">
                Installation cannot be certified until mandatory safety and electrical checks pass.
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full font-bold text-xs">
              STATUS: PASSED (2.4 OHMS)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              'Structure Fasteners & Tightening verified (150 kmph wind test)',
              'Solar Panel True South Alignment & Clamp Torque verified',
              'DC Polarity verified before inverter connection',
              'MC4 Connectors Crimped & Waterproofed with heat shrink',
              'Cable Dressing via rigid UV conduits and SS ties',
              'Chemical Earth Resistance within norms (< 5 Ohms - Measured 2.4Ω)',
              'AC Connection Breakers (MCB/MCCB) rated accurately',
              'DCDB Surge Protection Device (SPD) 1000V operational',
              'ACDB Surge Protection Device (SPD) Type II operational',
              'Inverter Body Earthing & Solar Neutral separated',
              'Generation Voltage within MSEDCL limits (230V / 415V ± 5%)',
              'Bilingual Warning Labels (English & Marathi) pasted on DB',
              'Anti-Islanding Protection Trip tested successfully',
              'Rooftop debris cleaned post-installation',
              'Geotagged Photographs archived in Project Completion file',
            ].map((check, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-slate-850 rounded-lg border border-emerald-900/40 text-slate-200 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{check}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: NET METER & INSPECTION */}
      {activeSubTab === 'NET_METER' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-400" /> MSEDCL RTS, Net Meter & Inspection
              </h2>
              <div className="text-slate-400">MSEDCL Besa / Nagpur Circle commissioning</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-800">
              <div className="text-slate-400">MSEDCL Release Letter</div>
              <div className="font-mono text-emerald-400 font-bold text-sm mt-1">
                RL-BESA-2026/894
              </div>
              <div className="text-[11px] text-slate-500">Issued 30 Sep 2026</div>
            </div>

            <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-800">
              <div className="text-slate-400">Bi-directional Net Meter</div>
              <div className="font-mono text-amber-400 font-bold text-sm mt-1">
                SEC-DL-982142
              </div>
              <div className="text-[11px] text-slate-500">Tested & Synchronized</div>
            </div>

            <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-800">
              <div className="text-slate-400">Joint Inspection & WCR</div>
              <div className="font-mono text-sky-400 font-bold text-sm mt-1">
                MSEDCL-CC-2026-9902
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold">Passed & Certified</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: SUBSIDY TRACKER */}
      {activeSubTab === 'SUBSIDY' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> PM Surya Ghar Central Assistance (Subsidy)
              </h2>
              <div className="text-slate-400">Central Financial Assistance directly to Customer Bank A/c</div>
            </div>
            <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full font-bold text-xs">
              CLAIM SUBMITTED
            </span>
          </div>

          <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Sanctioned Subsidy Amount:</span>
              <span className="text-lg font-black text-emerald-400 font-mono">₹78,000</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Claim Reference: PMSG-SUB-CLM-2026-8812 • Beneficiary Bank: State Bank of India
            </div>
          </div>
        </div>
      )}

      {/* TAB 11: 24-FOLDER DIGITAL COMPLETION FILE (Requirement 28) */}
      {activeSubTab === 'COMPLETION_FILE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-amber-400" /> Consumer Completion File (24-Folder Architecture)
              </h2>
              <div className="text-slate-400">
                Complete digital audit package for Discom, PM Surya Ghar & Customer Handover
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[
              '01 Customer Documents',
              '02 Electricity Bill',
              '03 Site Survey',
              '04 Quotation',
              '05 Pre Agreement',
              '06 Payment Receipts',
              '07 Loan',
              '08 National Portal',
              '09 MSEDCL Application',
              '10 Material Dispatch',
              '11 Installation Photos',
              '12 Serial Numbers',
              '13 WCR',
              '14 DCR Certificate',
              '15 Net Agreement',
              '16 Vendor Agreement',
              '17 RTS Submission',
              '18 Release Letter',
              '19 Net Meter',
              '20 Completion',
              '21 Subsidy',
              '22 Invoice',
              '23 Warranty',
              '24 Service History',
            ].map((folder, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-850 rounded-xl border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <FolderArchive className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold text-slate-200">{folder}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold font-mono">READY</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 12: CHRONOLOGICAL TIMELINE (Requirement 32) */}
      {activeSubTab === 'TIMELINE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" /> Complete Chronological Project Timeline
              </h2>
              <div className="text-slate-400">
                Auto-updated real-time event log for Project {project.id}
              </div>
            </div>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {projectActivities.length === 0 ? (
              <div className="text-slate-500 py-4">No events logged yet.</div>
            ) : (
              projectActivities.map((act) => (
                <div key={act.id} className="relative space-y-1">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-slate-900" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{act.displayDate}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400">
                      {act.category}
                    </span>
                  </div>
                  <div className="text-slate-300">{act.action}</div>
                  <div className="text-[10px] text-slate-500">Performed by: {act.performedBy}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
