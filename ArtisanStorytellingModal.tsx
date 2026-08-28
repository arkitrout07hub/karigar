import React from 'react';
import { useApp } from '../context/AppContext';
import { Artisan } from '../types';
import {
  X,
  MapPin,
  Award,
  Users,
  ShieldCheck,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

interface ArtisanStorytellingModalProps {
  artisan: Artisan;
  onClose: () => void;
}

export const ArtisanStorytellingModal: React.FC<ArtisanStorytellingModalProps> = ({
  artisan,
  onClose,
}) => {
  const { startConversationWithArtisan, speakText, isSpeaking, stopSpeaking, setSelectedVerificationArtisan, t } = useApp();

  return (
    <div
      id="artisan-story-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div className="bg-[#FDFCFB] dark:bg-[#22211E] rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-[#E5E2DD] dark:border-[#383632] shadow-xl relative p-4 sm:p-6 space-y-4">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] text-[#A5A29D] hover:text-[#1A1A1A] dark:hover:text-[#F5F3EF] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <img
            src={artisan.avatar}
            alt={artisan.name}
            className="w-18 h-18 rounded-2xl object-cover border-2 border-[#5A5A40] shadow-2xs"
          />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632]">
              <ShieldCheck className="w-3 h-3" /> Fair Trade Master Guild
            </div>
            <h2 className="text-xl font-serif italic font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
              {artisan.name}
            </h2>
            <p className="text-xs text-[#A5A29D] flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#5A5A40]" />
              {artisan.village}, {artisan.state} • {artisan.experienceYears} Years of Dedication
            </p>
          </div>
        </div>

        {/* Heritage Story Narrative */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
              Ancestral Craft Lineage & Heritage
            </h3>

            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                else speakText(artisan.story);
              }}
              className="text-xs font-semibold text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1 hover:underline cursor-pointer"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" /> Stop Voice
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" /> Listen Voice Story
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-[#5A5A40] dark:text-[#C8C7B8] leading-relaxed italic">
            "{artisan.story}"
          </p>
        </div>

        {/* Guild Accomplishments & Social Impact */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-1 shadow-2xs">
            <span className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#5A5A40]" /> Master Credentials
            </span>
            <p className="text-[10px] text-[#A5A29D]">
              National Handicrafts Board Certified • Geographical Indication (GI) custodian.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-1 shadow-2xs">
            <span className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#5A5A40]" /> Community Empowerment
            </span>
            <p className="text-[10px] text-[#A5A29D]">
              Mentors 18 rural women artisans in sustainable zero-waste pit firing.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            id="modal-view-artisan-cert-btn"
            onClick={() => {
              onClose();
              setSelectedVerificationArtisan(artisan);
            }}
            className="py-2.5 px-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Audit Certificate</span>
          </button>

          <button
            onClick={() => {
              onClose();
              startConversationWithArtisan(artisan.id);
            }}
            className="flex-1 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            Direct Chat with {artisan.name.split(' ')[0]}
          </button>
        </div>
      </div>
    </div>
  );
};
