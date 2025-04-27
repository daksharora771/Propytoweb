"use client";

import Image from "next/image";
import Propyro from "@/assets/images/propyto.jpg";
import Button from "./ui/Button";
import { User } from "lucide-react"; // 👈 Importing User icon
import { useState } from "react";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="py-2 z-50 relative">
      <div className="container mx-auto">
        <div className="flex items-center justify-between my-2">
          {/* Logo */}
          <div className="w-1/2 3xl:w-1/4 text-left">
            <div className="logo">
              <a href="/">
                <Image
                  src={Propyro}
                  alt="logo"
                  width={64}
                  height={64}
                  className="block"
                  priority
                />
              </a>
            </div>
          </div>

          {/* Right side */}
          <div className="w-1/2 3xl:w-1/4 text-right flex justify-end items-center gap-4 relative">
            {/* Connect Wallet Button */}
            <Button label="Connect Wallet" onClick={() => ""} />

            {/* User Icon */}
            <div className="relative">
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
                className="cursor-pointer p-2 bg-[#FFD700] rounded-full text-black hover:bg-[#FFC300]"
              >
                <User className="w-6 h-6" />
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50"
                >
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-left text-gray-200 hover:bg-[#FFD700]/20 hover:text-white"
                  >
                    Profile Page
                  </a>
                  <a
                    href="/mypropyto"
                    className="block px-4 py-2 text-left text-gray-200 hover:bg-[#FFD700]/20 hover:text-white"
                  >
                    My Propyto
                  </a>
                  <button
                    onClick={() => console.log("Logout clicked")}
                    className="w-full text-left px-4 py-2 text-gray-200 hover:bg-[#FFD700]/20 hover:text-white"
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
