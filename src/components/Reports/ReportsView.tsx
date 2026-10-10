import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  FolderKanban,
  CreditCard,
  Users,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { exportToCsv, formatCurrency, formatDate } from '../../utils/formatters';

export const ReportsView: React.FC = () => {
  const db = storage.getDatabase();
  const [selectedReport, setSelectedReport] = useState<string>('PROJECTS_PIPELINE');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const reportDefinitions = [
    { id: 'PROJECTS_PIPELINE', label: 'Master Project Pipeline (FCSS ID)', desc: 'Complete lifecycle stage, capacity, customer & financials' },
    { id: 'LEADS_REPORT', label: 'Leads & Sales Inquiry Report', desc: 'Nagpur lead source, salesperson, follow-up dates & win rate' },
    { id: 'PAYMENTS_REPORT', label: 'Payments & Collections Ledger', desc: 'Booking advances, final settlements & mode of payment' },
    { id: 'OUTSTANDING_BALANCE', label: 'Customer Outstanding Receivables', desc: 'Projects with pending balances post-installation' },
    { id: 'MSEDCL_PENDING', label: 'MSEDCL PV & RTS Pending Cases', desc: 'Sub-division feasibility, release letters & net meter pending' },
    { id: 'LOANS_REPORT', label: 'Jan Samarth Loan Disbursement Report', desc: 'Bank sanction status, 1st & 2nd disbursement tracker' },
    { id: 'SUBSIDY_REPORT', label: 'PM Surya Ghar ₹78,000 Subsidy Report', desc: 'Claims submitted on National portal vs disbursed to banks' },
    { id: 'MATERIALS_STOCK', label: 'Warehouse BoS Inventory Report', desc: 'Depot stock, reserved modules, dispatched and reorder limits' },
    { id: 'WARRANTY_AMC', label: '25-Year Warranty & Service Report', desc: 'Active solar plants, inverter serials & AMC ticket history' },
  ];

  const handleExportCsv = (reportId: string) => {
    let rows: Record<string, any>[] = [];
    let filename = `frontier_solar_${reportId.toLowerCase()}_${new Date().toISOString().slice(0, 10)}`;

    switch (reportId) {
      case 'PROJECTS_PIPELINE':
        rows = db.projects.map((p) => ({
          Project_ID: p.id,
          Customer_Name: p.customerName,
          Consumer_Number: p.consumerNumber,
          Capacity_kW: p.systemCapacityKw,
          Stage: p.stage,
          Total_Value_INR: p.totalProjectValue,
          Total_Received_INR: p.totalReceived,
          Balance_Due_INR: p.balanceDue,
          Subsidy_INR: p.subsidyAmount,
          Start_Date: p.startDate,
        }));
        break;

      case 'LEADS_REPORT':
        rows = db.leads.map((l) => ({
          Lead_ID: l.id,
          Date: l.date,
          Customer_Name: l.customerName,
          Mobile: l.mobile,
          Interested_Capacity_kW: l.interestedCapacityKw,
          Lead_Source: l.leadSource,
          Salesperson: l.salesperson,
          Status: l.status,
          Next_Follow_Up: l.nextFollowUpDate,
        }));
        break;

      case 'PAYMENTS_REPORT':
        rows = db.payments.map((p) => ({
          Receipt_Number: p.receiptNumber,
          Project_ID: p.projectId,
          Customer_Name: p.customerName,
          Payment_Type: p.paymentType,
          Amount_INR: p.amount,
          Date: p.date,
          Mode: p.mode,
          Bank: p.bankName,
          Transaction_Ref: p.transactionNumber,
        }));
        break;

      case 'OUTSTANDING_BALANCE':
        rows = db.projects
          .filter((p) => p.balanceDue > 0)
          .map((p) => ({
            Project_ID: p.id,
            Customer_Name: p.customerName,
            Mobile: p.mobile,
            Total_Value_INR: p.totalProjectValue,
            Total_Received_INR: p.totalReceived,
            Balance_Due_INR: p.balanceDue,
            Stage: p.stage,
          }));
        break;

      case 'MATERIALS_STOCK':
        rows = db.inventory.map((i) => ({
          Item_Name: i.item,
          Category: i.category,
          Brand: i.brand,
          Model: i.model,
          Warehouse_Stock: i.warehouseStock,
          Reserved: i.reserved,
          Dispatched: i.dispatched,
          Available_Balance: i.availableStock,
          Unit: i.unit,
          Supplier: i.supplier,
        }));
        break;

      default:
        rows = db.projects.map((p) => ({
          Project_ID: p.id,
          Customer: p.customerName,
          Capacity_kW: p.systemCapacityKw,
          Stage: p.stage,
        }));
    }

    exportToCsv(filename, rows);
    setExportNotice(`Exported ${rows.length} records to CSV format successfully.`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-amber-400" /> Executive Business Reports & Data Exports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Free, client-side export to Excel / CSV format with official MSEDCL vendor summaries
          </p>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-700 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Reports Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportDefinitions.map((rpt) => (
          <div
            key={rpt.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <FileSpreadsheet className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">
                  CSV / EXCEL
                </span>
              </div>
              <h3 className="text-sm font-bold text-white leading-tight">{rpt.label}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rpt.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
              <button
                onClick={() => handleExportCsv(rpt.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export to CSV / Excel</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
