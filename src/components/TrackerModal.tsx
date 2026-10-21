import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Send,
  Navigation2
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';

interface TrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onUpdateStatus: (bookingId: string, nextStatus: BookingStatus) => void;
  onToggleTask: (bookingId: string, taskId: string) => void;
  onOpenPaymentAndReview: (booking: Booking) => void;
}

export const TrackerModal: React.FC<TrackerModalProps> = ({
  isOpen,
  onClose,
  booking,
  onUpdateStatus,
  onToggleTask,
  onOpenPaymentAndReview
}) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'cleaner' | 'user'; text: string; time: string }>>([
    { sender: 'cleaner', text: 'Hi! I am packed with all commercial equipment and vacuum, en route to your Perth property now.', time: '09:05 AM' }
  ]);
  const [inputText, setInputText] = useState('');
  const [callSimulated, setCallSimulated] = useState(false);

  if (!isOpen || !booking) return null;

  const statusOrder: BookingStatus[] = [
    'pending',
    'confirmed',
    'en_route',
    'in_progress',
    'inspecting',
    'completed'
  ];

  const currentStatusIndex = statusOrder.indexOf(booking.status);

  const getStatusLabel = (st: BookingStatus) => {
    switch (st) {
      case 'pending': return 'Awaiting Dispatch Confirmation';
      case 'confirmed': return 'Confirmed & Team Dispatched';
      case 'en_route': return 'Cleaner En Route (Perth Traffic)';
      case 'in_progress': return 'Cleaning & Maintenance In Progress';
      case 'inspecting': return 'Quality Sign-Off & Inspection';
      case 'completed': return 'Clean Completed Successfully';
      default: return st;
    }
  };

  const handleNextStatus = () => {
    if (currentStatusIndex < statusOrder.length - 1) {
      const next = statusOrder[currentStatusIndex + 1];
      onUpdateStatus(booking.id, next);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const userMsg = {
      sender: 'user' as const,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'cleaner',
          text: 'Got it! I will make sure everything is spotless to our DBuzzingBees guarantee.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const handleSimulateCall = () => {
    setCallSimulated(true);
    setTimeout(() => setCallSimulated(false), 3000);
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
                Live Dispatch & Service Tracker
              </h2>
              <span className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                #{booking.id}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {booking.serviceTitle} · {booking.scheduledDate} {booking.scheduledTime} ({booking.hours} hrs)
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* Status Progression Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                {getStatusLabel(booking.status)}
              </span>
              {booking.status === 'en_route' && (
                <span className="text-xs font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  ~{booking.enRouteMinutesLeft || 12} mins estimated arrival
                </span>
              )}
            </div>

            <div className="grid grid-cols-6 gap-1.5 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden p-0.5">
              {statusOrder.map((st, idx) => {
                const isPassed = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;
                return (
                  <div 
                    key={st}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCurrent 
                        ? 'bg-amber-500 animate-pulse' 
                        : isPassed 
                        ? 'bg-amber-400' 
                        : 'bg-transparent'
                    }`}
                  />
                );
              })}
            </div>

            <div className="flex justify-between text-[10px] text-neutral-400 mt-1.5 font-medium">
              <span>Booked</span>
              <span>Confirmed</span>
              <span>En Route</span>
              <span>Cleaning</span>
              <span>Inspect</span>
              <span>Done</span>
            </div>
          </div>

          {/* Cleaner Live Dispatch Card */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={booking.cleanerAvatar} 
                  alt={booking.cleanerName} 
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/40"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-xs text-neutral-500">Allocated DBuzzingBees Specialist</div>
                  <div className="text-sm font-bold text-neutral-900 dark:text-white">
                    {booking.cleanerName}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <Navigation2 className="w-3 h-3 fill-current rotate-45" />
                    <span>GPS Telemetry Connected · WA Police Cleared</span>
                  </div>
                </div>
              </div>

              {/* Action buttons (Call / Chat) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSimulateCall}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Call Mobile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChatOpen(!chatOpen)}
                  className={`p-2.5 rounded-xl border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    chatOpen 
                      ? 'bg-amber-400 text-neutral-950 border-amber-400 font-bold'
                      : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Message</span>
                </button>
              </div>
            </div>

            {callSimulated && (
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2 animate-fade-in">
                <Phone className="w-4 h-4 animate-bounce text-amber-600" />
                <span>Calling {booking.cleanerName}... Connected to Perth network!</span>
              </div>
            )}

            {/* Chat Drawer */}
            {chatOpen && (
              <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 space-y-3">
                <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                  {chatMessages.map((msg, i) => (
                    <div 
                      key={i}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`px-3 py-2 rounded-xl text-xs max-w-[85%] ${
                        msg.sender === 'user'
                          ? 'bg-amber-400 text-neutral-950 font-medium'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-neutral-400 mt-0.5 px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Message cleaner regarding gate code, parking, etc..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-xs focus:outline-amber-500"
                  />
                  <button 
                    type="submit"
                    className="p-2 rounded-xl bg-amber-400 text-neutral-950 hover:bg-amber-500 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Location & Instructions */}
          <div className="text-xs space-y-1">
            <div className="flex items-start gap-2 text-neutral-600 dark:text-neutral-400">
              <MapPin className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
              <div>
                <span className="font-bold text-neutral-900 dark:text-white">{booking.address}</span>
                <span className="text-neutral-500"> · {booking.suburb}</span>
              </div>
            </div>
            {booking.notes && (
              <p className="pl-6 text-neutral-500 italic">
                "{booking.notes}"
              </p>
            )}
          </div>

          {/* Service Checklist */}
          <div>
            <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2">
              Quality Assurance Checklist ({booking.tasks.filter(t => t.completed).length} / {booking.tasks.length} done)
            </h3>
            <div className="space-y-2">
              {booking.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(booking.id, task.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                    task.completed
                      ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-neutral-700 dark:text-neutral-300'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                      task.completed 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : 'border-neutral-300 dark:border-neutral-600'
                    }`}>
                      {task.completed && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <span className={task.completed ? 'line-through text-neutral-400' : 'font-medium'}>
                      {task.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          {booking.status !== 'completed' ? (
            <button
              type="button"
              onClick={handleNextStatus}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Advance Step: {statusOrder[currentStatusIndex + 1]?.replace('_', ' ') || 'Complete'}
            </button>
          ) : (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Service Fully Completed!
            </span>
          )}

          {booking.status === 'completed' && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPaymentAndReview(booking);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-500 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Complete Payment & Review</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
