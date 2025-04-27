'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BiArea, BiHomeAlt, BiPhone } from 'react-icons/bi';
import { MdOutlineBedroomParent, MdOutlineLocationOn } from 'react-icons/md';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const tabs = ['Overview', 'Dealer Details', 'Explore Locality', 'Recommendations'];

const PropertyDetailsPage = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="max-w-7xl mx-auto p-4">
      
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-400 mb-4">
        Home / Property for Rent in Surat / 2 BHK Flats
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
        
        {/* Left Side: Price & Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <AiOutlineCheckCircle className="text-green-500" />
            <span className="text-2xl font-bold">₹17,000</span>
            <span className="text-sm text-gray-500">Per Month</span>
          </div>
          <h1 className="text-xl font-bold text-white">2BHK 2Baths</h1>
          <p className="text-gray-400 text-sm">
            Flat/Apartment for Rent in Shubham Heights, Jahangirabad, Surat, Gujarat
          </p>
        </div>

        {/* Right Side: Buttons */}
        <div className="flex gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md">
            Contact Dealer
          </button>
          <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-md">
            Shortlist
          </button>
        </div>

      </div>

      {/* Tabs Section */}
      <div className="border-b border-gray-700 mb-6">
        <div className="flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`pb-3 border-b-2 ${
                activeTab === tab
                  ? 'border-[#FFD700] text-[#FFD700]'
                  : 'border-transparent text-gray-400'
              } font-medium text-sm`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Image + Info Section */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 relative rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/placeholder.jpg"
            alt="Property"
            width={600}
            height={400}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm p-2">
            2 people shortlisted this property this week
          </div>
        </div>

        {/* Right Side: Features */}
        <div className="w-full md:w-1/2 bg-[#12122D] p-6 rounded-lg shadow-lg space-y-4 text-white">

          {/* Configurations */}
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <MdOutlineBedroomParent />
              <p className="text-sm font-medium">
                2 Bedrooms, 2 Bathrooms, 1 Balcony
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Rent</p>
              <p className="text-yellow-400 font-bold">₹17,000</p>
            </div>
          </div>

          {/* Area */}
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <BiArea />
              <p className="text-sm font-medium">
                Carpet area: 1290 sq.ft.
              </p>
            </div>
            <p className="text-xs text-gray-400">(119.8 sq.m)</p>
          </div>

          {/* Address */}
          <div className="flex items-center gap-2">
            <MdOutlineLocationOn />
            <p className="text-sm font-medium">
              Shubham Heights, Jahangirabad, Surat
            </p>
          </div>

          {/* Furnishing */}
          <div className="flex items-center gap-2">
            <BiHomeAlt />
            <p className="text-sm font-medium">
              Furnishing: <span className="font-semibold">Unfurnished</span>
            </p>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2">
            <BiPhone />
            <p className="text-sm font-medium">
              Available from: <span className="font-semibold">Immediate</span>
            </p>
          </div>

        </div>

      </div>

      {/* Dynamic Tab Content */}
      <div className="mt-8 bg-[#12122D] p-6 rounded-lg shadow-lg text-white">
      {activeTab === 'Overview' && (
  <div className="space-y-10">

    {/* Why You Should Consider */}
    <div className="bg-[#0f172a] p-6 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Why you should consider this property?</h2>
      <div className="bg-blue-50 p-4 rounded-md flex flex-wrap gap-6 items-start">
        <div className="flex flex-col items-start">
          <p className="text-gray-600 font-semibold text-sm">Key Highlights</p>
          <ul className="mt-2 text-sm space-y-1 text-black">
            <li>✓ Gated Society</li>
            <li>✓ Vitrified Flooring</li>
          </ul>
        </div>
        <div className="flex flex-col items-start">
          <ul className="mt-6 text-sm space-y-1 text-black">
            <li>✓ Corner Property</li>
            <li>✓ Pet Friendly</li>
          </ul>
        </div>
        <div className="ml-auto mt-6 text-blue-600 text-sm underline cursor-pointer">
          View 2 More →
        </div>
      </div>
    </div>

    {/* Property Details Table */}
    <div className="bg-[#0f172a] p-6 rounded-lg shadow space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
        <div><strong>Floor Number:</strong> 8<sup>th</sup> of 13 Floors</div>
        <div><strong>Facing:</strong> South-West</div>
        <div><strong>Flooring:</strong> Vitrified</div>
        <div><strong>Width of Facing Road:</strong> 150.0 Feet</div>
        <div><strong>Gated Community:</strong> Yes</div>
        <div><strong>Corner Property:</strong> Yes</div>
        <div><strong>Parking:</strong> 1 Covered, 1 Open</div>
        <div><strong>Pet Friendly:</strong> Yes</div>
        <div><strong>Rent Agreement Duration:</strong> 11 Months</div>
        <div><strong>Months of Notice:</strong> 1 Month</div>
        <div><strong>Electricity & Water Charges:</strong> Charges not included</div>
        <div><strong>Power Backup:</strong> Partial</div>
        <div><strong>Property Age:</strong> 1 to 5 Years Old</div>
        <div><strong>Property Code:</strong> I76592391</div>
      </div>
    </div>

    {/* About Property */}
    <div className="bg-[#0f172a] p-6 rounded-lg shadow space-y-4">
      <h2 className="text-lg font-bold text-white">About Property</h2>
      <p className="text-sm text-gray-400">
        <strong>Address:</strong> 607, Jahangirabad, Surat, Gujarat
      </p>
      <p className="text-sm text-gray-400">
        Explore this amicable shubham heights of Jahangirabad in Surat! Live in a 2 BHK flat for rent
        spread over 1251 sq.ft. Property has 1251 sq.ft. Super built-up area with 2 bathrooms and 1 balcony.
        Built on 1290 sq.ft carpet area. Ease of access to nearby areas.
      </p>
    </div>

    {/* Features */}
    <div className="bg-[#0f172a] p-6 rounded-lg shadow">
      <h2 className="text-lg font-bold text-white mb-4">Features</h2>
      <div className="flex gap-6 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Image src="/lift-icon.png" width={24} height={24} alt="Lift" /> Lift(s)
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Image src="/park-icon.png" width={24} height={24} alt="Park" /> Park
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Image src="/rainwater-icon.png" width={24} height={24} alt="Rainwater" /> Rain Water Harvesting
        </div>
      </div>
    </div>

  </div>
)}

{activeTab === 'Dealer Details' && (
  <div className="bg-[#0f172a] p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-10">

    {/* Left: Dealer Info */}
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Dealer Details</h2>

      {/* Dealer Profile */}
      <div className="flex flex-col items-center space-y-4">
        <Image
          src="/dealer-logo.png"
          alt="Dealer Logo"
          width={100}
          height={100}
          className="rounded-full"
        />
        <h3 className="text-blue-400 text-lg font-semibold">Satish Vishwakarma</h3>
        <p className="text-sm text-gray-400">GJ5 Property</p>

        <button className="bg-green-500 text-white font-bold px-6 py-2 rounded-md mt-2">
          View Phone Number
        </button>

        <div className="text-green-400 text-xs border border-green-400 px-2 py-0.5 rounded mt-2">
          RERA REGISTERED
        </div>
      </div>

      {/* Dealer Stats */}
      <div className="flex flex-wrap gap-4 text-sm text-blue-400 mt-6">
        <p>Properties Listed: <strong>56</strong></p>
        <p>Verified Properties: <strong>51</strong></p>
      </div>

      {/* Localities */}
      <div className="text-sm text-gray-400 mt-4">
        <strong>Localities:</strong> Jahangirabad, Jahangir Pura, Magdalla, LP Savani, Palanpur, PAL
      </div>

      {/* About Dealer */}
      <div className="text-sm text-gray-400 mt-4">
        <strong>About GJ5 Property:</strong><br />
        Founded in 2016 by Satish Vishwakarma, GJ5 Property specializes in residential, commercial, and industrial properties in Surat.
      </div>

      {/* Address */}
      <div className="text-sm text-gray-400 mt-4">
        <strong>Address:</strong> Palanpur, Surat, Gujarat
      </div>
    </div>

    {/* Right: Inquiry Form */}
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Send enquiry to Dealer</h2>

      {/* Radio Button */}
      <div className="flex gap-6 text-sm text-gray-300">
        <label className="flex items-center gap-2">
          <input type="radio" name="userType" value="individual" className="accent-[#FFD700]" />
          Individual
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="userType" value="dealer" className="accent-[#FFD700]" />
          Dealer
        </label>
      </div>

      {/* Form Fields */}
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
        />
        <div className="flex gap-2">
          <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-white">
            <option>IND (+91)</option>
          </select>
          <input
            type="tel"
            placeholder="Phone Number"
            className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
          />
        </div>
        <textarea
          placeholder="I am interested in this Property."
          rows={4}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
        ></textarea>

        {/* Checkbox */}
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <input type="checkbox" className="accent-[#FFD700]" />
          <span>I agree to the <span className="text-blue-400 underline cursor-pointer">Terms & Conditions</span> and <span className="text-blue-400 underline cursor-pointer">Privacy Policy</span></span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-2 transition"
        >
          Send Email & SMS
        </button>
      </form>
    </div>

  </div>
)}

{activeTab === 'Explore Locality' && (
  <div className="p-6 bg-[#0f172a] rounded-lg shadow space-y-8">

    {/* Top Heading */}
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-white">Explore Jahangirabad</h2>
      <p className="text-gray-400">Surat | Pincode - 395005</p>
      <div className="flex gap-4 mt-2 flex-wrap">
        <span className="bg-green-500 text-xs text-white font-semibold px-2 py-1 rounded">
          #9 in Top 100 in Surat
        </span>
        <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded">
          ↑ 1.4% YoY
        </span>
      </div>
    </div>

    {/* Card Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* What's Great */}
      <div className="bg-[#12122d] border border-gray-700 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-yellow-400 text-xl">👍</span>
          <h3 className="text-lg font-bold text-white">What's great here!</h3>
        </div>
        <ul className="space-y-3 text-gray-400 text-sm">
          <li>🏡 Jahangirabad is a mid-income budget locale offering ready-to-move apartments by city-based builders</li>
          <li>🛣️ Ugat Road, Ugat Canal Road, and Ambedkar Nagar Road are key roads passing through Jahangirabad</li>
          <li>🚉 About 8 km from Surat Railway Station on the Ahmedabad-Vadodara-Mumbai line of Indian Railways</li>
          <li>✈️ Surat International Airport accessible within 18 km via NH-53</li>
        </ul>
      </div>

      {/* What needs attention */}
      <div className="bg-[#12122d] border border-gray-700 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-yellow-400 text-xl">👎</span>
          <h3 className="text-lg font-bold text-white">What needs attention!</h3>
        </div>
        <ul className="space-y-3 text-gray-400 text-sm">
          <li>🛠️ Several parks in Jahangirabad lag in terms of maintenance</li>
        </ul>
      </div>
    </div>

  </div>
)}

{activeTab === 'Recommendations' && (
  <div className="p-6 bg-[#0f172a] rounded-lg shadow space-y-10">

    {/* Similar Properties */}
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Similar Properties</h2>
      <div className="flex overflow-x-auto gap-4 pb-2">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="w-64 min-w-[250px] bg-[#12122d] rounded-lg border border-gray-700 overflow-hidden shadow"
          >
            <div className="relative h-40">
              <img
                src="/placeholder.jpg"
                alt="property"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                Owner • 05th Apr, 2025
              </div>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-[#36b37e] font-bold">₹20,000, 2 BHK</p>
              <p className="text-gray-300 text-sm">Ankur Heights, Jahangirpura</p>
              <p className="text-gray-400 text-xs">Palanpur, Surat</p>
              <button className="w-full bg-[#ffd700] hover:bg-[#e5c100] text-black font-semibold mt-3 py-1 rounded">
                Enquire Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Properties posted by Owners */}
   

  </div>
)}

      </div>

    </div>
  );
};

export default PropertyDetailsPage;
