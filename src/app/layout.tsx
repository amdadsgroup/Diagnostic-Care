import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BRAND_CONSTANTS, BRAND_COLORS, BRAND_LOGOS, BRAND_FAVICONS } from '@/config/brand';
import PWAController from '@/components/pwa/PWAController';
import { LanguageProvider } from '@/context/LanguageContext';

export const viewport: Viewport = {
  themeColor: BRAND_COLORS.primary, // Signal Blue #0057FF
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://diagnosticcare.com.bd'),
  title: `${BRAND_CONSTANTS.BRAND_NAME} — ${BRAND_CONSTANTS.TAGLINE}`,
  description: `Bangladesh's digital healthcare marketplace connecting patients with verified diagnostic centers, specialist doctors, hospitals, clinics, pharmacies and 24/7 ambulance services in ${BRAND_CONSTANTS.INITIAL_LAUNCH_LOCATION}, Sylhet, and nationwide. Helpline: ${BRAND_CONSTANTS.CUSTOMER_CARE_DISPLAY}`,
  applicationName: BRAND_CONSTANTS.BRAND_NAME,
  keywords: [
    'Diagnostic Care',
    'Your Healthcare Marketplace',
    'Healthcare Marketplace Bangladesh',
    'Doctor Appointment Moulvibazar',
    'Diagnostic Center Moulvibazar',
    'Popular Diagnostic Center',
    'Pathology Lab Test Bangladesh',
    'BMDC Doctor Chamber',
    'Ambulance Bangladesh',
    'Health Vault',
  ],
  authors: [{ name: BRAND_CONSTANTS.BRAND_NAME }],
  creator: BRAND_CONSTANTS.BRAND_NAME,
  publisher: BRAND_CONSTANTS.BRAND_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: BRAND_CONSTANTS.BRAND_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: `${BRAND_CONSTANTS.BRAND_NAME} — ${BRAND_CONSTANTS.TAGLINE}`,
    description: `Bangladesh's premier digital healthcare marketplace. Find verified specialist doctors, book laboratory diagnostic tests, locate hospitals, call 24/7 emergency ambulance, and store encrypted health records.`,
    url: 'https://diagnosticcare.com.bd',
    siteName: BRAND_CONSTANTS.BRAND_NAME,
    images: [
      {
        url: BRAND_LOGOS.ogImage,
        width: 1200,
        height: 630,
        alt: `${BRAND_CONSTANTS.BRAND_NAME} — ${BRAND_CONSTANTS.TAGLINE}`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_CONSTANTS.BRAND_NAME} — ${BRAND_CONSTANTS.TAGLINE}`,
    description: `Bangladesh's digital healthcare marketplace. Connect with verified doctors, diagnostic centers, hospitals & 24/7 ambulance.`,
    images: [BRAND_LOGOS.ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MedicalBusiness',
              name: 'Diagnostic Care',
              alternateName: 'ডায়াগনস্টিক কেয়ার',
              description:
                'Bangladesh digital healthcare marketplace connecting patients with verified doctors, diagnostic laboratories, hospitals, and 24/7 emergency services.',
              url: 'https://diagnosticcare.com.bd',
              telephone: '01886748564',
              priceRange: '৳৳',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Moulvibazar Sadar',
                addressRegion: 'Sylhet',
                addressCountry: 'BD',
              },
              areaServed: {
                '@type': 'Country',
                name: 'Bangladesh',
              },
              availableLanguage: ['en', 'bn'],
              openingHours: 'Mo,Tu,We,Th,Fr,Sa,Su 00:00-24:00',
            }),
          }}
        />
      </head>
      <body>
        <LanguageProvider>
          <PWAController />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
