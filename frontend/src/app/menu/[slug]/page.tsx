import type { Metadata } from 'next';
import FoodDetailClient from '@/features/food/components/FoodDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const readable = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${readable} — Slice of Swadesh`,
    description: `Order ${readable} online from Slice of Swadesh. Premium Indian fusion fast food delivered fresh to your door.`,
    openGraph: {
      title: `${readable} — Slice of Swadesh`,
      description: `Order ${readable} online. Fast delivery, real Indian flavours.`,
    },
  };
}

export default async function FoodDetailPage({ params }: Props) {
  const { slug } = await params;
  return <FoodDetailClient slug={slug} />;
}
