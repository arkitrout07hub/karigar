import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CameraCaptureModal } from './CameraCaptureModal';
import {
  Send,
  MessageSquare,
  Globe,
  Sparkles,
  Volume2,
  Image as ImageIcon,
  Camera,
  Mic,
  MicOff,
  Trash2,
  Plus,
  ShoppingBag,
  ExternalLink,
  Info,
  CheckCheck,
  Languages,
  X,
  Paperclip,
  Check,
  ShieldCheck,
  MapPin,
  Bot,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DirectMessagingView: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    messages,
    sendMessage,
    startConversationWithArtisan,
    isArtisanTyping,
    deleteMessage,
    clearConversation,
    artisans,
    products,
    setSelectedProduct,
    setSelectedArtisan,
    addToCart,
    role,
    language,
    t,
    speakText,
    isSpeaking,
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);
  const [showAttachmentPicker, setShowAttachmentPicker] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Active conversation object
  const activeConv =
    conversations.find((c) => c.id === activeConversationId) ||
    conversations[0] ||
    null;

  // Active artisan & active product
  const activeArtisan = artisans.find((a) => a.id === activeConv?.artisanId) || artisans[0];
  const activeProduct = products.find((p) => p.id === activeConv?.productId) || null;

  // Filtered messages for this conversation
  const convMessages = activeConv
    ? messages.filter((m) => m.conversationId === activeConv.id)
    : [];

  // Scroll to bottom on new message or typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convMessages.length, isArtisanTyping]);

  // Voice dictation setup
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessageInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Speech recognition error:", e);
      setIsListening(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!messageInput.trim() && !selectedAttachment) || !activeConv) return;

    const textToSend = messageInput.trim();
    const attachmentToSend = selectedAttachment || undefined;

    setMessageInput('');
    setSelectedAttachment(null);
    setShowAttachmentPicker(false);

    await sendMessage(
      textToSend,
      activeConv.id,
      activeProduct
        ? {
            id: activeProduct.id,
            title: activeProduct.title,
            image: activeProduct.primaryImage,
            price: activeProduct.price,
          }
        : undefined,
      attachmentToSend
    );
  };

  const handleQuickFollowupClick = (question: string) => {
    if (!activeConv) return;
    sendMessage(question, activeConv.id);
  };

  // Sample craft attachments for testing buyer inquiry
  const sampleAttachments = [
    {
      title: "Clay Texture Specimen",
      url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Living Room Placement Reference",
      url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Natural Indigo Pigment Sample",
      url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Custom Motif Carving Request",
      url: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const quickReplies =
    role === 'buyer'
      ? [
          'Can you customize this with custom dimensions?',
          'Is this 100% natural clay and lead-free?',
          'How is this fragile piece safely packed for delivery?',
          'Could you sign the base of the craft with your village name?',
          'Can you make this in an indigo blue or terracotta wash?',
        ]
      : [
          'नमस्ते! हाँ, हम इसे 3-4 दिनों में प्राकृतिक रंगों से तैयार कर देंगे।',
          'We use 100% organic herbal pigments and thick rice-straw protection.',
          'Your parcel is ready and will be dispatched via India SpeedPost.',
          'Thank you for directly supporting our village handloom guild!',
        ];

  // Filter conversations based on search
  const filteredConversations = conversations.filter((c) => {
    const name = role === 'buyer' ? c.artisanName : c.buyerName;
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div id="direct-messaging-view" className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 pt-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-serif italic font-bold text-[#1A1A1A] dark:text-[#F5F3EF] flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#5A5A40] dark:text-[#C8C7B8]" />
              {t.messages} • Direct Artisan Guild Hub
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              Gemini 3.7 Flash Live Translator
            </span>
          </div>
          <p className="text-xs text-[#5A5A40] dark:text-[#C8C7B8] mt-1">
            Converse directly with master craftspersons in their regional dialects with real-time bidirectional translation.
          </p>
        </div>

        <button
          id="btn-new-artisan-chat"
          onClick={() => setShowNewChatModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-semibold shadow-2xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Message Another Artisan
        </button>
      </div>

      {/* Main Messaging Layout Container */}
      <div className="bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px] max-h-[820px]">
        {/* Left Column: Conversation Directory */}
        <div className="md:col-span-4 lg:col-span-4 border-r border-[#E5E2DD] dark:border-[#383632] flex flex-col bg-[#FAF9F7] dark:bg-[#1E1D1A]">
          {/* Thread Search Box */}
          <div className="p-3 border-b border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dialogues or craft..."
              className="w-full px-3 py-1.5 rounded-lg border border-[#E5E2DD] dark:border-[#383632] bg-[#FAF9F7] dark:bg-[#2C2A26] text-xs text-[#1A1A1A] dark:text-[#F5F3EF] placeholder-[#A5A29D] focus:ring-1 focus:ring-[#5A5A40] focus:outline-none"
            />
          </div>

          <div className="p-2.5 border-b border-[#E5E2DD] dark:border-[#383632] flex items-center justify-between font-bold text-[10px] uppercase tracking-wider text-[#A5A29D]">
            <span>Active Conversations ({filteredConversations.length})</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Guild
            </span>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E5E2DD] dark:divide-[#383632]">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-[#A5A29D] text-xs">
                No active conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const artisan = artisans.find((a) => a.id === conv.artisanId);
                const isSelected = conv.id === activeConv?.id;
                const otherPartyName =
                  role === 'buyer' ? conv.artisanName : conv.buyerName;
                const avatar =
                  artisan?.avatar ||
                  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80';

                return (
                  <button
                    key={conv.id}
                    id={`conv-tab-${conv.id}`}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full p-3 text-left flex items-start gap-3 transition-colors ${
                      isSelected
                        ? 'bg-[#EFECE6] dark:bg-[#2C2A26] border-l-4 border-l-[#5A5A40]'
                        : 'hover:bg-[#F5F2ED]/70 dark:hover:bg-[#2C2A26]/50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={avatar}
                        alt={otherPartyName}
                        className="w-10 h-10 rounded-xl object-cover border border-[#E5E2DD] dark:border-[#383632]"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#22211E] rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF] truncate">
                          {otherPartyName}
                        </h4>
                        <span className="text-[10px] text-[#A5A29D] shrink-0 ml-1">
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      {artisan && (
                        <p className="text-[10px] text-[#5A5A40] dark:text-[#C8C7B8] font-medium truncate mb-1">
                          {artisan.craftSpecialty} • {artisan.village}
                        </p>
                      )}

                      <p className="text-[11px] text-[#787570] dark:text-[#A5A29D] truncate">
                        {conv.lastMessage || 'Tap to start conversation...'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Window */}
        {activeConv ? (
          <div className="md:col-span-8 lg:col-span-8 flex flex-col justify-between h-full bg-[#FDFCFB] dark:bg-[#22211E]">
            {/* Active Chat Header */}
            <div className="p-3.5 border-b border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedArtisan(activeArtisan)}
                  className="relative group focus:outline-none"
                  title="View Artisan Full Profile & Ancestral Story"
                >
                  <img
                    src={activeArtisan?.avatar}
                    alt={activeArtisan?.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#5A5A40] group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
                </button>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-[#F5F3EF]">
                      {role === 'buyer' ? activeConv.artisanName : activeConv.buyerName}
                    </h3>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] border border-[#E5E2DD] dark:border-[#383632]">
                      <ShieldCheck className="w-2.5 h-2.5 text-[#5A5A40]" />
                      Verified Karigar
                    </span>
                  </div>

                  <p className="text-[11px] text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{activeArtisan?.village}, {activeArtisan?.state}</span>
                    <span>•</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                      Live in Workshop
                    </span>
                  </p>
                </div>
              </div>

              {/* Right side controls */}
              <div className="flex items-center gap-2">
                {activeProduct && (
                  <button
                    onClick={() => setSelectedProduct(activeProduct)}
                    className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF9F7] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-[11px] font-semibold text-[#1A1A1A] dark:text-[#F5F3EF] hover:border-[#5A5A40] transition-colors"
                  >
                    <img
                      src={activeProduct.primaryImage}
                      alt={activeProduct.title}
                      className="w-4 h-4 rounded object-cover"
                    />
                    <span className="truncate max-w-[120px]">{activeProduct.title}</span>
                    <ExternalLink className="w-3 h-3 text-[#A5A29D]" />
                  </button>
                )}

                <div className="px-2.5 py-1 rounded-lg bg-[#FAF9F7] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-[11px] text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-[#5A5A40] dark:text-[#C8C7B8]" />
                  <span className="font-semibold">AI Bridge Active</span>
                </div>

                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="p-1.5 rounded-lg text-[#A5A29D] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Clear conversation history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Product Snapshot Banner if inquiry was initiated from a product */}
            {activeProduct && (
              <div className="px-4 py-2 bg-[#FAF9F7] dark:bg-[#2C2A26] border-b border-[#E5E2DD] dark:border-[#383632] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activeProduct.primaryImage}
                    alt={activeProduct.title}
                    className="w-9 h-9 rounded-lg object-cover border border-[#E5E2DD] dark:border-[#383632]"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#A5A29D]">
                      Inquiring About Craft Item:
                    </span>
                    <p className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                      {activeProduct.title} • ₹{activeProduct.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addToCart(activeProduct)}
                    className="px-2.5 py-1 rounded-md bg-[#5A5A40] hover:bg-[#484833] text-white text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setSelectedProduct(activeProduct)}
                    className="px-2 py-1 rounded-md border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] text-[11px] text-[#5A5A40] dark:text-[#C8C7B8] hover:border-[#5A5A40]"
                  >
                    Details
                  </button>
                </div>
              </div>
            )}

            {/* Chat Stream Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {convMessages.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-full bg-[#F5F2ED] dark:bg-[#2C2A26] flex items-center justify-center mx-auto mb-3 text-[#5A5A40] dark:text-[#C8C7B8]">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-[#1A1A1A] dark:text-[#F5F3EF]">
                    Begin your conversation with {activeConv.artisanName}
                  </h4>
                  <p className="text-xs text-[#787570] dark:text-[#A5A29D] max-w-sm mx-auto mt-1">
                    Ask about custom dimensions, natural clay washes, packaging fragility, or generational craft heritage.
                  </p>
                </div>
              ) : (
                convMessages.map((msg) => {
                  const isMe =
                    (role === 'buyer' && msg.senderRole === 'buyer') ||
                    (role === 'artisan' && msg.senderRole === 'artisan');

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col group ${
                        isMe ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-end gap-2 max-w-[90%] sm:max-w-xl">
                        {!isMe && (
                          <img
                            src={activeArtisan?.avatar}
                            alt={activeConv.artisanName}
                            className="w-7 h-7 rounded-full object-cover border border-[#5A5A40] shrink-0 mb-1"
                          />
                        )}

                        <div
                          className={`p-3.5 rounded-2xl text-xs space-y-2 shadow-2xs ${
                            isMe
                              ? 'bg-[#5A5A40] text-white rounded-br-xs'
                              : 'bg-white dark:bg-[#2C2A26] text-[#1A1A1A] dark:text-[#F5F3EF] border border-[#E5E2DD] dark:border-[#383632] rounded-bl-xs'
                          }`}
                        >
                          {/* Attached Image if any */}
                          {msg.attachmentImage && (
                            <div className="rounded-xl overflow-hidden mb-2 border border-black/10">
                              <img
                                src={msg.attachmentImage}
                                alt="Shared Attachment"
                                className="w-full max-h-48 object-cover"
                              />
                            </div>
                          )}

                          {/* Message Text */}
                          <p className="leading-relaxed whitespace-pre-wrap text-[13px]">
                            {msg.text}
                          </p>

                          {/* AI Dual Language Translation Box */}
                          {msg.translatedText && msg.translatedText !== msg.text && (
                            <div
                              className={`pt-2 border-t text-[11px] flex items-start gap-1.5 ${
                                isMe
                                  ? 'border-white/20 text-stone-200'
                                  : 'border-[#E5E2DD] dark:border-[#383632] text-[#5A5A40] dark:text-[#C8C7B8]'
                              }`}
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <span className="font-semibold block text-[10px] uppercase tracking-wider opacity-80">
                                  {isMe
                                    ? 'Translated for Artisan (Regional Dialect):'
                                    : 'AI English Translation:'}
                                </span>
                                <p className="italic font-sans mt-0.5 leading-normal">
                                  "{msg.translatedText}"
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Suggested Follow-up Quick Action Chips inside Artisan Reply */}
                          {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && !isMe && (
                            <div className="pt-2 border-t border-[#E5E2DD] dark:border-[#383632] space-y-1.5">
                              <span className="text-[10px] uppercase font-bold text-[#A5A29D] block">
                                Suggested Buyer Inquiries:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {msg.suggestedFollowups.map((followup, fIdx) => (
                                  <button
                                    key={fIdx}
                                    onClick={() => handleQuickFollowupClick(followup)}
                                    className="text-left px-2.5 py-1 rounded-lg bg-[#FAF9F7] dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] text-[11px] text-[#5A5A40] dark:text-[#C8C7B8] hover:border-[#5A5A40] hover:text-[#1A1A1A] dark:hover:text-white transition-all flex items-center gap-1"
                                  >
                                    <span>{followup}</span>
                                    <Send className="w-2.5 h-2.5 opacity-60 shrink-0" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Delete message action on hover */}
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#A5A29D] hover:text-red-600 transition-opacity"
                          title="Delete message"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Timestamp & Read Aloud Audio */}
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[#A5A29D] px-2">
                        <span>{msg.timestamp}</span>
                        <button
                          onClick={() => speakText(msg.translatedText || msg.text)}
                          className="hover:text-[#5A5A40] dark:hover:text-[#C8C7B8] flex items-center gap-0.5"
                          title="Listen with native pronunciation"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Listen</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Artisan Typing Animation Indicator */}
              <AnimatePresence>
                {isArtisanTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-end gap-2"
                  >
                    <img
                      src={activeArtisan?.avatar}
                      alt={activeConv.artisanName}
                      className="w-7 h-7 rounded-full object-cover border border-[#5A5A40]"
                    />
                    <div className="p-3 rounded-2xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] rounded-bl-xs flex items-center gap-2 shadow-2xs">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#5A5A40] rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-[#5A5A40] rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-[#5A5A40] rounded-full animate-bounce" />
                      </div>
                      <span className="text-[11px] italic text-[#5A5A40] dark:text-[#C8C7B8]">
                        {activeConv.artisanName} is composing a reply from village workshop...
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2 bg-[#FAF9F7] dark:bg-[#2C2A26] border-t border-[#E5E2DD] dark:border-[#383632] flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
              <span className="text-[10px] text-[#A5A29D] uppercase font-bold shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Prompt:
              </span>
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => setMessageInput(reply)}
                  className="whitespace-nowrap px-3 py-1 rounded-full bg-white dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] text-[11px] text-[#5A5A40] dark:text-[#C8C7B8] hover:border-[#5A5A40] hover:bg-[#F5F2ED] transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Attachment Preview Box if photo is selected */}
            {selectedAttachment && (
              <div className="px-4 py-2 bg-[#F5F2ED] dark:bg-[#2C2A26] border-t border-[#E5E2DD] dark:border-[#383632] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={selectedAttachment}
                    alt="Attachment Preview"
                    className="w-10 h-10 rounded-lg object-cover border border-[#5A5A40]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                      Image Attachment Attached
                    </span>
                    <p className="text-[10px] text-[#5A5A40]">Ready to send with message</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAttachment(null)}
                  className="p-1 rounded-full text-[#A5A29D] hover:text-red-600 hover:bg-white dark:hover:bg-[#22211E]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Message Input Box Form */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white dark:bg-[#22211E] border-t border-[#E5E2DD] dark:border-[#383632] flex items-center gap-2"
            >
              {/* Attachment Picker Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAttachmentPicker(!showAttachmentPicker)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    selectedAttachment
                      ? 'border-[#5A5A40] bg-[#F5F2ED] text-[#5A5A40]'
                      : 'border-[#E5E2DD] dark:border-[#383632] text-[#787570] hover:border-[#5A5A40]'
                  }`}
                  title="Attach craft reference photo"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                {/* Attachment Selector Popup */}
                {showAttachmentPicker && (
                  <div className="absolute bottom-12 left-0 w-72 p-3 bg-white dark:bg-[#22211E] rounded-2xl border border-[#E5E2DD] dark:border-[#383632] shadow-xl z-20 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                      <span>Attach Photo Reference</span>
                      <button
                        onClick={() => setShowAttachmentPicker(false)}
                        className="text-[#A5A29D] hover:text-[#1A1A1A]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {sampleAttachments.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedAttachment(item.url);
                            setShowAttachmentPicker(false);
                          }}
                          className="text-left p-1.5 rounded-lg border border-[#E5E2DD] dark:border-[#383632] hover:border-[#5A5A40] transition-colors group"
                        >
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-14 rounded object-cover mb-1"
                          />
                          <span className="text-[10px] font-medium line-clamp-1 group-hover:text-[#5A5A40]">
                            {item.title}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#E5E2DD] dark:border-[#383632] space-y-1">
                      <span className="text-[10px] text-[#A5A29D]">Or paste image URL:</span>
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-2 py-1 text-[11px] rounded-lg border border-[#E5E2DD] dark:border-[#383632] bg-[#FAF9F7] dark:bg-[#2C2A26]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customImageUrl.trim()) {
                              setSelectedAttachment(customImageUrl.trim());
                              setCustomImageUrl('');
                              setShowAttachmentPicker(false);
                            }
                          }}
                          className="px-2 py-1 rounded-lg bg-[#5A5A40] text-white text-[10px] font-semibold"
                        >
                          Use
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Direct Snap Button */}
              <button
                type="button"
                id="btn-msg-camera-snap"
                onClick={() => setIsCameraOpen(true)}
                className="p-2.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] text-[#787570] hover:border-[#5A5A40] hover:text-[#5A5A40] transition-colors"
                title="Snap photo with craft camera"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Voice Dictation Mic Button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-red-500 text-white border-red-600 animate-pulse'
                    : 'border-[#E5E2DD] dark:border-[#383632] text-[#787570] hover:border-[#5A5A40]'
                }`}
                title={isListening ? "Listening... Click to stop" : "Speak in regional dialect or English"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text Input Field */}
              <input
                id="direct-message-input"
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={
                  isListening
                    ? "Listening to speech..."
                    : `Message ${activeConv.artisanName} in English, Hindi, or any language...`
                }
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-[#FAF9F7] dark:bg-[#2C2A26] text-xs text-[#1A1A1A] dark:text-[#F5F3EF] placeholder-[#A5A29D] focus:ring-1 focus:ring-[#5A5A40] focus:outline-none"
              />

              {/* Send Button */}
              <button
                id="btn-send-message"
                type="submit"
                disabled={!messageInput.trim() && !selectedAttachment}
                className="px-4 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#484833] disabled:opacity-40 disabled:hover:bg-[#5A5A40] text-white text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="md:col-span-8 flex flex-col items-center justify-center p-8 text-center bg-[#FDFCFB] dark:bg-[#22211E]">
            <div className="w-14 h-14 rounded-full bg-[#F5F2ED] dark:bg-[#2C2A26] flex items-center justify-center mb-3 text-[#5A5A40]">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-[#F5F3EF]">
              Select an artisan dialogue
            </h3>
            <p className="text-xs text-[#787570] dark:text-[#A5A29D] mt-1 max-w-xs">
              Choose an active dialogue from the sidebar or click below to message a master craftsperson.
            </p>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-[#5A5A40] text-white text-xs font-semibold hover:bg-[#484833] transition-colors"
            >
              Browse Artisan Directory
            </button>
          </div>
        )}
      </div>

      {/* Modal: Message Another Artisan */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#22211E] w-full max-w-lg rounded-2xl border border-[#E5E2DD] dark:border-[#383632] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E2DD] dark:border-[#383632] pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#5A5A40]" />
                <h3 className="font-bold text-base text-[#1A1A1A] dark:text-[#F5F3EF]">
                  Direct Artisan Guild Directory
                </h3>
              </div>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1 rounded-lg text-[#A5A29D] hover:text-[#1A1A1A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#5A5A40] dark:text-[#C8C7B8]">
              Select a master craftsperson to open an end-to-end fair trade communication channel:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {artisans.map((artisan) => (
                <button
                  key={artisan.id}
                  onClick={() => {
                    startConversationWithArtisan(artisan.id);
                    setShowNewChatModal(false);
                  }}
                  className="w-full text-left p-3 rounded-xl border border-[#E5E2DD] dark:border-[#383632] hover:border-[#5A5A40] bg-[#FAF9F7] dark:bg-[#2C2A26] transition-all flex items-center gap-3 group"
                >
                  <img
                    src={artisan.avatar}
                    alt={artisan.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#5A5A40]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-[#1A1A1A] dark:text-[#F5F3EF] group-hover:text-[#5A5A40]">
                      {artisan.name}
                    </h4>
                    <p className="text-[11px] text-[#5A5A40] dark:text-[#C8C7B8]">
                      {artisan.craftSpecialty}
                    </p>
                    <p className="text-[10px] text-[#A5A29D]">
                      {artisan.village}, {artisan.state} • {artisan.experienceYears} Years Generational Mastery
                    </p>
                  </div>
                  <Send className="w-4 h-4 text-[#A5A29D] group-hover:text-[#5A5A40]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Clear Conversation */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#22211E] w-full max-w-sm rounded-2xl border border-[#E5E2DD] dark:border-[#383632] shadow-2xl p-5 space-y-3 text-center">
            <Trash2 className="w-8 h-8 text-red-500 mx-auto" />
            <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-[#F5F3EF]">
              Clear Conversation History?
            </h3>
            <p className="text-xs text-[#787570] dark:text-[#A5A29D]">
              This will remove all messages in this thread. This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632] text-xs font-semibold text-[#1A1A1A] dark:text-[#F5F3EF]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (activeConv) clearConversation(activeConv.id);
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Capture Modal for Direct Messaging */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(capturedDataUrl) => {
          setSelectedAttachment(capturedDataUrl);
        }}
      />
    </div>
  );
};
