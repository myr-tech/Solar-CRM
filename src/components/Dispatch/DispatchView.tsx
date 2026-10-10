import React, { useState } from 'react';
import {
  Truck,
  PlusCircle,
  MessageSquare,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ExternalLink,
  PackageCheck,
  Calendar,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { DispatchChallan, DispatchStatus } from '../../types';
import { generateGoogleMapsLink, formatDate } from '../../utils/formatters';

interface DispatchViewProps {
  onOpenWhatsApp: (phone: string, name: string, projectId?: string) => void;
  onSelectProject: (projectId: string) => void;
}

export const DispatchView: React.FC<DispatchViewProps> = ({
  onOpenWhatsApp,
  onSelectProject,
}) => {
  const db = storage.getDatabase();
  const [selectedChallan, setSelectedChallan] = useState<DispatchChallan>(
    db.dispatches[0] || db.dispatches[1]
  );
  const [activeTab, setActiveTab] = useState<'LIST' | 'PRINTABLE_CHALLAN'>('LIST');

  const handleStatusChange = (challanId: string, status: DispatchStatus) => {
    storage.updateDispatch(challanId, { status });
    if (selectedChallan.id === challanId) {
      setSelectedChallan({ ...selectedChallan, status });
    }
  };

  const handleGenerateDriverWhatsApp = (ch: DispatchChallan) => {
    const materialSummary = ch.materials
      .map((m) => `• ${m.item}: ${m.quantity} ${m.unit}`)
      .join('\n');

    const msg = `*SOLAR MATERIAL DISPATCH CHALLAN*\n\nConsumer: *${ch.customerName}*\nProject ID: *${ch.projectId}*\n\nLocation:\n${ch.googleMapsUrl || generateGoogleMapsLink(ch.address)}\n\nMaterial Checklist:\n${materialSummary}\n\nDriver: ${ch.driverName}\nVehicle: ${ch.vehicleNumber}\n\nPlease inspect materials upon arrival and confirm delivery photo after unloading.\n\nFrontier Complete Solar Solutions Logistics Desk\nMIDC Hingna, Nagpur`;

    const link = `https://wa.me/91${ch.driverMobile.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-amber-400" /> Dispatch & Driver Logistics Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Generate delivery challans, assign drivers, generate WhatsApp driver routing & track site deliveries
          </p>
        </div>

        <button
          onClick={() => setActiveTab(activeTab === 'LIST' ? 'PRINTABLE_CHALLAN' : 'LIST')}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>{activeTab === 'LIST' ? 'View Printable Challan' : 'Back to Challans List'}</span>
        </button>
      </div>

      {activeTab === 'LIST' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Challans List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Dispatch Challans ({db.dispatches.length})
            </div>
            <div className="space-y-2.5">
              {db.dispatches.map((ch) => {
                const isSelected = selectedChallan?.id === ch.id;
                return (
                  <div
                    key={ch.id}
                    onClick={() => setSelectedChallan(ch)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-slate-850 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {ch.dispatchNumber}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          ch.status === 'Delivered'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : ch.status === 'Dispatched'
                            ? 'bg-sky-950 text-sky-400 border-sky-800'
                            : 'bg-amber-950 text-amber-400 border-amber-800'
                        }`}
                      >
                        {ch.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white mt-1">{ch.customerName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                      <span className="font-mono">{ch.projectId}</span>
                      <span>Vehicle: {ch.vehicleNumber}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Challan View */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            {selectedChallan && (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {selectedChallan.dispatchNumber}
                      </span>
                      <button
                        onClick={() => onSelectProject(selectedChallan.projectId)}
                        className="text-xs font-mono text-sky-400 hover:underline flex items-center gap-1"
                      >
                        {selectedChallan.projectId} <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <h2 className="text-base font-black text-white mt-1">
                      {selectedChallan.customerName}
                    </h2>
                    <div className="text-xs text-slate-400">{selectedChallan.address}</div>
                  </div>

                  {/* Status Action Buttons (Requirement 17) */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleStatusChange(selectedChallan.id, 'Dispatched')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        selectedChallan.status === 'Dispatched'
                          ? 'bg-sky-500 text-slate-950 border-sky-400 shadow'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-sky-400'
                      }`}
                    >
                      DISPATCHED
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedChallan.id, 'Delivered')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        selectedChallan.status === 'Delivered'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-400'
                      }`}
                    >
                      DELIVERED
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedChallan.id, 'Shortage / Damage Reported')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        selectedChallan.status === 'Shortage / Damage Reported'
                          ? 'bg-rose-500 text-white border-rose-400 shadow'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-rose-400'
                      }`}
                    >
                      SHORTAGE / DAMAGE
                    </button>
                  </div>
                </div>

                {/* Driver & Vehicle Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-850 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <div className="text-slate-400">Assigned Driver</div>
                    <div className="font-bold text-white text-sm mt-0.5">
                      {selectedChallan.driverName}
                    </div>
                    <div className="text-slate-400 font-mono mt-0.5">
                      Ph: {selectedChallan.driverMobile}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Vehicle Number</div>
                    <div className="font-mono font-bold text-amber-400 text-sm mt-0.5">
                      {selectedChallan.vehicleNumber}
                    </div>
                    <div className="text-slate-500">Pick-up: Nagpur MIDC Depot</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Dispatch Date</div>
                    <div className="font-semibold text-white text-sm mt-0.5">
                      {formatDate(selectedChallan.dispatchDate)}
                    </div>
                    <div className="text-[11px] text-emerald-400 mt-0.5">
                      {selectedChallan.status}
                    </div>
                  </div>
                </div>

                {/* Material Checklist on Challan */}
                <div className="space-y-3">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                    Equipment & Materials on Vehicle:
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300 border border-slate-800 rounded-xl overflow-hidden">
                      <thead className="bg-slate-850 border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                        <tr>
                          <th className="p-2.5">Item Description</th>
                          <th className="p-2.5 text-center">Quantity</th>
                          <th className="p-2.5 text-center">Unit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {selectedChallan.materials.map((m, idx) => (
                          <tr key={idx} className="hover:bg-slate-850/40">
                            <td className="p-2.5 font-semibold text-white">{m.item}</td>
                            <td className="p-2.5 text-center font-mono font-bold text-amber-400">
                              {m.quantity}
                            </td>
                            <td className="p-2.5 text-center font-mono text-slate-400">{m.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action buttons: Driver WhatsApp Message & Google Maps navigation */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
                  <a
                    href={selectedChallan.googleMapsUrl || generateGoogleMapsLink(selectedChallan.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-sky-400 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate to Site</span>
                  </a>

                  <button
                    onClick={() => handleGenerateDriverWhatsApp(selectedChallan)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send Driver WhatsApp Dispatch Message</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Printable Dispatch Delivery Challan (Requirement 17) */
        <div className="bg-white text-slate-900 rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl border border-slate-200 print:p-0 print:border-none">
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
            <div>
              <div className="text-xl font-black text-slate-950 tracking-tight">
                FRONTIER COMPLETE SOLAR SOLUTIONS
              </div>
              <div className="text-xs text-slate-600 font-bold">
                CENTRAL LOGISTICS & DISPATCH DEPOT • MIDC HINGNA, NAGPUR
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded border border-amber-300">
                MATERIAL DELIVERY CHALLAN
              </span>
              <div className="font-mono text-xs text-slate-700 mt-1">
                Challan No: <strong>{selectedChallan?.dispatchNumber}</strong>
              </div>
              <div className="text-xs text-slate-500">Date: {formatDate(selectedChallan?.dispatchDate)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-300 mb-6 text-xs">
            <div>
              <div>Consumer Name: <strong>{selectedChallan?.customerName}</strong></div>
              <div>Project ID: <strong>{selectedChallan?.projectId}</strong></div>
              <div>Delivery Address: <strong>{selectedChallan?.address}</strong></div>
            </div>
            <div>
              <div>Assigned Driver: <strong>{selectedChallan?.driverName}</strong></div>
              <div>Driver Mobile: <strong>{selectedChallan?.driverMobile}</strong></div>
              <div>Vehicle Number: <strong>{selectedChallan?.vehicleNumber}</strong></div>
            </div>
          </div>

          <table className="w-full text-left text-xs border border-slate-300 mb-8">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[11px]">
              <tr>
                <th className="p-2.5">Sr</th>
                <th className="p-2.5">Material Description</th>
                <th className="p-2.5 text-center">Quantity</th>
                <th className="p-2.5 text-center">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {selectedChallan?.materials.map((m, idx) => (
                <tr key={idx}>
                  <td className="p-2.5 font-mono">{idx + 1}</td>
                  <td className="p-2.5 font-semibold">{m.item}</td>
                  <td className="p-2.5 text-center font-bold">{m.quantity}</td>
                  <td className="p-2.5 text-center font-mono">{m.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs text-slate-700">
            <div className="border-t border-slate-400 pt-2">
              <div>Store Incharge / Driver Signature</div>
              <div className="text-[10px] text-slate-500">{selectedChallan?.driverName}</div>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <div>Customer Received in Good Condition</div>
              <div className="text-[10px] text-slate-500">Receiver Signature & Date</div>
            </div>
          </div>

          <div className="mt-8 text-center print:hidden flex items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors shadow-lg"
            >
              Print Delivery Challan (PDF)
            </button>
            <button
              onClick={() => setActiveTab('LIST')}
              className="px-4 py-2.5 bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs hover:bg-slate-300 transition-colors"
            >
              Back to List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
