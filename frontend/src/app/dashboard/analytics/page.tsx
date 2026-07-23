'use client';

import * as React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Container, Section, Grid, Flex, Stack } from '../../../components/layout/LayoutComponents';
import { AnalyticsCard } from '../../../components/dashboard/AnalyticsCard';

export default function AnalyticsDashboardPage() {
  const [timeframe, setTimeframe] = React.useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const categoryShare = [
    { category: 'Naan Pizzas', sales: '₹1,24,000', percentage: 48 },
    { category: 'Fusion Burgers', sales: '₹82,500', percentage: 32 },
    { category: 'Makhani Pastas', sales: '₹31,000', percentage: 12 },
    { category: 'Saffron Beverages', sales: '₹20,500', percentage: 8 },
  ];

  return (
    <div className="flex-grow flex bg-[#F9F6F0] text-foreground min-h-screen font-sans">
      {/* 1. BI Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-6 hidden md:block shrink-0">
        <div className="mb-8">
          <span className="text-xl font-bold font-display text-primary flex items-center gap-1.5">
            🍕 <span className="text-foreground font-sans">Swadesh BI</span>
          </span>
        </div>
        <nav className="flex flex-col gap-2 font-semibold text-sm">
          {(['daily', 'weekly', 'monthly'] as const).map(time => (
            <button
              key={time}
              onClick={() => setTimeframe(time)}
              className={`w-full text-left px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
                timeframe === time ? 'bg-primary text-white' : 'hover:bg-foreground/5 text-foreground/70'
              }`}
            >
              {time.toUpperCase()} VIEW
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
              <h1 className="text-3xl font-display font-bold">BI Executive Analytics</h1>
              <p className="text-xs text-foreground/50 mt-1">Review EBITDA margins, sales breakdowns, AOV, and customer segment growth.</p>
            </div>
            <Flex gap="sm">
              <Button onClick={() => alert('Exporting BI Report to Excel CSV...')} variant="outline" size="sm">
                Export CSV
              </Button>
              <Button onClick={() => alert('Sending scheduled PDF report to executive board...')} variant="primary" size="sm">
                Share Report
              </Button>
            </Flex>
          </Flex>

          <Stack gap="lg" className="mb-8">
            <Grid cols={4}>
              <AnalyticsCard title="Gross Margin %" value="68.2%" change={2.1} timeframe="vs last month" />
              <AnalyticsCard title="Average Order Value" value="₹420" change={5.4} timeframe="vs last month" />
              <AnalyticsCard title="CAC Index" value="₹85" change={-12} timeframe="vs last quarter" />
              <AnalyticsCard title="EBITDA Profit" value="₹1,84,500" change={10.8} timeframe="vs last month" />
            </Grid>
          </Stack>

          <Grid cols={3} className="gap-8 items-start">
            {/* Category Performance shares */}
            <Card className="col-span-2 p-6 border border-border bg-card">
              <h3 className="font-heading font-bold text-lg mb-4">Revenue share by Category</h3>
              <Stack gap="md" className="font-sans">
                {categoryShare.map((cat, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5 border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <Flex justify="between" className="text-sm font-semibold">
                      <span>{cat.category}</span>
                      <span className="font-mono">{cat.sales} ({cat.percentage}%)</span>
                    </Flex>
                    <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </Stack>
            </Card>

            {/* Financial Performance KPI summaries */}
            <Card className="p-6 border border-border bg-card flex flex-col gap-5 font-sans text-sm">
              <h3 className="font-heading font-bold text-lg">Financial Summary</h3>
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-foreground/60">Gross Revenues:</span>
                  <span className="font-mono font-bold">₹2,58,000</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-foreground/60">Kitchen COGS (Food Cost):</span>
                  <span className="font-mono font-bold text-error">₹82,560</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-foreground/60">Staff Payroll Cost:</span>
                  <span className="font-mono font-bold text-error">₹45,000</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-foreground/60">Delivery Logistics:</span>
                  <span className="font-mono font-bold text-error">₹18,200</span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-base">
                  <span>Net EBITDA Profit:</span>
                  <span className="font-mono text-success">₹1,12,240</span>
                </div>
              </div>
            </Card>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
