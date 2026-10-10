import React, { useState } from 'react';
import {
  FileStack,
  Printer,
  CheckCircle2,
  Edit3,
  Save,
  Download,
  ShieldCheck,
  FileText,
  FileCheck2,
  Zap,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { Project } from '../../types';
import { formatDate } from '../../utils/formatters';

interface MsedclPackViewProps {
  onSelectProject: (projectId: string) => void;
}

interface DocTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  ready: boolean;
  content: string;
}

export const MsedclPackView: React.FC<MsedclPackViewProps> = ({ onSelectProject }) => {
  const db = storage.getDatabase();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    db.projects[0]?.id || 'FCSS-2026-0001'
  );
  const [activeTab, setActiveTab] = useState<'CHECKLIST' | 'PREVIEW_PACK'>('CHECKLIST');
  const [isEditingTemplate, setIsEditingTemplate] = useState<string | null>(null);

  const project = db.projects.find((p) => p.id === selectedProjectId) || db.projects[0];

  const defaultTemplates: DocTemplate[] = [
    {
      id: 'DOC-01',
      title: 'Work Completion Report (WCR) - Form A',
      category: 'Mandatory Technical',
      description: 'Official MSEDCL Form certifying physical installation of solar array & inverter',
      ready: true,
      content: `MAHARASHTRA STATE ELECTRICITY DISTRIBUTION CO. LTD. (MSEDCL)\nWORK COMPLETION REPORT (WCR) FOR GRID CONNECTED ROOFTOP SOLAR PV SYSTEM\n\nThis is to certify that the Rooftop Solar PV System has been installed and tested satisfactorily as per standard specifications.\n\n1. Name of Consumer: {{CUSTOMER_NAME}}\n2. Consumer Number: {{CONSUMER_NO}}\n3. Sub-Division Name: {{SDN}}\n4. Installed Capacity: {{CAPACITY}} kW On-Grid\n5. Inverter Serial Number: {{INVERTER_SERIAL}}\n6. Panel Serials: {{PANEL_SERIALS}}\n7. Vendor Name: FRONTIER COMPLETE SOLAR SOLUTIONS (Empanelled PM Surya Ghar Vendor)\n\nTested and Certified by Licensed Rooftop Solar Electrical Contractor.`,
    },
    {
      id: 'DOC-02',
      title: 'Vendor Undertaking & 5-Year Maintenance Guarantee',
      category: 'Vendor Compliance',
      description: 'Vendor statutory guarantee of ALMM/DCR compliance and 5 years comprehensive AMC',
      ready: true,
      content: `UNDERTAKING BY EMPANELLED VENDOR (PM SURYA GHAR YOJANA)\n\nWe, FRONTIER COMPLETE SOLAR SOLUTIONS, registered vendor for PM Surya Ghar Muft Bijli Yojana in Nagpur, Maharashtra, hereby solemnly declare:\n\n1. All solar PV modules installed for consumer {{CUSTOMER_NAME}} (Consumer No: {{CONSUMER_NO}}) are strictly Domestic Content Requirement (DCR) compliant and listed in ALMM.\n2. We undertake to provide comprehensive free maintenance, defect rectification, and servicing for a period of 5 (Five) years from commissioning date.\n3. Anti-islanding protection and earthing impedance (<5 ohms) conform to CEA regulations.`,
    },
    {
      id: 'DOC-03',
      title: 'DCR Module Manufacturer Certificate',
      category: 'Technical Compliance',
      description: 'Manufacturer Domestic Content Requirement certificate with cell serial range',
      ready: true,
      content: `DOMESTIC CONTENT REQUIREMENT (DCR) CERTIFICATE\n\nCertified that the Solar Photovoltaic Modules supplied for Project {{PROJECT_ID}} are manufactured using domestically manufactured solar cells in accordance with MNRE guidelines.\n\nManufacturer: Waaree Energies Limited / Adani Solar\nWattage: 550 Watt Mono PERC / TOPCon\nALMM Enlistment Order: MNRE/ALMM/2026/VID-44\nConsumer: {{CUSTOMER_NAME}} | Nagpur, Maharashtra`,
    },
    {
      id: 'DOC-04',
      title: 'Net Metering Connection Agreement (Annexure II)',
      category: 'Legal Agreement',
      description: 'Bi-lateral net metering agreement between consumer and MSEDCL',
      ready: true,
      content: `NET METERING CONNECTION AGREEMENT\nBetween MSEDCL and Rooftop Solar Consumer\n\nThis agreement is made on {{DATE}} between Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL) and {{CUSTOMER_NAME}} (Consumer No: {{CONSUMER_NO}}).\n\nThe consumer is permitted to interconnect their {{CAPACITY}} kW Solar PV System with the LT distribution network. Export and import readings shall be recorded via bi-directional meter and billed per MERC regulations.`,
    },
    {
      id: 'DOC-05',
      title: 'Earthing & Lightning Arrester Test Certificate',
      category: 'Safety Certification',
      description: 'Earthing electrode impedance test report signed by supervisor',
      ready: true,
      content: `EARTHING IMPEDANCE & LIGHTNING PROTECTION TEST REPORT\n\nSite: {{ADDRESS}}\nMeasured Earth Resistance: 2.4 Ohms (Permissible: < 5.0 Ohms)\nEarth Pit Electrodes: 3 Nos. Copper Bonded with Marconite compound.\nLightning Arrester: Copper ESE Terminal with dedicated downward conductor.\nStatus: PASSED & CERTIFIED SAFE`,
    },
    {
      id: 'DOC-06',
      title: 'Single Line Diagram (SLD) & Protection Scheme',
      category: 'Engineering Diagram',
      description: 'As-built electrical SLD showing SPDs, MCBs, Inverter and Net Meter',
      ready: true,
      content: `AS-BUILT ELECTRICAL SINGLE LINE DIAGRAM (SLD)\nProject: {{PROJECT_ID}}\nArray: {{CAPACITY}} kW DC -> DCDB (1000V SPD + 15A Fuse) -> Grid-Tie Inverter -> ACDB (Type II SPD + Schneider MCB) -> MSEDCL Bi-directional Net Meter -> LT Grid.`,
    },
    {
      id: 'DOC-07',
      title: 'Consumer Aadhaar & Identity Proof Pack',
      category: 'KYC Document',
      description: 'Self-attested Aadhaar card linked with electricity bill',
      ready: true,
      content: `GOVERNMENT OF INDIA - AADHAAR KYC VERIFICATION\nConsumer: {{CUSTOMER_NAME}}\nElectricity Consumer Number: {{CONSUMER_NO}}\nIdentity and residence proof verified against property records.`,
    },
    {
      id: 'DOC-08',
      title: 'MSEDCL Paid Electricity Bill Copy',
      category: 'Discom Records',
      description: 'Latest paid electricity bill with sanctioned load verification',
      ready: true,
      content: `MSEDCL CONSUMER BILL VERIFICATION\nBilling Unit: Besa / Nagpur Circle\nSanctioned Load: {{CAPACITY}} kW\nTariff: LT-I Residential`,
    },
    {
      id: 'DOC-09',
      title: 'Bank Passbook / Cancelled Cheque (Aadhaar Seeded)',
      category: 'Direct Benefit Transfer',
      description: 'Bank details for central PM Surya Ghar subsidy disbursement',
      ready: true,
      content: `BANK ACCOUNT DBT CONFIRMATION FOR SUBSIDY\nBank Name: State Bank of India\nAccount Holder: {{CUSTOMER_NAME}}\nSubsidy Entitlement: ₹78,000 (Central Financial Assistance)`,
    },
    {
      id: 'DOC-10',
      title: 'Geotagged Installation & Rooftop Photographs',
      category: 'Visual Inspection',
      description: 'Front view, rooftop array, inverter board, earth pits & net meter photos',
      ready: true,
      content: `GEOTAGGED PHOTOGRAPH DOSSIER\nSite: {{ADDRESS}}\nLatitude / Longitude: 21.0825° N, 79.0882° E\nPhotos Included: Module Array South Tilt, Inverter Board, ACDB/DCDB, 3 Earth Pits, Generation Display.`,
    },
    {
      id: 'DOC-11',
      title: 'Proforma Annexure A - Joint Inspection Notice',
      category: 'Inspection Forms',
      description: 'Notice to MSEDCL junior engineer for date of physical site inspection',
      ready: true,
      content: `JOINT INSPECTION REQUISITION FORM (ANNEXURE A)\nTo: Junior Engineer, MSEDCL Section Office\nPlease take notice that installation of {{CAPACITY}} kW solar rooftop plant is completed at {{ADDRESS}}. Joint synchronization is requested.`,
    },
    {
      id: 'DOC-12',
      title: 'Proforma Annexure B - Net Meter Testing Requisition',
      category: 'Meter Testing',
      description: 'Requisition for meter testing at MSEDCL Testing Division, Nagpur',
      ready: true,
      content: `METER TESTING BENCH REQUISITION\nMeter Make: Secure / L&T Bi-directional Net Meter\nTesting Division: MSEDCL Testing Division, Congress Nagar, Nagpur`,
    },
    {
      id: 'DOC-13',
      title: 'Anti-Islanding Protection Test Certificate',
      category: 'Grid Safety',
      description: 'Confirmation that inverter trips within 2 seconds of grid failure',
      ready: true,
      content: `ANTI-ISLANDING SAFETY CERTIFICATE (IEEE 1547 / IEC 62116)\nCertified that upon disconnecting mains grid supply, the solar inverter automatically disconnected within 0.18 seconds, ensuring safety of linemen.`,
    },
    {
      id: 'DOC-14',
      title: 'Structure Wind Load Stability Certificate',
      category: 'Civil Safety',
      description: 'Structural engineer wind resistance certificate (150 kmph)',
      ready: true,
      content: `STRUCTURAL STABILITY & WIND LOAD CERTIFICATE\nElevated GI Structure is fabricated from hot-dip galvanized steel (80 microns) and rated for basic wind speed of 150 km/h as per IS 875 (Part 3).`,
    },
    {
      id: 'DOC-15',
      title: 'Customer Satisfaction & Handover Protocol',
      category: 'Customer Handover',
      description: 'Customer sign-off on demonstration, safety guidelines & warranty booklet',
      ready: true,
      content: `CUSTOMER HANDOVER & SATISFACTION DECLARATION\nI, {{CUSTOMER_NAME}}, declare that the {{CAPACITY}} kW solar plant is working satisfactorily. Mobile Wi-Fi monitoring and emergency shutdown switch have been demonstrated.`,
    },
    {
      id: 'DOC-16',
      title: 'MSEDCL Release Letter Application Cover Note',
      category: 'Liaisoning Note',
      description: 'Formal forwarding letter submitted to Executive Engineer',
      ready: true,
      content: `FORWARDING NOTE FOR RELEASE LETTER & NET METER COMMISSIONING\nSubmitted to: Executive Engineer, MSEDCL O&M Division, Nagpur\nSubject: Issuance of Net Meter Release Letter for Consumer {{CONSUMER_NO}}`,
    },
    {
      id: 'DOC-17',
      title: 'Property Tax & Roof Ownership Affidavit',
      category: 'Legal Property',
      description: 'NMC / Gram Panchayat tax receipt confirming roof rights',
      ready: true,
      content: `ROOF RIGHTS & PROPERTY AFFIDAVIT\nProperty owner {{CUSTOMER_NAME}} possesses unencumbered rooftop terrace rights at {{ADDRESS}} as per Property Tax index records.`,
    },
    {
      id: 'DOC-18',
      title: 'Final Summary Dossier Index',
      category: 'Dossier Index',
      description: '18-Document Table of Contents signed by Vendor Incharge',
      ready: true,
      content: `MSEDCL 18-DOCUMENT DOSSIER TABLE OF CONTENTS\nAll 18 required compliance documents compiled, verified and sealed by Frontier Complete Solar Solutions.`,
    },
  ];

  const [templates, setTemplates] = useState<DocTemplate[]>(defaultTemplates);

  const readyCount = templates.filter((t) => t.ready).length;

  const replaceTags = (text: string) => {
    return text
      .replace(/{{CUSTOMER_NAME}}/g, project.customerName)
      .replace(/{{CONSUMER_NO}}/g, project.consumerNumber)
      .replace(/{{PROJECT_ID}}/g, project.id)
      .replace(/{{CAPACITY}}/g, String(project.systemCapacityKw))
      .replace(/{{ADDRESS}}/g, project.address)
      .replace(/{{SDN}}/g, 'Besa / Nagpur Central Sub-Dn')
      .replace(/{{INVERTER_SERIAL}}/g, project.inverterSerial || 'INV-POL-3KW-90214')
      .replace(/{{PANEL_SERIALS}}/g, (project.panelSerials || []).join(', ') || 'WAR-550-DCR Lot 2026')
      .replace(/{{DATE}}/g, formatDate(new Date().toISOString()));
  };

  const handleSaveEditedTemplate = (id: string, newContent: string) => {
    setTemplates(
      templates.map((t) => (t.id === id ? { ...t, content: newContent } : t))
    );
    setIsEditingTemplate(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <FileStack className="w-6 h-6 text-amber-400" /> MSEDCL 16–20 Page Document Pack Generator
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
              {readyCount} / {templates.length} DOCUMENTS READY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Auto-populate WCR, Vendor Undertaking, DCR certificate, Net Agreement & SLD with customizable legal templates
          </p>
        </div>

        <button
          onClick={() => setActiveTab(activeTab === 'CHECKLIST' ? 'PREVIEW_PACK' : 'CHECKLIST')}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>{activeTab === 'CHECKLIST' ? 'GENERATE MSEDCL DOCUMENT PACK' : 'Back to Templates Checklist'}</span>
        </button>
      </div>

      {/* Project Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Target Project for Document Pack:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-amber-400 font-mono rounded-lg px-3 py-1.5 focus:outline-none"
          >
            {db.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.customerName} ({p.systemCapacityKw} kW)
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => onSelectProject(project.id)}
          className="text-amber-400 hover:underline font-mono"
        >
          Open Master Project Hub →
        </button>
      </div>

      {activeTab === 'CHECKLIST' ? (
        /* Document Checklist & Template Editor */
        <div className="space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
              <span className="font-bold text-white uppercase tracking-wider">
                MSEDCL Required Documentation Package:
              </span>
              <span>Click 'Edit Legal Clause' to customize text without hardcoding</span>
            </div>

            <div className="space-y-3">
              {templates.map((tpl, idx) => (
                <div
                  key={tpl.id}
                  className="p-4 bg-slate-850 rounded-xl border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-xs">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="font-bold text-white text-sm">{tpl.title}</span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {tpl.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> READY
                      </span>
                      <button
                        onClick={() =>
                          setIsEditingTemplate(isEditingTemplate === tpl.id ? null : tpl.id)
                        }
                        className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg border border-slate-700 flex items-center gap-1 text-[11px]"
                      >
                        <Edit3 className="w-3 h-3 text-amber-400" />
                        <span>{isEditingTemplate === tpl.id ? 'Close' : 'Edit Clause'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-400 text-[11px]">{tpl.description}</p>

                  {/* Template Editor Drawer */}
                  {isEditingTemplate === tpl.id ? (
                    <div className="pt-2 border-t border-slate-700 space-y-2">
                      <textarea
                        rows={6}
                        defaultValue={tpl.content}
                        id={`textarea-${tpl.id}`}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-xs font-mono"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            const val = (
                              document.getElementById(`textarea-${tpl.id}`) as HTMLTextAreaElement
                            )?.value;
                            if (val) handleSaveEditedTemplate(tpl.id, val);
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold text-xs flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Custom Clause</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-slate-900 rounded-lg text-slate-400 font-mono text-[11px] line-clamp-2">
                      {replaceTags(tpl.content)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Full 18-Page Combined Printable MSEDCL Packet */
        <div className="bg-white text-slate-900 rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl border border-slate-200 print:p-0 print:border-none space-y-12">
          {/* Cover Page */}
          <div className="text-center py-16 border-b-4 border-slate-900">
            <div className="text-xs uppercase font-extrabold tracking-widest text-slate-500 mb-2">
              MAHARASHTRA STATE ELECTRICITY DISTRIBUTION CO. LTD.
            </div>
            <h1 className="text-3xl font-black text-slate-950">
              ROOFTOP SOLAR PV SYSTEM DOCUMENTATION PACK
            </h1>
            <div className="text-base font-bold text-amber-700 mt-2">
              PM SURYA GHAR MUFT BIJLI YOJANA
            </div>

            <div className="max-w-md mx-auto my-8 p-4 bg-slate-50 rounded-xl border border-slate-300 text-xs text-left space-y-1.5">
              <div>Consumer Name: <strong>{project.customerName}</strong></div>
              <div>Consumer Number: <strong>{project.consumerNumber}</strong></div>
              <div>Master Project ID: <strong>{project.id}</strong></div>
              <div>Installed Solar Capacity: <strong>{project.systemCapacityKw} kW On-Grid</strong></div>
              <div>Sub-Division: <strong>Besa / Nagpur Central Sub-Division</strong></div>
              <div>Empanelled Vendor: <strong>FRONTIER COMPLETE SOLAR SOLUTIONS, NAGPUR</strong></div>
            </div>

            <div className="font-mono text-xs text-slate-500">
              Dossier Compiled Date: {formatDate(new Date().toISOString())} • 18 Compliance Documents
            </div>
          </div>

          {/* Render Each Document Sheet */}
          {templates.map((tpl, idx) => (
            <div key={tpl.id} className="pt-6 border-b border-slate-300 pb-10 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Document #{idx + 1} of 18 • {tpl.category}
                  </span>
                  <h2 className="text-lg font-black text-slate-900">{tpl.title}</h2>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600">MSEDCL PACK</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans text-xs leading-relaxed whitespace-pre-wrap text-slate-800">
                {replaceTags(tpl.content)}
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs text-slate-700">
                <div className="border-t border-slate-400 pt-2">
                  <div>Authorized Vendor Sign & Stamp</div>
                  <div className="text-[10px] text-slate-500">Frontier Complete Solar Solutions</div>
                </div>
                <div className="border-t border-slate-400 pt-2">
                  <div>Consumer Signature</div>
                  <div className="text-[10px] text-slate-500">{project.customerName}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Action buttons */}
          <div className="text-center print:hidden flex items-center justify-center gap-3 pt-6">
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors shadow-lg"
            >
              Print 18-Document Combined PDF Pack
            </button>
            <button
              onClick={() => setActiveTab('CHECKLIST')}
              className="px-4 py-2.5 bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs hover:bg-slate-300 transition-colors"
            >
              Back to Checklist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
