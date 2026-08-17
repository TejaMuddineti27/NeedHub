import React, { useState } from 'react';
import { DeliveryTask } from '../types';
import { Truck, MapPin, CheckCircle, Navigation, ShieldCheck, Phone, AlertCircle } from 'lucide-react';

interface DeliveryDashboardProps {
  tasks: DeliveryTask[];
  onVerifyOtp: (taskId: string, otp: string) => Promise<boolean>;
}

export const DeliveryDashboard: React.FC<DeliveryDashboardProps> = ({ tasks, onVerifyOtp }) => {
  const [selectedTask, setSelectedTask] = useState<DeliveryTask | null>(tasks[0] || null);
  const [otpInput, setOtpInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; msg: string } | null>(null);

  const handleVerify = async () => {
    if (!selectedTask || !otpInput.trim()) return;
    setIsVerifying(true);
    setVerificationResult(null);

    const ok = await onVerifyOtp(selectedTask.id, otpInput);
    if (ok) {
      setVerificationResult({
        success: true,
        msg: `OTP Verified! Delivery completed for Order ${selectedTask.orderId}. Payout of ₹${selectedTask.payout.toLocaleString('en-IN')} added to your wallet.`,
      });
      setOtpInput('');
    } else {
      setVerificationResult({
        success: false,
        msg: 'Invalid OTP code. Please ask customer for correct 4-digit OTP.',
      });
    }
    setIsVerifying(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider text-amber-100">
            Rider Terminal • Active Duty
          </span>
          <h2 className="text-2xl font-black mt-1">Rohan Kumar (NeedHub Delivery Partner)</h2>
          <p className="text-xs text-amber-100">Vehicle: Electric Scooter • Wallet Earnings Today: ₹3,450.00</p>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right">
          <span className="text-xs text-amber-100 block">Accepted Deliveries</span>
          <span className="text-xl font-black text-white">{tasks.length} Active Tasks</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Tasks List */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-amber-500" /> Assigned Pickups & Deliveries
          </h3>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                  selectedTask?.id === task.id
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 dark:border-amber-500/80'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{task.orderId}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">+₹{task.payout.toLocaleString('en-IN')}</span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">Pickup: {task.pickupLocation}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">Drop: {task.dropLocation}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                  <span className="text-slate-400 font-medium">{task.distanceKm} km trip</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full uppercase ${
                      task.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Route Map Preview & OTP Terminal */}
        {selectedTask && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Interactive Map Mockup */}
            <div className="relative aspect-16/9 rounded-3xl bg-slate-800 overflow-hidden border border-slate-700 flex flex-col justify-between p-6 text-white">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-xs font-bold text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5" /> GPS Active Navigation
                </span>
                <span className="text-xs font-bold text-slate-300">Distance: {selectedTask.distanceKm} km</span>
              </div>

              {/* Simulated Route Line */}
              <div className="relative z-10 my-auto py-6 flex items-center justify-between max-w-md mx-auto w-full">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-amber-500 mx-auto flex items-center justify-center font-bold">
                    A
                  </div>
                  <span className="text-[10px] text-slate-300 block max-w-[100px] truncate">{selectedTask.pickupLocation}</span>
                </div>

                <div className="flex-1 h-1 bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 relative mx-4">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white text-slate-900 flex items-center justify-center text-[10px] font-black shadow-md">
                    🚲
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 mx-auto flex items-center justify-center font-bold">
                    B
                  </div>
                  <span className="text-[10px] text-slate-300 block max-w-[100px] truncate">{selectedTask.dropLocation}</span>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between text-xs text-slate-300">
                <span>Customer: <strong className="text-white">{selectedTask.customerName}</strong></span>
                <a href={`tel:${selectedTask.customerPhone}`} className="text-emerald-400 font-bold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Call Customer
                </a>
              </div>
            </div>

            {/* OTP Verification Terminal */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Customer Delivery OTP Verification</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ask customer for their 4-digit verification code. (Sample OTP for testing: <strong className="text-slate-900 dark:text-white font-mono">{selectedTask.otpCode}</strong>)
              </p>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter 4-Digit OTP"
                  className="w-48 px-4 py-2.5 text-center text-lg font-mono font-black tracking-widest bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white"
                />
                <button
                  onClick={handleVerify}
                  disabled={isVerifying || selectedTask.status === 'delivered'}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition disabled:opacity-50"
                >
                  {selectedTask.status === 'delivered' ? 'Already Verified' : 'Confirm Delivery'}
                </button>
              </div>

              {verificationResult && (
                <div
                  className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
                    verificationResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200'
                  }`}
                >
                  {verificationResult.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{verificationResult.msg}</span>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
