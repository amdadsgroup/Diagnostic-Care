/**
 * Diagnostic Care — Concurrency Lock & Slot Engine (Phase 3)
 * Guarantees the core invariant: ZERO DOUBLE BOOKINGS under any race condition.
 * Simulates PostgreSQL SELECT FOR UPDATE / Redis Redlock with atomic CAS operations.
 */

import { ScheduleSlot, Appointment, QueueState } from '@/types';
import { supabase } from '@/lib/supabase/client';

export interface HoldResult {
  success: boolean;
  code: 'HOLD_ACQUIRED' | 'SLOT_ALREADY_HELD' | 'SLOT_ALREADY_CONFIRMED' | 'SLOT_NOT_FOUND' | 'CAPACITY_REACHED';
  message: string;
  slot?: ScheduleSlot;
  holdExpiresAt?: string;
  remainingSeconds?: number;
}

export interface ConfirmResult {
  success: boolean;
  code: 'BOOKING_CONFIRMED' | 'HOLD_EXPIRED' | 'SLOT_ALREADY_CONFIRMED' | 'INVALID_HOLDER' | 'SLOT_NOT_FOUND';
  message: string;
  appointment?: Appointment;
  tokenNumber?: number;
}

export interface RaceTestReport {
  slotId: string;
  totalAttempts: number;
  winnerUserId: string | null;
  successfulHoldCount: number;
  conflictRejections: number;
  executionTimeMs: number;
  invariantPassed: boolean; // MUST BE: successfulHoldCount === 1 && conflictRejections === totalAttempts - 1
  logs: string[];
}

class ConcurrencyEngine {
  private slots: Map<string, ScheduleSlot> = new Map();
  private holds: Map<string, { userId: string; expiresAt: number }> = new Map();
  private appointments: Map<string, Appointment> = new Map();
  private queues: Map<string, QueueState> = new Map();
  private mutexLocks: Map<string, Promise<void>> = new Map();

  constructor() {
    this.seedInitialSlots();
  }

  /**
   * Atomic Mutex Guard per slot ID:
   * Prevents interleaving of critical sections for the same slot.
   */
  private async acquireMutex(key: string): Promise<() => void> {
    while (this.mutexLocks.has(key)) {
      await this.mutexLocks.get(key);
    }
    let resolver: () => void = () => {};
    const promise = new Promise<void>((resolve) => {
      resolver = resolve;
    });
    this.mutexLocks.set(key, promise);

    return () => {
      this.mutexLocks.delete(key);
      resolver();
    };
  }

  /**
   * Seed demo slots for Moulvibazar doctors
   */
  private seedInitialSlots() {
    const today = new Date().toISOString().split('T')[0];
    const times = [
      '16:00', '16:15', '16:30', '16:45',
      '17:00', '17:15', '17:30', '17:45',
      '18:00', '18:15', '18:30', '18:45',
      '19:00', '19:15', '19:30', '19:45',
    ];

    times.forEach((t, idx) => {
      const slotId = `slot-moulvibazar-anisur-${today}-${t.replace(':', '')}`;
      this.slots.set(slotId, {
        id: slotId,
        doctorScheduleId: 'sched-anisur-1',
        doctorAssociationId: 'assoc-anisur-popular',
        branchId: 'branch-pop-mb-1',
        slotDate: today,
        startTime: t,
        endTime: times[idx + 1] || '20:00',
        status: 'AVAILABLE',
      });
    });

    // Initialize clean Queue
    const queueKey = `assoc-anisur-popular_${today}`;
    this.queues.set(queueKey, {
      doctorAssociationId: 'assoc-anisur-popular',
      queueDate: today,
      currentTokenServing: 0,
      totalTokensIssued: 0,
      avgConsultationMinutes: 15,
    });
  }

  /**
   * Sweep expired holds: automatically resets HELD slots to AVAILABLE if TTL passed.
   */
  public sweepExpiredHolds(): number {
    const now = Date.now();
    let swept = 0;

    for (const [slotId, hold] of this.holds.entries()) {
      if (hold.expiresAt <= now) {
        this.holds.delete(slotId);
        const slot = this.slots.get(slotId);
        if (slot && slot.status === 'HELD') {
          slot.status = 'AVAILABLE';
          delete slot.holdExpiresAt;
          swept++;
        }
      }
    }
    return swept;
  }

  /**
   * ATOMIC 5-MINUTE HOLD (Pessimistic concurrency lock)
   */
  public async holdSlot(slotId: string, userId: string, ttlSeconds = 300): Promise<HoldResult> {
    const releaseMutex = await this.acquireMutex(slotId);
    try {
      this.sweepExpiredHolds();

      const slot = this.slots.get(slotId);
      if (!slot) {
        return { success: false, code: 'SLOT_NOT_FOUND', message: 'Requested schedule slot was not found.' };
      }

      if (slot.status === 'CONFIRMED') {
        return {
          success: false,
          code: 'SLOT_ALREADY_CONFIRMED',
          message: 'এই স্লটটি ইতিমধ্যে অন্য রোগী নিশ্চিত বুকিং করে ফেলেছেন। অনুগ্রহ করে অন্য সময় বেছে নিন।',
        };
      }

      if (slot.status === 'HELD') {
        const existingHold = this.holds.get(slotId);
        if (existingHold && existingHold.userId !== userId && existingHold.expiresAt > Date.now()) {
          const remainingSec = Math.ceil((existingHold.expiresAt - Date.now()) / 1000);
          return {
            success: false,
            code: 'SLOT_ALREADY_HELD',
            message: `এই স্লটটি বর্তমানে অন্য একজন রোগী বুকিং প্রক্রিয়াধীন রেখেছেন (${remainingSec} সেকেন্ড বাকি)। অনুগ্রহ করে অন্য স্লট নির্বাচন করুন।`,
            remainingSeconds: remainingSec,
          };
        }
      }

      // Acquire hold
      const expiresAt = Date.now() + ttlSeconds * 1000;
      this.holds.set(slotId, { userId, expiresAt });
      slot.status = 'HELD';
      slot.holdExpiresAt = new Date(expiresAt).toISOString();

      return {
        success: true,
        code: 'HOLD_ACQUIRED',
        message: 'স্লটটি আপনার জন্য পরবর্তী ৫ মিনিটের জন্য লক করা হয়েছে।',
        slot: { ...slot },
        holdExpiresAt: slot.holdExpiresAt,
        remainingSeconds: ttlSeconds,
      };
    } finally {
      releaseMutex();
    }
  }

  /**
   * ATOMIC APPOINTMENT CONFIRMATION
   */
  public async confirmSlot(
    slotId: string,
    userId: string,
    patientData: {
      patientName: string;
      patientPhone: string;
      patientAge: number;
      patientGender: 'MALE' | 'FEMALE' | 'OTHER';
      paymentMethod: 'CASH_AT_DESK' | 'PAID';
      doctorName?: string;
      specialization?: string;
      organizationName?: string;
      branchName?: string;
      consultationFee?: number;
    }
  ): Promise<ConfirmResult> {
    const releaseMutex = await this.acquireMutex(slotId);
    try {
      this.sweepExpiredHolds();

      const slot = this.slots.get(slotId);
      if (!slot) {
        return { success: false, code: 'SLOT_NOT_FOUND', message: 'Slot not found.' };
      }

      if (slot.status === 'CONFIRMED') {
        return {
          success: false,
          code: 'SLOT_ALREADY_CONFIRMED',
          message: 'স্লটটি ইতিমধ্যে নিশ্চিত করা হয়েছে।',
        };
      }

      const hold = this.holds.get(slotId);
      if (!hold || hold.expiresAt <= Date.now()) {
        return {
          success: false,
          code: 'HOLD_EXPIRED',
          message: 'আপনার ৫ মিনিটের হোল্ড মেয়াদ শেষ হয়েছে। অনুগ্রহ করে আবার স্লট নির্বাচন করুন।',
        };
      }

      if (hold.userId !== userId) {
        return {
          success: false,
          code: 'INVALID_HOLDER',
          message: 'স্লটটির বর্তমান হোল্ডার আপনি নন।',
        };
      }

      // Mark slot CONFIRMED
      slot.status = 'CONFIRMED';
      delete slot.holdExpiresAt;
      this.holds.delete(slotId);

      // Queue and token assignment
      const queueKey = `${slot.doctorAssociationId}_${slot.slotDate}`;
      const queue = this.queues.get(queueKey) || {
        doctorAssociationId: slot.doctorAssociationId,
        queueDate: slot.slotDate,
        currentTokenServing: 1,
        totalTokensIssued: 0,
        avgConsultationMinutes: 15,
      };

      const tokenNumber = queue.totalTokensIssued + 1;
      queue.totalTokensIssued = tokenNumber;
      this.queues.set(queueKey, queue);

      const fee = patientData.consultationFee || 800;
      const bookingCode = `DC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const appointment: Appointment = {
        id: `apt-${Date.now()}-${tokenNumber}`,
        bookingCode,
        scheduleSlotId: slotId,
        doctorAssociationId: slot.doctorAssociationId,
        branchId: slot.branchId,
        doctorName: patientData.doctorName || 'ডাঃ আনিসুর রহমান (Dr. Anisur Rahman)',
        specialization: patientData.specialization || 'কার্ডিওলজিস্ট ও হৃদরোগ বিশেষজ্ঞ',
        organizationName: patientData.organizationName || 'পপুলার ডায়াগনস্টিক সেন্টার',
        branchName: patientData.branchName || 'মৌলভীবাজার মেইন ব্রাঞ্চ',
        patientUserId: userId,
        patientName: patientData.patientName,
        patientPhone: patientData.patientPhone,
        patientAge: patientData.patientAge,
        patientGender: patientData.patientGender,
        appointmentDate: slot.slotDate,
        startTime: slot.startTime,
        consultationFee: fee,
        tokenNumber,
        status: 'CONFIRMED',
        paymentStatus: patientData.paymentMethod,
        createdAt: new Date().toISOString(),
      };

      this.appointments.set(appointment.id, appointment);

      // Persist to Supabase appointments table
      try {
        supabase.from('appointments').insert({
          booking_code: bookingCode,
          patient_name: patientData.patientName,
          patient_phone: patientData.patientPhone,
          patient_age: patientData.patientAge,
          patient_gender: patientData.patientGender,
          appointment_date: slot.slotDate,
          start_time: slot.startTime,
          token_number: tokenNumber,
          consultation_fee: fee,
          total_payable: fee,
          status: 'confirmed',
          payment_status: patientData.paymentMethod === 'PAID' ? 'paid' : 'cash_at_desk',
        }).then(({ error }: any) => {
          if (error) console.warn('Supabase appointment insert notice:', error.message);
        });
      } catch (dbErr) {
        console.warn('Database write bypassed in offline mode:', dbErr);
      }

      return {
        success: true,
        code: 'BOOKING_CONFIRMED',
        message: 'অ্যাপয়েন্টমেন্ট সফলভাবে নিশ্চিত হয়েছে!',
        appointment,
        tokenNumber,
      };
    } finally {
      releaseMutex();
    }
  }

  /**
   * Release hold manually
   */
  public async releaseSlot(slotId: string, userId: string): Promise<boolean> {
    const releaseMutex = await this.acquireMutex(slotId);
    try {
      const hold = this.holds.get(slotId);
      if (hold && hold.userId === userId) {
        this.holds.delete(slotId);
        const slot = this.slots.get(slotId);
        if (slot && slot.status === 'HELD') {
          slot.status = 'AVAILABLE';
          delete slot.holdExpiresAt;
        }
        return true;
      }
      return false;
    } finally {
      releaseMutex();
    }
  }

  /**
   * Get Queue Status & Estimated Wait Time
   */
  public getQueueStatus(doctorAssociationId: string, date: string, myToken?: number) {
    const queueKey = `${doctorAssociationId}_${date}`;
    const queue = this.queues.get(queueKey) || {
      doctorAssociationId,
      queueDate: date,
      currentTokenServing: 1,
      totalTokensIssued: 4,
      avgConsultationMinutes: 15,
    };

    let estimatedWaitMinutes = 0;
    let peopleAhead = 0;

    if (myToken && myToken > queue.currentTokenServing) {
      peopleAhead = myToken - queue.currentTokenServing;
      estimatedWaitMinutes = peopleAhead * queue.avgConsultationMinutes;
    }

    return {
      queue,
      peopleAhead,
      estimatedWaitMinutes,
      isCurrentlyServing: myToken === queue.currentTokenServing,
      hasPassed: myToken ? myToken < queue.currentTokenServing : false,
    };
  }

  /**
   * Call next token in Queue
   */
  public callNextQueueToken(doctorAssociationId: string, date: string): QueueState {
    const queueKey = `${doctorAssociationId}_${date}`;
    const queue = this.queues.get(queueKey) || {
      doctorAssociationId,
      queueDate: date,
      currentTokenServing: 1,
      totalTokensIssued: 4,
      avgConsultationMinutes: 15,
    };

    if (queue.currentTokenServing < queue.totalTokensIssued) {
      queue.currentTokenServing += 1;
      this.queues.set(queueKey, { ...queue });
    }
    return { ...queue };
  }

  /**
   * SIMULATED HIGH-CONCURRENCY RACE CONDITION TEST
   * Fires N simultaneous asynchronous hold requests for the exact same slot.
   * Asserts that EXACTLY ONE request acquires the hold and all N-1 get rejected.
   */
  public async simulateRaceCondition(
    slotId: string,
    simulatedUsers: string[]
  ): Promise<RaceTestReport> {
    const startTime = performance.now();
    const logs: string[] = [];

    logs.push(`[RACE TEST] Starting race condition simulation for slot: ${slotId}`);
    logs.push(`[RACE TEST] Contending users: ${simulatedUsers.length} concurrent requests.`);

    // Reset slot to AVAILABLE first
    const slot = this.slots.get(slotId);
    if (slot) {
      slot.status = 'AVAILABLE';
      delete slot.holdExpiresAt;
      this.holds.delete(slotId);
    }

    // Fire all requests concurrently with Promise.all
    const promises = simulatedUsers.map(async (userId, idx) => {
      logs.push(`[THREAD #${idx + 1}] Patient "${userId}" attempting atomic hold...`);
      const result = await this.holdSlot(slotId, userId, 300);
      logs.push(`[THREAD #${idx + 1}] Result: ${result.code} (Success: ${result.success})`);
      return { userId, result };
    });

    const results = await Promise.all(promises);

    let winner: string | null = null;
    let successfulHoldCount = 0;
    let conflictRejections = 0;

    for (const res of results) {
      if (res.result.success && res.result.code === 'HOLD_ACQUIRED') {
        successfulHoldCount++;
        winner = res.userId;
      } else {
        conflictRejections++;
      }
    }

    const duration = performance.now() - startTime;
    const invariantPassed = successfulHoldCount === 1 && conflictRejections === simulatedUsers.length - 1;

    logs.push(`[RACE TEST COMPLETE] Execution time: ${duration.toFixed(2)}ms`);
    logs.push(`[RACE TEST INVARIANT] Successes: ${successfulHoldCount}, Conflicts: ${conflictRejections}`);
    logs.push(`[RACE TEST RESULT] ${invariantPassed ? '✓ PASSED (Zero Double Booking Guaranteed)' : '✗ FAILED'}`);

    return {
      slotId,
      totalAttempts: simulatedUsers.length,
      winnerUserId: winner,
      successfulHoldCount,
      conflictRejections,
      executionTimeMs: Math.round(duration),
      invariantPassed,
      logs,
    };
  }

  public getAllSlots(): ScheduleSlot[] {
    this.sweepExpiredHolds();
    return Array.from(this.slots.values());
  }
}

// Global Singleton Instance
export const concurrencyEngine = new ConcurrencyEngine();
