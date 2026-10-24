-- Supabase Reference Seed Data
-- Project: Diagnostic Care — Your Healthcare Marketplace (Bangladesh)
-- Accurate, schema-validated seed data for Divisions, Districts, Upazilas, Categories, Services, Providers & Super Admin

-- 1. Bangladesh Divisions
INSERT INTO public.divisions (id, name, name_bn, code, status)
VALUES
    ('a0000001-0000-0000-0000-000000000001', 'Sylhet', 'সিলেট', 'SYL', 'active'),
    ('a0000001-0000-0000-0000-000000000002', 'Dhaka', 'ঢাকা', 'DHA', 'active'),
    ('a0000001-0000-0000-0000-000000000003', 'Chittagong', 'চট্টগ্রাম', 'CTG', 'active'),
    ('a0000001-0000-0000-0000-000000000004', 'Rajshahi', 'রাজশাহী', 'RAJ', 'active'),
    ('a0000001-0000-0000-0000-000000000005', 'Khulna', 'খুলনা', 'KHU', 'active'),
    ('a0000001-0000-0000-0000-000000000006', 'Barisal', 'বরিশাল', 'BAR', 'active'),
    ('a0000001-0000-0000-0000-000000000007', 'Rangpur', 'রংপুর', 'RAN', 'active'),
    ('a0000001-0000-0000-0000-000000000008', 'Mymensingh', 'ময়মনসিংহ', 'MYM', 'active')
ON CONFLICT (name) DO UPDATE SET name_bn = EXCLUDED.name_bn, code = EXCLUDED.code, status = 'active';

-- 2. Districts (Sylhet Division & Metropolitan Hubs)
INSERT INTO public.districts (id, division_id, name, name_bn, code, status)
VALUES
    ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Moulvibazar', 'মৌলভীবাজার', 'MBZ', 'active'),
    ('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000001', 'Sylhet', 'সিলেট', 'SYL', 'active'),
    ('b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000001', 'Habiganj', 'হবিগঞ্জ', 'HAB', 'active'),
    ('b0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000001', 'Sunamganj', 'সুনামগঞ্জ', 'SUN', 'active'),
    ('b0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000002', 'Dhaka', 'ঢাকা', 'DHK', 'active'),
    ('b0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000003', 'Chittagong', 'চট্টগ্রাম', 'CTG', 'active')
ON CONFLICT (division_id, name) DO UPDATE SET name_bn = EXCLUDED.name_bn, code = EXCLUDED.code, status = 'active';

-- 3. Upazilas (Moulvibazar Upazilas + Sylhet Sadar)
INSERT INTO public.upazilas (id, district_id, name, name_bn, postal_code, status)
VALUES
    ('c0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'Moulvibazar Sadar', 'মৌলভীবাজার সদর', '3200', 'active'),
    ('c0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'Sreemangal', 'শ্রীমঙ্গল', '3210', 'active'),
    ('c0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', 'Kamalganj', 'কমলগঞ্জ', '3220', 'active'),
    ('c0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', 'Kulaura', 'কুলাউড়া', '3230', 'active'),
    ('c0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000001', 'Barlekha', 'বড়লেখা', '3250', 'active'),
    ('c0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000001', 'Rajnagar', 'রাজনগর', '3240', 'active'),
    ('c0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000001', 'Juri', 'জুড়ী', '3251', 'active'),
    ('c0000001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000002', 'Sylhet Sadar', 'সিলেট সদর', '3100', 'active')
ON CONFLICT (district_id, name) DO UPDATE SET name_bn = EXCLUDED.name_bn, postal_code = EXCLUDED.postal_code, status = 'active';

-- 4. Service Categories
INSERT INTO public.service_categories (id, name, name_bn, slug, icon, description, display_order, status)
VALUES
    ('d0000001-0000-0000-0000-000000000001', 'Specialist Doctor Consultation', 'বিশেষজ্ঞ ডাক্তার পরামর্শ', 'doctor-consultation', 'Stethoscope', 'Experienced specialist doctors across all clinical disciplines', 1, 'active'),
    ('d0000001-0000-0000-0000-000000000002', 'Diagnostic & Pathology Tests', 'ডায়াগনস্টিক ও প্যাথলজি টেস্ট', 'diagnostic-tests', 'TestTube2', 'Accurate digital diagnostic investigations with accredited laboratories', 2, 'active'),
    ('d0000001-0000-0000-0000-000000000003', 'Hospitals & Specialized Clinics', 'হাসপাতাল ও স্পেশালাইজড ক্লিনিক', 'hospitals-clinics', 'Building2', 'Emergency care, surgical suites, and inpatient beds', 3, 'active'),
    ('d0000001-0000-0000-0000-000000000004', 'Certified Pharmacies', 'অনুমোদিত ফার্মেসি', 'pharmacies', 'Pill', 'Authentic medicines, prescription fulfillment, and home delivery', 4, 'active'),
    ('d0000001-0000-0000-0000-000000000005', 'Emergency Ambulance Service', 'জরুরি অ্যাম্বুলেন্স সার্ভিস', 'ambulance-service', 'HeartPulse', '24/7 ICU, AC, and regular emergency medical transit nationwide', 5, 'active'),
    ('d0000001-0000-0000-0000-000000000006', 'Home Healthcare & Nursing', 'হোম হেলথকেয়ার ও নার্সিং', 'home-healthcare', 'Activity', 'Qualified in-home nursing, post-op care, and elderly assistance', 6, 'active')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, name_bn = EXCLUDED.name_bn, icon = EXCLUDED.icon, display_order = EXCLUDED.display_order;

-- 5. Standard Healthcare Investigation Catalog
INSERT INTO public.healthcare_services (category_id, name, name_bn, code, description, status)
VALUES
    ('d0000001-0000-0000-0000-000000000002', 'Complete Blood Count (CBC)', 'কমপ্লিট ব্লাড কাউন্ট (সিবিসি)', 'CBC-001', 'Routine hematology profiling', 'active'),
    ('d0000001-0000-0000-0000-000000000002', 'Lipid Profile', 'লিপিড প্রোফাইল', 'LIP-001', 'Comprehensive cholesterol and triglyceride evaluation', 'active'),
    ('d0000001-0000-0000-0000-000000000002', 'HbA1c (Glycated Hemoglobin)', 'এইচবিএওয়ানসি (গ্লাইকেটেড হিমোগ্লোবিন)', 'HBA1C-001', 'Diabetes average blood sugar level for 3 months', 'active'),
    ('d0000001-0000-0000-0000-000000000002', 'Serum Creatinine', 'সিরাম ক্রিয়েটিনিন', 'CREAT-001', 'Kidney function marker', 'active'),
    ('d0000001-0000-0000-0000-000000000002', 'Ultrasonography of Whole Abdomen (USG)', 'হোল অ্যাবডোমেন আল্ট্রাসনোগ্রাফি', 'USG-001', 'High-resolution abdominal diagnostic sonography', 'active'),
    ('d0000001-0000-0000-0000-000000000002', 'Digital Chest X-Ray (P/A View)', 'ডিজিটাল চেস্ট এক্স-রে', 'XRAY-001', 'Chest imaging for pulmonary and cardiac screening', 'active'),
    ('d0000001-0000-0000-0000-000000000002', '12-Lead ECG (Electrocardiogram)', '১২-লিড ইসিজি', 'ECG-001', 'Cardiovascular electrical rhythm monitoring', 'active'),
    ('d0000001-0000-0000-0000-000000000002', 'Thyroid Stimulating Hormone (TSH)', 'টিএসএইচ হরমোন টেস্ট', 'TSH-001', 'Endocrine thyroid hormone assessment', 'active')
ON CONFLICT (code) DO NOTHING;

-- 6. Master Super Administrator Account
DO $$
DECLARE
    admin_uid UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'contact.amdadur@gmail.com') THEN
        INSERT INTO auth.users (
            id, instance_id, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
        ) VALUES (
            admin_uid, '00000000-0000-0000-0000-000000000000',
            'contact.amdadur@gmail.com', crypt('@Amdadur2025', gen_salt('bf')), NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Amdadur Rahman (Platform Super Admin)","role":"SUPER_ADMIN"}',
            NOW(), NOW(), 'authenticated', 'authenticated'
        );
    ELSE
        UPDATE auth.users
        SET encrypted_password = crypt('@Amdadur2025', gen_salt('bf')),
            raw_user_meta_data = raw_user_meta_data || '{"role":"SUPER_ADMIN"}'::jsonb
        WHERE email = 'contact.amdadur@gmail.com'
        RETURNING id INTO admin_uid;
    END IF;

    INSERT INTO public.profiles (
        id, phone, email, full_name, language_preference, status, is_email_verified
    ) VALUES (
        admin_uid, '01886748564', 'contact.amdadur@gmail.com',
        'Amdadur Rahman (Platform Super Admin)', 'en', 'active', true
    )
    ON CONFLICT (id) DO UPDATE SET
        email = 'contact.amdadur@gmail.com',
        full_name = 'Amdadur Rahman (Platform Super Admin)',
        status = 'active';

    INSERT INTO public.user_roles (user_id, role, is_primary)
    VALUES (admin_uid, 'super_admin', true)
    ON CONFLICT (user_id, role) DO UPDATE SET is_primary = true;
END $$;

-- 7. Verified Specialist Doctors with Linked Profiles
DO $$
DECLARE
    doc1_uid UUID := 'f0000001-0000-0000-0000-000000000001';
    doc2_uid UUID := 'f0000001-0000-0000-0000-000000000002';
    doc3_uid UUID := 'f0000001-0000-0000-0000-000000000003';
    doc4_uid UUID := 'f0000001-0000-0000-0000-000000000004';
BEGIN
    -- Auth User 1: Dr. Rahim
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dr.rahim@diagnosticcare.com') THEN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
        VALUES (doc1_uid, '00000000-0000-0000-0000-000000000000', 'dr.rahim@diagnosticcare.com', crypt('Doctor@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Prof. Dr. M. A. Rahim","role":"doctor"}', NOW(), NOW(), 'authenticated', 'authenticated');
    END IF;

    -- Profile 1: Prof. Dr. M. A. Rahim
    INSERT INTO public.profiles (id, phone, email, full_name, language_preference, status, is_email_verified)
    VALUES (doc1_uid, '01711000001', 'dr.rahim@diagnosticcare.com', 'Prof. Dr. M. A. Rahim', 'en', 'active', true)
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

    INSERT INTO public.doctors (
        id, profile_id, bmdc_registration_number, specialization, specialization_bn,
        qualifications, qualifications_bn, designation, institute, experience_years,
        consultation_fee, followup_fee, is_telemedicine_available, is_in_person_available,
        verification_status, rating, total_reviews, status
    ) VALUES (
        doc1_uid, doc1_uid, 'A-48291', 'Cardiology', 'হৃদরোগ ও মেডিসিন বিশেষজ্ঞ',
        'MBBS, FCPS (Medicine), MD (Cardiology)', 'এমবিবিএস, এফসিপিএস (মেডিসিন), এমডি (কার্ডিওলজি)',
        'Professor & Head of Cardiology', 'Sylhet MAG Osmani Medical College', 18,
        1000.00, 500.00, true, true, 'verified', 4.95, 142, 'active'
    ) ON CONFLICT (bmdc_registration_number) DO UPDATE SET
        consultation_fee = EXCLUDED.consultation_fee, followup_fee = EXCLUDED.followup_fee;

    -- Auth User 2: Dr. Farhana
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dr.farhana@diagnosticcare.com') THEN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
        VALUES (doc2_uid, '00000000-0000-0000-0000-000000000000', 'dr.farhana@diagnosticcare.com', crypt('Doctor@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Farhana Ahmed","role":"doctor"}', NOW(), NOW(), 'authenticated', 'authenticated');
    END IF;

    -- Profile 2: Dr. Farhana Ahmed
    INSERT INTO public.profiles (id, phone, email, full_name, language_preference, status, is_email_verified)
    VALUES (doc2_uid, '01711000002', 'dr.farhana@diagnosticcare.com', 'Dr. Farhana Ahmed', 'en', 'active', true)
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

    INSERT INTO public.doctors (
        id, profile_id, bmdc_registration_number, specialization, specialization_bn,
        qualifications, qualifications_bn, designation, institute, experience_years,
        consultation_fee, followup_fee, is_telemedicine_available, is_in_person_available,
        verification_status, rating, total_reviews, status
    ) VALUES (
        doc2_uid, doc2_uid, 'A-59102', 'Gynecology & Obstetrics', 'স্ত্রী ও প্রসূতিরোগ বিশেষজ্ঞ',
        'MBBS, DGO, MCPS (Obs & Gyn)', 'এমবিবিএস, ডিজিও, এমসিপিএস',
        'Associate Professor (Obs & Gyn)', 'Moulvibazar 250 Bed District Hospital', 14,
        800.00, 400.00, true, true, 'verified', 4.90, 118, 'active'
    ) ON CONFLICT (bmdc_registration_number) DO UPDATE SET
        consultation_fee = EXCLUDED.consultation_fee, followup_fee = EXCLUDED.followup_fee;

    -- Auth User 3: Dr. Tariqul
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dr.tariqul@diagnosticcare.com') THEN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
        VALUES (doc3_uid, '00000000-0000-0000-0000-000000000000', 'dr.tariqul@diagnosticcare.com', crypt('Doctor@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Tariqul Islam","role":"doctor"}', NOW(), NOW(), 'authenticated', 'authenticated');
    END IF;

    -- Profile 3: Dr. Tariqul Islam
    INSERT INTO public.profiles (id, phone, email, full_name, language_preference, status, is_email_verified)
    VALUES (doc3_uid, '01711000003', 'dr.tariqul@diagnosticcare.com', 'Dr. Tariqul Islam', 'en', 'active', true)
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

    INSERT INTO public.doctors (
        id, profile_id, bmdc_registration_number, specialization, specialization_bn,
        qualifications, qualifications_bn, designation, institute, experience_years,
        consultation_fee, followup_fee, is_telemedicine_available, is_in_person_available,
        verification_status, rating, total_reviews, status
    ) VALUES (
        doc3_uid, doc3_uid, 'A-37428', 'Pediatrics', 'শিশু ও কিশোর রোগ বিশেষজ্ঞ',
        'MBBS, DCH, MD (Pediatrics)', 'এমবিবিএস, ডিসিএইচ, এমডি (শিশু রোগ)',
        'Senior Consultant, Child Health', 'Sylhet Central Hospital', 12,
        800.00, 400.00, true, true, 'verified', 4.88, 96, 'active'
    ) ON CONFLICT (bmdc_registration_number) DO UPDATE SET
        consultation_fee = EXCLUDED.consultation_fee, followup_fee = EXCLUDED.followup_fee;

    -- Auth User 4: Dr. Shamsul
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dr.shamsul@diagnosticcare.com') THEN
        INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
        VALUES (doc4_uid, '00000000-0000-0000-0000-000000000000', 'dr.shamsul@diagnosticcare.com', crypt('Doctor@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Shamsul Huda","role":"doctor"}', NOW(), NOW(), 'authenticated', 'authenticated');
    END IF;

    -- Profile 4: Dr. Shamsul Huda
    INSERT INTO public.profiles (id, phone, email, full_name, language_preference, status, is_email_verified)
    VALUES (doc4_uid, '01711000004', 'dr.shamsul@diagnosticcare.com', 'Dr. Shamsul Huda', 'en', 'active', true)
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

    INSERT INTO public.doctors (
        id, profile_id, bmdc_registration_number, specialization, specialization_bn,
        qualifications, qualifications_bn, designation, institute, experience_years,
        consultation_fee, followup_fee, is_telemedicine_available, is_in_person_available,
        verification_status, rating, total_reviews, status
    ) VALUES (
        doc4_uid, doc4_uid, 'A-29841', 'Orthopedic Surgery', 'হাড়জোড় ও ট্রমা বিশেষজ্ঞ সার্জন',
        'MBBS, MS (Orthopedics), Fellow Trauma (India)', 'এমবিবিএস, এমএস (অর্থোপেডিকস)',
        'Consultant Orthopedic Surgeon', 'Mount Adora Hospital', 15,
        900.00, 500.00, false, true, 'verified', 4.92, 105, 'active'
    ) ON CONFLICT (bmdc_registration_number) DO UPDATE SET
        consultation_fee = EXCLUDED.consultation_fee, followup_fee = EXCLUDED.followup_fee;
END $$;

-- 8. Core Subscription Plans
INSERT INTO public.subscription_plans (
    id, code, name, name_bn, tier, billing_interval, price_bdt, branch_limit, service_listing_limit, staff_account_limit, has_featured_badge, is_published, sort_order
) VALUES
(
    'da000001-0000-0000-0000-000000000001', 'STARTER_MONTHLY',
    'Starter Healthcare Center Plan', 'স্টার্টার হেলথকেয়ার সেন্টার প্ল্যান',
    'basic', 'monthly', 3499.00, 1, 20, 5, false, true, 1
),
(
    'da000001-0000-0000-0000-000000000002', 'PRO_MONTHLY',
    'Professional Hospital & Diagnostic Plan', 'প্রফেশনাল হাসপাতাল ও ডায়াগনস্টিক প্ল্যান',
    'professional', 'monthly', 7999.00, 3, 50, 25, true, true, 2
),
(
    'da000001-0000-0000-0000-000000000003', 'ENTERPRISE_MONTHLY',
    'Enterprise Multi-Campus Hospital Network', 'এন্টারপ্রাইজ মাল্টি-ক্যাম্পাস হাসপাতাল নেটওয়ার্ক',
    'enterprise', 'monthly', 16999.00, 10, 200, 100, true, true, 3
)
ON CONFLICT (code) DO UPDATE SET price_bdt = EXCLUDED.price_bdt, is_published = true;
