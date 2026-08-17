import React from 'react';
import { ShoppingBag, Store, Truck, ShieldAlert, Cpu } from 'lucide-react';
import { UserRole } from '../types';

interface RoleSwitcherBarProps {
  currentRole: UserRole | 'architecture';
  onSelectRole: (role: UserRole | 'architecture') => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({ currentRole, onSelectRole }) => {
  const roles = [
    {
      key: 'customer',
      label: 'Customer Storefront',
      icon: ShoppingBag,
      color: 'bg-blue-600 text-white border-blue-500',
      badge: 'Shop & Services',
    },
    {
      key: 'seller',
      label: 'Seller Studio',
      icon: Store,
      color: 'bg-emerald-600 text-white border-emerald-500',
      badge: 'Business & AI',
    },
    {
      key: 'delivery',
      label: 'Delivery Partner',
      icon: Truck,
      color: 'bg-amber-600 text-white border-amber-500',
      badge: 'Rider App',
    },
    {
      key: 'admin',
      label: 'Admin Command',
      icon: ShieldAlert,
      color: 'bg-rose-600 text-white border-rose-500',
      badge: 'Fraud & Metrics',
    },
    {
      key: 'architecture',
      label: 'Architecture & APIs',
      icon: Cpu,
      color: 'bg-purple-600 text-white border-purple-500',
      badge: 'Microservices Docs',
    },
  ];

  return (
    <div className="bg-[#020617] border-b border-slate-800 py-2.5 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 shrink-0 hidden sm:inline flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          Switch Role Perspective:
        </span>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = currentRole === r.key;
            return (
              <button
                key={r.key}
                onClick={() => onSelectRole(r.key as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 border ${
                  isActive
                    ? `${r.color} shadow-md font-semibold`
                    : 'bg-[#070e1e] text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800/90'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {r.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
