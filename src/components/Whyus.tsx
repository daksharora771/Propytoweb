import React from "react";
import { ShieldCheck, Zap, Brain, Layers3 } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="w-10 h-10 text-[#e5a526]" />,
    title: "Trust Through Transparency",
    description:
      "Your property data is stored immutably on blockchain—no middlemen, no manipulation. Everything is verified, recorded, and secure.",
  },
  {
    icon: <Zap className="w-10 h-10 text-[#e5a526]" />,
    title: "Lightning-Fast Transactions",
    description:
      "Say goodbye to endless paperwork and delays. Propyto uses smart contracts for instant property deals with automatic verifications.",
  },
  {
    icon: <Brain className="w-10 h-10 text-[#e5a526]" />,
    title: "Smart Property Insights",
    description:
      "With AI-powered analytics and decentralized data, get smarter recommendations for your next buy, rent, or sell—all personalized to your needs.",
  },
  {
    icon: <Layers3 className="w-10 h-10 text-[#e5a526]" />,
    title: "All-In-One Ecosystem",
    description:
      "From buying to renting, listing to staking—Propyto offers a full suite of tools for every real estate goal, all in one seamless platform.",
  },
];

const WhyChoosePropyto = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl 3xl:text-5xl font-bold text-white">
          Why Choose <span className="text-[#e5a526]">Propyto?</span>
        </h2>
        <p className="mt-4 text-lg text-blue-200">
          A Revolutionized Real Estate Experience on Blockchain
        </p>

        <div className="grid gap-8 mt-12 3xl:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="
              bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 rounded-2xl shadow-lg border border-[#b79249] hover:shadow-[#e5a526]/50 transition-shadow"
            >
              <div className="mb-4 flex justify-center 3xl:justify-start">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#e5a526]">
                {feature.title}
              </h3>
              <p className="mt-2 text-blue-100 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoosePropyto;
