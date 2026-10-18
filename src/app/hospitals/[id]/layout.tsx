import { Metadata } from 'next';
import { constructMetadata } from '@/config/seo';
import { supabase } from '@/lib/supabase/client';
import { generateHospitalSchema, generateBreadcrumbSchema } from '@/lib/seo-schema';

interface HospitalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let hospital: any = null;

  try {
    const { data } = await supabase
      .from('hospitals')
      .select('*')
      .or(`id.eq.${id},slug.eq.${id}`)
      .maybeSingle();
    hospital = data;
  } catch {
    // fallback
  }

  if (!hospital) {
    return constructMetadata({
      title: 'Hospital Profile | Diagnostic Care',
      description: 'Accredited hospital and healthcare facility in Bangladesh.',
      canonicalPath: `/hospitals/${id}`,
    });
  }

  return constructMetadata({
    title: `${hospital.name} — Hospital Facilities & Departments`,
    description: `Contact and visit ${hospital.name}. 24/7 Emergency medical care, ICU facilities, inpatient admissions, and specialist doctor consultations. Hotline: ${hospital.phone || '01886748564'}.`,
    canonicalPath: `/hospitals/${hospital.id}`,
    keywords: [
      hospital.name,
      `${hospital.name} Contact`,
      `${hospital.name} Address`,
      '24/7 Emergency Care',
      'ICU Hospital BD',
    ],
  });
}

export default async function HospitalProfileLayout({
  children,
  params,
}: HospitalLayoutProps) {
  const { id } = await params;
  let hospital: any = null;

  try {
    const { data } = await supabase
      .from('hospitals')
      .select('*')
      .or(`id.eq.${id},slug.eq.${id}`)
      .maybeSingle();
    hospital = data;
  } catch {
    // fallback
  }

  if (!hospital) {
    return <>{children}</>;
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Hospitals', url: '/hospitals' },
    { name: hospital.name, url: `/hospitals/${hospital.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {children}
    </>
  );
}
