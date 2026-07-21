'use client';

import * as React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Container, Section, Grid, Flex, Stack } from '../../../components/layout/LayoutComponents';
import { AnalyticsCard } from '../../../components/dashboard/AnalyticsCard';

interface ERPProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface ERPOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  grandTotal: number;
  status: 'placed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  orderType: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'orders' | 'products' | 'customers'>('overview');
  const [products, setProducts] = React.useState<ERPProduct[]>([
    { id: '1', name: 'Tandoori Paneer Naan Pizza', category: 'Pizza', price: 340, stock: 45 },
    { id: '2', name: 'Spiced Cardamom Beef Burger', category: 'Burger', price: 390, stock: 20 },
    { id: '3', name: 'Makhani Penne Pasta', category: 'Pasta', price: 290, stock: 35 },
  ]);
  const [orders, setOrders] = React.useState<ERPOrder[]>([
    { id: '1', orderNumber: 'SOS-9827', customerName: 'Amit Sharma', grandTotal: 520, status: 'placed', orderType: 'Delivery' },
    { id: '2', orderNumber: 'SOS-1092', customerName: 'Priya Patel', grandTotal: 340, status: 'preparing', orderType: 'Takeaway' },
  ]);
  const [newProductName, setNewProductName] = React.useState('');
  const [newProductPrice, setNewProductPrice] = React.useState(0);
  const [newProductCategory, setNewProductCategory] = React.useState('Pizza');

  const handleUpdateOrderStatus = (id: string, nextStatus: 'preparing' | 'ready' | 'completed' | 'cancelled') => {
    setOrders(prev =>
      prev.map(ord => ord.id === id ? { ...ord, status: nextStatus } : ord)
    );
    alert(`Order status updated to: ${nextStatus.toUpperCase()}`);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || newProductPrice <= 0) return alert('Please enter valid product details');
    const newProd: ERPProduct = {
      id: (products.length + 1).toString(),
      name: newProductName,
      price: newProductPrice,
      category: newProductCategory,
      stock: 50,
    };
    setProducts(prev => [...prev, newProd]);
    setNewProductName('');
    setNewProductPrice(0);
    alert('Product added to ERP catalog successfully!');
  };

  return (
    <div className="flex-grow flex bg-[#F9F6F0] dark:bg-[#121110] text-foreground min-h-screen font-sans">
      {/* 1. Admin Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-6 hidden md:block shrink-0">
        <div className="mb-8">
          <span className="text-xl font-bold font-display text-primary flex items-center gap-1.5">
            🍕 <span className="text-foreground font-sans">Swadesh ERP</span>
          </span>
        </div>
        <nav className="flex flex-col gap-2 font-semibold text-sm">
          {(['overview', 'orders', 'products', 'customers'] as const).map(tab => (
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

      {/* 2. Main Content Area */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <Container>
          {/* Header Action row */}
          <Flex justify="between" className="mb-8 select-none">
            <div>
              <h1 className="text-3xl font-display font-bold">ERP Workspace</h1>
              <p className="text-xs text-foreground/50 mt-1">Manage culinary, delivery logistics, and stock.</p>
            </div>
            <Button onClick={() => alert('Exporting Daily Report to PDF...')} variant="outline" size="sm">
              Export report
            </Button>
          </Flex>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <Stack gap="lg">
              <Grid cols={3}>
                <AnalyticsCard title="Today's Revenue" value="₹24,500" change={12.4} timeframe="vs yesterday" />
                <AnalyticsCard title="Today's Orders" value="68 Orders" change={3.1} timeframe="vs yesterday" />
                <AnalyticsCard title="Out of Stock Alerts" value="2 Items" change={-50} timeframe="vs last week" />
              </Grid>

              {/* Best Selling & Activity logs */}
              <Grid cols={2} className="gap-8">
                <Card className="p-6 border border-border bg-card">
                  <h3 className="font-heading font-bold text-lg mb-4">Top Recipes Today</h3>
                  <div className="flex flex-col gap-3 font-sans text-sm">
                    <div className="flex justify-between border-b border-border/40 pb-2">
                      <span className="font-bold">1. Butter Chicken Pizza</span>
                      <span className="text-foreground/50">42 Orders</span>
                    </div>
                    <div className="flex justify-between border-b border-border/40 pb-2">
                      <span className="font-bold">2. Cardamom Beef Burger</span>
                      <span className="text-foreground/50">30 Orders</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">3. Saffron Milkshake</span>
                      <span className="text-foreground/50">25 Orders</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border border-border bg-card">
                  <h3 className="font-heading font-bold text-lg mb-4">Live Activity Audit</h3>
                  <div className="flex flex-col gap-3 font-sans text-xs text-foreground/75">
                    <div>🟢 Chef accepted order **SOS-9827** (1 min ago)</div>
                    <div>🟢 Customer registered: **Priya Patel** (10 mins ago)</div>
                    <div>🟡 Mozzarella Cheese stock fell below reorder level (1 hour ago)</div>
                  </div>
                </Card>
              </Grid>
            </Stack>
          )}

          {/* Live Orders Tab */}
          {activeTab === 'orders' && (
            <Card className="p-6 border border-border bg-card">
              <h3 className="font-heading font-bold text-xl mb-4">Active Kitchen Queue</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border text-foreground/50 font-bold">
                      <th className="pb-3">Order Number</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(ord => (
                      <tr key={ord.id} className="border-b border-border/40 hover:bg-foreground/5">
                        <td className="py-4 font-mono font-bold">{ord.orderNumber}</td>
                        <td className="py-4">{ord.customerName}</td>
                        <td className="py-4 font-mono font-semibold">₹{ord.grandTotal}</td>
                        <td className="py-4">{ord.orderType}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                            ord.status === 'placed' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Flex justify="end" gap="sm">
                            {ord.status === 'placed' && (
                              <Button onClick={() => handleUpdateOrderStatus(ord.id, 'preparing')} variant="primary" size="sm">
                                Start Cooking
                              </Button>
                            )}
                            {ord.status === 'preparing' && (
                              <Button onClick={() => handleUpdateOrderStatus(ord.id, 'ready')} variant="success" size="sm">
                                Mark Ready
                              </Button>
                            )}
                          </Flex>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Product Manager Tab */}
          {activeTab === 'products' && (
            <Grid cols={3} className="gap-8 items-start">
              {/* Product catalog table */}
              <Card className="col-span-2 p-6 border border-border bg-card">
                <h3 className="font-heading font-bold text-xl mb-4">Recipes Catalog</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border text-foreground/50 font-bold">
                        <th className="pb-3">Item Name</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Price</th>
                        <th className="pb-3">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(prod => (
                        <tr key={prod.id} className="border-b border-border/40">
                          <td className="py-3 font-bold">{prod.name}</td>
                          <td className="py-3">{prod.category}</td>
                          <td className="py-3 font-mono">₹{prod.price}</td>
                          <td className="py-3 font-mono">{prod.stock} kg</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Add product form */}
              <Card className="p-6 border border-border bg-card">
                <h3 className="font-heading font-bold text-lg mb-4">Add Menu Item</h3>
                <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                  <Input
                    label="Item Name"
                    required
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="e.g. Garlic Naan"
                    id="pname"
                  />
                  <Input
                    label="Price (₹)"
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    placeholder="99"
                    id="pprice"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pcat" className="text-sm font-semibold text-foreground/80">Category</label>
                    <select
                      id="pcat"
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    >
                      <option>Pizza</option>
                      <option>Burger</option>
                      <option>Pasta</option>
                    </select>
                  </div>
                  <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
                    Create Item
                  </Button>
                </form>
              </Card>
            </Grid>
          )}

          {/* Customer list */}
          {activeTab === 'customers' && (
            <Card className="p-6 border border-border bg-card">
              <h3 className="font-heading font-bold text-xl mb-4">Customer Directory</h3>
              <div className="flex flex-col gap-4 font-sans text-sm">
                <div className="flex justify-between items-center border-b border-border/40 pb-3">
                  <div>
                    <h5 className="font-bold">Amit Sharma</h5>
                    <span className="text-xs text-foreground/50">amit.sharma@gmail.com</span>
                  </div>
                  <span className="text-xs font-bold text-primary">VIP Customer</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-bold">Priya Patel</h5>
                    <span className="text-xs text-foreground/50">priya.patel@gmail.com</span>
                  </div>
                  <span className="text-xs font-bold text-foreground/50">Regular Customer</span>
                </div>
              </div>
            </Card>
          )}
        </Container>
      </main>
    </div>
  );
}
