import type { Metadata } from 'next';
import { Container, Section, Stack } from '../../components/layout/LayoutComponents';
import { Card } from '../../components/ui/Card';

export const metadata: Metadata = {
  title: 'Privacy Policy | Slice of Swadesh',
  description: 'GDPR ready privacy policy outlining your data rights, cookie consent details, and security parameters.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <Section py="md" className="border-b border-border text-center">
        <Container>
          <span className="text-primary font-bold text-xs uppercase tracking-widest">Legal Portal</span>
          <h1 className="text-4xl font-display font-bold mt-2">Privacy Policy</h1>
          <p className="text-xs text-foreground/50 mt-1">GDPR & CCPA Compliant Data Processing</p>
        </Container>
      </Section>

      <Section py="md">
        <Container className="max-w-3xl">
          <Card className="p-8 border border-border bg-card">
            <Stack gap="lg" className="text-xs leading-relaxed text-foreground/75 font-sans">
              <div>
                <h3 className="text-base font-heading font-bold text-foreground mb-2">1. Information We Collect</h3>
                <p>
                  We collect names, emails, billing addresses, phone numbers, and location details necessary to process food orders, book tables, and manage loyalty reward program operations.
                </p>
              </div>

              <div>
                <h3 className="text-base font-heading font-bold text-foreground mb-2">2. GDPR Data Rights</h3>
                <p>
                  Under General Data Protection Regulation (GDPR) guidelines, you have the right to request access to your profile data, request corrections, request data portability exports, or invoke the "Right to be Forgotten" (Account Deletion).
                </p>
              </div>

              <div>
                <h3 className="text-base font-heading font-bold text-foreground mb-2">3. Cookies & Consent</h3>
                <p>
                  We use cookies to maintain your shopping cart states and session authentication tokens. Consent preferences can be modified at any time using our cookie settings banner.
                </p>
              </div>
            </Stack>
          </Card>
        </Container>
      </Section>
    </div>
  );
}
