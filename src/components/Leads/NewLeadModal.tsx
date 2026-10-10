import React, { useState } from 'react';
import { X, Users, PlusCircle, CheckCircle2 } from 'lucide-react';
import { storage } from '../../services/storage';
import { LeadSource, LeadStatus } from '../../types';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCreated?: (leadId: string) => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  isOpen,
  onClose,
  onLeadCreated,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [address, setAddress] = useState('');
  const [interestedCapacityKw, setInterestedCapacityKw] = useState(3.3);
  const [leadSource, setLeadSource] = useState<LeadSource>('Customer Reference');
  const [referredBy, setReferredBy] = useState('');
  const [salesperson, setSalesperson] = useState('Amit Kulkarni');
  const [status, setStatus] = useState<LeadStatus>('New');
  const [nextFollowUpDate, setNextFollowUpDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );
  const [remarks, setRemarks] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !mobile) {
      alert('Please enter Customer Name and Mobile number.');
      return;
    }

    const created = storage.addLead({
      date: new Date().toISOString().slice(0, 10),
      customerName,
      mobile,
      whatsapp: whatsapp || mobile,
      email: email || `${customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      consumerNumber,
      address: address || 'Nagpur, Maharashtra',
      city: 'Nagpur',
      pincode: '440001',
      interestedCapacityKw: Number(interestedCapacityKw) || 3.3,
      leadSource,
      referredBy,
      salesperson,
      status,
      nextFollowUpDate,
      remarks,
    });

    onClose();
    if (onLeadCreated) onLeadCreated(created.id);
  };

  const leadSources: LeadSource[] = [
    'Customer Reference',
    'WhatsApp Marketing',
    'Existing Customer',
    'Facebook',
    'Instagram',
    'Google',
    'Website',
    'Walk-in',
    'Dealer/Partner',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Add New Solar Lead</h3>
            <p className="text-xs text-slate-400">
              PM Surya Ghar Nagpur inquiry capture & assignment (Draft Quotation is automatically created)
            </p>
          </div>
        </div>

        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Automatic Quotation:</strong> Submitting this lead will instantly generate an editable Draft Solar Quotation with PM Surya Ghar subsidy estimate and payment schedule.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Customer Full Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Dr. Milind Vaidya / Shri Rajesh Patil"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mobile Number (Calling) *</label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 9822104521"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">WhatsApp Number</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Leave blank if same as mobile"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">MSEDCL Electricity Consumer No</label>
              <input
                type="text"
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                placeholder="12-digit MSEDCL Bill Number"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Premises Address (Nagpur)</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot / Flat, Society, Area (e.g. Besa, Dharampeth, Manish Nagar)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Interested Solar Capacity (kW)</label>
              <select
                value={interestedCapacityKw}
                onChange={(e) => setInterestedCapacityKw(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              >
                <option value={1.1}>1.1 kW (₹30,000 Subsidy)</option>
                <option value={2.2}>2.2 kW (₹60,000 Subsidy)</option>
                <option value={3.3}>3.3 kW (₹78,000 Subsidy - Popular)</option>
                <option value={5.0}>5.0 kW (₹78,000 Subsidy)</option>
                <option value={10.0}>10.0 kW (Commercial / Large Resi)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Lead Source</label>
              <select
                value={leadSource}
                onChange={(e) => setLeadSource(e.target.value as LeadSource)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              >
                {leadSources.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Referred By (if applicable)</label>
              <input
                type="text"
                value={referredBy}
                onChange={(e) => setReferredBy(e.target.value)}
                placeholder="Existing client / dealer name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Assigned Salesperson</label>
              <select
                value={salesperson}
                onChange={(e) => setSalesperson(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Amit Kulkarni">Amit Kulkarni (Senior Consultant)</option>
                <option value="Pooja Deshmukh">Pooja Deshmukh (Operations)</option>
                <option value="Rajesh Sharma">Rajesh Sharma (Director)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Next Follow-Up Date</label>
              <input
                type="date"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Remarks & Customer Requirements</label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Average electricity bill amount, roof type, loan interest, etc."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold transition-colors shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Save Lead</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
