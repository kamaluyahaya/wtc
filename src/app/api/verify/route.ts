import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || searchParams.get('ref') || searchParams.get('receiptNo');

    if (!query) {
      return NextResponse.json(
        { success: false, message: 'Please provide a receipt number or payment reference.' },
        { status: 400 }
      );
    }

    const receipt = db.getReceipt(query);
    if (!receipt) {
      const paymentAttempt = db.getPaymentByReference(query);
      if (paymentAttempt) {
        return NextResponse.json({
          success: true,
          found: true,
          verified: false,
          paymentStatus: paymentAttempt.status,
          message: `Payment reference found but status is ${paymentAttempt.status}. Official receipt requires successful payment verification.`,
          paymentAttempt,
        });
      }
      return NextResponse.json({
        success: true,
        found: false,
        verified: false,
        message: 'No record found matching the provided Receipt Number or Payment Reference.',
      });
    }

    return NextResponse.json({
      success: true,
      found: true,
      verified: true,
      receipt,
      message: 'Official Kaduna State Judiciary Electronic Receipt verified successfully.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
