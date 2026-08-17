export interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  price: number;
  sellerId: string;
  providerName: string;
  providerPhone?: string;
  providerEmail?: string;
  providerAddress?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  bookingDate: string;
  timeSlot: string;
  notes?: string;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
}

export type UserRole = 'guest' | 'customer' | 'seller' | 'delivery' | 'admin';

export type ProductType = 
  | 'physical' 
  | 'digital' 
  | 'service' 
  | 'freelance' 
  | 'rental' 
  | 'second_hand' 
  | 'farm' 
  | 'handmade' 
  | 'auction';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size M / Blue"
  price: number;
  stock: number;
  sku: string;
}

export interface ReviewItem {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase?: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  type: ProductType;
  category: string;
  subCategory?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  reviews?: ReviewItem[];
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerVerified: boolean;
  location: string;
  distanceKm?: number;
  stock: number;
  tags: string[];
  variants?: ProductVariant[];
  warranty?: string;
  isFlashSale?: boolean;
  deliveryTimeEstimate?: string;
  aiSuggestedPrice?: number;
  fraudScore?: number; // 0 to 100
  providerPhone?: string;
  providerEmail?: string;
  providerWhatsapp?: string;
  providerAddress?: string;
  providerWorkingHours?: string;
}

export interface ServicePackage {
  id: string;
  title: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string[];
}

export interface ServiceItem extends Product {
  servicePackages?: ServicePackage[];
  hourlyRate?: number;
}

export interface Shop {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  category: string;
  isVerified: boolean;
  location: string;
  followersCount: number;
  description: string;
  responseRate: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  negotiatedPrice?: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  sellerName: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  taxAmount: number;
  shippingFee: number;
  status: 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentMethod: 'razorpay' | 'stripe' | 'upi' | 'cod' | 'escrow' | 'wallet';
  paymentStatus: 'paid' | 'pending' | 'escrow_held' | 'refunded';
  deliveryAddress: string;
  otpCode?: string;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  createdAt: string;
  estimatedDelivery: string;
}

export interface DeliveryTask {
  id: string;
  orderId: string;
  pickupLocation: string;
  dropLocation: string;
  customerName: string;
  customerPhone: string;
  sellerName: string;
  payout: number;
  distanceKm: number;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
  otpCode: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'seller' | 'ai_bot';
  text: string;
  timestamp: string;
  attachedProduct?: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
  offerPrice?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined';
}

export interface ChatRoom {
  id: string;
  participantName: string;
  participantAvatar: string;
  shopName?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Story {
  id: string;
  sellerName: string;
  sellerAvatar: string;
  mediaUrl: string;
  caption: string;
  taggedProductId?: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: 'Seller' | 'Buyer' | 'Expert';
  content: string;
  image?: string;
  likesCount: number;
  commentsCount: number;
  taggedProductId?: string;
  createdAt: string;
  isLiked?: boolean;
}

export interface AdminMetrics {
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
  verifiedSellers: number;
  fraudAlertsCount: number;
  monthlyRevenueData: { month: string; gmv: number; commission: number }[];
  categoryDistribution: { name: string; count: number }[];
}

export interface ApiEndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  module: string;
  sampleRequest?: object;
  sampleResponse: object;
}
