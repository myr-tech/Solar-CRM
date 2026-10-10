import React, { useState } from 'react';
import {
  Building2,
  X,
  CheckCircle2,
  Upload,
  Image,
  Save,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  Trash2,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { CompanyProfile } from '../../types';

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompanyId?: string;
  onCompanySaved?: (companyId: string) => void;
}

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({
  isOpen,
  onClose,
  selectedCompanyId,
  onCompanySaved,
}) => {
  const db = storage.getDatabase();
  const profiles = storage.getCompanyProfiles();

  const [activeProfileId, setActiveProfileId] = useState<string>(
    selectedCompanyId || profiles[0]?.id || 'COMP-001'
  );
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const currentProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const [formData, setFormData] = useState<CompanyProfile>(() => currentProfile);

  React.useEffect(() => {
    if (selectedCompanyId) {
      const match = profiles.find((p) => p.id === selectedCompanyId);
      if (match) {
        setActiveProfileId(match.id);
        setFormData(match);
        setIsCreatingNew(false);
      }
    }
  }, [selectedCompanyId, profiles]);

  if (!isOpen) return null;

  const handleSelectProfile = (id: string) => {
    const p = profiles.find((item) => item.id === id);
    if (p) {
      setActiveProfileId(p.id);
      setFormData(p);
      setIsCreatingNew(false);
    }
  };

  const handleStartNewCompany = () => {
    setIsCreatingNew(true);
    setFormData({
      id: '',
      name: '',
      tagline: 'PM Surya Ghar Registered Rooftop Solar EPC Vendor',
      logoUrl: '',
      address: 'Nagpur, Maharashtra',
      email: 'info@solarenergynagpur.in',
      ownerContact: '+91 98230 00000',
      ownerName: 'Director / Proprietor',
      gstNumber: '27AAAAA0000A1Z5',
      registrationNumber: 'MSEDCL/PV/VENDOR/2026/NGP',
      panNumber: 'AAAAA0000A',
      bankName: 'State Bank of India',
      bankAccountNumber: '',
      bankIfsc: 'SBIN0000000',
      upiId: '',
      isDefault: false,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({ ...formData, logoUrl: event.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Company Name is required.');
      return;
    }

    if (isCreatingNew) {
      const created = storage.addCompanyProfile({
        name: formData.name,
        tagline: formData.tagline,
        logoUrl: formData.logoUrl,
        address: formData.address,
        email: formData.email,
        ownerContact: formData.ownerContact,
        ownerName: formData.ownerName,
        gstNumber: formData.gstNumber,
        registrationNumber: formData.registrationNumber,
        panNumber: formData.panNumber,
        bankName: formData.bankName,
        bankAccountNumber: formData.bankAccountNumber,
        bankIfsc: formData.bankIfsc,
        upiId: formData.upiId,
        isDefault: formData.isDefault,
      });
      setActiveProfileId(created.id);
      setIsCreatingNew(false);
      setFormData(created);
      setSuccessMsg(`Company profile "${created.name}" created successfully!`);
      if (onCompanySaved) onCompanySaved(created.id);
    } else {
      storage.updateCompanyProfile(formData.id, formData);
      setSuccessMsg(`Company profile "${formData.name}" updated successfully!`);
      if (onCompanySaved) onCompanySaved(formData.id);
    }

    setTimeout(() => {
      setSuccessMsg(null);
    }, 2500);
  };

  const handleDelete = () => {
    if (profiles.length <= 1) {
      alert('Cannot delete the last remaining company profile.');
      return;
    }
    if (confirm(`Are you sure you want to delete profile "${formData.name}"?`)) {
      storage.deleteCompanyProfile(formData.id);
      const remaining = storage.getCompanyProfiles();
      setActiveProfileId(remaining[0].id);
      setFormData(remaining[0]);
      setIsCreatingNew(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl p-5 sm:p-6 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Company Profiles & Letterhead Center</h3>
            <p className="text-xs text-slate-400">
              Manage pre-saved company profiles to issue quotations & advance slips under different business names
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Presaved Companies Switcher bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-850 rounded-xl border border-slate-800 mb-5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Presaved Profiles:
            </span>
            {profiles.map((p) => {
              const isSelected = !isCreatingNew && activeProfileId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectProfile(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
                  }`}
                >
                  {p.name} {p.isDefault && '(Default)'}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleStartNewCompany}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              isCreatingNew
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow'
                : 'bg-slate-800 hover:bg-slate-750 text-emerald-400 border-emerald-500/40'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Company</span>
          </button>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Logo & Brand Header */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              1. Brand Logo & Letterhead Header
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 rounded-xl bg-slate-900 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center relative overflow-hidden shrink-0 group">
                {formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="Company Logo"
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="text-center p-2 text-slate-500">
                    <Building2 className="w-8 h-8 mx-auto text-amber-400 mb-1" />
                    <span className="text-[9px] block">No Logo</span>
                  </div>
                )}
                <label className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[10px] font-bold">
                  <Upload className="w-4 h-4 mb-0.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex-1 space-y-2.5 w-full">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Frontier Complete Solar Solutions"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Letterhead Tagline / Registration Badges
                  </label>
                  <input
                    type="text"
                    value={formData.tagline || ''}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Registered PM Surya Ghar Vendor • MSEDCL Empanelled"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Legal & Contact Info */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              2. Address, Contact & Registration Numbers (GST / MSEDCL)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Company Address *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Plot No., Area, City, Pin Code"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Official Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sales@company.in"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contact Number of Owner/Manager *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={formData.ownerContact}
                    onChange={(e) => setFormData({ ...formData, ownerContact: e.target.value })}
                    placeholder="+91 98230 11223"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Owner / Director Name</label>
                <input
                  type="text"
                  value={formData.ownerName || ''}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="e.g. Er. Rajesh Sharma"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">GST Number (GSTIN) *</label>
                <input
                  type="text"
                  required
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                  placeholder="27AAACF1234M1Z5"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">MSEDCL / National Portal Vendor Reg. No.</label>
                <input
                  type="text"
                  value={formData.registrationNumber || ''}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  placeholder="MSEDCL/PV/VENDOR/2026/NGP-09"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Income Tax PAN Number</label>
                <input
                  type="text"
                  value={formData.panNumber || ''}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                  placeholder="AAACF1234M"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Bank Account Details for Advance Slips */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> 3. Bank Account & UPI for Customer Advance Slips
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bank Name & Branch</label>
                <input
                  type="text"
                  value={formData.bankName || ''}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="State Bank of India (Hingna Branch)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bank Account Number</label>
                <input
                  type="text"
                  value={formData.bankAccountNumber || ''}
                  onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                  placeholder="392019284729"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={formData.bankIfsc || ''}
                  onChange={(e) => setFormData({ ...formData, bankIfsc: e.target.value })}
                  placeholder="SBIN0014721"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">UPI ID for Direct Advance Payments</label>
                <input
                  type="text"
                  value={formData.upiId || ''}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  placeholder="frontiersolar@sbi"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefaultCompany"
                checked={formData.isDefault || false}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-800 border-slate-700"
              />
              <label htmlFor="isDefaultCompany" className="text-slate-300 text-xs font-semibold cursor-pointer">
                Set as Default Company Profile for all new Quotations & Advance Slips
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
            {!isCreatingNew && profiles.length > 1 ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-2.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-semibold rounded-xl border border-rose-800 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Company</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isCreatingNew ? 'Save New Company Profile' : 'Save Company Updates'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
