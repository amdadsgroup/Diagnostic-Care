import { ScheduleSlot, Appointment, QueueState, SlotStatus } from '@/types';

export interface GenerateSlotsParams {
  doctorScheduleId: string;
  doctorAssociationId: string;
  branchId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  durationMinutes: number;
  maxCapacity: number;
}

/**
 * Generates discrete time slots for a given chamber schedule window.
 */
export function generateDaySlots(params: GenerateSlotsParams): ScheduleSlot[] {
  const { doctorScheduleId, doctorAssociationId, branchId, date, startTime, endTime, durationMinutes, maxCapacity } = params;

  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const startTotalMinutes = startHour * 60 + startMin;
  const endTotalMinutes = endHour * 60 + endMin;

  const slots: ScheduleSlot[] = [];
  let currentMinutes = startTotalMinutes;
  let count = 0;

  while (currentMinutes + durationMinutes <= endTotalMinutes && count < maxCapacity) {
    const slotStartH = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
    const slotStartM = (currentMinutes % 60).toString().padStart(2, '0');

    const nextMinutes = currentMinutes + durationMinutes;
    const slotEndH = Math.floor(nextMinutes / 60).toString().padStart(2, '0');
    const slotEndM = (nextMinutes % 60).toString().padStart(2, '0');

    slots.push({
      id: `slot-${doctorAssociationId}-${date}-${slotStartH}${slotStartM}`,
      doctorScheduleId,
      doctorAssociationId,
      branchId,
      slotDate: date,
      startTime: `${slotStartH}:${slotStartM}`,
      endTime: `${slotEndH}:${slotEndM}`,
      status: 'AVAILABLE',
    });

    currentMinutes += durationMinutes;
    count++;
  }

  return slots;
}

/**
 * Evaluates whether a slot is currently expired from temporary 5-min hold.
 */
export function isHoldExpired(slot: ScheduleSlot): boolean {
  if (slot.status !== 'HELD') return false;
  if (!slot.holdExpiresAt) return true;
  return new Date(slot.holdExpiresAt).getTime() < Date.now();
}

/**
 * Computes remaining hold seconds for a slot.
 */
export function getRemainingHoldSeconds(slot: ScheduleSlot): number {
  if (slot.status !== 'HELD' || !slot.holdExpiresAt) return 0;
  const diffMs = new Date(slot.holdExpiresAt).getTime() - Date.now();
  return Math.max(0, Math.floor(diffMs / 1000));
}
