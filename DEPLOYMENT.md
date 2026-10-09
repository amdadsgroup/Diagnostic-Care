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
