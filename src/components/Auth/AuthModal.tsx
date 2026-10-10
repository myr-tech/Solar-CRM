import React, { useState, useEffect } from 'react';
import {
  Sun,
  ShieldCheck,
  Lock,
  User,
  Key,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Cloud,
  Mail,
  Sparkles,
  HardDrive,
  LogIn,
  LogOut,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { UserRole } from '../../types';
import {
  signInWithGoogleAccount,
  signOutGoogle,
  getCachedAccessToken,
  getCurrentFirebaseUser,
  subscribeToAuth,
} from '../../services/googleAuth';
import { saveDatabaseToGoogleDrive } from '../../services/googleDrive';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const db = storage.getDatabase();
  const currentUser = db.currentUser;
  const isAuthenticated = storage.isAuthenticated();

  const [authMode, setAuthMode] = useState<'GOOGLE_DRIVE' | 'ROLE_SWITCH'>('GOOGLE_DRIVE');
  const [firebaseUser, setFirebaseUser] = useState(getCurrentFirebaseUser());
  const [hasGoogleToken, setHasGoogleToken] = useState(!!getCachedAccessToken());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToAuth((user, token) => {
      setFirebaseUser(user);
      setHasGoogleToken(!!token);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await signInWithGoogleAccount();
      if (res) {
        if (res.user.email) {
          storage.loginWithGoogle(res.user.email, res.user.displayName || 'Solar Business Owner');
        }
        setSuccessMsg(
          `Signed in as ${res.user.displayName || res.user.email}! Connected to Google Drive for database backups.`
        );

        // Auto backup current database to user's Drive upon login
        try {
          await saveDatabaseToGoogleDrive(storage.getDatabase());
        } catch (e) {
          console.warn('Initial backup on login skipped:', e);
        }

        setTimeout(() => {
          setSuccessMsg(null);
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in failed. Please allow popup access and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOutGoogle();
      setSuccessMsg('Signed out of Google account.');
      setTimeout(() => {
        setSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign out.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLoginAs = (userEmail: string, defaultPass: string) => {
    storage.login(userEmail, defaultPass);
    setSuccessMsg(`Switched active profile to ${storage.getDatabase().currentUser.name}`);
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Google ID Sign-In & Auth
            </h3>
            <p className="text-xs text-slate-400">
              Save all CRM database records securely to your Google Drive
            </p>
          </div>
        </div>

        {/* Tab switch between Google Sign-in and Role Switching */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-4">
          <button
            onClick={() => setAuthMode('GOOGLE_DRIVE')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              authMode === 'GOOGLE_DRIVE'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Google ID Login</span>
          </button>
          <button
            onClick={() => setAuthMode('ROLE_SWITCH')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              authMode === 'ROLE_SWITCH'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Switch Role</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-700 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {authMode === 'GOOGLE_DRIVE' ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
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
                  <h4 className="text-sm font-bold text-white">Sign In with Google Account</h4>
                  <p className="text-[11px] text-slate-400">
                    Saves all CRM data, quotations & receipts directly to your Google Drive
                  </p>
                </div>
              </div>

              {hasGoogleToken && firebaseUser ? (
                <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-800/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Google ID Connected
                    </span>
                    <span className="text-[10px] text-slate-400">Google Drive Linked</span>
                  </div>
                  <div className="text-xs text-white font-mono">{firebaseUser.email}</div>
                  {firebaseUser.displayName && (
                    <div className="text-[11px] text-slate-300 font-medium">{firebaseUser.displayName}</div>
                  )}

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGoogleSignOut}
                      disabled={isLoading}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out Google</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
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
                  <span>{isLoading ? 'Connecting Google Account...' : 'Continue with Google ID'}</span>
                </button>
              )}
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                <span>How Google Drive Storage Works:</span>
              </div>
              <p>
                • An automated, secure backup folder named <strong>"SolarFlow CRM Backups"</strong> is created in your own Google Drive.
              </p>
              <p>
                • Your data stays completely in your private control with zero server hosting subscription costs.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-slate-400 mb-2">
              Select any role to preview interface permissions:
            </div>
            <div className="space-y-1.5">
              {[
                { name: 'Frontier Solar Owner / Admin', email: 'frontiersolar.nagpur@gmail.com', role: 'ADMIN', pass: 'admin' },
                { name: 'Office Staff & RTS Desk', email: 'office@frontiersolar.in', role: 'OFFICE_STAFF', pass: 'staff123' },
                { name: 'Sales Consultant', email: 'sales@frontiersolar.in', role: 'SALES', pass: 'sales123' },
                { name: 'Accounts & Loan Desk', email: 'accounts@frontiersolar.in', role: 'ACCOUNTS', pass: 'accounts123' },
              ].map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleQuickLoginAs(account.email, account.pass)}
                  className="w-full p-2.5 bg-slate-850 hover:bg-slate-800 rounded-xl border border-slate-800 flex items-center justify-between transition-colors text-left cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{account.name}</div>
                    <div className="text-[10px] text-amber-400/90 font-mono">{account.email}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                    {account.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
