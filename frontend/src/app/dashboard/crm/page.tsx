'use client';

import * as React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Container, Section, Grid, Flex, Stack } from '../../../components/layout/LayoutComponents';
import { AnalyticsCard } from '../../../components/dashboard/AnalyticsCard';

interface CRMClient {
  id: string;
  name: string;
  email: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Elite';
  coins: number;
  status: 'Active' | 'Inactive';
}

export default function CRMDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<'segments' | 'campaigns' | 'gifts'>('segments');
  const [clients, setClients] = React.useState<CRMClient[]>([
    { id: '1', name: 'Amit Sharma', email: 'amit.sharma@gmail.com', tier: 'Elite', coins: 1420, status: 'Active' },
    { id: '2', name: 'Priya Patel', email: 'priya.patel@gmail.com', tier: 'Gold', coins: 640, status: 'Active' },
    { id: '3', name: 'Vikram Singh', email: 'vikram.singh@gmail.com', tier: 'Bronze', coins: 120, status: 'Inactive' },
  ]);

  const [campaignTitle, setCampaignTitle] = React.useState('');
  const [campaignChannel, setCampaignChannel] = React.useState('Email');
  const [campaignSegment, setCampaignSegment] = React.useState('All');

  const [giftCardAmount, setGiftCardAmount] = React.useState(0);
  const [giftCardCode, setGiftCardCode] = React.useState('');

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle) return alert('Please enter a valid campaign subject/title');
    alert(`Campaign "${campaignTitle}" successfully dispatched via ${campaignChannel} to target segment: ${campaignSegment}.`);
    setCampaignTitle('');
  };

  const handleGenerateGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (giftCardAmount <= 0) return alert('Please enter a valid gift card amount');
    const code = `SWADESH-GIFT-${Math.floor(100000 + Math.random() * 900000)}`;
    setGiftCardCode(code);
    alert(`Gift Card issued! Code: ${code} for Value: ₹${giftCardAmount}`);
  };

  return (
    <div className="flex-grow flex bg-[#F9F6F0] text-foreground min-h-screen font-sans">
      {/* 1. CRM Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-6 hidden md:block shrink-0">
        <div className="mb-8">
          <span className="text-xl font-bold font-display text-primary flex items-center gap-1.5">
            🍕 <span className="text-foreground font-sans">Swadesh CRM</span>
          </span>
        </div>
        <nav className="flex flex-col gap-2 font-semibold text-sm">
          {(['segments', 'campaigns', 'gifts'] as const).map(tab => (
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

      {/* 2. Main content */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <Container>
          {/* Header Action row */}
          <Flex justify="between" className="mb-8 select-none">
            <div>
              <h1 className="text-3xl font-display font-bold">CRM & Loyalty Hub</h1>
              <p className="text-xs text-foreground/50 mt-1">Manage customer tiers, dispatch automated campaigns, and issue gift cards.</p>
            </div>
            <Button onClick={() => alert('Recalculating loyalty points levels...')} variant="outline" size="sm">
              Recalculate Tiers
            </Button>
          </Flex>

          <Stack gap="lg" className="mb-8">
            <Grid cols={3}>
              <AnalyticsCard title="Total Leads Cataloged" value="1,840 Contacts" change={14.8} timeframe="vs last month" />
              <AnalyticsCard title="Campaign Open Rate" value="42.5%" change={1.2} timeframe="average email open rate" />
              <AnalyticsCard title="Loyalty Coins Issued" value="18,450 Coins" change={8.4} timeframe="vs last week" />
            </Grid>
          </Stack>

          {/* CUSTOMER SEGMENTS TAB */}
          {activeTab === 'segments' && (
            <Card className="p-6 border border-border bg-card">
              <h3 className="font-heading font-bold text-xl mb-4">Customer Segment Directory</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border text-foreground/50 font-bold">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Membership Tier</th>
                      <th className="pb-3">Coins Balance</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map(client => (
                      <tr key={client.id} className="border-b border-border/40 hover:bg-foreground/5">
                        <td className="py-4 font-bold">{client.name}</td>
                        <td className="py-4 text-xs text-foreground/60">{client.email}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                            client.tier === 'Elite' ? 'bg-primary/10 text-primary' : client.tier === 'Gold' ? 'bg-warning/10 text-warning' : 'bg-foreground/5 text-foreground/75'
                          }`}>
                            {client.tier}
                          </span>
                        </td>
                        <td className="py-4 font-mono font-semibold">{client.coins} Coins</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            client.status === 'Active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                          }`}>
                            {client.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* CAMPAIGN BUILDER TAB */}
          {activeTab === 'campaigns' && (
            <Grid cols={3} className="gap-8 items-start">
              {/* Campaign list */}
              <Card className="col-span-2 p-6 border border-border bg-card">
                <h3 className="font-heading font-bold text-xl mb-4">Active Campaigns Queue</h3>
                <div className="flex flex-col gap-4 font-sans text-sm">
                  <div className="flex justify-between items-center border-b border-border/40 pb-3">
                    <div>
                      <h5 className="font-bold">✨ Student Weekend Naan Special</h5>
                      <span className="text-xs text-foreground/50">Channel: SMS | Target: Student Segment</span>
                    </div>
                    <span className="text-xs font-bold text-success">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-bold">🎂 Birthday Loyalty Coin Bonus Alert</h5>
                      <span className="text-xs text-foreground/50">Channel: Email | Target: Birthday Segment</span>
                    </div>
                    <span className="text-xs font-bold text-foreground/50">Completed</span>
                  </div>
                </div>
              </Card>

              {/* Build Campaign form */}
              <Card className="p-6 border border-border bg-card">
                <h3 className="font-heading font-bold text-lg mb-4">Create Campaign</h3>
                <form onSubmit={handleLaunchCampaign} className="flex flex-col gap-4">
                  <Input
                    label="Campaign Name"
                    required
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    placeholder="e.g. Diwali Fest Special"
                    id="cname"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cchan" className="text-sm font-semibold text-foreground/80">Broadcast Channel</label>
                    <select
                      id="cchan"
                      value={campaignChannel}
                      onChange={(e) => setCampaignChannel(e.target.value)}
                      className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    >
                      <option>Email</option>
                      <option>SMS</option>
                      <option>WhatsApp</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cseg" className="text-sm font-semibold text-foreground/80">Target Segment</label>
                    <select
                      id="cseg"
                      value={campaignSegment}
                      onChange={(e) => setCampaignSegment(e.target.value)}
                      className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    >
                      <option>All Customers</option>
                      <option>VIP Gold/Elite Customers</option>
                      <option>Inactive Customers (Win-Back)</option>
                    </select>
                  </div>
                  <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
                    Dispatch Campaign
                  </Button>
                </form>
              </Card>
            </Grid>
          )}

          {/* GIFT CARDS TAB */}
          {activeTab === 'gifts' && (
            <Grid cols={3} className="gap-8 items-start">
              <Card className="p-6 border border-border bg-card col-span-2">
                <h3 className="font-heading font-bold text-xl mb-4 font-display">Issue Swadesh Gift Card</h3>
                <form onSubmit={handleGenerateGiftCard} className="flex flex-col gap-4">
                  <Input
                    label="Gift Card Value (₹)"
                    type="number"
                    required
                    value={giftCardAmount}
                    onChange={(e) => setGiftCardAmount(Number(e.target.value))}
                    placeholder="1000"
                    id="gamt"
                  />
                  <Button type="submit" variant="primary" className="py-2.5 mt-2">
                    Generate Gift Voucher Code
                  </Button>
                </form>
              </Card>

              {giftCardCode && (
                <Card className="p-6 border-2 border-dashed border-primary bg-primary/5 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl mb-1">🎁</span>
                  <h4 className="font-heading font-bold text-sm text-foreground mb-2">Voucher Code</h4>
                  <span className="font-mono text-base font-bold bg-card border border-border px-4 py-2 rounded-xl text-primary mb-2 select-all">
                    {giftCardCode}
                  </span>
                  <span className="text-xs text-foreground/50">Value: ₹{giftCardAmount}</span>
                </Card>
              )}
            </Grid>
          )}
        </Container>
      </main>
    </div>
  );
}
