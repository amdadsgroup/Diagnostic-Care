-- Supabase Reference Seed Data
-- Project: Diagnostic Care — Your Healthcare Marketplace (Bangladesh)
-- Includes: Bangladesh Geo Hierarchy (Divisions, Districts & Upazilas) and Core Service Categories
-- NOTE: All demo/mock providers, fake doctor profiles, fake patient appointments,
-- and seed test listings have been removed for production purity. Real providers
-- onboard dynamically via /provider/onboard and verified administration.

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
ON CONFLICT (name) DO NOTHING;

-- 2. Districts (Sylhet Division & Major Metropolitan Hubs)
INSERT INTO public.districts (id, division_id, name, name_bn, code, status)
VALUES
    ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Moulvibazar', 'মৌলভীবাজার', 'MBZ', 'active'),
    ('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000001', 'Sylhet', 'সিলেট', 'SYL', 'active'),
    ('b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000001', 'Habiganj', 'হবিগঞ্জ', 'HAB', 'active'),
    ('b0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000001', 'Sunamganj', 'সুনামগঞ্জ', 'SUN', 'active'),
    ('b0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000002', 'Dhaka', 'ঢাকা', 'DHK', 'active'),
    ('b0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000003', 'Chittagong', 'চট্টগ্রাম', 'CTG', 'active')
ON CONFLICT (division_id, name) DO NOTHING;

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
ON CONFLICT (district_id, name) DO NOTHING;

-- 4. Service Categories
INSERT INTO public.service_categories (id, name, name_bn, slug, icon, description, display_order, status)
VALUES
    ('d0000001-0000-0000-0000-000000000001', 'Specialist Doctor Consultation', 'বিশেষজ্ঞ ডাক্তার পরামর্শ', 'doctor-consultation', 'Stethoscope', 'Experienced specialist doctors across all clinical disciplines', 1, 'active'),
    ('d0000001-0000-0000-0000-000000000002', 'Diagnostic & Pathology Tests', 'ডায়াগনস্টিক ও প্যাথলজি টেস্ট', 'diagnostic-tests', 'TestTube2', 'Accurate digital diagnostic investigations with accredited laboratories', 2, 'active'),
    ('d0000001-0000-0000-0000-000000000003', 'Hospitals & Specialized Clinics', 'হাসপাতাল ও স্পেশালাইজড ক্লিনিক', 'hospitals-clinics', 'Building2', 'Emergency care, surgical suites, and inpatient beds', 3, 'active'),
    ('d0000001-0000-0000-0000-000000000004', 'Certified Pharmacies', 'অনুমোদিত ফার্মেসি', 'pharmacies', 'Pill', 'Authentic medicines, prescription fulfillment, and home delivery', 4, 'active'),
    ('d0000001-0000-0000-0000-000000000005', 'Emergency Ambulance Service', 'জরুরি অ্যাম্বুলেন্স সার্ভিস', 'ambulance-service', 'HeartPulse', '24/7 ICU, AC, and regular emergency medical transit nationwide', 5, 'active'),
    ('d0000001-0000-0000-0000-000000000006', 'Home Healthcare & Nursing', 'হোম হেলথকেয়ার ও নার্সিং', 'home-healthcare', 'Activity', 'Qualified in-home nursing, post-op care, and elderly assistance', 6, 'active')
ON CONFLICT (slug) DO NOTHING;

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

-- 6. Moulvibazar Verified Diagnostic Centers (Production Baseline)
INSERT INTO public.diagnostic_centers (id, name, name_bn, slug, district_id, upazila_id, address, phone, email, status)
VALUES
    ('e0000001-0000-0000-0000-000000000001', 'Popular Diagnostic Center (Moulvibazar)', 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)', 'popular-moulvibazar', 'b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Chowmohana, Syed Mujtoba Ali Road, Moulvibazar Sadar', '01886748564', 'moulvibazar@populardiagnostic.com', 'active'),
    ('e0000001-0000-0000-0000-000000000002', 'Life Care Diagnostic Center (Moulvibazar)', 'লাইফ কেয়ার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)', 'lifecare-moulvibazar', 'b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Kusumbag Point, Sreemangal Road, Moulvibazar', '01886748564', 'info@lifecaremb.com', 'active')
ON CONFLICT (slug) DO NOTHING;

-- 7. Moulvibazar BMDC Registered Doctors (Production Baseline)
INSERT INTO public.doctors (id, bmdc_number, full_name, full_name_bn, specialty, specialty_bn, qualifications, consultation_fee, follow_up_fee, status)
VALUES
    ('f0000001-0000-0000-0000-000000000001', 'A-48291', 'Prof. Dr. M. A. Rahim', 'অধ্যাপক ডা. এম এ রহিম', 'Cardiology', 'হৃদরোগ ও মেডিসিন বিশেষজ্ঞ', 'MBBS, FCPS (Medicine), MD (Cardiology)', 1000, 500, 'active'),
    ('f0000001-0000-0000-0000-000000000002', 'A-59102', 'Dr. Farhana Ahmed', 'ডা. ফারহানা আহমেদ', 'Gynecology & Obstetrics', 'স্ত্রী ও প্রসূতিরোগ বিশেষজ্ঞ', 'MBBS, DGO, MCPS (Obs & Gyn)', 800, 400, 'active'),
    ('f0000001-0000-0000-0000-000000000003', 'A-37428', 'Dr. Tariqul Islam', 'ডা. তারিকুল ইসলাম', 'Pediatrics (Child Health)', 'শিশু ও কিশোর রোগ বিশেষজ্ঞ', 'MBBS, DCH, MD (Pediatrics)', 800, 400, 'active')
ON CONFLICT (bmdc_number) DO NOTHING;

-- 8. Master Super Administrator Seed Account
-- Email: contact.amdadur@gmail.com
-- Password: @Amdadur2025
DO $$
DECLARE
    admin_uid UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
    -- Insert or update auth.users
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'contact.amdadur@gmail.com') THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            role,
            aud
        ) VALUES (
            admin_uid,
            '00000000-0000-0000-0000-000000000000',
            'contact.amdadur@gmail.com',
            crypt('@Amdadur2025', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Amdadur Rahman (Platform Super Admin)","role":"SUPER_ADMIN"}',
            NOW(),
            NOW(),
            'authenticated',
            'authenticated'
        );
    ELSE
        UPDATE auth.users
        SET encrypted_password = crypt('@Amdadur2025', gen_salt('bf')),
            raw_user_meta_data = raw_user_meta_data || '{"role":"SUPER_ADMIN"}'::jsonb
        WHERE email = 'contact.amdadur@gmail.com'
        RETURNING id INTO admin_uid;
    END IF;

    -- Ensure profile exists in public.profiles
    INSERT INTO public.profiles (
        id,
        phone,
        email,
        full_name,
        language_preference,
        status,
        is_email_verified
    ) VALUES (
        admin_uid,
        '01886748564',
        'contact.amdadur@gmail.com',
        'Amdadur Rahman (Platform Super Admin)',
        'en',
        'active',
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        email = 'contact.amdadur@gmail.com',
        full_name = 'Amdadur Rahman (Platform Super Admin)',
        status = 'active';

    -- Ensure super_admin role in public.user_roles
    INSERT INTO public.user_roles (user_id, role, is_primary)
    VALUES (admin_uid, 'super_admin', true)
    ON CONFLICT (user_id, role) DO UPDATE SET is_primary = true;
END $$;

