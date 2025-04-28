"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import SellForm from "@/assets/images/sellForm.png";
import { useRouter } from "next/navigation";

const Sell = () => {
  const [selectedType, setSelectedType] = useState("residential");
  const [lookingFor, setLookingFor] = useState("Sell");
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [subTypes, setSubTypes] = useState<string[]>([]);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const residential = [
      'Apartment',
      'Independent House/Villa',
      'Residential Land',
      'Independent/Builder Floor',
      'Farm House',
      '1 RK/ Studio Apartment'
    ];

    const commercial = [
      'Office Space',
      'Shop/Showroom',
      'Commercial Land',
      'Warehouse/Godown',
      'Industrial Building',
      'Hotel/Resort',
      'Other Commercial'
    ];

    setSubTypes(selectedType === 'residential' ? residential : commercial);
  }, [selectedType]);

  const handleStartNow = () => {
    if (lookingFor && selectedType && selectedProperty) {
      setError("");
      router.push("/sell/form");
    } else {
      setError("Please select all the options before proceeding!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 3xl:px-16 py-12 flex flex-col 3xl:flex-row gap-8 items-start">
      
      {/* Left Section */}
      <div className="w-full 3xl:w-1/2 space-y-6">
        <h1 className="text-3xl 3xl:text-4xl font-bold leading-tight">
          Sell or Rent your Property <br />
          <span className="text-[#e5a526]">online faster</span> with Techmont
        </h1>

        <ul className="space-y-3 text-sm 3xl:text-base text-gray-300">
          <li className="flex items-center gap-2">
            <CheckCircle className="text-green-500 w-4 h-4" />
            Advertise for FREE
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="text-green-500 w-4 h-4" />
            Get unlimited enquiries
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="text-green-500 w-4 h-4" />
            Get shortlisted buyers and tenants
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="text-green-500 w-4 h-4" />
            Assistance in coordinating site visits
          </li>
        </ul>

        <div className="rounded-lg overflow-hidden mt-6">
          <Image
            src={SellForm}
            alt="Sell Property Illustration"
            width={600}
            height={400}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full 3xl:w-1/2 bg-gray-900 p-6 3xl:p-8 rounded-xl border border-gray-700 shadow-lg space-y-6">
        <h2 className="text-xl 3xl:text-2xl font-semibold text-center 3xl:text-left">
          Start posting your property, it is free
        </h2>

        {/* Looking for */}
        <div className="space-y-2">
          <label className="block text-sm mb-1 text-gray-400">You are looking to ...</label>
          <div className="flex flex-wrap gap-3">
            {["Sell", "Rent / Lease"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setLookingFor(type);
                  setSelectedProperty(null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  lookingFor === type
                    ? "bg-[#e5a526] text-black"
                    : "border-gray-700 text-gray-300 hover:bg-gray-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <label className="block text-sm mb-1 text-gray-400">And it is a ...</label>
          <div className="flex gap-6 flex-wrap">
            {["residential", "commercial"].map((cat) => (
              <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  value={cat}
                  checked={selectedType === cat}
                  onChange={() => {
                    setSelectedType(cat);
                    setSelectedProperty(null);
                  }}
                  className="accent-[#e5a526]"
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Sub-Category Selection */}
        <div className="grid grid-cols-2 3xl:grid-cols-3 gap-3">
          {subTypes.map((type) => (
            <div
              key={type}
              onClick={() => setSelectedProperty(type)}
              className={`text-sm border px-3 py-1.5 rounded-full text-center cursor-pointer transition ${
                selectedProperty === type
                  ? "bg-[#e5a526] text-black border-[#e5a526]"
                  : "border-gray-700 text-gray-300 hover:bg-[#e5a526]/20"
              }`}
            >
              {type}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Start Now Button */}
        <button
          onClick={handleStartNow}
          className="w-full bg-[#daaa48] hover:bg-[#e5a526] text-black font-bold py-3 rounded-md transition"
        >
          Start now
        </button>
      </div>
    </div>
  );
};

export default Sell;
