import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Copy,
  Check,
  ExternalLink,
  Phone,
  Sparkles,
} from 'lucide-react';
import { generateWhatsAppLink, cleanPhoneNumber } from '../utils/formatters';

export type WhatsAppMessageType =
  | 'APPOINTMENT_CONFIRMATION'
  | 'SURVEY_REMINDER'
  | 'QUOTATION'
  | 'DOCUMENT_PENDING'
  | 'ADVANCE_PAYMENT'
  | 'INSTALLATION_SCHEDULE'
  | 'DRIVER_DISPATCH'
  | 'DELIVERY_CONFIRMATION'
  | 'MSEDCL_UPDATE'
  | 'RELEASE_LETTER'
  | 'NET_METER_UPDATE'
  | 'INSPECTION'
  | 'SUBSIDY_UPDATE'
  | 'FINAL_PAYMENT'
  | 'WARRANTY'
  | 'SERVICE';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPhone?: string;
  customerName?: string;
  projectId?: string;
  defaultType?: WhatsAppMessageType;
  extraData?: Record<string, any>;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  defaultPhone = '9822104521',
  customerName = 'Valued Customer',
  projectId = 'FCSS-2026-0001',
  defaultType = 'APPOINTMENT_CONFIRMATION',
  extraData = {},
}) => {
  const [recipientPhone, setRecipientPhone] = useState(defaultPhone);
  const [selectedType, setSelectedType] = useState<WhatsAppMessageType>(defaultType);
  const [customText, setCustomText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setRecipientPhone(defaultPhone);
  }, [defaultPhone]);

  useEffect(() => {
    setSelectedType(defaultType);
  }, [defaultType]);

  const generateDefaultText = (type: WhatsAppMessageType): string => {
    const compName = 'Frontier Complete Solar Solutions';
    const city = 'Nagpur';
    const pId = projectId;
    const name = customerName;

    switch (type) {
      case 'APPOINTMENT_CONFIRMATION':
        return `Namaste ${name} ji,\n\nGreetings from ${compName} (Registered PM Surya Ghar Vendor, ${city}).\n\nYour appointment for Site Survey/Meeting has been confirmed for Project ID: *${pId}*.\nDate & Time: ${extraData.date || 'Tomorrow 11:00 AM'}.\nOur technical executive will visit your premises.\n\nWarm regards,\nFrontier Solar Team\nNagpur`;

      case 'SURVEY_REMINDER':
        return `Namaste ${name} ji,\n\nThis is a gentle reminder that your Solar Rooftop Technical Survey for Project *${pId}* is scheduled for today.\nSurveyor: Nikhil Raut (+91 9823011226).\nPlease ensure access to your rooftop and main meter box.\n\n${compName}, ${city}`;

      case 'QUOTATION':
        return `Namaste ${name} ji,\n\nWe have prepared your customized PM Surya Ghar Solar Rooftop Quotation for Project *${pId}* (${extraData.capacity || '3.3'} kW).\n\nSystem Cost: ₹${extraData.amount || '1,95,000'}\nPM Surya Ghar Subsidy: ₹78,000 (Central Govt Assistance)\nYour Net Payable: ₹${extraData.netPayable || '1,17,000'}\n\nPlease review and let us know so we can initiate your National Portal registration!\n\n${compName}, ${city}`;

      case 'DOCUMENT_PENDING':
        return `Namaste ${name} ji,\n\nTo proceed with your PM Surya Ghar subsidy application for Project *${pId}*, we kindly request the following pending documents:\n1. Latest Electricity Bill (MSEDCL)\n2. Aadhaar Card copy\n3. Bank Passbook / Cancelled Cheque (matching Aadhaar name)\n4. Property Tax Receipt\n\nPlease share them on this WhatsApp number.\n\n${compName}, ${city}`;

      case 'ADVANCE_PAYMENT':
        return `Namaste ${name} ji,\n\nThank you for choosing ${compName} for your PM Surya Ghar installation (Project: *${pId}*).\nWe request you to remit the booking advance of ₹${extraData.advance || '25,000'} to initiate procurement and MSEDCL submission.\nBank details: SBI A/c 39821034567, IFSC: SBIN0001472.\n\nFrontier Solar Accounts Team`;

      case 'INSTALLATION_SCHEDULE':
        return `Namaste ${name} ji,\n\nGreat news! Your solar rooftop installation for Project *${pId}* is scheduled on ${extraData.date || 'tomorrow 10:00 AM'}.\nLead Electrician: Ganesh Patil (+91 9823011228).\nPlease ensure rooftop terrace access and water connection.\n\n${compName}, ${city}`;

      case 'DRIVER_DISPATCH':
        return `*SOLAR MATERIAL DISPATCH CHALLAN*\n\nConsumer: ${name}\nProject ID: *${pId}*\nLocation: ${extraData.address || 'Besa, Nagpur'}\nGoogle Maps: ${extraData.mapsUrl || 'https://maps.google.com'}\nDriver: Santosh Gaikwad (MH-31-DS-4921)\n\nMaterials:\n- Solar Panels (ALMM/DCR Compliant)\n- Grid-Tie Inverter\n- GI Structure Set & Hardware\n\nPlease confirm delivery upon arrival.\n\nFrontier Solar Logistics`;

      case 'DELIVERY_CONFIRMATION':
        return `Namaste ${name} ji,\n\nAll solar equipment and panels for Project *${pId}* have been successfully unloaded at your site.\nOur installation technicians will begin structural assembly shortly.\n\n${compName}, ${city}`;

      case 'MSEDCL_UPDATE':
        return `Namaste ${name} ji,\n\nUpdate on your MSEDCL Rooftop Solar Application (Project *${pId}*):\nYour Technical Feasibility has been *APPROVED* by MSEDCL Sub-Division.\nPV Application No: ${extraData.appNo || 'MSEDCL-PV-2026-98124'}.\n\nNext step: Structure mounting and WCR compilation.\n\n${compName}, ${city}`;

      case 'RELEASE_LETTER':
        return `Namaste ${name} ji,\n\nWe have received the official *MSEDCL Release Letter* for your solar connection (Project: *${pId}*)!\nNet Meter installation request has been officially booked with the MSEDCL testing bench.\n\nFrontier Solar Liaison Desk`;

      case 'NET_METER_UPDATE':
        return `Namaste ${name} ji,\n\nCongratulations! Your Bi-directional Net Meter has been successfully installed and commissioned by MSEDCL for Project *${pId}*.\nYour rooftop solar system is now generating clean green electricity and feeding surplus units into the grid!\n\n${compName}, ${city}`;

      case 'INSPECTION':
        return `Namaste ${name} ji,\n\nMSEDCL Joint Technical Inspection for Project *${pId}* has been PASSED successfully. Work Completion Certificate (WCR) is certified.\nWe are now uploading the inspection document to claim your PM Surya Ghar central subsidy.\n\n${compName}, ${city}`;

      case 'SUBSIDY_UPDATE':
        return `Namaste ${name} ji,\n\nYour PM Surya Ghar Subsidy Claim of *₹78,000* for Project *${pId}* has been successfully submitted on the National Portal!\nThe subsidy will be directly credited to your Aadhaar-linked bank account within 30 days.\n\n${compName}, ${city}`;

      case 'FINAL_PAYMENT':
        return `Namaste ${name} ji,\n\nWith your solar system fully commissioned and net meter activated (Project *${pId}*), we request settlement of the final balance of ₹${extraData.balance || '50,000'}.\nPayment receipt and 25-Year warranty certificate will be handed over.\n\n${compName}, ${city}`;

      case 'WARRANTY':
        return `Namaste ${name} ji,\n\nCongratulations on the successful commissioning of your solar plant (*${pId}*)!\nYour 25-Year Panel Performance Warranty and 5-Year Comprehensive Maintenance by Frontier Complete Solar Solutions is now active.\nHelpline: +91 9823011223.\n\n${compName}, ${city}`;

      case 'SERVICE':
        return `Namaste ${name} ji,\n\nYour solar service complaint for Project *${pId}* has been registered (Ticket: ${extraData.ticketNo || 'SRV-2026-0001'}).\nOur technician will attend to the issue today.\n\nFrontier Solar Customer Care`;

      default:
        return `Namaste ${name} ji, Greetings from ${compName}, Nagpur regarding Project ${pId}.`;
    }
  };

  useEffect(() => {
    setCustomText(generateDefaultText(selectedType));
  }, [selectedType, customerName, projectId]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const link = generateWhatsAppLink(recipientPhone, customText);
    window.open(link, '_blank');
  };

  const templateOptions: { type: WhatsAppMessageType; label: string }[] = [
    { type: 'APPOINTMENT_CONFIRMATION', label: 'Appointment Confirmed' },
    { type: 'SURVEY_REMINDER', label: 'Site Survey Reminder' },
    { type: 'QUOTATION', label: 'Quotation & Subsidy' },
    { type: 'DOCUMENT_PENDING', label: 'Documents Pending' },
    { type: 'ADVANCE_PAYMENT', label: 'Advance Payment Request' },
    { type: 'INSTALLATION_SCHEDULE', label: 'Installation Date' },
    { type: 'DRIVER_DISPATCH', label: 'Driver Dispatch Challan' },
    { type: 'DELIVERY_CONFIRMATION', label: 'Material Delivered' },
    { type: 'MSEDCL_UPDATE', label: 'MSEDCL Feasibility Update' },
    { type: 'RELEASE_LETTER', label: 'MSEDCL Release Letter' },
    { type: 'NET_METER_UPDATE', label: 'Net Meter Commissioned' },
    { type: 'INSPECTION', label: 'Inspection Passed' },
    { type: 'SUBSIDY_UPDATE', label: '₹78,000 Subsidy Submitted' },
    { type: 'FINAL_PAYMENT', label: 'Final Settlement Request' },
    { type: 'WARRANTY', label: '25-Year Warranty Handover' },
    { type: 'SERVICE', label: 'Service Complaint Ticket' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">WhatsApp Message Center</h3>
            <p className="text-xs text-slate-400">
              One-click pre-approved WhatsApp messages with preview & edit confirmation
            </p>
          </div>
        </div>

        {/* Template Selector */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Select Solar Stage Template:
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as WhatsAppMessageType)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-400"
          >
            {templateOptions.map((opt) => (
              <option key={opt.type} value={opt.type}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Recipient phone input */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Customer / Driver Mobile Number:
          </label>
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 text-xs font-mono">
              +91
            </div>
            <input
              type="text"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-400"
              placeholder="9822104521"
            />
          </div>
        </div>

        {/* Editable Message text area */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Message Content (Editable):
            </label>
            <span className="text-[10px] text-slate-500">Includes Single Project ID {projectId}</span>
          </div>
          <textarea
            rows={7}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-amber-400 font-sans leading-relaxed resize-none"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Text!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-emerald-900/30"
          >
            <Send className="w-4 h-4" />
            <span>Open & Send via WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>
    </div>
  );
};
