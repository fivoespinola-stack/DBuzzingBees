export type Language = 'en' | 'fil' | 'ceb' | 'ilo';

export type AppView = 
  | 'services'
  | 'bookings'
  | 'tracker'
  | 'admin_clients'
  | 'staff'
  | 'analytics'
  | 'settings';

export type CleanType = 
  | 'residential' 
  | 'commercial' 
  | 'vacate' 
  | 'window' 
  | 'mowing';

export type FrequencyType = 
  | 'weekly'
  | 'fortnightly'
  | 'monthly'
  | 'end_of_month'
  | 'twice_a_week'
  | 'every_3rd_week'
  | 'every_2_months'
  | 'flexible'
  | 'once';

export type DayOfWeek = 
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'
  | 'Flexible';

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'en_route'
  | 'in_progress'
  | 'inspecting'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'unpaid' | 'paid' | 'invoiced';

export type PaymentMethod = 'card' | 'bank_transfer' | 'stripe' | 'cash';

export interface CleaningService {
  id: CleanType;
  title: string;
  tagline: string;
  desc: string;
  basePrice: number; // in AUD
  rateUnit: string; // e.g. "per hour" or "flat rate"
  durationMinutes: number;
  image: string;
  features: string[];
  recommendedTeamSize: number;
}

export interface ServiceAddon {
  id: string;
  name: string;
  price: number;
  iconName: string;
}

export interface AdminClient {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  address: string; // Perth Suburb / WA
  cleanType: CleanType;
  rate: number; // AUD $
  rateType: 'hourly' | 'flat';
  frequency: FrequencyType;
  hours: number; // Ilang oras lilinisin
  scheduledDay: DayOfWeek; // Anong araw
  scheduledDate: string; // Date (YYYY-MM-DD)
  cleanerAssigned: string; // Sino ang maglilinis
  remarks: string; // Remarks, key codes, special notes
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export interface Cleaner {
  id: string;
  name: string;
  role: string;
  avatar: string;
  phone: string;
  rating: number;
  completedJobs: number;
  status: 'available' | 'on_duty' | 'on_leave';
  specialties: string[];
  hourlyRate: number; // in AUD
  earnings: number;
  bio: string;
  policeCheck: string;
}

export interface BookingTask {
  id: string;
  label: string;
  completed: boolean;
}

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  address: string;
  suburb: string; // Perth WA Suburb
  serviceId: CleanType;
  serviceTitle: string;
  frequency: FrequencyType;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  hours: number;
  cleanerId: string;
  cleanerName: string;
  cleanerAvatar: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  totalAmount: number; // in AUD
  tipAmount: number;
  discountAmount: number;
  promoCode?: string;
  tasks: BookingTask[];
  notes?: string;
  createdAt: string;
  rating?: number;
  reviewComment?: string;
  reviewTags?: string[];
  reviewDate?: string;
  providerReply?: string;
  enRouteMinutesLeft?: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'booking' | 'payment' | 'staff' | 'sync' | 'security';
  actionView?: AppView;
}

export interface UserSettings {
  language: 'en';
  theme: 'light' | 'dark' | 'system';
  biometricsEnabled: boolean;
  biometricType: 'fingerprint' | 'faceid';
  soundEnabled: boolean;
  pushNotificationsEnabled: boolean;
  currency: 'AUD';
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  abnNumber: string; // Australian Business Number
  gstPercent: number; // 10% Australian GST
  taxRatePercent?: number;
}
