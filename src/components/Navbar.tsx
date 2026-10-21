import React from 'react';
import { Sparkles, Bell, Sun, Moon, ShieldCheck, Lock, UserCheck } from 'lucide-react';
import { AppView, UserSettings } from '../types';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  unreadNotifsCount: number;
  openNotifCenter: () => void;
  openBookingModal: () => void;
  isAdminLoggedIn: boolean;
  openAdminLoginModal: () => void;
  onLogoutAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  settings,
  setSettings,
  unreadNotifsCount,
  openNotifCenter,
  openBookingModal,
  isAdminLoggedIn,
  openAdminLoginModal,
  onLogoutAdmin
}) => {
  const viewTitles: Record<AppView, string> = {
    services: 'Services',
    bookings: 'Bookings & Jobs',
    tracker: 'Live Dispatch',
    admin_clients: 'Admin Client Roster',
    staff: 'Staff Crew',
    analytics: 'Perth Analytics',
    settings: 'Settings'
  };

  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    setSettings(prev => ({ ...prev, theme: nextTheme }));
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand & Perth Tagline */}
        <div className="flex items-center gap-3 shrink-0">
          <div 
            onClick={() => setCurrentView('services')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-neutral-950 font-bold flex items-center justify-center text-lg shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
              🐝
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-neutral-900 dark:text-white leading-none">
                DBuzzingBees
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold tracking-wider">
                PERTH · WA
              </span>
            </div>
          </div>

          <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">/</span>
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hidden sm:inline whitespace-nowrap">
            {viewTitles[currentView]}
          </span>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-400">
          <button
            onClick={() => setCurrentView('services')}
            className={`whitespace-nowrap transition-colors hover:text-amber-600 dark:hover:text-amber-400 ${
              currentView === 'services' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
            }`}
          >
            Services
          </button>

          <button
            onClick={() => setCurrentView('bookings')}
            className={`whitespace-nowrap transition-colors hover:text-amber-600 dark:hover:text-amber-400 ${
              currentView === 'bookings' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
            }`}
          >
            Bookings
          </button>

          <button
            onClick={() => setCurrentView('tracker')}
            className={`whitespace-nowrap transition-colors hover:text-amber-600 dark:hover:text-amber-400 ${
              currentView === 'tracker' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
            }`}
          >
            Live Tracker
          </button>

          {/* Admin Client Roster Link */}
          <button
            onClick={() => {
              if (isAdminLoggedIn) {
                setCurrentView('admin_clients');
              } else {
                openAdminLoginModal();
              }
            }}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-amber-600 dark:hover:text-amber-400 ${
              currentView === 'admin_clients' 
                ? 'text-amber-600 dark:text-amber-400 font-bold' 
                : 'text-neutral-800 dark:text-neutral-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Admin Roster</span>
            {!isAdminLoggedIn && <Lock className="w-3 h-3 text-neutral-400" />}
          </button>

          <button
            onClick={() => setCurrentView('staff')}
            className={`whitespace-nowrap transition-colors hover:text-amber-600 dark:hover:text-amber-400 ${
              currentView === 'staff' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
            }`}
          >
            Staff Crew
          </button>

          <button
            onClick={() => setCurrentView('analytics')}
            className={`whitespace-nowrap transition-colors hover:text-amber-600 dark:hover:text-amber-400 ${
              currentView === 'analytics' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
            }`}
          >
            Analytics
          </button>
        </nav>

        {/* Zone 3: Controls & Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Admin Status Badge */}
          {isAdminLoggedIn ? (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Admin Logged In</span>
            </div>
          ) : (
            <button
              onClick={openAdminLoginModal}
              className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={handleToggleTheme}
            title={settings.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={openNotifCenter}
            title="Real-Time Alerts"
            className="relative p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Book Now Primary Button */}
          <button
            onClick={openBookingModal}
            className="px-4 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-500 active:scale-95 rounded-lg shadow-sm shadow-amber-500/20 transition-all whitespace-nowrap cursor-pointer"
          >
            Book Perth Clean
          </button>

        </div>
      </div>
    </header>
  );
};
