'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { QRService } from '@/services/qr.service';
import { useLanguage } from '@/context/LanguageContext';
import { BRAND_COLORS } from '@/config/brand';
import {
  Camera,
  Upload,
  RefreshCw,
  X,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  SwitchCamera,
  Keyboard,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess?: (validatedUrl: string) => void;
  language?: any;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const router = useRouter();
  const { language } = useLanguage();

  const [activeMode, setActiveMode] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<{ path: string; rawText: string } | null>(null);
  const [manualInput, setManualInput] = useState<string>('');

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasProcessedRef = useRef<boolean>(false);

  // Initialize or teardown camera on open/close
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      hasProcessedRef.current = false;
      setScannedResult(null);
      setErrorMessage(null);
      setIsProcessing(false);
      return;
    }

    hasProcessedRef.current = false;
    setScannedResult(null);
    setErrorMessage(null);

    if (activeMode === 'camera') {
      startCamera(cameraFacing);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeMode, cameraFacing]);

  // Start Camera Stream
  const startCamera = async (facing: 'environment' | 'user') => {
    try {
      setPermissionDenied(false);
      setErrorMessage(null);

      // Clean up previous instance
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.isScanning) {
            await html5QrCodeRef.current.stop();
          }
          await html5QrCodeRef.current.clear();
        } catch {
          // Ignore cleanup errors
        }
      }

      // Check camera container exists
      const container = document.getElementById('dc-qr-reader');
      if (!container) return;

      const html5QrCode = new Html5Qrcode('dc-qr-reader', {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      html5QrCodeRef.current = html5QrCode;

      const config = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        { facingMode: facing },
        config,
        (decodedText) => {
          handleDetectedCode(decodedText, 'camera_scan');
        },
        () => {
          // Standard frame scanning tick - ignore
        }
      );

      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera initiation note:', err);
      setIsCameraActive(false);
      if (err?.name === 'NotAllowedError' || (err?.message || '').toLowerCase().includes('permission')) {
        setPermissionDenied(true);
        setErrorMessage(
          language === 'en'
            ? 'Camera access permission was denied. Please allow camera permissions in your browser or use the file upload / manual entry options below.'
            : 'ক্যামেরা ব্যবহারের অনুমতি দেওয়া হয়নি। আপনার ব্রাউজার সেটিংসে ক্যামেরার অনুমতি দিন অথবা নিচের ছবি আপলোড / ম্যানুয়াল অপশন ব্যবহার করুন।'
        );
      } else {
        setErrorMessage(
          language === 'en'
            ? 'Camera is currently unavailable or in use by another application. Please try switching cameras or uploading an image.'
            : 'ক্যামেরা চালু করা যাচ্ছে না। অনুগ্রহ করে ক্যামেরা পরিবর্তন করুন অথবা প্রেসক্রিপশন বা কার্ডের ছবি আপলোড করুন।'
        );
      }
    }
  };

  // Stop Camera Stream
  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch {
        // Ignore
      }
      html5QrCodeRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Switch between front and rear cameras
  const handleToggleCamera = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
  };

  // Process detected QR code
  const handleDetectedCode = async (decodedText: string, channel: 'camera_scan' | 'uploaded_image' | 'manual_entry') => {
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;
    setIsProcessing(true);
    setErrorMessage(null);

    // Stop scanning camera
    stopCamera();

    // Validate destination
    const validation = QRService.validateDestinationUrl(decodedText);

    if (!validation.isValid) {
      setIsProcessing(false);
      hasProcessedRef.current = false;
      setErrorMessage(
        validation.error ||
          (language === 'en'
            ? 'Unrecognized or unauthorized QR code. Please scan a verified Diagnostic Care QR code.'
            : 'অপরিচিত বা অনিরাপদ কিউআর কোড। অনুগ্রহ করে ডায়াগনস্টিক কেয়ারের সঠিক কিউআর কোড স্ক্যান করুন।')
      );
      return;
    }

    setScannedResult({ path: validation.destinationPath, rawText: decodedText });

    // Track analytics in background
    let ownerType: 'doctor' | 'hospital' | 'diagnostic_center' | 'clinic' = 'doctor';
    let ownerId = 'unknown';

    if (validation.destinationPath.includes('/doctors/')) {
      ownerType = 'doctor';
      const parts = validation.destinationPath.split('/doctors/')[1].split('?')[0];
      ownerId = parts;
    } else if (validation.destinationPath.includes('/hospitals/')) {
      ownerType = 'hospital';
      const parts = validation.destinationPath.split('/hospitals/')[1].split('?')[0];
      ownerId = parts;
    } else if (validation.destinationPath.includes('/diagnostic-centers/')) {
      ownerType = 'diagnostic_center';
      const parts = validation.destinationPath.split('/diagnostic-centers/')[1].split('?')[0];
      ownerId = parts;
    }

    if (ownerId !== 'unknown') {
      QRService.recordScanEvent({ ownerType, ownerId, channel });
    }

    // Call custom callback or redirect
    setTimeout(() => {
      setIsProcessing(false);
      if (onScanSuccess) {
        onScanSuccess(validation.destinationPath);
      } else {
        onClose();
        router.push(validation.destinationPath);
      }
    }, 700);
  };

  // File Upload Decoder
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const html5QrCode = new Html5Qrcode('dc-qr-file-decoder', {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });

      const decodedText = await html5QrCode.scanFile(file, true);
      await html5QrCode.clear();

      handleDetectedCode(decodedText, 'uploaded_image');
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(
        language === 'en'
          ? 'Could not detect a clear QR code in this image. Please ensure the QR code is clearly visible, well lit, and in focus.'
          : 'ছবিতে কোনো স্পষ্ট কিউআর কোড পাওয়া যায়নি। অনুগ্রহ করে কোডটি পরিষ্কার ও ফোকাসে রেখে আবার চেষ্টা করুন।'
      );
    }
  };

  // Manual URL/Code submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleDetectedCode(manualInput.trim(), 'manual_entry');
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F8FAFC',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#EFF6FF',
                color: BRAND_COLORS.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Camera size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {language === 'en' ? 'Scan Healthcare QR Code' : 'স্বাস্থ্যসেবা কিউআর কোড স্ক্যান করুন'}
              </h3>
              <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0 }}>
                {language === 'en' ? 'Doctors • Hospitals • Diagnostic Centers' : 'ডাক্তার • হাসপাতাল • ডায়াগনস্টিক সেন্টার'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation (Camera, Upload Image, Manual Code) */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
          }}
        >
          {[
            { id: 'camera', labelEn: 'Camera', labelBn: 'ক্যামেরা', icon: Camera },
            { id: 'upload', labelEn: 'Upload Image', labelBn: 'ছবি আপলোড', icon: Upload },
            { id: 'manual', labelEn: 'Enter URL / Code', labelBn: 'লিংক / কোড', icon: Keyboard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveMode(tab.id as any);
                  setErrorMessage(null);
                }}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '11px 12px',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? BRAND_COLORS.primary : '#64748B',
                  border: 'none',
                  borderBottom: isActive ? `2px solid ${BRAND_COLORS.primary}` : '2px solid transparent',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={15} />
                <span>{language === 'en' ? tab.labelEn : tab.labelBn}</span>
              </button>
            );
          })}
        </div>

        {/* Scanner Body Area */}
        <div
          style={{
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minHeight: '320px',
          }}
        >
          {/* 1. Camera Mode */}
          {activeMode === 'camera' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Camera Scanner Viewport */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '340px',
                  height: '300px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#000000',
                  position: 'relative',
                  border: '2px solid #CBD5E1',
                }}
              >
                <div id="dc-qr-reader" style={{ width: '100%', height: '100%' }} />

                {/* Switch Camera Overlay Button */}
                {isCameraActive && (
                  <button
                    onClick={handleToggleCamera}
                    title="Switch camera"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px',
                      cursor: 'pointer',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <SwitchCamera size={18} />
                  </button>
                )}
              </div>

              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '12px', textAlign: 'center' }}>
                {language === 'en'
                  ? 'Point your camera at the QR code on a prescription, poster, or card.'
                  : 'প্রেসক্রিপশন, পোস্টার বা কার্ডে থাকা কিউআর কোডের দিকে ক্যামেরা তাক করুন।'}
              </p>
            </div>
          )}

          {/* 2. File Upload Mode */}
          {activeMode === 'upload' && (
            <div style={{ width: '100%', textAlign: 'center', padding: '10px 0' }}>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <div id="dc-qr-file-decoder" style={{ display: 'none' }} />

              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: '16px',
                  padding: '36px 20px',
                  backgroundColor: '#F8FAFC',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Upload size={36} color={BRAND_COLORS.primary} style={{ margin: '0 auto 12px auto' }} />
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                  {language === 'en' ? 'Click to select prescription or QR photo' : 'প্রেসক্রিপশন বা কিউআর কোডের ছবি নির্বাচন করুন'}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                  PNG, JPG, WEBP • Max 10MB
                </div>
              </div>
            </div>
          )}

          {/* 3. Manual Entry Mode */}
          {activeMode === 'manual' && (
            <form onSubmit={handleManualSubmit} style={{ width: '100%', padding: '10px 0' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  {language === 'en' ? 'Paste Destination URL or Short Code' : 'ডেস্টিনেশন লিংক বা কোড লিখুন'}
                </label>
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="https://diagnosticcare.vercel.app/doctors/... or /doctors/..."
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13.5px',
                    outline: 'none',
                    color: '#0F172A',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '11px',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                <span>{language === 'en' ? 'Open Verified Profile' : 'ভেরিফাইড প্রোফাইল খুলুন'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Processing / Loading Overlay */}
          {isProcessing && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                zIndex: 20,
              }}
            >
              <RefreshCw size={28} color={BRAND_COLORS.primary} className="spin-animation" />
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                {language === 'en' ? 'Verifying Healthcare Destination...' : 'স্বাস্থ্যসেবা প্রোফাইল ভেরিফাই করা হচ্ছে...'}
              </div>
            </div>
          )}

          {/* Scanned Result Confirmation */}
          {scannedResult && !isProcessing && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <CheckCircle2 size={18} color="#15803D" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '13px', color: '#166534', fontWeight: 600 }}>
                {language === 'en' ? 'Verified destination found! Opening...' : 'সঠিক প্রোফাইল নিশ্চিত হয়েছে! পৃষ্ঠা খোলা হচ্ছে...'}
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '12.5px', color: '#991B1B', lineHeight: 1.5 }}>
                {errorMessage}
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Assurance */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '11px',
            color: '#64748B',
          }}
        >
          <ShieldCheck size={14} color="#15803D" />
          <span>{language === 'en' ? 'Malicious QR protection & HTTPS URL verified' : 'নিরাপদ কিউআর যাচাইকরণ ও ক্ষতিকর লিংক সুরক্ষা সক্রিয়'}</span>
        </div>
      </div>
    </div>
  );
};
export default QRScannerModal;
