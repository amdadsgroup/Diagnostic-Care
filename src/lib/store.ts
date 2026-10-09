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

  // All schedule slots start AVAILABLE without simulated bookings
  defaultSlots[key] = generated;

  defaultQueues[key] = {
    doctorAssociationId: assoc.id,
    queueDate: TODAY,
    currentTokenServing: 0,
    totalTokensIssued: 0,
    avgConsultationMinutes: 15,
  };
});

// Production clean: Zero seed appointments
const initialAppointments: Appointment[] = [];

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
