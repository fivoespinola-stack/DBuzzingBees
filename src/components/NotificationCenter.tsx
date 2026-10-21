import React, { useState } from 'react';
import { X, Bell, CheckCheck, Trash2, Calendar, CreditCard, Users, RefreshCw, Shield } from 'lucide-react';
import { AppNotification, AppView, Language } from '../types';
import { getTranslation } from '../i18n/translations';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onSelectAction: (view: AppView) => void;
  language: Language;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
  onSelectAction,
  language
}) => {
  const t = (key: string) => getTranslation(language, key);
  const [filter, setFilter] = useState<'all' | 'booking' | 'payment' | 'sync'>('all');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'booking': return <Calendar className="w-4 h-4 text-teal-600" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'staff': return <Users className="w-4 h-4 text-blue-600" />;
      case 'sync': return <RefreshCw className="w-4 h-4 text-amber-600" />;
      case 'security': return <Shield className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white dark:bg-neutral-900 h-full shadow-2xl border-l border-neutral-200 dark:border-neutral-800 flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              {t('notificationsTitle')}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter controls */}
        <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-x-auto">
            {(['all', 'booking', 'payment', 'sync'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer capitalize ${
                  filter === tab
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onMarkAllRead}
              title={t('markAllRead')}
              className="p-1 rounded text-neutral-500 hover:text-teal-600 text-xs"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClearAll}
              title={t('clearAll')}
              className="p-1 rounded text-neutral-500 hover:text-rose-600 text-xs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 text-xs text-neutral-400">
              {t('noNotifications')}
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.actionView) {
                    onSelectAction(n.actionView);
                    onClose();
                  }
                }}
                className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                  !n.read 
                    ? 'border-teal-200 dark:border-teal-900/50 bg-teal-50/30 dark:bg-teal-950/20' 
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/40 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-neutral-900 dark:text-white truncate">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-neutral-400 shrink-0 ml-2">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
