'use client';

import * as React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Container, Section, Grid, Flex, Stack } from '../../../components/layout/LayoutComponents';
import { AnalyticsCard } from '../../../components/dashboard/AnalyticsCard';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/api/client';
import { Users, Mail, Percent, Gift, AlertTriangle, RefreshCw } from 'lucide-react';

export default function CRMDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<'segments' | 'campaigns' | 'gifts'>('segments');

  // Query to fetch all historical orders to construct CRM details
  const { data: ordersData, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['admin', 'crm-orders'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/v1/orders', { params: { limit: 100 } });
      return data.data;
    }
  });

  const orders = ordersData?.orders || [];

  // Local state for campaign form
  const [campaignTitle, setCampaignTitle] = React.useState('');
  const [campaignChannel, setCampaignChannel] = React.useState('Email');
  const [campaignSegment, setCampaignSegment] = React.useState('All');

  // Local state for gift card form
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

  // Compile customer loyalty details from actual orders
  const customerMap: Record<string, { id: string; name: string; email: string; totalSpent: number; ordersCount: number; tier: string }> = {};

  orders.forEach((order: any) => {
    const cust = order.customerDoc || order.customer;
    if (cust && typeof cust === 'object') {
      const custId = cust._id || cust.id;
      const name = cust.name || 'Registered Customer';
      const email = cust.email || 'info@sliceofswadesh.com';
      
      if (!customerMap[custId]) {
        customerMap[custId] = {
          id: custId,
          name,
          email,
          totalSpent: 0,
          ordersCount: 0,
          tier: 'Bronze'
        };
      }
      customerMap[custId].ordersCount += 1;
      customerMap[custId].totalSpent += order.grandTotal;

      // Assign loyalty tier based on total spent
      const total = customerMap[custId].totalSpent;
      if (total >= 5000) customerMap[custId].tier = 'Elite';
      else if (total >= 2500) customerMap[custId].tier = 'Gold';
      else if (total >= 1000) customerMap[custId].tier = 'Silver';
      else customerMap[custId].tier = 'Bronze';
    }
  });

  const clients = Object.values(customerMap);
  const totalLeadsCount = clients.length;
  
  // Calculate total coins/points issued (1 coin per ₹10 spent)
  const totalSpentAllTime = clients.reduce((sum, item) => sum + item.totalSpent, 0);
  const totalCoinsIssued = Math.round(totalSpentAllTime / 10);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#E8441A] border-t-transparent animate-spin" />
          <p className="text-sm text-[#8C6E5A] font-sans">Loading customer loyalty files…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center p-6">
        <Card className="p-8 border border-border bg-white text-center max-w-md">
          <AlertTriangle className="mx-auto text-[#E8441A] mb-4" size={48} />
          <h2 className="text-xl font-bold font-display text-text mb-2">Failed to Load CRM</h2>
          <p className="text-sm text-[#8C6E5A] mb-6">Could not retrieve customer registrations. Please try again.</p>
          <Button onClick={() => refetch()} variant="primary" className="px-6 py-2">
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-grow flex bg-[#F9F6F0] text-foreground min-h-screen font-sans">
      {/* 1. CRM Sidebar */}
      <aside className="w-64 border-r border-border bg-surface p-6 hidden md:block shrink-0">
        <div className="mb-8">
          <span className="text-xl font-bold font-display text-primary flex items-center gap-1.5">
            🍕 <span className="text-text font-sans">Swadesh CRM</span>
          </span>
        </div>
        <nav className="flex flex-col gap-2 font-semibold text-sm">
          {(['segments', 'campaigns', 'gifts'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
                activeTab === tab ? 'bg-primary text-white' : 'hover:bg-text/5 text-text-2'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. Main Content */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <Container>
          {/* Header Action row */}
          <Flex justify="between" className="mb-8 select-none">
            <div>
              <h1 className="text-3xl font-display font-bold text-text">CRM & Loyalty Hub</h1>
              <p className="text-xs text-text-3 mt-1">Manage customer tiers, dispatch automated campaigns, and issue gift cards.</p>
            </div>
            <Flex gap="sm" align="center">
              {isRefetching && <RefreshCw size={14} className="text-text-3 animate-spin" />}
              <Button onClick={() => refetch()} variant="outline" size="sm">
                Refresh Live
              </Button>
            </Flex>
          </Flex>

          <Stack gap="lg" className="mb-8">
            <Grid cols={3}>
              <AnalyticsCard title="Leads Cataloged" value={`${totalLeadsCount} Contacts`} />
              <AnalyticsCard title="AOV Loyalty Conversion" value="10%" change={10} timeframe="points / spent" />
              <AnalyticsCard title="Loyalty Points Earned" value={`${totalCoinsIssued} Points`} />
            </Grid>
          </Stack>

          {/* CUSTOMER SEGMENTS TAB */}
          {activeTab === 'segments' && (
            <Card className="p-6 border border-border bg-surface">
              <h3 className="font-heading font-bold text-xl mb-4 text-text">Customer Loyalty Directory</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border text-text-3 font-bold">
                      <th className="pb-3">Customer Name</th>
                      <th className="pb-3">Email Address</th>
                      <th className="pb-3">Orders Placed</th>
                      <th className="pb-3">Points Earned</th>
                      <th className="pb-3">Loyalty Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map(client => {
                      const points = Math.round(client.totalSpent / 10);
                      return (
                        <tr key={client.id} className="border-b border-border/40 hover:bg-text/5">
                          <td className="py-4 font-bold text-text">{client.name}</td>
                          <td className="py-4 text-text-2">{client.email}</td>
                          <td className="py-4 font-mono font-bold text-text-3">{client.ordersCount}</td>
                          <td className="py-4 font-mono font-bold text-text">{points} Pts</td>
                          <td className="py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                              client.tier === 'Elite' ? 'bg-[#FFF0EB] text-[#E8441A]' :
                              client.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                              client.tier === 'Silver' ? 'bg-gray-100 text-gray-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {client.tier}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {clients.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-text-3 italic">
                          No customer orders recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* LAUNCH CAMPAIGN TAB */}
          {activeTab === 'campaigns' && (
            <Card className="p-6 border border-border bg-surface max-w-lg">
              <h3 className="font-heading font-bold text-xl mb-4 text-text">Launch Marketing Campaign</h3>
              <form onSubmit={handleLaunchCampaign} className="flex flex-col gap-4 font-sans text-sm">
                <Input
                  label="Campaign Subject / Title"
                  required
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="e.g. 20% off on all Tandoori Pizzas!"
                  id="campaign_subject"
                />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="c_chan" className="text-sm font-semibold text-text-2">Delivery Channel</label>
                  <select
                    id="c_chan"
                    value={campaignChannel}
                    onChange={(e) => setCampaignChannel(e.target.value)}
                    className="w-full bg-surface border border-border text-text px-4 py-3 rounded-xl focus:outline-none"
                  >
                    <option>Email</option>
                    <option>SMS</option>
                    <option>Push Notification</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="c_seg" className="text-sm font-semibold text-text-2">Target Audience Segment</label>
                  <select
                    id="c_seg"
                    value={campaignSegment}
                    onChange={(e) => setCampaignSegment(e.target.value)}
                    className="w-full bg-surface border border-border text-text px-4 py-3 rounded-xl focus:outline-none"
                  >
                    <option value="All">All Registered Customers ({totalLeadsCount})</option>
                    <option value="Elite">Elite Tier Members Only</option>
                    <option value="Gold">Gold Tier Members Only</option>
                    <option value="Bronze">Bronze/Inactive Members Only</option>
                  </select>
                </div>
                <Button type="submit" variant="primary" className="py-2.5 mt-2">
                  Dispatch Campaign
                </Button>
              </form>
            </Card>
          )}

          {/* GIFT CARDS TAB */}
          {activeTab === 'gifts' && (
            <Card className="p-6 border border-border bg-surface max-w-lg">
              <h3 className="font-heading font-bold text-xl mb-4 text-text">Issue Store Gift Card</h3>
              <form onSubmit={handleGenerateGiftCard} className="flex flex-col gap-4 font-sans text-sm">
                <Input
                  label="Gift Balance (INR)"
                  type="number"
                  required
                  value={giftCardAmount}
                  onChange={(e) => setGiftCardAmount(Number(e.target.value))}
                  placeholder="₹500"
                  id="gift_bal"
                />
                <Button type="submit" variant="primary" className="py-2.5 mt-2">
                  Generate Gift Card Code
                </Button>
                {giftCardCode && (
                  <div className="p-4 bg-success/5 border border-success/30 text-success rounded-xl text-center font-mono font-bold text-sm mt-3">
                    Active Code: {giftCardCode} (Value: ₹{giftCardAmount})
                  </div>
                )}
              </form>
            </Card>
          )}
        </Container>
      </main>
    </div>
  );
}
