'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <p className="text-6xl mb-4">✉️</p>
          <h1 className="text-3xl font-bold font-heading mb-3">MESSAGE SENT!</h1>
          <p className="text-text-grey">We&apos;ll get back to you within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-6">CONTACT US</h1>
      <p className="text-text-grey mb-10">Have a question or need help? We&apos;re here for you.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
            <input placeholder="Your Name" required className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange" />
            <input placeholder="Email Address" type="email" required className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange" />
            <input placeholder="Subject" required className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange" />
            <textarea placeholder="Your Message" rows={5} required className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange resize-none" />
            <button type="submit" className="w-full bg-accent-orange hover:bg-accent-orange/80 text-white py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all">
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          {[
            { icon: '📍', title: 'Address', detail: '123 Sports Avenue, Athletic City, AC 10001' },
            { icon: '📧', title: 'Email', detail: 'support@athletix.com' },
            { icon: '📞', title: 'Phone', detail: '+1 (800) 123-4567' },
            { icon: '🕐', title: 'Hours', detail: 'Mon-Fri: 9am-6pm EST\nSat-Sun: 10am-4pm EST' },
          ].map(info => (
            <div key={info.title} className="flex items-start gap-4">
              <span className="text-2xl">{info.icon}</span>
              <div>
                <h3 className="font-semibold mb-1">{info.title}</h3>
                <p className="text-sm text-text-grey whitespace-pre-line">{info.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
