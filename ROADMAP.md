# Diagnostic Care — 10-Phase Execution Roadmap

**Brand:** Diagnostic Care | Your Healthcare Marketplace  
**Helpline:** 01886748564  
**Target Market:** Bangladesh (Moulvibazar Launch -> Sylhet Division -> Nationwide)  

---

## Roadmap Overview

```mermaid
gantt
    title Diagnostic Care Implementation Phases
    dateFormat  YYYY-MM-DD
    section Phase 1 to 4 (Core Marketplace & B2B Hub)
    Phase 1: Architecture, DB, RBAC, Design System         :done,    p1, 2026-10-01, 2026-10-15
    Phase 2: Org Onboarding, Doctor & Assistant Accounts   :active,  p2, 2026-10-16, 2026-10-31
    Phase 3: Real-Time Slots, 5-Min Hold, Live Queue       :         p3, 2026-11-01, 2026-11-15
    Phase 4: Diagnostic Tests, Reports & Prescriptions     :         p4, 2026-11-16, 2026-11-30
    section Phase 5 to 7 (Monetization & Hardening)
    Phase 5: Payments (bKash/Nagad), Ledger & Subscriptions:         p5, 2026-12-01, 2026-12-15
    Phase 6: Multi-Criteria Search, Reviews & Analytics    :         p6, 2026-12-16, 2026-12-31
    Phase 7: PWA, Performance Optimization & Backup Drills :         p7, 2027-01-01, 2027-01-15
    section Phase 8 to 10 (Geographic Rollout)
    Phase 8: Moulvibazar Initial Market Launch             :         p8, 2027-01-16, 2027-02-28
    Phase 9: Sylhet Division Expansion                     :         p9, 2027-03-01, 2027-04-30
    Phase 10: Nationwide Bangladesh Scaling                :         p10, 2027-05-01, 2027-12-31
```

---

## Detailed Phase Breakdown

### Phase 1: Core Foundation & Design System (Current Milestone)
- **Scope:** Normalized PostgreSQL DDL, multi-tenant organization schema, authentication, RBAC matrix, Bangladesh location data (Divisions/Districts/Upazilas), design tokens, brand constants.
- **Exit Criteria:** Database initialized, migrations clean, session management running, responsive brand design tokens active.

### Phase 2: Diagnostic Center B2B Onboarding & Doctor Management
- **Scope:** Diagnostic Center registration, branch management, doctor profile creation, BMDC verification workflow, doctor chamber associations, sandboxed doctor assistant accounts.
- **Exit Criteria:** Center admin can invite Dr. Rahman to Moulvibazar Branch and assign assistant Rahim with strictly isolated queue permissions.

### Phase 3: Real-Time Slot Engine, Concurrency & Live Queue
- **Scope:** Dynamic slot generator, 5-minute atomic slot hold, PostgreSQL pessimistic locking (`SELECT FOR UPDATE`), daily capacity enforcement (`FULL` state), live queue tokens.
- **Exit Criteria:** Concurrency test passes: 2 simultaneous clicks for same slot yield exactly 1 confirmed booking and 1 conflict error.

### Phase 4: Diagnostic Test Menu, Secure Reports & Digital Prescriptions
- **Scope:** Diagnostic test catalog (CBC, USG, X-Ray), preparation instructions, test booking, verified PDF report upload, presigned secure URL delivery, doctor digital prescription engine.
- **Exit Criteria:** Patient securely downloads report PDF; unauthorized access strictly blocked.

### Phase 5: Bangladesh Payment Engine, Double-Entry Ledger & B2B Subscriptions
- **Scope:** bKash and Nagad checkout integration, SSLCommerz card gateway, cash-at-desk toggle, immutable financial ledger, dynamic SaaS subscriptions (BDT 200/500/Enterprise).
- **Exit Criteria:** Successful booking generates balanced debit/credit ledger records; commission accurately split.

### Phase 6: Healthcare Search Engine, Verified Reviews & Provider Analytics
- **Scope:** Bangla/English search engine, location filters (Upazila proximity), verified-only patient reviews, diagnostic center analytics (turnover, peak hours, popular tests).
- **Exit Criteria:** Patients in Moulvibazar find doctors in under 2 clicks.

### Phase 7: Mobile PWA, Edge Performance & Operational Security
- **Scope:** Service worker offline caching for appointment slips, Web App Manifest, Lighthouse performance > 90, automated daily backup scripts.
- **Exit Criteria:** Mobile PWA installable on Android/iOS; sub-1.5s page load on 3G mobile networks.

### Phase 8: Operational Launch — Moulvibazar Hub
- **Scope:** Initial physical rollout in Moulvibazar, Bangladesh. Onboard top diagnostic centers and specialist doctor chambers. Activate customer care helpline `01886748564`.
- **Exit Criteria:** 25+ verified diagnostic centers & doctors active; 500+ successful completed appointments.

### Phase 9: Regional Expansion — Sylhet Division
- **Scope:** Replicate operational playbook across Moulvibazar, Sylhet, Habiganj, and Sunamganj districts.

### Phase 10: Nationwide Bangladesh Scaling
- **Scope:** Expand into Dhaka, Chittagong, Rajshahi, Khulna, Barisal, Rangpur, and Mymensingh. Activate future modular extensions (Ambulance, Pharmacy, Home Care, Telemedicine).
