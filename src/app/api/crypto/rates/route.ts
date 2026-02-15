import { NextResponse } from 'next/server';
import { getCryptoRates } from '@/lib/crypto-gateway';

export async function GET() {
  try {
    const rates = await getCryptoRates();
    return NextResponse.json({ rates, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Fetch crypto rates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crypto rates' },
      { status: 500 }
    );
  }
}
