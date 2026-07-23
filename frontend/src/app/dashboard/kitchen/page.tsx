'use client';

import * as React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Container, Section, Grid, Flex, Stack } from '../../../components/layout/LayoutComponents';
import { Utensils, Clock, AlertTriangle, CheckCircle, Play, Check } from 'lucide-react';

interface KitchenItem {
  name: string;
  qty: number;
  note?: string;
}

interface KitchenOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  items: KitchenItem[];
  status: 'placed' | 'preparing' | 'ready' | 'completed';
  orderType: string;
  elapsedMinutes: number;
}

export default function KitchenDashboardPage() {
  const [orders, setOrders] = React.useState<KitchenOrder[]>([
    {
      id: '1',
      orderNumber: 'SOS-9827',
      customerName: 'Amit Sharma',
      items: [
        { name: 'Tandoori Paneer Naan Pizza', qty: 2, note: 'Extra spicy, well done' },
        { name: 'Saffron Milkshake', qty: 1 }
      ],
      status: 'placed',
      orderType: 'Delivery',
      elapsedMinutes: 4
    },
    {
      id: '2',
      orderNumber: 'SOS-1092',
      customerName: 'Priya Patel',
      items: [
        { name: 'Spiced Cardamom Beef Burger', qty: 1, note: 'No onions' },
        { name: 'Makhani Penne Pasta', qty: 1 }
      ],
      status: 'preparing',
      orderType: 'Takeaway',
      elapsedMinutes: 12
    },
    {
      id: '3',
      orderNumber: 'SOS-1104',
      customerName: 'Rohit Verma',
      items: [
        { name: 'Butter Chicken Pizza', qty: 1, note: 'Extra butter sauce' }
      ],
      status: 'ready',
      orderType: 'Dine-in',
      elapsedMinutes: 18
    }
  ]);

  const [alerts] = React.useState([
    { id: '1', ingredient: 'Tandoori Paneer Marinade', qty: '1.2 kg', status: 'critical', message: 'Reorder threshold crossed' },
    { id: '2', ingredient: 'Mozzarella Cheese', qty: '2.5 kg', status: 'warning', message: 'Low stock alert' },
  ]);

  const handleUpdateStatus = (id: string, nextStatus: 'preparing' | 'ready' | 'completed') => {
    setOrders(prev =>
      prev.map(ord => ord.id === id ? { ...ord, status: nextStatus } : ord)
    );
  };

  const activeOrders = orders.filter(o => o.status !== 'completed');
  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <div className="flex-grow flex bg-[#F9F6F0] text-foreground min-h-screen font-sans">
      {/* Sidebar for Kitchen */}
      <aside className="w-64 border-r border-border bg-card p-6 hidden md:block shrink-0">
        <div className="mb-8">
          <span className="text-xl font-bold font-display text-primary flex items-center gap-1.5">
            🍕 <span className="text-foreground font-sans">Swadesh Kitchen</span>
          </span>
        </div>
        
        <div className="flex flex-col gap-6 text-sm select-none">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Kitchen Section</span>
            <div className="font-bold mt-1">Main Prep Line #1</div>
            <span className="text-xs text-foreground/50">Chef de Partie</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Active Station</span>
            <span className="font-bold mt-1 text-[#E8441A]">Tandoor &amp; Oven</span>
          </div>

          <div className="flex flex-col gap-1.5 border-t border-border/40 pt-4 mt-2">
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Station Stats</span>
            <div className="flex justify-between mt-1">
              <span className="text-foreground/60">Placed Queue:</span>
              <span className="font-bold font-mono">{orders.filter(o => o.status === 'placed').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Cooking Now:</span>
              <span className="font-bold font-mono">{orders.filter(o => o.status === 'preparing').length}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Work Area */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <Container>
          <Flex justify="between" className="mb-8 select-none">
            <div>
              <h1 className="text-3xl font-display font-bold">Kitchen Queue</h1>
              <p className="text-xs text-foreground/50 mt-1">Live order dispatch board for prep stations.</p>
            </div>
            <Button
              onClick={() => alert('Kitchen station report summary generated.')}
              variant="outline"
              size="sm"
            >
              Print Station Slip
            </Button>
          </Flex>

          <Grid cols={3} className="gap-8 items-start">
            {/* Left/Middle Area: Active cooking cards */}
            <div className="col-span-2 flex flex-col gap-6">
              <h2 className="text-xl font-bold font-display flex items-center gap-2">
                <Utensils size={20} className="text-[#E8441A]" />
                Live Order Queue ({activeOrders.length})
              </h2>

              <Grid cols={2} className="gap-6">
                {activeOrders.map(ord => (
                  <Card key={ord.id} className="p-5 border border-border bg-card flex flex-col justify-between min-h-[300px] shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      {/* Card Header */}
                      <Flex justify="between" align="center" className="mb-4 pb-3 border-b border-border/40">
                        <div>
                          <span className="font-mono text-base font-extrabold text-[#1A1208]">{ord.orderNumber}</span>
                          <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FFF0EB] text-[#E8441A]">
                            {ord.orderType}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-foreground/55 font-mono">
                          <Clock size={13} />
                          {ord.elapsedMinutes}m ago
                        </div>
                      </Flex>

                      {/* Items List */}
                      <div className="flex flex-col gap-3 mb-6">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="text-sm">
                            <div className="flex justify-between font-bold text-[#1A1208]">
                              <span>{item.qty}x {item.name}</span>
                            </div>
                            {item.note && (
                              <p className="text-xs text-[#C93B15] bg-[#FFF0EB] px-2 py-1 rounded-md mt-1 border-l-2 border-[#E8441A]">
                                💡 Note: {item.note}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons based on current state */}
                    <div className="mt-4 pt-3 border-t border-border/25">
                      {ord.status === 'placed' && (
                        <Button
                          id={`start-prep-${ord.id}`}
                          onClick={() => handleUpdateStatus(ord.id, 'preparing')}
                          variant="primary"
                          className="w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl shadow-md"
                        >
                          <Play size={15} /> Start Preparing
                        </Button>
                      )}
                      {ord.status === 'preparing' && (
                        <Button
                          id={`mark-ready-${ord.id}`}
                          onClick={() => handleUpdateStatus(ord.id, 'ready')}
                          variant="success"
                          className="w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl shadow-md"
                        >
                          <CheckCircle size={15} /> Mark as Ready
                        </Button>
                      )}
                      {ord.status === 'ready' && (
                        <Button
                          id={`complete-${ord.id}`}
                          onClick={() => handleUpdateStatus(ord.id, 'completed')}
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl border-[#E8441A] text-[#E8441A] hover:bg-[#FFF0EB]"
                        >
                          <Check size={15} /> Dispatch / Complete
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}

                {activeOrders.length === 0 && (
                  <div className="col-span-2 p-12 text-center border-2 border-dashed border-border rounded-2xl bg-card">
                    <p className="text-[#8C6E5A] font-semibold">No active kitchen orders. Everything is served!</p>
                  </div>
                )}
              </Grid>
            </div>

            {/* Right Area: Stock alerts & Activity Log */}
            <div className="flex flex-col gap-8">
              {/* Ingredient Stock Alerts */}
              <Card className="p-6 border border-border bg-card">
                <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                  <AlertTriangle size={18} className="text-[#F59E0B]" />
                  Ingredient Alerts
                </h3>
                <div className="flex flex-col gap-3 text-sm">
                  {alerts.map(alert => (
                    <div key={alert.id} className={`p-3 rounded-xl border ${
                      alert.status === 'critical' ? 'bg-[#FFF0EB] border-[#E8441A40] text-[#C93B15]' : 'bg-[#FFFBEB] border-[#F59E0B40] text-[#B45309]'
                    }`}>
                      <div className="flex justify-between font-bold">
                        <span>{alert.ingredient}</span>
                        <span>{alert.qty}</span>
                      </div>
                      <span className="text-xs opacity-75 mt-0.5 block">{alert.message}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Completed Orders Feed */}
              <Card className="p-6 border border-border bg-card">
                <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#10B981]" />
                  Recent Dispatches
                </h3>
                <div className="flex flex-col gap-3 text-xs text-foreground/70 font-mono">
                  {completedOrders.map(ord => (
                    <div key={ord.id} className="flex justify-between border-b border-border/40 pb-2">
                      <span>✓ {ord.orderNumber} ({ord.customerName})</span>
                      <span>Dispatched</span>
                    </div>
                  ))}
                  {completedOrders.length === 0 && (
                    <span className="text-foreground/40 italic">No orders completed yet this shift.</span>
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
