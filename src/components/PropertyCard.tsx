"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  HomeIcon, 
  BedIcon, 
  BathIcon, 
  ArrowRightCircleIcon,
  DivideCircleIcon,
  MapPinIcon,
  RulerIcon
} from 'lucide-react';
import { PropertyData } from '@/hooks/usePropertyDetails';
import { getAssetTypeName, getSubTypeName } from '@/hooks/usePropertyDetails';
import { getIPFSUrl, formatBlockchainDate } from '@/lib/utils';

interface PropertyCardProps {
  property: PropertyData;
}

export function PropertyCard({ property }: PropertyCardProps) {
  // Format price for display
  const price = parseFloat(property.formattedPrice).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  // Get bedrooms and bathrooms
  const bedrooms = property.assetOtherDetails?.bedrooms || 'N/A';
  const bathrooms = property.assetOtherDetails?.bathrooms || 'N/A';
  
  // Format area
  const area = parseInt(property.assetArea).toLocaleString();
  
  // Check if partial ownership is enabled
  const partialOwnership = property.isPartiallyOwnEnabled;
  
  // Get type and subtype
  const propertyType = getAssetTypeName(property.assetType);
  const propertySubtype = getSubTypeName(property.assetType, property.assetOtherDetails.subType);
  
  // Format expiry date
  const expiryDate = formatBlockchainDate(property.listingExpiry, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Truncate description
  const shortDescription = property.assetDescription.length > 100 
    ? `${property.assetDescription.substring(0, 100)}...` 
    : property.assetDescription;
  
  return (
    <div className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#12122D] to-[#0A0A23] border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-blue-900/20">
      {/* Property Image with Gradient Overlay */}
      <div className="aspect-[4/3] w-full relative overflow-hidden rounded-t-xl">
        {property.assetImage ? (
          <Image
            src={getIPFSUrl(property.assetImage)}
            alt={property.name}
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gray-800 flex items-center justify-center">
            <HomeIcon className="h-16 w-16 text-gray-700" />
          </div>
        )}
        
        {/* Price Tag */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-3 px-4">
          <div className="flex justify-between items-end">
            <span className="text-xl font-bold text-white">{price}</span>
            <div className="flex items-center text-xs text-gray-300 space-x-1">
              <MapPinIcon className="h-3 w-3 text-blue-400" />
              <span className="truncate max-w-[150px]">{property.assetOtherDetails.location}</span>
            </div>
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-medium">
            {propertyType}
          </span>
          {partialOwnership && (
            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1">
              <DivideCircleIcon className="h-3 w-3" />
              <span>Fractional</span>
            </span>
          )}
        </div>
        
        {/* Expiry Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
            Available until {expiryDate}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
          {property.name}
        </h3>
        
        <p className="text-xs text-gray-400 h-8 overflow-hidden">
          {shortDescription}
        </p>
        
        {/* Features */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-800">
          <div className="flex items-center gap-1 text-sm text-gray-300">
            <BedIcon className="h-4 w-4 text-blue-400" />
            <span>{bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-300">
            <BathIcon className="h-4 w-4 text-blue-400" />
            <span>{bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-300">
            <RulerIcon className="h-4 w-4 text-blue-400" />
            <span>{area} sqft</span>
          </div>
        </div>
        
        {/* Footer with Link */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-gray-400">{propertySubtype}</span>
          <Link 
            href={`/property/${property.id}`} 
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span className="text-sm font-medium">View Details</span>
            <ArrowRightCircleIcon className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
