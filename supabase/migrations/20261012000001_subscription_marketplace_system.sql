-- Migration: 20261012000001_subscription_marketplace_system.sql
-- Description: Centralized B2B Subscription Engine for Hospitals & Diagnostic Centers
-- Revenue Model: Recurring subscription fees in BDT (Monthly/Annual). No patient transaction commissions.

-- 1. Subscription Plans Table (Admin-Managed, Configurable Pricing in BDT)
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    name_bn VARCHAR(150) NOT NULL,
    tier VARCHAR(50) NOT NULL CHECK (tier IN ('basic', 'professional', 'premium', 'enterprise')),
    description TEXT,
    description_bn TEXT,
    provider_categories TEXT[] NOT NULL DEFAULT '{"diagnostic_center", "hospital", "clinic"}',
    billing_interval VARCHAR(20) NOT NULL CHECK (billing_interval IN ('monthly', 'annual', 'custom')),
    price_bdt NUMERIC(10, 2) NOT NULL DEFAULT 0,
    branch_limit INT NOT NULL DEFAULT 1,
    service_listing_limit INT NOT NULL DEFAULT 20,
    staff_account_limit INT NOT NULL DEFAULT 3,
    has_featured_badge BOOLEAN NOT NULL DEFAULT FALSE,
    has_priority_listing BOOLEAN NOT NULL DEFAULT FALSE,
    has_advanced_analytics BOOLEAN NOT NULL DEFAULT FALSE,
    has_custom_branding BOOLEAN NOT NULL DEFAULT FALSE,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    trial_days INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sub_plans_tier ON subscription_plans(tier);
CREATE INDEX IF NOT EXISTS idx_sub_plans_published ON subscription_plans(is_published, is_archived);

-- 2. Provider Subscriptions Table (Lifecycle Management)
CREATE TABLE IF NOT EXISTS provider_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_type VARCHAR(50) NOT NULL CHECK (provider_type IN ('diagnostic_center', 'hospital', 'clinic')),
    provider_id UUID NOT NULL,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status VARCHAR(30) NOT NULL DEFAULT 'pending_payment' CHECK (
        status IN ('pending_payment', 'active', 'payment_overdue', 'grace_period', 'suspended', 'cancelled', 'expired', 'pending_renewal')
    ),
    billing_interval VARCHAR(20) NOT NULL CHECK (billing_interval IN ('monthly', 'annual', 'custom')),
    price_bdt NUMERIC(10, 2) NOT NULL,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    next_renewal_date TIMESTAMPTZ NOT NULL,
    grace_period_end TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    billing_contact_name VARCHAR(150),
    billing_contact_email VARCHAR(255),
    billing_contact_phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_provider_subs_provider ON provider_subscriptions(provider_type, provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_subs_status ON provider_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_provider_subs_renewal ON provider_subscriptions(next_renewal_date);

-- 3. Subscription Invoices Table (Immutable Billing Records)
CREATE TABLE IF NOT EXISTS subscription_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    subscription_id UUID NOT NULL REFERENCES provider_subscriptions(id) ON DELETE CASCADE,
    provider_type VARCHAR(50) NOT NULL,
    provider_id UUID NOT NULL,
    plan_name VARCHAR(150) NOT NULL,
    billing_period_start TIMESTAMPTZ NOT NULL,
    billing_period_end TIMESTAMPTZ NOT NULL,
    issue_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date TIMESTAMPTZ NOT NULL,
    subtotal_bdt NUMERIC(10, 2) NOT NULL,
    discount_bdt NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax_bdt NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_bdt NUMERIC(10, 2) NOT NULL,
    amount_paid_bdt NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue', 'void', 'refunded')),
    paid_at TIMESTAMPTZ,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sub_invoices_sub ON subscription_invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_sub_invoices_status ON subscription_invoices(status);
CREATE INDEX IF NOT EXISTS idx_sub_invoices_provider ON subscription_invoices(provider_type, provider_id);

-- 4. Subscription Payments Table (Gateway Transactions & Idempotency)
CREATE TABLE IF NOT EXISTS subscription_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES subscription_invoices(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES provider_subscriptions(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL,
    payment_reference VARCHAR(100) NOT NULL UNIQUE,
    gateway_name VARCHAR(50) NOT NULL CHECK (gateway_name IN ('sslcommerz', 'bkash', 'nagad', 'bank_transfer', 'cash_manual')),
    gateway_transaction_id VARCHAR(100),
    idempotency_key VARCHAR(100) UNIQUE,
    amount_bdt NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'BDT',
    status VARCHAR(30) NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'verified', 'failed', 'refunded')),
    gateway_response JSONB,
    verified_at TIMESTAMPTZ,
    verified_by_admin UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sub_payments_invoice ON subscription_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_sub_payments_ref ON subscription_payments(payment_reference);

-- 5. Subscription Administrative Audit Logs
CREATE TABLE IF NOT EXISTS subscription_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES provider_subscriptions(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    performed_by_admin UUID REFERENCES profiles(id),
    admin_email VARCHAR(255),
    mandatory_reason TEXT NOT NULL,
    previous_state JSONB,
    new_state JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sub_audit_sub ON subscription_audit_logs(subscription_id);

-- 6. Subscription Notification Logs
CREATE TABLE IF NOT EXISTS subscription_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES provider_subscriptions(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    event_type VARCHAR(50) NOT NULL,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('email', 'sms', 'in_app')),
    status VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'failed')),
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sub_notif_sub ON subscription_notifications(subscription_id);

-- 7. Seed Initial Configurable Plans (Basic, Professional, Premium, Enterprise)
INSERT INTO subscription_plans (
    code, name, name_bn, tier, description, description_bn,
    provider_categories, billing_interval, price_bdt,
    branch_limit, service_listing_limit, staff_account_limit,
    has_featured_badge, has_priority_listing, has_advanced_analytics, has_custom_branding,
    features, trial_days, is_published, is_archived, sort_order
) VALUES
-- Basic Monthly
(
    'basic_monthly', 'Basic Monthly Plan', 'বেসিক মাসিক প্ল্যান', 'basic',
    'Essential provider listing and standard profile visibility for diagnostic centers and clinics.',
    'ডায়াগনস্টিক সেন্টার ও ক্লিনিকের জন্য প্রয়োজনীয় অনলাইন তালিকা ও স্ট্যান্ডার্ড প্রোফাইল ভিজিবিলিটি।',
    '{"diagnostic_center", "hospital", "clinic"}', 'monthly', 500.00,
    1, 20, 2, FALSE, FALSE, FALSE, FALSE,
    '["Verified Provider Badge", "Standard Search Listing", "Up to 20 Service Listings", "1 Branch Support", "2 Staff Accounts", "Basic Inquiries"]'::jsonb,
    7, TRUE, FALSE, 1
),
-- Basic Annual (17% discount)
(
    'basic_annual', 'Basic Annual Plan', 'বেসিক বাৎসরিক প্ল্যান', 'basic',
    'Annual subscription for essential provider listing with discounted yearly rate.',
    'বাৎসরিক ডিসকাউন্টে প্রয়োজনীয় অনলাইন তালিকা ও স্ট্যান্ডার্ড প্রোফাইল ভিজিবিলিটি।',
    '{"diagnostic_center", "hospital", "clinic"}', 'annual', 5000.00,
    1, 20, 2, FALSE, FALSE, FALSE, FALSE,
    '["Verified Provider Badge", "Standard Search Listing", "Up to 20 Service Listings", "1 Branch Support", "2 Staff Accounts", "Basic Inquiries", "2 Months Free Included"]'::jsonb,
    7, TRUE, FALSE, 2
),
-- Professional Monthly
(
    'pro_monthly', 'Professional Monthly Plan', 'প্রফেশনাল মাসিক প্ল্যান', 'professional',
    'Enhanced provider profile, priority search placement, and increased operational features.',
    'উন্নত প্রোফাইল, সার্চে অগ্রাধিকারমূলক প্লেসমেন্ট এবং বর্ধিত অপারেশনাল ফিচার।',
    '{"diagnostic_center", "hospital", "clinic"}', 'monthly', 1500.00,
    2, 60, 5, TRUE, TRUE, FALSE, FALSE,
    '["Verified Provider Badge", "Priority Search Placement", "Up to 60 Service Listings", "2 Branches Support", "5 Staff Accounts", "Appointment Management Desk", "Review Response Privileges"]'::jsonb,
    0, TRUE, FALSE, 3
),
-- Professional Annual
(
    'pro_annual', 'Professional Annual Plan', 'প্রফেশনাল বাৎসরিক প্ল্যান', 'professional',
    'Enhanced provider profile with yearly savings and priority customer care.',
    'বাৎসরিক সঞ্চয় সহ প্রায়োরিটি সার্চ প্লেসমেন্ট ও উন্নত ফিচার।',
    '{"diagnostic_center", "hospital", "clinic"}', 'annual', 15000.00,
    2, 60, 5, TRUE, TRUE, FALSE, FALSE,
    '["Verified Provider Badge", "Priority Search Placement", "Up to 60 Service Listings", "2 Branches Support", "5 Staff Accounts", "Appointment Management Desk", "2 Months Free Included"]'::jsonb,
    0, TRUE, FALSE, 4
),
-- Premium Monthly
(
    'premium_monthly', 'Premium Monthly Plan', 'প্রিমিয়াম মাসিক প্ল্যান', 'premium',
    'Top-tier visibility, advanced analytics, featured marketplace placement, and 5 branches.',
    'সর্বোচ্চ ভিজিবিলিটি, এডভান্সড অ্যানালিটিক্স, ফিচার্ড প্লেসমেন্ট এবং ৫টি শাখা পরিচালনা।',
    '{"diagnostic_center", "hospital", "clinic"}', 'monthly', 3500.00,
    5, 200, 15, TRUE, TRUE, TRUE, FALSE,
    '["Featured Homepage Badge", "Top-Tier Search Ranking", "Up to 200 Service Listings", "5 Branches Support", "15 Staff Accounts", "Advanced Analytics & Traffic Insights", "Dedicated Priority Support Hotline"]'::jsonb,
    0, TRUE, FALSE, 5
),
-- Premium Annual
(
    'premium_annual', 'Premium Annual Plan', 'প্রিমিয়াম বাৎসরিক প্ল্যান', 'premium',
    'Comprehensive annual enterprise visibility with maximum savings.',
    'বাৎসরিক সর্বোচ্চ ভিজিবিলিটি, অ্যানালিটিক্স এবং প্রিমিয়াম সুবিধা।',
    '{"diagnostic_center", "hospital", "clinic"}', 'annual', 35000.00,
    5, 200, 15, TRUE, TRUE, TRUE, FALSE,
    '["Featured Homepage Badge", "Top-Tier Search Ranking", "Up to 200 Service Listings", "5 Branches Support", "15 Staff Accounts", "Advanced Analytics & Traffic Insights", "2 Months Free Included"]'::jsonb,
    0, TRUE, FALSE, 6
),
-- Enterprise Custom / Monthly
(
    'enterprise_monthly', 'Enterprise Group Plan', 'এন্টারপ্রাইজ গ্রুপ প্ল্যান', 'enterprise',
    'Custom limits and dedicated management for large multi-branch hospital chains and medical groups.',
    'বৃহৎ মাল্টি-ব্রাঞ্চ হাসপাতাল চেইন ও মেডিকেল গ্রুপের জন্য কাস্টমাইজড প্ল্যান।',
    '{"diagnostic_center", "hospital"}', 'monthly', 8000.00,
    20, 1000, 50, TRUE, TRUE, TRUE, TRUE,
    '["Full Multi-Branch Network (20+ Branches)", "Unlimited Service Listings", "50 Staff Accounts", "Custom Hospital Branding", "API & ERP Integrations", "Dedicated Account Manager"]'::jsonb,
    0, TRUE, FALSE, 7
)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    name_bn = EXCLUDED.name_bn,
    price_bdt = EXCLUDED.price_bdt,
    features = EXCLUDED.features,
    updated_at = NOW();

-- 8. Row Level Security Policies for Subscription Tables
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subscription plans viewable by everyone" ON subscription_plans FOR SELECT USING (is_published = TRUE OR public.is_admin());
CREATE POLICY "Admins can manage subscription plans" ON subscription_plans FOR ALL USING (public.is_admin());

ALTER TABLE provider_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all subscriptions" ON provider_subscriptions FOR ALL USING (public.is_admin());
CREATE POLICY "Providers can view their own subscriptions" ON provider_subscriptions FOR SELECT USING (
    auth.role() = 'authenticated'
);

ALTER TABLE subscription_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all invoices" ON subscription_invoices FOR ALL USING (public.is_admin());
CREATE POLICY "Providers can view their own invoices" ON subscription_invoices FOR SELECT USING (
    auth.role() = 'authenticated'
);

ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all payments" ON subscription_payments FOR ALL USING (public.is_admin());
CREATE POLICY "Providers can view their own payments" ON subscription_payments FOR SELECT USING (
    auth.role() = 'authenticated'
);

ALTER TABLE subscription_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view audit logs" ON subscription_audit_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert audit logs" ON subscription_audit_logs FOR INSERT WITH CHECK (public.is_admin());
