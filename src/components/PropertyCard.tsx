"use client";

import Image from "next/image";
import { Heart } from "lucide-react";

type Props = {
  imageUrl: string;
  price: string;
  title: string;
  location: string;
  postedBy: string;
  postedTime: string;
};

const PropertyCard = ({
  imageUrl,
  price,
  title,
  location,
  postedBy,
  postedTime,
}: Props) => {
  return (
    <div className="bg-[#12122D] text-white rounded-xl shadow-lg overflow-hidden w-full max-w-[280px] transition-transform hover:scale-105 duration-300">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
        {/* Heart Icon */}
        <button className="absolute top-2 right-2 text-white bg-black/50 p-1 rounded-full">
          <Heart size={18} />
        </button>
        {/* Price Tag */}
        <div className="absolute bottom-2 left-2 bg-[#FFD700] text-black px-2 py-1 text-xs font-bold rounded">
          ₹ {price}
        </div>
      </div>
      <div className="p-4 space-y-1">
        <h4 className="text-base font-semibold truncate">{title}</h4>
        <p className="text-sm text-gray-400 truncate">{location}</p>
        <p className="text-xs text-gray-500">{postedBy} • {postedTime}</p>
      </div>
    </div>
  );
};

export default PropertyCard;
