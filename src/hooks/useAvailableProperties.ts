import { useState, useEffect } from 'react';
import { usePublicClient, useChainId } from 'wagmi';
import { PropytoRegistryABI } from '@/config/abis/PropytoRegistry';
import { CONTRACTS, DEFAULT_CHAIN_ID } from '@/config/contracts';
import { formatUnits } from 'ethers';
import { PropertyData } from './usePropertyDetails';

export interface UseAvailablePropertiesResult {
  properties: PropertyData[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useAvailableProperties(): UseAvailablePropertiesResult {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  
  const chainId = useChainId() || DEFAULT_CHAIN_ID;
  const publicClient = usePublicClient();
  
  const refetch = () => setRefreshCounter(prev => prev + 1);
  
  useEffect(() => {
    const fetchProperties = async () => {
      if (!publicClient) {
        console.warn("Public client not available yet");
        return;
      }
      
      try {
        setIsLoading(true);
        setIsError(false);
        setError(null);
        
        console.debug("[AvailableProperties] Fetching properties...");
        
        // Get total properties count
        const totalProperties = await publicClient.readContract({
          address: CONTRACTS.propytoRegistry as `0x${string}`,
          abi: PropytoRegistryABI,
          functionName: 'assetCount',
          args: []
        }) as bigint;
        
        console.debug(`[AvailableProperties] Total properties: ${totalProperties.toString()}`);
        
        if (totalProperties === BigInt(0)) {
          setProperties([]);
          setIsLoading(false);
          return;
        }
        
        // Fetch properties with parallel requests - get the latest 20 properties
        const pageSize = 20; // Increase from 12 to 20 to show more properties
        const startIndex = totalProperties > BigInt(pageSize) ? 
          Number(totalProperties) - pageSize : 0;
        const endIndex = Number(totalProperties);
        
        const propertyIds = Array.from(
          { length: endIndex - startIndex }, 
          (_, i) => BigInt(startIndex + i + 1)
        );
        
        // Fetch properties in parallel
        const propertyDataPromises = propertyIds.map(async (id) => {
          try {
            // Get asset details
            const assetData = await publicClient.readContract({
              address: CONTRACTS.propytoRegistry as `0x${string}`,
              abi: PropytoRegistryABI,
              functionName: 'assets',
              args: [id]
            }) as any[];
            
            // Only include sellable properties that haven't expired
            const isSellable = assetData[12] as boolean;
            const listingExpiry = Number(assetData[14] || 0);
            const isExpired = listingExpiry < Math.floor(Date.now() / 1000);
            
            if (!isSellable || isExpired) {
              return null;
            }
            
            // Get metadata 
            const metadataData = await publicClient.readContract({
              address: CONTRACTS.propytoRegistry as `0x${string}`,
              abi: PropytoRegistryABI,
              functionName: 'assetMetadata',
              args: [id]
            }) as any[];
            
            // Get media
            const mediaData = await publicClient.readContract({
              address: CONTRACTS.propytoRegistry as `0x${string}`,
              abi: PropytoRegistryABI,
              functionName: 'assetMedia',
              args: [id]
            }) as any[];
            
            // Parse other details JSON
            let parsedOtherDetails = {
              subType: 0,
              bedrooms: "N/A",
              bathrooms: "N/A",
              location: "Not specified"
            };
            
            try {
              if (assetData[9]) {
                parsedOtherDetails = JSON.parse(assetData[9] as string);
              }
            } catch (e) {
              console.warn(`[AvailableProperties] Failed to parse otherDetails for property ${id}:`, e);
            }
            
            // Format price
            const priceInUSDT = formatUnits(assetData[6] || BigInt(0), 18);
            
            return {
              id: Number(id),
              name: assetData[0] as string || "Unnamed Property",
              assetType: Number(assetData[1] ?? 0),
              assetAddress: assetData[2] as string || "0x0",
              assetStatus: Number(assetData[3] ?? 0),
              assetFurnishing: Number(assetData[4] ?? 0),
              assetZone: Number(assetData[5] ?? 0),
              assetPrice: assetData[6]?.toString() || "0",
              formattedPrice: priceInUSDT,
              assetArea: assetData[7]?.toString() || "0",
              assetAge: assetData[8]?.toString() || "0",
              assetOtherDetails: parsedOtherDetails,
              isRentable: assetData[10] as boolean || false,
              isSellable: assetData[11] as boolean || false,
              isPartiallyOwnEnabled: assetData[12] as boolean || false,
              seller: assetData[13] as string || "0x0",
              listingExpiry: Number(assetData[14] || 0),
              
              // Metadata
              assetDescription: metadataData[0] as string || "No description provided",
              assetFeatures: metadataData[1] ? (metadataData[1] as string).split(',').map(f => f.trim()) : [],
              assetAmenities: metadataData[2] ? (metadataData[2] as string).split(',').map(a => a.trim()) : [],
              assetLocation: metadataData[3] as string || "Location not specified",
              
              // Media
              assetImage: mediaData[0] as string || "",
              assetVideo: mediaData[1] as string || "",
              assetFloorPlan: mediaData[2] as string || "",
            } as PropertyData;
          } catch (err) {
            console.error(`[AvailableProperties] Error fetching property ${id}:`, err);
            return null;
          }
        });
        
        const propertiesData = await Promise.all(propertyDataPromises);
        const validProperties = propertiesData.filter(p => p !== null) as PropertyData[];
        
        // Sort properties by newest first (descending by ID)
        validProperties.sort((a, b) => Number(b.id) - Number(a.id));
        
        console.debug(`[AvailableProperties] Fetched ${validProperties.length} valid properties`);
        
        setProperties(validProperties);
        setIsLoading(false);
      } catch (err) {
        console.error("[AvailableProperties] Error fetching properties:", err);
        setIsError(true);
        setError(err instanceof Error ? err : new Error("Failed to fetch properties"));
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, [chainId, publicClient, refreshCounter]);
  
  return {
    properties,
    isLoading,
    isError,
    error,
    refetch
  };
} 