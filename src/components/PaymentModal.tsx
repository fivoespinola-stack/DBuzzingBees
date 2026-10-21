import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  CheckCircle2, 
  Printer, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Landmark
} from 'lucide-react';
import { Booking, PaymentMethod } from '../types';
import { playSoundChime } from '../services/storage';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onPaymentSuccess: (bookingId: string, method: PaymentMethod, tip: number) => void;
  onProceedToReview: (booking: Booking) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  booking,
  onPaymentSuccess,
  onProceedToReview
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [tipAmount, setTipAmount] = useState<number>(15);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [invoiceRef] = useState<string>(() => `INV-WA-${Math.floor(10000 + Math.random() * 90000)}`);

  if (!isOpen || !booking) return null;

  const baseServiceAmount = booking.totalAmount;
  const grandTotal = baseServiceAmount + tipAmount;
  // Australian GST calculation (10% inclusive)
  const gstAmount = Number(((grandTotal / 11)).toFixed(2));
  const subtotalExGst = Number((grandTotal - gstAmount).toFixed(2));

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      playSoundChime('success');
      onPaymentSuccess(booking.id, paymentMethod, tipAmount);
    }, 1200);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 my-8 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div>
            <div className="flex items-center gap-1.5">
              <span>🐝</span>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                {isPaid ? 'Australian Tax Invoice' : 'DBuzzingBees Checkout'}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Booking #{booking.id} · {booking.serviceTitle} ({booking.suburb})
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!isPaid ? (
            <div className="space-y-5">
              
              {/* Payment Gateways */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Select Australian Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: <CreditCard className="w-4 h-4 text-amber-500" />, sub: 'Visa / Mastercard' },
                    { id: 'bank_transfer', label: 'Direct EFT Bank', icon: <Landmark className="w-4 h-4 text-emerald-500" />, sub: 'BSB / PayID' },
                    { id: 'cash', label: 'Cash on Site', icon: <ShieldCheck className="w-4 h-4 text-sky-500" />, sub: 'Pay on completion' },
                  ].map((pm) => (
                    <button
                      type="button"
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        paymentMethod === pm.id
                          ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-400 font-bold'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {pm.icon}
                        <span className="font-semibold text-neutral-900 dark:text-white">{pm.label}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500">{pm.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tip Gratuity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Gratuity Tip for {booking.cleanerName} (100% to staff)
                  </label>
                  <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                    ${tipAmount} AUD
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 10, 15, 25].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setTipAmount(amt)}
                      className={`py-2 rounded-xl border text-xs font-mono transition-all ${
                        tipAmount === amt
                          ? 'border-amber-400 bg-amber-400 text-neutral-950 font-bold'
                          : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                      }`}
                    >
                      {amt === 0 ? 'No Tip' : `$${amt}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill breakdown with 10% Australian GST */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span className="font-sans">Subtotal (Ex. GST)</span>
                  <span className="tabular-nums">${subtotalExGst.toFixed(2)} AUD</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span className="font-sans">10% Australian GST</span>
                  <span className="tabular-nums">${gstAmount.toFixed(2)} AUD</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-amber-600 dark:text-amber-400">
                    <span className="font-sans">Cleaner Tip</span>
                    <span className="tabular-nums">+${tipAmount.toFixed(2)} AUD</span>
                  </div>
                )}
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between text-sm font-bold text-neutral-900 dark:text-white">
                  <span className="font-sans">Total Due (AUD)</span>
                  <span className="text-amber-600 dark:text-amber-400 tabular-nums">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className="w-full py-3 rounded-xl text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-500 active:scale-98 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                    <span>Processing Transaction...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Pay ${grandTotal.toFixed(2)} AUD</span>
                  </>
                )}
              </button>

            </div>
          ) : (
            /* PAID TAX INVOICE VIEW */
            <div className="space-y-5 print:p-8">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Payment Processed Successfully!
                </h3>
                <p className="text-xs text-neutral-500">
                  Tax Invoice Ref: <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{invoiceRef}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/30 text-xs space-y-2 font-mono">
                <div className="flex justify-between text-[11px] text-neutral-500 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                  <span>Merchant: DBuzzingBees Perth</span>
                  <span>ABN: 54 182 904 772</span>
                </div>

                <div className="flex justify-between py-1">
                  <span>Client:</span>
                  <span className="font-sans font-semibold">{booking.clientName}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span>Property Address:</span>
                  <span className="font-sans">{booking.address}, {booking.suburb}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span>Service:</span>
                  <span className="font-sans">{booking.serviceTitle}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span>Cleaner:</span>
                  <span className="font-sans">{booking.cleanerName}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span>Subtotal Ex. GST:</span>
                  <span className="tabular-nums">${subtotalExGst.toFixed(2)} AUD</span>
                </div>

                <div className="flex justify-between py-1">
                  <span>10% Australian GST:</span>
                  <span className="tabular-nums">${gstAmount.toFixed(2)} AUD</span>
                </div>

                {tipAmount > 0 && (
                  <div className="flex justify-between py-1 text-amber-600">
                    <span>Staff Gratuity:</span>
                    <span className="tabular-nums">${tipAmount.toFixed(2)} AUD</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-sm pt-2 border-t border-neutral-300 dark:border-neutral-700">
                  <span>TOTAL PAID (AUD):</span>
                  <span className="tabular-nums">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Tax Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onProceedToReview(booking);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <span>Leave Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
