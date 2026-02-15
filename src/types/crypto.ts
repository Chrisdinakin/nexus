export type CryptoCurrency = 'USDC' | 'USDT' | 'BTC';

export type CryptoNetwork = 'ethereum' | 'polygon' | 'tron' | 'bitcoin';

export type CryptoPaymentStatus =
  | 'pending'       // Waiting for payment
  | 'confirming'    // Transaction detected, waiting for confirmations
  | 'confirmed'     // Payment confirmed
  | 'expired'       // Payment window expired
  | 'underpaid'     // Received less than expected
  | 'overpaid'      // Received more than expected
  | 'failed';       // Payment failed

export interface CryptoOption {
  currency: CryptoCurrency;
  name: string;
  symbol: string;
  icon: string;
  networks: NetworkOption[];
  color: string;
}

export interface NetworkOption {
  network: CryptoNetwork;
  name: string;
  confirmations: number;
  estimatedTime: string;
  fee: string;
}

export interface CryptoPaymentRequest {
  orderId: string;
  currency: CryptoCurrency;
  network: CryptoNetwork;
  amountUsd: number;
  customerEmail: string;
}

export interface CryptoPaymentResponse {
  paymentId: string;
  orderId: string;
  currency: CryptoCurrency;
  network: CryptoNetwork;
  walletAddress: string;
  amountCrypto: string;
  amountUsd: number;
  exchangeRate: number;
  expiresAt: string;
  status: CryptoPaymentStatus;
  qrCodeData: string;
  memo?: string;
}

export interface CryptoRate {
  currency: CryptoCurrency;
  usdRate: number;
  change24h: number;
  lastUpdated: string;
}

export interface PaymentStatusResponse {
  paymentId: string;
  status: CryptoPaymentStatus;
  confirmations: number;
  requiredConfirmations: number;
  txHash?: string;
  amountReceived?: string;
  amountExpected: string;
}

export const CRYPTO_OPTIONS: CryptoOption[] = [
  {
    currency: 'USDC',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: '🔵',
    color: '#2775CA',
    networks: [
      { network: 'ethereum', name: 'Ethereum (ERC-20)', confirmations: 12, estimatedTime: '~5 min', fee: '~$2-5' },
      { network: 'polygon', name: 'Polygon', confirmations: 30, estimatedTime: '~2 min', fee: '<$0.01' },
    ],
  },
  {
    currency: 'USDT',
    name: 'Tether',
    symbol: 'USDT',
    icon: '🟢',
    color: '#26A17B',
    networks: [
      { network: 'ethereum', name: 'Ethereum (ERC-20)', confirmations: 12, estimatedTime: '~5 min', fee: '~$2-5' },
      { network: 'tron', name: 'Tron (TRC-20)', confirmations: 20, estimatedTime: '~1 min', fee: '<$1' },
    ],
  },
  {
    currency: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '🟠',
    color: '#F7931A',
    networks: [
      { network: 'bitcoin', name: 'Bitcoin Network', confirmations: 3, estimatedTime: '~30 min', fee: 'Variable' },
    ],
  },
];
