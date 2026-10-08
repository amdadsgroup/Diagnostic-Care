-- Migration: 20261006000005_social_support_finance.sql
-- Description: Reviews, favorites, chat, notifications, tickets, audit logs, subscriptions, and financial ledger

-- 1. Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    provider_type VARCHAR(50) NOT NULL, -- 'doctor', 'diagnostic_center', 'hospital', 'clinic', 'pharmacy'
    provider_id UUID NOT NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    diagnostic_booking_id UUID REFERENCES diagnostic_bookings(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_verified_patient BOOLEAN NOT NULL DEFAULT TRUE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    is_flagged BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON reviews(provider_type, provider_id);

-- 2. Ratings (Aggregate breakdown)
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_type VARCHAR(50) NOT NULL,
    provider_id UUID NOT NULL,
    average_score NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    five_star_count INT NOT NULL DEFAULT 0,
    four_star_count INT NOT NULL DEFAULT 0,
    three_star_count INT NOT NULL DEFAULT 0,
    two_star_count INT NOT NULL DEFAULT 0,
    one_star_count INT NOT NULL DEFAULT 0,
    total_reviews INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_provider_rating UNIQUE (provider_type, provider_id)
);

-- 3. Favorites / Saved Providers
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL, -- 'doctor', 'diagnostic_center', 'hospital', 'pharmacy'
    entity_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_favorite UNIQUE (profile_id, entity_type, entity_id)
);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(profile_id);

-- 4. Conversations
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150),
    is_group BOOLEAN NOT NULL DEFAULT FALSE,
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Conversation Participants
CREATE TABLE IF NOT EXISTS conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_conv_participant UNIQUE (conversation_id, profile_id)
);
CREATE INDEX IF NOT EXISTS idx_conv_part_profile ON conversation_participants(profile_id);

-- 6. Messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    message_text TEXT NOT NULL,
    attachment_url TEXT,
    attachment_type VARCHAR(50),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);

-- 7. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    title_bn VARCHAR(200),
    message TEXT NOT NULL,
    message_bn TEXT,
    notification_type VARCHAR(50) NOT NULL, -- 'appointment', 'report_ready', 'prescription', 'queue_call', 'promotion'
    action_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id, is_read);

-- 8. Search History
CREATE TABLE IF NOT EXISTS search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    query_term VARCHAR(255) NOT NULL,
    category_filter VARCHAR(100),
    district_filter VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_search_history_profile ON search_history(profile_id);

-- 9. Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_code VARCHAR(30) NOT NULL UNIQUE,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'appointment_issue', 'billing', 'report_access', 'general'
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    status VARCHAR(30) NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Admin Actions & Audit Logs
CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    action_type VARCHAR(100) NOT NULL, -- 'verify_provider', 'reject_provider', 'ban_user', 'refund_order'
    target_entity VARCHAR(100) NOT NULL,
    target_id UUID NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- 11. Subscriptions (B2B SaaS Plans for Providers)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_type VARCHAR(50) NOT NULL,
    provider_id UUID NOT NULL,
    plan_name VARCHAR(100) NOT NULL, -- 'Basic BDT 200', 'Standard BDT 500', 'Enterprise BDT 2000'
    price_bdt NUMERIC(10, 2) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly',
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Payments & Financial Transactions (Double-Entry Ledger)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_reference VARCHAR(100) NOT NULL UNIQUE,
    gateway_name VARCHAR(50) NOT NULL, -- 'bkash', 'nagad', 'sslcommerz', 'cash'
    transaction_id VARCHAR(100),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'BDT',
    payment_status payment_status_enum NOT NULL DEFAULT 'pending',
    payer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    purpose VARCHAR(100) NOT NULL, -- 'appointment_fee', 'diagnostic_test', 'medicine_order', 'ambulance'
    related_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    account_type VARCHAR(50) NOT NULL, -- 'platform_take_rate', 'provider_payable', 'patient_debit'
    account_id UUID,
    entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('DEBIT', 'CREDIT')),
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pay_trans_payment ON payment_transactions(payment_id);

-- 13. Coupons & Promotions
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_percent NUMERIC(5, 2),
    discount_amount NUMERIC(10, 2),
    min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL,
    max_uses INT,
    times_used INT NOT NULL DEFAULT 0,
    status general_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255),
    banner_image_url TEXT NOT NULL,
    redirect_url TEXT,
    display_location VARCHAR(50) NOT NULL DEFAULT 'hero',
    display_order INT NOT NULL DEFAULT 0,
    status general_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
