-- Migration: 20261006000003_services_and_appointments.sql
-- Description: Services, schedules, appointments, medical records, and prescriptions

DO $$ BEGIN
    CREATE TYPE appointment_status_enum AS ENUM (
        'pending',
        'confirmed',
        'checked_in',
        'in_progress',
        'completed',
        'cancelled',
        'rejected',
        'no_show',
        'rescheduled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_enum AS ENUM (
        'pending',
        'paid',
        'partial',
        'refunded',
        'failed',
        'cash_at_desk'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Service Categories
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    name_bn VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    icon VARCHAR(50),
    description TEXT,
    description_bn TEXT,
    display_order INT NOT NULL DEFAULT 0,
    status general_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Healthcare Services (Master Catalog)
CREATE TABLE IF NOT EXISTS healthcare_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    name_bn VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE,
    description TEXT,
    description_bn TEXT,
    status general_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Provider Services (Mapping services to specific clinics, hospitals, diagnostic centers)
CREATE TABLE IF NOT EXISTS provider_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_type VARCHAR(50) NOT NULL,
    provider_id UUID NOT NULL,
    service_id UUID NOT NULL REFERENCES healthcare_services(id) ON DELETE CASCADE,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount_price NUMERIC(10, 2),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_provider_service UNIQUE (provider_type, provider_id, service_id)
);

-- 4. Doctor Schedules (Weekly recurring templates)
CREATE TABLE IF NOT EXISTS doctor_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    provider_type VARCHAR(50) NOT NULL DEFAULT 'diagnostic_center', -- or clinic, hospital
    provider_id UUID NOT NULL,
    branch_id UUID REFERENCES provider_locations(id) ON DELETE SET NULL,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INT NOT NULL DEFAULT 15,
    max_patients_per_session INT NOT NULL DEFAULT 20,
    consultation_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_doctor_schedules_doctor ON doctor_schedules(doctor_id);

-- 5. Doctor Availability (Specific date overrides or generated availability blocks)
CREATE TABLE IF NOT EXISTS doctor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES doctor_schedules(id) ON DELETE SET NULL,
    available_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN NOT NULL DEFAULT FALSE,
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    hold_token VARCHAR(100),
    hold_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_doc_date_time UNIQUE (doctor_id, available_date, start_time)
);
CREATE INDEX IF NOT EXISTS idx_doctor_avail_search ON doctor_availability(doctor_id, available_date, is_booked, is_blocked);

-- 6. Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(30) NOT NULL UNIQUE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    schedule_id UUID REFERENCES doctor_schedules(id) ON DELETE SET NULL,
    availability_id UUID REFERENCES doctor_availability(id) ON DELETE SET NULL,
    provider_type VARCHAR(50) NOT NULL DEFAULT 'diagnostic_center',
    provider_id UUID NOT NULL,
    branch_id UUID REFERENCES provider_locations(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    token_number INT NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    patient_age INT,
    patient_gender VARCHAR(20),
    consultation_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_payable NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status appointment_status_enum NOT NULL DEFAULT 'confirmed',
    payment_status payment_status_enum NOT NULL DEFAULT 'cash_at_desk',
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    cancelled_at TIMESTAMPTZ,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Partial unique index to strictly guarantee zero double booking!
    CONSTRAINT uq_doctor_slot_active UNIQUE (doctor_id, appointment_date, start_time)
);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- 7. Appointment Status History
CREATE TABLE IF NOT EXISTS appointment_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    previous_status appointment_status_enum,
    new_status appointment_status_enum NOT NULL,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_apt_history_apt ON appointment_status_history(appointment_id);

-- 8. Patients Medical Profiles
CREATE TABLE IF NOT EXISTS patients_medical_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE UNIQUE,
    allergies TEXT[],
    chronic_conditions TEXT[],
    past_surgeries TEXT[],
    family_medical_history TEXT,
    current_medications TEXT[],
    height_cm NUMERIC(5, 2),
    weight_kg NUMERIC(5, 2),
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Medical Records (Encrypted Health Vault)
CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    record_type VARCHAR(50) NOT NULL, -- 'lab_report', 'prescription', 'xray', 'mri', 'discharge_summary'
    title VARCHAR(255) NOT NULL,
    document_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    issuing_organization VARCHAR(255),
    doctor_name VARCHAR(150),
    is_confidential BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);

-- 10. Prescriptions
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    diagnosis TEXT,
    clinical_notes TEXT,
    advice TEXT,
    next_visit_date DATE,
    prescription_code VARCHAR(30) UNIQUE,
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor ON prescriptions(doctor_id);

-- 11. Prescription Items (Medications prescribed)
CREATE TABLE IF NOT EXISTS prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100) NOT NULL, -- e.g. "1+0+1"
    duration VARCHAR(100) NOT NULL, -- e.g. "7 days"
    instructions VARCHAR(255), -- e.g. "After meal"
    instructions_bn VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_prescription_items_rx ON prescription_items(prescription_id);
