export type UserRole =
  | 'PATIENT'
  | 'DOCTOR'
  | 'DOCTOR_ASSISTANT'
  | 'DIAGNOSTIC_ADMIN'
  | 'DIAGNOSTIC_STAFF'
  | 'CLINIC_ADMIN'
  | 'CLINIC_STAFF'
  | 'HOSPITAL_ADMIN'
  | 'HOSPITAL_STAFF'
  | 'PHARMACY_ADMIN'
  | 'PHARMACY_STAFF'
  | 'AMBULANCE_PROVIDER'
  | 'HOME_HEALTHCARE_PROVIDER'
  | 'SUPPORT_AGENT'
  | 'SALES_AGENT'
  | 'OPERATIONS_MANAGER'
  | 'FINANCE_MANAGER'
  | 'SUPER_ADMIN';

export type VerificationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'SUSPENDED';

export type SlotStatus = 'AVAILABLE' | 'HELD' | 'CONFIRMED' | 'BLOCKED';

export type AppointmentStatus =
  | 'AVAILABLE'
  | 'HELD'
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED_BY_PATIENT'
  | 'CANCELLED_BY_PROVIDER'
  | 'NO_SHOW'
  | 'EXPIRED'
  | 'WAITLISTED';

export interface User {
  id: string;
  phone: string;
  email?: string;
  fullName: string;
  primaryRole: UserRole;
  isActive: boolean;
  isVerified: boolean;
  avatarUrl?: string;
  languagePreference: 'bn' | 'en';
  createdAt: string;
}

export interface Division {
  id: string;
  nameEn: string;
  nameBn: string;
}

export interface District {
  id: string;
  divisionId: string;
  nameEn: string;
  nameBn: string;
}

export interface Upazila {
  id: string;
  districtId: string;
  nameEn: string;
  nameBn: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  orgType: 'DIAGNOSTIC_CENTER' | 'CLINIC' | 'HOSPITAL' | 'PHARMACY';
  tradeLicenseNumber?: string;
  logoUrl?: string;
  contactPhone: string;
  contactEmail?: string;
  verificationStatus: VerificationStatus;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  branches: Branch[];
}

export interface Branch {
  id: string;
  organizationId: string;
  name: string;
  isMainBranch: boolean;
  upazilaId: string;
  upazilaName: string;
  districtName: string;
  addressLine: string;
  phone: string;
  openingTime: string;
  closingTime: string;
  isActive: boolean;
}

export interface Doctor {
  id: string;
  userId: string;
  fullName: string;
  bmdcNumber: string;
  title: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  biography?: string;
  avatarUrl?: string;
  verificationStatus: VerificationStatus;
  rating: number;
  reviewCount: number;
  languages: string[];
}

export interface DoctorAssociation {
  id: string;
  doctorId: string;
  organizationId: string;
  organizationName: string;
  branchId: string;
  branchName: string;
  districtName: string;
  upazilaName: string;
  chamberRoomNumber: string;
  consultationFee: number;
  followupFee: number;
  followupValidityDays: number;
  commissionRatePercent: number;
  isActive: boolean;
  doctor?: Doctor;
}

export interface DoctorAssistant {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  doctorAssociationId: string;
  canManageQueue: boolean;
  canViewPatientVitals: boolean;
  isActive: boolean;
}

export interface DoctorSchedule {
  id: string;
  doctorAssociationId: string;
  dayOfWeek: 'SATURDAY' | 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';
  startTime: string; // "08:00"
  endTime: string;   // "12:00"
  slotDurationMinutes: number; // 15
  maxPatientCapacity: number;  // 16
  isActive: boolean;
}

export interface ScheduleSlot {
  id: string;
  doctorScheduleId: string;
  doctorAssociationId: string;
  branchId: string;
  slotDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  status: SlotStatus;
  heldByUserId?: string;
  holdExpiresAt?: string; // ISO timestamp
}

export interface Appointment {
  id: string;
  bookingCode: string;
  scheduleSlotId: string;
  doctorAssociationId: string;
  branchId: string;
  doctorName: string;
  specialization: string;
  organizationName: string;
  branchName: string;
  patientUserId: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'MALE' | 'FEMALE' | 'OTHER';
  appointmentDate: string;
  startTime: string;
  consultationFee: number;
  tokenNumber: number;
  status: AppointmentStatus;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED' | 'CASH_AT_DESK';
  notes?: string;
  createdAt: string;
}

export interface QueueState {
  doctorAssociationId: string;
  queueDate: string;
  currentTokenServing: number;
  totalTokensIssued: number;
  avgConsultationMinutes: number;
}

export interface DiagnosticTest {
  id: string;
  organizationId: string;
  organizationName: string;
  branchId?: string;
  name: string;
  code: string;
  category: string;
  description: string;
  preparationInstructions: string;
  sampleType: string;
  expectedDeliveryHours: number;
  price: number;
  discountPrice?: number;
  homeCollectionAvailable: boolean;
  isActive: boolean;
}

export interface DiagnosticReport {
  id: string;
  bookingId: string;
  testId: string;
  testName: string;
  patientUserId: string;
  patientName: string;
  organizationName: string;
  fileName: string;
  fileSizeBytes: number;
  verifiedByName: string;
  verifiedByDesignation: string;
  releasedAt: string;
  secureDownloadToken: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  doctorQualifications: string;
  bmdcNumber: string;
  organizationName: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  date: string;
  clinicalNotes: string;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  recommendedTests: string[];
  followupDate?: string;
}

export interface PrescriptionMedicine {
  id: string;
  name: string;
  dosagePattern: string; // e.g. "1+0+1"
  mealInstruction: string; // e.g. "After Meal"
  durationDays: number;
  specialNotes?: string;
}

export interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxBranches: number;
  maxDoctors: number;
  maxStaff: number;
  features: string[];
  isActive: boolean;
}
