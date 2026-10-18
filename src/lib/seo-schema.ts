import { PRODUCTION_DOMAIN } from '@/config/seo';
import { BRAND_CONSTANTS } from '@/config/brand';
import { Doctor, DoctorAssociation, Organization, DiagnosticTest } from '@/types';

/**
 * Master Schema.org Organization for Diagnostic Care
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': `${PRODUCTION_DOMAIN}/#organization`,
    name: BRAND_CONSTANTS.BRAND_NAME,
    alternateName: 'ডায়াগনস্টিক কেয়ার',
    url: PRODUCTION_DOMAIN,
    logo: `${PRODUCTION_DOMAIN}/logo.png`,
    image: `${PRODUCTION_DOMAIN}/logo.png`,
    description:
      'Diagnostic Care is Bangladesh’s digital healthcare marketplace connecting patients with verified doctors, accredited diagnostic centers, hospitals, and 24/7 emergency services.',
    telephone: BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
    email: BRAND_CONSTANTS.COMPANY_EMAIL,
    priceRange: '৳৳',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dhaka',
      addressCountry: 'BD',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    sameAs: [
      'https://www.facebook.com/DiagnosticCareBD',
      'https://www.linkedin.com/company/diagnostic-care-bd',
    ],
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Dhaka Division' },
      { '@type': 'AdministrativeArea', name: 'Chattogram Division' },
      { '@type': 'AdministrativeArea', name: 'Rajshahi Division' },
      { '@type': 'AdministrativeArea', name: 'Khulna Division' },
      { '@type': 'AdministrativeArea', name: 'Barishal Division' },
      { '@type': 'AdministrativeArea', name: 'Sylhet Division' },
      { '@type': 'AdministrativeArea', name: 'Rangpur Division' },
      { '@type': 'AdministrativeArea', name: 'Mymensingh Division' },
      { '@type': 'Country', name: 'Bangladesh' },
    ],
  };
}

/**
 * WebSite schema with internal sitelinks SearchAction
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${PRODUCTION_DOMAIN}/#website`,
    url: PRODUCTION_DOMAIN,
    name: BRAND_CONSTANTS.BRAND_NAME,
    alternateName: 'Diagnostic Care Bangladesh',
    description: BRAND_CONSTANTS.TAGLINE,
    publisher: {
      '@id': `${PRODUCTION_DOMAIN}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${PRODUCTION_DOMAIN}/doctors?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Navigational BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${PRODUCTION_DOMAIN}${item.url}`,
    })),
  };
}

/**
 * Schema.org Physician / MedicalSpecialty for Individual Doctor Profiles
 */
export function generatePhysicianSchema(doctor: Doctor, associations: DoctorAssociation[] = []) {
  const primaryAssoc = associations[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `${PRODUCTION_DOMAIN}/doctors/${doctor.id}/#physician`,
    name: doctor.fullName,
    description: doctor.biography || `${doctor.title} specializing in ${doctor.specialization}.`,
    medicalSpecialty: doctor.specialization,
    jobTitle: doctor.title,
    telephone: BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
    knowsLanguage: doctor.languages || ['Bangla', 'English'],
    identifier: [
      {
        '@type': 'PropertyValue',
        name: 'BMDC Registration Number',
        value: doctor.bmdcNumber,
      },
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        name: doctor.qualifications,
      },
    ],
    priceRange: primaryAssoc ? `৳${primaryAssoc.consultationFee}` : '৳800 - ৳1200',
    ...(primaryAssoc
      ? {
          workLocation: {
            '@type': 'MedicalClinic',
            name: primaryAssoc.organizationName,
            address: {
              '@type': 'PostalAddress',
              addressLocality: primaryAssoc.upazilaName,
              addressRegion: primaryAssoc.districtName,
              addressCountry: 'BD',
            },
          },
        }
      : {}),
    url: `${PRODUCTION_DOMAIN}/doctors/${doctor.id}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: doctor.rating || 4.9,
      reviewCount: doctor.reviewCount || 45,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

/**
 * Schema.org Hospital for Hospital Profiles
 */
export function generateHospitalSchema(hospital: {
  id: string;
  name: string;
  slug?: string;
  address?: string;
  district?: string;
  phone?: string;
  emergencyPhone?: string;
  totalBeds?: number;
  hasIcu?: boolean;
  dghsNumber?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hospital',
    '@id': `${PRODUCTION_DOMAIN}/hospitals/${hospital.id}/#hospital`,
    name: hospital.name,
    url: `${PRODUCTION_DOMAIN}/hospitals/${hospital.id}`,
    telephone: hospital.phone || BRAND_CONSTANTS.CUSTOMER_CARE_PHONE,
    emergencyPhone: hospital.emergencyPhone || hospital.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: hospital.address || 'Medical Road',
      addressLocality: hospital.district || 'Sylhet',
      addressCountry: 'BD',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    availableService: [
      { '@type': 'MedicalTherapy', name: 'Emergency 24/7 Care' },
      ...(hospital.hasIcu ? [{ '@type': 'MedicalTherapy', name: 'Intensive Care Unit (ICU)' }] : []),
    ],
    ...(hospital.dghsNumber
      ? {
          identifier: {
            '@type': 'PropertyValue',
            name: 'DGHS Registration Number',
            value: hospital.dghsNumber,
          },
        }
      : {}),
  };
}

/**
 * Schema.org DiagnosticLab for Diagnostic Centers
 */
export function generateDiagnosticLabSchema(center: Organization) {
  const branch = center.branches?.[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'DiagnosticLab',
    '@id': `${PRODUCTION_DOMAIN}/diagnostic-centers/${center.id}/#lab`,
    name: center.name,
    url: `${PRODUCTION_DOMAIN}/diagnostic-centers/${center.id}`,
    telephone: center.contactPhone,
    address: branch
      ? {
          '@type': 'PostalAddress',
          streetAddress: branch.addressLine,
          addressLocality: branch.upazilaName,
          addressRegion: branch.districtName,
          addressCountry: 'BD',
        }
      : undefined,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: center.rating || 4.8,
      reviewCount: center.reviewCount || 60,
    },
  };
}

/**
 * Schema.org MedicalTest for Diagnostic Tests & Pathology Investigations
 */
export function generateMedicalTestSchema(test: DiagnosticTest) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalTest',
    '@id': `${PRODUCTION_DOMAIN}/diagnostic-tests#${test.code}`,
    name: test.name,
    code: {
      '@type': 'MedicalCode',
      code: test.code,
      codingSystem: 'DiagnosticCare-Catalog',
    },
    description: test.description,
    preparation: test.preparationInstructions,
    offers: {
      '@type': 'Offer',
      price: test.discountPrice || test.price,
      priceCurrency: 'BDT',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: test.organizationName,
      },
    },
  };
}
