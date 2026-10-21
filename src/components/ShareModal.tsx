import React, { useState } from 'react';
import { X, Copy, Check, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const referralCode = "DBUZZING-PERTH";
  const shareUrl = "https://dbuzzingbees.com.au/referral/DBUZZING-PERTH";
  const shareText = "Get $30 AUD off your first residential, vacate clean, or mowing service with DBuzzingBees in Perth WA! Code: DBUZZING-PERTH 🐝";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-4 h-4 text-blue-600" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'X (Twitter)',
      icon: <Twitter className="w-4 h-4 text-sky-500" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-4 h-4 text-emerald-500" />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 my-8 overflow-hidden p-6 space-y-5">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐝</span>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Share DBuzzingBees Perth
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Invite neighbours & friends in Perth WA!
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

        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center space-y-1">
          <p className="text-xs font-bold text-amber-950 dark:text-amber-200">
            Give $30, Get $30 AUD Credit
          </p>
          <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
            Your Perth friends receive $30 off their booking, and you earn $30 credit toward your next clean or lawn care!
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Your Exclusive Referral Code
          </label>
          <div className="flex gap-2">
            <div className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm font-mono font-bold text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
              <span>{referralCode}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            Direct Share Links
          </label>
          <div className="grid grid-cols-3 gap-2">
            {shareLinks.map((sl) => (
              <a
                key={sl.name}
                href={sl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                {sl.icon}
                <span>{sl.name}</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
