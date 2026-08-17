import React, { useState } from 'react';
import { ServiceBooking } from '../types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Phone,
  UserCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Star,
  Send,
} from 'lucide-react';

interface ServiceAppointmentsModalProps {
  bookings: ServiceBooking[];
  onClose: () => void;
  onUpdateStatus?: (bookingId: string, status: ServiceBooking['status']) => void;
  onOpenChatWithProvider?: (sellerId: string, sellerName: string) => void;
  onBookingReviewed?: (bookingId: string, review: { rating: number; comment: string; createdAt: string }) => void;
}

export const ServiceAppointmentsModal: React.FC<ServiceAppointmentsModalProps> = ({
  bookings,
  onClose,
  onUpdateStatus,
  onOpenChatWithProvider,
  onBookingReviewed,
}) => {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [reviewingBookingId, setReviewingBookingId] = useState<string | null>(null);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'confirmed') return b.status === 'confirmed' || b.status === 'in_progress';
    return b.status === filter;
  });

  const handleSubmitReview = async (bookingId: string) => {
    if (!commentInput.trim()) return;
    setIsSubmittingReview(true);

    const reviewObj = {
      rating: ratingInput,
      comment: commentInput.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      await fetch(`/api/service-bookings/${bookingId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: ratingInput, comment: commentInput.trim() }),
      });
    } catch (err) {
      console.error('Submit review error:', err);
    }

    if (onBookingReviewed) {
      onBookingReviewed(bookingId, reviewObj);
    }

    setIsSubmittingReview(false);
    setReviewingBookingId(null);
    setCommentInput('');
  };

  const handleCancel = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this service appointment?')) {
      if (onUpdateStatus) {
        onUpdateStatus(id, 'cancelled');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white border-b border-indigo-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg leading-snug">My Scheduled Service Appointments</h2>
              <p className="text-xs text-blue-300 font-mono">Dedicated Time-Slot Bookings Module ({bookings.length} Total)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {(['all', 'confirmed', 'completed', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition shrink-0 ${
                filter === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {tab === 'confirmed' ? 'Upcoming / Confirmed' : tab}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">No Service Appointments Found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                You have no scheduled appointments in this category. Browse the Services & Freelance category to book a time slot!
              </p>
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 shadow-2xs"
              >
                {/* Top Row: Service Info & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <img
                      src={b.serviceImage}
                      alt={b.serviceTitle}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-md">
                          #{b.id}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">{b.category}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                        {b.serviceTitle}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-500" /> Provider: <strong>{b.providerName}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    {b.status === 'confirmed' && (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Confirmed
                      </span>
                    )}
                    {b.status === 'in_progress' && (
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-extrabold flex items-center gap-1 animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-blue-600" /> In Progress
                      </span>
                    )}
                    {b.status === 'completed' && (
                      <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-extrabold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-slate-500" /> Service Completed
                      </span>
                    )}
                    {b.status === 'cancelled' && (
                      <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs font-extrabold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" /> Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {/* Scheduled Slot Highlight Box */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/60 border border-blue-200 dark:border-indigo-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Scheduled Date</span>
                    <span className="font-extrabold text-blue-700 dark:text-blue-300 font-mono text-sm">
                      {new Date(b.bookingDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Time Slot</span>
                    <span className="font-extrabold text-indigo-700 dark:text-indigo-300 font-mono text-sm">
                      {b.timeSlot}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Fee</span>
                    <span className="font-extrabold text-slate-900 dark:text-white font-mono text-sm">
                      ₹{b.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Location & Customer Info */}
                <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Service Location:</strong> {b.customerAddress}</span>
                  </div>
                  {b.notes && (
                    <div className="text-[11px] text-slate-500 italic bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                      <strong>Customer Note:</strong> "{b.notes}"
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {b.providerPhone && (
                      <a
                        href={`tel:${b.providerPhone.replace(/\s+/g, '')}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Provider
                      </a>
                    )}
                    {onOpenChatWithProvider && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenChatWithProvider(b.sellerId, b.providerName);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Chat
                      </button>
                    )}
                  </div>

                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-300 font-bold text-xs transition"
                    >
                      Cancel Appointment
                    </button>
                  )}

                  {b.status === 'completed' && !b.review && (
                    <button
                      onClick={() => {
                        setReviewingBookingId(reviewingBookingId === b.id ? null : b.id);
                        setRatingInput(5);
                        setCommentInput('');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{reviewingBookingId === b.id ? 'Close Review Form' : 'Rate & Review Provider'}</span>
                    </button>
                  )}
                </div>

                {/* Existing Review Display for Completed Appointment */}
                {b.status === 'completed' && b.review && (
                  <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-amber-600" /> Your Service Review
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= b.review!.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 italic text-[11px]">
                      "{b.review.comment}"
                    </p>
                  </div>
                )}

                {/* Review Form Input for Completed Appointment */}
                {b.status === 'completed' && reviewingBookingId === b.id && !b.review && (
                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 space-y-3 text-xs animate-fadeIn">
                    <h5 className="font-extrabold text-xs text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      Rate & Review {b.providerName}
                    </h5>

                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Star Rating:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRatingInput(star)}
                            className="p-1 transition hover:scale-110"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= ratingInput
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 font-mono font-bold text-amber-600 dark:text-amber-400">
                          {ratingInput}/5 Stars
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Your Review Comment:</span>
                      <textarea
                        rows={2}
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="How was the service? (e.g., Punctual, professional, clean work...)"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReviewingBookingId(null)}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isSubmittingReview || !commentInput.trim()}
                        onClick={() => handleSubmitReview(b.id)}
                        className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmittingReview ? 'Submitting...' : 'Post Review'}</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-700 dark:text-white font-bold text-xs hover:opacity-90 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
