import type { Metadata } from 'next';
import { Container, Section, Grid } from '../../components/layout/LayoutComponents';
import { Card } from '../../components/ui/Card';

export const metadata: Metadata = {
  title: 'About Us | Slice of Swadesh',
  description: 'Our journey of redefining Indian fast food through tandoori pizzas and craft cardamom burgers.',
};

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <Section py="md" className="border-b border-border bg-gradient-to-b from-[#F9F6F0]/50 to-white dark:from-[#121110]/50 dark:to-transparent">
        <Container>
          <div className="max-w-3xl mx-auto text-center flex flex-col gap-4">
            <span className="text-primary font-bold text-xs uppercase tracking-widest">Our Heritage</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold">The Story of Swadesh</h1>
            <p className="text-lg text-foreground/75 leading-relaxed">
              Founded in 2024, Slice of Swadesh set out to blend traditional clay-oven cooking with contemporary fast-casual formats.
            </p>
          </div>
        </Container>
      </Section>

      <Section py="md">
        <Container>
          <Grid cols={2} className="items-center gap-12">
            <div>
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=650"
                alt="Our Kitchen Ovens"
                className="w-full h-80 object-cover rounded-2xl border border-border shadow-md"
              />
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-heading font-bold">Our Kitchen Vision</h2>
              <p className="text-foreground/70 leading-relaxed text-sm">
                We believe fast food doesn't have to be processed or artificial. We source organic wheat from Madhya Pradesh fields, hand-stretch every naan crust, and select fresh farm cardamoms.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <Card className="p-4 border border-border bg-[#F9F6F0]/25 dark:bg-[#121110]/25">
                  <h4 className="font-bold text-primary">100% Organic</h4>
                  <p className="text-xs text-foreground/50 mt-1">Directly sourced grains</p>
                </Card>
                <Card className="p-4 border border-border bg-[#F9F6F0]/25 dark:bg-[#121110]/25">
                  <h4 className="font-bold text-primary">No Additives</h4>
                  <p className="text-xs text-foreground/50 mt-1">Real spices, zero chemicals</p>
                </Card>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>
    </div>
  );
}
