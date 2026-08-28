import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Heart,
  Truck,
  ArrowRight,
  Maximize2,
  Bookmark,
  Tag,
  AlertCircle,
} from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    saveForLater,
    cartCount,
    cartSubtotal,
    cartDiscount,
    appliedCoupon,
    fundContribution,
    shippingCost,
    grandTotal,
    communityFund,
    setCommunityFund,
    shippingMethod,
    setShippingMethod,
    t,
    setActiveTab,
    setSelectedProduct,
  } = useApp();

  if (!isOpen) return null;

  return (
    <div
      id="cart-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end animate-in fade-in duration-200"
    >
      <div
        id="cart-drawer-content"
        className="w-full max-w-md h-full bg-[#FDFCFB] dark:bg-[#22211E] border-l border-[#E5E2DD] dark:border-[#383632] shadow-xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="p-3.5 border-b border-[#E5E2DD] dark:border-[#383632] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif italic font-bold text-sm sm:text-base text-[#1A1A1A] dark:text-[#F5F3EF]">
                {t.cart} ({cartCount} {cartCount === 1 ? 'craft' : 'crafts'})
              </h2>
              <p className="text-[10px] text-[#A5A29D]">
                Direct ethical purchase supporting rural artisans
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('cart');
                }}
                className="p-1.5 rounded-lg hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] transition-colors"
                title="Expand to full cart page"
                aria-label="Expand cart view"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}

            <button
              id="close-cart-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] text-[#A5A29D] hover:text-[#1A1A1A] dark:hover:text-[#F5F3EF] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] flex items-center justify-center text-[#A5A29D]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-[#F5F3EF]">
                  {t.emptyCart}
                </h3>
                <p className="text-xs text-[#A5A29D] mt-0.5 max-w-xs leading-relaxed">
                  Discover timeless terracotta pottery, dokra casting, and handloom textiles directly from certified artisans.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('marketplace');
                }}
                className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <>
              {/* Product items */}
              <div className="space-y-2">
                {cart.map((item) => {
                  const isMaxStock = item.quantity >= item.product.stock;

                  return (
                    <div
                      key={item.product.id}
                      id={`cart-item-${item.product.id}`}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] flex gap-2.5 items-center shadow-2xs"
                    >
                      <button
                        onClick={() => {
                          onClose();
                          setSelectedProduct(item.product);
                        }}
                        className="w-14 h-14 rounded-lg overflow-hidden bg-[#F5F2ED] dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] shrink-0"
                      >
                        <img
                          src={item.product.primaryImage}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </button>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h4
                          onClick={() => {
                            onClose();
                            setSelectedProduct(item.product);
                          }}
                          className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF] truncate hover:text-[#5A5A40] cursor-pointer"
                        >
                          {item.product.title}
                        </h4>
                        <p className="text-[10px] text-[#A5A29D] truncate">
                          By {item.product.artisanName}
                        </p>
                        <p className="font-bold font-sans text-xs text-[#1A1A1A] dark:text-[#F5F3EF]">
                          ₹{(item.product.price * item.quantity).toLocaleString()}{' '}
                          <span className="text-[10px] font-normal text-[#A5A29D]">
                            (₹{item.product.price.toLocaleString()} ea)
                          </span>
                        </p>
                        {item.customizationNote && (
                          <p className="text-[9px] text-[#5A5A40] dark:text-[#C8C7B8] italic truncate">
                            Note: {item.customizationNote}
                          </p>
                        )}
                        {isMaxStock && (
                          <span className="text-[9px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                            <AlertCircle className="w-2.5 h-2.5" /> Max stock reached
                          </span>
                        )}
                      </div>

                      {/* Quantity & Action Controls */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center border border-[#E5E2DD] dark:border-[#383632] rounded-md overflow-hidden bg-[#FDFCFB] dark:bg-[#22211E]">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-1.5 py-0.5 text-xs hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] font-bold text-[#1A1A1A] dark:text-[#F5F3EF]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="px-1.5 text-xs font-bold font-mono text-[#1A1A1A] dark:text-[#F5F3EF]">
                            {item.quantity}
                          </span>
                          <button
                            disabled={isMaxStock}
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className={`px-1.5 py-0.5 text-xs font-bold ${
                              isMaxStock
                                ? 'opacity-40 cursor-not-allowed'
                                : 'hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] text-[#1A1A1A] dark:text-[#F5F3EF]'
                            }`}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => saveForLater(item.product.id)}
                            className="text-[#A5A29D] hover:text-[#5A5A40] p-0.5 transition-colors"
                            title="Save for later"
                            aria-label="Save for later"
                          >
                            <Bookmark className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-[#A5A29D] hover:text-red-500 p-0.5 transition-colors"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Artisan Community Welfare Fund Toggle */}
              <div className="p-2.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-1 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-[#5A5A40] fill-[#5A5A40]" />
                    <div>
                      <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF] block">
                        Artisan Welfare Fund (+5%)
                      </span>
                      <span className="text-[10px] text-[#A5A29D]">
                        Provides pottery wheels & kiln equipment (+₹{fundContribution})
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={communityFund}
                    onChange={(e) => setCommunityFund(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#5A5A40] rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Insured Rural Craft Shipping Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#5A5A40]" />
                  Insured Rural Shipping Carrier:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setShippingMethod('standard')}
                    className={`p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      shippingMethod === 'standard'
                        ? 'border-[#5A5A40] bg-[#5A5A40]/10 text-[#5A5A40] dark:text-[#C8C7B8] font-bold'
                        : 'border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#2C2A26] text-[#A5A29D]'
                    }`}
                  >
                    <span className="block text-xs font-semibold text-[#1A1A1A] dark:text-[#F5F3EF]">Eco Craft Parcel</span>
                    <span className="text-[10px] text-[#A5A29D] font-normal">
                      {cartSubtotal >= 2500 ? 'FREE (Unlocked)' : '4-7 days • ₹80'}
                    </span>
                  </button>

                  <button
                    onClick={() => setShippingMethod('express')}
                    className={`p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      shippingMethod === 'express'
                        ? 'border-[#5A5A40] bg-[#5A5A40]/10 text-[#5A5A40] dark:text-[#C8C7B8] font-bold'
                        : 'border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#2C2A26] text-[#A5A29D]'
                    }`}
                  >
                    <span className="block text-xs font-semibold text-[#1A1A1A] dark:text-[#F5F3EF]">Express Fragile</span>
                    <span className="text-[10px] text-[#A5A29D] font-normal">
                      2-3 days • ₹180
                    </span>
                  </button>
                </div>
              </div>

              {/* View Full Cart Page CTA */}
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('cart');
                }}
                className="w-full py-1.5 text-center text-xs font-semibold text-[#5A5A40] dark:text-[#C8C7B8] hover:underline flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Open Full Bag View (Coupons, Notes, Wishlist)</span>
                <Maximize2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>

        {/* Footer with Cost Breakdown & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-3.5 border-t border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] space-y-2">
            {/* Cost Breakdown */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[#5A5A40] dark:text-[#C8C7B8]">
                <span>{t.subtotal}</span>
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
                  <span>Community Welfare Fund (5%)</span>
                  <span className="font-mono">+₹{fundContribution}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5A5A40] dark:text-[#C8C7B8]">
                <span>{t.shipping}</span>
                <span className="font-mono">
                  {shippingCost === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1A1A1A] dark:text-[#F5F3EF] pt-1.5 border-t border-[#E5E2DD] dark:border-[#383632]">
                <span>{t.total}</span>
                <span className="font-sans text-[#1A1A1A] dark:text-[#F5F3EF]">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Fair-Trade Escrow Tag */}
            <div className="flex items-center gap-1 text-[10px] text-[#5A5A40] dark:text-[#C8C7B8] justify-center">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              100% Escrow Protected: Artisans paid upon delivery
            </div>

            {/* Checkout Button */}
            <button
              id="proceed-to-checkout-btn"
              onClick={onProceedToCheckout}
              className="w-full py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <span>{t.checkout}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
