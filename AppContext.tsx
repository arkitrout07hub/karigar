import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  LanguageCode,
  Product,
  Artisan,
  ArtisanVerificationDetails,
  CartItem,
  Coupon,
  Order,
  OrderStatus,
  ChatMessage,
  Conversation,
  AppNotification,
} from '../types';
import {
  INITIAL_ARTISANS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import { translations, TranslationStrings } from '../data/translations';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationStrings;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  activeTab: 'marketplace' | 'studio' | 'cart' | 'seller_orders' | 'buyer_orders' | 'messages' | 'settings';
  setActiveTab: (tab: 'marketplace' | 'studio' | 'cart' | 'seller_orders' | 'buyer_orders' | 'messages' | 'settings') => void;
  
  // Data
  products: Product[];
  addProduct: (product: Product) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  artisans: Artisan[];
  currentArtisan: Artisan;
  currentArtisanId: string;
  setCurrentArtisanId: (id: string) => void;
  registerArtisan: (artisanData: Partial<Artisan>) => Artisan;
  updateArtisanVerification: (artisanId: string, verificationDetails: Partial<ArtisanVerificationDetails>) => void;
  isRegistrationModalOpen: boolean;
  setIsRegistrationModalOpen: (val: boolean) => void;
  selectedVerificationArtisan: Artisan | null;
  setSelectedVerificationArtisan: (a: Artisan | null) => void;
  
  // Cart
  isCartOpen: boolean;
  setIsCartOpen: (val: boolean) => void;
  cart: CartItem[];
  savedForLater: CartItem[];
  addToCart: (product: Product, quantity?: number, customizationNote?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  updateItemCustomization: (productId: string, note: string) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeFromSavedForLater: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartSubtotal: number;
  cartDiscount: number;
  fundContribution: number;
  shippingCost: number;
  grandTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  communityFund: boolean;
  setCommunityFund: (val: boolean) => void;
  shippingMethod: 'standard' | 'express' | 'free';
  setShippingMethod: (val: 'standard' | 'express' | 'free') => void;
  shippingPincode: string;
  setShippingPincode: (pin: string) => void;
  giftNote: string;
  setGiftNote: (note: string) => void;
  createOrderFromCart: (shippingAddress: { street: string; city: string; state: string; zipCode: string; country?: string }, buyerInfo?: { name?: string; email?: string; phone?: string; paymentMethod?: 'upi' | 'card' | 'netbanking' | 'cod_escrow' }) => Order;
  
  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'placedAt' | 'timeline'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  
  // Chat
  conversations: Conversation[];
  messages: ChatMessage[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (text: string, conversationId?: string, customSnapshot?: any, attachmentImage?: string) => Promise<void>;
  startConversationWithArtisan: (artisanId: string, productId?: string) => string;
  isArtisanTyping: boolean;
  deleteMessage: (messageId: string) => void;
  clearConversation: (conversationId: string) => void;
  
  // Notifications
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  
  // Modals & UI selection
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectedArtisan: Artisan | null;
  setSelectedArtisan: (a: Artisan | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (val: boolean) => void;
  
  // Accessibility & Audio
  isSpeaking: boolean;
  speakText: (text: string) => void;
  stopSpeaking: () => void;

  // View Layout
  isMobilePreview: boolean;
  setIsMobilePreview: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme & Preferences
  const [role, setRole] = useState<Role>('buyer');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [highContrast, setHighContrast] = useState(false);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'studio' | 'cart' | 'seller_orders' | 'buyer_orders' | 'messages' | 'settings'>('marketplace');

  // Core Data
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('karigar_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [artisans, setArtisans] = useState<Artisan[]>(() => {
    const saved = localStorage.getItem('karigar_artisans');
    return saved ? JSON.parse(saved) : INITIAL_ARTISANS;
  });

  const [currentArtisanId, setCurrentArtisanId] = useState<string>(() => {
    const saved = localStorage.getItem('karigar_current_artisan_id');
    return saved || 'artisan-1';
  });

  const currentArtisan = artisans.find(a => a.id === currentArtisanId) || artisans[0] || INITIAL_ARTISANS[0];

  // Verification & Registration UI Modals
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [selectedVerificationArtisan, setSelectedVerificationArtisan] = useState<Artisan | null>(null);

  // Cart & Saved for Later
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('karigar_cart');
    return saved ? JSON.parse(saved) : [
      { product: INITIAL_PRODUCTS[0], quantity: 1 }
    ];
  });
  const [savedForLater, setSavedForLater] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('karigar_saved_later');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('karigar_coupon');
    return saved ? JSON.parse(saved) : null;
  });
  const [communityFund, setCommunityFund] = useState(true);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'free'>('standard');
  const [shippingPincode, setShippingPincode] = useState('700016');
  const [giftNote, setGiftNote] = useState('');

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('karigar_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Messaging
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('karigar_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('karigar_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    const saved = localStorage.getItem('karigar_conversations');
    const list = saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    return list[0]?.id || "conv-1";
  });
  const [isArtisanTyping, setIsArtisanTyping] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals & Detail
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Persist Products, Cart, Saved for Later, Coupons, Orders, Conversations & Messages
  useEffect(() => {
    localStorage.setItem('karigar_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('karigar_artisans', JSON.stringify(artisans));
  }, [artisans]);

  useEffect(() => {
    localStorage.setItem('karigar_current_artisan_id', currentArtisanId);
  }, [currentArtisanId]);

  useEffect(() => {
    localStorage.setItem('karigar_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('karigar_saved_later', JSON.stringify(savedForLater));
  }, [savedForLater]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('karigar_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('karigar_coupon');
    }
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem('karigar_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('karigar_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('karigar_messages', JSON.stringify(messages));
  }, [messages]);

  // Handle Theme Classes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const t = translations[language] || translations.en;

  // Add new Product from AI Studio
  const addProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
    addNotification({
      title: "New Craft Listed! ✨",
      message: `"${newProd.title}" is now published and live on the global marketplace!`,
      type: "stock",
      linkTab: "seller_orders",
    });
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    );
    if (newStock <= 3 && newStock > 0) {
      addNotification({
        title: "Low Inventory Warning ⚠️",
        message: `Product stock dropped to ${newStock} pieces. Consider scheduling a batch!`,
        type: "stock",
        linkTab: "seller_orders",
      });
    }
  };

  // Artisan Registration & Verification Management
  const registerArtisan = (artisanData: Partial<Artisan>): Artisan => {
    const newId = `artisan-${Date.now()}`;
    const stateCode = (artisanData.state || 'IN').slice(0, 2).toUpperCase();
    const randomCertNum = Math.floor(1000 + Math.random() * 9000);
    const verificationId = `KARIGAR-VERIFIED-${stateCode}-${randomCertNum}`;

    const newArtisan: Artisan = {
      id: newId,
      name: artisanData.name || 'Master Artisan',
      avatar:
        artisanData.avatar ||
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      coverImage:
        artisanData.coverImage ||
        'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
      bio: artisanData.bio || 'Dedicated traditional artisan creating authentic handcrafted art.',
      village: artisanData.village || 'Artisan Settlement',
      region: artisanData.region || 'Craft Cluster',
      state: artisanData.state || 'India',
      pincode: artisanData.pincode || '',
      craftSpecialty: artisanData.craftSpecialty || 'Traditional Craft',
      experienceYears: artisanData.experienceYears || 5,
      community: artisanData.community || 'Regional Artisans Collective',
      verified: artisanData.verified !== undefined ? artisanData.verified : true,
      phone: artisanData.phone || '+91 98000 00000',
      email: artisanData.email || '',
      rating: 5.0,
      totalSales: 0,
      totalEarnings: 0,
      monthlySales: 0,
      craftLineage:
        artisanData.craftLineage ||
        'Generational family craft heritage verified under Fair-Trade protocols.',
      materials: artisanData.materials || ['Authentic Traditional Materials'],
      techniques: artisanData.techniques || ['Handcrafted Technique'],
      workshopPhotos: artisanData.workshopPhotos || [
        'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
      ],
      audioBioText:
        artisanData.audioBioText ||
        `Namaskar, I am ${artisanData.name || 'a craftsman'}. Welcome to my certified handcraft studio.`,
      verification: artisanData.verification || {
        status: 'verified',
        verificationId,
        pehchanArtisanId: artisanData.verification?.pehchanArtisanId || `PA-${stateCode}-2026-${randomCertNum}`,
        govIdType: artisanData.verification?.govIdType || 'pehchan_card',
        govIdNumberMasked: artisanData.verification?.govIdNumberMasked || `•••• •••• ${randomCertNum}`,
        giCertificationCluster: artisanData.verification?.giCertificationCluster || `${artisanData.craftSpecialty || 'Authentic'} Cluster Certified`,
        clusterAffiliation: artisanData.verification?.clusterAffiliation || `${artisanData.community || 'Artisan'} Guild`,
        verifiedDate: new Date().toISOString().split('T')[0],
        verifierBadge: 'Karigar Certified Master Artisan',
        authenticityScore: 98,
        fairWageScore: 100,
        giClusterScore: 97,
        badges: [
          'Pehchan Ministry Recognized',
          'GI-Tag Cluster Verified',
          '100% Direct Fair Wage Escrow',
          'Eco-Friendly Raw Materials',
          'Verified Master Craftsman',
        ],
        bankDetails: artisanData.verification?.bankDetails || {
          accountHolder: artisanData.name || 'Master Artisan',
          bankName: 'Verified Direct Bank Payout',
          accountNumberMasked: `••••••••${randomCertNum}`,
          ifscCode: 'FAIR0000108',
          upiVpa: `${(artisanData.name || 'artisan').toLowerCase().replace(/\s+/g, '')}@okaxis`,
        },
        workshopProofImages: artisanData.verification?.workshopProofImages || [
          'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
        ],
        sampleCraftImages: artisanData.verification?.sampleCraftImages || [
          'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80',
        ],
        reviewerNotes: 'AI Craft Purity & Document Cross-verification completed. Direct Fair-Wage Escrow activated.',
      },
    };

    setArtisans(prev => [newArtisan, ...prev]);
    setCurrentArtisanId(newId);
    setRole('artisan');
    setActiveTab('seller_orders');

    addNotification({
      title: 'Artisan Verification Complete! 🏅',
      message: `Welcome ${newArtisan.name}! Your Pehchan ID & GI-Tag cluster verification are approved. Direct Fair-Trade Escrow is active.`,
      type: 'system',
      linkTab: 'seller_orders',
    });

    return newArtisan;
  };

  const updateArtisanVerification = (
    artisanId: string,
    verificationDetails: Partial<ArtisanVerificationDetails>
  ) => {
    setArtisans(prev =>
      prev.map(a => {
        if (a.id === artisanId) {
          const updatedVerification: ArtisanVerificationDetails = {
            status: 'verified',
            badges: [
              'Pehchan Ministry Recognized',
              'GI-Tag Cluster Verified',
              '100% Direct Fair Wage Escrow',
            ],
            ...(a.verification || {}),
            ...verificationDetails,
          };
          return {
            ...a,
            verified: updatedVerification.status === 'verified',
            verification: updatedVerification,
          };
        }
        return a;
      })
    );

    addNotification({
      title: 'Verification Record Updated 🛡️',
      message: `Artisan verification credentials have been updated and synchronized with the Ministry registry.`,
      type: 'system',
      linkTab: 'seller_orders',
    });
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, customizationNote?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: Math.min(product.stock, item.quantity + quantity),
                customizationNote: customizationNote || item.customizationNote,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: Math.min(product.stock, quantity),
          customizationNote,
        },
      ];
    });

    addNotification({
      title: "Added to Cart 🛒",
      message: `Added "${product.title}" (${quantity} ${quantity === 1 ? 'piece' : 'pieces'}) to your craft bag.`,
      type: "order",
      linkTab: "cart",
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const clampedQty = Math.min(item.product.stock, quantity);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const updateItemCustomization = (productId: string, note: string) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, customizationNote: note } : item
      )
    );
  };

  const saveForLater = (productId: string) => {
    const itemToSave = cart.find(i => i.product.id === productId);
    if (!itemToSave) return;
    setCart(prev => prev.filter(i => i.product.id !== productId));
    setSavedForLater(prev => {
      if (prev.some(i => i.product.id === productId)) return prev;
      return [...prev, itemToSave];
    });
    addNotification({
      title: "Saved for Later 📌",
      message: `"${itemToSave.product.title}" moved to your saved wishlist items.`,
      type: "system",
      linkTab: "cart",
    });
  };

  const moveToCart = (productId: string) => {
    const itemToMove = savedForLater.find(i => i.product.id === productId);
    if (!itemToMove) return;
    setSavedForLater(prev => prev.filter(i => i.product.id !== productId));
    addToCart(itemToMove.product, itemToMove.quantity, itemToMove.customizationNote);
  };

  const removeFromSavedForLater = (productId: string) => {
    setSavedForLater(prev => prev.filter(i => i.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Coupons
  const AVAILABLE_COUPONS: Coupon[] = [
    {
      code: 'HANDMADE10',
      discountPercent: 10,
      description: '10% instant off on authentic handcrafted treasures',
    },
    {
      code: 'KARIGAR200',
      discountAmount: 200,
      minOrder: 800,
      description: '₹200 instant discount on craft orders above ₹800',
    },
    {
      code: 'GI_HERITAGE',
      discountPercent: 15,
      minOrder: 1200,
      description: '15% GI Heritage patronage discount on orders above ₹1200',
    },
    {
      code: 'FIRSTCRAFT',
      discountAmount: 150,
      minOrder: 500,
      description: '₹150 welcome grant for conscious craft collectors',
    },
  ];

  const applyCoupon = (rawCode: string): { success: boolean; message: string } => {
    const cleanCode = rawCode.trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find(c => c.code === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code. Try HANDMADE10 or KARIGAR200.' };
    }
    const currentSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    if (found.minOrder && currentSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Coupon "${found.code}" requires a minimum order subtotal of ₹${found.minOrder}.`,
      };
    }
    setAppliedCoupon(found);
    return {
      success: true,
      message: `Coupon "${found.code}" applied! ${found.description}`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Cart Computations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const cartTotal = cartSubtotal;

  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal > 0) {
    if (appliedCoupon.discountPercent) {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      cartDiscount = Math.min(cartSubtotal, appliedCoupon.discountAmount);
    }
  }

  const fundContribution = communityFund && cartSubtotal > 0 ? Math.round(cartSubtotal * 0.05) : 0;
  
  // Shipping calculation (free over ₹2500, or selected method)
  const isFreeShippingEligible = cartSubtotal >= 2500;
  const shippingCost = cartSubtotal === 0 ? 0 : (isFreeShippingEligible || shippingMethod === 'free' ? 0 : (shippingMethod === 'express' ? 180 : 80));
  
  const grandTotal = Math.max(0, cartSubtotal - cartDiscount + fundContribution + shippingCost);

  // Quick Order Creator from Cart
  const createOrderFromCart = (
    shippingAddress: { street: string; city: string; state: string; zipCode: string; country?: string },
    buyerInfo?: { name?: string; email?: string; phone?: string; paymentMethod?: 'upi' | 'card' | 'netbanking' | 'cod_escrow' }
  ): Order => {
    const artisanIds = Array.from(new Set(cart.map(i => i.product.artisanId)));
    const placedOrder = createOrder({
      items: [...cart],
      subtotal: cartSubtotal,
      shippingFee: shippingCost,
      fairTradeContribution: fundContribution,
      tax: Math.round(cartSubtotal * 0.03), // 3% GI tax
      totalAmount: grandTotal,
      currency: 'INR',
      buyerName: buyerInfo?.name || 'Ananya Sen',
      buyerEmail: buyerInfo?.email || 'ananya.sen@gmail.com',
      buyerPhone: buyerInfo?.phone || '+91 98301 23456',
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country || 'India',
      },
      paymentMethod: buyerInfo?.paymentMethod || 'upi',
      paymentStatus: 'escrow_held',
      orderStatus: 'placed',
      trackingNumber: `KRG-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      courierName: shippingMethod === 'express' ? 'BlueDart Fragile Express' : 'India Post Speed Rural Craft Parcel',
      estimatedDelivery: new Date(Date.now() + (shippingMethod === 'express' ? 3 : 6) * 86400000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      artisanIds: Array.from(new Set(cart.map(i => i.product.artisanId))) as string[],
    });

    return placedOrder;
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'placedAt' | 'timeline'>): Order => {
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}-IN`;
    const placedAt = new Date().toISOString();
    const newOrder: Order = {
      ...orderData,
      id,
      placedAt,
      timeline: [
        {
          status: 'placed',
          timestamp: placedAt,
          note: 'Order placed & fair-trade escrow locked safely',
        },
      ],
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Deduct stock
    newOrder.items.forEach(item => {
      updateProductStock(item.product.id, Math.max(0, item.product.stock - item.quantity));
    });

    // Notify buyer
    addNotification({
      title: "Order Placed Successfully! 🎉",
      message: `Order #${id} confirmed! Artisan notified to begin careful packaging.`,
      type: "order",
      linkTab: "buyer_orders",
      orderId: id,
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          const timestamp = new Date().toISOString();
          let defaultNote = `Status updated to ${newStatus}`;
          if (newStatus === 'confirmed') defaultNote = 'Artisan confirmed craft readiness';
          if (newStatus === 'crafting') defaultNote = 'Craft finishing and eco-packaging in progress';
          if (newStatus === 'dispatched') defaultNote = 'Handed over to insured courier service';
          if (newStatus === 'in_transit') defaultNote = 'Package is currently moving towards destination hub';
          if (newStatus === 'delivered') defaultNote = 'Successfully delivered to buyer doorstep';

          const updatedTimeline = [
            ...order.timeline,
            {
              status: newStatus,
              timestamp,
              note: note || defaultNote,
            },
          ];

          return {
            ...order,
            orderStatus: newStatus,
            timeline: updatedTimeline,
          };
        }
        return order;
      })
    );

    addNotification({
      title: `Order Status Updated: ${newStatus.toUpperCase()} 📦`,
      message: `Order #${orderId} is now ${newStatus.replace('_', ' ')}.`,
      type: "order",
      linkTab: role === 'artisan' ? 'seller_orders' : 'buyer_orders',
      orderId,
    });
  };

  // Messaging
  const startConversationWithArtisan = (artisanId: string, productId?: string): string => {
    const existing = conversations.find(
      c => c.artisanId === artisanId && (!productId || c.productId === productId)
    );
    if (existing) {
      setActiveConversationId(existing.id);
      setActiveTab('messages');
      return existing.id;
    }

    const artisan = artisans.find(a => a.id === artisanId) || artisans[0];
    const newConvId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newConvId,
      buyerId: "buyer-current",
      buyerName: "Conscious Buyer",
      artisanId: artisan.id,
      artisanName: artisan.name,
      productId,
      lastMessage: "Conversation opened",
      lastMessageTime: "Just now",
      unreadCount: 0,
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConvId);
    setActiveTab('messages');
    return newConvId;
  };

  const sendMessage = async (
    text: string,
    conversationId?: string,
    customSnapshot?: any,
    attachmentImage?: string
  ) => {
    const targetConvId = conversationId || activeConversationId || conversations[0]?.id || "conv-1";
    const currentConv = conversations.find((c) => c.id === targetConvId) || conversations[0];
    const newMsgId = `msg-${Date.now()}`;
    const timestamp = "Just now";
    const senderRole = role;

    const newMsg: ChatMessage = {
      id: newMsgId,
      conversationId: targetConvId,
      senderId: role === 'artisan' ? currentArtisan.id : 'buyer-current',
      senderName: role === 'artisan' ? currentArtisan.name : 'Conscious Buyer',
      senderRole,
      text,
      originalLanguage: language,
      timestamp,
      productSnapshot: customSnapshot,
      attachmentImage,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Update conversation last message preview
    setConversations((prev) =>
      prev.map((c) =>
        c.id === targetConvId
          ? {
              ...c,
              lastMessage: text || (attachmentImage ? "Photo attachment" : "Message sent"),
              lastMessageTime: "Just now",
            }
          : c
      )
    );

    // If sender is a buyer, auto-translate and trigger master artisan response
    if (role === 'buyer') {
      // 1. Auto-translate buyer message to artisan native language
      try {
        const transRes = await fetch('/api/gemini/translate-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            sourceLanguage: language,
            targetLanguage: 'hi',
            senderRole: 'buyer',
          }),
        });
        const transData = await transRes.json();
        if (transData?.translatedText && transData.translatedText !== text) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === newMsgId
                ? {
                    ...m,
                    translatedText: transData.translatedText,
                    targetLanguage: 'hi',
                  }
                : m
            )
          );
        }
      } catch (e) {
        console.warn("Translation skipped:", e);
      }

      // 2. Trigger intelligent Artisan response
      setIsArtisanTyping(true);
      const targetArtisan =
        artisans.find((a) => a.id === currentConv?.artisanId) || currentArtisan;
      const targetProduct =
        products.find((p) => p.id === currentConv?.productId) || products[0];

      setTimeout(async () => {
        try {
          const replyRes = await fetch('/api/gemini/artisan-reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              buyerMessage: text,
              artisanName: targetArtisan.name,
              artisanSpecialty: targetArtisan.craftSpecialty,
              artisanVillage: targetArtisan.village,
              artisanState: targetArtisan.state,
              artisanBio: targetArtisan.bio,
              productTitle: targetProduct?.title || "Handcrafted piece",
              productMaterials:
                targetProduct?.materials?.join(', ') || "Natural materials",
              buyerLanguage: language,
            }),
          });
          const replyData = await replyRes.json();

          const artisanMsgId = `msg-${Date.now()}`;
          const artisanReplyMsg: ChatMessage = {
            id: artisanMsgId,
            conversationId: targetConvId,
            senderId: targetArtisan.id,
            senderName: targetArtisan.name,
            senderRole: 'artisan',
            text:
              replyData.nativeReply ||
              "नमस्ते! हम इसे आपके लिए बहुत प्रेम और सावधानी से तैयार करेंगे।",
            originalLanguage: replyData.nativeLanguage || "hi",
            translatedText:
              replyData.englishTranslation ||
              "Namaste! We will craft this with deep love and care for you.",
            targetLanguage: "en",
            timestamp: "Just now",
            suggestedFollowups: replyData.suggestedBuyerFollowups,
          };

          setMessages((prev) => [...prev, artisanReplyMsg]);
          setConversations((prev) =>
            prev.map((c) =>
              c.id === targetConvId
                ? {
                    ...c,
                    lastMessage: artisanReplyMsg.text,
                    lastMessageTime: "Just now",
                    unreadCount: (c.unreadCount || 0) + 1,
                  }
                : c
            )
          );

          addNotification({
            title: `${targetArtisan.name} Replied! 💬`,
            message: `"${artisanReplyMsg.translatedText || artisanReplyMsg.text}"`,
            type: "message",
            linkTab: "messages",
          });
        } catch (err) {
          console.error("Artisan reply error:", err);
        } finally {
          setIsArtisanTyping(false);
        }
      }, 1400);
    } else {
      // If role is artisan, auto-translate into English for buyer
      try {
        const transRes = await fetch('/api/gemini/translate-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            sourceLanguage: language,
            targetLanguage: 'en',
            senderRole: 'artisan',
          }),
        });
        const transData = await transRes.json();
        if (transData?.translatedText && transData.translatedText !== text) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === newMsgId
                ? {
                    ...m,
                    translatedText: transData.translatedText,
                    targetLanguage: 'en',
                  }
                : m
            )
          );
        }
      } catch (e) {
        console.warn("Translation skipped:", e);
      }
    }
  };

  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  const clearConversation = (conversationId: string) => {
    setMessages((prev) => prev.filter((m) => m.conversationId !== conversationId));
  };

  // Notifications
  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (
    notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Accessibility Text-to-Speech
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Language mapping
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'bn') utterance.lang = 'bn-IN';
    else if (language === 'ta') utterance.lang = 'ta-IN';
    else if (language === 'te') utterance.lang = 'te-IN';
    else if (language === 'mr') utterance.lang = 'mr-IN';
    else if (language === 'gu') utterance.lang = 'gu-IN';
    else if (language === 'es') utterance.lang = 'es-ES';
    else utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        highContrast,
        setHighContrast,
        activeTab,
        setActiveTab,
        products,
        addProduct,
        updateProductStock,
        artisans,
        currentArtisan,
        currentArtisanId,
        setCurrentArtisanId,
        registerArtisan,
        updateArtisanVerification,
        isRegistrationModalOpen,
        setIsRegistrationModalOpen,
        selectedVerificationArtisan,
        setSelectedVerificationArtisan,
        // Cart
        isCartOpen,
        setIsCartOpen,
        cart,
        savedForLater,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateItemCustomization,
        saveForLater,
        moveToCart,
        removeFromSavedForLater,
        clearCart,
        cartCount,
        cartTotal,
        cartSubtotal,
        cartDiscount,
        fundContribution,
        shippingCost,
        grandTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        communityFund,
        setCommunityFund,
        shippingMethod,
        setShippingMethod,
        shippingPincode,
        setShippingPincode,
        giftNote,
        setGiftNote,
        createOrderFromCart,
        orders,
        createOrder,
        updateOrderStatus,
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        startConversationWithArtisan,
        isArtisanTyping,
        deleteMessage,
        clearConversation,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        selectedProduct,
        setSelectedProduct,
        selectedArtisan,
        setSelectedArtisan,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSpeaking,
        speakText,
        stopSpeaking,
        isMobilePreview,
        setIsMobilePreview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
