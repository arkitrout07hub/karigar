import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, LanguageCode, MakingProcessStep, SocialMediaCaptions } from '../types';
import { CameraCaptureModal } from './CameraCaptureModal';
import {
  Sparkles,
  Camera,
  Upload,
  Mic,
  MicOff,
  Sliders,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Layers,
  Globe,
  Tag,
  Clock,
  Coins,
  ShieldCheck,
  ChevronRight,
  Sun,
  Contrast,
  Palette,
  Volume2,
  Copy,
  Check,
  Share2,
  BookOpen,
  Hammer,
  History,
  FileText,
  MessageCircle,
  Instagram,
  Twitter,
  Facebook,
  Languages,
  ArrowRight,
  Zap,
} from 'lucide-react';

const SAMPLE_CRAFT_PRESETS = [
  {
    name: "Hand-Thrown Terracotta Urn",
    category: "Terracotta & Pottery",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80",
    materials: "River alluvial clay, natural red oxide slip",
    sampleVoice: "यह पंचमुड़ा गांव की 100% शुद्ध मिट्टी से बनी पारंपरिक टेराकोटा कलाकृति है। इसे बनाने में 14 घंटे लगे हैं।",
    region: "Bishnupur, West Bengal",
  },
  {
    name: "Dokra Lost-Wax Figurine",
    category: "Dokra Metal Casting",
    image: "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=1200&q=80",
    materials: "Recycled brass, beeswax matrix, clay mold",
    sampleVoice: "Ancient Bastar tribal Dokra metal casting. 4000 year old lost wax technique, takes 3 days of mold curing.",
    region: "Bastar, Chhattisgarh",
  },
  {
    name: "Madhubani Tree of Life",
    category: "Madhubani & Folk Painting",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1200&q=80",
    materials: "Handmade cotton sheet, turmeric, soot, indigo",
    sampleVoice: "हाथ से तैयार प्राकृतिक रंगों द्वारा चित्रित मिथिला मधुबनी पेंटिंग। प्रकृति और पक्षियों का संतुलन।",
    region: "Mithila, Bihar",
  },
  {
    name: "Pochampally Ikat Stole",
    category: "Handloom & Textiles",
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80",
    materials: "Pure mulberry raw silk, organic madder dyes",
    sampleVoice: "Traditional pit loom woven double ikat silk stole with geometric chevron borders.",
    region: "Pochampally, Telangana",
  },
  {
    name: "Jaipur Quartz Blue Pottery",
    category: "Terracotta & Pottery",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80",
    materials: "Ground quartz stone, glass frit, copper oxide glaze",
    sampleVoice: "Traditional clay-free Jaipur blue pottery vase hand-painted with turquoise and cobalt floral motifs.",
    region: "Jaipur, Rajasthan",
  },
  {
    name: "Saharanpur Rosewood Box",
    category: "Woodcarving & Crafts",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
    materials: "Seasoned Sheesham wood, brass wire inlay, beeswax polish",
    sampleVoice: "Hand-carved rosewood keepsake box with floral jali openwork latticework and brass tarkashi inlay.",
    region: "Saharanpur, Uttar Pradesh",
  },
  {
    name: "Bastar Tribal Elephant Trio",
    category: "Dokra Metal Casting",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80",
    materials: "Recycled brass and bronze, beeswax spirals, alluvial soil",
    sampleVoice: "Hand-coiled brass wire lost-wax casting crafted by Bastar tribal women collective.",
    region: "Kondagaon, Chhattisgarh",
  },
  {
    name: "Bengal Pottery Workshop Craft",
    category: "Terracotta & Pottery",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80",
    materials: "Alluvial riverbed clay, organic mineral slips",
    sampleVoice: "Live wood-fired earthen terracotta pottery shaped on traditional wooden wheel.",
    region: "Bankura, West Bengal",
  },
];

const STUDIO_BACKDROPS = [
  { id: 'original', label: 'Original', color: '#f5f5f4', icon: '📷' },
  { id: 'studio_white', label: 'Studio White', color: '#ffffff', icon: '⚪' },
  { id: 'warm_clay', label: 'Warm Terracotta', color: '#f4ede4', icon: '🏺' },
  { id: 'gallery_wood', label: 'Rustic Workshop', color: '#ece4db', icon: '🪵' },
  { id: 'minimal_slate', label: 'Minimal Slate', color: '#e7e5e4', icon: '🪨' },
];

export const SmartCatalogStudio: React.FC = () => {
  const { currentArtisan, addProduct, language, t, speakText, setActiveTab } = useApp();

  // Step state
  const [activeStep, setActiveStep] = useState<'upload' | 'enhance' | 'voice_details' | 'ai_generate' | 'preview'>('upload');

  // Input states
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_CRAFT_PRESETS[0].image);
  const [category, setCategory] = useState<string>("Terracotta & Pottery");
  const [region, setRegion] = useState<string>(currentArtisan.village);
  const [materials, setMaterials] = useState<string>("River clay, natural mineral slip");
  const [estimatedHours, setEstimatedHours] = useState<number>(12);
  const [stockCount, setStockCount] = useState<number>(8);
  const [voiceNotes, setVoiceNotes] = useState<string>(SAMPLE_CRAFT_PRESETS[0].sampleVoice);

  // Image enhancement controls
  const [brightness, setBrightness] = useState<number>(105);
  const [contrast, setContrast] = useState<number>(108);
  const [warmth, setWarmth] = useState<number>(10);
  const [saturation, setSaturation] = useState<number>(110);
  const [selectedBackdrop, setSelectedBackdrop] = useState<string>('warm_clay');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Camera modal state
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  // AI Generation status & result
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState<string>("");
  const [generatedCatalog, setGeneratedCatalog] = useState<any>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<'description' | 'cultural' | 'process' | 'social' | 'multilingual' | 'pricing'>('description');
  const [activeSocialPlatform, setActiveSocialPlatform] = useState<'instagram' | 'facebook' | 'twitter' | 'whatsapp'>('instagram');
  const [selectedLangPreview, setSelectedLangPreview] = useState<LanguageCode>('en');
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Price adjustment
  const [editablePrice, setEditablePrice] = useState<number>(1450);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check Speech Recognition support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      // Language setting based on user language
      if (language === 'hi') recognition.lang = 'hi-IN';
      else if (language === 'bn') recognition.lang = 'bn-IN';
      else if (language === 'ta') recognition.lang = 'ta-IN';
      else if (language === 'te') recognition.lang = 'te-IN';
      else if (language === 'mr') recognition.lang = 'mr-IN';
      else if (language === 'gu') recognition.lang = 'gu-IN';
      else recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setVoiceNotes(transcript);
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleRecording = () => {
    if (!speechSupported || !recognitionRef.current) {
      setIsRecording(!isRecording);
      if (!isRecording) {
        setVoiceNotes("Recording regional audio... Traditional handcrafted piece using ancestral village techniques.");
      }
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Speech start error:", err);
        setIsRecording(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setActiveStep('enhance');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (preset: typeof SAMPLE_CRAFT_PRESETS[0]) => {
    setSelectedImage(preset.image);
    setCategory(preset.category);
    setMaterials(preset.materials);
    setVoiceNotes(preset.sampleVoice);
    setRegion(preset.region);
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Trigger AI Generation (can be called directly after photo upload or after voice details)
  const handleGenerateCatalog = async () => {
    setIsGenerating(true);
    setActiveStep('ai_generate');
    setPublishedSuccess(false);

    try {
      setGenerationStage("Analyzing craft photo contours, raw textures & motifs...");
      await new Promise((r) => setTimeout(r, 600));

      setGenerationStage("Extracting cultural heritage significance & GI cluster history...");
      await new Promise((r) => setTimeout(r, 600));

      setGenerationStage("Deconstructing step-by-step master artisanal making process...");
      await new Promise((r) => setTimeout(r, 600));

      setGenerationStage("Composing social media marketing copy & multilingual titles with Gemini...");

      const response = await fetch('/api/gemini/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage.startsWith('data:') ? selectedImage : undefined,
          rawVoiceText: voiceNotes,
          craftCategory: category,
          craftRegion: region,
          materials: materials,
          artisanName: currentArtisan.name,
          targetLanguage: language,
          estimatedHours: estimatedHours,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setGeneratedCatalog(resData.data);
        setEditablePrice(resData.data.suggestedPrice || 1450);
        setActiveStep('preview');
      } else {
        throw new Error("Generation response invalid");
      }
    } catch (err) {
      console.error("AI Generation error:", err);
      // Construct fallback catalog with all 5 mandatory fields
      const fallbackData = {
        title: `Handcrafted ${category} Heritage Masterpiece`,
        story: `Preserved by ${currentArtisan.name} in ${region}. Shaped with ancestral reverence over ${estimatedHours} hours of devoted craftsmanship.`,
        description: `Authentic ${category} made using ${materials}. Fired and finished with traditional techniques for timeless beauty and enduring spiritual warmth.`,
        culturalSignificance: `Rooted in ancient artistic traditions of ${region}, this piece embodies sacred visual folklore passed down across five generations of rural artisan lineages. Preserving this craft safeguards community wisdom and ecological balance.`,
        makingProcess: [
          {
            stepNumber: 1,
            stageName: "Material Sourcing & Preparation",
            title: "Natural Clay & Mineral Pugging",
            description: "Artisan harvests seasonal riverbed clay, soaking and hand-kneading with organic straw ash for plasticity.",
            duration: "2 Days",
            toolsAndMaterials: "River clay, organic ash binders",
            proTipOrRitual: "Kneaded at dawn for optimal elasticity."
          },
          {
            stepNumber: 2,
            stageName: "Hand Sculpting & Wheel Throwing",
            title: "Traditional Form Shaping",
            description: "Shaped on a manual wooden wheel with rhythmic palm pressure and delicate bamboo ribs.",
            duration: "3-4 Hours",
            toolsAndMaterials: "Potter's wheel, bamboo shaping tools",
            proTipOrRitual: "Formed in single continuous breath cycles."
          },
          {
            stepNumber: 3,
            stageName: "Motif Etching & Natural Slip",
            title: "Heritage Filigree Carving",
            description: "Traditional flora and temple motifs are carved with styluses before applying natural ferric slip.",
            duration: "5 Hours",
            toolsAndMaterials: "Steel stylus, red oxide wash",
            proTipOrRitual: "Carved under indirect morning sunlight."
          },
          {
            stepNumber: 4,
            stageName: "Kiln Firing",
            title: "Wood-Fired Updraft Curing",
            description: "Baked at 850°C-900°C for 18 hours in a subterranean earthen kiln with dried wood and rice husks.",
            duration: "18 Hours",
            toolsAndMaterials: "Mud kiln, tamarind wood",
            proTipOrRitual: "Sealed with wet river mud at peak heat."
          },
          {
            stepNumber: 5,
            stageName: "Burnishing & Inspection",
            title: "River Agate Polishing",
            description: "Buffed with smooth riverbed agates and treated with organic seed oil for a warm satin sheen.",
            duration: "1.5 Hours",
            toolsAndMaterials: "River agate, organic seed oil",
            proTipOrRitual: "Acoustic bell ring verified by guild elders."
          }
        ],
        socialCaptions: {
          instagram: `✨ Pure handmade soul from ${region}! 🌿\n\nMeet this handcrafted ${category} masterwork by ${currentArtisan.name}. Every contour carries ancestral wisdom.\n\n💛 100% Zero-Middleman Fair Wage Escrow\n🌱 Eco-friendly natural materials\n\n#KarigarAI #VocalForLocal #IndianHandicrafts #ArtisanDirect #HandmadeWithLove`,
          facebook: `Meet ${currentArtisan.name} from ${region}. 🌟 Handcrafting authentic ${category} pieces with ancestral techniques. 100% escrow protected direct artisan support.`,
          twitter: `Say NO to plastic. Say YES to Indian heritage! 🏺✨ Handcrafted ${category} by master artisan ${currentArtisan.name}. #KarigarAI #VocalForLocal`,
          whatsapp: `*Namaste! 🙏 Direct from Master Artisan ${currentArtisan.name}*\n\n🌟 *Product:* Handcrafted ${category}\n📍 *Origin:* ${region}\n💰 *Price:* ₹1,450\n\n👉 *Tap to inspect details or order:* [Link]`,
          hashtags: ["#KarigarAI", "#VocalForLocal", "#IndianHandicrafts", "#ArtisanDirect", "#FairTrade"],
          viralHook: `Each piece takes ${estimatedHours} hours of devoted craftsmanship without modern machines! ✨`
        },
        multiLanguageTitles: {
          en: `Handcrafted ${category} Heritage Masterpiece`,
          hi: `पारंपरिक हस्तनिर्मित ${category} कलाकृति`,
          bn: `ঐতিহ্যবাহী হস্তনির্মিত ${category}`,
          ta: `பாரம்பரிய கைவினை ${category}`,
          te: `సాంప్రదాయ చేతివృత్తుల ${category}`,
          mr: `पारंपरिक हस्तकला ${category}`,
          gu: `પરંપરાગત હસ્તકલા ${category}`,
          es: `Obra Maestra Artesanal Tradicional de ${category}`
        },
        materialsUsed: materials.split(',').map((s) => s.trim()),
        technique: "Ancestral Guild Handcrafting",
        suggestedPrice: 1450,
        currency: "INR",
        pricingBreakdown: {
          materialCost: 350,
          laborCost: 650,
          artisanFairMargin: 350,
          packagingShipping: 100,
          explanation: "100% fair trade compensation ensuring liveable daily wages.",
        },
        marketPriceRange: { min: 1200, max: 2200, averageRetail: 1750 },
        tags: ["handcrafted", "fair-trade", "heritage-craft", "eco-friendly", "rural-artisan"],
        careInstructions: ["Clean gently with dry soft cloth", "Protect from harsh chemicals"],
        craftBadge: "Fair Trade Verified • Direct Guild",
      };
      setGeneratedCatalog(fallbackData);
      setEditablePrice(1450);
      setActiveStep('preview');
    } finally {
      setIsGenerating(false);
    }
  };

  // Publish to Marketplace
  const handlePublishToMarketplace = () => {
    if (!generatedCatalog) return;

    const newProduct: Product = {
      id: `prod-artisan-${Date.now()}`,
      title: generatedCatalog.title,
      category: category,
      price: editablePrice,
      originalPrice: Math.round(editablePrice * 1.3),
      currency: "INR",
      stock: stockCount,
      artisanId: currentArtisan.id,
      artisanName: currentArtisan.name,
      artisanAvatar: currentArtisan.avatar,
      artisanRegion: region,
      artisanStory: generatedCatalog.story || "Handcrafted with ancestral knowledge.",
      culturalSignificance: generatedCatalog.culturalSignificance || generatedCatalog.story,
      makingProcess: generatedCatalog.makingProcess,
      socialCaptions: generatedCatalog.socialCaptions,
      technique: generatedCatalog.technique || "Handmade Artisan Technique",
      materials: generatedCatalog.materialsUsed || [materials],
      images: [selectedImage],
      primaryImage: selectedImage,
      rating: 5.0,
      reviewCount: 0,
      reviews: [],
      dimensions: generatedCatalog.dimensionsEstimate || "Standard Handcrafted Dimension",
      tags: generatedCatalog.tags || ["handmade", "fair-trade"],
      craftBadge: generatedCatalog.craftBadge || "Direct Artisan Guild Verified",
      isVerified: true,
      createdDate: new Date().toISOString().split('T')[0],
      pricingBreakdown: generatedCatalog.pricingBreakdown || {
        materialCost: Math.round(editablePrice * 0.3),
        laborCost: Math.round(editablePrice * 0.45),
        artisanFairMargin: Math.round(editablePrice * 0.18),
        packagingShipping: Math.round(editablePrice * 0.07),
        explanation: "Ethical fair wage direct pricing.",
      },
      marketPriceRange: generatedCatalog.marketPriceRange || {
        min: Math.round(editablePrice * 0.85),
        max: Math.round(editablePrice * 1.5),
        averageRetail: Math.round(editablePrice * 1.2),
      },
      careInstructions: generatedCatalog.careInstructions || ["Handle with care"],
      multilingualTitles: generatedCatalog.multiLanguageTitles,
      regionalTitles: generatedCatalog.regionalTranslations
        ? {
            hi: generatedCatalog.regionalTranslations.hi?.title || generatedCatalog.multiLanguageTitles?.hi,
            bn: generatedCatalog.regionalTranslations.bn?.title || generatedCatalog.multiLanguageTitles?.bn,
            ta: generatedCatalog.regionalTranslations.ta?.title || generatedCatalog.multiLanguageTitles?.ta,
            te: generatedCatalog.regionalTranslations.te?.title || generatedCatalog.multiLanguageTitles?.te,
            mr: generatedCatalog.regionalTranslations.mr?.title || generatedCatalog.multiLanguageTitles?.mr,
            gu: generatedCatalog.regionalTranslations.gu?.title || generatedCatalog.multiLanguageTitles?.gu,
            es: generatedCatalog.regionalTranslations.es?.title || generatedCatalog.multiLanguageTitles?.es,
          }
        : generatedCatalog.multiLanguageTitles,
      regionalDescriptions: generatedCatalog.regionalTranslations
        ? {
            hi: generatedCatalog.regionalTranslations.hi?.description,
            bn: generatedCatalog.regionalTranslations.bn?.description,
            ta: generatedCatalog.regionalTranslations.ta?.description,
            te: generatedCatalog.regionalTranslations.te?.description,
            mr: generatedCatalog.regionalTranslations.mr?.description,
            gu: generatedCatalog.regionalTranslations.gu?.description,
            es: generatedCatalog.regionalTranslations.es?.description,
          }
        : undefined,
    };

    addProduct(newProduct);
    setPublishedSuccess(true);
  };

  return (
    <div id="smart-catalog-studio-container" className="max-w-4xl mx-auto pb-20 px-4 sm:px-6 pt-4">
      {/* Studio Header */}
      <div className="mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#22211E] p-4 rounded-2xl border border-[#E5E2DD] dark:border-[#383632] shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#5A5A40] text-white">
                <Sparkles className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-serif italic font-bold text-[#2D2D2D] dark:text-[#F5F3EF]">
                {t.smartStudio}
              </h1>
            </div>
            <p className="text-xs text-[#5A5A40] dark:text-[#C8C7B8] mt-1">
              Upload product photo & AI automatically generates product description, cultural significance, making process, social captions & multilingual titles.
            </p>
          </div>

          {/* Quick Steps Navigation Tabs */}
          <div className="flex items-center bg-[#F5F2ED] dark:bg-[#2C2A26] p-1 rounded-xl text-xs font-semibold border border-[#E5E2DD] dark:border-[#383632]">
            <button
              onClick={() => setActiveStep('upload')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeStep === 'upload' || activeStep === 'enhance'
                  ? 'bg-[#5A5A40] text-white shadow-2xs'
                  : 'text-[#5A5A40] dark:text-[#C8C7B8]'
              }`}
            >
              1. Photo & Studio
            </button>
            <button
              onClick={() => setActiveStep('voice_details')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeStep === 'voice_details'
                  ? 'bg-[#5A5A40] text-white shadow-2xs'
                  : 'text-[#5A5A40] dark:text-[#C8C7B8]'
              }`}
            >
              2. Voice & Craft
            </button>
            <button
              onClick={() => generatedCatalog && setActiveStep('preview')}
              disabled={!generatedCatalog}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeStep === 'preview'
                  ? 'bg-[#5A5A40] text-white shadow-2xs'
                  : 'text-[#A5A29D] cursor-not-allowed'
              }`}
            >
              3. AI Marketing Kit
            </button>
          </div>
        </div>
      </div>

      {/* STEP 1: IMAGE CAPTURE & STUDIO ENHANCEMENT */}
      {(activeStep === 'upload' || activeStep === 'enhance') && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Direct Auto-Generate Quick Banner */}
          <div className="bg-[#5A5A40]/10 border border-[#5A5A40]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Zap className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A1A1A] dark:text-[#F5F3EF]">
                  Instant AI Craft Story & Marketing Kit Generator
                </h4>
                <p className="text-xs text-[#5A5A40] dark:text-[#C8C7B8]">
                  Upload any photo to auto-generate Description, Cultural Significance, Making Process, Social Captions & Multilingual Titles in 1 click!
                </p>
              </div>
            </div>

            <button
              id="instant-auto-generate-btn"
              onClick={handleGenerateCatalog}
              disabled={isGenerating}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              ✨ Auto-Generate AI Catalog Now
            </button>
          </div>

          {/* Main Visual Studio Canvas */}
          <div className="bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] p-4 sm:p-5 shadow-2xs">
            <div className="flex flex-col md:flex-row gap-5 items-center">
              {/* Studio Viewport */}
              <div className="w-full md:w-1/2 flex flex-col items-center">
                <div
                  className="relative w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden shadow-xs flex items-center justify-center transition-all duration-300 border border-[#E5E2DD] dark:border-[#383632]"
                  style={{
                    backgroundColor:
                      STUDIO_BACKDROPS.find((b) => b.id === selectedBackdrop)?.color || '#f5f5f4',
                  }}
                >
                  <img
                    src={selectedImage}
                    alt="Artisan Craft Preview"
                    className="w-full h-full object-cover transition-all duration-200"
                    style={{
                      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${warmth}%)`,
                    }}
                  />
                  {/* Studio Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" /> AI Studio Ready
                  </div>
                </div>

                {/* Upload & Camera Buttons */}
                <div className="flex items-center gap-2 mt-3 w-full max-w-[320px]">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 rounded-xl border border-[#E5E2DD] dark:border-[#383632] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] text-xs font-semibold text-[#5A5A40] dark:text-[#C8C7B8] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Photo
                  </button>
                  <button
                    onClick={() => setIsCameraModalOpen(true)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Take Photo
                  </button>
                </div>
              </div>

              {/* Lighting & Enhancement Controls */}
              <div className="w-full md:w-1/2 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#5A5A40]" />
                    Studio Lighting & Quality Enhancement
                  </h3>
                  <p className="text-xs text-[#A5A29D] mt-0.5">
                    Refine natural tones, contrast and backdrop to elevate buyer trust.
                  </p>
                </div>

                {/* Sliders */}
                <div className="space-y-3 p-3.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-[#5A5A40] dark:text-[#C8C7B8] mb-1">
                      <span className="flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-500" /> Exposure & Brightness
                      </span>
                      <span>{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="140"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-[#5A5A40] h-1.5 bg-[#E5E2DD] dark:bg-[#383632] rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-[#5A5A40] dark:text-[#C8C7B8] mb-1">
                      <span className="flex items-center gap-1.5">
                        <Contrast className="w-3.5 h-3.5 text-[#5A5A40]" /> Texture Contrast
                      </span>
                      <span>{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="140"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-[#5A5A40] h-1.5 bg-[#E5E2DD] dark:bg-[#383632] rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-[#5A5A40] dark:text-[#C8C7B8] mb-1">
                      <span className="flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-orange-600" /> Pigment Richness
                      </span>
                      <span>{saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="150"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full accent-[#5A5A40] h-1.5 bg-[#E5E2DD] dark:bg-[#383632] rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Studio Backdrop Presets */}
                <div>
                  <label className="block text-xs font-semibold text-[#5A5A40] dark:text-[#C8C7B8] mb-1.5">
                    Studio Backdrop Setting ({t.removeBg})
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {STUDIO_BACKDROPS.map((backdrop) => (
                      <button
                        key={backdrop.id}
                        onClick={() => setSelectedBackdrop(backdrop.id)}
                        className={`p-2 rounded-xl text-left border text-xs flex items-center gap-1.5 transition-all ${
                          selectedBackdrop === backdrop.id
                            ? 'border-[#5A5A40] bg-white dark:bg-[#22211E] text-[#5A5A40] dark:text-[#C8C7B8] font-bold shadow-2xs'
                            : 'border-[#E5E2DD] dark:border-[#383632] hover:border-[#5A5A40] bg-white dark:bg-[#22211E] text-[#5A5A40] dark:text-[#C8C7B8]'
                        }`}
                      >
                        <span className="text-xs">{backdrop.icon}</span>
                        <span className="truncate text-[11px]">{backdrop.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    id="btn-goto-step-2"
                    onClick={() => setActiveStep('voice_details')}
                    className="py-2.5 px-3 rounded-xl border border-[#E5E2DD] dark:border-[#383632] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    Add Voice Notes
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id="btn-generate-direct"
                    onClick={handleGenerateCatalog}
                    className="py-2.5 px-3 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    AI Auto-Generate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Craft Sample Presets */}
          <div className="bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] p-4">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#A5A29D] mb-3">
              Or Select Sample Rural Craft Photo to Test:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAMPLE_CRAFT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => selectPreset(preset)}
                  className={`p-2 rounded-xl border text-left flex flex-col gap-1.5 transition-all group ${
                    selectedImage === preset.image
                      ? 'border-[#5A5A40] bg-[#F5F2ED] dark:bg-[#2C2A26]'
                      : 'border-[#E5E2DD] dark:border-[#383632] hover:border-[#5A5A40] bg-white dark:bg-[#22211E]'
                  }`}
                >
                  <img
                    src={preset.image}
                    alt={preset.name}
                    className="w-full aspect-square object-cover rounded-lg group-hover:scale-102 transition-transform"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF] truncate">
                      {preset.name}
                    </p>
                    <p className="text-[10px] text-[#A5A29D] truncate">
                      {preset.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: VOICE ASSIST & CRAFT SPECIFICATIONS */}
      {activeStep === 'voice_details' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Voice Input Section */}
          <div className="bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#5A5A40] text-white shadow-2xs">
                  <Mic className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF] text-sm">
                    {t.voiceInput} (Regional Voice Assistant)
                  </h3>
                  <p className="text-xs text-[#A5A29D]">
                    Artisans can simply speak in their mother tongue (Hindi, Bengali, Tamil, Telugu, etc.) to describe the craft.
                  </p>
                </div>
              </div>

              {/* Voice Mic Button */}
              <button
                id="voice-mic-record-btn"
                onClick={toggleRecording}
                className={`px-3.5 py-2 rounded-xl text-white transition-all shadow-2xs flex items-center gap-1.5 text-xs font-semibold ${
                  isRecording
                    ? 'bg-red-600 animate-pulse ring-2 ring-red-300'
                    : 'bg-[#5A5A40] hover:bg-[#484833]'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" /> Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" /> Start Speaking
                  </>
                )}
              </button>
            </div>

            {/* Live Audio Transcript Box */}
            <div className="p-3 bg-[#F5F2ED] dark:bg-[#2C2A26] rounded-xl border border-[#E5E2DD] dark:border-[#383632] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#A5A29D]">
                <span>Artisan Voice Transcript / Craft Notes:</span>
                {voiceNotes && (
                  <button
                    onClick={() => speakText(voiceNotes)}
                    className="text-[#5A5A40] dark:text-[#C8C7B8] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Volume2 className="w-3 h-3" /> Listen Back
                  </button>
                )}
              </div>
              <textarea
                value={voiceNotes}
                onChange={(e) => setVoiceNotes(e.target.value)}
                placeholder="Speak or type craft background, wood/clay type, sacred motifs, or ancestral details..."
                rows={3}
                className="w-full bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] rounded-lg p-2.5 text-xs text-[#1A1A1A] dark:text-[#F5F3EF] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
              />
            </div>
          </div>

          {/* Craft Attributes Form */}
          <div className="bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] p-4 sm:p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#5A5A40]" />
              Craft Dimensions & Heritage Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#5A5A40] dark:text-[#C8C7B8] mb-1">
                  Craft Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#1A1A1A] dark:text-[#F5F3EF] font-medium"
                >
                  <option value="Terracotta & Pottery">Terracotta & Pottery</option>
                  <option value="Dokra Metal Casting">Dokra Metal Casting</option>
                  <option value="Madhubani & Folk Painting">Madhubani & Folk Painting</option>
                  <option value="Handloom & Textiles">Handloom & Textiles</option>
                  <option value="Woodcarving & Crafts">Woodcarving & Crafts</option>
                  <option value="Jewelry & Filigree">Jewelry & Filigree</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#5A5A40] dark:text-[#C8C7B8] mb-1">
                  Artisan Cluster / Village Region
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Bishnupur, West Bengal"
                  className="w-full p-2.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#1A1A1A] dark:text-[#F5F3EF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#5A5A40] dark:text-[#C8C7B8] mb-1">
                  Raw Natural Materials
                </label>
                <input
                  type="text"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="e.g. River clay, wood ash, brass, indigo"
                  className="w-full p-2.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#1A1A1A] dark:text-[#F5F3EF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#5A5A40] dark:text-[#C8C7B8] mb-1">
                    Hours to Make
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#1A1A1A] dark:text-[#F5F3EF]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#5A5A40] dark:text-[#C8C7B8] mb-1">
                    Stock Ready
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={stockCount}
                    onChange={(e) => setStockCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#1A1A1A] dark:text-[#F5F3EF]"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E5E2DD] dark:border-[#383632]">
              <button
                onClick={() => setActiveStep('enhance')}
                className="py-2 px-4 rounded-xl border border-[#E5E2DD] dark:border-[#383632] text-xs font-semibold text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26]"
              >
                Back to Image
              </button>

              <button
                id="btn-generate-ai-catalog"
                onClick={handleGenerateCatalog}
                className="py-2.5 px-6 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white font-bold text-xs flex items-center gap-2 shadow-2xs transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                Generate AI Craft Story & Marketing Kit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: LIVE AI GENERATION PIPELINE */}
      {activeStep === 'ai_generate' && (
        <div className="bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] p-8 text-center space-y-5 animate-in fade-in duration-200">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-[#5A5A40]/20 animate-ping" />
            <div className="relative w-full h-full rounded-full bg-[#5A5A40] text-white flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-amber-200 animate-pulse" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold font-serif italic text-[#1A1A1A] dark:text-[#F5F3EF]">
              KarigarAI Multimodal Craft Curator at Work
            </h3>
            <p className="text-xs text-[#5A5A40] dark:text-[#C8C7B8] mt-1 max-w-md mx-auto">
              Analyzing photo texture, extracting cultural folklore, assembling chronological artisanal making stages, writing viral social captions & localizing titles.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-[#F5F2ED] dark:bg-[#2C2A26] p-3.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] text-xs font-medium text-[#5A5A40] dark:text-[#C8C7B8] flex items-center justify-center gap-2.5 shadow-2xs">
            <RefreshCw className="w-4 h-4 animate-spin text-[#5A5A40]" />
            <span>{generationStage}</span>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-lg mx-auto text-[10px] text-[#A5A29D] pt-2">
            <div className="p-2 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]">
              📸 Description
            </div>
            <div className="p-2 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]">
              📜 Cultural Heritage
            </div>
            <div className="p-2 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]">
              🔨 Making Process
            </div>
            <div className="p-2 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]">
              📱 Social Captions
            </div>
            <div className="p-2 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]">
              🌐 Multilingual Titles
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW AI CATALOG & 5-PILLAR MARKETING KIT */}
      {activeStep === 'preview' && generatedCatalog && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {publishedSuccess && (
            <div className="bg-[#5A5A40]/10 border border-[#5A5A40] rounded-2xl p-5 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#5A5A40] text-white flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2D2D2D] dark:text-[#F5F3EF] font-serif italic">
                  Craft Successfully Published to Global Market!
                </h3>
                <p className="text-xs text-[#5A5A40] dark:text-[#C8C7B8] mt-1 max-w-md mx-auto">
                  Your piece is now live with full cultural story, making process timeline, multilingual titles, and marketing social kit.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2.5 pt-1">
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-semibold shadow-2xs transition-all"
                >
                  View on Live Marketplace
                </button>
                <button
                  onClick={() => {
                    setPublishedSuccess(false);
                    setActiveStep('upload');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] text-[#2D2D2D] dark:text-[#F5F3EF] text-xs font-semibold"
                >
                  Catalog Another Craft
                </button>
              </div>
            </div>
          )}

          {/* AI Output Navigation Tabs (5 Core Requirements + Pricing) */}
          <div className="bg-white dark:bg-[#22211E] p-2 rounded-2xl border border-[#E5E2DD] dark:border-[#383632] shadow-2xs">
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 text-xs font-semibold">
              <button
                id="tab-description"
                onClick={() => setActivePreviewTab('description')}
                className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activePreviewTab === 'description'
                    ? 'bg-[#5A5A40] text-white shadow-2xs'
                    : 'text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="truncate">Description</span>
              </button>

              <button
                id="tab-cultural"
                onClick={() => setActivePreviewTab('cultural')}
                className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activePreviewTab === 'cultural'
                    ? 'bg-[#5A5A40] text-white shadow-2xs'
                    : 'text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26]'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span className="truncate">Cultural Heritage</span>
              </button>

              <button
                id="tab-process"
                onClick={() => setActivePreviewTab('process')}
                className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activePreviewTab === 'process'
                    ? 'bg-[#5A5A40] text-white shadow-2xs'
                    : 'text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26]'
                }`}
              >
                <Hammer className="w-3.5 h-3.5" />
                <span className="truncate">Making Process</span>
              </button>

              <button
                id="tab-social"
                onClick={() => setActivePreviewTab('social')}
                className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activePreviewTab === 'social'
                    ? 'bg-[#5A5A40] text-white shadow-2xs'
                    : 'text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26]'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="truncate">Social Captions</span>
              </button>

              <button
                id="tab-multilingual"
                onClick={() => setActivePreviewTab('multilingual')}
                className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activePreviewTab === 'multilingual'
                    ? 'bg-[#5A5A40] text-white shadow-2xs'
                    : 'text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26]'
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                <span className="truncate">Multilingual Titles</span>
              </button>

              <button
                id="tab-pricing"
                onClick={() => setActivePreviewTab('pricing')}
                className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activePreviewTab === 'pricing'
                    ? 'bg-[#5A5A40] text-white shadow-2xs'
                    : 'text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26]'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span className="truncate">Fair Wage Pricing</span>
              </button>
            </div>
          </div>

          {/* TAB 1: PRODUCT DESCRIPTION & GENERAL SPECIFICATIONS */}
          {activePreviewTab === 'description' && (
            <div className="bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] overflow-hidden shadow-2xs animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                {/* Photo with Studio Lighting */}
                <div className="md:col-span-5 bg-[#F5F2ED] dark:bg-[#2C2A26] p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#E5E2DD] dark:border-[#383632]">
                  <div
                    className="w-full aspect-square rounded-xl overflow-hidden shadow-2xs border border-[#E5E2DD] dark:border-[#383632]"
                    style={{
                      backgroundColor:
                        STUDIO_BACKDROPS.find((b) => b.id === selectedBackdrop)?.color || '#ffffff',
                    }}
                  >
                    <img
                      src={selectedImage}
                      alt="Craft Masterpiece"
                      className="w-full h-full object-cover"
                      style={{
                        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${warmth}%)`,
                      }}
                    />
                  </div>
                  <div className="w-full mt-2.5 flex items-center justify-between text-[10px] text-[#A5A29D]">
                    <span>Allocated Stock: {stockCount} items</span>
                    <span className="font-semibold text-[#5A5A40] dark:text-[#C8C7B8]">
                      {category}
                    </span>
                  </div>
                </div>

                {/* Narrative & Description Details */}
                <div className="md:col-span-7 p-4 sm:p-5 space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632] uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3 inline mr-1 text-[#5A5A40]" />
                      {generatedCatalog.craftBadge || "GI Cluster Certified"}
                    </span>
                    <button
                      onClick={() => handleCopyText(generatedCatalog.description, 'desc')}
                      className="text-xs font-semibold text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1 hover:underline"
                    >
                      {copiedKey === 'desc' ? (
                        <>
                          <Check className="w-3 h-3 text-green-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy Description
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-bold font-serif italic text-[#1A1A1A] dark:text-[#F5F3EF]">
                      {generatedCatalog.title}
                    </h2>
                    <p className="text-xs text-[#A5A29D] mt-0.5">
                      Handmade by {currentArtisan.name} • {region}
                    </p>
                  </div>

                  {/* Curated Product Description */}
                  <div className="p-3.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#5A5A40]" />
                        Curated Product Description
                      </span>
                      <button
                        onClick={() => speakText(generatedCatalog.description)}
                        className="text-[10px] text-[#5A5A40] dark:text-[#C8C7B8] font-semibold flex items-center gap-1 hover:underline"
                      >
                        <Volume2 className="w-3 h-3" /> Listen Audio
                      </button>
                    </div>
                    <p className="text-xs text-[#5A5A40] dark:text-[#C8C7B8] leading-relaxed">
                      {generatedCatalog.description}
                    </p>
                  </div>

                  {/* Technique & Materials */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632]">
                      <span className="text-[9px] uppercase font-semibold text-[#A5A29D] block">
                        Technique
                      </span>
                      <span className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF] block mt-0.5">
                        {generatedCatalog.technique}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632]">
                      <span className="text-[9px] uppercase font-semibold text-[#A5A29D] block">
                        Estimated Dimensions
                      </span>
                      <span className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF] block mt-0.5">
                        {generatedCatalog.dimensionsEstimate || "28cm x 18cm x 18cm"}
                      </span>
                    </div>
                  </div>

                  {/* Materials Chips */}
                  <div>
                    <span className="text-[10px] font-semibold text-[#A5A29D] uppercase block mb-1">
                      Authentic Natural Materials:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedCatalog.materialsUsed?.map((mat: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] rounded-md text-[11px] font-medium border border-[#E5E2DD] dark:border-[#383632]"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CULTURAL SIGNIFICANCE & HERITAGE LINEAGE */}
          {activePreviewTab === 'cultural' && (
            <div className="bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] p-5 space-y-4 shadow-2xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#5A5A40] text-white">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif italic font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                      Cultural Significance & Ancestral Lineage
                    </h3>
                    <p className="text-xs text-[#A5A29D]">
                      Deep folklore roots, GI cluster lineage, and mythological symbolism.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => speakText(generatedCatalog.culturalSignificance || generatedCatalog.story)}
                    className="px-3 py-1.5 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] text-xs font-semibold flex items-center gap-1.5 border border-[#E5E2DD] dark:border-[#383632]"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen Narration
                  </button>
                  <button
                    onClick={() => handleCopyText(generatedCatalog.culturalSignificance || generatedCatalog.story, 'cultural')}
                    className="px-3 py-1.5 rounded-lg bg-[#5A5A40] text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    {copiedKey === 'cultural' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'cultural' ? 'Copied' : 'Copy Story'}
                  </button>
                </div>
              </div>

              {/* Main Cultural Narrative Display */}
              <div className="p-4 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] dark:text-[#C8C7B8]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Heritage Background & Sacred Symbolism:</span>
                </div>
                <p className="text-xs text-[#1A1A1A] dark:text-[#F5F3EF] leading-relaxed whitespace-pre-line">
                  {generatedCatalog.culturalSignificance || generatedCatalog.story}
                </p>
              </div>

              {/* Cultural Badges & Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#A5A29D] block">
                    GI Cluster Heritage
                  </span>
                  <span className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF] block">
                    {region} Traditional Guild
                  </span>
                  <p className="text-[10px] text-[#5A5A40] dark:text-[#C8C7B8]">
                    Protected under regional intellectual craft protocols.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#A5A29D] block">
                    Generational Lineage
                  </span>
                  <span className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF] block">
                    5th-Gen Master Ancestry
                  </span>
                  <p className="text-[10px] text-[#5A5A40] dark:text-[#C8C7B8]">
                    Knowledge transmitted orally through hereditary family guilds.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#A5A29D] block">
                    Ecological Harmony
                  </span>
                  <span className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF] block">
                    100% Zero-Carbon Inputs
                  </span>
                  <p className="text-[10px] text-[#5A5A40] dark:text-[#C8C7B8]">
                    Crafted using biodegradable earth, vegetable and mineral pigments.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MAKING PROCESS (STEP-BY-STEP ARTISANAL WORKFLOW) */}
          {activePreviewTab === 'process' && (
            <div className="bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] p-5 space-y-4 shadow-2xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#5A5A40] text-white">
                    <Hammer className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif italic font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                      Step-by-Step Artisanal Making Process
                    </h3>
                    <p className="text-xs text-[#A5A29D]">
                      Chronological mastercraft workflow from raw earth to finished museum-grade artifact.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632]">
                  {generatedCatalog.makingProcess?.length || 5} Chronological Stages
                </span>
              </div>

              {/* Interactive Making Steps Timeline */}
              <div className="space-y-3">
                {generatedCatalog.makingProcess?.map((step: MakingProcessStep, index: number) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] flex flex-col sm:flex-row gap-3.5 items-start"
                  >
                    {/* Step Number Badge */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#5A5A40] text-white text-xs font-bold shrink-0 shadow-2xs">
                      0{step.stepNumber || index + 1}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <h4 className="font-bold text-xs sm:text-sm text-[#1A1A1A] dark:text-[#F5F3EF]">
                          {step.stageName || step.title}
                        </h4>
                        {step.duration && (
                          <span className="text-[10px] font-semibold text-[#5A5A40] dark:text-[#C8C7B8] bg-white dark:bg-[#22211E] px-2 py-0.5 rounded border border-[#E5E2DD] dark:border-[#383632] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {step.duration}
                          </span>
                        )}
                      </div>

                      {step.title && step.title !== step.stageName && (
                        <p className="text-xs font-medium text-[#5A5A40] dark:text-[#C8C7B8]">
                          {step.title}
                        </p>
                      )}

                      <p className="text-xs text-[#5A5A40] dark:text-[#C8C7B8] leading-relaxed">
                        {step.description}
                      </p>

                      {/* Tools & Traditional Pro-Tip */}
                      <div className="flex flex-wrap gap-2 pt-1 text-[10px]">
                        {step.toolsAndMaterials && (
                          <span className="px-2 py-0.5 rounded bg-white dark:bg-[#22211E] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632]">
                            🛠️ <span className="font-semibold">Tools:</span> {step.toolsAndMaterials}
                          </span>
                        )}
                        {step.proTipOrRitual && (
                          <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 italic">
                            ✨ <span className="font-semibold">Ancestral Ritual:</span> {step.proTipOrRitual}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SOCIAL MEDIA MARKETING KIT & CAPTIONS */}
          {activePreviewTab === 'social' && (
            <div className="bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] p-5 space-y-4 shadow-2xs animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#5A5A40] text-white">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif italic font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                      Ready-to-Publish Social Media Captions
                    </h3>
                    <p className="text-xs text-[#A5A29D]">
                      Optimized copywriting for Instagram, Facebook, Twitter & WhatsApp Business with viral hooks & hashtags.
                    </p>
                  </div>
                </div>

                {generatedCatalog.socialCaptions?.viralHook && (
                  <span className="text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900/50">
                    💡 Hook: {generatedCatalog.socialCaptions.viralHook}
                  </span>
                )}
              </div>

              {/* Platform Selector Buttons */}
              <div className="flex flex-wrap gap-2 pt-1 border-b border-[#E5E2DD] dark:border-[#383632] pb-3">
                <button
                  onClick={() => setActiveSocialPlatform('instagram')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeSocialPlatform === 'instagram'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xs'
                      : 'bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8]'
                  }`}
                >
                  <Instagram className="w-3.5 h-3.5" /> Instagram & Threads
                </button>

                <button
                  onClick={() => setActiveSocialPlatform('facebook')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeSocialPlatform === 'facebook'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8]'
                  }`}
                >
                  <Facebook className="w-3.5 h-3.5" /> Facebook & Pinterest
                </button>

                <button
                  onClick={() => setActiveSocialPlatform('twitter')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeSocialPlatform === 'twitter'
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-2xs'
                      : 'bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8]'
                  }`}
                >
                  <Twitter className="w-3.5 h-3.5" /> Twitter / X
                </button>

                <button
                  onClick={() => setActiveSocialPlatform('whatsapp')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeSocialPlatform === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8]'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Broadcast
                </button>
              </div>

              {/* Selected Platform Copy Box */}
              <div className="p-4 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF] capitalize flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
                    {activeSocialPlatform} Caption & Formatting:
                  </span>

                  <button
                    onClick={() => {
                      const captionText =
                        activeSocialPlatform === 'instagram'
                          ? generatedCatalog.socialCaptions?.instagram
                          : activeSocialPlatform === 'facebook'
                          ? generatedCatalog.socialCaptions?.facebook
                          : activeSocialPlatform === 'twitter'
                          ? generatedCatalog.socialCaptions?.twitter
                          : generatedCatalog.socialCaptions?.whatsapp;
                      handleCopyText(captionText || '', activeSocialPlatform);
                    }}
                    className="px-3 py-1.5 bg-[#5A5A40] hover:bg-[#484833] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    {copiedKey === activeSocialPlatform ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-300" /> Copied Caption!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy {activeSocialPlatform} Caption
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 bg-white dark:bg-[#22211E] rounded-lg border border-[#E5E2DD] dark:border-[#383632]">
                  <p className="text-xs text-[#1A1A1A] dark:text-[#F5F3EF] font-sans whitespace-pre-line leading-relaxed">
                    {activeSocialPlatform === 'instagram' && (generatedCatalog.socialCaptions?.instagram || "Instagram caption loading...")}
                    {activeSocialPlatform === 'facebook' && (generatedCatalog.socialCaptions?.facebook || "Facebook caption loading...")}
                    {activeSocialPlatform === 'twitter' && (generatedCatalog.socialCaptions?.twitter || "Twitter caption loading...")}
                    {activeSocialPlatform === 'whatsapp' && (generatedCatalog.socialCaptions?.whatsapp || "WhatsApp caption loading...")}
                  </p>
                </div>

                {/* Hashtags Bar */}
                {generatedCatalog.socialCaptions?.hashtags && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-[#A5A29D] uppercase block">
                      Recommended Craft Discovery Hashtags:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {generatedCatalog.socialCaptions.hashtags.map((tag: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => handleCopyText(tag, `tag-${i}`)}
                          className="px-2 py-0.5 rounded bg-white dark:bg-[#22211E] text-[10px] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632] hover:border-[#5A5A40]"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: MULTILINGUAL TITLES (LOCALIZED FOR 8+ LANGUAGES) */}
          {activePreviewTab === 'multilingual' && (
            <div className="bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] p-5 space-y-4 shadow-2xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#5A5A40] text-white">
                    <Languages className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif italic font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                      Product Titles in Multiple Languages
                    </h3>
                    <p className="text-xs text-[#A5A29D]">
                      Authentic titles localized in Indian regional scripts & international languages for discovery.
                    </p>
                  </div>
                </div>
              </div>

              {/* Language Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { code: 'en', name: 'English', script: 'English' },
                  { code: 'hi', name: 'Hindi', script: 'हिन्दी' },
                  { code: 'bn', name: 'Bengali', script: 'বাংলা' },
                  { code: 'ta', name: 'Tamil', script: 'தமிழ்' },
                  { code: 'te', name: 'Telugu', script: 'తెలుగు' },
                  { code: 'mr', name: 'Marathi', script: 'मराठी' },
                  { code: 'gu', name: 'Gujarati', script: 'ગુજરાતી' },
                  { code: 'es', name: 'Spanish', script: 'Español' },
                ].map((langItem) => {
                  const title =
                    generatedCatalog.multiLanguageTitles?.[langItem.code] ||
                    generatedCatalog.regionalTranslations?.[langItem.code]?.title ||
                    (langItem.code === 'en' ? generatedCatalog.title : `हस्तशिल्प: ${generatedCatalog.title}`);
                  const desc =
                    generatedCatalog.regionalTranslations?.[langItem.code]?.description;

                  return (
                    <div
                      key={langItem.code}
                      className="p-3.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A5A29D] flex items-center gap-1">
                            <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#22211E] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632]">
                              {langItem.code.toUpperCase()}
                            </span>
                            {langItem.name} ({langItem.script})
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => speakText(title)}
                              className="p-1 rounded hover:bg-white dark:hover:bg-[#22211E] text-[#5A5A40] dark:text-[#C8C7B8]"
                              title="Listen pronunciation"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleCopyText(title, `title-${langItem.code}`)}
                              className="p-1 rounded hover:bg-white dark:hover:bg-[#22211E] text-[#5A5A40] dark:text-[#C8C7B8]"
                              title="Copy title"
                            >
                              {copiedKey === `title-${langItem.code}` ? (
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <p className="font-bold text-xs sm:text-sm text-[#1A1A1A] dark:text-[#F5F3EF]">
                          {title}
                        </p>

                        {desc && (
                          <p className="text-[10px] text-[#5A5A40] dark:text-[#C8C7B8] line-clamp-2 mt-1 italic">
                            {desc}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: FAIR-TRADE PRICING TRANSPARENCY CALCULATOR */}
          {activePreviewTab === 'pricing' && (
            <div className="bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] p-4 sm:p-5 space-y-3.5 shadow-2xs animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-2">
                    <Coins className="w-4 h-4 text-[#5A5A40]" />
                    {t.fairPriceBreakdown} & Living Wage Surplus
                  </h3>
                  <p className="text-xs text-[#A5A29D]">
                    AI dynamically calculated price ensures a 40%+ living wage surplus over local rates.
                  </p>
                </div>

                {/* Price Display & Custom Modifier */}
                <div className="flex items-center gap-2 bg-[#F5F2ED] dark:bg-[#2C2A26] px-3 py-1.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632]">
                  <span className="text-xs font-semibold text-[#5A5A40] dark:text-[#C8C7B8]">Selling Price:</span>
                  <span className="font-bold text-base text-[#1A1A1A] dark:text-[#F5F3EF]">
                    ₹{editablePrice}
                  </span>
                </div>
              </div>

              {/* Pricing Cost Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]">
                  <span className="text-[10px] text-[#A5A29D] block">Raw Materials</span>
                  <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                    ₹{generatedCatalog.pricingBreakdown?.materialCost || 350}
                  </span>
                  <span className="text-[9px] text-[#A5A29D] block mt-0.5">Natural clay, pigment</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]">
                  <span className="text-[10px] text-[#A5A29D] block">Artisan Labor Wage</span>
                  <span className="text-xs font-bold text-[#5A5A40] dark:text-[#C8C7B8]">
                    ₹{generatedCatalog.pricingBreakdown?.laborCost || 650}
                  </span>
                  <span className="text-[9px] text-[#A5A29D] block mt-0.5">{estimatedHours} hrs @ ethical rate</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]">
                  <span className="text-[10px] text-[#A5A29D] block">Artisan Guild Margin</span>
                  <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                    ₹{generatedCatalog.pricingBreakdown?.artisanFairMargin || 350}
                  </span>
                  <span className="text-[9px] text-[#A5A29D] block mt-0.5">Reinvested in tools</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632]">
                  <span className="text-[10px] text-[#A5A29D] block">Eco Packing & Transit</span>
                  <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                    ₹{generatedCatalog.pricingBreakdown?.packagingShipping || 100}
                  </span>
                  <span className="text-[9px] text-[#A5A29D] block mt-0.5">Rice straw packaging</span>
                </div>
              </div>

              {/* Commercial Benchmark Range */}
              {generatedCatalog.marketPriceRange && (
                <div className="bg-[#F5F2ED] dark:bg-[#2C2A26] p-3 rounded-xl border border-[#E5E2DD] dark:border-[#383632] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                  <div>
                    <span className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                      Commercial Middleman Retail Equivalent: ₹{generatedCatalog.marketPriceRange.averageRetail}
                    </span>
                    <p className="text-[#5A5A40] dark:text-[#C8C7B8] text-[10px]">
                      By eliminating intermediaries, the artisan receives <span className="font-bold">2.4x higher income</span> while the buyer saves ~25%!
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#A5A29D]">
                    <span>Range: ₹{generatedCatalog.marketPriceRange.min} - ₹{generatedCatalog.marketPriceRange.max}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Final Action Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setActiveStep('voice_details')}
              className="py-2 px-4 rounded-xl border border-[#E5E2DD] dark:border-[#383632] text-xs font-semibold text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26]"
            >
              Edit Parameters
            </button>

            <button
              id="btn-publish-final"
              onClick={handlePublishToMarketplace}
              disabled={publishedSuccess}
              className="py-2.5 px-6 rounded-xl bg-[#5A5A40] hover:bg-[#484833] disabled:bg-[#5A5A40]/70 text-white font-bold text-xs flex items-center gap-2 shadow-2xs transition-all"
            >
              {publishedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Live on Marketplace
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  {t.publishToMarket}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Real Live Camera & Craft Photo Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(capturedDataUrl) => {
          setSelectedImage(capturedDataUrl);
          setActiveStep('enhance');
        }}
      />
    </div>
  );
};
