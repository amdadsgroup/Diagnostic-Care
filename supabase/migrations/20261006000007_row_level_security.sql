-- Migration: 20261006000007_row_level_security.sql
-- Description: Complete Row Level Security (RLS) policies for all application tables

-- Helper function to check if user has admin/super_admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
          AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check patient ownership
CREATE OR REPLACE FUNCTION public.get_patient_id()
RETURNS UUID AS $$
DECLARE
    v_patient_id UUID;
BEGIN
    SELECT id INTO v_patient_id FROM public.patients WHERE profile_id = auth.uid();
    RETURN v_patient_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check doctor ownership
CREATE OR REPLACE FUNCTION public.get_doctor_id()
RETURNS UUID AS $$
DECLARE
    v_doctor_id UUID;
BEGIN
    SELECT id INTO v_doctor_id FROM public.doctors WHERE profile_id = auth.uid();
    RETURN v_doctor_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Enable RLS on Geographic & Reference Tables (Public Read-Only)
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Divisions are viewable by everyone" ON public.divisions FOR SELECT USING (true);
CREATE POLICY "Admins can manage divisions" ON public.divisions FOR ALL USING (public.is_admin());

ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Districts are viewable by everyone" ON public.districts FOR SELECT USING (true);
CREATE POLICY "Admins can manage districts" ON public.districts FOR ALL USING (public.is_admin());

ALTER TABLE public.upazilas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Upazilas are viewable by everyone" ON public.upazilas FOR SELECT USING (true);
CREATE POLICY "Admins can manage upazilas" ON public.upazilas FOR ALL USING (public.is_admin());

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cities are viewable by everyone" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Admins can manage cities" ON public.cities FOR ALL USING (public.is_admin());

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Locations are viewable by everyone" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Admins can manage locations" ON public.locations FOR ALL USING (public.is_admin());

ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.service_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.service_categories FOR ALL USING (public.is_admin());

ALTER TABLE public.healthcare_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are viewable by everyone" ON public.healthcare_services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON public.healthcare_services FOR ALL USING (public.is_admin());

-- 2. Profiles & Roles Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by owners and admins" ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE
    USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Only admins can assign or modify roles" ON public.user_roles FOR ALL
    USING (public.is_admin());

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own preferences" ON public.user_preferences FOR ALL
    USING (auth.uid() = user_id);

ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own privacy settings" ON public.privacy_settings FOR ALL
    USING (auth.uid() = user_id);

ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view and record their consents" ON public.consents FOR ALL
    USING (auth.uid() = user_id);

ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their emergency contacts" ON public.emergency_contacts FOR ALL
    USING (auth.uid() = user_id);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their addresses" ON public.addresses FOR ALL
    USING (auth.uid() = user_id);

-- 3. Healthcare Provider Public Discovery vs Management
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active doctors are viewable by everyone" ON public.doctors FOR SELECT
    USING (status = 'active');
CREATE POLICY "Doctors can update their own profile" ON public.doctors FOR UPDATE
    USING (auth.uid() = profile_id OR public.is_admin());
CREATE POLICY "Admins can insert/delete doctors" ON public.doctors FOR ALL
    USING (public.is_admin());

ALTER TABLE public.diagnostic_centers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active diagnostic centers are viewable by everyone" ON public.diagnostic_centers FOR SELECT
    USING (status = 'active');
CREATE POLICY "Owners can update diagnostic centers" ON public.diagnostic_centers FOR UPDATE
    USING (auth.uid() = owner_profile_id OR public.is_admin());
CREATE POLICY "Admins and providers can register diagnostic centers" ON public.diagnostic_centers FOR INSERT
    WITH CHECK (auth.uid() = owner_profile_id OR public.is_admin());

ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clinics are viewable by everyone" ON public.clinics FOR SELECT
    USING (status = 'active');
CREATE POLICY "Owners can manage clinics" ON public.clinics FOR ALL
    USING (auth.uid() = owner_profile_id OR public.is_admin());

ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hospitals are viewable by everyone" ON public.hospitals FOR SELECT
    USING (status = 'active');
CREATE POLICY "Owners can manage hospitals" ON public.hospitals FOR ALL
    USING (auth.uid() = owner_profile_id OR public.is_admin());

ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pharmacies are viewable by everyone" ON public.pharmacies FOR SELECT
    USING (status = 'active');
CREATE POLICY "Owners can manage pharmacies" ON public.pharmacies FOR ALL
    USING (auth.uid() = owner_profile_id OR public.is_admin());

ALTER TABLE public.ambulance_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ambulance providers are viewable by everyone" ON public.ambulance_providers FOR SELECT
    USING (status = 'active');
CREATE POLICY "Owners can manage ambulance providers" ON public.ambulance_providers FOR ALL
    USING (auth.uid() = owner_profile_id OR public.is_admin());

ALTER TABLE public.home_healthcare_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Home care providers are viewable by everyone" ON public.home_healthcare_providers FOR SELECT
    USING (status = 'active');
CREATE POLICY "Owners can manage home care providers" ON public.home_healthcare_providers FOR ALL
    USING (auth.uid() = owner_profile_id OR public.is_admin());

ALTER TABLE public.provider_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Provider locations viewable by everyone" ON public.provider_locations FOR SELECT
    USING (status = 'active');
CREATE POLICY "Admins or providers can manage locations" ON public.provider_locations FOR ALL
    USING (auth.role() = 'authenticated');

ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Provider services viewable by everyone" ON public.provider_services FOR SELECT
    USING (is_available = true);
CREATE POLICY "Authenticated providers manage services" ON public.provider_services FOR ALL
    USING (auth.role() = 'authenticated');

-- 4. Provider Documents & Verification (Strict privacy)
ALTER TABLE public.provider_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only document uploader and admins can view documents" ON public.provider_documents FOR SELECT
    USING (auth.uid() = uploaded_by OR public.is_admin());
CREATE POLICY "Authenticated users can upload provider documents" ON public.provider_documents FOR INSERT
    WITH CHECK (auth.uid() = uploaded_by OR public.is_admin());

ALTER TABLE public.provider_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins and providers can view verifications" ON public.provider_verifications FOR SELECT
    USING (auth.role() = 'authenticated');
CREATE POLICY "Only admins can approve/reject verifications" ON public.provider_verifications FOR UPDATE
    USING (public.is_admin());

-- 5. Doctor Schedules & Availability
ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctor schedules viewable by public" ON public.doctor_schedules FOR SELECT
    USING (is_active = true);
CREATE POLICY "Doctors and staff can manage schedules" ON public.doctor_schedules FOR ALL
    USING (doctor_id = public.get_doctor_id() OR public.is_admin());

ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctor availability viewable by public" ON public.doctor_availability FOR SELECT
    USING (true);
CREATE POLICY "Doctors and assistants manage availability" ON public.doctor_availability FOR ALL
    USING (doctor_id = public.get_doctor_id() OR public.is_admin());

-- 6. Appointments & Medical Privacy
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients view their own patient profile" ON public.patients FOR SELECT
    USING (auth.uid() = profile_id OR public.is_admin());
CREATE POLICY "Patients update their own patient profile" ON public.patients FOR UPDATE
    USING (auth.uid() = profile_id);

ALTER TABLE public.patients_medical_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Medical profile viewable by patient and admin" ON public.patients_medical_profiles FOR SELECT
    USING (patient_id = public.get_patient_id() OR public.is_admin());
CREATE POLICY "Patients manage their medical profile" ON public.patients_medical_profiles FOR ALL
    USING (patient_id = public.get_patient_id() OR public.is_admin());

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients view their own appointments" ON public.appointments FOR SELECT
    USING (patient_id = public.get_patient_id() OR doctor_id = public.get_doctor_id() OR public.is_admin());
CREATE POLICY "Patients and doctors can create appointments" ON public.appointments FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Patients and doctors can update appointment status" ON public.appointments FOR UPDATE
    USING (patient_id = public.get_patient_id() OR doctor_id = public.get_doctor_id() OR public.is_admin());

ALTER TABLE public.appointment_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Appointment status history viewable by participants" ON public.appointment_status_history FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.appointments a
        WHERE a.id = appointment_status_history.appointment_id
          AND (a.patient_id = public.get_patient_id() OR a.doctor_id = public.get_doctor_id() OR public.is_admin())
    ));

ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Medical records viewable strictly by patient" ON public.medical_records FOR SELECT
    USING (patient_id = public.get_patient_id() OR public.is_admin());
CREATE POLICY "Medical records insertable by patient or admin" ON public.medical_records FOR INSERT
    WITH CHECK (patient_id = public.get_patient_id() OR public.is_admin());

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Prescriptions viewable by patient and prescribing doctor" ON public.prescriptions FOR SELECT
    USING (patient_id = public.get_patient_id() OR doctor_id = public.get_doctor_id() OR public.is_admin());
CREATE POLICY "Prescriptions created by prescribing doctor" ON public.prescriptions FOR INSERT
    WITH CHECK (doctor_id = public.get_doctor_id() OR public.is_admin());

ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Prescription items viewable by patient and prescribing doctor" ON public.prescription_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.prescriptions p
        WHERE p.id = prescription_items.prescription_id
          AND (p.patient_id = public.get_patient_id() OR p.doctor_id = public.get_doctor_id() OR public.is_admin())
    ));

-- 7. Diagnostic Tests & Bookings
ALTER TABLE public.lab_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lab tests viewable by everyone" ON public.lab_tests FOR SELECT
    USING (is_available = true);
CREATE POLICY "Diagnostic centers manage lab tests" ON public.lab_tests FOR ALL
    USING (auth.role() = 'authenticated');

ALTER TABLE public.lab_test_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lab test packages viewable by everyone" ON public.lab_test_packages FOR SELECT
    USING (status = 'active');

ALTER TABLE public.diagnostic_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Diagnostic bookings viewable by patient and center" ON public.diagnostic_bookings FOR SELECT
    USING (patient_id = public.get_patient_id() OR public.is_admin());
CREATE POLICY "Patients create diagnostic bookings" ON public.diagnostic_bookings FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reports viewable strictly by patient and issuing center" ON public.reports FOR SELECT
    USING (patient_id = public.get_patient_id() OR public.is_admin());

-- 8. Pharmacy, Ambulance, Homecare
ALTER TABLE public.pharmacy_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pharmacy products viewable by everyone" ON public.pharmacy_products FOR SELECT
    USING (status = 'active');

ALTER TABLE public.pharmacy_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders viewable by patient and pharmacy" ON public.pharmacy_orders FOR SELECT
    USING (patient_id = public.get_patient_id() OR public.is_admin());
CREATE POLICY "Patients create pharmacy orders" ON public.pharmacy_orders FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE public.ambulance_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ambulance requests viewable by requester" ON public.ambulance_requests FOR SELECT
    USING (auth.role() = 'authenticated');
CREATE POLICY "Users can request ambulance" ON public.ambulance_requests FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE public.home_healthcare_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Home care services viewable by public" ON public.home_healthcare_services FOR SELECT
    USING (status = 'active');

ALTER TABLE public.home_healthcare_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Home care bookings viewable by patient" ON public.home_healthcare_bookings FOR SELECT
    USING (patient_id = public.get_patient_id() OR public.is_admin());
CREATE POLICY "Patients can book home care" ON public.home_healthcare_bookings FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 9. Social, Chat, Notifications & Support
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published reviews viewable by public" ON public.reviews FOR SELECT
    USING (is_published = true);
CREATE POLICY "Verified patients can submit reviews" ON public.reviews FOR INSERT
    WITH CHECK (patient_id = public.get_patient_id());

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ratings viewable by public" ON public.ratings FOR SELECT USING (true);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their favorites" ON public.favorites FOR ALL
    USING (auth.uid() = profile_id);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Conversation participants can view conversation" ON public.conversations FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.conversation_participants cp
        WHERE cp.conversation_id = conversations.id AND cp.profile_id = auth.uid()
    ));

ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants view membership" ON public.conversation_participants FOR SELECT
    USING (profile_id = auth.uid() OR public.is_admin());

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view and send messages" ON public.messages FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.conversation_participants cp
        WHERE cp.conversation_id = messages.conversation_id AND cp.profile_id = auth.uid()
    ));

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recipients view and update their notifications" ON public.notifications FOR ALL
    USING (recipient_id = auth.uid());

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their search history" ON public.search_history FOR ALL
    USING (profile_id = auth.uid());

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their tickets" ON public.support_tickets FOR SELECT
    USING (profile_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users create support tickets" ON public.support_tickets FOR INSERT
    WITH CHECK (true);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view audit logs" ON public.audit_logs FOR SELECT
    USING (public.is_admin());
CREATE POLICY "System can record audit logs" ON public.audit_logs FOR INSERT
    WITH CHECK (true);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Payers and admins view payments" ON public.payments FOR SELECT
    USING (payer_id = auth.uid() OR public.is_admin());

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view payment transactions" ON public.payment_transactions FOR SELECT
    USING (public.is_admin());
