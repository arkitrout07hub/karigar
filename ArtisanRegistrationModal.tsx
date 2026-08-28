import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CameraCaptureModal } from './CameraCaptureModal';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Camera,
  Upload,
  Mic,
  MicOff,
  MapPin,
  Building,
  User,
  Phone,
  FileText,
  Award,
  CreditCard,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Info,
  Check,
  RefreshCw,
  Eye,
  Sliders,
  Feather,
} from 'lucide-react';
import { LanguageCode } from '../types';

interface ArtisanRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CRAFT_SPECIALTIES = [
  'Terracotta & Pottery',
  'Dokra Lost-Wax Bell Metal Casting',
  'Madhubani Folk Painting',
  'Double Ikat Silk & Cotton Weaving',
  'Jaipur Blue Pottery',
  'Channapatna Wooden Toys & Lacquerware',
  'Kutch Rogan & Mirror Embroidery',
  'Bidriware Silver Inlay Metalcraft',
  'Saharanpur Rosewood Carving',
  'Pashmina & Cashmere Hand-Spinning',
  'Tanjore 24k Gold Foil Painting',
  'Bamboo & Cane Basketry',
];

const GI_CLUSTERS = [
  'Bankura Terracotta (GI App No. 128)',
  'Bastar Dhokra (GI App No. 83)',
  'Madhubani Paintings (GI App No. 105)',
  'Pochampally Ikat (GI App No. 4)',
  'Blue Pottery of Jaipur (GI App No. 28)',
  'Channapatna Toys and Dolls (GI App No. 13)',
  'Bidriware (GI App No. 11)',
  'Kashmir Pashmina (GI App No. 46)',
  'Thanjavur Paintings (GI App No. 33)',
  'Other Certified Handcraft Cluster',
];

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
];

export const ArtisanRegistrationModal: React.FC<ArtisanRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { registerArtisan, language } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form States - Step 1: Personal Profile
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(SAMPLE_AVATARS[0]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [village, setVillage] = useState('');
  const [region, setRegion] = useState('');
  const [state, setState] = useState('West Bengal');
  const [pincode, setPincode] = useState('');
  const [preferredLang, setPreferredLang] = useState<LanguageCode>(language);

  // Step 2: Traditional Craft & Heritage
  const [craftSpecialty, setCraftSpecialty] = useState(CRAFT_SPECIALTIES[0]);
  const [community, setCommunity] = useState('');
  const [experienceYears, setExperienceYears] = useState(12);
  const [craftLineage, setCraftLineage] = useState('');
  const [materials, setMaterials] = useState('');
  const [techniques, setTechniques] = useState('');
  const [bio, setBio] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPolishingBio, setIsPolishingBio] = useState(false);

  // Step 3: Verification & Government Credentials
  const [govIdType, setGovIdType] = useState<'pehchan_card' | 'aadhaar' | 'voter_id' | 'pan'>('pehchan_card');
  const [pehchanId, setPehchanId] = useState('');
  const [giCluster, setGiCluster] = useState(GI_CLUSTERS[0]);
  const [workshopProof, setWorkshopProof] = useState<string>(
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80'
  );
  const [sampleCraftImage, setSampleCraftImage] = useState<string>(
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80'
  );
  const [bankAccountHolder, setBankAccountHolder] = useState('');
  const [bankName, setBankName] = useState('State Bank of India');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('SBIN0001245');
  const [upiVpa, setUpiVpa] = useState('');

  // Step 4: AI Authenticity Pre-screening Simulation
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [authenticityScore, setAuthenticityScore] = useState(98);
  const [fairWageScore, setFairWageScore] = useState(100);

  // Camera modal state
  const [cameraTarget, setCameraTarget] = useState<'avatar' | 'workshop' | 'sample' | null>(null);

  const speechRecognitionRef = useRef<any>(null);

  if (!isOpen) return null;

  // Voice recording for story/bio
  const toggleVoiceRecording = () => {
    if (isRecording) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your story.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = preferredLang === 'hi' ? 'hi-IN' : preferredLang === 'bn' ? 'bn-IN' : 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => setIsRecording(true);
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setBio(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  // AI Story Polisher
  const handlePolishBio = () => {
    setIsPolishingBio(true);
    setTimeout(() => {
      const polished = bio
        ? `Dedicated ${craftSpecialty} master artisan practicing in ${village || 'rural craft cluster'}, ${state}. Preserving generational techniques using ${materials || 'natural materials'} with zero synthetic adulteration. Every craft piece is directly fair-trade certified.`
        : `Master craftsman dedicated to authentic ${craftSpecialty}. Preserving ancestral heritage through hand-thrown and hand-carved sustainable methods. Direct Fair-Trade certified.`;
      setBio(polished);
      setIsPolishingBio(false);
    }, 800);
  };

  // Handle Complete Registration
  const handleSubmitRegistration = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const stateCode = (state || 'IN').slice(0, 2).toUpperCase();
      const randomCert = Math.floor(1000 + Math.random() * 9000);
      const maskedAcc = accountNumber ? `••••••••${accountNumber.slice(-4)}` : `••••••••${randomCert}`;
      const maskedGovId = pehchanId ? `•••• •••• ${pehchanId.slice(-4)}` : `•••• •••• ${randomCert}`;

      registerArtisan({
        name: name || 'Master Artisan',
        avatar,
        bio: bio || `Traditional artisan crafting certified authentic ${craftSpecialty}.`,
        village: village || 'Panchmura Rural Craft Cluster',
        region: region || 'Craft Heritage District',
        state: state || 'West Bengal',
        pincode: pincode || '722202',
        craftSpecialty,
        experienceYears: Number(experienceYears) || 10,
        community: community || 'Regional Artisan Guild & Cooperative',
        verified: true,
        phone: phone || '+91 98321 00000',
        email: email || '',
        craftLineage: craftLineage || 'Generational family craft heritage verified under Fair-Trade protocols.',
        materials: materials ? materials.split(',').map(m => m.trim()) : ['Natural Alluvial Clay', 'Botanical Oxides'],
        techniques: techniques ? techniques.split(',').map(t => t.trim()) : ['Hand Carving', 'Traditional Kiln Firing'],
        workshopPhotos: [workshopProof],
        audioBioText: bio || `Namaskar! Welcome to my authentic ${craftSpecialty} studio on KarigarFlow.`,
        verification: {
          status: 'verified',
          verificationId: `KARIGAR-VERIFIED-${stateCode}-${randomCert}`,
          pehchanArtisanId: pehchanId || `PA-${stateCode}-2026-${randomCert}`,
          govIdType,
          govIdNumberMasked: maskedGovId,
          giCertificationCluster: giCluster,
          clusterAffiliation: community || `${craftSpecialty} Guild Cluster`,
          verifiedDate: new Date().toISOString().split('T')[0],
          verifierBadge: 'National Craft Council & GI Verified',
          authenticityScore,
          fairWageScore,
          giClusterScore: 98,
          badges: [
            'Pehchan Ministry Recognized',
            'GI-Tag Cluster Certified',
            '100% Direct Fair Wage Escrow',
            'Verified Master Craftsman',
            'Eco-Friendly Raw Materials',
          ],
          bankDetails: {
            accountHolder: bankAccountHolder || name || 'Master Artisan',
            bankName,
            accountNumberMasked: maskedAcc,
            ifscCode: ifscCode || 'SBIN0001245',
            upiVpa: upiVpa || `${(name || 'artisan').toLowerCase().replace(/\s+/g, '')}@okaxis`,
          },
          workshopProofImages: [workshopProof],
          sampleCraftImages: [sampleCraftImage],
          reviewerNotes: 'AI Craft Purity & Ministry Pehchan Database Cross-verified. Instant Fair-Trade Escrow enabled.',
        },
      });

      setIsAnalyzing(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      id="artisan-registration-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="artisan-registration-modal-card"
        className="bg-white dark:bg-[#22211E] text-[#1A1A1A] dark:text-[#F5F3EF] w-full max-w-3xl rounded-3xl border border-[#E5E2DD] dark:border-[#383632] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Header with Title & Stepper */}
        <div className="p-5 sm:p-6 border-b border-[#E5E2DD] dark:border-[#383632] bg-[#F5F2ED]/60 dark:bg-[#2C2A26]/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-serif italic font-bold">
                  Artisan Registration & Verification
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#5A5A40]/15 text-[#5A5A40] dark:text-[#C8C7B8] uppercase tracking-wider">
                  Fair-Trade Escrow
                </span>
              </div>
              <p className="text-xs text-[#787570] dark:text-[#A5A29D]">
                Get verified with Ministry Pehchan ID & GI-Tag Cluster Certification
              </p>
            </div>
          </div>

          <button
            id="close-registration-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-[#787570] hover:bg-[#E5E2DD] dark:hover:bg-[#383632] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Progress Ribbon */}
        <div className="grid grid-cols-4 border-b border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] text-xs font-medium shrink-0">
          <button
            onClick={() => setStep(1)}
            className={`py-3 px-2 sm:px-4 text-center border-b-2 flex items-center justify-center gap-1.5 transition-all ${
              step === 1
                ? 'border-[#5A5A40] text-[#5A5A40] dark:text-[#C8C7B8] font-bold bg-[#F5F2ED]/40 dark:bg-[#2C2A26]/40'
                : step > 1
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-[#A5A29D]'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-[#E5E2DD] dark:bg-[#383632]">
              {step > 1 ? '✓' : '1'}
            </span>
            <span className="hidden sm:inline">Profile</span>
          </button>

          <button
            onClick={() => setStep(2)}
            className={`py-3 px-2 sm:px-4 text-center border-b-2 flex items-center justify-center gap-1.5 transition-all ${
              step === 2
                ? 'border-[#5A5A40] text-[#5A5A40] dark:text-[#C8C7B8] font-bold bg-[#F5F2ED]/40 dark:bg-[#2C2A26]/40'
                : step > 2
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-[#A5A29D]'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-[#E5E2DD] dark:bg-[#383632]">
              {step > 2 ? '✓' : '2'}
            </span>
            <span className="hidden sm:inline">Traditional Craft</span>
          </button>

          <button
            onClick={() => setStep(3)}
            className={`py-3 px-2 sm:px-4 text-center border-b-2 flex items-center justify-center gap-1.5 transition-all ${
              step === 3
                ? 'border-[#5A5A40] text-[#5A5A40] dark:text-[#C8C7B8] font-bold bg-[#F5F2ED]/40 dark:bg-[#2C2A26]/40'
                : step > 3
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-[#A5A29D]'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-[#E5E2DD] dark:bg-[#383632]">
              {step > 3 ? '✓' : '3'}
            </span>
            <span className="hidden sm:inline">Verification & Bank</span>
          </button>

          <button
            onClick={() => setStep(4)}
            className={`py-3 px-2 sm:px-4 text-center border-b-2 flex items-center justify-center gap-1.5 transition-all ${
              step === 4
                ? 'border-[#5A5A40] text-[#5A5A40] dark:text-[#C8C7B8] font-bold bg-[#F5F2ED]/40 dark:bg-[#2C2A26]/40'
                : 'border-transparent text-[#A5A29D]'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-[#E5E2DD] dark:bg-[#383632]">
              4
            </span>
            <span className="hidden sm:inline">AI Certificate</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* ================= STEP 1: PERSONAL & MASTER PROFILE ================= */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  KarigarFlow connects authentic rural master craftsmen directly to conscious global patrons. Direct payouts are deposited directly without middlemen.
                </p>
              </div>

              {/* Master Artisan Avatar & Camera Snapshot */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#787570] dark:text-[#A5A29D] mb-2">
                  Artisan Portrait Photo *
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative group">
                    <img
                      src={avatar}
                      alt="Artisan Portrait"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[#5A5A40] shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setCameraTarget('avatar')}
                      className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-[#5A5A40] text-white shadow-md hover:scale-105 transition-transform"
                      title="Snap photo with camera"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-[200px] space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        id="btn-reg-snap-avatar"
                        onClick={() => setCameraTarget('avatar')}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#5A5A40] hover:bg-[#484833] text-white flex items-center gap-1.5 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Live Camera Snap
                      </button>
                      <span className="text-xs text-[#A5A29D]">or pick from craft portraits:</span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {SAMPLE_AVATARS.map((sAvatar, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatar(sAvatar)}
                          className={`w-9 h-9 rounded-lg overflow-hidden border transition-all ${
                            avatar === sAvatar
                              ? 'border-2 border-[#5A5A40] scale-105'
                              : 'border-[#E5E2DD] dark:border-[#383632] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={sAvatar} alt="sample" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#787570] dark:text-[#A5A29D] mb-1.5">
                    Master Artisan Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#A5A29D] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      id="input-artisan-name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Rameshwar Kumbhar"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#2C2A26] text-xs font-medium focus:outline-none focus:border-[#5A5A40]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#787570] dark:text-[#A5A29D] mb-1.5">
                    Phone / WhatsApp (+91) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#A5A29D] absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      id="input-artisan-phone"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98321 44521"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#2C2A26] text-xs font-medium focus:outline-none focus:border-[#5A5A40]"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Preferred Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#787570] dark:text-[#A5A29D] mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    id="input-artisan-email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="artisan.studio@karigar.in"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#2C2A26] text-xs font-medium focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#787570] dark:text-[#A5A29D] mb-1.5">
                    Preferred Communication Language
                  </label>
                  <select
                    id="select-artisan-lang"
                    value={preferredLang}
                    onChange={e => setPreferredLang(e.target.value as LanguageCode)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#2C2A26] text-xs font-medium focus:outline-none focus:border-[#5A5A40]"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="gu">ગુજરાતી (Gujarati)</option>
                    <option value="es">Español (Spanish)</option>
                  </select>
                </div>
              </div>

              {/* Geographic Cluster Location */}
              <div className="p-4 rounded-2xl bg-[#F5F2ED]/60 dark:bg-[#2C2A26]/60 border border-[#E5E2DD] dark:border-[#383632] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Rural Workshop / Cluster Location
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#787570] dark:text-[#A5A29D] mb-1">
                      Village / Settlement / Ward *
                    </label>
                    <input
                      type="text"
                      id="input-artisan-village"
                      value={village}
                      onChange={e => setVillage(e.target.value)}
                      placeholder="e.g. Panchmura Village, Bishnupur"
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] text-xs focus:outline-none focus:border-[#5A5A40]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#787570] dark:text-[#A5A29D] mb-1">
                      District / Craft Region *
                    </label>
                    <input
                      type="text"
                      id="input-artisan-region"
                      value={region}
                      onChange={e => setRegion(e.target.value)}
                      placeholder="e.g. Bankura District"
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] text-xs focus:outline-none focus:border-[#5A5A40]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#787570] dark:text-[#A5A29D] mb-1">
                      State / Union Territory *
                    </label>
                    <select
                      id="select-artisan-state"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] text-xs focus:outline-none focus:border-[#5A5A40]"
                    >
                      <option value="West Bengal">West Bengal</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Jammu & Kashmir">Jammu & Kashmir</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Assam">Assam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#787570] dark:text-[#A5A29D] mb-1">
                      Postal Pincode *
                    </label>
                    <input
                      type="text"
                      id="input-artisan-pincode"
                      value={pincode}
                      onChange={e => setPincode(e.target.value)}
                      placeholder="e.g. 722202"
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] text-xs focus:outline-none focus:border-[#5A5A40]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: TRADITIONAL CRAFT & HERITAGE ================= */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#787570] dark:text-[#A5A29D] mb-1.5">
                    Primary Handcraft Discipline *
                  </label>
                  <select
                    id="select-craft-specialty"
                    value={craftSpecialty}
                    onChange={e => setCraftSpecialty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#2C2A26] text-xs font-medium focus:outline-none focus:border-[#5A5A40]"
                  >
                    {CRAFT_SPECIALTIES.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#787570] dark:text-[#A5A29D] mb-1.5">
                    Years of Active Craft Practice *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={60}
                      value={experienceYears}
                      onChange={e => setExperienceYears(Number(e.target.value))}
                      className="flex-1 accent-[#5A5A40]"
                    />
                    <span className="px-3 py-1.5 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-xs font-bold min-w-[70px] text-center">
                      {experienceYears} Years
                    </span>
                  </div>
                </div>
              </div>

              {/* Guild & Lineage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#787570] dark:text-[#A5A29D] mb-1.5">
                    Artisan Community / Cooperative / SHG
                  </label>
                  <input
                    type="text"
                    id="input-artisan-community"
                    value={community}
                    onChange={e => setCommunity(e.target.value)}
                    placeholder="e.g. Kumbhakar Artisan Guild / Women SHG"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#2C2A26] text-xs font-medium focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#787570] dark:text-[#A5A29D] mb-1.5">
                    Ancestral Lineage & Heritage Tradition
                  </label>
                  <input
                    type="text"
                    id="input-craft-lineage"
                    value={craftLineage}
                    onChange={e => setCraftLineage(e.target.value)}
                    placeholder="e.g. 5th Generation family tradition active since 1882"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#2C2A26] text-xs font-medium focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
              </div>

              {/* Raw Materials & Techniques */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#787570] dark:text-[#A5A29D] mb-1.5">
                    Natural Raw Materials (comma-separated) *
                  </label>
                  <input
                    type="text"
                    id="input-craft-materials"
                    value={materials}
                    onChange={e => setMaterials(e.target.value)}
                    placeholder="e.g. Alluvial Riverbed Clay, Forest Beeswax, Natural Indigo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#2C2A26] text-xs font-medium focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#787570] dark:text-[#A5A29D] mb-1.5">
                    Traditional Techniques & Tools *
                  </label>
                  <input
                    type="text"
                    id="input-craft-techniques"
                    value={techniques}
                    onChange={e => setTechniques(e.target.value)}
                    placeholder="e.g. Hand Wheel Throwing, Wood-Fired Kiln, Lost-Wax Pit Smelting"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#2C2A26] text-xs font-medium focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
              </div>

              {/* Artisan Story / Bio with Voice Dictation & AI Polisher */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#787570] dark:text-[#A5A29D] flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5" />
                    Artisan Story & Craft Bio
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="btn-voice-dictation-bio"
                      onClick={toggleVoiceRecording}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isRecording
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-[#F5F2ED] dark:bg-[#2C2A26] text-[#5A5A40] dark:text-[#C8C7B8] hover:bg-[#E5E2DD]'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      {isRecording ? 'Listening...' : 'Voice Dictate'}
                    </button>

                    <button
                      type="button"
                      id="btn-ai-polish-bio"
                      onClick={handlePolishBio}
                      disabled={isPolishingBio}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#5A5A40]/10 hover:bg-[#5A5A40]/20 text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {isPolishingBio ? 'Polishing...' : 'AI Story Polish'}
                    </button>
                  </div>
                </div>

                <textarea
                  id="textarea-artisan-bio"
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Share how your family or community learned this craft, what making it means to you, and the spirit of your workshop..."
                  className="w-full p-3 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#2C2A26] text-xs leading-relaxed focus:outline-none focus:border-[#5A5A40]"
                />
              </div>
            </div>
          )}

          {/* ================= STEP 3: VERIFICATION & GOVERNMENT CREDENTIALS ================= */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Government ID & Pehchan Card */}
              <div className="p-4 rounded-2xl bg-[#F5F2ED]/60 dark:bg-[#2C2A26]/60 border border-[#E5E2DD] dark:border-[#383632] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    Ministry of Textiles / Government Artisan ID
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Auto-Checked
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#787570] dark:text-[#A5A29D] mb-1">
                      Official ID Document Type *
                    </label>
                    <select
                      id="select-gov-id-type"
                      value={govIdType}
                      onChange={e => setGovIdType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] text-xs focus:outline-none focus:border-[#5A5A40]"
                    >
                      <option value="pehchan_card">Pehchan Artisan Card (Ministry of Textiles)</option>
                      <option value="aadhaar">Aadhaar Card (UIDAI Verified)</option>
                      <option value="voter_id">Voter ID / EPIC Card</option>
                      <option value="pan">PAN Card / Business ID</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#787570] dark:text-[#A5A29D] mb-1">
                      Pehchan / Government ID Number *
                    </label>
                    <input
                      type="text"
                      id="input-pehchan-id"
                      value={pehchanId}
                      onChange={e => setPehchanId(e.target.value)}
                      placeholder="e.g. PA-WB-BK-2026-8841"
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] text-xs focus:outline-none focus:border-[#5A5A40]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#787570] dark:text-[#A5A29D] mb-1">
                    Geographical Indication (GI) Tag Cluster Affiliation *
                  </label>
                  <select
                    id="select-gi-cluster"
                    value={giCluster}
                    onChange={e => setGiCluster(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] text-xs focus:outline-none focus:border-[#5A5A40]"
                  >
                    {GI_CLUSTERS.map((gi, idx) => (
                      <option key={idx} value={gi}>
                        {gi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Workshop Proof & Sample Craft Photo Snapshots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Workshop Proof */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#787570] dark:text-[#A5A29D]">
                      Workshop / Kiln Photo Proof *
                    </span>
                    <button
                      type="button"
                      onClick={() => setCameraTarget('workshop')}
                      className="p-1 rounded-lg text-[#5A5A40] hover:bg-[#F5F2ED] dark:hover:bg-[#383632]"
                      title="Take live photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="relative h-32 rounded-xl overflow-hidden border border-[#E5E2DD] dark:border-[#383632] group">
                    <img src={workshopProof} alt="Workshop" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCameraTarget('workshop')}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 text-white text-xs font-semibold transition-opacity"
                    >
                      <Camera className="w-4 h-4" /> Retake Photo
                    </button>
                  </div>
                </div>

                {/* Sample Craft */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#787570] dark:text-[#A5A29D]">
                      Masterpiece / Sample Craft *
                    </span>
                    <button
                      type="button"
                      onClick={() => setCameraTarget('sample')}
                      className="p-1 rounded-lg text-[#5A5A40] hover:bg-[#F5F2ED] dark:hover:bg-[#383632]"
                      title="Take live photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="relative h-32 rounded-xl overflow-hidden border border-[#E5E2DD] dark:border-[#383632] group">
                    <img src={sampleCraftImage} alt="Sample Craft" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCameraTarget('sample')}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 text-white text-xs font-semibold transition-opacity"
                    >
                      <Camera className="w-4 h-4" /> Retake Photo
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct Fair-Trade Bank Account & UPI Details */}
              <div className="p-4 rounded-2xl bg-[#F5F2ED]/60 dark:bg-[#2C2A26]/60 border border-[#E5E2DD] dark:border-[#383632] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    Direct Fair Wage Bank / UPI Escrow Payout
                  </h4>
                  <span className="text-[10px] text-[#787570] dark:text-[#A5A29D]">
                    100% Zero-Commission Direct Transfer
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#787570] dark:text-[#A5A29D] mb-1">
                      Account Holder Name *
                    </label>
                    <input
                      type="text"
                      id="input-bank-holder"
                      value={bankAccountHolder}
                      onChange={e => setBankAccountHolder(e.target.value)}
                      placeholder={name || 'Master Artisan Name'}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] text-xs focus:outline-none focus:border-[#5A5A40]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#787570] dark:text-[#A5A29D] mb-1">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      id="input-bank-name"
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      placeholder="e.g. State Bank of India / Gramin Bank"
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] text-xs focus:outline-none focus:border-[#5A5A40]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#787570] dark:text-[#A5A29D] mb-1">
                      Bank Account Number *
                    </label>
                    <input
                      type="password"
                      id="input-bank-account"
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value)}
                      placeholder="•••• •••• 4892"
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] text-xs focus:outline-none focus:border-[#5A5A40]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#787570] dark:text-[#A5A29D] mb-1">
                      IFSC Code / UPI VPA *
                    </label>
                    <input
                      type="text"
                      id="input-bank-ifsc"
                      value={ifscCode}
                      onChange={e => setIfscCode(e.target.value)}
                      placeholder="SBIN0000045 or artisan@oksbi"
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] text-xs focus:outline-none focus:border-[#5A5A40]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: AI CRAFT AUTHENTICITY CERTIFICATE PREVIEW ================= */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Authenticity Engine Audit Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      Karigar AI Craft Verification: Ready for Issuance
                    </h3>
                    <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
                      GI Cluster Match: 100% • Fair-Wage Escrow Tier: Certified Direct
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs">
                    Score: {authenticityScore}/100
                  </span>
                </div>
              </div>

              {/* Digital Certificate Preview Card */}
              <div className="relative p-6 rounded-3xl bg-[#FAF8F5] dark:bg-[#1E1D1A] border-2 border-[#5A5A40]/40 shadow-lg text-[#1A1A1A] dark:text-[#F5F3EF] overflow-hidden">
                {/* Decorative Background Stamp */}
                <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full border-4 border-[#5A5A40]/10 flex items-center justify-center select-none pointer-events-none">
                  <span className="font-serif italic font-bold text-4xl text-[#5A5A40]/10">KARIGAR</span>
                </div>

                {/* Certificate Top Seal */}
                <div className="flex items-center justify-between border-b border-[#E5E2DD] dark:border-[#383632] pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#5A5A40] text-white flex items-center justify-center font-serif italic font-bold text-base">
                      K
                    </div>
                    <div>
                      <span className="font-serif italic font-bold text-sm tracking-wide block">
                        National Fair-Trade Artisan Registry
                      </span>
                      <span className="text-[10px] text-[#787570] dark:text-[#A5A29D]">
                        GI-Tag & Ministry Pehchan Certified Protocol
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#5A5A40] text-white uppercase tracking-wider">
                      Official Credential
                    </span>
                    <span className="text-[10px] font-mono text-[#787570] dark:text-[#A5A29D] block mt-0.5">
                      ID: KARIGAR-IN-{(state || 'WB').slice(0, 2).toUpperCase()}-9401
                    </span>
                  </div>
                </div>

                {/* Artisan Certificate Core */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-3 text-center sm:text-left">
                    <img
                      src={avatar}
                      alt={name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[#5A5A40] mx-auto sm:mx-0 shadow-sm"
                    />
                  </div>

                  <div className="sm:col-span-9 space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] dark:text-[#C8C7B8]">
                      Certified Master Craftsman
                    </span>
                    <h2 className="text-xl font-serif italic font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                      {name || 'Master Artisan'}
                    </h2>
                    <p className="text-xs text-[#787570] dark:text-[#A5A29D]">
                      {craftSpecialty} • {village || 'Rural Craft Settlement'}, {state}
                    </p>
                    <p className="text-[11px] text-[#5A5A40] dark:text-[#C8C7B8] font-medium pt-1">
                      Cluster: {giCluster}
                    </p>
                  </div>
                </div>

                {/* 4 Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-4 border-t border-[#E5E2DD] dark:border-[#383632]">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> Pehchan Ministry Verified
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> GI-Tag Cluster Certified
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> 100% Direct Fair Wage Escrow
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-[#5A5A40] dark:text-[#C8C7B8] flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> Sustainable Natural Materials
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Navigation Controls */}
        <div className="p-4 sm:p-5 border-t border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              id="btn-reg-prev-step"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-[#E5E2DD] dark:border-[#383632] text-[#787570] dark:text-[#A5A29D] hover:bg-[#F5F2ED] dark:hover:bg-[#2C2A26] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              id="btn-reg-next-step"
              onClick={() => setStep((step + 1) as any)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#5A5A40] hover:bg-[#484833] text-white flex items-center gap-1.5 shadow-xs transition-all"
            >
              Continue to Step {step + 1}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              id="btn-reg-submit-verify"
              onClick={handleSubmitRegistration}
              disabled={isAnalyzing}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-2 shadow-sm transition-all"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Issuing Verification & Activating Escrow...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Complete Verification & Open Artisan Studio
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Live Camera Snapshot Modal integration */}
      <CameraCaptureModal
        isOpen={cameraTarget !== null}
        onClose={() => setCameraTarget(null)}
        onCapture={dataUrl => {
          if (cameraTarget === 'avatar') {
            setAvatar(dataUrl);
          } else if (cameraTarget === 'workshop') {
            setWorkshopProof(dataUrl);
          } else if (cameraTarget === 'sample') {
            setSampleCraftImage(dataUrl);
          }
        }}
      />
    </div>
  );
};
