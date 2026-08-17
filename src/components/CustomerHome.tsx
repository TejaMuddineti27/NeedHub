import React, { useState } from 'react';
import { Product, Story } from '../types';
import { Sparkles, MapPin, Tag, ShieldCheck, Heart, Zap, Clock, MessageSquare, Plus, Phone } from 'lucide-react';
import { FlashSaleTimer } from './FlashSaleTimer';

interface CustomerHomeProps {
  products: Product[];
  stories: Story[];
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onBookService?: (service: Product) => void;
  onOpenChatWithSeller: (sellerId: string, sellerName: string) => void;
  onOpenAIAssistant: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  products,
  stories,
  wishlist,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  onBookService,
  onOpenChatWithSeller,
  onOpenAIAssistant,
  selectedCategory,
  setSelectedCategory,
}) => {
  const categories = [
    { id: 'all', label: 'All Marketplace' },
    { id: 'freelance', label: '🛠️ Services & Freelance' },
    { id: 'wishlist', label: `❤️ Saved Wishlist (${wishlist.length})` },
    { id: 'physical', label: 'Physical Products' },
    { id: 'handmade', label: 'Handmade & Crafts' },
    { id: 'second_hand', label: 'Refurbished & Second-Hand' },
    { id: 'farm', label: 'Farm Produce & Grocery' },
    { id: 'digital', label: 'Digital Assets' },
  ];

  const handleHeartClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onToggleWishlist(id);
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'wishlist') return wishlist.includes(p.id);
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'physical') return p.type === 'physical';
    if (selectedCategory === 'handmade') return p.type === 'handmade';
    if (selectedCategory === 'freelance') return p.type === 'freelance' || p.type === 'service';
    if (selectedCategory === 'second_hand') return p.type === 'second_hand';
    if (selectedCategory === 'farm') return p.type === 'farm';
    if (selectedCategory === 'digital') return p.type === 'digital';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Stories Carousel (Instagram Shop Style) */}
      <section className="bg-[#070e1e] border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
            <h3 className="font-bold text-sm text-white font-sans">Seller Stories & Live Updates</h3>
          </div>
          <span className="text-xs text-blue-400 font-medium font-mono">Tap to view</span>
        </div>
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => {
                const taggedProd = products.find((p) => p.id === story.taggedProductId);
                if (taggedProd) onSelectProduct(taggedProd);
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-500 group-hover:scale-105 transition-transform">
                <img
                  src={story.mediaUrl}
                  alt={story.sellerName}
                  className="w-full h-full object-cover rounded-full border-2 border-[#070e1e]"
                />
              </div>
              <span className="text-[11px] font-medium text-slate-300 max-w-[70px] truncate text-center">
                {story.sellerName}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-[#070e1e] to-indigo-950 text-white p-6 md:p-10 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 text-xs font-semibold text-blue-300 border border-blue-500/30 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> AI-Powered Hyperlocal & Global Marketplace
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Buy, Sell, Bargain & Hire Services — All in NeedHub.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            From handmade artisan crafts and certified refurbished tech to farm-fresh groceries and local on-demand technicians. Guaranteed with Escrow Payments & Gemini AI Shopping Assistant.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onOpenAIAssistant}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center gap-2 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-blue-200" /> Ask AI Shopping Advisor
            </button>
            <button
              onClick={() => setSelectedCategory('freelance')}
              className="px-4 py-2 rounded-lg bg-[#020617] hover:bg-slate-800 text-slate-200 font-medium text-xs sm:text-sm border border-slate-700 transition"
            >
              Explore Services & Freelancing
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none p-6">
          <Zap className="w-96 h-96 text-blue-400" />
        </div>
      </section>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition shrink-0 border ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-[#070e1e] text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product & Service Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Featured Offerings</h2>
            <p className="text-xs text-slate-400 font-mono">
              Showing {filteredProducts.length} items with Escrow buyer protection
            </p>
          </div>
          <span className="text-xs font-mono text-blue-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Realtime Sync
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-[#070e1e] border border-slate-800 rounded-3xl space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-white">Your Saved Wishlist is Empty</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tap the heart icon on any product or service listing to save items to your wishlist for instant access!
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
            >
              Browse All Listings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isFav = wishlist.includes(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group bg-[#070e1e] border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-xl transition duration-200 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative aspect-4/3 bg-[#020617] overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-black/80 backdrop-blur-md text-slate-200 border border-white/10 uppercase tracking-wider font-mono">
                          {product.type.replace('_', ' ')}
                        </span>
                        {product.isFlashSale && (
                          <FlashSaleTimer variant="compact" productId={product.id} />
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => handleHeartClick(e, product.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-200 hover:text-rose-500 transition border border-slate-700/50"
                        title={isFav ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart className={`w-4 h-4 transition ${isFav ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                      </button>

                    {/* Distance badge if nearby */}
                    {product.distanceKm && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-950/90 backdrop-blur-md text-emerald-400 border border-emerald-700/60 flex items-center gap-1 font-mono">
                        <MapPin className="w-3 h-3" /> {product.distanceKm} km nearby
                      </div>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="p-4 space-y-2">
                    {/* Seller info */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-medium truncate max-w-[150px] flex items-center gap-1 text-slate-300">
                        {product.sellerName}
                        {product.sellerVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-400 inline" />}
                      </span>
                      <span className="text-amber-400 font-semibold font-mono">★ {product.rating}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm text-white line-clamp-2 group-hover:text-blue-400 transition">
                      {product.title}
                    </h3>

                    {/* Description excerpt */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Service Direct Contact Indicator */}
                    {(product.type === 'service' || product.type === 'freelance') && (
                      <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-400 font-medium bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/50">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-400 animate-pulse" />
                          <span>Direct Contact Details</span>
                        </span>
                        <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.2 rounded font-mono">
                          Call / WA / Email
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer / Price & Action */}
                <div className="p-4 pt-3 border-t border-slate-800/80 mt-2 flex items-center justify-between bg-[#040a17]">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold text-white font-mono">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-500 line-through font-mono">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    {product.aiSuggestedPrice && (
                      <span className="text-[10px] text-emerald-400 font-medium font-mono block">
                        AI Evaluated Fair Price
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Bargain / Chat */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenChatWithSeller(product.sellerId, product.sellerName);
                      }}
                      className="p-2 rounded-lg bg-[#020617] hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition"
                      title="Negotiate Price / Chat"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>

                    {/* Services vs Products Actions */}
                    {product.type === 'service' || product.type === 'freelance' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onBookService) {
                            onBookService(product);
                          } else {
                            onSelectProduct(product);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition flex items-center gap-1.5 active:scale-95 shadow-md shadow-blue-600/20"
                        title="Choose Time Slot & Book Appointment"
                      >
                        <Clock className="w-3.5 h-3.5 text-blue-200" /> Book
                      </button>
                    ) : (
                      <>
                        {/* Add to Cart */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition flex items-center gap-1 border border-slate-700"
                          title="Add to Shopping Cart"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>

                        {/* Buy Now */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onBuyNow) {
                              onBuyNow(product);
                            } else {
                              onAddToCart(product);
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition flex items-center gap-1 active:scale-95 shadow-md shadow-indigo-600/20"
                          title="Buy Now (Instant Checkout)"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Buy
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </section>

    </div>
  );
};
