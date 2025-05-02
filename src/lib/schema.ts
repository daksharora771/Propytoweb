import { z } from 'zod';

export const listingFormSchema = z.object({
  // Basic information
  name: z.string().min(3, "Property name must be at least 3 characters"),
  assetType: z.union([z.number(), z.string().transform(val => parseInt(val))]),
  assetStatus: z.union([z.number(), z.string().transform(val => parseInt(val))]),
  assetFurnishing: z.union([z.number(), z.string().transform(val => parseInt(val))]),
  assetZone: z.union([z.number(), z.string().transform(val => parseInt(val))]),
  
  // Financial details
  assetPrice: z.string().min(1, "Price is required"),
  
  // Physical characteristics
  assetArea: z.union([
    z.number().min(1, "Area must be at least 1 sq ft"),
    z.string().transform(val => parseInt(val)).pipe(z.number().min(1, "Area must be at least 1 sq ft"))
  ]),
  assetAge: z.union([
    z.number().min(0, "Age cannot be negative"),
    z.string().transform(val => parseInt(val)).pipe(z.number().min(0, "Age cannot be negative"))
  ]),
  
  // Property details
  subType: z.union([z.number(), z.string().transform(val => parseInt(val))]),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  location: z.string().min(3, "Location is required"),
  
  // Asset flags
  isRentable: z.boolean(),
  isSellable: z.boolean(),
  isPartiallyOwnEnabled: z.boolean(),
  
  // Rich descriptions
  assetDescription: z.string().min(10, "Description must be at least 10 characters"),
  assetFeatures: z.string().optional(),
  assetAmenities: z.string().optional(),
  assetLocation: z.string().min(5, "Detailed location is required"),
  
  // Media links
  assetImage: z.string().optional(),
  assetVideo: z.string().optional(),
  assetFloorPlan: z.string().optional(),
}); 