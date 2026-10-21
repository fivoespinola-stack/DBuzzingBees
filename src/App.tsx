import React, { useState, useEffect } from 'react';
import { 
  Booking, 
  Cleaner, 
  AdminClient,
  AppNotification, 
  UserSettings, 
  AppView, 
  PaymentMethod,
  BookingStatus,
  CleanType
} from './types';
import { 
  INITIAL_SERVICES, 
  INITIAL_CLEANERS, 
  INITIAL_BOOKINGS, 
  INITIAL_CLIENTS, 
  INITIAL_NOTIFICATIONS, 
  DEFAULT_SETTINGS 
} from './services/mockData';
import { 
  loadBookings, 
  saveBookings, 
  loadCleaners, 
  saveCleaners, 
  loadClients,
  saveClients,
  loadNotifications, 
  saveNotifications, 
  loadSettings, 
  saveSettings, 
  loadAdminSession,
  saveAdminSession,
  playSoundChime,
  triggerPushNotification
} from './services/storage';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { BookingModal } from './components/BookingModal';
import { TrackerModal } from './components/TrackerModal';
import { PaymentModal } from './components/PaymentModal';
import { ReviewModal } from './components/ReviewModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ShareModal } from './components/ShareModal';
import { NotificationCenter } from './components/NotificationCenter';

// Views
import { ServicesView } from './views/ServicesView';
import { BookingsView } from './views/BookingsView';
import { AdminClientsView } from './views/AdminClientsView';
import { StaffView } from './views/StaffView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('services');
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [services] = useState(INITIAL_SERVICES);
  const [cleaners, setCleaners] = useState<Cleaner[]>(loadCleaners);
  const [bookings, setBookings] = useState<Booking[]>(loadBookings);
  const [clients, setClients] = useState<AdminClient[]>(loadClients);
  const [notifications, setNotifications] = useState<AppNotification[]>(loadNotifications);
  
  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(loadAdminSession);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<CleanType | undefined>();
  const [trackedBooking, setTrackedBooking] = useState<Booking | null>(null);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [payingBooking, setPayingBooking] = useState<Booking | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNotifCenterOpen, setIsNotifCenterOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    saveBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    saveClients(clients);
  }, [clients]);

  useEffect(() => {
    saveCleaners(cleaners);
  }, [cleaners]);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveAdminSession(isAdminLoggedIn);
  }, [isAdminLoggedIn]);

  // Apply Theme on mount
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  // Add Notification helper
  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);

    if (settings.soundEnabled) {
      playSoundChime('notification');
    }
    if (settings.pushNotificationsEnabled) {
      triggerPushNotification(newNotif.title, newNotif.message);
    }
  };

  // Admin Login Handlers
  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setCurrentView('admin_clients');
    addNotification({
      title: 'Admin Session Activated 🛡️',
      message: 'Logged in as DBuzzingBees Administrator. Full Perth client roster unlocked.',
      type: 'security',
      actionView: 'admin_clients'
    });
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('services');
    addNotification({
      title: 'Admin Session Ended',
      message: 'Logged out of DBuzzingBees Admin Portal.',
      type: 'security',
      actionView: 'services'
    });
  };

  // Client CRUD Handlers
  const handleAddClient = (newClient: AdminClient) => {
    setClients(prev => [newClient, ...prev]);
    addNotification({
      title: 'New Perth Client Added 📋',
      message: `${newClient.clientName} (${newClient.cleanType}) was added to the client roster.`,
      type: 'booking',
      actionView: 'admin_clients'
    });
    if (settings.soundEnabled) playSoundChime('success');
  };

  const handleUpdateClient = (updatedClient: AdminClient) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    addNotification({
      title: 'Client Agreement Updated ✏️',
      message: `Updated records for ${updatedClient.clientName}.`,
      type: 'booking',
      actionView: 'admin_clients'
    });
    if (settings.soundEnabled) playSoundChime('tap');
  };

  const handleDeleteClient = (clientId: string) => {
    const target = clients.find(c => c.id === clientId);
    setClients(prev => prev.filter(c => c.id !== clientId));
    addNotification({
      title: 'Client Agreement Archived 🗑️',
      message: `Archived client agreement for ${target?.clientName || clientId}.`,
      type: 'booking',
      actionView: 'admin_clients'
    });
  };

  // Handle new booking
  const handleConfirmBooking = (newBookingData: Omit<Booking, 'id' | 'createdAt' | 'tasks'>) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: `BB-${Math.floor(8000 + Math.random() * 1999)}`,
      createdAt: new Date().toISOString(),
      tasks: [
        { id: 't1', label: 'Dusting & surface disinfection', completed: false },
        { id: 't2', label: 'Kitchen & bathroom deep clean', completed: false },
        { id: 't3', label: 'HEPA vacuuming & hard floor mopping', completed: false },
        { id: 't4', label: 'Rubbish disposal & bin liners changed', completed: false },
        { id: 't5', label: 'Quality inspection & lockup', completed: false }
      ]
    };

    setBookings(prev => [newBooking, ...prev]);

    // Also auto-add to Admin Client Roster if new client
    const newClientAgreement: AdminClient = {
      id: `CL-${Math.floor(100 + Math.random() * 900)}`,
      clientName: newBooking.clientName,
      phone: newBooking.clientPhone,
      email: newBooking.clientEmail,
      address: `${newBooking.address}, ${newBooking.suburb}`,
      cleanType: newBooking.serviceId,
      rate: newBooking.totalAmount,
      rateType: 'flat',
      frequency: newBooking.frequency,
      hours: newBooking.hours,
      scheduledDay: 'Monday',
      scheduledDate: newBooking.scheduledDate,
      cleanerAssigned: newBooking.cleanerName,
      remarks: newBooking.notes || 'Online DBuzzingBees booking',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClients(prev => [newClientAgreement, ...prev]);

    addNotification({
      title: 'DBuzzingBees Booking Confirmed 🐝',
      message: `${newBooking.serviceTitle} for ${newBooking.clientName} in ${newBooking.suburb}. Staff: ${newBooking.cleanerName}.`,
      type: 'booking',
      actionView: 'bookings'
    });

    setTrackedBooking(newBooking);
    setIsTrackerModalOpen(true);
  };

  // Update Booking Status
  const handleUpdateStatus = (bookingId: string, nextStatus: BookingStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: nextStatus };
      }
      return b;
    }));

    if (trackedBooking && trackedBooking.id === bookingId) {
      setTrackedBooking(prev => prev ? { ...prev, status: nextStatus } : null);
    }

    addNotification({
      title: `Dispatch Update: ${nextStatus.toUpperCase()} 🔄`,
      message: `Booking #${bookingId} is now ${nextStatus.replace('_', ' ')}.`,
      type: 'booking',
      actionView: 'tracker'
    });
  };

  // Toggle checklist tasks
  const handleToggleTask = (bookingId: string, taskId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const updatedTasks = b.tasks.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        return { ...b, tasks: updatedTasks };
      }
      return b;
    }));

    if (trackedBooking && trackedBooking.id === bookingId) {
      setTrackedBooking(prev => {
        if (!prev) return null;
        const updatedTasks = prev.tasks.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        return { ...prev, tasks: updatedTasks };
      });
    }

    if (settings.soundEnabled) {
      playSoundChime('tap');
    }
  };

  // Process payment
  const handlePaymentSuccess = (bookingId: string, method: PaymentMethod, tip: number) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { 
          ...b, 
          paymentStatus: 'paid', 
          paymentMethod: method, 
          tipAmount: tip 
        };
      }
      return b;
    }));

    const targetBooking = bookings.find(b => b.id === bookingId);
    if (targetBooking) {
      setCleaners(prev => prev.map(c => {
        if (c.id === targetBooking.cleanerId) {
          const cut = Math.round(targetBooking.totalAmount * 0.70);
          return {
            ...c,
            earnings: c.earnings + cut + tip,
            completedJobs: c.completedJobs + 1
          };
        }
        return c;
      }));
    }

    addNotification({
      title: `Payment Processed $${((targetBooking?.totalAmount || 0) + tip).toFixed(2)} AUD 💳`,
      message: `Settled via ${method.toUpperCase()} for Booking #${bookingId}. Tip: $${tip} AUD.`,
      type: 'payment',
      actionView: 'admin_clients'
    });
  };

  // Submit Review
  const handleSubmitReview = (bookingId: string, rating: number, comment: string, tags: string[]) => {
    const target = bookings.find(b => b.id === bookingId);
    const reply = "Thank you so much for choosing DBuzzingBees Perth! We truly appreciate your trust and look forward to keeping your property spotless.";

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          rating,
          reviewComment: comment,
          reviewTags: tags,
          reviewDate: new Date().toISOString(),
          providerReply: reply
        };
      }
      return b;
    }));

    if (target) {
      setCleaners(prev => prev.map(c => {
        if (c.id === target.cleanerId) {
          const newAvg = Number(((c.rating * c.completedJobs + rating) / (c.completedJobs + 1)).toFixed(2));
          return { ...c, rating: newAvg };
        }
        return c;
      }));
    }

    addNotification({
      title: `New ${rating}-Star Review Received ⭐`,
      message: `${target?.clientName || 'Client'} left a review: "${comment.slice(0, 50)}..."`,
      type: 'staff',
      actionView: 'bookings'
    });

    if (settings.soundEnabled) playSoundChime('success');
  };

  // Add new cleaner
  const handleAddCleaner = (newCleaner: Cleaner) => {
    setCleaners(prev => [newCleaner, ...prev]);
    addNotification({
      title: `New Perth Specialist Registered 👤`,
      message: `${newCleaner.name} was added with WA Police Check verification.`,
      type: 'staff',
      actionView: 'staff'
    });
  };

  // Update cleaner status
  const handleUpdateCleanerStatus = (cleanerId: string, status: Cleaner['status']) => {
    setCleaners(prev => prev.map(c => 
      c.id === cleanerId ? { ...c, status } : c
    ));
  };

  // Factory reset demo data
  const handleResetFactoryData = () => {
    if (window.confirm("Reset all DBuzzingBees demo client rosters and bookings to default sample data?")) {
      setBookings(INITIAL_BOOKINGS);
      setClients(INITIAL_CLIENTS);
      setCleaners(INITIAL_CLEANERS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setSettings(DEFAULT_SETTINGS);
      playSoundChime('success');
    }
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;
  const activeJobsCount = bookings.filter(b => b.status === 'in_progress' || b.status === 'en_route').length;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-amber-400/30 selection:text-neutral-900">
      
      {/* Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        settings={settings}
        setSettings={setSettings}
        unreadNotifsCount={unreadNotifsCount}
        openNotifCenter={() => setIsNotifCenterOpen(true)}
        openBookingModal={() => {
          setSelectedServiceId('residential');
          setIsBookingModalOpen(true);
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        openAdminLoginModal={() => setIsAdminLoginModalOpen(true)}
        onLogoutAdmin={handleAdminLogout}
      />

      {/* Main Workspace Body with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Desktop Sidebar */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          cleaners={cleaners}
          bookings={bookings}
          clients={clients}
          isAdminLoggedIn={isAdminLoggedIn}
          openAdminLoginModal={() => setIsAdminLoginModalOpen(true)}
          openShareModal={() => setIsShareModalOpen(true)}
        />

        {/* Viewport Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-5xl">
          {currentView === 'services' && (
            <ServicesView
              services={services}
              onSelectService={(srvId) => {
                setSelectedServiceId(srvId);
                setIsBookingModalOpen(true);
              }}
            />
          )}

          {currentView === 'bookings' && (
            <BookingsView
              bookings={bookings}
              onOpenTracker={(bk) => {
                setTrackedBooking(bk);
                setIsTrackerModalOpen(true);
              }}
              onOpenPayment={(bk) => {
                setPayingBooking(bk);
                setIsPaymentModalOpen(true);
              }}
              onOpenReview={(bk) => {
                setReviewingBooking(bk);
                setIsReviewModalOpen(true);
              }}
              onOpenNewBooking={() => {
                setSelectedServiceId('residential');
                setIsBookingModalOpen(true);
              }}
            />
          )}

          {currentView === 'tracker' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 mb-1">
                  <span>🐝</span>
                  <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
                    Perth WA Live Cleaner Dispatch & GPS Tracker
                  </h1>
                </div>
                <p className="text-xs text-neutral-500 mb-6">
                  Select any active Perth booking below to inspect real-time specialist location and quality checklists.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bookings.map((bk) => (
                    <div
                      key={bk.id}
                      onClick={() => {
                        setTrackedBooking(bk);
                        setIsTrackerModalOpen(true);
                      }}
                      className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-amber-400 dark:hover:border-amber-400 bg-neutral-50/50 dark:bg-neutral-800/40 cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-neutral-900 dark:text-white">#{bk.id}</span>
                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 capitalize">{bk.status.replace('_', ' ')}</span>
                      </div>
                      <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        {bk.serviceTitle}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate">
                        {bk.address}, {bk.suburb}
                      </div>
                      <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-1 border-t border-neutral-200/60 dark:border-neutral-700/60">
                        <span>Staff: {bk.cleanerName}</span>
                        <span className="font-mono font-semibold text-neutral-700 dark:text-neutral-300">${bk.totalAmount.toFixed(2)} AUD</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'admin_clients' && (
            <AdminClientsView
              clients={clients}
              cleaners={cleaners}
              onAddClient={handleAddClient}
              onUpdateClient={handleUpdateClient}
              onDeleteClient={handleDeleteClient}
              onLogoutAdmin={handleAdminLogout}
            />
          )}

          {currentView === 'staff' && (
            <StaffView
              cleaners={cleaners}
              onAddCleaner={handleAddCleaner}
              onUpdateCleanerStatus={handleUpdateCleanerStatus}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView
              bookings={bookings}
              cleaners={cleaners}
              clients={clients}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              settings={settings}
              setSettings={setSettings}
              onResetFactoryData={handleResetFactoryData}
              isAdminLoggedIn={isAdminLoggedIn}
              openAdminLoginModal={() => setIsAdminLoginModalOpen(true)}
              onLogoutAdmin={handleAdminLogout}
            />
          )}
        </main>

      </div>

      {/* Mobile Touch Bottom Navigation */}
      <BottomNav
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeJobsCount={activeJobsCount}
        isAdminLoggedIn={isAdminLoggedIn}
        openAdminLoginModal={() => setIsAdminLoginModalOpen(true)}
      />

      {/* Booking Wizard Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        services={services}
        cleaners={cleaners}
        selectedServiceId={selectedServiceId}
        onConfirmBooking={handleConfirmBooking}
      />

      {/* Live Dispatch Tracker Modal */}
      <TrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
        booking={trackedBooking}
        onUpdateStatus={handleUpdateStatus}
        onToggleTask={handleToggleTask}
        onOpenPaymentAndReview={(bk) => {
          setPayingBooking(bk);
          setIsPaymentModalOpen(true);
        }}
      />

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        booking={payingBooking}
        onPaymentSuccess={handlePaymentSuccess}
        onProceedToReview={(bk) => {
          setReviewingBooking(bk);
          setIsReviewModalOpen(true);
        }}
      />

      {/* Review & Rating Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        booking={reviewingBooking}
        onSubmitReview={handleSubmitReview}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Social Media & Referral Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Real-time Notifications Slide-over Drawer */}
      <NotificationCenter
        isOpen={isNotifCenterOpen}
        onClose={() => setIsNotifCenterOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        onClearAll={() => setNotifications([])}
        onSelectAction={(view) => setCurrentView(view)}
        language="en"
      />

    </div>
  );
}
