import React, { useState } from 'react';
import { X, Star, Sparkles, Check } from 'lucide-react';
import { Booking } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onSubmitReview: (bookingId: string, rating: number, comment: string, tags: string[]) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('Exceptional clean! Arrived right on time, courteous, and left our Perth property completely sparkling.');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Spotless Finish', 'Punctual']);

  if (!isOpen || !booking) return null;

  const availableTags = [
    'Punctual',
    'Spotless Finish',
    'Bond Back Quality',
    'Polite & Friendly',
    'Razor Sharp Edging',
    'Streak-Free Windows',
    'Attention to Detail',
    'Trustworthy'
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview(booking.id, rating, comment, selectedTags);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 my-8 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div>
            <div className="flex items-center gap-1.5">
              <span>🐝</span>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Rate Your DBuzzingBees Clean
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {booking.cleanerName} · {booking.serviceTitle}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="text-center space-y-2">
            <img 
              src={booking.cleanerAvatar} 
              alt={booking.cleanerName} 
              className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-amber-400/30"
              referrerPolicy="no-referrer"
            />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              {booking.cleanerName}
            </h3>

            {/* Interactive Stars */}
            <div className="flex justify-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = (hoverRating || rating) >= star;
                return (
                  <button
                    type="button"
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 text-neutral-300 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star 
                      className={`w-7 h-7 ${
                        filled ? 'text-amber-400 fill-amber-400' : 'text-neutral-300 dark:text-neutral-700'
                      }`} 
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {rating === 5 ? '5.0 ⭐ Top Tier Service' : rating === 4 ? '4.0 ⭐ Very Good' : 'Satisfactory'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Feedback Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-neutral-950 dark:text-amber-200 font-semibold'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-amber-500" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Your Review & Comments
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about the cleaning quality, punctuality, and finish..."
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-500 active:scale-98 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Submit DBuzzingBees Review</span>
          </button>
        </form>

      </div>
    </div>
  );
};
