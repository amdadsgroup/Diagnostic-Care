import type { Metadata } from 'next';
import './globals.css';
import { BRAND_CONSTANTS } from '@/config/brand';

export const metadata: Metadata = {
  title: `${BRAND_CONSTANTS.BRAND_NAME} — ${BRAND_CONSTANTS.TAGLINE}`,
  description: `Bangladesh's unified healthcare marketplace connecting patients with verified diagnostic centers, specialist doctors, and diagnostic tests in ${BRAND_CONSTANTS.INITIAL_LAUNCH_LOCATION}, Sylhet, and nationwide. Helpline: ${BRAND_CONSTANTS.CUSTOMER_CARE_PHONE}`,
  keywords: [
    'Diagnostic Care',
    'Healthcare Marketplace Bangladesh',
    'Doctor Appointment Moulvibazar',
    'Diagnostic Center Moulvibazar',
    'Popular Diagnostic Center',
    'Pathology Lab Test Bangladesh',
    'BMDC Doctor Chamber',
  ],
  authors: [{ name: BRAND_CONSTANTS.BRAND_NAME }],
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

import PWAController from '@/components/pwa/PWAController';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body>
        <PWAController />
        {children}
      </body>
    </html>
  );
}
