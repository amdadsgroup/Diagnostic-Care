-- Migration: 20261006000004_diagnostics_pharmacy_ambulance.sql
-- Description: Lab tests, diagnostic bookings, pharmacy products, orders, ambulance requests, home healthcare

DO $$ BEGIN
    CREATE TYPE order_status_enum AS ENUM (
        'pending',
        'confirmed',
        'processing',
        'dispatched',
        'delivered',
        'cancelled',
        'refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ambulance_status_enum AS ENUM (
        'requested',
        'assigned',
        'on_the_way',
        'arrived',
        'in_transit',
        'completed',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Lab Tests
CREATE TABLE IF NOT EXISTS lab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagnostic_center_id UUID REFERENCES diagnostic_centers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sample_type VARCHAR(100), -- 'Blood', 'Urine', 'Swab', 'Stool', 'Biopsy'
    turnaround_hours INT NOT NULL DEFAULT 24,
    preparation_instructions TEXT,
    preparation_instructions_bn TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount_price NUMERIC(10, 2),
    is_home_sample_supported BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    status general_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lab_tests_center ON lab_tests(diagnostic_center_id);
CREATE INDEX IF NOT EXISTS idx_lab_tests_category ON lab_tests(category);

-- 2. Lab Test Packages (e.g. Executive Health Checkup, Cardiac Profile)
CREATE TABLE IF NOT EXISTS lab_test_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagnostic_center_id UUID REFERENCES diagnostic_centers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    description TEXT,
    included_test_ids UUID[],
    original_total NUMERIC(10, 2) NOT NULL,
    package_price NUMERIC(10, 2) NOT NULL,
    status general_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Diagnostic Bookings
CREATE TABLE IF NOT EXISTS diagnostic_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(30) NOT NULL UNIQUE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    diagnostic_center_id UUID NOT NULL REFERENCES diagnostic_centers(id) ON DELETE RESTRICT,
    branch_id UUID REFERENCES provider_locations(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    preferred_time TIME,
    is_home_collection BOOLEAN NOT NULL DEFAULT FALSE,
    collection_address TEXT,
    patient_name VARCHAR(150) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    net_payable NUMERIC(10, 2) NOT NULL DEFAULT 0,
    payment_status payment_status_enum NOT NULL DEFAULT 'cash_at_desk',
    status order_status_enum NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_diag_bookings_patient ON diagnostic_bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_diag_bookings_center ON diagnostic_bookings(diagnostic_center_id);

-- 4. Diagnostic Booking Items
CREATE TABLE IF NOT EXISTS diagnostic_booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES diagnostic_bookings(id) ON DELETE CASCADE,
    test_id UUID REFERENCES lab_tests(id) ON DELETE SET NULL,
    package_id UUID REFERENCES lab_test_packages(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_diag_items_booking ON diagnostic_booking_items(booking_id);

-- 5. Diagnostic Reports
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES diagnostic_bookings(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    diagnostic_center_id UUID NOT NULL REFERENCES diagnostic_centers(id) ON DELETE RESTRICT,
    test_name VARCHAR(255) NOT NULL,
    report_file_url TEXT NOT NULL,
    report_code VARCHAR(50) UNIQUE,
    sample_collected_at TIMESTAMPTZ,
    report_published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_by_consultant VARCHAR(150),
    parameters_json JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reports_patient ON reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_reports_center ON reports(diagnostic_center_id);

-- 6. Pharmacy Products
CREATE TABLE IF NOT EXISTS pharmacy_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pharmacy_id UUID REFERENCES pharmacies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255),
    generic_name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255),
    manufacturer VARCHAR(255),
    category VARCHAR(100) NOT NULL, -- 'Antibiotic', 'Pain Relief', 'Cardiac', 'Diabetic'
    dosage_form VARCHAR(50) NOT NULL, -- 'Tablet', 'Syrup', 'Capsule', 'Injection'
    strength VARCHAR(50), -- '500mg', '10mg'
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    stock_quantity INT NOT NULL DEFAULT 0,
    is_prescription_required BOOLEAN NOT NULL DEFAULT FALSE,
    image_url TEXT,
    status general_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pharmacy_products_pharmacy ON pharmacy_products(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_products_generic ON pharmacy_products(generic_name);

-- 7. Pharmacy Orders
CREATE TABLE IF NOT EXISTS pharmacy_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code VARCHAR(30) NOT NULL UNIQUE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE RESTRICT,
    delivery_address TEXT NOT NULL,
    delivery_phone VARCHAR(20) NOT NULL,
    prescription_image_url TEXT,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    status order_status_enum NOT NULL DEFAULT 'pending',
    payment_status payment_status_enum NOT NULL DEFAULT 'cash_at_desk',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pharmacy_orders_patient ON pharmacy_orders(patient_id);

-- 8. Pharmacy Order Items
CREATE TABLE IF NOT EXISTS pharmacy_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES pharmacy_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES pharmacy_products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Ambulance Requests
CREATE TABLE IF NOT EXISTS ambulance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_code VARCHAR(30) NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    provider_id UUID REFERENCES ambulance_providers(id) ON DELETE SET NULL,
    contact_name VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    pickup_address TEXT NOT NULL,
    pickup_latitude NUMERIC(10, 7),
    pickup_longitude NUMERIC(10, 7),
    destination_address TEXT NOT NULL,
    ambulance_type VARCHAR(50) NOT NULL DEFAULT 'ac', -- 'ac', 'non_ac', 'icu', 'freezer'
    is_emergency BOOLEAN NOT NULL DEFAULT TRUE,
    estimated_fare NUMERIC(10, 2),
    driver_name VARCHAR(150),
    driver_phone VARCHAR(20),
    vehicle_number VARCHAR(50),
    status ambulance_status_enum NOT NULL DEFAULT 'requested',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ambulance_requests_status ON ambulance_requests(status);

-- 10. Home Healthcare Services Catalog
CREATE TABLE IF NOT EXISTS home_healthcare_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES home_healthcare_providers(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    service_name_bn VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'nursing', 'caregiving', 'physiotherapy', 'dressing'
    rate_per_day NUMERIC(10, 2) NOT NULL DEFAULT 0,
    rate_per_visit NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status general_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Home Healthcare Bookings
CREATE TABLE IF NOT EXISTS home_healthcare_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(30) NOT NULL UNIQUE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    provider_id UUID NOT NULL REFERENCES home_healthcare_providers(id) ON DELETE RESTRICT,
    service_id UUID REFERENCES home_healthcare_services(id) ON DELETE SET NULL,
    patient_name VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    service_address TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    duration_type VARCHAR(50) NOT NULL DEFAULT 'per_visit', -- 'hourly', 'per_visit', 'daily_12h', 'daily_24h'
    assigned_staff_name VARCHAR(150),
    total_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status order_status_enum NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
