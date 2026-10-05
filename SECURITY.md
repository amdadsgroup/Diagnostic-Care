# Diagnostic Care — Healthcare Security & Privacy Specification

**Brand:** Diagnostic Care | Your Healthcare Marketplace  
**Helpline:** 01886748564  
**Compliance Standards:** Bangladesh ICT & Cyber Security Laws, Data Privacy Principles, Healthcare Least-Privilege  

---

## 1. Healthcare Threat Model & Data Classification

Medical records, diagnostic lab reports, and prescriptions constitute **Tier 1 Critical Sensitive Data**. Unauthorized disclosure or tampering can cause clinical harm and legal liability.

| Data Classification Tier | Examples | Storage Standard | Access Control |
|---|---|---|---|
| **Tier 1 (Medical & Clinical)** | Diagnostic PDF reports, clinical diagnoses, prescriptions, patient vitals | Encrypted at rest (AES-256), private bucket | Time-limited signed token, audit-logged on access |
| **Tier 2 (Identity & PII)** | National ID / Phone, patient names, DOB, addresses, emergency contacts | Encrypted in transit (TLS 1.3), hashed passwords (Argon2id/bcrypt) | Authenticated user / authorized healthcare provider |
| **Tier 3 (Financial & Ledger)** | Payment references, payout bank accounts, commission ledger | Encrypted database columns, immutable audit trail | Authorized finance staff & tenant admin only |
| **Tier 4 (Public Marketplace)** | Verified doctor profiles, test catalog menus, branch locations, FAQs | Cached edge CDN, public read | Public search & discovery |

---

## 2. Multi-Tenant Isolation & Zero Trust Authorization

1. **Server-Side Tenant Scoping:** Every query executed in a provider context includes `WHERE organization_id = :sessionOrgId`.
2. **IDOR Mitigation:** Direct object references (such as `/api/v1/reports/:reportId`) never trust the caller blindly. The backend checks:
   - Does `report.patient_user_id == session.userId`? OR
   - Does `report.organization_id == session.organization_id` (and user is authorized lab staff / admin)?
   - If unauthorized, immediately respond with `403 Forbidden` and append to `audit_logs`.

---

## 3. Secure Private Report Delivery

1. **Private Buckets:** Object storage buckets containing pathology reports have public access completely disabled (`block_public_access = true`).
2. **Ephemeral Presigned URLs:** When a patient or doctor requests a report, the server generates a cryptographically signed URL valid for exactly 15 minutes.
3. **Audit Trail on Every Download:**
   ```typescript
   await db.auditLogs.create({
     data: {
       userId: session.userId,
       action: 'REPORT_ACCESSED',
       resourceType: 'DIAGNOSTIC_REPORT',
       resourceId: report.id,
       ipAddress: request.ip,
       userAgent: request.headers['user-agent']
     }
   });
   ```

---

## 4. Authentication, Session & Token Security

- **Password Hashing:** Passwords hashed with `Argon2id` (or `bcrypt` salt rounds 12).
- **Session Cookies:** Stored in `__Host-` prefixed `HttpOnly`, `Secure`, `SameSite=Strict` cookies to block XSS credential exfiltration.
- **Rate Limiting:**
  - Login & OTP endpoints: Maximum 5 attempts per 10 minutes per IP/Phone.
  - Slot hold endpoints: Maximum 20 hold requests per 10 minutes per IP.
- **Input Sanitization:** All payload inputs strictly validated against Zod schemas at API boundary.
