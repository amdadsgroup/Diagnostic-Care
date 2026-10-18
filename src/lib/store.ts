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

export const INITIAL_APP_STATE: AppState = {
  organizations: [],
  doctors: [],
  doctorAssociations: [],
  assistants: [],
  diagnosticTests: [],
  slots: {},
  appointments: [],
  queues: {},
  subscriptionPlans: [],
  activeHoldSlotId: null,
  holdExpiresAt: null,
};
