# Diagnostic Care — Deployment, Operations & Disaster Recovery

**Brand:** Diagnostic Care | Your Healthcare Marketplace  
**Helpline:** 01886748564 | **Email:** diagonosticcare@gmail.com  
**Primary B2B Customer:** Diagnostic Centers  
**Target Environments:** Development, Staging, Production  

---

## 1. Cloud Infrastructure Architecture

```
[Internet / Cloudflare CDN]
       │ (TLS 1.3 / DDoS Shield / Caching)
       ▼
[Application Load Balancer]
       │
   ┌───┴───────────────────────┐
   ▼                           ▼
[Next.js App Node 1]      [Next.js App Node 2]
   │                           │
   ├───► [Redis Cluster (Slot Locks & Session Cache)]
   ├───► [PostgreSQL Primary (Multi-Tenant Relational Engine)]
   │        └──► [PostgreSQL Read Replica (Marketplace Search Queries)]
   └───► [Encrypted Object Storage (Private Patient Reports & Prescriptions)]
```

---

## 2. Environment Variables Configuration

Zero secrets in source code. All configuration must be provided via environment variables:

```ini
# Application Core
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://diagnosticcare.com.bd
NEXT_PUBLIC_BRAND_NAME="Diagnostic Care"
NEXT_PUBLIC_TAGLINE="Your Healthcare Marketplace"
NEXT_PUBLIC_CUSTOMER_CARE_PHONE="01886748564"

# Database & Cache
DATABASE_URL="postgresql://dc_user:SecurePass@db.prod.internal:5432/diagnostic_care?schema=public&sslmode=require"
REDIS_URL="rediss://default:RedisPass@redis.prod.internal:6379"

# Security & Authentication
JWT_SECRET="super-secure-high-entropy-jwt-secret-key-32-chars-min"
ENCRYPTION_KEY_HEX="64-hex-character-aes-256-gcm-master-key"
COOKIE_SECRET="secure-cookie-session-signing-secret"

# Object Storage (Private Bucket for Medical Reports)
STORAGE_ENDPOINT="https://s3.ap-southeast-1.amazonaws.com"
STORAGE_BUCKET_NAME="diagnostic-care-private-reports"
STORAGE_ACCESS_KEY="AKIA..."
STORAGE_SECRET_KEY="secret..."

# Bangladesh SMS & Payment Gateways
SMS_GATEWAY_API_KEY="bangladesh-sms-provider-key"
BKASH_APP_KEY="bkash-key"
BKASH_APP_SECRET="bkash-secret"
BKASH_USERNAME="bkash-merchant"
BKASH_PASSWORD="bkash-password"
NAGAD_MERCHANT_ID="nagad-merchant"
```

---

## 3. Database Migration & Rollback Strategy

1. **Forward Migrations:** Applied during CI/CD deployment window (`npx prisma migrate deploy`).
2. **Backward Compatibility:** Database schema alterations must be backward compatible with the currently running application code before rolling restarts.
3. **Automated Backups:**
   - Daily full logical backup via `pg_dump` with gzip compression uploaded to offsite storage.
   - Continuous WAL (Write-Ahead Logging) archiving with point-in-time recovery (PITR) up to 14 days.
   - Weekly automated backup restoration test in staging sandbox.

---

## 4. Vercel & Supabase Deployment Pipeline

### 4.1 Deployment Runbook
1. **Pre-flight Typecheck & Build:**
   ```bash
   node node_modules/typescript/bin/tsc --noEmit
   npm run build
   ```
   *Verified: 47/47 routes compiled cleanly without errors.*
2. **Database Migration Step:**
   Execute incremental migration in Supabase SQL editor or via Supabase CLI:
   `supabase/migrations/20261010000001_doctor_booking_module.sql`
   - Non-destructive `CREATE TABLE IF NOT EXISTS` for:
     - `patient_family_members`
     - `doctor_leaves`
     - `schedule_exceptions`
     - `doctor_assistant_invitations`
     - `booking_audit_events`
   - Non-destructive `ADD COLUMN IF NOT EXISTS` on `appointments`.
   - Idempotent RLS policies and `booking_status` enum extension.
3. **Automated Post-Migration Smoke Test:**
   ```bash
   node scripts/concurrency-race-test.js
   node scripts/master-e2e-audit.js
   ```

### 4.2 Staged Release Checklist (Moulvibazar Pilot)
- [x] Concurrency Anti-Double-Booking verified under 10 simultaneous contenders.
- [x] Doctor detail page loads real profiles with Asia/Dhaka timestamps and verified BMDC numbers.
- [x] Assistant portal sandboxed: no clinical notes, no financial ledger access.
- [x] Patient dashboard allows appointment tracking, cancellation, and family member selection.
- [x] Bilingual toggle (English & Bangla) functional with zero lost form state.
- [x] Local payment mode: Cash at chamber/desk supported for launch; online simulation disabled.
- [x] Emergency hotline `01886748564` displayed across all footers and confirmation banners.
