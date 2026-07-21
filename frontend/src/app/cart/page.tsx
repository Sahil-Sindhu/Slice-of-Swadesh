'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '../../components/shared/AuthGuard';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

import { 
  useCart, 
  useUpdateCartItem, 
  useRemoveCartItem, 
  useClearCart, 
  useCheckout, 
  extractCartError 
} from '../../features/cart';

import {
  EmptyCart,
  CartItemCard,
  OrderSuccess,
  CartSkeleton,
  CartSummary
} from '../../features/cart';

import { NotificationDropdown } from '../../features/notification/components/NotificationDropdown';

import type { CheckoutResult } from '../../features/cart';

/* ─────────────────────────── TOAST ─────────────────────────── */
function useToast() {
  const [toast, setToast] = React.useState<{ msg: string; type: 'error' | 'success' } | null>(null);
  const show = React.useCallback((msg: string, type: 'error' | 'success' = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, show };
}

/* ─────────────────────────── MAIN CART CONTENT ─────────────────────────── */
function CartContent() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { itemCount } = useCartStore();
  const { toast, show: showToast } = useToast();

  // ── Data fetching ──────────────────────────────────────────────────
  const { data: cart, isLoading, isError, refetch } = useCart();

  // ── Mutations ──────────────────────────────────────────────────────
  const { mutate: updateItem, isPending: updating, variables: updateVars } = useUpdateCartItem();
  const { mutate: removeItem, isPending: removing, variables: removeVars } = useRemoveCartItem();
  const { mutate: clearAllItems, isPending: clearing } = useClearCart();
  const { mutate: placeOrder, isPending: checkingOut } = useCheckout();

  // ── Local state ────────────────────────────────────────────────────
  const [orderType, setOrderType] = React.useState<'Delivery' | 'Takeaway' | 'DineIn'>('Delivery');
  const [tableNumber, setTableNumber] = React.useState('');
  const [orderResult, setOrderResult] = React.useState<CheckoutResult | null>(null);

  // ── Handlers ───────────────────────────────────────────────────────
  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    updateItem({ itemId, quantity }, {
      onError: (err) => showToast(extractCartError(err)),
    });
  };

  const handleRemove = (itemId: string) => {
    removeItem(itemId, {
      onError: (err) => showToast(extractCartError(err)),
    });
  };

  const handleClear = () => {
    clearAllItems(undefined, {
      onError: (err) => showToast(extractCartError(err)),
    });
  };

  const handleCheckout = (paymentMethod: string) => {
    // We pass paymentMethod to placeOrder if the backend API supports it.
    // For now, the backend uses process.env.PAYMENT_GATEWAY, but we handle the frontend redirect.
    placeOrder(undefined, {
      onSuccess: (result) => {
        if (result.paymentIntent?.payment?.paymentId) {
          // Clear cart state locally after checkout initiates
          useCartStore.getState().clearLocalCart();
          // Redirect to payment processing / status page
          router.push(`/payments/${result.paymentIntent.payment.paymentId}`);
        } else {
          // Fallback if no payment intent
          useCartStore.getState().clearLocalCart();
          setOrderResult(result);
        }
      },
      onError: (err) => showToast(extractCartError(err)),
    });
  };

  // ── Order Success Screen ───────────────────────────────────────────
  if (orderResult) return <OrderSuccess result={orderResult} />;

  const items = cart?.items ?? [];
  const anyMutating = updating || removing || clearing;

  return (
    <div className="min-h-screen bg-[#FFFBF5]" style={{ color: '#1A1208' }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          padding: '14px 20px', borderRadius: 14, fontWeight: 600, fontSize: 14,
          background: toast.type === 'error' ? '#dc2626' : '#16a34a',
          color: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
          maxWidth: 320, animation: 'slideIn 0.3s ease',
        }}>
          {toast.type === 'error' ? '❌ ' : '✅ '}{toast.msg}
        </div>
      )}

      {/* ── Navbar ── */}
      <nav style={{ background: 'rgba(255,251,245,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #F0E6D8', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => router.back()} style={{ width: 38, height: 38, borderRadius: 12, border: '1.5px solid #F0E6D8', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>←</button>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#E8441A,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🍕</div>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#1A1208', fontFamily: 'var(--font-outfit)' }}>Swadesh</span>
            </Link>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#1A1208', fontFamily: 'var(--font-outfit)' }}>
              · Cart
              {items.length > 0 && <span style={{ fontSize: 13, fontWeight: 600, color: '#B5957D', marginLeft: 6 }}>({items.length} items)</span>}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {items.length > 0 && (
              <button
                onClick={handleClear}
                disabled={anyMutating}
                style={{ fontSize: 12, color: '#B5957D', background: 'none', border: '1.5px solid #F0E6D8', borderRadius: 10, padding: '6px 14px', cursor: 'pointer', fontWeight: 600 }}
              >
                {clearing ? 'Clearing…' : 'Clear all'}
              </button>
            )}
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 12, border: '1.5px solid #F0E6D8', background: 'white' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#E8441A,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 12 }}>
                  {user.name[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#4A3728' }}>{user.name.split(' ')[0]}</span>
              </div>
            )}
            <NotificationDropdown />
          </div>
        </div>
      </nav>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 80px' }}>
        {isLoading ? (
          <CartSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5 text-center">
            <span className="text-5xl">⚠️</span>
            <p className="text-lg font-bold text-[#1A1208]">Could not load your cart</p>
            <p className="text-sm text-[#8C6E5A]">Check your connection and try again.</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 rounded-2xl text-white font-bold text-sm cursor-pointer border-none"
              style={{ background: '#E8441A', boxShadow: '0 6px 20px rgba(232,68,26,0.3)' }}
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* ── LEFT: Items + Order Type ── */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map(item => (
                <CartItemCard
                  key={item._id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                  isUpdating={
                    (updating && (updateVars as { itemId: string })?.itemId === item._id) ||
                    (removing && removeVars === item._id)
                  }
                />
              ))}

              {/* Dining option */}
              <div style={{ background: 'white', borderRadius: 20, padding: '24px 24px', border: '1.5px solid #F0E6D8', marginTop: 4 }}>
                <h3 style={{ fontWeight: 800, color: '#1A1208', fontSize: 14, marginBottom: 14 }}>Dining Option</h3>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {([
                    { key: 'Delivery', icon: '🛵', label: 'Delivery' },
                    { key: 'Takeaway', icon: '🥡', label: 'Takeaway' },
                    { key: 'DineIn',   icon: '🍽️', label: 'Dine In'  },
                  ] as const).map(({ key, icon, label }) => (
                    <button
                      key={key}
                      onClick={() => setOrderType(key)}
                      style={{
                        padding: '10px 20px', borderRadius: 14, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        background: orderType === key ? '#E8441A' : 'white',
                        color: orderType === key ? 'white' : '#4A3728',
                        border: orderType === key ? '2px solid #E8441A' : '2px solid #F0E6D8',
                        boxShadow: orderType === key ? '0 4px 12px rgba(232,68,26,0.25)' : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      {icon} {label}
                    </button>
                  ))}
                </div>
                {orderType === 'DineIn' && (
                  <div style={{ marginTop: 16 }}>
                    <label htmlFor="table" style={{ fontSize: 11, fontWeight: 700, color: '#B5957D', textTransform: 'uppercase', letterSpacing: 1.2, display: 'block', marginBottom: 6 }}>
                      Table Number
                    </label>
                    <input
                      id="table"
                      value={tableNumber}
                      onChange={e => setTableNumber(e.target.value)}
                      placeholder="e.g. Table 4"
                      style={{ padding: '12px 16px', borderRadius: 12, border: '1.5px solid #F0E6D8', background: '#FFFBF5', fontSize: 14, color: '#1A1208', outline: 'none', width: '100%', maxWidth: 240 }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: Summary ── */}
            <CartSummary 
              cart={cart!} 
              itemCount={itemCount} 
              checkingOut={checkingOut} 
              anyMutating={anyMutating} 
              onCheckout={handleCheckout} 
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────── PAGE EXPORT ─────────────────────────── */
export default function CartPage() {
  return (
    <AuthGuard>
      <CartContent />
    </AuthGuard>
  );
}
