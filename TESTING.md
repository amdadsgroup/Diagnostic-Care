# Diagnostic Care — Quality Assurance & Testing Specification

**Brand:** Diagnostic Care | Your Healthcare Marketplace  
**Helpline:** 01886748564 | **Email:** diagonosticcare@gmail.com  
**Primary B2B Customer:** Diagnostic Centers  
**Quality Philosophy:** In Healthcare Systems, Bugs Aren't Just Inconveniences—They Impact Patient Care  

---

## 1. Critical Acceptance Test Suites

### 1.1 Concurrency & Anti-Double-Booking Test (The Golden Invariant)
- **Objective:** Prove that two concurrent HTTP requests attempting to reserve the exact same doctor chamber slot results in **exactly one** confirmed reservation and **zero** double bookings.
- **Execution Script:**
  - Launch 10 simultaneous asynchronous threads targeting `POST /api/v1/appointments/hold` for Slot ID `SLOT-001`.
  - **Expected Outcome:** Exactly 1 thread receives HTTP `200 OK` with hold token; 9 threads receive HTTP `409 Conflict` with message *"This slot is currently being booked by another patient."*
  - **Database Verification:** `SELECT COUNT(*) FROM schedule_slots WHERE id = 'SLOT-001' AND status = 'HELD'` equals `1`.

### 1.2 Multi-Tenant Isolation & Cross-Organization Leak Test
- **Objective:** Ensure Diagnostic Center A cannot read or modify Diagnostic Center B's data under any circumstance.
- **Test Scenarios:**
  - User with role `DIAGNOSTIC_ADMIN` of Org A attempts to fetch `/api/v1/providers/org-b-uuid/reports`.
  - **Expected Outcome:** HTTP `403 Forbidden` with security event recorded in `audit_logs`.
  - Attempt SQL injection or IDOR parameter tampering (`?organization_id=org-b-uuid`).
  - **Expected Outcome:** Server overrides query parameter with authenticated session tenant ID.

### 1.3 Doctor Assistant Sandboxing Test
- **Objective:** Verify assistant for Dr. Rahman cannot see Dr. Fatema's patients or diagnostic center revenue.
- **Test Scenarios:**
  - Assistant calls `/api/v1/chambers/dr-fatema/queue` -> HTTP `403 Forbidden`.
  - Assistant calls `/api/v1/organization/billing/turnover` -> HTTP `403 Forbidden`.
  - Assistant calls `/api/v1/chambers/dr-rahman/queue` -> HTTP `200 OK`, returning patient name, mobile, age, and token. Response payload must NOT include clinical diagnostic notes or billing ledgers.

### 1.4 Double-Entry Financial Ledger Audit Test
- **Objective:** Ensure sum of all ledger debits equals sum of all ledger credits for every booking transaction:
  $$\sum \text{Debit Amounts} - \sum \text{Credit Amounts} = 0.00$$

### 1.5 Diagnostic Report Private Access Test
- **Objective:** Unauthenticated users or non-authorized patients cannot view report PDF files.
- **Test Scenarios:**
  - Direct GET request to storage file path without signed token -> HTTP `403 Access Denied`.
  - Valid signed URL expired after 15 minutes -> HTTP `403 Expired Token`.
