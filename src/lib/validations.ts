/**
 * Diagnostic Care — Validation Schemas (Zod)
 * Centralized runtime validation matching the database constraints.
 * All API boundaries must validate using these schemas.
 */

import { z } from 'zod';

/** Bangladesh phone number: starts with 01, 11 digits total */
const bangladeshPhone = z
  .string()
  .regex(/^01[3-9]\d{8}$/, 'Invalid Bangladesh mobile number (e.g., 01XXXXXXXXX)');

// ─── PATIENT ────────────────────────────────────────────────────────────────

export const PatientRegisterSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters').max(150),
  phone: bangladeshPhone,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  dateOfBirth: z.string().optional(), // YYYY-MM-DD
  age: z.number().int().min(1).max(120).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  email: z.string().email().optional().or(z.literal('')),
  languagePreference: z.enum(['bn', 'en']).default('bn'),
});

export const PatientLoginSchema = z.object({
  phone: bangladeshPhone,
  password: z.string().min(1, 'Password is required'),
});

export const PatientProfileUpdateSchema = z.object({
  fullName: z.string().min(3).max(150).optional(),
  email: z.string().email().optional().or(z.literal('')),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  allergies: z.string().max(500).optional(),
  address: z.string().max(300).optional(),
  emergencyContactName: z.string().max(100).optional(),
  emergencyContactPhone: bangladeshPhone.optional(),
});

export const FamilyMemberSchema = z.object({
  fullName: z.string().min(2).max(150),
  relationship: z.enum(['FATHER', 'MOTHER', 'SPOUSE', 'CHILD', 'SIBLING', 'GRANDPARENT', 'OTHER']),
  dateOfBirth: z.string().optional(),
  age: z.number().int().min(1).max(120).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  phone: bangladeshPhone.optional(),
});

// ─── PROVIDER ONBOARDING ────────────────────────────────────────────────────

export const OrganizationRegisterSchema = z.object({
  name: z.string().min(3, 'Organization name required').max(255),
  orgType: z.enum([
    'DIAGNOSTIC_CENTER',
    'CLINIC',
    'HOSPITAL',
    'PHARMACY',
    'AMBULANCE_AGENCY',
    'HOME_HEALTHCARE_AGENCY',
  ]),
  tradeLicenseNumber: z.string().min(5).max(100),
  contactPhone: bangladeshPhone,
  contactEmail: z.string().email().optional().or(z.literal('')),
  adminFullName: z.string().min(3).max(150),
  adminPassword: z.string().min(8),
  adminPhone: bangladeshPhone,
});

export const BranchSchema = z.object({
  name: z.string().min(3).max(200),
  upazilaId: z.string().uuid(),
  addressLine: z.string().min(10).max(300),
  phone: bangladeshPhone,
  email: z.string().email().optional().or(z.literal('')),
  openingTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format HH:MM'),
  closingTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format HH:MM'),
  latitude: z.number().min(20).max(27).optional(),
  longitude: z.number().min(88).max(93).optional(),
  isMainBranch: z.boolean().default(false),
});

// ─── DOCTOR ─────────────────────────────────────────────────────────────────

export const DoctorProfileSchema = z.object({
  fullName: z.string().min(3).max(150),
  bmdcNumber: z.string().min(4).max(50),
  title: z.enum(['Dr.', 'Prof. Dr.', 'Assoc. Prof. Dr.']).default('Dr.'),
  specialization: z.string().min(3).max(150),
  qualifications: z.string().min(5).max(500),
  experienceYears: z.number().int().min(0).max(60),
  biography: z.string().max(2000).optional(),
  consultationLanguages: z.array(z.string()).min(1),
  phone: bangladeshPhone,
  password: z.string().min(8).optional(), // Only on create
});

export const DoctorAssociationSchema = z.object({
  doctorId: z.string().uuid(),
  branchId: z.string().uuid(),
  chamberRoomNumber: z.string().max(50).optional(),
  consultationFee: z.number().positive().min(1).max(99999),
  followupFee: z.number().min(0).max(99999).default(0),
  followupValidityDays: z.number().int().min(1).max(365).default(14),
});

// ─── SCHEDULE ───────────────────────────────────────────────────────────────

export const DoctorScheduleSchema = z.object({
  doctorAssociationId: z.string().uuid(),
  dayOfWeek: z.enum([
    'SATURDAY',
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
  ]),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format HH:MM'),
  slotDurationMinutes: z.number().int().min(5).max(60).default(15),
  maxPatientCapacity: z.number().int().min(1).max(100).default(20),
}).refine(
  (data) => data.startTime < data.endTime,
  { message: 'End time must be after start time', path: ['endTime'] }
);

// ─── APPOINTMENT BOOKING ─────────────────────────────────────────────────────

export const SlotHoldSchema = z.object({
  slotId: z.string().min(1),
});

export const AppointmentConfirmSchema = z.object({
  slotId: z.string().min(1),
  patientName: z.string().min(2).max(150),
  patientPhone: bangladeshPhone,
  patientAge: z.number().int().min(1).max(120),
  patientGender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  paymentMethod: z.enum(['CASH_AT_DESK', 'BKASH', 'NAGAD', 'SSLCOMMERZ']),
  notes: z.string().max(500).optional(),
  bookingForSelf: z.boolean().default(true),
  familyMemberId: z.string().uuid().optional(),
});

// ─── DIAGNOSTIC BOOKING ──────────────────────────────────────────────────────

export const DiagnosticTestBookingSchema = z.object({
  organizationId: z.string().uuid(),
  branchId: z.string().uuid(),
  testIds: z.array(z.string().uuid()).min(1),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  homeCollection: z.boolean().default(false),
  collectionAddress: z.string().max(300).optional(),
  patientName: z.string().min(2).max(150),
  patientPhone: bangladeshPhone,
  patientAge: z.number().int().min(1).max(120),
  patientGender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  paymentMethod: z.enum(['CASH_AT_DESK', 'BKASH', 'NAGAD']),
});

// ─── PRESCRIPTION ────────────────────────────────────────────────────────────

export const PrescriptionSchema = z.object({
  appointmentId: z.string().uuid().optional(),
  patientUserId: z.string().uuid(),
  clinicalNotes: z.string().max(3000).optional(),
  diagnosis: z.string().max(1000).optional(),
  followupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  medicines: z.array(z.object({
    medicineName: z.string().min(1).max(255),
    dosagePattern: z.string().min(1).max(50),
    mealInstruction: z.enum(['Before Meal', 'After Meal', 'With Meal', 'Empty Stomach', 'At Bedtime']),
    durationDays: z.number().int().min(1).max(365),
    specialNotes: z.string().max(300).optional(),
  })).min(0),
  recommendedTests: z.array(z.string()).optional(),
});

// ─── SUPPORT TICKET ──────────────────────────────────────────────────────────

export const SupportTicketSchema = z.object({
  category: z.enum([
    'BOOKING',
    'PAYMENT',
    'REFUND',
    'DOCTOR',
    'DIAGNOSTIC_CENTER',
    'REPORT',
    'ACCOUNT',
    'TECHNICAL',
    'COMPLAINT',
  ]),
  subject: z.string().min(5).max(200),
  description: z.string().min(10).max(3000),
  contactPhone: bangladeshPhone.optional(),
});

// ─── REVIEW ───────────────────────────────────────────────────────────────────

export const ReviewSchema = z.object({
  appointmentId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
  isAnonymous: z.boolean().default(false),
});

// ─── Type Exports ─────────────────────────────────────────────────────────────
export type PatientRegisterInput = z.infer<typeof PatientRegisterSchema>;
export type PatientLoginInput = z.infer<typeof PatientLoginSchema>;
export type OrganizationRegisterInput = z.infer<typeof OrganizationRegisterSchema>;
export type BranchInput = z.infer<typeof BranchSchema>;
export type DoctorProfileInput = z.infer<typeof DoctorProfileSchema>;
export type DoctorAssociationInput = z.infer<typeof DoctorAssociationSchema>;
export type DoctorScheduleInput = z.infer<typeof DoctorScheduleSchema>;
export type AppointmentConfirmInput = z.infer<typeof AppointmentConfirmSchema>;
export type DiagnosticTestBookingInput = z.infer<typeof DiagnosticTestBookingSchema>;
export type PrescriptionInput = z.infer<typeof PrescriptionSchema>;
export type ReviewInput = z.infer<typeof ReviewSchema>;
