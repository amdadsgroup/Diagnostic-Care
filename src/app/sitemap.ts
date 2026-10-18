import { MetadataRoute } from 'next';
import { PRODUCTION_DOMAIN } from '@/config/seo';

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
      url: `${PRODUCTION_DOMAIN}/provider/register`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${PRODUCTION_DOMAIN}/provider/login`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
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

  // 2. Location-Based Regional Discovery Pages (All 8 Administrative Divisions of Bangladesh)
  const locationRoutes: MetadataRoute.Sitemap = [
    'dhaka',
    'chattogram',
    'rajshahi',
    'khulna',
    'barishal',
    'sylhet',
    'rangpur',
    'mymensingh',
    'moulvibazar',
  ].map((loc) => ({
    url: `${PRODUCTION_DOMAIN}/locations/${loc}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: loc === 'dhaka' ? 0.9 : 0.8,
    alternates: {
      languages: {
        en: `${PRODUCTION_DOMAIN}/locations/${loc}?lang=en`,
        bn: `${PRODUCTION_DOMAIN}/locations/${loc}?lang=bn`,
      },
    },
  }));

  return [
    ...staticRoutes,
    ...locationRoutes,
  ];
}
