import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BRAND_CONSTANTS, BRAND_COLORS, BRAND_LOGOS, BRAND_FAVICONS } from '@/config/brand';
import PWAController from '@/components/pwa/PWAController';
import { LanguageProvider } from '@/context/LanguageContext';
import GlobalMobileNavigation from '@/components/navigation/GlobalMobileNavigation';
import AdminCustomerBarrier from '@/components/auth/AdminCustomerBarrier';

import { PRODUCTION_DOMAIN, constructMetadata } from '@/config/seo';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo-schema';

export const viewport: Viewport = {
  themeColor: BRAND_COLORS.primary,
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  userScalable: true,
};

export const metadata: Metadata = constructMetadata({
  title: 'Diagnostic Care — Specialist Doctor Discovery & Healthcare Marketplace Bangladesh',
  description: `Bangladesh's digital doctor discovery, hospital directory, and diagnostic test marketplace. Connect with verified specialist physicians, accredited diagnostic centers, and book guaranteed chamber appointments in Moulvibazar, Sylhet, Dhaka, and nationwide. Helpline: ${BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}`,
  canonicalPath: '/',
  keywords: [
    'Diagnostic Care Bangladesh',
    'Find Doctors in Bangladesh',
    'Specialist Doctor in Dhaka',
    'Cardiologist in Sylhet',
    'Gynecologist in Moulvibazar',
    'Pediatrician in Bangladesh',
    'Diagnostic Center Moulvibazar',
    'Blood Test Price in Bangladesh',
    'Hospitals in Dhaka',
    'Live Chamber Serial Queue',
  ],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem('dc_lang');if(!l){var m=document.cookie.match(/(?:^|; )dc_lang=([^;]*)/);if(m)l=m[1];}if(l==='bn'||l==='en'){document.documentElement.lang=l;document.documentElement.setAttribute('data-lang',l);}}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema),
          }}
        />
      </head>
      <body>
        <LanguageProvider>
          <PWAController />
          <AdminCustomerBarrier>
            {children}
          </AdminCustomerBarrier>
          <GlobalMobileNavigation />
        </LanguageProvider>
      </body>
    </html>
  );
}
