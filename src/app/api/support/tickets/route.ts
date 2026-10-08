import { NextRequest, NextResponse } from 'next/server';
import { servicesEngine } from '@/lib/services-engine';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const tickets = servicesEngine.getSupportTickets();
    return NextResponse.json({ success: true, count: tickets.length, tickets }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch support tickets' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { requesterUserId, requesterName, requesterPhone, subject, category, priority, message } = body;

    if (!subject || !category || !message) {
      return NextResponse.json(
        { success: false, error: 'Subject, category, and message are required.' },
        { status: 400 }
      );
    }

    const ticket = servicesEngine.createSupportTicket({
      requesterUserId: requesterUserId || 'user-patient-current',
      requesterName: requesterName || 'General User',
      requesterPhone: requesterPhone || '01886748564',
      subject,
      category,
      priority: priority || 'MEDIUM',
      message,
    });

    // Persist to Supabase support_tickets
    try {
      const supabase = createServerClient();
      const ticketCode = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;
      await supabase.from('support_tickets').insert({
        ticket_code: ticketCode,
        name: requesterName || 'General User',
        phone: requesterPhone || '01886748564',
        subject,
        category: category.toLowerCase(),
        description: message,
        priority: (priority || 'medium').toLowerCase(),
        status: 'open',
      });
    } catch (dbErr) {
      console.warn('Database ticket insert notice:', dbErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'অভিযোগ / টিকিট সফলভাবে নথিবদ্ধ করা হয়েছে। কাস্টমার কেয়ার দ্রুত যোগাযোগ করবে।',
        ticket,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create support ticket' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketId, senderUserId, senderName, senderRole, message } = body;

    if (!ticketId || !message) {
      return NextResponse.json(
        { success: false, error: 'ticketId and message are required.' },
        { status: 400 }
      );
    }

    const updated = servicesEngine.addSupportMessage(
      ticketId,
      {
        userId: senderUserId || 'agent-support-1',
        name: senderName || 'Support Agent',
        role: senderRole || 'SUPPORT_AGENT',
      },
      message
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Message appended to ticket.' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update ticket' },
      { status: 500 }
    );
  }
}
