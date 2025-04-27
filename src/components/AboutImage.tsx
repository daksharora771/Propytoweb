import React from "react";
import Image from "next/image";
import CoinImg from "@/assets/images/about.png"; // Use your uploaded image path

const AboutImage = () => {
  return (
    <div className="lg:w-1/2 w-full flex justify-center">
      <Image
        src={CoinImg}
        alt="Techmont Coin"
        className="max-w-xs 3xl:max-w-md lg:max-w-lg animate-pulse-slow"
        priority
      />
    </div>
  );
};

export default AboutImage;
