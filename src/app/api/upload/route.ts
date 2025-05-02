import { NextRequest, NextResponse } from 'next/server';
import { ObjectManager } from '@filebase/sdk';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime';
import { sp3_access_key, sp3_secret_key } from '@/config/ipfsConfig';

// Hardcoded SP3 credentials (instead of environment variables)
const SP3_ACCESS_KEY = sp3_access_key;
const SP3_SECRET_KEY = sp3_secret_key;
const BUCKET_NAME = 'propyto';

// Allowed file types and sizes
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'application/pdf',
];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Initialize Filebase ObjectManager with SP3 credentials
let objectManager: any;
try {
  objectManager = new ObjectManager(SP3_ACCESS_KEY, SP3_SECRET_KEY, {
    bucket: BUCKET_NAME,
    endpoint: 'https://s3.filebase.com',
  });
} catch (error) {
  console.error('Failed to initialize Filebase ObjectManager:', error);
}

/**
 * API route handler for file uploads
 * POST /api/upload
 */
export async function POST(req: NextRequest) {
  try {
    // Check if Filebase is properly initialized
    if (!objectManager) {
      console.error('Filebase ObjectManager not initialized');
      return NextResponse.json(
        { error: 'Storage service unavailable - SP3 credentials may be invalid' },
        { status: 503 }
      );
    }

    // Skip authentication for easier integration
    // You can add authentication back later if needed

    // Check content type - make it more flexible
    if (!req.headers.get('content-type')?.includes('multipart/form-data') && 
        !req.headers.get('content-type')?.includes('application/octet-stream')) {
      console.warn('Non-standard content-type:', req.headers.get('content-type'));
      // Continue anyway - try to parse as form data
    }

    // Parse the form data
    let file: File | null = null;
    let propertyId = '';
    let assetType = 'image';
    
    try {
      const formData = await req.formData();
      file = formData.get('file') as File;
      propertyId = formData.get('propertyId') as string || 'default';
      assetType = formData.get('assetType') as string || 'image';
    } catch (error) {
      console.error('Error parsing form data:', error);
      return NextResponse.json(
        { error: 'Invalid form data - must be multipart/form-data with a file field' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: 'Missing file in request' },
        { status: 400 }
      );
    }

    // Use defaults for missing fields
    if (!propertyId) propertyId = 'unknown-' + Date.now();
    if (!assetType) assetType = 'image';

    // Validate the file
    if (!validateFile(file)) {
      return NextResponse.json(
        { 
          error: 'Invalid file type or size',
          allowed_types: ALLOWED_FILE_TYPES,
          max_size: MAX_FILE_SIZE 
        },
        { status: 400 }
      );
    }

    // Process the file - get buffer and create filename
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = getFileExtension(file.name);
    const fileName = createFileName(propertyId, assetType, fileExtension);

    console.log(`Processing file upload: ${fileName} (${file.size} bytes)`);

    // Upload directly to Filebase (IPFS) without saving locally first
    const uploadResult = await uploadToFilebase(fileName, buffer, file.type);

    // Return the IPFS URL
    return NextResponse.json({
      success: true,
      ipfsUrl: `ipfs://${uploadResult.cid}`,
      ipfsGatewayUrl: `https://ipfs.filebase.io/ipfs/${uploadResult.cid}`,
      fileName: fileName,
      contentType: file.type,
      size: file.size,
      propertyId,
      assetType
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: (error as Error).message,
        message: 'Failed to upload to IPFS using SP3 credentials'
      },
      { status: 500 }
    );
  }
}

/**
 * Validate file type and size
 */
function validateFile(file: File): boolean {
  return (
    file.size > 0 &&
    file.size <= MAX_FILE_SIZE &&
    ALLOWED_FILE_TYPES.includes(file.type)
  );
}

/**
 * Get file extension from filename
 */
function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * Create a unique filename with proper categorization
 */
function createFileName(propertyId: string, assetType: string, extension: string): string {
  const timestamp = Date.now();
  const uuid = uuidv4().slice(0, 8);
  return `${propertyId}/${assetType}/${timestamp}-${uuid}.${extension}`;
}

/**
 * Upload file to Filebase (IPFS) using SP3 credentials
 */
async function uploadToFilebase(fileName: string, buffer: Buffer, contentType: string) {
  try {
    console.log('Uploading to IPFS via Filebase with SP3 credentials...');
    
    // Simplify the upload by removing metadata headers that might be causing issues
    const uploadedObject = await objectManager.upload(
      fileName,
      buffer,
      {
        // Use minimal metadata to avoid the headers error
        contentType: contentType || 'application/octet-stream'
      }
    );

    console.log('IPFS upload successful:', uploadedObject.cid);
    
    return {
      success: true,
      cid: uploadedObject.cid,
      etag: uploadedObject.etag,
      url: uploadedObject.url,
    };
  } catch (error) {
    console.error('Error uploading to Filebase/IPFS:', error);
    throw new Error(`Failed to upload to IPFS: ${(error as Error).message}`);
  }
}

/**
 * Handle GET requests (return helpful error)
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to upload files.' },
    { status: 405 }
  );
} 