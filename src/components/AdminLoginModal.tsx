import React, { useState } from 'react';
import { X, Lock, KeyRound, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { playSoundChime } from '../services/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('admin@dbuzzingbees.com.au');
  const [password, setPassword] = useState('admin2026');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      // Valid credentials or demo password
      if ((email.trim().toLowerCase() === 'admin@dbuzzingbees.com.au' || email.trim().toLowerCase() === 'admin') && 
          (password === 'admin2026' || password === 'admin123' || password === 'admin')) {
        playSoundChime('success');
        onLoginSuccess();
        onClose();
      } else {
        setErrorMsg('Invalid admin credentials. Use the Demo Auto-Fill button below.');
      }
    }, 600);
  };

  const handleDemoFill = () => {
    setEmail('admin@dbuzzingbees.com.au');
    setPassword('admin2026');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 my-8 overflow-hidden p-6 space-y-5">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-neutral-950 font-bold flex items-center justify-center shadow-sm">
              🐝
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                DBuzzingBees Admin Portal
              </h2>
              <p className="text-xs text-neutral-500">
                Staff & Client Roster Access (Perth WA)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Admin Email / Username
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dbuzzingbees.com.au"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Security Password
              </label>
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold hover:underline"
              >
                Auto-Fill Demo Credentials
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-amber-500 font-mono"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-neutral-950 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Log In to Admin Client Roster</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 text-[11px] text-neutral-500 space-y-1">
            <div className="font-semibold text-neutral-700 dark:text-neutral-300">Quick Test Credentials:</div>
            <div>Email: <code className="font-mono text-neutral-800 dark:text-neutral-200 font-semibold">admin@dbuzzingbees.com.au</code></div>
            <div>Password: <code className="font-mono text-neutral-800 dark:text-neutral-200 font-semibold">admin2026</code></div>
          </div>
        </form>

      </div>
    </div>
  );
};
