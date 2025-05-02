// /app/property/[id]/page.tsx

import React from 'react';
import { PropertyPage } from '@/components/PropertyPage';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function PropertyDetailPage({ params }: PageProps) {
  // Await the params object first
  const resolvedParams = await params;
  
  // Ensure params.id exists and is a valid number
  if (!resolvedParams?.id || isNaN(Number(resolvedParams.id))) {
    return notFound();
  }
  
  const propertyId = Number(resolvedParams.id);

  return (
    <div className="min-h-screen bg-[#0A0A23]">
      <PropertyPage propertyId={propertyId} />
    </div>
  );
}
