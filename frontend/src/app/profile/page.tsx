'use client';

import * as React from 'react';
import Link from 'next/link';
import { AuthGuard } from '../../components/shared/AuthGuard';
import { Card } from '../../components/ui/Card';
import { Container, Section, Grid, Stack } from '../../components/layout/LayoutComponents';
import { useProfile, useOrderHistory, useUpdateProfile } from '../../features/profile/hooks/useProfile';
import { useQuery } from '@tanstack/react-query';
import { getNotifications, markAsRead } from '../../features/notification/api/notificationApi';
import { Badge } from '../../components/ui/Badge';

function ProfileContent() {
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const { data: orders = [] } = useOrderHistory();
  const updateProfileMutation = useUpdateProfile();

  const { data: notificationData, refetch: refetchNotifications } = useQuery({
    queryKey: ['notifications', 'history'],
    queryFn: () => getNotifications(1, 20),
  });
  const notifications = notificationData?.notifications || [];

  const [name, setName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [avatar, setAvatar] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhoneNumber(profile.phoneNumber || '');
      setAvatar(profile.avatar || '');
    }
  }, [profile]);

  const handleSave = () => {
    updateProfileMutation.mutate(
      { name, phoneNumber, avatar },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const initials = (profile?.name || 'SW').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#1A1208]">
      <Section py="md" className="border-b border-[#F0E6D8]">
        <Container>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#E8441A] font-semibold">My account</p>
              <h1 className="text-3xl font-bold">Welcome back, {profile?.name?.split(' ')[0] || 'foodie'}</h1>
            </div>
            <Link href="/" className="rounded-full border border-[#F0E6D8] bg-white px-4 py-2 text-sm font-semibold text-[#4A3728] hover:border-[#E8441A] hover:text-[#E8441A] transition-colors">
              Browse menu
            </Link>
          </div>
        </Container>
      </Section>

      <Section py="md">
        <Container>
          <Grid cols={3} className="gap-8 items-start">
            <Card className="p-6 border border-[#F0E6D8] bg-white flex flex-col items-center text-center shadow-sm">
              {avatar ? (
                <img src={avatar} alt={profile?.name || 'Profile'} className="w-24 h-24 object-cover rounded-full border border-[#F0E6D8] mb-3" />
              ) : (
                <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#E8441A] to-[#F59E0B] text-2xl font-black text-white">
                  {initials}
                </div>
              )}
              <h3 className="font-bold text-lg">{profile?.name || 'Your Name'}</h3>
              <span className="text-sm text-[#8C6E5A]">{profile?.email || 'your@email.com'}</span>
              <div className="mt-5 w-full rounded-2xl bg-[#FFF3EC] p-4 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8C6E5A]">Loyalty points</span>
                  <span className="font-bold text-[#E8441A]">{profile?.loyaltyPoints ?? 0}</span>
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-[#8C6E5A]">Role</span>
                  <span className="font-semibold capitalize">{profile?.role || 'customer'}</span>
                </div>
              </div>
            </Card>

            <Card className="col-span-2 border border-[#F0E6D8] bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">Profile settings</h3>
                  <p className="text-sm text-[#8C6E5A]">Keep your account details synced with the restaurant backend.</p>
                </div>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="rounded-full bg-[#E8441A] px-4 py-2 text-sm font-semibold text-white">Edit profile</button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="rounded-full border border-[#F0E6D8] px-4 py-2 text-sm font-semibold text-[#4A3728]">Cancel</button>
                    <button onClick={handleSave} disabled={updateProfileMutation.isPending} className="rounded-full bg-[#E8441A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70">
                      {updateProfileMutation.isPending ? 'Saving…' : 'Save changes'}
                    </button>
                  </div>
                )}
              </div>

              <Stack gap="md" className="mt-6">
                <label className="text-sm font-semibold text-[#4A3728]">
                  <span className="mb-2 block">Full name</span>
                  <input disabled={!isEditing} value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-[#F0E6D8] bg-[#FFFBF5] px-4 py-3 outline-none disabled:opacity-70" />
                </label>
                <label className="text-sm font-semibold text-[#4A3728]">
                  <span className="mb-2 block">Phone number</span>
                  <input disabled={!isEditing} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full rounded-2xl border border-[#F0E6D8] bg-[#FFFBF5] px-4 py-3 outline-none disabled:opacity-70" />
                </label>
                <label className="text-sm font-semibold text-[#4A3728]">
                  <span className="mb-2 block">Avatar URL</span>
                  <input disabled={!isEditing} value={avatar} onChange={(e) => setAvatar(e.target.value)} className="w-full rounded-2xl border border-[#F0E6D8] bg-[#FFFBF5] px-4 py-3 outline-none disabled:opacity-70" />
                </label>
              </Stack>
            </Card>
          </Grid>
        </Container>
      </Section>

      <Section py="md">
        <Container>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Recent orders</h2>
              <p className="text-sm text-[#8C6E5A]">Track your latest restaurant orders from the backend.</p>
            </div>
            <button onClick={() => refetch()} className="rounded-full border border-[#F0E6D8] bg-white px-4 py-2 text-sm font-semibold text-[#4A3728]">Refresh</button>
          </div>

          <div className="mt-6 grid gap-4">
            {isLoading ? (
              <div className="rounded-3xl border border-[#F0E6D8] bg-white p-8 text-sm text-[#8C6E5A]">Loading your order history…</div>
            ) : isError ? (
              <div className="rounded-3xl border border-[#F0E6D8] bg-white p-8 text-sm text-[#C93B15]">We could not load your order history right now.</div>
            ) : orders.length === 0 ? (
              <div className="rounded-3xl border border-[#F0E6D8] bg-white p-8 text-sm text-[#8C6E5A]">You have not placed any orders yet.</div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="rounded-3xl border border-[#F0E6D8] bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#E8441A]">#{order.orderNumber}</p>
                      <p className="text-lg font-bold">{order.items?.[0]?.foodName || 'Order placed'}</p>
                    </div>
                    <div className="rounded-full bg-[#FFF3EC] px-3 py-1 text-sm font-semibold text-[#E8441A]">{order.status}</div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-[#8C6E5A]">
                    <span>{order.items?.length || 0} item(s)</span>
                    <span>₹{order.grandTotal?.toLocaleString() || 0}</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <Link href={`/track/${order._id}`} className="font-semibold text-[#E8441A]">Track order →</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </Container>
      </Section>

      <Section py="md" className="border-t border-[#F0E6D8] bg-white">
        <Container>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Notification history</h2>
              <p className="text-sm text-[#8C6E5A]">All your recent alerts and updates.</p>
            </div>
            <button onClick={() => refetchNotifications()} className="rounded-full border border-[#F0E6D8] bg-white px-4 py-2 text-sm font-semibold text-[#4A3728]">Refresh</button>
          </div>

          <div className="mt-6 grid gap-4 max-h-[400px] overflow-y-auto pr-2">
            {notifications.length === 0 ? (
              <div className="rounded-3xl border border-[#F0E6D8] bg-[#FFFBF5] p-8 text-sm text-[#8C6E5A]">No notifications found.</div>
            ) : (
              notifications.map((notif: any) => (
                <div key={notif._id} className={`rounded-3xl border ${notif.read ? 'border-[#F0E6D8] bg-white' : 'border-[#E8441A] bg-[#FFF3EC]'} p-5 shadow-sm transition-colors`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg mb-1">{notif.title}</h4>
                      <p className="text-sm text-[#4A3728] mb-3">{notif.message}</p>
                      <div className="flex items-center gap-3">
                        <Badge variant={notif.read ? 'neutral' : 'warning'}>{notif.type.replace(/_/g, ' ')}</Badge>
                        <span className="text-xs font-semibold text-[#8C6E5A]">{new Date(notif.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    {!notif.read && (
                      <button 
                        onClick={async () => {
                          await markAsRead(notif._id);
                          refetchNotifications();
                        }}
                        className="text-xs font-bold text-[#E8441A] hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
