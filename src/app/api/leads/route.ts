import { NextRequest, NextResponse } from 'next/server';
import { servicesEngine } from '@/lib/services-engine';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stage = (searchParams.get('stage') as any) || undefined;

    const leads = servicesEngine.getLeads(stage);
    return NextResponse.json({ success: true, count: leads.length, leads }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const businessName = body.businessName || body.organizationName;
    const phone = body.phone || body.contactPhone;
    const contactPerson = body.contactPerson || body.contactName;
    const email = body.email;
    const providerType = body.providerType;
    const leadSource = body.leadSource || 'WEB_ONBOARDING';
    const stage = body.stage || 'NEW';
    const assignedToAgentName = body.assignedToAgentName;
    const districtName = body.districtName || body.district;
    const potentialMonthlyRevenueBDT = body.potentialMonthlyRevenueBDT;
    const nextFollowupDate = body.nextFollowupDate;

    if (!businessName || !phone) {
      return NextResponse.json(
        { success: false, error: 'Business name and contact phone are required.' },
        { status: 400 }
      );
    }

    const compiledNotes = body.notes || [
      body.licenseNumber ? `Trade License: ${body.licenseNumber}` : null,
      body.dghsNumber ? `DGHS: ${body.dghsNumber}` : null,
      body.address ? `Address: ${body.address}` : null,
      body.selectedPlanTier ? `Plan: ${body.selectedPlanTier} (${body.billingInterval || 'monthly'})` : null,
    ].filter(Boolean).join(' | ') || 'New provider lead';

    const lead = servicesEngine.createLead({
      businessName,
      contactPerson: contactPerson || 'Authorized Representative',
      phone,
      email,
      providerType: providerType || 'DIAGNOSTIC_CENTER',
      leadSource,
      stage,
      assignedToAgentName: assignedToAgentName || 'Lead Team',
      districtName: districtName || 'Moulvibazar',
      potentialMonthlyRevenueBDT: potentialMonthlyRevenueBDT || 10000,
      notes: compiledNotes,
      nextFollowupDate: nextFollowupDate || new Date().toISOString().split('T')[0],
    });

    // Persist to Supabase provider_leads
    try {
      const supabase = createServerClient();
      await supabase.from('provider_leads').insert({
        organization_name: businessName,
        provider_type: (providerType || 'diagnostic_center').toLowerCase(),
        contact_person: contactPerson || 'Authorized Representative',
        phone,
        email: email || null,
        notes: compiledNotes,
        lead_status: 'new',
      });
    } catch (dbErr) {
      console.warn('Database lead write notice:', dbErr);
    }

    return NextResponse.json(
      { success: true, message: 'Lead recorded successfully in CRM.', lead },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create lead' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, stage, note } = body;

    if (!leadId || !stage) {
      return NextResponse.json(
        { success: false, error: 'leadId and stage are required.' },
        { status: 400 }
      );
    }

    const updated = servicesEngine.updateLeadStage(leadId, stage, note);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Lead stage updated.' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update lead' },
      { status: 500 }
    );
  }
}
