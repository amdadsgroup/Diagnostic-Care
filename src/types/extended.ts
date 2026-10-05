/**
 * Diagnostic Care — Enhanced Domain Types (Phase 2)
 * Extends Phase 1 types with Patient Auth, Family Members,
 * Doctor Schedule Builder, Provider Onboarding, and Reviews.
 */

export interface PatientProfile {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  age?: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies?: string;
  address?: string;
  districtName?: string;
  upazilaName?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  avatarUrl?: string;
  languagePreference: 'bn' | 'en';
  familyMembers: FamilyMember[];
  favoriteProviderIds: string[];
  favoriteDoctorIds: string[];
  totalAppointments: number;
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  patientUserId: string;
  fullName: string;
  relationship: 'FATHER' | 'MOTHER' | 'SPOUSE' | 'CHILD' | 'SIBLING' | 'GRANDPARENT' | 'OTHER';
  age?: number;
  dateOfBirth?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  phone?: string;
}

export interface AuthSession {
  userId: string;
  fullName: string;
  phone: string;
  role: string;
  organizationId?: string;
  branchId?: string;
  doctorAssociationId?: string;
  isVerified: boolean;
  token: string; // JWT
}

export type AuthView = 'login' | 'register' | 'forgot-password' | 'verified';

export interface ProviderOnboardingState {
  step: 1 | 2 | 3 | 4 | 5;
  orgName: string;
  orgType: string;
  tradeLicense: string;
  contactPhone: string;
  adminName: string;
  adminPhone: string;
  adminPassword: string;
  mainBranchName: string;
  selectedDivision: string;
  selectedDistrict: string;
  selectedUpazila: string;
  branchAddress: string;
  branchPhone: string;
  openingTime: string;
  closingTime: string;
  documentUploaded: boolean;
  submittedForReview: boolean;
}

export type OnboardingStep =
  | 'org-details'
  | 'branch-setup'
  | 'document-upload'
  | 'admin-account'
  | 'review-submit';

export interface ScheduleBuilderState {
  doctorAssociationId: string;
  selectedDays: string[];
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  maxPatientCapacity: number;
  breakStartTime?: string;
  breakEndTime?: string;
  advanceBookingDays: number;
  sameDayBookingEnabled: boolean;
  sameDayCutoffMinutes: number; // minutes before session start
}

export interface DoctorPortalState {
  todayAppointments: DoctorAppointmentItem[];
  upcomingAppointments: DoctorAppointmentItem[];
  currentQueueToken: number;
  totalTokens: number;
  completedToday: number;
  revenueToday: number;
  nextPatient?: DoctorAppointmentItem;
}

export interface DoctorAppointmentItem {
  id: string;
  bookingCode: string;
  tokenNumber: number;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'MALE' | 'FEMALE' | 'OTHER';
  patientBloodGroup?: string;
  startTime: string;
  appointmentDate: string;
  status: import('./').AppointmentStatus;
  paymentStatus: string;
  consultationFee: number;
  isPrescriptionCreated: boolean;
  notes?: string;
}

export interface PatientHealthRecord {
  userId: string;
  appointments: import('./').Appointment[];
  prescriptions: import('./').Prescription[];
  reports: import('./').DiagnosticReport[];
  familyMembers: FamilyMember[];
}

export interface ReviewItem {
  id: string;
  appointmentId: string;
  patientName: string;
  isAnonymous: boolean;
  doctorName?: string;
  organizationName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  isVerified: boolean; // Only from completed transactions
}

export interface SupportTicket {
  id: string;
  ticketCode: string;
  userId: string;
  category: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AnalyticsSummary {
  organizationId: string;
  periodLabel: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  cancellationRate: number;
  totalRevenue: number;
  platformCommission: number;
  providerEarnings: number;
  uniquePatients: number;
  repeatPatients: number;
  peakHour: string;
  topDoctor: string;
  topTest: string;
  branchBreakdown: {
    branchName: string;
    bookings: number;
    revenue: number;
  }[];
}

export interface SearchResult {
  type: 'DOCTOR' | 'DIAGNOSTIC_CENTER' | 'TEST';
  id: string;
  name: string;
  subtitle: string;
  location: string;
  districtName: string;
  rating: number;
  reviewCount: number;
  price?: number;
  verificationStatus: string;
  isSponsored: boolean;
  availableToday: boolean;
  nextSlot?: string;
}

export interface NotificationItem {
  id: string;
  type:
    | 'BOOKING_CONFIRMED'
    | 'BOOKING_CANCELLED'
    | 'APPOINTMENT_REMINDER'
    | 'REPORT_READY'
    | 'PRESCRIPTION_AVAILABLE'
    | 'QUEUE_CALLED'
    | 'PAYMENT_CONFIRMED'
    | 'SUBSCRIPTION_RENEWAL';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}
