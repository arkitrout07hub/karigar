import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { languageNames } from '../data/translations';
import { LanguageCode, Role } from '../types';
import {
  Sparkles,
  ShoppingBag,
  Bell,
  Sun,
  Moon,
  Globe,
  Smartphone,
  Monitor,
  UserCheck,
  Store,
  Compass,
  Volume2,
  VolumeX,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNotifications,
  onOpenCart,
}) => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    t,
    theme,
    toggleTheme,
    cartCount,
    unreadNotificationCount,
    activeTab,
    setActiveTab,
    isMobilePreview,
    setIsMobilePreview,
    isSpeaking,
    stopSpeaking,
    setIsRegistrationModalOpen,
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);

  const handleRoleToggle = () => {
    const nextRole: Role = role === 'buyer' ? 'artisan' : 'buyer';
    setRole(nextRole);
    if (nextRole === 'artisan') {
      setActiveTab('studio');
    } else {
      setActiveTab('marketplace');
    }
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-[#22211E]/95 border-b border-[#E5E2DD] dark:border-[#383632] transition-colors duration-200 shadow-2xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & High Density Tagline */}
        <div className="flex items-center gap-3">
          <button
            id="brand-logo-button"
            onClick={() => setActiveTab(role === 'artisan' ? 'seller_orders' : 'marketplace')}
            className="flex items-center gap-3 text-left focus:outline-none group"
            aria-label="KarigarAI Home"
          >
            <div className="w-10 h-10 bg-[#5A5A40] rounded-lg flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
              <span className="font-serif italic font-bold text-xl">K</span>
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-serif italic text-xl text-[#2D2D2D] dark:text-[#F5F3EF]">
                  KarigarFlow
                </span>
                <span className="text-[10px] font-sans not-italic text-[#5A5A40] dark:text-[#C8C7B8] bg-[#F5F2ED] dark:bg-[#2C2A26] px-2 py-0.5 rounded ml-2 border border-[#E5E2DD] dark:border-[#383632] uppercase tracking-wider font-semibold">
                  AI-Driven Portal
                </span>
              </div>
              <p className="text-[10px] text-[#A5A29D] dark:text-[#8E8B84] hidden md:block tracking-wide">
                Fair Trade • Direct Craft Linkage
              </p>
            </div>
          </button>
        </div>

        {/* Active Marketplace Indicator (From High Density Theme) */}
        <div className="hidden xl:flex items-center gap-2 bg-[#F5F2ED] dark:bg-[#2C2A26] px-3 py-1.5 rounded-full text-xs font-medium border border-[#E5E2DD] dark:border-[#383632] text-[#5A5A40] dark:text-[#C8C7B8]">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Active Marketplace: India / West Bengal</span>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F5F2ED] dark:bg-[#2C2A26] p-1 rounded-xl border border-[#E5E2DD] dark:border-[#383632] text-xs font-medium">
          {role === 'buyer' ? (
            <>
              <button
                id="nav-explore-btn"
                onClick={() => setActiveTab('marketplace')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all duration-150 flex items-center gap-1.5 ${
                  activeTab === 'marketplace'
                    ? 'bg-[#5A5A40] text-white shadow-xs'
                    : 'text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#E5E2DD]/50 dark:hover:bg-[#383632]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                {t.marketplace}
              </button>
              <button
                id="nav-buyer-orders-btn"
                onClick={() => setActiveTab('buyer_orders')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all duration-150 flex items-center gap-1.5 ${
                  activeTab === 'buyer_orders'
                    ? 'bg-[#5A5A40] text-white shadow-xs'
                    : 'text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#E5E2DD]/50 dark:hover:bg-[#383632]'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                {t.buyerOrders}
              </button>
            </>
          ) : (
            <>
              <button
                id="nav-studio-btn"
                onClick={() => setActiveTab('studio')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all duration-150 flex items-center gap-1.5 ${
                  activeTab === 'studio'
                    ? 'bg-[#5A5A40] text-white shadow-xs'
                    : 'text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#E5E2DD]/50 dark:hover:bg-[#383632]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                {t.smartStudio}
              </button>
              <button
                id="nav-seller-orders-btn"
                onClick={() => setActiveTab('seller_orders')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all duration-150 flex items-center gap-1.5 ${
                  activeTab === 'seller_orders'
                    ? 'bg-[#5A5A40] text-white shadow-xs'
                    : 'text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#E5E2DD]/50 dark:hover:bg-[#383632]'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                {t.sellerOrders} & Stock
              </button>
            </>
          )}

          <button
            id="nav-messages-btn"
            onClick={() => setActiveTab('messages')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all duration-150 ${
              activeTab === 'messages'
                ? 'bg-[#5A5A40] text-white shadow-xs'
                : 'text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#E5E2DD]/50 dark:hover:bg-[#383632]'
            }`}
          >
            {t.messages}
          </button>
        </nav>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-2">
          {/* Active Role Switcher Pill */}
          <button
            id="role-switch-button"
            onClick={handleRoleToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F5F2ED] hover:bg-[#E5E2DD] dark:bg-[#2C2A26] dark:hover:bg-[#383632] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632] transition-all"
            title={`Switch to ${role === 'buyer' ? 'Artisan Portal' : 'Buyer Mode'}`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#C8C7B8]" />
            <span className="hidden sm:inline text-[11px] text-[#A5A29D]">Mode:</span>
            <span className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
              {role === 'buyer' ? t.roleBuyer : t.roleArtisan}
            </span>
          </button>

          {/* Quick Artisan Verification Registration Trigger */}
          <button
            id="nav-artisan-verify-btn"
            onClick={() => setIsRegistrationModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-all"
            title="Register for Artisan Verification & Pehchan ID"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Verify Artisan</span>
          </button>

          {/* Audio TTS Stop indicator if speaking */}
          {isSpeaking && (
            <button
              id="tts-stop-btn"
              onClick={stopSpeaking}
              className="p-2 rounded-lg bg-amber-700 text-white animate-pulse"
              title="Stop voice reading"
              aria-label="Stop reading audio"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          )}

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              id="language-dropdown-toggle"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 p-2 rounded-lg text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] border border-transparent hover:border-[#E5E2DD] dark:hover:border-[#383632] transition-colors"
              aria-label="Change regional language"
              aria-expanded={isLangOpen}
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium uppercase hidden md:inline">
                {language}
              </span>
            </button>

            {isLangOpen && (
              <div
                id="language-dropdown-menu"
                className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A5A29D] border-b border-[#F5F2ED] dark:border-[#383632]">
                  Regional Languages
                </div>
                {(Object.keys(languageNames) as LanguageCode[]).map((code) => (
                  <button
                    key={code}
                    id={`lang-select-${code}`}
                    onClick={() => {
                      setLanguage(code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] transition-colors ${
                      language === code
                        ? 'font-bold text-[#5A5A40] dark:text-[#C8C7B8] bg-[#F5F2ED] dark:bg-[#2C2A26]'
                        : 'text-[#1A1A1A] dark:text-[#F5F3EF]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{languageNames[code].flag}</span>
                      <span>{languageNames[code].native}</span>
                    </span>
                    <span className="text-[10px] text-[#A5A29D]">
                      {languageNames[code].label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-[#5A5A40]" />
            )}
          </button>

          {/* Mobile Frame Simulation Toggle */}
          <button
            id="mobile-view-toggle"
            onClick={() => setIsMobilePreview(!isMobilePreview)}
            className={`p-2 rounded-lg transition-colors hidden md:flex items-center justify-center ${
              isMobilePreview
                ? 'bg-[#5A5A40] text-white'
                : 'text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26]'
            }`}
            title="Toggle Mobile Simulator Layout"
            aria-label="Toggle Mobile Frame View"
          >
            {isMobilePreview ? (
              <Smartphone className="w-4 h-4" />
            ) : (
              <Monitor className="w-4 h-4" />
            )}
          </button>

          {/* Notifications Bell */}
          <button
            id="notification-bell-btn"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            id="cart-button"
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-semibold shadow-xs transition-all"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{t.cart}</span>
            {cartCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-orange-600 text-white text-[10px] font-bold rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
