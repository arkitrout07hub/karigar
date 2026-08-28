export type Role = 'buyer' | 'artisan';

export type LanguageCode = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'gu' | 'es';

export interface MakingProcessStep {
  stepNumber: number;
  stageName: string;
  title: string;
  description: string;
  duration?: string;
  toolsAndMaterials?: string;
  proTipOrRitual?: string;
}

export interface SocialMediaCaptions {
  instagram: string;
  facebook: string;
  twitter: string;
  whatsapp: string;
  hashtags: string[];
  viralHook?: string;
}

export interface PricingBreakdown {
  materialCost: number;
  laborCost: number;
  artisanFairMargin: number;
  packagingShipping: number;
  explanation: string;
}

export interface MarketPriceRange {
  min: number;
  max: number;
  averageRetail: number;
}

export interface Review {
  id: string;
  buyerName: string;
  buyerAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  craftsmanshipScore?: number;
  authenticityScore?: number;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  currency: string;
  stock: number;
  artisanId: string;
  artisanName: string;
  artisanAvatar: string;
  artisanRegion: string;
  artisanStory: string;
  culturalSignificance?: string;
  makingProcess?: MakingProcessStep[];
  socialCaptions?: SocialMediaCaptions;
  technique: string;
  materials: string[];
  images: string[];
  primaryImage: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  dimensions: string;
  weight?: string;
  tags: string[];
  craftBadge: string;
  isVerified: boolean;
  createdDate: string;
  pricingBreakdown: PricingBreakdown;
  marketPriceRange: MarketPriceRange;
  careInstructions: string[];
  regionalTitles?: Partial<Record<LanguageCode, string>>;
  regionalDescriptions?: Partial<Record<LanguageCode, string>>;
  multilingualTitles?: Record<string, string>;
  audioStoryUrl?: string;
}

export interface ArtisanVerificationDetails {
  status: 'verified' | 'pending_review' | 'in_progress' | 'unverified';
  verificationId?: string;
  pehchanArtisanId?: string;
  govIdType?: 'aadhaar' | 'voter_id' | 'pan' | 'ration_card' | 'pehchan_card';
  govIdNumberMasked?: string;
  giCertificationCluster?: string;
  clusterAffiliation?: string;
  workshopProofImages?: string[];
  sampleCraftImages?: string[];
  bankDetails?: {
    accountHolder: string;
    bankName: string;
    accountNumberMasked: string;
    ifscCode: string;
    upiVpa: string;
  };
  verifiedDate?: string;
  verifierBadge?: string;
  authenticityScore?: number;
  fairWageScore?: number;
  giClusterScore?: number;
  badges: string[];
  reviewerNotes?: string;
}

export interface Artisan {
  id: string;
  name: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  village: string;
  region: string;
  state: string;
  pincode?: string;
  craftSpecialty: string;
  experienceYears: number;
  community: string;
  verified: boolean;
  phone: string;
  email?: string;
  rating: number;
  totalSales: number;
  totalEarnings: number;
  monthlySales: number;
  craftLineage: string;
  materials?: string[];
  techniques?: string[];
  workshopPhotos: string[];
  audioBioText?: string;
  verification?: ArtisanVerificationDetails;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customizationNote?: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrder?: number;
  description: string;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'crafting'
  | 'dispatched'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface OrderStatusTimeline {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  fairTradeContribution: number;
  tax: number;
  totalAmount: number;
  currency: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod_escrow';
  paymentStatus: 'paid' | 'pending' | 'escrow_held';
  orderStatus: OrderStatus;
  trackingNumber: string;
  courierName: string;
  placedAt: string;
  estimatedDelivery: string;
  timeline: OrderStatusTimeline[];
  artisanIds: string[];
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  text: string;
  originalLanguage: string;
  translatedText?: string;
  targetLanguage?: string;
  timestamp: string;
  productId?: string;
  productSnapshot?: {
    id: string;
    title: string;
    image: string;
    price: number;
  };
  attachmentImage?: string;
  isAudio?: boolean;
  suggestedFollowups?: string[];
}

export interface Conversation {
  id: string;
  buyerId: string;
  buyerName: string;
  artisanId: string;
  artisanName: string;
  productId?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'message' | 'stock' | 'payout' | 'system';
  read: boolean;
  timestamp: string;
  linkTab?: 'marketplace' | 'studio' | 'cart' | 'seller_orders' | 'buyer_orders' | 'messages';
  orderId?: string;
}

export interface SmartCatalogDraft {
  imageBase64: string | null;
  enhancedImageBase64: string | null;
  bgMode: 'original' | 'studio_white' | 'warm_clay' | 'gallery_wood' | 'minimal_slate';
  rawVoiceNotes: string;
  craftCategory: string;
  craftRegion: string;
  materials: string;
  artisanName: string;
  estimatedHours: number;
  stockCount: number;
  language: LanguageCode;
}
