import React, { useState, useEffect } from 'react';
import { UserRole, Product, CartItem, Order, DeliveryTask, Story, CommunityPost, AdminMetrics, ApiEndpointSpec, ServiceBooking } from './types';
import { Navbar } from './components/Navbar';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { CustomerHome } from './components/CustomerHome';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ServiceBookingModal } from './components/ServiceBookingModal';
import { ServiceAppointmentsModal } from './components/ServiceAppointmentsModal';
import { CartCheckoutModal } from './components/CartCheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { WhatsAppChatModal } from './components/WhatsAppChatModal';
import { CommunityFeedView } from './components/CommunityFeedView';
import { SellerDashboard } from './components/SellerDashboard';
import { DeliveryDashboard } from './components/DeliveryDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ArchitectureExplorer } from './components/ArchitectureExplorer';

import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_DELIVERY_TASKS,
  INITIAL_STORIES,
  INITIAL_POSTS,
  INITIAL_ADMIN_METRICS,
  API_ENDPOINTS_SPEC,
  INITIAL_SERVICE_BOOKINGS,
} from './data/initialData';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole | 'architecture'>('customer');
  const [activeTab, setActiveTab] = useState<'shop' | 'community'>('shop');

  // Application Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>(INITIAL_SERVICE_BOOKINGS);
  const [deliveryTasks, setDeliveryTasks] = useState<DeliveryTask[]>(INITIAL_DELIVERY_TASKS);
  const [stories] = useState<Story[]>(INITIAL_STORIES);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [adminMetrics] = useState<AdminMetrics>(INITIAL_ADMIN_METRICS);
  const [apiSpecs] = useState<ApiEndpointSpec[]>(API_ENDPOINTS_SPEC);

  // Cart & Wishlist & Modals State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod_1']); // Initialized with item for immediate visual feedback
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Product | null>(null);
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartInitialStep, setCartInitialStep] = useState<'cart' | 'checkout'>('cart');
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };
  
  // WhatsApp Chat Modal State
  const [chatModalState, setChatModalState] = useState<{
    isOpen: boolean;
    sellerId: string;
    sellerName: string;
    offerPrice?: number;
  }>({
    isOpen: false,
    sellerId: '',
    sellerName: '',
  });

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  // Sync dark mode class with HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch live products from Express API backend
  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/products?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
    }
  };

  // Fetch live service bookings from Express API backend
  const fetchServiceBookings = async () => {
    try {
      const res = await fetch('/api/service-bookings');
      const data = await res.json();
      if (data.success && data.serviceBookings) {
        setServiceBookings(data.serviceBookings);
      }
    } catch (err) {
      console.error('Fetch service bookings error:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchServiceBookings();
  }, [searchQuery]);

  const handleUpdateBookingStatus = async (bookingId: string, status: ServiceBooking['status']) => {
    setServiceBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
    try {
      await fetch(`/api/service-bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error('Update service booking status error:', err);
    }
  };

  // Cart handlers
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    setCartInitialStep('checkout');
    setIsCartOpen(true);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error('Update order status error:', err);
    }
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Add new product from seller studio
  const handleAddProductFromSeller = async (newProd: Partial<Product>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });

      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) => [data.product, ...prev]);
        alert(`Product "${data.product.title}" successfully created and live on NeedHub!`);
      }
    } catch (err) {
      console.error('Create product error:', err);
    }
  };

  // Update product from seller studio
  const handleUpdateProductFromSeller = async (updatedProd: Partial<Product> & { id: string }) => {
    try {
      const res = await fetch(`/api/products/${updatedProd.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProd),
      });

      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) => prev.map((p) => (p.id === data.product.id ? data.product : p)));
        alert(`Product "${data.product.title}" updated successfully on NeedHub!`);
      }
    } catch (err) {
      console.error('Update product error:', err);
    }
  };

  // Verify OTP for delivery rider
  const handleVerifyDeliveryOtp = async (taskId: string, otp: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/delivery/tasks/${taskId}/verify-otp`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();
      if (data.success) {
        setDeliveryTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: 'delivered' } : t))
        );
        return true;
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
    }
    return false;
  };

  // Like post in community
  const handleLikePost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return { ...p, isLiked, likesCount: p.likesCount + (isLiked ? 1 : -1) };
        }
        return p;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans antialiased flex flex-col">
      
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole as UserRole}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        wishlistCount={wishlist.length}
        ordersCount={orders.length}
        serviceAppointmentsCount={serviceBookings.length}
        unreadChatCount={1}
        onOpenCart={() => {
          setCartInitialStep('cart');
          setIsCartOpen(true);
        }}
        onOpenWishlist={() => {
          setSelectedCategory('wishlist');
          setActiveTab('shop');
        }}
        onOpenOrderTracking={() => setIsOrderTrackingOpen(true)}
        onOpenServiceAppointments={() => setIsAppointmentsModalOpen(true)}
        onOpenChat={() =>
          setChatModalState({
            isOpen: true,
            sellerId: 'shop_1',
            sellerName: 'Crafts & Heritage Studio',
          })
        }
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onSearch={(q) => setSearchQuery(q)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Role Perspective Switcher */}
      <RoleSwitcherBar
        currentRole={currentRole}
        onSelectRole={(r) => setCurrentRole(r)}
      />

      {/* Main Perspective Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 flex-1 w-full">
        
        {/* Customer View */}
        {currentRole === 'customer' && (
          <div className="space-y-4">
            
            {/* View Sub-Tabs: Marketplace vs Social Commerce Feed */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('shop')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 border ${
                  activeTab === 'shop'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                    : 'bg-[#070e1e] text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <span>🛍️</span> Marketplace Storefront
              </button>
              <button
                onClick={() => setActiveTab('community')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 border ${
                  activeTab === 'community'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                    : 'bg-[#070e1e] text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <span>📸</span> Social Commerce & Stories
              </button>
            </div>

            {activeTab === 'shop' ? (
              <CustomerHome
                products={products}
                stories={stories}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p)}
                onBuyNow={(p) => handleBuyNow(p)}
                onBookService={(service) => setSelectedServiceForBooking(service)}
                onOpenChatWithSeller={(sellerId, sellerName) =>
                  setChatModalState({ isOpen: true, sellerId, sellerName })
                }
                onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            ) : (
              <CommunityFeedView
                posts={communityPosts}
                products={products}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onLikePost={handleLikePost}
              />
            )}
          </div>
        )}

        {/* Seller View */}
        {currentRole === 'seller' && (
          <SellerDashboard
            products={products}
            orders={orders}
            onAddProduct={handleAddProductFromSeller}
            onUpdateProduct={handleUpdateProductFromSeller}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* Delivery View */}
        {currentRole === 'delivery' && (
          <DeliveryDashboard
            tasks={deliveryTasks}
            onVerifyOtp={handleVerifyDeliveryOtp}
          />
        )}

        {/* Admin View */}
        {currentRole === 'admin' && (
          <AdminDashboard metrics={adminMetrics} />
        )}

        {/* System Architecture & API Explorer */}
        {currentRole === 'architecture' && (
          <ArchitectureExplorer apiSpecs={apiSpecs} />
        )}

      </main>

      {/* Sleek Bottom Status Rail */}
      <footer className="mt-auto border-t border-slate-800 bg-[#070e1e] px-4 sm:px-8 py-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-blue-400 font-bold">NeedHub v4.2.0</span>
          <span className="hidden md:inline">Gemini 3.6 Flash Engine</span>
          <span className="hidden sm:inline">Escrow Microservices</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-semibold">System Operational</span>
          </div>
          <div className="hidden lg:flex items-center gap-1 text-slate-400">
            <span>Latency:</span>
            <span className="text-slate-300">12ms</span>
          </div>
        </div>
      </footer>

      {/* Product Detail & Bargaining Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p) => handleAddToCart(p)}
        onBuyNow={(p) => handleBuyNow(p)}
        onBookService={(service) => setSelectedServiceForBooking(service)}
        onOpenChatWithOffer={(sellerId, sellerName, offerPrice) =>
          setChatModalState({ isOpen: true, sellerId, sellerName, offerPrice })
        }
      />

      {/* Dedicated Service Appointment Booking Modal */}
      {selectedServiceForBooking && (
        <ServiceBookingModal
          service={selectedServiceForBooking}
          onClose={() => setSelectedServiceForBooking(null)}
          onBookingConfirmed={(newBooking) => setServiceBookings((prev) => [newBooking, ...prev])}
          onViewAllAppointments={() => setIsAppointmentsModalOpen(true)}
        />
      )}

      {/* Customer Scheduled Appointments List Modal */}
      {isAppointmentsModalOpen && (
        <ServiceAppointmentsModal
          bookings={serviceBookings}
          onClose={() => setIsAppointmentsModalOpen(false)}
          onUpdateStatus={handleUpdateBookingStatus}
          onBookingReviewed={(bookingId, review) => {
            setServiceBookings((prev) =>
              prev.map((b) => (b.id === bookingId ? { ...b, review } : b))
            );
          }}
          onOpenChatWithProvider={(sellerId, sellerName) =>
            setChatModalState({ isOpen: true, sellerId, sellerName })
          }
        />
      )}

      {/* Cart & Checkout Modal */}
      {isCartOpen && (
        <CartCheckoutModal
          cart={cart}
          initialStep={cartInitialStep}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={() => setCart([])}
          onOrderCreated={(newOrder) => setOrders((prev) => [newOrder, ...prev])}
          onOpenOrderTracking={() => setIsOrderTrackingOpen(true)}
        />
      )}

      {/* Order Tracking & Status Modal */}
      {isOrderTrackingOpen && (
        <OrderTrackingModal
          orders={orders}
          onClose={() => setIsOrderTrackingOpen(false)}
        />
      )}

      {/* WhatsApp Style Direct Seller Chat Modal */}
      <WhatsAppChatModal
        isOpen={chatModalState.isOpen}
        sellerId={chatModalState.sellerId}
        sellerName={chatModalState.sellerName}
        initialOffer={chatModalState.offerPrice}
        onClose={() => setChatModalState({ isOpen: false, sellerId: '', sellerName: '' })}
      />

      {/* Gemini AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />

    </div>
  );
}
