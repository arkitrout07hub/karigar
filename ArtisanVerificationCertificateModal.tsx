import React, { useState } from 'react';
import { Artisan } from '../types';
import {
  X,
  ShieldCheck,
  Award,
  CheckCircle2,
  QrCode,
  Download,
  Share2,
  Printer,
  MapPin,
  Calendar,
  Building,
  Check,
  Sparkles,
  ExternalLink,
  Layers,
  Feather,
  FileCheck,
} from 'lucide-react';

interface ArtisanVerificationCertificateModalProps {
  artisan: Artisan | null;
  onClose: () => void;
}

export const ArtisanVerificationCertificateModal: React.FC<ArtisanVerificationCertificateModalProps> = ({
  artisan,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!artisan) return null;

  const verification = artisan.verification || {
    status: 'verified',
    verificationId: `KARIGAR-VERIFIED-${(artisan.state || 'IN').slice(0, 2).toUpperCase()}-8821`,
    pehchanArtisanId: `PA-${(artisan.state || 'IN').slice(0, 2).toUpperCase()}-2024-9912`,
    govIdType: 'pehchan_card' as const,
    govIdNumberMasked: '•••• •••• 9912',
    giCertificationCluster: `${artisan.craftSpecialty} GI Cluster Certified`,
    clusterAffiliation: artisan.community || 'National Artisan Cooperative',
    verifiedDate: '2024-03-15',
    verifierBadge: 'National Craft Council Verified',
    authenticityScore: 99,
    fairWageScore: 100,
    giClusterScore: 98,
    badges: [
      'Pehchan Ministry Recognized',
      'GI-Tag Cluster Certified',
      '100% Direct Fair Wage Escrow',
      'Master Heritage Lineage',
    ],
    bankDetails: {
      accountHolder: artisan.name,
      bankName: 'Verified Direct Fair-Trade Escrow Bank',
      accountNumberMasked: '••••••••4892',
      ifscCode: 'SBIN0000045',
      upiVpa: `${artisan.name.toLowerCase().replace(/\s+/g, '')}@okaxis`,
    },
    workshopProofImages: artisan.workshopPhotos,
    sampleCraftImages: [
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80',
    ],
    reviewerNotes: 'Physical kiln audit conducted. Natural materials certified with zero synthetic additives.',
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="artisan-certificate-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="artisan-certificate-modal-card"
        className="bg-white dark:bg-[#22211E] text-[#1A1A1A] dark:text-[#F5F3EF] w-full max-w-3xl rounded-3xl border border-[#E5E2DD] dark:border-[#383632] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Top Control Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E5E2DD] dark:border-[#383632] bg-[#F5F2ED]/60 dark:bg-[#2C2A26]/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5A5A40] text-white flex items-center justify-center shadow-xs">
              <Award className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-serif italic font-bold">
                Artisan Verification Certificate & GI Credential
              </h2>
              <span className="text-[10px] text-[#787570] dark:text-[#A5A29D]">
                Official Fair-Trade Digital Credential
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632] text-[#787570] hover:bg-white dark:hover:bg-[#383632] text-xs flex items-center gap-1.5 transition-colors"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632] text-[#787570] hover:bg-white dark:hover:bg-[#383632] text-xs flex items-center gap-1.5 transition-colors"
              title="Share Certificate"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              type="button"
              id="btn-close-certificate-modal"
              onClick={onClose}
              className="p-2 rounded-xl text-[#787570] hover:bg-[#E5E2DD] dark:hover:bg-[#383632] transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Certificate Viewer */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Main Ornate Certificate Card */}
          <div
            id="printable-artisan-certificate"
            className="relative p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] dark:bg-[#1C1B18] border-4 border-[#5A5A40]/30 shadow-md text-[#1A1A1A] dark:text-[#F5F3EF] overflow-hidden space-y-6"
          >
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#5A5A40]/40 pointer-events-none" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#5A5A40]/40 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#5A5A40]/40 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#5A5A40]/40 pointer-events-none" />

            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <span className="font-serif italic text-9xl font-bold">KARIGAR</span>
            </div>

            {/* Certificate Header */}
            <div className="text-center space-y-1 relative z-10 border-b border-[#E5E2DD] dark:border-[#383632] pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] dark:text-[#C8C7B8] text-[11px] font-bold uppercase tracking-widest mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Ministry Recognized Fair-Trade Standard
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif italic font-bold tracking-tight text-[#1A1A1A] dark:text-[#F5F3EF]">
                Certificate of Master Craftsmanship
              </h1>
              <p className="text-xs text-[#787570] dark:text-[#A5A29D]">
                National Geographical Indication & Pehchan Verified Heritage Registry
              </p>
            </div>

            {/* Recipient & Craft Body */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center relative z-10">
              <div className="sm:col-span-4 flex flex-col items-center text-center space-y-2">
                <img
                  src={artisan.avatar}
                  alt={artisan.name}
                  className="w-28 h-28 rounded-2xl object-cover border-2 border-[#5A5A40] shadow-md"
                />
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Certified Active
                </span>
              </div>

              <div className="sm:col-span-8 space-y-2.5 text-center sm:text-left">
                <span className="text-[11px] font-semibold text-[#787570] dark:text-[#A5A29D] uppercase tracking-wider block">
                  This is to officially certify that
                </span>
                <h2 className="text-2xl font-serif italic font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                  {artisan.name}
                </h2>
                <p className="text-xs text-[#5A5A40] dark:text-[#C8C7B8] font-medium leading-relaxed">
                  has demonstrated authentic generational mastery in{' '}
                  <span className="font-bold underline decoration-[#5A5A40]/40">
                    {artisan.craftSpecialty}
                  </span>{' '}
                  from the verified regional cluster of{' '}
                  <span className="font-semibold">{artisan.village}, {artisan.state}</span>.
                </p>

                <div className="pt-2 text-xs text-[#787570] dark:text-[#A5A29D] space-y-1">
                  <p>
                    <span className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">Pehchan ID:</span>{' '}
                    <span className="font-mono">{verification.pehchanArtisanId}</span>
                  </p>
                  <p>
                    <span className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">GI Cluster:</span>{' '}
                    {verification.giCertificationCluster}
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Score Metrics Bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative z-10 pt-2">
              <div className="p-3 rounded-xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-center">
                <span className="text-[10px] text-[#A5A29D] block uppercase font-bold">Authenticity</span>
                <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                  {verification.authenticityScore || 99}% Pure
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-center">
                <span className="text-[10px] text-[#A5A29D] block uppercase font-bold">Fair Wage Escrow</span>
                <span className="text-base font-bold text-[#5A5A40] dark:text-[#C8C7B8]">
                  100% Direct
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-center">
                <span className="text-[10px] text-[#A5A29D] block uppercase font-bold">Experience</span>
                <span className="text-base font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">
                  {artisan.experienceYears} Years
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-center">
                <span className="text-[10px] text-[#A5A29D] block uppercase font-bold">GI Cluster Score</span>
                <span className="text-base font-bold text-[#5A5A40] dark:text-[#C8C7B8]">
                  {verification.giClusterScore || 98}/100
                </span>
              </div>
            </div>

            {/* Certificate Footer with Signatures & QR Verification */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E5E2DD] dark:border-[#383632] relative z-10 text-xs">
              <div className="space-y-1 text-center sm:text-left">
                <span className="font-serif italic font-bold block text-sm">
                  KarigarFlow Verification Board
                </span>
                <span className="text-[10px] text-[#A5A29D]">
                  Issued Date: {verification.verifiedDate || '2024-03-15'} • Cert ID: {verification.verificationId}
                </span>
              </div>

              <div className="flex items-center gap-3 bg-white dark:bg-[#2C2A26] p-2 rounded-xl border border-[#E5E2DD] dark:border-[#383632]">
                <div className="w-10 h-10 bg-black text-white p-1 rounded-lg flex items-center justify-center">
                  <QrCode className="w-8 h-8" />
                </div>
                <div className="text-[10px] text-[#787570] dark:text-[#A5A29D]">
                  <span className="font-bold text-[#1A1A1A] dark:text-[#F5F3EF] block">Scan to Verify</span>
                  <span>Direct Escrow Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Trail & Workshop Proof Gallery */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#787570] dark:text-[#A5A29D] flex items-center gap-1.5">
              <FileCheck className="w-4 h-4" /> Verified Workshop & Kiln Proofs
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {artisan.workshopPhotos.map((photo, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-[#E5E2DD] dark:border-[#383632] h-28 group relative">
                  <img src={photo} alt="Workshop" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-semibold transition-opacity">
                    Audit Photo #{i + 1}
                  </div>
                </div>
              ))}
            </div>

            {verification.reviewerNotes && (
              <div className="p-3 rounded-xl bg-[#F5F2ED] dark:bg-[#2C2A26] border border-[#E5E2DD] dark:border-[#383632] text-xs text-[#5A5A40] dark:text-[#C8C7B8] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Audit Reviewer Assessment:</span>
                  <span>{verification.reviewerNotes}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Close Button */}
        <div className="p-4 border-t border-[#E5E2DD] dark:border-[#383632] bg-white dark:bg-[#22211E] flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#5A5A40] text-white text-xs font-bold hover:bg-[#484833] transition-colors"
          >
            Close Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
