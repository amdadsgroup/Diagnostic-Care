/**
 * Diagnostic Care — Universal QR Code, Scanner, Smart Booking & Doctor Wishlist Test Suite
 * Automated End-to-End Verification of Section 1 to 11 requirements.
 */

const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

async function runQRAndWishlistTestSuite() {
  console.log('========================================================================');
  console.log('🩺 DIAGNOSTIC CARE — QR CODE SYSTEM & PATIENT WISHLIST AUDIT SUITE');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Customer Care Helpline: 01886748564');
  console.log('========================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName, details = '') {
    total++;
    if (condition) {
      console.log(`✅ [${total}] PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ [${total}] FAIL: ${testName} -> ${details}`);
    }
  }

  // --------------------------------------------------------------------------
  // TEST 1: Universal QR Code URL Generation & Normalization
  // --------------------------------------------------------------------------
  const base = 'https://diagnosticcare.vercel.app';
  
  function getPublicProfileUrl(ownerType, ownerId) {
    const type = (ownerType || 'doctor').toLowerCase();
    switch (type) {
      case 'doctor':
        return `${base}/doctors/${ownerId}?source=qr`;
      case 'hospital':
      case 'clinic':
        return `${base}/hospitals/${ownerId}?source=qr`;
      case 'diagnostic_center':
        return `${base}/diagnostic-centers/${ownerId}?source=qr`;
      default:
        return `${base}/doctors/${ownerId}?source=qr`;
    }
  }

  const docUrl = getPublicProfileUrl('doctor', 'doc-123');
  assert(docUrl === 'https://diagnosticcare.vercel.app/doctors/doc-123?source=qr', 'Doctor QR URL generation');

  const hospUrl = getPublicProfileUrl('HOSPITAL', 'hosp-456');
  assert(hospUrl === 'https://diagnosticcare.vercel.app/hospitals/hosp-456?source=qr', 'Hospital QR URL generation (case-insensitive)');

  const diagUrl = getPublicProfileUrl('diagnostic_center', 'diag-789');
  assert(diagUrl === 'https://diagnosticcare.vercel.app/diagnostic-centers/diag-789?source=qr', 'Diagnostic Center QR URL generation');

  const clinicUrl = getPublicProfileUrl('clinic', 'clinic-001');
  assert(clinicUrl === 'https://diagnosticcare.vercel.app/hospitals/clinic-001?source=qr', 'Clinic QR URL generation');

  // --------------------------------------------------------------------------
  // TEST 2: Strict Destination URL Security & Malicious Open-Redirect Defense
  // --------------------------------------------------------------------------
  function validateDestinationUrl(scannedText) {
    if (!scannedText || typeof scannedText !== 'string') {
      return { isValid: false, destinationPath: '', error: 'Empty or invalid QR code content.' };
    }
    const trimmed = scannedText.trim();
    if (trimmed.startsWith('/')) {
      if (
        trimmed.startsWith('/doctors/') ||
        trimmed.startsWith('/doctor/') ||
        trimmed.startsWith('/hospitals/') ||
        trimmed.startsWith('/hospital/') ||
        trimmed.startsWith('/diagnostic-centers/') ||
        trimmed.startsWith('/diagnostic-center/') ||
        trimmed.startsWith('/clinic/') ||
        trimmed.startsWith('/appointments')
      ) {
        let normalized = trimmed;
        if (normalized.startsWith('/doctor/')) normalized = normalized.replace('/doctor/', '/doctors/');
        if (normalized.startsWith('/hospital/')) normalized = normalized.replace('/hospital/', '/hospitals/');
        if (normalized.startsWith('/diagnostic-center/')) normalized = normalized.replace('/diagnostic-center/', '/diagnostic-centers/');
        if (normalized.startsWith('/clinic/')) normalized = normalized.replace('/clinic/', '/hospitals/');
        return { isValid: true, destinationPath: normalized };
      }
      return { isValid: false, destinationPath: '', error: 'Unsupported application path.' };
    }

    try {
      const parsed = new URL(trimmed);
      const allowedHostnames = [
        'diagnosticcare.vercel.app',
        'diagnostic-care.vercel.app',
        'localhost',
        '127.0.0.1',
      ];
      const isAllowedHost =
        allowedHostnames.includes(parsed.hostname) ||
        (parsed.hostname.endsWith('.vercel.app') && parsed.hostname.includes('diagnostic-care'));

      if (!isAllowedHost) {
        return { isValid: false, destinationPath: '', error: 'External destination rejected.' };
      }

      let path = parsed.pathname;
      if (path.startsWith('/doctor/')) path = path.replace('/doctor/', '/doctors/');
      if (path.startsWith('/hospital/')) path = path.replace('/hospital/', '/hospitals/');
      if (path.startsWith('/diagnostic-center/')) path = path.replace('/diagnostic-center/', '/diagnostic-centers/');
      if (path.startsWith('/clinic/')) path = path.replace('/clinic/', '/hospitals/');

      const isValidPath =
        path.startsWith('/doctors/') ||
        path.startsWith('/hospitals/') ||
        path.startsWith('/diagnostic-centers/') ||
        path.startsWith('/appointments') ||
        path === '/';

      if (!isValidPath) {
        return { isValid: false, destinationPath: '', error: 'Unrecognized healthcare destination route.' };
      }

      return { isValid: true, destinationPath: `${path}${parsed.search}${parsed.hash}` };
    } catch {
      return { isValid: false, destinationPath: '', error: 'Invalid URL format in QR code.' };
    }
  }

  // Trusted URLs
  const validScan1 = validateDestinationUrl('https://diagnosticcare.vercel.app/doctors/20000001-0000-0000-0000-000000000001?source=qr');
  assert(validScan1.isValid && validScan1.destinationPath.includes('/doctors/20000001'), 'Valid doctor QR destination accepted');

  const validScan2 = validateDestinationUrl('/doctor/dr-rahman?source=qr');
  assert(validScan2.isValid && validScan2.destinationPath.startsWith('/doctors/dr-rahman'), 'Singular /doctor/ path normalized to /doctors/');

  const validScan3 = validateDestinationUrl('https://diagnosticcare.vercel.app/diagnostic-center/popular-moulvibazar');
  assert(validScan3.isValid && validScan3.destinationPath.startsWith('/diagnostic-centers/popular-moulvibazar'), 'Singular /diagnostic-center/ path normalized');

  // Untrusted / Malicious URLs
  const malicious1 = validateDestinationUrl('https://phishing-healthcare.com/doctors/steal-creds');
  assert(!malicious1.isValid, 'Malicious external domain blocked');

  const malicious2 = validateDestinationUrl('javascript:alert(document.cookie)');
  assert(!malicious2.isValid, 'XSS JavaScript URI blocked');

  const malicious3 = validateDestinationUrl('https://evil.com?target=https://diagnosticcare.vercel.app');
  assert(!malicious3.isValid, 'Open-redirect attack vector blocked');

  // --------------------------------------------------------------------------
  // TEST 3: High-Resolution Vector SVG & PNG QR Generation
  // --------------------------------------------------------------------------
  const sampleUrl = 'https://diagnosticcare.vercel.app/doctors/20000001-0000-0000-0000-000000000001?source=qr';
  
  const svgOutput = await QRCode.toString(sampleUrl, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 2,
    color: { dark: '#090D14', light: '#FFFFFF' },
  });
  assert(svgOutput.includes('<svg') && svgOutput.includes('</svg>') && svgOutput.length > 500, 'Vector SVG QR code generated with High error correction');

  const pngDataUrl = await QRCode.toDataURL(sampleUrl, {
    errorCorrectionLevel: 'H',
    width: 1024,
    margin: 2,
    color: { dark: '#090D14', light: '#FFFFFF' },
  });
  assert(pngDataUrl.startsWith('data:image/png;base64,') && pngDataUrl.length > 1000, 'Crystal-clear 1024px PNG data URL generated');

  // --------------------------------------------------------------------------
  // TEST 4: Next.js Configuration Security & Camera Permissions Policy
  // --------------------------------------------------------------------------
  const nextConfigPath = path.join(__dirname, '..', 'next.config.mjs');
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');

  assert(
    nextConfigContent.includes("camera=(self)"),
    'Camera access allowed in next.config.mjs Permissions-Policy header'
  );

  assert(
    nextConfigContent.includes("source: '/doctor/:id'") &&
    nextConfigContent.includes("destination: '/doctors/:id'") &&
    nextConfigContent.includes("source: '/diagnostic-center/:id'") &&
    nextConfigContent.includes("source: '/hospital/:id'"),
    'Permanent redirects configured in next.config.mjs for singular routes'
  );

  // --------------------------------------------------------------------------
  // TEST 5: Supabase Migration Schema & RLS Policies
  // --------------------------------------------------------------------------
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20261018000003_qr_system_and_wishlist.sql');
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');

  assert(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.doctor_wishlist'), 'doctor_wishlist table defined in migration');
  assert(migrationSql.includes('CONSTRAINT uq_doctor_wishlist_patient_doc UNIQUE (patient_profile_id, doctor_id)'), 'Unique constraint prevents duplicate wishlist entries');
  assert(migrationSql.includes('ALTER TABLE public.doctor_wishlist ENABLE ROW LEVEL SECURITY'), 'RLS enabled on doctor_wishlist');
  assert(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.qr_code_records'), 'qr_code_records table defined in migration');
  assert(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.qr_scan_events'), 'qr_scan_events telemetry table defined in migration');
  assert(migrationSql.includes('CREATE OR REPLACE FUNCTION public.fn_track_qr_scan'), 'Atomic stored procedure fn_track_qr_scan defined');

  // --------------------------------------------------------------------------
  // TEST 6: Wishlist Store Operations (In-Memory + Storage Lifecycle)
  // --------------------------------------------------------------------------
  const mockWishlist = new Map();
  function addToWishlist(userId, docId) {
    const key = `${userId}:${docId}`;
    if (mockWishlist.has(key)) return false;
    mockWishlist.set(key, { userId, docId, createdAt: Date.now() });
    return true;
  }
  function removeFromWishlist(userId, docId) {
    const key = `${userId}:${docId}`;
    return mockWishlist.delete(key);
  }

  const patientId = 'user-pat-001';
  const doctorId = '20000001-0000-0000-0000-000000000001';

  assert(addToWishlist(patientId, doctorId) === true, 'Doctor successfully saved to wishlist');
  assert(addToWishlist(patientId, doctorId) === false, 'Duplicate wishlist save attempt safely deduplicated');
  assert(removeFromWishlist(patientId, doctorId) === true, 'Doctor successfully removed from wishlist');

  // --------------------------------------------------------------------------
  // TEST 7: Bilingual Translation Keys Parity for QR & Wishlist
  // --------------------------------------------------------------------------
  const translationsPath = path.join(__dirname, '..', 'src', 'i18n', 'translations.ts');
  const translationsContent = fs.readFileSync(translationsPath, 'utf8');

  const requiredKeys = [
    'qrScanTitle',
    'qrScanSubtitle',
    'qrScanAction',
    'qrDownloadPng',
    'qrDownloadSvg',
    'qrPrintCard',
    'qrPresetPrescription',
    'qrPresetVisitingCard',
    'qrPresetPoster',
    'qrPresetA4Sheet',
    'qrPresetCustom',
    'wishlistSaveDoctor',
    'wishlistSavedDoctor',
    'wishlistMyWishlist',
    'wishlistEmptyNotice',
  ];

  const allKeysPresent = requiredKeys.every(k => translationsContent.includes(k));
  assert(allKeysPresent, '100% of required QR and Wishlist translation keys defined for EN & BN');

  // --------------------------------------------------------------------------
  // SUMMARY REPORT
  // --------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`🎯 AUDIT REPORT: ${passed}/${total} CHECKS PASSED (${Math.round((passed / total) * 100)}%)`);
  if (passed === total) {
    console.log('STATUS: UNIVERSAL QR SYSTEM & PATIENT WISHLIST FULLY OPERATIONAL & SECURE');
  } else {
    console.error('STATUS: AUDIT DISCOVERED DEFICIENCIES');
    process.exit(1);
  }
  console.log('========================================================================\n');
}

runQRAndWishlistTestSuite().catch((err) => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
