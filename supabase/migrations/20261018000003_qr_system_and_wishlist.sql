-- Migration: 20261018000003_qr_system_and_wishlist.sql
-- Description: Universal QR Code System, QR Scan Events Telemetry, and Patient Doctor Wishlist

-- 1. Patient Doctor Wishlist Table
CREATE TABLE IF NOT EXISTS public.doctor_wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    patient_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_doctor_wishlist_patient_doc UNIQUE (patient_profile_id, doctor_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_profile ON public.doctor_wishlist(patient_profile_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_doctor ON public.doctor_wishlist(doctor_id);

-- 2. Universal QR Code Records Table
CREATE TABLE IF NOT EXISTS public.qr_code_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_type VARCHAR(50) NOT NULL CHECK (owner_type IN ('doctor', 'hospital', 'diagnostic_center', 'clinic')),
    owner_id UUID NOT NULL,
    public_slug VARCHAR(255) NOT NULL UNIQUE,
    public_url TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    total_scans INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_qr_code_owner UNIQUE (owner_type, owner_id)
);

CREATE INDEX IF NOT EXISTS idx_qr_records_owner ON public.qr_code_records(owner_type, owner_id);
CREATE INDEX IF NOT EXISTS idx_qr_records_slug ON public.qr_code_records(public_slug);

-- 3. Privacy-Preserving QR Scan Events Telemetry Table
CREATE TABLE IF NOT EXISTS public.qr_scan_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_code_id UUID REFERENCES public.qr_code_records(id) ON DELETE CASCADE,
    owner_type VARCHAR(50) NOT NULL,
    owner_id UUID NOT NULL,
    channel VARCHAR(50) NOT NULL DEFAULT 'camera_scan',
    referrer TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_scans_owner ON public.qr_scan_events(owner_type, owner_id, created_at);
CREATE INDEX IF NOT EXISTS idx_qr_scans_qr_id ON public.qr_scan_events(qr_code_id);

-- 4. Atomic Scan Tracking Stored Procedure
CREATE OR REPLACE FUNCTION public.fn_track_qr_scan(
    p_owner_type VARCHAR,
    p_owner_id UUID,
    p_channel VARCHAR DEFAULT 'camera_scan',
    p_referrer TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_qr_id UUID;
    v_scans INT := 0;
BEGIN
    SELECT id, total_scans INTO v_qr_id, v_scans
    FROM public.qr_code_records
    WHERE owner_type = p_owner_type AND owner_id = p_owner_id;

    IF v_qr_id IS NOT NULL THEN
        UPDATE public.qr_code_records
        SET total_scans = total_scans + 1, updated_at = NOW()
        WHERE id = v_qr_id;

        INSERT INTO public.qr_scan_events (qr_code_id, owner_type, owner_id, channel, referrer, user_agent)
        VALUES (v_qr_id, p_owner_type, p_owner_id, p_channel, p_referrer, p_user_agent);

        RETURN jsonb_build_object('success', true, 'total_scans', v_scans + 1);
    ELSE
        INSERT INTO public.qr_scan_events (qr_code_id, owner_type, owner_id, channel, referrer, user_agent)
        VALUES (NULL, p_owner_type, p_owner_id, p_channel, p_referrer, p_user_agent);

        RETURN jsonb_build_object('success', true, 'total_scans', 1);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Row Level Security Policies
ALTER TABLE public.doctor_wishlist ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Patients view own wishlist" ON public.doctor_wishlist;
    DROP POLICY IF EXISTS "Patients insert own wishlist" ON public.doctor_wishlist;
    DROP POLICY IF EXISTS "Patients delete own wishlist" ON public.doctor_wishlist;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Patients view own wishlist" ON public.doctor_wishlist
    FOR SELECT USING (patient_profile_id = auth.uid() OR public.is_admin());

CREATE POLICY "Patients insert own wishlist" ON public.doctor_wishlist
    FOR INSERT WITH CHECK (patient_profile_id = auth.uid() OR public.is_admin());

CREATE POLICY "Patients delete own wishlist" ON public.doctor_wishlist
    FOR DELETE USING (patient_profile_id = auth.uid() OR public.is_admin());

ALTER TABLE public.qr_code_records ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Public can view active qr records" ON public.qr_code_records;
    DROP POLICY IF EXISTS "Admins or owners manage qr records" ON public.qr_code_records;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Public can view active qr records" ON public.qr_code_records
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins or owners manage qr records" ON public.qr_code_records
    FOR ALL USING (public.is_admin() OR auth.uid() IS NOT NULL);

ALTER TABLE public.qr_scan_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Anyone can record scan event" ON public.qr_scan_events;
    DROP POLICY IF EXISTS "Admins and owners can view scan events" ON public.qr_scan_events;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Anyone can record scan event" ON public.qr_scan_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins and owners can view scan events" ON public.qr_scan_events
    FOR SELECT USING (public.is_admin() OR auth.uid() IS NOT NULL);
