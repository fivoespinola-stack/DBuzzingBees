import React, { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Bell, 
  Cloud, 
  RotateCcw, 
  Check, 
  Volume2,
  Sparkles,
  Lock,
  UserCheck
} from 'lucide-react';
import { UserSettings } from '../types';
import { playSoundChime, getLastBackupTime, setLastBackupTime } from '../services/storage';

interface SettingsViewProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  onResetFactoryData: () => void;
  isAdminLoggedIn: boolean;
  openAdminLoginModal: () => void;
  onLogoutAdmin: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  setSettings,
  onResetFactoryData,
  isAdminLoggedIn,
  openAdminLoginModal,
  onLogoutAdmin
}) => {
  const [backupTime, setBackupTimeState] = useState<string>(getLastBackupTime());
  const [backupSuccess, setBackupSuccess] = useState(false);

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setSettings(prev => ({ ...prev, theme: mode }));
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (mode === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleTestAudio = () => {
    playSoundChime('notification');
  };

  const handleCloudBackupNow = () => {
    const nowStr = new Date().toLocaleString() + ' AWST';
    setLastBackupTime(nowStr);
    setBackupTimeState(nowStr);
    setBackupSuccess(true);
    playSoundChime('success');
    setTimeout(() => setBackupSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span>🐝</span>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
            DBuzzingBees Platform Settings
          </h1>
        </div>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure Perth WA business operations, admin authentication, themes, and cloud backup snapshots.
        </p>
      </div>

      <div className="space-y-5">
        
        {/* 1. Admin Authentication & Session */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Admin Session & Client Master Roster Access</span>
            </div>

            {isAdminLoggedIn ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Admin Authenticated</span>
              </span>
            ) : (
              <span className="text-[11px] text-neutral-400 font-mono">
                Locked
              </span>
            )}
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            The Admin Page holds the Perth client roster with custom rates, frequencies (weekly, fortnightly, monthly, end of month, twice a week, every 3rd week, every 2 months, flexible, once), duration, clean days, and cleaner assignments.
          </p>

          <div className="pt-1">
            {isAdminLoggedIn ? (
              <button
                type="button"
                onClick={onLogoutAdmin}
                className="px-3.5 py-2 rounded-xl border border-rose-300 dark:border-rose-900/50 text-rose-600 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                Log Out of Admin Portal
              </button>
            ) : (
              <button
                type="button"
                onClick={openAdminLoginModal}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Log In as DBuzzingBees Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Language & Currency (English Perth WA) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
            <Globe className="w-4 h-4 text-amber-500" />
            <span>Region, Language & Currency</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-1">
              <span className="text-neutral-400 text-[10px]">Active Language</span>
              <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <span>🇦🇺</span>
                <span>English (Australia - Perth WA)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-1">
              <span className="text-neutral-400 text-[10px]">Currency & Tax</span>
              <div className="font-bold text-neutral-900 dark:text-white font-mono">
                AUD ($) · Inclusive of 10% Australian GST
              </div>
            </div>
          </div>
        </div>

        {/* 3. Theme / Dark Mode */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
            {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Display Theme</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', label: 'Light Mode', icon: <Sun className="w-4 h-4" /> },
              { id: 'dark', label: 'Dark Mode', icon: <Moon className="w-4 h-4" /> },
              { id: 'system', label: 'Follow System', icon: <Settings className="w-4 h-4" /> }
            ].map((mode) => (
              <button
                type="button"
                key={mode.id}
                onClick={() => handleThemeChange(mode.id as any)}
                className={`p-3 rounded-xl border text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  settings.theme === mode.id
                    ? 'border-amber-400 bg-amber-400/20 text-neutral-950 dark:text-amber-200 font-bold ring-1 ring-amber-400'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Push Alerts & Audio Chime */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Notification & Chime Preferences</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-700 dark:text-neutral-300">Enable Web Push Dispatch Alerts</span>
              <input
                type="checkbox"
                checked={settings.pushNotificationsEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, pushNotificationsEnabled: e.target.checked }))}
                className="rounded accent-amber-500 w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-700 dark:text-neutral-300">Audio Chimes on Status Changes</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestAudio}
                  className="px-2 py-1 rounded text-[11px] border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3 text-amber-500" />
                  <span>Test Chime</span>
                </button>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, soundEnabled: e.target.checked }))}
                  className="rounded accent-amber-500 w-4 h-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5. Cloud Backup & Factory Reset */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
              <Cloud className="w-4 h-4 text-amber-500" />
              <span>Perth Cloud Database Snapshot</span>
            </div>

            <button
              type="button"
              onClick={handleCloudBackupNow}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Snapshot Database</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>Last Snapshot: <strong>{backupTime}</strong></span>
            {backupSuccess && (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Snapshot Saved!
              </span>
            )}
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-xs">
            <span className="text-neutral-400">Restore factory sample clients & services:</span>
            <button
              type="button"
              onClick={onResetFactoryData}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Factory Roster</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
