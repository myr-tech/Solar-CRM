import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  CalendarDays,
  Compass,
  FileSpreadsheet,
  FolderKanban,
  Files,
  Globe2,
  Zap,
  Package,
  Truck,
  Wrench,
  CheckCheck,
  FileStack,
  FileCheck2,
  Gauge,
  CreditCard,
  Landmark,
  IndianRupee,
  ReceiptText,
  FolderArchive,
  ShieldCheck,
  HeadphonesIcon,
  ListTodo,
  BarChart3,
  MessageSquare,
  Sparkles,
  Printer,
} from 'lucide-react';
import { storage } from '../services/storage';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const db = storage.getDatabase();
  const alerts = storage.getAlerts();

  const totalLeads = db.leads.length;
  const activeProjects = db.projects.length;
  const pendingTasks = db.tasks.filter((t) => t.status !== 'Completed').length;
  const pendingDisbursements = db.loans.filter(
    (l) => l.status === 'Second Disbursement Requested' && !l.secondDisbursementReceivedDate
  ).length;

  const navSections: { sectionTitle: string; items: NavItem[] }[] = [
    {
      sectionTitle: 'Core Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'consumer-360', label: 'Consumer 360° Hub', icon: UserCheck, badge: 'Req #43', badgeColor: 'bg-amber-500 text-slate-950' },
        { id: 'projects', label: 'Projects (FCSS ID)', icon: FolderKanban, badge: activeProjects, badgeColor: 'bg-amber-500 text-slate-950' },
        { id: 'leads', label: 'Leads Management', icon: Users, badge: totalLeads },
        { id: 'appointments', label: 'Appointments Calendar', icon: CalendarDays },
        { id: 'surveys', label: 'Site Surveys & GPS', icon: Compass },
        { id: 'quotations', label: 'Quotation Builder', icon: FileSpreadsheet },
      ],
    },
    {
      sectionTitle: 'PM Surya Ghar & Discom',
      items: [
        { id: 'documents', label: 'Document Checklist', icon: Files },
        { id: 'national-portal', label: 'National Portal (PMSG)', icon: Globe2 },
        { id: 'msedcl-pv', label: 'MSEDCL PV Feasibility', icon: Zap },
        { id: 'msedcl-pack', label: 'MSEDCL 18-Doc Pack', icon: FileStack },
        { id: 'rts-release', label: 'RTS & Release Letter', icon: FileCheck2 },
        { id: 'net-meter', label: 'Net Meter & Inspection', icon: Gauge },
        { id: 'subsidy', label: 'PM Surya Ghar Subsidy', icon: IndianRupee },
        { id: 'printable-docs', label: 'Printable Formats & PDFs', icon: Printer, badge: '7 Formats', badgeColor: 'bg-emerald-500 text-slate-950 font-bold' },
      ],
    },
    {
      sectionTitle: 'Store, Logistics & Field',
      items: [
        { id: 'materials', label: 'Materials & Inventory', icon: Package },
        { id: 'dispatch', label: 'Dispatch & Challans', icon: Truck },
        { id: 'installation', label: 'Installation Checklist', icon: Wrench },
        { id: 'qc', label: 'Quality Control (QC)', icon: CheckCheck },
      ],
    },
    {
      sectionTitle: 'Finance & Handover',
      items: [
        { id: 'accounts', label: 'Payments & Receipts', icon: CreditCard },
        {
          id: 'loans',
          label: 'Jan Samarth Loans',
          icon: Landmark,
          badge: pendingDisbursements > 0 ? `${pendingDisbursements} Due` : undefined,
          badgeColor: 'bg-rose-500 text-white',
        },
        { id: 'invoices', label: 'GST Tax Invoices', icon: ReceiptText },
        { id: 'completion-file', label: 'Completion Digital File', icon: FolderArchive },
        { id: 'warranty-service', label: 'Warranty & Service Desk', icon: ShieldCheck },
      ],
    },
    {
      sectionTitle: 'Management & Tools',
      items: [
        { id: 'tasks', label: 'Task Management', icon: ListTodo, badge: pendingTasks > 0 ? pendingTasks : undefined },
        { id: 'reports', label: 'Reports & Exports', icon: BarChart3 },
        { id: 'whatsapp-hub', label: 'WhatsApp Message Hub', icon: MessageSquare },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 text-slate-300 select-none min-h-[calc(100vh-4rem)]">
      {/* Quick Master ID search shortcut badge */}
      <div className="p-3 mx-3 my-2 rounded-lg bg-slate-850 border border-slate-800 text-xs">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Single Project ID Format
        </div>
        <div className="font-mono text-amber-400 font-bold text-xs flex items-center justify-between">
          <span>FCSS-2026-XXXX</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
            Nagpur ERP
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {navSections.map((section) => (
          <div key={section.sectionTitle}>
            <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">
              {section.sectionTitle}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                          item.badgeColor || (isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-300">Frontier Solar ERP</span>
          <span className="text-[10px] text-emerald-400 font-semibold">100% Free DB</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          PM Surya Ghar Vendor • Vidarbha Circle
        </div>
      </div>
    </aside>
  );
};
