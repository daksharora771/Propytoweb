"use client";

import Image from "next/image";
import Link from "next/link";
import Propyro from "@/assets/images/icon_logo.png";
import { User, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [threshold, setThreshold] = useState(100);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      // Only trigger the hide/show behavior after scrolling past the threshold
      if (currentScrollY > threshold) {
        if (currentScrollY > lastScrollY) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }
      } else {
        // Always show header when near the top
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle the scroll event to improve performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          controlHeader();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [lastScrollY, threshold]);

  return (
    <header
      className={`py-2 z-50 fixed w-full backdrop-blur-xs transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      style={{
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between my-2">
          {/* Logo */}
          <div className="w-1/2 3xl:w-1/4 text-left">
            <div className="logo">
              <Link href="/">
                <Image
                  src={Propyro}
                  alt="logo"
                  width={74}
                  height={74}
                  className="block transition-transform duration-300 hover:scale-105 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
                  priority
                />
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="w-1/2 3xl:w-1/4 text-right flex justify-end items-center gap-6 relative">
            {/* List Property Button */}
            <Link 
              href="/list-property"
              className="py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-md font-medium transition-all duration-300 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Property</span>
            </Link>
            
            {/* Connect Wallet Button */}
            <ConnectButton />

            {/* User Icon */}
            <div className="relative">
              <div
                onClick={() => setDropdownOpen(dropdownOpen ? false : true)}
                onMouseEnter={() => setDropdownOpen(true)}
                className="cursor-pointer p-2 bg-[#FFD700] rounded-full text-black hover:bg-[#FFC300] transition-all duration-300 hover:shadow-lg"
              >
                <User className="w-6 h-6" />
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50 transform transition-all duration-300 ease-in-out"
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-left text-gray-200 hover:bg-[#FFD700]/20 hover:text-white transition-colors duration-200"
                  >
                    Profile Page
                  </Link>
                  <Link
                    href="/list-property"
                    className="block px-4 py-2 text-left text-gray-200 hover:bg-[#FFD700]/20 hover:text-white transition-colors duration-200"
                  >
                    List Property
                  </Link>
                  <Link
                    href="/mypropyto"
                    className="block px-4 py-2 text-left text-gray-200 hover:bg-[#FFD700]/20 hover:text-white transition-colors duration-200"
                  >
                    My Propyto
                  </Link>
                  <button
                    onClick={() => console.log("Logout clicked")}
                    className="w-full cursor-pointer text-left px-4 py-2 text-gray-200 hover:bg-[#FFD700]/20 hover:text-white transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
