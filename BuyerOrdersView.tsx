import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MessageCircle,
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const BuyerOrdersView: React.FC = () => {
  const { orders, startConversationWithArtisan, setActiveTab, t } = useApp();

  const getStepNumber = (status: string) => {
    switch (status) {
      case 'placed':
        return 1;
      case 'confirmed':
        return 2;
      case 'crafting':
        return 3;
      case 'dispatched':
        return 4;
      case 'in_transit':
        return 4;
      case 'delivered':
        return 5;
      default:
        return 1;
    }
  };

  return (
    <div id="buyer-orders-container" className="max-w-4xl mx-auto pb-20 px-4 sm:px-6 pt-4">
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-serif italic font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
          {t.buyerOrders} & Dispatch Tracking
        </h1>
        <p className="text-xs text-[#5A5A40] dark:text-[#C8C7B8] mt-0.5">
          Follow your handcrafted heritage pieces on their journey from rural artisan clusters directly to your doorstep.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] p-6 space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] flex items-center justify-center text-[#A5A29D] mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-[#F5F3EF]">
              No orders placed yet
            </h3>
            <p className="text-xs text-[#A5A29D] mt-0.5">
              Explore authentic terracotta, textiles, and metalwork in our marketplace.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-semibold shadow-2xs transition-all"
          >
            Explore Marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const currentStep = getStepNumber(order.orderStatus);

            return (
              <div
                key={order.id}
                id={`buyer-order-${order.id}`}
                className="bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] p-4 shadow-2xs space-y-3.5"
              >
                {/* Top Info Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#E5E2DD] dark:border-[#383632]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif italic font-bold text-sm text-[#1A1A1A] dark:text-[#F5F3EF]">
                        Order #{order.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          order.orderStatus === 'delivered'
                            ? 'bg-[#5A5A40]/15 text-[#5A5A40] dark:text-[#C8C7B8]'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                        }`}
                      >
                        {order.orderStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#A5A29D] mt-0.5">
                      Placed on {new Date(order.placedAt).toLocaleDateString()} • {order.items.length} unique craft item(s)
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] uppercase font-semibold text-[#A5A29D] block">
                      Total Paid (Escrow)
                    </span>
                    <span className="text-base font-bold font-sans text-[#1A1A1A] dark:text-[#F5F3EF]">
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress Steps Timeline */}
                <div className="py-1">
                  <div className="grid grid-cols-5 gap-1 text-center text-[9px] font-semibold text-[#A5A29D] mb-1.5">
                    <span className={currentStep >= 1 ? 'text-[#5A5A40] dark:text-[#C8C7B8] font-bold' : ''}>
                      1. Placed
                    </span>
                    <span className={currentStep >= 2 ? 'text-[#5A5A40] dark:text-[#C8C7B8] font-bold' : ''}>
                      2. Confirmed
                    </span>
                    <span className={currentStep >= 3 ? 'text-[#5A5A40] dark:text-[#C8C7B8] font-bold' : ''}>
                      3. Craft & Pack
                    </span>
                    <span className={currentStep >= 4 ? 'text-[#5A5A40] dark:text-[#C8C7B8] font-bold' : ''}>
                      4. In Transit
                    </span>
                    <span className={currentStep >= 5 ? 'text-[#5A5A40] dark:text-[#C8C7B8] font-bold' : ''}>
                      5. Delivered
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="h-1.5 w-full bg-[#F5F2ED] dark:bg-[#2C2A26] rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-[#5A5A40] rounded-full transition-all duration-500"
                      style={{ width: `${(currentStep / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Courier & Tracking Details */}
                <div className="p-2.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#5A5A40] dark:text-[#C8C7B8]" />
                    <div>
                      <span className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF]">
                        {order.courierName}
                      </span>
                      <p className="text-[10px] text-[#A5A29D]">
                        Tracking: <span className="font-mono font-semibold text-[#1A1A1A] dark:text-[#F5F3EF]">{order.trackingNumber}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#A5A29D] sm:text-right">
                    <span>Est. Delivery: </span>
                    <span className="font-semibold text-[#1A1A1A] dark:text-[#F5F3EF]">
                      {order.estimatedDelivery}
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#A5A29D]">
                    Craft Items:
                  </h4>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product.primaryImage}
                          alt={item.product.title}
                          className="w-10 h-10 rounded-lg object-cover border border-[#E5E2DD] dark:border-[#383632]"
                        />
                        <div>
                          <p className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF]">
                            {item.product.title}
                          </p>
                          <p className="text-[10px] text-[#A5A29D]">
                            Artisan: {item.product.artisanName} ({item.product.artisanRegion})
                          </p>
                          <p className="text-[10px] text-[#A5A29D]">
                            Qty: {item.quantity} • ₹{item.product.price}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => startConversationWithArtisan(item.product.artisanId, item.product.id)}
                        className="px-2.5 py-1 rounded-lg bg-[#F5F2ED] hover:bg-[#E5E2DD] dark:bg-[#22211E] dark:hover:bg-[#383632] text-[#5A5A40] dark:text-[#C8C7B8] text-[11px] font-semibold flex items-center gap-1 border border-[#E5E2DD] dark:border-[#383632] transition-colors"
                      >
                        <MessageCircle className="w-3 h-3 text-[#5A5A40]" />
                        <span>Chat Artisan</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
