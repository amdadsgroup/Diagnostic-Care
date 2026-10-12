import { Metadata } from 'next';
import { constructMetadata } from '@/config/seo';
import { generateBreadcrumbSchema } from '@/lib/seo-schema';

const CITY_LABELS: Record<string, { en: string; bn: string; division: string }> = {
  moulvibazar: { en: 'Moulvibazar', bn: 'মৌলভীবাজার', division: 'Sylhet' },
  sylhet: { en: 'Sylhet', bn: 'সিলেট', division: 'Sylhet' },
  dhaka: { en: 'Dhaka', bn: 'ঢাকা', division: 'Dhaka' },
  chittagong: { en: 'Chittagong', bn: 'চট্টগ্রাম', division: 'Chittagong' },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityKey = city.toLowerCase();
  const cityInfo = CITY_LABELS[cityKey] || {
    en: city.charAt(0).toUpperCase() + city.slice(1),
    bn: city,
    division: 'Bangladesh',
  };

  const title = `Doctors, Hospitals & Diagnostic Centers in ${cityInfo.en} (${cityInfo.bn})`;
  const description = `Find BMDC-verified specialist doctors, accredited diagnostic test centers, and 24/7 hospitals in ${cityInfo.en}, ${cityInfo.division}. Check chamber schedules, test prices, and phone numbers.`;

  return constructMetadata({
    title,
    description,
    canonicalPath: `/locations/${cityKey}`,
    keywords: [
      `Doctors in ${cityInfo.en}`,
      `Diagnostic Center in ${cityInfo.en}`,
      `Hospital in ${cityInfo.en}`,
      `${cityInfo.en} doctor chamber`,
      `${cityInfo.en} diagnostic test price`,
      `${cityInfo.bn} ডাক্তার`,
      `${cityInfo.bn} ডায়াগনস্টিক সেন্টার`,
      `${cityInfo.bn} হাসপাতাল`,
    ],
  });
}

export default async function LocationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityKey = city.toLowerCase();
  const cityInfo = CITY_LABELS[cityKey] || {
    en: city.charAt(0).toUpperCase() + city.slice(1),
    bn: city,
    division: 'Bangladesh',
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/doctors' },
    { name: cityInfo.en, url: `/locations/${cityKey}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />
      {children}
    </>
  );
}
