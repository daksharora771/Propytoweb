'use client'
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { FiFilter } from 'react-icons/fi';
import { BiSort } from 'react-icons/bi';
import PropertyCardRent from '@/components/PropertyCardRent';

// Use dynamic imports to avoid module not found errors
const PropertyFilters = dynamic(() => import('@/components/PropertyFilters'), { ssr: false });
const PropertyCard = dynamic(() => import('@/components/PropertyCard'), { ssr: false });
const MobileFilters = dynamic(() => import('@/components/MobileFilters'), { ssr: false });
// const BottomNavigation = dynamic(() => import('@/components/BottomNavigation'), { ssr: false });

// Sample property data (Should be updated for Buy properties)
const sampleProperties = [
  {
    id: 1,
    title: "Luxurious Villa with Pool",
    price: 35000000, // Price in INR (e.g., 3.5 Cr)
    area: 4500,
    areaUnit: "sqft",
    areaSqm: 418,
    location: "Vesu, Surat",
    bedrooms: 5,
    propertyType: "Independent House/Villa",
    description: "Stunning 5 BHK Villa in Vesu with private pool and garden.",
    builder: "Renowned Builders",
    postedTime: "1mo ago",
    featured: true,
    hasRera: true,
    carpetArea: "Carpet Area",
    status: "Ready To Move",
    contactCount: 5
  },
  {
    id: 2,
    title: "Modern City Apartment",
    price: 8500000, // Price in INR (e.g., 85 Lacs)
    area: 1800,
    areaUnit: "sqft",
    areaSqm: 167,
    location: "Adajan, Surat",
    bedrooms: 3,
    propertyType: "Residential Apartment",
    description: "Spacious 3 BHK apartment in a prime Adajan location.",
    builder: "City Developers",
    postedTime: "3w ago",
    featured: false,
    hasRera: true,
    carpetArea: "Carpet Area",
    status: "Ready To Move",
    contactCount: 12
  }
];

// Synchronized Filters interface to match PropertyFilters.tsx
interface Filters {
  budget: { min: number; max: number };
  bedrooms: number[]; // Should be number[]
  propertyType: string[];
  availableFor: string[];
  postedBy: string[];
  furnishingStatus: string[];
  localities: string[];
  projectsSocieties: string[];
  bathrooms: number[]; // Should be number[]
  amenities: string[];
  area: { min: number; max: number };
  availableFrom: string[]; // Added missing property
  propertyAge: string[];
  // Added missing boolean properties
  owner: boolean;
  verified: boolean;
  furnished: boolean;
  withPhotos: boolean;
  withVideos: boolean;
}

export default function BuyPage() {
  const [filters, setFilters] = useState<Filters>({
    budget: { min: 0, max: 100000000 },
    bedrooms: [], // number[]
    propertyType: [],
    availableFor: [],
    postedBy: [],
    furnishingStatus: [],
    localities: [],
    projectsSocieties: [],
    bathrooms: [], // number[]
    amenities: [],
    area: { min: 0, max: 10000 },
    availableFrom: [], // Initialize missing property
    propertyAge: [],
    // Initialize missing boolean properties
    owner: false,
    verified: false,
    furnished: false,
    withPhotos: false,
    withVideos: false,
  });

  const [sortBy, setSortBy] = useState('relevance');
  // Removed separate quickFilters state as they are now part of main filters
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);


  // Filter properties based on current filters
  const filteredProperties = sampleProperties.filter(property => {
    const price = typeof property.price === 'number' ? property.price : 0;
    if (price < filters.budget.min || price > filters.budget.max) return false;

    // Bedrooms filter (ensure comparison uses numbers)
    if (filters.bedrooms.length > 0 && !filters.bedrooms.includes(property.bedrooms)) return false;

    // Property type filter
    if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.propertyType)) return false;

    // Posted by filter (assuming builder is the source)
    if (filters.postedBy.length > 0 && !filters.postedBy.includes(property.builder)) return false;

    // Quick filters (now read from main filters state)
    if (filters.owner && property.builder !== 'Owner Name') return false; // Adjust logic for owner if needed
    if (filters.verified && !property.hasRera) return false; // Example: using hasRera for verified
    if (filters.furnished) return false; // Buy page might not filter by furnished status
    if (filters.withPhotos) return false; // Add logic if sampleProperties has hasPhotos
    if (filters.withVideos) return false; // Add logic if sampleProperties has hasVideos

    return true;
  });

  // Sort properties based on selected option
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    // Ensure prices are numbers for sorting
    const priceA = typeof a.price === 'number' ? a.price : 0;
    const priceB = typeof b.price === 'number' ? b.price : 0;
    switch (sortBy) {
      case 'price_low_high':
        return priceA - priceB;
      case 'price_high_low':
        return priceB - priceA;
      case 'latest': // Sorting by ID might represent 'latest'
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <div className="pb-16 lg:pb-0 !bg-[#0A0A23]">
      {/* Mobile Header (Same as Rent) */}
      <div className="lg:hidden sticky top-0  z-40 border-b">
         <div className="flex items-center p-4">
          <button onClick={() => window.history.back()} className="mr-4">
            ←
          </button>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search City/Locality/Project"
              className="w-full p-2 bg- rounded-md"
            />
          </div>
          <button className="ml-4">
            ♡
          </button>
        </div>
        
        {/* Mobile Filter/Sort Buttons */}
        <div className="flex border-t">
          <button
            className="flex-1 p-3 flex items-center justify-center gap-2 border-r"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <FiFilter />
            Filters
          </button>
          <button
            className="flex-1 p-3 flex items-center justify-center gap-2"
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            <BiSort />
            Sort
          </button>
        </div>

        {/* Mobile Sort Dropdown */}
        {isSortOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t shadow-lg z-40">
            <button
              className="w-full p-3 text-left hover:bg-gray-50"
              onClick={() => {
                setSortBy('relevance');
                setIsSortOpen(false);
              }}
            >
              Relevance
            </button>
            <button
              className="w-full p-3 text-left hover:bg-gray-50"
              onClick={() => {
                setSortBy('price_low_high');
                setIsSortOpen(false);
              }}
            >
              Price - Low to High
            </button>
            <button
              className="w-full p-3 text-left hover:bg-gray-50"
              onClick={() => {
                setSortBy('price_high_low');
                setIsSortOpen(false);
              }}
            >
              Price - High to Low
            </button>
            <button
              className="w-full p-3 text-left hover:bg-gray-50"
              onClick={() => {
                setSortBy('latest');
                setIsSortOpen(false);
              }}
            >
              Latest First
            </button>
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

          {/* Property Cards Grid */}
          <div className="grid grid-cols-1 gap-4">
            {sortedProperties.map(property => (
              // Ensure PropertyCard component can handle 'Buy' data (e.g., no deposit)
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

      {/* Bottom Navigation */}
      {/* <BottomNavigation /> */}
    </div>
  );
} 