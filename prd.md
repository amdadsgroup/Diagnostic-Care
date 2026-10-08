# Diagnostic Care — Product Requirements Document (PRD)

**Brand Name:** Diagnostic Care  
**Tagline:** Your Healthcare Marketplace  
**Customer Care:** 01886748564  
**Primary Market:** Bangladesh
**Document Version:** 1.0.0  
**Status:** Approved Architecture Specification  

---

## 1. Executive Summary & Vision

**Diagnostic Care** is a production-ready, scalable, secure, and Bangladesh-focused digital healthcare marketplace and healthcare provider management infrastructure.

Unlike simple doctor appointment apps or diagnostic center portals, Diagnostic Care bridges the fragmented healthcare ecosystem of Bangladesh by unifying:
1. **Patients and their Families**
2. **Doctors and Specialist Consultants**
3. **Doctor Assistants and Chamber Managers**
4. **Diagnostic Centers & Pathology Laboratories** (The Primary B2B Customer)
5. **Clinics & Day-Care Surgery Centers**
6. **Hospitals & Medical Colleges**
7. **Pharmacies & Medicine Dispensaries**
8. **Ambulance Operators & Emergency Transport**
9. **Home Healthcare Providers (Nursing, Caregivers, Physiotherapy, Home Phlebotomy)**
10. **Healthcare Operational Staff**
11. **Platform Administrators & Operations Personnel**

### 1.1 The Primary Business Focus
In Bangladesh's tier-2 and tier-3 cities (starting with **Moulvibazar**), the **Diagnostic Center** serves as the central physical hub of private outpatient care:
- Specialist doctors hold daily evening chambers within diagnostic center premises.
- Patients consult doctors, get prescriptions, and immediately undergo pathology/radiology tests under the same roof.
- Diagnostic centers lack modern digitized operations: patient queues are chaotic, slot overbooking is rampant, reports are paper-only or lost, and financial tracking is vulnerable to leakage.

Diagnostic Care empowers Diagnostic Centers to digitize their entire organization—branches, test menus, pricing, doctor chamber schedules, queue tokens, digital report delivery, and billing—while opening up their inventory to thousands of patients discovering services online.

---

## 2. Brand Identity & Brand Constants

All platforms, user interfaces, notifications, invoices, reports, and communications must strictly adhere to the unified brand identity:

- **Brand Name:** `Diagnostic Care`
- **Tagline:** `Your Healthcare Marketplace`
- **Customer Care Helpline:** `01886748564`
- **Headquarters / Initial Launch Hub:** Moulvibazar, Sylhet, Bangladesh
- **Default Languages:** Bangla (বাংলা) and English (EN)
- **Primary Currency:** Bangladeshi Taka (BDT / ৳)

The brand communicates: **Trust, Healthcare, Accessibility, Technology, Professionalism, Reliability, and Simplicity**.

Temporary placeholder branding (such as "Healthcare App", "Demo Doctor", "Test Platform") is strictly prohibited across all patient and provider touchpoints.

---

## 3. Core Business Model & Monetization Architecture

Diagnostic Care operates on a hybrid B2B SaaS + Marketplace Commission model. Pricing is **never hardcoded** and is fully configurable by platform administrators:

### 3.1 B2B Diagnostic Center & Provider SaaS Subscriptions
Diagnostic Centers and healthcare clinics subscribe to tiered plans:
- **Free Trial / Starter Tier:** Low friction entry for small rural chambers.
- **Basic Plan (e.g., BDT 200/month):** Single branch, up to 3 doctor chambers, basic digital test billing.
- **Professional Plan (e.g., BDT 500/month):** Multi-doctor scheduling, assistant accounts, SMS notifications, digital report uploads.
- **Enterprise Plan (e.g., BDT 1,000–5,000/month):** Multi-branch management, advanced analytics, priority placement, custom integrations.

*Key Invariant:* Providers must **never** lose access to historical patient records, past reports, or financial audits if a subscription expires; accounts enter a restricted/grace status.

### 3.2 Marketplace Commissions
- **Doctor Consultation Booking:** Configurable platform commission (e.g., 5% per confirmed booking).
- **Diagnostic Test Booking:** Configurable platform commission (e.g., 3–8% per test).
- **Home Sample Collection:** Fixed convenience fee split or percentage commission.
- **Telemedicine Consultations:** Configurable digital platform service fee.

### 3.3 Value-Added Services
- **Featured / Sponsored Provider Placement:** Transparently labeled sponsored search rankings targeted by District/Upazila.
- **SMS & WhatsApp Reminder Bundles:** For diagnostic report readiness and token callouts.

---

## 4. User Personas & Ecosystem Actors

| Persona / Role | Description & Primary Workflows |
|---|---|
| **Patient & Family** | Discovers doctors/tests; views real-time slots; books appointments; tracks queue token; accesses digital prescriptions and diagnostic reports; adds family members (Father, Mother, Child). |
| **Diagnostic Center Admin** | Manages diagnostic center profile, multiple branches, test catalog, doctor chambers, doctor assistants, staff permissions, report uploads, payments, and subscriptions. |
| **Doctor** | Manages clinical specialty, qualifications, BMDC registration number, multi-organization chamber associations, consultation fees, digital prescriptions, patient history, and personal appointments. |
| **Doctor Assistant** | Manages today's queue, checks in arriving patients, calls tokens, views allowed patient details (name, phone, age), and updates appointment statuses without seeing financial data or other doctors' schedules. |
| **Diagnostic Center Staff / Lab Tech** | Processes test bookings, logs sample collections, uploads verified digital PDF reports with medical technologist verification. |
| **Clinic / Hospital Admin** | Manages institutional facilities, clinical departments, visiting consultants, and outpatient services. |
| **Pharmacy Provider** | Manages medicine inventory, receives verified prescription orders, and arranges fulfillment. |
| **Ambulance Operator** | Emergency vehicle listings (AC/Non-AC/ICU/Freezer), emergency contact, dispatch coordination. |
| **Home Healthcare Worker** | Offers home nursing, caregiver support, elderly assistance, physiotherapy, and home blood collection. |
| **Super Admin & Support** | System-wide verification of BMDC licenses and trade licenses, platform commission adjustments, dispute mediation, audit oversight, and customer support via `01886748564`. |

---

## 5. Functional Requirements by Module

### 5.1 Multi-Tenant Organization & Branch Structure
- Every Diagnostic Center, Clinic, or Hospital is an `Organization`.
- An organization has one or more `Branches` (e.g., *ABC Diagnostic Center - Moulvibazar Main Branch*, *ABC Diagnostic Center - Sreemangal Branch*).
- An organization admin invites or associates doctors to specific branches.
- Strict tenant data isolation: Staff or admins from Diagnostic Center A cannot access, query, or view data from Diagnostic Center B.

### 5.2 Doctor Associated Accounts & Isolated Assistants
- Doctors can practice at multiple independent organizations (e.g., Dr. Rahman practices at *ABC Diagnostic Center* on Monday/Wednesday and *Sylhet Central Hospital* on Friday).
- The doctor has an isolated master account; each organization configures an association with specific schedules, consultation fees, and assigned assistant(s).
- **Doctor Assistant Sandbox:** The assistant assigned to Dr. Rahman sees **only** Dr. Rahman's appointments at that specific branch. The assistant can view patient name, phone number, age, and booking token, but **never** financial turnover, organization settings, or other doctors' patients.

### 5.3 Real-Time Doctor Slot Booking Engine & Concurrency Control
- Dynamic slot generator computes slots based on consultation day, start time, end time, slot duration (e.g., 15 mins), and daily maximum capacity (e.g., 20 patients).
- **Atomic 5-Minute Slot Hold:** When a patient clicks a slot, the system locks that slot with a 5-minute time-to-live (`HELD`). If another patient attempts to click the same slot simultaneously, the transaction rejects it with an explicit message: *"This slot is currently being booked by another patient."*
- **Database-Level Protection:** Database constraints and transactional locking (`SELECT FOR UPDATE` or conditional exclusion) prevent race conditions.
- **Full Capacity Handling:** When daily capacity is reached, the status becomes `FULL`, offering the patient the next available date, waiting list, or nearby alternative verified doctors.

### 5.4 Live Queue & Token Management
- Each appointment generates a sequence token (e.g., `Token 01`, `Token 02`).
- Patients track live queue status on their mobile web/PWA: *Currently Serving Token*, *Your Token*, *Estimated Wait Time*.
- Doctor Assistant or Doctor controls the queue with one-click actions: `Call Next`, `Mark Checked In`, `In Progress`, `Completed`, `Skip / No Show`.

### 5.5 Diagnostic Test Catalog & Secure Report Delivery
- Diagnostic centers publish structured tests (CBC, Blood Glucose, Lipid Profile, USG, X-Ray, CT Scan, MRI, ECG).
- Includes: Test preparation guidelines (e.g., "10-12 hours fasting required"), sample type (Blood, Urine, Swab), expected turnaround time, price, and home collection availability.
- **Secure Signed Report Delivery:** Diagnostic reports contain highly sensitive personal health data. Reports must **never** be stored in public buckets. Patients receive an SMS/in-app alert and view reports via short-lived signed URLs or authenticated streams.

### 5.6 Digital Prescriptions
- Doctors create structured digital prescriptions containing:
  - Patient vitals & clinical notes
  - Rx medicines (Brand/generic, strength, dosage: 1+0+1, before/after meal, duration in days)
  - Recommended diagnostic tests
  - Special instructions and follow-up consultation date
- Printable and downloadable as a clean, branded PDF accessible in the patient's personal health vault.

### 5.7 Bangladesh-Optimized Payment Architecture
- Payment methods: **bKash**, **Nagad**, **Rocket**, **Debit/Credit Cards (SSLCommerz/Shurjopay)**, and **Pay Cash at Provider Desk**.
- Full double-entry financial ledger recording debits and credits for all transactions (patient charges, platform commission deduction, provider earnings payable, refund reversals).

### 5.8 Structured Bangladesh Location Hierarchy
- Discovery is organized by: `Division` -> `District` -> `Upazila` -> `Union/Area`.
- Launch hub: **Moulvibazar** (Sadar, Sreemangal, Kamalganj, Kulaura, Barlekha, Juri, Rajnagar).
- Seamless filtering by Upazila and proximity.

### 5.9 Bilingual Localization (Bangla & English)
- Complete UI translation support with i18n translation keys.
- Font stack optimized for Bangla script rendering (Noto Sans Bengali / Hind Siliguri) alongside Inter/Roboto for English.

---

## 6. Non-Functional Requirements

1. **Security & Privacy:** AES-256 encryption at rest for reports, TLS 1.3 in transit, strict RBAC, no IDOR vulnerabilities, OWASP Top 10 compliance.
2. **Performance & Scalability:** Page load < 1.5 seconds on 3G/4G Bangladesh mobile networks; sub-100ms API response times for slot availability.
3. **Availability:** 99.9% uptime target with automated database backups and health checks.
4. **PWA & Offline Readiness:** Installable Progressive Web App with service worker caching for offline access to confirmed appointments and saved prescriptions.
5. **Auditability:** Tamper-evident audit logs capturing login attempts, clinical record views, report uploads, role promotions, and financial disbursements.
