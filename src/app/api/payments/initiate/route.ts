import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payerName, payerEmail, payerPhone, serviceId, quantity, fieldData } = body;

    if (!payerName || !payerEmail || !payerPhone || !serviceId) {
      return NextResponse.json(
        { success: false, message: 'Missing required payer or service details.' },
        { status: 400 }
      );
    }

    const payment = db.initiatePayment({
      payerName,
      payerEmail,
      payerPhone,
      serviceId,
      quantity: Number(quantity) || 1,
      fieldData: fieldData || {},
    });

    return NextResponse.json({
      success: true,
      payment,
      message: 'Payment reference successfully generated.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
