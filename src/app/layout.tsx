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
  title: 'Diagnostic Care — Nationwide Digital Healthcare Marketplace Bangladesh',
  description: `Bangladesh's nationwide digital doctor discovery, hospital directory, and diagnostic test marketplace. Connect with verified specialist physicians, accredited diagnostic centers, and book guaranteed chamber appointments across all 8 divisions. Helpline: ${BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}`,
  canonicalPath: '/',
  keywords: [
    'Diagnostic Care Bangladesh',
    'Find Doctors in Bangladesh',
    'Specialist Doctor in Dhaka',
    'Specialist Doctor in Chattogram',
    'Cardiologist in Sylhet',
    'Pediatrician in Bangladesh',
    'Diagnostic Center Bangladesh',
    'Diagnostic Centers in Dhaka',
    'Blood Test Price in Bangladesh',
    'Hospitals in Dhaka',
    'Live Chamber Serial Queue Bangladesh',
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Diagnostic Care" />
        <meta name="application-name" content="Diagnostic Care" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#0060FA" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
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
