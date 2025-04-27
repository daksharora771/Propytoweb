"use client";

import React from "react";
import AboutContent from "./AboutContent";
import AboutImage from "./AboutImage";

const AboutSection = () => {
  return (
    <section className="w-full bg-black text-white py-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-10">
        <AboutContent />
        <AboutImage />
      </div>
    </section>
  );
};

export default AboutSection;
