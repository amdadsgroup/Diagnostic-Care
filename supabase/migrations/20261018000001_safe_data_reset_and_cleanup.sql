-- Migration: 20261018000001_safe_data_reset_and_cleanup.sql
-- Description: Controlled Production Data Reset & Sanitization Script
-- Safety: Preserves Administrative Accounts, Geo Hierarchy, System Settings, and Published Plans.

DO $$
BEGIN
    RAISE NOTICE 'Starting Controlled Production Data Sanitization...';

    -- 1. Remove mock/test appointments and consultations created during local UI testing
    DELETE FROM public.appointment_status_history 
    WHERE appointment_id IN (
        SELECT id FROM public.appointments 
        WHERE patient_name ILIKE '%test%' OR booking_code ILIKE 'TEST%'
    );

    DELETE FROM public.appointments 
    WHERE patient_name ILIKE '%test%' OR booking_code ILIKE 'TEST%';

    -- 2. Clean diagnostic test bookings generated during testing
    DELETE FROM public.diagnostic_bookings 
    WHERE booking_code ILIKE 'TEST%' OR patient_name ILIKE '%test%';

    -- 3. Clean test notifications and temporary ledger entries
    DELETE FROM public.notifications 
    WHERE title ILIKE '%test%' OR title ILIKE '%dummy%';

    -- 4. Clean test provider leads
    DELETE FROM public.provider_leads 
    WHERE contact_person ILIKE '%test%' OR organization_name ILIKE '%test%';

    -- 5. Guarantee super_admin account integrity
    UPDATE public.profiles
    SET status = 'active'
    WHERE email = 'contact.amdadur@gmail.com';

    RAISE NOTICE 'Production Data Sanitization completed successfully.';
END $$;
