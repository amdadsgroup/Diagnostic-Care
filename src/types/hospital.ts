export type HospitalVerificationStatus = 'draft' | 'pending' | 'under_review' | 'verified' | 'rejected' | 'suspended';

export type InstitutionType = 'hospital' | 'diagnostic_center' | 'combined';

export type HospitalStaffRole =
  | 'hospital_owner'
  | 'hospital_manager'
  | 'branch_manager'
  | 'receptionist'
  | 'diagnostic_staff'
  | 'finance_staff'
  | 'billing_staff'
  | 'doctor';

export interface HospitalProfile {
  id: string;
  ownerProfileId?: string;
  institutionType?: InstitutionType;
  name: string;
  nameBn?: string;
  slug: string;
  tradeLicenseNumber?: string;
  dghsRegistrationNumber?: string;
  phone: string;
  emergencyPhone?: string;
  email?: string;
  website?: string;
  totalBeds: number;
  icuBeds: number;
  hasIcu: boolean;
  hasNicu: boolean;
  hasEmergency247: boolean;
  hasHomeSampleCollection?: boolean;
  description?: string;
  descriptionBn?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  verificationStatus: HospitalVerificationStatus;
  rating: number;
  totalReviews: number;
  status: 'active' | 'suspended' | 'pending';
  district?: string;
  division?: string;
  upazila?: string;
  addressLine?: string;
  authorizedPersonName?: string;
  authorizedPersonPhone?: string;
}

export interface HospitalBranch {
  id: string;
  hospitalId: string;
  branchName: string;
  branchNameBn?: string;
  isMainBranch: boolean;
  addressLine: string;
  district: string;
  division?: string;
  phone: string;
  openingTime: string;
  closingTime: string;
  status: 'active' | 'inactive';
  assignedDoctorsCount?: number;
}

export interface HospitalDepartment {
  id: string;
  hospitalId: string;
  name: string;
  nameBn?: string;
  code?: string;
  description?: string;
  headDoctorId?: string;
  headDoctorName?: string;
  isActive: boolean;
  doctorCount?: number;
}

export interface HospitalDoctorAssociation {
  id: string;
  hospitalId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  bmdcRegistrationNumber: string;
  branchId?: string;
  branchName?: string;
  departmentId?: string;
  departmentName?: string;
  status: 'active' | 'pending_consent' | 'rejected' | 'ended' | 'inactive';
  consultationFee: number;
  followupFee: number;
  chamberRoom?: string;
  startDate: string;
  endDate?: string;
  phone?: string;
  email?: string;
  qualifications?: string;
  experienceYears?: number;
  daysOfWeek?: string[];
  visitingStartTime?: string;
  visitingEndTime?: string;
  slotDurationMinutes?: number;
  dailySerialLimit?: number;
  isOnlineEnabled?: boolean;
  isManualEnabled?: boolean;
  isOnLeave?: boolean;
  leaveReason?: string;
  verificationStatus?: 'verified' | 'pending' | 'unverified';
}

export interface HospitalAppointment {
  id: string;
  bookingCode: string;
  serialNumber?: number;
  doctorId?: string;
  branchId?: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: 'MALE' | 'FEMALE' | 'OTHER';
  doctorName: string;
  doctorSpecialization?: string;
  branchName: string;
  appointmentDate: string;
  startTime: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show' | 'rejected';
  consultationFee: number;
  paymentStatus: 'pending' | 'paid' | 'cash_at_desk' | 'unpaid';
  bookingSource?: 'online' | 'manual' | 'phone_call' | 'walk_in';
  notes?: string;
  chamberRoom?: string;
  cancellationReason?: string;
  createdAt?: string;
}

export interface HospitalServiceItem {
  id: string;
  hospitalId: string;
  serviceId?: string;
  name: string;
  nameBn?: string;
  category: string;
  priceBdt: number;
  discountPriceBdt?: number;
  isAvailable: boolean;
  branchId?: string;
  branchName?: string;
}

export interface HospitalStaffMember {
  id: string;
  hospitalId: string;
  branchId?: string;
  branchName?: string;
  fullName: string;
  email: string;
  phone: string;
  role: HospitalStaffRole;
  status: 'active' | 'invited' | 'revoked';
  canManageAppointments: boolean;
  canManageDoctors: boolean;
  canManageServices: boolean;
  canManageBilling: boolean;
  canViewAnalytics: boolean;
}

export interface HospitalNotification {
  id: string;
  hospitalId: string;
  type: string;
  title: string;
  titleBn?: string;
  message: string;
  messageBn?: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface HospitalDashboardStats {
  verificationStatus: HospitalVerificationStatus;
  currentPlanName: string;
  currentPlanTier: string;
  subscriptionStatus: string;
  nextRenewalDate: string;
  branchLimit: number;
  serviceLimit: number;
  staffLimit: number;
  totalDoctors: number;
  activeBranches: number;
  activeDepartments: number;
  publishedServices: number;
  todayAppointmentsCount: number;
  pendingAppointmentsCount: number;
  confirmedAppointmentsCount: number;
  upcomingAppointmentsCount: number;
  completedAppointmentsCount: number;
  cancelledAppointmentsCount: number;
  totalDiagnosticBookings: number;
  activeDiagnosticTests: number;
  outstandingBalanceBdt: number;
  profileCompletionPercent: number;
}

export type DiagnosticBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'sample_collected'
  | 'processing'
  | 'report_ready'
  | 'delivered'
  | 'cancelled';

export interface DiagnosticBookingItem {
  id: string;
  bookingId: string;
  testId?: string;
  testName: string;
  price: number;
}

export interface DiagnosticBooking {
  id: string;
  bookingCode: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  diagnosticCenterId: string;
  branchId?: string;
  branchName?: string;
  bookingDate: string;
  preferredTime?: string;
  isHomeCollection: boolean;
  collectionAddress?: string;
  totalAmount: number;
  discountAmount: number;
  netPayable: number;
  paymentStatus: 'pending' | 'paid' | 'cash_at_desk';
  status: DiagnosticBookingStatus;
  items?: DiagnosticBookingItem[];
  reportUrl?: string;
  reportCode?: string;
  reportPublishedAt?: string;
  createdAt: string;
}

export interface LabTestItem {
  id: string;
  diagnosticCenterId: string;
  name: string;
  nameBn?: string;
  category: string;
  sampleType?: string;
  turnaroundHours: number;
  preparationInstructions?: string;
  preparationInstructionsBn?: string;
  price: number;
  discountPrice?: number;
  isHomeSampleSupported: boolean;
  isAvailable: boolean;
  branchId?: string;
  branchName?: string;
}
