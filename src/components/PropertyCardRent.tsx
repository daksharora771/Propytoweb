"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BiArea } from "react-icons/bi";

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCardRent = ({ property }: PropertyCardProps) => {
  return (
    <Link
      href={`/property/${property.id}`}
      className="block bg-[#12122D] rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full">
        <Image
          src={property.imageUrl || "/placeholder.jpg"}
          alt={property.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-2">
        {/* Title */}
        <h2 className="text-lg font-bold text-white truncate">
          {property.title || "N/A"}
        </h2>

        {/* Location */}
        <p className="text-sm text-gray-400 truncate">
          {property.location || "Location not available"}
        </p>

        {/* Price and Area */}
        <div className="flex justify-between items-center text-yellow-400 font-bold text-md">
          <span>
            ₹ {property.price ? property.price.toLocaleString() : "N/A"}
          </span>
          <span className="text-sm text-gray-300 flex items-center gap-1">
            <BiArea />
            {property.area ? `${property.area} ${property.areaUnit}` : "N/A"}
          </span>
        </div>

        {/* Bedrooms and Bathrooms */}
        <div className="flex gap-3 text-gray-400 text-xs pt-2">
          <span>{property.bedrooms ? `${property.bedrooms} BHK` : "N/A"}</span>
          <span>{property.bathrooms ? `${property.bathrooms} Baths` : "N/A"}</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCardRent;
