'use client';

import * as React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Container, Section, Grid, Flex, Stack } from '../../../components/layout/LayoutComponents';
import { AnalyticsCard } from '../../../components/dashboard/AnalyticsCard';
import { useDashboardStats, useRevenueAnalytics, useBestSellers } from '../../../features/admin/dashboard/hooks/useDashboard';
import { BarChart3, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const [timeframe, setTimeframe] = React.useState<'daily' | 'weekly' | 'monthly'>('monthly');

  // Query actual backend statistics
  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: statsRefetch } = useDashboardStats();
  const { data: revenueData = [], isLoading: revLoading, refetch: revRefetch } = useRevenueAnalytics();
  const { data: bestSellers = [], isLoading: sellersLoading, refetch: sellersRefetch } = useBestSellers();

  const handleRefresh = () => {
    statsRefetch();
    revRefetch();
    sellersRefetch();
  };

  if (statsLoading || revLoading || sellersLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#E8441A] border-t-transparent animate-spin" />
          <p className="text-sm text-[#8C6E5A] font-sans">Loading analytics report…</p>
        </div>
      </div>
    );
  }

  if (statsError || !stats) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center p-6">
        <Card className="p-8 border border-border bg-white text-center max-w-md">
          <AlertTriangle className="mx-auto text-[#E8441A] mb-4" size={48} />
          <h2 className="text-xl font-bold font-display text-text mb-2">Failed to Load Analytics</h2>
          <p className="text-sm text-[#8C6E5A] mb-6">Could not calculate statistics from server. Please try again.</p>
          <Button onClick={handleRefresh} variant="primary" className="px-6 py-2">
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  // Calculate AOV (Average Order Value) dynamically
  const todaysRevenue = stats.todaysRevenue?.value || 0;
  const todaysOrders = stats.todaysOrders?.value || 0;
  const averageOrderValue = todaysOrders > 0 ? Math.round(todaysRevenue / todaysOrders) : 0;

  // Calculate total sold count for percentage share calculations
  const totalSoldItems = bestSellers.reduce((sum, item) => sum + item.orders, 0);

  return (
    <div className="flex-grow flex bg-[#F9F6F0] text-foreground min-h-screen font-sans">
      {/* 1. BI Sidebar */}
      <aside className="w-64 border-r border-border bg-surface p-6 hidden md:block shrink-0">
        <div className="mb-8">
          <span className="text-xl font-bold font-display text-primary flex items-center gap-1.5">
            🍕 <span className="text-text font-sans">Swadesh BI</span>
          </span>
        </div>
        <nav className="flex flex-col gap-2 font-semibold text-sm">
          {(['daily', 'weekly', 'monthly'] as const).map(time => (
            <button
              key={time}
              onClick={() => setTimeframe(time)}
              className={`w-full text-left px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
                timeframe === time ? 'bg-primary text-white' : 'hover:bg-text/5 text-text-2'
              }`}
            >
              {time.toUpperCase()} VIEW
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. Main Content */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <Container>
          {/* Header Action Row */}
          <Flex justify="between" className="mb-8 select-none">
            <div>
              <h1 className="text-3xl font-display font-bold text-text">BI Executive Analytics</h1>
              <p className="text-xs text-text-3 mt-1">Review live branch revenues, AOV, best-selling menu items, and EBITDA.</p>
            </div>
            <Flex gap="sm">
              <Button onClick={() => window.print()} variant="outline" size="sm" className="no-print">
                Export report
              </Button>
              <Button onClick={handleRefresh} variant="primary" size="sm" className="no-print">
                Refresh Report
              </Button>
            </Flex>
          </Flex>

          <Stack gap="lg" className="mb-8">
            <Grid cols={4}>
              <AnalyticsCard title="Gross Revenues Today" value={`₹${todaysRevenue.toLocaleString()}`} change={stats.todaysRevenue?.trend || 0} timeframe="vs yesterday" />
              <AnalyticsCard title="Average Order Value" value={`₹${averageOrderValue}`} change={0} timeframe="real-time" />
              <AnalyticsCard title="Orders Count Today" value={`${todaysOrders} Orders`} change={stats.todaysOrders?.trend || 0} timeframe="vs yesterday" />
              <AnalyticsCard title="Active Customers" value={`${stats.activeCustomers?.value || 0}`} change={0} timeframe="registered users" />
            </Grid>
          </Stack>

          <Grid cols={3} className="gap-8 items-start">
            {/* Category Performance Shares */}
            <Card className="col-span-2 p-6 border border-border bg-surface">
              <h3 className="font-heading font-bold text-lg mb-4 text-text flex items-center gap-2">
                <TrendingUp size={18} className="text-[#E8441A]" />
                Revenue Share by Best Sellers
              </h3>
              <Stack gap="md" className="font-sans">
                {bestSellers.map((item, idx) => {
                  const pct = totalSoldItems > 0 ? Math.round((item.orders / totalSoldItems) * 100) : 0;
                  return (
                    <div key={idx} className="flex flex-col gap-1.5 border-b border-border/40 pb-3 last:border-0 last:pb-0">
                      <Flex justify="between" className="text-sm font-semibold text-text">
                        <span>{item.name}</span>
                        <span className="font-mono text-text-2">₹{item.revenue.toLocaleString()} ({pct}%)</span>
                      </Flex>
                      <div className="h-2 w-full bg-text/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {bestSellers.length === 0 && (
                  <p className="text-sm text-text-3 italic text-center py-6">No sales recorded yet.</p>
                )}
              </Stack>
            </Card>

            {/* Financial Performance KPI Summaries */}
            <Card className="p-6 border border-border bg-surface flex flex-col gap-5 font-sans text-sm">
              <h3 className="font-heading font-bold text-lg text-text flex items-center gap-2">
                <DollarSign size={18} className="text-[#E8441A]" />
                Daily Branch Summary
              </h3>
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-text-3">Gross Revenues Today:</span>
                  <span className="font-mono font-bold text-text">₹{todaysRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-text-3">Estimated Gross Margin (70%):</span>
                  <span className="font-mono font-bold text-text">₹{Math.round(todaysRevenue * 0.7).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-text-3">Pending Kitchen Orders:</span>
                  <span className="font-mono font-bold text-text">{stats.pendingOrders?.value || 0}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-text-3">Active Kitchen Status:</span>
                  <span className="font-bold text-[#E8441A]">{stats.kitchenStatus || 'Idle'}</span>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 text-[#C93B15] text-xs leading-relaxed">
                💡 <strong>Historical Trend:</strong>
                <ul className="list-disc ml-4 mt-1 flex flex-col gap-1">
                  {revenueData.slice(-3).map((pt: any) => (
                    <li key={pt.date}>
                      {pt.date}: <strong>₹{pt.revenue.toLocaleString()}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
