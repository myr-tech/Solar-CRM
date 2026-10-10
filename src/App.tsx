import React, { useState, useEffect } from 'react';
import { storage } from './services/storage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { BackupRestoreModal } from './components/BackupRestoreModal';
import { WhatsAppShareModal, WhatsAppMessageType } from './components/WhatsAppShareModal';
import { NewLeadModal } from './components/Leads/NewLeadModal';
import { AuthModal } from './components/Auth/AuthModal';
import { initAuth } from './services/googleAuth';

// Views
import { DashboardView } from './components/Dashboard/DashboardView';
import { Consumer360View } from './components/Consumer360/Consumer360View';
import { LeadsView } from './components/Leads/LeadsView';
import { AppointmentsView } from './components/Appointments/AppointmentsView';
import { SurveyView } from './components/Survey/SurveyView';
import { QuotationView } from './components/Quotation/QuotationView';
import { ProjectsListView } from './components/Projects/ProjectsListView';
import { ProjectDetailView } from './components/Projects/ProjectDetailView';
import { MaterialsView } from './components/Materials/MaterialsView';
import { DispatchView } from './components/Dispatch/DispatchView';
import { InstallationView } from './components/Installation/InstallationView';
import { MsedclPackView } from './components/MsedclPack/MsedclPackView';
import { AccountsView } from './components/Accounts/AccountsView';
import { InvoiceView } from './components/Invoice/InvoiceView';
import { WarrantyAndServiceView } from './components/WarrantyAndService/WarrantyAndServiceView';
import { TasksView } from './components/Tasks/TasksView';
import { ReportsView } from './components/Reports/ReportsView';
import { PrintableDocumentsView } from './components/PrintableDocuments/PrintableDocumentsView';

export default function App() {
  const [, setTick] = useState(0);

  // Subscribe to storage changes for instant reactive re-rendering
  useEffect(() => {
    initAuth(
      (user) => {
        if (user?.email) {
          storage.loginWithGoogle(user.email, user.displayName || 'Solar Owner');
        }
      },
      () => {}
    );

    const unsubscribe = storage.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  // Keyboard shortcut ⌘K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [whatsAppData, setWhatsAppData] = useState<{
    isOpen: boolean;
    phone: string;
    name: string;
    projectId?: string;
    defaultType?: WhatsAppMessageType;
    extraData?: Record<string, any>;
  }>({
    isOpen: false,
    phone: '',
    name: '',
  });

  const handleOpenWhatsApp = (
    phone: string,
    name: string,
    projectId?: string,
    defaultType?: WhatsAppMessageType,
    extraData?: Record<string, any>
  ) => {
    setWhatsAppData({
      isOpen: true,
      phone,
      name,
      projectId,
      defaultType,
      extraData,
    });
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveTab('project-detail');
  };

  const handleNavigateToTab = (tabId: string, projId?: string) => {
    if (projId) {
      setSelectedProjectId(projId);
      setActiveTab('project-detail');
    } else {
      setSelectedProjectId(null);
      setActiveTab(tabId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNewLead={() => setIsNewLeadOpen(true)}
        onOpenBackupModal={() => setIsBackupOpen(true)}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        onNavigateToTab={handleNavigateToTab}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab === 'project-detail' ? 'projects' : activeTab}
          onSelectTab={(tabId) => {
            setSelectedProjectId(null);
            setActiveTab(tabId);
          }}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Project Detail Hub (Single Master ID FCSS-2026-XXXX) */}
          {activeTab === 'project-detail' && selectedProjectId && (
            <ProjectDetailView
              projectId={selectedProjectId}
              onBack={() => setActiveTab('projects')}
              onOpenWhatsApp={handleOpenWhatsApp}
              onNavigateToTab={handleNavigateToTab}
            />
          )}

          {/* Core Operations Tabs */}
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigateToTab={handleNavigateToTab}
              onOpenNewLead={() => setIsNewLeadOpen(true)}
              onSelectProject={handleSelectProject}
            />
          )}

          {activeTab === 'consumer-360' && (
            <Consumer360View
              projectId={selectedProjectId || storage.getDatabase().projects[0]?.id || 'FCSS-2026-0001'}
              onBack={() => setActiveTab('projects')}
              onOpenWhatsApp={handleOpenWhatsApp}
              onNavigateToTab={handleNavigateToTab}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsListView
              onSelectProject={handleSelectProject}
              onNavigateToTab={handleNavigateToTab}
            />
          )}

          {activeTab === 'leads' && (
            <LeadsView
              onOpenNewLead={() => setIsNewLeadOpen(true)}
              onOpenWhatsApp={handleOpenWhatsApp}
              onScheduleAppointment={(lead) => {
                setActiveTab('appointments');
              }}
              onGenerateQuotation={(lead) => {
                let quote = storage.getDatabase().quotations.find((q) => q.leadId === lead.id);
                if (!quote) {
                  quote = storage.createQuotationForLead(lead.id);
                }
                setSelectedQuotationId(quote.id);
                setActiveTab('quotations');
              }}
              onSelectProject={handleSelectProject}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsView
              onOpenWhatsApp={handleOpenWhatsApp}
              onSelectProject={handleSelectProject}
            />
          )}

          {activeTab === 'surveys' && (
            <SurveyView onSelectProject={handleSelectProject} />
          )}

          {activeTab === 'quotations' && (
            <QuotationView
              selectedQuotationId={selectedQuotationId}
              onSelectProject={handleSelectProject}
              onOpenWhatsApp={handleOpenWhatsApp}
            />
          )}

          {/* PM Surya Ghar & Discom Tabs */}
          {(activeTab === 'documents' ||
            activeTab === 'national-portal' ||
            activeTab === 'msedcl-pv' ||
            activeTab === 'rts-release' ||
            activeTab === 'net-meter' ||
            activeTab === 'subsidy' ||
            activeTab === 'completion-file') && (
            <ProjectDetailView
              projectId={selectedProjectId || storage.getDatabase().projects[0]?.id || 'FCSS-2026-0001'}
              onBack={() => setActiveTab('projects')}
              onOpenWhatsApp={handleOpenWhatsApp}
              onNavigateToTab={handleNavigateToTab}
            />
          )}

          {activeTab === 'msedcl-pack' && (
            <MsedclPackView onSelectProject={handleSelectProject} />
          )}

          {activeTab === 'printable-docs' && (
            <PrintableDocumentsView
              onSelectProject={handleSelectProject}
              onOpenWhatsApp={handleOpenWhatsApp}
            />
          )}

          {/* Store, Logistics & Field Tabs */}
          {activeTab === 'materials' && <MaterialsView />}

          {activeTab === 'dispatch' && (
            <DispatchView
              onOpenWhatsApp={handleOpenWhatsApp}
              onSelectProject={handleSelectProject}
            />
          )}

          {activeTab === 'installation' && (
            <InstallationView onSelectProject={handleSelectProject} />
          )}

          {activeTab === 'qc' && (
            <ProjectDetailView
              projectId={selectedProjectId || storage.getDatabase().projects[0]?.id || 'FCSS-2026-0001'}
              onBack={() => setActiveTab('projects')}
              onOpenWhatsApp={handleOpenWhatsApp}
              onNavigateToTab={handleNavigateToTab}
            />
          )}

          {/* Finance & Invoices */}
          {(activeTab === 'accounts' || activeTab === 'loans') && (
            <AccountsView
              onSelectProject={handleSelectProject}
              onOpenWhatsApp={handleOpenWhatsApp}
            />
          )}

          {activeTab === 'invoices' && (
            <InvoiceView
              onSelectProject={handleSelectProject}
              onOpenWhatsApp={handleOpenWhatsApp}
            />
          )}

          {activeTab === 'warranty-service' && (
            <WarrantyAndServiceView
              onSelectProject={handleSelectProject}
              onOpenWhatsApp={handleOpenWhatsApp}
            />
          )}

          {/* Management & Tools */}
          {activeTab === 'tasks' && (
            <TasksView onSelectProject={handleSelectProject} />
          )}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'whatsapp-hub' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
              <h2 className="text-lg font-bold text-white">WhatsApp Message Center Hub</h2>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Generate pre-approved, professional WhatsApp notifications with deep links for appointments, quotations, driver dispatches, MSEDCL updates, and ₹78,000 subsidy confirmations.
              </p>
              <button
                onClick={() =>
                  handleOpenWhatsApp('9822104521', 'Customer', 'FCSS-2026-0001', 'QUOTATION')
                }
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40"
              >
                Launch WhatsApp Message Generator
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProject={handleSelectProject}
        onSelectTab={handleNavigateToTab}
      />

      <NewLeadModal
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
        onLeadCreated={(leadId) => {
          let quote = storage.getDatabase().quotations.find((q) => q.leadId === leadId);
          if (!quote) {
            quote = storage.createQuotationForLead(leadId);
          }
          if (quote) {
            setSelectedQuotationId(quote.id);
            setActiveTab('quotations');
          } else {
            setActiveTab('leads');
          }
        }}
      />

      <BackupRestoreModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <WhatsAppShareModal
        isOpen={whatsAppData.isOpen}
        onClose={() => setWhatsAppData({ ...whatsAppData, isOpen: false })}
        defaultPhone={whatsAppData.phone}
        customerName={whatsAppData.name}
        projectId={whatsAppData.projectId}
        defaultType={whatsAppData.defaultType}
        extraData={whatsAppData.extraData}
      />
    </div>
  );
}
