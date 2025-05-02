import { useState, useEffect, useCallback, useMemo } from 'react';
import { useReadContract, useChainId, useClient, usePublicClient, useWalletClient, useWriteContract, useAccount } from 'wagmi';
import { PropytoRegistryABI } from '@/config/abis/PropytoRegistry';
import { ERC20ABI } from '@/config/abis/ERC20ABI';
import { CONTRACTS, DEFAULT_CHAIN_ID } from '@/config/contracts';
import { formatUnits, parseUnits } from 'ethers';
import { AssetType, AssetStatus, AssetFurnishing, AssetZone } from './useProptyo';
import { toast } from 'sonner';

// Property data interface with all property details
export interface PropertyData {
  // Basic information
  id: number;
  name: string;
  assetType: AssetType;
  assetAddress: string;
  assetStatus: AssetStatus;
  assetFurnishing: AssetFurnishing;
  assetZone: AssetZone;
  assetPrice: string;
  formattedPrice: string;
  assetArea: string;
  assetAge: string;
  assetOtherDetails: {
    subType: number;
    bedrooms: string;
    bathrooms: string;
    location: string;
  };
  isRentable: boolean;
  isSellable: boolean;
  isPartiallyOwnEnabled: boolean;
  seller: string;
  listingExpiry: number;
  
  // Metadata
  assetDescription: string;
  assetFeatures: string[];
  assetAmenities: string[];
  assetLocation: string;
  
  // Media
  assetImage: string;
  assetVideo: string;
  assetFloorPlan: string;
  
  // Partial ownership data (if enabled)
  partialOwnership?: {
    totalShares: string;
    availableShares: string;
    sharePrice: string;
    minSharePurchase: string;
    maxSharesPerOwner: string;
    sellerShares: string;
    owners: string[];
    soldShares: string;
    userShares?: string; // Optional field for current user's shares
  };
}

export interface PartialOwnershipConfig {
  totalShares: bigint;
  sharePrice: bigint;
  minSharePurchase: bigint;
  maxSharesPerOwner: bigint;
  sellerShares: bigint;
  availableShares: bigint;
}

export interface PurchaseResult {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  transactionHash: string | null;
  reset: () => void;
}

export interface UsePropertyDetailsResult {
  property: PropertyData | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  purchaseProperty: (shareCount?: number) => Promise<PurchaseResult>;
  purchaseState: PurchaseResult;
}

// Add a logging utility that works with any type
const safeLog = (
  message: string, 
  obj: any, 
  level: 'debug' | 'info' | 'warn' | 'error' = 'debug'
): void => {
  try {
    // Convert BigInts to strings for safe logging
    const safeObj = JSON.parse(
      JSON.stringify(obj, (_, value) => 
        typeof value === 'bigint' ? value.toString() : value
      )
    );
    
    if (level === 'debug') console.debug(message, safeObj);
    else if (level === 'info') console.info(message, safeObj);
    else if (level === 'warn') console.warn(message, safeObj);
    else if (level === 'error') console.error(message, safeObj);
  } catch (e) {
    console.error(`Error logging ${message}:`, e);
    console.log(message, 'Object could not be logged safely.');
  }
};

export function usePropertyDetails(propertyId: number): UsePropertyDetailsResult {
  // Read states
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  
  // Purchase states
  const [purchaseState, setPurchaseState] = useState<PurchaseResult>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    transactionHash: null,
    reset: () => setPurchaseState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      transactionHash: null,
      reset: () => {}
    })
  });
  
  const chainId = useChainId() || DEFAULT_CHAIN_ID;
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address: userAddress } = useAccount();
  
  // For writing to contract
  const { writeContractAsync: writeContract } = useWriteContract();
  
  // Log initialization information
  useEffect(() => {
    console.debug("[PropertyDetails] Hook initialized:", {
      propertyId,
      chainId,
      registryContract: CONTRACTS.propytoRegistry,
      publicClientConnected: !!publicClient,
      currentChainId: chainId
    });
    
    // Validate contract address
    if (!CONTRACTS.propytoRegistry || CONTRACTS.propytoRegistry === '0x0000000000000000000000000000000000000000') {
      console.error("[PropertyDetails] Invalid contract address:", CONTRACTS.propytoRegistry);
      setIsError(true);
      setError(new Error("Invalid contract address configuration"));
      setIsLoading(false);
    }
  }, [propertyId, chainId, publicClient]);
  
  // Get main asset data
  const { 
    data: assetData,
    isError: isAssetError,
    error: assetError
  } = useReadContract({
    address: CONTRACTS.propytoRegistry as `0x${string}`,
    abi: PropytoRegistryABI,
    functionName: 'assets',
    args: propertyId !== undefined && propertyId !== null && !isNaN(propertyId) ? [BigInt(propertyId)] : undefined,
    query: {
      enabled: propertyId !== undefined && propertyId !== null && !isNaN(propertyId)
    },
    chainId
  });
  
  // Get asset metadata
  const { 
    data: metadataData,
    isError: isMetadataError,
    error: metadataError
  } = useReadContract({
    address: CONTRACTS.propytoRegistry as `0x${string}`,
    abi: PropytoRegistryABI,
    functionName: 'assetMetadata',
    args: propertyId !== undefined && propertyId !== null && !isNaN(propertyId) ? [BigInt(propertyId)] : undefined,
    query: {
      enabled: propertyId !== undefined && propertyId !== null && !isNaN(propertyId)
    },
    chainId
  });
  
  // Get asset media
  const { 
    data: mediaData,
    isError: isMediaError,
    error: mediaError
  } = useReadContract({
    address: CONTRACTS.propytoRegistry as `0x${string}`,
    abi: PropytoRegistryABI,
    functionName: 'assetMedia',
    args: propertyId !== undefined && propertyId !== null && !isNaN(propertyId) ? [BigInt(propertyId)] : undefined,
    query: {
      enabled: propertyId !== undefined && propertyId !== null && !isNaN(propertyId)
    },
    chainId
  });
  
  // Get asset owners if partial ownership is enabled
  const {
    data: assetOwners,
    isError: isOwnersError,
    error: ownersError 
  } = useReadContract({
    address: CONTRACTS.propytoRegistry as `0x${string}`,
    abi: PropytoRegistryABI,
    functionName: 'getAssetOwners',
    args: propertyId !== undefined && propertyId !== null && !isNaN(propertyId) ? [BigInt(propertyId)] : undefined,
    query: {
      enabled: (propertyId !== undefined && propertyId !== null && !isNaN(propertyId)) && 
               (assetData ? (Array.isArray(assetData) ? assetData[12] : false) : false)
    },
    chainId
  });
  
  // Get shares owned by current user (if connected)
  const { 
    data: userShares,
    isError: isUserSharesError,
    error: userSharesError 
  } = useReadContract({
    address: CONTRACTS.propytoRegistry as `0x${string}`,
    abi: PropytoRegistryABI,
    functionName: 'getSharesOwned',
    args: propertyId !== undefined && propertyId !== null && !isNaN(propertyId) && userAddress
      ? [BigInt(propertyId), userAddress] 
      : undefined,
    query: {
      enabled: (propertyId !== undefined && propertyId !== null && !isNaN(propertyId)) && 
               (assetData ? (Array.isArray(assetData) ? assetData[12] : false) : false) &&
               !!userAddress
    },
    chainId
  });
  
  // Since there's no direct partialOwnershipConfig function in the contract,
  // we need to fetch individual components of the partial ownership data
  const [partialOwnershipData, setPartialOwnershipData] = useState<PartialOwnershipConfig | null>(null);
  
  // Fetch shares data from contract if partial ownership is enabled
  useEffect(() => {
    const fetchPartialOwnershipData = async () => {
      const isPartiallyOwnEnabled = Array.isArray(assetData) ? assetData[12] : false;
      if (!assetData || !isPartiallyOwnEnabled || !publicClient) {
        console.debug("[PropertyDetails] Skipping partial ownership data - not enabled or missing data");
        return;
      }
      
      try {
        console.debug("[PropertyDetails] Attempting to fetch partial ownership data");
        
        // Get shares owned by the seller to calculate available shares
        // This approximates the logic used in the contract's enablePartialOwnership function
        const sellerValue = Array.isArray(assetData) ? assetData[13] : null;
        // Check if seller is a valid Ethereum address (0x followed by 40 hex chars)
        const isValidAddress = typeof sellerValue === 'string' && 
                              /^0x[a-fA-F0-9]{40}$/.test(sellerValue);
        
        console.debug("[PropertyDetails] Seller address validation:", {
          sellerValue,
          isValidAddress,
          type: typeof sellerValue
        });
        
        if (!isValidAddress) {
          console.warn("[PropertyDetails] Invalid seller address:", sellerValue);
          // Create partial ownership data with no seller shares
          const defaultObject = {
            totalShares: BigInt(1000),
            sharePrice: BigInt(0),
            minSharePurchase: BigInt(10),
            maxSharesPerOwner: BigInt(0),
            sellerShares: BigInt(0),
            availableShares: BigInt(1000)
          };
          setPartialOwnershipData(defaultObject);
          return;
        }
        
        const seller = sellerValue as string;
        const sellerShares = await publicClient.readContract({
          address: CONTRACTS.propytoRegistry as `0x${string}`,
          abi: PropytoRegistryABI,
          functionName: 'getSharesOwned',
          args: [BigInt(propertyId), seller],
        });
        
        // Get the total price and calculate share price
        const assetPrice = Array.isArray(assetData) ? assetData[6] : BigInt(0);
        
        console.debug("[PropertyDetails] Asset price raw:", {
          assetPrice,
          type: typeof assetPrice,
          assetPriceString: assetPrice?.toString()
        });
        
        // Default to 1000 total shares if we can't determine the actual amount
        const defaultTotalShares = BigInt(1000);
        
        // Calculate share price - ensure we're doing proper BigInt division
        let sharePrice;
        if (assetPrice && typeof assetPrice === 'bigint' && assetPrice > 0) {
          sharePrice = assetPrice / defaultTotalShares;
          console.debug("[PropertyDetails] Share price calculation successful:", {
            assetPrice: assetPrice.toString(),
            totalShares: defaultTotalShares.toString(),
            sharePrice: sharePrice.toString()
          });
        } else {
          // Default to a small amount if asset price is unavailable
          sharePrice = BigInt("1000000000000000"); // 0.001 with 18 decimals
          console.warn("[PropertyDetails] Could not calculate share price, using default:", {
            assetPrice: assetPrice?.toString() || "undefined",
            defaultSharePrice: sharePrice.toString()
          });
        }
        
        console.debug("[PropertyDetails] Calculated partial ownership data:", {
          assetPrice: assetPrice.toString(),
          sellerShares: sellerShares ? sellerShares.toString() : '0',
          sharePrice: sharePrice.toString(),
          formattedSharePrice: formatUnits(sharePrice, 18)
        });
        
        // Construct partial ownership data with reasonable defaults
        // This approximates what would be returned by a partialOwnershipConfig function
        setPartialOwnershipData({
          totalShares: defaultTotalShares,
          sharePrice: sharePrice,
          minSharePurchase: BigInt(10),  // Default minimum purchase
          maxSharesPerOwner: BigInt(0),  // 0 means no limit per owner
          sellerShares: BigInt(Number(sellerShares) || 0),
          availableShares: defaultTotalShares - BigInt(Number(sellerShares) || 0)
        });
      } catch (error) {
        console.error("[PropertyDetails] Error fetching partial ownership data:", error);
      }
    };
    
    fetchPartialOwnershipData();
  }, [assetData, publicClient, propertyId]);
  
  // Check for invalid propertyId early
  useEffect(() => {
    if (propertyId === undefined || propertyId === null || isNaN(propertyId)) {
      console.error("Invalid property ID:", propertyId);
      setIsError(true);
      setError(new Error("Invalid property ID"));
      setIsLoading(false);
    }
  }, [propertyId]);
  
  // Refetch function
  const refetch = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);
  
  // Combine all data into a single property object
  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    console.debug(`[PropertyDetails] Processing data for property ID: ${propertyId}`);
    
    try {
      if (assetData) {
        safeLog("[PropertyDetails] Asset data received", { 
          assetData,
          type: typeof assetData,
          isArray: Array.isArray(assetData),
          length: Object.keys(assetData as any).length
        });
      } else {
        console.debug("[PropertyDetails] No asset data received yet");
      }
      
      if (metadataData) {
        safeLog("[PropertyDetails] Metadata received", { metadataData });
      }
      
      if (mediaData) {
        safeLog("[PropertyDetails] Media data received", { mediaData });
      }
      
      if (isAssetError || isMetadataError || isMediaError || 
          (assetData && (assetData as any).isPartiallyOwnEnabled && isOwnersError)) {
        // Handle errors
        const errorMessage = assetError || metadataError || mediaError || ownersError;
        console.error("[PropertyDetails] Error loading property data:", errorMessage);
        setIsError(true);
        setError(errorMessage instanceof Error ? errorMessage : new Error("Failed to load property data"));
        setIsLoading(false);
        return;
      }
      
      if (!assetData || !metadataData || !mediaData) {
        // Data still loading
        console.debug("[PropertyDetails] Still waiting for contract data...", {
          waitingForAssetData: !assetData,
          waitingForMetadata: !metadataData,
          waitingForMediaData: !mediaData
        });
        return;
      }
      
      console.debug("[PropertyDetails] Raw asset data received:", {
        name: Array.isArray(assetData) ? assetData[0] : undefined,         // name
        type: Array.isArray(assetData) ? assetData[1]?.toString() : undefined,    // assetType
        address: Array.isArray(assetData) ? assetData[2] : undefined,      // assetAddress
        status: Array.isArray(assetData) ? assetData[3]?.toString() : undefined,  // assetStatus
        furnishing: Array.isArray(assetData) ? assetData[4] : undefined,   // assetFurnishing
        zone: Array.isArray(assetData) ? assetData[5] : undefined,         // assetZone
        price: Array.isArray(assetData) ? assetData[6]?.toString() : undefined,   // assetPrice
        area: Array.isArray(assetData) ? assetData[7]?.toString() : undefined,    // assetArea
        age: Array.isArray(assetData) ? assetData[8]?.toString() : undefined,     // assetAge
        otherDetails: Array.isArray(assetData) ? assetData[9] : undefined, // assetOtherDetails
        isRentable: Array.isArray(assetData) ? assetData[10] : undefined,  // isRentable
        isSellable: Array.isArray(assetData) ? assetData[11] : undefined,  // isSellable
        isPartiallyOwnEnabled: Array.isArray(assetData) ? assetData[12] : undefined, // isPartiallyOwnEnabled
        seller: Array.isArray(assetData) ? assetData[13] : undefined,      // seller
        listingExpiry: Array.isArray(assetData) ? assetData[14] : undefined, // listingExpiry
        // Log all array indices for debugging
        allIndices: Array.isArray(assetData) ? assetData.map((item, idx) => `[${idx}]: ${typeof item === 'object' ? JSON.stringify(item) : item}`) : [],
      });
      
      console.debug("[PropertyDetails] Raw metadata received:", {
        description: Array.isArray(metadataData) ? metadataData[0]?.substring(0, 50) + "..." : "undefined...",
        location: Array.isArray(metadataData) ? metadataData[3] : undefined,
        hasFeatures: Array.isArray(metadataData) && !!metadataData[1],
        hasAmenities: Array.isArray(metadataData) && !!metadataData[2],
      });
      
      console.debug("[PropertyDetails] Raw media data received:", {
        hasImage: Array.isArray(mediaData) && !!mediaData[0],
        hasVideo: Array.isArray(mediaData) && !!mediaData[1],
        hasFloorPlan: Array.isArray(mediaData) && !!mediaData[2],
      });
      
      // Safely parse JSON from assetOtherDetails
      let parsedOtherDetails = {
        subType: 0,
        bedrooms: "N/A",
        bathrooms: "N/A",
        location: "Not specified"
      };
      
      try {
        if (Array.isArray(assetData) && assetData[9]) {
          console.debug("[PropertyDetails] Parsing assetOtherDetails:", assetData[9]);
          parsedOtherDetails = JSON.parse(assetData[9] as string);
          console.debug("[PropertyDetails] Parsed other details:", parsedOtherDetails);
        }
      } catch (e) {
        console.warn("[PropertyDetails] Failed to parse assetOtherDetails JSON:", e);
      }
      
      // Split features and amenities into arrays
      const features = Array.isArray(metadataData) && metadataData[1] ? 
        metadataData[1].split(',').map((f: string) => f.trim()) : [];
      
      const amenities = Array.isArray(metadataData) && metadataData[2] ? 
        metadataData[2].split(',').map((a: string) => a.trim()) : [];
      
      // Format price for display (from wei to USDT)
      const assetPrice = Array.isArray(assetData) ? assetData[6] : 0;
      const priceInUSDT = formatUnits(assetPrice || 0, 18);
      console.debug("[PropertyDetails] Formatted price:", {
        raw: assetPrice?.toString(),
        formatted: priceInUSDT
      });
      
      // Get property age directly from the struct field
      let propertyAge = "0";
      if (Array.isArray(assetData) && assetData[8] !== undefined) {
        propertyAge = assetData[8]?.toString() || "0";
      }
      
      // Final validation - ensure propertyAge is a valid number
      if (propertyAge && (isNaN(Number(propertyAge)) || typeof propertyAge === 'boolean')) {
        propertyAge = "0";
      }
      
      // Build the property object
      const propertyData: PropertyData = {
        id: propertyId,
        name: Array.isArray(assetData) ? assetData[0] as string || "Unnamed Property" : "Unnamed Property",
        assetType: Array.isArray(assetData) ? Number(assetData[1] ?? 0) as AssetType : 0,
        assetAddress: Array.isArray(assetData) ? assetData[2] as string || "0x0" : "0x0",
        assetStatus: Array.isArray(assetData) ? Number(assetData[3] ?? 0) as AssetStatus : 0,
        assetFurnishing: Array.isArray(assetData) ? Number(assetData[4] ?? 0) as AssetFurnishing : 0,
        assetZone: Array.isArray(assetData) ? Number(assetData[5] ?? 0) as AssetZone : 0,
        assetPrice: Array.isArray(assetData) ? (assetData[6])?.toString() || "0" : "0",
        formattedPrice: priceInUSDT,
        assetArea: Array.isArray(assetData) ? (assetData[7])?.toString() || "0" : "0",
        assetAge: propertyAge,
        assetOtherDetails: parsedOtherDetails,
        isRentable: Array.isArray(assetData) ? assetData[10] as boolean || false : false,
        isSellable: Array.isArray(assetData) ? assetData[11] as boolean || false : false,
        isPartiallyOwnEnabled: Array.isArray(assetData) ? assetData[12] as boolean || false : false,
        seller: Array.isArray(assetData) ? assetData[13] as string || "0x0" : "0x0",
        listingExpiry: Array.isArray(assetData) ? Number(assetData[14] || 0) : 0,
        
        // Metadata
        assetDescription: Array.isArray(metadataData) ? metadataData[0] as string || "No description provided" : "No description provided",
        assetFeatures: features,
        assetAmenities: amenities,
        assetLocation: Array.isArray(metadataData) ? metadataData[3] as string || "Location not specified" : "Location not specified",
        
        // Media
        assetImage: Array.isArray(mediaData) ? mediaData[0] as string || "" : "",
        assetVideo: Array.isArray(mediaData) ? mediaData[1] as string || "" : "",
        assetFloorPlan: Array.isArray(mediaData) ? mediaData[2] as string || "" : "",
      };
      
      // Add partial ownership data if available
      if (Array.isArray(assetData) && assetData[12] && partialOwnershipData) {
        const sharePrice = formatUnits(partialOwnershipData.sharePrice, 18);
        
        // Calculate total shares sold (total - available)
        const totalShares = BigInt(partialOwnershipData.totalShares);
        const availableShares = BigInt(partialOwnershipData.availableShares);
        const soldShares = totalShares - availableShares;
        
        console.debug("[PropertyDetails] Adding partial ownership data to property:", {
          totalShares: partialOwnershipData.totalShares.toString(),
          availableShares: partialOwnershipData.availableShares.toString(),
          soldShares: soldShares.toString(),
          userShares: userShares ? userShares.toString() : "0",
          sharePriceRaw: partialOwnershipData.sharePrice.toString(),
          sharePriceFormatted: sharePrice,
          sharePriceAsNum: parseFloat(sharePrice)
        });
        
        propertyData.partialOwnership = {
          totalShares: partialOwnershipData.totalShares.toString(),
          availableShares: partialOwnershipData.availableShares.toString(),
          sharePrice: sharePrice,
          minSharePurchase: partialOwnershipData.minSharePurchase.toString(),
          maxSharesPerOwner: partialOwnershipData.maxSharesPerOwner.toString(),
          sellerShares: partialOwnershipData.sellerShares.toString(),
          soldShares: soldShares.toString(),
          owners: (assetOwners as string[]) || [],
          userShares: userShares ? userShares.toString() : undefined
        };
      }
      
      setProperty(propertyData);
      console.debug("[PropertyDetails] Final property object constructed:", {
        id: propertyData.id,
        name: propertyData.name,
        price: propertyData.formattedPrice,
        area: propertyData.assetArea,
        type: getAssetTypeName(propertyData.assetType),
        status: getAssetStatusName(propertyData.assetStatus),
        hasPartialOwnership: !!propertyData.partialOwnership,
        hasImage: !!propertyData.assetImage,
        seller: propertyData.seller
      });
      setIsLoading(false);
    } catch (err) {
      console.error("[PropertyDetails] Critical error processing property data:", err);
      console.error("[PropertyDetails] Error details:", {
        propertyId,
        hasAssetData: !!assetData,
        hasMetadata: !!metadataData, 
        hasMediaData: !!mediaData,
        errorType: err instanceof Error ? err.name : 'Unknown',
        errorMessage: err instanceof Error ? err.message : String(err)
      });
      setIsError(true);
      setError(err instanceof Error ? err : new Error("Failed to process property data"));
      setIsLoading(false);
    }
  }, [
    assetData, 
    metadataData, 
    mediaData, 
    partialOwnershipData,
    assetOwners,
    propertyId,
    isAssetError,
    isMetadataError,
    isMediaError,
    isOwnersError,
    assetError,
    metadataError,
    mediaError,
    ownersError,
    refreshCounter,
    userShares,
    isUserSharesError,
    userSharesError,
    userAddress
  ]);
  
  // Purchase function that handles buying shares or the entire asset
  const purchaseProperty = async (shareCount?: number): Promise<PurchaseResult> => {
    if (!property || !walletClient || !publicClient) {
      const error = new Error("Cannot purchase: wallet not connected or property data unavailable");
      setPurchaseState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        error,
        transactionHash: null,
        reset: purchaseState.reset
      });
      return { ...purchaseState, isError: true, error };
    }
    
    try {
      setPurchaseState({
        ...purchaseState,
        isLoading: true,
        isError: false,
        error: null
      });
      
      // Determine if buying entire asset or shares
      const isBuyingEntireAsset = !property.isPartiallyOwnEnabled || !shareCount;
      const sharesToBuy = isBuyingEntireAsset ? 1 : shareCount || 1;
      
      // Calculate total cost
      let totalCost: bigint;
      if (isBuyingEntireAsset) {
        totalCost = BigInt(property.assetPrice);
      } else {
        // Get cost per share from property data
        const sharePrice = property.partialOwnership?.sharePrice || "0";
        // Use 18 decimals for USDT (not 6) as specified by the contract
        totalCost = parseUnits(sharePrice, 18) * BigInt(sharesToBuy);
      }
      
      // Log transaction details
      console.info("[PropertyPurchase] Starting purchase transaction:", {
        propertyId,
        isBuyingEntireAsset,
        sharesToBuy,
        totalCost: totalCost.toString(),
        usdtDecimals: 18 // Explicitly log that we're using 18 decimals
      });
      
      // Get current wallet address
      const walletAddress = walletClient.account.address;
      
      // First check if we already have sufficient allowance
      const currentAllowance = await publicClient.readContract({
        address: CONTRACTS.usdtToken as `0x${string}`,
        abi: ERC20ABI,
        functionName: 'allowance',
        args: [walletAddress, CONTRACTS.propytoRegistry]
      }) as bigint;
      
      console.info("[PropertyPurchase] USDT allowance check:", {
        currentAllowance: currentAllowance.toString(),
        requiredAmount: totalCost.toString(),
        isSufficient: currentAllowance >= totalCost,
        walletAddress,
        spenderAddress: CONTRACTS.propytoRegistry
      });
      
      // Only request approval if current allowance is insufficient
      let approveTx;
      if (currentAllowance < totalCost) {
        // Show approval toast
        toast.info("Requesting USDT approval...");
        
        // 1. Approve USDT spending
        approveTx = await writeContract({
          address: CONTRACTS.usdtToken as `0x${string}`,
          abi: ERC20ABI,
          functionName: 'approve',
          args: [CONTRACTS.propytoRegistry, totalCost],
          chainId
        });
        
        console.info("[PropertyPurchase] Approval transaction submitted:", approveTx);
        toast.info("Waiting for approval confirmation...");
        
        // Wait for approval transaction to be confirmed
        const approvalReceipt = await publicClient.waitForTransactionReceipt({ 
          hash: approveTx,
          confirmations: 1
        });
        
        console.info("[PropertyPurchase] Approval confirmed:", approvalReceipt);
        toast.success("USDT Approved! Processing purchase...");
      } else {
        console.info("[PropertyPurchase] Sufficient allowance already exists, skipping approval");
        toast.info("USDT already approved. Processing purchase...");
      }
      
      // 2. Execute the purchase transaction
      const purchaseTx = await writeContract({
        address: CONTRACTS.propytoRegistry as `0x${string}`,
        abi: PropytoRegistryABI,
        functionName: 'purchaseShares',
        args: [
          BigInt(propertyId), 
          BigInt(sharesToBuy), 
          isBuyingEntireAsset
        ],
        chainId
      });
      
      console.info("[PropertyPurchase] Purchase transaction submitted:", purchaseTx);
      toast.info("Purchase transaction submitted. Waiting for confirmation...");
      
      // Wait for purchase transaction to be confirmed
      const purchaseReceipt = await publicClient.waitForTransactionReceipt({ 
        hash: purchaseTx,
        confirmations: 1
      });
      
      console.info("[PropertyPurchase] Purchase confirmed:", purchaseReceipt);
      
      // Update purchase state with success
      const result = {
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        transactionHash: purchaseTx,
        reset: purchaseState.reset
      };
      setPurchaseState(result);
      
      // Automatically refresh property data
      refetch();
      
      // Show success message
      toast.success(
        isBuyingEntireAsset
          ? "Successfully purchased property!"
          : `Successfully purchased ${sharesToBuy} shares!`
      );
      
      return result;
    } catch (err) {
      console.error("[PropertyPurchase] Error during purchase:", err);
      
      // Provide user-friendly error message
      let errorMessage = "Transaction failed";
      if (err instanceof Error) {
        if (err.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for this purchase";
        } else if (err.message.includes("user rejected")) {
          errorMessage = "Transaction rejected by user";
        } else if (err.message.includes("already owned")) {
          errorMessage = "You already own this property";
        }
      }
      
      toast.error(errorMessage);
      
      const result = {
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: err instanceof Error ? err : new Error(String(err)),
        transactionHash: null,
        reset: purchaseState.reset
      };
      setPurchaseState(result);
      return result;
    }
  };
  
  return {
    property,
    isLoading,
    isError,
    error,
    refetch,
    purchaseProperty,
    purchaseState
  };
}

// Helper functions to get human-readable values
export function getAssetTypeName(type: AssetType): string {
  switch (type) {
    case AssetType.RESIDENTIAL: return "Residential";
    case AssetType.COMMERCIAL: return "Commercial";
    case AssetType.LAND: return "Land";
    case AssetType.OTHER: return "Other";
    default: return "Unknown";
  }
}

export function getAssetStatusName(status: AssetStatus): string {
  switch (status) {
    case AssetStatus.FOR_SALE: return "For Sale";
    case AssetStatus.FOR_RENT: return "For Rent";
    case AssetStatus.SOLD: return "Sold";
    case AssetStatus.RENTED: return "Rented";
    case AssetStatus.DELISTED: return "Delisted";
    case AssetStatus.OTHER: return "Other";
    default: return "Unknown";
  }
}

export function getAssetFurnishingName(furnishing: AssetFurnishing): string {
  switch (furnishing) {
    case AssetFurnishing.UNFURNISHED: return "Unfurnished";
    case AssetFurnishing.PARTIALLY_FURNISHED: return "Partially Furnished";
    case AssetFurnishing.FULLY_FURNISHED: return "Fully Furnished";
    case AssetFurnishing.OTHER: return "Other";
    default: return "Unknown";
  }
}

export function getAssetZoneName(zone: AssetZone): string {
  switch (zone) {
    case AssetZone.RESIDENTIAL: return "Residential";
    case AssetZone.COMMERCIAL: return "Commercial";
    case AssetZone.INDUSTRIAL: return "Industrial";
    case AssetZone.LAND: return "Land";
    case AssetZone.OTHER: return "Other";
    default: return "Unknown";
  }
}

export function getSubTypeName(assetType: AssetType, subType: number): string {
  switch (assetType) {
    case AssetType.RESIDENTIAL:
      switch (subType) {
        case 1: return "Apartment";
        case 2: return "Farmhouse";
        case 3: return "Villa";
        case 4: return "Bungalow";
        default: return "Other";
      }
    case AssetType.COMMERCIAL:
      switch (subType) {
        case 1: return "Shop";
        case 2: return "Office";
        case 3: return "Godown";
        default: return "Other";
      }
    case AssetType.LAND:
      switch (subType) {
        case 1: return "Plot";
        case 2: return "Farms";
        default: return "Other";
      }
    default:
      return "Other";
  }
} 