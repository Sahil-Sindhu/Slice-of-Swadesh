'use client';

import * as React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Container, Section, Grid, Flex, Stack } from '../../../components/layout/LayoutComponents';
import { AnalyticsCard } from '../../../components/dashboard/AnalyticsCard';

interface Branch {
  id: string;
  name: string;
  manager: string;
  monthlyRevenue: string;
  status: 'Active' | 'Under Maintenance';
  pricingMultiplier: number;
}

export default function FranchiseDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<'branches' | 'pricing' | 'tenant'>('branches');
  const [branches, setBranches] = React.useState<Branch[]>([
    { id: '1', name: 'Swadesh - Mumbai Bandra', manager: 'Sunil Rao', monthlyRevenue: '₹8,42,000', status: 'Active', pricingMultiplier: 1.15 },
    { id: '2', name: 'Swadesh - Delhi Connaught Place', manager: 'Rajesh Gupta', monthlyRevenue: '₹9,10,000', status: 'Active', pricingMultiplier: 1.10 },
    { id: '3', name: 'Swadesh - Bengaluru Indiranagar', manager: 'Ananya Hegde', monthlyRevenue: '₹7,80,000', status: 'Active', pricingMultiplier: 1.05 },
  ]);

  const [selectedBranchId, setSelectedBranchId] = React.useState('1');
  const [multiplierInput, setMultiplierInput] = React.useState(1.15);

  const handleUpdatePricingMultiplier = (e: React.FormEvent) => {
    e.preventDefault();
    setBranches(prev =>
      prev.map(b => b.id === selectedBranchId ? { ...b, pricingMultiplier: multiplierInput } : b)
    );
    const branchName = branches.find(b => b.id === selectedBranchId)?.name;
    alert(`Regional pricing multiplier for ${branchName} updated to: ${multiplierInput}x`);
  };

  return (
    <div className="flex-grow flex bg-[#F9F6F0] dark:bg-[#121110] text-foreground min-h-screen font-sans">
      {/* 1. Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-6 hidden md:block shrink-0">
        <div className="mb-8">
          <span className="text-xl font-bold font-display text-primary flex items-center gap-1.5">
            🍕 <span className="text-foreground font-sans">Swadesh SaaS</span>
          </span>
        </div>
        <nav className="flex flex-col gap-2 font-semibold text-sm">
          {(['branches', 'pricing', 'tenant'] as const).map(tab => (
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
              <h1 className="text-3xl font-display font-bold">Multi-Branch Headquarters</h1>
              <p className="text-xs text-foreground/50 mt-1">Review franchise sales performance, set local price modifiers, and manage tenant subscriptions.</p>
            </div>
            <Button onClick={() => alert('Syncing global menu changes to all branches...')} variant="primary" size="sm">
              Sync Menu
            </Button>
          </Flex>

          <Stack gap="lg" className="mb-8">
            <Grid cols={3}>
              <AnalyticsCard title="Active Franchise Sites" value="3 Branches" change={50} timeframe="vs last quarter" />
              <AnalyticsCard title="Combined Revenue" value="₹25,32,000" change={12.4} timeframe="this month" />
              <AnalyticsCard title="Average Performance Score" value="9.4 / 10" change={1.2} timeframe="customer rating average" />
            </Grid>
          </Stack>

          {/* BRANCHES LIST TAB */}
          {activeTab === 'branches' && (
            <Card className="p-6 border border-border bg-card">
              <h3 className="font-heading font-bold text-xl mb-4">Franchise Sites Directory</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border text-foreground/50 font-bold">
                      <th className="pb-3">Site Branch</th>
                      <th className="pb-3">Branch Manager</th>
                      <th className="pb-3">Monthly Sales</th>
                      <th className="pb-3">Price Multiplier</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map(b => (
                      <tr key={b.id} className="border-b border-border/40 hover:bg-foreground/5">
                        <td className="py-4 font-bold">{b.name}</td>
                        <td className="py-4 text-xs text-foreground/60">{b.manager}</td>
                        <td className="py-4 font-mono font-semibold">{b.monthlyRevenue}</td>
                        <td className="py-4 font-mono font-bold text-primary">{b.pricingMultiplier}x</td>
                        <td className="py-4">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-success/10 text-success uppercase">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* REGIONAL PRICING ADJUSTER */}
          {activeTab === 'pricing' && (
            <Card className="p-6 border border-border bg-card max-w-xl">
              <h3 className="font-heading font-bold text-xl mb-4">Adjust Regional Multipliers</h3>
              <form onSubmit={handleUpdatePricingMultiplier} className="flex flex-col gap-5 font-sans text-sm">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pbranch" className="text-sm font-semibold text-foreground/80">Select Branch</label>
                  <select
                    id="pbranch"
                    value={selectedBranchId}
                    onChange={(e) => {
                      setSelectedBranchId(e.target.value);
                      const b = branches.find(item => item.id === e.target.value);
                      if (b) setMultiplierInput(b.pricingMultiplier);
                    }}
                    className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Pricing Surcharge Multiplier"
                  type="number"
                  step="0.01"
                  required
                  value={multiplierInput}
                  onChange={(e) => setMultiplierInput(Number(e.target.value))}
                  placeholder="1.00"
                  id="pmul"
                />
                <Button type="submit" variant="primary" className="py-2.5 mt-2">
                  Apply Multiplier
                </Button>
              </form>
            </Card>
          )}

          {/* SAAS TENANT DETAILS */}
          {activeTab === 'tenant' && (
            <Grid cols={3} className="gap-8 items-start">
              <Card className="p-6 border border-border bg-card col-span-2 flex flex-col gap-4 font-sans text-sm">
                <h3 className="font-heading font-bold text-xl mb-2 font-display">Tenant Subscription Info</h3>
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between border-b border-border/40 pb-2">
                    <span className="text-foreground/60">Subscription Plan:</span>
                    <span className="font-bold text-primary">Enterprise SaaS Tier</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-2">
                    <span className="text-foreground/60">Allowed Branch Sites:</span>
                    <span className="font-mono">10 Sites (3 Active)</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-2">
                    <span className="text-foreground/60">Monthly Subscription Bill:</span>
                    <span className="font-mono font-semibold">₹15,000 / mo</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-foreground/60">Billing Status:</span>
                    <span className="font-bold text-success uppercase">PAID (Next renewal: 15 July 2026)</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border border-[#2D2A26] bg-primary/5 flex flex-col items-center justify-center text-center">
                <span className="text-2xl mb-1">🛡️</span>
                <h4 className="font-heading font-bold text-sm text-foreground mb-2">Tenant Isolation</h4>
                <p className="text-[10px] text-foreground/50 leading-relaxed">
                  Database instances are isolated on separate collection namespaces for maximum enterprise security.
                </p>
              </Card>
            </Grid>
          )}
        </Container>
      </main>
    </div>
  );
}
