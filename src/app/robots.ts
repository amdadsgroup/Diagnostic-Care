import { MetadataRoute } from 'next';
import { PRODUCTION_DOMAIN } from '@/config/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/doctors',
          '/doctors/*',
          '/hospitals',
          '/hospitals/*',
          '/diagnostic-centers',
          '/diagnostic-centers/*',
          '/diagnostic-tests',
          '/locations',
          '/locations/*',
          '/appointments',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/admin/',
          '/admin',
          '/patient/',
          '/patient',
          '/doctor/dashboard',
          '/doctor/portal',
          '/assistant/',
          '/assistant',
          '/hospital/dashboard',
          '/hospital/portal',
          '/provider/subscription',
          '/provider/login',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/api/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/patient/',
          '/doctor/dashboard',
          '/assistant/',
          '/hospital/dashboard',
          '/hospital/portal',
          '/provider/subscription',
          '/provider/login',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/api/',
        ],
      },
    ],
    sitemap: `${PRODUCTION_DOMAIN}/sitemap.xml`,
    host: PRODUCTION_DOMAIN,
  };
}
