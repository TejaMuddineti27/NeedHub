import React, { useState } from 'react';
import { Order } from '../types';
import { 
  X, Package, CheckCircle2, Truck, Clock, MapPin, 
  ChevronRight, Download, FileText, Phone, ShieldCheck, Search, AlertCircle, Sparkles 
} from 'lucide-react';

interface OrderTrackingModalProps {
  orders: Order[];
  onClose: () => void;
  onSelectOrderToTrack?: (orderId: string) => void;
}

const STAGES = [
  { key: 'pending', label: 'Order Placed', desc: 'Order received & logged' },
  { key: 'processing', label: 'Payment Confirmed', desc: 'Escrow payment verified' },
  { key: 'accepted', label: 'Seller Accepted', desc: 'Merchant accepted order' },
  { key: 'packed', label: 'Packed', desc: 'Package sealed with safety tape' },
  { key: 'shipped', label: 'Shipped', desc: 'In transit with logistics partner' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Partner arriving at address' },
  { key: 'delivered', label: 'Delivered', desc: 'OTP verified & delivered' },
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  orders,
  onClose,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.length > 0 ? orders[0].id : ''
  );
  const [searchQuery, setSearchQuery] = useState('');

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'accepted': return 2;
      case 'packed': return 3;
      case 'shipped': return 4;
      case 'out_for_delivery': return 5;
      case 'delivered': return 6;
      default: return 1;
    }
  };

  const currentStageIdx = currentOrder ? getStageIndex(currentOrder.status) : 1;

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print tax invoice.');
      return;
    }

    const itemsRows = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}<br/><small style="color: #666;">Seller: ${item.sellerName}</small></td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
        </tr>
      `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; margin: 40px; color: #1e293b; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; }
            .badge { background: #e0e7ff; color: #4338ca; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f8fafc; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; }
            .totals { margin-top: 30px; margin-left: auto; width: 300px; }
            .totals div { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
            .totals .grand { font-weight: 800; font-size: 18px; border-top: 2px solid #1e293b; padding-top: 10px; color: #4338ca; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 style="margin: 0; color: #4338ca;">NEEDHUB MARKETPLACE</h1>
              <p style="margin: 4px 0 0; color: #64748b; font-size: 13px;">Official Tax Invoice & Payment Receipt</p>
            </div>
            <div>
              <span class="badge">PAID (ESCROW PROTECTED)</span>
              <p style="margin: 8px 0 0; font-weight: bold; text-align: right;">Invoice #${order.id}</p>
              <p style="margin: 2px 0 0; font-size: 12px; color: #64748b; text-align: right;">Date: ${order.createdAt}</p>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 30px; font-size: 13px;">
            <div>
              <strong>Billed To:</strong><br/>
              ${order.customerName}<br/>
              Address: ${order.deliveryAddress}<br/>
              Phone: +91 98765 43210
            </div>
            <div>
              <strong>Payment Information:</strong><br/>
              Method: ${order.paymentMethod.toUpperCase()}<br/>
              Status: ${order.paymentStatus.toUpperCase()}<br/>
              Verification OTP: ${order.otpCode || '1234'}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="totals">
            <div><span>Subtotal:</span> <span>₹${order.totalAmount - order.taxAmount}</span></div>
            <div><span>GST & Taxes (5%):</span> <span>₹${order.taxAmount}</span></div>
            <div><span>Shipping Fee:</span> <span>FREE</span></div>
            <div class="grand"><span>Total Amount Paid:</span> <span>₹${order.totalAmount.toLocaleString('en-IN')}</span></div>
          </div>

          <div class="footer">
            <p>Thank you for shopping on NeedHub Marketplace. All transactions are protected by NeedHub Escrow Assurance.</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((i) => i.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 my-8 flex flex-col md:flex-row max-h-[85vh]">
        
        {/* Left Sidebar - Orders List */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" />
                <span>My Orders ({orders.length})</span>
              </h3>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order ID or item..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Orders Scrollable List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No matching orders found.
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = order.id === currentOrder?.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition border text-left ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                        : 'bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-mono text-xs font-black ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {order.id}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className={`text-xs truncate font-medium ${isSelected ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-300'}`}>
                      {order.items.map((i) => i.title).join(', ')}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 dark:border-slate-700/50 text-[11px]">
                      <span className={isSelected ? 'text-indigo-200' : 'text-slate-400'}>
                        {order.createdAt}
                      </span>
                      <span className={`font-mono font-bold ${isSelected ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}>
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Content - Order Status & Details */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Order Details & Live Tracker
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase">
                  {currentOrder?.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Order Reference: <span className="font-mono font-bold text-slate-900 dark:text-white">{currentOrder?.id}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {currentOrder && (
                <button
                  onClick={() => handlePrintInvoice(currentOrder)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
                  title="Download / Print Tax Invoice"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tax Invoice</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!currentOrder ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No orders selected. Place your first order on NeedHub!
            </div>
          ) : (
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">

              {/* Delivery OTP Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500 text-white font-black shrink-0 shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-amber-900 dark:text-amber-300">
                      Handover OTP Code
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Share this OTP with your delivery partner upon package hand-off
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-950 text-amber-400 font-mono font-black text-xl tracking-widest border border-amber-500/40">
                  {currentOrder.otpCode || '1234'}
                </div>
              </div>

              {/* Visual 7-Stage Tracker */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-indigo-600" /> Live Delivery Pipeline Status
                  </h3>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {currentOrder.estimatedDelivery || 'Est: 1-2 Days'}
                  </span>
                </div>

                {/* Progress Bar Line */}
                <div className="relative py-2">
                  <div className="hidden sm:block absolute top-1/2 left-4 right-4 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0" />
                  <div
                    className="hidden sm:block absolute top-1/2 left-4 h-1 bg-indigo-600 -translate-y-1/2 transition-all duration-500 z-0"
                    style={{
                      width: `${(currentStageIdx / (STAGES.length - 1)) * 92}%`,
                    }}
                  />

                  {/* Stages List */}
                  <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 relative z-10">
                    {STAGES.map((stage, idx) => {
                      const isDone = idx <= currentStageIdx;
                      const isCurrent = idx === currentStageIdx;

                      return (
                        <div key={stage.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-1.5">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-black shrink-0 transition ${
                              isDone
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                            } ${isCurrent ? 'ring-4 ring-indigo-500/20 scale-110' : ''}`}
                          >
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <div>
                            <span className={`text-[11px] font-bold block ${
                              isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                            }`}>
                              {stage.label}
                            </span>
                            <span className="text-[9px] text-slate-400 hidden lg:block leading-tight">
                              {stage.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Ordered Products ({currentOrder.items.length})
                </h4>
                <div className="space-y-2">
                  {currentOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 gap-3"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Sold by: {item.sellerName} • Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-black text-indigo-600 dark:text-indigo-400">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address & Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                  <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Delivery Address
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">
                    {currentOrder.customerName}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    {currentOrder.deliveryAddress}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-1.5 font-mono">
                  <span className="font-extrabold text-slate-900 dark:text-white font-sans flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" /> Payment & Charges
                  </span>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Payment Mode:</span>
                    <span className="uppercase font-bold">{currentOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Payment Status:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">{currentOrder.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 dark:text-white font-black text-sm pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>Grand Total:</span>
                    <span>₹{currentOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
