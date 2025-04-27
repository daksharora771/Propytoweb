import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const AboutContent = () => {
  return (
    <div className="lg:w-1/2 w-full space-y-6">
      <div className="bnrbtn !rounded-full">
        <div className="w-auto flex justify-center py-2 px-4 text-sm relative border-white rounded-full bg-gradient-to-b from-[#e5a526] to-[#b79249] ">
          About Us
        </div>
      </div>
      <h2 className="text-4xl 3xl:text-5xl font-extrabold leading-tight">
        Introducing <span className="text-[#e5a526]">Propyto</span> and our
        mission to revolutionize the real estate industry
      </h2>
      <p className="">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum."
      </p>
    </div>
  );
};

export default AboutContent;
