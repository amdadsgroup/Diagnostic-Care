import { Metadata } from 'next';
import { constructMetadata } from '@/config/seo';
import { generateBreadcrumbSchema } from '@/lib/seo-schema';

export const metadata: Metadata = constructMetadata({
  title: 'Find Specialist Doctors in Bangladesh — BMDC Registered Physicians & Chambers',
  description:
    'Search and book verified specialist doctors across Dhaka, Sylhet, Moulvibazar, and nationwide. View verified BMDC qualifications, consultation fees, chamber locations, and live patient serial queues. Helpline: 01886748564',
  canonicalPath: '/doctors',
  keywords: [
    'Find Doctors in Bangladesh',
    'Specialist Doctor in Dhaka',
    'Cardiologist in Sylhet',
    'Gynecologist in Moulvibazar',
    'Pediatrician in Bangladesh',
    'Orthopedic Surgeon Dhaka',
    'Neurologist in Sylhet',
    'ENT Specialist Moulvibazar',
    'BMDC Doctor Directory',
    'Doctor Serial Booking BD',
    'বাংলাদেশে বিশেষজ্ঞ ডাক্তার',
    'ডাক্তার চেম্বার সিরিয়াল',
  ],
});

export default function DoctorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Doctors', url: '/doctors' },
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
