import { Metadata } from 'next';
import { constructMetadata } from '@/config/seo';
import { INITIAL_DOCTORS, INITIAL_DOCTOR_ASSOCIATIONS } from '@/lib/mock-data';
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
  const doctor = INITIAL_DOCTORS.find((d) => d.id === id || d.userId === id);

  if (!doctor) {
    return constructMetadata({
      title: 'Doctor Profile | Diagnostic Care',
      description: 'Verified specialist doctor chamber profile on Diagnostic Care Bangladesh.',
      canonicalPath: `/doctors/${id}`,
    });
  }

  const primaryAssoc = INITIAL_DOCTOR_ASSOCIATIONS.find((a) => a.doctorId === doctor.id);
  const locationText = primaryAssoc
    ? `${primaryAssoc.districtName} (${primaryAssoc.organizationName})`
    : 'Bangladesh';
  const feeText = primaryAssoc ? `Fee: ৳${primaryAssoc.consultationFee}` : 'Affordable Consultation Fee';

  return constructMetadata({
    title: `${doctor.fullName} — ${doctor.specialization} in ${locationText}`,
    description: `Book consultation with ${doctor.fullName}, ${doctor.title} (${doctor.qualifications}). BMDC Reg: ${doctor.bmdcNumber}. Chamber: ${locationText}. ${feeText}. Verified serial booking & live patient queue tracking on Diagnostic Care.`,
    canonicalPath: `/doctors/${doctor.id}`,
    keywords: [
      doctor.fullName,
      `${doctor.fullName} Chamber`,
      doctor.specialization,
      `Specialist in ${primaryAssoc?.districtName || 'Bangladesh'}`,
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
  const doctor = INITIAL_DOCTORS.find((d) => d.id === id || d.userId === id) || INITIAL_DOCTORS[0];
  const associations = INITIAL_DOCTOR_ASSOCIATIONS.filter((a) => a.doctorId === doctor.id);

  const physicianSchema = generatePhysicianSchema(doctor, associations);
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
