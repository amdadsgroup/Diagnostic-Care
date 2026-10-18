import { Metadata } from 'next';
import { constructMetadata } from '@/config/seo';
import { supabase } from '@/lib/supabase/client';
import { generateBreadcrumbSchema } from '@/lib/seo-schema';

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

  try {
    const { data: center } = await supabase
      .from('diagnostic_centers')
      .select('id, name, phone, slug')
      .or(`id.eq.${id},slug.eq.${id}`)
      .maybeSingle();

    if (!center) {
      return constructMetadata({
        title: 'Diagnostic Center Profile | Diagnostic Care',
        description: 'Accredited medical diagnostic center and pathology laboratory in Bangladesh.',
        canonicalPath: `/diagnostic-centers/${id}`,
      });
    }

    return constructMetadata({
      title: `${center.name} — Pathology Tests, Prices & Home Sample Collection`,
      description: `Book diagnostic blood tests, ultrasonography, X-ray, and pathology investigations at ${center.name}. Fast digital report delivery & home sample collection. Call: ${center.phone}.`,
      canonicalPath: `/diagnostic-centers/${center.id}`,
      keywords: [
        center.name,
        `${center.name} Test Price`,
        `${center.name} Contact`,
        'Diagnostic Center Bangladesh',
        'Pathology Lab Bangladesh',
        'Blood Test Home Sample Collection',
      ],
    });
  } catch {
    return constructMetadata({
      title: 'Diagnostic Center Profile | Diagnostic Care',
      description: 'Accredited medical diagnostic center and pathology laboratory in Bangladesh.',
      canonicalPath: `/diagnostic-centers/${id}`,
    });
  }
}

export default async function DiagnosticCenterProfileLayout({
  children,
  params,
}: DiagnosticCenterLayoutProps) {
  const { id } = await params;
  let centerName = 'Diagnostic Center';

  try {
    const { data } = await supabase
      .from('diagnostic_centers')
      .select('name')
      .or(`id.eq.${id},slug.eq.${id}`)
      .maybeSingle();

    if (data?.name) {
      centerName = data.name;
    }
  } catch {}

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Diagnostic Centers', url: '/diagnostic-centers' },
    { name: centerName, url: `/diagnostic-centers/${id}` },
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

