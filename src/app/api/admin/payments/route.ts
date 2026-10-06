import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const payments = db.getAllPayments();
    const receipts = db.getAllReceipts();
    return NextResponse.json({ success: true, payments, receipts });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
