// /app/property/[id]/page.tsx

import { notFound } from 'next/navigation';
import PropertyDetailsPage from '@/components/PropertyDetailsPage'; // Your client component
import { properties } from '@/data/properties'; // Import properties array
import { recommendations } from '@/data/recommendations'; // Import recommendations array

interface PageProps {
  params: { id: string };
}

// 🚀 MAKE THIS FUNCTION `async`
export default async function PropertyDetailPage({ params }: PageProps) {
  const propertyId = parseInt(params.id, 10);
  const property = properties.find((p) => p.id === propertyId);

  if (!property) {
    notFound(); // Show 404 page if property not found
  }

  return (
    <PropertyDetailsPage 
      property={property}
      recommendations={recommendations}
    />
  );
}
