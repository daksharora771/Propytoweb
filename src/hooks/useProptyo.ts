import { useState, useEffect, useCallback } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId, useClient, usePublicClient } from 'wagmi';
import { PropytoRegistryABI } from '@/config/abis/PropytoRegistry';
import { USDTABI } from '@/config/abis/USDT';
import { CONTRACTS, DEFAULT_CHAIN_ID } from '@/config/contracts';
import { parseUnits } from 'ethers';
import { Step } from '@/components/ui/TransactionModal';
import { decodeEventLog, getAbiItem } from 'viem';

// Sleep utility function
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export enum AssetType {
  RESIDENTIAL = 0,
  COMMERCIAL = 1,
  LAND = 2,
  OTHER = 3
}

export enum AssetStatus {
  FOR_SALE = 0,
  FOR_RENT = 1,
  SOLD = 2,
  RENTED = 3,
  DELISTED = 4,
  OTHER = 5
}

export enum AssetFurnishing {
  UNFURNISHED = 0,
  PARTIALLY_FURNISHED = 1,
  FULLY_FURNISHED = 2,
  OTHER = 3
}

export enum AssetZone {
  INDUSTRIAL = 0,
  COMMERCIAL = 1,
  RESIDENTIAL = 2,
  LAND = 3,
  OTHER = 4
}

export interface MarketplaceConfig {
  platformFeePercentage: bigint;
  feeCollector: string;
  listingFee: bigint;
  feesEnabled: boolean;
}

export interface PartialOwnershipConfig {
  enabled: boolean;
  totalShares: number;
  sharePrice: string;
  minSharePurchase: number;
  maxSharesPerOwner: number;
  sellerShares: number;
}

export interface AssetFormData {
  name: string;
  assetType: number;
  assetStatus: number;
  assetFurnishing: number;
  assetZone: number;
  assetPrice: string;
  assetArea: number;
  assetAge: number;
  assetDescription: string;
  assetFeatures: string;
  assetAmenities: string;
  assetLocation: string;
  assetImage: string;
  assetVideo: string;
  assetFloorPlan: string;
  isRentable: boolean;
  isSellable: boolean;
  isPartiallyOwnEnabled: boolean;
  subType: number;
  bedrooms: string;
  bathrooms: string;
  location: string;
  // Partial ownership fields
  partialOwnership?: PartialOwnershipConfig;
}

// Enhanced transaction tracking interface
interface TransactionMonitor {
  hash: `0x${string}` | null;
  status: 'pending' | 'confirming' | 'confirmed' | 'failed';
  confirmations: number;
  error: Error | null;
}

export interface TransactionState {
  isOpen: boolean;
  title: string;
  steps: Step[];
  currentStep: number;
  isComplete: boolean;
  error?: {
    message: string;
    step: string;
  } | null;
  canRetry: boolean;
  processingTransaction: boolean;
}

// Add utility function for safe logging objects with BigInt values
const safeLogObject = (label: string, obj: any) => {
  // Convert object with potential BigInt values to strings
  const safeObj = JSON.parse(JSON.stringify(obj, (key, value) => 
    typeof value === 'bigint' ? value.toString() : value
  ));
  console.log(label, safeObj);
};

export function useProptyoListing() {
  const [step, setStep] = useState(1);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [assetId, setAssetId] = useState<number | null>(null);
  const [transactionState, setTransactionState] = useState<TransactionState>({
    isOpen: false,
    title: 'Property Listing',
    steps: [],
    currentStep: 0,
    isComplete: false,
    error: null,
    canRetry: false,
    processingTransaction: false
  });
  
  // Transaction monitors for each step
  const [approveMonitor, setApproveMonitor] = useState<TransactionMonitor>({
    hash: null,
    status: 'pending',
    confirmations: 0,
    error: null
  });
  
  const [registerMonitor, setRegisterMonitor] = useState<TransactionMonitor>({
    hash: null,
    status: 'pending',
    confirmations: 0,
    error: null
  });
  
  const [partialOwnershipMonitor, setPartialOwnershipMonitor] = useState<TransactionMonitor>({
    hash: null,
    status: 'pending',
    confirmations: 0,
    error: null
  });
  
  // Track form data for partial ownership setup
  const [formDataCache, setFormDataCache] = useState<AssetFormData | null>(null);
  
  const chainId = useChainId() || DEFAULT_CHAIN_ID;
  const { address } = useAccount();
  const publicClient = usePublicClient();

  // Get the registry contract config
  const { data: marketplaceConfig } = useReadContract({
    address: CONTRACTS.propytoRegistry as `0x${string}`,
    abi: PropytoRegistryABI,
    functionName: 'marketplaceConfig',
  }) as { data: MarketplaceConfig | undefined };

  // Get the registry contract USDT
  const { data: usdtAddress } = useReadContract({
    address: CONTRACTS.propytoRegistry as `0x${string}`,
    abi: PropytoRegistryABI,
    functionName: 'usdtToken',
  });
  
  // Contract write hooks
  const { writeContractAsync: approveUSDTAsync } = useWriteContract();
  const { writeContractAsync: registerAssetAsync } = useWriteContract();
  const { writeContractAsync: enablePartialOwnershipAsync } = useWriteContract();
  
  // Initialize transaction modal
  const initializeTransaction = (withPartialOwnership: boolean) => {
    const steps: Step[] = [
      {
        id: 'approve',
        title: 'Approve USDT',
        description: 'Approving USDT for the listing fee',
        status: 'pending'
      },
      {
        id: 'register',
        title: 'Register Property',
        description: 'Registering property on the blockchain',
        status: 'pending'
      }
    ];
    
    if (withPartialOwnership) {
      steps.push({
        id: 'partial',
        title: 'Enable Partial Ownership',
        description: 'Setting up fractional shares for the property',
        status: 'pending'
      });
    }
    
    // Reset transaction monitors
    setApproveMonitor({
      hash: null,
      status: 'pending',
      confirmations: 0,
      error: null
    });
    
    setRegisterMonitor({
      hash: null,
      status: 'pending',
      confirmations: 0,
      error: null
    });
    
    setPartialOwnershipMonitor({
      hash: null,
      status: 'pending',
      confirmations: 0,
      error: null
    });
    
    setTransactionState({
      isOpen: true,
      title: 'Property Listing',
      steps,
      currentStep: 0,
      isComplete: false,
      error: null,
      canRetry: false,
      processingTransaction: false
    });
  };
  
  // Update transaction step
  const updateTransactionStep = (stepId: string, status: Step['status'], txHash?: string, errorMessage?: string) => {
    setTransactionState(prev => {
      const stepIndex = prev.steps.findIndex(step => step.id === stepId);
      if (stepIndex === -1) return prev;
      
      const newSteps = [...prev.steps];
      newSteps[stepIndex] = { ...newSteps[stepIndex], status, txHash };
      
      // If current step is completed, move to next step
      let newCurrentStep = prev.currentStep;
      if (status === 'success' && stepIndex === prev.currentStep) {
        newCurrentStep = Math.min(newCurrentStep + 1, newSteps.length - 1);
      }
      
      // Check if all steps are complete
      const isComplete = newSteps.every(step => step.status === 'success');
      
      // Set error information if this is an error state
      const error = status === 'error' ? {
        message: errorMessage || 'Transaction failed or was rejected',
        step: stepId
      } : null;
      
      return {
        ...prev,
        steps: newSteps,
        currentStep: newCurrentStep,
        isComplete,
        error,
        canRetry: status === 'error'
      };
    });
  };
  
  // Close transaction modal
  const closeTransactionModal = () => {
    // Prevent closing if there's an active transaction pending confirmation
    if (approveMonitor.status === 'confirming' || 
        registerMonitor.status === 'confirming' || 
        partialOwnershipMonitor.status === 'confirming') {
      console.log("Cannot close modal while transaction is pending confirmation");
      return;
    }
    
    setTransactionState(prev => ({ ...prev, isOpen: false }));
  };
  
  // Monitor transaction confirmation using wagmi hooks and publicClient
  const monitorTransaction = useCallback(async (
    hash: `0x${string}`,
    stepId: string,
    setMonitor: React.Dispatch<React.SetStateAction<TransactionMonitor>>
  ) => {
    try {
      if (!publicClient) {
        throw new Error("Blockchain client not available");
      }
      
      console.log(`Monitoring transaction ${hash} for step ${stepId}`);
      updateTransactionStep(stepId, 'loading', hash);
      
      // Update status to confirming
      setMonitor(prev => ({
        ...prev,
        hash,
        status: 'confirming',
        confirmations: 0,
        error: null
      }));
      
      // Implement exponential backoff for receipt polling
      const maxAttempts = 30;  // Maximum number of polling attempts
      const initialBackoff = 2000;  // Initial backoff in milliseconds (2 seconds)
      const maxBackoff = 15000;  // Maximum backoff in milliseconds (15 seconds)
      const totalTimeout = 180000;  // Total timeout in milliseconds (3 minutes)
      
      let receipt = null;
      let attempts = 0;
      let backoff = initialBackoff;
      const startTime = Date.now();
      
      while (receipt === null && (Date.now() - startTime < totalTimeout)) {
        try {
          console.log(`Polling for receipt (attempt ${attempts + 1}/${maxAttempts})...`);
          receipt = await publicClient.getTransactionReceipt({ hash });
          
          if (receipt) {
            // Use safe logging for receipt which may contain BigInt values
            safeLogObject(`Transaction receipt found:`, receipt);
            break;
          }
        } catch (error) {
          console.warn(`Error checking receipt (attempt ${attempts + 1}): ${error instanceof Error ? error.message : String(error)}`);
          
          // If it's a "not found" error, continue polling
          if (error instanceof Error && 
              (error.message.includes("not found") || 
               error.message.includes("could not be found"))) {
            // Continue with retry
          } else {
            // Rethrow unexpected errors
            throw error;
          }
        }
        
        // Increment attempts
        attempts++;
        
        // Check if we've reached max attempts
        if (attempts >= maxAttempts) {
          throw new Error(`Transaction receipt not found after ${maxAttempts} attempts`);
        }
        
        // Update UI with waiting status
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        console.log(`Waiting for transaction to be mined (${elapsed}s elapsed). Next check in ${backoff/1000}s...`);
        
        // Wait before next attempt with exponential backoff
        await new Promise(resolve => setTimeout(resolve, backoff));
        
        // Increase backoff with jitter (randomness to avoid thundering herd)
        backoff = Math.min(backoff * 1.5, maxBackoff) * (0.9 + Math.random() * 0.2);
      }
      
      // If we exit the loop without a receipt due to timeout
      if (!receipt) {
        throw new Error(`Transaction confirmation timed out after ${totalTimeout/1000} seconds`);
      }
      
      console.log(`Transaction ${hash} receipt received:`);
      safeLogObject('Receipt details:', receipt);
      
      // Check receipt status
      // Convert status to string for consistent comparison
      const statusStr = String(receipt.status).toLowerCase();
      if (statusStr === "success" || statusStr === "1" || statusStr === "0x1") {
        console.log(`Transaction ${hash} confirmed successfully`);
        
        // Add additional confirmation check for extra security
        // Wait for 1 more block after the receipt
        const receiptBlockNumber = receipt.blockNumber;
        console.log(`Transaction mined in block ${typeof receiptBlockNumber === 'bigint' ? receiptBlockNumber.toString() : receiptBlockNumber}`);
        
        // Get current block number
        const currentBlockNumber = await publicClient.getBlockNumber();
        console.log(`Current block number: ${typeof currentBlockNumber === 'bigint' ? currentBlockNumber.toString() : currentBlockNumber}`);
        
        // Calculate confirmations
        const confirmations = Number(currentBlockNumber) - Number(receiptBlockNumber) + 1;
        console.log(`Transaction has ${confirmations} confirmation(s)`);
        
        // Update status to confirmed
        setMonitor(prev => ({
          ...prev,
          status: 'confirmed',
          confirmations
        }));
        
        // Update transaction step
        updateTransactionStep(stepId, 'success', hash);
        
        // Set transaction as not processing anymore
        setTransactionState(prev => ({ ...prev, processingTransaction: false }));
        
        // Return the receipt for further processing
        return receipt;
      } else {
        console.error(`Transaction ${hash} failed with status: ${receipt.status}`);
        
        // Update status to failed
        setMonitor(prev => ({
          ...prev,
          status: 'failed',
          error: new Error(`Transaction failed on chain with status: ${receipt.status}`)
        }));
        
        // Update transaction step
        updateTransactionStep(stepId, 'error', hash, 'Transaction failed on chain');
        
        // Set transaction as not processing anymore
        setTransactionState(prev => ({ ...prev, processingTransaction: false }));
        
        return null;
      }
    } catch (error) {
      // Handle structured error logging and user feedback
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Categorize error types for better user feedback
      let userErrorMessage = 'Error monitoring transaction';
      if (errorMessage.includes("timed out")) {
        userErrorMessage = 'Transaction confirmation is taking longer than expected. It may still complete - check the block explorer for status.';
      } else if (errorMessage.includes("not found")) {
        userErrorMessage = 'Transaction receipt is pending. The network may be congested - check the block explorer for status.';
      }
      
      console.error(`Error monitoring transaction ${hash}:`, error);
      
      // Update status to failed but with recovery information
      setMonitor(prev => ({
        ...prev,
        status: 'failed',
        error: error instanceof Error ? error : new Error(userErrorMessage)
      }));
      
      // Update transaction step with recoverable error
      updateTransactionStep(
        stepId, 
        'error', 
        hash, 
        userErrorMessage
      );
      
      // Set transaction as not processing anymore
      setTransactionState(prev => ({ ...prev, processingTransaction: false }));
      
      return null;
    }
  }, [publicClient]);
  
  // Extract asset ID from transaction receipt using viem's decodeEventLog
  const extractAssetId = useCallback((receipt: any): number | null => {
    try {
      if (!receipt || !receipt.logs) {
        console.error("Invalid receipt or missing logs");
        return null;
      }
      
      console.log("Processing receipt logs for AssetRegistered event");
      safeLogObject("Receipt logs:", receipt.logs);
      
      // Try to find the AssetRegistered event
      for (const log of receipt.logs) {
        // Check if this log is from our contract
        if (log.address.toLowerCase() !== CONTRACTS.propytoRegistry.toLowerCase()) {
          console.log("Log is not from our contract");
          continue;
        }
        
        try {
          // Try to decode the log as an AssetRegistered event
          console.log("Attempting to decode log from our contract");
          safeLogObject("Log data:", log);
          
          const decodedLog = decodeEventLog({
            abi: PropytoRegistryABI,
            data: log.data,
            topics: log.topics as any,
          });
          
          safeLogObject("Decoded log:", decodedLog);
          
          // Check if this is the AssetRegistered event
          if (decodedLog.eventName === 'AssetRegistered') {
            const args = decodedLog.args as any;
            if (args && args.assetId !== undefined) {
              const id = Number(args.assetId);
              console.log("Found Asset ID:", id);
              return id;
            }
          }
        } catch (error) {
          console.warn("Error decoding log:", error);
          // Continue to the next log
        }
      }
      
      // Manual fallback - try to find AssetRegistered event signature
      console.log("Using fallback method to find AssetRegistered event");
      // Hash of AssetRegistered event signature: AssetRegistered(uint256,string,address,address,address)
      const assetRegisteredTopic = "0x5424fbde75e899c62d84fe6c65a02447fa115a79af3e9d1150df6f41d35fcfa3";
      
      for (const log of receipt.logs) {
        if (log.topics && log.topics[0] && log.topics[0].toLowerCase() === assetRegisteredTopic.toLowerCase()) {
          console.log("Found AssetRegistered event by topic signature");
          
          // The assetId is the first indexed parameter (topics[1])
          if (log.topics[1]) {
            try {
              // Convert hex to decimal
              const assetIdHex = log.topics[1];
              const assetIdBigInt = BigInt(assetIdHex);
              const assetIdNumber = Number(assetIdBigInt);
              console.log("Extracted Asset ID from topics:", assetIdNumber);
              return assetIdNumber;
            } catch (err) {
              console.warn("Error converting Asset ID from hex:", err);
            }
          }
        }
      }
      
      console.warn("Asset ID not found in logs");
      return null;
    } catch (error) {
      console.error("Error extracting asset ID:", error);
      return null;
    }
  }, []);
  
  // Estimate gas fees for better transaction performance
  const estimateGasFees = useCallback(async () => {
    try {
      if (!publicClient) {
        return null;
      }
      
      // Get latest gas price from the network
      const feeData = await publicClient.estimateFeesPerGas();
      
      return {
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
      };
    } catch (error) {
      console.warn("Error estimating gas fees:", error);
      return null;
    }
  }, [publicClient]);
  
  // Send and monitor a contract transaction with enhanced error handling
  const sendAndMonitorTransaction = useCallback(async (
    transactionFunc: () => Promise<`0x${string}`>,
    stepId: string,
    setMonitor: React.Dispatch<React.SetStateAction<TransactionMonitor>>
  ) => {
    try {
      // Set transaction as processing
      setTransactionState(prev => ({ 
        ...prev, 
        processingTransaction: true,
        isOpen: true
      }));
      
      // Update transaction step
      updateTransactionStep(stepId, 'loading');
      
      // Get estimated gas fees
      const gasFees = await estimateGasFees();
      
      // Send the transaction
      let hash: `0x${string}`;
      try {
        // Log debug info before sending transaction
        console.log(`Sending ${stepId} transaction...`);
        
        // Send transaction
        hash = await transactionFunc();
        console.log(`Transaction sent with hash: ${hash}`);
      } catch (error: any) {
        // Handle user rejection
        if (error.code === 4001 || (error.message && error.message.includes('user rejected'))) {
          console.log('Transaction rejected by user');
          updateTransactionStep(stepId, 'error', undefined, 'Transaction rejected by user');
          setTransactionState(prev => ({ ...prev, processingTransaction: false }));
          return null;
        }
        
        // Log detailed error information
        console.error(`Error sending transaction for step ${stepId}:`, error);
        console.error(`Error message: ${error.message}`);
        if (error.data) console.error(`Error data: ${JSON.stringify(error.data)}`);
        if (error.reason) console.error(`Error reason: ${error.reason}`);
        
        // Handle other errors
        const errorMessage = error.message || 'Unknown error sending transaction';
        updateTransactionStep(stepId, 'error', undefined, errorMessage);
        setTransactionState(prev => ({ ...prev, processingTransaction: false }));
        return null;
      }
      
      // Monitor transaction
      return await monitorTransaction(hash, stepId, setMonitor);
    } catch (error: any) {
      console.error(`Transaction process failed:`, error);
      updateTransactionStep(
        stepId, 
        'error', 
        undefined, 
        error.message || 'Transaction process failed'
      );
      setTransactionState(prev => ({ ...prev, processingTransaction: false }));
      return null;
    }
  }, [monitorTransaction, estimateGasFees]);

  // Handle asset listing with sequential transaction flow
  const listAsset = async (formData: AssetFormData) => {
    console.log("Starting asset listing process");
    console.debug("Form Data:", formData);
    console.debug("Market Config:", marketplaceConfig);
    console.debug("Address:", address);
    console.debug("USDT:", usdtAddress);
    
    // Ensure partialOwnership is properly initialized if enabled
    if (formData.isPartiallyOwnEnabled && !formData.partialOwnership) {
      console.log("WARNING: Fixing missing partialOwnership in form data");
      formData.partialOwnership = {
        enabled: true,
        totalShares: 1000,
        sharePrice: "50",
        minSharePurchase: 10,
        maxSharesPerOwner: 200,
        sellerShares: 100
      };
    }
    
    // Debug log for partial ownership status
    console.log("FORM DATA - Partial Ownership Enabled:", formData.isPartiallyOwnEnabled);
    console.log("FORM DATA - Partial Ownership Config:", formData.partialOwnership);
    
    if (!marketplaceConfig || !usdtAddress || !address) {
      console.error("Missing required configuration");
      return;
    }
    
    // Store form data for retry purposes
    setFormDataCache(formData);
    
    // Debug log: Check what's stored in formDataCache immediately after setting
    console.log("AFTER SETTING - formDataCache.isPartiallyOwnEnabled:", formDataCache?.isPartiallyOwnEnabled);
    console.log("AFTER SETTING - formDataCache.partialOwnership exists:", !!formDataCache?.partialOwnership);

    try {
      // Determine if we need to enable partial ownership
      const needsPartialOwnership = formData.isPartiallyOwnEnabled;
      
      // Initialize transaction modal
      initializeTransaction(needsPartialOwnership);
      
      // Format data for contract - ENSURE EXACT MATCH WITH CONTRACT STRUCT
      // Convert to proper types based on ABI definition
      const assetData = {
        name: formData.name,
        assetType: Number(formData.assetType), // Use Number for enum types
        assetAddress: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        assetStatus: Number(formData.assetStatus), // Use Number for enum types
        assetFurnishing: Number(formData.assetFurnishing), // Use Number for enum types
        assetZone: Number(formData.assetZone), // Use Number for enum types
        assetPrice: parseUnits(formData.assetPrice, 18), // BigInt for price
        assetArea: BigInt(formData.assetArea), // BigInt for numeric values
        assetAge: BigInt(formData.assetAge), // BigInt for numeric values
        assetOtherDetails: JSON.stringify({
          subType: formData.subType,
          bedrooms: formData.bedrooms || "N/A",
          bathrooms: formData.bathrooms || "N/A",
          location: formData.location || "Not specified"
        }),
        isRentable: formData.isRentable, // Boolean values
        isSellable: formData.isSellable, // Boolean values
        isPartiallyOwnEnabled: formData.isPartiallyOwnEnabled, // Boolean values
        seller: address as `0x${string}`, // Address typed
        listingExpiry: BigInt(Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60) // Unix timestamp
      };
      
      // Log the formatted asset data for debugging
      console.log("Formatted asset data:", {
        ...assetData,
        assetPrice: assetData.assetPrice.toString(),
        assetArea: assetData.assetArea.toString(),
        assetAge: assetData.assetAge.toString(),
        listingExpiry: assetData.listingExpiry.toString()
      });
      
      const metadataData = {
        assetDescription: formData.assetDescription || "No description provided",
        assetFeatures: formData.assetFeatures || "",
        assetAmenities: formData.assetAmenities || "",
        assetLocation: formData.assetLocation || "Location not specified"
      };
      
      const mediaData = {
        assetImage: formData.assetImage || "",
        assetVideo: formData.assetVideo || "",
        assetFloorPlan: formData.assetFloorPlan || ""
      };

      // Step 1: Approve USDT if fee is enabled
      if (marketplaceConfig && 
          marketplaceConfig.feesEnabled && 
          marketplaceConfig.listingFee > BigInt(0)) {
        
        console.log("Approving USDT:", usdtAddress);
        console.log("Fee amount:", marketplaceConfig.listingFee.toString());
        console.log("Registry address:", CONTRACTS.propytoRegistry);
        
        // Send and monitor approval transaction
        const approveReceipt = await sendAndMonitorTransaction(
          async () => {
            return await approveUSDTAsync({
              address: usdtAddress as `0x${string}`,
              abi: USDTABI,
              functionName: 'approve',
              args: [CONTRACTS.propytoRegistry, marketplaceConfig.listingFee]
            });
          },
          'approve',
          setApproveMonitor
        );
        
        if (!approveReceipt) {
          console.error("Approval transaction failed or was not confirmed");
          return;
        }
        
        console.log("Approval transaction confirmed");
      } else {
        // Skip approval if no fee
        updateTransactionStep('approve', 'success');
      }
      
      // Step 2: Register asset
      const registerReceipt = await sendAndMonitorTransaction(
        async () => {
          // Log the exact args being sent to the contract
          console.log("Preparing registerAsset transaction with args:");
          console.log("Asset:", assetData);
          console.log("Metadata:", metadataData);
          console.log("Media:", mediaData);
          
          // Check if any potentially troublesome values exist
          if (assetData.assetPrice <= BigInt(0)) {
            console.warn("Warning: Asset price is zero or negative, which may cause revert");
          }
          
          if (assetData.assetArea <= BigInt(0)) {
            console.warn("Warning: Asset area is zero or negative, which may cause revert");
          }
          
          return await registerAssetAsync({
            address: CONTRACTS.propytoRegistry as `0x${string}`,
            abi: PropytoRegistryABI,
            functionName: 'registerAsset',
            args: [assetData, metadataData, mediaData]
          });
        },
        'register',
        setRegisterMonitor
      );
      
      if (!registerReceipt) {
        console.error("Register transaction failed or was not confirmed");
        return;
      }
      
      console.log("Register transaction confirmed successfully");
      
      // Extract asset ID from receipt with improved logging
      console.log("Extracting asset ID from transaction receipt...");
      const extractedAssetId = extractAssetId(registerReceipt);

      if (!extractedAssetId) {
        console.error("Failed to extract asset ID from receipt - cannot proceed with partial ownership");
        updateTransactionStep('register', 'error', undefined, 'Failed to extract asset ID');
        setTransactionState(prev => ({ ...prev, processingTransaction: false }));
        return;
      }

      console.log("Successfully extracted asset ID:", extractedAssetId);
      setAssetId(extractedAssetId);

      // Log detailed form data to debug partial ownership issue
      console.log("DETAILED FORM DATA:", JSON.stringify(formData, (key, value) => 
        typeof value === 'bigint' ? value.toString() : value
      , 2));
      console.log("Is Partially Own Enabled:", formData.isPartiallyOwnEnabled);
      console.log("Partial Ownership Structure:", formData.partialOwnership);

      // Store form data in a local variable to ensure it's available
      const currentFormData = { ...formData }; // Clone to avoid reference issues

      // Create a default partial ownership config if missing but enabled
      if (currentFormData.isPartiallyOwnEnabled && !currentFormData.partialOwnership) {
        console.log("WARNING: isPartiallyOwnEnabled is true but partialOwnership is missing!");
        console.log("Creating default partial ownership config...");
        
        // Create default partial ownership config
        currentFormData.partialOwnership = {
          enabled: true,
          totalShares: 1000,
          sharePrice: "50",
          minSharePurchase: 10,
          maxSharesPerOwner: 200,
          sellerShares: 100
        };
        
        console.log("Created default partial ownership:", currentFormData.partialOwnership);
      }

      // Before checking for partial ownership status
      console.log("BEFORE PARTIAL CHECK - Direct form value isPartiallyOwnEnabled:", formData.isPartiallyOwnEnabled);
      console.log("BEFORE PARTIAL CHECK - Cache value isPartiallyOwnEnabled:", formDataCache?.isPartiallyOwnEnabled);
      console.log("BEFORE PARTIAL CHECK - Full formDataCache:", formDataCache);

      // Check if partial ownership is enabled using direct form data
      if (currentFormData.isPartiallyOwnEnabled) {
        console.log("Partial ownership is enabled - proceeding to setup");
        
        // Wait a moment before proceeding to the next transaction
        console.log("Waiting briefly before initiating partial ownership transaction...");
        await sleep(1000);
        
        // Use the direct form data for setup
        const setupSuccess = await setupPartialOwnershipDirectly(extractedAssetId, currentFormData);
        
        if (setupSuccess) {
          console.log("Partial ownership setup successful");
        } else {
          console.warn("Partial ownership setup failed but asset registration was successful");
          
          // Mark partial ownership step as error if it was expected
          if (transactionState.steps.some(step => step.id === 'partial')) {
            updateTransactionStep('partial', 'error', undefined, 'Failed to setup partial ownership');
          }
        }
      } else {
        console.log("Partial ownership not enabled - skipping setup");
      }

      // Complete the transaction flow
      setTransactionState(prev => ({ 
        ...prev, 
        isComplete: true,
        processingTransaction: false 
      }));
    } catch (error: any) {
      console.error('Error listing asset:', error);
      
      // Update transaction step with error
      updateTransactionStep('approve', 'error', undefined, error.message || 'Unknown error');
      setTransactionState(prev => ({ ...prev, processingTransaction: false }));
    }
  };
  
  // New function that uses direct form data instead of relying on formDataCache
  const setupPartialOwnershipDirectly = async (extractedAssetId: number, formData: AssetFormData) => {
    // Ensure we have valid partial ownership data
    if (!formData.isPartiallyOwnEnabled) {
      console.log("Direct check - Partial ownership not enabled");
      return false;
    }
    
    // Create default partial ownership if missing but enabled
    if (!formData.partialOwnership) {
      console.log("WARNING: Creating default partial ownership config in setup function");
      formData.partialOwnership = {
        enabled: true,
        totalShares: 1000,
        sharePrice: "50",
        minSharePurchase: 10,
        maxSharesPerOwner: 200,
        sellerShares: 100
      };
    }
    
    try {
      console.log("Setting up partial ownership for asset ID:", extractedAssetId);
      console.log("Using partial ownership config:", formData.partialOwnership);
      
      // Setup partial ownership configuration from direct form data
      const partialConfig = formData.partialOwnership;
      
      // Format parameters for partial ownership - ENSURE EXACT MATCH WITH CONTRACT
      const totalShares = BigInt(partialConfig.totalShares || 1000);
      const sharePrice = parseUnits(partialConfig.sharePrice || "50", 18);
      const minSharePurchase = BigInt(partialConfig.minSharePurchase || 10);
      const maxSharesPerOwner = BigInt(partialConfig.maxSharesPerOwner || 200);
      const sellerShares = BigInt(partialConfig.sellerShares || 100);
      
      console.log("Formatted partial ownership parameters:");
      console.log("- assetId:", extractedAssetId);
      console.log("- totalShares:", totalShares.toString());
      console.log("- sharePrice:", sharePrice.toString());
      console.log("- minSharePurchase:", minSharePurchase.toString());
      console.log("- maxSharesPerOwner:", maxSharesPerOwner.toString());
      console.log("- sellerShares:", sellerShares.toString());
      
      // Send and monitor partial ownership transaction
      const partialOwnershipReceipt = await sendAndMonitorTransaction(
        async () => {
          console.log("Preparing enablePartialOwnership transaction...");
          
          const txHash = await enablePartialOwnershipAsync({
            address: CONTRACTS.propytoRegistry as `0x${string}`,
            abi: PropytoRegistryABI,
            functionName: 'enablePartialOwnership',
            args: [
              BigInt(extractedAssetId),
              totalShares,
              sharePrice,
              minSharePurchase,
              maxSharesPerOwner,
              sellerShares
            ]
          });
          
          console.log("enablePartialOwnership transaction submitted with hash:", txHash);
          return txHash;
        },
        'partial',
        setPartialOwnershipMonitor
      );
      
      if (!partialOwnershipReceipt) {
        console.error("Partial ownership transaction failed or was not confirmed");
        return false;
      }
      
      console.log("Partial ownership transaction confirmed successfully");
      return true;
    } catch (error) {
      console.error("Failed to setup partial ownership:", error);
      return false;
    }
  };

  // Manual progression functions for user-triggered actions
  const proceedToRegistration = async () => {
    if (!formDataCache || !address || transactionState.processingTransaction) {
      return;
    }
    
    const assetData = {
      name: formDataCache.name,
      assetType: Number(formDataCache.assetType),
      assetAddress: '0x0000000000000000000000000000000000000000' as `0x${string}`,
      assetStatus: Number(formDataCache.assetStatus),
      assetFurnishing: Number(formDataCache.assetFurnishing),
      assetZone: Number(formDataCache.assetZone),
      assetPrice: parseUnits(formDataCache.assetPrice, 18),
      assetArea: BigInt(formDataCache.assetArea),
      assetAge: BigInt(formDataCache.assetAge),
      assetOtherDetails: JSON.stringify({
        subType: formDataCache.subType,
        bedrooms: formDataCache.bedrooms || "N/A",
        bathrooms: formDataCache.bathrooms || "N/A",
        location: formDataCache.location || "Not specified"
      }),
      isRentable: formDataCache.isRentable,
      isSellable: formDataCache.isSellable,
      isPartiallyOwnEnabled: formDataCache.isPartiallyOwnEnabled,
      seller: address as `0x${string}`,
      listingExpiry: BigInt(Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60) // 90 days
    };
      
    const metadataData = {
      assetDescription: formDataCache.assetDescription || "No description provided",
      assetFeatures: formDataCache.assetFeatures || "",
      assetAmenities: formDataCache.assetAmenities || "",
      assetLocation: formDataCache.assetLocation || "Location not specified"
    };
      
    const mediaData = {
      assetImage: formDataCache.assetImage || "",
      assetVideo: formDataCache.assetVideo || "",
      assetFloorPlan: formDataCache.assetFloorPlan || ""
    };
      
    const receipt = await sendAndMonitorTransaction(
      async () => {
        return await registerAssetAsync({
          address: CONTRACTS.propytoRegistry as `0x${string}`,
          abi: PropytoRegistryABI,
          functionName: 'registerAsset',
          args: [assetData, metadataData, mediaData]
        });
      },
      'register',
      setRegisterMonitor
    );
    
    if (receipt) {
      // Extract asset ID from receipt
      const extractedAssetId = extractAssetId(receipt);
      if (extractedAssetId) {
        setAssetId(extractedAssetId);
      }
    }
  };
  
  const proceedToPartialOwnership = async () => {
    if (!formDataCache?.isPartiallyOwnEnabled || !formDataCache.partialOwnership || !assetId || transactionState.processingTransaction) {
      return;
    }
    
    await setupPartialOwnershipDirectly(assetId, formDataCache);
  };
  
  // Enhanced retry function to handle step-specific logic
  const retryTransaction = async () => {
    if (!transactionState.error || !transactionState.canRetry || !formDataCache || transactionState.processingTransaction) {
      return;
    }
    
    const failedStep = transactionState.error.step;
    
    // Reset the error state
    setTransactionState(prev => ({
      ...prev,
      error: null,
      canRetry: false
    }));
    
    try {
      switch (failedStep) {
        case 'approve':
          if (marketplaceConfig && usdtAddress) {
            await sendAndMonitorTransaction(
              async () => {
                return await approveUSDTAsync({
                  address: usdtAddress as `0x${string}`,
                  abi: USDTABI,
                  functionName: 'approve',
                  args: [CONTRACTS.propytoRegistry, marketplaceConfig.listingFee]
                });
              },
              'approve',
              setApproveMonitor
            );
          }
          break;
          
        case 'register':
          await proceedToRegistration();
          break;
          
        case 'partial':
          await proceedToPartialOwnership();
          break;
      }
    } catch (error: any) {
      console.error(`Error retrying ${failedStep} transaction:`, error);
      // Update with error status again
      updateTransactionStep(
        failedStep, 
        'error', 
        undefined, 
        error.message || 'Transaction retry failed'
      );
    }
  };
  
  // Check if we should show the next step button
  const canProceedToNextStep = (): boolean => {
    if (transactionState.processingTransaction) return false;
    
    // If approve succeeded but register not started
    if (transactionState.steps[0]?.status === 'success' && 
        transactionState.steps[1]?.status === 'pending') {
      return true;
    }
    
    // If register succeeded but partial ownership not started (when applicable)
    if (transactionState.steps[1]?.status === 'success' && 
        transactionState.steps[2]?.status === 'pending') {
      return true;
    }
    
    return false;
  };
  
  // Function to proceed to next step based on current state
  const proceedToNextStep = async () => {
    if (transactionState.processingTransaction) return;
    
    if (transactionState.steps[0]?.status === 'success' && 
        transactionState.steps[1]?.status === 'pending') {
      await proceedToRegistration();
    } else if (transactionState.steps[1]?.status === 'success' && 
               transactionState.steps[2]?.status === 'pending') {
      await proceedToPartialOwnership();
    }
  };

  return {
    step,
    txHash,
    assetId,
    chainId,
    transactionState,
    listAsset: (data: AssetFormData) => {
      // Only start a new transaction if no transaction is in progress
      if (!transactionState.processingTransaction) {
        console.log("DEBUG - Setting formDataCache with data:", data);
        console.log("DEBUG - Partial ownership enabled:", data.isPartiallyOwnEnabled);
        
        setFormDataCache(data);
        
        // Verify data is set correctly (immediate check)
        setTimeout(() => {
          console.log("DEBUG - Verify formDataCache is set:", formDataCache);
          console.log("DEBUG - Verify partial ownership:", formDataCache?.isPartiallyOwnEnabled);
        }, 0);
        
        return listAsset(data);
      } else {
        console.log("Transaction already in progress, please wait");
        return Promise.resolve();
      }
    },
    // For debugging - expose formDataCache
    debug: {
      getFormDataCache: () => formDataCache
    },
    setupPartialOwnership: setupPartialOwnershipDirectly,
    closeTransactionModal,
    retryTransaction,
    proceedToNextStep,
    canProceedToNextStep,
    isApprovePending: approveMonitor.status === 'confirming',
    isApproveLoading: approveMonitor.status === 'confirming',
    isApproveSuccess: approveMonitor.status === 'confirmed',
    isRegisterPending: registerMonitor.status === 'confirming',
    isRegisterLoading: registerMonitor.status === 'confirming',
    isRegisterSuccess: registerMonitor.status === 'confirmed',
    isPartialOwnershipPending: partialOwnershipMonitor.status === 'confirming',
    isPartialOwnershipLoading: partialOwnershipMonitor.status === 'confirming',
    isPartialOwnershipSuccess: partialOwnershipMonitor.status === 'confirmed',
    marketplaceConfig
  };
} 