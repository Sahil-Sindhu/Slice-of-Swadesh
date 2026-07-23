'use client';

import * as React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Container, Section, Grid, Flex, Stack } from '../../../components/layout/LayoutComponents';
import { AnalyticsCard } from '../../../components/dashboard/AnalyticsCard';
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../../../lib/api/client';
import { Package, AlertTriangle, Users, Trash2, Plus, RefreshCw } from 'lucide-react';

export default function InventoryDashboardPage() {
  const [activeSubTab, setActiveSubTab] = React.useState<'stock' | 'suppliers' | 'waste'>('stock');

  // Query to fetch actual database inventory
  const { data: inventoryData, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['admin', 'inventory'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/v1/inventory');
      return data.data;
    }
  });

  const inventories = inventoryData?.inventories || [];

  // Local state for waste inputs
  const [selectedInventoryId, setSelectedInventoryId] = React.useState('');
  const [newWasteQty, setNewWasteQty] = React.useState(0);
  const [newWasteReason, setNewWasteReason] = React.useState('Expired');

  // Mutation to log waste (remove stock) on the backend
  const logWasteMutation = useMutation({
    mutationFn: async (payload: { inventoryId: string; quantity: number; notes: string }) => {
      const { data } = await apiClient.post('/api/v1/inventory/remove-stock', {
        inventory: payload.inventoryId,
        quantity: payload.quantity,
        remarks: payload.notes
      });
      return data.data;
    },
    onSuccess: () => {
      alert('Waste record logged and inventory balance updated.');
      refetch();
      setNewWasteQty(0);
      setSelectedInventoryId('');
    },
    onError: (err: any) => {
      alert(`Wastage logging failed: ${err.message || 'Server error'}`);
    }
  });

  const handleAddWasteLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInventoryId || newWasteQty <= 0) {
      return alert('Please select an ingredient and enter a valid quantity.');
    }
    logWasteMutation.mutate({
      inventoryId: selectedInventoryId,
      quantity: newWasteQty,
      notes: newWasteReason
    });
  };

  // Calculate stats dynamically from actual inventory
  const totalItems = inventories.length;
  const lowStockItems = inventories.filter((item: any) => {
    const minStock = item.ingredient?.minimumStock || 0;
    return item.currentStock <= minStock;
  });
  const lowStockCount = lowStockItems.length;

  // Mock suppliers details
  const suppliers = [
    { id: '1', name: 'Swadesh Dairy Farm Co.', contact: '+91 91111 22222', rating: 4.8, outstandingBalance: 12500 },
    { id: '2', name: 'Bharat Spices Distribution', contact: '+91 93333 44444', rating: 4.6, outstandingBalance: 4200 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#E8441A] border-t-transparent animate-spin" />
          <p className="text-sm text-[#8C6E5A] font-sans">Loading inventory metrics…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center p-6">
        <Card className="p-8 border border-border bg-white text-center max-w-md">
          <AlertTriangle className="mx-auto text-[#E8441A] mb-4" size={48} />
          <h2 className="text-xl font-bold font-display text-text mb-2">Failed to Load Inventory</h2>
          <p className="text-sm text-[#8C6E5A] mb-6">Could not connect to the database. Please try again.</p>
          <Button onClick={() => refetch()} variant="primary" className="px-6 py-2">
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-grow flex bg-[#F9F6F0] text-foreground min-h-screen font-sans">
      {/* 1. ERP Sidebar */}
      <aside className="w-64 border-r border-border bg-surface p-6 hidden md:block shrink-0">
        <div className="mb-8">
          <span className="text-xl font-bold font-display text-primary flex items-center gap-1.5">
            🍕 <span className="text-text font-sans">Swadesh RIMS</span>
          </span>
        </div>
        <nav className="flex flex-col gap-2 font-semibold text-sm">
          {(['stock', 'suppliers', 'waste'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
                activeSubTab === tab ? 'bg-primary text-white' : 'hover:bg-text/5 text-text-2'
              }`}
            >
              {tab.toUpperCase()} VIEW
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. Main Content */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <Container>
          <Flex justify="between" className="mb-8 select-none">
            <div>
              <h1 className="text-3xl font-display font-bold text-text">Inventory Catalog</h1>
              <p className="text-xs text-text-3 mt-1">Review raw ingredients, stock safety limits, and waste log history.</p>
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
              <AnalyticsCard title="Total Stock Lines" value={`${totalItems} Items`} />
              <AnalyticsCard title="Low Stock Warnings" value={`${lowStockCount} Alert(s)`} timeframe="safety warning" />
              <AnalyticsCard title="Active Vendors" value="2 Suppliers" />
            </Grid>
          </Stack>

          {/* Sub-tab view selection */}
          {activeSubTab === 'stock' && (
            <Card className="p-6 border border-border bg-surface">
              <h3 className="font-heading font-bold text-xl mb-4 text-text">Raw Ingredients Stock Safety</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border text-text-3 font-bold">
                      <th className="pb-3">Ingredient Name</th>
                      <th className="pb-3">Current Stock</th>
                      <th className="pb-3">Reserved Stock</th>
                      <th className="pb-3">Safety Limit</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventories.map((item: any) => {
                      const name = item.ingredient?.name || 'Unknown Ingredient';
                      const unit = item.ingredient?.unit || 'units';
                      const minStock = item.ingredient?.minimumStock || 0;
                      const isLow = item.currentStock <= minStock;

                      return (
                        <tr key={item._id} className="border-b border-border/40 hover:bg-text/5">
                          <td className="py-4 font-bold text-text">{name}</td>
                          <td className="py-4 font-mono font-bold">{item.currentStock} {unit}</td>
                          <td className="py-4 font-mono text-text-3">{item.reservedStock || 0} {unit}</td>
                          <td className="py-4 font-mono text-text-3">{minStock} {unit}</td>
                          <td className="py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                              isLow ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
                            }`}>
                              {isLow ? 'Low Stock' : 'Good Stock'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {inventories.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-text-3 italic">
                          No inventory records exist in the database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeSubTab === 'suppliers' && (
            <Card className="p-6 border border-border bg-surface">
              <h3 className="font-heading font-bold text-xl mb-4 text-text">Contracted Vendors</h3>
              <div className="flex flex-col gap-4 font-sans text-sm">
                {suppliers.map(sup => (
                  <div key={sup.id} className="flex justify-between items-center border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-bold text-text">{sup.name}</h4>
                      <span className="text-xs text-text-3">{sup.contact} · {sup.rating} ★ Rating</span>
                    </div>
                    <span className="font-mono text-text font-semibold">Outstanding: ₹{sup.outstandingBalance}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeSubTab === 'waste' && (
            <Grid cols={3} className="gap-8 items-start">
              {/* Log waste form */}
              <Card className="p-6 border border-border bg-surface">
                <h3 className="font-heading font-bold text-lg mb-4 text-text">Log Stock Loss / Waste</h3>
                <form onSubmit={handleAddWasteLog} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="wname" className="text-sm font-semibold text-text-2">Select Ingredient</label>
                    <select
                      id="wname"
                      value={selectedInventoryId}
                      onChange={(e) => setSelectedInventoryId(e.target.value)}
                      className="w-full bg-surface border border-border text-text px-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    >
                      <option value="">-- Choose Ingredient --</option>
                      {inventories.map((item: any) => (
                        <option key={item._id} value={item._id}>
                          {item.ingredient?.name || 'Unknown'} (In Stock: {item.currentStock})
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Loss Quantity"
                    type="number"
                    required
                    value={newWasteQty}
                    onChange={(e) => setNewWasteQty(Number(e.target.value))}
                    placeholder="0.0"
                    id="wqty"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="wreason" className="text-sm font-semibold text-text-2">Reason</label>
                    <select
                      id="wreason"
                      value={newWasteReason}
                      onChange={(e) => setNewWasteReason(e.target.value)}
                      className="w-full bg-surface border border-border text-text px-4 py-3 rounded-xl focus:outline-none"
                    >
                      <option>Expired stock</option>
                      <option>Spillage in kitchen</option>
                      <option>Incorrect order prep</option>
                      <option>Spoiled / Contaminated</option>
                    </select>
                  </div>
                  <Button type="submit" variant="primary" disabled={logWasteMutation.isPending} className="w-full py-2.5 mt-2">
                    {logWasteMutation.isPending ? 'Logging Loss…' : 'Record Loss'}
                  </Button>
                </form>
              </Card>

              {/* Real-time waste explanation info */}
              <Card className="col-span-2 p-6 border border-border bg-surface font-sans">
                <h3 className="font-heading font-bold text-xl mb-4 text-text">Wastage Impact</h3>
                <p className="text-sm text-text-2 mb-4 leading-relaxed">
                  Logging ingredient losses immediately records stock adjustments on the database. 
                  This updates the live kitchen queue and safety alerts, preventing out-of-stock items 
                  and maintaining accurate daily EBITDA summaries.
                </p>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 text-[#C93B15] text-xs leading-relaxed">
                  ⚠️ <strong>Rule Reminder:</strong> Always check recipe margins before disposing of ingredients. 
                  Wastage directly impact branch margins and regional franchise billing.
                </div>
              </Card>
            </Grid>
          )}
        </Container>
      </main>
    </div>
  );
}
