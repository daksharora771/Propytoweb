"use client";

import { useState, useEffect } from "react";
import { Building2, BuildingIcon, Home, MapPin } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import ListingForm from "./ListingForm";
import SuccessPage from "./SuccessPage";

export default function ClientPage() {
  const [formStep, setFormStep] = useState(1);
  const [assetId, setAssetId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();

  // Only show the component after it has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-800 to-indigo-900 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-4">List Your Property</h1>
          <p className="text-lg text-blue-100 max-w-3xl">
            Tokenize your real estate asset on the blockchain and reach global investors. List your property in minutes.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 -mt-8">
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {/* Progress Indicators */}
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formStep >= 1 ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  <Home size={20} />
                </div>
                <span className="text-sm mt-1 text-gray-400">Connect</span>
              </div>
              <div className={`h-1 flex-1 mx-2 ${formStep >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formStep >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  <BuildingIcon size={20} />
                </div>
                <span className="text-sm mt-1 text-gray-400">Details</span>
              </div>
              <div className={`h-1 flex-1 mx-2 ${formStep >= 3 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formStep >= 3 ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  <MapPin size={20} />
                </div>
                <span className="text-sm mt-1 text-gray-400">Listing</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {!isConnected ? (
              <div className="py-16 text-center">
                <Building2 className="w-16 h-16 text-gray-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  To list your property, you need to connect your wallet first. This will allow you to sign the transaction.
                </p>
                <div className="flex justify-center">
                  <ConnectButton />
                </div>
              </div>
            ) : assetId ? (
              <SuccessPage assetId={assetId} />
            ) : (
              <ListingForm 
                onSuccess={(id: string) => {
                  setAssetId(id);
                  setFormStep(3);
                }}
                onStepChange={(step: number) => setFormStep(step)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 