# Diagnostic Care — Project Memory & Architecture Log

**Brand:** Diagnostic Care  
**Tagline:** Your Healthcare Marketplace  
**Helpline / Customer Care Phone:** 01886748564  
**Country:** Bangladesh  
**Initial Launch Location:** Moulvibazar, Sylhet Division  
**Default Languages:** Bangla (বাংলা), English (EN)  
**Currency:** Bangladeshi Taka (BDT / ৳)  

---

## 1. Architectural Invariants (Non-Negotiable Rules)

1. **Zero Double-Bookings:** A doctor slot cannot be confirmed for more than one active patient under any race condition. Enforced via database partial unique index and transactional locks (`SELECT FOR UPDATE`).
2. **Server-Side Authorization Everywhere:** Never rely on frontend UI hiding. All tenant boundaries, doctor assistant boundaries, and medical file access are validated server-side.
3. **Multi-Tenant Data Isolation:** Diagnostic Center A must **never** be able to view, query, or mutate Diagnostic Center B's data. All queries are scoped by `organization_id`.
4. **Doctor Assistant Sandboxing:** Doctor assistants authenticate to a restricted sandbox. They see **only** their assigned doctor's schedule, patient name, phone, age, and queue token. They are strictly blocked from financial data, other doctors' queues, or organization administration.
5. **Private Healthcare Files:** Diagnostic reports and clinical prescriptions are never publicly accessible. All access requires authentication and generates a short-lived (15-min) signed URL with full audit logging.
6. **Immutable Financial Ledger:** All financial movements (payments, commissions, provider payouts, refunds) create double-entry debit/credit ledger records. Historical ledger rows are never deleted or edited.
7. **Dynamic Business Rules:** Pricing, subscription tiers (BDT 200, BDT 500, Enterprise), commissions, slot duration, and cancellation windows are dynamic and stored in database configuration. Never hardcode prices.
8. **Brand Identity Consistency:** Use `Diagnostic Care` and `Your Healthcare Marketplace` across all user interfaces, receipts, reports, and notification templates. Customer helpline `01886748564` must be displayed in customer support contexts.

---

## 2. Directory Layout & Stack Conventions

- **Frontend & API Gateway:** Next.js (App Router), TypeScript, React Server Components + Client Components, Vanilla CSS / CSS Modules with Design System Tokens.
- **Database:** PostgreSQL 16+ with Prisma ORM / SQL Migrations.
- **Cache & Locks:** Redis 7+ for slot hold TTLs and rate limiting.
- **Storage:** S3-compatible private object storage for medical reports.
