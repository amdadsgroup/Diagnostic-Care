'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import jsQR from 'jsqr';
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
  FileImage,
  Info,
  Flashlight,
  VideoOff,
  Sparkles,
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

  // Mode: camera, upload image, or manual entry
  const [activeMode, setActiveMode] = useState<'camera' | 'upload' | 'manual'>('camera');

  // Camera stream and devices
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);

  // Permissions & Errors
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [permissionErrorType, setPermissionErrorType] = useState<'denied' | 'not_found' | 'busy' | 'insecure' | 'generic' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hardware features
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);

  // Decoding & Processing
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<{ path: string; rawText: string } | null>(null);
  const [manualInput, setManualInput] = useState<string>('');

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isScanningRef = useRef<boolean>(false);
  const hasProcessedRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const barcodeDetectorRef = useRef<any>(null);

  // Clean stop of video tracks and scan animation frame
  const stopCamera = useCallback(() => {
    isScanningRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      } catch {
        // ignore
      }
    }
    setIsCameraActive(false);
    setIsInitializing(false);
    setHasTorch(false);
    setIsTorchOn(false);
  }, []);

  // Modal lifecycle cleanup
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      hasProcessedRef.current = false;
      setScannedResult(null);
      setErrorMessage(null);
      setIsProcessing(false);
      setPermissionDenied(false);
      setPermissionErrorType(null);
      return;
    }

    hasProcessedRef.current = false;
    setScannedResult(null);
    setErrorMessage(null);

    // Check existing browser camera permission status if query supported
    if (typeof navigator !== 'undefined' && navigator.permissions?.query) {
      navigator.permissions.query({ name: 'camera' as any })
        .then((res) => {
          if (res.state === 'denied') {
            setPermissionDenied(true);
            setPermissionErrorType('denied');
          }
        })
        .catch(() => {});
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, stopCamera]);

  // Handle successful QR detection
  const handleDetectedCode = async (decodedText: string, channel: 'camera_scan' | 'uploaded_image' | 'manual_entry') => {
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;
    setIsProcessing(true);
    setErrorMessage(null);

    // Stop scanning camera immediately
    stopCamera();

    // Validate and resolve destination
    const validation = await QRService.resolveDestinationUrlAsync(decodedText);

    if (!validation.isValid) {
      setIsProcessing(false);
      hasProcessedRef.current = false;
      setErrorMessage(
        validation.error ||
          (language === 'en'
            ? 'Unrecognized or unauthorized QR code. Please scan an authentic Diagnostic Care QR code.'
            : 'অপরিচিত বা অননুমোদিত কিউআর কোড। অনুগ্রহ করে সঠিক ডায়াগনস্টিক কেয়ারের কোড স্ক্যান করুন।')
      );
      return;
    }

    setScannedResult({ path: validation.destinationPath, rawText: decodedText });

    // Track analytics event in background
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
      QRService.recordScanEvent({ ownerType, ownerId, channel }).catch(() => {});
    }

    // Navigate to resolved destination
    setTimeout(() => {
      setIsProcessing(false);
      if (onScanSuccess) {
        onScanSuccess(validation.destinationPath);
      } else {
        onClose();
        router.push(validation.destinationPath);
      }
    }, 600);
  };

  // Continuous frame scanning loop
  const startScanLoop = useCallback(() => {
    isScanningRef.current = true;

    // Check for native BarcodeDetector API (modern Chromium / Safari 17+)
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window && !barcodeDetectorRef.current) {
      try {
        barcodeDetectorRef.current = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
      } catch {
        barcodeDetectorRef.current = null;
      }
    }

    const checkAndScan = async () => {
      if (!isScanningRef.current || hasProcessedRef.current) return;

      const video = videoRef.current;
      if (!video) {
        animationFrameRef.current = requestAnimationFrame(checkAndScan);
        return;
      }

      // Check if video is playing and has real dimensions
      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        let decodedText: string | null = null;

        // 1. Hardware accelerated Native BarcodeDetector (instant)
        if (barcodeDetectorRef.current) {
          try {
            const barcodes = await barcodeDetectorRef.current.detect(video);
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              decodedText = barcodes[0].rawValue;
            }
          } catch {
            // fall through to jsQR
          }
        }

        // 2. Universal jsQR fallback (pure JavaScript canvas analysis)
        if (!decodedText) {
          try {
            let canvas = canvasRef.current;
            if (!canvas) {
              canvas = document.createElement('canvas');
              canvasRef.current = canvas;
            }
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              // Scale down slightly if video is 4K/1080p for 60fps responsiveness
              const maxDim = 640;
              let w = video.videoWidth;
              let h = video.videoHeight;
              if (w > maxDim || h > maxDim) {
                const ratio = Math.min(maxDim / w, maxDim / h);
                w = Math.floor(w * ratio);
                h = Math.floor(h * ratio);
              }
              if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
              }
              ctx.drawImage(video, 0, 0, w, h);
              const imgData = ctx.getImageData(0, 0, w, h);
              const qrResult = jsQR(imgData.data, imgData.width, imgData.height, {
                inversionAttempts: 'dontInvert',
              });
              if (qrResult && qrResult.data) {
                decodedText = qrResult.data;
              }
            }
          } catch {
            // ignore frame read glitch
          }
        }

        // On successful QR code detection
        if (decodedText && !hasProcessedRef.current) {
          hasProcessedRef.current = true;
          isScanningRef.current = false;

          // Haptic vibration feedback on supported devices
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
              navigator.vibrate([80, 40, 80]);
            } catch {
              // ignore
            }
          }

          stopCamera();
          handleDetectedCode(decodedText, 'camera_scan');
          return;
        }
      }

      // Schedule next frame
      animationFrameRef.current = requestAnimationFrame(checkAndScan);
    };

    animationFrameRef.current = requestAnimationFrame(checkAndScan);
  }, [stopCamera]);

  // Start Camera Stream directly and attach to video element
  const startCamera = async (facingModeParam?: 'environment' | 'user', specificDeviceId?: string) => {
    stopCamera();
    setIsInitializing(true);
    setErrorMessage(null);
    setPermissionDenied(false);
    setPermissionErrorType(null);

    // 1. Check secure context requirement
    if (
      typeof window !== 'undefined' &&
      !window.isSecureContext &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      setIsInitializing(false);
      setPermissionErrorType('insecure');
      setErrorMessage(
        language === 'en'
          ? 'Camera access requires a secure HTTPS connection. Please access Diagnostic Care over HTTPS.'
          : 'ক্যামেরা ব্যবহারের জন্য নিরাপদ HTTPS সংযোগ প্রয়োজন। অনুগ্রহ করে HTTPS দিয়ে ব্রাউজ করুন।'
      );
      return;
    }

    // 2. Check getUserMedia support
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setIsInitializing(false);
      setPermissionErrorType('not_found');
      setErrorMessage(
        language === 'en'
          ? 'Camera device is not supported on this browser. You can upload an image or enter the short code.'
          : 'আপনার ব্রাউজারে ক্যামেরা সমর্থিত নয়। অনুগ্রহ করে প্রেসক্রিপশন বা কার্ডের ছবি আপলোড করুন।'
      );
      return;
    }

    const facing = facingModeParam || cameraFacing;
    const deviceId = specificDeviceId || selectedCameraId;

    try {
      let stream: MediaStream;

      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : {
              facingMode: { ideal: facing },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
        audio: false,
      };

      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err: any) {
        // Fallback for overconstrained camera requests
        if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facing },
            audio: false,
          });
        } else {
          throw err;
        }
      }

      streamRef.current = stream;

      // Enumerate camera devices for device switcher
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices
          .filter((d) => d.kind === 'videoinput')
          .map((d, index) => ({
            id: d.deviceId,
            label: d.label || (index === 0 ? 'Main / Rear Camera' : `Camera ${index + 1}`),
          }));
        if (videoInputs.length > 0) {
          setCameras(videoInputs);
        }
      } catch {
        // ignore device enumeration failure
      }

      // Check if torch/flashlight is supported
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities: any = typeof videoTrack.getCapabilities === 'function' ? videoTrack.getCapabilities() : {};
        if (capabilities?.torch) {
          setHasTorch(true);
        }
      }

      // Attach stream directly to video element
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        video.muted = true;
        await video.play().catch(() => {});
      }

      setIsCameraActive(true);
      setIsInitializing(false);
      startScanLoop();
    } catch (err: any) {
      console.warn('Camera initiation notice:', err);
      setIsInitializing(false);
      setIsCameraActive(false);

      const errName = err?.name || '';
      const errMsg = (err?.message || '').toLowerCase();

      if (errName === 'NotAllowedError' || errMsg.includes('permission') || errMsg.includes('denied')) {
        setPermissionDenied(true);
        setPermissionErrorType('denied');
        setErrorMessage(
          language === 'en'
            ? 'Camera access permission was denied. Please allow camera access in your browser site settings, or use the Upload Photo tab.'
            : 'ক্যামেরা ব্যবহারের অনুমতি দেওয়া হয়নি। ব্রাউজার সেটিংসে ক্যামেরার অনুমতি দিন অথবা ছবি আপলোড করুন।'
        );
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError' || errMsg.includes('not found')) {
        setPermissionErrorType('not_found');
        setErrorMessage(
          language === 'en'
            ? 'No camera was found on your device. You can upload an image or enter the code manually.'
            : 'আপনার ডিভাইসে কোনো ক্যামেরা পাওয়া যায়নি। প্রেসক্রিপশন বা কার্ডের ছবি আপলোড করুন অথবা কোডটি লিখুন।'
        );
      } else if (
        errName === 'NotReadableError' ||
        errName === 'TrackStartError' ||
        errMsg.includes('busy') ||
        errMsg.includes('could not start')
      ) {
        setPermissionErrorType('busy');
        setErrorMessage(
          language === 'en'
            ? 'Camera is in use by another application or tab. Please close other camera apps and click Retry.'
            : 'ক্যামেরা অন্য কোনো অ্যাপে ব্যবহৃত হচ্ছে। অনুগ্রহ করে অন্য অ্যাপ বন্ধ করে পুনরায় চেষ্টা করুন।'
        );
      } else {
        setPermissionErrorType('generic');
        setErrorMessage(
          language === 'en'
            ? 'Unable to start camera stream. Please try uploading an image or entering the code.'
            : 'ক্যামেরা চালু করা সম্ভব হয়নি। অনুগ্রহ করে ছবি আপলোড করুন অথবা কোডটি লিখুন।'
        );
      }
    }
  };

  // Toggle between Front and Rear cameras
  const handleToggleFacingMode = () => {
    if (cameras.length > 1) {
      const currentIndex = cameras.findIndex((c) => c.id === selectedCameraId);
      const nextIndex = (currentIndex + 1) % cameras.length;
      const nextCam = cameras[nextIndex];
      setSelectedCameraId(nextCam.id);
      startCamera(cameraFacing, nextCam.id);
    } else {
      const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
      setCameraFacing(nextFacing);
      startCamera(nextFacing);
    }
  };

  // Toggle Flashlight/Torch on supported hardware
  const handleToggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;
    try {
      const nextState = !isTorchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextState }],
      });
      setIsTorchOn(nextState);
    } catch (e) {
      console.warn('Torch toggle notice:', e);
    }
  };

  // File Upload Decoder
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      let decodedText: string | null = null;

      // 1. Try BarcodeDetector
      if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
        try {
          const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
          const barcodes = await detector.detect(img);
          if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
            decodedText = barcodes[0].rawValue;
          }
        } catch {
          // fallback to jsQR
        }
      }

      // 2. Fallback to jsQR
      if (!decodedText) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, img.width, img.height);
          const qr = jsQR(imgData.data, imgData.width, imgData.height, {
            inversionAttempts: 'attemptBoth',
          });
          if (qr && qr.data) {
            decodedText = qr.data;
          }
        }
      }

      URL.revokeObjectURL(objectUrl);

      if (decodedText) {
        handleDetectedCode(decodedText, 'uploaded_image');
      } else {
        setIsProcessing(false);
        setErrorMessage(
          language === 'en'
            ? 'No readable QR code found in this image. Please ensure the code is well lit, flat, and in focus.'
            : 'ছবিতে কোনো কিউআর কোড পাওয়া যায়নি। অনুগ্রহ করে স্পষ্ট ও ফোকাস করা ছবি আপলোড করুন।'
        );
      }
    } catch {
      setIsProcessing(false);
      setErrorMessage(
        language === 'en'
          ? 'Failed to process image file. Please try another image.'
          : 'ছবিটি প্রসেস করা সম্ভব হয়নি। অন্য একটি ছবি দিয়ে চেষ্টা করুন।'
      );
    }
  };

  // Manual code or URL submit
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
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                color: BRAND_COLORS.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Camera size={20} />
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

        {/* Tab Navigation */}
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
                  if (activeMode === 'camera' && tab.id !== 'camera') {
                    stopCamera();
                  }
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
            minHeight: '340px',
          }}
        >
          {/* 1. Camera Mode */}
          {activeMode === 'camera' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Camera Live Viewport (rendered always in camera mode, visible when active) */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  aspectRatio: '4 / 3',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  backgroundColor: '#090D14',
                  position: 'relative',
                  border: isCameraActive ? '2px solid #0060FA' : '1px solid #E2E8F0',
                  boxShadow: isCameraActive ? '0 10px 30px rgba(0, 96, 250, 0.2)' : 'none',
                  display: isCameraActive ? 'flex' : 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Live Native Video Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Overlaid Scanning Viewfinder & Laser */}
                {isCameraActive && (
                  <>
                    {/* Viewfinder Target Frame */}
                    <div
                      style={{
                        position: 'absolute',
                        width: '210px',
                        height: '210px',
                        border: '2px solid rgba(255, 255, 255, 0.35)',
                        borderRadius: '20px',
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Corner Brackets */}
                      <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '24px', height: '24px', borderTop: '4px solid #0060FA', borderLeft: '4px solid #0060FA', borderRadius: '4px 0 0 0' }} />
                      <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '24px', height: '24px', borderTop: '4px solid #0060FA', borderRight: '4px solid #0060FA', borderRadius: '0 4px 0 0' }} />
                      <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '24px', height: '24px', borderBottom: '4px solid #0060FA', borderLeft: '4px solid #0060FA', borderRadius: '0 0 0 4px' }} />
                      <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '24px', height: '24px', borderBottom: '4px solid #0060FA', borderRight: '4px solid #0060FA', borderRadius: '0 0 4px 0' }} />

                      {/* Animated Laser Beam */}
                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '2px',
                          backgroundColor: '#00D1FF',
                          boxShadow: '0 0 8px #00D1FF, 0 0 16px #0060FA',
                          animation: 'dc-laser-scan 2s ease-in-out infinite alternate',
                        }}
                      />
                    </div>

                    {/* Top Status Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(6px)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        color: '#FFFFFF',
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
                      <span>{language === 'en' ? 'Scanning Live' : 'লাইভ স্ক্যান হচ্ছে'}</span>
                    </div>

                    {/* Top Right Controls (Switch camera, Torch, Stop) */}
                    <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px' }}>
                      {hasTorch && (
                        <button
                          onClick={handleToggleTorch}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: isTorchOn ? '#F59E0B' : 'rgba(15, 23, 42, 0.75)',
                            color: '#FFFFFF',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Flashlight size={15} />
                        </button>
                      )}

                      {cameras.length > 1 && (
                        <button
                          onClick={handleToggleFacingMode}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(15, 23, 42, 0.75)',
                            color: '#FFFFFF',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Switch camera"
                        >
                          <SwitchCamera size={15} />
                        </button>
                      )}

                      <button
                        onClick={stopCamera}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(15, 23, 42, 0.75)',
                          color: '#FFFFFF',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Pause camera"
                      >
                        <VideoOff size={15} />
                      </button>
                    </div>

                    {/* Bottom Instructions */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '0',
                        right: '0',
                        textAlign: 'center',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 600,
                        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                        pointerEvents: 'none',
                      }}
                    >
                      {language === 'en' ? 'Position the QR code inside the frame' : 'ফ্রেমের ভেতরে কিউআর কোডটি রাখুন'}
                    </div>
                  </>
                )}
              </div>

              {/* Initial Screen or Permission/Error State (visible when camera is NOT active) */}
              {!isCameraActive && (
                <div
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '28px 20px',
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
                      width: '64px',
                      height: '64px',
                      borderRadius: '18px',
                      backgroundColor: permissionDenied ? '#FFEDD5' : (errorMessage ? '#FEE2E2' : '#EFF6FF'),
                      color: permissionDenied ? '#EA580C' : (errorMessage ? '#DC2626' : BRAND_COLORS.primary),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                      boxShadow: permissionDenied
                        ? '0 4px 12px rgba(234,88,12,0.12)'
                        : (errorMessage ? '0 4px 12px rgba(220,38,38,0.1)' : '0 4px 12px rgba(0,96,250,0.12)'),
                    }}
                  >
                    {permissionDenied ? <Lock size={30} /> : (errorMessage ? <AlertTriangle size={30} /> : <Camera size={30} />)}
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                    {permissionDenied
                      ? (language === 'en' ? 'Camera Blocked in Browser' : 'ব্রাউজারে ক্যামেরা ব্লক করা আছে')
                      : (errorMessage
                          ? (language === 'en' ? 'Camera Unavailable' : 'ক্যামেরা চালু করা যাচ্ছে না')
                          : (language === 'en' ? 'Enable Camera Scanning' : 'ক্যামেরা স্ক্যান চালু করুন'))}
                  </h3>

                  {permissionDenied ? (
                    <div style={{ width: '100%', textAlign: 'left', margin: '12px 0 16px 0' }}>
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
                          {language === 'en' ? 'How to unblock camera in browser:' : 'কীভাবে ব্রাউজারে ক্যামেরা আনব্লক করবেন:'}
                        </p>
                        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#64748B' }}>
                          {language === 'en'
                            ? '1. Tap the Lock (🔒) or Tune (⚙️) icon in your browser address bar above.\n2. Change Camera permission to "Allow".\n3. Click "I Unblocked It — Check Again" below.'
                            : '১. ব্রাউজারের অ্যাড্রেস বারের তালার আইকন (🔒) বা সেটিংস এ চাপুন।\n২. ক্যামেরা অনুমতি "Allow" বা "অনুমতি দিন" নির্বাচন করুন।\n৩. নিচের বাটনে চাপ দিন।'}
                        </p>
                      </div>
                    </div>
                  ) : errorMessage ? (
                    <p style={{ fontSize: '13px', color: '#DC2626', margin: '6px 0 16px 0', lineHeight: 1.5 }}>
                      {errorMessage}
                    </p>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 18px 0', lineHeight: 1.5, maxWidth: '320px' }}>
                      {language === 'en'
                        ? 'Point your camera at any Diagnostic Care doctor prescription, visiting card, or hospital poster to book instantly.'
                        : 'প্রেসক্রিপশন, কার্ড বা চেম্বার পোস্টারের কিউআর কোড স্ক্যান করে সরাসরি অভিজ্ঞ চিকিৎসকের সিরিয়াল নিন।'}
                    </p>
                  )}

                  {/* Camera Action Buttons */}
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                      onClick={() => startCamera()}
                      disabled={isInitializing}
                      className="btn-primary"
                      id="btn-enable-camera-scan"
                      style={{
                        width: '100%',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        fontSize: '14.5px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: isInitializing ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 14px rgba(0,96,250,0.25)',
                      }}
                    >
                      {isInitializing ? (
                        <>
                          <RefreshCw size={17} className="spin-animation" />
                          <span>{language === 'en' ? 'Starting Camera...' : 'ক্যামেরা চালু হচ্ছে...'}</span>
                        </>
                      ) : (
                        <>
                          <Camera size={18} />
                          <span>
                            {permissionDenied
                              ? (language === 'en' ? 'I Unblocked It — Check Again' : 'আনব্লক করেছি — পুনরায় পরীক্ষা করুন')
                              : (errorMessage
                                  ? (language === 'en' ? 'Retry Camera' : 'পুনরায় চেষ্টা করুন')
                                  : (language === 'en' ? 'Enable Camera & Scan' : 'ক্যামেরা চালু করুন ও স্ক্যান করুন'))}
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setErrorMessage(null);
                        setActiveMode('upload');
                      }}
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
                      <FileImage size={16} />
                      <span>{language === 'en' ? 'Upload QR Photo Instead' : 'ছবি আপলোড করে স্ক্যান করুন'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. Upload Image Mode */}
          {activeMode === 'upload' && (
            <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: '18px',
                  padding: '36px 20px',
                  backgroundColor: '#F8FAFC',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    backgroundColor: '#EFF6FF',
                    color: BRAND_COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <Upload size={28} />
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  {language === 'en' ? 'Upload QR Code Photo' : 'কিউআর কোডের ছবি আপলোড করুন'}
                </h4>
                <p style={{ fontSize: '12.5px', color: '#64748B', maxWidth: '280px', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  {language === 'en'
                    ? 'Take a photo of a prescription or choose an image from your gallery'
                    : 'প্রেসক্রিপশন বা কার্ডের ছবি তুলুন অথবা গ্যালারি থেকে সিলেক্ট করুন'}
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '13px', borderRadius: '8px' }}
                >
                  {language === 'en' ? 'Select Image' : 'ছবি নির্বাচন করুন'}
                </button>
              </div>

              {errorMessage && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#DC2626',
                    fontSize: '12.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textAlign: 'left',
                  }}
                >
                  <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* 3. Manual Entry Mode */}
          {activeMode === 'manual' && (
            <div style={{ width: '100%', maxWidth: '380px' }}>
              <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    {language === 'en' ? 'Doctor BMDC Number, Short Code, or URL' : 'ডাক্তারের বিএমডিসি নম্বর, কোড বা লিংক'}
                  </label>
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="e.g. A-48291, prof-dr-m-a-rahim, or URL"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      color: '#0F172A',
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '4px' }}>
                    {language === 'en'
                      ? 'Examples: A-48291, mount-adora-hospital, popular-moulvibazar'
                      : 'উদাহরণ: A-48291, mount-adora-hospital, popular-moulvibazar'}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!manualInput.trim() || isProcessing}
                  className="btn-primary"
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: !manualInput.trim() || isProcessing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{language === 'en' ? 'Open Healthcare Profile' : 'প্রোফাইল ওপেন করুন'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {errorMessage && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#DC2626',
                    fontSize: '12.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* Scanned Success Confirmation Overlay */}
          {scannedResult && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                zIndex: 20,
                borderRadius: '0 0 24px 24px',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#DCFCE7',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  boxShadow: '0 8px 24px rgba(22, 163, 74, 0.2)',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                {language === 'en' ? 'QR Code Verified!' : 'কিউআর কোড যাচাই সম্পন্ন!'}
              </h4>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', textAlign: 'center' }}>
                {language === 'en'
                  ? 'Opening verified healthcare profile...'
                  : 'স্বাস্থ্যসেবা প্রোফাইল ওপেন হচ্ছে...'}
              </p>
              <div
                style={{
                  backgroundColor: '#F1F5F9',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ShieldCheck size={14} color="#16A34A" />
                <span>{scannedResult.path}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '11.5px',
            color: '#64748B',
          }}
        >
          <ShieldCheck size={14} color="#16A34A" />
          <span>
            {language === 'en'
              ? 'Diagnostic Care Secure Gateway • End-to-end verified profiles'
              : 'ডায়াগনস্টিক কেয়ার সিকিউর গেটওয়ে • ভেরিফাইড প্রোফাইল ও বুকিং'}
          </span>
        </div>
      </div>

      {/* Laser Scanning CSS Animation */}
      <style jsx>{`
        @keyframes dc-laser-scan {
          0% {
            top: 8%;
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
          100% {
            top: 92%;
            opacity: 0.8;
          }
        }
        .spin-animation {
          animation: dc-spin 1s linear infinite;
        }
        @keyframes dc-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default QRScannerModal;
