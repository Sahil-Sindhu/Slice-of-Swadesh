'use client';

import * as React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Container, Section, Grid, Flex, Stack } from '../../../components/layout/LayoutComponents';
import { Utensils, Clock, AlertTriangle, CheckCircle, Play, Check, RefreshCw } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminOrdersAPI } from '../../../features/admin/orders/api/orders.api';
import { DashboardAPI } from '../../../features/admin/dashboard/api/dashboard.api';

export default function KitchenDashboardPage() {
  // Query to fetch the live kitchen queue
  const { data: orders = [], isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['kitchen', 'queue'],
    queryFn: () => AdminOrdersAPI.getKitchenQueue(),
    refetchInterval: 5000, // Poll every 5s for real-time kitchen view
  });

  // Query to fetch live low stock alerts
  const { data: alerts = [] } = useQuery({
    queryKey: ['kitchen', 'alerts'],
    queryFn: () => DashboardAPI.getLowStockItems(),
    refetchInterval: 30000,
  });

  // Mutation to update order status on the backend
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      AdminOrdersAPI.updateOrderStatus(id, status),
    onSuccess: () => {
      refetch();
    },
    onError: (err: any) => {
      alert(`Failed to update status: ${err.message || 'Server error'}`);
    }
  });

  const handleUpdateStatus = (id: string, nextStatus: 'Preparing' | 'Ready' | 'Completed') => {
    updateStatusMutation.mutate({ id, status: nextStatus });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#E8441A] border-t-transparent animate-spin" />
          <p className="text-sm text-[#8C6E5A] font-sans">Loading kitchen workspace…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center p-6">
        <Card className="p-8 border border-border bg-white text-center max-w-md">
          <AlertTriangle className="mx-auto text-[#E8441A] mb-4" size={48} />
          <h2 className="text-xl font-bold font-display text-text mb-2">Failed to Load Kitchen Queue</h2>
          <p className="text-sm text-[#8C6E5A] mb-6">Could not connect to the restaurant server. Please try again.</p>
          <Button onClick={() => refetch()} variant="primary" className="px-6 py-2">
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  // Filter orders to only display Confirmation, Preparing, or Ready states
  const activeOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled');
  const completedOrders = orders.filter(o => o.status === 'Completed').slice(0, 10);

  return (
    <div className="flex-grow flex bg-[#F9F6F0] text-foreground min-h-screen font-sans">
      {/* Sidebar for Kitchen */}
      <aside className="w-64 border-r border-border bg-surface p-6 hidden md:block shrink-0">
        <div className="mb-8">
          <span className="text-xl font-bold font-display text-primary flex items-center gap-1.5">
            🍕 <span className="text-text font-sans">Swadesh Kitchen</span>
          </span>
        </div>
        
        <div className="flex flex-col gap-6 text-sm select-none">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-text-3 uppercase tracking-widest">Kitchen Section</span>
            <div className="font-bold mt-1 text-text">Main Prep Line #1</div>
            <span className="text-xs text-text-3">Chef de Partie</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-text-3 uppercase tracking-widest">Active Station</span>
            <span className="font-bold mt-1 text-[#E8441A]">Tandoor &amp; Oven</span>
          </div>

          <div className="flex flex-col gap-1.5 border-t border-border/40 pt-4 mt-2">
            <span className="text-[10px] font-bold text-text-3 uppercase tracking-widest">Station Stats</span>
            <div className="flex justify-between mt-1">
              <span className="text-text-3">Placed Queue:</span>
              <span className="font-bold font-mono text-text">{orders.filter(o => o.status === 'Confirmed' || o.status === 'Pending').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-3">Cooking Now:</span>
              <span className="font-bold font-mono text-text">{orders.filter(o => o.status === 'Preparing').length}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Work Area */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <Container>
          <Flex justify="between" className="mb-8 select-none">
            <div>
              <h1 className="text-3xl font-display font-bold text-text">Kitchen Queue</h1>
              <p className="text-xs text-text-3 mt-1">Live order dispatch board for prep stations.</p>
            </div>
            <Flex gap="sm" align="center">
              {isRefetching && <RefreshCw size={14} className="text-text-3 animate-spin" />}
              <Button
                onClick={() => window.print()}
                variant="outline"
                size="sm"
                className="no-print"
              >
                Print Station Slip
              </Button>
            </Flex>
          </Flex>

          <Grid cols={3} className="gap-8 items-start">
            {/* Left/Middle Area: Active cooking cards */}
            <div className="col-span-2 flex flex-col gap-6">
              <h2 className="text-xl font-bold font-display flex items-center gap-2 text-text">
                <Utensils size={20} className="text-[#E8441A]" />
                Live Order Queue ({activeOrders.length})
              </h2>

              <Grid cols={2} className="gap-6">
                {activeOrders.map(ord => {
                  const orderDate = new Date(ord.createdAt);
                  const elapsedMinutes = Math.round((Date.now() - orderDate.getTime()) / (60 * 1000));

                  return (
                    <Card key={ord._id} className="p-5 border border-border bg-surface flex flex-col justify-between min-h-[300px] shadow-sm hover:shadow-md transition-shadow">
                      <div>
                        {/* Card Header */}
                        <Flex justify="between" align="center" className="mb-4 pb-3 border-b border-border/40">
                          <div>
                            <span className="font-mono text-base font-extrabold text-[#1A1208]">{ord.orderNumber}</span>
                            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FFF0EB] text-[#E8441A] uppercase">
                              {ord.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold text-text-3 font-mono">
                            <Clock size={13} />
                            {elapsedMinutes > 0 ? `${elapsedMinutes}m ago` : 'just now'}
                          </div>
                        </Flex>

                        {/* Items List */}
                        <div className="flex flex-col gap-3 mb-6">
                          {ord.items.map((item: any, idx: number) => (
                            <div key={idx} className="text-sm">
                              <div className="flex justify-between font-bold text-[#1A1208]">
                                <span>{item.quantity}x {item.foodName}</span>
                                {item.variantName && <span className="text-xs text-text-3 font-medium">({item.variantName})</span>}
                              </div>
                            </div>
                          ))}
                          {ord.notes && (
                            <p className="text-xs text-[#C93B15] bg-[#FFF0EB] px-2 py-1.5 rounded-md mt-2 border-l-2 border-[#E8441A] font-medium">
                              💡 Instruction: {ord.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons based on current status */}
                      <div className="mt-4 pt-3 border-t border-border/25">
                        {(ord.status === 'Confirmed' || ord.status === 'Pending') && (
                          <Button
                            id={`start-prep-${ord._id}`}
                            onClick={() => handleUpdateStatus(ord._id!, 'Preparing')}
                            variant="primary"
                            disabled={updateStatusMutation.isPending}
                            className="w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl shadow-md cursor-pointer"
                          >
                            <Play size={15} /> Start Preparing
                          </Button>
                        )}
                        {ord.status === 'Preparing' && (
                          <Button
                            id={`mark-ready-${ord._id}`}
                            onClick={() => handleUpdateStatus(ord._id!, 'Ready')}
                            variant="success"
                            disabled={updateStatusMutation.isPending}
                            className="w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl shadow-md cursor-pointer"
                          >
                            <CheckCircle size={15} /> Mark as Ready
                          </Button>
                        )}
                        {ord.status === 'Ready' && (
                          <Button
                            id={`complete-${ord._id}`}
                            onClick={() => handleUpdateStatus(ord._id!, 'Completed')}
                            variant="outline"
                            disabled={updateStatusMutation.isPending}
                            className="w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl border-[#E8441A] text-[#E8441A] hover:bg-[#FFF0EB] cursor-pointer"
                          >
                            <Check size={15} /> Dispatch / Complete
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}

                {activeOrders.length === 0 && (
                  <div className="col-span-2 p-12 text-center border-2 border-dashed border-border rounded-2xl bg-surface">
                    <p className="text-text-3 font-semibold">No active kitchen orders. Everything is served!</p>
                  </div>
                )}
              </Grid>
            </div>

            {/* Right Area: Stock alerts & Activity Log */}
            <div className="flex flex-col gap-8">
              {/* Ingredient Stock Alerts */}
              <Card className="p-6 border border-border bg-surface">
                <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-text">
                  <AlertTriangle size={18} className="text-[#F59E0B]" />
                  Ingredient Alerts
                </h3>
                <div className="flex flex-col gap-3 text-sm">
                  {alerts.map((alert: any) => (
                    <div key={alert.id} className="p-3 rounded-xl border bg-[#FFFBEB] border-[#F59E0B40] text-[#B45309]">
                      <div className="flex justify-between font-bold">
                        <span>{alert.name}</span>
                        <span>{alert.currentStock} {alert.unit}</span>
                      </div>
                      <span className="text-xs opacity-75 mt-0.5 block">Threshold: {alert.minStock} {alert.unit}</span>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <p className="text-xs text-text-3 italic text-center py-2">All ingredients are fully stocked.</p>
                  )}
                </div>
              </Card>

              {/* Completed Orders Feed */}
              <Card className="p-6 border border-border bg-surface">
                <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-text">
                  <CheckCircle size={18} className="text-[#10B981]" />
                  Recent Dispatches
                </h3>
                <div className="flex flex-col gap-3 text-xs text-text-2 font-mono">
                  {completedOrders.map((ord: any) => (
                    <div key={ord._id} className="flex justify-between border-b border-border/40 pb-2">
                      <span>✓ {ord.orderNumber}</span>
                      <span className="text-text-3">Completed</span>
                    </div>
                  ))}
                  {completedOrders.length === 0 && (
                    <span className="text-text-3 italic">No orders completed yet this shift.</span>
                  )}
                </div>
              </Card>
            </div>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
