'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CryptoCurrency,
  CryptoNetwork,
  CryptoPaymentResponse,
  CryptoPaymentStatus,
  CryptoRate,
  CRYPTO_OPTIONS,
  PaymentStatusResponse,
} from '@/types/crypto';

// ─── QR Code Component (SVG-based, no external deps) ────────────────────────

function QRCode({ data, size = 200 }: { data: string; size?: number }) {
  // Simple QR-like visual using the data as seed. In production, use a proper
  // QR library. Here we create a deterministic pattern from the input string.
  const gridSize = 21;
  const cellSize = size / gridSize;

  const getPattern = useCallback((input: string) => {
    const cells: boolean[][] = [];
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
    }

    for (let y = 0; y < gridSize; y++) {
      cells[y] = [];
      for (let x = 0; x < gridSize; x++) {
        // Finder patterns (top-left, top-right, bottom-left)
        const isFinderTL = x < 7 && y < 7;
        const isFinderTR = x >= gridSize - 7 && y < 7;
        const isFinderBL = x < 7 && y >= gridSize - 7;

        if (isFinderTL || isFinderTR || isFinderBL) {
          const fx = isFinderTR ? x - (gridSize - 7) : x;
          const fy = isFinderBL ? y - (gridSize - 7) : y;
          cells[y][x] =
            (fx === 0 || fx === 6 || fy === 0 || fy === 6) ||
            (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
        } else {
          // Data area: deterministic pseudo-random from hash
          const seed = (hash * (y * gridSize + x + 1) * 16807) % 2147483647;
          cells[y][x] = (seed % 3) !== 0;
        }
      }
    }
    return cells;
  }, []);

  const cells = getPattern(data);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg">
      <rect width={size} height={size} fill="white" rx="8" />
      {cells.map((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect
              key={`${x}-${y}`}
              x={x * cellSize + 1}
              y={y * cellSize + 1}
              width={cellSize - 0.5}
              height={cellSize - 0.5}
              fill="#0A0A0A"
              rx={1}
            />
          ) : null
        )
      )}
    </svg>
  );
}

// ─── Countdown Timer ─────────────────────────────────────────────────────────

function CountdownTimer({ expiresAt, onExpired }: { expiresAt: string; onExpired: () => void }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const expiry = new Date(expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('00:00');
        onExpired();
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      setIsUrgent(diff < 5 * 60 * 1000); // Under 5 minutes
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  return (
    <div className={`flex items-center gap-2 text-sm font-mono ${isUrgent ? 'text-danger animate-pulse' : 'text-text-grey'}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{timeLeft}</span>
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: CryptoPaymentStatus }) {
  const config: Record<CryptoPaymentStatus, { label: string; color: string; bg: string }> = {
    pending: { label: 'Awaiting Payment', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    confirming: { label: 'Confirming...', color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
    confirmed: { label: 'Confirmed!', color: 'text-accent-green', bg: 'bg-accent-green/10' },
    expired: { label: 'Expired', color: 'text-danger', bg: 'bg-danger/10' },
    underpaid: { label: 'Underpaid', color: 'text-accent-orange', bg: 'bg-accent-orange/10' },
    overpaid: { label: 'Overpaid', color: 'text-accent-orange', bg: 'bg-accent-orange/10' },
    failed: { label: 'Failed', color: 'text-danger', bg: 'bg-danger/10' },
  };

  const { label, color, bg } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${color} ${bg}`}>
      {status === 'confirming' && (
        <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
      )}
      {status === 'confirmed' && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
      {label}
    </span>
  );
}

// ─── Main CryptoPayment Component ────────────────────────────────────────────

interface CryptoPaymentProps {
  amountUsd: number;
  orderId: string;
  customerEmail: string;
  onPaymentConfirmed: () => void;
  onCancel: () => void;
}

export default function CryptoPayment({
  amountUsd,
  orderId,
  customerEmail,
  onPaymentConfirmed,
  onCancel,
}: CryptoPaymentProps) {
  const [step, setStep] = useState<'select' | 'pay' | 'status'>('select');
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<CryptoNetwork | null>(null);
  const [payment, setPayment] = useState<CryptoPaymentResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusResponse | null>(null);
  const [rates, setRates] = useState<CryptoRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch rates on mount
  useEffect(() => {
    fetch('/api/crypto/rates')
      .then(r => r.json())
      .then(data => setRates(data.rates || []))
      .catch(() => {});
  }, []);

  // Poll for payment status
  useEffect(() => {
    if (!payment || step !== 'pay') return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/crypto/check-status?paymentId=${payment.paymentId}`);
        const data: PaymentStatusResponse = await res.json();
        setPaymentStatus(data);

        if (data.status === 'confirmed') {
          if (pollRef.current) clearInterval(pollRef.current);
          setTimeout(onPaymentConfirmed, 2000);
        } else if (data.status === 'expired' || data.status === 'failed') {
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // Silent fail, will retry on next interval
      }
    };

    poll();
    pollRef.current = setInterval(poll, 10_000); // Poll every 10 seconds

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [payment, step, onPaymentConfirmed]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleCreatePayment = async () => {
    if (!selectedCurrency || !selectedNetwork) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/crypto/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          currency: selectedCurrency,
          network: selectedNetwork,
          amountUsd,
          customerEmail,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create payment');
      }

      const data: CryptoPaymentResponse = await res.json();
      setPayment(data);
      setStep('pay');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!payment) return;
    try {
      await fetch('/api/crypto/check-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: payment.paymentId }),
      });
      // The polling will pick up the status change
    } catch {
      // Silent fail
    }
  };

  const selectedOption = CRYPTO_OPTIONS.find(o => o.currency === selectedCurrency);

  // ─── Step 1: Select Currency & Network ───────────────────────────────────

  if (step === 'select') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Pay with Crypto</h3>
          <div className="flex items-center gap-2 text-sm text-text-grey">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            Live rates
          </div>
        </div>

        {/* Currency Selection */}
        <div className="space-y-3">
          {CRYPTO_OPTIONS.map(option => {
            const rate = rates.find(r => r.currency === option.currency);
            const cryptoAmount = rate ? (amountUsd / rate.usdRate) : null;

            return (
              <button
                key={option.currency}
                onClick={() => {
                  setSelectedCurrency(option.currency);
                  setSelectedNetwork(option.networks[0].network);
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  selectedCurrency === option.currency
                    ? 'border-accent-orange bg-accent-orange/5'
                    : 'border-border hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${option.color}20` }}
                  >
                    {option.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{option.name}</p>
                    <p className="text-xs text-text-grey">{option.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  {cryptoAmount !== null ? (
                    <>
                      <p className="font-mono font-semibold text-sm">
                        {option.currency === 'BTC' ? cryptoAmount.toFixed(8) : cryptoAmount.toFixed(2)} {option.symbol}
                      </p>
                      <p className="text-xs text-text-grey">
                        1 {option.symbol} = ${rate!.usdRate.toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-text-grey">Loading...</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Network Selection */}
        {selectedOption && selectedOption.networks.length > 1 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 text-text-grey">Select Network</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedOption.networks.map(net => (
                <button
                  key={net.network}
                  onClick={() => setSelectedNetwork(net.network)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedNetwork === net.network
                      ? 'border-accent-orange bg-accent-orange/5'
                      : 'border-border hover:border-white/20'
                  }`}
                >
                  <p className="text-sm font-semibold">{net.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-text-grey">{net.estimatedTime}</span>
                    <span className="text-xs text-text-grey">Fee: {net.fee}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-border text-white py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:border-white/30 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleCreatePayment}
            disabled={!selectedCurrency || !selectedNetwork || loading}
            className="flex-1 bg-accent-orange hover:bg-accent-orange/80 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </span>
            ) : (
              'Continue'
            )}
          </button>
        </div>

        {/* Security Note */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary text-xs text-text-grey">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p>
            Payments are secured by blockchain technology. Transactions are irreversible — please verify the amount and address before sending.
          </p>
        </div>
      </div>
    );
  }

  // ─── Step 2: Payment Details & QR Code ───────────────────────────────────

  if (step === 'pay' && payment) {
    const currentStatus = paymentStatus?.status || payment.status;

    return (
      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedOption?.icon}</span>
            <h3 className="text-lg font-bold">
              Send {payment.currency}
            </h3>
          </div>
          <StatusBadge status={currentStatus} />
        </div>

        {/* Amount Card */}
        <div className="bg-secondary rounded-xl p-4 text-center border border-border">
          <p className="text-xs text-text-grey mb-1 uppercase tracking-wider">Send Exactly</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono" style={{ color: selectedOption?.color }}>
            {payment.amountCrypto} {payment.currency}
          </p>
          <p className="text-sm text-text-grey mt-1">
            ≈ ${payment.amountUsd.toFixed(2)} USD
          </p>
          <button
            onClick={() => copyToClipboard(payment.amountCrypto, 'amount')}
            className="mt-2 text-xs text-accent-orange hover:text-accent-orange/80 transition-colors"
          >
            {copied === 'amount' ? '✓ Copied!' : 'Copy amount'}
          </button>
        </div>

        {/* QR Code */}
        {currentStatus === 'pending' && (
          <div className="flex justify-center">
            <div className="bg-white p-3 rounded-xl inline-block">
              <QRCode data={payment.qrCodeData} size={180} />
            </div>
          </div>
        )}

        {/* Confirmed Animation */}
        {currentStatus === 'confirmed' && (
          <div className="flex justify-center py-4">
            <div className="w-20 h-20 rounded-full bg-accent-green/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}

        {/* Wallet Address */}
        <div className="bg-secondary rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-text-grey uppercase tracking-wider">To Address</p>
            {currentStatus === 'pending' && (
              <CountdownTimer expiresAt={payment.expiresAt} onExpired={() => {}} />
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs sm:text-sm font-mono break-all flex-1 text-white/80">
              {payment.walletAddress}
            </p>
            <button
              onClick={() => copyToClipboard(payment.walletAddress, 'address')}
              className="shrink-0 p-2 rounded-lg bg-card hover:bg-border transition-colors"
              title="Copy address"
            >
              {copied === 'address' ? (
                <svg className="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-text-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-text-grey mt-2">
            Network: {selectedOption?.networks.find(n => n.network === payment.network)?.name || payment.network}
          </p>
        </div>

        {/* Confirmation Progress */}
        {paymentStatus && (paymentStatus.status === 'confirming' || paymentStatus.status === 'confirmed') && (
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-text-grey uppercase tracking-wider">Confirmations</p>
              <p className="text-sm font-mono">
                {paymentStatus.confirmations} / {paymentStatus.requiredConfirmations}
              </p>
            </div>
            <div className="w-full bg-card rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${(paymentStatus.confirmations / paymentStatus.requiredConfirmations) * 100}%`,
                  backgroundColor: paymentStatus.status === 'confirmed' ? '#00E676' : '#2196F3',
                }}
              />
            </div>
            {paymentStatus.txHash && (
              <p className="text-xs text-text-grey mt-2 font-mono break-all">
                TX: {paymentStatus.txHash.slice(0, 16)}...{paymentStatus.txHash.slice(-8)}
              </p>
            )}
          </div>
        )}

        {/* Payment Details */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-secondary rounded-lg p-3 border border-border">
            <p className="text-text-grey mb-1">Payment ID</p>
            <p className="font-mono text-white/80">{payment.paymentId.slice(0, 12)}...</p>
          </div>
          <div className="bg-secondary rounded-lg p-3 border border-border">
            <p className="text-text-grey mb-1">Exchange Rate</p>
            <p className="font-mono text-white/80">
              1 {payment.currency} = ${payment.exchangeRate.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {currentStatus === 'expired' && (
            <button
              onClick={() => {
                setStep('select');
                setPayment(null);
                setPaymentStatus(null);
              }}
              className="w-full bg-accent-orange hover:bg-accent-orange/80 text-white py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all"
            >
              Try Again
            </button>
          )}

          {currentStatus === 'pending' && (
            <button
              onClick={onCancel}
              className="w-full border border-border text-text-grey py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:border-white/30 hover:text-white transition-all"
            >
              Cancel Payment
            </button>
          )}

          {/* Dev simulation button */}
          {(currentStatus === 'pending' || currentStatus === 'confirming') && (
            <button
              onClick={handleSimulatePayment}
              className="w-full border border-dashed border-accent-blue/30 text-accent-blue/60 py-2 rounded-lg text-xs hover:border-accent-blue/60 hover:text-accent-blue transition-all"
            >
              ⚡ Simulate {currentStatus === 'pending' ? 'Transaction Detected' : 'Full Confirmation'} (Dev)
            </button>
          )}
        </div>

        {/* Warning */}
        {currentStatus === 'pending' && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-accent-orange/5 border border-accent-orange/10 text-xs text-accent-orange">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.27 16.5C2.5 17.333 3.462 19 5.002 19z" />
            </svg>
            <p>
              Send <strong>exactly {payment.amountCrypto} {payment.currency}</strong> to the address above.
              Sending a different amount or wrong token may result in loss of funds.
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
