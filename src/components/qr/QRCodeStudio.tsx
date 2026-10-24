'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QRCardDetails, QRService } from '@/services/qr.service';
import { useLanguage } from '@/context/LanguageContext';
import { BRAND_COLORS } from '@/config/brand';
import {
  Download,
  Printer,
  Share2,
  Copy,
  ExternalLink,
  Check,
  Sparkles,
  ShieldCheck,
  Maximize2,
  Eye,
  Sliders,
  FileText,
  CreditCard,
  LayoutGrid,
  ShieldAlert,
} from 'lucide-react';
import { AuthService, AuthUserProfile } from '@/services/auth.service';

export type PrintPreset = 'poster' | 'prescription' | 'visiting_card' | 'a4_sheet' | 'custom';

interface QRCodeStudioProps {
  details: QRCardDetails;
  showAnalyticsSummary?: boolean;
  totalScans?: number;
  canManage?: boolean;
  onClose?: () => void;
}

export const QRCodeStudio: React.FC<QRCodeStudioProps> = ({
  details,
  showAnalyticsSummary = false,
  totalScans = 0,
  canManage,
  onClose,
}) => {
  const { language } = useLanguage();
  const [svgString, setSvgString] = useState<string>('');
  const [pngDataUrl, setPngDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<PrintPreset>('poster');
  const [qrSize, setQrSize] = useState<number>(220);
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(canManage !== undefined ? canManage : null);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Check authorization on mount if not pre-provided
  useEffect(() => {
    let isMounted = true;
    if (canManage !== undefined) {
      setIsAuthorized(canManage);
      return;
    }

    AuthService.getCurrentUser().then((user) => {
      if (!isMounted) return;
      const allowed = QRService.canUserManageQR(user, details.ownerType, details.ownerId);
      setIsAuthorized(allowed);
    });

    return () => {
      isMounted = false;
    };
  }, [canManage, details.ownerType, details.ownerId]);

  // Generate SVG & PNG on change ONLY if authorized
  useEffect(() => {
    let isMounted = true;
    if (isAuthorized === false) {
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);

    const renderCodes = async () => {
      try {
        const svg = await QRService.generateSVG(details.publicUrl, {
          margin: activePreset === 'prescription' ? 1 : 2,
          color: { dark: '#090D14', light: '#FFFFFF' },
        });

        const png = await QRService.generatePNGDataUrl(details.publicUrl, {
          width: 1024,
          margin: 2,
          color: { dark: '#090D14', light: '#FFFFFF' },
        });

        if (isMounted) {
          setSvgString(svg);
          setPngDataUrl(png);
          setIsGenerating(false);
        }
      } catch (err) {
        console.error('QR rendering error:', err);
        if (isMounted) setIsGenerating(false);
      }
    };

    renderCodes();

    return () => {
      isMounted = false;
    };
  }, [details.publicUrl, activePreset, isAuthorized]);

  // Handle Preset Selection
  const handleSelectPreset = (preset: PrintPreset) => {
    setActivePreset(preset);
    if (preset === 'prescription') setQrSize(140);
    else if (preset === 'visiting_card') setQrSize(130);
    else if (preset === 'poster') setQrSize(240);
    else if (preset === 'a4_sheet') setQrSize(160);
    else if (preset === 'custom') setQrSize(200);
  };

  // Download PNG file
  const handleDownloadPNG = () => {
    if (isAuthorized !== true) return;
    if (!pngDataUrl) return;
    const cleanName = (details.name || 'qr-code').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const link = document.createElement('a');
    link.href = pngDataUrl;
    link.download = `diagnostic-care-${details.ownerType}-${cleanName}-${activePreset}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download SVG file
  const handleDownloadSVG = () => {
    if (isAuthorized !== true) return;
    if (!svgString) return;
    const cleanName = (details.name || 'qr-code').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diagnostic-care-${details.ownerType}-${cleanName}-${activePreset}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy destination URL
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(details.publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Share via Web Share API
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${details.name} — Diagnostic Care`,
          text: `Scan or visit to view verified healthcare profile and book appointment:`,
          url: details.publicUrl,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyUrl();
    }
  };

  // Browser Print
  const handlePrint = () => {
    if (isAuthorized !== true) return;
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (isAuthorized === false) {
    return (
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '540px',
          margin: '24px auto',
          padding: '36px 28px',
          textAlign: 'center',
          borderRadius: '20px',
          border: '1.5px solid rgba(239, 68, 68, 0.25)',
          background: 'rgba(254, 242, 242, 0.95)',
          boxShadow: '0 20px 40px rgba(239, 68, 68, 0.08)',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <ShieldAlert size={32} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#991B1B', margin: '0 0 8px 0' }}>
          {language === 'bn' ? 'অননুমোদিত প্রবেশাধিকার' : 'Access Restricted: Management Privileges Required'}
        </h3>
        <p style={{ fontSize: '13px', color: '#7F1D1D', lineHeight: 1.6, margin: '0 0 20px 0' }}>
          {language === 'bn'
            ? 'কিউআর কোড ডাউনলোড, প্রিন্ট এবং ম্যানেজমেন্ট টুলস কেবল অনুমোদিত চিকিৎসক এবং প্রতিষ্ঠানের জন্য সীমাবদ্ধ। সাধারণ দর্শনার্থী বা রোগীরা এই ফিচার ব্যবহার করতে পারবেন না।'
            : 'Official QR code management, high-resolution downloads, and print studio tools are strictly restricted to verified healthcare professionals and authorized institution administrators.'}
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="qr-studio-container" style={{ width: '100%', maxWidth: '920px', margin: '0 auto' }}>
      {/* Top Bar with Presets */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{language === 'en' ? 'QR Code Print & Share Studio' : 'কিউআর কোড প্রিন্ট ও শেয়ার স্টুডিও'}</span>
            <span
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '9999px',
                backgroundColor: '#EFF6FF',
                color: BRAND_COLORS.primary,
                fontWeight: 700,
              }}
            >
              HD Vector
            </span>
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
            {language === 'en'
              ? 'Export print-ready materials for prescriptions, chamber displays, and visiting cards.'
              : 'প্রেসক্রিপশন, চেম্বার পোস্টার ও ভিজিটিং কার্ডের জন্য রেডি-টু-প্রিন্ট কিউআর কোড ডাউনলোড ও শেয়ার করুন।'}
          </p>
        </div>

        {/* Preset Selector */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'poster', labelEn: 'Chamber Poster', labelBn: 'চেম্বার পোস্টার', icon: Maximize2 },
            { id: 'prescription', labelEn: 'Prescription', labelBn: 'প্রেসক্রিপশন', icon: FileText },
            { id: 'visiting_card', labelEn: 'Visiting Card', labelBn: 'ভিজিটিং কার্ড', icon: CreditCard },
            { id: 'a4_sheet', labelEn: 'A4 Sheet', labelBn: 'এ৪ শিট', icon: LayoutGrid },
            { id: 'custom', labelEn: 'Custom', labelBn: 'কাস্টম', icon: Sliders },
          ].map((preset) => {
            const Icon = preset.icon;
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id as PrintPreset)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isSelected ? `1px solid ${BRAND_COLORS.primary}` : '1px solid #CBD5E1',
                  backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                  color: isSelected ? BRAND_COLORS.primary : '#334155',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} />
                <span>{language === 'en' ? preset.labelEn : preset.labelBn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Grid: Card Preview on Left, Export Controls on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Printable Card Area */}
        <div
          ref={printAreaRef}
          id="qr-printable-area"
          className={`qr-print-card preset-${activePreset}`}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '2px solid #E2E8F0',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
            padding: activePreset === 'prescription' ? '14px 18px' : activePreset === 'visiting_card' ? '18px 24px' : '28px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: activePreset === 'visiting_card' ? 'row' : 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: activePreset === 'visiting_card' ? '20px' : '16px',
            position: 'relative',
          }}
        >
          {/* Diagnostic Care Header Branding */}
          <div style={{ textAlign: activePreset === 'visiting_card' ? 'left' : 'center', width: '100%' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11.5px',
                fontWeight: 800,
                color: BRAND_COLORS.primary,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              <span
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  backgroundColor: BRAND_COLORS.primary,
                  color: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 900,
                }}
              >
                DC
              </span>
              <span>Diagnostic Care</span>
            </div>

            <div style={{ fontSize: activePreset === 'poster' ? '18px' : '15px', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
              {details.name}
            </div>

            {details.designation && (
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginTop: '2px' }}>
                {details.designation}
              </div>
            )}

            {details.specialty && (
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '1px' }}>
                {details.specialty}
              </div>
            )}

            {details.organizationName && (
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px', fontWeight: 500 }}>
                {details.organizationName}
              </div>
            )}
          </div>

          {/* QR Code Container with High-Contrast Quiet Zone */}
          <div
            style={{
              padding: '10px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {isGenerating ? (
              <div style={{ width: `${qrSize}px`, height: `${qrSize}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '13px' }}>
                Generating...
              </div>
            ) : svgString ? (
              <div
                style={{ width: `${qrSize}px`, height: `${qrSize}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                dangerouslySetInnerHTML={{ __html: svgString }}
              />
            ) : null}
          </div>

          {/* Instructions & Call to Action */}
          <div style={{ textAlign: activePreset === 'visiting_card' ? 'left' : 'center', width: '100%' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#0F172A',
                backgroundColor: '#F1F5F9',
                padding: '4px 10px',
                borderRadius: '6px',
              }}
            >
              <ShieldCheck size={13} color="#15803D" />
              <span>{language === 'en' ? 'Scan to View Profile & Book Appointment' : 'প্রোফাইল দেখতে ও সিরিয়াল নিতে স্ক্যান করুন'}</span>
            </div>

            <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '6px' }}>
              Verified Healthcare Technology • diagnosticcare.vercel.app
            </div>
          </div>
        </div>

        {/* Studio Controls & Export Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Custom Size Slider (when in custom or active preset) */}
          <div
            style={{
              padding: '16px',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                {language === 'en' ? 'QR Code Size Scale' : 'কিউআর কোড সাইজ স্কেল'}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: BRAND_COLORS.primary }}>
                {qrSize}px
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="340"
              step="10"
              value={qrSize}
              onChange={(e) => setQrSize(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: BRAND_COLORS.primary }}
            />
          </div>

          {/* Action Buttons: Download & Print */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={handleDownloadPNG}
              className="btn-primary"
              style={{
                padding: '11px 16px',
                fontSize: '13.5px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              <Download size={16} />
              <span>Download PNG</span>
            </button>

            <button
              onClick={handleDownloadSVG}
              style={{
                padding: '11px 16px',
                fontSize: '13.5px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                border: '1px solid #CBD5E1',
                cursor: 'pointer',
              }}
            >
              <Download size={16} />
              <span>Vector SVG</span>
            </button>
          </div>

          {/* Print & Share */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                padding: '11px 16px',
                fontSize: '13.5px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '10px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Printer size={16} />
              <span>{language === 'en' ? 'Print Card' : 'প্রিন্ট করুন'}</span>
            </button>

            <button
              onClick={handleShare}
              style={{
                padding: '11px 16px',
                fontSize: '13.5px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                color: BRAND_COLORS.primary,
                border: '1px solid #BFDBFE',
                cursor: 'pointer',
              }}
            >
              <Share2 size={16} />
              <span>{shared ? 'Shared!' : language === 'en' ? 'Share QR' : 'শেয়ার করুন'}</span>
            </button>
          </div>

          {/* Copy URL & Destination Preview */}
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
              {language === 'en' ? 'Public Profile Destination URL' : 'পাবলিক প্রোফাইল ডেস্টিনেশন লিংক'}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                readOnly
                value={details.publicUrl}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  fontSize: '12px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  color: '#334155',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleCopyUrl}
                style={{
                  padding: '7px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: copied ? '#15803D' : '#334155',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {copied ? <Check size={13} color="#15803D" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <a
                href={details.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '7px 10px',
                  fontSize: '12px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#0060FA',
                  display: 'inline-flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                }}
                title="Preview public profile"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Telemetry Indicator */}
          {showAnalyticsSummary && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#15803D" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#166534' }}>
                  {language === 'en' ? 'Lifetime QR Scans' : 'মোট কিউআর স্ক্যান'}
                </span>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#15803D' }}>
                {totalScans}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Print Specific CSS to make sure only the card prints cleanly on white paper */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #qr-printable-area, #qr-printable-area * {
            visibility: visible !important;
          }
          #qr-printable-area {
            position: absolute !important;
            left: 50% !important;
            top: 40px !important;
            transform: translateX(-50%) !important;
            box-shadow: none !important;
            border: 1px solid #000000 !important;
            width: 90% !important;
            max-width: 600px !important;
            margin: 0 auto !important;
          }
        }
      `}</style>
    </div>
  );
};
export default QRCodeStudio;
