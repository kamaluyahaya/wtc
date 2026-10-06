import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentReference, gatewayTransactionId, status } = body;

    if (!paymentReference || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing paymentReference or status parameter.' },
        { status: 400 }
      );
    }

    const result = db.processPaymentWebhook({
      paymentReference,
      gatewayTransactionId,
      status: status as 'PAID' | 'FAILED' | 'CANCELLED',
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      payment: result.payment,
      receipt: result.receipt,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
