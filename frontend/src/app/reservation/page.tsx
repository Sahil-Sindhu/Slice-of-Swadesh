'use client';

import * as React from 'react';
import { Container, Section, Grid } from '../../components/layout/LayoutComponents';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function ReservationPage() {
  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <Section py="md" className="border-b border-border text-center">
        <Container>
          <span className="text-primary font-bold text-xs uppercase tracking-widest">Fine Dine Setup</span>
          <h1 className="text-4xl font-display font-bold mt-2">Table Booking & Catering</h1>
          <p className="text-sm text-foreground/50 max-w-sm mx-auto mt-2">
            Schedule slots for romantic dinners, birthday parties, or corporate orders.
          </p>
        </Container>
      </Section>

      <Section py="md">
        <Container className="max-w-xl">
          <Card className="p-8 border border-border bg-card">
            <form onSubmit={(e) => { e.preventDefault(); alert('Table reservation request submitted!'); }} className="flex flex-col gap-6">
              <Input
                label="Full Name"
                required
                placeholder="Enter your name"
                id="name"
              />
              <Grid cols={2}>
                <Input
                  label="Email"
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  id="email"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  required
                  placeholder="+91 99999 99999"
                  id="phone"
                />
              </Grid>
              <Grid cols={3}>
                <Input
                  label="Date"
                  type="date"
                  required
                  id="date"
                />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="time" className="text-sm font-semibold text-foreground/80">Time Slot</label>
                  <select id="time" className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10">
                    <option>12:00 PM</option>
                    <option>2:00 PM</option>
                    <option>6:00 PM</option>
                    <option>8:00 PM</option>
                    <option>10:00 PM</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="guests" className="text-sm font-semibold text-foreground/80">Guests</label>
                  <select id="guests" className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                    <option>5+ Guests</option>
                  </select>
                </div>
              </Grid>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="requests" className="text-sm font-semibold text-foreground/80">Special Requests</label>
                <textarea id="requests" placeholder="e.g. Birthday decoration, allergy considerations..." className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[80px]" />
              </div>
              <Button type="submit" variant="primary" className="py-3 mt-2">
                Confirm Booking
              </Button>
            </form>
          </Card>
        </Container>
      </Section>
    </div>
  );
}
