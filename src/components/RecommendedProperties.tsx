"use client";

import PropertyCard from "./PropertyCard";
import Home from '@/assets/images/home.svg';

const properties = [
  {
    imageUrl: Home,
    price: "45 L",
    title: "5 BHK Independent House",
    location: "Kuber Nagar 2, Katargam",
    postedBy: "Posted by Owner",
    postedTime: "3 months ago",
  },
  {
    imageUrl: Home,
    price: "47 L",
    title: "5 BHK Independent House",
    location: "Santosh Apartment, Katargam",
    postedBy: "Posted by Owner",
    postedTime: "1 week ago",
  },
  {
    imageUrl: Home,
    price: "60 L",
    title: "5 BHK Independent House",
    location: "Paras Society, Katargam",
    postedBy: "Posted by Owner",
    postedTime: "2 months ago",
  },
  {
    imageUrl: Home,
    price: "25 L",
    title: "1 BHK Apartment",
    location: "105 SAHYOG APARTMENT",
    postedBy: "Posted by Owner",
    postedTime: "1 month ago",
  },
  {
    imageUrl: Home,
    price: "60 L",
    title: "5 BHK Independent House",
    location: "Paras Society, Katargam",
    postedBy: "Posted by Owner",
    postedTime: "2 months ago",
  },
  {
    imageUrl: Home,
    price: "25 L",
    title: "1 BHK Apartment",
    location: "105 SAHYOG APARTMENT",
    postedBy: "Posted by Owner",
    postedTime: "1 month ago",
  },
];

const RecommendedProperties = () => {
  return (
    <section className="bg-black py-10 px-4 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-bold mb-2">Recommended Properties</h2>
        <p className="text-sm text-gray-400 mb-6">Curated especially for you</p>
        
        {/* Horizontal Scroll */}
        <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
          {properties.map((property, index) => (
            <div className="min-w-[250px] flex-shrink-0" key={index}>
              <PropertyCard {...property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedProperties;
