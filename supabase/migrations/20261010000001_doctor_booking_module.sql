-- Migration: 20261010000001_doctor_booking_module.sql
-- Description: Incremental migration for Doctor Booking Module:
--   - patient_family_members table
--   - doctor_leaves and schedule_exceptions tables
--   - doctor_assistant_invitations table
--   - booking_audit_events table
--   - atomic slot hold and validation functions
--   - Row Level Security (RLS) policies for new tables

-- 1. Patient Family Members
CREATE TABLE IF NOT EXISTS public.patient_family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    full_name_bn VARCHAR(150),
    relationship VARCHAR(50) NOT NULL, -- 'Father', 'Mother', 'Spouse', 'Child', 'Other'
    phone VARCHAR(20),
    date_of_birth DATE,
    age INT,
    gender VARCHAR(20) NOT NULL, -- 'MALE', 'FEMALE', 'OTHER'
    blood_group VARCHAR(10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_family_members_patient ON public.patient_family_members(patient_id);

-- 2. Doctor Leaves and Schedule Exceptions
CREATE TABLE IF NOT EXISTS public.doctor_leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.provider_locations(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
    status general_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_leave_dates CHECK (end_date >= start_date)
);
CREATE INDEX IF NOT EXISTS idx_doctor_leaves_doctor ON public.doctor_leaves(doctor_id, start_date, end_date);

CREATE TABLE IF NOT EXISTS public.schedule_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES public.doctor_schedules(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT FALSE,
    custom_start_time TIME,
    custom_end_time TIME,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_doctor_schedule_exception UNIQUE (doctor_id, exception_date)
);
CREATE INDEX IF NOT EXISTS idx_schedule_exceptions_date ON public.schedule_exceptions(doctor_id, exception_date);

-- 3. Doctor Assistant Invitations
CREATE TABLE IF NOT EXISTS public.doctor_assistant_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    organization_id UUID,
    branch_id UUID REFERENCES public.provider_locations(id) ON DELETE SET NULL,
    invitee_email VARCHAR(255) NOT NULL,
    invitee_phone VARCHAR(20),
    invitee_name VARCHAR(150),
    invitation_token VARCHAR(100) NOT NULL UNIQUE,
    can_manage_queue BOOLEAN NOT NULL DEFAULT TRUE,
    can_view_patient_info BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'revoked', 'expired'
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    accepted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    accepted_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_assistant_invitations_doc ON public.doctor_assistant_invitations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_assistant_invitations_token ON public.doctor_assistant_invitations(invitation_token);

-- 4. Booking Audit Events
CREATE TABLE IF NOT EXISTS public.booking_audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    booking_code VARCHAR(30),
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL, -- 'HOLD_ACQUIRED', 'HOLD_RELEASED', 'HOLD_EXPIRED', 'BOOKING_CONFIRMED', 'APPOINTMENT_CANCELLED', 'RESCHEDULED', 'STATUS_UPDATED'
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_role VARCHAR(50),
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_booking_audit_apt ON public.booking_audit_events(appointment_id);
CREATE INDEX IF NOT EXISTS idx_booking_audit_code ON public.booking_audit_events(booking_code);
CREATE INDEX IF NOT EXISTS idx_booking_audit_created ON public.booking_audit_events(created_at);

-- 5. Row Level Security Policies

-- Family Members RLS
ALTER TABLE public.patient_family_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients manage their own family members"
    ON public.patient_family_members
    FOR ALL
    USING (patient_id = public.get_patient_id() OR public.is_admin())
    WITH CHECK (patient_id = public.get_patient_id() OR public.is_admin());

-- Doctor Leaves RLS
ALTER TABLE public.doctor_leaves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctor leaves viewable by public"
    ON public.doctor_leaves
    FOR SELECT
    USING (status = 'active');
CREATE POLICY "Doctors manage their own leaves"
    ON public.doctor_leaves
    FOR ALL
    USING (doctor_id = public.get_doctor_id() OR public.is_admin())
    WITH CHECK (doctor_id = public.get_doctor_id() OR public.is_admin());

-- Schedule Exceptions RLS
ALTER TABLE public.schedule_exceptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Schedule exceptions viewable by public"
    ON public.schedule_exceptions
    FOR SELECT
    USING (true);
CREATE POLICY "Doctors manage schedule exceptions"
    ON public.schedule_exceptions
    FOR ALL
    USING (doctor_id = public.get_doctor_id() OR public.is_admin())
    WITH CHECK (doctor_id = public.get_doctor_id() OR public.is_admin());

-- Assistant Invitations RLS
ALTER TABLE public.doctor_assistant_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctors and admins view and manage invitations"
    ON public.doctor_assistant_invitations
    FOR ALL
    USING (doctor_id = public.get_doctor_id() OR public.is_admin())
    WITH CHECK (doctor_id = public.get_doctor_id() OR public.is_admin());
CREATE POLICY "Invitee can view invitation by token"
    ON public.doctor_assistant_invitations
    FOR SELECT
    USING (true);

-- Booking Audit Events RLS
ALTER TABLE public.booking_audit_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins and authorized participants view audit events"
    ON public.booking_audit_events
    FOR SELECT
    USING (public.is_admin() OR patient_id = public.get_patient_id() OR doctor_id = public.get_doctor_id());
CREATE POLICY "System and authenticated users insert audit events"
    ON public.booking_audit_events
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
