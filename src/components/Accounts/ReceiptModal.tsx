import React, { useState, useEffect } from 'react';
import {
  Printer,
  Share2,
  CheckCircle2,
  X,
  Building2,
  IndianRupee,
  Calendar,
  CreditCard,
  User,
  Phone,
  MapPin,
  Sparkles,
  FileText,
  Save,
  RotateCcw,
  Edit3,
  Layers,
  Download,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { Payment, PaymentType, PaymentMode, CompanyProfile } from '../../types';
import { formatCurrency, formatDate, numberToIndianWords, generateWhatsAppLink } from '../../utils/formatters';
import { CompanyProfileModal } from '../CompanyProfile/CompanyProfileModal';

export type ReceiptTemplateType =
  | 'corporate_letterhead'
  | 'tax_solar_voucher'
  | 'clean_minimalist'
  | 'traditional_certificate'
  | 'compact_slip'
  | 'solar_milestone';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment?: Payment | null;
  projectId?: string;
  defaultCustomerName?: string;
  defaultConsumerNumber?: string;
  defaultMobile?: string;
  defaultAddress?: string;
  defaultCapacityKw?: number;
  onPaymentSaved?: (payment: Payment) => void;
  onOpenWhatsApp?: (phone: string, name: string, projectId?: string) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
  projectId,
  defaultCustomerName,
  defaultConsumerNumber,
  defaultMobile,
  defaultAddress,
  defaultCapacityKw,
  onPaymentSaved,
  onOpenWhatsApp,
}) => {
  const db = storage.getDatabase();
  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile[]>(() => storage.getCompanyProfiles());
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  // Active Company Selection
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(() => {
    if (payment?.companyProfileId) return payment.companyProfileId;
    const defaultProfile = companyProfiles.find((p) => p.isDefault) || companyProfiles[0];
    return defaultProfile?.id || 'COMP-001';
  });

  const activeCompany: CompanyProfile =
    companyProfiles.find((p) => p.id === selectedCompanyId) || companyProfiles[0];

  // Template Selection
  const [selectedTemplate, setSelectedTemplate] = useState<ReceiptTemplateType>('corporate_letterhead');

  // Edit / Input Mode
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Form Fields State
  const [receiptNumber, setReceiptNumber] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [customerName, setCustomerName] = useState<string>('');
  const [consumerNumber, setConsumerNumber] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [projId, setProjId] = useState<string>('');
  const [capacityKw, setCapacityKw] = useState<number>(3.3);
  const [paymentType, setPaymentType] = useState<PaymentType>('Advance');
  const [amount, setAmount] = useState<number>(25000);
  const [mode, setMode] = useState<PaymentMode>('UPI');
  const [bankName, setBankName] = useState<string>('State Bank of India');
  const [transactionNumber, setTransactionNumber] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [verified, setVerified] = useState<boolean>(true);

  // Notification
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Initialize data on open or when payment prop changes
  useEffect(() => {
    if (!isOpen) return;

    const profiles = storage.getCompanyProfiles();
    setCompanyProfiles(profiles);

    if (payment) {
      setReceiptNumber(payment.receiptNumber || storage.getNextReceiptNumber());
      setDate(payment.date || new Date().toISOString().slice(0, 10));
      setCustomerName(payment.customerName || '');
      setAmount(payment.amount || 0);
      setPaymentType(payment.paymentType || 'Advance');
      setMode(payment.mode || 'UPI');
      setBankName(payment.bankName || 'State Bank of India');
      setTransactionNumber(payment.transactionNumber || `TXN-${Date.now().toString().slice(-6)}`);
      setRemarks(payment.remarks || '');
      setVerified(payment.verified ?? true);
      setProjId(payment.projectId || projectId || 'FCSS-2026-0001');

      if (payment.companyProfileId) {
        setSelectedCompanyId(payment.companyProfileId);
      }

      // Lookup customer details from db
      const cust = db.customers.find((c) => c.projectId === payment.projectId);
      const proj = db.projects.find((p) => p.id === payment.projectId);
      if (cust) {
        setConsumerNumber(cust.consumerNumber || '');
        setMobile(cust.mobile || '');
        setAddress(cust.address || '');
      } else if (proj) {
        setConsumerNumber(proj.consumerNumber || '');
        setMobile(proj.mobile || '');
        setAddress(proj.address || '');
        setCapacityKw(proj.systemCapacityKw || 3.3);
      }
    } else {
      // Fresh new receipt
      setReceiptNumber(storage.getNextReceiptNumber());
      setDate(new Date().toISOString().slice(0, 10));
      setProjId(projectId || db.projects[0]?.id || 'FCSS-2026-0001');
      setCustomerName(defaultCustomerName || db.projects[0]?.customerName || 'Dr. Milind Vaidya');
      setConsumerNumber(defaultConsumerNumber || db.projects[0]?.consumerNumber || '410019284721');
      setMobile(defaultMobile || db.projects[0]?.mobile || '9822214589');
      setAddress(defaultAddress || db.projects[0]?.address || 'Plot 42, Besa Road, Nagpur');
      setCapacityKw(defaultCapacityKw || db.projects[0]?.systemCapacityKw || 3.3);
      setAmount(25000);
      setPaymentType('Advance');
      setMode('UPI');
      setBankName(activeCompany?.bankName || 'State Bank of India');
      setTransactionNumber(`UPI-${Math.floor(100000 + Math.random() * 900000)}`);
      setRemarks(`Advance booking confirmation for PM Surya Ghar Rooftop Solar System.`);
      setVerified(true);
    }
  }, [isOpen, payment, projectId]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleRegenerateReceiptNumber = () => {
    setReceiptNumber(storage.getNextReceiptNumber());
  };

  const handleSaveToDatabase = () => {
    try {
      if (payment && payment.id) {
        // Update existing payment
        storage.updatePayment(payment.id, {
          receiptNumber,
          date,
          customerName,
          amount: Number(amount),
          paymentType,
          mode,
          bankName,
          transactionNumber,
          remarks,
          verified,
          companyProfileId: selectedCompanyId,
        });

        const updated = storage.getDatabase().payments.find((p) => p.id === payment.id);
        if (updated && onPaymentSaved) onPaymentSaved(updated);
        setSavedNotice(`Receipt ${receiptNumber} updated and saved to database!`);
      } else {
        // Create brand new payment record
        const newPay = storage.addPayment({
          projectId: projId || 'FCSS-2026-0001',
          customerName,
          paymentType,
          amount: Number(amount),
          date,
          mode,
          transactionNumber: transactionNumber || `TXN-${Date.now().toString().slice(-6)}`,
          bankName,
          receiptNumber,
          remarks,
          verified: true,
          companyProfileId: selectedCompanyId,
        });

        if (onPaymentSaved) onPaymentSaved(newPay);
        setSavedNotice(`New Receipt ${receiptNumber} created and saved to CRM database!`);
      }

      setTimeout(() => setSavedNotice(null), 3000);
    } catch (err: any) {
      alert(`Error saving receipt: ${err.message || 'Please try again'}`);
    }
  };

  const handleShareWhatsApp = () => {
    const text =
      `*OFFICIAL PAYMENT RECEIPT*\n\n` +
      `Issued By: *${activeCompany.name}*\n` +
      `GSTIN: *${activeCompany.gstNumber}*\n` +
      `Receipt No: *${receiptNumber}*\n` +
      `Date: ${formatDate(date)}\n\n` +
      `Customer: *${customerName}*\n` +
      `Consumer No: *${consumerNumber}*\n` +
      `Project Ref: *${projId}*\n\n` +
      `*Amount Received: ₹${amount.toLocaleString('en-IN')}*\n` +
      `In Words: ${numberToIndianWords(amount)}\n` +
      `Payment Stage: ${paymentType}\n` +
      `Mode: ${mode} (${bankName})\n` +
      `Txn Ref: ${transactionNumber}\n\n` +
      `Remarks: ${remarks}\n\n` +
      `Verified by: ${activeCompany.name}\n` +
      `Contact: ${activeCompany.ownerContact} | ${activeCompany.email}`;

    if (onOpenWhatsApp) {
      onOpenWhatsApp(mobile, customerName, projId);
    } else {
      window.open(generateWhatsAppLink(mobile, text), '_blank');
    }
  };

  const templatesList: { id: ReceiptTemplateType; label: string; desc: string; iconColor: string }[] = [
    {
      id: 'corporate_letterhead',
      label: 'Corporate Letterhead',
      desc: 'Modern branded header, QR seal & dual ledger layout',
      iconColor: 'text-amber-400',
    },
    {
      id: 'tax_solar_voucher',
      label: 'GST & Tax Solar Voucher',
      desc: 'Official HSN 9954 tax voucher with CGST/SGST split',
      iconColor: 'text-emerald-400',
    },
    {
      id: 'clean_minimalist',
      label: 'Clean Minimalist',
      desc: 'Ultra crisp layout with verified emerald badge',
      iconColor: 'text-sky-400',
    },
    {
      id: 'traditional_certificate',
      label: 'Bordered Official Cash Memo',
      desc: 'Classical double-border Sanad with legal stamp box',
      iconColor: 'text-violet-400',
    },
    {
      id: 'compact_slip',
      label: 'Compact Slip (POS / A5)',
      desc: 'Narrow streamlined format for quick customer receipt',
      iconColor: 'text-rose-400',
    },
    {
      id: 'solar_milestone',
      label: 'Solar Milestone Booking',
      desc: 'Plant capacity, subsidy note & milestone balance ledger',
      iconColor: 'text-amber-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:fixed-none">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[96vh] flex flex-col print:border-none print:shadow-none print:max-h-none print:bg-white print:w-full print:rounded-none">
        {/* Top Control Bar (Hidden during printing) */}
        <div className="bg-slate-950 border-b border-slate-800 p-4 shrink-0 print:hidden space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Official Payment Receipt Studio</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {receiptNumber}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Select among multiple receipt templates, edit parameters, and print with dynamic company letterhead
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  isEditMode
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditMode ? 'Hide Form Fields' : 'Edit Receipt Fields'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToDatabase}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors shadow-md shadow-emerald-950/40"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Database</span>
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900 rounded-lg text-xs font-bold"
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
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Success notice */}
          {savedNotice && (
            <div className="p-2.5 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{savedNotice}</span>
            </div>
          )}

          {/* Company Profile Switcher & Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-bold text-amber-400 uppercase text-[11px] tracking-wider flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Issued By Company:
              </span>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white font-bold rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-amber-400"
              >
                {companyProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.isDefault ? '★ (Default)' : ''}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setShowCompanyModal(true)}
                className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 font-semibold"
              >
                <Building2 className="w-3 h-3 text-amber-400" />
                <span>Manage / Create Company</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <span>GSTIN: <strong className="text-slate-200">{activeCompany.gstNumber}</strong></span>
              <span>•</span>
              <span>Tel: <strong className="text-slate-200">{activeCompany.ownerContact}</strong></span>
            </div>
          </div>

          {/* Template Switcher Tabs */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-400" /> Select Receipt Template Design:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {templatesList.map((tpl) => {
                const isSelected = selectedTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-400 text-white shadow-sm ring-1 ring-amber-400/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs truncate flex items-center justify-between">
                      <span className={isSelected ? 'text-amber-400' : 'text-slate-300'}>{tpl.label}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{tpl.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Edit Form Panel (Accordion/Collapsible) */}
        {isEditMode && (
          <div className="bg-slate-950 p-4 border-b border-slate-800 text-xs shrink-0 print:hidden overflow-y-auto max-h-60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 uppercase text-[11px]">
                Quick Field Editor (Auto-Updates Preview)
              </span>
              <button
                type="button"
                onClick={handleRegenerateReceiptNumber}
                className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Auto Next Receipt No</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 text-[10px] font-semibold mb-1">Receipt Number</label>
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-semibold mb-1">Receipt Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-semibold mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-emerald-400 font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-semibold mb-1">Payment Stage</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                >
                  <option value="Advance">Advance</option>
                  <option value="Material Dispatch">Material Dispatch</option>
                  <option value="Installation">Installation</option>
                  <option value="Final">Final Handover</option>
                  <option value="Jan Samarth Loan Credit">Jan Samarth Loan Credit</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-semibold mb-1">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-semibold mb-1">Consumer Number</label>
                <input
                  type="text"
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-semibold mb-1">Customer Mobile</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-semibold mb-1">Project Master ID</label>
                <input
                  type="text"
                  value={projId}
                  onChange={(e) => setProjId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-400 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-semibold mb-1">Payment Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as PaymentMode)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                >
                  <option value="UPI">UPI / QR Code</option>
                  <option value="NEFT/RTGS">NEFT / RTGS</option>
                  <option value="Cheque">Bank Cheque</option>
                  <option value="Cash">Cash Receipt</option>
                  <option value="Bank Transfer">Bank Transfer (IMPS)</option>
                  <option value="Loan Direct Credit">Loan Direct Credit</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-semibold mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-semibold mb-1">Transaction Ref / Cheque No</label>
                <input
                  type="text"
                  value={transactionNumber}
                  onChange={(e) => setTransactionNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] font-semibold mb-1">Plant Capacity (kW)</label>
                <input
                  type="number"
                  step="0.1"
                  value={capacityKw}
                  onChange={(e) => setCapacityKw(Number(e.target.value) || 3.3)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                />
              </div>

              <div className="col-span-2 sm:col-span-4">
                <label className="block text-slate-400 text-[10px] font-semibold mb-1">Customer Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                />
              </div>

              <div className="col-span-2 sm:col-span-4">
                <label className="block text-slate-400 text-[10px] font-semibold mb-1">Remarks & Purpose</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* MAIN PRINTABLE RECEIPT CANVAS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-850/80 print:p-0 print:bg-white print:overflow-visible">
          <div className="max-w-3xl mx-auto">
            {/* TEMPLATE 1: CORPORATE LETTERHEAD */}
            {selectedTemplate === 'corporate_letterhead' && (
              <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0 text-xs font-sans">
                {/* Header */}
                <div className="border-b-2 border-amber-500 pb-4 mb-6 flex items-start justify-between gap-4">
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
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">{activeCompany.name}</h2>
                      <div className="text-[11px] font-semibold text-amber-600 mt-0.5">
                        {activeCompany.tagline || 'PM Surya Ghar Registered Rooftop Solar EPC Vendor'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {activeCompany.address} • Tel: {activeCompany.ownerContact} • Email: {activeCompany.email}
                      </div>
                      <div className="text-[10px] font-mono text-slate-600 mt-0.5">
                        <strong>GSTIN:</strong> {activeCompany.gstNumber} {activeCompany.registrationNumber && `• Reg: ${activeCompany.registrationNumber}`}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg mb-1 shadow-sm">
                      Official Receipt
                    </span>
                    <div className="font-mono font-bold text-slate-900 text-sm">{receiptNumber}</div>
                    <div className="text-[10px] text-slate-500">Date: {formatDate(date)}</div>
                  </div>
                </div>

                {/* Received With Thanks Banner */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                  <div className="text-slate-600 leading-relaxed text-xs">
                    Received with thanks from <strong className="text-slate-900 text-sm">{customerName}</strong>
                    {consumerNumber && <span> (MSEDCL Consumer No: <strong className="font-mono">{consumerNumber}</strong>)</span>},
                    residing at <span>{address || 'Nagpur, Maharashtra'}</span>, the sum of:
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-200">
                    <div className="text-2xl font-black text-emerald-700 font-mono tracking-tight">
                      {formatCurrency(amount)}
                    </div>
                    <div className="text-xs italic text-slate-600 font-medium">
                      ({numberToIndianWords(amount)})
                    </div>
                  </div>
                </div>

                {/* Details Table */}
                <table className="w-full mb-6 border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <tbody>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <td className="p-2.5 font-bold text-slate-600 w-1/3">Project ID / Reference:</td>
                      <td className="p-2.5 font-mono font-bold text-slate-900">{projId || 'FCSS-2026-0001'}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-2.5 font-bold text-slate-600">Payment Stage / Category:</td>
                      <td className="p-2.5 text-slate-900 font-semibold">{paymentType}</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <td className="p-2.5 font-bold text-slate-600">Payment Instrument & Mode:</td>
                      <td className="p-2.5 text-slate-900">{mode} {bankName ? `(${bankName})` : ''}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-2.5 font-bold text-slate-600">Transaction ID / UTR / Cheque:</td>
                      <td className="p-2.5 font-mono text-slate-900">{transactionNumber}</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <td className="p-2.5 font-bold text-slate-600">Solar Plant Capacity:</td>
                      <td className="p-2.5 text-slate-900">{capacityKw} kW Rooftop Solar PV System</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-600">Purpose / Remarks:</td>
                      <td className="p-2.5 text-slate-700">{remarks || 'Advance booking credit towards turnkey solar installation.'}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Company Bank & Signatory Footer */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 mt-6">
                  <div className="text-[10px] text-slate-500 space-y-1">
                    <div className="font-bold text-slate-700 uppercase tracking-wider">Company Bank Account for NEFT/RTGS:</div>
                    <div>Bank: <strong>{activeCompany.bankName || 'State Bank of India'}</strong></div>
                    {activeCompany.bankAccountNumber && <div>A/C: <strong className="font-mono">{activeCompany.bankAccountNumber}</strong></div>}
                    {activeCompany.bankIfsc && <div>IFSC: <strong className="font-mono">{activeCompany.bankIfsc}</strong></div>}
                    {activeCompany.upiId && <div>UPI ID: <strong className="font-mono text-emerald-700">{activeCompany.upiId}</strong></div>}
                    <div className="text-slate-400 mt-2">* Subject to realization of cheque / online clearance.</div>
                  </div>

                  <div className="text-right flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-slate-900">For {activeCompany.name}</div>
                      <div className="text-[10px] text-slate-500">Authorized Signatory & Official Seal</div>
                    </div>
                    <div className="mt-8 border-t border-dashed border-slate-300 pt-1 text-[10px] text-slate-500">
                      {activeCompany.ownerName || 'Director / Proprietor'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 2: TAX & GST SOLAR VOUCHER */}
            {selectedTemplate === 'tax_solar_voucher' && (
              <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-2xl border-2 border-slate-800 print:shadow-none print:border-2 print:border-black print:p-4 text-xs font-serif">
                <div className="text-center border-b-2 border-slate-800 pb-3 mb-4">
                  <div className="text-[10px] font-sans font-bold tracking-widest uppercase text-slate-500">
                    GOVERNMENT OF INDIA • PM SURYA GHAR MUFT BIJLI YOJANA
                  </div>
                  <h2 className="text-2xl font-black font-sans uppercase tracking-tight text-slate-900 mt-0.5">
                    {activeCompany.name}
                  </h2>
                  <div className="text-[11px] font-sans text-slate-600 mt-0.5">{activeCompany.address}</div>
                  <div className="text-[11px] font-mono text-slate-800 font-bold mt-1">
                    GSTIN: {activeCompany.gstNumber} | PAN: {activeCompany.panNumber || 'AAAAA0000A'}
                  </div>
                  <div className="mt-2 inline-block px-4 py-1 bg-slate-900 text-white font-sans font-bold text-xs uppercase tracking-wider">
                    PAYMENT RECEIPT VOUCHER (HSN/SAC: 9954)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border border-slate-300 p-3 mb-4 text-xs font-sans">
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Billed / Received From:</div>
                    <div className="font-bold text-sm text-slate-900 mt-0.5">{customerName}</div>
                    <div className="text-slate-600 text-[11px]">{address}</div>
                    <div className="text-slate-600 text-[11px]">Consumer No: <strong className="font-mono text-slate-900">{consumerNumber}</strong></div>
                    <div className="text-slate-600 text-[11px]">Mobile: {mobile}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Voucher Particulars:</div>
                    <div className="font-mono font-bold text-sm text-slate-900 mt-0.5">{receiptNumber}</div>
                    <div className="text-slate-600 text-[11px]">Voucher Date: {formatDate(date)}</div>
                    <div className="text-slate-600 text-[11px]">Project ID: <strong className="font-mono">{projId}</strong></div>
                    <div className="text-slate-600 text-[11px]">Solar Plant: {capacityKw} kWp Grid-Tie</div>
                  </div>
                </div>

                {/* Items grid */}
                <table className="w-full border-collapse border border-slate-400 mb-4 font-sans text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold">
                      <th className="border border-slate-300 p-2 text-left">Sr.</th>
                      <th className="border border-slate-300 p-2 text-left">Description of Service & Milestone</th>
                      <th className="border border-slate-300 p-2 text-center">HSN/SAC</th>
                      <th className="border border-slate-300 p-2 text-right">Taxable Value</th>
                      <th className="border border-slate-300 p-2 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 text-center">1</td>
                      <td className="border border-slate-300 p-2">
                        <div className="font-bold">{paymentType} Payment for Solar Rooftop EPC Installation</div>
                        <div className="text-[10px] text-slate-500">{remarks}</div>
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-mono">9954</td>
                      <td className="border border-slate-300 p-2 text-right font-mono font-semibold">
                        {formatCurrency(Math.round(amount / 1.12))}
                      </td>
                      <td className="border border-slate-300 p-2 text-right font-mono font-bold">
                        {formatCurrency(amount)}
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={4} className="border border-slate-300 p-2 text-right">
                        Net Amount Received (Inc. 12% GST):
                      </td>
                      <td className="border border-slate-300 p-2 text-right font-mono text-sm text-emerald-800">
                        {formatCurrency(amount)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="border border-slate-300 p-2.5 bg-slate-50 mb-4 font-sans text-xs">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Amount in Words:</div>
                  <div className="font-bold text-slate-900 mt-0.5">{numberToIndianWords(amount)}</div>
                  <div className="text-[10px] text-slate-600 mt-1 font-mono">
                    Payment Mode: {mode} • Instrument/Txn Ref: {transactionNumber} • Bank: {bankName}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-4 font-sans text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Verification Note:</div>
                    <div className="text-[10px] text-slate-600 mt-1">
                      Received amount confirmed in company ledger. Subsidy CFA will be credited by MNRE directly to consumer bank account post synchronization.
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">For {activeCompany.name}</div>
                    <div className="h-10"></div>
                    <div className="text-[10px] text-slate-500 border-t border-slate-300 pt-1">
                      Authorized Signatory & Stamp
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 3: CLEAN MINIMALIST */}
            {selectedTemplate === 'clean_minimalist' && (
              <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0 text-xs font-sans">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    {activeCompany.logoUrl ? (
                      <img src={activeCompany.logoUrl} alt={activeCompany.name} className="w-12 h-12 object-contain" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        ☀️
                      </div>
                    )}
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{activeCompany.name}</h2>
                      <div className="text-[11px] text-slate-500 font-mono">GSTIN: {activeCompany.gstNumber}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED RECEIPT
                    </span>
                    <div className="font-mono font-bold text-slate-900 text-xs mt-1">{receiptNumber}</div>
                    <div className="text-[10px] text-slate-400">{formatDate(date)}</div>
                  </div>
                </div>

                {/* Amount Hero */}
                <div className="my-8 text-center bg-gradient-to-b from-slate-50 to-white p-6 rounded-2xl border border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Amount Paid</div>
                  <div className="text-4xl font-black text-slate-900 font-mono my-1 tracking-tight">
                    {formatCurrency(amount)}
                  </div>
                  <div className="text-xs text-slate-500 italic">{numberToIndianWords(amount)}</div>
                </div>

                {/* 2-column info */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6 text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Consumer</div>
                    <div className="font-bold text-slate-900 mt-0.5">{customerName}</div>
                    <div className="text-slate-500 text-[11px]">{consumerNumber && `No: ${consumerNumber}`}</div>
                    <div className="text-slate-500 text-[11px]">{address}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Transaction Details</div>
                    <div className="font-bold text-slate-900 mt-0.5">{mode} • {bankName}</div>
                    <div className="font-mono text-slate-500 text-[11px]">{transactionNumber}</div>
                    <div className="text-slate-500 text-[11px]">Type: {paymentType} ({capacityKw} kW)</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 leading-relaxed mb-6">
                  {remarks || 'Thank you for your business. This receipt is a confirmation of transaction in the solar ERP database.'}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 text-[10px] text-slate-400">
                  <div>Contact: {activeCompany.ownerContact} • {activeCompany.email}</div>
                  <div>Authorized: {activeCompany.name}</div>
                </div>
              </div>
            )}

            {/* TEMPLATE 4: TRADITIONAL BORDERED OFFICIAL CASH MEMO */}
            {selectedTemplate === 'traditional_certificate' && (
              <div className="bg-amber-50/20 text-slate-900 rounded-2xl p-8 shadow-2xl border-4 border-double border-amber-800 print:shadow-none print:border-4 print:border-black print:p-4 text-xs font-serif">
                <div className="text-center border-b border-amber-900/40 pb-4 mb-4">
                  <div className="text-[11px] font-sans uppercase tracking-widest text-amber-900 font-bold">
                    OFFICIAL RECEIPT & MONEY ACKNOWLEDGEMENT
                  </div>
                  <h1 className="text-2xl font-black uppercase text-amber-950 tracking-tight mt-1">
                    {activeCompany.name}
                  </h1>
                  <div className="text-[11px] text-slate-700 italic mt-0.5">{activeCompany.tagline}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">
                    Office: {activeCompany.address} • Contact: {activeCompany.ownerContact}
                  </div>
                  <div className="text-[10px] font-mono text-slate-800 font-bold mt-1">
                    GSTIN: {activeCompany.gstNumber}
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs mb-4 px-2">
                  <div>
                    Book / Serial No: <strong className="font-mono text-amber-950 font-bold">{receiptNumber}</strong>
                  </div>
                  <div>
                    Date: <strong className="font-sans">{formatDate(date)}</strong>
                  </div>
                </div>

                <div className="p-4 bg-white/70 border border-amber-900/20 rounded-xl leading-loose text-xs space-y-2 mb-6">
                  <p>
                    Received with thanks from Shri / Smt. <span className="font-bold underline decoration-dotted text-slate-950">{customerName}</span>,
                    residing at <span className="underline decoration-dotted">{address || 'Nagpur'}</span>,
                    Electricity Consumer Number <span className="font-mono font-bold underline decoration-dotted">{consumerNumber || 'N/A'}</span>.
                  </p>
                  <p>
                    The sum of Rupees <span className="font-bold underline text-amber-950">{numberToIndianWords(amount)}</span>,
                    amounting to <span className="font-mono font-black text-sm text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">{formatCurrency(amount)}</span>.
                  </p>
                  <p>
                    By <span className="font-bold">{mode}</span>, Reference / Cheque No: <span className="font-mono font-bold">{transactionNumber}</span>,
                    drawn on Bank: <span className="font-semibold">{bankName}</span>.
                  </p>
                  <p>
                    On account of / Payment Stage: <span className="font-bold">{paymentType}</span> towards {capacityKw} kW Rooftop Solar PV Installation under PM Surya Ghar Yojana.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 items-end pt-4">
                  <div className="border-2 border-dashed border-amber-800/40 w-32 h-20 rounded-lg flex items-center justify-center text-[10px] text-amber-900/60 uppercase font-sans text-center p-2">
                    Official Revenue Stamp Seal
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-950 text-sm">For {activeCompany.name}</div>
                    <div className="h-10"></div>
                    <div className="text-[10px] text-slate-600 border-t border-slate-400 pt-1">
                      Accountant / Authorized Signature
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 5: COMPACT SLIP (POS / A5) */}
            {selectedTemplate === 'compact_slip' && (
              <div className="bg-white text-slate-900 max-w-md mx-auto rounded-xl p-6 shadow-2xl border-2 border-dashed border-slate-300 print:shadow-none print:border-none print:p-2 text-xs font-mono">
                <div className="text-center pb-3 border-b-2 border-dashed border-slate-300 mb-3">
                  <div className="font-black text-base tracking-wider uppercase">{activeCompany.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{activeCompany.address}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">GST: {activeCompany.gstNumber}</div>
                  <div className="text-[10px] text-slate-600">TEL: {activeCompany.ownerContact}</div>
                  <div className="mt-2 text-xs font-bold bg-slate-100 py-0.5">PAYMENT CONFIRMATION SLIP</div>
                </div>

                <div className="space-y-1 text-[11px] mb-3">
                  <div className="flex justify-between">
                    <span>Receipt #:</span>
                    <span className="font-bold">{receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{formatDate(date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-bold truncate max-w-[180px]">{customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consumer No:</span>
                    <span>{consumerNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Project:</span>
                    <span>{projId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stage:</span>
                    <span>{paymentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mode:</span>
                    <span>{mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Txn Ref:</span>
                    <span className="truncate max-w-[160px]">{transactionNumber}</span>
                  </div>
                </div>

                <div className="border-t-2 border-b-2 border-dashed border-slate-300 py-2.5 my-3 text-center">
                  <div className="text-[10px] uppercase text-slate-500">Amount Received</div>
                  <div className="text-2xl font-black text-emerald-800">{formatCurrency(amount)}</div>
                  <div className="text-[10px] italic text-slate-600 mt-0.5">{numberToIndianWords(amount)}</div>
                </div>

                <div className="text-center text-[10px] text-slate-500 space-y-1">
                  <div>* Computer generated digital payment receipt *</div>
                  <div>Thank you for choosing Frontier Solar!</div>
                </div>
              </div>
            )}

            {/* TEMPLATE 6: SOLAR MILESTONE & BOOKING CERTIFICATE */}
            {selectedTemplate === 'solar_milestone' && (
              <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0 text-xs font-sans">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-5 rounded-xl mb-6 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest bg-slate-950 text-amber-400 px-2 py-0.5 rounded">
                      SOLAR ROOFTOP MILESTONE RECEIPT
                    </span>
                    <h2 className="text-xl font-black mt-1.5">{activeCompany.name}</h2>
                    <div className="text-xs font-semibold text-slate-900">{activeCompany.tagline}</div>
                    <div className="text-[10px] text-slate-850 mt-1 font-mono">
                      GSTIN: {activeCompany.gstNumber} • Mobile: {activeCompany.ownerContact}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-900">Receipt Ref:</div>
                    <div className="font-mono font-black text-base text-slate-950">{receiptNumber}</div>
                    <div className="text-xs text-slate-900 mt-0.5">{formatDate(date)}</div>
                  </div>
                </div>

                {/* Consumer & System Info */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Customer Profile</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">{customerName}</div>
                    <div className="text-slate-600 text-xs">MSEDCL Consumer No: <strong className="font-mono">{consumerNumber}</strong></div>
                    <div className="text-slate-600 text-xs">Premise: {address}</div>
                    <div className="text-slate-600 text-xs">Mobile: {mobile}</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Turnkey Plant Sizing</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">{capacityKw} kW Solar PV System</div>
                    <div className="text-slate-600 text-xs">Modules: DCR Mono PERC (ALMM List-I)</div>
                    <div className="text-slate-600 text-xs">Inverter: Grid-Tied with Wi-Fi Monitoring</div>
                    <div className="text-slate-600 text-xs font-mono">Project ID: <strong>{projId}</strong></div>
                  </div>
                </div>

                {/* Milestone breakdown card */}
                <div className="border border-amber-200 bg-amber-50/40 p-4 rounded-xl mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-amber-900 text-xs uppercase flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-600" /> Milestone Cleared: {paymentType}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      Paid & Verified
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-amber-200/60 pt-2">
                    <div>
                      <div className="text-2xl font-black text-slate-900 font-mono">
                        {formatCurrency(amount)}
                      </div>
                      <div className="text-[11px] text-slate-600 italic">({numberToIndianWords(amount)})</div>
                    </div>

                    <div className="text-right text-[11px] text-slate-600">
                      <div>Paid via: <strong className="text-slate-900">{mode}</strong> ({bankName})</div>
                      <div className="font-mono">Ref: {transactionNumber}</div>
                    </div>
                  </div>
                </div>

                {/* Subsidy Note */}
                <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl mb-6 text-[11px] text-sky-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600" /> PM Surya Ghar Central Financial Assistance (Subsidy) Notice:
                  </div>
                  <div>
                    Direct Benefit Transfer (DBT) subsidy of up to ₹78,000 is directly credited by MNRE into consumer's bank account upon joint inspection and net-meter commissioning.
                  </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-center">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Customer Signature / Acknowledgement</div>
                    <div className="mt-8 text-xs font-bold text-slate-900">{customerName}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">For {activeCompany.name}</div>
                    <div className="mt-8 text-xs font-bold text-slate-900">
                      {activeCompany.ownerName || 'Authorized Signatory'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
