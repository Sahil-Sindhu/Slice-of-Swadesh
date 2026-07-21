import type { Metadata } from 'next';
import { Container, Section, Stack } from '../../components/layout/LayoutComponents';
import { Card } from '../../components/ui/Card';

export const metadata: Metadata = {
  title: 'FAQ & Policies | Slice of Swadesh',
  description: 'Frequently asked questions about refunds, reservations, payments, and delivery details.',
};

export default function FAQPage() {
  const faqs = [
    { q: 'Is there a minimum order limit for free delivery?', a: 'Yes, we provide free express delivery on all orders above ₹499. For orders below this amount, a flat delivery fee of ₹40 is applied.' },
    { q: 'What is the refund policy for cancelled orders?', a: 'If you cancel an order before it transitions to "Preparing" status, a full refund is processed instantly to your payment source. No refunds are allowed once preparation starts.' },
    { q: 'How does table reservation work?', a: 'You can reserve a table up to 7 days in advance. Table reservations are held for 15 minutes past the scheduled booking time before cancellation.' },
    { q: 'Are there gluten-free and vegan options?', a: 'Yes, we offer gluten-free base modifications for all our Naan pizzas (+₹40) and clearly badge our pure veg items with green tags.' },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <Section py="md" className="border-b border-border text-center">
        <Container>
          <span className="text-primary font-bold text-xs uppercase tracking-widest">Help Center</span>
          <h1 className="text-4xl font-display font-bold mt-2">Frequently Asked Questions</h1>
        </Container>
      </Section>

      <Section py="md">
        <Container className="max-w-2xl">
          <Stack gap="md">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="p-6 border border-border bg-card">
                <h4 className="font-heading font-bold text-base text-foreground mb-2">❓ {faq.q}</h4>
                <p className="text-xs text-foreground/75 leading-relaxed font-sans">{faq.a}</p>
              </Card>
            ))}
          </Stack>
        </Container>
      </Section>
    </div>
  );
}
