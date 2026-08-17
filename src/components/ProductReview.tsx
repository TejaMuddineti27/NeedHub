import React, { useState } from 'react';
import { Product, ReviewItem } from '../types';
import { Star, ThumbsUp, CheckCircle2, User, MessageSquare, Send } from 'lucide-react';

interface ProductReviewProps {
  product: Product;
  onAddReview?: (productId: string, review: ReviewItem) => void;
}

export const ProductReview: React.FC<ProductReviewProps> = ({
  product,
  onAddReview,
}) => {
  // Initial demo reviews if product.reviews is empty
  const initialReviews: ReviewItem[] = product.reviews && product.reviews.length > 0
    ? product.reviews
    : [
        {
          id: 'rev_1',
          userName: 'Aarav Patel',
          rating: 5,
          comment: 'Outstanding quality and fast delivery! Exactly as described. Very happy with my purchase.',
          date: '2026-07-28',
          verifiedPurchase: true,
        },
        {
          id: 'rev_2',
          userName: 'Priya Sundaram',
          rating: 4,
          comment: 'Great value for money. Service was prompt and professional. Would recommend to others.',
          date: '2026-07-20',
          verifiedPurchase: true,
        },
      ];

  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(initialReviews);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState<string>('Rahul Sharma');
  const [commentInput, setCommentInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Calculate rating stats dynamically
  const totalReviews = reviewsList.length;
  const avgRating = totalReviews > 0
    ? (reviewsList.reduce((acc, item) => acc + item.rating, 0) / totalReviews).toFixed(1)
    : product.rating.toFixed(1);

  const starCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviewsList.filter((r) => r.rating === stars).length;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, count, percentage };
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setIsSubmitting(true);

    const newReview: ReviewItem = {
      id: `rev_${Date.now()}`,
      userName: reviewerName.trim() || 'Anonymous User',
      rating: ratingInput,
      comment: commentInput.trim(),
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
    };

    setTimeout(() => {
      setReviewsList([newReview, ...reviewsList]);
      if (onAddReview) {
        onAddReview(product.id, newReview);
      }
      setCommentInput('');
      setIsSubmitting(false);
      setShowForm(false);
      setSuccessNotice('Thank you! Your review has been posted successfully.');
      setTimeout(() => setSuccessNotice(null), 4000);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      {successNotice && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Rating Summary Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
        
        {/* Overall Score */}
        <div className="flex flex-col items-center justify-center text-center p-3 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700">
          <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">
            {avgRating}
          </span>
          <div className="flex items-center gap-1 my-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(Number(avgRating))
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        {/* Star Breakdown Bars */}
        <div className="col-span-1 sm:col-span-2 space-y-1.5 justify-center flex flex-col px-2">
          {starCounts.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-2 text-xs">
              <span className="w-8 text-right font-bold text-slate-600 dark:text-slate-400 font-mono">
                {stars} ★
              </span>
              <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-10 text-slate-400 text-[11px] font-mono">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review Toggle Button */}
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-indigo-500" />
          Customer Ratings & Reviews
        </h4>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition shadow-xs flex items-center gap-1.5"
        >
          {showForm ? 'Cancel' : '★ Write a Review'}
        </button>
      </div>

      {/* Review Input Form */}
      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-4 animate-fadeIn"
        >
          <h5 className="font-extrabold text-xs text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
            Share Your Experience
          </h5>

          {/* Interactive Star Picker */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Select Rating <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingInput(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating || ratingInput)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                {hoverRating || ratingInput} / 5 Stars
              </span>
            </div>
          </div>

          {/* Reviewer Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Your Review & Feedback <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write a detailed description of your experience with this product/service..."
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !commentInput.trim()}
            className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Posting Review...' : 'Submit Review'}</span>
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {reviewsList.length === 0 ? (
          <p className="text-xs text-slate-500 italic text-center py-6">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-black text-xs flex items-center justify-center">
                    {rev.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block leading-snug">
                      {rev.userName}
                    </span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-0.5 justify-end">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    {rev.date}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                "{rev.comment}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
