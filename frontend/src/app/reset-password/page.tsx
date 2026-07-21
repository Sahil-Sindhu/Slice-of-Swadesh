'use client';

import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import apiClient from '@/lib/api/interceptors';

interface ResetForm {
  password: string;
  confirmPass: string;
}

function ResetPasswordContent() {
  const [isPending, setIsPending] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [serverError, setServerError] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetForm>();

  const watchPassword = watch('password');

  const onSubmit = async (data: ResetForm) => {
    if (!token) {
      setServerError('Reset token is missing in URL.');
      return;
    }

    setIsPending(true);
    setServerError('');
    try {
      await apiClient.post('/api/v1/auth/reset-password', {
        token,
        password: data.password,
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 4000);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#E8441A,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🍕</div>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#1A1208', fontFamily: 'var(--font-outfit)' }}>Swadesh</span>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A1208', fontFamily: 'var(--font-outfit)', marginBottom: 10 }}>Reset Password</h1>
        <p style={{ color: '#8C6E5A', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
          Set your new password below. Make sure it's at least 6 characters long.
        </p>

        {!token && (
          <div style={{ background: '#FFF0EB', border: '1px solid #E8441A40', borderRadius: 12, padding: '12px 16px', color: '#C93B15', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            ⚠️ Password reset token is missing. Please check your email link again.
          </div>
        )}

        {isSuccess ? (
          <div style={{ background: '#E6F4EA', border: '1px solid #34A85330', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
            <span style={{ fontSize: 32 }}>✅</span>
            <h3 style={{ color: '#137333', fontSize: 16, fontWeight: 700, margin: '12px 0 6px 0' }}>Password Reset Success</h3>
            <p style={{ color: '#137333', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
              Your password has been reset successfully. Redirecting you to login...
            </p>
            <Link href="/login" style={{ color: '#E8441A', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Go to Login Page →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {serverError && (
              <div style={{ background: '#FFF0EB', border: '1px solid #E8441A40', borderRadius: 12, padding: '12px 16px', color: '#C93B15', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚠️ {serverError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8C6E5A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                  style={{ width: '100%', padding: '14px 48px 14px 16px', borderRadius: 12, border: `1.5px solid ${errors.password ? '#E8441A' : '#F0E6D8'}`, background: 'white', color: '#1A1208', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#B5957D' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p style={{ color: '#C93B15', fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#8C6E5A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Confirm New Password</label>
              <input
                id="confirmPass"
                type="password"
                placeholder="••••••••"
                {...register('confirmPass', {
                  required: 'Please confirm your password',
                  validate: (val) => val === watchPassword || 'Passwords do not match',
                })}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1.5px solid ${errors.confirmPass ? '#E8441A' : '#F0E6D8'}`, background: 'white', color: '#1A1208', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
              {errors.confirmPass && <p style={{ color: '#C93B15', fontSize: 12, marginTop: 4 }}>{errors.confirmPass.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending || !token}
              style={{
                width: '100%', padding: '15px', borderRadius: 12, border: 'none',
                background: isPending || !token ? '#F0A898' : '#E8441A', color: 'white',
                fontSize: 15, fontWeight: 700, cursor: isPending || !token ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 24px rgba(232,68,26,0.3)', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {isPending ? <>⏳ Resetting Password…</> : <>Reset Password →</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFBF5' }}>Loading…</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
