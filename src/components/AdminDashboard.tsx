import React, { useState } from 'react';
import { AdminMetrics } from '../types';
import { ShieldAlert, TrendingUp, Users, DollarSign, Sparkles, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

interface AdminDashboardProps {
  metrics: AdminMetrics;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ metrics }) => {
  const [suspectText, setSuspectText] = useState('Brand New Sealed iPhone 15 Pro Max for ₹5,000 only wire transfer');
  const [moderationResult, setModerationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const handleRunModeration = async () => {
    if (!suspectText.trim()) return;
    setIsLoading(true);
    setModerationResult(null);

    try {
      const res = await fetch('/api/ai/admin-moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingText: suspectText }),
      });

      const data = await res.json();
      if (data.success && data.moderationResult) {
        setModerationResult(data.moderationResult);
      }
    } catch (err) {
      console.error('Moderation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-xs font-bold uppercase tracking-wider text-rose-300 border border-rose-500/30">
            Admin Command Center • Platform Operations
          </span>
          <h2 className="text-2xl font-black mt-1">NeedHub Governance & AI Security</h2>
          <p className="text-xs text-slate-400">Monitoring 18,250 Active Users & 420 Verified Shops across 6 Modules</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-2xl bg-slate-800 border border-slate-700 text-right font-mono">
            <span className="text-[10px] text-slate-400 block font-sans">Total GMV</span>
            <span className="text-lg font-black text-emerald-400">₹{metrics.totalRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Gross Merchandise Volume', value: `₹${metrics.totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-indigo-500' },
          { label: 'Total Orders Processed', value: metrics.totalOrders.toLocaleString(), icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Active Platform Users', value: metrics.activeUsers.toLocaleString(), icon: Users, color: 'text-amber-500' },
          { label: 'Active Fraud Alerts', value: metrics.fraudAlertsCount, icon: ShieldAlert, color: 'text-rose-500' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-semibold">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <p className="text-xl font-black text-slate-900 dark:text-white">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue GMV Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Monthly GMV & Platform Fees Growth</h3>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">10% Take-Rate</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.monthlyRevenueData}>
                <defs>
                  <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="gmv" stroke="#6366f1" fillOpacity={1} fill="url(#gmvGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs flex flex-col justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Listing Category Share</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.categoryDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                >
                  {metrics.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            {metrics.categoryDistribution.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI Moderation & Fraud Inspection Tool */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Gemini AI Moderation & Fraud Inspector</h3>
            <p className="text-xs text-slate-500">Deep inspection of suspicious listings, review spam, or escrow fraud claims</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Listing or Review Text to Inspect:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={suspectText}
              onChange={(e) => setSuspectText(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
            <button
              onClick={handleRunModeration}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
              Inspect Risk
            </button>
          </div>
        </div>

        {moderationResult && (
          <div
            className={`p-4 rounded-2xl text-xs space-y-2 border ${
              moderationResult.fraudRiskScore > 50
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-950 dark:text-rose-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-950 dark:text-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-sm">
              <span className="flex items-center gap-1.5">
                {moderationResult.fraudRiskScore > 50 ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                )}
                Fraud Risk Score: {moderationResult.fraudRiskScore} / 100 ({moderationResult.riskCategory})
              </span>
              <span className="uppercase text-[10px] px-2 py-0.5 rounded-full bg-black/20 font-mono">
                {moderationResult.actionRecommendation || 'FLAGGED'}
              </span>
            </div>
            <p className="text-xs">Detected Risk Flags: {moderationResult.detectedKeywords?.join(', ') || 'None'}</p>
          </div>
        )}
      </div>

    </div>
  );
};
