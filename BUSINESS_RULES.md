# Diagnostic Care — Business Rules & Configuration Specification

**Brand:** Diagnostic Care | Your Healthcare Marketplace  
**Helpline:** 01886748564  
**Primary Currency:** Bangladeshi Taka (BDT / ৳)  
**Configuration Principle:** Zero Hardcoded Business Logic; Dynamic Config via Admin Engine  

---

## 1. Provider Subscription Engine & Pricing

Subscription pricing is fully dynamic and managed via `subscription_plans`:

| Plan Tier | Default Monthly Fee | Default Yearly Fee | Branch Limit | Doctor Limit | Staff Accounts | Commission Rate Discount |
|---|---|---|---|---|---|---|
| **Starter / Trial** | ৳0 (14 days) | ৳0 | 1 | 2 | 2 | None |
| **Basic** | ৳200 / month | ৳2,000 / year | 1 | 5 | 5 | Standard Rates |
| **Professional** | ৳500 / month | ৳5,000 / year | 3 | 15 | 20 | 1% Commission Discount |
| **Enterprise** | Configurable (৳1,000+) | Configurable | Unlimited | Unlimited | Unlimited | Custom Partner Rates |

### 1.1 Grace Period & Historical Data Invariant
- If an organization's subscription lapses:
  - **Grace Period:** 7 days to renew without service disruption.
  - **Suspended State:** New slot generation and online test bookings are paused.
  - **Historical Data Guarantee:** Providers and doctors **NEVER** lose access to past patient appointments, medical reports, or billing records. Access to historical data is preserved permanently.

---

## 2. Appointment Booking & Cancellation Rules

### 2.1 Booking Window
- **Advance Booking:** Patients can book up to 14 days in advance (configurable per doctor).
- **Same-Day Cutoff:** Online booking closes 60 minutes before chamber start time to prevent scheduling chaos.
- **Capacity Ceiling:** Once an active booking count equals `max_patient_capacity`, the slot generator switches the schedule status to `FULL`.

### 2.2 Patient Cancellation Policy
- **Free Cancellation Window:** Patients may cancel up to 2 hours prior to the appointment slot time.
- **Refund Processing:**
  - Online payments (bKash/Nagad/Cards) are refunded to the patient's original funding source minus gateway processing fees (or 100% credited as Diagnostic Care wallet balance).
  - Cash-at-desk appointments are simply marked `CANCELLED_BY_PATIENT` with slot released immediately.

### 2.3 Doctor Cancellation & Emergency Leave
- If a doctor marks emergency leave:
  - All affected patients receive an automated priority SMS and in-app alert.
  - Patients are provided one-click priority rescheduling to the doctor's next available chamber, or a 100% immediate full refund.

---

## 3. Temporary Slot Hold Rules

- **Hold Duration:** Fixed 300 seconds (5 minutes) upon user slot selection.
- **Session Abandonment:** If the patient closes the browser or fails to confirm payment within 300 seconds, the slot reverts to `AVAILABLE`.
- **Concurrency Conflict:** If a second user attempts to click a held slot, the response returns `409 Conflict` with the remaining hold duration message.

---

## 4. Provider Verification Workflow

- **Diagnostic Centers:** Require valid Trade License, DGHS (Directorate General of Health Services) registration copy, authorized contact person, and physical address verification.
- **Doctors:** Mandatory verification of BMDC (Bangladesh Medical and Dental Council) registration number and certified post-graduate specialty degrees before the profile gains the green `Verified Doctor` badge.
- **Public Display Rule:** Unverified doctors or centers may test internal features in sandbox mode, but will not appear in public marketplace search rankings.
