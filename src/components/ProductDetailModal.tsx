import React, { useState } from 'react';
import { Product } from '../types';
import {
  X,
  ShieldCheck,
  MapPin,
  Truck,
  Sparkles,
  MessageSquare,
  ShoppingBag,
  Heart,
  Star,
  CheckCircle,
  Phone,
  Mail,
  Clock,
  Copy,
  Check,
  Send,
  UserCheck,
} from 'lucide-react';
import { FlashSaleTimer } from './FlashSaleTimer';
import { ProductReview } from './ProductReview';

interface ProductDetailModalProps {
  product: Product | null;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onBookService?: (service: Product) => void;
  onOpenChatWithOffer: (sellerId: string, sellerName: string, offerPrice?: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isWishlisted = false,
  onToggleWishlist,
  onClose,
  onAddToCart,
  onBuyNow,
  onBookService,
  onOpenChatWithOffer,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');
  const [offerInput, setOfferInput] = useState(
    product.aiSuggestedPrice ? String(product.aiSuggestedPrice) : String(Math.round(product.price * 0.9))
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeActionNotice, setActiveActionNotice] = useState<string | null>(null);

  const isService = product.type === 'service' || product.type === 'freelance';

  // Contact info values with robust fallbacks
  const providerName = product.sellerName;
  const phone = product.providerPhone || '+91 98765 43210';
  const email = product.providerEmail || 'contact@needhubprovider.com';
  const whatsapp = product.providerWhatsapp || phone;
  const address = product.providerAddress || product.location || 'Local Doorstep Service Center';
  const workingHours = product.providerWorkingHours || 'Mon - Sat: 9:00 AM - 8:00 PM';

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSendOffer = () => {
    const offerNum = parseFloat(offerInput);
    if (!isNaN(offerNum)) {
      onOpenChatWithOffer(product.sellerId, product.sellerName, offerNum);
      onClose();
    }
  };

  const handleCallAction = () => {
    setActiveActionNotice(`Initiating phone call to ${providerName} (${phone})...`);
    window.location.href = `tel:${phone.replace(/\s+/g, '')}`;
    setTimeout(() => setActiveActionNotice(null), 4000);
  };

  const handleMessageAction = () => {
    onOpenChatWithOffer(product.sellerId, product.sellerName);
    onClose();
  };

  const handleWhatsAppAction = () => {
    const cleanNumber = whatsapp.replace(/[^0-9]/g, '');
    const textMessage = encodeURIComponent(
      `Hello ${providerName}, I am inquiring about "${product.title}" listed on NeedHub.`
    );
    setActiveActionNotice(`Redirecting to WhatsApp chat with ${providerName}...`);
    window.open(`https://wa.me/${cleanNumber}?text=${textMessage}`, '_blank');
    setTimeout(() => setActiveActionNotice(null), 3500);
  };

  const handleEmailAction = () => {
    const subject = encodeURIComponent(`Service Inquiry: ${product.title}`);
    const body = encodeURIComponent(
      `Hi ${providerName},\n\nI am interested in your service "${product.title}". Please provide more details regarding booking and availability.\n\nThank you!`
    );
    setActiveActionNotice(`Opening email client for ${email}...`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setTimeout(() => setActiveActionNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Notice Toast Banner */}
        {activeActionNotice && (
          <div className="bg-indigo-600 text-white text-xs font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2 animate-pulse">
            <CheckCircle className="w-4 h-4" />
            <span>{activeActionNotice}</span>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-5 pb-1 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-indigo-600'
            }`}
          >
            <span>Overview & Contact Details</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-indigo-600'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
            <span>Ratings & Reviews</span>
            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold">
              {product.rating} ★
            </span>
          </button>
        </div>

        {activeTab === 'reviews' ? (
          <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
            <ProductReview product={product} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          
          {/* Left Column: Image Gallery & Escrow */}
          <div className="space-y-4">
            <div className="relative aspect-4/3 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-800">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full bg-indigo-600 text-white uppercase tracking-wider">
                {product.type.replace('_', ' ')}
              </span>
            </div>

            {/* Thumbnail switcher */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      selectedImage === img ? 'border-indigo-600 scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Escrow Guarantee Box */}
            {/* Service Guarantee Card */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> NeedHub Escrow Protection Enabled
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Your payment is held safely in escrow. Funds are released to the service provider only after you confirm service delivery with OTP or inspect completion.
              </p>
            </div>

            {/* Service Provider Working Hours & Address Card (Left Side Extra) */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                <Clock className="w-4 h-4 text-indigo-500" /> Service Availability & Hours
              </span>
              <div className="text-slate-600 dark:text-slate-300 space-y-1 text-[11px]">
                <p><strong className="text-slate-700 dark:text-slate-200">Hours:</strong> {workingHours}</p>
                <p><strong className="text-slate-700 dark:text-slate-200">Location:</strong> {address}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Service Information & Provider Contact */}
          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              
              {/* Service/Seller Tag & Location */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 font-medium">
                  <UserCheck className="w-4 h-4 text-indigo-500" />
                  <span className="font-bold text-slate-900 dark:text-slate-200">{providerName}</span>
                  {product.sellerVerified && (
                    <span className="inline-flex items-center text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-full font-bold">
                      Verified Provider
                    </span>
                  )}
                </div>
                {product.location && (
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {product.location}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {product.title}
              </h2>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-current" /> {product.rating}
                </div>
                <span className="text-slate-400">({product.reviewCount} customer reviews)</span>
              </div>

              {/* Flash Sale Countdown Timer */}
              {product.isFlashSale && (
                <FlashSaleTimer variant="detailed" productId={product.id} />
              )}

              {/* Price & AI Evaluation Badge */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through font-mono">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Available for Immediate Booking
                  </span>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-bold">
                    <Sparkles className="w-3 h-3 text-purple-500" /> AI Estimate
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    Fair Market Rate: ₹{(product.aiSuggestedPrice || product.price).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* ======================================================== */}
              {/* SERVICE PROVIDER CONTACT DETAILS CARD (PROMINENT SECTION) */}
              {/* ======================================================== */}
              <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800/80 space-y-3 shadow-xs">
                
                <div className="flex items-center justify-between border-b border-indigo-200/60 dark:border-indigo-800/60 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <h3 className="font-extrabold text-xs text-indigo-950 dark:text-indigo-200 uppercase tracking-wide">
                      Service Provider Contact Details
                    </h3>
                  </div>
                  <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-100 dark:bg-indigo-900/80 px-2 py-0.5 rounded-full">
                    Direct Contact
                  </span>
                </div>

                {/* Contact Information Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  
                  {/* Provider Name */}
                  <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-slate-800">
                    <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-slate-400 block font-medium">Provider Name</span>
                      <span className="font-bold text-slate-900 dark:text-white text-xs truncate block">
                        {providerName}
                      </span>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block font-medium">Phone Number</span>
                        <span className="font-bold text-slate-900 dark:text-white text-xs font-mono truncate block">
                          {phone}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(phone, 'Phone number')}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-indigo-600 transition shrink-0"
                      title="Copy Phone Number"
                    >
                      {copiedField === 'Phone number' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Email Address */}
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block font-medium">Email Address</span>
                        <span className="font-bold text-slate-900 dark:text-white text-xs font-mono truncate block">
                          {email}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(email, 'Email address')}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-indigo-600 transition shrink-0"
                      title="Copy Email Address"
                    >
                      {copiedField === 'Email address' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* WhatsApp Contact */}
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block font-medium">WhatsApp</span>
                        <span className="font-bold text-slate-900 dark:text-white text-xs font-mono truncate block">
                          {whatsapp}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(whatsapp, 'WhatsApp number')}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-indigo-600 transition shrink-0"
                      title="Copy WhatsApp Number"
                    >
                      {copiedField === 'WhatsApp number' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Business Address */}
                  <div className="sm:col-span-2 flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block font-medium">Business Address</span>
                        <span className="font-medium text-slate-900 dark:text-slate-200 text-xs truncate block">
                          {address}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(address, 'Business address')}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-indigo-600 transition shrink-0"
                      title="Copy Business Address"
                    >
                      {copiedField === 'Business address' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                </div>

                {/* QUICK ACTION BUTTONS */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-indigo-900 dark:text-indigo-300 block uppercase tracking-wide">
                    Quick Actions (Contact Before Booking)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    
                    {/* Call Button */}
                    <button
                      type="button"
                      onClick={handleCallAction}
                      className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                      title="Call Provider Now"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </button>

                    {/* Message Button */}
                    <button
                      type="button"
                      onClick={handleMessageAction}
                      className="py-2 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                      title="Send In-App Message"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Message
                    </button>

                    {/* WhatsApp Button */}
                    <button
                      type="button"
                      onClick={handleWhatsAppAction}
                      className="py-2 px-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                      title="Chat on WhatsApp"
                    >
                      <Send className="w-3.5 h-3.5" /> WhatsApp
                    </button>

                    {/* Email Button */}
                    <button
                      type="button"
                      onClick={handleEmailAction}
                      className="py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                      title="Send Email Inquiry"
                    >
                      <Mail className="w-3.5 h-3.5" /> Email
                    </button>

                  </div>
                </div>

              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Warranty & Guarantee Info */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  {isService ? (
                    <Clock className="w-4 h-4 text-indigo-500" />
                  ) : (
                    <Truck className="w-4 h-4 text-indigo-500" />
                  )}
                  <span>
                    {isService
                      ? 'Scheduled Appointment Execution'
                      : product.deliveryTimeEstimate || 'Standard Shipping'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>{product.warranty || 'NeedHub Verified Guarantee'}</span>
                </div>
              </div>

            </div>

            {/* Bargain Offer & Booking / Cart Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              
              {/* WhatsApp Bargain Offer Box */}
              <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" /> Negotiate Rate / Custom Service Offer
                </span>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">₹</span>
                    <input
                      type="number"
                      value={offerInput}
                      onChange={(e) => setOfferInput(e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-xl text-slate-900 dark:text-white"
                      placeholder="Offer Amount"
                    />
                  </div>
                  <button
                    onClick={handleSendOffer}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
                  >
                    Send Offer
                  </button>
                </div>
              </div>

              {/* Action Buttons: Services vs Products */}
              {isService ? (
                /* SERVICE ACTIONS: Dedicated Appointment Booking */
                <div className="flex items-center gap-2">
                  {onToggleWishlist && (
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      className={`p-3 rounded-xl border transition flex items-center justify-center shrink-0 ${
                        isWishlisted
                          ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-500'
                      }`}
                      title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onBookService) {
                        onBookService(product);
                      }
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
                  >
                    <Clock className="w-4 h-4 text-blue-200" />
                    <span>Select Time Slot & Book Appointment</span>
                  </button>
                </div>
              ) : (
                /* PRODUCT ACTIONS: Add to Cart & Buy Now */
                <div className="flex items-center gap-2">
                  {onToggleWishlist && (
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      className={`p-3 rounded-xl border transition flex items-center justify-center shrink-0 ${
                        isWishlisted
                          ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-500'
                      }`}
                      title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    className="flex-1 py-3 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
                  >
                    <ShoppingBag className="w-4 h-4 text-indigo-500" /> Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      if (onBuyNow) {
                        onBuyNow(product);
                      } else {
                        onAddToCart(product);
                      }
                      onClose();
                    }}
                    className="flex-1 py-3 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
                  >
                    <Sparkles className="w-4 h-4" /> Buy Now
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
        )}

      </div>
    </div>
  );
};

