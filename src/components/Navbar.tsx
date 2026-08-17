import React, { useState } from 'react';
import { ShoppingBag, Search, Sparkles, MessageSquare, ShieldCheck, Sun, Moon, Mic, Camera, Bell, Heart, Truck, Calendar } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  cartCount: number;
  wishlistCount: number;
  ordersCount?: number;
  serviceAppointmentsCount?: number;
  unreadChatCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrderTracking?: () => void;
  onOpenServiceAppointments?: () => void;
  onOpenChat: () => void;
  onOpenAIAssistant: () => void;
  onSearch: (query: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  cartCount,
  wishlistCount,
  ordersCount = 0,
  serviceAppointmentsCount = 0,
  unreadChatCount,
  onOpenCart,
  onOpenWishlist,
  onOpenOrderTracking,
  onOpenServiceAppointments,
  onOpenChat,
  onOpenAIAssistant,
  onSearch,
  darkMode,
  setDarkMode,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    // Simulate speech recognition
    setTimeout(() => {
      setSearchInput('Handmade leather journal');
      onSearch('Handmade leather journal');
      setIsListening(false);
    }, 1800);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070e1e]/90 backdrop-blur-md border-b border-slate-800 transition-colors shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 text-lg">
              N
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-white">
                  NeedHub<span className="text-blue-500">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-blue-600/10 text-blue-400 rounded-md border border-blue-500/20">
                  <ShieldCheck className="w-3 h-3 text-blue-400" /> Escrow Safe
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden md:block font-mono">
                AI Community Marketplace & Services Engine
              </p>
            </div>
          </div>

          {/* Search Bar with Text, Voice, and Image search triggers */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  onSearch(e.target.value);
                }}
                placeholder="AI Search: 'Find handmade walnut tables or developers near me'..."
                className="w-full pl-10 pr-20 py-2 text-sm bg-[#020617] border border-slate-700/80 focus:border-blue-500 rounded-full text-slate-100 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`p-1.5 rounded-full hover:bg-slate-800 transition ${
                    isListening ? 'text-red-500 animate-pulse' : 'text-slate-400'
                  }`}
                  title="Voice Search"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('Refurbished MacBook');
                    onSearch('Refurbished MacBook');
                  }}
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 transition"
                  title="Image Search"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Actions & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Wallet Stat Display */}
            <div className="hidden lg:block text-right px-2 border-r border-slate-800 pr-3">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Platform Wallet</div>
              <div className="text-xs font-bold text-emerald-400 font-mono">₹3,42,890.50</div>
            </div>

            {/* AI Assistant Trigger */}
            <button
              onClick={onOpenAIAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden md:inline">NeedHub AI</span>
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-slate-300 hover:bg-slate-800 rounded-lg border border-slate-800/80 transition group"
              title="Wishlist & Saved Items"
            >
              <Heart className={`w-4 h-4 transition ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : 'group-hover:text-rose-400'}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Chat Trigger */}
            <button
              onClick={onOpenChat}
              className="relative p-2 text-slate-300 hover:bg-slate-800 rounded-lg border border-slate-800/80 transition"
              title="Business Chat"
            >
              <MessageSquare className="w-4 h-4" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadChatCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-slate-300 hover:bg-slate-800 rounded-lg border border-slate-800/80 transition"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Service Appointments Trigger */}
            {onOpenServiceAppointments && (
              <button
                onClick={onOpenServiceAppointments}
                className="relative p-2 text-slate-300 hover:bg-slate-800 rounded-lg border border-slate-800/80 transition flex items-center gap-1.5"
                title="Service Appointments & Bookings"
              >
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="hidden xl:inline text-xs font-bold text-slate-200">Appointments</span>
                {serviceAppointmentsCount > 0 && (
                  <span className="w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {serviceAppointmentsCount}
                  </span>
                )}
              </button>
            )}

            {/* Orders & Tracking Trigger */}
            {onOpenOrderTracking && (
              <button
                onClick={onOpenOrderTracking}
                className="relative p-2 text-slate-300 hover:bg-slate-800 rounded-lg border border-slate-800/80 transition flex items-center gap-1.5"
                title="Track My Orders"
              >
                <Truck className="w-4 h-4 text-indigo-400" />
                <span className="hidden xl:inline text-xs font-bold text-slate-200">Orders</span>
                {ordersCount > 0 && (
                  <span className="w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {ordersCount}
                  </span>
                )}
              </button>
            )}

            {/* Notifications */}
            <button className="hidden sm:block p-2 text-slate-300 hover:bg-slate-800 rounded-lg border border-slate-800/80 transition">
              <Bell className="w-4 h-4" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-300 hover:bg-slate-800 rounded-lg border border-slate-800/80 transition"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
