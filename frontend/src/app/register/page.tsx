'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { extractErrorMessage } from '@/features/auth/hooks/useLogin';
import axios from 'axios';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [agreed, setAgreed] = React.useState(false);
  const [agreeError, setAgreeError] = React.useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const { mutate: registerUser, isPending, error: mutationError, isError } = useRegister();

  const password = watch('password', '');

  // Password strength
  const pwdStrength = React.useMemo(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  }, [password]);

  const strengthLabel = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'][pwdStrength];
  const strengthColors = ['bg-red-500', 'bg-red-500', 'bg-yellow-400', 'bg-yellow-400', 'bg-green-500'];

  const serverError = isError ? extractErrorMessage(mutationError, 'Registration failed. Please try again.') : '';

  const onSubmit = (data: RegisterForm) => {
    if (!agreed) {
      setAgreeError('You must agree to the terms to continue.');
      return;
    }
    setAgreeError('');
    registerUser(data, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  return (
    <div className="min-h-screen flex font-sans bg-background">
      {/* ── Left Panel: Brand Visual ── */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] relative overflow-hidden bg-[#0E0D0C] p-12">
        <div className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full bg-accent/15 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(224,90,71,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(224,90,71,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="text-3xl">🍕</span>
            <span className="text-2xl font-bold font-display text-white group-hover:text-primary transition-colors">Swadesh</span>
          </Link>
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent text-xs font-bold px-3 py-1.5 rounded-full w-max tracking-widest uppercase">
            🎉 Join the Swadesh Family
          </div>
          <h2 className="text-4xl font-display font-bold text-white leading-snug">
            Your cravings deserve <br />
            <span className="text-primary">a real home</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Create your account and unlock exclusive member deals, early menu previews, and a personalised ordering experience.
          </p>

          <ul className="flex flex-col gap-3 mt-2">
            {[
              ['⚡', 'Real-time order tracking'],
              ['❤️', 'Save your favourite dishes'],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-center gap-3 text-white/70 text-sm">
                <span className="text-base shrink-0">{icon}</span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 flex items-center gap-8">
          {[['15k+', 'Happy Foodies'], ['4.9★', 'Google Rating'], ['25m', 'Avg Delivery']].map(([val, label]) => (
            <div key={label}>
              <p className="text-white font-mono font-bold text-lg">{val}</p>
              <p className="text-white/40 text-[11px]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-12 relative">
        <div className="lg:hidden mb-8 flex items-center gap-2">
          <span className="text-2xl">🍕</span>
          <span className="text-xl font-bold font-display text-foreground">Swadesh</span>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Create account</h1>
            <p className="text-sm text-foreground/50">
              Already a member?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="Priya Patel"
                  {...register('name', { required: 'Full name is required', minLength: { value: 2, message: 'Name too short' } })}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl border bg-card text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${errors.name ? 'border-red-400' : 'border-border'}`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                  })}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl border bg-card text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${errors.email ? 'border-red-400' : 'border-border'}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' },
                  })}
                  className={`w-full pl-11 pr-11 py-3.5 rounded-xl border bg-card text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${errors.password ? 'border-red-400' : 'border-border'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

              {/* Password strength bar */}
              {password.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-0.5">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < pwdStrength ? strengthColors[pwdStrength] : 'bg-border'}`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-foreground/40 font-semibold">{strengthLabel}</p>
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none mt-1">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => { setAgreed(e.target.checked); if (e.target.checked) setAgreeError(''); }}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border transition-all cursor-pointer flex items-center justify-center ${agreed ? 'bg-primary border-primary' : 'border-border bg-card'}`}
                >
                  {agreed && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-foreground/60 leading-snug">
                I agree to the{' '}
                <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
              </span>
            </label>
            {agreeError && <p className="text-red-500 text-xs -mt-2">{agreeError}</p>}

            {/* Submit */}
            <button
              type="submit"
              id="register-submit"
              disabled={isPending}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm tracking-wide hover:bg-[#C94534] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account…
                </>
              ) : (
                'Create Account →'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
