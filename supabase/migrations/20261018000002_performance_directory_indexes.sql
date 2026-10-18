-- Performance and Directory Query Optimization Indexes
-- Safe, idempotent index creation for high-frequency directory filters and lookups

CREATE INDEX IF NOT EXISTS idx_doctors_status_verification 
  ON public.doctors (status, verification_status);

CREATE INDEX IF NOT EXISTS idx_doctors_specialization 
  ON public.doctors (specialization) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_doctors_consultation_fee 
  ON public.doctors (consultation_fee) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_hospitals_status_verification 
  ON public.hospitals (status, verification_status);

CREATE INDEX IF NOT EXISTS idx_hospitals_slug 
  ON public.hospitals (slug);

CREATE INDEX IF NOT EXISTS idx_diagnostic_centers_status_verification 
  ON public.diagnostic_centers (status, verification_status);

CREATE INDEX IF NOT EXISTS idx_diagnostic_centers_slug 
  ON public.diagnostic_centers (slug);

CREATE INDEX IF NOT EXISTS idx_lab_tests_status_dc 
  ON public.lab_tests (status, diagnostic_center_id);

CREATE INDEX IF NOT EXISTS idx_lab_tests_category 
  ON public.lab_tests (category) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_doctor_schedules_active_provider 
  ON public.doctor_schedules (provider_id, is_active);

CREATE INDEX IF NOT EXISTS idx_doctor_schedules_doctor_active 
  ON public.doctor_schedules (doctor_id, is_active);

CREATE INDEX IF NOT EXISTS idx_doctor_slots_doctor_date_status 
  ON public.doctor_schedule_slots (doctor_id, schedule_date, status);
