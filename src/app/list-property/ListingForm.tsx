"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingFormSchema } from "@/lib/schema";
import { 
  FormSection, 
  InputField, 
  TextareaField, 
  SelectField, 
  CheckboxField, 
  SubmitButton,
  TransactionStatus
} from "@/components/ui/FormComponents";
import { AssetFormData, AssetFurnishing, AssetStatus, AssetType, AssetZone, PartialOwnershipConfig, useProptyoListing } from "@/hooks/useProptyo";
import { ArrowRight, Upload, AlertCircle, DivideCircle, FileImage, FileVideo, File } from "lucide-react";
import toast from "react-hot-toast";
import TransactionModal from "@/components/ui/TransactionModal";
import { MediaUploader } from "@/components/MediaUploader";
import { UploadResult } from "@/hooks/useMediaUpload";

export default function ListingForm({
  onSuccess,
  onStepChange,
}: {
  onSuccess: (assetId: string) => void;
  onStepChange: (step: number) => void;
}) {
  const [step, setStep] = useState(1);
  const errorSectionRef = useRef<HTMLDivElement>(null);
  const [firstFieldWithError, setFirstFieldWithError] = useState<string | null>(null);
  const [showPartialOwnership, setShowPartialOwnership] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setValue, trigger } = useForm<AssetFormData>({
    resolver: zodResolver(listingFormSchema) as any,
    defaultValues: {
      // Basic information
      name: "Test Luxury Villa",
      assetType: AssetType.RESIDENTIAL,
      assetStatus: AssetStatus.FOR_SALE,
      assetFurnishing: AssetFurnishing.FULLY_FURNISHED,
      assetZone: AssetZone.RESIDENTIAL,
      
      // Numbers
      assetArea: 2500,
      assetAge: 2,
      assetPrice: "50000",
      subType: 3, // Villa
      
      // Text fields
      bedrooms: "4",
      bathrooms: "3",
      location: "Miami, Florida",
      assetDescription: "A beautiful luxury villa with stunning ocean views and premium amenities.",
      assetFeatures: "Swimming Pool, Garden, Garage, Home Office, Smart Home System",
      assetAmenities: "Gym, Security, Parking, 24/7 Concierge",
      assetLocation: "123 Ocean Drive, Miami Beach, FL 33139",
      
      // Media links
      assetImage: "ipfs://Qmdefault123456789",
      assetVideo: "ipfs://Qmvideo123456789",
      assetFloorPlan: "ipfs://Qmfloorplan123456789",
      
      // Flags
      isRentable: true,
      isSellable: true,
      isPartiallyOwnEnabled: true,
      
      // Partial ownership
      partialOwnership: {
        enabled: true,
        totalShares: 1000,
        sharePrice: "50",
        minSharePurchase: 10,
        maxSharesPerOwner: 200,
        sellerShares: 100
      }
    },
    mode: "onChange"
  });
  
  // Type conversion for select fields
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, name: keyof AssetFormData) => {
    const value = parseInt(e.target.value);
    setValue(name, value as any);
  };
  
  // Scroll to the first field with an error
  useEffect(() => {
    if (firstFieldWithError) {
      const errorElement = document.getElementById(firstFieldWithError);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
        setFirstFieldWithError(null);
      }
    }
  }, [firstFieldWithError]);
  
  const assetType = watch("assetType");
  const isPartiallyOwnEnabled = watch("isPartiallyOwnEnabled");
  
  // Effect to toggle partial ownership visibility
  useEffect(() => {
    setShowPartialOwnership(isPartiallyOwnEnabled);
    
    if (isPartiallyOwnEnabled) {
      setValue("partialOwnership.enabled", true);
      
      // Ensure the partialOwnership object is fully initialized
      const currentValues = watch();
      if (!currentValues.partialOwnership) {
        setValue("partialOwnership", {
          enabled: true,
          totalShares: 1000,
          sharePrice: "50",
          minSharePurchase: 10,
          maxSharesPerOwner: 200,
          sellerShares: 100
        });
      }
    } else {
      setValue("partialOwnership.enabled", false);
    }
    
    // Log the current state to debug
    console.log("Current form state:", watch());
  }, [isPartiallyOwnEnabled, setValue, watch]);
  
  // Property listing hook with transaction handling
  const { 
    listAsset,
    transactionState,
    closeTransactionModal,
    isApprovePending, 
    isApproveLoading, 
    isApproveSuccess,
    isRegisterPending,
    isRegisterLoading,
    isRegisterSuccess,
    chainId,
    assetId,
    retryTransaction,
    proceedToNextStep,
    canProceedToNextStep
  } = useProptyoListing();
  
  const isProcessing = isApprovePending || isApproveLoading || isRegisterPending || isRegisterLoading;
  
  // Options for form selects
  const assetTypeOptions = [
    { value: AssetType.RESIDENTIAL, label: "Residential" },
    { value: AssetType.COMMERCIAL, label: "Commercial" },
    { value: AssetType.LAND, label: "Land" },
    { value: AssetType.OTHER, label: "Other" }
  ];
  
  const assetStatusOptions = [
    { value: AssetStatus.FOR_SALE, label: "For Sale" },
    { value: AssetStatus.FOR_RENT, label: "For Rent" }
  ];
  
  const furnishingOptions = [
    { value: AssetFurnishing.UNFURNISHED, label: "Unfurnished" },
    { value: AssetFurnishing.PARTIALLY_FURNISHED, label: "Partially Furnished" },
    { value: AssetFurnishing.FULLY_FURNISHED, label: "Fully Furnished" }
  ];
  
  const zoneOptions = [
    { value: AssetZone.RESIDENTIAL, label: "Residential" },
    { value: AssetZone.COMMERCIAL, label: "Commercial" },
    { value: AssetZone.INDUSTRIAL, label: "Industrial" },
    { value: AssetZone.LAND, label: "Land" }
  ];
  
  const getSubTypeOptions = () => {
    switch (assetType) {
      case AssetType.RESIDENTIAL:
        return [
          { value: 1, label: "Apartment" },
          { value: 2, label: "Farmhouse" },
          { value: 3, label: "Villa" },
          { value: 4, label: "Bungalow" },
          { value: 5, label: "Other" }
        ];
      case AssetType.COMMERCIAL:
        return [
          { value: 1, label: "Shop" },
          { value: 2, label: "Office" },
          { value: 3, label: "Godown" },
          { value: 4, label: "Other" }
        ];
      case AssetType.LAND:
        return [
          { value: 1, label: "Plot" },
          { value: 2, label: "Farms" },
          { value: 3, label: "Other" }
        ];
      default:
        return [{ value: 1, label: "Other" }];
    }
  };
  
  // Validate current step and proceed if valid
  const validateStep = async () => {
    let fieldsToValidate: (keyof AssetFormData)[] = [];
    
    if (step === 1) {
      fieldsToValidate = [
        'name', 'assetType', 'subType', 'assetStatus', 
        'assetPrice', 'assetArea', 'assetAge', 'location', 'assetLocation'
      ];
    } else if (step === 2) {
      fieldsToValidate = [
        'assetDescription', 'assetFeatures', 'assetAmenities'
      ];
    }
    
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      goToNextStep();
    } else {
      // Show error toast
      toast.error("Please fix the validation errors");
      
      // Find the first field with an error
      for (const field of fieldsToValidate) {
        if (errors[field]) {
          setFirstFieldWithError(field);
          break;
        }
      }
    }
  };
  
  // Add new state for tracking IPFS uploads
  const [uploadedImageHash, setUploadedImageHash] = useState<string | null>(null);
  const [uploadedVideoHash, setUploadedVideoHash] = useState<string | null>(null);
  const [uploadedFloorPlanHash, setUploadedFloorPlanHash] = useState<string | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState<boolean>(false);
  const [tempPropertyId, setTempPropertyId] = useState<string>(`temp-${Date.now()}`);
  
  // Handle media upload completion
  const handleImageUploadComplete = (result: UploadResult) => {
    if (result.success && result.ipfsUrl) {
      setUploadedImageHash(result.ipfsUrl);
      setValue('assetImage', result.ipfsUrl);
      toast.success('Property image uploaded successfully');
    }
  };

  const handleVideoUploadComplete = (result: UploadResult) => {
    if (result.success && result.ipfsUrl) {
      setUploadedVideoHash(result.ipfsUrl);
      setValue('assetVideo', result.ipfsUrl);
      toast.success('Property video uploaded successfully');
    }
  };

  const handleFloorPlanUploadComplete = (result: UploadResult) => {
    if (result.success && result.ipfsUrl) {
      setUploadedFloorPlanHash(result.ipfsUrl);
      setValue('assetFloorPlan', result.ipfsUrl);
      toast.success('Floor plan uploaded successfully');
    }
  };

  const handleUploadError = (error: string) => {
    toast.error(`Upload failed: ${error}`);
    setUploadingMedia(false);
  };
  
  // Submit form
  const onSubmit = (formData: any) => {
    try {
      console.log("Submitting form data:", formData);
      
      // Add IPFS hashes to form data if they exist
      if (uploadedImageHash) {
        formData.assetImage = uploadedImageHash;
      }
      
      if (uploadedVideoHash) {
        formData.assetVideo = uploadedVideoHash;
      }
      
      if (uploadedFloorPlanHash) {
        formData.assetFloorPlan = uploadedFloorPlanHash;
      }
      
      // Log critical parts of form for debugging
      console.log("isPartiallyOwnEnabled:", formData.isPartiallyOwnEnabled);
      console.log("partialOwnership data:", formData.partialOwnership);
      console.log("Media IPFS hashes:", {
        image: formData.assetImage,
        video: formData.assetVideo,
        floorPlan: formData.assetFloorPlan
      });
      
      // Ensure partial ownership data exists if enabled
      if (formData.isPartiallyOwnEnabled && !formData.partialOwnership) {
        console.warn("WARNING: Partial ownership enabled but data missing, creating default");
        formData.partialOwnership = {
          enabled: true,
          totalShares: 1000,
          sharePrice: "50",
          minSharePurchase: 10,
          maxSharesPerOwner: 200,
          sellerShares: 100
        };
      }
      
      // Typecast to AssetFormData
      const data = formData as unknown as AssetFormData;
      listAsset(data);
      // Success will be handled by transaction modal
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit listing");
    }
  };
  
  // Next step
  const goToNextStep = () => {
    if (step < 2) {
      setStep(step + 1);
      onStepChange(step + 1);
      // Scroll to top of form when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Previous step
  const goToPrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      onStepChange(step - 1);
      // Scroll to top of form when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Update the FormSection for Property Media
  const renderMediaSection = () => (
    <FormSection 
      title="Property Media" 
      description="Upload images and videos of your property to showcase it to potential buyers."
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Property Image Uploader */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Property Image
            {errors.assetImage && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
          
          <div className="mb-2">
            <MediaUploader
              propertyId={tempPropertyId}
              assetType="image"
              onUploadComplete={handleImageUploadComplete}
              onUploadError={handleUploadError}
              className="mb-2"
            />
          </div>
          
          {uploadedImageHash && (
            <div className="mt-2 flex items-center text-sm text-green-400">
              <FileImage className="h-4 w-4 mr-2" />
              <span className="truncate">Image uploaded to IPFS: {uploadedImageHash}</span>
            </div>
          )}
          
          {errors.assetImage && (
            <p className="mt-1 text-sm text-red-500">{errors.assetImage.message}</p>
          )}
        </div>
        
        {/* Property Video Uploader */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Property Video (optional)
          </label>
          
          <div className="mb-2">
            <MediaUploader
              propertyId={tempPropertyId}
              assetType="video"
              onUploadComplete={handleVideoUploadComplete}
              onUploadError={handleUploadError}
              className="mb-2"
            />
          </div>
          
          {uploadedVideoHash && (
            <div className="mt-2 flex items-center text-sm text-green-400">
              <FileVideo className="h-4 w-4 mr-2" />
              <span className="truncate">Video uploaded to IPFS: {uploadedVideoHash}</span>
            </div>
          )}
          
          {errors.assetVideo && (
            <p className="mt-1 text-sm text-red-500">{errors.assetVideo.message}</p>
          )}
        </div>
        
        {/* Floor Plan Uploader */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Floor Plan (optional)
          </label>
          
          <div className="mb-2">
            <MediaUploader
              propertyId={tempPropertyId}
              assetType="document"
              onUploadComplete={handleFloorPlanUploadComplete}
              onUploadError={handleUploadError}
              className="mb-2"
            />
          </div>
          
          {uploadedFloorPlanHash && (
            <div className="mt-2 flex items-center text-sm text-green-400">
              <File className="h-4 w-4 mr-2" />
              <span className="truncate">Floor plan uploaded to IPFS: {uploadedFloorPlanHash}</span>
            </div>
          )}
          
          {errors.assetFloorPlan && (
            <p className="mt-1 text-sm text-red-500">{errors.assetFloorPlan.message}</p>
          )}
        </div>
      </div>
    </FormSection>
  );
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
      <div ref={errorSectionRef}></div>
      
      {/* Transaction Modal */}
      <TransactionModal
        isOpen={transactionState.isOpen}
        onClose={closeTransactionModal}
        title={transactionState.title}
        steps={transactionState.steps}
        chainId={chainId}
        currentStep={transactionState.currentStep}
        isComplete={transactionState.isComplete}
        errorMessage={transactionState.error?.message}
        canRetry={transactionState.canRetry}
        onRetry={retryTransaction}
        onNextStep={proceedToNextStep}
        canProceedToNextStep={canProceedToNextStep()}
        onComplete={() => {
          closeTransactionModal();
          if (assetId) {
            onSuccess(assetId.toString());
          }
        }}
      />
      
      {/* Error notification banner */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 bg-red-900/30 border border-red-500 rounded-md p-4 flex items-start">
          <AlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-300">Please fix the following errors:</h3>
            <ul className="mt-2 text-sm list-disc pl-5 text-red-200 space-y-1">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>
                  <button 
                    type="button"
                    onClick={() => setFirstFieldWithError(field)}
                    className="text-left hover:underline focus:outline-none"
                  >
                    {error?.message as string}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {step === 1 && (
        <div>
          <FormSection 
            title="Basic Property Information" 
            description="Provide essential details about your property to attract potential buyers or renters."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Property Name"
                name="name"
                placeholder="e.g. Luxury Beachfront Villa"
                error={errors.name?.message}
                register={register}
                required
              />
              
              <SelectField
                label="Property Type"
                name="assetType"
                options={assetTypeOptions}
                error={errors.assetType?.message}
                register={register}
                required
                onChange={(e) => handleSelectChange(e, 'assetType')}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Property Subtype"
                name="subType"
                options={getSubTypeOptions()}
                error={errors.subType?.message}
                register={register}
                required
                onChange={(e) => handleSelectChange(e, 'subType')}
              />
              
              <SelectField
                label="Listing Status"
                name="assetStatus"
                options={assetStatusOptions}
                error={errors.assetStatus?.message}
                register={register}
                required
                onChange={(e) => handleSelectChange(e, 'assetStatus')}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Price (USDT)"
                name="assetPrice"
                type="number"
                placeholder="10000"
                error={errors.assetPrice?.message}
                register={register}
                required
              />
              
              <InputField
                label="Area (sq ft)"
                name="assetArea"
                type="number"
                placeholder="1000"
                error={errors.assetArea?.message}
                register={register}
                required
              />
            </div>
            
            <SelectField
              label="Furnishing Status"
              name="assetFurnishing"
              options={furnishingOptions}
              error={errors.assetFurnishing?.message}
              register={register}
              onChange={(e) => handleSelectChange(e, 'assetFurnishing')}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Bedrooms"
                name="bedrooms"
                type="text"
                placeholder="3"
                error={errors.bedrooms?.message}
                register={register}
              />
              
              <InputField
                label="Bathrooms"
                name="bathrooms"
                type="text"
                placeholder="2"
                error={errors.bathrooms?.message}
                register={register}
              />
              
              <InputField
                label="Age (years)"
                name="assetAge"
                type="number"
                placeholder="0"
                error={errors.assetAge?.message}
                register={register}
              />
            </div>
          </FormSection>
          
          <FormSection 
            title="Property Location" 
            description="Enter the location details of your property."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Location (City, State)"
                name="location"
                placeholder="e.g. Miami, Florida"
                error={errors.location?.message}
                register={register}
                required
              />
              
              <SelectField
                label="Zone Type"
                name="assetZone"
                options={zoneOptions}
                error={errors.assetZone?.message}
                register={register}
                onChange={(e) => handleSelectChange(e, 'assetZone')}
              />
            </div>
            
            <TextareaField
              label="Detailed Address"
              name="assetLocation"
              placeholder="Enter the full property address"
              error={errors.assetLocation?.message}
              register={register}
              required
            />
          </FormSection>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={validateStep}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center text-white font-medium"
            >
              Next Step <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div>
          <FormSection 
            title="Property Description" 
            description="Provide detailed information about your property to help buyers make informed decisions."
          >
            <TextareaField
              label="Property Description"
              name="assetDescription"
              placeholder="Describe your property in detail"
              rows={6}
              error={errors.assetDescription?.message}
              register={register}
              required
            />
            
            <TextareaField
              label="Property Features"
              name="assetFeatures"
              placeholder="List key features, separated by commas (e.g. Pool, Garden, Garage)"
              error={errors.assetFeatures?.message}
              register={register}
            />
            
            <TextareaField
              label="Amenities"
              name="assetAmenities"
              placeholder="List amenities, separated by commas (e.g. Gym, Security, Parking)"
              error={errors.assetAmenities?.message}
              register={register}
            />
          </FormSection>
          
          {renderMediaSection()}
          
          <FormSection 
            title="Ownership Options" 
            description="Configure how your property can be owned and traded."
          >
            <div className="space-y-3">
              <CheckboxField
                label="This property is available for sale"
                name="isSellable"
                register={register}
              />
              
              <CheckboxField
                label="This property is available for rent"
                name="isRentable"
                register={register}
              />
              
              <CheckboxField
                label="Enable partial ownership (fractional shares)"
                name="isPartiallyOwnEnabled"
                register={register}
              />
            </div>
            
            {/* Partial Ownership Settings */}
            {showPartialOwnership && (
              <div className="mt-4 p-5 border border-blue-500/30 bg-blue-900/10 rounded-md">
                <div className="flex items-center gap-2 mb-4">
                  <DivideCircle className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-medium text-blue-300">Fractional Ownership Settings</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Total Shares"
                    name="partialOwnership.totalShares"
                    type="number"
                    placeholder="1000"
                    error={errors.partialOwnership?.totalShares?.message}
                    register={register}
                  />
                  
                  <InputField
                    label="Share Price (USDT)"
                    name="partialOwnership.sharePrice"
                    type="number"
                    placeholder={watch("assetPrice") ? (Number(watch("assetPrice")) / Number(watch("partialOwnership.totalShares") || 1000)).toString() : "10"}
                    error={errors.partialOwnership?.sharePrice?.message}
                    register={register}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <InputField
                    label="Minimum Shares Per Purchase"
                    name="partialOwnership.minSharePurchase"
                    type="number"
                    placeholder="1"
                    error={errors.partialOwnership?.minSharePurchase?.message}
                    register={register}
                  />
                  
                  <InputField
                    label="Maximum Shares Per Owner (0 = no limit)"
                    name="partialOwnership.maxSharesPerOwner"
                    type="number"
                    placeholder="0"
                    error={errors.partialOwnership?.maxSharesPerOwner?.message}
                    register={register}
                  />
                </div>
                
                <div className="mt-4">
                  <InputField
                    label="Shares Retained by Seller"
                    name="partialOwnership.sellerShares"
                    type="number"
                    placeholder="0"
                    error={errors.partialOwnership?.sellerShares?.message}
                    register={register}
                  />
                  
                  <p className="mt-2 text-sm text-gray-400">
                    Specifies how many shares you want to keep for yourself. These will not be available for purchase by others.
                  </p>
                </div>
              </div>
            )}
          </FormSection>
          
          {isProcessing && (
            <div className="mt-8 mb-4">
              <h3 className="text-lg font-medium mb-4">Transaction Status</h3>
              
              {(isApprovePending || isApproveLoading) && (
                <TransactionStatus
                  hash={null}
                  isLoading={isApprovePending || isApproveLoading}
                  isSuccess={isApproveSuccess}
                  label="Approving USDT for listing fee"
                />
              )}
              
              {(isRegisterPending || isRegisterLoading) && (
                <TransactionStatus
                  hash={null}
                  isLoading={isRegisterPending || isRegisterLoading}
                  isSuccess={isRegisterSuccess}
                  label="Registering property on blockchain"
                />
              )}
            </div>
          )}
          
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={goToPrevStep}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-md text-white font-medium"
            >
              Previous
            </button>
            
            <SubmitButton
              label="List Property"
              isLoading={isProcessing || isSubmitting}
              disabled={isProcessing || isSubmitting}
            />
          </div>
        </div>
      )}
    </form>
  );
} 