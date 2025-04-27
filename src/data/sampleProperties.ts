// src/data/sampleProperties.ts
import Logo from '@/assets/images/ofc-1.jpg'; // import image if needed

export const sampleProperties = [
  {
    id: 1,
    title: "Luxurious Villa with Pool",
    imageUrl: Logo, // ✅ not imageurl
    price: 35000000,
    area: 4500,
    areaUnit: "sqft",
    areaSqm: 418,
    location: "Vesu, Surat",
    bedrooms: 5,
    bathrooms: 5, // ✅ missing before
    propertyType: "Independent House/Villa",
    description: "Stunning 5 BHK Villa in Vesu with private pool and garden.",
    builder: "Renowned Builders",
    postedTime: "1mo ago",
    featured: true,
    hasRera: true,
    carpetArea: "3800 sqft",
    status: "Ready To Move",
    contactCount: 5,
  },
  {
    id: 2,
    title: "Modern City Apartment",
    imageUrl: Logo, // ✅
    price: 8500000,
    area: 1800,
    areaUnit: "sqft",
    areaSqm: 167,
    location: "Adajan, Surat",
    bedrooms: 3,
    bathrooms: 2, // ✅
    propertyType: "Residential Apartment",
    description: "Spacious 3 BHK apartment in a prime Adajan location.",
    builder: "City Developers",
    postedTime: "3w ago",
    featured: false,
    hasRera: true,
    carpetArea: "1500 sqft",
    status: "Ready To Move",
    contactCount: 12,
  }
];
