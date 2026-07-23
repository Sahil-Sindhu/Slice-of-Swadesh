'use client';

import * as React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Container, Section, Grid, Flex, Stack } from '../../../components/layout/LayoutComponents';
import { AnalyticsCard } from '../../../components/dashboard/AnalyticsCard';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  rating: number;
  outstandingBalance: number;
}

export default function InventoryDashboardPage() {
  const [activeSubTab, setActiveSubTab] = React.useState<'stock' | 'suppliers' | 'waste'>('stock');
  
  const [inventory, setInventory] = React.useState<InventoryItem[]>([
    { id: '1', name: 'Premium Mozzarella Cheese', category: 'Dairy', currentStock: 12, minStock: 25, maxStock: 100, unit: 'kg', costPerUnit: 420 },
    { id: '2', name: 'Fresh Paneer Cubes', category: 'Dairy', currentStock: 40, minStock: 30, maxStock: 120, unit: 'kg', costPerUnit: 310 },
    { id: '3', name: 'Green Cardamom Pods', category: 'Spices', currentStock: 4, minStock: 5, maxStock: 20, unit: 'kg', costPerUnit: 1800 },
    { id: '4', name: 'Whole Wheat Flour (Atta)', category: 'Grain', currentStock: 150, minStock: 80, maxStock: 500, unit: 'kg', costPerUnit: 45 },
  ]);

  const [suppliers] = React.useState<Supplier[]>([
    { id: '1', name: 'Swadesh Dairy Farm Co.', contact: '+91 91111 22222', rating: 4.8, outstandingBalance: 12500 },
    { id: '2', name: 'Bharat Spices Distribution', contact: '+91 93333 44444', rating: 4.6, outstandingBalance: 4200 },
  ]);

  const [wasteLogs, setWasteLogs] = React.useState([
    { id: '1', name: 'Mozzarella Cheese', qty: 2, unit: 'kg', cost: 840, reason: 'Expired stock' },
    { id: '2', name: 'Paneer Cubes', qty: 1.5, unit: 'kg', cost: 465, reason: 'Spillage in kitchen' },
  ]);

  const [newWasteName, setNewWasteName] = React.useState('');
  const [newWasteQty, setNewWasteQty] = React.useState(0);
  const [newWasteReason, setNewWasteReason] = React.useState('Expired');

  const handleAddWasteLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWasteName || newWasteQty <= 0) return alert('Please enter valid wastage values');
    const matchedItem = inventory.find(i => i.name.toLowerCase().includes(newWasteName.toLowerCase()));
    const cost = matchedItem ? Math.round(newWasteQty * matchedItem.costPerUnit) : Math.round(newWasteQty * 150);

    const log = {
      id: (wasteLogs.length + 1).toString(),
      name: newWasteName,
      qty: newWasteQty,
      unit: matchedItem ? matchedItem.unit : 'kg',
      cost,
      reason: newWasteReason,
    };

    setWasteLogs(prev => [log, ...prev]);
    // Deduct from stock if matched
    if (matchedItem) {
      setInventory(prev =>
        prev.map(i => i.id === matchedItem.id ? { ...i, currentStock: Math.max(0, i.currentStock - newWasteQty) } : i)
      );
    }

    setNewWasteName('');
    setNewWasteQty(0);
    alert('Waste record logged and inventory balances adjusted.');
  };

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);

  return (
    <div className="flex-grow flex bg-[#F9F6F0] text-foreground min-h-screen font-sans">
      {/* 1. ERP Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-6 hidden md:block shrink-0">
        <div className="mb-8">
          <span className="text-xl font-bold font-display text-primary flex items-center gap-1.5">
            🍕 <span className="text-foreground font-sans">Swadesh RIMS</span>
          </span>
        </div>
        <nav className="flex flex-col gap-2 font-semibold text-sm">
          {(['stock', 'suppliers', 'waste'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
                activeSubTab === tab ? 'bg-primary text-white' : 'hover:bg-foreground/5 text-foreground/70'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. Main Dashboard workspace */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <Container>
          {/* Header Action row */}
          <Flex justify="between" className="mb-8 select-none">
            <div>
              <h1 className="text-3xl font-display font-bold">RIMS Workspace</h1>
              <p className="text-xs text-foreground/50 mt-1">Manage ingredient volumes, purchase orders, wastage, and cost impact.</p>
            </div>
            <Button onClick={() => alert('Placing auto reorder purchase requests...')} variant="primary" size="sm">
              Auto Reorder
            </Button>
          </Flex>

          <Stack gap="lg" className="mb-8">
            <Grid cols={3}>
              <AnalyticsCard title="Total Asset Value" value="₹34,800" change={4.2} timeframe="vs last month" />
              <AnalyticsCard title="Low Stock Warnings" value={`${lowStockItems.length} Items`} change={-15} timeframe="vs yesterday" />
              <AnalyticsCard title="Wastage Cost Today" value="₹1,305" change={5.1} timeframe="vs yesterday" />
            </Grid>
          </Stack>

          {/* STOCK CATALOG TAB */}
          {activeSubTab === 'stock' && (
            <Card className="p-6 border border-border bg-card">
              <h3 className="font-heading font-bold text-xl mb-4">Stock Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border text-foreground/50 font-bold">
                      <th className="pb-3">Ingredient</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Current Stock</th>
                      <th className="pb-3">Reorder Alert</th>
                      <th className="pb-3">Avg Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map(item => {
                      const isLow = item.currentStock <= item.minStock;
                      const capPercent = Math.round((item.currentStock / item.maxStock) * 100);

                      return (
                        <tr key={item.id} className="border-b border-border/40 hover:bg-foreground/5">
                          <td className="py-4 font-bold">{item.name}</td>
                          <td className="py-4 text-xs text-foreground/60">{item.category}</td>
                          <td className="py-4">
                            <div className="flex flex-col gap-1.5 max-w-[150px]">
                              <span className="font-mono font-semibold">{item.currentStock} {item.unit}</span>
                              <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${isLow ? 'bg-error' : 'bg-primary'}`}
                                  style={{ width: `${Math.min(100, capPercent)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            {isLow ? (
                              <span className="bg-error/10 text-error font-bold text-xs px-2.5 py-0.5 rounded-full uppercase animate-pulse">
                                Reorder Level
                              </span>
                            ) : (
                              <span className="bg-success/10 text-success font-bold text-xs px-2.5 py-0.5 rounded-full uppercase">
                                Normal
                              </span>
                            )}
                          </td>
                          <td className="py-4 font-mono font-semibold">₹{item.costPerUnit} / {item.unit}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* SUPPLIERS TAB */}
          {activeSubTab === 'suppliers' && (
            <Card className="p-6 border border-border bg-card">
              <h3 className="font-heading font-bold text-xl mb-4">Supplier Directory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suppliers.map(s => (
                  <Card key={s.id} className="p-5 border border-border bg-background flex flex-col gap-3">
                    <Flex justify="between">
                      <h4 className="font-heading font-bold text-base">{s.name}</h4>
                      <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                        ⭐ {s.rating}
                      </span>
                    </Flex>
                    <div className="text-xs flex flex-col gap-1.5 text-foreground/75 font-sans">
                      <div>📞 {s.contact}</div>
                      <div className="flex justify-between border-t border-border/40 pt-2.5 mt-1">
                        <span>Outstanding Balance:</span>
                        <span className="font-mono font-bold text-error">₹{s.outstandingBalance}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}

          {/* WASTE LOGS TAB */}
          {activeSubTab === 'waste' && (
            <Grid cols={3} className="gap-8 items-start">
              {/* Wastage Logs Table */}
              <Card className="col-span-2 p-6 border border-border bg-card">
                <h3 className="font-heading font-bold text-xl mb-4">Wastage Logs</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border text-foreground/50 font-bold">
                        <th className="pb-3">Ingredient</th>
                        <th className="pb-3">Quantity</th>
                        <th className="pb-3">Cost Lost</th>
                        <th className="pb-3">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wasteLogs.map(log => (
                        <tr key={log.id} className="border-b border-border/40">
                          <td className="py-3 font-bold">{log.name}</td>
                          <td className="py-3 font-mono">{log.qty} {log.unit}</td>
                          <td className="py-3 font-mono text-error">₹{log.cost}</td>
                          <td className="py-3 text-xs text-foreground/60">{log.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Add Wastage form */}
              <Card className="p-6 border border-border bg-card">
                <h3 className="font-heading font-bold text-lg mb-4">Log Wastage</h3>
                <form onSubmit={handleAddWasteLog} className="flex flex-col gap-4">
                  <Input
                    label="Ingredient Name"
                    required
                    value={newWasteName}
                    onChange={(e) => setNewWasteName(e.target.value)}
                    placeholder="e.g. Mozzarella Cheese"
                    id="wname"
                  />
                  <Input
                    label="Quantity"
                    type="number"
                    required
                    value={newWasteQty}
                    onChange={(e) => setNewWasteQty(Number(e.target.value))}
                    placeholder="1.5"
                    id="wqty"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="wreason" className="text-sm font-semibold text-foreground/80">Reason</label>
                    <select
                      id="wreason"
                      value={newWasteReason}
                      onChange={(e) => setNewWasteReason(e.target.value)}
                      className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    >
                      <option>Expired</option>
                      <option>Spillage</option>
                      <option>Incorrect cooking</option>
                    </select>
                  </div>
                  <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
                    Record Wastage
                  </Button>
                </form>
              </Card>
            </Grid>
          )}
        </Container>
      </main>
    </div>
  );
}
