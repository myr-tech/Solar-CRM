import React, { useState, useEffect, useRef } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  ShieldCheck,
  Cloud,
  CloudLightning,
  Sparkles,
  LogIn,
  LogOut,
  FolderSync,
  Trash2,
  ExternalLink,
  Calendar,
  FileText,
  Clock,
} from 'lucide-react';
import { storage } from '../services/storage';
import { downloadJsonFile } from '../utils/formatters';
import {
  signInWithGoogleAccount,
  signOutGoogle,
  getCachedAccessToken,
  getCurrentFirebaseUser,
  subscribeToAuth,
} from '../services/googleAuth';
import {
  saveDatabaseToGoogleDrive,
  listDatabaseBackupsFromGoogleDrive,
  restoreDatabaseFromGoogleDrive,
  deleteBackupFileFromGoogleDrive,
  DriveBackupFile,
} from '../services/googleDrive';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Google Drive state
  const [firebaseUser, setFirebaseUser] = useState(getCurrentFirebaseUser());
  const [hasGoogleToken, setHasGoogleToken] = useState(!!getCachedAccessToken());
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const [driveBackups, setDriveBackups] = useState<DriveBackupFile[]>([]);
  const [lastDriveBackupTime, setLastDriveBackupTime] = useState<string | null>(() => {
    return localStorage.getItem('last_gdrive_backup_time');
  });

  // Modal for confirmation of destructive operations (Restore / Delete file)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionLabel: string;
    isDestructive: boolean;
    onConfirm: () => Promise<void> | void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionLabel: 'Confirm',
    isDestructive: false,
    onConfirm: () => {},
  });

  useEffect(() => {
    const unsub = subscribeToAuth((user, token) => {
      setFirebaseUser(user);
      setHasGoogleToken(!!token);
    });
    return unsub;
  }, []);

  // Fetch Drive backups when token is available and modal is open
  useEffect(() => {
    if (isOpen && hasGoogleToken) {
      loadDriveBackups();
    }
  }, [isOpen, hasGoogleToken]);

  const loadDriveBackups = async () => {
    try {
      setIsDriveLoading(true);
      const files = await listDatabaseBackupsFromGoogleDrive();
      setDriveBackups(files);
    } catch (err: any) {
      console.warn('Failed to load drive backups:', err);
    } finally {
      setIsDriveLoading(false);
    }
  };

  if (!isOpen) return null;

  const db = storage.getDatabase();
  const currentUser = db.currentUser;

  const handleGoogleSignIn = async () => {
    try {
      setIsDriveLoading(true);
      setErrorMessage(null);
      const result = await signInWithGoogleAccount();
      if (result) {
        setSuccessMessage(`Signed in as ${result.user.displayName || result.user.email}! Google Drive connected.`);
        // Sync CRM user
        if (result.user.email) {
          storage.loginWithGoogle(result.user.email, result.user.displayName || 'Solar Owner');
        }
        await loadDriveBackups();
        setTimeout(() => setSuccessMessage(null), 3500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in failed. Please allow popups and try again.');
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOutGoogle();
      setDriveBackups([]);
      setSuccessMessage('Signed out from Google Drive.');
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error signing out.');
    }
  };

  const handleSaveToDrive = async () => {
    if (!hasGoogleToken) {
      handleGoogleSignIn();
      return;
    }
    try {
      setIsDriveLoading(true);
      setErrorMessage(null);
      const dbData = storage.getDatabase();
      const res = await saveDatabaseToGoogleDrive(dbData);
      const timeStr = new Date().toLocaleTimeString('en-IN');
      localStorage.setItem('last_gdrive_backup_time', timeStr);
      setLastDriveBackupTime(timeStr);
      setSuccessMessage(`Database successfully saved to your Google Drive folder as "${res.name}"!`);
      await loadDriveBackups();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save database to Google Drive.');
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handlePromptRestoreFromDrive = (file: DriveBackupFile) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Restore Database from Google Drive?',
      description: `This will replace current local CRM data with the backup "${file.name}" saved on ${new Date(
        file.createdTime
      ).toLocaleString('en-IN')}. Current unsaved changes will be overwritten.`,
      actionLabel: 'Restore Database',
      isDestructive: true,
      onConfirm: async () => {
        try {
          setIsDriveLoading(true);
          const restoredDb = await restoreDatabaseFromGoogleDrive(file.id);
          const ok = storage.importDatabaseJson(restoredDb);
          if (ok) {
            setSuccessMessage(`Database restored successfully from Google Drive backup!`);
            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
            setTimeout(() => {
              setSuccessMessage(null);
              onClose();
            }, 1800);
          } else {
            setErrorMessage('Invalid database structure in backup file.');
          }
        } catch (err: any) {
          setErrorMessage(err.message || 'Failed to restore from Google Drive.');
        } finally {
          setIsDriveLoading(false);
        }
      },
    });
  };

  const handlePromptDeleteDriveFile = (file: DriveBackupFile) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Backup from Google Drive?',
      description: `Are you sure you want to permanently delete backup "${file.name}" from your Google Drive? This action cannot be undone.`,
      actionLabel: 'Delete Permanently',
      isDestructive: true,
      onConfirm: async () => {
        try {
          setIsDriveLoading(true);
          await deleteBackupFileFromGoogleDrive(file.id);
          setSuccessMessage(`Backup "${file.name}" deleted from Google Drive.`);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          await loadDriveBackups();
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
          setErrorMessage(err.message || 'Failed to delete backup from Google Drive.');
        } finally {
          setIsDriveLoading(false);
        }
      },
    });
  };

  const handleExportBackup = () => {
    const backupData = storage.getDatabase();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    downloadJsonFile(`frontier_solar_crm_backup_${timestamp}`, backupData);
    setSuccessMessage('Full database JSON exported successfully! 100% free offline backup.');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const ok = storage.importDatabaseJson(parsed);
        if (ok) {
          setSuccessMessage('Database restored successfully from JSON backup file!');
          setTimeout(() => {
            setSuccessMessage(null);
            onClose();
          }, 1500);
        } else {
          setErrorMessage('Invalid database structure. Ensure it is a Frontier Solar CRM backup.');
          setTimeout(() => setErrorMessage(null), 4000);
        }
      } catch (err) {
        setErrorMessage('Failed to parse JSON backup file.');
        setTimeout(() => setErrorMessage(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const handleResetSampleData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset to Nagpur Sample Dataset?',
      description:
        'Are you sure you want to reset all data back to the default Nagpur PM Surya Ghar demonstration records (Besa, Dharampeth & Wardha Road)? Any unsaved records will be reset.',
      actionLabel: 'Reset Sample Data',
      isDestructive: true,
      onConfirm: () => {
        storage.resetToSampleData();
        setSuccessMessage('Database reset to fresh sample demonstration data.');
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 1500);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Database & Google Drive Storage
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                100% Free Cloud
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Sign in with your Google ID to save all projects, receipts, quotations & documents to Google Drive
            </p>
          </div>
        </div>

        {/* Live Storage Metrics */}
        <div className="grid grid-cols-4 gap-2 p-3 bg-slate-850 rounded-xl border border-slate-800 text-center mb-5">
          <div>
            <div className="text-base font-bold text-amber-400">{db.projects.length}</div>
            <div className="text-[10px] text-slate-400">Projects</div>
          </div>
          <div>
            <div className="text-base font-bold text-amber-400">{db.leads.length}</div>
            <div className="text-[10px] text-slate-400">Leads</div>
          </div>
          <div>
            <div className="text-base font-bold text-amber-400">{db.quotations.length}</div>
            <div className="text-[10px] text-slate-400">Quotations</div>
          </div>
          <div>
            <div className="text-base font-bold text-emerald-400">{db.inventory.length}</div>
            <div className="text-[10px] text-slate-400">Inventory</div>
          </div>
        </div>

        {/* Status messages */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-700 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* GOOGLE DRIVE INTEGRATION SECTION */}
        <div className="mb-5 p-4 bg-gradient-to-br from-amber-500/10 via-slate-850 to-blue-500/10 rounded-2xl border border-amber-500/30 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Google Drive Cloud Database
                  </span>
                  {hasGoogleToken ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      CONNECTED
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      DISCONNECTED
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {hasGoogleToken && firebaseUser ? (
                    <>
                      Logged in as: <strong className="text-amber-400 font-mono">{firebaseUser.email}</strong>
                    </>
                  ) : (
                    'Login with your Google account to back up and sync your database directly to Google Drive.'
                  )}
                </p>
              </div>
            </div>

            {hasGoogleToken ? (
              <button
                type="button"
                onClick={handleGoogleSignOut}
                className="text-[11px] px-2.5 py-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
                title="Sign out of Google"
              >
                <LogOut className="w-3 h-3" />
                <span>Disconnect</span>
              </button>
            ) : null}
          </div>

          {!hasGoogleToken ? (
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-300">
                Connect your Google ID to safely store your database files in a private folder inside your Google Drive.
              </p>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isDriveLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>{isDriveLoading ? 'Connecting to Google...' : 'Sign in with Google ID'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveToDrive}
                  disabled={isDriveLoading}
                  className="flex-1 py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow cursor-pointer disabled:opacity-50"
                >
                  <CloudLightning className="w-4 h-4" />
                  <span>{isDriveLoading ? 'Saving...' : 'Save Database to Google Drive'}</span>
                </button>

                <button
                  type="button"
                  onClick={loadDriveBackups}
                  disabled={isDriveLoading}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Refresh backups list"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDriveLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh List</span>
                </button>
              </div>

              {/* Backups List in Google Drive */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-1">
                  <span>Available Google Drive Backups ({driveBackups.length})</span>
                  {lastDriveBackupTime && <span>Last saved: {lastDriveBackupTime}</span>}
                </div>

                {driveBackups.length === 0 ? (
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
                    No backup files found in your Google Drive yet. Click "Save Database to Google Drive" to create your first backup snapshot!
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {driveBackups.map((file) => (
                      <div
                        key={file.id}
                        className="p-2.5 bg-slate-900/90 hover:bg-slate-850 rounded-xl border border-slate-800 flex items-center justify-between gap-2 text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                          <div className="truncate">
                            <div className="font-semibold text-slate-200 truncate text-[11px]">{file.name}</div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(file.createdTime).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handlePromptRestoreFromDrive(file)}
                            className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Restore this backup into current CRM"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Restore</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePromptDeleteDriveFile(file)}
                            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete file from Google Drive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* OFFLINE EXPORT / IMPORT SECTION */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Manual Offline Export / Import
          </div>

          {/* Download JSON Backup */}
          <button
            onClick={handleExportBackup}
            className="w-full flex items-center justify-between p-3.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl border border-slate-700 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-semibold text-white">Export Database Backup (.JSON)</div>
                <div className="text-[11px] text-slate-400">
                  Save all projects, leads, quotations, documents & accounts locally
                </div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-1 bg-amber-500/20 text-amber-400 font-semibold rounded">
              EXPORT
            </span>
          </button>

          {/* Restore JSON Backup */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-3.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl border border-slate-700 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-sky-400" />
              <div>
                <div className="text-xs font-semibold text-white">Restore Database (.JSON)</div>
                <div className="text-[11px] text-slate-400">
                  Import previously saved CRM database file
                </div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-1 bg-sky-500/20 text-sky-400 font-semibold rounded">
              IMPORT
            </span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".json"
            className="hidden"
          />

          {/* Reset Demo Data */}
          <button
            onClick={handleResetSampleData}
            className="w-full flex items-center justify-between p-3 bg-slate-800/60 hover:bg-slate-750 text-slate-400 hover:text-slate-200 rounded-xl border border-slate-800 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-rose-400" />
              <div>
                <div className="text-xs font-semibold text-slate-300">Reset to Nagpur Sample Dataset</div>
                <div className="text-[10px] text-slate-500">
                  Restore default Besa, Dharampeth & Wardha Road demo records
                </div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-1 bg-rose-500/10 text-rose-400 font-semibold rounded">
              RESET
            </span>
          </button>
        </div>

        <div className="mt-5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Zero cloud hosting bills. Your Google Drive holds your full database safely in your own personal cloud.
          </span>
        </div>
      </div>

      {/* Confirmation Modal for Destructive Operations */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">{confirmDialog.title}</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              {confirmDialog.description}
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDialog.onConfirm()}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer ${
                  confirmDialog.isDestructive
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {confirmDialog.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
