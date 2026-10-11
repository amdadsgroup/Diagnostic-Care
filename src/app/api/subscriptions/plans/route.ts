import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/services/subscription.service';

export async function GET(req: NextRequest) {
  try {
    const plans = await SubscriptionService.getPlans();
    return NextResponse.json({ success: true, plans }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch subscription plans' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, adminEmail } = body;

    if (!plan || !plan.name || !plan.code || plan.priceBdt === undefined) {
      return NextResponse.json(
        { success: false, error: 'Plan code, name, and priceBdt are required.' },
        { status: 400 }
      );
    }

    const savedPlan = await SubscriptionService.savePlan(plan, adminEmail || 'contact.amdadur@gmail.com');
    return NextResponse.json({ success: true, plan: savedPlan }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save subscription plan' },
      { status: 500 }
    );
  }
}
