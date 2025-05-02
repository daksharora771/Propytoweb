"use client";

import React from "react";
import { CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

interface SuccessPageProps {
  assetId: string;
}

export default function SuccessPage({ assetId }: SuccessPageProps) {
  return (
    <div className="max-w-3xl mx-auto py-10 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-500/20 p-6 mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Property Listed Successfully!</h1>
      
      <p className="text-gray-300 mb-8 max-w-lg mx-auto">
        Your property has been successfully listed on the blockchain. You can now view your property listing and track its status.
      </p>
      
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Asset ID:</span>
            <span className="font-semibold">{assetId}</span>
          </div>
          
          {/* <div className="border-t border-gray-700 pt-4">
            <a 
              href={`https://polygonscan.com/tx/${assetId}`} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 flex items-center justify-center hover:underline"
            >
              View on Blockchain <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div> */}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href={`/property/${assetId}`}
          className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          View Property
        </Link>
        
        <Link 
          href="/list-property"
          className="px-6 py-3 rounded-md bg-gray-700 hover:bg-gray-600 text-white font-medium"
        >
          List Another Property
        </Link>
      </div>
    </div>
  );
} 