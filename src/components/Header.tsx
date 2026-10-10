import React, { useState, useEffect } from 'react';
import {
  Sun,
  ShieldCheck,
  Search,
  Bell,
  Database,
  UserCheck,
  ChevronDown,
  Download,
  Upload,
  RefreshCw,
  PlusCircle,
  X,
  ExternalLink,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Cloud,
  Mail,
  HardDrive,
} from 'lucide-react';
import { storage } from '../services/storage';
import { UserRole, AlertItem } from '../types';
import {
  subscribeToAuth,
  getCurrentFirebaseUser,
  getCachedAccessToken,
} from '../services/googleAuth';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenNewLead: () => void;
  onOpenBackupModal: () => void;
  onOpenAuthModal: () => void;
  onNavigateToTab: (tabId: string, projectId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenNewLead,
  onOpenBackupModal,
  onOpenAuthModal,
  onNavigateToTab,
}) => {
  const db = storage.getDatabase();
  const currentUser = db.currentUser;
  const alerts = storage.getAlerts();

  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(getCurrentFirebaseUser());
  const [hasGoogleToken, setHasGoogleToken] = useState(!!getCachedAccessToken());

  useEffect(() => {
    const unsub = subscribeToAuth((user, token) => {
      setFirebaseUser(user);
      setHasGoogleToken(!!token);
    });
    return unsub;
  }, []);

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'ADMIN', label: 'Admin', desc: 'Full System Access & Governance' },
    { role: 'OFFICE_STAFF', label: 'Office Staff', desc: 'Leads, Docs, Applications & Coordination' },
    { role: 'SALES', label: 'Sales Consultant', desc: 'Leads, Appointments, Customer Follow-ups' },
    { role: 'SURVEYOR', label: 'Site Surveyor', desc: 'Rooftop Feasibility, GPS & Measurements' },
    { role: 'STORE_DISPATCH', label: 'Store & Dispatch', desc: 'Inventory, Challans, Drivers' },
    { role: 'INSTALLATION_TEAM', label: 'Installation Team', desc: 'Electrician Checklist, Serials, Photos' },
    { role: 'DOCUMENTATION_TEAM', label: 'Documentation Team', desc: 'PM Surya Ghar & MSEDCL RTS pack' },
    { role: 'ACCOUNTS', label: 'Accounts & Finance', desc: 'Advances, Jan Samarth Loans & Balance' },
    { role: 'SERVICE_TEAM', label: 'Service & AMC', desc: 'Warranty, Complaints & Maintenance' },
  ];

  const handleRoleChange = (role: UserRole) => {
    storage.setCurrentRole(role);
    setShowRoleDropdown(false);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Company branding */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-amber-500 to-amber-400 p-2 rounded-xl text-slate-950 shadow-md shadow-amber-500/20">
              <Sun className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  FRONTIER <span className="text-amber-400">SOLAR CRM</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <ShieldCheck className="w-3 h-3" /> PM Surya Ghar Vendor
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-400/80" />
                <span>Frontier Complete Solar Solutions</span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-amber-400/90 font-medium hidden sm:inline">Nagpur, MH</span>
              </div>
            </div>
          </div>

          {/* Search bar & quick triggers */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs sm:text-sm hover:border-slate-600 transition-colors cursor-pointer"
              title="Search by Consumer ID, Customer name, Mobile, MSEDCL app number, Serial number..."
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-slate-400">Search Project / Consumer ID...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-slate-900 border border-slate-700 rounded text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Quick Action: New Lead */}
            <button
              onClick={onOpenNewLead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm transition-colors shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">New Lead</span>
            </button>

            {/* Alerts Center Bell */}
            <div className="relative">
              <button
                onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
                className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                title="Alerts Center"
              >
                <Bell className="w-4 h-4" />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                    {alerts.length}
                  </span>
                )}
              </button>

              {/* Alerts Dropdown */}
              {showAlertsDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-850 rounded-xl shadow-2xl border border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-750 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <span className="font-semibold text-sm text-white">Live Alert Center</span>
                    </div>
                    <span className="text-[11px] bg-slate-700 px-2 py-0.5 rounded-full text-slate-300">
                      {alerts.length} active
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                    {alerts.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                        All alerts clear! No pending bottlenecks.
                      </div>
                    ) : (
                      alerts.map((alt) => (
                        <div
                          key={alt.id}
                          onClick={() => {
                            setShowAlertsDropdown(false);
                            if (alt.linkTab) onNavigateToTab(alt.linkTab, alt.projectId);
                          }}
                          className="p-3 hover:bg-slate-800 cursor-pointer transition-colors text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`font-semibold ${
                                alt.priority === 'Urgent'
                                  ? 'text-rose-400'
                                  : alt.priority === 'High'
                                  ? 'text-amber-400'
                                  : 'text-sky-400'
                              }`}
                            >
                              {alt.title}
                            </span>
                            <span className="text-[10px] text-slate-500 shrink-0">{alt.date}</span>
                          </div>
                          <p className="text-slate-300 mt-1">{alt.message}</p>
                          {alt.projectId && (
                            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-amber-400/90 font-mono">
                              <span>Project: {alt.projectId}</span>
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Google Drive Database Status / Action Button */}
            <button
              onClick={onOpenBackupModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                hasGoogleToken
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Google Drive Storage, Automatic Backups & Database Restores"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.66-5.2 3.66-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.25C.45 8.16 0 9.98 0 12c0 2.02.45 3.84 1.25 5.43l4.03-3.14z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.57l4.03 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span className="hidden md:inline font-bold">
                {hasGoogleToken ? 'Google Drive Synced' : 'Google Drive Backup'}
              </span>
            </button>

            {/* Google Login / Profile Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                  {firebaseUser?.photoURL ? (
                    <img src={firebaseUser.photoURL} alt="Google" className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight truncate max-w-[110px]">
                    {firebaseUser?.displayName || currentUser.name}
                  </div>
                  <div className="text-[10px] text-amber-400 font-medium">
                    {hasGoogleToken ? 'Google Verified' : currentUser.role.replace('_', ' ')}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role & Auth Dropdown Menu */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-850 rounded-xl shadow-2xl border border-slate-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-750 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">Google ID & Role</div>
                      <div className="text-[10px] text-slate-400">
                        {hasGoogleToken ? firebaseUser?.email : 'Connect Google Drive'}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowRoleDropdown(false);
                        onOpenAuthModal();
                      }}
                      className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[10px] cursor-pointer"
                    >
                      {hasGoogleToken ? 'Account' : 'Login'}
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1">
                    {roles.map((r) => {
                      const isActive = currentUser.role === r.role;
                      return (
                        <button
                          key={r.role}
                          onClick={() => handleRoleChange(r.role)}
                          className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer ${
                            isActive ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              {r.label}
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500">{r.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
