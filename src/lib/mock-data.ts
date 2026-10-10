import {
  Division,
  District,
  Upazila,
  Organization,
  Doctor,
  DoctorAssociation,
  DoctorAssistant,
  DiagnosticTest,
  SubscriptionPlan,
} from '@/types';

export const INITIAL_DIVISIONS: Division[] = [
  { id: 'div-sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট' },
  { id: 'div-dhaka', nameEn: 'Dhaka', nameBn: 'ঢাকা' },
  { id: 'div-chittagong', nameEn: 'Chittagong', nameBn: 'চট্টগ্রাম' },
];

export const INITIAL_DISTRICTS: District[] = [
  { id: 'dist-moulvibazar', divisionId: 'div-sylhet', nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার' },
  { id: 'dist-sylhet', divisionId: 'div-sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট' },
  { id: 'dist-habiganj', divisionId: 'div-sylhet', nameEn: 'Habiganj', nameBn: 'হবিগঞ্জ' },
  { id: 'dist-sunamganj', divisionId: 'div-sylhet', nameEn: 'Sunamganj', nameBn: 'সুনামগঞ্জ' },
];

export const INITIAL_UPAZILAS: Upazila[] = [
  { id: 'upz-moulvibazar-sadar', districtId: 'dist-moulvibazar', nameEn: 'Moulvibazar Sadar', nameBn: 'মৌলভীবাজার সদর' },
  { id: 'upz-sreemangal', districtId: 'dist-moulvibazar', nameEn: 'Sreemangal', nameBn: 'শ্রীমঙ্গল' },
  { id: 'upz-kamalganj', districtId: 'dist-moulvibazar', nameEn: 'Kamalganj', nameBn: 'কমলগঞ্জ' },
  { id: 'upz-kulaura', districtId: 'dist-moulvibazar', nameEn: 'Kulaura', nameBn: 'কুলাউড়া' },
  { id: 'upz-barlekha', districtId: 'dist-moulvibazar', nameEn: 'Barlekha', nameBn: 'বড়লেখা' },
  { id: 'upz-rajnagar', districtId: 'dist-moulvibazar', nameEn: 'Rajnagar', nameBn: 'রাজনগর' },
  { id: 'upz-juri', districtId: 'dist-moulvibazar', nameEn: 'Juri', nameBn: 'জুড়ী' },
];

// Production launch ready: Zero mock organizations
export const INITIAL_ORGANIZATIONS: Organization[] = [];

// Production launch ready: Zero mock doctor profiles
export const INITIAL_DOCTORS: Doctor[] = [];

// Production launch ready: Zero mock chamber associations
export const INITIAL_DOCTOR_ASSOCIATIONS: DoctorAssociation[] = [];

// Production launch ready: Zero mock assistant credentials
export const INITIAL_DOCTOR_ASSISTANTS: DoctorAssistant[] = [];

// Production launch ready: Zero mock diagnostic tests
export const INITIAL_DIAGNOSTIC_TESTS: DiagnosticTest[] = [];

export const INITIAL_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-basic',
    code: 'BASIC_200',
    name: 'Basic Center Plan',
    monthlyPrice: 200,
    yearlyPrice: 2000,
    maxBranches: 1,
    maxDoctors: 3,
    maxStaff: 3,
    features: [
      'Digital diagnostic test catalog & pricing',
      'Doctor chamber scheduling',
      'Appointment tracking',
      'Patient SMS alerts',
      'Helpline support (01886748564)',
    ],
    isActive: true,
  },
  {
    id: 'plan-pro',
    code: 'PRO_500',
    name: 'Professional Center Plan',
    monthlyPrice: 500,
    yearlyPrice: 5000,
    maxBranches: 3,
    maxDoctors: 15,
    maxStaff: 20,
    features: [
      'Everything in Basic',
      'Doctor Assistant sandboxed accounts',
      'Live Queue & Token calling screen',
      'Private PDF report upload & SMS link delivery',
      'Daily financial turnover & commission analytics',
      '1% platform commission discount',
    ],
    isActive: true,
  },
  {
    id: 'plan-enterprise',
    code: 'ENTERPRISE_CUSTOM',
    name: 'Enterprise Hospital & Multi-Branch Network',
    monthlyPrice: 1500,
    yearlyPrice: 15000,
    maxBranches: 10,
    maxDoctors: 50,
    maxStaff: 100,
    features: [
      'Everything in Professional',
      'Multi-branch centralized oversight',
      'Custom API integration for laboratory analyzers',
      'Dedicated relationship manager in Moulvibazar',
      'Sponsored placement boost in District search',
    ],
    isActive: true,
  },
];
