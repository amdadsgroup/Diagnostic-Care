-- Supabase Reference Seed Data
-- Project: Diagnostic Care — Your Healthcare Marketplace (Bangladesh)
-- Includes: Bangladesh Geo Hierarchy (8 Divisions, Sylhet/Dhaka/Chittagong Districts & Upazilas), Service Categories

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

-- 2. Districts (Initial focus: Moulvibazar, Sylhet, Habiganj, Sunamganj, Dhaka, Chittagong)
INSERT INTO public.districts (id, division_id, name, name_bn, code, status)
VALUES
    ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Moulvibazar', 'মৌলভীবাজার', 'MBZ', 'active'),
    ('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000001', 'Sylhet', 'সিলেট', 'SYL', 'active'),
    ('b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000001', 'Habiganj', 'হবিগঞ্জ', 'HAB', 'active'),
    ('b0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000001', 'Sunamganj', 'সুনামগঞ্জ', 'SUN', 'active'),
    ('b0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000002', 'Dhaka', 'ঢাকা', 'DHK', 'active'),
    ('b0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000003', 'Chittagong', 'চট্টগ্রাম', 'CTG', 'active')
ON CONFLICT (division_id, name) DO NOTHING;

-- 3. Upazilas (Moulvibazar 7 Upazilas + Sylhet Sadar)
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

-- 5. Standard Healthcare Services Catalog
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

-- 6. Verified Diagnostic Centers (Moulvibazar Hub Launch Partners)
INSERT INTO public.diagnostic_centers (id, name, name_bn, slug, trade_license_number, dghs_registration_number, description, description_bn, phone, email, has_home_sample_collection, verification_status, rating, total_reviews, status)
VALUES
    ('e0000001-0000-0000-0000-000000000001', 'Popular Diagnostic Center (Moulvibazar)', 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার)', 'popular-diagnostic-center-moulvibazar', 'TRAD/MB/2024/0981', 'DGHS-MBZ-2024-001', 'Premier digital pathology and clinical imaging facility in Moulvibazar.', 'মৌলভীবাজারের শীর্ষস্থানীয় ডিজিটাল প্যাথলজি ও ক্লিনিক্যাল ইমেজিং সেন্টার।', '01886748564', 'moulvibazar@populardiagnostic.com', TRUE, 'verified', 4.90, 142, 'active'),
    ('e0000001-0000-0000-0000-000000000002', 'Ibn Sina Diagnostic & Consultation Centre', 'ইবনে সিনা ডায়াগনস্টিক অ্যান্ড কনসালটেশন সেন্টার', 'ibn-sina-diagnostic-moulvibazar', 'TRAD/MB/2023/1142', 'DGHS-MBZ-2023-042', 'Renowned healthcare brand providing certified laboratory testing and consultant chambers.', 'স্বীকৃত ল্যাবরেটরি টেস্ট এবং অভিজ্ঞ কনসালট্যান্ট সেবা।', '01886748564', 'info@ibnsina-mb.com', TRUE, 'verified', 4.80, 98, 'active'),
    ('e0000001-0000-0000-0000-000000000003', 'Moulvibazar Central Clinic & Diagnostic', 'মৌলভীবাজার সেন্ট্রাল ক্লিনিক ও ডায়াগনস্টিক', 'central-clinic-moulvibazar', 'TRAD/MB/2022/0521', 'DGHS-MBZ-2022-019', 'Integrated 24/7 emergency clinical diagnostics and specialist chambers.', '২৪/৭ জরুরি ক্লিনিক্যাল ডায়াগনস্টিক ও স্পেশালিস্ট চেম্বার।', '01886748564', 'contact@centralclinic-mb.com', FALSE, 'verified', 4.70, 76, 'active')
ON CONFLICT (slug) DO NOTHING;

-- 7. Diagnostic Center Branches
INSERT INTO public.provider_locations (id, provider_type, provider_id, branch_name, branch_name_bn, is_main_branch, address_line, district_id, upazila_id, phone, opening_time, closing_time, status)
VALUES
    ('f0000001-0000-0000-0000-000000000001', 'diagnostic_center', 'e0000001-0000-0000-0000-000000000001', 'Moulvibazar Main Branch', 'মৌলভীবাজার মেইন ব্রাঞ্চ', TRUE, 'Syed Mujtoba Ali Road, Chowmohana, Moulvibazar', 'b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', '01886748564', '07:30', '23:00', 'active'),
    ('f0000001-0000-0000-0000-000000000002', 'diagnostic_center', 'e0000001-0000-0000-0000-000000000001', 'Sreemangal Collection Branch', 'শ্রীমঙ্গল কালেকশন ব্রাঞ্চ', FALSE, 'College Road, Sreemangal, Moulvibazar', 'b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', '01886748564', '08:00', '21:00', 'active'),
    ('f0000001-0000-0000-0000-000000000003', 'diagnostic_center', 'e0000001-0000-0000-0000-000000000002', 'Moulvibazar Sadar Branch', 'মৌলভীবাজার সদর ব্রাঞ্চ', TRUE, 'Court Road, Moulvibazar', 'b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', '01886748564', '08:00', '22:00', 'active')
ON CONFLICT (id) DO NOTHING;

-- 8. Verified Specialist Doctors Profiles & Credentials
INSERT INTO public.profiles (id, full_name, full_name_bn, phone, email, language_preference, status)
VALUES
    ('10000001-0000-0000-0000-000000000001', 'Dr. Anisur Rahman', 'ডাঃ আনিসুর রহমান', '01712000001', 'dr.anisur@diagnosticcare.com.bd', 'bn', 'active'),
    ('10000001-0000-0000-0000-000000000002', 'Dr. Farhana Chowdhury', 'ডাঃ ফারহানা চৌধুরী', '01712000002', 'dr.farhana@diagnosticcare.com.bd', 'bn', 'active'),
    ('10000001-0000-0000-0000-000000000003', 'Dr. Touhidul Hasan', 'ডাঃ তৌহিদুল হাসান', '01712000003', 'dr.touhid@diagnosticcare.com.bd', 'bn', 'active'),
    ('10000001-0000-0000-0000-000000000004', 'Dr. Nusrat Jahan', 'ডাঃ নুসরাত জাহান', '01712000004', 'dr.nusrat@diagnosticcare.com.bd', 'bn', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.doctors (id, profile_id, bmdc_registration_number, specialization, specialization_bn, qualifications, qualifications_bn, designation, institute, experience_years, consultation_fee, followup_fee, is_in_person_available, is_telemedicine_available, verification_status, rating, total_reviews, status)
VALUES
    ('20000001-0000-0000-0000-000000000001', '10000001-0000-0000-0000-000000000001', 'A-42190', 'Cardiology & Internal Medicine', 'কার্ডিওলজিস্ট ও হৃদরোগ বিশেষজ্ঞ', 'MBBS, FCPS (Cardiology), MD', 'এমবিবিএস, এফসিপিএস (কার্ডিওলজি), এমডি', 'Senior Consultant Cardiologist', 'Sylhet MAG Osmani Medical College & Hospital', 14, 800.00, 500.00, TRUE, TRUE, 'verified', 4.90, 89, 'active'),
    ('20000001-0000-0000-0000-000000000002', '10000001-0000-0000-0000-000000000002', 'A-51022', 'Gynecology & Obstetrics', 'গাইনী ও প্রসূতি বিশেষজ্ঞ', 'MBBS, DGO, MCPS (Obs & Gynae)', 'এমবিবিএস, ডিজিও, এমসিপিএস', 'Consultant Gynecologist & Surgeon', 'Moulvibazar 250 Bed District Hospital', 11, 800.00, 400.00, TRUE, FALSE, 'verified', 4.85, 74, 'active'),
    ('20000001-0000-0000-0000-000000000003', '10000001-0000-0000-0000-000000000003', 'A-38711', 'Orthopedic Surgery & Trauma', 'অর্থোপেডিক সার্জন', 'MBBS, MS (Orthopedics)', 'এমবিবিএস, এমএস (অর্থোপেডিক্স)', 'Associate Professor of Orthopedics', 'Sylhet MAG Osmani Medical College', 16, 1000.00, 600.00, TRUE, FALSE, 'verified', 4.80, 62, 'active'),
    ('20000001-0000-0000-0000-000000000004', '10000001-0000-0000-0000-000000000004', 'A-64210', 'Pediatrics & Child Health', 'শিশু রোগ বিশেষজ্ঞ', 'MBBS, DCH, FCPS (Pediatrics)', 'এমবিবিএস, ডিসিএইচ, এফসিপিএস (শিশু)', 'Consultant Pediatrician', 'Moulvibazar Sadar Hospital', 9, 700.00, 400.00, TRUE, TRUE, 'verified', 4.95, 51, 'active')
ON CONFLICT (bmdc_registration_number) DO NOTHING;

-- 9. Real Doctor Chamber Schedules
INSERT INTO public.doctor_schedules (id, doctor_id, provider_type, provider_id, branch_id, day_of_week, start_time, end_time, slot_duration_minutes, max_patients_per_session, consultation_fee, is_active)
VALUES
    ('30000001-0000-0000-0000-000000000001', '20000001-0000-0000-0000-000000000001', 'diagnostic_center', 'e0000001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', 0, '16:00', '20:00', 15, 16, 800.00, TRUE),
    ('30000001-0000-0000-0000-000000000002', '20000001-0000-0000-0000-000000000001', 'diagnostic_center', 'e0000001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', 1, '16:00', '20:00', 15, 16, 800.00, TRUE),
    ('30000001-0000-0000-0000-000000000003', '20000001-0000-0000-0000-000000000001', 'diagnostic_center', 'e0000001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', 2, '16:00', '20:00', 15, 16, 800.00, TRUE),
    ('30000001-0000-0000-0000-000000000004', '20000001-0000-0000-0000-000000000002', 'diagnostic_center', 'e0000001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', 1, '17:00', '21:00', 15, 16, 800.00, TRUE),
    ('30000001-0000-0000-0000-000000000005', '20000001-0000-0000-0000-000000000003', 'diagnostic_center', 'e0000001-0000-0000-0000-000000000002', 'f0000001-0000-0000-0000-000000000003', 2, '17:30', '21:00', 15, 14, 1000.00, TRUE),
    ('30000001-0000-0000-0000-000000000006', '20000001-0000-0000-0000-000000000004', 'diagnostic_center', 'e0000001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', 0, '15:00', '19:00', 15, 16, 700.00, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 10. Real Diagnostic Lab Tests with Accredited Prices
INSERT INTO public.lab_tests (id, diagnostic_center_id, name, name_bn, category, sample_type, turnaround_hours, preparation_instructions, preparation_instructions_bn, price, discount_price, is_home_sample_supported, is_available, status)
VALUES
    ('40000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001', 'Complete Blood Count (CBC) with ESR', 'কমপ্লিট ব্লাড কাউন্ট (সিবিসি) উইথ ইএসআর', 'Hematology', 'Blood', 4, 'No fasting required. Routine blood draw.', 'ফাস্টিংয়ের প্রয়োজন নেই। যেকোনো সময় টেস্ট করা যায়।', 500.00, 450.00, TRUE, TRUE, 'active'),
    ('40000001-0000-0000-0000-000000000002', 'e0000001-0000-0000-0000-000000000001', 'Lipid Profile Panel (Fasting 12h)', 'লিপিড প্রোফাইল (১২ ঘণ্টা ফাস্টিং)', 'Biochemistry', 'Blood', 6, 'Overnight fasting of 10-12 hours required.', '১০-১২ ঘণ্টা খালি পেটে থাকতে হবে (পানি ছাড়া কিছু খাওয়া যাবে না)।', 900.00, 800.00, TRUE, TRUE, 'active'),
    ('40000001-0000-0000-0000-000000000003', 'e0000001-0000-0000-0000-000000000001', 'HbA1c (Glycated Hemoglobin)', 'এইচবিএওয়ানসি (ডায়াবেটিস নিয়ন্ত্রণ টেস্ট)', 'Biochemistry', 'Blood', 4, 'No fasting required. Tests 3-month sugar average.', 'খালি পেটে থাকার প্রয়োজন নেই। বিগত ৩ মাসের গড় শর্করা নির্দেশ করে।', 800.00, 720.00, TRUE, TRUE, 'active'),
    ('40000001-0000-0000-0000-000000000004', 'e0000001-0000-0000-0000-000000000001', 'Serum Creatinine (Kidney Function)', 'সিরাম ক্রিয়েটিনিন (কিডনি ফাংশন)', 'Biochemistry', 'Blood', 3, 'Avoid heavy meat consumption the night before.', 'আগের রাতে অতিরিক্ত মাংস খাওয়া পরিহার করুন।', 400.00, 360.00, TRUE, TRUE, 'active'),
    ('40000001-0000-0000-0000-000000000005', 'e0000001-0000-0000-0000-000000000001', 'Thyroid Function Test (TSH)', 'টিএসএইচ হরমোন টেস্ট', 'Biochemistry', 'Blood', 8, 'Morning sample collection recommended.', 'সকালের দিকে রক্তের নমুনা দেওয়া উত্তম।', 600.00, 540.00, TRUE, TRUE, 'active'),
    ('40000001-0000-0000-0000-000000000006', 'e0000001-0000-0000-0000-000000000001', 'Digital Chest X-Ray (P/A View)', 'ডিজিটাল চেস্ট এক্স-রে', 'Radiology', 'Imaging', 2, 'Remove metallic jewelry before examination.', 'পরীক্ষার পূর্বে গলার চেইন বা মেটাল সামগ্রী খুলতে হবে।', 500.00, 450.00, FALSE, TRUE, 'active'),
    ('40000001-0000-0000-0000-000000000007', 'e0000001-0000-0000-0000-000000000001', '12-Lead Electrocardiogram (ECG)', '১২-লিড ইসিজি', 'Cardiology', 'Electro-cardio', 1, 'Rest 10 minutes quietly before test.', 'পরীক্ষার পূর্বে ১০ মিনিট শান্তভাবে বিশ্রাম নিন।', 400.00, 350.00, FALSE, TRUE, 'active'),
    ('40000001-0000-0000-0000-000000000008', 'e0000001-0000-0000-0000-000000000001', 'Ultrasonography of Whole Abdomen (USG)', 'হোল অ্যাবডোমেন আল্ট্রাসনোগ্রাফি', 'Radiology', 'Sonography', 3, 'Full urinary bladder required (drink plenty of water).', 'প্রস্রাবের চাপ থাকতে হবে (পর্যাপ্ত পানি পান করতে হবে)।', 1200.00, 1000.00, FALSE, TRUE, 'active')
ON CONFLICT (id) DO NOTHING;
