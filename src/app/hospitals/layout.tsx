import { Metadata } from 'next';
import { constructMetadata } from '@/config/seo';
import { generateBreadcrumbSchema } from '@/lib/seo-schema';

export const metadata: Metadata = constructMetadata({
  title: 'Top Hospitals in Bangladesh — Specialized Clinics, ICU & Emergency Directory',
  description:
    'Find and compare accredited private and public hospitals across Dhaka, Sylhet, Moulvibazar, and Chittagong. Discover emergency care 24/7, ICU bed availability, departments, and specialist doctors. Helpline: 01886748564',
  canonicalPath: '/hospitals',
  keywords: [
    'Hospitals in Bangladesh',
    'Best Hospitals in Dhaka',
    'Hospitals in Sylhet',
    'Hospital in Moulvibazar',
    'ICU Hospital Bangladesh',
    '24/7 Emergency Hospital BD',
    'Private Hospital Bangladesh',
    'হাসপাতাল ঢাকা সিলেট',
    'জরুরি হাসপাতাল সেবা',
  ],
});

export default function HospitalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Hospitals', url: '/hospitals' },
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
