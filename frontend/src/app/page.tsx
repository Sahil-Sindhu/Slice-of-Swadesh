import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Slice of Swadesh | Premium Fusion Pizzas & Craft Burgers',
  description: 'Experience India\'s premium modern Indian fast food cafe. Indulge in hand-stretched tandoori naan pizzas, cardamom burgers, and saffron milkshakes.',
  openGraph: {
    title: 'Slice of Swadesh | Premium Fusion Pizzas & Craft Burgers',
    description: 'Experience India\'s premium modern Indian fast food cafe. Indulge in hand-stretched tandoori naan pizzas, cardamom burgers, and saffron milkshakes.',
    url: 'https://swadeshslice.com',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=650',
        width: 800,
        height: 600,
        alt: 'Slice of Swadesh pizza',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slice of Swadesh | Premium Fusion Pizzas & Craft Burgers',
    description: 'Experience India\'s premium modern Indian fast food cafe.',
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    'name': 'Slice of Swadesh',
    'image': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=650',
    'priceRange': '$$',
    'telephone': '+91-80-4910-2000',
    'servesCuisine': 'Indian Fusion, Pizza, Burger, Sandwiches',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '12, Swadeshi Marg, Sector 5, HSR Layout',
      'addressLocality': 'Bengaluru',
      'addressRegion': 'KA',
      'postalCode': '560102',
      'addressCountry': 'IN',
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        'opens': '11:00',
        'closes': '23:30',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
