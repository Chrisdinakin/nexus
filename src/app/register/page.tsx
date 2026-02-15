'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { register, user } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Redirect if already logged in
  if (user) {
    router.push('/account');
    return null;
  }

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const passwordStrength = (pw: string): { label: string; color: string; width: string } => {
    if (pw.length === 0) return { label: '', color: '', width: '0%' };
    if (pw.length < 6) return { label: 'Too short', color: 'bg-danger', width: '20%' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-accent-orange', width: '40%' };
    if (score === 2) return { label: 'Fair', color: 'bg-yellow-400', width: '60%' };
    if (score === 3) return { label: 'Good', color: 'bg-accent-blue', width: '80%' };
    return { label: 'Strong', color: 'bg-accent-green', width: '100%' };
  };

  const strength = passwordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreed) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    const result = await register({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
    });
    setLoading(false);

    if (result.success) {
      router.push('/account');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-3xl">🏆</span>
            <span className="text-2xl font-bold tracking-wider font-heading">ATHLETIX</span>
          </Link>
          <h1 className="text-3xl font-bold font-heading">CREATE ACCOUNT</h1>
          <p className="text-text-grey mt-2">Join the ATHLETIX community today.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">First Name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={e => updateForm('firstName', e.target.value)}
                placeholder="John"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Last Name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={e => updateForm('lastName', e.target.value)}
                placeholder="Doe"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => updateForm('email', e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange transition-colors"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => updateForm('password', e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder-text-grey focus:outline-none focus:border-accent-orange transition-colors"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-grey hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {/* Password strength bar */}
            {form.password.length > 0 && (
              <div className="mt-2">
                <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                </div>
                <p className="text-xs text-text-grey mt-1">{strength.label}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={e => updateForm('confirmPassword', e.target.value)}
              placeholder="Re-enter your password"
              className={`w-full bg-secondary border rounded-lg px-4 py-3 text-sm text-white placeholder-text-grey focus:outline-none transition-colors ${
                form.confirmPassword && form.confirmPassword !== form.password
                  ? 'border-danger focus:border-danger'
                  : 'border-border focus:border-accent-orange'
              }`}
              autoComplete="new-password"
            />
            {form.confirmPassword && form.confirmPassword !== form.password && (
              <p className="text-xs text-danger mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-1 accent-accent-orange"
            />
            <span className="text-xs text-text-grey">
              I agree to the <span className="text-white">Terms of Service</span> and <span className="text-white">Privacy Policy</span>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-orange hover:bg-accent-orange/80 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center mt-6 text-sm text-text-grey">
          Already have an account?{' '}
          <Link href="/login" className="text-accent-orange hover:text-accent-orange/80 font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
