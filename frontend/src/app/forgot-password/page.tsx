'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import apiClient from '@/lib/api/interceptors';

interface ForgotForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const [isPending, setIsPending] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [serverError, setServerError] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>();

  const onSubmit = async (data: ForgotForm) => {
    setIsPending(true);
    setServerError('');
    try {
      await apiClient.post('/api/v1/auth/forgot-password', data);
      setIsSuccess(true);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FFFBF5',
    color: '#1A1208',
    fontFamily: 'var(--font-inter), sans-serif',
    padding: '24px',
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: '100%', maxWidth: 420, background: 'white', borderRadius: 24, boxShadow: '0 12px 40px rgba(26,18,8,0.06)', border: '1px solid #F0E6D8', padding: '40px 32px' }}>
        <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#8C6E5A', textDecoration: 'none', fontSize: 13, fontWeight: 700, marginBottom: 24 }}>
          ← Back to Login
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#E8441A,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🍕</div>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#1A1208', fontFamily: 'var(--font-outfit)' }}>Swadesh</span>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A1208', fontFamily: 'var(--font-outfit)', marginBottom: 10 }}>Forgot Password?</h1>
        <p style={{ color: '#8C6E5A', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {isSuccess ? (
          <div style={{ background: '#E6F4EA', border: '1px solid #34A85330', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
            <span style={{ fontSize: 32 }}>✉️</span>
            <h3 style={{ color: '#137333', fontSize: 16, fontWeight: 700, margin: '12px 0 6px 0' }}>Reset Link Sent</h3>
            <p style={{ color: '#137333', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              If your email is registered with us, a password reset link has been sent. Please check your inbox and spam folder.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {serverError && (
              <div style={{ background: '#FFF0EB', border: '1px solid #E8441A40', borderRadius: 12, padding: '12px 16px', color: '#C93B15', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚠️ {serverError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8C6E5A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
                })}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1.5px solid ${errors.email ? '#E8441A' : '#F0E6D8'}`, background: 'white', color: '#1A1208', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
              {errors.email && <p style={{ color: '#C93B15', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending}
              style={{
                width: '100%', padding: '15px', borderRadius: 12, border: 'none',
                background: isPending ? '#F0A898' : '#E8441A', color: 'white',
                fontSize: 15, fontWeight: 700, cursor: isPending ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 24px rgba(232,68,26,0.3)', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {isPending ? <>⏳ Sending Link…</> : <>Send Reset Link →</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
