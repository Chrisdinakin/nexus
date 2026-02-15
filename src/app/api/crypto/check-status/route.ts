import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus, simulatePaymentConfirmation } from '@/lib/crypto-gateway';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Missing required parameter: paymentId' },
        { status: 400 }
      );
    }

    const status = getPaymentStatus(paymentId);

    if (!status) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error('Check payment status error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}

// POST to simulate a payment confirmation (development only)
export async function POST(request: NextRequest) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Missing required field: paymentId' },
        { status: 400 }
      );
    }

    const success = simulatePaymentConfirmation(paymentId);

    if (!success) {
      return NextResponse.json(
        { error: 'Payment not found or cannot be updated' },
        { status: 404 }
      );
    }

    const status = getPaymentStatus(paymentId);
    return NextResponse.json(status);
  } catch (error) {
    console.error('Simulate payment error:', error);
    return NextResponse.json(
      { error: 'Failed to simulate payment' },
      { status: 500 }
    );
  }
}
