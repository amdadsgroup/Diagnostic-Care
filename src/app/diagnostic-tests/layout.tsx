import { Metadata } from 'next';
import { constructMetadata } from '@/config/seo';
import { generateBreadcrumbSchema } from '@/lib/seo-schema';

export const metadata: Metadata = constructMetadata({
  title: 'Diagnostic Test Price List in Bangladesh — Blood Test, USG, MRI & CT Scan Costs',
  description:
    'Find and compare official diagnostic test prices across Bangladesh (CBC, Lipid Profile, HbA1c, Ultrasonography, Digital X-Ray, 12-Lead ECG, Echocardiography, Brain MRI, CT Scan). Fast turnaround times and accredited lab accuracy. Helpline: 01886748564',
  canonicalPath: '/diagnostic-tests',
  keywords: [
    'Diagnostic Test Price in Bangladesh',
    'Blood Test Price BD',
    'CBC Test Cost Bangladesh',
    'MRI Scan Price Bangladesh',
    'CT Scan Price Dhaka',
    'Ultrasonography USG Cost BD',
    'Lipid Profile Test Price',
    'HbA1c Test Cost Bangladesh',
    'Pathology Lab Price List',
    'রক্ত পরীক্ষার দাম',
    'এমআরআই টেস্টের খরচ',
    'সিটি স্ক্যান খরচ',
  ],
});

export default function DiagnosticTestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Diagnostic Tests', url: '/diagnostic-tests' },
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
