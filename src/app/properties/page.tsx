'use client';

import React, { useState, useEffect } from 'react';
import { useAvailableProperties } from '@/hooks/useAvailableProperties';
import { PropertyCard } from '@/components/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { HomeIcon, ArrowUpDownIcon, AlignJustifyIcon, Grid2X2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PropertiesPage() {
  const { properties, isLoading, isError } = useAvailableProperties();
  const [sortOption, setSortOption] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  
  // Sort the properties based on the selected option
  const sortedProperties = React.useMemo(() => {
    if (!properties || properties.length === 0) return [];
    
    // Create a copy to avoid mutating the original array
    const sorted = [...properties];
    
    switch (sortOption) {
      case 'newest':
        return sorted.sort((a, b) => Number(b.id) - Number(a.id)); // Descending by ID
      case 'oldest':
        return sorted.sort((a, b) => Number(a.id) - Number(b.id)); // Ascending by ID
      case 'price_high_low':
        return sorted.sort((a, b) => 
          parseFloat(b.formattedPrice) - parseFloat(a.formattedPrice));
      case 'price_low_high':
        return sorted.sort((a, b) => 
          parseFloat(a.formattedPrice) - parseFloat(b.formattedPrice));
      default:
        return sorted.sort((a, b) => Number(b.id) - Number(a.id)); // Default to newest first
    }
  }, [properties, sortOption]);

  // Show loading state
  if (isLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-[#0A0A23] to-[#080825] py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-white mb-8">
            All Properties
          </h1>
          
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-48 bg-gray-800" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32 bg-gray-800" />
              <Skeleton className="h-10 w-32 bg-gray-800" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-[400px] bg-gray-800 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (isError) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-[#0A0A23] to-[#080825] py-12 px-4">
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
      <section className="min-h-screen bg-gradient-to-b from-[#0A0A23] to-[#080825] py-12 px-4">
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
    <section className="min-h-screen bg-gradient-to-b from-[#0A0A23] to-[#080825] py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-white mb-8">
          Browse All Properties
        </h1>
        
        {/* Filters and Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-400">Sort by:</span>
            <Button
              variant={sortOption === 'newest' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setSortOption('newest')}
              className="text-sm"
            >
              Newest First
            </Button>
            <Button
              variant={sortOption === 'oldest' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setSortOption('oldest')}
              className="text-sm"
            >
              Oldest First
            </Button>
            <Button
              variant={sortOption === 'price_high_low' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setSortOption('price_high_low')}
              className="text-sm"
            >
              Price: High to Low
            </Button>
            <Button
              variant={sortOption === 'price_low_high' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setSortOption('price_low_high')}
              className="text-sm"
            >
              Price: Low to High
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === 'grid' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid2X2Icon className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <AlignJustifyIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Property Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedProperties.map(property => (
              <div 
                key={property.id} 
                className="flex flex-col md:flex-row gap-4 bg-gray-900/50 rounded-xl overflow-hidden transition-all hover:bg-gray-800/50 border border-gray-800 hover:border-blue-700"
              >
                <div className="w-full md:w-1/3 h-56 md:h-auto relative">
                  <Link href={`/property/${property.id}`}>
                    <div className="h-full w-full bg-cover bg-center" style={{ 
                      backgroundImage: `url(https://ipfs.filebase.io/ipfs/${property.assetImage.replace('ipfs://', '')})` 
                    }}></div>
                  </Link>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-white mb-2">
                    <Link href={`/property/${property.id}`} className="hover:text-blue-400 transition-colors">
                      {property.name}
                    </Link>
                  </h2>
                  <p className="text-gray-400 text-sm mb-4">
                    {property.assetLocation}
                  </p>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-1 text-sm text-gray-300">
                      <HomeIcon className="h-4 w-4 text-blue-400" />
                      <span>{property.assetOtherDetails.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-300">
                      <HomeIcon className="h-4 w-4 text-blue-400" />
                      <span>{property.assetOtherDetails.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-300">
                      <HomeIcon className="h-4 w-4 text-blue-400" />
                      <span>{parseInt(property.assetArea).toLocaleString()} sqft</span>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-400">${parseFloat(property.formattedPrice).toLocaleString()}</span>
                    <Button asChild variant="outline">
                      <Link href={`/property/${property.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Property Count */}
        <div className="mt-8 text-center text-gray-400">
          Showing {sortedProperties.length} {sortedProperties.length === 1 ? 'property' : 'properties'}
        </div>
      </div>
    </section>
  );
} 