import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { JudiciaryService } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: JudiciaryService = await request.json();
    if (!body.name || !body.code || !body.category || !body.courtType || !body.amount) {
      return NextResponse.json({ success: false, message: 'Missing required service fields.' }, { status: 400 });
    }

    if (!body.id) {
      body.id = `srv-${Date.now()}`;
    }

    const saved = db.saveService(body);
    return NextResponse.json({ success: true, service: saved, message: 'Tariff config saved.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
