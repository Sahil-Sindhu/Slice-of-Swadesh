'use client';

import * as React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Container, Section, Stack, Flex } from '../../../components/layout/LayoutComponents';

export default function GDPRPage() {
  const [isExporting, setIsExporting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Simulate CSV file download
      const csvContent = "data:text/csv;charset=utf-8,Field,Value\nEmail,user@gmail.com\nName,John Doe\nLoyalty Points,340 Coins";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "swadesh_gdpr_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('GDPR raw data compiled! Download of swadesh_gdpr_export.csv initiated.');
    }, 1500);
  };

  const handleDeleteAccount = () => {
    const confirmation = window.confirm("Are you absolutely sure you want to delete your Swadesh account? This action is irreversible and clears all loyalty coins.");
    if (!confirmation) return;

    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      alert('Account deletion request queued. Your personal record will be permanently purged in 30 days under GDPR regulations.');
    }, 1500);
  };

  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <Section py="md" className="border-b border-border text-center">
        <Container>
          <span className="text-primary font-bold text-xs uppercase tracking-widest">Privacy Hub</span>
          <h1 className="text-4xl font-display font-bold mt-2">Data Privacy & Controls</h1>
          <p className="text-xs text-foreground/50 mt-1">Manage your personal GDPR credentials data rights</p>
        </Container>
      </Section>

      <Section py="md">
        <Container className="max-w-2xl">
          <Stack gap="lg">
            {/* Export data */}
            <Card className="p-6 border border-border bg-card flex flex-col gap-3">
              <h3 className="font-heading font-bold text-base">Export Profile Archive</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Download a machine-readable CSV archive containing all personal account records (name, emails, phone registers, and reward coins logs).
              </p>
              <Flex>
                <Button onClick={handleExportData} isLoading={isExporting} variant="outline" className="text-xs py-2 px-6 mt-1 font-bold">
                  Request Data Archive
                </Button>
              </Flex>
            </Card>

            {/* Delete Account */}
            <Card className="p-6 border border-error/20 bg-error/5 flex flex-col gap-3">
              <h3 className="font-heading font-bold text-base text-error">Purge Account Profile</h3>
              <p className="text-xs text-error/70 leading-relaxed">
                Permanently purge your email, credentials database schemas, address settings, and invalidate all loyalty coins balances. This action is irreversible.
              </p>
              <Flex>
                <Button onClick={handleDeleteAccount} isLoading={isDeleting} variant="primary" className="bg-error hover:bg-error/90 text-white text-xs py-2 px-6 mt-1 font-bold border-error">
                  Delete My Account
                </Button>
              </Flex>
            </Card>
          </Stack>
        </Container>
      </Section>
    </div>
  );
}
