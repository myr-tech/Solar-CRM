import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Camera,
  Navigation,
  Phone,
  Sun,
  ShieldCheck,
  Save,
  Check,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { InstallationRecord } from '../../types';
import { generateGoogleMapsLink, formatDate } from '../../utils/formatters';

interface InstallationViewProps {
  onSelectProject: (projectId: string) => void;
}

export const InstallationView: React.FC<InstallationViewProps> = ({ onSelectProject }) => {
  const db = storage.getDatabase();
  const [selectedInst, setSelectedInst] = useState<InstallationRecord>(
    db.installations[0] || createDefaultInstallation()
  );
  const [isSaved, setIsSaved] = useState(false);

  // New serial input state
  const [newPanelSerial, setNewPanelSerial] = useState('');

  function createDefaultInstallation(): InstallationRecord {
    return {
      id: 'INST-2026-001',
      projectId: 'FCSS-2026-0001',
      customerName: 'Dr. Milind Vaidya',
      address: 'Plot 42, Sai Nagar, Besa, Nagpur',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=21.0825,79.0882',
      systemCapacityKw: 3.3,
      leadTechnician: 'Ganesh Patil',
      technicianPhone: '9823011228',
      scheduledDate: '2026-09-25',
      completionDate: '2026-09-26',
      status: 'Completed',
      checklist: {
        structureInstalled: true,
        panelsMountedAndAligned: true,
        dcCableConcealedTray: true,
        acCableConnected: true,
        acdbInstalled: true,
        dcdbInstalled: true,
        earthingPitsConnected: true,
        lightningProtectionInstalled: true,
        inverterWallMounted: true,
        mainMeterBoardConnection: true,
        cableDressingDone: true,
        safetyLabelsWarningPasted: true,
        generationActiveTested: true,
        wifiMonitoringSetup: true,
        customerDemoGiven: true,
        safetyChecksCleanRoof: true,
      },
      panelSerialNumbers: [
        'WAR-550-26A-0101',
        'WAR-550-26A-0102',
        'WAR-550-26A-0103',
        'WAR-550-26A-0104',
        'WAR-550-26A-0105',
        'WAR-550-26A-0106',
      ],
      inverterSerialNumber: 'INV-POL-3KW-90214',
      acdbSerialNumber: 'ACDB-POL-091',
      dcdbSerialNumber: 'DCDB-POL-092',
      photos: {},
      technicianNotes: 'Installation completed cleanly. Peak generation test recorded 3.12 kW in full sun.',
    };
  }

  const checklistItems = [
    { key: 'structureInstalled', label: '1. Elevated GI Structure Mounted & Anchor Fastened' },
    { key: 'panelsMountedAndAligned', label: '2. Solar Panels Mounted, True South & Mid-Clamps Torqued' },
    { key: 'dcCableConcealedTray', label: '3. DC Solar Cable Routed inside Rigid UV Conduits' },
    { key: 'acCableConnected', label: '4. AC Armoured Cable Terminated into Main Board' },
    { key: 'acdbInstalled', label: '5. IP65 ACDB with Type II Surge Protection Device Fitted' },
    { key: 'dcdbInstalled', label: '6. IP65 DCDB 1000V DC Isolator & Fuse Fitted' },
    { key: 'earthingPitsConnected', label: '7. Chemical Earth Pits Connected (Inverter AC, DC & LA)' },
    { key: 'lightningProtectionInstalled', label: '8. Copper Lightning Arrester (LA) Terminal Erected' },
    { key: 'inverterWallMounted', label: '9. On-Grid Inverter Mounted with Ventilation Clearance' },
    { key: 'mainMeterBoardConnection', label: '10. Bi-directional Net Meter Isolator Switch Wired' },
    { key: 'cableDressingDone', label: '11. Cable Dressing with Stainless Steel Ties Completed' },
    { key: 'safetyLabelsWarningPasted', label: '12. Bilingual Safety Warning & Single Line Diagram Pasted' },
    { key: 'generationActiveTested', label: '13. Live Grid Sync & Generation Active Power Tested' },
    { key: 'wifiMonitoringSetup', label: '14. Wi-Fi Inverter App & Cloud Monitoring Configured' },
    { key: 'customerDemoGiven', label: '15. Customer Handover & Demonstration Completed' },
    { key: 'safetyChecksCleanRoof', label: '16. Safety Clean-up & Metal Shavings Removed from Roof' },
  ] as const;

  const handleToggleCheck = (key: keyof typeof selectedInst.checklist) => {
    setSelectedInst({
      ...selectedInst,
      checklist: {
        ...selectedInst.checklist,
        [key]: !selectedInst.checklist[key],
      },
    });
  };

  const handleAddPanelSerial = () => {
    if (!newPanelSerial.trim()) return;
    setSelectedInst({
      ...selectedInst,
      panelSerialNumbers: [...selectedInst.panelSerialNumbers, newPanelSerial.trim()],
    });
    setNewPanelSerial('');
  };

  const handleRemovePanelSerial = (idx: number) => {
    const updated = [...selectedInst.panelSerialNumbers];
    updated.splice(idx, 1);
    setSelectedInst({
      ...selectedInst,
      panelSerialNumbers: updated,
    });
  };

  const handleSaveInstallation = () => {
    storage.updateInstallation(selectedInst.projectId, selectedInst);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const checkedCount = Object.values(selectedInst.checklist).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Wrench className="w-6 h-6 text-amber-400" /> Technician Field Installation Screen
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Mobile-optimized rooftop screen: 16-point checklist, panel & inverter barcode serial capture
          </p>
        </div>

        <button
          onClick={handleSaveInstallation}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-md"
        >
          <Save className="w-4 h-4" />
          <span>{isSaved ? 'Installation Saved!' : 'Save Field Report'}</span>
        </button>
      </div>

      {/* Project Selector bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Select Project:</span>
          <select
            value={selectedInst.projectId}
            onChange={(e) => {
              const found = db.installations.find((i) => i.projectId === e.target.value);
              if (found) setSelectedInst(found);
            }}
            className="bg-slate-800 border border-slate-700 text-amber-400 font-mono rounded-lg px-3 py-1.5 focus:outline-none"
          >
            {db.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.customerName} ({p.systemCapacityKw} kW)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={generateGoogleMapsLink(selectedInst.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-medium"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Google Maps Route</span>
          </a>
          <button
            onClick={() => onSelectProject(selectedInst.projectId)}
            className="text-amber-400 hover:underline font-mono"
          >
            Open Project Hub →
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 16-Point Checklist */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Mandatory 16-Point Installation Checklist
              </h2>
              <div className="text-xs text-slate-400">Complete before initiating MSEDCL joint inspection</div>
            </div>
            <span
              className={`text-xs font-bold font-mono px-3 py-1 rounded-full border ${
                checkedCount === 16
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : 'bg-amber-950 text-amber-400 border-amber-800'
              }`}
            >
              {checkedCount} / 16 COMPLETE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {checklistItems.map((item) => {
              const isChecked = selectedInst.checklist[item.key as keyof typeof selectedInst.checklist];
              return (
                <div
                  key={item.key}
                  onClick={() => handleToggleCheck(item.key as keyof typeof selectedInst.checklist)}
                  className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-center gap-3 text-xs ${
                    isChecked
                      ? 'bg-emerald-950/40 border-emerald-800 text-white font-medium'
                      : 'bg-slate-850 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-600 bg-slate-800'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="leading-tight">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Serial Numbers & Electrician Info */}
        <div className="space-y-6">
          {/* Equipment Serial Numbers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
            <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" /> Capture Equipment Serials
            </h3>

            {/* Inverter Serial */}
            <div>
              <label className="text-slate-400 font-medium">Inverter Serial Number *</label>
              <input
                type="text"
                value={selectedInst.inverterSerialNumber}
                onChange={(e) =>
                  setSelectedInst({ ...selectedInst, inverterSerialNumber: e.target.value })
                }
                placeholder="e.g. INV-POL-3KW-90214"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-mono font-bold mt-1"
              />
            </div>

            {/* Panel Serial Numbers multi-entry */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 font-medium">
                  Solar Panel Serial Numbers ({selectedInst.panelSerialNumbers.length} Entered)
                </label>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPanelSerial}
                  onChange={(e) => setNewPanelSerial(e.target.value)}
                  placeholder="Scan or type panel serial"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPanelSerial();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddPanelSerial}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg"
                >
                  Add
                </button>
              </div>

              {/* Serials List */}
              <div className="mt-2.5 max-h-40 overflow-y-auto space-y-1.5 p-2 bg-slate-850 rounded-lg border border-slate-800 font-mono text-[11px]">
                {selectedInst.panelSerialNumbers.map((sn, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-1 px-2 rounded bg-slate-800 text-slate-200"
                  >
                    <span>
                      #{idx + 1}: {sn}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePanelSerial(idx)}
                      className="text-rose-400 hover:text-rose-300 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Technician notes */}
            <div>
              <label className="text-slate-400 font-medium">Technician Completion Notes</label>
              <textarea
                rows={2}
                value={selectedInst.technicianNotes || ''}
                onChange={(e) =>
                  setSelectedInst({ ...selectedInst, technicianNotes: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white mt-1"
                placeholder="Generation test reading, VOC, ISC..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
