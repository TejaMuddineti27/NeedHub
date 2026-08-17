import React, { useState, useEffect } from 'react';
import { Flame, Clock, Zap } from 'lucide-react';

interface FlashSaleTimerProps {
  variant?: 'compact' | 'badge' | 'detailed';
  productId?: string;
  claimedPercent?: number;
}

export const FlashSaleTimer: React.FC<FlashSaleTimerProps> = ({
  variant = 'compact',
  productId = 'default',
  claimedPercent = 84,
}) => {
  // Generate a realistic, stable initial countdown duration based on productId hash
  const getInitialTime = () => {
    let hash = 0;
    for (let i = 0; i < productId.length; i++) {
      hash = (hash << 5) - hash + productId.charCodeAt(i);
    }
    const offset = Math.abs(hash) % 7200; // 0 to 2 hours
    return 10800 + offset; // 3 to 5 hours remaining
  };

  const [timeLeft, setTimeLeft] = useState<number>(getInitialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatTwoDigits = (num: number) => num.toString().padStart(2, '0');

  if (variant === 'badge') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-mono text-[11px] font-black shadow-md animate-pulse">
        <Zap className="w-3 h-3 fill-current" />
        <span>ENDS IN {formatTwoDigits(hours)}:{formatTwoDigits(minutes)}:{formatTwoDigits(seconds)}</span>
      </span>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/90 text-white font-mono text-[10px] font-black backdrop-blur-md shadow-xs border border-amber-300/40">
        <Flame className="w-3 h-3 fill-white text-white animate-bounce" />
        <span className="tracking-tighter">
          {formatTwoDigits(hours)}h {formatTwoDigits(minutes)}m {formatTwoDigits(seconds)}s
        </span>
      </div>
    );
  }

  // Detailed view for Product Modal / Hero banners
  return (
    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/30 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500 text-white shadow-xs">
            <Zap className="w-4 h-4 fill-current animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
              Limited-Time Flash Deal
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Special promotional pricing ends strictly when countdown expires
            </p>
          </div>
        </div>

        {/* Digital Clock Counters */}
        <div className="flex items-center gap-1 font-mono text-xs font-black">
          <div className="flex flex-col items-center px-1.5 py-1 rounded-lg bg-slate-900 text-amber-400 border border-amber-500/30 min-w-[32px]">
            <span>{formatTwoDigits(hours)}</span>
            <span className="text-[8px] font-sans text-slate-400 font-semibold uppercase">hrs</span>
          </div>
          <span className="text-amber-500 font-extrabold animate-ping">:</span>
          <div className="flex flex-col items-center px-1.5 py-1 rounded-lg bg-slate-900 text-amber-400 border border-amber-500/30 min-w-[32px]">
            <span>{formatTwoDigits(minutes)}</span>
            <span className="text-[8px] font-sans text-slate-400 font-semibold uppercase">min</span>
          </div>
          <span className="text-amber-500 font-extrabold animate-ping">:</span>
          <div className="flex flex-col items-center px-1.5 py-1 rounded-lg bg-slate-900 text-amber-400 border border-amber-500/30 min-w-[32px]">
            <span>{formatTwoDigits(seconds)}</span>
            <span className="text-[8px] font-sans text-slate-400 font-semibold uppercase">sec</span>
          </div>
        </div>
      </div>

      {/* Stock Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-extrabold text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1 text-rose-500">
            <Flame className="w-3 h-3 fill-rose-500" /> {claimedPercent}% Items Claimed
          </span>
          <span className="text-slate-400">Hurry, only a few remaining!</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5 border border-amber-500/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 animate-pulse transition-all duration-500"
            style={{ width: `${claimedPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
