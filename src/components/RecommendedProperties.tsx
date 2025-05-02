"use client";

import { useState, useEffect } from 'react';
import { PropertyCard } from "./PropertyCard";
import { useAvailableProperties } from '@/hooks/useAvailableProperties';
import { PropertyData } from '@/hooks/usePropertyDetails';
import { Skeleton } from '@/components/ui/skeleton';

const RecommendedProperties = () => {
  const { properties, isLoading, isError } = useAvailableProperties();
  const [recommendedProperties, setRecommendedProperties] = useState<PropertyData[]>([]);

  useEffect(() => {
    if (properties.length > 0) {
      // We can implement more advanced recommendation logic here in the future
      // For now, just pick the latest properties
      const filteredProperties = properties.slice(0, 3); // Get first 3 properties
      setRecommendedProperties(filteredProperties);
    }
  }, [properties]);

  return (
    <section className="bg-black py-10 px-4 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-bold mb-2">Recommended Properties</h2>
        <p className="text-sm text-gray-400 mb-6">Curated especially for you</p>
        
        {isError && (
          <div className="text-red-500 mb-4">
            Failed to load recommended properties. Please try again later.
          </div>
        )}
        
        {/* Horizontal Scroll */}
        <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, i) => (
              <div className="min-w-[300px] h-[400px] flex-shrink-0" key={i}>
                <div className="h-full rounded-md bg-slate-800/50 animate-pulse"></div>
              </div>
            ))
          ) : recommendedProperties.length > 0 ? (
            recommendedProperties.map((property) => (
              <div className="min-w-[300px] flex-shrink-0" key={property.id}>
                <PropertyCard property={property} />
              </div>
            ))
          ) : (
            <div className="min-w-full py-10 text-center text-gray-400">
              No properties available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecommendedProperties;
