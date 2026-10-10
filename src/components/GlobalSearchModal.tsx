import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  FolderKanban,
  User,
  Phone,
  Hash,
  Cpu,
  FileText,
  Truck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { storage } from '../services/storage';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
  onSelectTab: (tabId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onSelectTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const db = storage.getDatabase();

  const results = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];

    const matches: {
      type: string;
      title: string;
      subtitle: string;
      badge: string;
      projectId?: string;
      actionTab?: string;
    }[] = [];

    // 1. Projects & Customers (Consumer ID, Name, Mobile, Consumer No)
    db.projects.forEach((p) => {
      if (
        p.id.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.consumerNumber.includes(q) ||
        p.mobile.includes(q) ||
        p.address.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'Project / Customer',
          title: `${p.id} - ${p.customerName}`,
          subtitle: `Consumer No: ${p.consumerNumber} • ${p.systemCapacityKw} kW • ${p.address}`,
          badge: p.stage,
          projectId: p.id,
        });
      }
    });

    // 2. Leads
    db.leads.forEach((l) => {
      if (
        l.customerName.toLowerCase().includes(q) ||
        l.mobile.includes(q) ||
        l.consumerNumber.includes(q) ||
        l.address.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'Lead',
          title: `Lead: ${l.customerName} (${l.interestedCapacityKw} kW)`,
          subtitle: `Mobile: ${l.mobile} • Source: ${l.leadSource} • Next: ${l.nextFollowUpDate}`,
          badge: l.status,
          projectId: l.projectId,
          actionTab: 'leads',
        });
      }
    });

    // 3. Serial Numbers (Panels & Inverters)
    db.projects.forEach((p) => {
      if (p.inverterSerial && p.inverterSerial.toLowerCase().includes(q)) {
        matches.push({
          type: 'Inverter Serial',
          title: `Inverter: ${p.inverterSerial}`,
          subtitle: `Installed at ${p.customerName} (${p.id})`,
          badge: 'Installed Inverter',
          projectId: p.id,
        });
      }
      if (p.panelSerials) {
        const found = p.panelSerials.find((sn) => sn.toLowerCase().includes(q));
        if (found) {
          matches.push({
            type: 'Panel Serial',
            title: `Panel Serial: ${found}`,
            subtitle: `Belongs to ${p.customerName} (${p.id})`,
            badge: 'Waaree / Adani DCR',
            projectId: p.id,
          });
        }
      }
    });

    // 4. MSEDCL PV Applications
    db.msedclApps.forEach((app) => {
      if (app.pvApplicationNumber.toLowerCase().includes(q) || app.consumerNumber.includes(q)) {
        matches.push({
          type: 'MSEDCL PV Application',
          title: `MSEDCL App: ${app.pvApplicationNumber}`,
          subtitle: `Consumer: ${app.consumerNumber} • Feasibility: ${app.feasibilityStatus}`,
          badge: app.status,
          projectId: app.projectId,
          actionTab: 'msedcl-pv',
        });
      }
    });

    // 5. Invoices
    db.invoices.forEach((inv) => {
      if (inv.invoiceNumber.toLowerCase().includes(q) || inv.customerName.toLowerCase().includes(q)) {
        matches.push({
          type: 'Invoice',
          title: `Invoice: ${inv.invoiceNumber} (${inv.customerName})`,
          subtitle: `Amount: ₹${inv.totalInvoiceAmount.toLocaleString('en-IN')} • Balance Due: ₹${inv.balanceDue.toLocaleString('en-IN')}`,
          badge: inv.status,
          projectId: inv.projectId,
          actionTab: 'invoices',
        });
      }
    });

    // 6. Dispatch Challans
    db.dispatches.forEach((disp) => {
      if (
        disp.dispatchNumber.toLowerCase().includes(q) ||
        disp.vehicleNumber.toLowerCase().includes(q) ||
        disp.driverName.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'Dispatch Challan',
          title: `Challan: ${disp.dispatchNumber} (Vehicle: ${disp.vehicleNumber})`,
          subtitle: `Customer: ${disp.customerName} • Driver: ${disp.driverName}`,
          badge: disp.status,
          projectId: disp.projectId,
          actionTab: 'dispatch',
        });
      }
    });

    return matches;
  }, [searchTerm, db]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type Consumer ID (FCSS-2026-0001), Name, Mobile, MSEDCL App, Serial No, Invoice..."
            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-slate-500 font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <span className="text-xs font-medium">ESC</span>
          </button>
        </div>

        {/* Quick Sample Suggestions */}
        {!searchTerm && (
          <div className="p-4 border-b border-slate-800 bg-slate-850/50">
            <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wide">
              Quick Suggestions:
            </div>
            <div className="flex flex-wrap gap-2">
              {['FCSS-2026-0001', 'Milind Vaidya', '410019283741', 'Besa', 'INV-POL-3KW', 'MSEDCL-PV'].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-400 font-mono border border-slate-700"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-slate-800/60">
          {searchTerm && results.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              No matching records found for "{searchTerm}".
            </div>
          )}

          {results.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (item.projectId) {
                  onSelectProject(item.projectId);
                } else if (item.actionTab) {
                  onSelectTab(item.actionTab);
                }
                onClose();
              }}
              className="p-3 hover:bg-slate-800/80 rounded-xl cursor-pointer transition-colors group flex items-start justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {item.type}
                  </span>
                  <span className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors truncate">
                    {item.title}
                  </span>
                </div>
                <div className="text-xs text-slate-400 truncate">{item.subtitle}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-medium border border-slate-700">
                  {item.badge}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Search Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Global Search across all 40+ solar data entities</span>
          <span className="text-slate-400 font-mono">Frontier Solar CRM</span>
        </div>
      </div>
    </div>
  );
};
