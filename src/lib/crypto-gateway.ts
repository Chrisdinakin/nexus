import {
  CryptoCurrency,
  CryptoNetwork,
  CryptoPaymentRequest,
  CryptoPaymentResponse,
  CryptoPaymentStatus,
  CryptoRate,
  PaymentStatusResponse,
} from '@/types/crypto';

// ─── Merchant Wallet Addresses ───────────────────────────────────────────────
// In production, these come from env vars or a wallet management service.
// Each order should ideally get a unique derived address (HD wallet / payment processor).

const MERCHANT_WALLETS: Record<CryptoNetwork, string> = {
  ethereum: process.env.MERCHANT_ETH_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD68',
  polygon: process.env.MERCHANT_POLYGON_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD68',
  tron: process.env.MERCHANT_TRON_ADDRESS || 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9',
  bitcoin: process.env.MERCHANT_BTC_ADDRESS || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
};

// ─── In-Memory Payment Store ─────────────────────────────────────────────────
// In production, use a database (PostgreSQL, Redis, etc.)

interface StoredPayment {
  paymentId: string;
  orderId: string;
  currency: CryptoCurrency;
  network: CryptoNetwork;
  walletAddress: string;
  amountCrypto: string;
  amountUsd: number;
  exchangeRate: number;
  expiresAt: Date;
  status: CryptoPaymentStatus;
  confirmations: number;
  requiredConfirmations: number;
  txHash?: string;
  amountReceived?: string;
  customerEmail: string;
  createdAt: Date;
}

const paymentStore = new Map<string, StoredPayment>();

// ─── Rate Fetching ───────────────────────────────────────────────────────────

interface CoinGeckoResponse {
  bitcoin?: { usd: number; usd_24h_change: number };
  'usd-coin'?: { usd: number; usd_24h_change: number };
  tether?: { usd: number; usd_24h_change: number };
}

const COINGECKO_IDS: Record<CryptoCurrency, string> = {
  BTC: 'bitcoin',
  USDC: 'usd-coin',
  USDT: 'tether',
};

// Cache rates for 60 seconds to avoid rate limits
let rateCache: { rates: CryptoRate[]; timestamp: number } | null = null;
const RATE_CACHE_TTL = 60_000;

export async function getCryptoRates(): Promise<CryptoRate[]> {
  // Return cached rates if still fresh
  if (rateCache && Date.now() - rateCache.timestamp < RATE_CACHE_TTL) {
    return rateCache.rates;
  }

  try {
    const ids = Object.values(COINGECKO_IDS).join(',');
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: CoinGeckoResponse = await response.json();

    const rates: CryptoRate[] = [
      {
        currency: 'BTC',
        usdRate: data.bitcoin?.usd ?? 97500,
        change24h: data.bitcoin?.usd_24h_change ?? 0,
        lastUpdated: new Date().toISOString(),
      },
      {
        currency: 'USDC',
        usdRate: data['usd-coin']?.usd ?? 1.0,
        change24h: data['usd-coin']?.usd_24h_change ?? 0,
        lastUpdated: new Date().toISOString(),
      },
      {
        currency: 'USDT',
        usdRate: data.tether?.usd ?? 1.0,
        change24h: data.tether?.usd_24h_change ?? 0,
        lastUpdated: new Date().toISOString(),
      },
    ];

    rateCache = { rates, timestamp: Date.now() };
    return rates;
  } catch (error) {
    console.error('Failed to fetch crypto rates:', error);

    // Fallback rates
    return [
      { currency: 'BTC', usdRate: 97500, change24h: 0, lastUpdated: new Date().toISOString() },
      { currency: 'USDC', usdRate: 1.0, change24h: 0, lastUpdated: new Date().toISOString() },
      { currency: 'USDT', usdRate: 1.0, change24h: 0, lastUpdated: new Date().toISOString() },
    ];
  }
}

// ─── Payment Creation ────────────────────────────────────────────────────────

function generatePaymentId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let result = 'cp_';
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getRequiredConfirmations(network: CryptoNetwork): number {
  const map: Record<CryptoNetwork, number> = {
    ethereum: 12,
    polygon: 30,
    tron: 20,
    bitcoin: 3,
  };
  return map[network];
}

function getPaymentExpiry(): Date {
  // 30-minute payment window
  return new Date(Date.now() + 30 * 60 * 1000);
}

function formatCryptoAmount(amount: number, currency: CryptoCurrency): string {
  if (currency === 'BTC') {
    return amount.toFixed(8);
  }
  // Stablecoins: 2 decimal places
  return amount.toFixed(2);
}

function buildQrCodeData(
  currency: CryptoCurrency,
  network: CryptoNetwork,
  address: string,
  amount: string
): string {
  switch (currency) {
    case 'BTC':
      return `bitcoin:${address}?amount=${amount}`;
    case 'USDC':
    case 'USDT':
      if (network === 'tron') {
        return `tron:${address}?amount=${amount}&token=${currency}`;
      }
      // EIP-681 for Ethereum/Polygon
      return `ethereum:${address}?value=${amount}&token=${currency}`;
    default:
      return address;
  }
}

export async function createCryptoPayment(
  request: CryptoPaymentRequest
): Promise<CryptoPaymentResponse> {
  const rates = await getCryptoRates();
  const rate = rates.find(r => r.currency === request.currency);

  if (!rate) {
    throw new Error(`Unsupported currency: ${request.currency}`);
  }

  const walletAddress = MERCHANT_WALLETS[request.network];
  if (!walletAddress) {
    throw new Error(`Unsupported network: ${request.network}`);
  }

  const amountCrypto = request.amountUsd / rate.usdRate;
  const formattedAmount = formatCryptoAmount(amountCrypto, request.currency);
  const paymentId = generatePaymentId();
  const expiresAt = getPaymentExpiry();
  const qrCodeData = buildQrCodeData(request.currency, request.network, walletAddress, formattedAmount);

  const payment: StoredPayment = {
    paymentId,
    orderId: request.orderId,
    currency: request.currency,
    network: request.network,
    walletAddress,
    amountCrypto: formattedAmount,
    amountUsd: request.amountUsd,
    exchangeRate: rate.usdRate,
    expiresAt,
    status: 'pending',
    confirmations: 0,
    requiredConfirmations: getRequiredConfirmations(request.network),
    customerEmail: request.customerEmail,
    createdAt: new Date(),
  };

  paymentStore.set(paymentId, payment);

  return {
    paymentId,
    orderId: request.orderId,
    currency: request.currency,
    network: request.network,
    walletAddress,
    amountCrypto: formattedAmount,
    amountUsd: request.amountUsd,
    exchangeRate: rate.usdRate,
    expiresAt: expiresAt.toISOString(),
    status: 'pending',
    qrCodeData,
  };
}

// ─── Payment Status ──────────────────────────────────────────────────────────

export function getPaymentStatus(paymentId: string): PaymentStatusResponse | null {
  const payment = paymentStore.get(paymentId);
  if (!payment) return null;

  // Check if payment has expired
  if (payment.status === 'pending' && new Date() > payment.expiresAt) {
    payment.status = 'expired';
    paymentStore.set(paymentId, payment);
  }

  return {
    paymentId: payment.paymentId,
    status: payment.status,
    confirmations: payment.confirmations,
    requiredConfirmations: payment.requiredConfirmations,
    txHash: payment.txHash,
    amountReceived: payment.amountReceived,
    amountExpected: payment.amountCrypto,
  };
}

// ─── Simulate Payment (for development/demo) ────────────────────────────────

export function simulatePaymentConfirmation(paymentId: string): boolean {
  const payment = paymentStore.get(paymentId);
  if (!payment || payment.status === 'expired' || payment.status === 'confirmed') {
    return false;
  }

  // Simulate: first call sets to 'confirming', second call to 'confirmed'
  if (payment.status === 'pending') {
    payment.status = 'confirming';
    payment.confirmations = Math.floor(payment.requiredConfirmations / 2);
    payment.txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    payment.amountReceived = payment.amountCrypto;
  } else if (payment.status === 'confirming') {
    payment.status = 'confirmed';
    payment.confirmations = payment.requiredConfirmations;
  }

  paymentStore.set(paymentId, payment);
  return true;
}
