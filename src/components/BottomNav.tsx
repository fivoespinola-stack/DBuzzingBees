import React from 'react';
import { Sparkles, CalendarDays, Navigation, ShieldCheck, Settings } from 'lucide-react';
import { AppView } from '../types';

interface BottomNavProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  activeJobsCount: number;
  isAdminLoggedIn: boolean;
  openAdminLoginModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  setCurrentView,
  activeJobsCount,
  isAdminLoggedIn,
  openAdminLoginModal
}) => {
  const items: { id: AppView; label: string; icon: React.ReactNode; isAdminOnly?: boolean }[] = [
    { id: 'services', label: 'Services', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'bookings', label: 'Bookings', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'tracker', label: 'Tracker', icon: <Navigation className="w-5 h-5" /> },
    { id: 'admin_clients', label: 'Admin', icon: <ShieldCheck className="w-5 h-5 text-amber-500" />, isAdminOnly: true },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 pb-safe">
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isAdminOnly && !isAdminLoggedIn) {
                  openAdminLoginModal();
                } else {
                  setCurrentView(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center gap-1 min-h-[44px] cursor-pointer transition-colors relative ${
                isActive
                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.id === 'tracker' && activeJobsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-neutral-900" />
                )}
              </div>
              <span className="text-[10px] tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
