import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Sparkles,
  ShoppingBag,
  Store,
  MessageSquare,
  Sliders,
} from 'lucide-react';

interface BottomNavProps {
  onOpenCart: () => void;
  onOpenSettings: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onOpenCart,
  onOpenSettings,
}) => {
  const { role, activeTab, setActiveTab, cartCount, t } = useApp();

  return (
    <div
      id="mobile-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#FDFCFB]/95 dark:bg-[#22211E]/95 backdrop-blur-md border-t border-[#E5E2DD] dark:border-[#383632] py-1.5 px-3 shadow-sm"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {role === 'buyer' ? (
          <>
            <button
              id="mobile-nav-explore"
              onClick={() => setActiveTab('marketplace')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-all ${
                activeTab === 'marketplace'
                  ? 'text-[#5A5A40] dark:text-[#C8C7B8] font-bold'
                  : 'text-[#A5A29D] hover:text-[#1A1A1A] dark:hover:text-[#F5F3EF]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="text-[10px] tracking-tight">{t.marketplace}</span>
            </button>

            <button
              id="mobile-nav-buyer-orders"
              onClick={() => setActiveTab('buyer_orders')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-all ${
                activeTab === 'buyer_orders'
                  ? 'text-[#5A5A40] dark:text-[#C8C7B8] font-bold'
                  : 'text-[#A5A29D] hover:text-[#1A1A1A] dark:hover:text-[#F5F3EF]'
              }`}
            >
              <Store className="w-4 h-4" />
              <span className="text-[10px] tracking-tight">{t.buyerOrders}</span>
            </button>
          </>
        ) : (
          <>
            <button
              id="mobile-nav-studio"
              onClick={() => setActiveTab('studio')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-all ${
                activeTab === 'studio'
                  ? 'text-[#5A5A40] dark:text-[#C8C7B8] font-bold'
                  : 'text-[#A5A29D] hover:text-[#1A1A1A] dark:hover:text-[#F5F3EF]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#5A5A40] dark:text-[#C8C7B8]" />
              <span className="text-[10px] tracking-tight">{t.smartStudio}</span>
            </button>

            <button
              id="mobile-nav-seller-orders"
              onClick={() => setActiveTab('seller_orders')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-all ${
                activeTab === 'seller_orders'
                  ? 'text-[#5A5A40] dark:text-[#C8C7B8] font-bold'
                  : 'text-[#A5A29D] hover:text-[#1A1A1A] dark:hover:text-[#F5F3EF]'
              }`}
            >
              <Store className="w-4 h-4" />
              <span className="text-[10px] tracking-tight">{t.sellerOrders}</span>
            </button>
          </>
        )}

        <button
          id="mobile-nav-cart"
          onClick={onOpenCart}
          className="relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[#A5A29D] hover:text-[#1A1A1A] dark:hover:text-[#F5F3EF]"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#5A5A40] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">{t.cart}</span>
        </button>

        <button
          id="mobile-nav-messages"
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-all ${
            activeTab === 'messages'
              ? 'text-[#5A5A40] dark:text-[#C8C7B8] font-bold'
              : 'text-[#A5A29D] hover:text-[#1A1A1A] dark:hover:text-[#F5F3EF]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">{t.messages}</span>
        </button>

        <button
          id="mobile-nav-settings"
          onClick={onOpenSettings}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[#A5A29D] hover:text-[#1A1A1A] dark:hover:text-[#F5F3EF]"
        >
          <Sliders className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">{t.settings}</span>
        </button>
      </div>
    </div>
  );
};
