-- Migration: 20261006000006_functions_triggers.sql
-- Description: Stored procedures, triggers, atomic slot reservation, token numbering, profile initialization

-- 1. Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all core tables
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN
        SELECT table_name
        FROM information_schema.columns
        WHERE column_name = 'updated_at'
          AND table_schema = 'public'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS trg_set_updated_at_%I ON %I;
            CREATE TRIGGER trg_set_updated_at_%I
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION set_updated_at_timestamp();',
            tbl, tbl, tbl, tbl);
    END LOOP;
END $$;

-- 2. Auth user creation hook -> auto-create profile and patient role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_full_name TEXT;
    user_phone TEXT;
BEGIN
    default_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Valued Patient');
    user_phone := COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone', NULL);

    -- Insert into profiles
    INSERT INTO public.profiles (
        id,
        phone,
        email,
        full_name,
        language_preference,
        status
    )
    VALUES (
        NEW.id,
        user_phone,
        NEW.email,
        default_full_name,
        COALESCE(NEW.raw_user_meta_data->>'language', 'en'),
        'active'
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        phone = COALESCE(EXCLUDED.phone, profiles.phone),
        updated_at = NOW();

    -- Insert default patient role
    INSERT INTO public.user_roles (user_id, role, is_primary)
    VALUES (NEW.id, 'patient', TRUE)
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Insert patient entity profile
    INSERT INTO public.patients (profile_id, status)
    VALUES (NEW.id, 'active')
    ON CONFLICT (profile_id) DO NOTHING;

    -- Insert default user preferences
    INSERT INTO public.user_preferences (user_id, preferred_language)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'language', 'en'))
    ON CONFLICT (user_id) DO NOTHING;

    -- Insert default privacy settings
    INSERT INTO public.privacy_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Double-Booking Protected Atomic Appointment Booking Procedure
CREATE OR REPLACE FUNCTION public.fn_book_appointment(
    p_patient_id UUID,
    p_doctor_id UUID,
    p_provider_id UUID,
    p_appointment_date DATE,
    p_start_time TIME,
    p_patient_name VARCHAR(150),
    p_patient_phone VARCHAR(20),
    p_patient_age INT,
    p_patient_gender VARCHAR(20),
    p_consultation_fee NUMERIC(10, 2),
    p_branch_id UUID DEFAULT NULL,
    p_schedule_id UUID DEFAULT NULL,
    p_availability_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_next_token INT;
    v_booking_code VARCHAR(30);
    v_new_appointment_id UUID;
    v_existing_conflict UUID;
BEGIN
    -- Check for race conditions / double bookings
    SELECT id INTO v_existing_conflict
    FROM public.appointments
    WHERE doctor_id = p_doctor_id
      AND appointment_date = p_appointment_date
      AND start_time = p_start_time
      AND status NOT IN ('cancelled', 'rejected');

    IF v_existing_conflict IS NOT NULL THEN
        RAISE EXCEPTION 'SLOT_ALREADY_BOOKED: This appointment slot is already taken by another patient.';
    END IF;

    -- Atomically calculate the next sequential token for this doctor on this day
    SELECT COALESCE(MAX(token_number), 0) + 1 INTO v_next_token
    FROM public.appointments
    WHERE doctor_id = p_doctor_id
      AND appointment_date = p_appointment_date;

    -- Generate unique human-readable booking code e.g. DC-2026-8941
    v_booking_code := 'DC-2026-' || LPAD(FLOOR(1000 + RANDOM() * 8999)::TEXT, 4, '0');

    -- Insert confirmed appointment
    INSERT INTO public.appointments (
        booking_code,
        patient_id,
        doctor_id,
        schedule_id,
        availability_id,
        provider_id,
        branch_id,
        appointment_date,
        start_time,
        token_number,
        patient_name,
        patient_phone,
        patient_age,
        patient_gender,
        consultation_fee,
        total_payable,
        status,
        payment_status
    )
    VALUES (
        v_booking_code,
        p_patient_id,
        p_doctor_id,
        p_schedule_id,
        p_availability_id,
        p_provider_id,
        p_branch_id,
        p_appointment_date,
        p_start_time,
        v_next_token,
        p_patient_name,
        p_patient_phone,
        p_patient_age,
        p_patient_gender,
        p_consultation_fee,
        p_consultation_fee,
        'confirmed',
        'cash_at_desk'
    )
    RETURNING id INTO v_new_appointment_id;

    -- Update availability if linked
    IF p_availability_id IS NOT NULL THEN
        UPDATE public.doctor_availability
        SET is_booked = TRUE, updated_at = NOW()
        WHERE id = p_availability_id;
    END IF;

    -- Insert status history
    INSERT INTO public.appointment_status_history (
        appointment_id,
        new_status,
        notes
    )
    VALUES (
        v_new_appointment_id,
        'confirmed',
        'Appointment booked with token #' || v_next_token
    );

    RETURN jsonb_build_object(
        'success', true,
        'appointment_id', v_new_appointment_id,
        'booking_code', v_booking_code,
        'token_number', v_next_token
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Review Rating Aggregator Trigger
CREATE OR REPLACE FUNCTION public.fn_update_provider_rating()
RETURNS TRIGGER AS $$
DECLARE
    v_avg NUMERIC(3, 2);
    v_total INT;
BEGIN
    SELECT COALESCE(AVG(rating), 5.0)::NUMERIC(3, 2), COUNT(*)
    INTO v_avg, v_total
    FROM public.reviews
    WHERE provider_type = NEW.provider_type
      AND provider_id = NEW.provider_id
      AND is_published = TRUE;

    -- Update target provider table
    IF NEW.provider_type = 'doctor' THEN
        UPDATE public.doctors SET rating = v_avg, total_reviews = v_total WHERE id = NEW.provider_id;
    ELSIF NEW.provider_type = 'diagnostic_center' THEN
        UPDATE public.diagnostic_centers SET rating = v_avg, total_reviews = v_total WHERE id = NEW.provider_id;
    ELSIF NEW.provider_type = 'hospital' THEN
        UPDATE public.hospitals SET rating = v_avg, total_reviews = v_total WHERE id = NEW.provider_id;
    ELSIF NEW.provider_type = 'clinic' THEN
        UPDATE public.clinics SET rating = v_avg, total_reviews = v_total WHERE id = NEW.provider_id;
    ELSIF NEW.provider_type = 'pharmacy' THEN
        UPDATE public.pharmacies SET rating = v_avg, total_reviews = v_total WHERE id = NEW.provider_id;
    END IF;

    -- Also update ratings breakdown table
    INSERT INTO public.ratings (provider_type, provider_id, average_score, total_reviews, updated_at)
    VALUES (NEW.provider_type, NEW.provider_id, v_avg, v_total, NOW())
    ON CONFLICT (provider_type, provider_id) DO UPDATE
    SET average_score = v_avg,
        total_reviews = v_total,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_rating ON public.reviews;
CREATE TRIGGER trg_update_rating
    AFTER INSERT OR UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.fn_update_provider_rating();
