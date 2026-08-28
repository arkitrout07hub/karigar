import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Review, MakingProcessStep } from '../types';
import {
  X,
  Star,
  ShieldCheck,
  ShoppingBag,
  MessageSquare,
  Volume2,
  VolumeX,
  Share2,
  MapPin,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  Send,
  Hammer,
  History,
  Languages,
  Copy,
  Check,
  FileText,
  Coins,
  ChevronRight,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const {
    addToCart,
    artisans,
    setSelectedArtisan,
    startConversationWithArtisan,
    language,
    t,
    speakText,
    isSpeaking,
    stopSpeaking,
    setIsCheckoutOpen,
  } = useApp();

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [activeModalTab, setActiveModalTab] = useState<'story' | 'cultural' | 'process' | 'multilingual' | 'pricing'>('story');
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewName, setNewReviewName] = useState('');
  const [copiedTextKey, setCopiedTextKey] = useState<string | null>(null);
  const [localReviews, setLocalReviews] = useState<Review[]>(product.reviews || []);

  const artisan =
    artisans.find((a) => a.id === product.artisanId) || artisans[0];

  const displayTitle =
    product.regionalTitles?.[language] || product.multilingualTitles?.[language] || product.title;
  const displayDescription =
    product.regionalDescriptions?.[language] || product.artisanStory;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextKey(key);
    setTimeout(() => setCopiedTextKey(null), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      buyerName: newReviewName.trim() || 'Conscious Buyer',
      rating: newReviewRating,
      comment: newReviewComment,
      date: 'Just now',
      verifiedPurchase: true,
      craftsmanshipScore: newReviewRating,
      authenticityScore: 5,
    };

    setLocalReviews([newRev, ...localReviews]);
    setNewReviewComment('');
    setShowReviewForm(false);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    setIsCheckoutOpen(true);
  };

  return (
    <div
      id="product-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div className="bg-[#FDFCFB] dark:bg-[#22211E] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#E5E2DD] dark:border-[#383632] shadow-xl relative">
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-[#1A1A1A]/70 hover:bg-[#1A1A1A] text-white backdrop-blur-xs transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left Column: Image Gallery & Artisan Spotlight */}
          <div className="md:col-span-5 bg-[#F5F2ED] dark:bg-[#2C2A26] p-4 sm:p-5 flex flex-col justify-between space-y-3.5 border-b md:border-b-0 md:border-r border-[#E5E2DD] dark:border-[#383632]">
            <div>
              {/* Primary Image View */}
              <div className="w-full aspect-square rounded-xl overflow-hidden shadow-2xs bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632]">
                <img
                  src={product.images[selectedImgIndex] || product.primaryImage}
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-2.5">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImgIndex(i)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border transition-all ${
                        selectedImgIndex === i
                          ? 'border-[#5A5A40] shadow-2xs'
                          : 'border-[#E5E2DD] dark:border-[#383632] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Artisan Profile Card */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={artisan.avatar}
                    alt={artisan.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#5A5A40]"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF]">
                      {artisan.name}
                    </h4>
                    <p className="text-[10px] text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#5A5A40]" />
                      {artisan.village}, {artisan.state}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedArtisan(artisan);
                    onClose();
                  }}
                  className="text-xs font-semibold text-[#5A5A40] dark:text-[#C8C7B8] hover:underline"
                >
                  View Profile
                </button>
              </div>

              <p className="text-[11px] text-[#5A5A40] dark:text-[#C8C7B8] line-clamp-2 italic">
                "{artisan.bio}"
              </p>

              <button
                id="modal-chat-artisan-btn"
                onClick={() => {
                  onClose();
                  startConversationWithArtisan(artisan.id, product.id);
                }}
                className="w-full py-1.5 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] hover:bg-[#E5E2DD] dark:hover:bg-[#383632] text-[#5A5A40] dark:text-[#C8C7B8] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E5E2DD] dark:border-[#383632]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#5A5A40]" />
                {t.chatWithArtisan}
              </button>
            </div>
          </div>

          {/* Right Column: Narrative, Specifications & Pricing Breakdown */}
          <div className="md:col-span-7 p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632] uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 inline mr-1 text-[#5A5A40]" />
                  {product.craftBadge}
                </span>

                <div className="flex items-center gap-1 text-xs font-semibold text-[#5A5A40] dark:text-[#C8C7B8]">
                  <Star className="w-3.5 h-3.5 fill-[#5A5A40] text-[#5A5A40]" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-[#A5A29D]">({localReviews.length} reviews)</span>
                </div>
              </div>

              {/* Title & Category */}
              <div>
                <h1 className="text-lg sm:text-xl font-serif italic font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                  {displayTitle}
                </h1>
                <p className="text-xs text-[#A5A29D] mt-0.5">
                  Category: <span className="font-semibold text-[#1A1A1A] dark:text-[#F5F3EF]">{product.category}</span> • Origin: <span className="font-semibold text-[#1A1A1A] dark:text-[#F5F3EF]">{product.artisanRegion}</span>
                </p>
              </div>

              {/* Product Tabs (Story, Cultural, Process, Multilingual, Pricing) */}
              <div className="flex items-center gap-1 bg-[#F5F2ED] dark:bg-[#2C2A26] p-1 rounded-xl text-xs font-semibold border border-[#E5E2DD] dark:border-[#383632] overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveModalTab('story')}
                  className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                    activeModalTab === 'story'
                      ? 'bg-[#5A5A40] text-white shadow-2xs'
                      : 'text-[#5A5A40] dark:text-[#C8C7B8]'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveModalTab('cultural')}
                  className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                    activeModalTab === 'cultural'
                      ? 'bg-[#5A5A40] text-white shadow-2xs'
                      : 'text-[#5A5A40] dark:text-[#C8C7B8]'
                  }`}
                >
                  Cultural Significance
                </button>
                <button
                  onClick={() => setActiveModalTab('process')}
                  className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                    activeModalTab === 'process'
                      ? 'bg-[#5A5A40] text-white shadow-2xs'
                      : 'text-[#5A5A40] dark:text-[#C8C7B8]'
                  }`}
                >
                  Making Process
                </button>
                <button
                  onClick={() => setActiveModalTab('multilingual')}
                  className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                    activeModalTab === 'multilingual'
                      ? 'bg-[#5A5A40] text-white shadow-2xs'
                      : 'text-[#5A5A40] dark:text-[#C8C7B8]'
                  }`}
                >
                  Languages & Share
                </button>
                <button
                  onClick={() => setActiveModalTab('pricing')}
                  className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                    activeModalTab === 'pricing'
                      ? 'bg-[#5A5A40] text-white shadow-2xs'
                      : 'text-[#5A5A40] dark:text-[#C8C7B8]'
                  }`}
                >
                  Fair Pricing
                </button>
              </div>

              {/* TAB CONTENT: STORY & DESCRIPTION */}
              {activeModalTab === 'story' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="p-3 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
                        {t.artisanStory}
                      </span>

                      <button
                        onClick={() => {
                          if (isSpeaking) stopSpeaking();
                          else speakText(displayDescription);
                        }}
                        className="text-[11px] font-semibold text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1 hover:underline"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3 h-3" /> Stop Voice
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" /> Listen Audio
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-[#5A5A40] dark:text-[#C8C7B8] leading-relaxed">
                      {displayDescription}
                    </p>
                  </div>

                  {/* Craft Specifications */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632]">
                      <span className="text-[#A5A29D] block text-[9px] uppercase font-semibold">
                        Technique
                      </span>
                      <span className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF] block mt-0.5">
                        {product.technique}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632]">
                      <span className="text-[#A5A29D] block text-[9px] uppercase font-semibold">
                        Dimensions & Materials
                      </span>
                      <span className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF] block mt-0.5">
                        {product.dimensions}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: CULTURAL SIGNIFICANCE */}
              {activeModalTab === 'cultural' && (
                <div className="p-3.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-[#5A5A40]" />
                      Ancestral Lineage & Folklore
                    </span>
                    <button
                      onClick={() => speakText(product.culturalSignificance || product.artisanStory)}
                      className="text-[10px] text-[#5A5A40] dark:text-[#C8C7B8] font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Volume2 className="w-3 h-3" /> Listen
                    </button>
                  </div>
                  <p className="text-xs text-[#5A5A40] dark:text-[#C8C7B8] leading-relaxed whitespace-pre-line">
                    {product.culturalSignificance || `Crafted following traditional wisdom in ${product.artisanRegion}, this piece represents authentic regional folk expression preserving cultural identity and sustainable artisanal vocations.`}
                  </p>
                  <div className="pt-1 flex flex-wrap gap-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-[#22211E] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632]">
                      🏛️ Geographical Origin: {product.artisanRegion}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-[#22211E] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632]">
                      🌿 100% Biodegradable & Natural
                    </span>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: MAKING PROCESS */}
              {activeModalTab === 'process' && (
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 animate-in fade-in duration-150">
                  {product.makingProcess && product.makingProcess.length > 0 ? (
                    product.makingProcess.map((step: MakingProcessStep, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] flex gap-2.5 items-start text-xs"
                      >
                        <div className="w-5 h-5 rounded-md bg-[#5A5A40] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {step.stepNumber || idx + 1}
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                              {step.stageName || step.title}
                            </h5>
                            {step.duration && (
                              <span className="text-[10px] text-[#A5A29D] font-mono">
                                {step.duration}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#5A5A40] dark:text-[#C8C7B8] leading-tight">
                            {step.description}
                          </p>
                          {step.toolsAndMaterials && (
                            <p className="text-[9px] text-[#A5A29D] pt-0.5">
                              Tools: {step.toolsAndMaterials}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] text-xs text-[#5A5A40] dark:text-[#C8C7B8] space-y-1">
                      <p className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">Ancestral Handcrafting Method</p>
                      <p>Formed entirely by hand using traditional tools passed down through generations without industrial mechanization.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: MULTILINGUAL TITLES & SOCIAL SHARING */}
              {activeModalTab === 'multilingual' && (
                <div className="space-y-2 animate-in fade-in duration-150">
                  <div className="p-2.5 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-1.5">
                    <span className="text-[10px] font-bold text-[#A5A29D] uppercase block">
                      Titles in Multiple Languages:
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      {['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'es'].map((code) => {
                        const tText =
                          product.multilingualTitles?.[code] ||
                          product.regionalTitles?.[code] ||
                          (code === 'en' ? product.title : null);
                        if (!tText) return null;
                        return (
                          <div key={code} className="p-1 rounded bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] flex items-center justify-between">
                            <span className="text-[9px] uppercase font-bold text-[#A5A29D] mr-1">{code}:</span>
                            <span className="truncate text-[#1A1A1A] dark:text-[#F5F3EF] flex-1">{tText}</span>
                            <button onClick={() => handleCopy(tText, `title-${code}`)} className="p-0.5 hover:text-[#5A5A40]">
                              {copiedTextKey === `title-${code}` ? <Check className="w-2.5 h-2.5 text-green-600" /> : <Copy className="w-2.5 h-2.5" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Social Share Buttons */}
                  {product.socialCaptions && (
                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] space-y-1 text-xs">
                      <span className="text-[10px] font-bold text-[#A5A29D] uppercase block">
                        Share Artisan Story on Social Media:
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleCopy(product.socialCaptions?.instagram || '', 'insta-share')}
                          className="flex-1 py-1 px-2 rounded bg-[#F5F2ED] dark:bg-[#2C2A26] hover:bg-[#5A5A40] hover:text-white text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Instagram className="w-3 h-3" /> Instagram
                        </button>
                        <button
                          onClick={() => handleCopy(product.socialCaptions?.whatsapp || '', 'wa-share')}
                          className="flex-1 py-1 px-2 rounded bg-[#F5F2ED] dark:bg-[#2C2A26] hover:bg-[#5A5A40] hover:text-white text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" /> WhatsApp
                        </button>
                        <button
                          onClick={() => handleCopy(product.socialCaptions?.twitter || '', 'tw-share')}
                          className="flex-1 py-1 px-2 rounded bg-[#F5F2ED] dark:bg-[#2C2A26] hover:bg-[#5A5A40] hover:text-white text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Twitter className="w-3 h-3" /> Twitter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: FAIR PRICING BREAKDOWN */}
              {activeModalTab === 'pricing' && (
                <div className="p-3 rounded-xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] space-y-2 shadow-2xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                    <span>{t.fairPriceBreakdown}</span>
                    <span className="text-[10px] text-[#5A5A40] dark:text-[#C8C7B8] font-semibold">
                      100% Escrow Protected
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                    <div className="p-1.5 rounded bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]">
                      <span className="text-[#A5A29D] block text-[9px]">Materials</span>
                      <span className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                        ₹{product.pricingBreakdown.materialCost}
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632]">
                      <span className="text-[9px] block">Labor Wage</span>
                      <span className="font-bold">
                        ₹{product.pricingBreakdown.laborCost}
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632]">
                      <span className="text-[9px] block">Artisan Margin</span>
                      <span className="font-bold">
                        ₹{product.pricingBreakdown.artisanFairMargin}
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]">
                      <span className="text-[#A5A29D] block text-[9px]">Eco Box</span>
                      <span className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                        ₹{product.pricingBreakdown.packagingShipping}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#5A5A40] dark:text-[#C8C7B8] italic pt-1">
                    {product.pricingBreakdown.explanation || "100% direct remuneration guaranteeing living wage floor."}
                  </p>
                </div>
              )}

              {/* Reviews Preview */}
              <div className="space-y-1.5 pt-2 border-t border-[#E5E2DD] dark:border-[#383632]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                    Verified Buyer Reviews ({localReviews.length})
                  </span>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-xs font-semibold text-[#5A5A40] dark:text-[#C8C7B8] hover:underline"
                  >
                    + Write a Review
                  </button>
                </div>

                {showReviewForm && (
                  <form
                    onSubmit={handleAddReview}
                    className="p-2.5 bg-white dark:bg-[#22211E] rounded-xl border border-[#E5E2DD] dark:border-[#383632] space-y-1.5 text-xs shadow-2xs"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        className="flex-1 px-2 py-1 rounded-lg border border-[#E5E2DD] dark:border-[#383632] bg-[#FDFCFB] dark:bg-[#2C2A26]"
                      />
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="px-2 py-1 rounded-lg border border-[#E5E2DD] dark:border-[#383632] bg-[#FDFCFB] dark:bg-[#2C2A26]"
                      >
                        <option value={5}>5 Stars ★★★★★</option>
                        <option value={4}>4 Stars ★★★★</option>
                        <option value={3}>3 Stars ★★★</option>
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Share your appreciation of the craft..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full px-2 py-1 rounded-lg border border-[#E5E2DD] dark:border-[#383632] bg-[#FDFCFB] dark:bg-[#2C2A26]"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-[#5A5A40] hover:bg-[#484833] text-white rounded-lg font-semibold text-xs flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" /> Submit Review
                    </button>
                  </form>
                )}

                <div className="max-h-20 overflow-y-auto space-y-1.5 pr-1 scrollbar-none">
                  {localReviews.length === 0 ? (
                    <p className="text-[10px] text-[#A5A29D] italic">
                      Be the first to review this heritage craft piece!
                    </p>
                  ) : (
                    localReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-2 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-xs space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px] text-[#1A1A1A] dark:text-[#F5F3EF]">
                            {rev.buyerName}
                          </span>
                          <span className="text-[#5A5A40] dark:text-[#C8C7B8] font-bold text-[10px]">
                            {'★'.repeat(rev.rating)}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#5A5A40] dark:text-[#C8C7B8]">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions: Price, Quantity, Add to Cart & Buy Now */}
            <div className="pt-3 border-t border-[#E5E2DD] dark:border-[#383632] space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#A5A29D] block font-semibold">
                    Direct Artisan Price
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold font-sans text-[#1A1A1A] dark:text-[#F5F3EF]">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#A5A29D] line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity modifier */}
                <div className="flex items-center border border-[#E5E2DD] dark:border-[#383632] rounded-lg overflow-hidden bg-white dark:bg-[#22211E]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-[#1A1A1A] dark:text-[#F5F3EF] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="px-2 py-1 text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-2.5 py-1 text-[#1A1A1A] dark:text-[#F5F3EF] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={() => {
                    addToCart(product, quantity);
                    onClose();
                  }}
                  className="py-2.5 rounded-xl border border-[#5A5A40] text-[#5A5A40] dark:text-[#C8C7B8] dark:border-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {t.addToCart}
                </button>

                <button
                  id="modal-buy-now-btn"
                  onClick={handleBuyNow}
                  className="py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                >
                  {t.buyNow}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
