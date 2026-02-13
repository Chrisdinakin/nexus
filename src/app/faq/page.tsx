'use client';

import { useState } from 'react';

const faqs = [
  { q: 'How do I find my size?', a: 'Check our Size Guide for detailed measurements. We recommend measuring yourself and comparing with our size charts. If you\'re between sizes, we suggest sizing up for a comfortable fit.' },
  { q: 'What is your return policy?', a: 'We offer free 30-day returns on all unworn, unwashed items with original tags attached. Simply initiate a return through your account or contact our support team.' },
  { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping delivers in 2-3 business days, and overnight shipping arrives the next business day. Free shipping is available on orders over $50.' },
  { q: 'Do you ship internationally?', a: 'Yes! We ship to over 50 countries worldwide. International shipping typically takes 7-14 business days. Customs duties and taxes may apply depending on your location.' },
  { q: 'How can I track my order?', a: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order status in your account dashboard under Order History.' },
  { q: 'Are the products authentic?', a: 'Absolutely. We are an authorized retailer for all brands we carry. Every product is 100% authentic and comes with the manufacturer\'s warranty.' },
  { q: 'Can I cancel or modify my order?', a: 'You can cancel or modify your order within 1 hour of placing it. After that, the order goes into processing and cannot be changed. Contact support immediately if you need to make changes.' },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, and Google Pay. All payments are processed securely.' },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-6">FAQ & HELP CENTER</h1>
      <p className="text-text-grey mb-10">Find answers to commonly asked questions below.</p>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
            >
              <span className="text-sm font-semibold pr-4">{faq.q}</span>
              <svg className={`w-4 h-4 flex-shrink-0 text-text-grey transition-transform ${openIndex === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === i && (
              <div className="px-5 pb-5 animate-fade-in">
                <p className="text-sm text-text-grey leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center bg-card border border-border rounded-xl p-8">
        <h2 className="text-xl font-bold font-heading mb-3">STILL NEED HELP?</h2>
        <p className="text-text-grey text-sm mb-4">Our support team is available 24/7 to assist you.</p>
        <a href="/contact" className="inline-block bg-accent-orange hover:bg-accent-orange/80 text-white px-6 py-2.5 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all">
          Contact Support
        </a>
      </div>
    </div>
  );
}
