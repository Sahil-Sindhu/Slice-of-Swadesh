'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '../../components/shared/AuthGuard';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useProfile } from '../../features/profile/hooks/useProfile';
import { addAddress } from '../../features/auth/api/authApi';

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

  // ── Profile / Address fetching ──────────────────────────────────────
  const { data: profile, refetch: refetchProfile } = useProfile();
  const [selectedAddressId, setSelectedAddressId] = React.useState<string>('');

  // ── Add address form state ──────────────────────────────────────────
  const [showAddAddress, setShowAddAddress] = React.useState(false);
  const [newAddressLabel, setNewAddressLabel] = React.useState<'Home' | 'Office' | 'Other'>('Home');
  const [newAddressStreet, setNewAddressStreet] = React.useState('');
  const [newAddressCity, setNewAddressCity] = React.useState('');
  const [newAddressZip, setNewAddressZip] = React.useState('');
  const [addingAddress, setAddingAddress] = React.useState(false);

  // ── Mutations ──────────────────────────────────────────────────────
  const { mutate: updateItem, isPending: updating, variables: updateVars } = useUpdateCartItem();
  const { mutate: removeItem, isPending: removing, variables: removeVars } = useRemoveCartItem();
  const { mutate: clearAllItems, isPending: clearing } = useClearCart();
  const { mutate: placeOrder, isPending: checkingOut } = useCheckout();

  // ── Local state ────────────────────────────────────────────────────
  const [orderType, setOrderType] = React.useState<'Delivery' | 'Takeaway' | 'DineIn'>('Delivery');
  const [tableNumber, setTableNumber] = React.useState('');
  const [orderResult, setOrderResult] = React.useState<CheckoutResult | null>(null);

  // Auto-select default/first address
  React.useEffect(() => {
    if (profile?.addresses?.length) {
      const defaultAddr = profile.addresses.find((a: any) => a.isDefault) ?? profile.addresses[0];
      setSelectedAddressId(defaultAddr._id);
    }
  }, [profile]);

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

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressStreet.trim() || !newAddressCity.trim() || !newAddressZip.trim()) {
      showToast('Please fill out all address fields.');
      return;
    }
    setAddingAddress(true);
    try {
      const updatedUser = await addAddress({
        label: newAddressLabel,
        street: newAddressStreet,
        city: newAddressCity,
        zipCode: newAddressZip,
        isDefault: !profile?.addresses?.length,
      });
      showToast('Address added successfully!', 'success');
      await refetchProfile();
      setShowAddAddress(false);
      setNewAddressStreet('');
      setNewAddressCity('');
      setNewAddressZip('');
      if (updatedUser?.addresses?.length) {
        const last = updatedUser.addresses[updatedUser.addresses.length - 1];
        setSelectedAddressId(last._id);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to add address');
    } finally {
      setAddingAddress(false);
    }
  };

  const handleCheckout = (paymentMethod: string) => {
    let notes = '';
    if (orderType === 'Delivery') {
      if (!selectedAddressId) {
        showToast('Please select or add a delivery address.');
        return;
      }
      const addr = profile?.addresses?.find((a: any) => a._id === selectedAddressId);
      if (!addr) {
        showToast('Selected address not found.');
        return;
      }
      notes = `Deliver to: [${addr.label}] ${addr.street}, ${addr.city} - ${addr.zipCode}`;
    } else if (orderType === 'DineIn') {
      if (!tableNumber.trim()) {
        showToast('Please enter your table number.');
        return;
      }
      notes = `Dine In: ${tableNumber}`;
    } else {
      notes = 'Takeaway Order';
    }

    placeOrder(notes, {
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
                {orderType === 'Delivery' && (
                  <div style={{ marginTop: 20, borderTop: '1.5px dashed #F0E6D8', paddingTop: 20 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: '#1A1208', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Delivery Address
                    </h4>
                    
                    {profile?.addresses && profile.addresses.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                        {profile.addresses.map((addr: any) => (
                          <label
                            key={addr._id}
                            style={{
                              display: 'flex', alignItems: 'center',
                              padding: '14px 16px',
                              borderRadius: 16, border: '2px solid', cursor: 'pointer',
                              borderColor: selectedAddressId === addr._id ? '#E8441A' : '#F0E6D8',
                              background: selectedAddressId === addr._id ? '#FFF5F0' : 'white',
                              transition: 'all 0.2s'
                            }}
                          >
                            <input
                              type="radio"
                              name="deliveryAddress"
                              value={addr._id}
                              checked={selectedAddressId === addr._id}
                              onChange={() => setSelectedAddressId(addr._id)}
                              style={{ marginRight: 12, accentColor: '#E8441A' }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <span style={{ fontSize: 13, fontWeight: 800, color: '#1A1208', display: 'flex', alignItems: 'center', gap: 6 }}>
                                {addr.label}
                                {addr.isDefault && (
                                  <span style={{ fontSize: 9, background: '#FFF0EB', color: '#E8441A', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>DEFAULT</span>
                                )}
                              </span>
                              <span style={{ fontSize: 12, color: '#8C6E5A', fontWeight: 500 }}>
                                {addr.street}, {addr.city} - {addr.zipCode}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: '16px 20px', borderRadius: 16, background: '#FFFBF5', border: '1.5px solid #F0E6D8', color: '#8C6E5A', fontSize: 13, marginBottom: 16, fontWeight: 500 }}>
                        No delivery addresses saved. Add one below to place your order.
                      </div>
                    )}

                    {!showAddAddress ? (
                      <button
                        onClick={() => setShowAddAddress(true)}
                        style={{
                          background: 'white', color: '#E8441A', border: '1.5px solid #E8441A',
                          borderRadius: 12, padding: '8px 16px', fontSize: 12, fontWeight: 700,
                          cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        + Add New Address
                      </button>
                    ) : (
                      <form onSubmit={handleAddAddress} style={{ background: '#FFFBF5', padding: 20, borderRadius: 20, border: '1.5px solid #F0E6D8', marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F0E6D8', paddingBottom: 10 }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: '#1A1208' }}>NEW ADDRESS</span>
                          <button type="button" onClick={() => setShowAddAddress(false)} style={{ background: 'none', border: 'none', color: '#B5957D', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Cancel</button>
                        </div>
                        
                        <div style={{ display: 'flex', gap: 8 }}>
                          {(['Home', 'Office', 'Other'] as const).map(lbl => (
                            <button
                              key={lbl}
                              type="button"
                              onClick={() => setNewAddressLabel(lbl)}
                              style={{
                                flex: 1, padding: '6px 12px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                                background: newAddressLabel === lbl ? '#E8441A' : 'white',
                                color: newAddressLabel === lbl ? 'white' : '#4A3728',
                                border: newAddressLabel === lbl ? '1.5px solid #E8441A' : '1.5px solid #F0E6D8',
                              }}
                            >
                              {lbl}
                            </button>
                          ))}
                        </div>

                        <input
                          placeholder="Street Address (e.g. 123 Main St)"
                          value={newAddressStreet}
                          onChange={e => setNewAddressStreet(e.target.value)}
                          required
                          style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #F0E6D8', background: 'white', fontSize: 13, color: '#1A1208', outline: 'none' }}
                        />

                        <div style={{ display: 'flex', gap: 10 }}>
                          <input
                            placeholder="City"
                            value={newAddressCity}
                            onChange={e => setNewAddressCity(e.target.value)}
                            required
                            style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #F0E6D8', background: 'white', fontSize: 13, color: '#1A1208', outline: 'none' }}
                          />
                          <input
                            placeholder="Zip Code"
                            value={newAddressZip}
                            onChange={e => setNewAddressZip(e.target.value)}
                            required
                            style={{ width: 100, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #F0E6D8', background: 'white', fontSize: 13, color: '#1A1208', outline: 'none' }}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={addingAddress}
                          style={{
                            background: '#E8441A', color: 'white', border: 'none',
                            borderRadius: 12, padding: '10px 16px', fontSize: 12, fontWeight: 700,
                            cursor: 'pointer', transition: 'all 0.2s', marginTop: 6,
                            opacity: addingAddress ? 0.7 : 1
                          }}
                        >
                          {addingAddress ? 'Saving Address...' : 'Save & Select Address'}
                        </button>
                      </form>
                    )}
                  </div>
                )}
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
