/**
 * Diagnostic Care — Communication Gateway (SMS & Email)
 * Production Integration:
 * - Greenweb Bangladesh SMS Gateway / SSL Wireless SMS
 * - Transactional Booking & Verification SMS
 * - Email SMTP / SendGrid Gateway
 */

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: 'GREENWEB' | 'SSL_WIRELESS' | 'MOCK_SANDBOX';
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class CommunicationGateway {
  private static GREENWEB_API_URL = 'http://api.greenweb.com.bd/api.php';
  private static GREENWEB_TOKEN = process.env.GREENWEB_SMS_TOKEN || process.env.SMS_API_KEY || '';
  
  /**
   * Send Transactional SMS to Bangladesh Mobile Number (+8801... or 01...)
   */
  static async sendSMS(params: {
    to: string;
    message: string;
  }): Promise<SMSResponse> {
    const rawPhone = params.to.trim();
    // Normalize phone number to Bangladesh standard (01XXXXXXXXX)
    let formattedPhone = rawPhone.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('880')) {
      formattedPhone = '0' + formattedPhone.slice(3);
    } else if (!formattedPhone.startsWith('0') && formattedPhone.length === 10) {
      formattedPhone = '0' + formattedPhone;
    }

    if (!/^01[3-9]\d{8}$/.test(formattedPhone)) {
      console.warn(`[SMS Gateway] Invalid Bangladesh phone number format: ${params.to}`);
      return {
        success: false,
        error: 'Invalid Bangladesh mobile number format (must be 01XXXXXXXXX)',
        provider: 'MOCK_SANDBOX',
      };
    }

    // In production with token, dispatch to Greenweb SMS Gateway
    if (this.GREENWEB_TOKEN) {
      try {
        const formData = new URLSearchParams();
        formData.append('token', this.GREENWEB_TOKEN);
        formData.append('to', formattedPhone);
        formData.append('message', params.message);

        const response = await fetch(this.GREENWEB_API_URL, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const resText = await response.text();
        const isOk = response.ok && !resText.toLowerCase().includes('error');

        return {
          success: isOk,
          messageId: `GW-${Date.now()}`,
          error: isOk ? undefined : resText,
          provider: 'GREENWEB',
        };
      } catch (err: any) {
        console.error('[SMS Gateway] Greenweb SMS dispatch failed:', err);
        return {
          success: false,
          error: err.message || 'SMS transmission failed',
          provider: 'GREENWEB',
        };
      }
    }

    // Fallback/Sandbox Mock Mode
    console.log(`[SMS Gateway SANDBOX] To: ${formattedPhone} | Message: ${params.message}`);
    return {
      success: true,
      messageId: `SANDBOX-SMS-${Date.now()}`,
      provider: 'MOCK_SANDBOX',
    };
  }

  /**
   * Send Automated Booking Confirmation SMS
   */
  static async sendBookingConfirmationSMS(params: {
    patientPhone: string;
    patientName: string;
    doctorOrTestName: string;
    centerName: string;
    slotTime: string;
    bookingCode: string;
  }): Promise<SMSResponse> {
    const text = `Diagnostic Care: প্রিয় ${params.patientName}, আপনার বুকিং #${params.bookingCode} নিশ্চিত হয়েছে। ${params.doctorOrTestName}, ${params.centerName}। সময়: ${params.slotTime}। হেল্পলাইন: 01886748564`;
    return this.sendSMS({ to: params.patientPhone, message: text });
  }

  /**
   * Send Live Queue Position Reminder SMS
   */
  static async sendQueueReminderSMS(params: {
    patientPhone: string;
    serialNumber: number;
    estimatedMinutes: number;
    doctorName: string;
  }): Promise<SMSResponse> {
    const text = `Diagnostic Care সতর্কতা: ডাক্তার ${params.doctorName}-এর সিরিয়াল নং ${params.serialNumber}। অনুগ্রহ করে আগামী ${params.estimatedMinutes} মিনিটের মধ্যে চেম্বারে উপস্থিত থাকুন।`;
    return this.sendSMS({ to: params.patientPhone, message: text });
  }

  /**
   * Send Diagnostic Report Ready SMS
   */
  static async sendReportReadySMS(params: {
    patientPhone: string;
    patientName: string;
    testName: string;
    reportDownloadUrl: string;
  }): Promise<SMSResponse> {
    const text = `Diagnostic Care: প্রিয় ${params.patientName}, আপনার ${params.testName} রিপোর্ট তৈরি হয়েছে। ডাউনলোড লিঙ্ক: ${params.reportDownloadUrl}`;
    return this.sendSMS({ to: params.patientPhone, message: text });
  }

  /**
   * Send Transactional Email
   */
  static async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
  }): Promise<EmailResponse> {
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (sendgridApiKey) {
      try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sendgridApiKey}`,
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: params.to }] }],
            from: { email: process.env.EMAIL_FROM || 'support@diagnosticcare.com', name: 'Diagnostic Care' },
            subject: params.subject,
            content: [{ type: 'text/html', value: params.html }],
          }),
        });

        if (response.status >= 200 && response.status < 300) {
          return { success: true, messageId: `SG-${Date.now()}` };
        } else {
          const errText = await response.text();
          return { success: false, error: errText };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Local / Dev Fallback Email
    console.log(`[Email Gateway SANDBOX] To: ${params.to} | Subject: ${params.subject}`);
    return {
      success: true,
      messageId: `SANDBOX-MAIL-${Date.now()}`,
    };
  }
}
