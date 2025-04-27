'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BiArea, BiHomeAlt, BiPhone } from 'react-icons/bi';
import { MdOutlineBedroomParent, MdOutlineLocationOn } from 'react-icons/md';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const tabs = [
  "Overview",
  "Dealer Details",
  "Explore Locality",
  "Recommendations",
];

// ⬇️ ADD INTERFACE
interface PropertyDetailsPageProps {
  property: any;
  recommendations: {
    imageUrl: string;
    title: string;
    price: number;
    bhk: string;
    location: string;
    postedBy: string;
    postedDate: string;
    projectName: string;
  }[];
}

const PropertyDetailsPage = ({ property, recommendations }: PropertyDetailsPageProps) => {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-4">
        Home / Property for Rent in Surat / 2 BHK Flats
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
        {/* Price & Basic Info */}
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

        {/* Contact Buttons */}
        <div className="flex gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md">
            Contact Dealer
          </button>
          <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-md">
            Shortlist
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 border-b-2 ${
                activeTab === tab
                  ? "border-yellow-400 text-yellow-400"
                  : "border-transparent text-gray-400"
              } font-medium text-sm`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Image and Info */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image */}
        <div className="w-full md:w-1/2 relative rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/placeholder.jpg"
            alt="Property"
            width={600}
            height={400}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 text-center">
            2 people shortlisted this property this week
          </div>
        </div>

        {/* Info Card */}
        <div className="w-full md:w-1/2 bg-[#12122D] p-6 rounded-lg shadow-lg text-white space-y-4">
          {/* Configuration */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MdOutlineBedroomParent />
              <p className="text-sm">2 Bedrooms, 2 Bathrooms, 1 Balcony</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Rent</p>
              <p className="text-yellow-400 font-bold">₹17,000</p>
            </div>
          </div>

          {/* Area */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BiArea />
              <p className="text-sm">Carpet area: 1290 sq.ft.</p>
            </div>
            <p className="text-xs text-gray-400">(119.8 sq.m)</p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MdOutlineLocationOn />
            <p className="text-sm">Shubham Heights, Jahangirabad</p>
          </div>

          {/* Furnishing */}
          <div className="flex items-center gap-2">
            <BiHomeAlt />
            <p className="text-sm">Furnishing: <span className="font-semibold">Unfurnished</span></p>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2">
            <BiPhone />
            <p className="text-sm">Available from: <span className="font-semibold">Immediate</span></p>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8 bg-[#12122D] p-6 rounded-lg shadow-lg text-white">
        {activeTab === "Overview" && (
          <OverviewTab />
        )}
        {activeTab === "Dealer Details" && (
          <DealerDetailsTab />
        )}
        {activeTab === "Explore Locality" && (
          <ExploreLocalityTab />
        )}
        {activeTab === "Recommendations" && (
          <RecommendationsTab />
        )}
      </div>
    </div>
  );
};

// -------------- Different Tabs Component ------------------

const OverviewTab = () => (
  <div className="space-y-10">
    {/* Why You Should Consider */}
    <Section title="Why you should consider this property?">
      <div className="flex flex-wrap gap-6 bg-blue-50 p-4 rounded-md items-start">
        <Highlights />
      </div>
    </Section>

    {/* Property Details */}
    <Section title="Property Details">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
        {[
          { label: "Floor Number", value: "8th of 13 Floors" },
          { label: "Facing", value: "South-West" },
          { label: "Flooring", value: "Vitrified" },
          { label: "Width of Facing Road", value: "150 Feet" },
          { label: "Gated Community", value: "Yes" },
          { label: "Corner Property", value: "Yes" },
          { label: "Parking", value: "1 Covered, 1 Open" },
          { label: "Pet Friendly", value: "Yes" },
          { label: "Rent Agreement Duration", value: "11 Months" },
          { label: "Months of Notice", value: "1 Month" },
          { label: "Electricity & Water Charges", value: "Not Included" },
          { label: "Power Backup", value: "Partial" },
          { label: "Property Age", value: "1 to 5 Years" },
          { label: "Property Code", value: "I76592391" },
        ].map((item, idx) => (
          <div key={idx}>
            <strong>{item.label}:</strong> {item.value}
          </div>
        ))}
      </div>
    </Section>

    {/* About Property */}
    <Section title="About Property">
      <p className="text-sm text-gray-400">
        Address: 607, Jahangirabad, Surat, Gujarat
      </p>
      <p className="text-sm text-gray-400 mt-2">
        Explore this amicable Shubham Heights of Jahangirabad in Surat! 2 BHK flat for rent spread over 1251 sq.ft. Ease of access to nearby areas.
      </p>
    </Section>

    {/* Features */}
    <Section title="Features">
      <div className="flex gap-6 flex-wrap">
        {["Lift(s)", "Park", "Rain Water Harvesting"].map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
            <Image src="/feature-icon.png" width={24} height={24} alt="Feature" />
            {feature}
          </div>
        ))}
      </div>
    </Section>
  </div>
);

// Reusable Section component
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-[#0f172a] p-6 rounded-lg shadow space-y-4">
    <h2 className="text-lg font-bold">{title}</h2>
    {children}
  </div>
);

// Highlights inside Overview
const Highlights = () => (
  <>
    <div>
      <p className="text-gray-600 font-semibold text-sm">Key Highlights</p>
      <ul className="mt-2 text-black text-sm space-y-1">
        <li>✓ Gated Society</li>
        <li>✓ Vitrified Flooring</li>
      </ul>
    </div>
    <div>
      <ul className="mt-6 text-black text-sm space-y-1">
        <li>✓ Corner Property</li>
        <li>✓ Pet Friendly</li>
      </ul>
    </div>
  </>
);

// Dummy for now
const DealerDetailsTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
    {/* Dealer Profile */}
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Dealer Details</h2>

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

      <div className="flex flex-wrap gap-4 text-sm text-blue-400 mt-6">
        <p>Properties Listed: <strong>56</strong></p>
        <p>Verified Properties: <strong>51</strong></p>
      </div>

      <div className="text-sm text-gray-400 mt-4">
        <strong>Localities:</strong> Jahangirabad, Jahangirpura, Palanpur, LP Savani
      </div>

      <div className="text-sm text-gray-400 mt-4">
        <strong>About Dealer:</strong><br />
        Founded in 2016, GJ5 Property specializes in residential and commercial properties in Surat.
      </div>

      <div className="text-sm text-gray-400 mt-4">
        <strong>Address:</strong> Palanpur, Surat, Gujarat
      </div>
    </div>

    {/* Enquiry Form */}
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Send Enquiry to Dealer</h2>

      <form className="space-y-4">
        <input type="text" placeholder="Name" className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white" />
        <input type="email" placeholder="Email" className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white" />
        <div className="flex gap-2">
          <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-white">
            <option>+91 IND</option>
          </select>
          <input type="tel" placeholder="Phone Number" className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white" />
        </div>
        <textarea placeholder="I am interested in this property." rows={4} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"></textarea>

        <div className="flex items-center gap-2 text-xs text-gray-300">
          <input type="checkbox" className="accent-yellow-400" />
          <span>I agree to Terms & Privacy</span>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">
          Send Email & SMS
        </button>
      </form>
    </div>
  </div>
);


const ExploreLocalityTab = () => (
  <div className="space-y-8">
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-white">Explore Jahangirabad</h2>
      <p className="text-gray-400">Surat | Pincode - 395005</p>
      <div className="flex gap-4 mt-2 flex-wrap">
        <span className="bg-green-500 text-xs text-white font-semibold px-2 py-1 rounded">#9 in Top 100 in Surat</span>
        <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded">↑ 1.4% YoY</span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* What's Great */}
      <div className="bg-[#12122d] border border-gray-700 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-bold text-white mb-2">👍 What's Great Here!</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>🏡 Mid-budget ready-to-move apartments</li>
          <li>🛣️ Good road connectivity via Ugat Road, Ambedkar Road</li>
          <li>🚉 8km from Surat Railway Station</li>
          <li>✈️ Airport accessible within 18 km</li>
        </ul>
      </div>

      {/* Needs Attention */}
      <div className="bg-[#12122d] border border-gray-700 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-bold text-white mb-2">👎 What Needs Attention!</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>🛠️ Some parks need better maintenance</li>
        </ul>
      </div>
    </div>
  </div>
);
const RecommendationsTab = () => (
  <div className="space-y-8">
    <h2 className="text-xl font-bold text-white">Similar Properties</h2>

    <div className="flex overflow-x-auto gap-4 pb-2">
      {[...Array(4)].map((_, idx) => (
        <div
          key={idx}
          className="w-64 min-w-[250px] bg-[#12122d] rounded-lg border border-gray-700 overflow-hidden shadow"
        >
          {/* Property Image */}
          <div className="relative h-40">
            <Image
              src="/placeholder.jpg"
              alt="Recommended Property"
              fill
              className="object-cover"
            />
            <div className="absolute top-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
              Owner • 5 Apr 2025
            </div>
          </div>

          {/* Property Info */}
          <div className="p-4 space-y-2">
            <p className="text-[#36b37e] font-bold">₹20,000, 2 BHK</p>
            <p className="text-gray-300 text-sm">Ankur Heights, Jahangirpura</p>
            <p className="text-gray-400 text-xs">Palanpur, Surat</p>

            <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold mt-3 py-1 rounded">
              Enquire Now
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);


export default PropertyDetailsPage;
