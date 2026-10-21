import React from 'react';
import { 
  Sparkles, 
  CalendarDays, 
  Navigation, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  Settings, 
  Share2, 
  Lock, 
  CheckCircle2,
  Clock,
  MapPin
} from 'lucide-react';
import { AppView, Cleaner, Booking, AdminClient } from '../types';

interface SidebarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  cleaners: Cleaner[];
  bookings: Booking[];
  clients: AdminClient[];
  isAdminLoggedIn: boolean;
  openAdminLoginModal: () => void;
  openShareModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  cleaners,
  bookings,
  clients,
  isAdminLoggedIn,
  openAdminLoginModal,
  openShareModal
}) => {
  const availableCleanersCount = cleaners.filter(c => c.status === 'available').length;
  const activeJobsCount = bookings.filter(b => b.status === 'in_progress' || b.status === 'en_route').length;
  const activeClientsCount = clients.filter(c => c.status === 'active').length;

  const menuItems: { id: AppView; label: string; icon: React.ReactNode; isAdminOnly?: boolean }[] = [
    { id: 'services', label: 'Services Catalog', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'bookings', label: 'Job Bookings', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'tracker', label: 'Live Dispatch', icon: <Navigation className="w-4 h-4" /> },
    { id: 'admin_clients', label: 'Admin Client Roster', icon: <ShieldCheck className="w-4 h-4 text-amber-500" />, isAdminOnly: true },
    { id: 'staff', label: 'Staff Crew', icon: <Users className="w-4 h-4" /> },
    { id: 'analytics', label: 'Perth Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & Cloud', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNavClick = (item: typeof menuItems[0]) => {
    if (item.isAdminOnly && !isAdminLoggedIn) {
      openAdminLoginModal();
    } else {
      setCurrentView(item.id);
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-4 shrink-0 min-h-[calc(100vh-4rem)] justify-between">
      <div className="flex flex-col gap-6">
        
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
            Operations Menu
          </p>
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            const isLocked = item.isAdminOnly && !isAdminLoggedIn;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-100 dark:bg-amber-950/40 text-neutral-950 dark:text-amber-200 font-bold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {isLocked ? (
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                ) : item.id === 'admin_clients' ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-mono tabular-nums">
                    {activeClientsCount}
                  </span>
                ) : item.id === 'tracker' && activeJobsCount > 0 ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-mono tabular-nums">
                    {activeJobsCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Real-time Status Card */}
        <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Available Staff
            </span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 font-mono tabular-nums">
              {availableCleanersCount} / {cleaners.length}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Active Perth Jobs
            </span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 font-mono tabular-nums">
              {activeJobsCount}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pt-1 border-t border-neutral-200/60 dark:border-neutral-700/60">
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Perth WA Metro Coverage</span>
          </div>
        </div>

      </div>

      {/* Share / Promo Card */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/40 dark:from-amber-950/20 dark:to-neutral-900 border border-amber-200/80 dark:border-amber-900/40">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">🐝</span>
            <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
              DBuzzingBees Referrals
            </span>
          </div>
          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed mb-2.5">
            Refer a Perth neighbour and get $30 credit toward your next clean or mow!
          </p>
          <button
            onClick={openShareModal}
            className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-neutral-950 transition-colors cursor-pointer text-center"
          >
            Copy Referral Code
          </button>
        </div>

        <div className="flex items-center justify-between px-2 text-[11px] text-neutral-500">
          <span>ABN 54 182 904 772</span>
          <span className="font-mono text-[10px]">v3.0 WA</span>
        </div>
      </div>
    </aside>
  );
};
