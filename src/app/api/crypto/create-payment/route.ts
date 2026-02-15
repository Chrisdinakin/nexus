import { NextRequest, NextResponse } from 'next/server';
import { createCryptoPayment } from '@/lib/crypto-gateway';
import { CryptoCurrency, CryptoNetwork } from '@/types/crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, currency, network, amountUsd, customerEmail } = body;

    // Validate required fields
    if (!orderId || !currency || !network || !amountUsd || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, currency, network, amountUsd, customerEmail' },
        { status: 400 }
      );
    }

    // Validate currency
    const validCurrencies: CryptoCurrency[] = ['USDC', 'USDT', 'BTC'];
    if (!validCurrencies.includes(currency)) {
      return NextResponse.json(
        { error: `Invalid currency. Supported: ${validCurrencies.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate network
    const validNetworks: CryptoNetwork[] = ['ethereum', 'polygon', 'tron', 'bitcoin'];
    if (!validNetworks.includes(network)) {
      return NextResponse.json(
        { error: `Invalid network. Supported: ${validNetworks.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate amount
    if (typeof amountUsd !== 'number' || amountUsd <= 0) {
      return NextResponse.json(
        { error: 'amountUsd must be a positive number' },
        { status: 400 }
      );
    }

    const payment = await createCryptoPayment({
      orderId,
      currency,
      network,
      amountUsd,
      customerEmail,
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Create crypto payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment. Please try again.' },
      { status: 500 }
    );
  }
}
