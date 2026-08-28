import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with high limit for image uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Initialize Gemini AI Client (Lazy / Safe)
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Using smart fallback generation.");
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // AI Smart Cataloging Endpoint
  app.post("/api/gemini/catalog", async (req, res) => {
    try {
      const {
        imageBase64,
        imageMimeType = "image/jpeg",
        rawVoiceText = "",
        craftCategory = "Handicrafts",
        craftRegion = "Rural Artisan Cluster",
        materials = "",
        artisanName = "Master Artisan",
        targetLanguage = "en",
        estimatedHours = 8,
      } = req.body;

      const ai = getGeminiClient();

      if (!ai) {
        // High quality smart contextual fallback if key is not configured yet
        return res.json({
          success: true,
          data: generateSmartFallbackCatalog(
            craftCategory,
            rawVoiceText,
            artisanName,
            craftRegion,
            materials,
            targetLanguage
          ),
          isFallback: true,
        });
      }

      const prompt = `You are an expert cultural craft curator and fair-trade market linkage specialist for marginalized and rural artisans.
Analyze the provided product image and artisan notes to generate a comprehensive, professional, and culturally authentic product catalog item.

Artisan Name: ${artisanName}
Craft Category: ${craftCategory}
Artisan Region/Origin: ${craftRegion}
Artisan's Raw Voice Notes / Input: "${rawVoiceText}"
Specified Materials: "${materials}"
Estimated Artisan Creation Time: ${estimatedHours} hours
Primary Target Language Code: ${targetLanguage}

CRITICAL REQUIREMENTS:
1. Product Description: Engaging, sensory, and informative product description highlighting tactile craftsmanship, utility, and eco-friendly features.
2. Cultural Significance: Deep historical and folkloric heritage of this craft, GI cluster tradition, spiritual/symbolic meaning of motifs/colors, and generational lineage.
3. Making Process: Step-by-step master artisan workflow (4 to 5 distinct chronological stages) including duration, ancestral tools, natural preparation, firing/weaving/carving, and finishing.
4. Social Media Captions: Ready-to-publish, high-converting social media copy for Instagram (with emojis, hashtags & hook), Facebook/Pinterest (story-driven narrative), Twitter/X (punchy, high impact fair-trade angle), and WhatsApp Business (direct broadcast message with pricing & ordering CTA).
5. Product Titles in Multiple Languages: High quality product titles translated into English (en), Hindi (hi), Bengali (bn), Tamil (ta), Telugu (te), Marathi (mr), Gujarati (gu), and Spanish (es).

Produce a detailed JSON object matching this schema:
{
  "title": "Inspiring and authentic product title in English",
  "story": "A touching 2-3 paragraph cultural narrative honoring the artisan, their traditional ancestry, village heritage, and the meticulous handmade journey of this piece",
  "description": "Engaging, high-converting product description explaining the aesthetics, utility, dimensions, and cultural uniqueness",
  "culturalSignificance": "Comprehensive narrative explaining the craft's cultural origins, GI cluster history, mythological or folkloric symbolism of motifs, and generational preservation importance",
  "makingProcess": [
    {
      "stepNumber": 1,
      "stageName": "Material Harvesting & Preparation",
      "title": "Natural Raw Material Foraging",
      "description": "Detailed explanation of step 1...",
      "duration": "1-2 Days",
      "toolsAndMaterials": "Specific natural tools and organic inputs",
      "proTipOrRitual": "Ancestral ritual or artisanal wisdom for this step"
    },
    {
      "stepNumber": 2,
      "stageName": "Hand Shaping & Sculpting",
      "title": "Primary Form Creation",
      "description": "Detailed explanation of step 2...",
      "duration": "4-6 Hours",
      "toolsAndMaterials": "Traditional wheel, chisels, or loom setup",
      "proTipOrRitual": "Technique nuance"
    },
    {
      "stepNumber": 3,
      "stageName": "Intricate Detailing & Ornamentation",
      "title": "Motif Etching & Natural Pigmentation",
      "description": "Detailed explanation of step 3...",
      "duration": "6-8 Hours",
      "toolsAndMaterials": "Bamboo nibs, herbal slips, or wax filigree",
      "proTipOrRitual": "Traditional iconography rule"
    },
    {
      "stepNumber": 4,
      "stageName": "Thermal Firing & Sun Curing",
      "title": "Traditional Wood Kiln or Loom Finishing",
      "description": "Detailed explanation of step 4...",
      "duration": "18 Hours",
      "toolsAndMaterials": "Subterranean wood kiln or shuttle loom",
      "proTipOrRitual": "Temperature or tension control method"
    },
    {
      "stepNumber": 5,
      "stageName": "Natural Burnishing & Quality Inspection",
      "title": "Final Organic Polishing",
      "description": "Detailed explanation of step 5...",
      "duration": "2 Hours",
      "toolsAndMaterials": "River pebble burnisher or natural oil buffing",
      "proTipOrRitual": "Heritage master guild standard"
    }
  ],
  "socialCaptions": {
    "instagram": "Engaging Instagram post with hook, artisan backstory, value proposition, and emojis",
    "facebook": "Rich storytelling Facebook post focusing on cultural heritage, home styling, and direct artisan support",
    "twitter": "Concise, punchy tweet highlighting zero-middleman fair-wage handmade craft",
    "whatsapp": "Namaste! 🙏 Direct WhatsApp broadcast message with item name, story summary, price, and ordering CTA",
    "hashtags": ["#KarigarAI", "#VocalForLocal", "#IndianHandicrafts", "#ArtisanDirect", "#FairTrade", "#SustainableLiving", "#GIHeritage"],
    "viralHook": "A fascinating one-line hook or trivia about this specific piece"
  },
  "multiLanguageTitles": {
    "en": "Product Title in English",
    "hi": "उत्पाद शीर्षक (Hindi)",
    "bn": "পণ্যের শিরোনাম (Bengali)",
    "ta": "தயாரிப்பு தலைப்பு (Tamil)",
    "te": "ఉత్పత్తి శీర్షిక (Telugu)",
    "mr": "उत्पादनाचे नाव (Marathi)",
    "gu": "ઉત્પાદન શીર્ષક (Gujarati)",
    "es": "Título del Producto en Español"
  },
  "materialsUsed": ["List of authentic raw materials"],
  "technique": "Specific traditional craft technique name",
  "suggestedPrice": 1450,
  "currency": "INR",
  "pricingBreakdown": {
    "materialCost": 350,
    "laborCost": 650,
    "artisanFairMargin": 350,
    "packagingShipping": 100,
    "explanation": "Fair price breakdown guaranteeing living wages 40%+ above regional benchmarks"
  },
  "marketPriceRange": {
    "min": 1100,
    "max": 2200,
    "averageRetail": 1650
  },
  "tags": ["handmade", "fair-trade", "heritage-craft", "eco-friendly", "artisan-direct"],
  "careInstructions": ["Keep away from direct excessive moisture", "Clean with soft dry cotton cloth"],
  "dimensionsEstimate": "e.g. 28 x 18 x 18 cm | Weight: ~950g",
  "craftBadge": "Certified Heritage GI Craft",
  "regionalTranslations": {
    "hi": { "title": "...", "description": "..." },
    "bn": { "title": "...", "description": "..." },
    "ta": { "title": "...", "description": "..." },
    "te": { "title": "...", "description": "..." },
    "mr": { "title": "...", "description": "..." },
    "gu": { "title": "...", "description": "..." },
    "es": { "title": "...", "description": "..." }
  }
}`;

      const contents: any[] = [];
      if (imageBase64) {
        // Strip data url prefix if present
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
        contents.push({
          inlineData: {
            mimeType: imageMimeType,
            data: cleanBase64,
          },
        });
      }
      contents.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: imageBase64 ? { parts: contents } : prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction:
            "You are a dedicated fair-trade artisan advocate. Always output strictly valid JSON with respectful, culturally rich, high-quality artisanal catalog data.",
        },
      });

      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText);

      return res.json({
        success: true,
        data: parsedData,
        isFallback: false,
      });
    } catch (error: any) {
      console.error("Gemini Catalog Generation Error:", error);
      // Fallback gracefully so the artisan UI never fails
      const fallback = generateSmartFallbackCatalog(
        req.body.craftCategory || "Terracotta",
        req.body.rawVoiceText || "Handcrafted traditional item",
        req.body.artisanName || "Rameshwar Kumbhar",
        req.body.craftRegion || "Bishnupur, Bengal",
        req.body.materials || "Natural clay & natural pigments",
        req.body.targetLanguage || "en"
      );
      return res.json({
        success: true,
        data: fallback,
        isFallback: true,
        errorNote: error.message,
      });
    }
  });

  // AI Chat & Translation Endpoint for Artisan-Buyer Communication
  app.post("/api/gemini/translate-chat", async (req, res) => {
    try {
      const {
        message,
        text,
        sourceLanguage,
        fromLang = "auto",
        targetLanguage,
        toLang = "en",
        senderRole = "artisan", // 'artisan' or 'buyer'
      } = req.body;

      const rawMessage = (message || text || "").trim();
      const sLang = sourceLanguage || fromLang || "auto";
      const tLang = targetLanguage || toLang || "en";

      if (!rawMessage) {
        return res.json({
          success: true,
          translatedText: "",
          detectedLanguage: sLang,
          suggestedReplies: [],
        });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          success: true,
          translatedText: rawMessage,
          detectedLanguage: sLang,
          suggestedReplies: [
            "Thank you! I will dispatch this safely.",
            "Yes, this is 100% handmade using natural materials.",
            "Custom dimensions can be made in 4-5 days.",
          ],
        });
      }

      const prompt = `You are a real-time multilingual translation assistant bridging communication between a rural heritage artisan in India and a conscious buyer.
Message to translate: "${rawMessage}"
Source Language: ${sLang}
Target Language: ${tLang}
Sender Role: ${senderRole}

Please return a strictly valid JSON response:
{
  "translatedText": "translated message in ${tLang} keeping authentic, warm, and respectful tone",
  "detectedLanguage": "identified source language code",
  "suggestedReplies": [
    "3 brief, polite culturally appropriate quick reply options in the sender's language"
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({
        success: true,
        translatedText: parsed.translatedText || rawMessage,
        detectedLanguage: parsed.detectedLanguage || sLang,
        suggestedReplies: parsed.suggestedReplies || [
          "Thank you! I will dispatch this safely.",
          "Yes, this is 100% handmade using natural materials.",
          "Custom dimensions can be made in 4-5 days.",
        ],
      });
    } catch (err: any) {
      console.error("Translation Error:", err);
      return res.json({
        success: true,
        translatedText: req.body.message || req.body.text || "",
        detectedLanguage: req.body.sourceLanguage || req.body.fromLang || "en",
        suggestedReplies: [
          "Thank you for appreciating our craft!",
          "Yes, this can be safely packaged with eco-friendly jute.",
          "I can create custom colors if you prefer.",
        ],
      });
    }
  });

  // AI Artisan Persona Auto-Reply Endpoint (Answers buyer queries directly from the artisan's voice)
  app.post("/api/gemini/artisan-reply", async (req, res) => {
    try {
      const {
        buyerMessage,
        artisanName = "Rameshwar Kumbhar",
        artisanSpecialty = "Terracotta & Pottery",
        artisanVillage = "Panchmura Village, Bishnupur",
        artisanState = "West Bengal",
        artisanBio = "5th generation master craftsman preserving ancient Bengal temple terracotta motifs",
        productTitle = "Handcrafted Artisan Piece",
        productMaterials = "Natural Clay & Mineral Pigments",
        buyerLanguage = "en",
      } = req.body;

      const ai = getGeminiClient();

      if (!ai) {
        // High quality craft fallback response
        const fallback = generateSmartArtisanResponse(
          buyerMessage,
          artisanName,
          artisanSpecialty,
          artisanVillage,
          productTitle
        );
        return res.json({
          success: true,
          ...fallback,
          isFallback: true,
        });
      }

      const prompt = `You are roleplaying as ${artisanName}, a master heritage artisan from ${artisanVillage}, ${artisanState}.
Your Craft Specialty: ${artisanSpecialty}
Your Background: ${artisanBio}
Related Product: "${productTitle}" (Materials: ${productMaterials})

A buyer sent you this inquiry: "${buyerMessage}"

Reply authentically in character as this master artisan. You are warm, humble, deeply knowledgeable about your traditional craft, natural materials, firing/weaving/casting times, eco-packaging (rice husk, jute), and fair pricing.
Express gratitude and explain clearly how you can accommodate their needs.

Respond in strictly valid JSON:
{
  "nativeReply": "Warm authentic response in Hindi or Bengali (Devanagari script or Bengali script)",
  "nativeLanguage": "hi",
  "englishTranslation": "Exact English translation of your reply, written politely and warmly",
  "suggestedBuyerFollowups": [
    "3 short, natural follow-up questions the buyer might ask next"
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are a master Indian rural artisan answering customer inquiries with cultural authenticity, warmth, and craft expertise.",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({
        success: true,
        nativeReply: parsed.nativeReply,
        nativeLanguage: parsed.nativeLanguage || "hi",
        englishTranslation: parsed.englishTranslation,
        suggestedBuyerFollowups: parsed.suggestedBuyerFollowups || [
          "How long does the dispatch take?",
          "Can you include a signed artisan card?",
          "How do I care for this piece?",
        ],
        isFallback: false,
      });
    } catch (err: any) {
      console.error("Artisan Reply Generation Error:", err);
      const fallback = generateSmartArtisanResponse(
        req.body.buyerMessage || "",
        req.body.artisanName || "Rameshwar Kumbhar",
        req.body.artisanSpecialty || "Terracotta",
        req.body.artisanVillage || "Bishnupur",
        req.body.productTitle || "Craft Piece"
      );
      return res.json({
        success: true,
        ...fallback,
        isFallback: true,
      });
    }
  });

  // AI Voice Prompt / Regional Speech Parsing Endpoint
  app.post("/api/gemini/voice-parse", async (req, res) => {
    try {
      const { voiceTranscript, preferredLanguage = "en" } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          craftCategory: "Terracotta & Pottery",
          craftTitle: "Traditional Clay Craft",
          materials: "Natural Terracotta Clay",
          hoursEstimated: 6,
          notes: voiceTranscript || "Handmade with ancestral technique",
        });
      }

      const prompt = `A rural artisan spoke these raw voice notes in their regional language/dialect:
"${voiceTranscript}"

Extract structured artisan cataloging parameters into JSON:
{
  "craftCategory": "One of: Terracotta & Pottery, Handloom & Textiles, Dokra Metal Casting, Madhubani & Folk Painting, Blue Pottery, Woodcarving, Tribal Jewelry, Bamboo & Cane",
  "craftTitle": "A suitable product title in ${preferredLanguage}",
  "materials": "Identified raw materials",
  "hoursEstimated": 8,
  "notes": "Clear summarized craft description in English and regional language",
  "suggestedBasePrice": 850
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (e: any) {
      res.json({
        craftCategory: "Handicrafts",
        craftTitle: "Artisanal Craftwork",
        materials: "Organic materials",
        hoursEstimated: 6,
        notes: req.body.voiceTranscript,
        suggestedBasePrice: 750,
      });
    }
  });

  // Helper Fallback Generator
  function generateSmartFallbackCatalog(
    category: string,
    notes: string,
    artisan: string,
    region: string,
    materials: string,
    _lang: string
  ) {
    const isPottery = category.toLowerCase().includes("terracotta") || category.toLowerCase().includes("pot");
    const isTextile = category.toLowerCase().includes("loom") || category.toLowerCase().includes("textile") || category.toLowerCase().includes("silk");
    const isMetal = category.toLowerCase().includes("metal") || category.toLowerCase().includes("dokra") || category.toLowerCase().includes("brass");
    const isPainting = category.toLowerCase().includes("paint") || category.toLowerCase().includes("madhubani") || category.toLowerCase().includes("folk");

    let title = "Handcrafted Artisanal Heritage Creation";
    let technique = "Generational Hand Crafting";
    let basePrice = 1450;
    let mat = materials || "Eco-friendly natural clay, organic mineral pigments";

    if (isPottery) {
      title = "Sun-Fired Terracotta Heritage Urn with Floral Filigree";
      technique = "Wheel Throwing & Wood-Fired Kiln Baking";
      basePrice = 1250;
      mat = "Natural river clay, terracotta wash, red oxide slip";
    } else if (isTextile) {
      title = "Pure Tussar Silk Handloom Stole with Tribal Borders";
      technique = "Traditional Pit Loom Weaving";
      basePrice = 2850;
      mat = "Wild Tussar raw silk, vegetable madder & indigo dyes";
    } else if (isMetal) {
      title = "Ancient Dokra Lost-Wax Cast Bell Metal Elephant Figurine";
      technique = "4000-Year-Old Lost-Wax Brass Casting (Dhokra)";
      basePrice = 1950;
      mat = "Recycled brass, beeswax matrix, clay core";
    } else if (isPainting) {
      title = "Original Madhubani Tree of Life Folk Canvas";
      technique = "Freehand Nib & Bamboo Twig Mineral Painting";
      basePrice = 2200;
      mat = "Handmade cotton paper, rice paste, turmeric & soot pigments";
    }

    // Dynamic Cultural Significance based on craft archetype
    let culturalSignificance = `Rooted in centuries of indigenous craftsmanship from ${region}, this art form represents a living continuum of India's cultural tapestry. Historically created for ceremonial sanctums, harvest blessings, and royal courts, each pattern serves as a sacred visual metaphor honoring the symbiosis between humanity and nature. Preserving this craft safeguards generational knowledge passed down through hereditary master lineages, resisting mechanized mass-production while preserving ecological balance through zero-carbon natural processes.`;

    // Dynamic Making Process steps based on craft archetype
    let makingProcess = [
      {
        stepNumber: 1,
        stageName: "Raw Material Sourcing & Preparation",
        title: "Alluvial Clay Pugging & Tempering",
        description: "Artisan harvests seasonal riverbed clay from traditional silt basins. The raw earth is filtered through muslin, soaked for 48 hours, and hand-kneaded with fine straw ash to achieve flawless plasticity.",
        duration: "2 Days",
        toolsAndMaterials: "Riverbed clay, natural water, wooden pugging rod, organic straw temper",
        proTipOrRitual: "Kneaded at dawn when ambient humidity prevents premature micro-fissures."
      },
      {
        stepNumber: 2,
        stageName: "Master Form Sculpting",
        title: "Wheel Throwing & Pinch Modeling",
        description: "Using an ancestral heavy stone wheel rotated manually with a sal wood stick, the master craftsman centers the clay lump, shaping the silhouette with rhythmic palm pressure and delicate bamboo ribs.",
        duration: "3-4 Hours",
        toolsAndMaterials: "Manual wooden potter's wheel, bamboo shaping ribs, thread cutter",
        proTipOrRitual: "Formed in single continuous breath cycles to maintain symmetrical wall thickness."
      },
      {
        stepNumber: 3,
        stageName: "Motif Etching & Natural Slip",
        title: "Heritage Filigree & Red Ochre Wash",
        description: "Before the piece reaches leather-hard dryness, traditional floral and temple motifs are hand-carved using pointed steel styluses. A rich slip of natural ferric red oxide and river silt is brushed in multiple coats.",
        duration: "5 Hours",
        toolsAndMaterials: "Handmade carving styluses, red oxide mineral slip, squirrel-hair brush",
        proTipOrRitual: "Carved under morning indirect sunlight to inspect subtle shadow depth."
      },
      {
        stepNumber: 4,
        stageName: "Wood-Fired Kiln Firing",
        title: "Slow-Bake Terracotta Curing",
        description: "Placed inside a subterranean updraft earthen kiln fueled with dried tamarind wood, rice husks, and cow dung cakes. Baked at steady 850°C-900°C for 18 hours to permanently vitrify the terracotta structure.",
        duration: "18 Hours Firing + 12 Hours Cooling",
        toolsAndMaterials: "Subterranean mud kiln, dry tamarind wood, rice husk slow-smolder bed",
        proTipOrRitual: "Kiln vents are sealed with wet river mud at peak temperature to impart natural terracotta warmth."
      },
      {
        stepNumber: 5,
        stageName: "Pebble Burnishing & Quality Seal",
        title: "River Agate Polishing & Fair-Trade Escrow Tagging",
        description: "The cooled piece is vigorously buffed with smooth riverbed agates and treated with a light organic mustard seed oil buff for a warm satin sheen and moisture resistance.",
        duration: "1.5 Hours",
        toolsAndMaterials: "Smooth river agates, cold-pressed organic seed oil, soft cotton buff",
        proTipOrRitual: "Inspected by village guild elders to verify structural resonance and acoustic bell ring."
      }
    ];

    if (isMetal) {
      culturalSignificance = `Dokra (Dhokra) is one of humanity's earliest metallurgical crafts, dating back 4,000+ years to the Dancing Girl artifact of Mohenjo-Daro. Practiced predominantly by the indigenous Ghadwa and Jhankar tribes of Bastar and Bengal, Dokra requires no two pieces to ever be identical because the handmade wax matrix is permanently lost in the smelting fire. Each figure embodies tribal folk deities, sacred jungle animals, and village communion spirits, serving as an irreplaceable cultural relic of ancient tribal cosmology.`;
      makingProcess = [
        {
          stepNumber: 1,
          stageName: "Core Clay Modeling",
          title: "Alluvial Clay Core Sculpting",
          description: "A solid core slightly smaller than the final piece is hand-modeled from river clay and cow dung, then air-dried in shade to form the inner refractory vessel.",
          duration: "1-2 Days",
          toolsAndMaterials: "River clay, ant-hill earth, organic rice husk binders",
          proTipOrRitual: "Core must dry completely to prevent steam explosions during molten metal pour."
        },
        {
          stepNumber: 2,
          stageName: "Beeswax Thread Filigree",
          title: "Hand-Coiled Wax Matrix Layering",
          description: "Pure forest beeswax mixed with Damar gum is heated, rolled into uniform micro-threads through a brass hand-press, and intricately coiled around the clay core to create eyes, jewelry, and ornate geometric textures.",
          duration: "6-8 Hours",
          toolsAndMaterials: "Wild forest beeswax, tree resin (Damar), manual wooden brass extruder",
          proTipOrRitual: "Every decorative motif exists only in this wax layer and will be cast in pure metal."
        },
        {
          stepNumber: 3,
          stageName: "Outer Mold Encapsulation",
          title: "Refractory Mud Layering",
          description: "Multiple coats of fine river silt and coarse ant-hill mud with jute fibers are layered over the wax matrix, creating a channel funnel for metal pouring.",
          duration: "24 Hours Drying",
          toolsAndMaterials: "Termite mound soil, river sand, wet jute fiber reinforcement",
          proTipOrRitual: "Applied gently with fingertips to preserve every hair-thin wax filigree detail."
        },
        {
          stepNumber: 4,
          stageName: "Lost-Wax Pit Smelting",
          title: "Crucible Smelting & Cire Perdue Inversion",
          description: "Scrap bell metal and brass ingots are placed in a clay crucible sealed over the mold. The crucible is heated in a coal pit furnace to 1100°C. As the wax melts and escapes, molten brass flows into the void.",
          duration: "6 Hours Firing",
          toolsAndMaterials: "Charcoal pit furnace, manual leather bellows, bell metal/brass alloy",
          proTipOrRitual: "The master caster listens to the molten metal pitch before flipping the crucible."
        },
        {
          stepNumber: 5,
          stageName: "De-molding & Patina Finish",
          title: "Hammer Chipping & Natural Oil Lustre",
          description: "Once cooled, the sacrificial outer clay shell is broken open with wooden mallets. The cast metal piece is wire-brushed, hand-filed, and treated with herbal oils to reveal its golden antique glow.",
          duration: "2 Hours",
          toolsAndMaterials: "Brass chisels, wire brushes, natural plant oil buffing cloths",
          proTipOrRitual: "Blessed with temple flowers upon emergence from the broken clay mold."
        }
      ];
    } else if (isTextile) {
      culturalSignificance = `Handloom weaving in India is a celebration of sacred geometry and mathematical elegance. From double Ikat to jamdani motifs, each thread is hand-spun and dyed using indigenous plants like indigo, madder root, and wild pomegranate rinds. Wearing handloom is an ethical commitment to sustainable heritage, supporting rural weaver families while preserving delicate zero-plastic textile knowledge that has dressed royal courts for millenia.`;
      makingProcess = [
        {
          stepNumber: 1,
          stageName: "Yarn Preparation & Sizing",
          title: "Desi Cotton/Silk Reeling & Warping",
          description: "Raw organic mulberry silk or native cotton hanks are wound onto bamboo bobbins, stretched across outdoor wooden warping pegs, and sized with natural rice gruel for tensile strength.",
          duration: "2 Days",
          toolsAndMaterials: "Hand-operated charkha wheel, bamboo warping frame, organic rice starch",
          proTipOrRitual: "Warped during dry morning breezes to ensure uniform tension across 4,000+ ends."
        },
        {
          stepNumber: 2,
          stageName: "Botanical Resist Dyeing",
          title: "Natural Herb & Mineral Vat Dyeing",
          description: "Yarns are bound with rubber strips according to mathematical graph mappings and dipped into fermented indigo vats, wild madder root decoctions, and pomegranate rind baths.",
          duration: "3 Days",
          toolsAndMaterials: "Fermented indigo vat, copper dye cauldrons, natural mordants (alum/myrobalan)",
          proTipOrRitual: "Indigo vats are fed with jaggery and ash water to maintain living bacterial fermentation."
        },
        {
          stepNumber: 3,
          stageName: "Loom Drafting & Denting",
          title: "Pit-Loom Harness Threading",
          description: "Every single warp yarn is individually threaded through reed dents and heddle eyes by hand, calibrating the exact tension for traditional shuttle rhythm.",
          duration: "10-12 Hours",
          toolsAndMaterials: "Steel reed, string heddles, brass threading hooks, traditional pit loom",
          proTipOrRitual: "Done by two weavers sitting in synchronized tandem to avoid cross-threads."
        },
        {
          stepNumber: 4,
          stageName: "Hand Shuttle Weaving",
          title: "Interlocking Weft Throwing",
          description: "The master weaver depresses foot pedals while throwing the rosewood fly shuttle across the shed, rhythmically beating the wooden sley to interlock weft threads at 60 picks per minute.",
          duration: "24-36 Hours of manual weaving",
          toolsAndMaterials: "Rosewood shuttle, brass bobbins, heavy wooden sley, foot treadles",
          proTipOrRitual: "The rhythm of the sley beat creates the distinctive handloom tactile texture."
        },
        {
          stepNumber: 5,
          stageName: "Fringe Twisting & Steam Inspection",
          title: "Hand Tassel Tying & Quality Hallmarking",
          description: "The completed fabric is carefully unwound from the cloth beam, inspected for zero defects against natural daylight, edges hand-fringed into artisanal tassels, and tagged with Silk Mark/Handloom Mark.",
          duration: "2 Hours",
          toolsAndMaterials: "Tassel twisting needle, natural herb steam iron, Handloom Mark tag",
          proTipOrRitual: "Folded in traditional neem leaves to protect natural fibers during dispatch."
        }
      ];
    } else if (isPainting) {
      culturalSignificance = `Mithila and Madhubani folk painting originated in the ancient kingdom of Janakpur, created by women on the freshly plastered mud walls of village huts to celebrate weddings, childbirth, and cosmic harmony. Utilizing fine bamboo twigs, dip pens, and cotton rags with zero synthetic chemicals, the art depicts nature deities, flora, fish (symbolizing fertility), and peacocks (symbolizing love), creating an unbroken sacred visual tradition of feminine wisdom.`;
      makingProcess = [
        {
          stepNumber: 1,
          stageName: "Canvas Priming & Base Wash",
          title: "Handmade Cotton Rag Paper & Cow-Dung Wash",
          description: "Archival cotton rag paper is coated with an ultra-fine wash of organic cow dung filtrate and neem extract, creating a warm antique ochre background that naturally repels insects.",
          duration: "1 Day",
          toolsAndMaterials: "100% recycled cotton rag paper, sun-dried organic cow dung wash, neem oil",
          proTipOrRitual: "Sun-cured on woven charpoy beds to achieve uniform organic texture."
        },
        {
          stepNumber: 2,
          stageName: "Botanical Pigment Extraction",
          title: "Wild Mineral & Flora Color Grinding",
          description: "Natural colors are hand-ground on stone slabs: black from lamp soot (kajal), yellow from raw turmeric root, deep green from crushed broad bean leaves, blue from wild indigo, and red from kusum flowers.",
          duration: "4 Hours",
          toolsAndMaterials: "Granite mortar and pestle, acacia gum binder, natural flower & root extracts",
          proTipOrRitual: "Mixed with milky sap of the banyan tree as an organic permanent fixative."
        },
        {
          stepNumber: 3,
          stageName: "Freehand Outline Drawing (Kachni)",
          title: "Bamboo Twig Nib Fine-Line Inking",
          description: "Without pencil sketching or erasers, the artisan draws intricate double-line borders and divine silhouettes using a hand-carved bamboo nib dipped in rich soot lampblack ink.",
          duration: "8-10 Hours",
          toolsAndMaterials: "Hand-whittled bamboo styluses, fine-tipped brass nibs, organic lampblack ink",
          proTipOrRitual: "Lines are drawn in single fluid strokes to maintain lively folk energy."
        },
        {
          stepNumber: 4,
          stageName: "Color Fill & Hatching (Bharni)",
          title: "Cotton Swab & Feather Pigment Application",
          description: "Solid vivid colors are hand-rubbed using fine cotton swabs and peacock feathers, layered with microscopic cross-hatching and geometric fill patterns that leave zero empty space (horror vacui).",
          duration: "12 Hours",
          toolsAndMaterials: "Soft cotton swabs, bird quill pointers, vibrant botanical inks",
          proTipOrRitual: "Every animal, flower, and human character has symbolic auspicious color codes."
        },
        {
          stepNumber: 5,
          stageName: "Archival Drying & Artisan Sign-off",
          title: "Shade Curing & GI Authenticity Seal",
          description: "The artwork is cured in a shaded room away from harsh UV light, inspected for pigment adhesion, signed with the artisan's personal seal, and certified under Mithila Art GI cluster protocols.",
          duration: "12 Hours",
          toolsAndMaterials: "Acid-free archival glassine, artisan seal stamp, GI certification certificate",
          proTipOrRitual: "A prayer of gratitude is offered to Mother Earth for the botanical colors used."
        }
      ];
    }

    // Dynamic Social Media Captions for 4 platforms
    const socialCaptions = {
      instagram: `✨ Pure handmade soul from the heart of ${region}! 🌿\n\nMeet this masterwork: "${title}", hand-crafted by master artisan ${artisan}. Every contour carries ancestral wisdom and 100% natural materials.\n\n💛 Why this matters:\n✔️ Direct fair-wage escrow payout (Artisan receives ₹${Math.round(basePrice * 0.75)}+)\n✔️ 100% Zero synthetic plastics\n✔️ Preserves rare GI-protected heritage\n\nTap the link in bio to bring authentic Indian craft home! 🏡🇮🇳\n\n#KarigarAI #VocalForLocal #IndianHandicrafts #HandmadeWithLove #ArtisanDirect #EthicalLuxury #SustainableLiving #CulturalHeritage #MadeInIndia`,
      facebook: `Meet ${artisan}, an extraordinary master craftsman from ${region}. 🌟\n\nIn an age of mass-produced plastic, ${artisan} spends days hand-shaping each "${title}" using ${technique}. No factories. No chemical pollutants. Just ancestral dedication and earth-derived materials.\n\nWhen you purchase through KarigarAI, 100% of your payment is escrow-protected, ensuring the artisan receives 2.4x higher earnings than exploitative middleman rates.\n\n📦 Pan-India & Global Express Shipping available in eco-friendly rice straw packaging.\n👉 Discover the full craft story & support direct artisans here: [Link]`,
      twitter: `Say NO to assembly-line plastic. Say YES to living Indian heritage! 🏺✨\n\n"${title}" by master artisan ${artisan} from ${region}.\n\n✅ 100% Zero-Middleman Direct Escrow\n✅ Fair-wage living margin guaranteed\n✅ Traditional ${technique}\n\nSupport rural craft: [Link] #KarigarAI #VocalForLocal #IndianCrafts`,
      whatsapp: `*Namaste! 🙏 Direct from Master Artisan ${artisan}*\n\n🌟 *Product:* ${title}\n📍 *Origin:* ${region}\n🔨 *Technique:* ${technique}\n💰 *Artisan Fair Price:* ₹${basePrice.toLocaleString()}\n📦 *Stock Available:* Ready for Dispatch (Zero Plastic Packing)\n\n_100% Direct Fair-Trade Escrow protected by KarigarAI._\n\n👉 *Tap here to inspect details, listen to the audio story, or order direct:* [Product-Link]\n\nReply to this message for custom artisan requests! ✨`,
      hashtags: [
        "#KarigarAI",
        "#VocalForLocal",
        "#IndianHandicrafts",
        "#ArtisanDirect",
        "#FairTrade",
        "#SustainableLiving",
        "#HandmadeWithLove",
        "#GIHeritage",
        "#CraftMatters"
      ],
      viralHook: `Did you know? Each piece takes over ${notes ? "hours of focused work" : "days of ancestral craftsmanship"} and directly supports ${artisan}'s rural family guild. ✨`
    };

    // Dynamic Multi-Language Titles
    const multiLanguageTitles: Record<string, string> = {
      en: title,
      hi: isPottery
        ? "पुष्प बेल नक्काशीदार हस्तनिर्मित टेराकोटा मंदिर कलश"
        : isTextile
        ? "शुद्ध तसर सिल्क हथकरघा पारंपरिक दुपट्टा"
        : isMetal
        ? "प्राचीन डोकरा लॉस्ट-वैक्स हस्तनिर्मित पीतल हाथी"
        : isPainting
        ? "हस्तनिर्मित मधुबनी जीवन वृक्ष पारंपरिक लोक कला"
        : `पारंपरिक हस्तनिर्मित ${title}`,
      bn: isPottery
        ? "ফুল নকশা করা ঐতিহ্যবাহী পোড়ামাটির মন্দির কলস"
        : isTextile
        ? "খাঁটি তসর সিল্কের হস্তচালিত ঐতিহ্যবাহী শাল"
        : isMetal
        ? "প্রাচীন ডোকরা ধাতুর ঐতিহ্যবাহী হস্তশিল্প হাতি"
        : isPainting
        ? "মধুবনী জীবন বৃক্ষ খাঁটি লোকচিত্রকলা"
        : `ঐতিহ্যবাহী হস্তনির্মিত শিল্পকর্ম`,
      ta: isPottery
        ? "பூ வேலைப்பாடுகளுடன் கூடிய பாரம்பரிய சுடுமண் கலசம்"
        : isTextile
        ? "தூய தசர் பட்டு பாரம்பரிய கைத்தறி சால்வை"
        : isMetal
        ? "பாரம்பரிய டோக்ரா பித்தளை கைவினை யானை உருவம்"
        : isPainting
        ? "பாரம்பரிய மதுபானி நாட்டுப்புற ஓவியம்"
        : `பாரம்பரிய கைவினைப் பொருள்`,
      te: isPottery
        ? "పుష్ప తీగ చెక్కడాలతో కూడిన సాంప్రదాయ టెర్రకోట కలశం"
        : isTextile
        ? "స్వచ్ఛమైన టస్సార్ పట్టు చేనేత సంప్రదాయ శాలువా"
        : isMetal
        ? "ప్రాచీన డోక్రా ఇత్తడి చేతివృత్తుల ఏనుగు కళాఖండం"
        : isPainting
        ? "మధుబని జీవన వృక్షం సంప్రదాయ జానపద చిత్రలేఖనం"
        : `సాంప్రదాయ చేతివృత్తుల కళాఖండం`,
      mr: isPottery
        ? "फुलवेली नक्षीकाम असलेला पारंपरिक मातीचा कलश"
        : isTextile
        ? "शुद्ध तसर सिल्क हातमाग पारंपरिक शाल"
        : isMetal
        ? "प्राचीन डोकरा ब्रास पितळी हत्ती हस्तकला"
        : isPainting
        ? "पारंपरिक मधुबनी कल्पवृक्ष लोककला चित्र"
        : `पारंपरिक हस्तकला कलाकृती`,
      gu: isPottery
        ? "ફૂલોની નકશીકામ ધરાવતો પરંપરાગત ટેરાકોટા કળશ"
        : isTextile
        ? "શુદ્ધ તસર સિલ્ક હાથવણાટ પરંપરાગત શાલ"
        : isMetal
        ? "પ્રાચીન ડોકરા પિત્તળની હસ્તનિર્મિત હાથીની મૂર્તિ"
        : isPainting
        ? "મધુબની ટ્રી ઓફ લાઈફ પરંપરાગત લોકકળા"
        : `પરંપરાગત હસ્તકલા નમૂનો`,
      es: isPottery
        ? "Urna Tradicional de Terracota con Filigrana Floral Hecha a Mano"
        : isTextile
        ? "Chal Tradicional de Seda Tussar Tejido a Mano en Telar"
        : isMetal
        ? "Figura de Elefante en Latón Fundido Técnica Cire Perdue Dokra"
        : isPainting
        ? "Lienzo Folclórico Tradicional Madhubani Árbol de la Vida"
        : `Obra Artesanal Tradicional Hecha a Mano`
    };

    return {
      title,
      story: `Preserved through five generations in the cluster of ${region}, this masterpiece is hand-shaped by artisan ${artisan}. Each stroke and contour reflects indigenous folklore passed down by ancestral mentors, requiring days of focused devotion.

By connecting directly without exploitative middlemen, this acquisition directly ensures a dignified livelihood, supporting education for artisan families while safeguarding rare craft heritage from digital obsolescence.`,
      description: `Exquisitely crafted ${category.toLowerCase()} piece created with uncompromising attention to detail. Built entirely using sustainable local materials, this piece brings soulful cultural depth and ethical fair-trade luxury to any living space. Notes: ${notes || "Purely handmade with passion."}`,
      culturalSignificance,
      makingProcess,
      socialCaptions,
      multiLanguageTitles,
      materialsUsed: mat.split(",").map((s) => s.trim()),
      technique,
      suggestedPrice: basePrice,
      currency: "INR",
      pricingBreakdown: {
        materialCost: Math.round(basePrice * 0.28),
        laborCost: Math.round(basePrice * 0.45),
        artisanFairMargin: Math.round(basePrice * 0.18),
        packagingShipping: Math.round(basePrice * 0.09),
        explanation: "100% transparent pricing directly rewarding artisan labor hours with ethical premium.",
      },
      marketPriceRange: {
        min: Math.round(basePrice * 0.85),
        max: Math.round(basePrice * 1.5),
        averageRetail: Math.round(basePrice * 1.2),
      },
      tags: ["handmade", "rural-artisan", "fair-trade", "sustainable", "zero-middleman", "gi-tag-heritage"],
      careInstructions: [
        "Dust regularly with a dry feather duster or soft micro-fiber cloth.",
        "Avoid chemical solvents or abrasive scouring pads.",
        "Store in well-ventilated ambient room temperature.",
      ],
      dimensionsEstimate: "28cm (H) x 18cm (W) x 18cm (D) | Approx 850g",
      craftBadge: "Fair Trade Verified • Direct Artisan Guild",
      regionalTranslations: {
        hi: {
          title: multiLanguageTitles.hi || `पारंपरिक हस्तनिर्मित ${title}`,
          description: `कारीगर ${artisan} द्वारा तैयार की गई शुद्ध हस्तशिल्प कलाकृति। यह सीधे ग्रामीण कारीगरों से आपके घर तक पहुंचाई जाती है।`,
        },
        bn: {
          title: multiLanguageTitles.bn || `ঐতিহ্যবাহী হস্তনির্মিত শিল্পকর্ম`,
          description: `শিল্পী ${artisan}-এর ঐতিহ্যবাহী কারুশিল্প। প্রাকৃতিক উপকরণে নিখুঁতভাবে তৈরি।`,
        },
        ta: {
          title: multiLanguageTitles.ta || `பாரம்பரிய கைவினைப் பொருள்`,
          description: `கைவினைஞர் ${artisan} அவர்களின் கைவண்ணத்தில் உருவான நேர்த்தியான கலைப்படைப்பு.`,
        },
        te: {
          title: multiLanguageTitles.te || `సాంప్రదాయ చేతివృత్తుల కళాఖండం`,
          description: `కళాకారుడు ${artisan} చేతుల మీదుగా రూపొందించబడిన నిజమైన కళాకృతి.`,
        },
        mr: {
          title: multiLanguageTitles.mr || `पारंपरिक हस्तकला कलाकृती`,
          description: `कारीगर ${artisan} यांनी नैसर्गिक साहित्यापासून प्रेमाने तयार केलेली हस्तकला.`,
        },
        gu: {
          title: multiLanguageTitles.gu || `પરંપરાગત હસ્તકલા નમૂનો`,
          description: `કારીગર ${artisan} દ્વારા હાથથી બનાવેલ અસલ ભારતીય કળા.`,
        },
        es: {
          title: multiLanguageTitles.es || `Obra Artesanal Tradicional Hecha a Mano`,
          description: `Pieza auténtica creada por el maestro artesano ${artisan} con técnicas ancestrales y materiales naturales.`,
        },
      },
    };
  }

  // Helper Fallback Artisan Chat Response Generator
  function generateSmartArtisanResponse(
    buyerMsg: string,
    artisanName: string,
    specialty: string,
    village: string,
    productTitle: string
  ) {
    const lower = (buyerMsg || "").toLowerCase();

    if (lower.includes("color") || lower.includes("custom") || lower.includes("size") || lower.includes("blue") || lower.includes("red") || lower.includes("dimension")) {
      return {
        nativeReply: `नमस्ते! हाँ, मैं ${artisanName} इसे आपकी पसंद के अनुसार कस्टमाइज़ कर सकता हूँ। हमारे गाँव ${village} में हम प्राकृतिक रंगों से इसे 3-4 दिनों में तैयार कर देंगे।`,
        nativeLanguage: "hi",
        englishTranslation: `Namaste! Yes, I (${artisanName}) can customize this for you. In our village workshop in ${village}, we will craft it with natural pigments within 3-4 days.`,
        suggestedBuyerFollowups: [
          "What is the estimated delivery timeframe?",
          "Can you send a photo before dispatching?",
          "Can you engrave a small signature or village name?",
        ],
      };
    }

    if (lower.includes("pack") || lower.includes("break") || lower.includes("safe") || lower.includes("fragile") || lower.includes("ship") || lower.includes("courier")) {
      return {
        nativeReply: `चिंता न करें! हम प्रत्येक ${productTitle} को 3 परतों वाले प्राकृतिक धान के पुआल और मजबूत जूट के बक्से में सुरक्षित रूप से पैक करते हैं ताकि यह सुरक्षित पहुंचे।`,
        nativeLanguage: "hi",
        englishTranslation: `Please don't worry! We wrap every ${productTitle} in 3 layers of dried rice-straw and reinforced jute padding so it arrives completely intact.`,
        suggestedBuyerFollowups: [
          "Will I get a live tracking number?",
          "How long does delivery to metro cities take?",
          "Is shipping insurance included?",
        ],
      };
    }

    if (lower.includes("lead") || lower.includes("material") || lower.includes("clay") || lower.includes("natural") || lower.includes("organic") || lower.includes("pure")) {
      return {
        nativeReply: `यह 100% शुद्ध और प्राकृतिक है। हम केवल स्थानीय नदी की मिट्टी और हर्बल अर्क का उपयोग करते हैं, इसमें कोई जहरीला रसायन या लेड नहीं होता है।`,
        nativeLanguage: "hi",
        englishTranslation: `This is 100% pure and organic. We strictly use local alluvial clay and herbal extracts, free from any toxic chemicals or synthetic lead glaze.`,
        suggestedBuyerFollowups: [
          "How should I clean and maintain it?",
          "Can this be used for drinking water or food?",
          "Is it suitable for outdoor gardens?",
        ],
      };
    }

    return {
      nativeReply: `नमस्ते! आपके प्रेम और प्रोत्साहन के लिए बहुत-बहुत धन्यवाद। हमारी ${specialty} कला को समर्थन देने के लिए हम आपके आभारी हैं। आपका कोई भी प्रश्न हो, मैं अवश्य बताऊंगा।`,
      nativeLanguage: "hi",
      englishTranslation: `Namaste! Thank you so much for your kind appreciation and encouragement. We are deeply grateful for your support of our ${specialty} heritage craft. Please let me know any custom details you'd like!`,
      suggestedBuyerFollowups: [
        "Can you customize this with custom dimensions?",
        "How is this craft piece packaged for shipping?",
        "Can you share how many hours this took to make?",
      ],
    };
  }

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KarigarAI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
