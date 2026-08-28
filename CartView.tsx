import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Heart,
  Truck,
  ArrowRight,
  Bookmark,
  Sparkles,
  Tag,
  Gift,
  MapPin,
  CheckCircle2,
  RotateCcw,
  ArrowLeft,
  X,
  AlertCircle,
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
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
    setIsCheckoutOpen,
    setActiveTab,
    setSelectedProduct,
    setSelectedArtisan,
    artisans,
    products,
    t,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [editingCustomizationId, setEditingCustomizationId] = useState<string | null>(null);
  const [customNoteDraft, setCustomNoteDraft] = useState('');
  const [pincodeInput, setPincodeInput] = useState(shippingPincode || '700016');
  const [pincodeSuccess, setPincodeSuccess] = useState(true);
  const [pincodeCity, setPincodeCity] = useState('Kolkata & Eastern Hub');

  // Free shipping threshold: ₹2,500
  const freeShippingThreshold = 2500;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback({
      message: res.message,
      isError: !res.success,
    });
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleApplySuggestedCoupon = (code: string) => {
    const res = applyCoupon(code);
    setCouponFeedback({
      message: res.message,
      isError: !res.success,
    });
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeInput.trim().length === 6) {
      setShippingPincode(pincodeInput);
      setPincodeSuccess(true);
      if (pincodeInput.startsWith('7')) setPincodeCity('West Bengal / East Zone');
      else if (pincodeInput.startsWith('1')) setPincodeCity('Delhi NCR / North Zone');
      else if (pincodeInput.startsWith('4')) setPincodeCity('Maharashtra / West Zone');
      else if (pincodeInput.startsWith('5')) setPincodeCity('Karnataka / South Zone');
      else setPincodeCity('All-India Rural Courier Hub');
    }
  };

  const recommendedProducts = products.filter(
    (p) => !cart.some((item) => item.product.id === p.id)
  ).slice(0, 3);

  return (
    <div id="cart-full-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Breadcrumb & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E2DD] dark:border-[#383632]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#A5A29D]">
            <button
              onClick={() => setActiveTab('marketplace')}
              className="hover:text-[#5A5A40] dark:hover:text-[#C8C7B8] flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
            </button>
            <span>/</span>
            <span className="text-[#1A1A1A] dark:text-[#F5F3EF] font-semibold">Conscious Craft Bag</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
            My Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-[#5A5A40] dark:text-[#C8C7B8] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            100% Direct Fair Wage Escrow
          </span>
          {cart.length > 0 && (
            <button
              id="clear-entire-cart-btn"
              onClick={clearCart}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#A5A29D] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              Empty Bag
            </button>
          )}
        </div>
      </div>

      {cart.length === 0 ? (
        /* Empty Cart Screen with Recommendations */
        <div className="py-12 space-y-8">
          <div className="max-w-md mx-auto text-center space-y-4 p-8 rounded-2xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-[#F5F2ED] dark:bg-[#2C2A26] flex items-center justify-center mx-auto text-[#5A5A40] dark:text-[#C8C7B8]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-serif italic font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                Your craft bag is empty
              </h2>
              <p className="text-xs text-[#A5A29D] mt-1 max-w-sm mx-auto leading-relaxed">
                Connect directly with rural master artisans across India. Discover GI certified terracotta, hand-cast dokra, and pure silk handlooms.
              </p>
            </div>
            <button
              id="empty-cart-explore-btn"
              onClick={() => setActiveTab('marketplace')}
              className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold shadow-2xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              Explore Artisan Creations
            </button>
          </div>

          {/* Saved For Later Section (if any items were saved) */}
          {savedForLater.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif italic font-bold text-base text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#5A5A40]" />
                Saved for Later ({savedForLater.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedForLater.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 rounded-xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] shadow-2xs flex gap-3 items-center"
                  >
                    <img
                      src={item.product.primaryImage}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-lg object-cover bg-[#F5F2ED] border border-[#E5E2DD] dark:border-[#383632]"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-bold text-xs truncate text-[#1A1A1A] dark:text-[#F5F3EF]">
                        {item.product.title}
                      </h4>
                      <p className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF]">
                        ₹{item.product.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => moveToCart(item.product.id)}
                          className="text-[11px] font-bold text-[#5A5A40] dark:text-[#C8C7B8] hover:underline"
                        >
                          Move to Bag
                        </button>
                        <span className="text-[#A5A29D] text-[10px]">•</span>
                        <button
                          onClick={() => removeFromSavedForLater(item.product.id)}
                          className="text-[11px] text-[#A5A29D] hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curated Recommendations */}
          {recommendedProducts.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#E5E2DD] dark:border-[#383632]">
              <h3 className="font-serif italic font-bold text-base text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5A5A40]" />
                Recommended Master Crafts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] shadow-2xs flex flex-col justify-between space-y-2 group"
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#F5F2ED]">
                      <img
                        src={p.primaryImage}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5A5A40] dark:text-[#C8C7B8] font-semibold block truncate">
                        By {p.artisanName} ({p.artisanRegion})
                      </span>
                      <h4 className="font-serif font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF] truncate mt-0.5">
                        {p.title}
                      </h4>
                      <p className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF] mt-1">
                        ₹{p.price.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="w-full py-1.5 rounded-lg bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add to Bag
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Populated Full Cart View: 2 Columns Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Cart Items, Free Shipping Bar, Personalization, Delivery & Wishlist */}
          <div className="lg:col-span-7 space-y-4">
            {/* Free Shipping Progress Indicator */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#5A5A40]" />
                  {amountToFreeShipping === 0
                    ? '🎉 You have unlocked Free Insured Express Rural Shipping!'
                    : `Add ₹${amountToFreeShipping.toLocaleString()} more for Free Express Shipping`}
                </span>
                <span className="font-mono text-[11px] font-bold text-[#5A5A40] dark:text-[#C8C7B8]">
                  {freeShippingProgress}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#F5F2ED] dark:bg-[#2C2A26] overflow-hidden">
                <div
                  className="h-full bg-[#5A5A40] transition-all duration-300 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3">
              {cart.map((item) => {
                const isMaxStock = item.quantity >= item.product.stock;
                const isCustomizing = editingCustomizationId === item.product.id;

                return (
                  <div
                    key={item.product.id}
                    id={`cart-view-item-${item.product.id}`}
                    className="p-4 rounded-xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] shadow-2xs space-y-3 transition-all"
                  >
                    <div className="flex gap-3 sm:gap-4 items-start">
                      {/* Product Image */}
                      <button
                        onClick={() => setSelectedProduct(item.product)}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] shrink-0 group focus:outline-none"
                      >
                        <img
                          src={item.product.primaryImage}
                          alt={item.product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </button>

                      {/* Info & Details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              const artisan =
                                artisans.find((a) => a.id === item.product.artisanId) ||
                                artisans[0];
                              setSelectedArtisan(artisan);
                            }}
                            className="text-[11px] font-medium text-[#5A5A40] dark:text-[#C8C7B8] hover:underline flex items-center gap-1"
                          >
                            <MapPin className="w-3 h-3 text-[#5A5A40]" />
                            {item.product.artisanName} ({item.product.artisanRegion})
                          </button>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632]">
                            {item.product.craftBadge}
                          </span>
                        </div>

                        <h3
                          onClick={() => setSelectedProduct(item.product)}
                          className="font-serif italic font-bold text-sm sm:text-base text-[#1A1A1A] dark:text-[#F5F3EF] cursor-pointer hover:text-[#5A5A40] transition-colors truncate"
                        >
                          {item.product.title}
                        </h3>

                        <p className="text-[11px] text-[#A5A29D]">
                          Technique: {item.product.technique} • {item.product.dimensions}
                        </p>

                        <div className="flex items-baseline gap-2 pt-0.5">
                          <span className="font-sans font-bold text-sm sm:text-base text-[#1A1A1A] dark:text-[#F5F3EF]">
                            ₹{(item.product.price * item.quantity).toLocaleString()}
                          </span>
                          <span className="text-[11px] text-[#A5A29D]">
                            (₹{item.product.price.toLocaleString()} each)
                          </span>
                        </div>

                        {/* Low stock or stock limit warning */}
                        {isMaxStock && (
                          <div className="inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900">
                            <AlertCircle className="w-3 h-3" />
                            Max available inventory reached ({item.product.stock} units)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Item Row Controls: Quantity, Save for Later, Custom Note, Remove */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-[#F5F2ED] dark:border-[#383632] text-xs">
                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#A5A29D] font-medium">Quantity:</span>
                        <div className="flex items-center border border-[#E5E2DD] dark:border-[#383632] rounded-lg overflow-hidden bg-[#FDFCFB] dark:bg-[#22211E]">
                          <button
                            id={`qty-minus-${item.product.id}`}
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-[#1A1A1A] dark:text-[#F5F3EF] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold font-mono text-[#1A1A1A] dark:text-[#F5F3EF]">
                            {item.quantity}
                          </span>
                          <button
                            id={`qty-plus-${item.product.id}`}
                            disabled={isMaxStock}
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className={`px-2.5 py-1 transition-colors ${
                              isMaxStock
                                ? 'opacity-40 cursor-not-allowed bg-stone-100 dark:bg-stone-800'
                                : 'text-[#1A1A1A] dark:text-[#F5F3EF] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26]'
                            }`}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            if (isCustomizing) {
                              setEditingCustomizationId(null);
                            } else {
                              setEditingCustomizationId(item.product.id);
                              setCustomNoteDraft(item.customizationNote || '');
                            }
                          }}
                          className="text-[11px] font-semibold text-[#5A5A40] dark:text-[#C8C7B8] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          {item.customizationNote ? 'Edit Craft Note' : 'Add Note to Artisan'}
                        </button>

                        <button
                          onClick={() => saveForLater(item.product.id)}
                          className="text-[11px] font-semibold text-[#5A5A40] dark:text-[#C8C7B8] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          Save for Later
                        </button>

                        <button
                          id={`remove-item-${item.product.id}`}
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                          aria-label="Remove item from bag"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Custom Note Input Drawer */}
                    {isCustomizing && (
                      <div className="p-3 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-2 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
                            Special Request for {item.product.artisanName}
                          </span>
                          <button
                            onClick={() => setEditingCustomizationId(null)}
                            className="text-[#A5A29D] hover:text-[#1A1A1A]"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          value={customNoteDraft}
                          onChange={(e) => setCustomNoteDraft(e.target.value)}
                          placeholder="e.g. Please sign with terracotta seal, custom initials engraving, or birthday gift package..."
                          rows={2}
                          className="w-full text-xs p-2 rounded-lg bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] text-[#1A1A1A] dark:text-[#F5F3EF] focus:outline-none focus:border-[#5A5A40]"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingCustomizationId(null)}
                            className="px-2.5 py-1 rounded text-[11px] text-[#A5A29D] hover:text-[#1A1A1A]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              updateItemCustomization(item.product.id, customNoteDraft);
                              setEditingCustomizationId(null);
                            }}
                            className="px-3 py-1 rounded bg-[#5A5A40] text-white text-[11px] font-bold shadow-2xs"
                          >
                            Save Request
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Displayed Custom Note */}
                    {!isCustomizing && item.customizationNote && (
                      <div className="p-2 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] text-[11px] text-[#5A5A40] dark:text-[#C8C7B8] flex items-start gap-2 italic">
                        <Gift className="w-3.5 h-3.5 text-[#5A5A40] shrink-0 mt-0.5" />
                        <span>"{item.customizationNote}"</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pincode & Delivery Date Estimator */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] shadow-2xs space-y-2.5">
              <h4 className="font-serif italic font-bold text-sm text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#5A5A40]" />
                Delivery Pincode & Craft Hub Route
              </h4>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN code"
                  className="flex-1 px-3 py-2 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-xs font-mono font-bold text-[#1A1A1A] dark:text-[#F5F3EF] focus:outline-none focus:border-[#5A5A40]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  Check Serviceability
                </button>
              </form>
              {pincodeSuccess && (
                <div className="flex items-center justify-between text-xs text-[#5A5A40] dark:text-[#C8C7B8] pt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Delivering to <strong className="text-[#1A1A1A] dark:text-[#F5F3EF]">{pincodeCity} ({shippingPincode})</strong>
                  </span>
                  <span className="text-[11px] text-[#A5A29D]">
                    Estimated Delivery: <strong>{shippingMethod === 'express' ? '2-3 Business Days' : '4-6 Business Days'}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Artisan Community Welfare Fund Toggle */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8]">
                  <Heart className="w-4 h-4 fill-[#5A5A40]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF]">
                    Artisan Community Welfare Fund (+5%)
                  </h4>
                  <p className="text-[11px] text-[#A5A29D]">
                    100% of ₹{fundContribution} provides pottery wheels, dokra kilns & healthcare insurance to rural master guilds.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={communityFund}
                onChange={(e) => setCommunityFund(e.target.checked)}
                className="w-4 h-4 accent-[#5A5A40] rounded cursor-pointer"
                aria-label="Toggle community welfare fund"
              />
            </div>

            {/* General Gift Note to Artisan Cooperative */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] shadow-2xs space-y-2">
              <h4 className="font-serif italic font-bold text-sm text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-[#5A5A40]" />
                Artisan Greeting & Packaging Note
              </h4>
              <textarea
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="Include a personal message for the artisan guild or special packaging instructions..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-[#1A1A1A] dark:text-[#F5F3EF] focus:outline-none focus:border-[#5A5A40]"
              />
            </div>

            {/* Saved for Later Section (Inside Active Cart) */}
            {savedForLater.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#E5E2DD] dark:border-[#383632]">
                <h3 className="font-serif italic font-bold text-base text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#5A5A40]" />
                  Saved for Later ({savedForLater.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedForLater.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 rounded-xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] shadow-2xs flex gap-3 items-center"
                    >
                      <img
                        src={item.product.primaryImage}
                        alt={item.product.title}
                        className="w-14 h-14 rounded-lg object-cover bg-[#F5F2ED] border border-[#E5E2DD] dark:border-[#383632]"
                      />
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h4 className="font-bold text-xs truncate text-[#1A1A1A] dark:text-[#F5F3EF]">
                          {item.product.title}
                        </h4>
                        <p className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF]">
                          ₹{item.product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => moveToCart(item.product.id)}
                            className="text-[11px] font-bold text-[#5A5A40] dark:text-[#C8C7B8] hover:underline cursor-pointer"
                          >
                            Move to Bag
                          </button>
                          <span className="text-[#A5A29D] text-[10px]">•</span>
                          <button
                            onClick={() => removeFromSavedForLater(item.product.id)}
                            className="text-[11px] text-[#A5A29D] hover:text-red-500 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary, Shipping Carrier, Coupons & Escrow Checkout CTA */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] shadow-sm space-y-4">
              <h3 className="font-serif italic font-bold text-base text-[#1A1A1A] dark:text-[#F5F3EF]">
                Order Summary
              </h3>

              {/* Insured Rural Craft Shipping Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#5A5A40]" />
                  Insured Rural Shipping Carrier:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShippingMethod('standard')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      shippingMethod === 'standard'
                        ? 'border-[#5A5A40] bg-[#5A5A40]/10 text-[#5A5A40] dark:text-[#C8C7B8] font-bold'
                        : 'border-[#E5E2DD] dark:border-[#383632] bg-[#FDFCFB] dark:bg-[#2C2A26] text-[#A5A29D]'
                    }`}
                  >
                    <span className="block text-xs font-semibold text-[#1A1A1A] dark:text-[#F5F3EF]">Eco Craft Parcel</span>
                    <span className="text-[10px] text-[#A5A29D] font-normal block mt-0.5">
                      {amountToFreeShipping === 0 ? 'FREE (Unlocked)' : '4-7 days • ₹80'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod('express')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      shippingMethod === 'express'
                        ? 'border-[#5A5A40] bg-[#5A5A40]/10 text-[#5A5A40] dark:text-[#C8C7B8] font-bold'
                        : 'border-[#E5E2DD] dark:border-[#383632] bg-[#FDFCFB] dark:bg-[#2C2A26] text-[#A5A29D]'
                    }`}
                  >
                    <span className="block text-xs font-semibold text-[#1A1A1A] dark:text-[#F5F3EF]">Express Fragile</span>
                    <span className="text-[10px] text-[#A5A29D] font-normal block mt-0.5">
                      2-3 days • ₹180
                    </span>
                  </button>
                </div>
              </div>

              {/* Coupon / Promo Code Input */}
              <div className="space-y-2 pt-2 border-t border-[#F5F2ED] dark:border-[#383632]">
                <label className="text-xs font-semibold text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#5A5A40]" />
                  Discount Promo Code:
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#5A5A40]/30 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#5A5A40]" />
                      <div>
                        <span className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF] block font-mono">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[10px] text-[#5A5A40] dark:text-[#C8C7B8]">
                          {appliedCoupon.description}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="p-1 rounded-md text-[#A5A29D] hover:text-red-500 transition-colors"
                      title="Remove coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. HANDMADE10"
                      className="flex-1 px-3 py-2 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-xs font-mono font-bold text-[#1A1A1A] dark:text-[#F5F3EF] focus:outline-none focus:border-[#5A5A40]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-lg bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponFeedback && (
                  <p
                    className={`text-[11px] ${
                      couponFeedback.isError ? 'text-red-600' : 'text-emerald-700 dark:text-emerald-400 font-semibold'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}

                {/* Suggested Coupon Chips */}
                {!appliedCoupon && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-[#A5A29D]">Try:</span>
                    <button
                      type="button"
                      onClick={() => handleApplySuggestedCoupon('HANDMADE10')}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-[#5A5A40] dark:text-[#C8C7B8] hover:border-[#5A5A40] transition-colors cursor-pointer"
                    >
                      HANDMADE10 (10% Off)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplySuggestedCoupon('KARIGAR200')}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-[#5A5A40] dark:text-[#C8C7B8] hover:border-[#5A5A40] transition-colors cursor-pointer"
                    >
                      KARIGAR200 (₹200 Off)
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-3 border-t border-[#E5E2DD] dark:border-[#383632] text-xs">
                <div className="flex justify-between text-[#5A5A40] dark:text-[#C8C7B8]">
                  <span>Items Subtotal ({cartCount} crafts)</span>
                  <span className="font-mono">₹{cartSubtotal.toLocaleString()}</span>
                </div>

                {appliedCoupon && cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Coupon ({appliedCoupon.code})
                    </span>
                    <span className="font-mono">-₹{cartDiscount.toLocaleString()}</span>
                  </div>
                )}

                {communityFund && (
                  <div className="flex justify-between text-[#5A5A40] dark:text-[#C8C7B8]">
                    <span>Artisan Welfare Contribution (5%)</span>
                    <span className="font-mono">+₹{fundContribution.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#5A5A40] dark:text-[#C8C7B8]">
                  <span>Insured Shipping ({shippingMethod === 'express' ? 'Fragile Express' : 'Eco Parcel'})</span>
                  <span className="font-mono">
                    {shippingCost === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shippingCost}`}
                  </span>
                </div>

                <div className="flex justify-between text-[#A5A29D] text-[11px]">
                  <span>Estimated GI Craft Tax (3%)</span>
                  <span className="font-mono">₹{Math.round(cartSubtotal * 0.03).toLocaleString()} (Included)</span>
                </div>

                {/* Grand Total */}
                <div className="flex justify-between text-base font-bold text-[#1A1A1A] dark:text-[#F5F3EF] pt-2 border-t border-[#E5E2DD] dark:border-[#383632]">
                  <span>Total Payable</span>
                  <span className="font-sans text-lg text-[#1A1A1A] dark:text-[#F5F3EF]">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                id="cart-view-checkout-btn"
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <span>Proceed to Escrow Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Indicators */}
              <div className="p-3 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-1.5 text-[11px] text-[#5A5A40] dark:text-[#C8C7B8]">
                <div className="flex items-center gap-1.5 font-semibold text-[#1A1A1A] dark:text-[#F5F3EF]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Escrow Protection
                </div>
                <p className="text-[10px] text-[#A5A29D] leading-relaxed">
                  Your funds are secured in direct fair-trade escrow. Artisans are paid upon your confirmed delivery satisfaction.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[10px] text-[#5A5A40] dark:text-[#C8C7B8]">
                  <RotateCcw className="w-3 h-3" />
                  <span>Free 7-Day Fragile Transit Replacement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
