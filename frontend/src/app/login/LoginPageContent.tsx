'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useLogin, extractErrorMessage } from '@/features/auth/hooks/useLogin';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPageContent() {
  const [showPass, setShowPass] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const { mutate: login, isPending, error: mutationError, isError } = useLogin();

  const serverError = isError ? extractErrorMessage(mutationError, 'Login failed. Please try again.') : '';

  const onSubmit = (data: LoginForm) => {
    login(data, {
      onSuccess: () => {
        router.push(redirectTo);
      },
    });
  };

  const panelStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    background: '#FFFBF5',
    color: '#1A1208',
    fontFamily: 'var(--font-inter), sans-serif',
  };

  return (
    <div style={panelStyle}>
      <div style={{
        width: '44%', background: 'linear-gradient(160deg, #E8441A 0%, #C93B15 50%, #9B2D11 100%)',
        padding: '48px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }} className="hidden lg:flex">
        <div style={{ position: 'absolute', top: -120, right: -120, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(0,0,0,0.08)' }} />

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', position: 'relative', zIndex: 2 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, backdropFilter: 'blur(8px)' }}>🍕</div>
          <span style={{ color: 'white', fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>Swadesh</span>
        </Link>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: 100, padding: '6px 16px', color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 24, backdropFilter: 'blur(8px)' }}>
            🇮🇳 MODERN INDIAN FAST FOOD
          </div>
          <h2 style={{ color: 'white', fontSize: 36, fontWeight: 900, fontFamily: 'var(--font-outfit)', lineHeight: 1.15, marginBottom: 16 }}>
            Welcome back to<br />
            <span style={{ color: '#FFDD57' }}>Slice of Swadesh</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.7, maxWidth: 320, marginBottom: 36 }}>
            Sign in to enjoy exclusive offers, real-time order tracking &amp; your personalised menu.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '20px 24px' }}>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 16 }}>
              &ldquo;The Tandoori Naan Pizza changed my life! Fastest delivery, and the app experience is seamless.&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#FFDD57,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1A1208', fontSize: 14 }}>A</div>
              <div>
                <div style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>Amit Sharma</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Tech Lead · Bengaluru</div>
              </div>
              <div style={{ marginLeft: 'auto', color: '#FFDD57', fontSize: 14 }}>★★★★★</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 32, position: 'relative', zIndex: 2 }}>
          {[['15k+','Happy Foodies'],['4.9★','Rating'],['25min','Avg Delivery']].map(([v, l]) => (
            <div key={l}>
              <div style={{ color: 'white', fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>{v}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 32px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, justifyContent: 'center' }} className="lg:hidden">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#E8441A,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🍕</div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#1A1208', fontFamily: 'var(--font-outfit)' }}>Swadesh</span>
          </div>

          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#1A1208', fontFamily: 'var(--font-outfit)', marginBottom: 6 }}>Sign in</h1>
          <p style={{ color: '#8C6E5A', fontSize: 14, marginBottom: 28 }}>
            New here?{' '}
            <Link href="/register" style={{ color: '#E8441A', fontWeight: 700, textDecoration: 'none' }}>Create account</Link>
          </p>

          {serverError && (
            <div style={{ background: '#FFF0EB', border: '1px solid #E8441A40', borderRadius: 12, padding: '12px 16px', color: '#C93B15', fontSize: 13, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚠️ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#8C6E5A', textTransform: 'uppercase', letterSpacing: 1 }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: 12, color: '#E8441A', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</Link>
              </div>
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

            <button
              id="login-submit"
              type="submit"
              disabled={isPending}
              style={{
                width: '100%', padding: '15px', borderRadius: 12, border: 'none',
                background: isPending ? '#F0A898' : '#E8441A', color: 'white',
                fontSize: 15, fontWeight: 700, cursor: isPending ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 24px rgba(232,68,26,0.3)', transition: 'all 0.2s', marginTop: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {isPending ? <>⏳ Signing in…</> : <>Sign In →</>}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#F0E6D8' }} />
            <span style={{ fontSize: 12, color: '#B5957D', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: '#F0E6D8' }} />
          </div>

          <button
            id="google-login"
            disabled
            style={{ width: '100%', padding: '14px', borderRadius: 12, border: '1.5px solid #F0E6D8', background: '#FAFAFA', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 14, fontWeight: 600, color: '#B5957D', opacity: 0.6 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google (coming soon)
          </button>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#B5957D', marginTop: 24, lineHeight: 1.6 }}>
            By signing in you agree to our <a href="/terms" style={{ color: '#E8441A', textDecoration: 'none' }}>Terms</a> &amp; <a href="/privacy" style={{ color: '#E8441A', textDecoration: 'none' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
