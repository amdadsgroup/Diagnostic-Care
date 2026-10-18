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
  Lock,
  Sliders,
  FileImage,
  Info,
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
  const [cameraRequested, setCameraRequested] = useState<boolean>(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [noCameraHardware, setNoCameraHardware] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<{ path: string; rawText: string } | null>(null);
  const [manualInput, setManualInput] = useState<string>('');

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasProcessedRef = useRef<boolean>(false);

  // Initialize or teardown camera on open/close and listen for permission changes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      hasProcessedRef.current = false;
      setScannedResult(null);
      setErrorMessage(null);
      setIsProcessing(false);
      setCameraRequested(false);
      setIsRequestingPermission(false);
      setPermissionDenied(false);
      setNoCameraHardware(false);
      return;
    }

    hasProcessedRef.current = false;
    setScannedResult(null);
    setErrorMessage(null);

    // Live permission monitoring
    let permObj: PermissionStatus | null = null;
    if (typeof navigator !== 'undefined' && navigator.permissions?.query) {
      navigator.permissions.query({ name: 'camera' as any })
        .then((res) => {
          permObj = res;
          if (res.state === 'granted') {
            setPermissionDenied(false);
            setErrorMessage(null);
            if (activeMode === 'camera') {
              setCameraRequested(true);
              startCamera(cameraFacing);
            }
          } else if (res.state === 'denied') {
            setPermissionDenied(true);
          }

          // Automatically start when user unblocks in browser address bar!
          res.onchange = () => {
            if (res.state === 'granted') {
              setPermissionDenied(false);
              setErrorMessage(null);
              setCameraRequested(true);
              startCamera(cameraFacing);
            } else if (res.state === 'denied') {
              setPermissionDenied(true);
            } else {
              setPermissionDenied(false);
            }
          };
        })
        .catch(() => {});
    }

    return () => {
      stopCamera();
      if (permObj) {
        permObj.onchange = null;
      }
    };
  }, [isOpen, activeMode]);

  // Handle camera switch when camera is already active
  useEffect(() => {
    if (isOpen && activeMode === 'camera' && cameraRequested && isCameraActive) {
      startCamera(cameraFacing);
    }
  }, [cameraFacing]);

  // Request browser permission explicitly on user gesture
  const handleRequestCameraPermission = async () => {
    setIsRequestingPermission(true);
    setErrorMessage(null);
    setPermissionDenied(false);
    setNoCameraHardware(false);

    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera device not supported by this browser');
      }

      // Check if any camera hardware is actually detected on the system
      if (navigator.mediaDevices.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter((d) => d.kind === 'videoinput');
          if (devices.length > 0 && videoDevices.length === 0) {
            setNoCameraHardware(true);
            setIsRequestingPermission(false);
            setErrorMessage(
              language === 'en'
                ? 'No webcam or camera device was detected on your computer. Please connect a camera or use "Upload Image" instead.'
                : 'আপনার ডিভাইসে কোনো ক্যামেরা পাওয়া যায়নি। অনুগ্রহ করে ওয়েবক্যাম সংযোগ করুন অথবা "ছবি আপলোড" অপশন ব্যবহার করুন।'
            );
            return;
          }
        } catch {
          // Continue if enumerateDevices fails
        }
      }

      // Explicit user-gesture camera permission prompt
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacing }
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      // Stop probe stream so Html5Qrcode can bind the camera device cleanly
      stream.getTracks().forEach((track) => track.stop());

      setCameraRequested(true);
      setIsRequestingPermission(false);

      // Give React one tick to render #dc-qr-reader container
      setTimeout(() => {
        startCamera(cameraFacing);
      }, 150);
    } catch (err: any) {
      setIsRequestingPermission(false);
      console.warn('Camera permission note:', err);
      const isDenied = err?.name === 'NotAllowedError' || (err?.message || '').toLowerCase().includes('permission') || (err?.message || '').toLowerCase().includes('denied');
      const isNotFound = err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError';

      if (isNotFound) {
        setNoCameraHardware(true);
        setErrorMessage(
          language === 'en'
            ? 'No webcam was found on your computer. You can upload an image of the QR code or enter the code manually.'
            : 'আপনার ডিভাইসে কোনো ক্যামেরা নেই। প্রেসক্রিপশন বা কার্ডের ছবি আপলোড করুন অথবা কোডটি লিখুন।'
        );
      } else if (isDenied) {
        setPermissionDenied(true);
        setErrorMessage(
          language === 'en'
            ? 'Camera access was blocked in your browser settings. Browsers suppress permission popups once blocked.'
            : 'ক্যামেরা ব্যবহারের অনুমতি ব্রাউজারে ব্লক করা আছে। একবার ব্লক করা থাকলে ব্রাউজার নতুন কোনো পপআপ দেখায় না।'
        );
      } else {
        setErrorMessage(
          language === 'en'
            ? 'Camera is currently unavailable or in use by another application. Please close other camera apps or upload an image.'
            : 'ক্যামেরা চালু করা যাচ্ছে না বা অন্য অ্যাপে ব্যবহৃত হচ্ছে। অনুগ্রহ করে অন্য অ্যাপ বন্ধ করুন বা ছবি আপলোড করুন।'
        );
      }
    }
  };

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
        qrbox: { width: 240, height: 240 },
        aspectRatio: 1.0,
      };

      // Try preferred facing mode first, fall back to any camera if OverconstrainedError
      try {
        await html5QrCode.start(
          { facingMode: facing },
          config,
          (decodedText) => {
            handleDetectedCode(decodedText, 'camera_scan');
          },
          () => {}
        );
      } catch (firstErr) {
        // Fallback constraint: generic camera
        await html5QrCode.start(
          { facingMode: 'user' },
          config,
          (decodedText) => {
            handleDetectedCode(decodedText, 'camera_scan');
          },
          () => {}
        );
      }

      setIsCameraActive(true);
      setCameraRequested(true);
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
            ? 'Camera is currently unavailable or in use by another application. Please try uploading an image or entering the short code.'
            : 'ক্যামেরা চালু করা যাচ্ছে না। অনুগ্রহ করে প্রেসক্রিপশন বা কার্ডের ছবি আপলোড করুন অথবা কোডটি লিখুন।'
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
              {!isCameraActive ? (
                /* Camera Permission or Error Card */
                <div
                  style={{
                    width: '100%',
                    maxWidth: '420px',
                    padding: '24px 20px',
                    borderRadius: '20px',
                    backgroundColor: permissionDenied ? '#FFF7ED' : (errorMessage ? '#FEF2F2' : '#F8FAFC'),
                    border: permissionDenied ? '1px solid #FED7AA' : (errorMessage ? '1px solid #FECACA' : '1px solid #E2E8F0'),
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '18px',
                      backgroundColor: permissionDenied ? '#FFEDD5' : (errorMessage ? '#FEE2E2' : '#EFF6FF'),
                      color: permissionDenied ? '#EA580C' : (errorMessage ? '#DC2626' : BRAND_COLORS.primary),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '14px',
                      boxShadow: permissionDenied
                        ? '0 4px 12px rgba(234,88,12,0.12)'
                        : (errorMessage ? '0 4px 12px rgba(220,38,38,0.1)' : '0 4px 12px rgba(0,96,250,0.12)'),
                    }}
                  >
                    {permissionDenied ? <Lock size={28} /> : (errorMessage ? <AlertTriangle size={28} /> : <Camera size={28} />)}
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                    {permissionDenied
                      ? (language === 'en' ? 'Camera Blocked in Browser' : 'ব্রাউজারে ক্যামেরা ব্লক করা আছে')
                      : (noCameraHardware
                          ? (language === 'en' ? 'No Camera Detected' : 'কোনো ক্যামেরা পাওয়া যায়নি')
                          : (errorMessage
                              ? (language === 'en' ? 'Camera Currently Unavailable' : 'ক্যামেরা চালু করা যাচ্ছে না')
                              : (language === 'en' ? 'Camera Permission Required' : 'ক্যামেরা ব্যবহারের অনুমতি প্রয়োজন')))}
                  </h3>

                  {permissionDenied ? (
                    <div style={{ width: '100%', textAlign: 'left', margin: '10px 0 16px 0' }}>
                      <div
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          padding: '12px 14px',
                          border: '1px solid #FDBA74',
                          fontSize: '12.5px',
                          color: '#475569',
                          lineHeight: 1.5,
                        }}
                      >
                        <p style={{ fontWeight: 700, color: '#9A3412', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Info size={15} />
                          {language === 'en' ? 'Why is there no permission popup?' : 'অনুমতির পপআপ কেন আসছে না?'}
                        </p>
                        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748B' }}>
                          {language === 'en'
                            ? 'Google Chrome blocks websites from showing popups once camera access has been blocked. You can unblock it in 3 seconds:'
                            : 'ব্রাউজার সেটিংসে ক্যামেরা একবার ব্লক করা থাকলে নতুন করে পপআপ দেখানো বন্ধ থাকে। আনব্লক করার সহজ ৩টি ধাপ:'}
                        </p>
                        <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#1E293B', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <li>
                            {language === 'en' ? (
                              <span>Click the <strong>Tune / Settings icon (🎛️ or 🔒)</strong> on the far left of your address bar (next to <i>diagnosticcare.vercel.app</i>).</span>
                            ) : (
                              <span>ব্রাউজার অ্যাড্রেস বারের শুরুতে <strong>সেটিংস বা লক আইকনে (🎛️ বা 🔒)</strong> ক্লিক করুন।</span>
                            )}
                          </li>
                          <li>
                            {language === 'en' ? (
                              <span>Find <strong>Camera</strong> and toggle it to <strong>Allow</strong> (or click <i>Reset permission</i>).</span>
                            ) : (
                              <span><strong>Camera</strong> অপশনটি <strong>Allow</strong> বা চালু করুন।</span>
                            )}
                          </li>
                          <li>
                            {language === 'en' ? (
                              <span>This screen will <strong>automatically detect</strong> it and open your camera!</span>
                            ) : (
                              <span>পরিবর্তন করলেই ক্যামেরা <strong>স্বয়ংক্রিয়ভাবে চালু</strong> হয়ে যাবে!</span>
                            )}
                          </li>
                        </ol>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55, margin: '0 0 18px 0' }}>
                      {errorMessage
                        ? errorMessage
                        : (language === 'en'
                            ? 'To scan a medical prescription, chamber card, or healthcare poster, click the button below to allow camera access.'
                            : 'প্রেসক্রিপশন বা ডাক্তারের কিউআর কোড স্ক্যান করতে নিচের বাটনে ক্লিক করে ক্যামেরা চালু করুন।')}
                    </p>
                  )}

                  {/* Actions Area */}
                  {permissionDenied ? (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button
                        onClick={() => {
                          setErrorMessage(null);
                          setActiveMode('upload');
                        }}
                        className="btn-primary"
                        style={{
                          width: '100%',
                          padding: '12px 18px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 14px rgba(0,96,250,0.25)',
                        }}
                      >
                        <FileImage size={18} />
                        <span>{language === 'en' ? 'Upload QR Photo Instead (Fastest)' : 'ছবি আপলোড করে স্ক্যান করুন (দ্রুততম)'}</span>
                      </button>

                      <button
                        onClick={handleRequestCameraPermission}
                        disabled={isRequestingPermission}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: 600,
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#FFFFFF',
                          color: '#334155',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        {isRequestingPermission ? (
                          <>
                            <RefreshCw size={15} className="spin-animation" />
                            <span>{language === 'en' ? 'Checking browser permission...' : 'অনুমতি যাচাই হচ্ছে...'}</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw size={15} />
                            <span>{language === 'en' ? 'I Unblocked It — Check Again' : 'আনব্লক করেছি — পুনরায় পরীক্ষা করুন'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleRequestCameraPermission}
                      disabled={isRequestingPermission}
                      className="btn-primary"
                      id="btn-request-camera-permission"
                      style={{
                        width: '100%',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: isRequestingPermission ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 14px rgba(0,96,250,0.25)',
                      }}
                    >
                      {isRequestingPermission ? (
                        <>
                          <RefreshCw size={17} className="spin-animation" />
                          <span>{language === 'en' ? 'Requesting Browser Permission...' : 'ব্রাউজারে অনুমতি চাওয়া হচ্ছে...'}</span>
                        </>
                      ) : (
                        <>
                          <Camera size={18} />
                          <span>
                            {errorMessage
                              ? (language === 'en' ? 'Try Again' : 'পুনরায় চেষ্টা করুন')
                              : (language === 'en' ? 'Enable Camera & Scan' : 'ক্যামেরা চালু করুন ও স্ক্যান করুন')}
                          </span>
                        </>
                      )}
                    </button>
                  )}

                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', fontSize: '12px' }}>
                    <button
                      onClick={() => {
                        setErrorMessage(null);
                        setActiveMode('upload');
                      }}
                      style={{ background: 'none', border: 'none', color: '#0060FA', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                    >
                      {language === 'en' ? 'Upload QR Photo' : 'ছবি আপলোড করুন'}
                    </button>
                    <span style={{ color: '#CBD5E1' }}>•</span>
                    <button
                      onClick={() => {
                        setErrorMessage(null);
                        setActiveMode('manual');
                      }}
                      style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                    >
                      {language === 'en' ? 'Enter Code / URL' : 'কোড লিখুন'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Live Camera Scanner Viewport */
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '340px',
                      height: '300px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      backgroundColor: '#000000',
                      position: 'relative',
                      border: '2px solid #0060FA',
                      boxShadow: '0 8px 24px rgba(0, 96, 250, 0.15)',
                    }}
                  >
                    <div id="dc-qr-reader" style={{ width: '100%', height: '100%' }} />

                    {/* Switch Camera Overlay Button */}
                    <button
                      onClick={handleToggleCamera}
                      title="Switch front/rear camera"
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px',
                        cursor: 'pointer',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <SwitchCamera size={18} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0, textAlign: 'center' }}>
                      {language === 'en'
                        ? 'Align QR code within the scanning frame.'
                        : 'ফ্রেমের মাঝে কিউআর কোডটি সরাসরি রাখুন।'}
                    </p>
                    <button
                      onClick={stopCamera}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#DC2626',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '2px 6px',
                      }}
                    >
                      {language === 'en' ? 'Stop Camera' : 'ক্যামেরা বন্ধ করুন'}
                    </button>
                  </div>
                </div>
              )}
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
