import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Gift,
  Tag,
  PackageCheck,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    appliedCoupon,
    fundContribution,
    shippingCost,
    grandTotal,
    shippingPincode,
    shippingMethod,
    giftNote,
    createOrderFromCart,
    setActiveTab,
  } = useApp();

  const [fullName, setFullName] = useState('Ananya Sen');
  const [email, setEmail] = useState('ananya.sen@gmail.com');
  const [phone, setPhone] = useState('+91 98301 23456');
  const [street, setStreet] = useState('42 Park Street, Flat 4B');
  const [city, setCity] = useState('Kolkata');
  const [state, setState] = useState('West Bengal');
  const [zipCode, setZipCode] = useState(shippingPincode || '700016');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod_escrow'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null);

  if (!isOpen) return null;

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate secure payment gateway handshake
    await new Promise((r) => setTimeout(r, 1000));

    const newOrder = createOrderFromCart(
      {
        street,
        city,
        state,
        zipCode,
        country: 'India',
      },
      {
        name: fullName,
        email,
        phone,
        paymentMethod,
      }
    );

    setIsProcessing(false);
    setPlacedOrderDetails(newOrder);
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div
        id="checkout-modal-content"
        className="bg-[#FDFCFB] dark:bg-[#22211E] rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-[#E5E2DD] dark:border-[#383632] shadow-xl p-4 sm:p-6 relative"
      >
        {/* Close Button */}
        {!placedOrderDetails && (
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-lg hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] text-[#A5A29D] hover:text-[#1A1A1A] dark:hover:text-[#F5F3EF] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* ORDER SUCCESS SCREEN */}
        {placedOrderDetails ? (
          <div className="text-center space-y-4 py-3 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632]">
                Fair-Trade Escrow Locked ✓
              </span>
              <h2 className="text-xl font-serif italic font-bold text-[#1A1A1A] dark:text-[#F5F3EF] mt-1.5">
                Order Placed Successfully!
              </h2>
              <p className="text-xs text-[#5A5A40] dark:text-[#C8C7B8] mt-1 max-w-md mx-auto leading-relaxed">
                Thank you for patronizing authentic Indian craft heritage! Rural master artisans have been notified to begin careful inspection, eco-packaging & insured dispatch.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-left space-y-2 text-xs shadow-2xs">
              <div className="flex justify-between font-bold text-[#1A1A1A] dark:text-[#F5F3EF] pb-1.5 border-b border-[#E5E2DD] dark:border-[#383632]">
                <span className="font-mono">Order #{placedOrderDetails.id}</span>
                <span className="text-[#1A1A1A] dark:text-[#F5F3EF]">
                  ₹{placedOrderDetails.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#A5A29D]">
                <span>Carrier: {placedOrderDetails.courierName}</span>
                <span className="font-mono text-[#1A1A1A] dark:text-[#F5F3EF] font-semibold">
                  Tracking: {placedOrderDetails.trackingNumber}
                </span>
              </div>
              <div className="text-[#A5A29D] flex justify-between">
                <span>Estimated Delivery:</span>
                <span className="text-[#1A1A1A] dark:text-[#F5F3EF] font-medium">
                  {placedOrderDetails.estimatedDelivery}
                </span>
              </div>
              <div className="text-[#A5A29D]">
                Shipping To: {street}, {city}, {state} ({zipCode})
              </div>
              {giftNote && (
                <div className="p-2 rounded bg-[#F5F2ED] dark:bg-[#22211E] text-[11px] text-[#5A5A40] dark:text-[#C8C7B8] italic flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 shrink-0" />
                  <span>Artisan Gift Note Attached</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('buyer_orders');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <PackageCheck className="w-4 h-4" />
                Track My Order in Buyer Hub
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <form onSubmit={handleCompleteOrder} className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632]">
                  <Lock className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-lg font-serif italic font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                    Secure Fair-Trade Checkout
                  </h2>
                  <p className="text-xs text-[#A5A29D]">
                    100% Escrow protected. Artisans are paid upon successful craft delivery inspection.
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address Inputs */}
            <div className="space-y-2.5 bg-white dark:bg-[#2C2A26] p-3.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] shadow-2xs">
              <h3 className="font-bold text-[10px] uppercase tracking-wider text-[#A5A29D]">
                1. Delivery & Recipient Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="block text-[#1A1A1A] dark:text-[#F5F3EF] font-semibold mb-0.5 text-[11px]">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E2DD] dark:border-[#383632] bg-[#FDFCFB] dark:bg-[#22211E] text-[#1A1A1A] dark:text-[#F5F3EF] focus:ring-1 focus:ring-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1A1A] dark:text-[#F5F3EF] font-semibold mb-0.5 text-[11px]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E2DD] dark:border-[#383632] bg-[#FDFCFB] dark:bg-[#22211E] text-[#1A1A1A] dark:text-[#F5F3EF] focus:ring-1 focus:ring-[#5A5A40]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#1A1A1A] dark:text-[#F5F3EF] font-semibold mb-0.5 text-[11px]">
                    Street Address & Apartment
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E2DD] dark:border-[#383632] bg-[#FDFCFB] dark:bg-[#22211E] text-[#1A1A1A] dark:text-[#F5F3EF] focus:ring-1 focus:ring-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1A1A] dark:text-[#F5F3EF] font-semibold mb-0.5 text-[11px]">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E2DD] dark:border-[#383632] bg-[#FDFCFB] dark:bg-[#22211E] text-[#1A1A1A] dark:text-[#F5F3EF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#1A1A1A] dark:text-[#F5F3EF] font-semibold mb-0.5 text-[11px]">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E2DD] dark:border-[#383632] bg-[#FDFCFB] dark:bg-[#22211E] text-[#1A1A1A] dark:text-[#F5F3EF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1A1A1A] dark:text-[#F5F3EF] font-semibold mb-0.5 text-[11px]">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E2DD] dark:border-[#383632] bg-[#FDFCFB] dark:bg-[#22211E] text-[#1A1A1A] dark:text-[#F5F3EF] font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Escrow Payment Method Selector */}
            <div className="space-y-2.5 bg-white dark:bg-[#2C2A26] p-3.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] shadow-2xs">
              <h3 className="font-bold text-[10px] uppercase tracking-wider text-[#A5A29D]">
                2. Escrow Payment Method
              </h3>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-lg border text-center text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-[#5A5A40] bg-[#5A5A40]/10 text-[#5A5A40] dark:text-[#C8C7B8] font-bold'
                      : 'border-[#E5E2DD] dark:border-[#383632] text-[#A5A29D]'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#5A5A40]" />
                  <span className="text-[11px]">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-lg border text-center text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#5A5A40] bg-[#5A5A40]/10 text-[#5A5A40] dark:text-[#C8C7B8] font-bold'
                      : 'border-[#E5E2DD] dark:border-[#383632] text-[#A5A29D]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#5A5A40]" />
                  <span className="text-[11px]">Card / Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod_escrow')}
                  className={`p-2.5 rounded-lg border text-center text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'cod_escrow'
                      ? 'border-[#5A5A40] bg-[#5A5A40]/10 text-[#5A5A40] dark:text-[#C8C7B8] font-bold'
                      : 'border-[#E5E2DD] dark:border-[#383632] text-[#A5A29D]'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#5A5A40]" />
                  <span className="text-[11px]">Pay on Delivery</span>
                </button>
              </div>

              <div className="p-2.5 bg-[#F5F2ED] dark:bg-[#22211E] rounded-lg border border-[#E5E2DD] dark:border-[#383632] text-center text-xs space-y-0.5">
                <span className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF]">
                  100% Escrow Protection Guarantee
                </span>
                <p className="text-[10px] text-[#A5A29D]">
                  Payment is safely held in trust until craft arrival & quality inspection.
                </p>
              </div>
            </div>

            {/* Cost Summary Breakdown in Checkout */}
            <div className="p-3.5 bg-white dark:bg-[#2C2A26] rounded-xl border border-[#E5E2DD] dark:border-[#383632] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#5A5A40] dark:text-[#C8C7B8]">
                <span>Items Subtotal ({cart.length} crafts)</span>
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
              {fundContribution > 0 && (
                <div className="flex justify-between text-[#5A5A40] dark:text-[#C8C7B8]">
                  <span>Artisan Welfare Fund (5%)</span>
                  <span className="font-mono">+₹{fundContribution.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5A5A40] dark:text-[#C8C7B8]">
                <span>Shipping ({shippingMethod === 'express' ? 'Express' : 'Eco Parcel'})</span>
                <span className="font-mono">
                  {shippingCost === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shippingCost}`}
                </span>
              </div>
            </div>

            {/* Total & Submit Button */}
            <div className="space-y-2.5 pt-1">
              <div className="flex justify-between items-baseline text-[#1A1A1A] dark:text-[#F5F3EF]">
                <span className="text-xs font-semibold text-[#A5A29D]">Total Amount Payable:</span>
                <span className="text-xl font-bold font-sans text-[#1A1A1A] dark:text-[#F5F3EF]">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>

              <button
                id="btn-complete-payment"
                type="submit"
                disabled={isProcessing || cart.length === 0}
                className="w-full py-3 rounded-xl bg-[#5A5A40] hover:bg-[#484833] disabled:bg-[#A5A29D] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Locking Escrow & Processing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ₹{grandTotal.toLocaleString()} & Confirm Order</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
