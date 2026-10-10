import React, { useState } from 'react';
import {
  ReceiptText,
  Printer,
  Download,
  CheckCircle2,
  Share2,
  FileText,
  IndianRupee,
  ShieldCheck,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { InvoiceRecord } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface InvoiceViewProps {
  onSelectProject: (projectId: string) => void;
  onOpenWhatsApp: (phone: string, name: string, projectId?: string) => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({
  onSelectProject,
  onOpenWhatsApp,
}) => {
  const db = storage.getDatabase();
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord>(
    db.invoices[0] || createDefaultInvoice()
  );
  const [activeTab, setActiveTab] = useState<'LIST' | 'PRINT_INVOICE'>('LIST');

  function createDefaultInvoice(): InvoiceRecord {
    return {
      id: 'INV-2026-001',
      invoiceNumber: 'INV-FCSS-2026-0001',
      projectId: 'FCSS-2026-0001',
      invoiceDate: '2026-09-26',
      dueDate: '2026-10-15',
      customerName: 'Dr. Milind Vaidya',
      address: 'Plot 42, Sai Nagar, Besa, Nagpur',
      consumerNumber: '410019283741',
      systemCapacityKw: 3.3,
      panelDetails: '6 x Waaree 550W DCR Mono PERC Panels',
      inverterDetails: '1 x Polycab 3.3 kW Single Phase Grid Tie Inverter',
      baseAmount: 171353,
      gstAmount: 23647,
      discount: 0,
      totalInvoiceAmount: 195000,
      totalReceived: 145000,
      balanceDue: 50000,
      status: 'Partially Paid',
      terms: 'Warranty: 25 Years linear performance warranty on solar panels. 5 Years comprehensive system warranty by Frontier Complete Solar Solutions.',
    };
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <ReceiptText className="w-6 h-6 text-amber-400" /> GST Tax Invoices & Billing
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            MSEDCL & PM Surya Ghar compliant GST Tax Invoices with HSN Codes 8541 & 8443
          </p>
        </div>

        <button
          onClick={() => setActiveTab(activeTab === 'LIST' ? 'PRINT_INVOICE' : 'LIST')}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>{activeTab === 'LIST' ? 'View Printable Tax Invoice' : 'Back to Invoices List'}</span>
        </button>
      </div>

      {activeTab === 'LIST' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoices List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Generated Invoices ({db.invoices.length})
            </div>
            <div className="space-y-2.5">
              {db.invoices.map((inv) => {
                const isSelected = selectedInvoice?.id === inv.id;
                return (
                  <div
                    key={inv.id}
                    onClick={() => setSelectedInvoice(inv)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-slate-850 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {inv.invoiceNumber}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 border border-slate-700">
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white mt-1">{inv.customerName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                      <span>Total: {formatCurrency(inv.totalInvoiceAmount)}</span>
                      <span className="text-rose-400 font-mono font-semibold">
                        Bal: {formatCurrency(inv.balanceDue)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Invoice Summary Card */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            {selectedInvoice && (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="font-mono text-amber-400 font-bold text-sm">
                      {selectedInvoice.invoiceNumber}
                    </span>
                    <h2 className="text-lg font-black text-white mt-0.5">
                      {selectedInvoice.customerName}
                    </h2>
                    <div className="text-xs text-slate-400">
                      Project: {selectedInvoice.projectId} • Consumer No: {selectedInvoice.consumerNumber}
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full font-bold text-xs font-mono">
                    {selectedInvoice.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                    <div className="text-slate-400">Total Invoice Amount</div>
                    <div className="text-base font-bold text-white mt-1">
                      {formatCurrency(selectedInvoice.totalInvoiceAmount)}
                    </div>
                    <div className="text-[10px] text-slate-500">Incl. GST</div>
                  </div>

                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                    <div className="text-slate-400">Payments Received</div>
                    <div className="text-base font-bold text-emerald-400 mt-1">
                      {formatCurrency(selectedInvoice.totalReceived)}
                    </div>
                    <div className="text-[10px] text-slate-500">Advance + Loan</div>
                  </div>

                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                    <div className="text-slate-400">Balance Outstanding</div>
                    <div className="text-base font-bold text-rose-400 mt-1">
                      {formatCurrency(selectedInvoice.balanceDue)}
                    </div>
                    <div className="text-[10px] text-rose-500">Net Receivable</div>
                  </div>

                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                    <div className="text-slate-400">Invoice Date</div>
                    <div className="text-sm font-semibold text-slate-200 mt-1">
                      {formatDate(selectedInvoice.invoiceDate)}
                    </div>
                    <div className="text-[10px] text-slate-500">Due: {formatDate(selectedInvoice.dueDate)}</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 p-3 bg-slate-850 rounded-xl border border-slate-800">
                  <div className="font-bold text-white">Itemized Scope:</div>
                  <div>• {selectedInvoice.panelDetails}</div>
                  <div>• {selectedInvoice.inverterDetails}</div>
                  <div>• Complete Turnkey Balance of System (BoS) Structure, Cabling & Commissioning</div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setActiveTab('PRINT_INVOICE')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Formal Tax Invoice (PDF)</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Printable GST Tax Invoice (Requirement 29) */
        <div className="bg-white text-slate-900 rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl border border-slate-200 print:p-0 print:border-none">
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
            <div>
              <div className="text-2xl font-black text-slate-950">
                FRONTIER COMPLETE SOLAR SOLUTIONS
              </div>
              <div className="text-xs text-slate-600 font-bold">
                PM SURYA GHAR EMPANELLED VENDOR • NAGPUR, MAHARASHTRA
              </div>
              <div className="text-xs text-slate-500 mt-1">
                GSTIN: 27AABCF9012D1Z8 • PAN: AABCF9012D • State Code: 27 (Maharashtra)
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-slate-900 text-white font-extrabold text-xs rounded">
                TAX INVOICE
              </span>
              <div className="font-mono text-xs text-slate-700 mt-1">
                Invoice No: <strong>{selectedInvoice?.invoiceNumber}</strong>
              </div>
              <div className="text-xs text-slate-600">Date: {formatDate(selectedInvoice?.invoiceDate)}</div>
              <div className="text-xs text-slate-500 font-mono">Project: {selectedInvoice?.projectId}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-300 mb-6 text-xs">
            <div>
              <div className="text-slate-500 font-semibold">Billed To (Customer):</div>
              <div className="font-bold text-slate-950 text-sm mt-0.5">{selectedInvoice?.customerName}</div>
              <div className="text-slate-700 mt-0.5">{selectedInvoice?.address}</div>
              <div className="text-slate-700 mt-0.5 font-mono">
                MSEDCL Consumer No: {selectedInvoice?.consumerNumber}
              </div>
            </div>
            <div>
              <div className="text-slate-500 font-semibold">Supply & Place Details:</div>
              <div className="text-slate-800 mt-0.5">Place of Supply: Nagpur, Maharashtra (27)</div>
              <div className="text-slate-800 mt-0.5">System: {selectedInvoice?.systemCapacityKw} kW On-Grid Rooftop</div>
              <div className="text-slate-800 mt-0.5">Category: PM Surya Ghar Muft Bijli Yojana</div>
            </div>
          </div>

          <table className="w-full text-left text-xs border border-slate-300 mb-6">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[11px]">
              <tr>
                <th className="p-2.5">Item Description</th>
                <th className="p-2.5">HSN Code</th>
                <th className="p-2.5 text-center">Qty</th>
                <th className="p-2.5 text-right">Taxable Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2.5">
                  <div className="font-semibold text-slate-950">
                    Grid-Connected Solar PV Power Plant ({selectedInvoice?.systemCapacityKw} kW)
                  </div>
                  <div className="text-[11px] text-slate-600">{selectedInvoice?.panelDetails}</div>
                  <div className="text-[11px] text-slate-600">{selectedInvoice?.inverterDetails}</div>
                </td>
                <td className="p-2.5 font-mono text-slate-600">8541 / 8443</td>
                <td className="p-2.5 text-center font-bold">1 Job</td>
                <td className="p-2.5 text-right font-mono font-bold">
                  {formatCurrency(selectedInvoice?.baseAmount)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 text-xs space-y-1 mb-6">
            <div className="flex justify-between">
              <span>Taxable Value:</span>
              <span className="font-semibold">{formatCurrency(selectedInvoice?.baseAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (Composite Solar Rate 13.8%):</span>
              <span className="font-semibold">{formatCurrency(selectedInvoice?.gstAmount)}</span>
            </div>
            <div className="flex justify-between py-1 border-t-2 border-slate-900 font-black text-sm text-slate-950">
              <span>Total Invoice Amount:</span>
              <span>{formatCurrency(selectedInvoice?.totalInvoiceAmount)}</span>
            </div>
            <div className="flex justify-between text-emerald-800 font-bold">
              <span>Total Payments Received:</span>
              <span>- {formatCurrency(selectedInvoice?.totalReceived)}</span>
            </div>
            <div className="flex justify-between py-1 bg-amber-100 p-2 rounded text-amber-950 font-bold">
              <span>Balance Due from Customer:</span>
              <span>{formatCurrency(selectedInvoice?.balanceDue)}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-600 leading-relaxed mb-8">
            <strong>Terms & Warranty:</strong> {selectedInvoice?.terms}
          </div>

          <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs text-slate-700">
            <div>
              <div className="font-bold text-slate-900">For Frontier Complete Solar Solutions</div>
              <div className="text-[10px] text-slate-500 mt-6">Authorized Signatory & Stamp</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">Customer Acknowledgement</div>
              <div className="text-[10px] text-slate-500 mt-6">Received with thanks</div>
            </div>
          </div>

          <div className="mt-8 text-center print:hidden flex items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors shadow-lg"
            >
              Print Tax Invoice (A4 PDF)
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
