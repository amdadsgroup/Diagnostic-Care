# Implementation Plan: Production-Ready Universal QR Code Management, QR Scanner, Doctor Discovery, Smart Booking & Patient Wishlist System

## 1. Architectural Overview & Context
- Platform: Diagnostic Care (Bangladesh National Healthcare Marketplace)
- Existing Stack: Next.js 15, React 19, Supabase (PostgreSQL + RLS + Auth), TypeScript, Vanilla CSS + Glassmorphism Design System.
- Core Pillars to Implement:
  1. Universal QR Code Engine: Deterministic, HTTPS-secured profile URLs for doctors, hospitals, diagnostic centers, and clinics with stable public IDs/slugs.
  2. Doctor QR Management: Dedicated QR section in Doctor Portal (`/doctor/dashboard`) with PNG/SVG vector downloads, Web Share API, browser print presets (Prescription, Visiting Card, Chamber Poster, A4 Sheet, Custom), and scan telemetry.
  3. Healthcare Provider QR Management: Dedicated QR section in Hospital/Clinic Portal (`/hospital/portal`) managing both the Organization QR Code and affiliated doctors' QR codes with search/filter, individual & batch print sheets, strictly scoped by organization authorization.
  4. Universal QR Code Studio: Standalone print and export component with Diagnostic Care brand accents, error correction, high-contrast borders, quiet zones, and `@media print` CSS.
  5. Patient QR Scanner: Accessible from top Header (`Scan QR`), mobile dock, and `/scan` route with camera stream, camera flip, file upload fallback, manual code input, and strict whitelist URL validation preventing malicious redirects.
  6. Smart Booking from QR: Seamless profile hydration, attribution preservation, and invocation of the atomic booking transaction (`fn_book_appointment` / `SlotBookingModal`).
  7. Patient Doctor Wishlist: Supabase table `doctor_wishlist` with RLS, patient dashboard `'saved'` tab, one-click save/remove toggles on doctor profiles & cards with auth redirect preservation.
  8. Privacy-Conscious QR Analytics: First-party scan logging, aggregated scans over time, zero PII collection.
  9. English & Bangla Localization: Full translation keys in `src/i18n/translations.ts`.

## 2. Proposed Schema Additions (Migration: `20261018000003_qr_system_and_wishlist.sql`)
1. `doctor_wishlist`:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `patient_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE`
   - `doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE`
   - `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
   - `CONSTRAINT uq_patient_doctor_wishlist UNIQUE (patient_profile_id, doctor_id)`
   - RLS: Patients can SELECT, INSERT, DELETE their own wishlist rows.
2. `qr_code_records`:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `owner_type VARCHAR(50) NOT NULL` ('doctor', 'hospital', 'diagnostic_center', 'clinic')
   - `owner_id UUID NOT NULL`
   - `public_url TEXT NOT NULL`
   - `public_slug VARCHAR(255) NOT NULL UNIQUE`
   - `title VARCHAR(255) NOT NULL`
   - `subtitle VARCHAR(255)`
   - `total_scans INT NOT NULL DEFAULT 0`
   - `is_active BOOLEAN NOT NULL DEFAULT TRUE`
   - `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
   - `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
   - RLS: Public SELECT for active QR records; Owners/Admins have ALL operations.
3. `qr_scan_events`:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `qr_code_id UUID REFERENCES qr_code_records(id) ON DELETE CASCADE`
   - `entity_type VARCHAR(50) NOT NULL`
   - `entity_id UUID NOT NULL`
   - `source_channel VARCHAR(50) DEFAULT 'camera_scan'`
   - `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
   - RLS: Anonymous/Public INSERT allowed; Owners can SELECT analytics for their own QR codes.
4. RPC Functions:
   - `fn_increment_qr_scan(p_qr_id UUID, p_entity_type VARCHAR, p_entity_id UUID)`: Atomically increments scan count and logs scan event safely.

## 3. Implementation Steps
1. **Migration & Types**:
   - Write and apply `supabase/migrations/20261018000003_qr_system_and_wishlist.sql`.
   - Update `src/types/index.ts` with QR and Wishlist models.
2. **Backend Services**:
   - Create `src/services/qr.service.ts`: QR generation (SVG & PNG via `qrcode`), scan logging, analytics calculation, and URL sanitization.
   - Create `src/services/wishlist.service.ts`: Wishlist add, remove, list, check status, with optimistic offline fallbacks.
3. **Core Components**:
   - `src/components/qr/QRCodeStudio.tsx`: Professional QR preview, download (PNG/SVG), print presets (Prescription, Visiting Card, Chamber Door, A4 Batch Sheet), share.
   - `src/components/qr/QRScannerModal.tsx`: HTML5 camera scanner, camera flip, file upload, manual URL input, strict domain security guard.
   - `src/app/scan/page.tsx`: Dedicated scan page for PWA / direct link access.
4. **Integration**:
   - `src/app/doctor/dashboard/page.tsx`: Add `'qr_code'` tab with personal QR management, print presets, and scan analytics.
   - `src/app/hospital/portal/page.tsx`: Add `'qr_code'` tab with organization QR and affiliated doctor QR search, filter, and batch export.
   - `src/app/doctors/[id]/page.tsx`: Add Wishlist toggle (Heart), QR Share button, and QR scan attribution logging.
   - `src/components/patient/CustomerDashboardView.tsx`: Implement full `'saved'` tab with saved doctors, real availability, and direct booking.
   - `src/components/Header.tsx` & `src/components/navigation/GlobalMobileNavigation.tsx`: Add "Scan QR" triggers.
5. **Internationalization & Testing**:
   - Add all English and Bangla translation keys to `src/i18n/translations.ts`.
   - Test build locally, run type checks, execute validation tests, and deploy to Vercel production.
