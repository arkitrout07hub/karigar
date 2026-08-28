import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { MarketplaceView } from './components/MarketplaceView';
import { SmartCatalogStudio } from './components/SmartCatalogStudio';
import { ArtisanVendorHub } from './components/ArtisanVendorHub';
import { BuyerOrdersView } from './components/BuyerOrdersView';
import { DirectMessagingView } from './components/DirectMessagingView';
import { CartView } from './components/CartView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ArtisanStorytellingModal } from './components/ArtisanStorytellingModal';
import { ArtisanRegistrationModal } from './components/ArtisanRegistrationModal';
import { ArtisanVerificationCertificateModal } from './components/ArtisanVerificationCertificateModal';
import { CartModal } from './components/CartModal';
import { CheckoutModal } from './components/CheckoutModal';
import { NotificationsPanel } from './components/NotificationsPanel';
import { SettingsModal } from './components/SettingsModal';

const AppContent: React.FC = () => {
  const {
    activeTab,
    selectedProduct,
    setSelectedProduct,
    selectedArtisan,
    setSelectedArtisan,
    isCartOpen,
    setIsCartOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    isMobilePreview,
    isRegistrationModalOpen,
    setIsRegistrationModalOpen,
    selectedVerificationArtisan,
    setSelectedVerificationArtisan,
    t,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div
      id="app-root-shell"
      className="min-h-screen bg-[#FDFCFB] dark:bg-[#181715] text-[#1A1A1A] dark:text-[#F5F3EF] flex flex-col font-sans transition-colors duration-200"
    >
      {/* Mobile Simulator Frame or Fluid Full-Width Container */}
      <div
        className={
          isMobilePreview
            ? 'w-full max-w-[430px] mx-auto min-h-screen my-0 sm:my-6 bg-[#FFFFFF] dark:bg-[#22211E] sm:rounded-[36px] shadow-2xl border-0 sm:border-[8px] border-[#3E3C36] flex flex-col overflow-hidden relative'
            : 'w-full min-h-screen flex flex-col'
        }
      >
        {/* Mobile Preview Top Notch (for simulated frame) */}
        {isMobilePreview && (
          <div className="hidden sm:flex h-5 w-full bg-[#3E3C36] items-center justify-center shrink-0">
            <div className="w-20 h-3 bg-[#1A1A1A] rounded-full" />
          </div>
        )}

        {/* Global Navigation Header */}
        <Navbar
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Dynamic Main Viewport */}
        <main className="flex-1 w-full overflow-x-hidden bg-[#F9F8F6] dark:bg-[#1F1E1B]">
          {activeTab === 'marketplace' && <MarketplaceView />}
          {activeTab === 'cart' && <CartView />}
          {activeTab === 'studio' && <SmartCatalogStudio />}
          {activeTab === 'seller_orders' && <ArtisanVendorHub />}
          {activeTab === 'buyer_orders' && <BuyerOrdersView />}
          {activeTab === 'messages' && <DirectMessagingView />}
        </main>

        {/* High Density Information Footer */}
        <footer className="hidden lg:flex h-10 border-t border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] px-6 items-center justify-between text-[11px] text-[#A5A29D] dark:text-[#8E8B84] mt-auto select-none">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
              <span>System Status: <span className="text-emerald-700 dark:text-emerald-400 font-bold">AI ENGINE READY</span></span>
            </div>
            <span>•</span>
            <span className="text-[#5A5A40] dark:text-[#C8C7B8] font-medium">KarigarAI Active Node: India / West Bengal</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Escrow Security: <span className="font-semibold text-[#1A1A1A] dark:text-[#F5F3EF]">Direct Fair Wage</span></span>
            <span>Multi-lingual Support: <span className="font-semibold text-[#5A5A40] dark:text-[#C8C7B8]">Enabled (8 Regional Languages)</span></span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-[#5A5A40] dark:text-[#C8C7B8] hover:underline font-medium"
            >
              {t.settings} & Accessibility
            </button>
          </div>
        </footer>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Floating Modals */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}

        {selectedArtisan && (
          <ArtisanStorytellingModal
            artisan={selectedArtisan}
            onClose={() => setSelectedArtisan(null)}
          />
        )}

        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onProceedToCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />

        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
        />

        <NotificationsPanel
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        {/* Artisan Registration & Verification Modal */}
        <ArtisanRegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
        />

        {/* Artisan Official Verification Certificate Modal */}
        {selectedVerificationArtisan && (
          <ArtisanVerificationCertificateModal
            artisan={selectedVerificationArtisan}
            onClose={() => setSelectedVerificationArtisan(null)}
          />
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
