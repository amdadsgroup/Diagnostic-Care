import { MetadataRoute } from 'next';
import { PRODUCTION_DOMAIN } from '@/config/seo';
import { INITIAL_DOCTORS, INITIAL_ORGANIZATIONS } from '@/lib/mock-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // 1. Core Public Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${PRODUCTION_DOMAIN}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${PRODUCTION_DOMAIN}?lang=en`,
          bn: `${PRODUCTION_DOMAIN}?lang=bn`,
        },
      },
    },
    {
      url: `${PRODUCTION_DOMAIN}/doctors`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
      alternates: {
        languages: {
          en: `${PRODUCTION_DOMAIN}/doctors?lang=en`,
          bn: `${PRODUCTION_DOMAIN}/doctors?lang=bn`,
        },
      },
    },
    {
      url: `${PRODUCTION_DOMAIN}/hospitals`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${PRODUCTION_DOMAIN}/hospitals?lang=en`,
          bn: `${PRODUCTION_DOMAIN}/hospitals?lang=bn`,
        },
      },
    },
    {
      url: `${PRODUCTION_DOMAIN}/diagnostic-centers`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${PRODUCTION_DOMAIN}/diagnostic-centers?lang=en`,
          bn: `${PRODUCTION_DOMAIN}/diagnostic-centers?lang=bn`,
        },
      },
    },
    {
      url: `${PRODUCTION_DOMAIN}/diagnostic-tests`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: {
        languages: {
          en: `${PRODUCTION_DOMAIN}/diagnostic-tests?lang=en`,
          bn: `${PRODUCTION_DOMAIN}/diagnostic-tests?lang=bn`,
        },
      },
    },
    {
      url: `${PRODUCTION_DOMAIN}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${PRODUCTION_DOMAIN}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // 2. Location-Based Discovery Pages
  const locationRoutes: MetadataRoute.Sitemap = ['moulvibazar', 'sylhet', 'dhaka', 'chittagong'].map(
    (loc) => ({
      url: `${PRODUCTION_DOMAIN}/locations/${loc}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${PRODUCTION_DOMAIN}/locations/${loc}?lang=en`,
          bn: `${PRODUCTION_DOMAIN}/locations/${loc}?lang=bn`,
        },
      },
    })
  );

  // 3. Dynamic Verified Doctor Profiles
  const doctorRoutes: MetadataRoute.Sitemap = INITIAL_DOCTORS.map((doc) => ({
    url: `${PRODUCTION_DOMAIN}/doctors/${doc.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
    alternates: {
      languages: {
        en: `${PRODUCTION_DOMAIN}/doctors/${doc.id}?lang=en`,
        bn: `${PRODUCTION_DOMAIN}/doctors/${doc.id}?lang=bn`,
      },
    },
  }));

  // 4. Dynamic Hospital & Diagnostic Center Profiles
  const hospitalRoutes: MetadataRoute.Sitemap = INITIAL_ORGANIZATIONS.filter(
    (org) => org.orgType === 'HOSPITAL'
  ).map((hosp) => ({
    url: `${PRODUCTION_DOMAIN}/hospitals/${hosp.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
    alternates: {
      languages: {
        en: `${PRODUCTION_DOMAIN}/hospitals/${hosp.id}?lang=en`,
        bn: `${PRODUCTION_DOMAIN}/hospitals/${hosp.id}?lang=bn`,
      },
    },
  }));

  const diagnosticCenterRoutes: MetadataRoute.Sitemap = INITIAL_ORGANIZATIONS.filter(
    (org) => org.orgType === 'DIAGNOSTIC_CENTER'
  ).map((dc) => ({
    url: `${PRODUCTION_DOMAIN}/diagnostic-centers/${dc.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
    alternates: {
      languages: {
        en: `${PRODUCTION_DOMAIN}/diagnostic-centers/${dc.id}?lang=en`,
        bn: `${PRODUCTION_DOMAIN}/diagnostic-centers/${dc.id}?lang=bn`,
      },
    },
  }));

  return [
    ...staticRoutes,
    ...locationRoutes,
    ...doctorRoutes,
    ...hospitalRoutes,
    ...diagnosticCenterRoutes,
  ];
}
