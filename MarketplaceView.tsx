import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  ShoppingBag,
  Star,
  ShieldCheck,
  MessageCircle,
  Eye,
  CheckCircle2,
  Filter,
  Volume2,
  Award,
  Plus,
} from 'lucide-react';

const CRAFT_CATEGORIES = [
  "All Crafts",
  "Terracotta & Pottery",
  "Dokra Metal Casting",
  "Madhubani & Folk Painting",
  "Handloom & Textiles",
  "Woodcarving & Crafts",
  "Tribal Jewelry",
  "Bamboo & Cane Work",
];

export const MarketplaceView: React.FC = () => {
  const {
    products,
    addToCart,
    setSelectedProduct,
    setSelectedArtisan,
    artisans,
    startConversationWithArtisan,
    setIsRegistrationModalOpen,
    setSelectedVerificationArtisan,
    t,
    language,
    speakText,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("All Crafts");
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === "All Crafts" || p.category === selectedCategory;
        const localizedTitle =
          p.regionalTitles?.[language] || p.title;
        const matchesSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          localizedTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.technique.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.artisanRegion.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.materials.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesVerified = !onlyVerified || p.isVerified;

        return matchesCategory && matchesSearch && matchesVerified;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, searchQuery, selectedCategory, sortBy, onlyVerified, language]);

  return (
    <div id="marketplace-container" className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 pt-4">
      {/* High Density Hero & Market Pulse Bar */}
      <div className="mb-5 p-5 rounded-2xl bg-white dark:bg-[#22211E] text-[#1A1A1A] dark:text-[#F5F3EF] border border-[#E5E2DD] dark:border-[#383632] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#A5A29D] uppercase tracking-widest">
              Direct Fair Trade Gateway
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632]">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> GI & Heritage Certified
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif italic font-bold text-[#2D2D2D] dark:text-[#F5F3EF]">
            Sacred Heritage Crafts. Zero Middlemen.
          </h1>
          <p className="text-xs text-[#5A5A40] dark:text-[#C8C7B8] leading-relaxed">
            Every purchase guarantees verified living wages directly to rural masters, preserving lost-wax casting, terracotta firing, and pit-loom weaving.
          </p>
        </div>

        {/* High-density Market Pulse widget */}
        <div className="w-full md:w-auto p-3 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] flex items-center gap-4 text-xs shrink-0">
          <div>
            <span className="text-[10px] font-bold text-[#A5A29D] uppercase tracking-widest block">Market Demand</span>
            <span className="font-bold text-[#5A5A40] dark:text-[#C8C7B8]">Terracotta & Dokra</span>
          </div>
          <div className="h-6 w-px bg-[#E5E2DD] dark:bg-[#383632]" />
          <div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">↑ 14.8% Direct Export</span>
            <span className="text-[10px] text-[#A5A29D]">100% Artisan Escrow</span>
          </div>
        </div>
      </div>

      {/* Verified Master Craftsmen & GI-Tag Verification Registry Ribbon */}
      <div className="mb-5 p-4 rounded-2xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F5F3EF]">
              Certified Master Craftsmen & Heritage Clusters
            </h3>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Pehchan & GI Verified
            </span>
          </div>

          <button
            type="button"
            id="btn-market-register-artisan"
            onClick={() => setIsRegistrationModalOpen(true)}
            className="text-xs font-bold text-[#5A5A40] dark:text-[#C8C7B8] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Are you a craftsperson? Register for Verification</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {artisans.map((artisan) => (
            <div
              key={artisan.id}
              className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] flex items-center gap-3 hover:border-[#5A5A40] transition-colors"
            >
              <img
                src={artisan.avatar}
                alt={artisan.name}
                className="w-11 h-11 rounded-xl object-cover border border-[#5A5A40]/30 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h4 className="text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF] truncate">
                    {artisan.name}
                  </h4>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>
                <p className="text-[10px] text-[#A5A29D] truncate">
                  {artisan.craftSpecialty}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedVerificationArtisan(artisan)}
                    className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                    title="Audit Digital Certificate"
                  >
                    <Award className="w-3 h-3" />
                    Audit Cert
                  </button>
                  <span className="text-[9px] text-[#A5A29D]">•</span>
                  <button
                    type="button"
                    onClick={() => setSelectedArtisan(artisan)}
                    className="text-[10px] font-semibold text-[#5A5A40] dark:text-[#C8C7B8] hover:underline"
                  >
                    View Studio
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Discovery Controls */}
      <div className="space-y-3 mb-5">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5A29D]" />
            <input
              id="marketplace-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] text-[#1A1A1A] dark:text-[#F5F3EF] text-xs shadow-2xs focus:ring-1 focus:ring-[#5A5A40] focus:outline-none placeholder:text-[#A5A29D]"
            />
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex items-center gap-2">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] text-xs font-medium text-[#1A1A1A] dark:text-[#F5F3EF] focus:ring-1 focus:ring-[#5A5A40] outline-none"
            >
              <option value="featured">Featured Artisans</option>
              <option value="rating">Highest Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>

            <button
              id="toggle-verified-filter"
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                onlyVerified
                  ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                  : 'bg-white dark:bg-[#22211E] border-[#E5E2DD] dark:border-[#383632] text-[#5A5A40] dark:text-[#C8C7B8]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GI Tag Only</span>
            </button>
          </div>
        </div>

        {/* Category Scrollable Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CRAFT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#5A5A40] text-white shadow-2xs'
                  : 'bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Craft Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] p-8">
          <Sparkles className="w-10 h-10 text-[#A5A29D] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
            No artisan creations found
          </h3>
          <p className="text-xs text-[#A5A29D] mt-1">
            Try adjusting your search terms or category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const displayTitle =
              product.regionalTitles?.[language] || product.title;

            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className="bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col group"
              >
                {/* Image & Badges */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#F5F2ED] dark:bg-[#2C2A26]">
                  <img
                    src={product.primaryImage}
                    alt={displayTitle}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* GI / Heritage Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-md text-[#5A5A40] dark:text-[#C8C7B8] text-[9px] font-bold px-2 py-0.5 rounded border border-[#E5E2DD] dark:border-[#383632] flex items-center gap-1 uppercase tracking-wider shadow-2xs">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {product.craftBadge}
                  </div>

                  {/* Stock Tag */}
                  <div className="absolute top-2.5 right-2.5 bg-white/95 dark:bg-[#1A1A1A]/95 text-[9px] font-bold px-2 py-0.5 rounded border border-[#E5E2DD] dark:border-[#383632] shadow-2xs">
                    {product.stock <= 3 ? (
                      <span className="text-orange-600 font-bold uppercase tracking-wider">
                        Low Stock ({product.stock})
                      </span>
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                        Active ({product.stock})
                      </span>
                    )}
                  </div>

                  {/* Quick Detail View Overlay button */}
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="absolute inset-0 bg-[#1A1A1A]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    aria-label={`View ${displayTitle}`}
                  >
                    <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#22211E] text-[#1A1A1A] dark:text-[#F5F3EF] text-xs font-bold shadow-md flex items-center gap-1.5 border border-[#E5E2DD] dark:border-[#383632]">
                      <Eye className="w-3.5 h-3.5 text-[#5A5A40]" /> View Story & Craft
                    </span>
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    {/* Artisan attribution row */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <button
                        onClick={() => {
                          const artisan =
                            artisans.find((a) => a.id === product.artisanId) ||
                            artisans[0];
                          setSelectedArtisan(artisan);
                        }}
                        className="flex items-center gap-1.5 text-left group/artisan"
                      >
                        <img
                          src={product.artisanAvatar}
                          alt={product.artisanName}
                          className="w-5 h-5 rounded-full object-cover border border-[#5A5A40]"
                        />
                        <span className="text-xs font-medium text-[#5A5A40] dark:text-[#C8C7B8] group-hover/artisan:underline truncate">
                          {product.artisanName}
                        </span>
                      </button>

                      <span className="text-[10px] text-[#A5A29D] uppercase tracking-wider truncate">
                        {product.artisanRegion}
                      </span>
                    </div>

                    {/* Product Title */}
                    <h3
                      onClick={() => setSelectedProduct(product)}
                      className="font-serif italic font-bold text-sm text-[#1A1A1A] dark:text-[#F5F3EF] line-clamp-1 cursor-pointer hover:text-[#5A5A40] dark:hover:text-[#C8C7B8] transition-colors"
                    >
                      {displayTitle}
                    </h3>

                    {/* Technique */}
                    <p className="text-[11px] text-[#A5A29D] mt-0.5 line-clamp-1">
                      {product.technique}
                    </p>
                  </div>

                  {/* Ratings & Price Transparency */}
                  <div className="pt-2 border-t border-[#F5F2ED] dark:border-[#383632] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-amber-600 font-semibold text-[11px]">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{product.rating.toFixed(1)}</span>
                        <span className="text-[#A5A29D] font-normal">
                          ({product.reviewCount || 12})
                        </span>
                      </div>

                      <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-[#F5F2ED] dark:bg-[#2C2A26] px-2 py-0.5 rounded border border-[#E5E2DD] dark:border-[#383632]">
                        75% Artisan Living Wage
                      </div>
                    </div>

                    {/* Price and Add-To-Cart Action */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-bold font-sans text-[#1A1A1A] dark:text-[#F5F3EF]">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[11px] text-[#A5A29D] line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          id={`chat-artisan-${product.id}`}
                          onClick={() => startConversationWithArtisan(product.artisanId, product.id)}
                          className="p-1.5 rounded-lg bg-[#F5F2ED] hover:bg-[#E5E2DD] dark:bg-[#2C2A26] dark:hover:bg-[#383632] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632] transition-colors"
                          title="Message artisan directly"
                          aria-label="Chat with Artisan"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>

                        <button
                          id={`btn-add-cart-${product.id}`}
                          onClick={() => addToCart(product, 1)}
                          className="px-3 py-1.5 rounded-lg bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{t.addToCart}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
