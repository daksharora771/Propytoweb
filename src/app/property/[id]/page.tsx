'use client'
import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { IoArrowBack, IoShareSocialOutline, IoHeartOutline } from 'react-icons/io5';
import { BiArea, BiBuildingHouse } from 'react-icons/bi'; // Example icons
import { MdOutlineVerified } from 'react-icons/md'; // Example icons

// Placeholder data - replace with actual data fetching later
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
    bathrooms: 5,
    propertyType: "Independent House/Villa",
    description: "Stunning 5 BHK Villa in Vesu with private pool and garden. Experience luxury living with premium amenities.",
    builder: "Renowned Builders",
    postedTime: "1mo ago",
    featured: true,
    hasRera: true,
    carpetArea: "3800 sqft",
    status: "Ready To Move",
    contactCount: 5,
    imageUrl: "/placeholder.jpg", // Add image URL
    propertyAge: "1-5 Year Old",
    floor: "Ground out of 2",
    ownership: "Freehold",
    highlights: [
        "Overlooking Park/Garden",
        "Overlooking Main Road",
        "Near Metro Station",
        "Gated Society",
        "Private Pool"
    ]
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
    bathrooms: 2,
    propertyType: "Residential Apartment",
    description: "Spacious 3 BHK apartment in a prime Adajan location. Close to schools, markets, and hospitals.",
    builder: "City Developers",
    postedTime: "3w ago",
    featured: false,
    hasRera: true,
    carpetArea: "1500 sqft",
    status: "Ready To Move",
    contactCount: 12,
    imageUrl: "/placeholder.jpg", // Add image URL
    propertyAge: "0-1 Year Old",
    floor: "5 out of 7",
    ownership: "Freehold",
    highlights: [
        "Overlooking Main Road",
        "Spartex Flooring",
        "Lift Available",
        "24x7 Security"
    ]
  }
];

// Dynamically import BottomNavigation if needed, but maybe not needed on detail page
// const BottomNavigation = dynamic(() => import('@/components/BottomNavigation'), { ssr: false });

interface PropertyDetailPageProps {
  params: { id: string };
}

// Helper function to format price
const formatPrice = (price: number) => {
  if (price >= 10000000) { // Crore
    return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) { // Lac
    return `₹ ${(price / 100000).toFixed(2)} Lac`;
  }
  return `₹ ${price.toLocaleString()}`;
};

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const propertyId = parseInt(params.id, 10);
  const property = sampleProperties.find((p) => p.id === propertyId);

  if (!property) {
    notFound(); // Show 404 if property not found
  }

  const keyStats = [
    { icon: <BiBuildingHouse />, label: `${property.bedrooms} BHK`, value: property.bathrooms ? `and ${property.bathrooms} baths` : '' },
    { icon: <BiArea />, label: 'Floor', value: property.floor },
    { icon: <MdOutlineVerified />, label: 'Carpet Area', value: `${property.carpetArea}` },
    { icon: <BiArea />, label: 'Age', value: property.propertyAge },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-24"> {/* Padding bottom for sticky bar */}
      {/* Header */}
      <div className="sticky top-0 bg-white z-30 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <button onClick={() => window.history.back()} className="p-2 text-gray-700">
            <IoArrowBack className="text-xl" />
          </button>
          <div className="flex-1 mx-4">
            {/* Optional: Add search bar here if needed */}
            <p className="text-center font-medium truncate">{property.title}</p> 
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-700">
              <IoHeartOutline className="text-xl" />
            </button>
            <button className="p-2 text-gray-700">
              <IoShareSocialOutline className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative h-60 bg-gray-300">
        <Image 
          src={property.imageUrl} 
          alt={property.title} 
          fill 
          className="object-cover"
          priority
        />
        {/* Add image count/gallery button if needed */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          1 / 10 {/* Placeholder */} 
        </div> 
        <div className="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded bg-black/60">
             Posted {property.postedTime} by {property.builder} {/* Assuming builder is poster */} 
        </div> 
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-4">
        {/* Price and Basic Info */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{formatPrice(property.price)}</h1>
          <p className="text-sm text-gray-600 mb-3">{property.title} in {property.location}</p>
          <div className="flex items-center text-xs text-gray-500 gap-3 mb-3">
            {property.status && <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{property.status}</span>}
             {/* Add more tags like Unfurnished if needed */}
          </div>
          
          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t pt-4">
            {keyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl text-[#bc9b54] mb-1 inline-block">{stat.icon}</div>
                <p className="text-sm font-medium text-gray-800">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

         {/* TODO: Add Tab Navigation Here (Overview, Highlights, Details etc.) */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Overview</h2>
          
          {/* Key Highlights */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Key Highlights</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {property.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
             {/* Add more... button if needed */} 
          </div>

          {/* Property Details */}
          <div>
             <h3 className="font-medium text-gray-700 mb-2">Property Details</h3>
             <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="text-gray-500">Layout</div>
                <div className="text-gray-800 font-medium">{property.bedrooms} BHK{property.bathrooms ? `, ${property.bathrooms} Baths` : ''}</div>
                
                <div className="text-gray-500">Ownership</div>
                <div className="text-gray-800 font-medium">{property.ownership}</div>
                
                {/* Add more details */} 
                <div className="text-gray-500">Property Age</div>
                <div className="text-gray-800 font-medium">{property.propertyAge}</div>

                 <div className="text-gray-500">Floor</div>
                <div className="text-gray-800 font-medium">{property.floor}</div>
             </div>
          </div>
           {/* Description */} 
          <div className="mt-4 border-t pt-4">
             <h3 className="font-medium text-gray-700 mb-2">Description</h3>
             <p className="text-sm text-gray-600">{property.description}</p>
          </div>
        </div>

        {/* Add other sections like Photos, Facilities, Seller, Compare etc. later */}

      </div>

      {/* Sticky Bottom Contact Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-20 shadow-inner">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors text-sm">
            <FaWhatsapp className="text-lg"/> WhatsApp
          </button>
          <button className="flex-1 px-4 py-2.5 bg-[#1a1a1a] text-[#bc9b54] border border-[#bc9b54] rounded-md hover:bg-gray-800 transition-colors text-sm">
            View Number
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#bc9b54] text-black rounded-md hover:bg-[#c69531] transition-colors text-sm">
            <FaPhoneAlt /> Call
          </button>
        </div>
      </div>
      
      {/* Optional: Render BottomNavigation if user should navigate away from detail page easily */}
      {/* <BottomNavigation /> */}
    </div>
  );
}