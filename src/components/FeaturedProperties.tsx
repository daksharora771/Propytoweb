'use client';

import React, { useEffect, useState } from 'react';
import { useAvailableProperties } from '@/hooks/useAvailableProperties';
import { PropertyCard } from '@/components/PropertyCard';
import { ArrowLeftIcon, ArrowRightIcon, HomeIcon, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export function FeaturedProperties() {
  const { properties, isLoading, isError } = useAvailableProperties();
  const [visibleCount, setVisibleCount] = useState(6);
  
  // Handle responsive display
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1280) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Sort properties by newest first (descending order by ID)
  const sortedProperties = [...properties].sort((a, b) => Number(b.id) - Number(a.id));
  
  // Select featured properties - most recent ones
  const featuredProperties = sortedProperties.slice(0, visibleCount);
  
  // Show skeleton while loading
  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-[#0A0A23] to-[#080825]">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              <span className="text-blue-400">Featured</span> Properties
            </h2>
            <div className="flex gap-4">
              <div className="w-24 h-10 bg-gray-800 rounded-md animate-pulse"></div>
              <div className="w-24 h-10 bg-gray-800 rounded-md animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: visibleCount }).map((_, index) => (
              <div 
                key={index} 
                className="rounded-xl bg-gray-800 animate-pulse h-[400px]"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  // Show error state
  if (isError) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-[#0A0A23] to-[#080825]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center p-10 bg-red-900/20 border border-red-500 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-2">Error Loading Properties</h3>
            <p className="text-red-300">Failed to load property listings from the blockchain</p>
            <p className="mt-4 text-gray-400">Please try again later or check your network connection</p>
          </div>
        </div>
      </section>
    );
  }
  
  // No properties available
  if (properties.length === 0) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-[#0A0A23] to-[#080825]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center p-10 bg-blue-900/20 border border-blue-500 rounded-xl">
            <HomeIcon className="mx-auto h-16 w-16 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Properties Available</h3>
            <p className="text-gray-400">There are currently no properties listed on the platform</p>
            <Link 
              href="/list-property" 
              className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#0A0A23] to-[#080825]">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            <span className="text-blue-400">Featured</span> Properties
          </h2>
          <div className="flex gap-4">
            <Link
              href="/properties"
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors text-sm md:text-base"
            >
              <span>View All Properties</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        
        {/* View More Button */}
        <div className="mt-10 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <span>Browse All Properties</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          
          <Link
            href="/list-property"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>List Your Property</span>
          </Link>
        </div>
      </div>
    </section>
  );
} 