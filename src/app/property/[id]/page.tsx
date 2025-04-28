// /app/property/[id]/page.tsx

import React from 'react';
import { properties } from '@/data/properties';
import PropertyCardRent from '@/components/PropertyCardRent';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const propertyId = parseInt(resolvedParams.id, 10);
  const property = properties.find((p) => p.id === propertyId);

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A23] p-4">
      <PropertyCardRent property={property} />
    </div>
  );
}
