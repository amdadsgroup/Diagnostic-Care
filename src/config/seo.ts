import { Metadata } from 'next';
import { BRAND_CONSTANTS, BRAND_COLORS, BRAND_LOGOS } from './brand';

export const PRODUCTION_DOMAIN =
  process.env.NEXT_PUBLIC_APP_URL || 'https://diagnosticcare.vercel.app';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  alternateLanguages?: { en: string; bn: string };
}

/**
 * Standardized Next.js Metadata generator for Diagnostic Care
 * Enforces canonical URLs, OpenGraph, Twitter Cards, and bilingual alternates.
 */
export function constructMetadata({
  title,
  description,
  keywords = [],
  canonicalPath = '',
  ogType = 'website',
  ogImage = BRAND_LOGOS.ogImage,
  noIndex = false,
  publishedTime,
  modifiedTime,
  alternateLanguages,
}: SEOProps): Metadata {
  const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const canonicalUrl = `${PRODUCTION_DOMAIN}${cleanPath === '/' ? '' : cleanPath}`;

  const defaultKeywords = [
    'Diagnostic Care',
    'Doctor Booking Bangladesh',
    'Specialist Doctor Chamber',
    'Diagnostic Center Bangladesh',
    'Hospital in Dhaka',
    'Hospital in Sylhet',
    'Diagnostic Center Moulvibazar',
    'Diagnostic Test Price in Bangladesh',
    'Blood Test Price BD',
    'MRI Test Price Bangladesh',
    'CT Scan Price Dhaka',
    'Ambulance Service Bangladesh',
    'Home Healthcare Dhaka',
    'BMDC Registered Doctor',
    'ডাক্তার অ্যাপয়েন্টমেন্ট',
    'ডায়াগনস্টিক টেস্টের দাম',
    'হাসপাতাল বাংলাদেশ',
  ];

  const mergedKeywords = Array.from(new Set([...keywords, ...defaultKeywords]));

  return {
    title: {
      default: `${title} | ${BRAND_CONSTANTS.BRAND_NAME}`,
      template: `%s | ${BRAND_CONSTANTS.BRAND_NAME}`,
    },
    description,
    keywords: mergedKeywords,
    metadataBase: new URL(PRODUCTION_DOMAIN),
    manifest: '/manifest.json',
    icons: {
      icon: '/logo.png',
      apple: '/icons/apple-touch-icon.png',
    },
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages || {
        'en': `${canonicalUrl}?lang=en`,
        'bn': `${canonicalUrl}?lang=bn`,
        'x-default': canonicalUrl,
      },
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      title: `${title} | ${BRAND_CONSTANTS.BRAND_NAME}`,
      description,
      url: canonicalUrl,
      siteName: BRAND_CONSTANTS.BRAND_NAME,
      locale: 'en_US',
      alternateLocale: ['bn_BD'],
      type: ogType,
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${PRODUCTION_DOMAIN}${ogImage}`,
          width: 1200,
          height: 630,
          alt: `${title} — ${BRAND_CONSTANTS.BRAND_NAME}`,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${BRAND_CONSTANTS.BRAND_NAME}`,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${PRODUCTION_DOMAIN}${ogImage}`],
      creator: '@DiagnosticCareBD',
    },
    authors: [{ name: BRAND_CONSTANTS.BRAND_NAME }],
    creator: BRAND_CONSTANTS.BRAND_NAME,
    publisher: BRAND_CONSTANTS.BRAND_NAME,
  };
}
