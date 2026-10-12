import { Metadata } from 'next';
import { constructMetadata } from '@/config/seo';
import { generateBreadcrumbSchema } from '@/lib/seo-schema';

export const metadata: Metadata = constructMetadata({
  title: 'Accredited Diagnostic Centers & Pathology Labs in Bangladesh',
  description:
    'Find certified diagnostic centers and pathology laboratories across Moulvibazar, Sylhet, and Dhaka. Compare test prices (CBC, Lipid, USG, MRI, CT Scan) and book home sample collection. Helpline: 01886748564',
  canonicalPath: '/diagnostic-centers',
  keywords: [
    'Diagnostic Center Bangladesh',
    'Diagnostic Center in Moulvibazar',
    'Pathology Lab Sylhet',
    'Diagnostic Center Dhaka',
    'Blood Test Laboratory BD',
    'Home Sample Collection Moulvibazar',
    'Popular Diagnostic Moulvibazar',
    'Life Care Diagnostic Center',
    'ডায়াগনস্টিক সেন্টার বাংলাদেশ',
    'প্যাথলজি টেস্ট ল্যাব',
  ],
});

export default function DiagnosticCentersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Diagnostic Centers', url: '/diagnostic-centers' },
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
