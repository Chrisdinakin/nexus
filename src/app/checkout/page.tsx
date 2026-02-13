'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shipping = totalPrice > 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shipping + tax;

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'US',
    shippingMethod: 'standard',
    paymentMethod: 'card',
    cardNumber: '', expiry: '', cvv: '',
  });

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h1 className="text-2xl font-bold mb-2">No Items to Checkout</h1>
          <Link href="/shop" className="text-accent-orange hover:text-accent-orange/80">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md animate-fade-in-up">
          <p className="text-6xl mb-4">🎉</p>
          <h1 className="text-3xl font-bold font-heading mb-3">ORDER PLACED!</h1>
          <p className="text-text-grey mb-2">Thank you for your purchase.</p>
          <p className="text-text-grey mb-6">Order #ATH-{Math.floor(Math.random() * 90000) + 10000}</p>
          <Link href="/shop" className="bg-accent-orange hover:bg-accent-orange/80 text-white px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-8">CHECKOUT</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-10">
        {['Shipping', 'Payment', 'Review'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step > i + 1 ? 'bg-accent-green text-black' : step === i + 1 ? 'bg-accent-orange text-white' : 'bg-card text-text-grey border border-border'
            }`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-sm ${step === i + 1 ? 'text-white font-semibold' : 'text-text-grey'}`}>{s}</span>
            {i < 2 && <div className="w-12 h-px bg-border hidden sm:block" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="bg-card border border-border rounded-xl p-6 animate-fade-in">
              <h2 className="text-lg font-bold mb-6">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input placeholder="First Name" value={form.firstName} onChange={e => updateForm('firstName', e.target.value)} className="bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange" />
                <input placeholder="Last Name" value={form.lastName} onChange={e => updateForm('lastName', e.target.value)} className="bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange" />
                <input placeholder="Email" type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} className="bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange" />
                <input placeholder="Phone" type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} className="bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange" />
                <input placeholder="Address" value={form.address} onChange={e => updateForm('address', e.target.value)} className="sm:col-span-2 bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange" />
                <input placeholder="City" value={form.city} onChange={e => updateForm('city', e.target.value)} className="bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange" />
                <input placeholder="State" value={form.state} onChange={e => updateForm('state', e.target.value)} className="bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange" />
                <input placeholder="ZIP Code" value={form.zip} onChange={e => updateForm('zip', e.target.value)} className="bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange" />
              </div>

              <h3 className="text-sm font-semibold mt-8 mb-4">Shipping Method</h3>
              <div className="space-y-3">
                {[
                  { id: 'standard', label: 'Standard Shipping', desc: '5-7 business days', price: totalPrice > 50 ? 'FREE' : '$9.99' },
                  { id: 'express', label: 'Express Shipping', desc: '2-3 business days', price: '$14.99' },
                  { id: 'overnight', label: 'Overnight Shipping', desc: 'Next business day', price: '$24.99' },
                ].map(method => (
                  <label key={method.id} className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    form.shippingMethod === method.id ? 'border-accent-orange bg-accent-orange/5' : 'border-border hover:border-white/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" checked={form.shippingMethod === method.id} onChange={() => updateForm('shippingMethod', method.id)} className="accent-accent-orange" />
                      <div>
                        <p className="text-sm font-semibold">{method.label}</p>
                        <p className="text-xs text-text-grey">{method.desc}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{method.price}</span>
                  </label>
                ))}
              </div>

              <button onClick={() => setStep(2)} className="mt-6 w-full bg-accent-orange hover:bg-accent-orange/80 text-white py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all">
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-card border border-border rounded-xl p-6 animate-fade-in">
              <h2 className="text-lg font-bold mb-6">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {[
                  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                  { id: 'applepay', label: 'Apple Pay', icon: '🍎' },
                ].map(method => (
                  <label key={method.id} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    form.paymentMethod === method.id ? 'border-accent-orange bg-accent-orange/5' : 'border-border hover:border-white/20'
                  }`}>
                    <input type="radio" name="payment" checked={form.paymentMethod === method.id} onChange={() => updateForm('paymentMethod', method.id)} className="accent-accent-orange" />
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-sm font-semibold">{method.label}</span>
                  </label>
                ))}
              </div>

              {form.paymentMethod === 'card' && (
                <div className="space-y-4">
                  <input placeholder="Card Number" value={form.cardNumber} onChange={e => updateForm('cardNumber', e.target.value)} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange" />
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="MM/YY" value={form.expiry} onChange={e => updateForm('expiry', e.target.value)} className="bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange" />
                    <input placeholder="CVV" value={form.cvv} onChange={e => updateForm('cvv', e.target.value)} className="bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange" />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 border border-border text-white py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:border-white/30 transition-all">
                  Back
                </button>
                <button onClick={() => setStep(3)} className="flex-1 bg-accent-orange hover:bg-accent-orange/80 text-white py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all">
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="bg-card border border-border rounded-xl p-6 animate-fade-in">
              <h2 className="text-lg font-bold mb-6">Order Review</h2>
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.product.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-semibold">{item.product.name}</p>
                      <p className="text-xs text-text-grey">Qty: {item.quantity} · Size: {item.selectedSize}</p>
                    </div>
                    <span className="text-sm font-bold font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <h3 className="text-sm font-semibold mb-2">Shipping To:</h3>
                <p className="text-sm text-text-grey">
                  {form.firstName} {form.lastName}<br />
                  {form.address}<br />
                  {form.city}, {form.state} {form.zip}
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-border text-white py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:border-white/30 transition-all">
                  Back
                </button>
                <button onClick={handlePlaceOrder} className="flex-1 bg-accent-green hover:bg-accent-green/80 text-black py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all">
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold mb-4">Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-grey">Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-grey">Shipping</span>
              <span>{shipping === 0 ? <span className="text-accent-green">FREE</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-grey">Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-border pt-3">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
