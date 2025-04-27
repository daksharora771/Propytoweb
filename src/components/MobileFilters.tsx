'use client'
import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiSearch } from 'react-icons/fi';

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  setFilters: (filters: any) => void;
}

export default function MobileFilters({ isOpen, onClose, filters, setFilters }: MobileFiltersProps) {
  const [activeSection, setActiveSection] = useState('Quick Filters');

  const sections = [
    'Quick Filters',
    'Budget',
    'Property Type',
    'BHK',
    'Bathrooms',
    'Size',
    'Possession Status',
    'New Booking / Resale',
    'Amenities & Facilities',
    'Localities',
    'Builders',
    'Projects',
    'Floor Preference',
    'Facing Direction',
    'Property Features',
    'Posted By',
    'Photos',
    'Videos',
    'Furnishing Status',
    'RERA Approved'
  ];

  const quickFilters = [
    { label: 'Verified Properties', info: true },
    { label: 'New Launches' },
    { label: 'Gated Society' },
    { label: 'Zero Brokerage' },
    { label: 'With Photos' }
  ];

  const propertyTypes = [
    'Residential Apartment',
    'Independent House/Villa',
    'Residential Land',
    'Independent/Builder Floor',
    'Farm House',
    '1 RK/ Studio Apartment'
  ];

  const bhkTypes = [
    '1 RK/1 BHK',
    '2 BHK',
    '3 BHK',
    '4 BHK',
    '4+ BHK'
  ];

  const renderFilterContent = () => {
    switch (activeSection) {
      case 'Quick Filters':
        return (
          <div className="space-y-4">
            {quickFilters.map((filter) => (
              <label key={filter.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-600 rounded"
                  />
                  <span>{filter.label}</span>
                </div>
                {filter.info && (
                  <span className="text-gray-400">ⓘ</span>
                )}
              </label>
            ))}
          </div>
        );

      case 'Budget':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Budget Range</span>
              <span className="text-gray-600">INR - ₹</span>
            </div>
            <div className="flex gap-4 items-center">
              <select className="flex-1 p-2 border rounded">
                <option>0</option>
              </select>
              <span>to</span>
              <select className="flex-1 p-2 border rounded">
                <option>100+ Cr</option>
              </select>
            </div>
            <div className="relative pt-6">
              <div className="h-1 bg-blue-600 rounded"></div>
              <div className="absolute top-0 left-1/2 w-4 h-4 bg-blue-600 rounded-full -translate-x-1/2"></div>
            </div>
          </div>
        );

      case 'Property Type':
        return (
          <div className="space-y-4">
            {propertyTypes.map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-600 rounded"
                />
                <span>{type}</span>
              </label>
            ))}
            <button className="text-blue-600">Select All</button>
          </div>
        );

      case 'BHK':
        return (
          <div className="space-y-4">
            {bhkTypes.map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-600 rounded"
                />
                <span>{type}</span>
              </label>
            ))}
            <button className="text-blue-600">Select All</button>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute bottom-0 w-full bg-white rounded-t-xl pointer-events-auto max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium">Filters</h2>
            <button onClick={onClose}>
              <IoClose className="text-2xl" />
            </button>
          </div>

          <div className="flex h-[calc(90vh-60px)]">
            {/* Left Sidebar */}
            <div className="w-1/3 border-r overflow-y-auto">
              {sections.map((section) => (
                <button
                  key={section}
                  className={`w-full p-4 text-left ${
                    activeSection === section
                      ? 'bg-blue-50 border-l-4 border-blue-600'
                      : ''
                  }`}
                  onClick={() => setActiveSection(section)}
                >
                  {section}
                </button>
              ))}
            </div>

            {/* Right Content */}
            <div className="w-2/3 p-4 overflow-y-auto">
              {renderFilterContent()}
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 w-full p-4 border-t bg-white">
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-md font-medium"
              onClick={onClose}
            >
              See All 4.3K Properties
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 