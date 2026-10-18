/**
 * Diagnostic Care — Authoritative Bangladesh Administrative Hierarchy
 * Covers all 8 Administrative Divisions and 64 Districts of Bangladesh.
 * Supports bilingual (English and Bangla) nationwide healthcare discovery.
 */

export interface AdministrativeDivision {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  capital: string;
  capitalBn: string;
  districtsCount: number;
  highlight?: boolean; // Dhaka as primary national discovery hub
}

export interface AdministrativeDistrict {
  id: string;
  divisionId: string;
  divisionSlug: string;
  nameEn: string;
  nameBn: string;
}

export const BANGLADESH_DIVISIONS: AdministrativeDivision[] = [
  {
    id: 'div-dhaka',
    slug: 'dhaka',
    nameEn: 'Dhaka Division',
    nameBn: 'ঢাকা বিভাগ',
    capital: 'Dhaka',
    capitalBn: 'ঢাকা',
    districtsCount: 13,
    highlight: true,
  },
  {
    id: 'div-chattogram',
    slug: 'chattogram',
    nameEn: 'Chattogram Division',
    nameBn: 'চট্টগ্রাম বিভাগ',
    capital: 'Chattogram',
    capitalBn: 'চট্টগ্রাম',
    districtsCount: 11,
  },
  {
    id: 'div-rajshahi',
    slug: 'rajshahi',
    nameEn: 'Rajshahi Division',
    nameBn: 'রাজশাহী বিভাগ',
    capital: 'Rajshahi',
    capitalBn: 'রাজশাহী',
    districtsCount: 8,
  },
  {
    id: 'div-khulna',
    slug: 'khulna',
    nameEn: 'Khulna Division',
    nameBn: 'খুলনা বিভাগ',
    capital: 'Khulna',
    capitalBn: 'খুলনা',
    districtsCount: 10,
  },
  {
    id: 'div-barishal',
    slug: 'barishal',
    nameEn: 'Barishal Division',
    nameBn: 'বরিশাল বিভাগ',
    capital: 'Barishal',
    capitalBn: 'বরিশাল',
    districtsCount: 6,
  },
  {
    id: 'div-sylhet',
    slug: 'sylhet',
    nameEn: 'Sylhet Division',
    nameBn: 'সিলেট বিভাগ',
    capital: 'Sylhet',
    capitalBn: 'সিলেট',
    districtsCount: 4,
  },
  {
    id: 'div-rangpur',
    slug: 'rangpur',
    nameEn: 'Rangpur Division',
    nameBn: 'রংপুর বিভাগ',
    capital: 'Rangpur',
    capitalBn: 'রংপুর',
    districtsCount: 8,
  },
  {
    id: 'div-mymensingh',
    slug: 'mymensingh',
    nameEn: 'Mymensingh Division',
    nameBn: 'ময়মনসিংহ বিভাগ',
    capital: 'Mymensingh',
    capitalBn: 'ময়মনসিংহ',
    districtsCount: 4,
  },
];

export const BANGLADESH_DISTRICTS: AdministrativeDistrict[] = [
  // Dhaka Division (13)
  { id: 'dist-dhaka', divisionId: 'div-dhaka', divisionSlug: 'dhaka', nameEn: 'Dhaka', nameBn: 'ঢাকা' },
  { id: 'dist-gazipur', divisionId: 'div-dhaka', divisionSlug: 'dhaka', nameEn: 'Gazipur', nameBn: 'গাজীপুর' },
  { id: 'dist-narayanganj', divisionId: 'div-dhaka', divisionSlug: 'dhaka', nameEn: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ' },
  { id: 'dist-tangail', divisionId: 'div-dhaka', divisionSlug: 'dhaka', nameEn: 'Tangail', nameBn: 'টাঙ্গাইল' },
  { id: 'dist-kishoreganj', divisionId: 'div-dhaka', divisionSlug: 'dhaka', nameEn: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ' },
  { id: 'dist-narsingdi', divisionId: 'div-dhaka', divisionSlug: 'dhaka', nameEn: 'Narsingdi', nameBn: 'নরসিংদী' },
  { id: 'dist-manikganj', divisionId: 'div-dhaka', divisionSlug: 'dhaka', nameEn: 'Manikganj', nameBn: 'মানিকগঞ্জ' },
  { id: 'dist-munshiganj', divisionId: 'div-dhaka', divisionSlug: 'dhaka', nameEn: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ' },
  { id: 'dist-faridpur', divisionId: 'div-dhaka', divisionSlug: 'dhaka', nameEn: 'Faridpur', nameBn: 'ফরিদপুর' },
  { id: 'dist-gopalganj', divisionId: 'div-dhaka', divisionSlug: 'dhaka', nameEn: 'Gopalganj', nameBn: 'গোপালগঞ্জ' },
  { id: 'dist-madaripur', divisionId: 'div-dhaka', divisionSlug: 'dhaka', nameEn: 'Madaripur', nameBn: 'মাদারীপুর' },
  { id: 'dist-rajbari', divisionId: 'div-dhaka', divisionSlug: 'dhaka', nameEn: 'Rajbari', nameBn: 'রাজবাড়ী' },
  { id: 'dist-shariatpur', divisionId: 'div-dhaka', divisionSlug: 'dhaka', nameEn: 'Shariatpur', nameBn: 'শরীয়তপুর' },

  // Chattogram Division (11)
  { id: 'dist-chattogram', divisionId: 'div-chattogram', divisionSlug: 'chattogram', nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম' },
  { id: 'dist-coxsbazar', divisionId: 'div-chattogram', divisionSlug: 'chattogram', nameEn: "Cox's Bazar", nameBn: 'কক্সবাজার' },
  { id: 'dist-cumilla', divisionId: 'div-chattogram', divisionSlug: 'chattogram', nameEn: 'Cumilla', nameBn: 'কুমিল্লা' },
  { id: 'dist-feni', divisionId: 'div-chattogram', divisionSlug: 'chattogram', nameEn: 'Feni', nameBn: 'ফেনী' },
  { id: 'dist-brahmanbaria', divisionId: 'div-chattogram', divisionSlug: 'chattogram', nameEn: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া' },
  { id: 'dist-noakhali', divisionId: 'div-chattogram', divisionSlug: 'chattogram', nameEn: 'Noakhali', nameBn: 'নোয়াখালী' },
  { id: 'dist-chandpur', divisionId: 'div-chattogram', divisionSlug: 'chattogram', nameEn: 'Chandpur', nameBn: 'চাঁদপুর' },
  { id: 'dist-lakshmipur', divisionId: 'div-chattogram', divisionSlug: 'chattogram', nameEn: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর' },
  { id: 'dist-rangamati', divisionId: 'div-chattogram', divisionSlug: 'chattogram', nameEn: 'Rangamati', nameBn: 'রাঙ্গামাটি' },
  { id: 'dist-khagrachhari', divisionId: 'div-chattogram', divisionSlug: 'chattogram', nameEn: 'Khagrachhari', nameBn: 'খাগড়াছড়ি' },
  { id: 'dist-bandarban', divisionId: 'div-chattogram', divisionSlug: 'chattogram', nameEn: 'Bandarban', nameBn: 'বান্দরবান' },

  // Rajshahi Division (8)
  { id: 'dist-rajshahi', divisionId: 'div-rajshahi', divisionSlug: 'rajshahi', nameEn: 'Rajshahi', nameBn: 'রাজশাহী' },
  { id: 'dist-bogura', divisionId: 'div-rajshahi', divisionSlug: 'rajshahi', nameEn: 'Bogura', nameBn: 'বগুড়া' },
  { id: 'dist-pabna', divisionId: 'div-rajshahi', divisionSlug: 'rajshahi', nameEn: 'Pabna', nameBn: 'পাবনা' },
  { id: 'dist-sirajganj', divisionId: 'div-rajshahi', divisionSlug: 'rajshahi', nameEn: 'Sirajganj', nameBn: 'সিরাজগঞ্জ' },
  { id: 'dist-naogaon', divisionId: 'div-rajshahi', divisionSlug: 'rajshahi', nameEn: 'Naogaon', nameBn: 'নওগাঁ' },
  { id: 'dist-natore', divisionId: 'div-rajshahi', divisionSlug: 'rajshahi', nameEn: 'Natore', nameBn: 'নাটোর' },
  { id: 'dist-chapainawabganj', divisionId: 'div-rajshahi', divisionSlug: 'rajshahi', nameEn: 'Chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ' },
  { id: 'dist-joypurhat', divisionId: 'div-rajshahi', divisionSlug: 'rajshahi', nameEn: 'Joypurhat', nameBn: 'জয়পুরহাট' },

  // Khulna Division (10)
  { id: 'dist-khulna', divisionId: 'div-khulna', divisionSlug: 'khulna', nameEn: 'Khulna', nameBn: 'খুলনা' },
  { id: 'dist-jashore', divisionId: 'div-khulna', divisionSlug: 'khulna', nameEn: 'Jashore', nameBn: 'যশোর' },
  { id: 'dist-kushtia', divisionId: 'div-khulna', divisionSlug: 'khulna', nameEn: 'Kushtia', nameBn: 'কুষ্টিয়া' },
  { id: 'dist-jhenaidah', divisionId: 'div-khulna', divisionSlug: 'khulna', nameEn: 'Jhenaidah', nameBn: 'ঝিনাইদহ' },
  { id: 'dist-satkhira', divisionId: 'div-khulna', divisionSlug: 'khulna', nameEn: 'Satkhira', nameBn: 'সাতক্ষীরা' },
  { id: 'dist-bagerhat', divisionId: 'div-khulna', divisionSlug: 'khulna', nameEn: 'Bagerhat', nameBn: 'বাগেরহাট' },
  { id: 'dist-chuadanga', divisionId: 'div-khulna', divisionSlug: 'khulna', nameEn: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা' },
  { id: 'dist-meherpur', divisionId: 'div-khulna', divisionSlug: 'khulna', nameEn: 'Meherpur', nameBn: 'মেহেরপুর' },
  { id: 'dist-narail', divisionId: 'div-khulna', divisionSlug: 'khulna', nameEn: 'Narail', nameBn: 'নড়াইল' },
  { id: 'dist-magura', divisionId: 'div-khulna', divisionSlug: 'khulna', nameEn: 'Magura', nameBn: 'মাগুরা' },

  // Barishal Division (6)
  { id: 'dist-barishal', divisionId: 'div-barishal', divisionSlug: 'barishal', nameEn: 'Barishal', nameBn: 'বরিশাল' },
  { id: 'dist-patuakhali', divisionId: 'div-barishal', divisionSlug: 'barishal', nameEn: 'Patuakhali', nameBn: 'পটুয়াখালী' },
  { id: 'dist-bhola', divisionId: 'div-barishal', divisionSlug: 'barishal', nameEn: 'Bhola', nameBn: 'ভোলা' },
  { id: 'dist-pirojpur', divisionId: 'div-barishal', divisionSlug: 'barishal', nameEn: 'Pirojpur', nameBn: 'পিরোজপুর' },
  { id: 'dist-barguna', divisionId: 'div-barishal', divisionSlug: 'barishal', nameEn: 'Barguna', nameBn: 'বরগুনা' },
  { id: 'dist-jhalokathi', divisionId: 'div-barishal', divisionSlug: 'barishal', nameEn: 'Jhalokathi', nameBn: 'ঝালকাঠি' },

  // Sylhet Division (4)
  { id: 'dist-sylhet', divisionId: 'div-sylhet', divisionSlug: 'sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট' },
  { id: 'dist-moulvibazar', divisionId: 'div-sylhet', divisionSlug: 'sylhet', nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার' },
  { id: 'dist-habiganj', divisionId: 'div-sylhet', divisionSlug: 'sylhet', nameEn: 'Habiganj', nameBn: 'হবিগঞ্জ' },
  { id: 'dist-sunamganj', divisionId: 'div-sylhet', divisionSlug: 'sylhet', nameEn: 'Sunamganj', nameBn: 'সুনামগঞ্জ' },

  // Rangpur Division (8)
  { id: 'dist-rangpur', divisionId: 'div-rangpur', divisionSlug: 'rangpur', nameEn: 'Rangpur', nameBn: 'রংপুর' },
  { id: 'dist-dinajpur', divisionId: 'div-rangpur', divisionSlug: 'rangpur', nameEn: 'Dinajpur', nameBn: 'দিনাজপুর' },
  { id: 'dist-gaibandha', divisionId: 'div-rangpur', divisionSlug: 'rangpur', nameEn: 'Gaibandha', nameBn: 'গাইবান্ধা' },
  { id: 'dist-kurigram', divisionId: 'div-rangpur', divisionSlug: 'rangpur', nameEn: 'Kurigram', nameBn: 'কুড়িগ্রাম' },
  { id: 'dist-lalmonirhat', divisionId: 'div-rangpur', divisionSlug: 'rangpur', nameEn: 'Lalmonirhat', nameBn: 'লালমনিরহাট' },
  { id: 'dist-nilphamari', divisionId: 'div-rangpur', divisionSlug: 'rangpur', nameEn: 'Nilphamari', nameBn: 'নীলফামারী' },
  { id: 'dist-panchagarh', divisionId: 'div-rangpur', divisionSlug: 'rangpur', nameEn: 'Panchagarh', nameBn: 'পঞ্চগড়' },
  { id: 'dist-thakurgaon', divisionId: 'div-rangpur', divisionSlug: 'rangpur', nameEn: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও' },

  // Mymensingh Division (4)
  { id: 'dist-mymensingh', divisionId: 'div-mymensingh', divisionSlug: 'mymensingh', nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
  { id: 'dist-jamalpur', divisionId: 'div-mymensingh', divisionSlug: 'mymensingh', nameEn: 'Jamalpur', nameBn: 'জামালপুর' },
  { id: 'dist-netrokona', divisionId: 'div-mymensingh', divisionSlug: 'mymensingh', nameEn: 'Netrokona', nameBn: 'নেত্রকোণা' },
  { id: 'dist-sherpur', divisionId: 'div-mymensingh', divisionSlug: 'mymensingh', nameEn: 'Sherpur', nameBn: 'শেরপুর' },
];

export function getDivisionBySlug(slug: string): AdministrativeDivision | undefined {
  const normalized = slug.toLowerCase().trim();
  return BANGLADESH_DIVISIONS.find((d) => d.slug === normalized || d.nameEn.toLowerCase() === normalized);
}

export function getDistrictsForDivision(divisionSlugOrId: string): AdministrativeDistrict[] {
  const normalized = divisionSlugOrId.toLowerCase().trim();
  return BANGLADESH_DISTRICTS.filter(
    (d) => d.divisionSlug === normalized || d.divisionId === normalized
  );
}
