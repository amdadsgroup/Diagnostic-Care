import { Metadata } from 'next';
import { constructMetadata } from '@/config/seo';
import { DoctorService } from '@/services/doctor.service';
import { generatePhysicianSchema, generateBreadcrumbSchema } from '@/lib/seo-schema';

interface DoctorLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const doctor = await DoctorService.getDoctorById(id);

  if (!doctor) {
    return constructMetadata({
      title: 'Doctor Profile | Diagnostic Care',
      description: 'Verified specialist doctor chamber profile on Diagnostic Care Bangladesh.',
      canonicalPath: `/doctors/${id}`,
    });
  }

  return constructMetadata({
    title: `${doctor.fullName} — ${doctor.specialization}`,
    description: `Book consultation with ${doctor.fullName}, ${doctor.title || 'Consultant'} (${doctor.qualifications}). BMDC Reg: ${doctor.bmdcNumber || 'Verified'}. Verified serial booking & live patient queue tracking on Diagnostic Care.`,
    canonicalPath: `/doctors/${doctor.id}`,
    keywords: [
      doctor.fullName,
      `${doctor.fullName} Chamber`,
      doctor.specialization,
      doctor.bmdcNumber,
      'Doctor Serial Bangladesh',
    ],
    ogType: 'profile',
  });
}

export default async function DoctorProfileLayout({
  children,
  params,
}: DoctorLayoutProps) {
  const { id } = await params;
  const doctor = await DoctorService.getDoctorById(id);

  if (!doctor) {
    return <>{children}</>;
  }

  const physicianSchema = generatePhysicianSchema(doctor, []);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Doctors', url: '/doctors' },
    { name: doctor.fullName, url: `/doctors/${doctor.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(physicianSchema),
        }}
      />
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
