import React from 'react';
import { useApp } from '../context/AppContext';
import { languageNames } from '../data/translations';
import { LanguageCode } from '../types';
import {
  X,
  Sliders,
  Moon,
  Sun,
  Globe,
  Volume2,
  Bell,
  ShieldCheck,
  UserCheck,
  Smartphone,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    role,
    setRole,
    isMobilePreview,
    setIsMobilePreview,
    t,
  } = useApp();

  if (!isOpen) return null;

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div className="bg-[#FDFCFB] dark:bg-[#22211E] rounded-2xl max-w-md w-full border border-[#E5E2DD] dark:border-[#383632] shadow-xl p-5 relative space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E2DD] dark:border-[#383632] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632]">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="font-serif italic font-bold text-base text-[#1A1A1A] dark:text-[#F5F3EF]">
              {t.settings}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] text-[#A5A29D] hover:text-[#1A1A1A] dark:hover:text-[#F5F3EF]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Theme Setting */}
        <div className="p-3 rounded-xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#F5F2ED] dark:bg-[#22211E] text-[#5A5A40] dark:text-[#C8C7B8]">
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF]">
                {t.darkMode}
              </h3>
              <p className="text-[10px] text-[#A5A29D]">
                Optimized for low-light pottery workshops & night reading
              </p>
            </div>
          </div>

          <button
            id="settings-theme-toggle"
            onClick={toggleTheme}
            className={`w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
              theme === 'dark' ? 'bg-[#5A5A40]' : 'bg-[#E5E2DD]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-2xs transform transition-transform ${
                theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 2. Platform Mode Switcher */}
        <div className="p-3 rounded-xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#F5F2ED] dark:bg-[#22211E] text-[#5A5A40] dark:text-[#C8C7B8]">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF]">
                Platform Account Role
              </h3>
              <p className="text-[10px] text-[#A5A29D]">
                Currently: <span className="font-bold text-[#5A5A40] dark:text-[#C8C7B8]">{role === 'buyer' ? 'Conscious Buyer' : 'Artisan Vendor'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setRole(role === 'buyer' ? 'artisan' : 'buyer')}
            className="px-2.5 py-1.5 rounded-lg bg-[#F5F2ED] dark:bg-[#22211E] hover:bg-[#E5E2DD] dark:hover:bg-[#383632] border border-[#E5E2DD] dark:border-[#383632] text-[#1A1A1A] dark:text-[#F5F3EF] text-xs font-semibold"
          >
            Switch to {role === 'buyer' ? 'Artisan' : 'Buyer'}
          </button>
        </div>

        {/* 3. Regional Language Selection */}
        <div className="p-3 rounded-xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#5A5A40]" />
            <h3 className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF]">
              {t.selectLanguage}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            {(Object.keys(languageNames) as LanguageCode[]).map((code) => (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`p-2 rounded-lg text-left text-xs border flex items-center justify-between transition-all ${
                  language === code
                    ? 'border-[#5A5A40] bg-[#5A5A40]/10 text-[#5A5A40] dark:text-[#C8C7B8] font-bold'
                    : 'border-[#E5E2DD] dark:border-[#383632] text-[#1A1A1A] dark:text-[#F5F3EF]'
                }`}
              >
                <span>{languageNames[code].native}</span>
                <span className="text-[10px] text-[#A5A29D]">{languageNames[code].flag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Mobile Simulator Layout Toggle */}
        <div className="p-3 rounded-xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#F5F2ED] dark:bg-[#22211E] text-[#5A5A40] dark:text-[#C8C7B8]">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF]">
                Mobile Device Simulator Frame
              </h3>
              <p className="text-[10px] text-[#A5A29D]">
                Renders a mobile phone chassis for realistic preview
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMobilePreview(!isMobilePreview)}
            className={`w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
              isMobilePreview ? 'bg-[#5A5A40]' : 'bg-[#E5E2DD]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-2xs transform transition-transform ${
                isMobilePreview ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
