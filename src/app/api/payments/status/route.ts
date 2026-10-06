import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get('ref');

    if (!ref) {
      return NextResponse.json({ success: false, message: 'Reference parameter is required.' }, { status: 400 });
    }

    const payment = db.getPaymentByReference(ref);
    if (!payment) {
      return NextResponse.json({ success: false, message: 'Payment reference not found.' }, { status: 404 });
    }

    const receipt = payment.status === 'PAID' ? db.getReceiptByPaymentReference(payment.paymentReference) : null;

    return NextResponse.json({
      success: true,
      payment,
      receipt,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
