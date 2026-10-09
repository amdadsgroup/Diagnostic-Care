import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/reset-password',
          '/admin/',
        ],
      },
    ],
    sitemap: 'https://diagnosticcare.com.bd/sitemap.xml',
    host: 'https://diagnosticcare.com.bd',
  };
}
