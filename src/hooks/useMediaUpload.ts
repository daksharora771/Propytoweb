import { useState } from 'react';

// Hardcoded API key
const UPLOAD_API_KEY = 'your_upload_api_key_here';

export interface UploadOptions {
  propertyId: string;
  assetType: 'image' | 'video' | 'document' | string;
  onProgress?: (progress: number) => void;
  apiKey?: string;
}

export interface UploadResult {
  success: boolean;
  ipfsUrl?: string;
  ipfsGatewayUrl?: string;
  fileName?: string;
  contentType?: string;
  size?: number;
  error?: string;
}

/**
 * Hook for uploading media assets to IPFS via the API
 */
export function useMediaUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  /**
   * Upload a file to IPFS
   */
  const uploadMedia = async (file: File, options: UploadOptions): Promise<UploadResult> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);
      setUploadResult(null);

      // Validate inputs
      if (!file) {
        throw new Error('No file provided');
      }

      if (!options.propertyId) {
        throw new Error('Property ID is required');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('propertyId', options.propertyId);
      formData.append('assetType', options.assetType || 'image');

      // Simulate upload progress for UX
      const progressInterval = simulateProgress(options.onProgress);

      // Upload to API
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-api-key': options.apiKey || UPLOAD_API_KEY,
        },
        body: formData,
      });

      // Clear progress interval
      clearInterval(progressInterval);
      
      // Set progress to 100% when request completes
      setUploadProgress(100);
      if (options.onProgress) options.onProgress(100);

      // Parse response
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Set result
      setUploadResult(data);
      return data;
    } catch (error) {
      const errorMessage = (error as Error).message || 'Upload failed';
      setUploadError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Simulate progress updates for better UX
   */
  const simulateProgress = (onProgress?: (progress: number) => void) => {
    let progress = 0;
    const interval = setInterval(() => {
      // Increase progress in a way that approaches but never reaches 100%
      // until the request completes
      const increment = Math.random() * 5 * (1 - progress / 100);
      progress = Math.min(progress + increment, 95);
      setUploadProgress(progress);
      if (onProgress) onProgress(progress);
    }, 300);
    return interval;
  };

  /**
   * Reset the upload state
   */
  const resetUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
    setUploadResult(null);
  };

  return {
    uploadMedia,
    resetUpload,
    isUploading,
    uploadProgress,
    uploadError,
    uploadResult,
  };
} 