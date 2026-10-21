import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Check, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Tag
} from 'lucide-react';
import { CleaningService, ServiceAddon, Cleaner, Booking, CleanType, FrequencyType, PaymentMethod } from '../types';
import { SERVICE_ADDONS } from '../services/mockData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: CleaningService[];
  cleaners: Cleaner[];
  selectedServiceId?: CleanType;
  onConfirmBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'tasks'>) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  services,
  cleaners,
  selectedServiceId,
  onConfirmBooking
}) => {
  const [step, setStep] = useState<number>(1);
  const [serviceId, setServiceId] = useState<CleanType>(selectedServiceId || 'residential');
  const [frequency, setFormFrequency] = useState<FrequencyType>('fortnightly');
  const [hours, setHours] = useState<number>(3.0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState<string>('09:00');
  const [cleanerId, setCleanerId] = useState<string>('any');
  
  // Client details (Perth WA)
  const [clientName, setClientName] = useState<string>('Charlotte Henderson');
  const [clientPhone, setClientPhone] = useState<string>('0412 884 192');
  const [clientEmail, setClientEmail] = useState<string>('charlotte.h@westnet.com.au');
  const [address, setAddress] = useState<string>('42 Marine Parade');
  const [suburb, setSuburb] = useState<string>('Cottesloe WA 6011');
  const [notes, setNotes] = useState<string>('Side gate unlocked; Golden Retriever in backyard.');
  
  // Promo code
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  if (!isOpen) return null;

  const currentService = services.find(s => s.id === serviceId) || services[0];

  // Price calculations in AUD
  let calculatedBasePrice = currentService.basePrice;
  if (currentService.id === 'residential') {
    calculatedBasePrice = currentService.basePrice * hours;
  } else if (currentService.id === 'commercial') {
    calculatedBasePrice = currentService.basePrice * hours;
  }

  const addonsTotal = selectedAddons.reduce((acc, addonId) => {
    const item = SERVICE_ADDONS.find(a => a.id === addonId);
    return acc + (item ? item.price : 0);
  }, 0);

  const subtotal = calculatedBasePrice + addonsTotal;
  const grandTotal = Math.max(0, subtotal - promoDiscount);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleApplyPromo = () => {
    const cleanCode = promoCodeInput.trim().toUpperCase();
    if (cleanCode === 'BUZZING20' || cleanCode === 'PERTH20') {
      setPromoDiscount(20);
      setPromoMessage({ text: '$20 AUD discount applied!', isError: false });
    } else if (cleanCode === 'SPRING10') {
      const discount = Math.round(subtotal * 0.10);
      setPromoDiscount(discount);
      setPromoMessage({ text: `10% off ($${discount} AUD) applied!`, isError: false });
    } else {
      setPromoDiscount(0);
      setPromoMessage({ text: 'Invalid promo code. Try BUZZING20', isError: true });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let assignedCleaner = cleaners.find(c => c.id === cleanerId);
    if (!assignedCleaner) {
      const available = cleaners.filter(c => c.status === 'available');
      assignedCleaner = available.length > 0 ? available[0] : cleaners[0];
    }

    onConfirmBooking({
      clientName,
      clientPhone,
      clientEmail,
      address,
      suburb,
      serviceId: currentService.id,
      serviceTitle: currentService.title,
      frequency,
      scheduledDate,
      scheduledTime,
      hours,
      cleanerId: assignedCleaner.id,
      cleanerName: assignedCleaner.name,
      cleanerAvatar: assignedCleaner.avatar,
      status: 'confirmed',
      paymentStatus: paymentMethod === 'cash' ? 'unpaid' : 'paid',
      paymentMethod,
      totalAmount: grandTotal,
      tipAmount: 0,
      discountAmount: promoDiscount,
      promoCode: promoDiscount > 0 ? promoCodeInput.toUpperCase() : undefined,
      notes,
      enRouteMinutesLeft: 25
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 my-8 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🐝</span>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Book DBuzzingBees Service (Perth WA)
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
              <span>{step === 1 ? '1. Select Service & Frequency' : step === 2 ? '2. Schedule & Cleaner' : step === 3 ? '3. Perth Address & Contact' : '4. Payment & Confirmation'}</span>
              <span>·</span>
              <span>Step {step} of 4</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: Select from the 5 Perth services & frequency */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Select Clean Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {services.map((srv) => (
                    <button
                      type="button"
                      key={srv.id}
                      onClick={() => setServiceId(srv.id)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                        serviceId === srv.id
                          ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-400'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="font-bold text-neutral-900 dark:text-white mb-0.5">
                        {srv.title}
                      </div>
                      <div className="text-neutral-500 text-[11px] font-mono tabular-nums">
                        {srv.rateUnit}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Frequency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Frequency Type
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFormFrequency(e.target.value as FrequencyType)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-amber-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="fortnightly">Fortnightly</option>
                    <option value="monthly">Monthly</option>
                    <option value="end_of_month">End of the month</option>
                    <option value="twice_a_week">Twice a week</option>
                    <option value="every_3rd_week">Every 3rd week</option>
                    <option value="every_2_months">Every 2 months</option>
                    <option value="flexible">Flexible</option>
                    <option value="once">Once (One-off)</option>
                  </select>
                </div>

                {(serviceId === 'residential' || serviceId === 'commercial') && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Estimated Duration (Hours)
                    </label>
                    <div className="flex items-center gap-2">
                      {[2.0, 2.5, 3.0, 4.0, 5.0].map((h) => (
                        <button
                          type="button"
                          key={h}
                          onClick={() => setHours(h)}
                          className={`flex-1 py-2 rounded-lg text-xs font-mono font-medium border transition-colors ${
                            hours === h
                              ? 'border-amber-400 bg-amber-400 text-neutral-950 font-bold'
                              : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          {h}h
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Addons */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Optional Add-on Tasks
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SERVICE_ADDONS.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20 text-neutral-950 dark:text-amber-200'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isChecked ? 'bg-amber-500 border-amber-500 text-neutral-950' : 'border-neutral-300 dark:border-neutral-600'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="font-medium">{addon.name}</span>
                        </div>
                        <span className="font-mono text-neutral-500 dark:text-neutral-400 tabular-nums">
                          +${addon.price} AUD
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Time & Cleaner Selection */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  Scheduled Clean Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Arrival Window
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {['08:00 AM', '09:30 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM'].map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setScheduledTime(slot)}
                      className={`py-2 px-3 rounded-xl border text-xs font-mono font-medium text-center transition-all ${
                        scheduledTime === slot
                          ? 'border-amber-400 bg-amber-400 text-neutral-950 font-bold'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Preferred Specialist (Optional)
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setCleanerId('any')}
                    className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      cleanerId === 'any'
                        ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20 text-neutral-900 dark:text-white'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">Nearest Available DBuzzingBees Team Member</div>
                      <div className="text-neutral-500 text-[11px]">Auto-allocated by Perth GPS dispatch radius</div>
                    </div>
                    {cleanerId === 'any' && <Check className="w-4 h-4 text-amber-500" />}
                  </button>

                  {cleaners.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCleanerId(c.id)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                        cleanerId === c.id
                          ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20 text-neutral-900 dark:text-white'
                          : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={c.avatar} 
                          alt={c.name} 
                          className="w-8 h-8 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-semibold">{c.name}</div>
                          <div className="text-[11px] text-neutral-500 font-mono">
                            ★ {c.rating} · {c.specialties[0]}
                          </div>
                        </div>
                      </div>
                      {cleanerId === c.id && <Check className="w-4 h-4 text-amber-500" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Perth WA Address & Contact Details */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    Australian Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  Email Address for Invoices
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 42 Marine Parade"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Perth Suburb & Postcode (WA)
                </label>
                <input
                  type="text"
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  placeholder="e.g. Cottesloe WA 6011"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Access Notes / Key Safe Code / Pets on Premises
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Key safe 4821 by side gate; friendly Golden Retriever in backyard."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-amber-500"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Review, Promo & Payment */}
          {step === 4 && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>{currentService.title} ({frequency.replace('_', ' ')})</span>
                  <span className="font-mono tabular-nums">${calculatedBasePrice.toFixed(2)} AUD</span>
                </div>

                {selectedAddons.length > 0 && (
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Add-ons Subtotal ({selectedAddons.length})</span>
                    <span className="font-mono tabular-nums">+${addonsTotal.toFixed(2)} AUD</span>
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Promotional Discount</span>
                    <span className="font-mono tabular-nums">-${promoDiscount.toFixed(2)} AUD</span>
                  </div>
                )}

                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between text-sm font-bold text-neutral-900 dark:text-white">
                  <span>Total Amount (Inc. 10% GST)</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400 tabular-nums">
                    ${grandTotal.toFixed(2)} AUD
                  </span>
                </div>
              </div>

              {/* Promo code */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Try BUZZING20"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-mono uppercase focus:outline-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3.5 py-2 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[11px] mt-1 ${promoMessage.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', sub: 'Visa / Mastercard' },
                    { id: 'bank_transfer', label: 'Direct EFT Bank', sub: 'PayID / BSB Account' },
                    { id: 'cash', label: 'Cash on Completion', sub: 'Pay on site' },
                  ].map((pm) => (
                    <button
                      type="button"
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        paymentMethod === pm.id
                          ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-400'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                      }`}
                    >
                      <div className="font-semibold text-neutral-900 dark:text-white">{pm.label}</div>
                      <div className="text-[10px] text-neutral-500">{pm.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-500 transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-500 active:scale-95 shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Confirm DBuzzingBees Booking</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
