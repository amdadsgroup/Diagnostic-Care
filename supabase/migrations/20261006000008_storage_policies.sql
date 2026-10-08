-- Migration: 20261006000008_storage_policies.sql
-- Description: Supabase Storage buckets creation and secure access policies

-- Create required Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('avatars', 'avatars', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
    ('provider_logos', 'provider_logos', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
    ('provider_covers', 'provider_covers', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp']),
    ('review_images', 'review_images', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
    ('service_images', 'service_images', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
    ('product_images', 'product_images', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
    -- Private sensitive healthcare buckets
    ('provider_documents', 'provider_documents', false, 20971520, ARRAY['application/pdf', 'image/png', 'image/jpeg']),
    ('medical_documents', 'medical_documents', false, 20971520, ARRAY['application/pdf', 'image/png', 'image/jpeg']),
    ('prescriptions', 'prescriptions', false, 10485760, ARRAY['application/pdf', 'image/png', 'image/jpeg']),
    ('lab_reports', 'lab_reports', false, 20971520, ARRAY['application/pdf', 'image/png', 'image/jpeg']),
    ('chat_attachments', 'chat_attachments', false, 10485760, ARRAY['image/png', 'image/jpeg', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Public bucket read access policies
CREATE POLICY "Public can view avatars" ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Public can view provider logos" ON storage.objects FOR SELECT
    USING (bucket_id = 'provider_logos');

CREATE POLICY "Public can view provider covers" ON storage.objects FOR SELECT
    USING (bucket_id = 'provider_covers');

CREATE POLICY "Public can view review images" ON storage.objects FOR SELECT
    USING (bucket_id = 'review_images');

CREATE POLICY "Public can view service images" ON storage.objects FOR SELECT
    USING (bucket_id = 'service_images');

CREATE POLICY "Public can view product images" ON storage.objects FOR SELECT
    USING (bucket_id = 'product_images');

-- User avatar upload
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Provider assets upload
CREATE POLICY "Providers can upload logos and covers" ON storage.objects FOR INSERT
    WITH CHECK (bucket_id IN ('provider_logos', 'provider_covers') AND auth.role() = 'authenticated');

-- Strict private healthcare file policies
CREATE POLICY "Users can upload medical documents" ON storage.objects FOR INSERT
    WITH CHECK (bucket_id IN ('medical_documents', 'prescriptions') AND auth.role() = 'authenticated');

CREATE POLICY "Users view own medical documents" ON storage.objects FOR SELECT
    USING (
        bucket_id IN ('medical_documents', 'prescriptions', 'lab_reports')
        AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin())
    );

CREATE POLICY "Authorized staff upload lab reports" ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'lab_reports' AND auth.role() = 'authenticated');
