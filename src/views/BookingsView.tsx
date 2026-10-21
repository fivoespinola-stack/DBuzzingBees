import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Navigation, 
  CreditCard, 
  Star, 
  Plus,
  Receipt
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';

interface BookingsViewProps {
  bookings: Booking[];
  onOpenTracker: (booking: Booking) => void;
  onOpenPayment: (booking: Booking) => void;
  onOpenReview: (booking: Booking) => void;
  onOpenNewBooking: () => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  onOpenTracker,
  onOpenPayment,
  onOpenReview,
  onOpenNewBooking
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'unpaid'>('all');

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.suburb.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'active') {
      return b.status === 'confirmed' || b.status === 'en_route' || b.status === 'in_progress' || b.status === 'inspecting';
    }
    if (statusFilter === 'completed') {
      return b.status === 'completed';
    }
    if (statusFilter === 'unpaid') {
      return b.paymentStatus === 'unpaid';
    }
    return true;
  });

  const getStatusBadge = (st: BookingStatus) => {
    switch (st) {
      case 'in_progress':
        return <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">In Progress</span>;
      case 'en_route':
        return <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">En Route</span>;
      case 'completed':
        return <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">Completed</span>;
      case 'confirmed':
        return <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">Confirmed</span>;
      default:
        return <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">{st}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
            Job Bookings & Appointments
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitor real-time cleaning schedules, Perth dispatch routes, and customer payments.
          </p>
        </div>

        <button
          onClick={onOpenNewBooking}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Service</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by client name, address, Perth suburb, or booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs focus:outline-amber-500 text-neutral-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto">
          {(['all', 'active', 'completed', 'unpaid'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer capitalize ${
                statusFilter === tab
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
            <Calendar className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto" />
            <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              No matching bookings found
            </div>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Schedule a Perth cleaning or mowing appointment to start tracking!
            </p>
            <button
              onClick={onOpenNewBooking}
              className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 text-xs font-bold hover:bg-amber-500 transition-colors cursor-pointer"
            >
              Book Service
            </button>
          </div>
        ) : (
          filteredBookings.map((bk) => (
            <div
              key={bk.id}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">
                    #{bk.id}
                  </span>
                  <span>·</span>
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {bk.serviceTitle}
                  </span>
                  <span>·</span>
                  <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                    {bk.frequency.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(bk.status)}
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                    bk.paymentStatus === 'paid' 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' 
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                  }`}>
                    {bk.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Main Booking Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-neutral-900 dark:text-white">
                    {bk.clientName}
                  </div>
                  <div className="text-neutral-500 font-mono text-[11px]">
                    {bk.clientPhone}
                  </div>
                  <div className="flex items-start gap-1 text-neutral-600 dark:text-neutral-400 text-[11px] pt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="truncate">{bk.address}, {bk.suburb}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-neutral-400">Assigned Specialist:</div>
                  <div className="flex items-center gap-2">
                    <img 
                      src={bk.cleanerAvatar} 
                      alt={bk.cleanerName} 
                      className="w-7 h-7 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {bk.cleanerName}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Perth Metro Dispatch
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 sm:text-right">
                  <div className="text-neutral-500 flex items-center sm:justify-end gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>{bk.scheduledDate} · {bk.scheduledTime} ({bk.hours}h)</span>
                  </div>
                  <div className="text-base font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
                    ${bk.totalAmount.toFixed(2)} AUD
                  </div>
                  {bk.tipAmount > 0 && (
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">
                      +${bk.tipAmount.toFixed(2)} tip included
                    </div>
                  )}
                </div>
              </div>

              {/* Review snippet if present */}
              {bk.reviewComment && (
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 text-xs space-y-1">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: bk.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="text-[11px] text-neutral-500 font-mono ml-1">
                      {bk.reviewDate?.split('T')[0]}
                    </span>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 italic text-[11px]">
                    "{bk.reviewComment}"
                  </p>
                  {bk.providerReply && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 pt-0.5">
                      <strong>DBuzzingBees Response:</strong> {bk.providerReply}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => onOpenTracker(bk)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-500" />
                  <span>Track Dispatch</span>
                </button>

                {bk.paymentStatus === 'unpaid' ? (
                  <button
                    type="button"
                    onClick={() => onOpenPayment(bk)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay ${bk.totalAmount.toFixed(2)} AUD</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenPayment(bk)}
                    className="px-3.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-1 transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tax Invoice</span>
                  </button>
                )}

                {bk.status === 'completed' && !bk.reviewComment && (
                  <button
                    type="button"
                    onClick={() => onOpenReview(bk)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Leave Review</span>
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
