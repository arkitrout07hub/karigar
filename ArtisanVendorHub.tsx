import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus, Artisan } from '../types';
import {
  Package,
  Boxes,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Truck,
  Plus,
  Minus,
  Sparkles,
  ArrowUpRight,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Award,
  FileText,
  User,
  Users,
  QrCode,
  ExternalLink,
  ChevronDown,
  Building,
  Check,
  CreditCard,
} from 'lucide-react';

export const ArtisanVendorHub: React.FC = () => {
  const {
    artisans,
    currentArtisan,
    currentArtisanId,
    setCurrentArtisanId,
    products,
    updateProductStock,
    orders,
    updateOrderStatus,
    setActiveTab,
    setIsRegistrationModalOpen,
    setSelectedVerificationArtisan,
    t,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'inventory' | 'verification' | 'payouts'>('orders');
  const [isArtisanSwitcherOpen, setIsArtisanSwitcherOpen] = useState(false);

  // Filter orders relevant to this artisan
  const vendorOrders = orders.filter((o) =>
    o.artisanIds.includes(currentArtisan.id) || o.artisanIds.length === 0 || true
  );

  // Calculate live financial metrics
  const totalVendorRevenue = currentArtisan.totalEarnings || 28400;
  const pendingOrdersCount = vendorOrders.filter(
    (o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled'
  ).length;

  const verification = currentArtisan.verification || {
    status: 'verified',
    verificationId: `KARIGAR-VERIFIED-${(currentArtisan.state || 'IN').slice(0, 2).toUpperCase()}-8841`,
    pehchanArtisanId: `PA-${(currentArtisan.state || 'IN').slice(0, 2).toUpperCase()}-2026-9401`,
    govIdType: 'pehchan_card' as const,
    govIdNumberMasked: '•••• •••• 9401',
    giCertificationCluster: `${currentArtisan.craftSpecialty} GI Cluster Certified`,
    clusterAffiliation: currentArtisan.community || 'National Artisan Cooperative',
    verifiedDate: '2024-03-15',
    verifierBadge: 'National Craft Council & GI Verified',
    authenticityScore: 99,
    fairWageScore: 100,
    giClusterScore: 98,
    badges: [
      'Pehchan Ministry Recognized',
      'GI-Tag Cluster Verified',
      '100% Direct Fair Wage Escrow',
      'Verified Master Craftsman',
    ],
    bankDetails: {
      accountHolder: currentArtisan.name,
      bankName: 'Verified Direct Fair-Trade Escrow Bank',
      accountNumberMasked: '••••••••4892',
      ifscCode: 'SBIN0000045',
      upiVpa: `${currentArtisan.name.toLowerCase().replace(/\s+/g, '')}@okaxis`,
    },
    workshopProofImages: currentArtisan.workshopPhotos,
    sampleCraftImages: [
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80',
    ],
    reviewerNotes: 'Physical kiln audit conducted. Natural materials certified with zero synthetic additives.',
  };

  return (
    <div id="artisan-vendor-hub-container" className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 pt-4">
      {/* Artisan Profile & Metrics Banner */}
      <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#22211E] text-[#1A1A1A] dark:text-[#F5F3EF] border border-[#E5E2DD] dark:border-[#383632] shadow-2xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <img
                src={currentArtisan.avatar}
                alt={currentArtisan.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#5A5A40] shadow-2xs"
              />
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-600 text-white shadow-xs" title="Verified Artisan">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-serif italic font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                  {currentArtisan.name}
                </h1>
                
                {/* Verified Badge */}
                <button
                  type="button"
                  onClick={() => setSelectedVerificationArtisan(currentArtisan)}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 flex items-center gap-1 hover:scale-105 transition-transform"
                  title="Click to view official digital certificate"
                >
                  <Award className="w-3 h-3 text-emerald-600" />
                  GI & Pehchan Verified
                </button>
              </div>

              <p className="text-xs text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#5A5A40]" />
                {currentArtisan.village}, {currentArtisan.state} • {currentArtisan.craftSpecialty}
              </p>

              <p className="text-[11px] text-[#787570] dark:text-[#A5A29D] mt-0.5 font-mono">
                Pehchan ID: {verification.pehchanArtisanId} • Cert: {verification.verificationId}
              </p>
            </div>
          </div>

          {/* Action Buttons: Switch Profile, Register New, View Cert, AI Catalog */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Profile Switcher dropdown */}
            <div className="relative">
              <button
                type="button"
                id="btn-artisan-profile-switcher"
                onClick={() => setIsArtisanSwitcherOpen(!isArtisanSwitcherOpen)}
                className="py-2 px-3 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-[#F5F2ED]/60 dark:bg-[#2C2A26]/60 text-xs font-semibold flex items-center gap-1.5 hover:bg-[#E5E2DD] transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span className="hidden sm:inline">Switch Artisan ({artisans.length})</span>
                <ChevronDown className="w-3 h-3 text-[#787570]" />
              </button>

              {isArtisanSwitcherOpen && (
                <div className="absolute right-0 mt-1.5 w-64 rounded-2xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] shadow-xl z-30 p-2 space-y-1 animate-in fade-in duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A5A29D]">
                    Registered Artisan Profiles
                  </div>
                  {artisans.map((art) => (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => {
                        setCurrentArtisanId(art.id);
                        setIsArtisanSwitcherOpen(false);
                      }}
                      className={`w-full p-2 rounded-xl text-left flex items-center gap-2.5 transition-colors ${
                        art.id === currentArtisan.id
                          ? 'bg-[#5A5A40]/15 text-[#5A5A40] dark:text-[#C8C7B8] font-bold'
                          : 'hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] text-[#1A1A1A] dark:text-[#F5F3EF]'
                      }`}
                    >
                      <img src={art.avatar} alt={art.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold truncate flex items-center gap-1">
                          {art.name}
                          {art.verified && <Check className="w-3 h-3 text-emerald-600" />}
                        </div>
                        <span className="text-[10px] text-[#A5A29D] block truncate">
                          {art.craftSpecialty}
                        </span>
                      </div>
                    </button>
                  ))}

                  <div className="pt-1 border-t border-[#E5E2DD] dark:border-[#383632]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsArtisanSwitcherOpen(false);
                        setIsRegistrationModalOpen(true);
                      }}
                      className="w-full py-1.5 px-2 rounded-xl text-xs font-bold text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Register New Artisan
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* View Certificate */}
            <button
              type="button"
              id="btn-view-artisan-cert"
              onClick={() => setSelectedVerificationArtisan(currentArtisan)}
              className="py-2 px-3 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Digital Certificate
            </button>

            {/* Register New Artisan Button */}
            <button
              type="button"
              id="btn-register-new-artisan"
              onClick={() => setIsRegistrationModalOpen(true)}
              className="py-2 px-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              + Register Artisan
            </button>

            {/* AI Catalog Button */}
            <button
              id="hub-new-catalog-btn"
              onClick={() => setActiveTab('studio')}
              className="py-2 px-3.5 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              + AI Smart Catalog
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-[#E5E2DD] dark:border-[#383632]">
          <div className="p-2.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]">
            <span className="text-[10px] text-[#A5A29D] block font-medium">Direct Bank Earnings</span>
            <span className="text-base font-bold font-sans text-[#1A1A1A] dark:text-[#F5F3EF]">
              ₹{totalVendorRevenue.toLocaleString()}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]">
            <span className="text-[10px] text-[#A5A29D] block font-medium">Active Vendor Orders</span>
            <span className="text-base font-bold font-sans text-[#1A1A1A] dark:text-[#F5F3EF]">
              {pendingOrdersCount} in Progress
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]">
            <span className="text-[10px] text-[#A5A29D] block font-medium">Authenticity Score</span>
            <span className="text-base font-bold font-sans text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {verification.authenticityScore || 99}% Pure
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]">
            <span className="text-[10px] text-[#A5A29D] block font-medium">Buyer Trust & Escrow</span>
            <span className="text-base font-bold font-sans text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1">
              ★ {currentArtisan.rating} (Direct Escrow)
            </span>
          </div>
        </div>
      </div>

      {/* Hub Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4 border-b border-[#E5E2DD] dark:border-[#383632] pb-2.5">
        <button
          id="tab-vendor-orders"
          onClick={() => setActiveSubTab('orders')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'orders'
              ? 'bg-[#5A5A40] text-white shadow-2xs'
              : 'bg-white dark:bg-[#22211E] text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          {t.sellerOrders} ({vendorOrders.length})
        </button>

        <button
          id="tab-vendor-inventory"
          onClick={() => setActiveSubTab('inventory')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'inventory'
              ? 'bg-[#5A5A40] text-white shadow-2xs'
              : 'bg-white dark:bg-[#22211E] text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          {t.liveInventory}
        </button>

        {/* Dedicated Artisan Verification Subtab */}
        <button
          id="tab-vendor-verification"
          onClick={() => setActiveSubTab('verification')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'verification'
              ? 'bg-[#5A5A40] text-white shadow-2xs'
              : 'bg-white dark:bg-[#22211E] text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Verification & Credentials
        </button>

        <button
          id="tab-vendor-payouts"
          onClick={() => setActiveSubTab('payouts')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'payouts'
              ? 'bg-[#5A5A40] text-white shadow-2xs'
              : 'bg-white dark:bg-[#22211E] text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Fair Wage Payouts
        </button>
      </div>

      {/* SUBTAB 1: VENDOR ORDERS RECEIVED */}
      {activeSubTab === 'orders' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-serif italic text-[#1A1A1A] dark:text-[#F5F3EF]">
              Buyer Orders & Rural Dispatch Manager
            </h2>
            <span className="text-[11px] text-[#A5A29D]">
              Update shipment statuses to automatically trigger buyer push alerts
            </span>
          </div>

          {vendorOrders.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632]">
              <Package className="w-8 h-8 text-[#A5A29D] mx-auto mb-2" />
              <p className="text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                No orders received yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {vendorOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] space-y-3 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E5E2DD] dark:border-[#383632]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                          Order #{order.id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8]">
                          {order.createdAt}
                        </span>
                      </div>
                      <p className="text-xs text-[#A5A29D] mt-0.5">
                        Customer: <span className="font-semibold text-[#1A1A1A] dark:text-[#F5F3EF]">{order.buyerName}</span> ({order.deliveryPincode})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#5A5A40] dark:text-[#C8C7B8] font-sans">
                        Payout: ₹{order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.product.primaryImage}
                            alt={item.product.title}
                            className="w-10 h-10 rounded-lg object-cover border border-[#E5E2DD] dark:border-[#383632]"
                          />
                          <div>
                            <span className="font-semibold text-[#1A1A1A] dark:text-[#F5F3EF] block">
                              {item.product.title}
                            </span>
                            <span className="text-[10px] text-[#A5A29D]">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-mono font-semibold">₹{item.product.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Status update controls */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#E5E2DD] dark:border-[#383632]">
                    <div className="flex items-center gap-1.5 text-xs text-[#787570] dark:text-[#A5A29D]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Current Status: <strong className="text-[#5A5A40] dark:text-[#C8C7B8] uppercase">{order.orderStatus}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'processing')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          order.orderStatus === 'processing'
                            ? 'bg-[#5A5A40] text-white'
                            : 'border border-[#E5E2DD] dark:border-[#383632] hover:bg-[#F5F2ED]'
                        }`}
                      >
                        Preparing
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          order.orderStatus === 'shipped'
                            ? 'bg-[#5A5A40] text-white'
                            : 'border border-[#E5E2DD] dark:border-[#383632] hover:bg-[#F5F2ED]'
                        }`}
                      >
                        Dispatched
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          order.orderStatus === 'delivered'
                            ? 'bg-emerald-700 text-white'
                            : 'border border-[#E5E2DD] dark:border-[#383632] hover:bg-[#F5F2ED]'
                        }`}
                      >
                        Delivered ✓
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: INVENTORY & STOCK MANAGEMENT */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-serif italic text-[#1A1A1A] dark:text-[#F5F3EF]">
              Workshop Stock & Inventory Levels
            </h2>
            <button
              onClick={() => setActiveTab('studio')}
              className="py-1.5 px-3 rounded-xl bg-[#5A5A40] text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Craft
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] space-y-3 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.primaryImage}
                    alt={product.title}
                    className="w-14 h-14 rounded-xl object-cover border border-[#E5E2DD] dark:border-[#383632]"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF] truncate">
                      {product.title}
                    </h4>
                    <p className="text-[10px] text-[#A5A29D]">{product.category}</p>
                    <p className="text-xs font-bold font-sans text-[#1A1A1A] dark:text-[#F5F3EF] mt-0.5">
                      ₹{product.price}
                    </p>
                  </div>
                </div>

                {/* Stock Controls */}
                <div className="p-2.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-semibold text-[#A5A29D] block">
                      Available Stock
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                        {product.stock} units
                      </span>
                      {product.stock <= 3 && (
                        <span className="px-1.5 py-0.2 text-[9px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 rounded">
                          Low Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-white dark:bg-[#22211E] p-1 rounded-lg border border-[#E5E2DD] dark:border-[#383632]">
                    <button
                      onClick={() => updateProductStock(product.id, product.stock - 1)}
                      className="p-1 rounded hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8]"
                      title="Decrease stock"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-1.5 font-mono text-xs font-bold">
                      {product.stock}
                    </span>
                    <button
                      onClick={() => updateProductStock(product.id, product.stock + 1)}
                      className="p-1 rounded hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8]"
                      title="Increase stock"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: ARTISAN VERIFICATION & CREDENTIALS CENTER */}
      {activeSubTab === 'verification' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Top Verification Status Overview */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#1E1D1A] border-2 border-emerald-500/30 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-serif italic font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                      Ministry of Textiles & GI Cluster Verified Master
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#787570] dark:text-[#A5A29D]">
                    Credentials authenticated under National Handicrafts Development Programme & Fair-Trade Escrow.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedVerificationArtisan(currentArtisan)}
                  className="px-3.5 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Award className="w-4 h-4 text-amber-200" />
                  View Official Digital Certificate
                </button>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-1">
                <span className="text-[10px] text-[#A5A29D] uppercase font-bold block">Pehchan Artisan ID</span>
                <span className="text-xs font-mono font-bold text-[#1A1A1A] dark:text-[#F5F3EF] block">
                  {verification.pehchanArtisanId}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ministry UIDAI Linked
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-1">
                <span className="text-[10px] text-[#A5A29D] uppercase font-bold block">GI Cluster Origin</span>
                <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF] block truncate">
                  {verification.giCertificationCluster}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Geographical Tag Certified
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-1">
                <span className="text-[10px] text-[#A5A29D] uppercase font-bold block">Fair Wage Escrow Payout</span>
                <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF] block">
                  100% Direct to Bank
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Zero Middleman Commission
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-1">
                <span className="text-[10px] text-[#A5A29D] uppercase font-bold block">Authenticity Index</span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                  {verification.authenticityScore || 99}% Pure Traditional
                </span>
                <span className="text-[10px] text-[#A5A29D] block">
                  Audited Kiln & Botanical Materials
                </span>
              </div>
            </div>
          </div>

          {/* Details & Proofs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left: Direct Bank & Escrow Registry */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                Direct Escrow Bank Payout Credentials
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] flex justify-between">
                  <span className="text-[#A5A29D]">Account Holder:</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">{verification.bankDetails?.accountHolder || currentArtisan.name}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] flex justify-between">
                  <span className="text-[#A5A29D]">Bank:</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">{verification.bankDetails?.bankName || 'Direct Rural Cooperative Bank'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] flex justify-between">
                  <span className="text-[#A5A29D]">Account Number:</span>
                  <span className="font-mono font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">{verification.bankDetails?.accountNumberMasked || '••••••••4892'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] flex justify-between">
                  <span className="text-[#A5A29D]">IFSC / UPI VPA:</span>
                  <span className="font-mono font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">{verification.bankDetails?.ifscCode || 'SBIN0000045'}</span>
                </div>
              </div>
            </div>

            {/* Right: Traditional Materials & Techniques Checklist */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Verified Materials & Traditional Techniques
              </h3>

              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-[#A5A29D] font-bold block mb-1">Authentic Raw Materials:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(currentArtisan.materials || ['Natural Riverbed Clay', 'Botanical Oxides', 'Terracotta Mud']).map((mat, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-[#5A5A40] dark:text-[#C8C7B8] font-medium">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] text-[#A5A29D] font-bold block mb-1">Techniques & Lineage:</span>
                  <p className="text-xs text-[#787570] dark:text-[#A5A29D] leading-relaxed">
                    {currentArtisan.craftLineage || 'Generational family craft heritage verified under Fair-Trade protocols.'}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#E5E2DD] dark:border-[#383632]">
                  <span className="text-xs text-[#A5A29D]">Need to update documentation?</span>
                  <button
                    type="button"
                    onClick={() => setIsRegistrationModalOpen(true)}
                    className="text-xs font-bold text-[#5A5A40] dark:text-[#C8C7B8] hover:underline"
                  >
                    Update Verification →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: PAYOUTS & FAIR WAGE STATS */}
      {activeSubTab === 'payouts' && (
        <div className="bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-serif italic text-[#1A1A1A] dark:text-[#F5F3EF]">
                Direct Guild Bank Disbursements
              </h2>
              <p className="text-xs text-[#A5A29D]">
                Zero middleman commissions. Funds settle automatically into your registered cooperative bank account.
              </p>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-[#5A5A40]/15 text-[#5A5A40] dark:text-[#C8C7B8] text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5A5A40]" /> Bank Account Verified
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { id: "PAY-9042", amount: 14500, date: "August 24, 2026", status: "Transferred", ref: "NEFT-IN-8891042" },
              { id: "PAY-8821", amount: 8900, date: "August 18, 2026", status: "Transferred", ref: "NEFT-IN-7741099" },
              { id: "PAY-8510", amount: 12200, date: "August 10, 2026", status: "Transferred", ref: "NEFT-IN-6623910" },
            ].map((payout) => (
              <div
                key={payout.id}
                className="p-3 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF]">
                    Disbursement #{payout.id}
                  </span>
                  <p className="text-[10px] text-[#A5A29D]">
                    {payout.date} • Reference: {payout.ref}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-sans text-[#5A5A40] dark:text-[#C8C7B8]">
                    +₹{payout.amount.toLocaleString()}
                  </span>
                  <span className="block text-[10px] font-semibold text-[#5A5A40] dark:text-[#C8C7B8]">
                    {payout.status} ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
