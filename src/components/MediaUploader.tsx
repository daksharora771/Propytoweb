'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { useMediaUpload, UploadOptions, UploadResult } from '@/hooks/useMediaUpload';
import { Upload, Image, FileVideo, File, XCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MediaUploaderProps {
  propertyId: string;
  assetType: 'image' | 'video' | 'document';
  onUploadComplete?: (result: UploadResult) => void;
  onUploadError?: (error: string) => void;
  maxFileSizeMB?: number;
  allowedFileTypes?: string[];
  className?: string;
  buttonLabel?: string;
}

const defaultAllowedTypes = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/webm'],
  document: ['application/pdf']
};

export function MediaUploader({
  propertyId,
  assetType,
  onUploadComplete,
  onUploadError,
  maxFileSizeMB = 50,
  allowedFileTypes,
  className = '',
  buttonLabel
}: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const { 
    uploadMedia, 
    resetUpload, 
    isUploading, 
    uploadProgress, 
    uploadError, 
    uploadResult 
  } = useMediaUpload();

  // Determine allowed file types
  const acceptedTypes = allowedFileTypes || defaultAllowedTypes[assetType];
  const acceptString = acceptedTypes.join(',');

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    setValidationError(null);

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setValidationError(`Invalid file type. Please upload one of: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setValidationError(`File size exceeds ${maxFileSizeMB}MB limit`);
      return;
    }

    setSelectedFile(file);

    // Create preview URL for images and videos
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setValidationError('Please select a file first');
      return;
    }

    try {
      const options: UploadOptions = {
        propertyId,
        assetType
      };

      const result = await uploadMedia(selectedFile, options);

      if (result.success) {
        if (onUploadComplete) {
          onUploadComplete(result);
        }
      } else {
        if (onUploadError) {
          onUploadError(result.error || 'Upload failed');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (onUploadError) {
        onUploadError((error as Error).message || 'Upload failed');
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError(null);
    resetUpload();
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get appropriate icon
  const getIcon = () => {
    switch (assetType) {
      case 'image':
        return <Image className="w-6 h-6" />;
      case 'video':
        return <FileVideo className="w-6 h-6" />;
      case 'document':
        return <File className="w-6 h-6" />;
      default:
        return <Upload className="w-6 h-6" />;
    }
  };

  // Get appropriate label
  const getButtonLabel = () => {
    if (buttonLabel) return buttonLabel;
    
    switch (assetType) {
      case 'image':
        return 'Upload Image';
      case 'video':
        return 'Upload Video';
      case 'document':
        return 'Upload Document';
      default:
        return 'Upload File';
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* File Upload Area */}
      {!selectedFile && !uploadResult && (
        <div 
          className="w-full border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-50/5 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center">
            {getIcon()}
            <p className="mt-2 text-sm text-gray-300">{getButtonLabel()}</p>
            <p className="mt-1 text-xs text-gray-400">
              Drag and drop, or click to browse
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Max size: {maxFileSizeMB}MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptString}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* File Preview */}
      {selectedFile && !isUploading && !uploadResult && (
        <div className="w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {getIcon()}
              <span className="ml-2 text-sm text-gray-300 truncate max-w-xs">
                {selectedFile.name}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="text-red-500 hover:text-red-600"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {previewUrl && assetType === 'image' && (
            <div className="relative w-full aspect-video mb-3 bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {previewUrl && assetType === 'video' && (
            <div className="relative w-full aspect-video mb-3 bg-gray-800 rounded-lg overflow-hidden">
              <video
                src={previewUrl}
                controls
                className="w-full h-full"
              />
            </div>
          )}

          {assetType === 'document' && (
            <div className="flex items-center justify-center w-full aspect-[3/4] mb-3 bg-gray-800 rounded-lg overflow-hidden">
              <File className="w-16 h-16 text-gray-500" />
            </div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Upload to IPFS
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="w-full">
          <div className="flex items-center mb-2">
            <Upload className="w-5 h-5 text-blue-500 animate-pulse" />
            <span className="ml-2 text-sm text-gray-300">
              Uploading to IPFS...
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Please wait while your file is being uploaded to IPFS
          </p>
        </div>
      )}

      {/* Upload Results */}
      {uploadResult && (
        <div className="w-full">
          <div className="flex items-center mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="ml-2 text-sm text-green-300">
              File uploaded successfully!
            </span>
          </div>

          {uploadResult.ipfsGatewayUrl && assetType === 'image' && (
            <div className="relative w-full aspect-video mb-3 bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={uploadResult.ipfsGatewayUrl}
                alt="Uploaded"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="bg-gray-800/50 rounded-md p-3 mb-3">
            <div className="mb-2">
              <span className="text-xs text-gray-400 block">IPFS URL:</span>
              <span className="text-xs text-blue-300 break-all">{uploadResult.ipfsUrl}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block">Gateway URL:</span>
              <a 
                href={uploadResult.ipfsGatewayUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-300 break-all hover:underline"
              >
                {uploadResult.ipfsGatewayUrl}
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Upload Another File
          </button>
        </div>
      )}

      {/* Error Message */}
      {(validationError || uploadError) && (
        <div className="w-full mt-3 bg-red-900/20 border border-red-800 rounded-md p-3 flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-red-300">
            {validationError || uploadError}
          </p>
        </div>
      )}
    </div>
  );
} 