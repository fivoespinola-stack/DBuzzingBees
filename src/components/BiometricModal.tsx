import React, { useState } from 'react';
import { X, Fingerprint, Lock, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
import { Language, UserSettings } from '../types';
import { getTranslation } from '../i18n/translations';
import { playSoundChime } from '../services/storage';

interface BiometricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  settings: UserSettings;
  language: Language;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  settings,
  language
}) => {
  const t = (key: string) => getTranslation(language, key);

  const [isScanning, setIsScanning] = useState(false);
  const [usePIN, setUsePIN] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setErrorMsg('');
    playSoundChime('scan');

    // Simulate WebAuthn / Sensor response
    if ('vibrate' in navigator) {
      try { navigator.vibrate(50); } catch(e) {}
    }

    setTimeout(() => {
      setIsScanning(false);
      playSoundChime('success');
      onSuccess();
      onClose();
    }, 1200);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234') {
      playSoundChime('success');
      onSuccess();
      onClose();
    } else {
      setErrorMsg('Incorrect PIN. (Master default: 1234)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 my-8 overflow-hidden text-center p-6 space-y-5">
        
        {/* Top Icon & Close */}
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <div className="w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-3 ring-8 ring-teal-50/50 dark:ring-teal-950/20">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            {t('biometricSecurityTitle')}
          </h2>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
            {t('biometricDesc')}
          </p>
        </div>

        {!usePIN ? (
          <div className="space-y-4 pt-2">
            
            {/* Animated Fingerprint Scanner Target */}
            <div className="relative flex justify-center py-4">
              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={isScanning}
                className="group relative w-24 h-24 rounded-full border-2 border-dashed border-teal-500/60 dark:border-teal-400/60 flex items-center justify-center bg-teal-50/30 dark:bg-teal-950/20 hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-none"
              >
                {isScanning && (
                  <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
                )}
                <Fingerprint className={`w-12 h-12 transition-colors ${
                  isScanning ? 'text-teal-500 animate-pulse' : 'text-teal-600 dark:text-teal-400 group-hover:text-teal-700'
                }`} />
              </button>
            </div>

            <p className="text-[11px] text-neutral-400 font-mono">
              {isScanning ? 'Verifying biometric telemetry...' : 'Touch scanner sensor or click above'}
            </p>

            <button
              type="button"
              onClick={handleSimulateScan}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-98 transition-all shadow-sm"
            >
              {t('simulateBiometricScan')}
            </button>

            <button
              type="button"
              onClick={() => setUsePIN(true)}
              className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 flex items-center justify-center gap-1 mx-auto pt-1"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{t('usePINFallback')}</span>
            </button>
          </div>
        ) : (
          /* PIN Fallback Form */
          <form onSubmit={handlePinSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Enter Master Security PIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                autoFocus
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-32 mx-auto text-center tracking-widest text-lg font-mono px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-teal-500"
              />
              <p className="text-[10px] text-neutral-400 mt-1">Hint: Default is 1234</p>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUsePIN(false)}
                className="flex-1 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
              >
                Back to Biometrics
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
              >
                Unlock
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
