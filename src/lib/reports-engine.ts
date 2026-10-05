/**
 * Diagnostic Care — Secure Medical Report & Prescription Engine (Phase 4)
 * Enforces Zero-Leakage Policy for protected medical documents.
 * All downloads require cryptographically signed HMAC-SHA256 tokens with 15-minute expiry.
 * Every access attempt is immutably logged for clinical audit.
 */

import crypto from 'crypto';
import { DiagnosticReport, Prescription } from '@/types';

const SECRET_KEY = process.env.REPORT_SIGNING_SECRET || 'diagnostic-care-moulvibazar-2026-audit-secret-key-98234';

export interface SignedReportUrl {
  reportId: string;
  signedUrl: string;
  expiresAt: string; // ISO string
  remainingSeconds: number;
}

export interface ReportAccessLog {
  id: string;
  reportId: string;
  userId: string;
  ipAddress: string;
  timestamp: string;
  action: 'URL_GENERATED' | 'DOWNLOAD_SUCCESS' | 'DOWNLOAD_UNAUTHORIZED' | 'TOKEN_EXPIRED';
  userAgent?: string;
}

class ReportsEngine {
  private reports: Map<string, DiagnosticReport> = new Map();
  private prescriptions: Map<string, Prescription> = new Map();
  private auditLogs: ReportAccessLog[] = [];

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    // Demo Diagnostic Reports
    const report1: DiagnosticReport = {
      id: 'rep-cbc-9021',
      bookingId: 'DC-2026-9021',
      testId: 'test-cbc-1',
      testName: 'Complete Blood Count (CBC) with ESR',
      patientUserId: 'user-patient-current',
      patientName: 'তানভীর আহমেদ (Tanvir Ahmed)',
      organizationName: 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার মেইন ব্রাঞ্চ)',
      fileName: 'cbc_tanvir_9021.pdf',
      fileSizeBytes: 428000,
      verifiedByName: 'ডাঃ এস. এম. ফারুক',
      verifiedByDesignation: 'MBBS, M.Phil - কনসালট্যান্ট প্যাথলজিস্ট',
      releasedAt: '2026-10-04T14:30:00Z',
      secureDownloadToken: 'token-cbc-sig-9021',
    };

    const report2: DiagnosticReport = {
      id: 'rep-lipid-8714',
      bookingId: 'DC-2026-8714',
      testId: 'test-lipid-2',
      testName: 'Lipid Profile Panel (Fasting 12h)',
      patientUserId: 'user-patient-current',
      patientName: 'তানভীর আহমেদ (Tanvir Ahmed)',
      organizationName: 'মৌলভীবাজার সেন্ট্রাল ক্লিনিক ও ডায়াগনস্টিক',
      fileName: 'lipid_tanvir_8714.pdf',
      fileSizeBytes: 356000,
      verifiedByName: 'ডাঃ নাসরিন সুলতানা',
      verifiedByDesignation: 'এমবিবিএস, এফসিপিএস - বায়োকেমিস্ট্রি',
      releasedAt: '2026-09-28T16:00:00Z',
      secureDownloadToken: 'token-lipid-sig-8714',
    };

    this.reports.set(report1.id, report1);
    this.reports.set(report2.id, report2);

    // Demo Prescriptions
    const rx1: Prescription = {
      id: 'rx-2026-001',
      appointmentId: 'apt-1',
      doctorId: 'doc-anisur-1',
      doctorName: 'ডাঃ আনিসুর রহমান',
      doctorQualifications: 'এমবিবিএস, এফসিপিএস (কার্ডিওলজি)',
      bmdcNumber: 'A-34891',
      organizationName: 'পপুলার ডায়াগনস্টিক সেন্টার (মৌলভীবাজার মেইন ব্রাঞ্চ)',
      patientName: 'তানভীর আহমেদ',
      patientAge: 34,
      patientGender: 'MALE',
      date: '2026-10-05',
      diagnosis: 'Primary Hypertension (Stage 1) with Mild Hypertriglyceridemia',
      clinicalNotes: 'Blood pressure recorded at chamber: 140/90 mmHg. Follow-up after 14 days with updated BP chart.',
      medicines: [
        { id: 'm-1', name: 'Tab. Concor (Bisoprolol) 2.5mg', dosagePattern: '1 + 0 + 0', mealInstruction: 'সকালে খাবারের পর', durationDays: 30, specialNotes: 'নিয়মিত খাবেন' },
        { id: 'm-2', name: 'Tab. Rosuva (Rosuvastatin) 10mg', dosagePattern: '0 + 0 + 1', mealInstruction: 'রাতে খাবারের পর', durationDays: 30, specialNotes: 'চর্বিযুক্ত খাবার পরিহার করবেন' },
      ],
      recommendedTests: ['Lipid Profile (Fasting)', 'Serum Creatinine', 'ECG (12 Leads)'],
      followupDate: '2026-10-19',
    };

    this.prescriptions.set(rx1.id, rx1);
  }

  /**
   * Generates a 15-minute cryptographically signed download URL for a medical report.
   */
  public generateSignedReportUrl(
    reportId: string,
    requestingUserId: string,
    clientIp = '127.0.0.1'
  ): SignedReportUrl {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    // Access control verification: Only owning patient or clinical admin can generate link
    if (report.patientUserId !== requestingUserId && requestingUserId !== 'SUPER_ADMIN') {
      this.auditLogs.push({
        id: `log-${Date.now()}`,
        reportId,
        userId: requestingUserId,
        ipAddress: clientIp,
        timestamp: new Date().toISOString(),
        action: 'DOWNLOAD_UNAUTHORIZED',
      });
      throw new Error('UNAUTHORIZED_ACCESS: Zero-Leakage Policy prevents unauthorized report retrieval');
    }

    // 15-minute TTL (900 seconds)
    const expiresTimestamp = Date.now() + 15 * 60 * 1000;
    const dataToSign = `${reportId}:${requestingUserId}:${expiresTimestamp}`;
    const signature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(dataToSign)
      .digest('hex');

    const signedUrl = `/api/reports/download/${reportId}?expires=${expiresTimestamp}&user=${encodeURIComponent(requestingUserId)}&sig=${signature}`;

    this.auditLogs.push({
      id: `log-${Date.now()}`,
      reportId,
      userId: requestingUserId,
      ipAddress: clientIp,
      timestamp: new Date().toISOString(),
      action: 'URL_GENERATED',
    });

    return {
      reportId,
      signedUrl,
      expiresAt: new Date(expiresTimestamp).toISOString(),
      remainingSeconds: 900,
    };
  }

  /**
   * Verifies the cryptographic HMAC token and returns certified report payload.
   */
  public verifyAndRetrieveReport(
    reportId: string,
    userId: string,
    expiresStr: string,
    sig: string,
    clientIp = '127.0.0.1'
  ): DiagnosticReport {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    const expiresTimestamp = parseInt(expiresStr, 10);
    if (isNaN(expiresTimestamp) || Date.now() > expiresTimestamp) {
      this.auditLogs.push({
        id: `log-${Date.now()}`,
        reportId,
        userId,
        ipAddress: clientIp,
        timestamp: new Date().toISOString(),
        action: 'TOKEN_EXPIRED',
      });
      throw new Error('TOKEN_EXPIRED: Signed link has expired (15-minute TTL). Please request a fresh link.');
    }

    // Recompute expected signature
    const dataToSign = `${reportId}:${userId}:${expiresTimestamp}`;
    const expectedSig = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(dataToSign)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      this.auditLogs.push({
        id: `log-${Date.now()}`,
        reportId,
        userId,
        ipAddress: clientIp,
        timestamp: new Date().toISOString(),
        action: 'DOWNLOAD_UNAUTHORIZED',
      });
      throw new Error('INVALID_SIGNATURE: Tampered or invalid cryptographic signature');
    }

    this.auditLogs.push({
      id: `log-${Date.now()}`,
      reportId,
      userId,
      ipAddress: clientIp,
      timestamp: new Date().toISOString(),
      action: 'DOWNLOAD_SUCCESS',
    });

    return report;
  }

  public getAllReports(userId = 'user-patient-current'): DiagnosticReport[] {
    return Array.from(this.reports.values()).filter(
      (r) => r.patientUserId === userId || userId === 'SUPER_ADMIN'
    );
  }

  public getAllPrescriptions(): Prescription[] {
    return Array.from(this.prescriptions.values());
  }

  public getAuditLogs(): ReportAccessLog[] {
    return this.auditLogs;
  }
}

export const reportsEngine = new ReportsEngine();
