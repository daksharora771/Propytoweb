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
} from "lucide-react";
import Button from "./ui/Button";
import Buy from "@/assets/images/buy.jpg";
import Rent from "@/assets/images/rent.jpg";
import Sell from "@/assets/images/sell.jpg";

const HeroSection = () => {
  const navItems = [
    {icons:Buy, name: "Buy", href: "/buy" },
    { icons:Rent,name: "Rent", href: "/rent" },
    { icons:Sell,name: "Sell", href: "/sell" },
  ];

  const [activeTab, setActiveTab] = useState("Buy");
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
      <div className="hero-banner"></div>
    <div className="w-full max-w-5xl">
      <div className="rounded-xl overflow-hidden bg-gradient-to-b from-black/80 via-gray-900/90 to-black/80 p-4 3xl:p-6">
        {/* Tabs */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-t-lg border-b border-[#b79249] px-4 3xl:px-6 pt-2">
          <nav>
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
              {navItems.map((item) => (
                <li key={item.name} className="mr-2 flex">
                  <Link
                    href={item.href}
                    onClick={() => setActiveTab(item.name)}
                    className={`inline-block p-4 border-b-2 rounded-t-lg transition-colors duration-300 ${
                      activeTab === item.name
                        ? "text-[#e5a526] border-[#e5a526] font-semibold"
                        : "text-gray-400 border-transparent hover:text-[#e5a526] hover:border-[#e5a526]"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
  
        {/* Search Area */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-black border border-[#b79249] rounded-b-xl p-4 3xl:p-6 mt-1 backdrop-blur-sm">
          <div className="flex flex-col 3xl:flex-row 3xl:items-center gap-4">
            {/* Dropdown */}
            <div className="relative w-full 3xl:w-60" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full bg-gray-900 text-blue-100 border border-[#b79249] rounded-md p-2.5 hover:bg-gray-800 transition"
              >
                <span className="truncate pr-1">
                  {selectedTypes.length > 0
                    ? `${selectedTypes.length} Selected`
                    : "All Residential"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#e5a526] transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
  
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full z-50 3xl:w-[600px] bg-gray-900 border border-blue-500/20 rounded-md shadow-xl p-4">
                  <div className="grid grid-cols-2 3xl:grid-cols-3 gap-x-4 gap-y-2">
                    {propertyTypes.map((type) => (
                      <label
                        key={type}
                        className="flex items-center space-x-2 cursor-pointer text-sm text-blue-100 hover:text-[#b79249]"
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={selectedTypes.includes(type)}
                          onChange={() => handleCheckboxChange(type)}
                        />
                        {selectedTypes.includes(type) ? (
                          <CheckSquare className="w-4 h-4 text-[#e5a526]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#b79249]" />
                        )}
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-blue-500/20">
                    <span className="text-xs text-blue-300">
                      Looking for commercial properties?{" "}
                      <Link
                        href="/commercial"
                        className="text-[#e5a526] hover:underline"
                      >
                        Click here
                      </Link>
                    </span>
                    <button
                      onClick={() => {
                        setSelectedTypes([]);
                        setIsDropdownOpen(false);
                      }}
                      className="text-sm text-[#e5a526] hover:text-[#b79249] hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
  
            {/* Search Input */}
            <div className="flex-grow relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-[#e5a526]" />
              </div>
              <input
                type="search"
                className="block w-full p-2.5 pl-10 text-sm text-blue-100 bg-gray-900 border border-blue-500/20 rounded-md focus:ring-amber-400 focus:border-amber-200 placeholder-[#e5a526] shadow-md"
                placeholder="Search Location or Property..."
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
  
            {/* Search Button */}
            <div className="w-full 3xl:w-auto">
              <Button label="Search" onClick={() => ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  );
};

export default HeroSection;
