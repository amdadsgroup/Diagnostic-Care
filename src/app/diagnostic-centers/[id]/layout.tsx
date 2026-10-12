import { Metadata } from 'next';
import { constructMetadata } from '@/config/seo';
import { INITIAL_ORGANIZATIONS } from '@/lib/mock-data';
import { generateDiagnosticLabSchema, generateBreadcrumbSchema } from '@/lib/seo-schema';

interface DiagnosticCenterLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const center = INITIAL_ORGANIZATIONS.find((org) => org.id === id);

  if (!center) {
    return constructMetadata({
      title: 'Diagnostic Center Profile | Diagnostic Care',
      description: 'Accredited medical diagnostic center and pathology laboratory in Bangladesh.',
      canonicalPath: `/diagnostic-centers/${id}`,
    });
  }

  const branch = center.branches[0];
  const locationText = branch ? `${branch.districtName} (${branch.addressLine})` : 'Bangladesh';

  return constructMetadata({
    title: `${center.name} — Pathology Tests, Prices & Home Sample Collection in ${locationText}`,
    description: `Book diagnostic blood tests, ultrasonography, X-ray, and pathology investigations at ${center.name}. Location: ${locationText}. Fast digital report delivery & home sample collection. Call: ${center.contactPhone}.`,
    canonicalPath: `/diagnostic-centers/${center.id}`,
    keywords: [
      center.name,
      `${center.name} Test Price`,
      `${center.name} Contact`,
      `Diagnostic Center in ${branch?.districtName || 'Bangladesh'}`,
      'Pathology Lab Bangladesh',
      'Blood Test Home Sample Collection',
    ],
  });
}

export default async function DiagnosticCenterProfileLayout({
  children,
  params,
}: DiagnosticCenterLayoutProps) {
  const { id } = await params;
  const center = INITIAL_ORGANIZATIONS.find((org) => org.id === id) || INITIAL_ORGANIZATIONS[0];

  const labSchema = generateDiagnosticLabSchema(center);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Diagnostic Centers', url: '/diagnostic-centers' },
    { name: center.name, url: `/diagnostic-centers/${center.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(labSchema),
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
