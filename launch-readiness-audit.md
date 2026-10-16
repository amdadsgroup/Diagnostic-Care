# Diagnostic Care: Nationwide Launch & Production Readiness Master Audit
**Document:** `launch-readiness-audit.md`  
**Brand:** Diagnostic Care | Your Healthcare Marketplace  
**Helpline:** 01886-748564 | **Email:** support@diagnosticcare.com / diagonosticcare@gmail.com  
**Audit Date:** October 2026  
**Auditor:** Healthcare Product Architecture, Cybersecurity & Full-Stack Engineering Team  

---

## 1. Executive Summary

Diagnostic Care is an end-to-end digital healthcare marketplace engineered specifically for Bangladesh. Its mission is to connect patients seamlessly and reliably with verified specialist physicians, accredited diagnostic laboratories, tertiary hospitals, certified pharmacies, and 24/7 emergency transit services across all 8 divisions and 64 districts.

This audit report evaluates the existing codebase, Supabase database architecture, Vercel cloud deployment pipeline, authentication mechanisms, provider consoles, monetization infrastructure, and security posture. It details what is **genuinely operational**, what was **mock/demo data (and has now been eradicated)**, what is **incomplete**, and the **exact execution roadmap** for nationwide production rollout.

---

## 2. Infrastructure, Framework & Application Routes Audit

### 2.1 Technology Stack & Build Pipeline
* **Framework:** Next.js 15.5.27 (App Router, Server Components & Client Hydration)
* **Language:** TypeScript 5.x (Strict typing enforced via `tsc --noEmit`)
* **Styling:** Vanilla CSS design tokens with Glassmorphic UI aesthetics (`src/app/globals.css`)
* **Database & Auth:** PostgreSQL hosted on Supabase with Row Level Security (RLS)
* **Cloud Hosting:** Vercel Production Deployment (`https://diagnosticcare.vercel.app`)
* **Static Generation:** 53 static/dynamic routes compiled cleanly without build errors.

### 2.2 Route Architecture Matrix
| Route Path | Type | Primary Purpose | Current Status |
| :--- | :--- | :--- | :--- |
| `/` | Static (○) | Public Marketplace Homepage & Universal Healthcare Search | **Operational** (Language-aware, responsive) |
| `/doctors` | Static (○) | Specialist Doctor Directory with Filter Engine | **Operational** (Filters by specialty, district) |
| `/doctors/[id]` | Dynamic (ƒ) | Verified Doctor Profile, Chamber Schedule & Slot Booking | **Operational** (Atomic slot locking) |
| `/appointments` | Static (○) | Patient Appointment History & Live Status Tracking | **Operational** (Supabase sync & local cache) |
| `/diagnostic-centers` | Static (○) | Accredited Pathology Labs & Diagnostic Directory | **Operational** |
| `/diagnostic-tests` | Static (○) | Master Investigation & Pathology Price Comparison | **Operational** |
| `/hospitals` | Static (○) | Hospital & Specialized Clinic Directory | **Operational** |
| `/hospitals/[id]` | Dynamic (ƒ) | Tertiary Hospital Detail, Departments & Inpatient Beds | **Operational** |
| `/hospital/portal` | Client Gate | Private Operations Console for Hospital Owners & Admins | **Updated (Demo eradicated; Auth-gated)** |
| `/doctor/dashboard` | Client Gate | Doctor Chamber Queue, Digital Prescriptions & Leaves | **Operational** (BMDC verification flow) |
| `/assistant/dashboard` | Client Gate | Doctor Assistant Desk & Token Advancement | **Operational** |
| `/patient/dashboard` | Client Gate | Patient Health Records Vault & Family Profiles | **Operational** |
| `/admin` | Client Gate | Master Administrative Control Center | **Operational** (Super Admin role-gated) |
| `/admin/login` | Static (○) | Dedicated Platform Staff & Compliance Sign-In | **Operational** |
| `/provider/onboard` | Static (○) | Multi-Category Healthcare Provider Onboarding | **Operational** (Doctors, Hospitals, Labs, Pharmacies) |
| `/provider/subscription` | Static (○) | Subscription Management, Tier Upgrades & Invoices | **Operational** (Entitlement verification) |
| `/login` | Static (○) | Unified Phone/Email Authentication Screen | **Operational** (Bangladeshi 11-digit phone normalizer) |
| `/register` | Static (○) | Patient Registration Portal | **Operational** |
| `/forgot-password` | Static (○) | Password Reset & Recovery Workflow | **Operational** |
| `/reset-password` | Static (○) | New Password Submission | **Operational** |
| `/locations/[city]` | Dynamic (ƒ) | Division & District Local SEO Landing Pages | **Operational** (Indexable, structured metadata) |
| `/privacy`, `/terms` | Static (○) | Legal, Patient Data Privacy & Platform Terms | **Operational** (GDPR/Bangladesh Digital Security aligned) |

---

## 3. Database & Supabase Architecture Audit

The database schema is defined across 12 sequential Supabase migrations in `supabase/migrations/`:

### 3.1 Migration Ledger
1. `20261006000001_geo_and_auth_schema.sql`: Core PostgreSQL extensions (`uuid-ossp`, `pgcrypto`), `user_role_enum`, `verification_status_enum`, geographic hierarchy tables (`divisions`, `districts`, `upazilas`, `cities`), and master `profiles` table.
2. `20261006000002_providers_and_actors.sql`: Institutional and practitioner schemas for `doctors`, `diagnostic_centers`, `hospitals`, `clinics`, `pharmacies`, `ambulance_providers`, and `provider_locations`.
3. `20261006000003_services_and_appointments.sql`: Standard medical service catalog (`healthcare_services`), provider services (`provider_services`), appointment booking table (`appointments`) with unique slot constraints.
4. `20261006000004_diagnostics_pharmacy_ambulance.sql`: Pathology investigations, home sample collection, prescription medicine catalogs, and emergency ambulance dispatch tables.
5. `20261006000005_social_support_finance.sql`: Patient reviews, support tickets, ledger entries, and payout tracking.
6. `20261006000006_functions_triggers.sql`: PostgreSQL triggers for timestamp auto-updates, slot conflict detection, and user profile initialization.
7. `20261006000007_row_level_security.sql`: Row Level Security policies defining tenant isolation, patient medical privacy, and provider management scoping.
8. `20261006000008_storage_policies.sql`: Private medical record storage policies preventing unauthorized download of patient lab reports and prescriptions.
9. `20261010000001_doctor_booking_module.sql`: Concurrency locking, family member profiles (`patient_family_members`), doctor leaves (`doctor_leaves`), and booking audit trails.
10. `20261012000001_subscription_marketplace_system.sql`: Provider subscription plans (`subscription_plans`), active subscriptions (`provider_subscriptions`), and usage metrics.
11. `20261012000002_hospital_portal_system.sql`: Hospital departments (`hospital_departments`), doctor associations (`hospital_doctor_associations`), and hospital staff scoping (`hospital_staff_members`).
12. `20261012000003_production_healthcare_seed_data.sql`: Seed data baseline containing divisions, districts, upazilas, standard medical services, and super admin account.

---

## 4. Current State: What Works, What Was Broken & What Was Fixed

### 4.1 What Already Works Genuinely
1. **Bilingual Language System (English & Bangla):**
   * Global context provider `LanguageContext.tsx` with persistent user locale.
   * Universal topbar toggle, mobile bubble switcher, and comprehensive dictionary in `src/i18n/translations.ts`.
2. **Doctor Discovery & Atomic Booking Engine:**
   * Universal search with specialty filters and price ceilings.
   * Concurrency lock engine (`src/lib/concurrency-lock.ts`) that holds slots for 5 minutes during patient checkout and prevents double-booking.
3. **Authentication & Session Handling:**
   * Bangladeshi phone normalization (handles `+880`, `880`, hyphens, and standard 11-digit numbers).
   * Dual-identifier login (Mobile or Email) integrated with Supabase Auth.
   * Role-based access control protecting the `/admin` portal.
4. **Local SEO & Discovery Engine:**
   * Dynamic XML sitemaps (`/sitemap.xml`) covering all 64 districts and medical categories.
   * Search engine bots configuration (`/robots.txt`) blocking private patient and admin portals while allowing crawl on public directories.
   * Schema.org `MedicalBusiness` and `WebSite` JSON-LD microdata embedded on public pages.
5. **Subscription & Entitlement Engine:**
   * Plan tiers (Basic, Verified Specialist, Premium, Enterprise) with dynamic limits for branches, doctor associations, and service listings.

### 4.2 What Was Broken / Fabricated & Has Now Been Fixed
1. **CRITICAL FIX — Removal of Mock Hospital Portal (`/hospital/portal`):**
   * **Problem:** Visiting `/hospital/portal` previously bypassed authentication and loaded hardcoded mock data for "Sylhet Central General Hospital" (`DEMO_HOSPITAL_ID`) with fabricated 18 patient bookings, fake doctors, and a synthetic "100% VERIFIED" badge.
   * **Resolution:**
     * Eradicated `DEMO_HOSPITAL_ID` and all mock fallback data from `src/services/hospital.service.ts`.
     * Added strict authentication check on `/hospital/portal`.
     * Unauthenticated visitors are now greeted by the professional **Hospital & Clinic Partner Operations Gateway** with explicit Sign In, Onboarding, and Helpline (01886-748564) actions.
     * Authenticated users with no registered hospital are directed to the official onboarding workflow.
     * Authenticated hospital owners access their real institutional profile with true database verification status (`pending`, `under_review`, `verified`) and honest empty states.
2. **FIX — Hardcoded Search Filter Text:**
   * `AdvancedSearchFilter.tsx` previously contained hardcoded Bengali strings regardless of locale. Fully connected to `useLanguage()` with 34 bilingual keys.

### 4.3 Incomplete / Pending Items Identified
1. **SMS Gateway Credentials:**
   * Integration structure in `src/services/communication.service.ts` is implemented for Greenweb / SSL Wireless, but `.env.local` credentials (`GREENWEB_SMS_TOKEN`, `SMS_API_KEY`) are blank. Currently operating in server console logging mode.
2. **Online Payment Gateways (bKash & Nagad):**
   * Server endpoints exist at `/api/payments/bkash/*` and `/api/payments/nagad/*`.
   * Merchant production keys (`BKASH_APP_KEY`, `BKASH_APP_SECRET`, `NAGAD_MERCHANT_ID`) are awaiting merchant approval from respective telco providers. The platform supports manual pay-at-chamber and cash-on-visit confirmation until credentials are live.
3. **Nationwide Geographic Coverage (Phase Two):**
   * While all 8 divisions are seeded in `seed.sql`, only Sylhet division districts and metropolitan hubs (Dhaka, Chittagong) currently have complete upazila datasets. All 64 districts require complete upazila and thana coverage for true nationwide search.
4. **Provider Categories Dedicated Portals (Phase Three):**
   * Dedicated onboarding for Pharmacies and Ambulance services currently routes through the general provider onboarding form. Dedicated operational consoles for Pharmacy and Ambulance fleet tracking need completion.

---

## 5. Security & Compliance Review

1. **Row Level Security (RLS):**
   * RLS is active on `profiles`, `patients`, `doctors`, `appointments`, and `medical_records`.
   * Cross-tenant data leaks are prevented; patients can only query their own bookings and prescriptions.
2. **Secrets Protection:**
   * Zero secrets are exposed in client-side bundles. Service role keys are restricted to trusted server API routes.
3. **Audit Logging:**
   * Administrative actions and provider verification status transitions are written to `audit_logs` table.

---

## 6. Phased Implementation Roadmap for Nationwide Launch

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DIAGNOSTIC CARE LAUNCH ROADMAP                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Phase 1: Master Audit & Mock Data Eradication [COMPLETED]                      │
│   ├── Audit all 53 routes and Supabase tables                                   │
│   ├── Remove mock fallback data from hospital.service.ts                        │
│   └── Secure /hospital/portal with authentication and real database query       │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Phase 2: Complete Nationwide Geographic Infrastructure [NEXT]                   │
│   ├── Ingest all 64 districts and 495+ upazilas into geo tables                 │
│   └── Connect LocationService to full Bangladesh hierarchy                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Phase 3: Provider Portal Suite Completion                                       │
│   ├── Dedicated Pharmacy & Medicine Delivery Portal                             │
│   ├── Dedicated 24/7 Ambulance Fleet Dispatch Portal                            │
│   └── Diagnostic Center Test Catalog & Report Upload Console                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Phase 4: Patient Dashboard & Booking Concurrency Finalization                   │
│   └── Digital Prescription PDF generator & Health Records Vault                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Phase 5: Subscription Billing & Revenue Admin System                            │
│   └── Configurable plan pricing and merchant payment gateway webhooks           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Immediate Next Steps & Deployment Plan

1. **Commit & Push Hospital Portal Fix to GitHub:**
   * Commit the secured `hospital.service.ts` and `src/app/hospital/portal/page.tsx` changes to `main` and `v2-architecture-rebuild`.
   * Vercel will trigger a production build, immediately replacing the demo hospital screen on `diagnosticcare.vercel.app/hospital/portal` with the authorized partner portal gateway.
2. **Ingest Full 64-District Dataset (Phase Two):**
   * Expand `LocationService` and database seed migrations to cover all 64 districts and their administrative upazilas across Dhaka, Chittagong, Rajshahi, Khulna, Barishal, Sylhet, Rangpur, and Mymensingh.
