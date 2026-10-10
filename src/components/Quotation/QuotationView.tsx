import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  PlusCircle,
  Printer,
  Share2,
  CheckCircle2,
  ArrowRight,
  Sun,
  ShieldCheck,
  IndianRupee,
  Sparkles,
  Zap,
  FolderKanban,
  Edit3,
  Trash2,
  Clock,
  Calendar,
  Layers,
  FileCheck2,
  ListPlus,
  Save,
  Check,
  Plus,
  X,
  CreditCard,
  AlertTriangle,
  User,
  Phone,
  MapPin,
  FileText,
  Building2,
  Package,
  ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { storage } from '../../services/storage';
import {
  Quotation,
  QuotationStatus,
  PaymentMilestone,
  TimelinePhase,
  CompanyProfile,
  QuotationMaterialItem,
  LoadExpansionDocumentItem,
} from '../../types';
import {
  formatCurrency,
  formatDate,
  calculatePmSuryaGharSubsidy,
  generateWhatsAppLink,
} from '../../utils/formatters';
import { CompanyProfileModal } from '../CompanyProfile/CompanyProfileModal';
import { AdvanceReceiptModal } from './AdvanceReceiptModal';
import { ReceiptModal } from '../Accounts/ReceiptModal';
import {
  INITIAL_COMPANY_PROFILES,
  DEFAULT_LOAD_EXPANSION_DOCUMENTS,
  createDefaultQuotationMaterials,
} from '../../services/storage';

interface QuotationViewProps {
  selectedQuotationId?: string | null;
  onSelectProject: (projectId: string) => void;
  onOpenWhatsApp: (phone: string, name: string, projectId?: string) => void;
}

export interface BoSCatalogItem {
  id: string;
  category: 'Solar Panels' | 'Inverters' | 'Structure' | 'ACDB' | 'DCDB' | 'Cables' | 'Earthing' | 'Protection' | 'Hardware';
  name: string;
  specs: string;
}

export const PRESET_BOS_ITEMS: BoSCatalogItem[] = [
  // Modules
  { id: 'BOS-MOD-1', category: 'Solar Panels', name: 'Waaree Energies DCR Mono PERC', specs: 'WS-550-DCR • 550W • 144 Half-Cut Cells • ALMM List-I' },
  { id: 'BOS-MOD-2', category: 'Solar Panels', name: 'Adani Solar Bifacial DCR', specs: 'AS-545-BIF • 545W • Glass-to-Glass Dual Facial Gain' },
  { id: 'BOS-MOD-3', category: 'Solar Panels', name: 'Vikram Solar Somera DCR', specs: 'VS-550-DCR • 550W • Multi-Busbar High Reliability' },
  { id: 'BOS-MOD-4', category: 'Solar Panels', name: 'Tata Power Solar DCR Mono', specs: 'TP-540-DCR • 540W • Tier-1 DCR Domestic Content' },
  { id: 'BOS-MOD-5', category: 'Solar Panels', name: 'Goldi Solar DCR Mono PERC', specs: 'GS-550-DCR • 550W • High Efficiency 21.3%' },

  // Inverters
  { id: 'BOS-INV-1', category: 'Inverters', name: 'Polycab Solar Grid-Tie', specs: 'PS-GT-3.3K-1P • 3.3 kW • Dual MPPT with Wi-Fi Dongle' },
  { id: 'BOS-INV-2', category: 'Inverters', name: 'Solis On-Grid 3-Phase', specs: 'S5-GR3P5K • 5.0 kW • Wide MPPT Voltage Range & Cloud App' },
  { id: 'BOS-INV-3', category: 'Inverters', name: 'Growatt MIN Series Grid-Tie', specs: 'MIN 3000TL-X • 3.0 kW • Compact IP65 with ShineWiFi-X' },
  { id: 'BOS-INV-4', category: 'Inverters', name: 'Sungrow Residential On-Grid', specs: 'SG3.3K-S • 3.3 kW • High DC/AC Ratio & Smart IV Curve' },
  { id: 'BOS-INV-5', category: 'Inverters', name: 'Havells Enviro Solar Grid-Tie', specs: 'ENV-3.3K-1P • 3.3 kW • Anti-islanding & Dual MPPT' },

  // Structure
  { id: 'BOS-STR-1', category: 'Structure', name: 'Hot Dip Galvanized (HDG) 80 Micron Elevated Structure', specs: '80 Micron HDG • 6ft Ground Clearance • 150 km/h Wind Certified' },
  { id: 'BOS-STR-2', category: 'Structure', name: 'HDG Rooftop Flush Mount Structure', specs: '80 Micron GI C-Channel • 3ft Front / 5ft Back South Tilt' },
  { id: 'BOS-STR-3', category: 'Structure', name: 'High-Rise Super Structure (10ft Clearance)', specs: 'Heavy Duty 100x50mm GI Column • Usable Rooftop Terrace design' },
  { id: 'BOS-STR-4', category: 'Structure', name: 'Aluminium Rail Ballast System', specs: 'Anodized AL6005-T5 Non-penetrating Flat Roof Structure' },

  // ACDB & DCDB
  { id: 'BOS-DB-1', category: 'ACDB', name: 'IP65 ACDB with Type II SPD & Schneider MCB', specs: 'Polycarbonate IP65 Box • 415V/230V SPD Class II • Schneider/L&T MCB' },
  { id: 'BOS-DB-2', category: 'DCDB', name: 'IP65 DCDB with 1000V DC SPD & Fuse', specs: 'Dual String In/Out • 1000V DC Type II Surge Arrester • 15A gPV Fuses' },
  { id: 'BOS-DB-3', category: 'DCDB', name: 'Multi-String Combiner DCDB with Isolator', specs: 'IP65 UV Resistant • Built-in DC Rotary Disconnector Switch' },

  // Cables
  { id: 'BOS-CAB-1', category: 'Cables', name: 'Polycab 4 sq mm Solar DC Cable (TUV Certified)', specs: 'TUV 2PfG 1169 Certified • Electron Beam Cross-linked Flexible Copper' },
  { id: 'BOS-CAB-2', category: 'Cables', name: 'Polycab 4 sq mm 3-Core Copper Armoured AC Cable', specs: 'IS 1554 / 7098 • Annealed Bare Copper Conductor with Steel Armour' },
  { id: 'BOS-CAB-3', category: 'Cables', name: 'Finolex 6 sq mm Heavy Duty Solar DC Cable', specs: 'UV & Ozone Resistant • 1500V DC Rated Double Insulated' },

  // Earthing
  { id: 'BOS-ETH-1', category: 'Earthing', name: '3 x Chemical Gel Earth Electrodes (Copper Bonded) with Chamber', specs: '3m Long 17.2mm Dia • 250 Micron Copper Coating • BFC Compound Chamber' },
  { id: 'BOS-ETH-2', category: 'Earthing', name: '2 x Maintenance-Free Earth Electrodes (3m)', specs: '2m Long Pure Copper Bonded with Polymer Earth Pit Cover' },
  { id: 'BOS-ETH-3', category: 'Earthing', name: 'Pure Copper Earthing Flat (25x3 mm) with Chamber', specs: 'High Conductivity Electrolytic Tough Pitch (ETP) Grade Copper' },

  // Lightning Protection
  { id: 'BOS-LP-1', category: 'Protection', name: 'Copper Early Streamer Emission (ESE) Type Terminal', specs: 'ESE 60 μs Advance Time • NFC 17-102 Certified with Test Link' },
  { id: 'BOS-LP-2', category: 'Protection', name: 'Pure Copper Conventional 5-Spike Arrestor', specs: 'IS 2309 Standard • 1-Meter Rod with 5 Sharp Spikes & Base Plate' },
];

export const QuotationView: React.FC<QuotationViewProps> = ({
  selectedQuotationId,
  onSelectProject,
  onOpenWhatsApp,
}) => {
  const db = storage.getDatabase();
  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile[]>(() => storage.getCompanyProfiles());

  const [activeTab, setActiveTab] = useState<'BUILDER' | 'LIST' | 'PREVIEW_PRINT'>('BUILDER');
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation>(() => {
    if (selectedQuotationId) {
      const found = db.quotations.find((q) => q.id === selectedQuotationId);
      if (found) return found;
    }
    return db.quotations[0] || createDefaultQuotation();
  });

  const [convertedProject, setConvertedProject] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);

  // Company Profile Modal & Advance Slip Modal states
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showAdvanceSlipModal, setShowAdvanceSlipModal] = useState(false);
  const [showBoSCatalog, setShowBoSCatalog] = useState(false);

  // Custom BoS items added by user
  const [customBoSItems, setCustomBoSItems] = useState<BoSCatalogItem[]>(() => {
    try {
      const stored = localStorage.getItem('frontier_custom_bos_items');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [newBoSCategory, setNewBoSCategory] = useState<BoSCatalogItem['category']>('Solar Panels');
  const [newBoSName, setNewBoSName] = useState<string>('');
  const [newBoSSpecs, setNewBoSSpecs] = useState<string>('');

  // Combined catalog
  const allBoSItems = [...PRESET_BOS_ITEMS, ...customBoSItems];

  // Synchronize when selectedQuotationId prop changes
  useEffect(() => {
    if (selectedQuotationId) {
      const found = db.quotations.find((q) => q.id === selectedQuotationId);
      if (found) {
        setSelectedQuotation(found);
        setActiveTab('BUILDER');
      }
    }
  }, [selectedQuotationId, db.quotations]);

  function createDefaultQuotation(): Quotation {
    return {
      id: 'QT-2026-001',
      quotationNumber: 'QT-FCSS-2026-0001',
      projectId: 'FCSS-2026-0001',
      leadId: 'LEAD-2026-001',
      date: '2026-09-15',
      customerName: 'Dr. Milind Vaidya',
      consumerNumber: '410019283741',
      mobile: '9822104521',
      address: 'Plot 42, Sai Nagar, Besa, Nagpur',
      systemCapacityKw: 3.3,
      panelBrand: 'Waaree Energies DCR Mono PERC',
      panelModel: 'WS-550-DCR',
      panelWattage: 550,
      panelQuantity: 6,
      inverterBrand: 'Polycab Solar Grid-Tie',
      inverterModel: 'PS-GT-3.3K-1P',
      inverterCapacityKw: 3.3,
      structureType: 'Hot Dip Galvanized (HDG) 80 Micron Elevated Structure',
      acdbSpecs: 'IP65 ACDB with Type II SPD & Schneider MCB',
      dcdbSpecs: 'IP65 DCDB with 1000V DC SPD & Fuse',
      dcCableSpecs: 'Polycab 4 sq mm Solar DC Cable (TUV Certified)',
      acCableSpecs: 'Polycab 4 sq mm 3-Core Copper Armoured AC Cable',
      earthingSpecs: '3 x Chemical Gel Earth Electrodes (Copper Bonded) with Chamber',
      lightningProtectionSpecs: 'Copper Early Streamer Emission (ESE) Type Terminal',
      installationScope: 'Complete Turnkey: Design, Supply, Installation, MSEDCL Testing & Commissioning',
      transportationIncluded: true,
      systemBasePrice: 171353,
      discount: 0,
      gstRatePercent: 13.8,
      gstAmount: 23647,
      totalSystemPrice: 195000,
      wholeSystemPrice: 195000,
      pmSuryaGharSubsidyEstimate: 78000,
      customerNetPayable: 117000,
      suggestedAdvanceAmount: 39000,
      balancePayable: 78000,
      status: 'Approved',
      validUntil: '2026-10-15',
      remarks: 'PM Surya Ghar registered vendor turnkey quote with 5-year comprehensive maintenance included.',
      companyProfileId: 'COMP-001',
      paymentTerms: '20% Advance with Agreement, 50% Against Material Dispatch, 20% Post Rooftop Installation & Testing, 10% Upon Net-Meter Activation & Subsidy Docket Submission',
      paymentSchedule: [
        { id: 'MS-1', milestone: '1. Booking Advance', percentage: 20, amount: 39000, dueCondition: 'Along with Pre-Agreement Signing' },
        { id: 'MS-2', milestone: '2. Material Dispatch', percentage: 50, amount: 97500, dueCondition: 'Prior to Dispatch from Hingna Depot' },
        { id: 'MS-3', milestone: '3. Installation & Testing', percentage: 20, amount: 39000, dueCondition: 'On Completion of Panels & Inverter Mounting' },
        { id: 'MS-4', milestone: '4. Net Meter & Handover', percentage: 10, amount: 19500, dueCondition: 'Post MSEDCL Joint Inspection & Subsidy Docket Submission' },
      ],
      projectCompletionTimeline: '21 to 30 Working Days Turnkey Execution (Subject to MSEDCL Feasibility Approval)',
      timelineMilestones: [
        { id: 'PH-1', phase: 'Phase 1: Site Survey & National Portal Reg.', durationDays: 3, description: 'Geo-tagged survey & PM Surya Ghar portal submission' },
        { id: 'PH-2', phase: 'Phase 2: MSEDCL Technical Feasibility', durationDays: 7, description: 'Discom Besa subdivision sanction load check' },
        { id: 'PH-3', phase: 'Phase 3: Material Dispatch & Mounting', durationDays: 5, description: 'HDG structure & Waaree 550W DCR modules delivered & installed' },
        { id: 'PH-4', phase: 'Phase 4: Inverter & 3-Pit Chemical Earthing', durationDays: 4, description: 'Polycab inverter, AC/DC DB, earth pits & wiring complete' },
        { id: 'PH-5', phase: 'Phase 5: Net-Meter Sync & Subsidy Credit', durationDays: 10, description: 'Joint Discom inspection, meter test & ₹78,000 CFA credit' },
      ],
      scopeOfProject: [
        'Supply of High Efficiency DCR Mono PERC Solar PV Modules (ALMM List-I Compliant)',
        'Supply of High Performance Grid-Tied String Inverter with integrated Wi-Fi remote monitoring',
        'Hot Dip Galvanized (HDG) Elevated Module Mounting Structure designed for 150 km/h wind speeds',
        'IP65 Polycarbonate ACDB & DCDB with Type-II Surge Protection Devices (SPD) & MCBs/Fuses',
        '4 sq.mm UV-resistant Solar DC Flexible Copper Cable & 3-Core Armoured AC Cable',
        '3-Pit Maintenance-Free Chemical Earthing (Inverter AC, Inverter DC, Lightning Arrestor)',
        'Copper Pure Lightning Arrestor with test link and spike terminal',
        'End-to-End MSEDCL Liaisoning: PV Feasibility, Work Completion Report (WCR) & Release Letter',
        'National Portal for PM Surya Ghar documentation & direct subsidy transfer assistance',
        'Bi-directional Net-Meter coordination and joint inspection with Discom engineer',
      ],
      warrantyTerms: '25 Years Linear Performance Warranty on Solar PV Modules (Waaree/Adani), 5 Years Manufacturer Warranty on Grid-Tied Inverter, 5 Years Comprehensive System Workmanship & Maintenance Warranty by Frontier Complete Solar Solutions.',
      materialItems: createDefaultQuotationMaterials(3.3),
      loadExpansionDocuments: [...DEFAULT_LOAD_EXPANSION_DOCUMENTS],
    };
  }

  // Active editable form state initialized from selectedQuotation
  const [formData, setFormData] = useState<Quotation>(selectedQuotation);

  // Keep form data in sync when selected quotation changes
  useEffect(() => {
    const wholeVal = selectedQuotation.wholeSystemPrice || selectedQuotation.totalSystemPrice || 195000;
    setFormData({
      ...selectedQuotation,
      wholeSystemPrice: wholeVal,
      totalSystemPrice: wholeVal,
      companyProfileId: selectedQuotation.companyProfileId || 'COMP-001',
      materialItems:
        selectedQuotation.materialItems && selectedQuotation.materialItems.length > 0
          ? selectedQuotation.materialItems
          : createDefaultQuotationMaterials(selectedQuotation.systemCapacityKw || 3.3),
      loadExpansionDocuments:
        selectedQuotation.loadExpansionDocuments && selectedQuotation.loadExpansionDocuments.length > 0
          ? selectedQuotation.loadExpansionDocuments
          : [...DEFAULT_LOAD_EXPANSION_DOCUMENTS],
      paymentTerms: selectedQuotation.paymentTerms || '20% Advance with Agreement, 50% Against Material Dispatch, 20% Post Rooftop Installation & Testing, 10% Upon Net-Meter Activation & Subsidy Docket Submission',
      paymentSchedule: selectedQuotation.paymentSchedule || [
        { id: 'MS-1', milestone: '1. Booking Advance', percentage: 20, amount: Math.round(wholeVal * 0.2), dueCondition: 'Along with Pre-Agreement Signing' },
        { id: 'MS-2', milestone: '2. Material Dispatch', percentage: 50, amount: Math.round(wholeVal * 0.5), dueCondition: 'Prior to Dispatch from Depot' },
        { id: 'MS-3', milestone: '3. Installation & Testing', percentage: 20, amount: Math.round(wholeVal * 0.2), dueCondition: 'On Completion of Panels & Inverter Mounting' },
        { id: 'MS-4', milestone: '4. Net Meter & Handover', percentage: 10, amount: Math.round(wholeVal * 0.1), dueCondition: 'Post MSEDCL Joint Inspection' },
      ],
      projectCompletionTimeline: selectedQuotation.projectCompletionTimeline || '21 to 30 Working Days Turnkey Execution (Subject to MSEDCL Feasibility Approval)',
      timelineMilestones: selectedQuotation.timelineMilestones || [
        { id: 'PH-1', phase: 'Phase 1: Site Survey & National Portal Reg.', durationDays: 3, description: 'Geo-tagged survey & PM Surya Ghar portal submission' },
        { id: 'PH-2', phase: 'Phase 2: MSEDCL Technical Feasibility', durationDays: 7, description: 'Discom subdivision sanction load check' },
        { id: 'PH-3', phase: 'Phase 3: Material Dispatch & Mounting', durationDays: 5, description: 'HDG structure & DCR modules delivered & installed' },
        { id: 'PH-4', phase: 'Phase 4: Inverter & 3-Pit Chemical Earthing', durationDays: 4, description: 'Inverter, AC/DC DB, earth pits & wiring complete' },
        { id: 'PH-5', phase: 'Phase 5: Net-Meter Sync & Subsidy Credit', durationDays: 10, description: 'Joint Discom inspection, meter test & CFA credit' },
      ],
      scopeOfProject: selectedQuotation.scopeOfProject || [
        'Supply of High Efficiency DCR Mono PERC Solar PV Modules (ALMM List-I Compliant)',
        'Supply of High Performance Grid-Tied String Inverter with integrated Wi-Fi remote monitoring',
        'Hot Dip Galvanized (HDG) Elevated Module Mounting Structure designed for 150 km/h wind speeds',
        'IP65 Polycarbonate ACDB & DCDB with Type-II Surge Protection Devices (SPD) & MCBs/Fuses',
        '4 sq.mm UV-resistant Solar DC Flexible Copper Cable & 3-Core Armoured AC Cable',
        '3-Pit Maintenance-Free Chemical Earthing (Inverter AC, Inverter DC, Lightning Arrestor)',
        'Copper Pure Lightning Arrestor with test link and spike terminal',
        'End-to-End MSEDCL Liaisoning: PV Feasibility, Work Completion Report (WCR) & Release Letter',
        'National Portal for PM Surya Ghar documentation & direct subsidy transfer assistance',
        'Bi-directional Net-Meter coordination and joint inspection with Discom engineer',
      ],
      warrantyTerms: selectedQuotation.warrantyTerms || '25 Years Linear Performance Warranty on Solar PV Modules (Waaree/Adani), 5 Years Manufacturer Warranty on Grid-Tied Inverter, 5 Years Comprehensive System Workmanship & Maintenance Warranty by Frontier Complete Solar Solutions.',
    });
  }, [selectedQuotation]);

  // Recalculate totals when wholeSystemPrice or gst rate is edited (Exact User Requirement)
  const handleWholeSystemPriceChange = (
    wholePrice: number,
    gstRate: number = formData.gstRatePercent || 13.8,
    discount: number = formData.discount || 0,
    subsidy: number = formData.pmSuryaGharSubsidyEstimate || 78000
  ) => {
    // Whole Price = (Base Turnkey Price - discount) * (1 + gstRate / 100)
    // Therefore Base Turnkey Price before discount:
    const netTaxableBase = Math.round(wholePrice / (1 + (gstRate / 100)));
    const basePrice = Math.max(0, netTaxableBase + discount);
    const gstAmount = Math.max(0, wholePrice - (basePrice - discount));
    const net = Math.max(0, wholePrice - subsidy);
    const advance = Math.round(wholePrice * 0.20);

    const updatedMilestones = (formData.paymentSchedule || []).map((m) => ({
      ...m,
      amount: Math.round(wholePrice * (m.percentage / 100)),
    }));

    setFormData((prev) => ({
      ...prev,
      wholeSystemPrice: wholePrice,
      totalSystemPrice: wholePrice,
      systemBasePrice: basePrice,
      discount,
      gstRatePercent: gstRate,
      gstAmount,
      pmSuryaGharSubsidyEstimate: subsidy,
      customerNetPayable: net,
      suggestedAdvanceAmount: advance,
      balancePayable: Math.max(0, net - advance),
      paymentSchedule: updatedMilestones,
    }));
  };

  // Add custom BoS item to local catalog
  const handleAddCustomBoSItem = () => {
    if (!newBoSName.trim()) {
      alert('Please enter an item name');
      return;
    }
    const item: BoSCatalogItem = {
      id: `CUSTOM-${Date.now()}`,
      category: newBoSCategory,
      name: newBoSName.trim(),
      specs: newBoSSpecs.trim() || 'Custom Turnkey Specification',
    };
    const updated = [...customBoSItems, item];
    setCustomBoSItems(updated);
    try {
      localStorage.setItem('frontier_custom_bos_items', JSON.stringify(updated));
    } catch {}
    setNewBoSName('');
    setNewBoSSpecs('');
    setSaveSuccessMsg(`Added "${item.name}" to BoS catalog! Available in dropdowns.`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Turnkey Material & Inventory handlers
  const handleAddMaterialItem = (item?: Partial<QuotationMaterialItem>) => {
    const list = [...(formData.materialItems || [])];
    const newIdx = list.length + 1;
    list.push({
      id: `MAT-${Date.now()}-${newIdx}`,
      item: item?.item || 'New BoS Component',
      category: item?.category || 'Hardware',
      specs: item?.specs || 'Turnkey specification',
      quantity: item?.quantity || 1,
      unit: item?.unit || 'Nos',
      includedInTurnkey: true,
    });
    setFormData({ ...formData, materialItems: list });
  };

  const handleUpdateMaterialItem = (index: number, field: keyof QuotationMaterialItem, value: any) => {
    const list = [...(formData.materialItems || [])];
    list[index] = { ...list[index], [field]: value };
    setFormData({ ...formData, materialItems: list });
  };

  const handleRemoveMaterialItem = (index: number) => {
    const list = [...(formData.materialItems || [])];
    list.splice(index, 1);
    setFormData({ ...formData, materialItems: list });
  };

  // Document Required Checklist handlers
  const handleToggleDocumentCheck = (index: number) => {
    const list = [...(formData.loadExpansionDocuments || [])];
    list[index] = { ...list[index], required: !list[index].required };
    setFormData({ ...formData, loadExpansionDocuments: list });
  };

  const handleUpdateDocumentItem = (index: number, field: keyof LoadExpansionDocumentItem, value: any) => {
    const list = [...(formData.loadExpansionDocuments || [])];
    list[index] = { ...list[index], [field]: value };
    setFormData({ ...formData, loadExpansionDocuments: list });
  };

  const handleAddDocumentItem = () => {
    const list = [...(formData.loadExpansionDocuments || [])];
    const newIdx = list.length + 1;
    list.push({
      id: `LED-${Date.now()}-${newIdx}`,
      documentName: 'New Document / NOC Certificate',
      required: true,
      notes: 'Required for MSEDCL / Discom approval',
    });
    setFormData({ ...formData, loadExpansionDocuments: list });
  };

  const handleRemoveDocumentItem = (index: number) => {
    const list = [...(formData.loadExpansionDocuments || [])];
    list.splice(index, 1);
    setFormData({ ...formData, loadExpansionDocuments: list });
  };

  // Recalculate totals whenever capacity, base price, discount, or gst changes
  const handleCapacityChange = (cap: number) => {
    const subsidy = calculatePmSuryaGharSubsidy(cap);
    const baseRate = 55000;
    const basePrice = Math.round(cap * baseRate);
    const gst = Math.round(basePrice * (formData.gstRatePercent / 100));
    const total = basePrice + gst - (formData.discount || 0);
    const net = Math.max(0, total - subsidy);
    const advance = Math.round(total * 0.2);
    const panelQty = Math.ceil((cap * 1000) / (formData.panelWattage || 550));

    // Update milestone amounts proportionally
    const updatedMilestones = (formData.paymentSchedule || []).map((m) => ({
      ...m,
      amount: Math.round(total * (m.percentage / 100)),
    }));

    setFormData((prev) => ({
      ...prev,
      systemCapacityKw: cap,
      inverterCapacityKw: cap,
      panelQuantity: panelQty,
      systemBasePrice: basePrice,
      gstAmount: gst,
      totalSystemPrice: total,
      pmSuryaGharSubsidyEstimate: subsidy,
      customerNetPayable: net,
      suggestedAdvanceAmount: advance,
      balancePayable: Math.max(0, net - advance),
      paymentSchedule: updatedMilestones,
    }));
  };

  const handlePriceRecalculation = (
    basePrice: number,
    discount: number,
    gstRate: number,
    subsidy: number
  ) => {
    const gst = Math.round(basePrice * (gstRate / 100));
    const total = Math.max(0, basePrice + gst - discount);
    const net = Math.max(0, total - subsidy);
    const advance = Math.round(total * 0.2);

    const updatedMilestones = (formData.paymentSchedule || []).map((m) => ({
      ...m,
      amount: Math.round(total * (m.percentage / 100)),
    }));

    setFormData((prev) => ({
      ...prev,
      systemBasePrice: basePrice,
      discount,
      gstRatePercent: gstRate,
      gstAmount: gst,
      totalSystemPrice: total,
      pmSuryaGharSubsidyEstimate: subsidy,
      customerNetPayable: net,
      suggestedAdvanceAmount: advance,
      balancePayable: Math.max(0, net - advance),
      paymentSchedule: updatedMilestones,
    }));
  };

  // Payment Schedule handlers
  const handleUpdateMilestone = (index: number, field: keyof PaymentMilestone, value: any) => {
    const list = [...(formData.paymentSchedule || [])];
    list[index] = { ...list[index], [field]: value };
    if (field === 'percentage') {
      const pct = Number(value) || 0;
      list[index].amount = Math.round((formData.totalSystemPrice || 0) * (pct / 100));
    }
    setFormData({ ...formData, paymentSchedule: list });
  };

  const handleAddMilestone = () => {
    const list = [...(formData.paymentSchedule || [])];
    const newIdx = list.length + 1;
    list.push({
      id: `MS-${Date.now()}-${newIdx}`,
      milestone: `${newIdx}. Milestone Stage`,
      percentage: 10,
      amount: Math.round((formData.totalSystemPrice || 0) * 0.1),
      dueCondition: 'Upon stage completion',
    });
    setFormData({ ...formData, paymentSchedule: list });
  };

  const handleRemoveMilestone = (index: number) => {
    const list = [...(formData.paymentSchedule || [])];
    list.splice(index, 1);
    setFormData({ ...formData, paymentSchedule: list });
  };

  // Timeline handlers
  const handleUpdatePhase = (index: number, field: keyof TimelinePhase, value: any) => {
    const list = [...(formData.timelineMilestones || [])];
    list[index] = { ...list[index], [field]: value };
    setFormData({ ...formData, timelineMilestones: list });
  };

  const handleAddPhase = () => {
    const list = [...(formData.timelineMilestones || [])];
    const newIdx = list.length + 1;
    list.push({
      id: `PH-${Date.now()}-${newIdx}`,
      phase: `Phase ${newIdx}: New Execution Phase`,
      durationDays: 5,
      description: 'Execution details & approvals',
    });
    setFormData({ ...formData, timelineMilestones: list });
  };

  const handleRemovePhase = (index: number) => {
    const list = [...(formData.timelineMilestones || [])];
    list.splice(index, 1);
    setFormData({ ...formData, timelineMilestones: list });
  };

  // Scope of Project handlers
  const handleUpdateScopeItem = (index: number, value: string) => {
    const list = [...(formData.scopeOfProject || [])];
    list[index] = value;
    setFormData({ ...formData, scopeOfProject: list });
  };

  const handleAddScopeItem = () => {
    const list = [...(formData.scopeOfProject || [])];
    list.push('New turnkey supply and liaisoning scope item');
    setFormData({ ...formData, scopeOfProject: list });
  };

  const handleRemoveScopeItem = (index: number) => {
    const list = [...(formData.scopeOfProject || [])];
    list.splice(index, 1);
    setFormData({ ...formData, scopeOfProject: list });
  };

  // Save Quotation
  const handleSaveQuotation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    storage.updateQuotation(selectedQuotation.id, formData);
    setSelectedQuotation(formData);
    setSaveSuccessMsg('Quotation saved successfully with all updated terms, timeline, and scope!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Requirement 8: "CONVERT TO PROJECT"
  const handleConvertToProject = (quoteId: string) => {
    try {
      // First save any unsaved edits
      storage.updateQuotation(quoteId, formData);
      const project = storage.convertDealToProject(quoteId);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      setConvertedProject(project.id);
      setSelectedQuotation({
        ...formData,
        status: 'Approved',
        projectId: project.id,
      });
      setTimeout(() => {
        onSelectProject(project.id);
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to convert to project');
    }
  };

  // Delete Quotation
  const handleDeleteQuotation = (quoteId: string) => {
    if (confirm(`Are you sure you want to delete quotation ${selectedQuotation.quotationNumber}?`)) {
      storage.deleteQuotation(quoteId);
      const remaining = storage.getDatabase().quotations;
      if (remaining.length > 0) {
        setSelectedQuotation(remaining[0]);
      }
      setActiveTab('LIST');
    }
  };

  // Sum of milestone percentages
  const totalPercentage = (formData.paymentSchedule || []).reduce(
    (sum, m) => sum + (Number(m.percentage) || 0),
    0
  );

  // Total estimated timeline days
  const totalTimelineDays = (formData.timelineMilestones || []).reduce(
    (sum, p) => sum + (Number(p.durationDays) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <FileSpreadsheet className="w-6 h-6 text-amber-400" /> Quotation Builder & Pricing Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              Nagpur Turnkey ERP
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Fully editable Payment Terms, Timeline, Payment Schedule, Technical BoS & Scope of Work
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('BUILDER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'BUILDER'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Quotation Builder</span>
          </button>
          <button
            onClick={() => setActiveTab('LIST')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'LIST'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Quotes List ({db.quotations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('PREVIEW_PRINT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'PREVIEW_PRINT'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Printable PDF</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccessMsg && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-600 rounded-xl text-emerald-200 text-xs flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Success banner if converted */}
      {convertedProject && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-600 rounded-2xl text-emerald-200 text-xs sm:text-sm flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-emerald-400 animate-spin" />
            <div>
              <strong className="text-white">CONVERTED TO MASTER PROJECT: {convertedProject}</strong>
              <div className="text-xs text-emerald-300">
                Created customer folder, 10-document checklist, MSEDCL application & material BoS!
              </div>
            </div>
          </div>
          <button
            onClick={() => onSelectProject(convertedProject)}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
          >
            Open Project Hub →
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: FULLY EDITABLE QUOTATION BUILDER */}
      {/* ========================================================================= */}
      {activeTab === 'BUILDER' && (
        <div className="space-y-6">
          {/* Top Quick Actions Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
            {/* Quotation Selector & Metadata */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Active Quote:</span>
                <select
                  value={selectedQuotation.id}
                  onChange={(e) => {
                    const q = db.quotations.find((item) => item.id === e.target.value);
                    if (q) setSelectedQuotation(q);
                  }}
                  className="bg-slate-800 border border-slate-700 text-amber-400 font-mono font-bold text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400"
                >
                  {db.quotations.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.quotationNumber} — {q.customerName} ({q.systemCapacityKw} kW) [{q.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Status:</span>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as QuotationStatus })}
                  className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none"
                >
                  {(['Draft', 'Sent', 'Negotiation', 'Approved', 'Rejected', 'Expired'] as const).map(
                    (st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    )
                  )}
                </select>
              </div>

              {formData.projectId && (
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Project: {formData.projectId}
                </span>
              )}
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleSaveQuotation}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Quotation</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('PREVIEW_PRINT')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Preview Print</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenWhatsApp(formData.mobile, formData.customerName, formData.projectId)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 rounded-xl text-xs font-semibold"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              {!formData.projectId ? (
                <button
                  type="button"
                  onClick={() => handleConvertToProject(selectedQuotation.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-950/50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Convert to Project</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectProject(formData.projectId!)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 text-amber-400 hover:bg-slate-750 rounded-xl text-xs font-mono border border-slate-700"
                >
                  <span>Open {formData.projectId}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* ISSUING COMPANY PROFILE & ADVANCE SLIP BANNER (Explicit User Requirement) */}
          {(() => {
            const currentCompany =
              companyProfiles.find((p) => p.id === (formData.companyProfileId || selectedQuotation.companyProfileId)) ||
              companyProfiles[0] ||
              INITIAL_COMPANY_PROFILES[0];

            return (
              <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {currentCompany.logoUrl ? (
                      <img
                        src={currentCompany.logoUrl}
                        alt={currentCompany.name}
                        className="w-14 h-14 object-contain rounded-xl bg-slate-950 p-1 border border-slate-800 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-xl shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" /> Quotation Issued On Behalf Of Company:
                        </span>
                        <select
                          value={formData.companyProfileId || currentCompany.id}
                          onChange={(e) => {
                            const compId = e.target.value;
                            setFormData({ ...formData, companyProfileId: compId });
                          }}
                          className="bg-slate-800 border-2 border-amber-500/60 hover:border-amber-400 text-white font-bold text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-sm"
                        >
                          {companyProfiles.map((p) => (
                            <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                              {p.name} {p.isDefault ? '★ (Default)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="text-sm font-black text-white mt-1.5 flex items-center gap-2 flex-wrap">
                        <span>{currentCompany.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                          GSTIN: {currentCompany.gstNumber}
                        </span>
                        {currentCompany.registrationNumber && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">
                            Reg: {currentCompany.registrationNumber}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                        <span>📍 {currentCompany.address}</span>
                        <span>•</span>
                        <span>✉️ {currentCompany.email}</span>
                        <span>•</span>
                        <span>📞 {currentCompany.ownerContact} ({currentCompany.ownerName || 'Owner'})</span>
                      </div>
                    </div>
                  </div>

                  {/* Company Action Buttons */}
                  <div className="flex items-center gap-2 self-end lg:self-center flex-wrap">
                    <button
                      type="button"
                      onClick={() => setShowCompanyModal(true)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
                      title="Create new company profile or edit existing ones"
                    >
                      <Building2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Create / Edit Company</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowAdvanceSlipModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-950/60 cursor-pointer"
                      title="Issue official advance payment slip from this company"
                    >
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>Issue Advance Slip</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          <form onSubmit={handleSaveQuotation} className="space-y-6">
            {/* SECTION 1: CUSTOMER & CONNECTION DETAILS (EDITABLE) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" /> 1. Customer & MSEDCL Connection Details
                </h2>
                <span className="text-[11px] text-slate-500 font-mono">
                  Quotation Number: {formData.quotationNumber}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">MSEDCL Consumer Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.consumerNumber}
                    onChange={(e) => setFormData({ ...formData, consumerNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">System Capacity (kW) *</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="100"
                      required
                      value={formData.systemCapacityKw}
                      onChange={(e) => handleCapacityChange(Number(e.target.value) || 1)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-amber-400 font-bold">kW</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1">Site / Installation Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Quote Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Valid Until Date</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: TECHNICAL SPECIFICATIONS & BOS CATALOG (EDITABLE) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-400" /> 2. Technical BoS & Plant Sizing (Editable)
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Select from catalog dropdowns or type custom equipment specs. Add custom items to catalog in real time.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-400 font-bold font-mono bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    Total Plant: {((formData.panelQuantity * formData.panelWattage) / 1000).toFixed(2)} kWp DC
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowBoSCatalog(!showBoSCatalog)}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-750 text-amber-300 font-semibold rounded-lg text-xs border border-amber-500/30 transition-colors"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>{showBoSCatalog ? 'Hide BoS Catalog' : '📦 Manage BoS Catalog'}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${showBoSCatalog ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* EXPANDABLE BOS CATALOG & CUSTOM ITEM MANAGER (Explicit User Requirement) */}
              {showBoSCatalog && (
                <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30 space-y-3.5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Package className="w-3.5 h-3.5" /> Pre-saved BoS Items Catalog ({allBoSItems.length} Items)
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Add any custom item here to appear instantly in dropdown selectors
                    </span>
                  </div>

                  {/* Add New BoS Item Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Category</label>
                      <select
                        value={newBoSCategory}
                        onChange={(e) => setNewBoSCategory(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400"
                      >
                        <option value="Solar Panels">Solar Panels</option>
                        <option value="Inverters">Inverters</option>
                        <option value="Structure">Structure</option>
                        <option value="ACDB">ACDB</option>
                        <option value="DCDB">DCDB</option>
                        <option value="Cables">Cables</option>
                        <option value="Earthing">Earthing</option>
                        <option value="Protection">Protection</option>
                        <option value="Hardware">Hardware</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Brand / Item Name *</label>
                      <input
                        type="text"
                        value={newBoSName}
                        onChange={(e) => setNewBoSName(e.target.value)}
                        placeholder="e.g. Goldi Solar 550W Mono"
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Model & Technical Specs</label>
                      <input
                        type="text"
                        value={newBoSSpecs}
                        onChange={(e) => setNewBoSSpecs(e.target.value)}
                        placeholder="e.g. 550W Mono PERC Half-Cut ALMM"
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleAddCustomBoSItem}
                        className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1 shadow"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Catalog</span>
                      </button>
                    </div>
                  </div>

                  {/* Catalog Quick Pick Badges */}
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                    {allBoSItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (item.category === 'Solar Panels') {
                            setFormData({ ...formData, panelBrand: item.name, panelModel: item.specs });
                          } else if (item.category === 'Inverters') {
                            setFormData({ ...formData, inverterBrand: item.name, inverterModel: item.specs });
                          } else if (item.category === 'Structure') {
                            setFormData({ ...formData, structureType: `${item.name} (${item.specs})` });
                          } else if (item.category === 'ACDB') {
                            setFormData({ ...formData, acdbSpecs: `${item.name} • ${item.specs}` });
                          } else if (item.category === 'DCDB') {
                            setFormData({ ...formData, dcdbSpecs: `${item.name} • ${item.specs}` });
                          } else if (item.category === 'Cables') {
                            setFormData({ ...formData, dcCableSpecs: `${item.name} • ${item.specs}` });
                          } else if (item.category === 'Earthing') {
                            setFormData({ ...formData, earthingSpecs: `${item.name} • ${item.specs}` });
                          } else if (item.category === 'Protection') {
                            setFormData({ ...formData, lightningProtectionSpecs: `${item.name} • ${item.specs}` });
                          }
                          setSaveSuccessMsg(`Applied "${item.name}" to technical plant sizing!`);
                          setTimeout(() => setSaveSuccessMsg(null), 2000);
                        }}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 rounded-md border border-slate-800 text-[10px] text-left transition-colors flex items-center gap-1"
                        title={item.specs}
                      >
                        <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-amber-400 font-bold">{item.category}</span>
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Plant Sizing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Solar Module with Dropdown */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Module Brand (Dropdown / Editable)
                  </label>
                  <select
                    value={formData.panelBrand}
                    onChange={(e) => {
                      const val = e.target.value;
                      const matched = allBoSItems.find((i) => i.category === 'Solar Panels' && i.name === val);
                      setFormData({
                        ...formData,
                        panelBrand: val,
                        panelModel: matched ? matched.specs : formData.panelModel,
                      });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 mb-1 font-semibold"
                  >
                    <option value={formData.panelBrand}>{formData.panelBrand} (Current)</option>
                    {allBoSItems
                      .filter((i) => i.category === 'Solar Panels')
                      .map((i) => (
                        <option key={i.id} value={i.name}>
                          {i.name}
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    value={formData.panelBrand}
                    onChange={(e) => setFormData({ ...formData, panelBrand: e.target.value })}
                    placeholder="Custom Brand Name"
                    className="w-full bg-slate-850 border border-slate-750 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Module Model / Spec</label>
                  <input
                    type="text"
                    value={formData.panelModel}
                    onChange={(e) => setFormData({ ...formData, panelModel: e.target.value })}
                    placeholder="e.g. WS-550-DCR Half-Cut"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Panel Wattage (Watts)</label>
                  <input
                    type="number"
                    value={formData.panelWattage}
                    onChange={(e) => {
                      const w = Number(e.target.value) || 550;
                      setFormData({ ...formData, panelWattage: w });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Number of Modules (Nos)</label>
                  <input
                    type="number"
                    value={formData.panelQuantity}
                    onChange={(e) => {
                      const qty = Number(e.target.value) || 1;
                      setFormData({ ...formData, panelQuantity: qty });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Inverter with Dropdown */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Inverter Brand (Dropdown / Editable)
                  </label>
                  <select
                    value={formData.inverterBrand}
                    onChange={(e) => {
                      const val = e.target.value;
                      const matched = allBoSItems.find((i) => i.category === 'Inverters' && i.name === val);
                      setFormData({
                        ...formData,
                        inverterBrand: val,
                        inverterModel: matched ? matched.specs : formData.inverterModel,
                      });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 mb-1 font-semibold"
                  >
                    <option value={formData.inverterBrand}>{formData.inverterBrand} (Current)</option>
                    {allBoSItems
                      .filter((i) => i.category === 'Inverters')
                      .map((i) => (
                        <option key={i.id} value={i.name}>
                          {i.name}
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    value={formData.inverterBrand}
                    onChange={(e) => setFormData({ ...formData, inverterBrand: e.target.value })}
                    placeholder="Custom Inverter Brand"
                    className="w-full bg-slate-850 border border-slate-750 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Inverter Model</label>
                  <input
                    type="text"
                    value={formData.inverterModel}
                    onChange={(e) => setFormData({ ...formData, inverterModel: e.target.value })}
                    placeholder="e.g. PS-GT-3.3K-1P"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Inverter Capacity (kW)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.inverterCapacityKw}
                    onChange={(e) =>
                      setFormData({ ...formData, inverterCapacityKw: Number(e.target.value) || 3.3 })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Structure with Dropdown */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Mounting Structure Type</label>
                  <select
                    value={formData.structureType}
                    onChange={(e) => setFormData({ ...formData, structureType: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 mb-1 font-semibold"
                  >
                    <option value={formData.structureType}>{formData.structureType} (Current)</option>
                    {allBoSItems
                      .filter((i) => i.category === 'Structure')
                      .map((i) => (
                        <option key={i.id} value={`${i.name} • ${i.specs}`}>
                          {i.name}
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    value={formData.structureType}
                    onChange={(e) => setFormData({ ...formData, structureType: e.target.value })}
                    placeholder="Custom Structure Details"
                    className="w-full bg-slate-850 border border-slate-750 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* ACDB with Dropdown */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">ACDB Specifications</label>
                  <select
                    value={formData.acdbSpecs}
                    onChange={(e) => setFormData({ ...formData, acdbSpecs: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 mb-1"
                  >
                    <option value={formData.acdbSpecs}>{formData.acdbSpecs} (Current)</option>
                    {allBoSItems
                      .filter((i) => i.category === 'ACDB')
                      .map((i) => (
                        <option key={i.id} value={`${i.name} (${i.specs})`}>
                          {i.name}
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    value={formData.acdbSpecs}
                    onChange={(e) => setFormData({ ...formData, acdbSpecs: e.target.value })}
                    className="w-full bg-slate-850 border border-slate-750 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* DCDB with Dropdown */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">DCDB Specifications</label>
                  <select
                    value={formData.dcdbSpecs}
                    onChange={(e) => setFormData({ ...formData, dcdbSpecs: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 mb-1"
                  >
                    <option value={formData.dcdbSpecs}>{formData.dcdbSpecs} (Current)</option>
                    {allBoSItems
                      .filter((i) => i.category === 'DCDB')
                      .map((i) => (
                        <option key={i.id} value={`${i.name} (${i.specs})`}>
                          {i.name}
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    value={formData.dcdbSpecs}
                    onChange={(e) => setFormData({ ...formData, dcdbSpecs: e.target.value })}
                    className="w-full bg-slate-850 border border-slate-750 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* DC Cable with Dropdown */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">DC Cabling</label>
                  <select
                    value={formData.dcCableSpecs}
                    onChange={(e) => setFormData({ ...formData, dcCableSpecs: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 mb-1"
                  >
                    <option value={formData.dcCableSpecs}>{formData.dcCableSpecs} (Current)</option>
                    {allBoSItems
                      .filter((i) => i.category === 'Cables')
                      .map((i) => (
                        <option key={i.id} value={`${i.name} (${i.specs})`}>
                          {i.name}
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    value={formData.dcCableSpecs}
                    onChange={(e) => setFormData({ ...formData, dcCableSpecs: e.target.value })}
                    className="w-full bg-slate-850 border border-slate-750 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* AC Cable with Dropdown */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">AC Cabling</label>
                  <input
                    type="text"
                    value={formData.acCableSpecs}
                    onChange={(e) => setFormData({ ...formData, acCableSpecs: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Earthing with Dropdown */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1">Earthing System (Dropdown / Editable)</label>
                  <select
                    value={formData.earthingSpecs}
                    onChange={(e) => setFormData({ ...formData, earthingSpecs: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 mb-1 font-semibold"
                  >
                    <option value={formData.earthingSpecs}>{formData.earthingSpecs} (Current)</option>
                    {allBoSItems
                      .filter((i) => i.category === 'Earthing')
                      .map((i) => (
                        <option key={i.id} value={`${i.name} • ${i.specs}`}>
                          {i.name}
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    value={formData.earthingSpecs}
                    onChange={(e) => setFormData({ ...formData, earthingSpecs: e.target.value })}
                    className="w-full bg-slate-850 border border-slate-750 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Lightning with Dropdown */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1">Lightning Protection Terminal</label>
                  <select
                    value={formData.lightningProtectionSpecs}
                    onChange={(e) => setFormData({ ...formData, lightningProtectionSpecs: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 mb-1 font-semibold"
                  >
                    <option value={formData.lightningProtectionSpecs}>{formData.lightningProtectionSpecs} (Current)</option>
                    {allBoSItems
                      .filter((i) => i.category === 'Protection')
                      .map((i) => (
                        <option key={i.id} value={`${i.name} • ${i.specs}`}>
                          {i.name}
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    value={formData.lightningProtectionSpecs}
                    onChange={(e) => setFormData({ ...formData, lightningProtectionSpecs: e.target.value })}
                    className="w-full bg-slate-850 border border-slate-750 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: COMMERCIAL PRICING & WHOLE SYSTEM PRICE WITH GST AUTO-CALCULATIONS (EXPLICIT USER REQUIREMENT) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-400" /> 3. Commercial Pricing & Central Subsidy (Editable)
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Enter <strong className="text-amber-400">Whole System Price</strong> — Base Turnkey Price & GST adjust automatically according to Composite Solar GST Rate %
                  </p>
                </div>
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                  PM Surya Ghar Scheme: Up to ₹78,000 CFA
                </span>
              </div>

              {/* Automatic Calculation Guidance Formula */}
              <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30 text-[11px] text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 font-bold rounded">Auto-Formula</span>
                  <span>
                    Base Turnkey Price = <strong>Whole System Price ÷ (1 + GST Rate%)</strong> • Calculated GST = <strong>Whole System Price - Base</strong>
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  Composite Solar GST: 13.8% (70% @ 12% Goods + 30% @ 18% Services)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* 1. WHOLE SYSTEM PRICE (RENAME AS PER USER REQUIREMENT & EDITABLE) */}
                <div className="p-3 bg-amber-500/10 border-2 border-amber-500/60 rounded-xl space-y-1">
                  <label className="block text-amber-400 font-black tracking-wide text-xs">
                    Whole System Price (₹) * (Turnkey Total)
                  </label>
                  <input
                    type="number"
                    value={formData.wholeSystemPrice || formData.totalSystemPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      handleWholeSystemPriceChange(val);
                    }}
                    placeholder="e.g. 195000"
                    className="w-full bg-slate-800 border border-amber-500 text-white font-mono font-black text-base rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <div className="text-[10px] text-amber-300/80 font-medium">
                    Enter whole turnkey project cost including GST
                  </div>
                </div>

                {/* 2. GST Rate % (Composite Solar Rate) */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    GST Rate % (Composite Solar Rate) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.gstRatePercent}
                      onChange={(e) => {
                        const rate = Number(e.target.value) || 13.8;
                        handleWholeSystemPriceChange(
                          formData.wholeSystemPrice || formData.totalSystemPrice,
                          rate
                        );
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-slate-400 font-bold">%</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Default 13.8% or 12% / 18%</div>
                </div>

                {/* 3. Base Turnkey Price (Auto Calculated) */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Base Turnkey Price (₹) <span className="text-amber-400 text-[10px]">(Auto-Calculated)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.systemBasePrice}
                      onChange={(e) => {
                        const baseVal = Number(e.target.value) || 0;
                        handlePriceRecalculation(
                          baseVal,
                          formData.discount || 0,
                          formData.gstRatePercent || 13.8,
                          formData.pmSuryaGharSubsidyEstimate || 78000
                        );
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Calculated before {formData.gstRatePercent}% GST
                  </div>
                </div>

                {/* 4. Calculated GST Amount (₹) */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Calculated GST Amount (₹) <span className="text-amber-400 text-[10px]">(Auto-Adjusted)</span>
                  </label>
                  <div className="p-2.5 bg-slate-850 rounded-xl border border-slate-800 text-amber-300 font-mono font-black text-sm flex items-center justify-between">
                    <span>{formatCurrency(formData.gstAmount)}</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      @{formData.gstRatePercent}%
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Adjusts dynamically with rate & whole price
                  </div>
                </div>

                {/* 5. Discount (Optional) */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Special Discount (₹)</label>
                  <input
                    type="number"
                    value={formData.discount || 0}
                    onChange={(e) => {
                      const disc = Number(e.target.value) || 0;
                      handlePriceRecalculation(
                        formData.systemBasePrice,
                        disc,
                        formData.gstRatePercent || 13.8,
                        formData.pmSuryaGharSubsidyEstimate || 78000
                      );
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* 6. Central PM Surya Ghar Subsidy (CFA) */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Central Subsidy (CFA) (₹)</label>
                  <input
                    type="number"
                    value={formData.pmSuryaGharSubsidyEstimate}
                    onChange={(e) => {
                      const sub = Number(e.target.value) || 0;
                      handlePriceRecalculation(
                        formData.systemBasePrice,
                        formData.discount || 0,
                        formData.gstRatePercent || 13.8,
                        sub
                      );
                    }}
                    className="w-full bg-slate-800 border border-emerald-500/50 rounded-xl px-3 py-2 text-emerald-400 font-mono font-black focus:outline-none focus:border-emerald-400"
                  />
                  <div className="text-[10px] text-emerald-400/80 mt-1">Directly credited to consumer bank</div>
                </div>

                {/* 7. Net Customer Payable */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Net Customer Payable (₹)</label>
                  <div className="p-2.5 bg-slate-850 rounded-xl border border-slate-800 text-white font-mono font-black text-sm flex items-center justify-between">
                    <span>{formatCurrency(formData.customerNetPayable)}</span>
                    <span className="text-[10px] text-emerald-400 font-normal">After Subsidy</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Whole Price minus Subsidy</div>
                </div>

                {/* 8. Suggested Booking Advance */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Booking Advance (₹)</label>
                  <input
                    type="number"
                    value={formData.suggestedAdvanceAmount}
                    onChange={(e) => {
                      const adv = Number(e.target.value) || 0;
                      setFormData({
                        ...formData,
                        suggestedAdvanceAmount: adv,
                        balancePayable: Math.max(0, formData.customerNetPayable - adv),
                      });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sky-400 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                  <div className="text-[10px] text-slate-500 mt-1">e.g. 20% Booking Advance with Work Order</div>
                </div>
              </div>
            </div>

            {/* SECTION 4: DOCUMENT REQUIRED FOR LOAD EXPANSION & NET METERING (EXPLICIT USER REQUIREMENT) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-amber-400" /> 4. DOCUMENT REQUIRED FOR LOAD EXPANSION & NET METERING (Editable Checklist)
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Editable checklist for consumer MSEDCL load enhancement sanction and net metering dossier
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddDocumentItem}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-amber-300 font-bold rounded-lg text-xs border border-amber-500/40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Document Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {(formData.loadExpansionDocuments || []).map((doc, idx) => (
                  <div
                    key={doc.id || idx}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all ${
                      doc.required
                        ? 'bg-slate-850/80 border-amber-500/30'
                        : 'bg-slate-950/50 border-slate-850 opacity-70'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={doc.required}
                      onChange={() => handleToggleDocumentCheck(idx)}
                      className="w-4 h-4 mt-1 rounded text-amber-500 bg-slate-800 border-slate-700 cursor-pointer shrink-0"
                    />

                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={doc.documentName}
                        onChange={(e) => handleUpdateDocumentItem(idx, 'documentName', e.target.value)}
                        placeholder="Document title"
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-medium focus:outline-none focus:border-amber-400"
                      />
                      <input
                        type="text"
                        value={doc.notes || ''}
                        onChange={(e) => handleUpdateDocumentItem(idx, 'notes', e.target.value)}
                        placeholder="Notes or instructions for consumer"
                        className="w-full bg-transparent border-0 px-1 py-0.5 text-[11px] text-slate-400 focus:outline-none focus:text-slate-200"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveDocumentItem(idx)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors shrink-0"
                      title="Remove document requirement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: PAYMENT TERMS & PAYMENT SCHEDULE (EXPLICIT USER REQUIREMENT) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-400" /> 5. Payment Terms & Milestone Payment Schedule (Editable)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Stage-wise milestone breakdown and commercial terms for pre-agreement
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold ${
                      totalPercentage === 100
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                    }`}
                  >
                    Total Milestones: {totalPercentage}% {totalPercentage === 100 ? '✓' : '(Must be 100%)'}
                  </span>
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-750 text-amber-400 text-xs font-semibold rounded-lg border border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Milestone</span>
                  </button>
                </div>
              </div>

              {/* Payment Terms text description */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1 text-xs">
                  Overall Payment Terms & Conditions (Shown on Proposal & Work Order)
                </label>
                <textarea
                  rows={2}
                  value={formData.paymentTerms || ''}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  placeholder="e.g. 20% Booking Advance with Work Order, 50% Against Material Dispatch, 20% On Installation, 10% Post Net-Metering..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Milestones Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-850 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Milestone Stage</th>
                      <th className="py-2.5 px-3 w-28">Percentage (%)</th>
                      <th className="py-2.5 px-3 w-36">Milestone Amount (₹)</th>
                      <th className="py-2.5 px-3">Trigger / Due Condition</th>
                      <th className="py-2.5 px-3 text-right w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {(formData.paymentSchedule || []).map((m, idx) => (
                      <tr key={m.id || idx} className="hover:bg-slate-850/40">
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={m.milestone}
                            onChange={(e) => handleUpdateMilestone(idx, 'milestone', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-amber-400 text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={m.percentage}
                              onChange={(e) => handleUpdateMilestone(idx, 'percentage', e.target.value)}
                              className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold font-mono focus:outline-none focus:border-amber-400 text-xs"
                            />
                            <span className="text-slate-400">%</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            value={m.amount}
                            onChange={(e) => handleUpdateMilestone(idx, 'amount', Number(e.target.value) || 0)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-400 text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={m.dueCondition}
                            onChange={(e) => handleUpdateMilestone(idx, 'dueCondition', e.target.value)}
                            placeholder="e.g. Upon Pre-Agreement Signing"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-amber-400 text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveMilestone(idx)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
                            title="Remove milestone row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 6: PROJECT COMPLETION TIMELINE (EXPLICIT USER REQUIREMENT) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" /> 6. Project Completion Timeline & Execution Phases (Editable)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Clear timeline expectations from site survey to Discom net metering
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full font-mono font-bold bg-slate-800 text-amber-400 border border-slate-700">
                    Total Estimated Days: ~{totalTimelineDays} Days
                  </span>
                  <button
                    type="button"
                    onClick={handleAddPhase}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-750 text-amber-400 text-xs font-semibold rounded-lg border border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Phase</span>
                  </button>
                </div>
              </div>

              {/* Overall Timeline text */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1 text-xs">
                  Overall Completion Timeline Summary
                </label>
                <input
                  type="text"
                  value={formData.projectCompletionTimeline || ''}
                  onChange={(e) => setFormData({ ...formData, projectCompletionTimeline: e.target.value })}
                  placeholder="e.g. 21 to 30 Working Days Turnkey Execution (Subject to MSEDCL Feasibility Approval)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Phase Milestones Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-850 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Phase Title</th>
                      <th className="py-2.5 px-3 w-32">Duration (Days)</th>
                      <th className="py-2.5 px-3">Scope Description</th>
                      <th className="py-2.5 px-3 text-right w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {(formData.timelineMilestones || []).map((ph, idx) => (
                      <tr key={ph.id || idx} className="hover:bg-slate-850/40">
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={ph.phase}
                            onChange={(e) => handleUpdatePhase(idx, 'phase', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-amber-400 text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="1"
                              value={ph.durationDays}
                              onChange={(e) => handleUpdatePhase(idx, 'durationDays', Number(e.target.value) || 1)}
                              className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold font-mono focus:outline-none focus:border-amber-400 text-xs"
                            />
                            <span className="text-slate-400">Days</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={ph.description}
                            onChange={(e) => handleUpdatePhase(idx, 'description', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-amber-400 text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemovePhase(idx)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
                            title="Remove phase"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 6: SCOPE OF PROJECT (EXPLICIT USER REQUIREMENT) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ListPlus className="w-4 h-4 text-amber-400" /> 6. Turnkey Scope of Project & Supply Inclusions (Editable)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Clear list of vendor supply, installation, testing and liaisoning duties
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddScopeItem}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-750 text-amber-400 text-xs font-semibold rounded-lg border border-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Scope Item</span>
                </button>
              </div>

              <div className="space-y-2">
                {(formData.scopeOfProject || []).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-amber-400 font-bold w-6 shrink-0">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleUpdateScopeItem(idx, e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveScopeItem(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 7: WARRANTY & COMMERCIAL REMARKS (EDITABLE) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> 7. Warranty Terms & Proposal Remarks (Editable)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    System Warranty Terms (Panels, Inverter & Workmanship)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.warrantyTerms || ''}
                    onChange={(e) => setFormData({ ...formData, warrantyTerms: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Additional Remarks / Proposal Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.remarks || ''}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* BOTTOM SUBMISSION FLOATING BAR */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="text-xs text-slate-400">
                <span>Total Net Turnkey: </span>
                <strong className="text-white font-mono text-sm">
                  {formatCurrency(formData.totalSystemPrice)}
                </strong>
                <span> • After Subsidy: </span>
                <strong className="text-emerald-400 font-mono text-sm">
                  {formatCurrency(formData.customerNetPayable)}
                </strong>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDeleteQuotation(selectedQuotation.id)}
                  className="px-3 py-2 text-rose-400 hover:bg-rose-950/40 rounded-xl text-xs font-semibold border border-transparent hover:border-rose-800"
                >
                  Delete Quote
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('PREVIEW_PRINT')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold"
                >
                  View Printable PDF
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Quotation Changes</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: QUOTATIONS LIST TABLE */}
      {/* ========================================================================= */}
      {activeTab === 'LIST' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" /> All Saved Solar Quotations ({db.quotations.length})
            </h2>
            <button
              onClick={() => {
                const newQ = storage.addQuotation({
                  quotationNumber: `QT-FCSS-2026-${String(db.quotations.length + 1).padStart(4, '0')}`,
                  date: new Date().toISOString().slice(0, 10),
                  customerName: 'New Solar Customer',
                  consumerNumber: '4100' + Math.floor(10000000 + Math.random() * 90000000),
                  mobile: '9822100000',
                  address: 'Nagpur, Maharashtra',
                  systemCapacityKw: 3.3,
                  panelBrand: 'Waaree Energies DCR Mono PERC',
                  panelModel: 'WS-550-DCR',
                  panelWattage: 550,
                  panelQuantity: 6,
                  inverterBrand: 'Polycab Solar Grid-Tie',
                  inverterModel: 'PS-GT-3.3K-1P',
                  inverterCapacityKw: 3.3,
                  structureType: 'Hot Dip Galvanized (HDG) Elevated',
                  acdbSpecs: 'IP65 ACDB with Type II SPD & MCB',
                  dcdbSpecs: 'IP65 DCDB with 1000V DC SPD',
                  dcCableSpecs: 'Polycab 4 sq mm Solar DC Cable',
                  acCableSpecs: 'Polycab 4 sq mm 3-Core Armoured AC Cable',
                  earthingSpecs: '3 x Chemical Gel Earth Electrodes with Chamber',
                  lightningProtectionSpecs: 'Copper Early Streamer Emission Terminal',
                  installationScope: 'Turnkey Design, Supply, Installation & MSEDCL Net Metering',
                  transportationIncluded: true,
                  systemBasePrice: 171353,
                  discount: 0,
                  gstRatePercent: 13.8,
                  gstAmount: 23647,
                  totalSystemPrice: 195000,
                  pmSuryaGharSubsidyEstimate: 78000,
                  customerNetPayable: 117000,
                  suggestedAdvanceAmount: 39000,
                  balancePayable: 78000,
                  status: 'Draft',
                  validUntil: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
                  remarks: 'Turnkey solar quotation with PM Surya Ghar subsidy estimate.',
                  paymentTerms: '20% Advance with Agreement, 50% Against Material Dispatch, 20% Post Installation, 10% Upon Net Metering',
                  paymentSchedule: [
                    { id: 'MS-1', milestone: '1. Booking Advance', percentage: 20, amount: 39000, dueCondition: 'Along with Pre-Agreement Signing' },
                    { id: 'MS-2', milestone: '2. Material Dispatch', percentage: 50, amount: 97500, dueCondition: 'Prior to Dispatch from Depot' },
                    { id: 'MS-3', milestone: '3. Installation & Testing', percentage: 20, amount: 39000, dueCondition: 'On Completion of Panels Mounting' },
                    { id: 'MS-4', milestone: '4. Net Meter & Handover', percentage: 10, amount: 19500, dueCondition: 'Post MSEDCL Joint Inspection' },
                  ],
                  projectCompletionTimeline: '21 to 30 Working Days Turnkey Execution',
                  timelineMilestones: [
                    { id: 'PH-1', phase: 'Phase 1: Site Survey & Registration', durationDays: 3, description: 'Survey & National portal registration' },
                    { id: 'PH-2', phase: 'Phase 2: MSEDCL Feasibility', durationDays: 7, description: 'Discom sanction load approval' },
                    { id: 'PH-3', phase: 'Phase 3: Material Dispatch & Mounting', durationDays: 5, description: 'Structure & panels installation' },
                    { id: 'PH-4', phase: 'Phase 4: Inverter & Earthing', durationDays: 4, description: 'Inverter & 3-pit earthing wiring' },
                    { id: 'PH-5', phase: 'Phase 5: Net-Meter Sync & Subsidy', durationDays: 10, description: 'Joint Discom inspection & CFA credit' },
                  ],
                  scopeOfProject: [
                    'Supply of High Efficiency DCR Mono PERC Solar PV Modules (ALMM Compliant)',
                    'Supply of Grid-Tied Inverter with Wi-Fi monitoring',
                    'Hot Dip Galvanized (HDG) Elevated Structure',
                    'IP65 ACDB & DCDB with Type-II SPD',
                    'UV-resistant Solar DC & Armoured AC Cable',
                    '3-Pit Maintenance-Free Chemical Earthing',
                    'Pure Copper Lightning Arrestor',
                    'MSEDCL Liaisoning & Work Completion Report',
                    'National Portal PM Surya Ghar subsidy claim support',
                    'Bi-directional Net-Meter coordination',
                  ],
                  warrantyTerms: '25 Years Linear Performance Warranty on Modules, 5 Years on Inverter, 5 Years Workmanship by Frontier Complete Solar Solutions.',
                });
                setSelectedQuotation(newQ);
                setActiveTab('BUILDER');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create New Quote</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-850 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Quote Number</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Total System Cost</th>
                  <th className="py-3 px-4">Subsidy (CFA)</th>
                  <th className="py-3 px-4">Net Payable</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {db.quotations.map((q) => {
                  const isSelected = selectedQuotation.id === q.id;
                  return (
                    <tr
                      key={q.id}
                      onClick={() => {
                        setSelectedQuotation(q);
                        setActiveTab('BUILDER');
                      }}
                      className={`hover:bg-slate-850/60 transition-colors cursor-pointer ${
                        isSelected ? 'bg-amber-500/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {q.quotationNumber}
                        <div className="text-[10px] text-slate-500 font-normal">{formatDate(q.date)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-xs">{q.customerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{q.consumerNumber}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-400">
                        {q.systemCapacityKw} kW
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {formatCurrency(q.totalSystemPrice)}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-400">
                        {formatCurrency(q.pmSuryaGharSubsidyEstimate)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {formatCurrency(q.customerNetPayable)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            q.status === 'Approved'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : q.status === 'Sent'
                              ? 'bg-sky-950 text-sky-400 border border-sky-800'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setSelectedQuotation(q);
                              setActiveTab('BUILDER');
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded-lg transition-colors border border-slate-700"
                            title="Edit Quotation"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedQuotation(q);
                              setActiveTab('PREVIEW_PRINT');
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
                            title="Printable PDF"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BRANDED PRINTABLE QUOTATION (PDF VIEW) */}
      {/* ========================================================================= */}
      {activeTab === 'PREVIEW_PRINT' && (
        <div className="space-y-4">
          {/* Top Toolbar */}
          <div className="flex items-center justify-between print:hidden">
            <button
              onClick={() => setActiveTab('BUILDER')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold"
            >
              ← Back to Builder
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-lg transition-colors border border-slate-700"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Document (PDF)</span>
              </button>
            </div>
          </div>

          {/* Printable Letterhead Document */}
          {(() => {
            const activeCompanyProfile =
              companyProfiles.find((p) => p.id === (formData.companyProfileId || selectedQuotation.companyProfileId)) ||
              companyProfiles[0] ||
              INITIAL_COMPANY_PROFILES[0];

            return (
              <div className="bg-white text-slate-900 rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl border border-slate-200 print:p-0 print:border-none print:shadow-none text-xs">
                {/* Letterhead */}
                <div className="border-b-2 border-amber-500 pb-4 mb-6 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {activeCompanyProfile.logoUrl ? (
                      <img
                        src={activeCompanyProfile.logoUrl}
                        alt={activeCompanyProfile.name}
                        className="w-16 h-16 object-contain rounded-lg border border-slate-200 p-1 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shrink-0">
                        <Building2 className="w-7 h-7" />
                      </div>
                    )}
                    <div>
                      <div className="text-2xl font-black text-slate-950 tracking-tight">
                        {activeCompanyProfile.name}
                      </div>
                      <div className="text-xs text-amber-700 font-bold mt-0.5">
                        {activeCompanyProfile.tagline || 'REGISTERED PM SURYA GHAR VENDOR • MAHADISCOM EMPANELLED'}
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        📍 {activeCompanyProfile.address}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-3 flex-wrap mt-0.5">
                        <span><strong>GSTIN:</strong> {activeCompanyProfile.gstNumber}</span>
                        <span>•</span>
                        <span><strong>Email:</strong> {activeCompanyProfile.email}</span>
                        <span>•</span>
                        <span><strong>Ph:</strong> {activeCompanyProfile.ownerContact} ({activeCompanyProfile.ownerName || 'Proprietor'})</span>
                        {activeCompanyProfile.registrationNumber && (
                          <>
                            <span>•</span>
                            <span><strong>Reg No:</strong> {activeCompanyProfile.registrationNumber}</span>
                          </>
                        )}
                      </div>
                      {activeCompanyProfile.bankName && (
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">
                          Bank Details for Advance: {activeCompanyProfile.bankName} | A/C: {activeCompanyProfile.bankAccountNumber} | IFSC: {activeCompanyProfile.bankIfsc}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs rounded border border-amber-300">
                      SOLAR ROOFTOP QUOTATION
                    </span>
                    <div className="font-mono text-xs text-slate-700 mt-1">
                      Quote No: <strong>{formData.quotationNumber}</strong>
                    </div>
                    <div className="text-xs text-slate-600">Date: {formatDate(formData.date)}</div>
                    <div className="text-xs text-slate-500">Valid Until: {formatDate(formData.validUntil)}</div>
                  </div>
                </div>

            {/* Customer & Technical Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 grid grid-cols-2 gap-4">
              <div>
                <div className="text-slate-500 font-medium">Customer Details:</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{formData.customerName}</div>
                <div className="text-slate-700 mt-0.5">{formData.address}</div>
                <div className="text-slate-700 mt-0.5 font-mono">Mobile: {formData.mobile}</div>
              </div>
              <div>
                <div className="text-slate-500 font-medium">Electricity & Connection:</div>
                <div className="text-slate-800 font-mono mt-0.5">
                  Consumer No: <strong>{formData.consumerNumber}</strong>
                </div>
                <div className="text-slate-800 mt-0.5">
                  Proposed Solar Capacity: <strong>{formData.systemCapacityKw} kW On-Grid</strong>
                </div>
                <div className="text-slate-800 mt-0.5">Discom: MSEDCL Nagpur Circle</div>
              </div>
            </div>

            {/* Scope of Supply & BoS Table */}
            <div className="space-y-2 mb-6">
              <div className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                1. Bill of Materials (BoS) & Technical Specifications:
              </div>
              <table className="w-full text-left border border-slate-300">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-300">
                  <tr>
                    <th className="p-2">Item & Description</th>
                    <th className="p-2">Brand / Specification</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Warranty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 font-semibold">Solar PV Modules</td>
                    <td className="p-2">{formData.panelBrand} ({formData.panelWattage}W Mono PERC DCR)</td>
                    <td className="p-2 text-center font-bold">{formData.panelQuantity} Nos</td>
                    <td className="p-2 text-right">25 Years</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Grid-Tie Solar Inverter</td>
                    <td className="p-2">{formData.inverterBrand} ({formData.inverterModel})</td>
                    <td className="p-2 text-center font-bold">1 No</td>
                    <td className="p-2 text-right">5 Years</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Mounting Structure</td>
                    <td className="p-2">{formData.structureType}</td>
                    <td className="p-2 text-center font-bold">1 Set</td>
                    <td className="p-2 text-right">15 Years</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">ACDB & DCDB Distribution</td>
                    <td className="p-2">{formData.acdbSpecs} & {formData.dcdbSpecs}</td>
                    <td className="p-2 text-center font-bold">1 Set</td>
                    <td className="p-2 text-right">5 Years</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Chemical Earthing & LA</td>
                    <td className="p-2">{formData.earthingSpecs}</td>
                    <td className="p-2 text-center font-bold">3 Sets</td>
                    <td className="p-2 text-right">5 Years</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Commercial Pricing & PM Surya Ghar Subsidy */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 mb-6">
              <div className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
                2. Commercial Turnkey Pricing & CFA Central Subsidy:
              </div>
              <div className="space-y-1">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Base Turnkey System Cost:</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(formData.systemBasePrice)}</span>
                </div>
                {formData.discount > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-200 text-rose-600">
                    <span>Vendor Discount:</span>
                    <span className="font-semibold">- {formatCurrency(formData.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">GST (Composite Solar Rate {formData.gstRatePercent}%):</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(formData.gstAmount)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b-2 border-slate-900 text-sm font-bold text-slate-900">
                  <span>Total Turnkey System Cost:</span>
                  <span>{formatCurrency(formData.totalSystemPrice)}</span>
                </div>
                <div className="flex justify-between py-2 text-emerald-800 font-bold border-b border-slate-200">
                  <span>PM Surya Ghar Central Subsidy (Credited directly into Bank Account):</span>
                  <span>- {formatCurrency(formData.pmSuryaGharSubsidyEstimate)}</span>
                </div>
                <div className="flex justify-between py-2 bg-amber-100 p-2.5 rounded mt-2 font-black text-amber-950 text-sm">
                  <span>Effective Net Customer Payable:</span>
                  <span>{formatCurrency(formData.customerNetPayable)}</span>
                </div>
              </div>
            </div>

            {/* Payment Schedule Table (Requirement) */}
            <div className="space-y-2 mb-6">
              <div className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                3. Milestone Payment Schedule:
              </div>
              <table className="w-full text-left border border-slate-300">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-300">
                  <tr>
                    <th className="p-2">Milestone Stage</th>
                    <th className="p-2 text-center w-24">Percentage</th>
                    <th className="p-2 text-right w-36">Amount (₹)</th>
                    <th className="p-2">Trigger / Due Condition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(formData.paymentSchedule || []).map((m, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-semibold text-slate-800">{m.milestone}</td>
                      <td className="p-2 text-center font-bold text-slate-700">{m.percentage}%</td>
                      <td className="p-2 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(m.amount)}
                      </td>
                      <td className="p-2 text-slate-600">{m.dueCondition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Project Completion Timeline Table (Requirement) */}
            <div className="space-y-2 mb-6">
              <div className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                4. Project Completion Timeline & Phases ({formData.projectCompletionTimeline}):
              </div>
              <table className="w-full text-left border border-slate-300">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-300">
                  <tr>
                    <th className="p-2">Execution Phase</th>
                    <th className="p-2 text-center w-28">Est. Duration</th>
                    <th className="p-2">Scope & Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(formData.timelineMilestones || []).map((ph, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-semibold text-slate-800">{ph.phase}</td>
                      <td className="p-2 text-center font-mono font-bold text-slate-700">
                        {ph.durationDays} Days
                      </td>
                      <td className="p-2 text-slate-600">{ph.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Scope of Project (Requirement) */}
            <div className="space-y-2 mb-6">
              <div className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                5. Turnkey Scope of Project & Vendor Responsibilities:
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                {(formData.scopeOfProject || []).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DOCUMENT REQUIRED FOR LOAD EXPANSION & NET METERING Checklist (Explicit User Requirement) */}
            {formData.loadExpansionDocuments && formData.loadExpansionDocuments.length > 0 && (
              <div className="space-y-2 mb-6">
                <div className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center justify-between">
                  <span>6. DOCUMENT REQUIRED FOR LOAD EXPANSION & NET METERING (Customer Checklist):</span>
                  <span className="text-[10px] text-slate-500 font-normal">To be submitted for Discom sanction</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                  {formData.loadExpansionDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-1.5 bg-white rounded border border-slate-200">
                      <input
                        type="checkbox"
                        checked={doc.required}
                        readOnly
                        className="w-3.5 h-3.5 mt-0.5 rounded text-amber-600 border-slate-300"
                      />
                      <div>
                        <span className="font-semibold text-slate-900">{doc.documentName}</span>
                        {doc.notes && <div className="text-[10px] text-slate-500">{doc.notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Commercial Terms & Warranty */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 space-y-2 text-[11px] text-slate-600">
              <div className="font-bold text-slate-900">Commercial Terms & Warranty:</div>
              <div>• <strong>Payment Policy:</strong> {formData.paymentTerms}</div>
              <div>• <strong>Warranty:</strong> {formData.warrantyTerms}</div>
              {formData.remarks && <div>• <strong>Notes:</strong> {formData.remarks}</div>}
              <div>
                • Central Subsidy (CFA) is transferred directly into customer's bank account by Ministry of New and Renewable Energy (MNRE) post joint inspection.
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs text-slate-700">
              <div>
                <div className="font-bold text-slate-900">For {activeCompanyProfile.name}</div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Proprietor / Authorized Signatory: <strong>{activeCompanyProfile.ownerName}</strong>
                </div>
                <div className="text-[10px] text-slate-400 mt-8">Authorized Signatory & Stamp</div>
              </div>
              <div>
                <div className="font-bold text-slate-900">Customer Acceptance & Work Order</div>
                <div className="text-[10px] text-slate-500 mt-8">
                  Signature: <strong>{formData.customerName}</strong>
                </div>
              </div>
            </div>
          </div>
            );
          })()}
        </div>
      )}

      {/* Company Profile Modal */}
      <CompanyProfileModal
        isOpen={showCompanyModal}
        onClose={() => {
          setShowCompanyModal(false);
          setCompanyProfiles(storage.getCompanyProfiles());
        }}
        selectedCompanyId={formData.companyProfileId}
        onCompanySaved={(id) => {
          setCompanyProfiles(storage.getCompanyProfiles());
          setFormData((prev) => ({ ...prev, companyProfileId: id }));
        }}
      />

      {/* Advance Receipt / Multi-Template Receipt Studio Modal */}
      <ReceiptModal
        isOpen={showAdvanceSlipModal}
        onClose={() => setShowAdvanceSlipModal(false)}
        projectId={formData.projectId}
        defaultCustomerName={formData.customerName}
        defaultConsumerNumber={formData.consumerNumber}
        defaultMobile={formData.mobile}
        defaultAddress={formData.address}
        defaultCapacityKw={formData.systemCapacityKw}
        onOpenWhatsApp={onOpenWhatsApp}
      />
    </div>
  );
};
