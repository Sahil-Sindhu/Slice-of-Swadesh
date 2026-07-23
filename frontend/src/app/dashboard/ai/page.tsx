'use client';

import * as React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Container, Section, Grid, Flex, Stack } from '../../../components/layout/LayoutComponents';
import { AnalyticsCard } from '../../../components/dashboard/AnalyticsCard';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export default function AIDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<'assistant' | 'forecast' | 'recommend'>('assistant');
  const [messages, setMessages] = React.useState<Message[]>([
    { sender: 'ai', text: 'Namaste! I am Swadesh AI, your smart culinary assistant. Ask me about menu details, ingredient mappings, or sales trends.' },
  ]);
  const [inputValue, setInputValue] = React.useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate AI response based on query keywords
    setTimeout(() => {
      let aiText = "I'm processing your inquiry based on our current menu embeddings. For live queries, configure your Gemini API Key in RAG settings.";
      const query = inputValue.toLowerCase();

      if (query.includes('veg') || query.includes('vegetarian')) {
        aiText = 'Swadesh Veg Recommendation: Tandoori Paneer Naan Pizza is currently trending with a 94% customer review rating.';
      } else if (query.includes('forecast') || query.includes('sales')) {
        aiText = 'Swadesh AI Prediction: Weekend sales (Fri-Sun) are forecasted to increase by 18.5% due to upcoming holiday festivals.';
      } else if (query.includes('ingredient') || query.includes('stock')) {
        aiText = 'Swadesh AI Stock Alert: Premium Mozzarella Cheese will dip below critical reorder limits in 48 hours. Suggest auto purchase order.';
      } else if (query.includes('combo') || query.includes('discount')) {
        aiText = 'Swadesh Smart Combo Recommendation: Combine Spiced Cardamom Burger with Masala Fries and Saffron Milkshake for a flat 15% discount (use code: COMBO15).';
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
    }, 1000);
  };

  return (
    <div className="flex-grow flex bg-[#F9F6F0] text-foreground min-h-screen font-sans">
      {/* 1. Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-6 hidden md:block shrink-0">
        <div className="mb-8">
          <span className="text-xl font-bold font-display text-primary flex items-center gap-1.5 animate-pulse">
            ✨ <span className="text-foreground font-sans">Swadesh AI</span>
          </span>
        </div>
        <nav className="flex flex-col gap-2 font-semibold text-sm">
          {(['assistant', 'forecast', 'recommend'] as const).map(tab => (
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
              <h1 className="text-3xl font-display font-bold">AI Smart Hub</h1>
              <p className="text-xs text-foreground/50 mt-1">Configure vector stores, run sales forecasting models, and talk to your virtual assistant.</p>
            </div>
            <Button onClick={() => alert('Syncing Vector database embeddings...')} variant="outline" size="sm">
              Vector Sync
            </Button>
          </Flex>

          <Stack gap="lg" className="mb-8">
            <Grid cols={3}>
              <AnalyticsCard title="Model Training Status" value="Optimized" change={100} timeframe="via Fine-tuning" />
              <AnalyticsCard title="Predicted Peak Hour" value="8:00 PM" change={2.4} timeframe="Demand Spike Index" />
              <AnalyticsCard title="Active Recommendations" value="84% CTR" change={5.8} timeframe="Customer Conversions" />
            </Grid>
          </Stack>

          {/* TAB 1: AI ASSISTANT */}
          {activeTab === 'assistant' && (
            <Grid cols={3} className="gap-8 items-stretch">
              {/* Chat Card */}
              <Card className="col-span-2 p-6 border border-border bg-card flex flex-col h-[55vh] justify-between">
                <div className="flex-grow overflow-y-auto flex flex-col gap-3 pr-2 scrollbar-none">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed font-sans ${
                        msg.sender === 'ai'
                          ? 'bg-primary/5 text-foreground border border-primary/10 self-start'
                          : 'bg-primary text-white self-end'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-border/60 pt-4 mt-4">
                  <Input
                    placeholder="Ask Swadesh AI..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    id="aimsg"
                    containerClassName="flex-grow"
                  />
                  <Button type="submit" variant="primary" size="md">
                    Send
                  </Button>
                </form>
              </Card>

              {/* API and RAG Configurations */}
              <Card className="p-6 border border-border bg-card flex flex-col gap-4">
                <h3 className="font-heading font-bold text-lg">LLM Integration</h3>
                <div className="flex flex-col gap-3 text-xs font-sans text-foreground/75">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Target Model:</span>
                    <span className="font-mono text-primary">gemini-2.5-flash</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Vector Index:</span>
                    <span className="font-mono">pinecone-index-swadesh</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="font-semibold text-foreground/60">API Key status:</span>
                    <span className="font-mono bg-foreground/5 p-2 rounded border border-border/80">
                      ••••••••••••••••
                    </span>
                  </div>
                </div>
                <Button onClick={() => alert('Gemini parameters saved!')} variant="secondary" className="w-full py-2.5 mt-2">
                  Update Keys
                </Button>
              </Card>
            </Grid>
          )}

          {/* TAB 2: DEMAND FORECASTING */}
          {activeTab === 'forecast' && (
            <Card className="p-6 border border-border bg-card">
              <h3 className="font-heading font-bold text-xl mb-4">Sales & Demand Predictions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border text-foreground/50 font-bold">
                      <th className="pb-3">Time Period</th>
                      <th className="pb-3">Projected Demand</th>
                      <th className="pb-3">Forecasted Sales</th>
                      <th className="pb-3">Confidence Index</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/40">
                      <td className="py-4 font-bold">Tomorrow (Wednesday)</td>
                      <td className="py-4">Medium (Regular)</td>
                      <td className="py-4 font-mono font-semibold">₹18,500</td>
                      <td className="py-4 text-success font-bold">92% High</td>
                    </tr>
                    <tr className="border-b border-border/40">
                      <td className="py-4 font-bold">Friday (Weekend Start)</td>
                      <td className="py-4">High (Spike Expected)</td>
                      <td className="py-4 font-mono font-semibold">₹34,000</td>
                      <td className="py-4 text-success font-bold">88% High</td>
                    </tr>
                    <tr className="border-b border-border/40">
                      <td className="py-4 font-bold">Saturday Night Rush</td>
                      <td className="py-4">Critical (Full Capacity)</td>
                      <td className="py-4 font-mono font-semibold">₹48,200</td>
                      <td className="py-4 text-warning font-bold">84% Moderate</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* TAB 3: SMART COMBOS */}
          {activeTab === 'recommend' && (
            <Card className="p-6 border border-border bg-card">
              <h3 className="font-heading font-bold text-xl mb-4">Dynamic Combos & Discounts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                <Card className="p-5 border border-border bg-background flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold bg-[#E05A47]/10 text-primary px-3 py-1 rounded-full">Naan Combo Offer</span>
                    <span className="text-xs font-mono font-bold text-[#EAB308]">15% Discount</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-foreground mt-1">Butter Paneer Naan Pizza + Milkshake</h4>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    Combines top-trending veg pizza with cardamom milkshake. Increases average order value (AOV) by ₹120.
                  </p>
                </Card>
                <Card className="p-5 border border-border bg-background flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold bg-[#E05A47]/10 text-primary px-3 py-1 rounded-full">Late Night Burger Special</span>
                    <span className="text-xs font-mono font-bold text-[#EAB308]">20% Discount</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-foreground mt-1">Saffron Beef Burger + Masala Fries</h4>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    Automatically applies on weekend deliveries after 10:00 PM to clear patty inventories.
                  </p>
                </Card>
              </div>
            </Card>
          )}
        </Container>
      </main>
    </div>
  );
}
