"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Mic,
  ChevronDown,
  CheckSquare,
  Square,
  PlusCircle,
  ArrowRight
} from "lucide-react";

const HeroSection = () => {
  const navItems = [
    { 
      icon: <PlusCircle className="w-4 h-4 mr-2" />, 
      name: "List Property", 
      description: "Tokenize your real estate",
      href: "/list-property" 
    }
  ];

  const [activeTab, setActiveTab] = useState("List Property");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const propertyTypes = [
    "Flat/Apartment",
    "Independent/Builder Floor",
    "Independent House/Villa",
    "Residential Land",
    "1 RK/ Studio Apartment",
    "Farm House",
    "Serviced Apartments",
    "Other",
  ];
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleCheckboxChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <section className="w-full mt-32 py-6 px-4 flex justify-center">
      <div className="hero-banner opacity-55"></div>
      <div className="w-full max-w-5xl">
        <div className="rounded-xl bg-gradient-to-b from-black/80 via-gray-900/90 to-black/80 p-4 3xl:p-6">
          {/* Simplified Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
              <span className="text-[#e5a526]">Tokenize</span> Your Property
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              List your real estate on the blockchain and enable fractional ownership through our secure tokenization platform
            </p>
          </div>

          {/* Tab - Single Option */}
          <div className="flex justify-center mb-6">
            <Link
              href="/list-property"
              className="inline-flex items-center px-8 py-4 border-2 border-[#e5a526] rounded-lg bg-gray-900/60 text-[#e5a526] font-semibold hover:bg-[#e5a526]/10 transition-all duration-300 transform hover:scale-105"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              <span>Start Listing Now</span>
            </Link>
          </div>

          {/* Search Area - Enhanced */}
          {/* <div className="bg-gradient-to-br from-black via-gray-900 to-black border border-[#b79249] rounded-xl p-4 3xl:p-6 backdrop-blur-sm">
            <div className="flex flex-col 3xl:flex-row 3xl:items-center gap-4 relative overflow-visible z-10">
             
              <div className="relative w-full 3xl:w-60 z-20" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-full bg-gray-900/80 text-blue-100 border border-[#b79249] rounded-md p-2.5 hover:bg-gray-800/90 transition-all duration-300 group"
                >
                  <span className="truncate pr-1 text-sm">
                    {selectedTypes.length > 0
                      ? `${selectedTypes.length} Selected`
                      : "All Property Types"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#e5a526] transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div
                    className="absolute left-0 top-full w-64 z-50 bg-gray-900/95 border border-[#b79249] rounded-b-md shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out p-4"
                  >
                    <div className="grid grid-cols-2 3xl:grid-cols-3 gap-x-4 gap-y-3">
                      {propertyTypes.map((type) => (
                        <label
                          key={type}
                          className="flex items-center space-x-2 cursor-pointer text-sm text-blue-100 hover:text-[#e5a526] transition-colors duration-200 group"
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={selectedTypes.includes(type)}
                            onChange={() => handleCheckboxChange(type)}
                          />
                          <div className="w-4 h-4 border border-[#b79249] rounded flex items-center justify-center group-hover:border-[#e5a526] transition-colors duration-200">
                            {selectedTypes.includes(type) && (
                              <CheckSquare className="w-3.5 h-3.5 text-[#e5a526]" />
                            )}
                          </div>
                          <span className="group-hover:text-[#e5a526]">{type}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#b79249]/30">
                      <span className="text-xs text-blue-300">
                        Looking for commercial properties?{" "}
                        <Link
                          href="/list-property?type=commercial"
                          className="text-[#e5a526] hover:text-[#b79249] hover:underline transition-colors duration-200"
                        >
                          Click here
                        </Link>
                      </span>
                      <button
                        onClick={() => {
                          setSelectedTypes([]);
                          setIsDropdownOpen(false);
                        }}
                        className="text-sm text-[#e5a526] hover:text-[#b79249] hover:underline transition-colors duration-200"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-grow relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-[#e5a526]" />
                </div>
                <input
                  type="search"
                  className="block w-full p-2.5 pl-10 text-sm text-blue-100 bg-gray-900 border border-blue-500/20 rounded-md focus:ring-amber-400 focus:border-amber-200 placeholder-[#e5a526] shadow-md"
                  placeholder="Search for your property location..."
                />
                <button
                  type="button"
                  className="hidden lg:flex absolute inset-y-0 right-12 items-center pr-3 text-[#e5a526] hover:text-[#b79249]"
                >
                  <MapPin className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="hidden lg:flex absolute inset-y-0 right-4 items-center pr-3 text-[#e5a526] hover:text-[#b79249]"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full 3xl:w-auto">
                <Link 
                  href="/list-property"
                  className="w-full 3xl:w-auto cursor-pointer flex items-center justify-center p-3 relative border-white rounded-lg bg-gradient-to-b from-[#bc9b54] to-[#b79249] hover:from-[#e5a526] hover:to-custom-dark-end text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <span className="mr-2">List Property</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
