'use client';

import React, { useState, useEffect } from 'react';
import { PropertyData } from '@/hooks/usePropertyDetails';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/lib/utils';
import { useChainId } from 'wagmi';
import { getExplorerLink } from '@/lib/utils';

interface PurchaseModalProps {
  property: PropertyData;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (shareCount?: number) => Promise<any>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  transactionHash?: string | null;
}

export function PurchaseModal({
  property,
  isOpen,
  onClose,
  onPurchase,
  isLoading,
  isSuccess,
  isError,
  error,
  transactionHash
}: PurchaseModalProps) {
  const [shareCount, setShareCount] = useState<number>(
    property.partialOwnership?.minSharePurchase 
      ? parseInt(property.partialOwnership?.minSharePurchase) 
      : 10
  );
  const [totalCost, setTotalCost] = useState<string>('0');
  const [isPurchasingEntireAsset, setIsPurchasingEntireAsset] = useState<boolean>(!property.isPartiallyOwnEnabled);
  // State to control error visibility
  const [showError, setShowError] = useState<boolean>(isError);
  const [inputValue, setInputValue] = useState<string>(
    property.partialOwnership?.minSharePurchase 
      ? property.partialOwnership.minSharePurchase 
      : '10'
  );
  
  // Auto-hide error after 5 seconds
  useEffect(() => {
    setShowError(isError);
    
    let errorTimer: NodeJS.Timeout;
    if (isError) {
      errorTimer = setTimeout(() => {
        setShowError(false);
      }, 5000); // 5 seconds
    }
    
    // Cleanup timer on unmount or when isError changes
    return () => {
      if (errorTimer) {
        clearTimeout(errorTimer);
      }
    };
  }, [isError]);
  
  // Debug log the property share price data
  useEffect(() => {
    if (property.partialOwnership) {
      console.debug("[PurchaseModal] Partial ownership data:", {
        sharePrice: property.partialOwnership.sharePrice,
        sharePriceAsNumber: Number(property.partialOwnership.sharePrice),
        formattedSharePrice: Number(property.partialOwnership.sharePrice).toFixed(6),
        totalShares: property.partialOwnership.totalShares,
        minShares: property.partialOwnership.minSharePurchase,
        maxShares: property.partialOwnership.maxSharesPerOwner
      });
    }
  }, [property]);
  
  // Calculate the total cost based on share count or full property price
  useEffect(() => {
    if (isPurchasingEntireAsset) {
      setTotalCost(parseFloat(property.formattedPrice).toString());
    } else if (property.partialOwnership) {
      const sharePrice = parseFloat(property.partialOwnership.sharePrice);
      const total = sharePrice * shareCount;
      
      console.debug("[PurchaseModal] Calculating total cost:", {
        sharePrice,
        shareCount,
        total,
        formattedTotal: total.toLocaleString(undefined, {
          minimumFractionDigits: 6,
          maximumFractionDigits: 6
        })
      });
      
      setTotalCost(total.toString());
    }
  }, [shareCount, isPurchasingEntireAsset, property]);
  
  // Reset the purchase mode when property changes
  useEffect(() => {
    setIsPurchasingEntireAsset(!property.isPartiallyOwnEnabled);
  }, [property]);
  
  // Handle share count input changes
  const handleShareCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Allow empty or numeric input
    if (rawValue === '' || /^\d+$/.test(rawValue)) {
      setInputValue(rawValue);
      
      // If there's a valid number, update the shareCount state
      if (rawValue !== '') {
        const numValue = parseInt(rawValue);
        setShareCount(numValue);
      }
    }
  };
  
  // Apply validation constraints when the input loses focus
  const handleShareCountBlur = () => {
    if (inputValue === '' || isNaN(parseInt(inputValue))) {
      // If empty or invalid, revert to minimum shares
      const minShares = property.partialOwnership?.minSharePurchase 
        ? parseInt(property.partialOwnership.minSharePurchase) 
        : 1;
      
      setInputValue(minShares.toString());
      setShareCount(minShares);
      return;
    }
    
    // Apply min/max constraints
    const numValue = parseInt(inputValue);
    const minShares = property.partialOwnership?.minSharePurchase 
      ? parseInt(property.partialOwnership.minSharePurchase) 
      : 1;
    
    const maxShares = property.partialOwnership?.availableShares 
      ? parseInt(property.partialOwnership.availableShares) 
      : 1000;
    
    // Constrain within limits
    if (numValue < minShares) {
      setInputValue(minShares.toString());
      setShareCount(minShares);
    } else if (numValue > maxShares) {
      setInputValue(maxShares.toString());
      setShareCount(maxShares);
    }
  };
  
  // Handle purchase action
  const handlePurchase = async () => {
    if (isPurchasingEntireAsset) {
      await onPurchase();
    } else {
      await onPurchase(shareCount);
    }
  };
  
  // Toggle between buying the entire asset and buying shares
  const togglePurchaseMode = () => {
    if (property.isPartiallyOwnEnabled) {
      setIsPurchasingEntireAsset(!isPurchasingEntireAsset);
    }
  };
  
  const chainId = useChainId();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#12122D] text-white border-gray-700 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {isPurchasingEntireAsset ? 'Purchase Property' : 'Purchase Shares'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isPurchasingEntireAsset
              ? 'You are purchasing the entire property'
              : 'Select how many shares you want to purchase'}
          </DialogDescription>
        </DialogHeader>
        
        {/* Property details */}
        <div className="py-4">
          <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg">
            <h3 className="font-medium text-white mb-2">{property.name}</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Property ID:</span>
              <span className="text-white">{property.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price:</span>
              <span className="text-white">${parseFloat(property.formattedPrice).toLocaleString()}</span>
            </div>
          </div>
          
          {/* Purchase type toggle */}
          {property.isPartiallyOwnEnabled && (
            <div className="mb-4 flex space-x-2">
              <button
                onClick={() => setIsPurchasingEntireAsset(true)}
                className={`h-9 px-3 text-sm inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none ${
                  isPurchasingEntireAsset 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "border border-gray-600 hover:bg-gray-700 text-gray-300"
                }`}
              >
                Buy Entire Property
              </button>
              <button
                onClick={() => setIsPurchasingEntireAsset(false)}
                className={`h-9 px-3 text-sm inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none ${
                  !isPurchasingEntireAsset 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "border border-gray-600 hover:bg-gray-700 text-gray-300"
                }`}
              >
                Buy Shares
              </button>
            </div>
          )}
          
          {/* Share selection for partial ownership */}
          {!isPurchasingEntireAsset && property.isPartiallyOwnEnabled && property.partialOwnership && (
            <div className="mb-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="shareCount" className="block text-sm font-medium text-gray-300">
                  Number of Shares
                </label>
                <Input
                  id="shareCount"
                  type="text"
                  value={inputValue}
                  onChange={handleShareCountChange}
                  onBlur={handleShareCountBlur}
                  disabled={isLoading || isSuccess}
                  className="bg-gray-800 border border-gray-700 text-white"
                />
                <p className="text-xs text-gray-400">
                  Min: {property.partialOwnership.minSharePurchase} shares | 
                  Available: {property.partialOwnership.availableShares} shares |
                  Price per share: ${Number(property.partialOwnership.sharePrice || "0").toFixed(6)} USDT
                </p>
              </div>
              
              <div className="flex justify-between p-2 bg-gray-800 rounded-md">
                <span className="text-sm text-gray-300">Share Count:</span>
                <span className="text-sm font-medium text-white">{shareCount}</span>
              </div>
            </div>
          )}
          
          {/* Total cost summary */}
          <div className="flex justify-between p-3 bg-gray-800 rounded-md mb-4">
            <span className="text-gray-300">Total Cost:</span>
            <span className="font-bold text-yellow-400">${parseFloat(totalCost).toLocaleString()}</span>
          </div>
          
          {/* Transaction status */}
          {isLoading && (
            <Alert className="mb-4 bg-blue-900/30 border-blue-500">
              <Loader2 className="h-4 w-4 animate-spin text-blue-400 mr-2" />
              <AlertDescription className="text-blue-200">
                Transaction in progress. Please wait and confirm in your wallet.
              </AlertDescription>
            </Alert>
          )}
          
          {isSuccess && (
            <div className="mb-4">
              <Alert className="bg-green-900/30 border-green-500 mb-2">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                <AlertDescription className="text-green-200">
                  {isPurchasingEntireAsset 
                    ? 'Property purchased successfully!' 
                    : `Successfully purchased ${shareCount} shares!`}
                </AlertDescription>
              </Alert>
              
              {transactionHash && (
                <div className="text-xs flex items-center justify-end gap-1 mt-1 text-blue-400">
                  <ExternalLink className="h-3 w-3" />
                  <a 
                    href={getExplorerLink(chainId || 80002, transactionHash, 'tx')} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-blue-300 transition-colors"
                  >
                    View Transaction
                  </a>
                </div>
              )}
            </div>
          )}
          
          {isError && showError && (
            <div className="mb-4 flex items-start space-x-2 text-xs bg-red-900/20 border border-red-500/50 rounded-md p-2 overflow-hidden">
              <AlertCircle className="h-3 w-3 text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-red-300 line-clamp-2 overflow-hidden text-ellipsis">
                {error?.message ? 
                  // Format the error message to be more readable
                  error.message
                    .replace(/\b([A-Z])/g, ' $1') // Add space before capital letters
                    .replace(/(error|exception|failed):/gi, '') // Remove common error prefixes
                    .trim()
                  : "Transaction failed. Please try again."}
              </span>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white inline-flex items-center justify-center rounded-md font-medium h-10 py-2 px-4 disabled:opacity-50 disabled:pointer-events-none"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={isLoading || isSuccess}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold inline-flex items-center justify-center rounded-md h-10 py-2 px-4 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : isPurchasingEntireAsset ? (
              'Buy Property'
            ) : (
              'Buy Shares'
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Export as default
export default PurchaseModal; 