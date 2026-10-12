export type HospitalVerificationStatus = 'draft' | 'pending' | 'under_review' | 'verified' | 'rejected' | 'suspended';

export type HospitalStaffRole =
  | 'hospital_owner'
  | 'hospital_manager'
  | 'branch_manager'
  | 'receptionist'
  | 'finance_staff';

export interface HospitalProfile {
  id: string;
  ownerProfileId?: string;
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
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  verificationStatus: HospitalVerificationStatus;
  rating: number;
  totalReviews: number;
  status: 'active' | 'suspended' | 'pending';
  district?: string;
  addressLine?: string;
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
  status: 'active' | 'pending_consent' | 'rejected' | 'ended';
  consultationFee: number;
  followupFee: number;
  chamberRoom?: string;
  startDate: string;
  endDate?: string;
}

export interface HospitalAppointment {
  id: string;
  bookingCode: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  doctorSpecialization?: string;
  branchName: string;
  appointmentDate: string;
  startTime: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  consultationFee: number;
  paymentStatus: 'pending' | 'paid' | 'cash_at_desk';
  chamberRoom?: string;
  cancellationReason?: string;
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
  upcomingAppointmentsCount: number;
  completedAppointmentsCount: number;
  cancelledAppointmentsCount: number;
  profileCompletionPercent: number;
}
