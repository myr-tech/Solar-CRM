import React, { useState, useMemo } from 'react';
import {
  FileText,
  Printer,
  Upload,
  Download,
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Building2,
  User,
  Share2,
  Copy,
  RotateCcw,
  Eye,
  FileSpreadsheet,
  X,
  FileUp,
  File,
  Layers,
  Sparkles,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { PrintableDocumentFormat, CompanyProfile } from '../../types';
import { formatDate, generateWhatsAppLink } from '../../utils/formatters';
import { CompanyProfileModal } from '../CompanyProfile/CompanyProfileModal';

interface PrintableDocumentsViewProps {
  onSelectProject?: (projectId: string) => void;
  onOpenWhatsApp?: (phone: string, name: string, projectId?: string) => void;
}

export const PrintableDocumentsView: React.FC<PrintableDocumentsViewProps> = ({
  onSelectProject,
  onOpenWhatsApp,
}) => {
  const db = storage.getDatabase();
  const [formats, setFormats] = useState<PrintableDocumentFormat[]>(() => storage.getPrintableFormats());
  const [selectedFormatId, setSelectedFormatId] = useState<string>(() => formats[0]?.id || 'FMT-001');
  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile[]>(() => storage.getCompanyProfiles());
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  // Active Company Selection
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(() => {
    const defaultProfile = companyProfiles.find((p) => p.isDefault) || companyProfiles[0];
    return defaultProfile?.id || 'COMP-001';
  });
  const activeCompany = companyProfiles.find((p) => p.id === selectedCompanyId) || companyProfiles[0];

  // Autofill Project / Customer Selection
  const [selectedProjectId, setSelectedProjectId] = useState<string>(db.projects[0]?.id || '');
  const activeProject = db.projects.find((p) => p.id === selectedProjectId);
  const activeCustomer = db.customers.find((c) => c.projectId === selectedProjectId);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Edit Template Mode
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [editedTemplateText, setEditedTemplateText] = useState('');

  // Add New Format Modal
  const [showAddFormatModal, setShowAddFormatModal] = useState(false);
  const [newFormatTitle, setNewFormatTitle] = useState('');
  const [newFormatCategory, setNewFormatCategory] = useState<PrintableDocumentFormat['category']>('Discom MSEDCL');
  const [newFormatDescription, setNewFormatDescription] = useState('');
  const [newFormatContent, setNewFormatContent] = useState('');
  const [newFormatPdfUrl, setNewFormatPdfUrl] = useState<string | undefined>(undefined);
  const [newFormatPdfName, setNewFormatPdfName] = useState<string | undefined>(undefined);

  // PDF Viewer Modal
  const [showPdfViewerModal, setShowPdfViewerModal] = useState(false);

  // Toast Notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedFormat = formats.find((f) => f.id === selectedFormatId) || formats[0];

  // Initialize edited text when selected format changes
  React.useEffect(() => {
    if (selectedFormat) {
      setEditedTemplateText(selectedFormat.contentTemplate);
      setIsEditingTemplate(false);
    }
  }, [selectedFormatId]);

  // Dynamic variable replacement
  const renderedContent = useMemo(() => {
    if (!selectedFormat) return '';
    let text = isEditingTemplate ? editedTemplateText : selectedFormat.contentTemplate;

    const custName = activeProject?.customerName || activeCustomer?.name || 'Dr. Milind Vaidya';
    const consNum = activeProject?.consumerNumber || activeCustomer?.consumerNumber || '410019284721';
    const mob = activeProject?.mobile || activeCustomer?.mobile || '9822214589';
    const addr = activeProject?.address || activeCustomer?.address || 'Plot 42, Besa Road, Nagpur - 440027';
    const cap = String(activeProject?.systemCapacityKw || 3.3);
    const subDiv = activeCustomer?.msedclSdn || 'Besa Sub-Division, Nagpur';
    const dt = formatDate(new Date().toISOString().slice(0, 10));

    const replacements: Record<string, string> = {
      '{{customerName}}': custName,
      '{{consumerNumber}}': consNum,
      '{{mobile}}': mob,
      '{{address}}': addr,
      '{{systemCapacityKw}}': cap,
      '{{sanctionedLoadKw}}': String(Math.ceil(Number(cap))),
      '{{subDivision}}': subDiv,
      '{{date}}': dt,
      '{{companyName}}': activeCompany.name,
      '{{gstNumber}}': activeCompany.gstNumber,
      '{{ownerName}}': activeCompany.ownerName || 'Authorized Signatory',
      '{{ownerContact}}': activeCompany.ownerContact,
      '{{companyEmail}}': activeCompany.email,
      '{{companyAddress}}': activeCompany.address,
      '{{registrationNumber}}': activeCompany.registrationNumber || 'MSEDCL/PV/2026/NGP',
      '{{bankName}}': activeCompany.bankName || 'State Bank of India',
      '{{bankAccountNumber}}': activeCompany.bankAccountNumber || '392019284729',
      '{{bankIfsc}}': activeCompany.bankIfsc || 'SBIN0014721',
      '{{nationalPortalAppId}}': `PM-SG-2026-MH-${consNum.slice(-5)}`,
      '{{pvApplicationNumber}}': `MSEDCL-PV-2026-${consNum.slice(-5)}`,
      '{{inverterCapacityKw}}': cap,
      '{{phase}}': Number(cap) > 5 ? 'Three Phase 415V' : 'Single Phase 230V',
      '{{meterMake}}': 'Secure / Genus Tri-Vector',
      '{{meterPhaseType}}': Number(cap) > 5 ? 'Three Phase 4-Wire' : 'Single Phase 2-Wire',
      '{{meterSerialNumbers}}': `SEC-2026-${consNum.slice(-4)}`,
      '{{testingFeeAmount}}': '1,180 (Including 18% GST)',
      '{{testingChallanNumber}}': `MSD-TEST-CHAL-${Date.now().toString().slice(-5)}`,
      '{{testingChallanDate}}': dt,
      '{{representativeName}}': 'Mangesh Deshmukh (Project Engineer)',
      '{{representativePhone}}': '+91 98230 44551',
      '{{loanApplicationRef}}': `JS-PMSG-2026-${consNum.slice(-4)}`,
      '{{bankBranch}}': 'Besa Branch',
      '{{loanCancellationReason}}': 'Consumer opting for direct 100% self-financing and upfront payment',
      '{{societyName}}': 'Silver Heights Co-operative Housing Society',
      '{{flatNumber}}': 'Flat No. 302, Wing-A',
      '{{terraceAreaSqFt}}': '350',
      '{{cancellationReason}}': 'Premise restructuring and revision of connected load application',
      '{{oldCustomerName}}': 'Late Smt. Sharda Vaidya',
      '{{ownershipDocType}}': 'Registered Gift Deed / Index-II',
      '{{ownershipDocDate}}': '14-Aug-2024',
      '{{billingUnit}}': 'BU-4402',
      '{{fatherOrSpouseName}}': 'Late Shri R. K. Vaidya',
      '{{aadhaarLast4}}': '4829',
    };

    Object.entries(replacements).forEach(([key, value]) => {
      text = text.replaceAll(key, value);
    });

    return text;
  }, [selectedFormat, isEditingTemplate, editedTemplateText, activeProject, activeCustomer, activeCompany]);

  const filteredFormats = useMemo(() => {
    return formats.filter((f) => {
      const matchCat = selectedCategory === 'ALL' || f.category === selectedCategory;
      const matchSearch =
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [formats, selectedCategory, searchQuery]);

  // Handle PDF Upload to Format
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>, formatId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const fileSize = `${(file.size / 1024).toFixed(1)} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      storage.updatePrintableFormat(formatId, {
        pdfFileUrl: result,
        pdfFileName: fileName,
        pdfFileSize: fileSize,
      });

      setFormats(storage.getPrintableFormats());
      showToast(`Master PDF "${fileName}" attached successfully to format!`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePdf = (formatId: string) => {
    if (confirm('Are you sure you want to remove the attached PDF?')) {
      storage.updatePrintableFormat(formatId, {
        pdfFileUrl: undefined,
        pdfFileName: undefined,
        pdfFileSize: undefined,
      });
      setFormats(storage.getPrintableFormats());
      showToast('Attached PDF removed.');
    }
  };

  const handleSaveTemplateText = () => {
    if (!selectedFormat) return;
    storage.updatePrintableFormat(selectedFormat.id, {
      contentTemplate: editedTemplateText,
    });
    setFormats(storage.getPrintableFormats());
    setIsEditingTemplate(false);
    showToast('Document format template updated and saved to database!');
  };

  const handleDeleteFormat = (formatId: string) => {
    if (formats.length <= 1) {
      alert('Cannot delete the last remaining format.');
      return;
    }
    if (confirm('Are you sure you want to delete this document format?')) {
      storage.deletePrintableFormat(formatId);
      const remaining = storage.getPrintableFormats();
      setFormats(remaining);
      setSelectedFormatId(remaining[0]?.id || '');
      showToast('Document format deleted.');
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all printable document formats to system standard defaults?')) {
      storage.resetPrintableFormats();
      const updated = storage.getPrintableFormats();
      setFormats(updated);
      setSelectedFormatId(updated[0]?.id || '');
      showToast('All standard document formats restored!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(renderedContent);
    showToast('Formatted document copied to clipboard!');
  };

  const handleShareWhatsApp = () => {
    const phone = activeProject?.mobile || activeCustomer?.mobile || '9822214589';
    const text = `*${selectedFormat.title.toUpperCase()}*\n\n` +
      `Issued By: *${activeCompany.name}*\n\n` +
      `${renderedContent.slice(0, 900)}...\n\n` +
      `_Official printable document generated via Frontier Solar ERP._`;

    if (onOpenWhatsApp) {
      onOpenWhatsApp(phone, activeProject?.customerName || 'Customer', activeProject?.id);
    } else {
      window.open(generateWhatsAppLink(phone, text), '_blank');
    }
  };

  const handleAddNewFormat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormatTitle.trim()) {
      alert('Please enter a format title.');
      return;
    }

    const created = storage.addPrintableFormat({
      title: newFormatTitle,
      category: newFormatCategory,
      description: newFormatDescription || 'Custom printable format for solar operations',
      templateType: 'custom',
      defaultTitle: newFormatTitle.toUpperCase(),
      contentTemplate:
        newFormatContent ||
        `To,\nThe Executive Engineer,\nMSEDCL Nagpur Circle.\n\nSubject: ${newFormatTitle}\nReference Consumer No: {{consumerNumber}}\n\nRespected Sir,\n\nI, {{customerName}}, residing at {{address}}, hereby submit this application...\n\nApplicant: {{customerName}}\nMobile: {{mobile}}\nDate: {{date}}\nFor Vendor: {{companyName}}`,
      requiredFields: ['Consumer No', 'Customer Name', 'Address', 'Date'],
      pdfFileUrl: newFormatPdfUrl,
      pdfFileName: newFormatPdfName,
      pdfFileSize: newFormatPdfUrl ? 'Attached PDF' : undefined,
    });

    setFormats(storage.getPrintableFormats());
    setSelectedFormatId(created.id);
    setShowAddFormatModal(false);
    setNewFormatTitle('');
    setNewFormatDescription('');
    setNewFormatContent('');
    setNewFormatPdfUrl(undefined);
    setNewFormatPdfName(undefined);
    showToast(`New format "${created.title}" added to library!`);
  };

  const categories = ['ALL', 'Discom MSEDCL', 'PM Surya Ghar', 'Banking & Jan Samarth', 'Society & Legal', 'Custom'];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-600 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-amber-400" /> Printable Documents & Formats Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Standard MSEDCL & PM Surya Ghar printable formats, upload/attach PDF files, dynamic autofill & letterhead printing
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
            title="Restore standard formats"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddFormatModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Format</span>
          </button>
        </div>
      </div>

      {/* Quick Autofill & Company Letterhead Selector Bar (Hidden on Print) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Profile Letterhead selector */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Company Letterhead Header:
              </span>
              <button
                type="button"
                onClick={() => setShowCompanyModal(true)}
                className="text-[10px] text-slate-400 hover:text-amber-400 flex items-center gap-1 font-semibold"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit / Add Company</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {activeCompany.logoUrl ? (
                <img
                  src={activeCompany.logoUrl}
                  alt={activeCompany.name}
                  className="w-10 h-10 object-contain rounded-lg bg-slate-900 p-1 border border-slate-800 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold shrink-0">
                  ⚡
                </div>
              )}
              <div className="flex-1 min-w-0">
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
                >
                  {companyProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.isDefault ? '★ (Default)' : ''}
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  GSTIN: {activeCompany.gstNumber} • {activeCompany.ownerContact}
                </div>
              </div>
            </div>
          </div>

          {/* Customer / Project Autofill selector */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Quick Autofill Customer / Project:
            </span>

            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-400"
            >
              {db.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.customerName} ({p.projectId}) • Consumer: {p.consumerNumber} • {p.systemCapacityKw} kW
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="truncate">Premise: {activeProject?.address || 'Nagpur'}</span>
              <span className="font-mono text-emerald-400 shrink-0">
                Variables auto-filled into document
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout (Formats list on left, Document Viewer on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Formats Directory (Hidden on Print) */}
        <div className="lg:col-span-4 space-y-4 print:hidden">
          {/* Search & Category Filter */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search formats (e.g. meter, loan, NOC)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Formats Cards List */}
          <div className="space-y-2.5">
            {filteredFormats.map((fmt) => {
              const isSelected = fmt.id === selectedFormatId;
              return (
                <div
                  key={fmt.id}
                  onClick={() => setSelectedFormatId(fmt.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-gradient-to-r from-slate-850 to-slate-900 border-amber-500/70 shadow-lg ring-1 ring-amber-500/40'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-850/60 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                      {fmt.category}
                    </span>

                    {fmt.pdfFileUrl ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                        <FileUp className="w-3 h-3" />
                        <span>PDF Attached</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Live Format</span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-sm leading-snug">{fmt.title}</h3>
                  <p className="text-slate-400 text-[11px] line-clamp-2 mt-1 leading-relaxed">
                    {fmt.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-500">
                    <span className="font-mono">{fmt.id}</span>
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <span>View & Print</span> →
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredFormats.length === 0 && (
              <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                No printable document formats matched your search.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Document Viewer & Action Deck */}
        <div className="lg:col-span-8 space-y-4">
          {/* Document Action Top Bar (Hidden on Print) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg print:hidden">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                {selectedFormat?.category} • {selectedFormat?.id}
              </span>
              <h2 className="text-base font-black text-white leading-tight mt-0.5">
                {selectedFormat?.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
              <button
                type="button"
                onClick={() => setIsEditingTemplate(!isEditingTemplate)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  isEditingTemplate
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingTemplate ? 'Preview View' : 'Edit Text'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
                title="Copy formatted text"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy</span>
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900 rounded-lg text-xs font-bold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs transition-colors shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>

              {selectedFormat?.templateType === 'custom' && (
                <button
                  type="button"
                  onClick={() => handleDeleteFormat(selectedFormat.id)}
                  className="p-1.5 text-rose-400 hover:bg-rose-950/60 rounded-lg transition-colors border border-rose-900/50"
                  title="Delete format"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* PDF File Attachment Banner for this format */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg print:hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${selectedFormat?.pdfFileUrl ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  <File className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Attached Master PDF / Scanned Blank Form</span>
                    {selectedFormat?.pdfFileUrl && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                        {selectedFormat.pdfFileSize || 'Ready'}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {selectedFormat?.pdfFileName
                      ? `File: ${selectedFormat.pdfFileName}`
                      : 'You can upload original MSEDCL PDF application or blank physical form to print anytime'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedFormat?.pdfFileUrl ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowPdfViewerModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Preview PDF</span>
                    </button>

                    <a
                      href={selectedFormat.pdfFileUrl}
                      download={selectedFormat.pdfFileName || `${selectedFormat.title}.pdf`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleRemovePdf(selectedFormat.id)}
                      className="p-1.5 text-rose-400 hover:bg-rose-950/60 rounded-lg transition-colors border border-rose-800/40"
                      title="Remove PDF"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <label className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-amber-400 border border-amber-500/40 rounded-lg text-xs font-bold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Master PDF</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => handlePdfUpload(e, selectedFormat.id)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Template Edit Mode */}
          {isEditingTemplate ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl print:hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-amber-400 uppercase">
                  Edit Template Text & Variables
                </span>
                <div className="text-[10px] text-slate-500">
                  Placeholders like <code className="text-amber-300">{'{{customerName}}'}</code> will auto-fill from consumer profile
                </div>
              </div>

              <textarea
                rows={18}
                value={editedTemplateText}
                onChange={(e) => setEditedTemplateText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-amber-400"
              />

              <div className="flex items-center justify-between pt-2">
                <div className="text-[10px] text-slate-400">
                  Supported: {'{{customerName}}'}, {'{{consumerNumber}}'}, {'{{address}}'}, {'{{mobile}}'}, {'{{systemCapacityKw}}'}, {'{{subDivision}}'}, {'{{date}}'}, {'{{companyName}}'}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditedTemplateText(selectedFormat.contentTemplate);
                      setIsEditingTemplate(false);
                    }}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTemplateText}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-md"
                  >
                    Save Changes to Template
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* PRINTABLE DOCUMENT VIEW CANVAS */
            <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-10 shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0 text-xs font-serif leading-relaxed">
              {/* Dynamic Company Letterhead Header */}
              <div className="border-b-2 border-slate-800 pb-5 mb-6 flex items-start justify-between gap-4 font-sans">
                <div className="flex items-start gap-4">
                  {activeCompany.logoUrl ? (
                    <img
                      src={activeCompany.logoUrl}
                      alt={activeCompany.name}
                      className="w-16 h-16 object-contain shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-600 font-black text-2xl shrink-0">
                      ⚡
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                      {activeCompany.name}
                    </h2>
                    <div className="text-[11px] font-semibold text-amber-700 mt-0.5">
                      {activeCompany.tagline || 'PM Surya Ghar Registered Rooftop Solar EPC Vendor • MSEDCL Empanelled'}
                    </div>
                    <div className="text-[10px] text-slate-600 mt-1">
                      {activeCompany.address} • Phone: {activeCompany.ownerContact} • Email: {activeCompany.email}
                    </div>
                    <div className="text-[10px] font-mono text-slate-700 mt-0.5">
                      <strong>GSTIN:</strong> {activeCompany.gstNumber} {activeCompany.registrationNumber && `• Vendor Reg: ${activeCompany.registrationNumber}`}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-800 font-mono font-bold text-[10px] rounded border border-slate-300 uppercase">
                    {selectedFormat.id}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">Date: {formatDate(new Date().toISOString().slice(0, 10))}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Circle: Nagpur</div>
                </div>
              </div>

              {/* Document Title Banner */}
              <div className="text-center mb-6 border-b border-dashed border-slate-300 pb-3">
                <h3 className="text-base font-black uppercase tracking-wide font-sans text-slate-900">
                  {selectedFormat.defaultTitle || selectedFormat.title}
                </h3>
              </div>

              {/* Rendered Document Body */}
              <div className="whitespace-pre-wrap text-slate-900 leading-relaxed text-xs sm:text-[13px] font-serif space-y-3">
                {renderedContent}
              </div>

              {/* Document Footer Verification */}
              <div className="pt-8 border-t border-slate-300 mt-8 grid grid-cols-2 gap-8 text-center text-xs font-sans text-slate-700">
                <div>
                  <div className="font-bold text-slate-900">Applicant / Consumer</div>
                  <div className="text-[10px] text-slate-500 mt-1">{activeProject?.customerName || 'Consumer Signature'}</div>
                  <div className="h-10"></div>
                  <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-1">
                    Signature & Date
                  </div>
                </div>

                <div>
                  <div className="font-bold text-slate-900">For {activeCompany.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Empanelled Rooftop Solar EPC Agency</div>
                  <div className="h-10"></div>
                  <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-1">
                    Authorized Signatory & Stamp
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD NEW DOCUMENT FORMAT */}
      {showAddFormatModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl p-5 sm:p-6 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowAddFormatModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Add New Printable Document Format</h3>
                <p className="text-xs text-slate-400">
                  Create custom repeatable formats with placeholder variables and attach master PDF files
                </p>
              </div>
            </div>

            <form onSubmit={handleAddNewFormat} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Format Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Affidavit for Rooftop Solar Net Metering / Discom Indemnity"
                  value={newFormatTitle}
                  onChange={(e) => setNewFormatTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={newFormatCategory}
                    onChange={(e) => setNewFormatCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Discom MSEDCL">Discom MSEDCL</option>
                    <option value="PM Surya Ghar">PM Surya Ghar</option>
                    <option value="Banking & Jan Samarth">Banking & Jan Samarth</option>
                    <option value="Society & Legal">Society & Legal</option>
                    <option value="Custom">Custom Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Short purpose of this document"
                    value={newFormatDescription}
                    onChange={(e) => setNewFormatDescription(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Master PDF Upload */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <label className="block text-slate-300 font-semibold mb-1">
                  Optional: Attach Blank Master PDF File
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setNewFormatPdfName(file.name);
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setNewFormatPdfUrl(event.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-amber-400 hover:file:bg-slate-700"
                />
                {newFormatPdfName && (
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Attached: {newFormatPdfName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Template Content & Variables
                </label>
                <textarea
                  rows={8}
                  placeholder={`To,\nThe Assistant Engineer,\nMSEDCL Sub-Division.\n\nSubject: ...\n\nI, {{customerName}}, Consumer Number: {{consumerNumber}} residing at {{address}}...\n\nSignature: {{customerName}}\nDate: {{date}}`}
                  value={newFormatContent}
                  onChange={(e) => setNewFormatContent(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white font-mono text-xs focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddFormatModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-md"
                >
                  Save Format to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PDF VIEWER */}
      {showPdfViewerModal && selectedFormat?.pdfFileUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
            <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <File className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-white text-sm">
                  {selectedFormat.pdfFileName || selectedFormat.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedFormat.pdfFileUrl}
                  download={selectedFormat.pdfFileName || `${selectedFormat.title}.pdf`}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>

                <button
                  onClick={() => setShowPdfViewerModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-950 p-2 overflow-hidden flex items-center justify-center">
              <iframe
                src={selectedFormat.pdfFileUrl}
                title="PDF Preview"
                className="w-full h-full rounded-xl border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* Embedded Company Profile Modal */}
      <CompanyProfileModal
        isOpen={showCompanyModal}
        onClose={() => {
          setShowCompanyModal(false);
          setCompanyProfiles(storage.getCompanyProfiles());
        }}
        selectedCompanyId={selectedCompanyId}
        onCompanySaved={(id) => {
          setCompanyProfiles(storage.getCompanyProfiles());
          setSelectedCompanyId(id);
        }}
      />
    </div>
  );
};
