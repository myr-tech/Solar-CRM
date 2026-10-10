import React, { useState } from 'react';
import {
  FileText,
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
} from 'lucide-react';
import { storage } from '../../services/storage';
import { Quotation, CompanyProfile } from '../../types';
import { formatCurrency, formatDate, generateWhatsAppLink } from '../../utils/formatters';

interface AdvanceReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotation: Quotation;
  companyProfile: CompanyProfile;
  onOpenWhatsApp?: (phone: string, name: string, projectId?: string) => void;
}

export const AdvanceReceiptModal: React.FC<AdvanceReceiptModalProps> = ({
  isOpen,
  onClose,
  quotation,
  companyProfile,
  onOpenWhatsApp,
}) => {
  const db = storage.getDatabase();
  const profiles = storage.getCompanyProfiles();

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    companyProfile?.id || quotation.companyProfileId || profiles[0]?.id || 'COMP-001'
  );

  const activeCompany =
    profiles.find((p) => p.id === selectedCompanyId) || companyProfile || profiles[0];

  const defaultReceiptNo = `ADV-${(quotation.quotationNumber || 'QT').replace(/[^a-zA-Z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;
  const [receiptNumber, setReceiptNumber] = useState(defaultReceiptNo);
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().slice(0, 10));
  const [advanceAmount, setAdvanceAmount] = useState<number>(
    quotation.suggestedAdvanceAmount || Math.round((quotation.wholeSystemPrice || quotation.totalSystemPrice || 195000) * 0.20)
  );
  const [paymentMode, setPaymentMode] = useState<string>('UPI / QR Code');
  const [transactionRef, setTransactionRef] = useState<string>(`UPI-NAGPUR-${Math.floor(100000 + Math.random() * 900000)}`);
  const [bankName, setBankName] = useState<string>(activeCompany.bankName || 'State Bank of India');
  const [remarks, setRemarks] = useState<string>(
    `Advance booking confirmation for PM Surya Ghar ${quotation.systemCapacityKw || 3.3} kW Rooftop Solar turnkey system at ${quotation.address || 'Nagpur'}.`
  );
  const [isSavedToLedger, setIsSavedToLedger] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const wholePrice = quotation.wholeSystemPrice || quotation.totalSystemPrice || 195000;
  const balanceRemaining = Math.max(0, wholePrice - advanceAmount);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToAccounts = () => {
    try {
      storage.addPayment({
        projectId: quotation.projectId || 'FCSS-2026-0001',
        customerName: quotation.customerName,
        paymentType: 'Advance',
        amount: Number(advanceAmount),
        date: receiptDate,
        mode: (paymentMode.includes('UPI') ? 'UPI' : paymentMode.includes('Cheque') ? 'Cheque' : 'Bank Transfer') as any,
        transactionNumber: transactionRef,
        bankName: bankName || 'State Bank of India',
        receiptNumber: receiptNumber,
        remarks,
        verified: true,
        companyProfileId: selectedCompanyId,
        quotationId: quotation.id,
      });

      setIsSavedToLedger(true);
      setSuccessNotice(`Payment slip saved to CRM Accounts ledger! Ref: ${receiptNumber}`);
      setTimeout(() => setSuccessNotice(null), 3000);
    } catch (e: any) {
      alert(e.message || 'Error saving payment');
    }
  };

  const handleShareWhatsApp = () => {
    const text = `*OFFICIAL ADVANCE PAYMENT RECEIPT*\n\n` +
      `Issued By: *${activeCompany.name}*\n` +
      `GSTIN: *${activeCompany.gstNumber}*\n` +
      `Receipt No: *${receiptNumber}*\n` +
      `Date: ${formatDate(receiptDate)}\n\n` +
      `Received from: *${quotation.customerName}*\n` +
      `Consumer No: *${quotation.consumerNumber}*\n` +
      `Solar Plant Capacity: *${quotation.systemCapacityKw} kW*\n\n` +
      `*Amount Received: ₹${advanceAmount.toLocaleString('en-IN')}*\n` +
      `Payment Mode: ${paymentMode}\n` +
      `Transaction Ref: ${transactionRef}\n` +
      `Total System Price: ₹${wholePrice.toLocaleString('en-IN')}\n` +
      `Balance Remaining: ₹${balanceRemaining.toLocaleString('en-IN')}\n\n` +
      `PM Surya Ghar central CFA subsidy of ₹${(quotation.pmSuryaGharSubsidyEstimate || 78000).toLocaleString('en-IN')} will be credited directly to consumer bank account post commissioning.\n\n` +
      `Thank you for choosing ${activeCompany.name}!`;

    const encoded = encodeURIComponent(text);
    const link = `https://wa.me/91${quotation.mobile}?text=${encoded}`;
    window.open(link, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl p-5 sm:p-6 relative max-h-[94vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Customer Advance Payment Slip</h3>
              <p className="text-xs text-slate-400">
                Generate, print & share official advance booking receipt under selected company letterhead
              </p>
            </div>
          </div>

          {/* Company Profile Dropdown Selector */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Company:
            </label>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="bg-slate-800 border border-amber-500/50 text-white font-bold text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {successNotice && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* PRINTABLE SLIP PREVIEW CONTAINER */}
        <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-300 space-y-6 print:m-0 print:border-none print:shadow-none">
          {/* Slip Header with Company Profile Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-amber-500 pb-4">
            <div className="flex items-start gap-4">
              {activeCompany.logoUrl ? (
                <img
                  src={activeCompany.logoUrl}
                  alt={activeCompany.name}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <div className="w-14 h-14 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center font-black text-xl shadow">
                  ⚡
                </div>
              )}
              <div>
                <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight">
                  {activeCompany.name}
                </h2>
                <div className="text-[11px] text-amber-700 font-bold tracking-wide">
                  {activeCompany.tagline || 'PM Surya Ghar Registered Solar EPC Vendor'}
                </div>
                <div className="text-[11px] text-slate-600 mt-1 max-w-md">
                  {activeCompany.address} • Phone: {activeCompany.ownerContact} • Email: {activeCompany.email}
                </div>
                <div className="text-[11px] text-slate-800 font-mono font-bold mt-0.5">
                  GSTIN: {activeCompany.gstNumber} • Reg: {activeCompany.registrationNumber || 'MSEDCL/PV/VENDOR'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-sm">
                ADVANCE RECEIPT SLIP
              </span>
              <div className="text-[11px] font-mono text-slate-600 mt-2 font-bold">
                Receipt No: <span className="text-slate-950">{receiptNumber}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-600">
                Date: <span className="text-slate-950">{formatDate(receiptDate)}</span>
              </div>
            </div>
          </div>

          {/* Consumer & Project Summary */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Received With Thanks From:
              </div>
              <div className="text-sm font-black text-slate-900">{quotation.customerName}</div>
              <div className="text-slate-600 mt-0.5">{quotation.address}</div>
              <div className="font-mono text-slate-700 mt-1 font-semibold">
                Phone: {quotation.mobile}
              </div>
              <div className="font-mono text-amber-800 font-bold">
                MSEDCL Consumer No: {quotation.consumerNumber}
              </div>
            </div>

            <div className="text-right sm:text-left sm:pl-6 border-l border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Solar Plant Details:
              </div>
              <div className="font-bold text-slate-900">
                PM Surya Ghar Rooftop Solar Turnkey Installation
              </div>
              <div className="text-slate-600 mt-0.5">
                Plant Capacity: <span className="font-bold text-slate-900">{quotation.systemCapacityKw} kWp DC</span>
              </div>
              <div className="text-slate-600">
                Quotation Ref: <span className="font-mono font-bold text-slate-900">{quotation.quotationNumber}</span>
              </div>
              <div className="text-slate-600 font-bold mt-1 text-emerald-800">
                Central PM Surya Ghar CFA Subsidy: ₹{(quotation.pmSuryaGharSubsidyEstimate || 78000).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Payment Financials Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Payment Mode & Reference</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    Booking Advance for {quotation.systemCapacityKw} kW Turnkey Solar System
                    <div className="text-[10px] text-slate-500 font-normal">
                      Includes supply of Waaree/Adani DCR modules, On-grid inverter & HDG structure
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    <div>{paymentMode}</div>
                    <div className="text-[11px] text-slate-500">Ref: {transactionRef}</div>
                    <div className="text-[10px] text-slate-500">Bank: {bankName}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-black text-sm text-emerald-800">
                    ₹{advanceAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Totals Calculation Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
            <div>
              <div className="text-[11px] font-bold text-emerald-900 uppercase">
                Payment Status Summary:
              </div>
              <div className="text-slate-700 mt-1">
                Total Whole System Price: <span className="font-bold text-slate-900 font-mono">₹{wholePrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-slate-700">
                Remaining Balance to Pay: <span className="font-bold text-rose-800 font-mono">₹{balanceRemaining.toLocaleString('en-IN')}</span> (Due against material dispatch & installation)
              </div>
            </div>

            <div className="text-right bg-white p-3 rounded-lg border border-emerald-300 shadow-sm shrink-0">
              <div className="text-[10px] uppercase font-bold text-slate-500">Total Advance Received</div>
              <div className="text-xl font-black text-emerald-700 font-mono">
                ₹{advanceAmount.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold italic">
                (Subject to realization of Cheque/Online Transfer)
              </div>
            </div>
          </div>

          {/* Terms & Signatures */}
          <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
            <p>1. This advance payment is received towards execution of turnkey rooftop solar installation under PM Surya Ghar Muft Bijli Yojana.</p>
            <p>2. Subsidy CFA will be directly credited to the consumer's Aadhaar-linked bank account by MNRE / National Portal post net-meter commissioning.</p>
          </div>

          <div className="flex items-end justify-between pt-6 border-t border-slate-300">
            <div className="text-center">
              <div className="w-36 border-b border-slate-400 mb-1" />
              <div className="text-[11px] font-semibold text-slate-700">Customer Signature</div>
            </div>

            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-500 mb-8">
                For {activeCompany.name}
              </div>
              <div className="w-44 border-b border-slate-400 mb-1" />
              <div className="text-[11px] font-bold text-slate-900">Authorized Signatory & Seal</div>
            </div>
          </div>
        </div>

        {/* EDITABLE CONTROLS SECTION */}
        <div className="mt-5 p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
            <span>Edit Slip Details (Before Printing or Sharing):</span>
            <span className="text-[10px] text-slate-400">Updates live in preview above</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Receipt Number</label>
              <input
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Receipt Date</label>
              <input
                type="date"
                value={receiptDate}
                onChange={(e) => setReceiptDate(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Advance Amount Received (₹) *</label>
              <input
                type="number"
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(Number(e.target.value) || 0)}
                className="w-full bg-slate-850 border border-emerald-500/50 rounded-lg px-2.5 py-1.5 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="UPI / QR Code">UPI / QR Code</option>
                <option value="NEFT / RTGS Transfer">NEFT / RTGS Transfer</option>
                <option value="Cheque Payment">Cheque Payment</option>
                <option value="Cash Payment">Cash Payment</option>
                <option value="Demand Draft (DD)">Demand Draft (DD)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Transaction Ref / Cheque No.</label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="UPI-12345678 or Cheque #004521"
                className="w-full bg-slate-850 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Bank Name & Branch</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="State Bank of India (Hingna Branch)"
                className="w-full bg-slate-850 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold rounded-xl border border-slate-700 text-xs transition-colors"
          >
            Close
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSaveToAccounts}
              disabled={isSavedToLedger}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                isSavedToLedger
                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                  : 'bg-slate-800 hover:bg-slate-750 text-amber-300 border-amber-500/40'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSavedToLedger ? 'Saved in Ledger' : 'Save to Accounts'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors shadow"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
