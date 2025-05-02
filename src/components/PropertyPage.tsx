'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePropertyDetails, getAssetTypeName, getAssetStatusName, getAssetFurnishingName, getSubTypeName } from '@/hooks/usePropertyDetails';
import { BiArea, BiHomeAlt, BiCalendar, BiBuildings } from 'react-icons/bi';
import { MdOutlineBedroomParent, MdOutlineLocationOn, MdOutlineBathroom } from 'react-icons/md';
import { FaEthereum, FaShareAlt } from 'react-icons/fa';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { Skeleton } from '@/components/ui/skeleton';
import { DivideCircle, Loader2 } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import { formatAddress, getIPFSUrl, getExplorerLink, formatBlockchainDate } from '@/lib/utils';
import { CONTRACTS } from '@/config/contracts';
import { Toaster } from 'sonner';
import dynamic from 'next/dynamic';
import { CheckCircle } from 'lucide-react';

// Dynamically import the purchase modal to avoid SSR issues with dialog
const PurchaseModal = dynamic(() => import('@/components/PurchaseModal'), {
  ssr: false,
});

const tabs = [
  "Overview",
  "Partial Ownership",
  "Blockchain Info",
  "Contact Seller",
];

interface PropertyPageProps {
  propertyId: number;
}

// Add this component to display at the top of the property page for users who own shares
const OwnershipBanner = ({ property, userShares }: { property: any, userShares: string }) => {
  if (!userShares || userShares === "0") return null;
  
  const sharesPercentage = parseFloat(
    ((Number(userShares) / Number(property.partialOwnership.totalShares)) * 100).toFixed(2)
  );
  
  return (
    <div className="mb-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500 rounded-lg p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="bg-blue-500/30 p-2 rounded-full">
          <CheckCircle className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">You own shares in this property</h3>
          <p className="text-blue-300 text-sm">
            You currently own <span className="font-bold text-yellow-400">{userShares}</span> shares 
            ({sharesPercentage}% ownership)
          </p>
        </div>
      </div>
    </div>
  );
};

export function PropertyPage({ propertyId }: PropertyPageProps) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const { property, isLoading, isError, error, purchaseProperty, purchaseState } = usePropertyDetails(propertyId);
  const { address } = useAccount();
  const chainId = useChainId();
  
  // Handle loading state
  if (isLoading) {
    return <PropertySkeleton />;
  }
  
  // Handle error state
  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-4">Error Loading Property</h1>
          <p className="text-red-300 mb-4">{error?.message || "Failed to load property data from blockchain"}</p>
          <p className="text-gray-400">The property may not exist or there might be an issue with the blockchain connection.</p>
        </div>
      </div>
    );
  }
  
  // Handle not found
  if (!property) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-4">Property Not Found</h1>
          <p className="text-gray-400">The property you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }
  
  // Format values for display
  const formattedArea = parseInt(property.assetArea).toLocaleString();
  const amenities = property.assetAmenities.filter(Boolean);
  const features = property.assetFeatures.filter(Boolean);
  const expiryDate = formatBlockchainDate(property.listingExpiry);
  const shortExpiryDate = formatBlockchainDate(property.listingExpiry, { year: 'numeric', month: 'short', day: 'numeric' });
  const isPropertyOwner = address && typeof property.seller === 'string' && address.toLowerCase() === property.seller.toLowerCase();
  
  // Handle opening the purchase modal
  const handleOpenPurchaseModal = () => {
    if (!address) {
      // If not connected, show a message
      alert("Please connect your wallet to purchase property");
      return;
    }
    setIsPurchaseModalOpen(true);
  };
  
  // Handle the purchase action
  const handlePurchase = async (shareCount?: number) => {
    const result = await purchaseProperty(shareCount);
    
    // If successful, close the modal after a delay
    if (result.isSuccess) {
      setTimeout(() => {
        setIsPurchaseModalOpen(false);
      }, 3000); // Close after 3 seconds
    }
    
    return result;
  };
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Toast container */}
      <Toaster position="top-right" />
      
      {/* Ownership Banner */}
      {property.partialOwnership?.userShares && (
        <OwnershipBanner 
          property={property} 
          userShares={property.partialOwnership.userShares} 
        />
      )}
      
      {/* Purchase Modal */}
      {property && isPurchaseModalOpen && (
        <PurchaseModal
          property={property}
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          onPurchase={handlePurchase}
          isLoading={purchaseState.isLoading}
          isSuccess={purchaseState.isSuccess}
          isError={purchaseState.isError}
          error={purchaseState.error}
          transactionHash={purchaseState.transactionHash}
        />
      )}
      
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-4">
        Home / Properties / {getAssetTypeName(property.assetType)} / {property.name}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
        {/* Price & Basic Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <AiOutlineCheckCircle className="text-green-500" />
            <span className="text-2xl font-bold">${parseFloat(property.formattedPrice).toLocaleString()}</span>
            <span className="text-sm text-gray-500">
              {property.assetStatus === 0 ? "For Sale" : "For Rent"}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white">{property.name}</h1>
          <p className="text-gray-400 text-sm">
            {getSubTypeName(property.assetType, property.assetOtherDetails.subType)} in {property.assetOtherDetails.location}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {isPropertyOwner ? (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md">
              Edit Property
            </button>
          ) : (
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
              onClick={handleOpenPurchaseModal}
            >
              {purchaseState.isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Processing...
                </span>
              ) : (
                "Buy Now"
              )}
            </button>
          )}
          <button className="border border-blue-600 text-blue-600 hover:bg-blue-50/10 px-5 py-2 rounded-md">
            <FaShareAlt className="inline mr-1" /> Share
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <div className="flex overflow-x-auto gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? "border-yellow-400 text-yellow-400"
                  : "border-transparent text-gray-400"
              } font-medium text-sm`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Image and Info */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image */}
        <div className="w-full md:w-1/2 relative rounded-lg overflow-hidden shadow-lg">
          {property.assetImage ? (
            <Image
              src={getIPFSUrl(property.assetImage)}
              alt={property.name}
              width={600}
              height={400}
              className="object-cover w-full aspect-video"
            />
          ) : (
            <div className="w-full aspect-video bg-gray-800 flex items-center justify-center">
              <BiBuildings className="text-gray-600 text-5xl" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 text-center">
            Property #{property.id} • Available until {shortExpiryDate}
          </div>
        </div>

        {/* Info Card */}
        <div className="w-full md:w-1/2 bg-[#12122D] p-6 rounded-lg shadow-lg text-white space-y-4">
          {/* Configuration */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MdOutlineBedroomParent />
              <p className="text-sm">
                {property.assetOtherDetails.bedrooms} Bedrooms, {property.assetOtherDetails.bathrooms} Bathrooms
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">{getAssetStatusName(property.assetStatus)}</p>
              <p className="text-yellow-400 font-bold">${parseFloat(property.formattedPrice).toLocaleString()}</p>
            </div>
          </div>

          {/* Area */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BiArea />
              <p className="text-sm">Area: {formattedArea} sq ft</p>
            </div>
            <p className="text-xs text-gray-400">({(parseInt(property.assetArea) * 0.092903).toFixed(1)} sq.m)</p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MdOutlineLocationOn />
            <p className="text-sm">{property.assetLocation}</p>
          </div>

          {/* Furnishing */}
          <div className="flex items-center gap-2">
            <BiHomeAlt />
            <p className="text-sm">Furnishing: <span className="font-semibold">{getAssetFurnishingName(property.assetFurnishing)}</span></p>
          </div>

          {/* Age */}
          <div className="flex items-center gap-2">
            <BiCalendar />
            <p className="text-sm">Property Age: <span className="font-semibold">
              {typeof property.assetAge === 'object' 
                ? "Not Available" 
                : `${property.assetAge} years`}
            </span></p>
          </div>
          
          {/* Partial Ownership Badge */}
          {property.isPartiallyOwnEnabled && (
            <div className="mt-4 bg-blue-900/30 border border-blue-500 rounded-md p-3 flex items-center gap-3">
              <DivideCircle className="text-blue-400" />
              <div>
                <p className="text-blue-300 font-semibold">Fractional Ownership Available</p>
                <p className="text-xs text-gray-400">You can own a part of this property</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8 bg-[#12122D] p-6 rounded-lg shadow-lg text-white">
        {activeTab === "Overview" && (
          <OverviewTab property={property} />
        )}
        {activeTab === "Partial Ownership" && (
          <PartialOwnershipTab 
            property={property} 
            onPurchaseShares={handleOpenPurchaseModal} 
            isPropertyOwner={isPropertyOwner || false}
          />
        )}
        {activeTab === "Blockchain Info" && (
          <BlockchainInfoTab property={property} chainId={chainId} />
        )}
        {activeTab === "Contact Seller" && (
          <ContactSellerTab property={property} />
        )}
      </div>
    </div>
  );
}

const PropertySkeleton = () => (
  <div className="max-w-7xl mx-auto p-4">
    <Skeleton className="h-6 w-48 bg-gray-800 mb-6" />
    
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 bg-gray-800" />
        <Skeleton className="h-6 w-80 bg-gray-800" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32 bg-gray-800" />
        <Skeleton className="h-10 w-32 bg-gray-800" />
      </div>
    </div>
    
    <Skeleton className="h-10 w-full bg-gray-800 mb-6" />
    
    <div className="flex flex-col md:flex-row gap-8">
      <Skeleton className="w-full md:w-1/2 h-80 bg-gray-800 rounded-lg" />
      <div className="w-full md:w-1/2 space-y-4">
        <Skeleton className="h-12 w-full bg-gray-800 rounded-lg" />
        <Skeleton className="h-12 w-full bg-gray-800 rounded-lg" />
        <Skeleton className="h-12 w-full bg-gray-800 rounded-lg" />
        <Skeleton className="h-12 w-full bg-gray-800 rounded-lg" />
      </div>
    </div>
    
    <Skeleton className="h-96 w-full bg-gray-800 rounded-lg mt-8" />
  </div>
);

// Tab Components
const OverviewTab = ({ property }: { property: any }) => {
  return (
    <div className="space-y-8">
      {/* Property Description */}
      <Section title="About Property">
        <p className="text-sm text-gray-400">
          {property.assetDescription}
        </p>
        <p className="text-sm text-gray-400 mt-4">
          <strong>Address:</strong> {property.assetLocation}
        </p>
      </Section>
      
      {/* Property Details */}
      <Section title="Property Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
          <div><strong>Type:</strong> {getAssetTypeName(property.assetType)}</div>
          <div><strong>Subtype:</strong> {getSubTypeName(property.assetType, property.assetOtherDetails.subType)}</div>
          <div><strong>Status:</strong> {getAssetStatusName(property.assetStatus)}</div>
          <div><strong>Price:</strong> ${parseFloat(property.formattedPrice).toLocaleString()}</div>
          <div><strong>Bedrooms:</strong> {property.assetOtherDetails.bedrooms}</div>
          <div><strong>Bathrooms:</strong> {property.assetOtherDetails.bathrooms}</div>
          <div><strong>Area:</strong> {parseInt(property.assetArea).toLocaleString()} sq ft</div>
          <div><strong>Age:</strong> {property.assetAge} years</div>
          <div><strong>Furnishing:</strong> {getAssetFurnishingName(property.assetFurnishing)}</div>
          <div><strong>For Sale:</strong> {property.isSellable ? "Yes" : "No"}</div>
          <div><strong>For Rent:</strong> {property.isRentable ? "Yes" : "No"}</div>
          <div><strong>Partial Ownership:</strong> {property.isPartiallyOwnEnabled ? "Available" : "Not Available"}</div>
          <div><strong>Listing Expires:</strong> {formatBlockchainDate(property.listingExpiry)}</div>
          <div><strong>Property ID:</strong> {property.id}</div>
        </div>
      </Section>

      {/* Features & Amenities */}
      {(property.assetFeatures.length > 0 || property.assetAmenities.length > 0) && (
        <Section title="Features & Amenities">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {property.assetFeatures.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-3">Property Features</h3>
                <div className="space-y-2">
                  {property.assetFeatures.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                      <AiOutlineCheckCircle className="text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {property.assetAmenities.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-3">Amenities</h3>
                <div className="space-y-2">
                  {property.assetAmenities.map((amenity: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                      <AiOutlineCheckCircle className="text-green-500" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}
      
      {/* Floor Plan */}
      {property.assetFloorPlan && (
        <Section title="Floor Plan">
          <div className="bg-gray-800 p-4 rounded-lg">
            <Image
              src={getIPFSUrl(property.assetFloorPlan)}
              alt="Floor Plan"
              width={800}
              height={600}
              className="mx-auto object-contain max-h-[500px]"
            />
          </div>
        </Section>
      )}
    </div>
  );
};

const PartialOwnershipTab = ({ 
  property, 
  onPurchaseShares,
  isPropertyOwner
}: { 
  property: any; 
  onPurchaseShares: () => void;
  isPropertyOwner: boolean;
}) => {
  if (!property.isPartiallyOwnEnabled) {
    return (
      <div className="text-center py-12">
        <DivideCircle className="mx-auto text-gray-500 h-16 w-16 mb-4" />
        <h3 className="text-xl text-gray-400 font-medium">Partial Ownership Not Available</h3>
        <p className="text-gray-500 mt-2">This property is not configured for fractional ownership.</p>
      </div>
    );
  }
  
  // Check if user owns any shares
  const userOwnsShares = property.partialOwnership?.userShares && 
                        Number(property.partialOwnership.userShares) > 0;
  
  // Calculate ownership percentages
  const totalShares = Number(property.partialOwnership.totalShares);
  const soldShares = Number(property.partialOwnership.soldShares || 0);
  const availableShares = Number(property.partialOwnership.availableShares);
  const sellerShares = Number(property.partialOwnership.sellerShares);
  const userShares = Number(property.partialOwnership.userShares || 0);
  
  // Calculate percentages
  const soldPercentage = ((soldShares / totalShares) * 100).toFixed(1);
  const availablePercentage = ((availableShares / totalShares) * 100).toFixed(1);
  const sellerPercentage = ((sellerShares / totalShares) * 100).toFixed(1);
  const userPercentage = userShares > 0 ? ((userShares / totalShares) * 100).toFixed(2) : "0";
  
  return (
    <div className="space-y-8">
      <Section title="Fractional Ownership Information">
        <div className="mb-6">
          <p className="text-gray-400 mb-4">
            This property supports fractional ownership, allowing multiple investors to own
            portions of the property as tokenized shares.
          </p>
          
          {userOwnsShares && (
            <div className="mb-4 bg-blue-900/20 border border-blue-500 p-3 rounded-md">
              <p className="text-blue-300">
                <span className="font-semibold">You own {property.partialOwnership.userShares} shares</span> of this property, 
                representing <span className="font-semibold text-yellow-400">{userPercentage}%</span> of the total ownership.
              </p>
            </div>
          )}
        </div>
        
        {/* Ownership Distribution Visualization */}
        <div className="mb-6">
          <h3 className="text-white text-sm font-medium mb-2">Ownership Distribution</h3>
          <div className="h-6 w-full bg-gray-800 rounded-full overflow-hidden flex">
            <div 
              className="bg-blue-600 h-full flex items-center justify-center text-xs text-white"
              style={{ width: `${userPercentage}%` }}
              title={`Your Shares: ${userShares} (${userPercentage}%)`}
            >
              {Number(userPercentage) > 5 ? `You: ${userPercentage}%` : ""}
            </div>
            <div 
              className="bg-purple-600 h-full flex items-center justify-center text-xs text-white"
              style={{ width: `${soldPercentage}%` }}
              title={`Other Owners: ${soldShares - userShares} (${(soldShares - userShares) / totalShares * 100}%)`}
            >
              {Number(soldPercentage) > 10 ? `Others: ${((soldShares - userShares) / totalShares * 100).toFixed(1)}%` : ""}
            </div>
            <div 
              className="bg-amber-600 h-full flex items-center justify-center text-xs text-white"
              style={{ width: `${sellerPercentage}%` }}
              title={`Seller Reserved: ${sellerShares} (${sellerPercentage}%)`}
            >
              {Number(sellerPercentage) > 10 ? `Seller: ${sellerPercentage}%` : ""}
            </div>
            <div 
              className="bg-green-600 h-full flex items-center justify-center text-xs text-white"
              style={{ width: `${availablePercentage}%` }}
              title={`Available: ${availableShares} (${availablePercentage}%)`}
            >
              {Number(availablePercentage) > 10 ? `Available: ${availablePercentage}%` : ""}
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Your Shares</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Other Investors</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
              <span>Seller Reserved</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>Available</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">Share Structure</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between">
                <span>Total Shares:</span>
                <span className="font-semibold">{parseInt(property.partialOwnership.totalShares).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Available Shares:</span>
                <span className="font-semibold">{parseInt(property.partialOwnership.availableShares).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Sold Shares:</span>
                <span className="font-semibold">{parseInt(property.partialOwnership.soldShares || "0").toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Share Price:</span>
                <span className="font-semibold">${parseFloat(property.partialOwnership.sharePrice).toLocaleString()} USDT</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">Purchase Rules</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between">
                <span>Minimum Purchase:</span>
                <span className="font-semibold">{property.partialOwnership.minSharePurchase} shares</span>
              </div>
              <div className="flex justify-between">
                <span>Maximum Per Owner:</span>
                <span className="font-semibold">
                  {property.partialOwnership.maxSharesPerOwner === "0" 
                    ? "No limit" 
                    : `${property.partialOwnership.maxSharesPerOwner} shares`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Seller Reserved:</span>
                <span className="font-semibold">{property.partialOwnership.sellerShares} shares</span>
              </div>
              {userOwnsShares && (
                <div className="flex justify-between pt-2 border-t border-gray-700">
                  <span>Your Shares:</span>
                  <span className="font-semibold text-yellow-400">{property.partialOwnership.userShares} shares</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          {!isPropertyOwner && (
            <button 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-lg"
              onClick={onPurchaseShares}
            >
              {userOwnsShares ? "Buy More Shares" : "Purchase Shares"}
            </button>
          )}
        </div>
      </Section>
      
      {property.partialOwnership.owners && property.partialOwnership.owners.length > 0 && (
        <Section title="Current Owners">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3">Owner Address</th>
                  <th className="px-4 py-3 text-right">Ownership %</th>
                </tr>
              </thead>
              <tbody>
                {property.partialOwnership.owners.map((owner: string, index: number) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="px-4 py-3 font-medium text-white">
                      {formatAddress(owner)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {/* Placeholder percentage since we don't have this data yet */}
                      <span className="text-gray-400">Calculating...</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}
    </div>
  );
};

const BlockchainInfoTab = ({ property, chainId }: { property: any, chainId?: number }) => {
  return (
    <div className="space-y-8">
      <Section title="Blockchain Details">
        <div className="space-y-6">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">Property On-Chain Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div><strong>Asset ID:</strong> {property.id}</div>
              <div><strong>Blockchain:</strong> Polygon {chainId === 137 ? "Mainnet" : "Testnet"}</div>
              <div>
                <strong>Seller Address:</strong>
                <div className="text-blue-400 overflow-hidden text-ellipsis">
                  <a 
                    href={chainId ? getExplorerLink(chainId, property.seller, 'address') : '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {property.seller}
                  </a>
                </div>
              </div>
              <div>
                <strong>Contract Address:</strong>
                <div className="text-blue-400 overflow-hidden text-ellipsis">
                  <a 
                    href={chainId ? getExplorerLink(chainId, CONTRACTS.propytoRegistry, 'address') : '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {CONTRACTS.propytoRegistry}
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {property.isPartiallyOwnEnabled && (
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaEthereum className="text-purple-400" />
                <h3 className="font-medium text-white">Tokenization Details</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                This property has been tokenized with ERC-1155 standard for fractional ownership.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Token Standard:</span>
                  <span>ERC-1155</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Total Supply:</span>
                  <span>{property.partialOwnership?.totalShares || "N/A"}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Token Address:</span>
                  <span className="text-blue-400">{property.assetAddress !== "0x0000000000000000000000000000000000000000" ? property.assetAddress : "Pending Deployment"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
      
      <Section title="Property Verification">
        <div className="p-4 bg-green-900/20 border border-green-600 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <AiOutlineCheckCircle className="text-green-500 text-2xl" />
            <h3 className="text-lg font-medium text-green-400">Blockchain Verified</h3>
          </div>
          <p className="text-sm text-gray-400">
            This property listing is verified on the blockchain and all ownership transfers
            are securely recorded. The listing will expire on {formatBlockchainDate(property.listingExpiry)}.
          </p>
        </div>
      </Section>
    </div>
  );
};

const ContactSellerTab = ({ property }: { property: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
    {/* Seller Profile */}
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Seller Details</h2>

      <div className="flex flex-col items-center space-y-4">
        <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center">
          <span className="text-2xl text-white font-bold">
            {property.seller.substring(2, 4).toUpperCase()}
          </span>
        </div>
        <div className="text-center">
          <h3 className="text-blue-400 text-lg font-semibold">Property Owner</h3>
          <p className="text-sm text-gray-400 mt-1 break-all">{property.seller}</p>
        </div>

        <button className="bg-green-500 text-white font-bold px-6 py-2 rounded-md mt-2">
          View Phone Number
        </button>
      </div>

      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="font-medium text-white mb-2">Property Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Property:</span>
            <span className="text-white">{property.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Price:</span>
            <span className="text-white">${parseFloat(property.formattedPrice).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Location:</span>
            <span className="text-white">{property.assetOtherDetails.location}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Enquiry Form */}
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Send Enquiry to Seller</h2>

      <form className="space-y-4">
        <input type="text" placeholder="Name" className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white" />
        <input type="email" placeholder="Email" className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white" />
        <div className="flex gap-2">
          <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-white">
            <option>+1 USA</option>
            <option>+44 UK</option>
            <option>+91 IND</option>
          </select>
          <input type="tel" placeholder="Phone Number" className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white" />
        </div>
        <textarea placeholder={`I am interested in ${property.name} (ID: ${property.id}). Please contact me with more information.`} rows={4} className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"></textarea>

        <div className="flex items-center gap-2 text-xs text-gray-300">
          <input type="checkbox" className="accent-yellow-400" />
          <span>I agree to Terms & Privacy</span>
        </div>

        <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">
          Send Message
        </button>
      </form>
    </div>
  </div>
);

// Utility components
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-[#0f172a] p-6 rounded-lg shadow space-y-4">
    <h2 className="text-lg font-bold text-white">{title}</h2>
    {children}
  </div>
); 