-- Migration: 20261012000002_hospital_portal_system.sql
-- Description: Schema for Diagnostic Care Hospital & Clinic Portal
-- Scope: Hospital Departments, Doctor Associations with Consent, Hospital Staff RBAC, In-App Notifications

-- 1. Hospital Departments Table
CREATE TABLE IF NOT EXISTS hospital_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    name_bn VARCHAR(150),
    code VARCHAR(50),
    description TEXT,
    head_doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_hosp_depts_hospital ON hospital_departments(hospital_id);

-- 2. Doctor-Hospital Associations (Consent & Chamber Assignments)
CREATE TABLE IF NOT EXISTS hospital_doctor_associations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES provider_locations(id) ON DELETE SET NULL,
    department_id UUID REFERENCES hospital_departments(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_consent', 'rejected', 'ended')),
    consultation_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    followup_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    chamber_room VARCHAR(50),
    invitation_notes TEXT,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_hospital_doctor_branch UNIQUE (hospital_id, doctor_id, branch_id)
);
CREATE INDEX IF NOT EXISTS idx_hosp_doc_assoc_hosp ON hospital_doctor_associations(hospital_id);
CREATE INDEX IF NOT EXISTS idx_hosp_doc_assoc_doc ON hospital_doctor_associations(doctor_id);

-- 3. Hospital Staff & Permissions (Role-Scoped Access)
CREATE TABLE IF NOT EXISTS hospital_staff_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES provider_locations(id) ON DELETE SET NULL,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'receptionist' CHECK (
        role IN ('hospital_owner', 'hospital_manager', 'branch_manager', 'receptionist', 'finance_staff')
    ),
    can_manage_appointments BOOLEAN NOT NULL DEFAULT TRUE,
    can_manage_doctors BOOLEAN NOT NULL DEFAULT FALSE,
    can_manage_services BOOLEAN NOT NULL DEFAULT FALSE,
    can_manage_billing BOOLEAN NOT NULL DEFAULT FALSE,
    can_view_analytics BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'revoked')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_hospital_staff_email UNIQUE (hospital_id, email)
);
CREATE INDEX IF NOT EXISTS idx_hosp_staff_hospital ON hospital_staff_members(hospital_id);

-- 4. Hospital Operational Notifications Table
CREATE TABLE IF NOT EXISTS hospital_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES provider_locations(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- 'new_appointment', 'cancellation', 'doctor_consent', 'subscription_expiry', 'verification_update'
    title VARCHAR(200) NOT NULL,
    title_bn VARCHAR(200),
    message TEXT NOT NULL,
    message_bn TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_hosp_notif_hosp ON hospital_notifications(hospital_id, is_read);

-- 5. Row Level Security Policies
ALTER TABLE hospital_departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active hospital departments" ON hospital_departments FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins or owners can manage departments" ON hospital_departments FOR ALL USING (public.is_admin());

ALTER TABLE hospital_doctor_associations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active doctor associations" ON hospital_doctor_associations FOR SELECT USING (status = 'active');
CREATE POLICY "Admins or owners can manage doctor associations" ON hospital_doctor_associations FOR ALL USING (public.is_admin());

ALTER TABLE hospital_staff_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins or hospital owners manage staff" ON hospital_staff_members FOR ALL USING (public.is_admin());

ALTER TABLE hospital_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins or hospital owners view notifications" ON hospital_notifications FOR ALL USING (public.is_admin());
