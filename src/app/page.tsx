// import Image from "next/image";
// import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import RecommendedProperties from "@/components/RecommendedProperties";
import AboutSection from "@/components/AboutSection";
import WhyChoosePropyto from "@/components/Whyus";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <RecommendedProperties />
      <AboutSection />
      <WhyChoosePropyto />
      <Footer />
    </div>
  );
}
