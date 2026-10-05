import {
  Organization,
  Doctor,
  DoctorAssociation,
  DoctorAssistant,
  DiagnosticTest,
  ScheduleSlot,
  Appointment,
  QueueState,
  SubscriptionPlan,
} from '@/types';
import {
  INITIAL_ORGANIZATIONS,
  INITIAL_DOCTORS,
  INITIAL_DOCTOR_ASSOCIATIONS,
  INITIAL_DOCTOR_ASSISTANTS,
  INITIAL_DIAGNOSTIC_TESTS,
  INITIAL_SUBSCRIPTION_PLANS,
} from './mock-data';
import { generateDaySlots, isHoldExpired } from './slot-engine';

export interface AppState {
  organizations: Organization[];
  doctors: Doctor[];
  doctorAssociations: DoctorAssociation[];
  assistants: DoctorAssistant[];
  diagnosticTests: DiagnosticTest[];
  slots: Record<string, ScheduleSlot[]>; // keyed by doctorAssociationId_date
  appointments: Appointment[];
  queues: Record<string, QueueState>; // keyed by doctorAssociationId_date
  subscriptionPlans: SubscriptionPlan[];
  activeHoldSlotId: string | null;
  holdExpiresAt: number | null;
}

const TODAY = new Date().toISOString().split('T')[0];

// Initialize default slots for each doctor association
const defaultSlots: Record<string, ScheduleSlot[]> = {};
const defaultQueues: Record<string, QueueState> = {};

INITIAL_DOCTOR_ASSOCIATIONS.forEach((assoc) => {
  const key = `${assoc.id}_${TODAY}`;
  const generated = generateDaySlots({
    doctorScheduleId: `sched-${assoc.id}`,
    doctorAssociationId: assoc.id,
    branchId: assoc.branchId,
    date: TODAY,
    startTime: '16:00',
    endTime: '20:00',
    durationMinutes: 15,
    maxCapacity: 16,
  });

  // Mark first 3 slots as booked to demonstrate active chamber
  if (generated.length >= 3) {
    generated[0].status = 'CONFIRMED';
    generated[1].status = 'CONFIRMED';
    generated[2].status = 'CONFIRMED';
  }

  defaultSlots[key] = generated;

  defaultQueues[key] = {
    doctorAssociationId: assoc.id,
    queueDate: TODAY,
    currentTokenServing: 2,
    totalTokensIssued: 3,
    avgConsultationMinutes: 15,
  };
});

const initialAppointments: Appointment[] = [
  {
    id: 'app-001',
    bookingCode: 'DC-2026-1001',
    scheduleSlotId: 'slot-assoc-anisur-popular-default-0',
    doctorAssociationId: 'assoc-anisur-popular',
    branchId: 'branch-popular-sadar',
    doctorName: 'Dr. Anisur Rahman',
    specialization: 'Cardiologist',
    organizationName: 'Popular Diagnostic Center (Moulvibazar)',
    branchName: 'Moulvibazar Main Branch',
    patientUserId: 'patient-kawsar',
    patientName: 'Kawsar Ahmed',
    patientPhone: '01712000001',
    patientAge: 48,
    patientGender: 'MALE',
    appointmentDate: TODAY,
    startTime: '16:00',
    consultationFee: 800,
    tokenNumber: 1,
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'app-002',
    bookingCode: 'DC-2026-1002',
    scheduleSlotId: 'slot-assoc-anisur-popular-default-1',
    doctorAssociationId: 'assoc-anisur-popular',
    branchId: 'branch-popular-sadar',
    doctorName: 'Dr. Anisur Rahman',
    specialization: 'Cardiologist',
    organizationName: 'Popular Diagnostic Center (Moulvibazar)',
    branchName: 'Moulvibazar Main Branch',
    patientUserId: 'patient-nasreen',
    patientName: 'Nasreen Begum',
    patientPhone: '01819000002',
    patientAge: 42,
    patientGender: 'FEMALE',
    appointmentDate: TODAY,
    startTime: '16:15',
    consultationFee: 800,
    tokenNumber: 2,
    status: 'IN_PROGRESS',
    paymentStatus: 'PAID',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'app-003',
    bookingCode: 'DC-2026-1003',
    scheduleSlotId: 'slot-assoc-anisur-popular-default-2',
    doctorAssociationId: 'assoc-anisur-popular',
    branchId: 'branch-popular-sadar',
    doctorName: 'Dr. Anisur Rahman',
    specialization: 'Cardiologist',
    organizationName: 'Popular Diagnostic Center (Moulvibazar)',
    branchName: 'Moulvibazar Main Branch',
    patientUserId: 'patient-tarek',
    patientName: 'Tarek Chowdhury',
    patientPhone: '01911000003',
    patientAge: 35,
    patientGender: 'MALE',
    appointmentDate: TODAY,
    startTime: '16:30',
    consultationFee: 800,
    tokenNumber: 3,
    status: 'CHECKED_IN',
    paymentStatus: 'CASH_AT_DESK',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_APP_STATE: AppState = {
  organizations: INITIAL_ORGANIZATIONS,
  doctors: INITIAL_DOCTORS,
  doctorAssociations: INITIAL_DOCTOR_ASSOCIATIONS,
  assistants: INITIAL_DOCTOR_ASSISTANTS,
  diagnosticTests: INITIAL_DIAGNOSTIC_TESTS,
  slots: defaultSlots,
  appointments: initialAppointments,
  queues: defaultQueues,
  subscriptionPlans: INITIAL_SUBSCRIPTION_PLANS,
  activeHoldSlotId: null,
  holdExpiresAt: null,
};
