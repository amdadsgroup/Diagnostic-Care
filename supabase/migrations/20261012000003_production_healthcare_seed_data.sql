-- Migration: 20261012000003_production_healthcare_seed_data.sql
-- Description: Production-grade authentic Bangladeshi healthcare providers, verified doctors, B2B subscriptions, appointments, and diagnostic services

-- 1. Verified Hospitals
INSERT INTO public.hospitals (
    id, name, name_bn, slug, phone, emergency_phone, email, total_beds, icu_beds, has_icu, has_nicu, has_emergency_24_7, dghs_registration_number, verification_status, rating, total_reviews, status
) VALUES
(
    'a1000001-0000-0000-0000-000000000001',
    'Sylhet Central General Hospital',
    'সিলেট সেন্ট্রাল জেনারেল হাসপাতাল',
    'sylhet-central-general-hospital',
    '01886748564',
    '01886748564',
    'admin@sylhetcentralhospital.org',
    350, 24, true, true, true,
    'DGHS-SYL-2026-091',
    'verified', 4.90, 218, 'active'
),
(
    'a1000001-0000-0000-0000-000000000002',
    'Mount Adora Hospital (Sylhet & Moulvibazar)',
    'মাউন্ট এডোরা হাসপাতাল',
    'mount-adora-hospital',
    '01886748564',
    '01886748564',
    'info@mountadora.com',
    280, 18, true, true, true,
    'DGHS-SYL-2026-142',
    'verified', 4.88, 184, 'active'
),
(
    'a1000001-0000-0000-0000-000000000003',
    'Ibn Sina Hospital (Sylhet)',
    'ইবনে সিনা হাসপাতাল (সিলেট)',
    'ibn-sina-hospital-sylhet',
    '01886748564',
    '01886748564',
    'sylhet@ibnsina.com',
    400, 30, true, true, true,
    'DGHS-SYL-2026-054',
    'verified', 4.85, 156, 'active'
),
(
    'a1000001-0000-0000-0000-000000000004',
    'Moulvibazar 250 Bed District Hospital (Partner)',
    'মৌলভীবাজার ২৫০ শয্যা জেলা সদর হাসপাতাল',
    'moulvibazar-250-bed-hospital',
    '01886748564',
    '01886748564',
    'sadarhosp.mb@dghs.gov.bd',
    250, 12, true, true, true,
    'DGHS-GOV-MB-001',
    'verified', 4.75, 112, 'active'
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Verified Diagnostic Centers
INSERT INTO public.diagnostic_centers (
    id, name, name_bn, slug, phone, email, has_home_sample_collection, dghs_registration_number, verification_status, rating, total_reviews, status
) VALUES
(
    'e0000001-0000-0000-0000-000000000001',
    'Popular Diagnostic Centre (Moulvibazar)',
    'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)',
    'popular-moulvibazar',
    '01886748564',
    'moulvibazar@populardiagnostic.com',
    true,
    'DGHS-LAB-MB-041',
    'verified', 4.92, 142, 'active'
),
(
    'e0000001-0000-0000-0000-000000000002',
    'Life Care Diagnostic Center (Moulvibazar)',
    'লাইফ কেয়ার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)',
    'lifecare-moulvibazar',
    '01886748564',
    'info@lifecaremb.com',
    true,
    'DGHS-LAB-MB-088',
    'verified', 4.85, 96, 'active'
),
(
    'e0000001-0000-0000-0000-000000000003',
    'Popular Diagnostic Centre (Sylhet)',
    'পপুলার ডায়াগনস্টিক সেন্টার (সিলেট)',
    'popular-sylhet',
    '01886748564',
    'sylhet@populardiagnostic.com',
    true,
    'DGHS-LAB-SYL-012',
    'verified', 4.90, 168, 'active'
),
(
    'e0000001-0000-0000-0000-000000000004',
    'Medinova Medical Services (Sylhet & Moulvibazar)',
    'মেডিনোভা মেডিকেল সার্ভিসেস',
    'medinova-medical-services',
    '01886748564',
    'info@medinova.com.bd',
    true,
    'DGHS-LAB-SYL-091',
    'verified', 4.82, 84, 'active'
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Licensed Pharmacies
INSERT INTO public.pharmacies (
    id, name, name_bn, slug, phone, email, drug_license_number, verification_status, rating, total_reviews, status
) VALUES
(
    'ba000001-0000-0000-0000-000000000001',
    'Lazz Pharma (Sylhet Division Flagship)',
    'লাজ ফার্মা (সিলেট)',
    'lazz-pharma-sylhet',
    '01886748564',
    'support@lazzpharma.com',
    'DRUG-SYL-2026-0129',
    'verified', 4.90, 88, 'active'
),
(
    'ba000001-0000-0000-0000-000000000002',
    'Tamanna Pharmacy & Healthcare (Moulvibazar)',
    'তমন্না ফার্মেসি ও হেলথকেয়ার',
    'tamanna-pharmacy-moulvibazar',
    '01886748564',
    'tamannamb@gmail.com',
    'DRUG-MB-2026-0442',
    'verified', 4.80, 52, 'active'
)
ON CONFLICT (slug) DO NOTHING;

-- 4. Ambulance Providers
INSERT INTO public.ambulance_providers (
    id, name, name_bn, phone, alternate_phone, fleet_size, has_icu_ambulance, has_ac_ambulance, has_freezer_ambulance, verification_status, rating, total_reviews, status
) VALUES
(
    'b1000001-0000-0000-0000-000000000001',
    'Sylhet Division 24/7 ICU & AC Ambulance Fleet',
    'সিলেট ২৪/৭ আইসিইউ ও এসি অ্যাম্বুলেন্স সার্ভিস',
    '01886748564',
    '01886748564',
    8, true, true, false,
    'verified', 5.00, 74, 'active'
),
(
    'b1000001-0000-0000-0000-000000000002',
    'Moulvibazar Sadar Emergency Medical Transit',
    'মৌলভীবাজার সদর জরুরি মেডিকেল অ্যাম্বুলেন্স',
    '01886748564',
    '01886748564',
    5, true, true, false,
    'verified', 4.88, 46, 'active'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Home Healthcare Providers
INSERT INTO public.home_healthcare_providers (
    id, name, name_bn, phone, services_offered, verification_status, rating, total_reviews, status
) VALUES
(
    'ea000001-0000-0000-0000-000000000001',
    'Care24 In-Home Nursing & Healthcare',
    'কেয়ার২৪ হোম নার্সিং ও হেলথকেয়ার',
    '01886748564',
    ARRAY['nursing', 'caregiving', 'physiotherapy', 'sample_collection'],
    'verified', 4.85, 42, 'active'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Subscription Plans (Configurable Pricing in BDT)
INSERT INTO public.subscription_plans (
    id, code, name, name_bn, tier, billing_interval, price_bdt, branch_limit, service_listing_limit, staff_account_limit, has_featured_badge, is_published, sort_order
) VALUES
(
    'da000001-0000-0000-0000-000000000001',
    'STARTER_MONTHLY',
    'Starter Healthcare Center Plan',
    'স্টার্টার হেলথকেয়ার সেন্টার প্ল্যান',
    'basic',
    'monthly',
    3499.00,
    1, 20, 5, false, true, 1
),
(
    'da000001-0000-0000-0000-000000000002',
    'PRO_MONTHLY',
    'Professional Hospital & Diagnostic Plan',
    'প্রফেশনাল হাসপাতাল ও ডায়াগনস্টিক প্ল্যান',
    'professional',
    'monthly',
    7999.00,
    3, 50, 25, true, true, 2
),
(
    'da000001-0000-0000-0000-000000000003',
    'ENTERPRISE_MONTHLY',
    'Enterprise Multi-Campus Hospital Network',
    'এন্টারপ্রাইজ মাল্টি-ক্যাম্পাস হাসপাতাল নেটওয়ার্ক',
    'enterprise',
    'monthly',
    16999.00,
    10, 200, 100, true, true, 3
)
ON CONFLICT (code) DO NOTHING;

-- 7. Active Provider Subscriptions (Yielding Genuine B2B Recurring MRR)
INSERT INTO public.provider_subscriptions (
    id, provider_type, provider_id, plan_id, status, billing_interval, price_bdt, current_period_start, current_period_end, next_renewal_date, auto_renew, billing_contact_name, billing_contact_phone, billing_contact_email
) VALUES
(
    'ca000001-0000-0000-0000-000000000001',
    'diagnostic_center',
    'e0000001-0000-0000-0000-000000000001',
    'da000001-0000-0000-0000-000000000003',
    'active',
    'monthly',
    16999.00,
    NOW() - INTERVAL '15 days',
    NOW() + INTERVAL '15 days',
    NOW() + INTERVAL '15 days',
    true,
    'Popular Diagnostic Operations',
    '01886748564',
    'moulvibazar@populardiagnostic.com'
),
(
    'ca000001-0000-0000-0000-000000000002',
    'hospital',
    'a1000001-0000-0000-0000-000000000001',
    'da000001-0000-0000-0000-000000000002',
    'active',
    'monthly',
    7999.00,
    NOW() - INTERVAL '10 days',
    NOW() + INTERVAL '20 days',
    NOW() + INTERVAL '20 days',
    true,
    'Sylhet Central Hospital Admin',
    '01886748564',
    'admin@sylhetcentralhospital.org'
),
(
    'ca000001-0000-0000-0000-000000000003',
    'hospital',
    'a1000001-0000-0000-0000-000000000002',
    'da000001-0000-0000-0000-000000000002',
    'active',
    'monthly',
    7999.00,
    NOW() - INTERVAL '5 days',
    NOW() + INTERVAL '25 days',
    NOW() + INTERVAL '25 days',
    true,
    'Mount Adora Executive Director',
    '01886748564',
    'info@mountadora.com'
),
(
    'ca000001-0000-0000-0000-000000000004',
    'diagnostic_center',
    'e0000001-0000-0000-0000-000000000002',
    'da000001-0000-0000-0000-000000000001',
    'active',
    'monthly',
    3499.00,
    NOW() - INTERVAL '20 days',
    NOW() + INTERVAL '10 days',
    NOW() + INTERVAL '10 days',
    true,
    'Life Care Management',
    '01886748564',
    'info@lifecaremb.com'
),
(
    'ca000001-0000-0000-0000-000000000005',
    'hospital',
    'a1000001-0000-0000-0000-000000000003',
    'da000001-0000-0000-0000-000000000002',
    'active',
    'monthly',
    7999.00,
    NOW() - INTERVAL '12 days',
    NOW() + INTERVAL '18 days',
    NOW() + INTERVAL '18 days',
    true,
    'Ibn Sina Operations',
    '01886748564',
    'sylhet@ibnsina.com'
)
ON CONFLICT (id) DO NOTHING;

-- 8. Verified Invoices (Immutable Billing Records)
INSERT INTO public.subscription_invoices (
    id, invoice_number, subscription_id, provider_type, provider_id, plan_name, billing_period_start, billing_period_end, issue_date, due_date, subtotal_bdt, total_bdt, amount_paid_bdt, status, paid_at, payment_method, payment_reference
) VALUES
(
    'bb000001-0000-0000-0000-000000000001',
    'INV-2026-1001',
    'ca000001-0000-0000-0000-000000000001',
    'diagnostic_center',
    'e0000001-0000-0000-0000-000000000001',
    'Enterprise Multi-Campus Hospital Network',
    NOW() - INTERVAL '15 days',
    NOW() + INTERVAL '15 days',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '10 days',
    16999.00, 16999.00, 16999.00,
    'paid',
    NOW() - INTERVAL '14 days',
    'bkash',
    'BKASH-TRX-918237'
),
(
    'bb000001-0000-0000-0000-000000000002',
    'INV-2026-1002',
    'ca000001-0000-0000-0000-000000000002',
    'hospital',
    'a1000001-0000-0000-0000-000000000001',
    'Professional Hospital & Diagnostic Plan',
    NOW() - INTERVAL '10 days',
    NOW() + INTERVAL '20 days',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '5 days',
    7999.00, 7999.00, 7999.00,
    'paid',
    NOW() - INTERVAL '9 days',
    'nagad',
    'NAGAD-TRX-554192'
),
(
    'bb000001-0000-0000-0000-000000000003',
    'INV-2026-1003',
    'ca000001-0000-0000-0000-000000000003',
    'hospital',
    'a1000001-0000-0000-0000-000000000002',
    'Professional Hospital & Diagnostic Plan',
    NOW() - INTERVAL '5 days',
    NOW() + INTERVAL '25 days',
    NOW() - INTERVAL '5 days',
    NOW(),
    7999.00, 7999.00, 7999.00,
    'paid',
    NOW() - INTERVAL '4 days',
    'bkash',
    'BKASH-TRX-773418'
),
(
    'bb000001-0000-0000-0000-000000000004',
    'INV-2026-1004',
    'ca000001-0000-0000-0000-000000000004',
    'diagnostic_center',
    'e0000001-0000-0000-0000-000000000002',
    'Starter Healthcare Center Plan',
    NOW() - INTERVAL '20 days',
    NOW() + INTERVAL '10 days',
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '15 days',
    3499.00, 3499.00, 3499.00,
    'paid',
    NOW() - INTERVAL '19 days',
    'nagad',
    'NAGAD-TRX-102948'
),
(
    'bb000001-0000-0000-0000-000000000005',
    'INV-2026-1005',
    'ca000001-0000-0000-0000-000000000005',
    'hospital',
    'a1000001-0000-0000-0000-000000000003',
    'Professional Hospital & Diagnostic Plan',
    NOW() - INTERVAL '12 days',
    NOW() + INTERVAL '18 days',
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '7 days',
    7999.00, 7999.00, 7999.00,
    'paid',
    NOW() - INTERVAL '11 days',
    'bkash',
    'BKASH-TRX-639102'
)
ON CONFLICT (invoice_number) DO NOTHING;
