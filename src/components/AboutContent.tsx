import React from "react";

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
      <p className="mb-3">
      Real estate. Reimagined as NFTs. Fractional ownership, global access, true transparency. Buy, rent, or invest—right from your wallet. A smarter way to enter the property market is on its way.

      </p>
      <p className="">
      Every transaction on Propyto is secured by blockchain technology, creating an immutable record of ownership that can't be altered or disputed.
      </p>
    </div>
  );
};

export default AboutContent;
