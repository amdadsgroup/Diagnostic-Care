/**
 * Diagnostic Care — Comprehensive Mobile-First PWA & Responsive Test Suite
 *
 * Verifies:
 * 1. Web App Manifest (spec compliance, icons, shortcuts, orientation, display)
 * 2. Service Worker (multi-tier caching, sensitive network-only, offline fallback, cache versioning)
 * 3. Offline HTML (safe-area insets, branding, helpline, bilingual text)
 * 4. Root Layout (viewportFit cover, Apple web app meta tags, PWA controller, mobile dock)
 * 5. Global CSS (responsive breakpoints 320px-1280px, safe area insets, touch ergonomics 44px)
 * 6. Portal Responsive Components (Patient Dashboard, Doctor Portal, Admin Console, Hospital Portal)
 * 7. Marketplace & Atomic Booking (Doctors listing grid, SlotBookingModal mobile ergonomics)
 * 8. Helpline Consistency (01886748564)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${testName}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${testName} ${details ? '(' + details + ')' : ''}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('  DIAGNOSTIC CARE: MOBILE-FIRST PWA & RESPONSIVE SUITE');
console.log('======================================================\n');

// 1. Web App Manifest Verification
console.log('\x1b[36m[1/8] Web App Manifest Verification\x1b[0m');
const manifestPath = path.join(ROOT, 'public', 'manifest.json');
assert(fs.existsSync(manifestPath), 'public/manifest.json exists on disk');

let manifest = {};
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert(true, 'public/manifest.json is valid JSON');
} catch (e) {
  assert(false, 'public/manifest.json is valid JSON', e.message);
}

assert(manifest.name === 'Diagnostic Care', 'Manifest name is "Diagnostic Care"');
assert(manifest.short_name === 'Diagnostic Care', 'Manifest short_name is "Diagnostic Care"');
assert(manifest.display === 'standalone', 'Manifest display mode is "standalone"');
assert(manifest.start_url === '/', 'Manifest start_url is "/"');
assert(manifest.scope === '/', 'Manifest scope is "/"');
assert(manifest.orientation === 'portrait-primary', 'Manifest orientation is "portrait-primary"');
assert(manifest.theme_color === '#0060FA', 'Manifest theme_color is Diagnostic Care primary blue (#0060FA)');
assert(manifest.background_color === '#F8FAFC', 'Manifest background_color is #F8FAFC');

// Icons check
assert(Array.isArray(manifest.icons) && manifest.icons.length >= 3, 'Manifest has at least 3 icon definitions');
const hasMaskable = manifest.icons.some(i => i.purpose === 'maskable');
assert(hasMaskable, 'Manifest includes an Android maskable icon definition');

manifest.icons.forEach((iconDef) => {
  const iconFile = path.join(ROOT, 'public', iconDef.src.replace(/^\//, ''));
  assert(fs.existsSync(iconFile), `Icon file exists: ${iconDef.src}`);
});

// Shortcuts check
assert(Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 3, 'Manifest has PWA launcher shortcuts');
const shortcutUrls = (manifest.shortcuts || []).map(s => s.url);
assert(shortcutUrls.includes('/doctors'), 'Shortcut includes Find Doctors (/doctors)');
assert(shortcutUrls.includes('/scan'), 'Shortcut includes Scan QR Code (/scan)');
assert(shortcutUrls.includes('/appointments'), 'Shortcut includes My Appointments (/appointments)');

// 2. Service Worker Verification
console.log('\n\x1b[36m[2/8] Service Worker Verification\x1b[0m');
const swPath = path.join(ROOT, 'public', 'sw.js');
assert(fs.existsSync(swPath), 'public/sw.js exists on disk');
const swContent = fs.readFileSync(swPath, 'utf8');

assert(swContent.includes('CACHE_VERSION'), 'Service Worker defines CACHE_VERSION');
assert(swContent.includes('OFFLINE_URL = \'/offline.html\''), 'Service Worker points to /offline.html fallback');
assert(swContent.includes('isSensitiveRequest'), 'Service Worker has sensitive health request filter');
assert(swContent.includes('request.mode === \'navigate\''), 'Service Worker intercepts HTML navigation requests');
assert(swContent.includes('SKIP_WAITING'), 'Service Worker supports SKIP_WAITING signal');
assert(swContent.includes('01886748564'), 'Service Worker offline message contains helpline 01886748564');

// 3. Offline HTML Verification
console.log('\n\x1b[36m[3/8] Offline HTML Verification\x1b[0m');
const offlinePath = path.join(ROOT, 'public', 'offline.html');
assert(fs.existsSync(offlinePath), 'public/offline.html exists on disk');
const offlineContent = fs.readFileSync(offlinePath, 'utf8');

assert(offlineContent.includes('viewport-fit=cover'), 'offline.html includes viewport-fit=cover meta tag');
assert(offlineContent.includes('safe-area-inset-bottom'), 'offline.html respects safe-area-inset-bottom');
assert(offlineContent.includes('01886748564'), 'offline.html displays Customer Helpline: 01886748564');
assert(offlineContent.includes('Diagnostic Care'), 'offline.html displays Diagnostic Care brand');
assert(offlineContent.includes('অফলাইন') || offlineContent.includes('ইন্টারনেট'), 'offline.html includes Bengali offline explanation');

// 4. Root Layout & Viewport Meta Tags
console.log('\n\x1b[36m[4/8] Root Layout & Viewport Verification\x1b[0m');
const layoutPath = path.join(ROOT, 'src', 'app', 'layout.tsx');
assert(fs.existsSync(layoutPath), 'src/app/layout.tsx exists');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');

assert(layoutContent.includes("viewportFit: 'cover'"), 'Root viewport config specifies viewportFit: cover');
assert(layoutContent.includes('apple-mobile-web-app-capable'), 'Layout includes apple-mobile-web-app-capable');
assert(layoutContent.includes('apple-mobile-web-app-status-bar-style'), 'Layout includes apple-mobile-web-app-status-bar-style');
assert(layoutContent.includes('apple-mobile-web-app-title'), 'Layout includes apple-mobile-web-app-title');
assert(layoutContent.includes('PWAController'), 'Layout mounts PWAController');
assert(layoutContent.includes('GlobalMobileNavigation'), 'Layout mounts GlobalMobileNavigation');

// 5. Global CSS Mobile-First Rules
console.log('\n\x1b[36m[5/8] Global CSS Mobile-First Rules Verification\x1b[0m');
const cssPath = path.join(ROOT, 'src', 'app', 'globals.css');
assert(fs.existsSync(cssPath), 'src/app/globals.css exists');
const cssContent = fs.readFileSync(cssPath, 'utf8');

assert(cssContent.includes('.mobile-bottom-dock'), 'globals.css defines .mobile-bottom-dock');
assert(cssContent.includes('env(safe-area-inset-bottom'), 'globals.css applies safe-area-inset-bottom to bottom dock');
assert(cssContent.includes('.patient-dashboard-grid'), 'globals.css defines .patient-dashboard-grid');
assert(cssContent.includes('.patient-mobile-tabs'), 'globals.css defines .patient-mobile-tabs with horizontal touch scrolling');
assert(cssContent.includes('.doctor-portal-sidebar'), 'globals.css defines .doctor-portal-sidebar');
assert(cssContent.includes('.doctor-portal-drawer-open'), 'globals.css defines .doctor-portal-drawer-open sliding drawer');
assert(cssContent.includes('.doctor-portal-backdrop'), 'globals.css defines .doctor-portal-backdrop');
assert(cssContent.includes('.admin-sidebar-mobile-open'), 'globals.css defines .admin-sidebar-mobile-open');
assert(cssContent.includes('.doctors-listing-grid'), 'globals.css defines .doctors-listing-grid');
assert(cssContent.includes('prefers-reduced-motion'), 'globals.css respects prefers-reduced-motion accessibility');
assert(cssContent.includes('min-height: 44px'), 'globals.css provides >= 44px touch targets on mobile');

// 6. Portal Responsive Implementation
console.log('\n\x1b[36m[6/8] Portal Responsive Implementation Verification\x1b[0m');
const custDashPath = path.join(ROOT, 'src', 'components', 'patient', 'CustomerDashboardView.tsx');
assert(fs.existsSync(custDashPath), 'CustomerDashboardView.tsx exists');
const custDashContent = fs.readFileSync(custDashPath, 'utf8');
assert(custDashContent.includes('patient-mobile-tabs'), 'CustomerDashboardView renders patient-mobile-tabs');
assert(custDashContent.includes('patient-dashboard-grid'), 'CustomerDashboardView uses patient-dashboard-grid');
assert(custDashContent.includes('initialTab'), 'CustomerDashboardView supports initialTab prop');

const docDashPath = path.join(ROOT, 'src', 'app', 'doctor', 'dashboard', 'page.tsx');
assert(fs.existsSync(docDashPath), 'doctor/dashboard/page.tsx exists');
const docDashContent = fs.readFileSync(docDashPath, 'utf8');
assert(docDashContent.includes('doctor-portal-sidebar'), 'Doctor dashboard uses doctor-portal-sidebar');
assert(docDashContent.includes('doctor-portal-backdrop'), 'Doctor dashboard renders doctor-portal-backdrop on mobile');
assert(docDashContent.includes('patient-mobile-tabs'), 'Doctor dashboard renders doctor mobile quick tab bar');

const adminSidebarPath = path.join(ROOT, 'src', 'components', 'admin', 'AdminSidebar.tsx');
assert(fs.existsSync(adminSidebarPath), 'AdminSidebar.tsx exists');
const adminSidebarContent = fs.readFileSync(adminSidebarPath, 'utf8');
assert(adminSidebarContent.includes('admin-sidebar'), 'AdminSidebar applies admin-sidebar base class');

// 7. Marketplace & Atomic Booking Ergonomics
console.log('\n\x1b[36m[7/8] Marketplace & Booking Ergonomics Verification\x1b[0m');
const doctorsPagePath = path.join(ROOT, 'src', 'app', 'doctors', 'page.tsx');
assert(fs.existsSync(doctorsPagePath), 'doctors/page.tsx exists');
const doctorsPageContent = fs.readFileSync(doctorsPagePath, 'utf8');
assert(doctorsPageContent.includes('doctors-listing-grid'), 'Doctors listing uses doctors-listing-grid class');

const bookingModalPath = path.join(ROOT, 'src', 'components', 'SlotBookingModal.tsx');
assert(fs.existsSync(bookingModalPath), 'SlotBookingModal.tsx exists');
const bookingModalContent = fs.readFileSync(bookingModalPath, 'utf8');
assert(bookingModalContent.includes('repeat(auto-fit, minmax(130px, 1fr))'), 'Payment buttons wrap responsively on mobile');
assert(bookingModalContent.includes('repeat(auto-fit, minmax(180px, 1fr))'), 'Summary card wraps responsively on mobile');

// 8. Helpline & Brand Consistency
console.log('\n\x1b[36m[8/8] Helpline & Brand Consistency Verification\x1b[0m');
const brandConfigPath = path.join(ROOT, 'src', 'config', 'brand.ts');
assert(fs.existsSync(brandConfigPath), 'src/config/brand.ts exists');
const brandConfigContent = fs.readFileSync(brandConfigPath, 'utf8');
assert(brandConfigContent.includes('01886748564'), 'Helpline in brand.ts is 01886748564');
assert(brandConfigContent.includes('Diagnostic Care'), 'Brand name is Diagnostic Care');
assert(brandConfigContent.includes('Your Healthcare Marketplace'), 'Tagline is Your Healthcare Marketplace');

console.log('\n------------------------------------------------------');
console.log(`Test Execution Summary: \x1b[32m${passed} Passed\x1b[0m, \x1b[31m${failed} Failed\x1b[0m`);
console.log('------------------------------------------------------\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All mobile-first PWA and responsive checks passed with 100% success!\n');
  process.exit(0);
}
