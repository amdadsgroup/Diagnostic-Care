import { Metadata } from 'next';
import { constructMetadata } from '@/config/seo';
import { INITIAL_ORGANIZATIONS } from '@/lib/mock-data';
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
  const hospital = INITIAL_ORGANIZATIONS.find((org) => org.id === id);

  if (!hospital) {
    return constructMetadata({
      title: 'Hospital Profile | Diagnostic Care',
      description: 'Accredited hospital and healthcare facility in Bangladesh.',
      canonicalPath: `/hospitals/${id}`,
    });
  }

  const branch = hospital.branches[0];
  const locationText = branch ? `${branch.districtName} (${branch.addressLine})` : 'Bangladesh';

  return constructMetadata({
    title: `${hospital.name} — Hospital Facilities & Departments in ${locationText}`,
    description: `Contact and visit ${hospital.name}. Location: ${locationText}. 24/7 Emergency medical care, ICU facilities, inpatient admissions, and specialist doctor consultation. Hotline: ${hospital.contactPhone}.`,
    canonicalPath: `/hospitals/${hospital.id}`,
    keywords: [
      hospital.name,
      `${hospital.name} Contact`,
      `${hospital.name} Address`,
      `Hospital in ${branch?.districtName || 'Bangladesh'}`,
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
  const hospital = INITIAL_ORGANIZATIONS.find((org) => org.id === id) || INITIAL_ORGANIZATIONS[0];
  const branch = hospital.branches[0];

  const hospitalSchema = generateHospitalSchema({
    id: hospital.id,
    name: hospital.name,
    address: branch?.addressLine,
    district: branch?.districtName,
    phone: hospital.contactPhone,
    hasIcu: true,
  });

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
          __html: JSON.stringify(hospitalSchema),
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
