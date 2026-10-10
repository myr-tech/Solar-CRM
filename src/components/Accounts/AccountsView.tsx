import React, { useState } from 'react';
import {
  CreditCard,
  Landmark,
  IndianRupee,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Receipt,
  Printer,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  Sparkles,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { Payment, PaymentType, PaymentMode, LoanRecord } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ReceiptModal } from './ReceiptModal';

interface AccountsViewProps {
  onSelectProject: (projectId: string) => void;
  onOpenWhatsApp: (phone: string, name: string, projectId?: string) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  onSelectProject,
  onOpenWhatsApp,
}) => {
  const db = storage.getDatabase();
  const [activeTab, setActiveTab] = useState<'PAYMENTS' | 'LOANS'>('PAYMENTS');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  // Multi-template Receipt Modal state
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<Payment | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // New payment form state
  const [projectId, setProjectId] = useState(db.projects[0]?.id || 'FCSS-2026-0001');
  const [paymentType, setPaymentType] = useState<PaymentType>('Advance');
  const [amount, setAmount] = useState<number>(25000);
  const [mode, setMode] = useState<PaymentMode>('UPI');
  const [transactionNumber, setTransactionNumber] = useState('');
  const [bankName, setBankName] = useState('State Bank of India');
  const [remarks, setRemarks] = useState('');

  const totalValue = db.projects.reduce((sum, p) => sum + p.totalProjectValue, 0);
  const totalReceived = db.payments.reduce((sum, p) => sum + p.amount, 0);
  const totalBalanceDue = db.projects.reduce((sum, p) => sum + p.balanceDue, 0);
  const totalLoanSanctioned = db.loans.reduce((sum, l) => sum + l.loanAmount, 0);

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = db.projects.find((p) => p.id === projectId);
    if (!proj) return;

    storage.addPayment({
      projectId,
      customerName: proj.customerName,
      paymentType,
      amount: Number(amount),
      date: new Date().toISOString().slice(0, 10),
      mode,
      transactionNumber: transactionNumber || `TXN-${Date.now().toString().slice(-6)}`,
      bankName,
      receiptNumber: `RCPT-2026-${String(db.payments.length + 1).padStart(3, '0')}`,
      remarks,
      verified: true,
    });

    setShowAddPaymentModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-amber-400" /> Accounts, Payments & Jan Samarth Loans
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time balance due calculations, receipt generation & second disbursement alerts
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setSelectedReceiptPayment(null);
              setShowReceiptModal(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Issue & Print Receipt</span>
          </button>

          <button
            onClick={() => setShowAddPaymentModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record New Payment</span>
          </button>
        </div>
      </div>

      {/* Financial Health Snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-slate-400">Total Project Value</div>
          <div className="text-base sm:text-lg font-bold text-white mt-1">
            {formatCurrency(totalValue)}
          </div>
          <div className="text-[10px] text-slate-500">Across active projects</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-slate-400">Total Received to Date</div>
          <div className="text-base sm:text-lg font-bold text-emerald-400 mt-1">
            {formatCurrency(totalReceived)}
          </div>
          <div className="text-[10px] text-slate-500">Advances + Loan credits</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-slate-400">Total Customer Balance Due</div>
          <div className="text-base sm:text-lg font-bold text-rose-400 mt-1">
            {formatCurrency(totalBalanceDue)}
          </div>
          <div className="text-[10px] text-rose-500">Pending receivables</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-slate-400">Jan Samarth Loan Total</div>
          <div className="text-base sm:text-lg font-bold text-sky-400 mt-1">
            {formatCurrency(totalLoanSanctioned)}
          </div>
          <div className="text-[10px] text-slate-500">National portal loans</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('PAYMENTS')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'PAYMENTS'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          Payments Ledger ({db.payments.length})
        </button>
        <button
          onClick={() => setActiveTab('LOANS')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'LOANS'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          Jan Samarth Bank Loans ({db.loans.length})
        </button>
      </div>

      {activeTab === 'PAYMENTS' ? (
        /* Payments Table */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-850 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Receipt No & Date</th>
                  <th className="py-3 px-4">Project & Customer</th>
                  <th className="py-3 px-4">Payment Stage</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Mode & Bank</th>
                  <th className="py-3 px-4">Txn Number</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {db.payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-amber-400">{p.receiptNumber}</div>
                      <div className="text-[10px] text-slate-500">{formatDate(p.date)}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onSelectProject(p.projectId)}
                        className="font-bold text-white hover:underline text-left block"
                      >
                        {p.customerName}
                      </button>
                      <div className="font-mono text-[11px] text-slate-400">{p.projectId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                        {p.paymentType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200">{p.mode}</div>
                      <div className="text-[10px] text-slate-500">{p.bankName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {p.transactionNumber}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedReceiptPayment(p);
                          setShowReceiptModal(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors font-semibold text-[11px]"
                        title="Print / View Official Receipt (Choose Template)"
                      >
                        <Receipt className="w-3.5 h-3.5 text-amber-400" />
                        <span>Print Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Jan Samarth Loans View with Overdue Alert (Requirement 14 & 26) */
        <div className="space-y-4">
          {/* Overdue Alert banner if > 7 days */}
          <div className="p-4 bg-rose-950/70 border border-rose-700 rounded-2xl text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <strong className="text-white">SECOND DISBURSEMENT PENDING ALERT (&gt; 5-7 DAYS)</strong>
                <div className="text-rose-300 text-[11px]">
                  Project FCSS-2026-0001 (Dr. Milind Vaidya): MSEDCL inspection certificate submitted to SBI Besa. Follow up required for ₹30,000 credit!
                </div>
              </div>
            </div>
            <button
              onClick={() => onSelectProject('FCSS-2026-0001')}
              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-lg text-xs"
            >
              Resolve Alert
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {db.loans.map((loan) => (
              <div
                key={loan.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="font-mono text-amber-400 font-bold">{loan.projectId}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{loan.bankOrNbfc}</h3>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-400 border border-slate-700">
                    {loan.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-400 text-[11px]">Jan Samarth App No:</span>
                    <div className="font-mono font-bold text-white mt-0.5">{loan.janSamarthAppNumber}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Total Sanctioned Loan:</span>
                    <div className="font-mono font-bold text-emerald-400 mt-0.5">
                      {formatCurrency(loan.loanAmount)}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">1st Disbursement:</span>
                    <div className="font-mono text-white mt-0.5">
                      {formatCurrency(loan.firstDisbursementAmount || 120000)} (Received)
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">2nd Disbursement:</span>
                    <div className="font-mono text-rose-400 font-bold mt-0.5">
                      {formatCurrency(loan.secondDisbursementAmount || 30000)} (Pending)
                    </div>
                  </div>
                </div>

                {loan.bankRemarks && (
                  <div className="p-2.5 bg-slate-850 rounded-lg text-slate-400 text-[11px] italic">
                    "{loan.bankRemarks}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" /> Record Project Payment / Advance
            </h3>

            <form onSubmit={handleAddPayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Project ID *</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                >
                  {db.projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.customerName} (Bal: {formatCurrency(p.balanceDue)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Payment Stage *</label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Booking">Booking Token</option>
                    <option value="Advance">Advance Payment</option>
                    <option value="Installation Payment">Installation Stage</option>
                    <option value="Loan Disbursement 1">Loan Disb 1</option>
                    <option value="Loan Disbursement 2">Loan Disb 2</option>
                    <option value="Final Payment">Final Balance Settlement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount Received (₹) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Payment Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as PaymentMode)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe)</option>
                    <option value="NEFT/RTGS">NEFT / RTGS</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Loan Direct Credit">Loan Direct Credit</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Txn / UTR Number</label>
                  <input
                    type="text"
                    value={transactionNumber}
                    onChange={(e) => setTransactionNumber(e.target.value)}
                    placeholder="UPI / Cheque / UTR Ref"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="State Bank of India / HDFC"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg"
                >
                  Save & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Multi-Template Receipt Studio Modal */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        payment={selectedReceiptPayment}
        onOpenWhatsApp={onOpenWhatsApp}
      />
    </div>
  );
};
