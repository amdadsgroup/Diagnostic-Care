import { Metadata } from 'next';
import { constructMetadata } from '@/config/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Privacy Policy & Patient Data Security',
  description:
    'Learn how Diagnostic Care protects patient medical records, personal identity information, and appointment booking privacy in Bangladesh.',
  canonicalPath: '/privacy',
  keywords: [
    'Diagnostic Care Privacy Policy',
    'Healthcare Data Protection Bangladesh',
    'Patient Privacy Security',
  ],
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
