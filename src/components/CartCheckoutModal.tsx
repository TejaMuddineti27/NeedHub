import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { 
  X, Trash2, ShieldCheck, Tag, CreditCard, ArrowRight, CheckCircle2, 
  FileText, Smartphone, Share2, Copy, Check, Users, QrCode, Building2, 
  Wallet, Truck, Lock, AlertCircle, ArrowLeft, Download, ExternalLink, Sparkles 
} from 'lucide-react';

interface CartCheckoutModalProps {
  cart: CartItem[];
  initialStep?: 'cart' | 'checkout';
  onClose: () => void;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderCreated: (order: Order) => void;
  onOpenOrderTracking?: () => void;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({
  cart,
  initialStep = 'cart',
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCreated,
  onOpenOrderTracking,
}) => {
  // Navigation step state: 1: 'cart' | 2: 'details' | 3: 'payment' | 4: 'success'
  const [step, setStep] = useState<'cart' | 'details' | 'payment' | 'success'>(
    initialStep === 'checkout' && cart.length > 0 ? 'details' : 'cart'
  );

  // Customer Details Form State
  const [fullName, setFullName] = useState('Aarav Sharma');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [emailAddress, setEmailAddress] = useState('aarav.sharma@example.com');
  const [addressLine, setAddressLine] = useState('Flat 402, Sunshine Heights, 100 Ft Road');
  const [landmark, setLandmark] = useState('Near Indiranagar Metro Station');
  const [city, setCity] = useState('Bangalore');
  const [stateName, setStateName] = useState('Karnataka');
  const [pinCode, setPinCode] = useState('560038');

  // Delivery details state
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');

  // Payment Options state
  const [paymentCategory, setPaymentCategory] = useState<'upi' | 'bank_transfer' | 'card' | 'netbanking' | 'wallet' | 'cod'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [upiIdInput, setUpiIdInput] = useState('aarav@okicici');
  const [upiVerified, setUpiVerified] = useState(false);

  // Card payment form state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('782');
  const [cardName, setCardName] = useState('AARAV SHARMA');

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Coupon promo code state
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Status & Confirmation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Calculated Pricing
  const subtotal = cart.reduce((sum, item) => sum + (item.negotiatedPrice || item.product.price) * item.quantity, 0);
  const tax = subtotal > 0 ? Number((subtotal * 0.05).toFixed(2)) : 0;
  const deliveryFee = subtotal >= 999 ? (deliveryType === 'express' ? 80 : 0) : (deliveryType === 'express' ? 120 : 49);
  const grandTotal = Math.max(0, subtotal + tax + deliveryFee - discountAmount);

  // Dynamic estimated delivery date calculation
  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const daysToAdd = deliveryType === 'express' ? 1 : 3;
    today.setDate(today.getDate() + daysToAdd);
    return today.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleCopyShareableLink = () => {
    if (cart.length === 0) return;
    const cartSummary = cart.map((item) => `${item.product.id}:${item.quantity}`).join(',');
    const encoded = encodeURIComponent(cartSummary);
    const shareableUrl = `${window.location.origin}/cart/share?items=${encoded}&groupBuy=true`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareableUrl);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'NEEDHUB10' || code === 'FIRSTBUY') {
      setDiscountAmount(100);
      setCouponApplied(true);
    } else if (code === 'SUPER20') {
      setDiscountAmount(Math.round(subtotal * 0.2));
      setCouponApplied(true);
    } else {
      alert('Invalid code. Try "NEEDHUB10" for ₹100 OFF or "SUPER20" for 20% OFF!');
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !mobileNumber || !addressLine || !pinCode) {
      alert('Please fill in all required customer and delivery address fields.');
      return;
    }
    if (mobileNumber.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    setStep('payment');
  };

  const handleFinalCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    const fullFormattedAddress = `${addressLine}, ${landmark ? landmark + ', ' : ''}${city}, ${stateName} - ${pinCode}`;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'cust_101',
          customerName: fullName,
          items: cart.map((item) => ({
            productId: item.product.id,
            title: item.product.title,
            price: item.negotiatedPrice || item.product.price,
            quantity: item.quantity,
            image: item.product.images[0],
            sellerName: item.product.sellerName,
          })),
          totalAmount: grandTotal,
          taxAmount: tax,
          shippingFee: deliveryFee,
          paymentMethod: paymentCategory,
          deliveryAddress: fullFormattedAddress,
        }),
      });

      const data = await response.json();
      if (data.success && data.order) {
        setCompletedOrder(data.order);
        onOrderCreated(data.order);
        onClearCart();
        setStep('success');
      }
    } catch (err) {
      console.error('Checkout submit error:', err);
      alert('Failed to place order. Please check network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintInvoice = () => {
    if (!completedOrder) return;
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tax Invoice #${completedOrder.id}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 30px; color: #0f172a; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #4f46e5; padding-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            th { background: #f8fafc; text-transform: uppercase; }
            .right { text-align: right; }
            .total { font-size: 18px; font-weight: bold; color: #4f46e5; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2 style="margin:0; color:#4f46e5;">NEEDHUB MARKETPLACE</h2>
              <p style="margin:4px 0 0; color:#64748b;">Official Tax Invoice & Receipt</p>
            </div>
            <div style="text-align:right;">
              <p style="margin:0; font-weight:bold;">Invoice: #${completedOrder.id}</p>
              <p style="margin:2px 0 0; color:#64748b;">Date: ${completedOrder.createdAt}</p>
            </div>
          </div>
          <div style="margin-top:20px;">
            <p><strong>Customer:</strong> ${completedOrder.customerName} (${mobileNumber})</p>
            <p><strong>Delivery Address:</strong> ${completedOrder.deliveryAddress}</p>
            <p><strong>Payment Method:</strong> ${completedOrder.paymentMethod.toUpperCase()} (STATUS: PAID)</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th class="right">Price</th>
                <th class="right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${completedOrder.items.map(i => `
                <tr>
                  <td>${i.title}<br/><small style="color:#64748b;">Seller: ${i.sellerName}</small></td>
                  <td>${i.quantity}</td>
                  <td class="right">₹${i.price.toLocaleString('en-IN')}</td>
                  <td class="right">₹${(i.price * i.quantity).toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="margin-top:20px; text-align:right;">
            <p>Subtotal: ₹${subtotal.toLocaleString('en-IN')}</p>
            <p>GST & Tax: ₹${tax.toLocaleString('en-IN')}</p>
            <p>Delivery Fee: ₹${deliveryFee.toLocaleString('en-IN')}</p>
            <p class="total">Grand Total: ₹${completedOrder.totalAmount.toLocaleString('en-IN')}</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 my-8 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            {step !== 'cart' && step !== 'success' && (
              <button
                type="button"
                onClick={() => setStep(step === 'payment' ? 'details' : 'cart')}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {step === 'cart' && 'Your Shopping Cart'}
                {step === 'details' && 'Checkout & Booking Details'}
                {step === 'payment' && 'Select Payment Option'}
                {step === 'success' && 'Payment Success & Invoice'}
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                NeedHub 100% Escrow Protection Guaranteed
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Indicator Bar */}
        {step !== 'success' && (
          <div className="px-6 py-2.5 bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
            <div className={`flex items-center gap-1.5 ${step === 'cart' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
              <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">1</span>
              <span>Cart</span>
            </div>
            <div className="h-0.5 flex-1 mx-2 bg-slate-200 dark:bg-slate-700" />
            <div className={`flex items-center gap-1.5 ${step === 'details' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
              <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">2</span>
              <span>Details</span>
            </div>
            <div className="h-0.5 flex-1 mx-2 bg-slate-200 dark:bg-slate-700" />
            <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
              <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">3</span>
              <span>Payment</span>
            </div>
          </div>
        )}

        {/* Modal Main Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* ================= STEP 1: SHOPPING CART ================= */}
          {step === 'cart' && (
            <div className="space-y-6">
              
              {/* Group Buy Share Link Banner */}
              {cart.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 shadow-xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        Group Buying & Social Sharing
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Share your active cart URL with friends or family to purchase together
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyShareableLink}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 active:scale-95 shadow-xs ${
                      copiedLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Copy Shareable Link</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Cart List */}
              {cart.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Your cart is currently empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Explore products, services, and local crafts to add items to your shopping cart!
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>Items in Cart ({cart.length})</span>
                    <button
                      onClick={onClearCart}
                      className="text-rose-500 hover:underline normal-case text-[11px]"
                    >
                      Clear All
                    </button>
                  </div>

                  {cart.map((item) => {
                    const itemUnitPrice = item.negotiatedPrice || item.product.price;
                    const itemTotalPrice = itemUnitPrice * item.quantity;

                    return (
                      <div
                        key={item.product.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                              {item.product.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              Seller: {item.product.sellerName}
                            </p>
                            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">
                              ₹{itemUnitPrice.toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-normal">/ unit</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="px-2.5 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              -
                            </button>
                            <span className="px-3 text-xs font-bold text-slate-900 dark:text-white font-mono">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2.5 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              +
                            </button>
                          </div>

                          {/* Item Subtotal & Trash */}
                          <div className="text-right min-w-[70px]">
                            <span className="text-xs font-mono font-black text-slate-900 dark:text-white block">
                              ₹{itemTotalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Coupon Code Input */}
              {cart.length > 0 && (
                <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder='Promo code (e.g. "NEEDHUB10" or "SUPER20")'
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-slate-800 transition"
                  >
                    Apply Promo
                  </button>
                </form>
              )}

              {/* Cart Price Breakdown */}
              {cart.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Items Subtotal:</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>GST & Tax (5%):</span>
                    <span>₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Promo Discount:</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span>Subtotal Payable:</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {cart.length > 0 && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition"
                  >
                    Continue Shopping
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition"
                  >
                    <span>Proceed to Delivery & Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ================= STEP 2: CUSTOMER & DELIVERY DETAILS ================= */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                1. Customer Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Aarav Sharma"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="aarav@example.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider pt-2">
                2. Shipping & Delivery Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Delivery House / Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="Flat 402, Sunshine Heights, 100 Ft Road"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Near Metro Station"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bangalore"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="560038"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider pt-2">
                3. Delivery Method Selection
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setDeliveryType('standard')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                    deliveryType === 'standard'
                      ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Standard Delivery</span>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {subtotal >= 999 ? 'FREE' : '₹49'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Est. Arrival: {getEstimatedDeliveryDate()} (3-5 Days)
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setDeliveryType('express')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                    deliveryType === 'express'
                      ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/60 ring-2 ring-amber-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Express Superfast</span>
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                        {subtotal >= 999 ? '₹80' : '₹120'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Est. Arrival: Tomorrow (1-2 Days)
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit to Payment Step */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition"
              >
                <span>Continue to Payment Options (Total: ₹{grandTotal.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ================= STEP 3: PAYMENT OPTIONS ================= */}
          {step === 'payment' && (
            <div className="space-y-5">
              
              {/* Security Shield Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">256-Bit SSL Encrypted Escrow Gateway</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-200 dark:bg-emerald-900 rounded-md font-extrabold">
                  PCI-DSS VERIFIED
                </span>
              </div>

              {/* Category Method Switcher */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR Code', icon: QrCode },
                  { id: 'bank_transfer', label: 'Bank Transfer', icon: Building2 },
                  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                  { id: 'netbanking', label: 'Net Banking', icon: FileText },
                  { id: 'wallet', label: 'Wallets', icon: Wallet },
                  { id: 'cod', label: 'Cash on Delivery', icon: Truck },
                ].map((item) => {
                  const IconComp = item.icon;
                  const active = paymentCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentCategory(item.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 ${
                        active
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <IconComp className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* PAYMENT OPTION 1: UPI */}
              {paymentCategory === 'upi' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Instant UPI App / ID / QR Scanner
                  </h4>

                  {/* App buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'gpay', name: 'Google Pay', color: 'bg-blue-600' },
                      { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-600' },
                      { id: 'paytm', name: 'Paytm UPI', color: 'bg-sky-500' },
                      { id: 'bhim', name: 'BHIM UPI', color: 'bg-emerald-600' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.id as any)}
                        className={`p-2 rounded-xl text-center text-[11px] font-bold border transition ${
                          selectedUpiApp === app.id
                            ? 'border-indigo-600 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {app.name}
                      </button>
                    ))}
                  </div>

                  {/* UPI ID Field */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Enter UPI VPA ID
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={upiIdInput}
                        onChange={(e) => setUpiIdInput(e.target.value)}
                        placeholder="username@okicici"
                        className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setUpiVerified(true)}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        {upiVerified ? 'Verified ✓' : 'Verify'}
                      </button>
                    </div>
                  </div>

                  {/* Dynamic QR Code */}
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-4">
                    <div className="w-20 h-20 bg-slate-900 text-white rounded-lg flex items-center justify-center font-mono text-[9px] p-2 text-center shrink-0 border border-indigo-500/40">
                      [UPI QR CODE GENERATED]
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="font-extrabold text-slate-900 dark:text-white">Scan & Pay via any UPI App</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Scan with GPay, PhonePe, Paytm, or Cred to complete escrow payment of <strong className="text-indigo-600 dark:text-indigo-400">₹{grandTotal.toLocaleString('en-IN')}</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT OPTION 2: BANK TRANSFER */}
              {paymentCategory === 'bank_transfer' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    NeedHub Escrow Bank Account Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 font-mono bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Bank Name:</span>
                      <strong className="text-slate-900 dark:text-white">HDFC Bank Ltd</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Account Holder:</span>
                      <strong className="text-slate-900 dark:text-white">NeedHub Escrow Pvt Ltd</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Account Number:</span>
                      <strong className="text-indigo-600 dark:text-indigo-400">5020 0084 9302 19</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">IFSC Code:</span>
                      <strong className="text-slate-900 dark:text-white">HDFC0001209</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-400 block font-sans">Branch:</span>
                      <strong className="text-slate-900 dark:text-white">Indiranagar Branch, Bangalore</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT OPTION 3: CARDS */}
              {paymentCategory === 'card' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Credit / Debit Card Payment
                  </h4>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 0000 0000 0000"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="08/28"
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">CVV Security</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="782"
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Name on Card</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="AARAV SHARMA"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT OPTION 4: NET BANKING */}
              {paymentCategory === 'netbanking' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Select Your Bank
                  </h4>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                  </select>
                </div>
              )}

              {/* PAYMENT OPTION 5: WALLETS */}
              {paymentCategory === 'wallet' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Choose Digital Wallet
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['NeedHub Escrow Wallet (Balance: ₹5,000)', 'Paytm Wallet', 'PhonePe Wallet', 'Amazon Pay'].map((w, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-left text-xs font-bold text-slate-900 dark:text-white hover:border-indigo-600 transition"
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PAYMENT OPTION 6: COD */}
              {paymentCategory === 'cod' && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2 text-xs text-amber-900 dark:text-amber-300">
                  <h4 className="font-bold flex items-center gap-1">
                    <Truck className="w-4 h-4" /> Cash on Delivery (COD) Selected
                  </h4>
                  <p className="text-[11px] text-amber-800 dark:text-amber-400">
                    Pay ₹{grandTotal.toLocaleString('en-IN')} via Cash or UPI QR Code directly to the delivery partner upon arrival. OTP verification is required.
                  </p>
                </div>
              )}

              {/* Order Summary Final Bar */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1 font-mono">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Grand Total Payable:</span>
                  <span className="text-base font-black text-emerald-400">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans">
                  Includes Items: ₹{subtotal} + Taxes: ₹{tax} + Delivery: ₹{deliveryFee}
                </p>
              </div>

              {/* Final Submit Button */}
              <button
                type="button"
                onClick={handleFinalCheckout}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Securing Payment & Confirming Order...'
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Pay ₹{grandTotal.toLocaleString('en-IN')} & Confirm Order</span>
                  </>
                )}
              </button>

            </div>
          )}

          {/* ================= STEP 4: PAYMENT SUCCESS & PRINT INVOICE ================= */}
          {step === 'success' && completedOrder && (
            <div className="p-6 space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Payment Confirmed & Order Placed!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Order Reference: <span className="font-mono font-bold text-slate-900 dark:text-white">{completedOrder.id}</span>
                </p>
              </div>

              {/* OTP Delivery Box */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 max-w-md mx-auto space-y-1 text-center">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center justify-center gap-1">
                  <Smartphone className="w-4 h-4" /> Delivery Verification OTP Code
                </span>
                <p className="text-3xl font-mono font-black text-amber-700 dark:text-amber-400 tracking-widest">
                  {completedOrder.otpCode || '1234'}
                </p>
                <p className="text-[11px] text-amber-800 dark:text-amber-400">
                  Provide this 4-digit code to the delivery partner when your package arrives to authorize delivery.
                </p>
              </div>

              {/* Summary Details */}
              <div className="text-left p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2 text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto font-mono">
                <div className="flex justify-between">
                  <span>Customer Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount Paid:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{completedOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-bold uppercase text-emerald-600">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{getEstimatedDeliveryDate()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Print Invoice</span>
                </button>

                {onOpenOrderTracking && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenOrderTracking();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Track Order Live</span>
                  </button>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
