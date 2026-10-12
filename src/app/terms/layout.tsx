import { Metadata } from 'next';
import { constructMetadata } from '@/config/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Terms and Conditions | Healthcare Platform Usage',
  description:
    'Review the official terms of service, appointment booking conditions, and provider participation policies for Diagnostic Care in Bangladesh.',
  canonicalPath: '/terms',
  keywords: [
    'Diagnostic Care Terms of Service',
    'Healthcare Marketplace Terms',
    'Doctor Booking Policies Bangladesh',
  ],
});

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
