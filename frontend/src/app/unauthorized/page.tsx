'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

export default function UnauthorizedPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleSwitchAccount = () => {
    logout();
    router.push('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FFFBF5',
      color: '#1A1208',
      fontFamily: 'var(--font-inter), sans-serif',
      padding: '24px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: '#ffffff',
        border: '1.5px solid #F0E6D8',
        borderRadius: '24px',
        padding: '40px 32px',
        textAlign: 'center',
        boxShadow: '0 12px 32px rgba(26, 18, 8, 0.04)',
        boxSizing: 'border-box',
      }}>
        {/* Warning Icon Banner */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: '#FFF0EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto',
          color: '#E8441A',
        }}>
          <ShieldAlert size={36} />
        </div>

        <h1 style={{
          fontSize: '28px',
          fontWeight: 800,
          fontFamily: 'var(--font-outfit), sans-serif',
          color: '#1A1208',
          margin: '0 0 12px 0',
          letterSpacing: '-0.02em',
        }}>
          Access Denied
        </h1>

        <p style={{
          fontSize: '15px',
          lineHeight: '1.6',
          color: '#8C6E5A',
          margin: '0 0 28px 0',
        }}>
          You do not have the required permissions to access this workspace. This area is restricted to authorized restaurant staff.
        </p>

        {user && (
          <div style={{
            background: '#F9F6F0',
            border: '1px solid #F0E6D8',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '32px',
            textAlign: 'left',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#B5957D', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              CURRENT SESSION
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#1A1208' }}>{user.name}</div>
                <div style={{ fontSize: '12px', color: '#8C6E5A', wordBreak: 'break-all' }}>{user.email}</div>
              </div>
              <span style={{
                background: '#E8441A15',
                color: '#E8441A',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
              }}>
                {user.role}
              </span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link
            id="back-home-button"
            href="/"
            style={{
              padding: '14px 20px',
              borderRadius: '14px',
              background: '#E8441A',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px rgba(232, 68, 26, 0.2)',
              transition: 'all 0.2s',
            }}
          >
            <ArrowLeft size={16} /> Return to Storefront
          </Link>

          <button
            id="switch-account-button"
            onClick={handleSwitchAccount}
            style={{
              padding: '14px 20px',
              borderRadius: '14px',
              border: '1.5px solid #F0E6D8',
              background: 'transparent',
              color: '#4A3728',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <LogOut size={16} /> Switch Account
          </button>
        </div>
      </div>
    </div>
  );
}
