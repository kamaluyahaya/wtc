import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const staff = db.getStaffRecords();
    return NextResponse.json({ success: true, staff });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const fullName = body.fullName?.trim() || body.name?.trim() || 'New Staff Officer';
    const email = body.email?.trim() || `officer_${Date.now()}@judiciary.kd.gov.ng`;
    const role = body.role || 'JUDICIARY_REVENUE_OFFICER';
    const courtDivision = body.courtDivision?.trim() || 'High Court Division 1 Kaduna';
    const phone = body.phone?.trim() || '';

    const created = db.addStaffRecord({
      fullName,
      email,
      role,
      courtDivision,
      phone,
      status: 'ACTIVE',
    });

    return NextResponse.json({
      success: true,
      staff: created,
      message: 'Staff record created successfully.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
