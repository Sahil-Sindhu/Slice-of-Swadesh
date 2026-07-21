import type { Metadata } from 'next';
import { Container, Section, Stack } from '../../components/layout/LayoutComponents';
import { Card } from '../../components/ui/Card';

export const metadata: Metadata = {
  title: 'Terms of Service | Slice of Swadesh',
  description: 'Terms and conditions governing restaurant operations, reservations, and payment settlements.',
};

export default function TermsPage() {
  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <Section py="md" className="border-b border-border text-center">
        <Container>
          <span className="text-primary font-bold text-xs uppercase tracking-widest">Legal Portal</span>
          <h1 className="text-4xl font-display font-bold mt-2">Terms of Service</h1>
          <p className="text-xs text-foreground/50 mt-1">Agreement of Operations & Online Bookings</p>
        </Container>
      </Section>

      <Section py="md">
        <Container className="max-w-3xl">
          <Card className="p-8 border border-border bg-card">
            <Stack gap="lg" className="text-xs leading-relaxed text-foreground/75 font-sans">
              <div>
                <h3 className="text-base font-heading font-bold text-foreground mb-2">1. Culinary Orders & Checkout</h3>
                <p>
                  By placing an order on Slice of Swadesh, you agree to settle total billing amounts (including GST and delivery surcharges). Refund requests can only be initiated before cooking prep begins in the kitchen.
                </p>
              </div>

              <div>
                <h3 className="text-base font-heading font-bold text-foreground mb-2">2. Booking Cancellations</h3>
                <p>
                  Reserved dine-in tables are held for a maximum buffer time of 15 minutes past target timeslots before automated cancellation triggers release seats back to open pools.
                </p>
              </div>
            </Stack>
          </Card>
        </Container>
      </Section>
    </div>
  );
}
