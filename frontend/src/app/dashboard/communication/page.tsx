'use client';

import * as React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Container, Section, Grid, Flex, Stack } from '../../../components/layout/LayoutComponents';
import { AnalyticsCard } from '../../../components/dashboard/AnalyticsCard';
import { useQuery } from '@tanstack/react-query';
import { getAdminNotifications, markAllAsRead, markAsRead } from '../../../features/notification/api/notificationApi';

interface InAppAlert {
  id: string;
  category: 'Order' | 'Marketing' | 'Kitchen' | 'System';
  message: string;
  time: string;
  isRead: boolean;
}

export default function CommunicationDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<'logs' | 'templates' | 'preferences'>('logs');

  const { data: adminNotificationData, refetch } = useQuery({
    queryKey: ['adminNotifications'],
    queryFn: () => getAdminNotifications(1, 20),
    refetchInterval: 30000,
  });

  const alerts = adminNotificationData?.notifications || [];

  const [testChannel, setTestChannel] = React.useState('Email');
  const [testRecipient, setTestRecipient] = React.useState('');
  const [testContent, setTestContent] = React.useState('');

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendTestNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRecipient || !testContent) return alert('Please enter valid recipient and content specs');
    alert(`Test notification sent successfully via ${testChannel} to ${testRecipient}`);
    setTestRecipient('');
    setTestContent('');
  };

  return (
    <div className="flex-grow flex bg-[#F9F6F0] dark:bg-[#121110] text-foreground min-h-screen font-sans">
      {/* 1. Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-6 hidden md:block shrink-0">
        <div className="mb-8">
          <span className="text-xl font-bold font-display text-primary flex items-center gap-1.5">
            🍕 <span className="text-foreground font-sans">Swadesh Hub</span>
          </span>
        </div>
        <nav className="flex flex-col gap-2 font-semibold text-sm">
          {(['logs', 'templates', 'preferences'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
                activeTab === tab ? 'bg-primary text-white' : 'hover:bg-foreground/5 text-foreground/70'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. Main content workspace */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <Container>
          {/* Header Action row */}
          <Flex justify="between" className="mb-8 select-none">
            <div>
              <h1 className="text-3xl font-display font-bold">Enterprise Communication Hub</h1>
              <p className="text-xs text-foreground/50 mt-1">Configure automated triggers, monitor open rates, and dispatch test payloads.</p>
            </div>
            <Button onClick={handleMarkAllRead} variant="outline" size="sm">
              Mark all read
            </Button>
          </Flex>

          <Stack gap="lg" className="mb-8">
            <Grid cols={3}>
              <AnalyticsCard title="Total Dispatches" value="48,500 Alerts" change={2.1} timeframe="via Queue Processor" />
              <AnalyticsCard title="Average Open Rate" value="38.4%" change={1.5} timeframe="across all channels" />
              <AnalyticsCard title="Failed Deliveries" value="12 Retries" change={-50} timeframe="automatic retry loops" />
            </Grid>
          </Stack>

          {/* NOTIFICATION LOGS & INBOX */}
          {activeTab === 'logs' && (
            <Grid cols={3} className="gap-8 items-start">
              {/* In-app Notification list */}
              <Card className="col-span-2 p-6 border border-border bg-card">
                <h3 className="font-heading font-bold text-xl mb-4">In-App Notification Center</h3>
                <Stack gap="sm">
                  {alerts.length === 0 && <p className="text-sm text-foreground/50 py-4">No system notifications found.</p>}
                  {alerts.map((alert: any) => (
                    <div
                      key={alert._id}
                      className={`flex justify-between items-start border-b border-border/40 pb-3 last:border-0 last:pb-0 font-sans text-sm ${
                        alert.read ? 'text-foreground/50' : 'font-semibold'
                      }`}
                    >
                      <div className="flex gap-3">
                        <span className="text-base select-none mt-1">
                          {alert.type === 'LOW_STOCK' ? '🚨' : alert.type.includes('PAYMENT_FAILED') ? '❌' : '📦'}
                        </span>
                        <div>
                          <p className="font-bold text-foreground">{alert.title}</p>
                          <p>{alert.message}</p>
                          <span className="text-xs text-foreground/40 mt-1 block">{new Date(alert.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[10px] font-bold bg-foreground/5 px-2 py-0.5 rounded-full uppercase">
                          {alert.type.replace(/_/g, ' ')}
                        </span>
                        {!alert.read && (
                          <button 
                            onClick={async () => {
                              await markAsRead(alert._id);
                              refetch();
                            }}
                            className="text-xs text-primary hover:underline cursor-pointer"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </Stack>
              </Card>

              {/* Instant Test Dispatcher */}
              <Card className="p-6 border border-border bg-card">
                <h3 className="font-heading font-bold text-lg mb-4">Test Dispatcher</h3>
                <form onSubmit={handleSendTestNotification} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="tchan" className="text-sm font-semibold text-foreground/80">Select Channel</label>
                    <select
                      id="tchan"
                      value={testChannel}
                      onChange={(e) => setTestChannel(e.target.value)}
                      className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    >
                      <option>Email</option>
                      <option>SMS</option>
                      <option>WhatsApp</option>
                    </select>
                  </div>
                  <Input
                    label="Recipient / Address"
                    required
                    value={testRecipient}
                    onChange={(e) => setTestRecipient(e.target.value)}
                    placeholder="e.g. name@gmail.com"
                    id="trec"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="tcont" className="text-sm font-semibold text-foreground/80">Message Body</label>
                    <textarea
                      id="tcont"
                      required
                      value={testContent}
                      onChange={(e) => setTestContent(e.target.value)}
                      placeholder="e.g. Your verification OTP code is 9821."
                      className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[70px] text-xs"
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
                    Send payload
                  </Button>
                </form>
              </Card>
            </Grid>
          )}

          {/* TEMPLATE MANAGER TAB */}
          {activeTab === 'templates' && (
            <Card className="p-6 border border-border bg-card">
              <h3 className="font-heading font-bold text-xl mb-4">Notification Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
                <Card className="p-5 border border-border bg-background flex flex-col gap-2">
                  <h4 className="font-heading font-bold text-sm text-foreground">welcome_email.html</h4>
                  <pre className="bg-foreground/5 p-3 rounded border border-border/80 text-[10px] text-foreground/70 overflow-x-auto leading-relaxed">
                    {`<h3>Welcome to Swadesh, {{name}}!</h3>\n<p>Your loyalty points balance: {{coins}} Coins.</p>`}
                  </pre>
                </Card>
                <Card className="p-5 border border-border bg-background flex flex-col gap-2">
                  <h4 className="font-heading font-bold text-sm text-foreground">order_update_sms.txt</h4>
                  <pre className="bg-foreground/5 p-3 rounded border border-border/80 text-[10px] text-foreground/70 overflow-x-auto leading-relaxed">
                    {`Order {{orderNumber}} status updated to {{status}}. Track live progress at {{trackUrl}}`}
                  </pre>
                </Card>
              </div>
            </Card>
          )}

          {/* PREFERENCES SETTINGS */}
          {activeTab === 'preferences' && (
            <Card className="p-6 border border-border bg-card max-w-xl">
              <h3 className="font-heading font-bold text-xl mb-4">Global Preferences</h3>
              <Stack gap="md" className="font-sans text-sm">
                <label className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0 select-none cursor-pointer">
                  <span>Mute Marketing campaigns during late night hours</span>
                  <input type="checkbox" defaultChecked className="rounded border-border text-primary" />
                </label>
                <label className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0 select-none cursor-pointer">
                  <span>Enable auto retry loops for failed SMS webhooks</span>
                  <input type="checkbox" defaultChecked className="rounded border-border text-primary" />
                </label>
              </Stack>
            </Card>
          )}
        </Container>
      </main>
    </div>
  );
}
