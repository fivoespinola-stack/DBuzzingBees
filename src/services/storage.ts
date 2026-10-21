import { Booking, Cleaner, AdminClient, AppNotification, UserSettings } from '../types';
import { INITIAL_SERVICES, INITIAL_CLEANERS, INITIAL_BOOKINGS, INITIAL_CLIENTS, INITIAL_NOTIFICATIONS, DEFAULT_SETTINGS } from './mockData';

const STORAGE_KEYS = {
  BOOKINGS: 'dbuzzingbees_bookings_v2',
  CLEANERS: 'dbuzzingbees_cleaners_v2',
  CLIENTS: 'dbuzzingbees_clients_v2',
  NOTIFICATIONS: 'dbuzzingbees_notifs_v2',
  SETTINGS: 'dbuzzingbees_settings_v2',
  ADMIN_SESSION: 'dbuzzingbees_admin_auth_v2',
  LAST_BACKUP: 'dbuzzingbees_last_backup_v2',
};

export const loadClients = (): AdminClient[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return data ? JSON.parse(data) : INITIAL_CLIENTS;
  } catch (e) {
    return INITIAL_CLIENTS;
  }
};

export const saveClients = (clients: AdminClient[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
};

export const loadBookings = (): Booking[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return data ? JSON.parse(data) : INITIAL_BOOKINGS;
  } catch (e) {
    return INITIAL_BOOKINGS;
  }
};

export const saveBookings = (bookings: Booking[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
};

export const loadCleaners = (): Cleaner[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CLEANERS);
    return data ? JSON.parse(data) : INITIAL_CLEANERS;
  } catch (e) {
    return INITIAL_CLEANERS;
  }
};

export const saveCleaners = (cleaners: Cleaner[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CLEANERS, JSON.stringify(cleaners));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
};

export const loadNotifications = (): AppNotification[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
};

export const saveNotifications = (notifs: AppNotification[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
};

export const loadSettings = (): UserSettings => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: UserSettings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
};

export const loadAdminSession = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
  } catch (e) {
    return false;
  }
};

export const saveAdminSession = (isAuthenticated: boolean) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, isAuthenticated ? 'true' : 'false');
  } catch (e) {}
};

export const getLastBackupTime = (): string => {
  return localStorage.getItem(STORAGE_KEYS.LAST_BACKUP) || '2026-10-21 07:00 AM AWST';
};

export const setLastBackupTime = (time: string) => {
  localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, time);
};

// Web Audio API Sound Chime Generator
export const playSoundChime = (type: 'notification' | 'success' | 'tap' | 'scan') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (type === 'notification') {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      osc2.frequency.setValueAtTime(880, now + 0.12);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start(now);
      osc1.stop(now + 0.12);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.45);
    } else if (type === 'success') {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.1, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } else if (type === 'scan') {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.18);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {}
};

export const triggerPushNotification = async (title: string, body: string) => {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: '/favicon.ico' });
      } catch (e) {}
    } else if (Notification.permission !== 'denied') {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification(title, { body });
        }
      } catch (e) {}
    }
  }
};

export const exportToCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(val => {
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadJSONBackup = (data: any, filename: string) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
