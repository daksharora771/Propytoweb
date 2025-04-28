'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { FiFilter } from 'react-icons/fi';
import { BiSort } from 'react-icons/bi';
import PropertyCardRent from '@/components/PropertyCardRent';
import { properties } from '@/data/properties'; // ✅ Correct import

const PropertyFilters = dynamic(() => import('@/components/PropertyFilters'), { ssr: false });
const MobileFilters = dynamic(() => import('@/components/MobileFilters'), { ssr: false });
// const BottomNavigation = dynamic(() => import('@/components/BottomNavigation'), { ssr: false });

const sampleProperties = properties; // ✅ now using correct data

interface Filters {
  budget: { min: number; max: number };
  bedrooms: number[];
  propertyType: string[];
  availableFor: string[];
  postedBy: string[];
  furnishingStatus: string[];
  localities: string[];
  projectsSocieties: string[];
  bathrooms: number[];
  amenities: string[];
  area: { min: number; max: number };
  availableFrom: string[];
  propertyAge: string[];
  owner: boolean;
  verified: boolean;
  furnished: boolean;
  withPhotos: boolean;
  withVideos: boolean;
}

export default function BuyPage() {
  const [filters, setFilters] = useState<Filters>({
    budget: { min: 0, max: 100000000 },
    bedrooms: [],
    propertyType: [],
    availableFor: [],
    postedBy: [],
    furnishingStatus: [],
    localities: [],
    projectsSocieties: [],
    bathrooms: [],
    amenities: [],
    area: { min: 0, max: 10000 },
    availableFrom: [],
    propertyAge: [],
    owner: false,
    verified: false,
    furnished: false,
    withPhotos: false,
    withVideos: false,
  });

  const [sortBy, setSortBy] = useState('relevance');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredProperties = sampleProperties.filter(property => {
    const price = typeof property.price === 'number' ? property.price : 0;
    if (price < filters.budget.min || price > filters.budget.max) return false;
    if (filters.bedrooms.length > 0 && !filters.bedrooms.includes(property.bedrooms)) return false;
    if (filters.postedBy.length > 0 && !filters.postedBy.includes(property.postedBy)) return false;
    if (filters.owner && property.postedBy !== 'Owner') return false;
    if (filters.furnished) return false;
    if (filters.withPhotos) return false;
    if (filters.withVideos) return false;
  
    return true;
  });
  

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const priceA = typeof a.price === 'number' ? a.price : 0;
    const priceB = typeof b.price === 'number' ? b.price : 0;
    switch (sortBy) {
      case 'price_low_high':
        return priceA - priceB;
      case 'price_high_low':
        return priceB - priceA;
      case 'latest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <div className="pb-16 lg:pb-0 !bg-[#0A0A23]">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 border-b ">
        <div className="flex items-center p-4">
          <button onClick={() => window.history.back()} className="mr-4">
            ←
          </button>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search City/Locality/Project"
              className="w-full p-2 rounded-md"
            />
          </div>
          <button className="ml-4">♡</button>
        </div>

        {/* Mobile Filter/Sort Buttons */}
        <div className="flex border-t">
          <button
            className="flex-1 p-3 flex items-center justify-center gap-2 border-r"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <FiFilter /> Filters
          </button>
          <button
            className="flex-1 p-3 flex items-center justify-center gap-2"
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            <BiSort /> Sort
          </button>
        </div>

        {/* Mobile Sort Dropdown */}
        {isSortOpen && (
          <div className="absolute top-full left-0 right-0  border-t shadow-lg z-40">
            <button className="w-full p-3 text-left hover:bg-gray-50" onClick={() => { setSortBy('relevance'); setIsSortOpen(false); }}>Relevance</button>
            <button className="w-full p-3 text-left hover:bg-gray-50" onClick={() => { setSortBy('price_low_high'); setIsSortOpen(false); }}>Price - Low to High</button>
            <button className="w-full p-3 text-left hover:bg-gray-50" onClick={() => { setSortBy('price_high_low'); setIsSortOpen(false); }}>Price - High to Low</button>
            <button className="w-full p-3 text-left hover:bg-gray-50" onClick={() => { setSortBy('latest'); setIsSortOpen(false); }}>Latest First</button>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="flex min-h-screen bg-black">
        {/* Desktop Filters */}
        <div className="hidden lg:block w-1/4 p-4">
          <PropertyFilters filters={filters} setFilters={setFilters} />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4 p-4">
          <div className="grid grid-cols-1 gap-4">
            {sortedProperties.map(property => (
              <PropertyCardRent key={property.id} property={property} />
            ))}
          </div>

          {sortedProperties.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No properties found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <MobileFilters
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
}
