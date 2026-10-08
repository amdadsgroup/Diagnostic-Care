-- Migration: 20261006000002_providers_and_actors.sql
-- Description: Healthcare actors: patients, doctors, assistants, diagnostic centers, clinics, hospitals, pharmacies, ambulance, home care, verification & documents

-- 1. Patients
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    blood_group VARCHAR(10),
    date_of_birth DATE,
    gender VARCHAR(20),
    emergency_contact_phone VARCHAR(20),
    status general_status_enum NOT NULL DEFAULT 'active',
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_patients_profile ON patients(profile_id);

-- 2. Doctors
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    bmdc_registration_number VARCHAR(50) NOT NULL UNIQUE,
    specialization VARCHAR(100) NOT NULL,
    specialization_bn VARCHAR(100),
    qualifications VARCHAR(255) NOT NULL,
    qualifications_bn VARCHAR(255),
    designation VARCHAR(150),
    institute VARCHAR(255),
    experience_years INT NOT NULL DEFAULT 0,
    bio TEXT,
    bio_bn TEXT,
    consultation_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    followup_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    is_telemedicine_available BOOLEAN NOT NULL DEFAULT FALSE,
    is_in_person_available BOOLEAN NOT NULL DEFAULT TRUE,
    verification_status verification_status_enum NOT NULL DEFAULT 'pending',
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    total_reviews INT NOT NULL DEFAULT 0,
    status general_status_enum NOT NULL DEFAULT 'active',
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_doctors_verification ON doctors(verification_status);

-- 3. Diagnostic Centers
CREATE TABLE IF NOT EXISTS diagnostic_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255),
    slug VARCHAR(255) NOT NULL UNIQUE,
    trade_license_number VARCHAR(100),
    dghs_registration_number VARCHAR(100),
    description TEXT,
    description_bn TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    website VARCHAR(255),
    has_home_sample_collection BOOLEAN NOT NULL DEFAULT FALSE,
    verification_status verification_status_enum NOT NULL DEFAULT 'pending',
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    total_reviews INT NOT NULL DEFAULT 0,
    status general_status_enum NOT NULL DEFAULT 'active',
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_diagnostic_centers_slug ON diagnostic_centers(slug);

-- 4. Clinics
CREATE TABLE IF NOT EXISTS clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255),
    slug VARCHAR(255) NOT NULL UNIQUE,
    trade_license_number VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    verification_status verification_status_enum NOT NULL DEFAULT 'pending',
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    total_reviews INT NOT NULL DEFAULT 0,
    status general_status_enum NOT NULL DEFAULT 'active',
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Hospitals
CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255),
    slug VARCHAR(255) NOT NULL UNIQUE,
    trade_license_number VARCHAR(100),
    dghs_registration_number VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    emergency_phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    total_beds INT NOT NULL DEFAULT 0,
    icu_beds INT NOT NULL DEFAULT 0,
    has_icu BOOLEAN NOT NULL DEFAULT FALSE,
    has_nicu BOOLEAN NOT NULL DEFAULT FALSE,
    has_emergency_24_7 BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    verification_status verification_status_enum NOT NULL DEFAULT 'pending',
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    total_reviews INT NOT NULL DEFAULT 0,
    status general_status_enum NOT NULL DEFAULT 'active',
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Pharmacies
CREATE TABLE IF NOT EXISTS pharmacies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255),
    slug VARCHAR(255) NOT NULL UNIQUE,
    drug_license_number VARCHAR(100) NOT NULL,
    trade_license_number VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    has_home_delivery BOOLEAN NOT NULL DEFAULT TRUE,
    is_24_hours BOOLEAN NOT NULL DEFAULT FALSE,
    verification_status verification_status_enum NOT NULL DEFAULT 'pending',
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    total_reviews INT NOT NULL DEFAULT 0,
    status general_status_enum NOT NULL DEFAULT 'active',
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Ambulance Providers
CREATE TABLE IF NOT EXISTS ambulance_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    fleet_size INT NOT NULL DEFAULT 1,
    has_icu_ambulance BOOLEAN NOT NULL DEFAULT FALSE,
    has_ac_ambulance BOOLEAN NOT NULL DEFAULT TRUE,
    has_freezer_ambulance BOOLEAN NOT NULL DEFAULT FALSE,
    verification_status verification_status_enum NOT NULL DEFAULT 'pending',
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    total_reviews INT NOT NULL DEFAULT 0,
    status general_status_enum NOT NULL DEFAULT 'active',
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Home Healthcare Providers
CREATE TABLE IF NOT EXISTS home_healthcare_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    services_offered TEXT[], -- e.g. ['nursing', 'caregiving', 'physiotherapy', 'sample_collection']
    verification_status verification_status_enum NOT NULL DEFAULT 'pending',
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    total_reviews INT NOT NULL DEFAULT 0,
    status general_status_enum NOT NULL DEFAULT 'active',
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Doctor Assistants
CREATE TABLE IF NOT EXISTS doctor_assistants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    assigned_branch_id UUID,
    can_manage_queue BOOLEAN NOT NULL DEFAULT TRUE,
    can_view_medical_records BOOLEAN NOT NULL DEFAULT FALSE,
    status general_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_doctor_assistant UNIQUE (profile_id, doctor_id)
);
CREATE INDEX IF NOT EXISTS idx_doctor_assistants_doc ON doctor_assistants(doctor_id);

-- 10. Healthcare Staff
CREATE TABLE IF NOT EXISTS healthcare_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organization_type VARCHAR(50) NOT NULL, -- 'diagnostic_center', 'clinic', 'hospital', 'pharmacy'
    organization_id UUID NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    can_manage_bookings BOOLEAN NOT NULL DEFAULT TRUE,
    can_upload_reports BOOLEAN NOT NULL DEFAULT TRUE,
    status general_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Provider Locations / Branches
CREATE TABLE IF NOT EXISTS provider_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_type VARCHAR(50) NOT NULL, -- 'diagnostic_center', 'hospital', 'clinic', 'pharmacy'
    provider_id UUID NOT NULL,
    branch_name VARCHAR(150) NOT NULL,
    branch_name_bn VARCHAR(150),
    is_main_branch BOOLEAN NOT NULL DEFAULT FALSE,
    address_line TEXT NOT NULL,
    upazila_id UUID REFERENCES upazilas(id) ON DELETE SET NULL,
    district_id UUID REFERENCES districts(id) ON DELETE SET NULL,
    division_id UUID REFERENCES divisions(id) ON DELETE SET NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    phone VARCHAR(20) NOT NULL,
    opening_time VARCHAR(10) NOT NULL DEFAULT '08:00',
    closing_time VARCHAR(10) NOT NULL DEFAULT '22:00',
    status general_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_provider_locations_provider ON provider_locations(provider_type, provider_id);

-- 12. Provider Documents (Licenses, certifications stored privately)
CREATE TABLE IF NOT EXISTS provider_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_type VARCHAR(50) NOT NULL,
    provider_id UUID NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- 'trade_license', 'dghs_reg', 'bmdc_cert', 'drug_license'
    document_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_provider_documents_prov ON provider_documents(provider_type, provider_id);

-- 13. Provider Verifications (Workflow: pending -> under_review -> verified/rejected)
CREATE TABLE IF NOT EXISTS provider_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_type VARCHAR(50) NOT NULL,
    provider_id UUID NOT NULL,
    status verification_status_enum NOT NULL DEFAULT 'pending',
    reviewer_notes TEXT,
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_provider_verifications_status ON provider_verifications(status);

-- 14. Provider Claims
CREATE TABLE IF NOT EXISTS provider_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_type VARCHAR(50) NOT NULL,
    provider_id UUID NOT NULL,
    claimant_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    business_email VARCHAR(255) NOT NULL,
    business_phone VARCHAR(20) NOT NULL,
    proof_document_url TEXT,
    verification_status verification_status_enum NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Provider Leads & Contact Requests
CREATE TABLE IF NOT EXISTS provider_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name VARCHAR(255) NOT NULL,
    provider_type VARCHAR(50) NOT NULL,
    contact_person VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    district_id UUID REFERENCES districts(id) ON DELETE SET NULL,
    notes TEXT,
    lead_status VARCHAR(50) NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'onboarded', 'dropped'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
